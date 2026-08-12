# EcoTwin

EcoTwin is a digital twin for environmental monitoring and waste/pollution risk mapping for the GIKI campus. It combines a TypeScript Next.js frontend for visualization with a Python FastAPI backend that serves a CNN-based image inference pipeline.

Language composition: TypeScript (~82.6%), Python (~15.9%), CSS, JavaScript.

## Repository layout

- frontend/ — Next.js (TypeScript) application (UI, charts, dashboard)
- backend/
  - app/
    - main.py — FastAPI application and API endpoints (predict, heatmap, grid, etc.)
    - model.py — model builder (ResNet18 / MobileNetV2)
    - utils.py — risk scoring, class mapping helpers
    - config.py — runtime constants and paths
  - requirements.txt — backend Python dependencies
- (models/, data/, outputs/) — expected runtime directories under backend/ (created by the backend when needed)

## Key features

- REST API for:
  - health check: GET /health
  - single-image inference: POST /predict
  - tiled inference / heatmap generation: POST /heatmap
  - serve last heatmap image: GET /heatmap/image
  - serve last patch grid JSON: GET /grid
  - list top risk zones: GET /zones
  - campus summary statistics: GET /campus-stats
- Model building supports ResNet18 and MobileNetV2 backbones and uses PyTorch.
- Heatmap generation composes patch overlays and stores both image and grid data in outputs.

## Tech stack

- Frontend: Next.js (v16.x), React 19, Tailwind-related tooling, Recharts (for charts)
- Backend: FastAPI, Uvicorn, PyTorch, torchvision, Pillow, numpy
- Languages: TypeScript (frontend), Python (backend)

## Quick start

Prerequisites:
- Node.js (recommended 16+), npm or yarn
- Python 3.8+ and pip
- (Optional, for GPU inference) CUDA and a compatible PyTorch build

1) Clone the repository
```bash
git clone https://github.com/WzeeaSajid/EcoTwin.git
cd EcoTwin
```

2) Run the frontend (development)
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:3000

3) Run the backend (development)
```bash
cd backend
python -m venv .venv
# macOS / Linux
source .venv/bin/activate
# Windows (PowerShell)
.venv\Scripts\Activate.ps1

pip install -r requirements.txt
# from repository root, or ensure PYTHONPATH includes backend if running from repo root:
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```
Default API: http://localhost:8000
OpenAPI docs (if uvicorn default): http://localhost:8000/docs

Notes:
- The backend expects a trained model checkpoint and a class mapping:
  - models/best_{BACKBONE}.pt (e.g., models/best_resnet18.pt)
  - models/class_mapping.json
- If these files are missing, /predict and /heatmap will return service-unavailable responses until a model and mapping are provided.

## Model files and outputs

Paths are defined in backend/app/config.py:
- MODELS_DIR: backend/models
- OUTPUTS_DIR: backend/outputs
  - outputs/heatmaps — generated heatmap images
  - outputs/predictions — latest grid JSON (latest_grid.json)

Behavior:
- POST /heatmap creates overlay heatmap image at outputs/heatmaps/latest_heatmap.png and grid JSON at outputs/predictions/latest_grid.json.

## API examples

Predict single image (returns risk score, risk level, class probabilities)
```bash
curl -X POST "http://localhost:8000/predict" \
  -F "file=@/path/to/image.jpg"
```

Generate heatmap from an image (returns summary and URLs to heatmap and grid)
```bash
curl -X POST "http://localhost:8000/heatmap" \
  -F "file=@/path/to/large_image.jpg"
```

Get the last generated heatmap image
```bash
curl http://localhost:8000/heatmap/image --output latest_heatmap.png
```

Get the last grid JSON
```bash
curl http://localhost:8000/grid
```

Get top N risk zones (default N=5)
```bash
curl "http://localhost:8000/zones?n=5"
```

Campus summary
```bash
curl http://localhost:8000/campus-stats
```

## Configuration and tuning

- Edit backend/app/config.py to change image size, patch size, stride, backbone, thresholds, and file locations.
- The code currently uses BINARY_MODE = True by default with classes ["High-Pollution", "Not-High-Risk"].
- To switch to multi-class scoring, set BINARY_MODE = False and provide an appropriate class mapping and model checkpoint matching NUM_CLASSES.
