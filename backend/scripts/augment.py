"""Augment tiny classes so every class has comparable image count."""
import math
import sys
from pathlib import Path

from PIL import Image
from torchvision import transforms

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from scripts import train_config as cfg

IMG_EXTENSIONS = {".jpg", ".jpeg", ".png"}

augment_pipeline = transforms.Compose([
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomVerticalFlip(p=0.5),
    transforms.RandomRotation(45),
    transforms.RandomResizedCrop(cfg.IMAGE_SIZE, scale=(0.7, 1.0)),
    transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.15),
])


def augment_class(class_name: str, target_total: int):
    src_dir = cfg.DATA_RAW / class_name
    out_dir = cfg.DATA_AUGMENTED / class_name
    if out_dir.exists():
        for p in out_dir.iterdir():
            p.unlink()
    out_dir.mkdir(parents=True, exist_ok=True)

    images = [p for p in src_dir.iterdir() if p.suffix.lower() in IMG_EXTENSIONS]
    if not images:
        print(f"  {class_name}: no source images, skipping")
        return

    n_per_image = max(0, math.ceil(target_total / len(images)) - 1)
    count = 0
    for src_path in images:
        img = Image.open(src_path).convert("RGB")
        img.save(out_dir / f"orig_{src_path.stem}.jpg")
        count += 1
        for i in range(n_per_image):
            aug = augment_pipeline(img)
            aug.save(out_dir / f"aug_{src_path.stem}_{i:03d}.jpg")
            count += 1

    print(f"  {class_name}: {len(images)} source -> {count} total")


def main():
    class_names = [d.name for d in cfg.DATA_RAW.iterdir() if d.is_dir()]
    print(f"Augmenting {len(class_names)} classes, target ~{cfg.AUGMENTATION_TARGET_PER_CLASS} each:\n")
    for name in class_names:
        augment_class(name, cfg.AUGMENTATION_TARGET_PER_CLASS)
    print(f"\nDone. Next: python -m scripts.split --source data/augmented")


if __name__ == "__main__":
    main()
