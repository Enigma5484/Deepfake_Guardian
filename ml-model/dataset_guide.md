# Dataset Structure Guide for YOLO Classification

To train the model to classify images as "AI" or "Real", you need to organize your dataset in a specific folder structure inside the `ml-model` folder.

1.  Create a folder named `dataset` inside `ml-model`.
2.  Inside `dataset`, create two folders: `train` and `val` (and optionally `test`).
3.  Inside each of those (`train`, `val`), create folders for your classes: `AI` and `Real`.
4.  Place your images in the corresponding folders.

The structure should look like this:

```
ml-model/
└── dataset/
    ├── train/
    │   ├── AI/
    │   │   ├── image1.jpg
    │   │   ├── image2.jpg
    │   │   └── ...
    │   └── Real/
    │       ├── image1.jpg
    │       ├── image2.jpg
    │       └── ...
    └── val/
        ├── AI/
        │   ├── image1.jpg
        │   └── ...
        └── Real/
            ├── image1.jpg
            └── ...
```

Once your data is organized, you can run the training script.
