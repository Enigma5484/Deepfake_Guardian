import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import sys
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'deepfake_detector.h5')
IMAGE_SIZE = (128, 128)

def predict_image(img_path):
    if not os.path.exists(MODEL_PATH):
        print(f"Error: Model file '{MODEL_PATH}' not found. Please train the model first.")
        return

    if not os.path.exists(img_path):
        print(f"Error: Image file '{img_path}' not found.")
        return

    if os.path.isdir(img_path):
        print(f"Error: '{img_path}' is a directory. Please provide a path to a specific image file.")
        print(f"Example: python ml_service/predict.py {os.path.join(img_path, 'image.jpg')}")
        return

    try:
        # Load Model
        model = tf.keras.models.load_model(MODEL_PATH)

        # Preprocess Image
        img = image.load_img(img_path, target_size=IMAGE_SIZE)
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) # Create batch axis
        img_array /= 255.0 # Normalize

        # Predict
        prediction = model.predict(img_array)
        confidence = prediction[0][0]

        # Class names (Assuming flow_from_directory alphabetical order: Fake=0, Real=1)
        # Note: Check class_indices from training to be sure. 
        # Usually: Fake (F) comes before Real (R) -> Fake=0, Real=1
        
        if confidence > 0.5:
            class_label = "Real"
            conf_percent = confidence * 100
        else:
            class_label = "AI-Generated (Fake)"
            conf_percent = (1 - confidence) * 100

        print(f"\n[Result] Class: {class_label}")
        print(f"[Confidence] {conf_percent:.2f}%")
        
        return class_label, conf_percent

    except PermissionError:
        print(f"\n[Error] Permission Denied for file: '{img_path}'")
        print("Tip: Try copying the image into the 'deepfake-guardian' folder and running the command again.")
        return
    except Exception as e:
        print(f"Error predicting image: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python predict.py <path_to_image>")
    else:
        predict_image(sys.argv[1])
