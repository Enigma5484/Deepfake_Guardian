from ultralytics import YOLO
import os

def train_model():
    # Load a model
    model = YOLO("yolov8n-cls.pt")  # load a pretrained model (recommended for training)

    # Train the model
    # data argument should point to a directory containing 'train' and 'test' folders
    # each containing subfolders for each class (e.g., 'Real', 'AI')
    results = model.train(data="./dataset", epochs=20, imgsz=224, project="runs", name="deepfake_classifier")

    # Validate the model
    metrics = model.val()
    print(f"Validation metrics: {metrics}")

    # Export the model
    path = model.export(format="onnx")
    print(f"Model exported to {path}")

if __name__ == '__main__':
    train_model()
