import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, Input
from tensorflow.keras.optimizers import Adam
import os
import matplotlib.pyplot as plt

# Define constants
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
IMAGE_SIZE = (128, 128)
BATCH_SIZE = 32
EPOCHS = 80 # Increased from 10
LEARNING_RATE = 0.0009 # Adjustable learning rate
DATASET_DIR = os.path.join(BASE_DIR, 'dataset')
MODEL_PATH = os.path.join(BASE_DIR, 'deepfake_detector.h5')

def train_model():
    print(f"Checking dataset directory: {os.path.abspath(DATASET_DIR)}")
    
    if not os.path.exists(DATASET_DIR):
        print(f"Error: Dataset directory '{DATASET_DIR}' not found.")
        print("Please create 'dataset/real' and 'dataset/fake' folders and add images.")
        return

    # Data Augmentation and Preprocessing
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        validation_split=0.2 # Use 20% for validation
    )

    print("Loading training data...")
    try:
        train_generator = train_datagen.flow_from_directory(
            DATASET_DIR,
            target_size=IMAGE_SIZE,
            batch_size=BATCH_SIZE,
            class_mode='binary',
            subset='training'
        )

        validation_generator = train_datagen.flow_from_directory(
            DATASET_DIR,
            target_size=IMAGE_SIZE,
            batch_size=BATCH_SIZE,
            class_mode='binary',
            subset='validation'
        )
    except Exception as e:
        print(f"Error loading data: {e}")
        return

    if train_generator.samples == 0:
        print("No images found. Please populate 'dataset/real' and 'dataset/fake'.")
        return

    # Build CNN Model
    model = Sequential([
        Input(shape=(IMAGE_SIZE[0], IMAGE_SIZE[1], 3)),
        Conv2D(32, (3, 3), activation='relu'),
        MaxPooling2D(2, 2),
        
        Conv2D(64, (3, 3), activation='relu'),
        MaxPooling2D(2, 2),
        
        Conv2D(128, (3, 3), activation='relu'),
        MaxPooling2D(2, 2),
        
        Flatten(),
        Dense(128, activation='relu'),
        Dropout(0.5),
        Dense(1, activation='sigmoid') # Binary classification: Real vs Fake
    ])

    model.compile(optimizer=Adam(learning_rate=LEARNING_RATE),
                  loss='binary_crossentropy',
                  metrics=['accuracy'])

    model.summary()

    # Train
    print("Starting training...")
    history = model.fit(
        train_generator,
        steps_per_epoch=train_generator.samples // BATCH_SIZE,
        validation_data=validation_generator,
        validation_steps=validation_generator.samples // BATCH_SIZE,
        epochs=EPOCHS
    )

    # Save Model
    model.save(MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")

    # Plot Accuracy
    plt.plot(history.history['accuracy'], label='accuracy')
    plt.plot(history.history['val_accuracy'], label = 'val_accuracy')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.ylim([0, 1])
    plt.legend(loc='lower right')
    plt.savefig('training_accuracy.png')
    print("Training accuracy plot saved to training_accuracy.png")

if __name__ == "__main__":
    train_model()
