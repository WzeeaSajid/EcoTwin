"""Split labeled images into train/val sets."""
import random
import shutil
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from scripts import train_config as cfg

random.seed(cfg.SEED)
IMG_EXTENSIONS = {".jpg", ".jpeg", ".png"}


def collect_by_class(source_dir: Path):
    buckets = {}
    for class_dir in source_dir.iterdir():
        if not class_dir.is_dir():
            continue
        images = [p for p in class_dir.iterdir() if p.suffix.lower() in IMG_EXTENSIONS]
        out_class = cfg.CLASS_MERGE_MAP.get(class_dir.name, class_dir.name) if cfg.BINARY_MODE else class_dir.name
        buckets.setdefault(out_class, []).extend(images)
    return buckets


def main():
    source_dir = Path(sys.argv[sys.argv.index("--source") + 1]) if "--source" in sys.argv else cfg.DATA_RAW

    if cfg.TRAIN_DIR.exists():
        shutil.rmtree(cfg.TRAIN_DIR)
    if cfg.VAL_DIR.exists():
        shutil.rmtree(cfg.VAL_DIR)

    buckets = collect_by_class(source_dir)
    print(f"Source: {source_dir} | Classes: {list(buckets.keys())}\n")

    smallest = min(len(imgs) for imgs in buckets.values())
    do_val = smallest >= cfg.MIN_CLASS_SIZE_FOR_VAL

    if not do_val:
        print(f"Validation SKIPPED (smallest class: {smallest} images)\n")

    for cls, images in buckets.items():
        random.shuffle(images)
        n_val = max(1, int(len(images) * cfg.VAL_SPLIT)) if do_val else 0
        val_images = images[:n_val]
        train_images = images[n_val:]

        train_out = cfg.TRAIN_DIR / cls
        train_out.mkdir(parents=True, exist_ok=True)
        for p in train_images:
            shutil.copy2(p, train_out / p.name)

        if val_images:
            val_out = cfg.VAL_DIR / cls
            val_out.mkdir(parents=True, exist_ok=True)
            for p in val_images:
                shutil.copy2(p, val_out / p.name)

        print(f"  {cls:<20} {len(train_images):>4} train / {len(val_images):>4} val")

    print(f"\nDone. Output: {cfg.DATA_PROCESSED}")


if __name__ == "__main__":
    main()
