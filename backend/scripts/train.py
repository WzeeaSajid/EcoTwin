"""Train the pollution-risk CNN via transfer learning."""
import sys
import time
from pathlib import Path

import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from scripts import train_config as cfg
from app.model import build_model

IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

train_transform = transforms.Compose([
    transforms.Resize((cfg.IMAGE_SIZE, cfg.IMAGE_SIZE)),
    transforms.RandomHorizontalFlip(),
    transforms.ToTensor(),
    transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
])

eval_transform = transforms.Compose([
    transforms.Resize((cfg.IMAGE_SIZE, cfg.IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
])


def save_class_mapping(class_to_idx, out_path):
    idx_to_class = {v: k for k, v in class_to_idx.items()}
    import json
    with open(out_path, "w") as f:
        json.dump({"class_to_idx": class_to_idx, "idx_to_class": idx_to_class}, f, indent=2)


def run_epoch(model, loader, criterion, optimizer, device, train=True):
    model.train() if train else model.eval()
    total_loss, correct, total = 0.0, 0, 0

    with torch.set_grad_enabled(train):
        for images, labels in loader:
            images, labels = images.to(device), labels.to(device)
            if train:
                optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            if train:
                loss.backward()
                optimizer.step()
            total_loss += loss.item() * images.size(0)
            preds = outputs.argmax(dim=1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)

    return total_loss / total, correct / total


def main():
    device = torch.device(cfg.DEVICE if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    train_ds = datasets.ImageFolder(cfg.TRAIN_DIR, transform=train_transform)
    train_loader = DataLoader(train_ds, batch_size=cfg.BATCH_SIZE, shuffle=True, num_workers=0)

    val_loader = None
    val_dir = cfg.VAL_DIR
    if val_dir.exists() and any(d.is_dir() and any(d.iterdir()) for d in val_dir.iterdir()):
        val_ds = datasets.ImageFolder(val_dir, transform=eval_transform)
        val_loader = DataLoader(val_ds, batch_size=cfg.BATCH_SIZE, shuffle=False, num_workers=0)

    class_to_idx = train_ds.class_to_idx
    print(f"Classes: {class_to_idx}")

    cfg.MODELS_DIR.mkdir(parents=True, exist_ok=True)
    save_class_mapping(class_to_idx, cfg.MODELS_DIR / "class_mapping.json")

    model = build_model(cfg.BACKBONE, cfg.NUM_CLASSES, pretrained=True).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=cfg.LEARNING_RATE, weight_decay=cfg.WEIGHT_DECAY)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=cfg.NUM_EPOCHS)

    best_metric = -1.0
    best_path = cfg.MODELS_DIR / f"best_{cfg.BACKBONE}.pt"

    for epoch in range(1, cfg.NUM_EPOCHS + 1):
        t0 = time.time()
        train_loss, train_acc = run_epoch(model, train_loader, criterion, optimizer, device, train=True)
        scheduler.step()

        if val_loader:
            val_loss, val_acc = run_epoch(model, val_loader, criterion, optimizer, device, train=False)
            print(f"Epoch {epoch:02d}/{cfg.NUM_EPOCHS} | train_loss {train_loss:.4f} acc {train_acc:.3f} | val_loss {val_loss:.4f} acc {val_acc:.3f} | {time.time()-t0:.1f}s")
            metric = val_acc
        else:
            print(f"Epoch {epoch:02d}/{cfg.NUM_EPOCHS} | train_loss {train_loss:.4f} acc {train_acc:.3f} | {time.time()-t0:.1f}s")
            metric = train_acc

        if metric >= best_metric:
            best_metric = metric
            torch.save({
                "model_state": model.state_dict(),
                "backbone": cfg.BACKBONE,
                "class_to_idx": class_to_idx,
                "train_acc": train_acc,
            }, best_path)

    print(f"\nTraining complete. Best metric: {best_metric:.3f}")
    print(f"Checkpoint saved to {best_path}")


if __name__ == "__main__":
    main()
