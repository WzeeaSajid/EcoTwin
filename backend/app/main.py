import io
import json
from pathlib import Path

import torch
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from PIL import Image
from torchvision import transforms

from app.config import (
    BACKBONE, BINARY_MODE, DEVICE, HIGH_RISK_THRESHOLD, IMAGE_SIZE,
    MODELS_DIR, PATCH_SIZE, PREDICTIONS_DIR, HEATMAP_DIR, NUM_CLASSES, STRIDE,
)
from app.model import build_model
from app.utils import (
    load_class_mapping, risk_bucket, risk_color, risk_score_from_probs,
)

app = FastAPI(title="EcoTwin API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

eval_transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
])

_model = None
_idx_to_class = None


def get_model():
    global _model, _idx_to_class
    if _model is not None:
        return _model, _idx_to_class

    device = torch.device(DEVICE if torch.cuda.is_available() else "cpu")
    ckpt_path = MODELS_DIR / f"best_{BACKBONE}.pt"
    mapping_path = MODELS_DIR / "class_mapping.json"

    if not ckpt_path.exists():
        raise HTTPException(
            status_code=503,
            detail=f"No trained model found at {ckpt_path}. Train the model first.",
        )
    if not mapping_path.exists():
        raise HTTPException(
            status_code=503,
            detail=f"No class mapping found at {mapping_path}. Train the model first.",
        )

    checkpoint = torch.load(ckpt_path, map_location=device)
    model = build_model(checkpoint["backbone"], NUM_CLASSES, pretrained=False)
    model.load_state_dict(checkpoint["model_state"])
    model.to(device).eval()

    _, idx_to_class = load_class_mapping(mapping_path)
    _model = model
    _idx_to_class = idx_to_class
    return model, idx_to_class


@app.get("/health")
def health():
    model_path = MODELS_DIR / f"best_{BACKBONE}.pt"
    model_loaded = _model is not None
    model_exists = model_path.exists()
    return {
        "status": "ok",
        "model_loaded": model_loaded,
        "model_exists": model_exists,
        "device": DEVICE if torch.cuda.is_available() else "cpu",
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file")

    model, idx_to_class = get_model()
    device = next(model.parameters()).device
    tensor = eval_transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        logits = model(tensor)
        probs = torch.softmax(logits, dim=1).squeeze(0).cpu().tolist()

    score = risk_score_from_probs(probs, idx_to_class)
    bucket = risk_bucket(score)

    class_probs = {
        idx_to_class[i]: round(float(p), 4) for i, p in enumerate(probs)
    }

    return {
        "risk_score": round(float(score), 4),
        "risk_level": bucket,
        "class_probabilities": class_probs,
    }


@app.post("/heatmap")
async def heatmap(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file")

    model, idx_to_class = get_model()
    device = next(model.parameters()).device

    w, h = image.size
    grid = []

    with torch.no_grad():
        for top in range(0, max(1, h - PATCH_SIZE + 1), STRIDE):
            row = []
            for left in range(0, max(1, w - PATCH_SIZE + 1), STRIDE):
                patch = image.crop((left, top, left + PATCH_SIZE, top + PATCH_SIZE))
                tensor = eval_transform(patch).unsqueeze(0).to(device)
                logits = model(tensor)
                probs = torch.softmax(logits, dim=1).squeeze(0).cpu().tolist()
                score = risk_score_from_probs(probs, idx_to_class)
                row.append({
                    "x": left,
                    "y": top,
                    "risk": round(float(score), 4),
                    "bucket": risk_bucket(score),
                })
            grid.append(row)

    flat = [cell for row in grid for cell in row]
    avg_risk = sum(c["risk"] for c in flat) / len(flat) if flat else 0
    high_count = sum(1 for c in flat if c["bucket"] == "HIGH")
    total = len(flat)

    top_n = sorted(flat, key=lambda c: c["risk"], reverse=True)[:5]

    HEATMAP_DIR.mkdir(parents=True, exist_ok=True)
    PREDICTIONS_DIR.mkdir(parents=True, exist_ok=True)

    from PIL import ImageDraw
    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for cell in flat:
        color = risk_color(cell["risk"]) + (110,)
        draw.rectangle(
            [cell["x"], cell["y"], cell["x"] + PATCH_SIZE, cell["y"] + PATCH_SIZE],
            fill=color,
        )
    result = Image.alpha_composite(image.convert("RGBA"), overlay)
    heatmap_path = HEATMAP_DIR / "latest_heatmap.png"
    result.convert("RGB").save(heatmap_path)

    grid_path = PREDICTIONS_DIR / "latest_grid.json"
    with open(grid_path, "w") as f:
        json.dump(grid, f, indent=2)

    return {
        "image_size": {"width": w, "height": h},
        "grid_dimensions": {"rows": len(grid), "cols": len(grid[0]) if grid else 0},
        "summary": {
            "average_risk": round(float(avg_risk), 4),
            "high_risk_patches": high_count,
            "total_patches": total,
            "high_risk_percentage": round(high_count / total * 100, 2) if total else 0,
        },
        "top_risk_zones": top_n,
        "heatmap_url": "/heatmap/image",
        "grid_url": "/grid",
    }


@app.get("/heatmap/image")
def get_heatmap_image():
    heatmap_path = HEATMAP_DIR / "latest_heatmap.png"
    if not heatmap_path.exists():
        raise HTTPException(status_code=404, detail="No heatmap generated yet. POST /heatmap first.")
    return FileResponse(heatmap_path, media_type="image/png")


@app.get("/grid")
def get_grid():
    grid_path = PREDICTIONS_DIR / "latest_grid.json"
    if not grid_path.exists():
        raise HTTPException(status_code=404, detail="No grid data yet. POST /heatmap first.")
    with open(grid_path) as f:
        grid = json.load(f)
    return JSONResponse(content=grid)


@app.get("/zones")
def get_zones(n: int = 5):
    grid_path = PREDICTIONS_DIR / "latest_grid.json"
    if not grid_path.exists():
        raise HTTPException(status_code=404, detail="No grid data yet. POST /heatmap first.")
    with open(grid_path) as f:
        grid = json.load(f)
    flat = [cell for row in grid for cell in row]
    flat.sort(key=lambda c: c["risk"], reverse=True)
    return flat[:n]


@app.get("/campus-stats")
def campus_stats():
    grid_path = PREDICTIONS_DIR / "latest_grid.json"
    if not grid_path.exists():
        return {
            "available": False,
            "message": "No analysis data yet. Upload a satellite image via POST /heatmap.",
        }
    with open(grid_path) as f:
        grid = json.load(f)
    flat = [cell for row in grid for cell in row]
    avg_risk = sum(c["risk"] for c in flat) / len(flat) if flat else 0
    high_count = sum(1 for c in flat if c["bucket"] == "HIGH")
    medium_count = sum(1 for c in flat if c["bucket"] == "MEDIUM") if not BINARY_MODE else 0
    low_count = len(flat) - high_count - medium_count

    return {
        "available": True,
        "eco_resilience_score": round(max(0, min(100, (1 - avg_risk) * 100)), 1),
        "waste_pressure": round(avg_risk * 100, 1),
        "high_risk_zones": high_count,
        "medium_risk_zones": medium_count,
        "low_risk_zones": low_count,
        "total_patches": len(flat),
    }
