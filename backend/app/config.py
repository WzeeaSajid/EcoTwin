from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
MODELS_DIR = PROJECT_ROOT / "models"
DATA_DIR = PROJECT_ROOT / "data"
OUTPUTS_DIR = PROJECT_ROOT / "outputs"
HEATMAP_DIR = OUTPUTS_DIR / "heatmaps"
PREDICTIONS_DIR = OUTPUTS_DIR / "predictions"

BINARY_MODE = True
BINARY_CLASSES = ["High-Pollution", "Not-High-Risk"]
RAW_CLASSES = ["High-Pollution", "Medium-Pollution", "Low-Pollution"]
NUM_CLASSES = len(BINARY_CLASSES) if BINARY_MODE else len(RAW_CLASSES)

IMAGE_SIZE = 224
PATCH_SIZE = 224
STRIDE = 112
HIGH_RISK_THRESHOLD = 0.7
BACKBONE = "resnet18"
DEVICE = "cuda"
