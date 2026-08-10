"""Training config — paths relative to backend/."""
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent

DATA_RAW = PROJECT_ROOT / "data" / "raw"
DATA_AUGMENTED = PROJECT_ROOT / "data" / "augmented"
DATA_PROCESSED = PROJECT_ROOT / "data" / "processed"
TRAIN_DIR = DATA_PROCESSED / "train"
VAL_DIR = DATA_PROCESSED / "val"

MODELS_DIR = PROJECT_ROOT / "models"

RAW_CLASSES = ["High-Pollution", "Medium-Pollution", "Low-Pollution"]
BINARY_MODE = True
CLASS_MERGE_MAP = {
    "Low-Pollution": "Not-High-Risk",
    "Medium-Pollution": "Not-High-Risk",
    "High-Pollution": "High-Pollution",
}
BINARY_CLASSES = ["High-Pollution", "Not-High-Risk"]
NUM_CLASSES = len(BINARY_CLASSES) if BINARY_MODE else len(RAW_CLASSES)

AUGMENTATION_TARGET_PER_CLASS = 60
VAL_SPLIT = 0.2
MIN_CLASS_SIZE_FOR_VAL = 5
SEED = 42

IMAGE_SIZE = 224
BATCH_SIZE = 8
NUM_EPOCHS = 60
LEARNING_RATE = 3e-4
WEIGHT_DECAY = 0.0
DROPOUT = 0.0
BACKBONE = "resnet18"
UNFREEZE_ALL = True
DEVICE = "cuda"
