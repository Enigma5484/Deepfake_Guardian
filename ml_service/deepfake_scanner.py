import requests
from bs4 import BeautifulSoup
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import os
import json
import time
import random

# --- Configuration ---
# Path to the trained model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEBSITES_FILE = os.path.join(BASE_DIR, '..', 'websites.txt')
PAUSE_FLAG = os.path.join(BASE_DIR, 'scan_paused.flag')
TEMP_DIR = os.path.join(BASE_DIR, 'temp_images')

# Ensure temp directory exists
if not os.path.exists(TEMP_DIR):
    os.makedirs(TEMP_DIR)

# Load websites from file
TARGET_URLS = []
if os.path.exists(WEBSITES_FILE):
    try:
        with open(WEBSITES_FILE, 'r') as f:
            all_urls = [line.strip() for line in f if line.strip()]
        
        # Limit to 300 random websites
        if len(all_urls) > 300:
            TARGET_URLS = random.sample(all_urls, 300)
            print(f"Loaded {len(all_urls)} websites, randomly selected 300 for this scan.")
        else:
            TARGET_URLS = all_urls
            print(f"Loaded {len(TARGET_URLS)} websites from {WEBSITES_FILE}")

    except Exception as e:
        print(f"Error reading websites.txt: {e}")
else:
    print(f"Warning: websites.txt not found at {WEBSITES_FILE}")
    TARGET_URLS = ["https://thispersondoesnotexist.com/"] # Fallback

# Path to the trained model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'deepfake_detector.h5')
IMAGE_SIZE = (128, 128)
OUTPUT_FILE = os.path.join(BASE_DIR, 'scan_results.json')

def load_model():
    if not os.path.exists(MODEL_PATH):
        print(f"Error: Model file '{MODEL_PATH}' not found.")
        return None
    try:
        print(f"Loading model from {MODEL_PATH}...")
        model = tf.keras.models.load_model(MODEL_PATH)
        return model
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

def download_image(url):
    try:
        response = requests.get(url, stream=True, timeout=5)
        if response.status_code == 200:
            # Create a localized temporary file in temp directory
            if not os.path.exists(TEMP_DIR):
                os.makedirs(TEMP_DIR)
            temp_filename = os.path.join(TEMP_DIR, f"temp_{int(time.time())}_{np.random.randint(1000)}.jpg")
            with open(temp_filename, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            return temp_filename
        else:
            return None
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return None

def predict_image(model, img_path):
    try:
        img = image.load_img(img_path, target_size=IMAGE_SIZE)
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array /= 255.0

        prediction = model.predict(img_array, verbose=0)
        confidence = prediction[0][0]

        if confidence > 0.5:
            label = "Real"
            conf_percent = confidence * 100
        else:
            label = "Fake"
            conf_percent = (1 - confidence) * 100
        
        return label, conf_percent
    except Exception as e:
        print(f"Error predicting image: {e}")
        return None, 0

def scan_websites():
    # Clear pause flag on start
    if os.path.exists(PAUSE_FLAG):
        try:
            os.remove(PAUSE_FLAG)
        except:
            pass

    # Clean up any existing temp images from previous runs
    if os.path.exists(TEMP_DIR):
        try:
            for f in os.listdir(TEMP_DIR):
                os.remove(os.path.join(TEMP_DIR, f))
        except Exception as e:
            print(f"Warning: Could not clean temp directory: {e}")

    model = load_model()
    if not model:
        return

    results = []
    
    # Save target URLs immediately so frontend knows what to track
    try:
        with open(OUTPUT_FILE, 'w') as f:
             json.dump({
                "summary": {
                    "total_scanned": 0,
                    "deepfakes_found": 0,
                },
                "all_results": [],
                "target_urls": TARGET_URLS
            }, f, indent=4)
    except Exception as e:
        print(f"Error saving initial state: {e}")
    
    print(f"Starting scan of {len(TARGET_URLS)} websites...")

    for url in TARGET_URLS:
        # Check for pause
        while os.path.exists(PAUSE_FLAG):
            print("Scan paused... waiting for resume.")
            time.sleep(2)

        print(f"\nScanning: {url}")
        try:
            response = requests.get(url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find all image tags
            img_tags = soup.find_all('img')
            print(f"Found {len(img_tags)} images.")

            for img in img_tags:
                # Check for pause inside image loop as well for faster response
                while os.path.exists(PAUSE_FLAG):
                    time.sleep(1)

                src = img.get('src')
                if not src:
                    continue
                
                # Handle relative URLs
                if not src.startswith('http'):
                    src = requests.compat.urljoin(url, src)

                # Filter for common image types
                if not any(src.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                   # Try to be more inclusive if extension is missing but it's an image source
                   pass 

                print(f"  - Processing: {src}")
                
                temp_img_path = download_image(src)
                
                if temp_img_path:
                    label, conf = predict_image(model, temp_img_path)
                    
                    if label:
                        print(f"    > Prediction: {label} ({conf:.2f}%)")
                        
                        scan_result = {
                            "source_url": url,
                            "image_url": src,
                            "prediction": label,
                            "confidence": float(f"{conf:.2f}"),
                            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
                        }
                        
                        # Add to list if it's FAKE or just to keep track of everything?
                        # Let's keep everything for the report, but maybe highlight fakes.
                        results.append(scan_result)
                    
                    # Cleanup
                    if os.path.exists(temp_img_path):
                        os.remove(temp_img_path)
                else:
                    print("    > Failed to download/process.")
                    
        except Exception as e:
            print(f"Error scanning {url}: {e}")
            
        # Update progress file after each website
        current_progress = {
             "summary": {
                "total_scanned": len(results),
                "deepfakes_found": len([r for r in results if r['prediction'] == 'Fake']),
                "latest_url": url
            },
            "last_updated": time.time(),
            "latest_results": results[-5:] if results else [] # Keep file size manageable for polling, or full list?
        }
        
        # Save full results periodically or just append?
        # For this UI, let's just save the full list but optimize if needed.
        # Actually, let's save the full list so the UI can show "green/red" for each site.
        
        # Simpler approach: Map results by URL so frontend can easily look it up
        # We need to know which websites are done.
        
        with open(OUTPUT_FILE, 'w') as f:
             json.dump({
                "summary": {
                    "total_scanned": len(results),
                    "deepfakes_found": len([r for r in results if r['prediction'] == 'Fake']),
                },
                "all_results": results,
                "target_urls": TARGET_URLS
            }, f, indent=4)

    # Separate lists for the model as requested
    fake_images = [r for r in results if r['prediction'] == 'Fake']
    real_images = [r for r in results if r['prediction'] == 'Real']

    print(f"\n--- Scan Complete ---")
    print(f"Total Images Scanned: {len(results)}")
    print(f"Deepfakes Detected: {len(fake_images)}")
    
    # Save results
    with open(OUTPUT_FILE, 'w') as f:
        json.dump({
            "summary": {
                "total_scanned": len(results),
                "deepfakes_found": len(fake_images),
                "real_found": len(real_images)
            },
            "deepfakes": fake_images,
            "all_results": results,
            "target_urls": TARGET_URLS
        }, f, indent=4)
        
    print(f"Results saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    scan_websites()
