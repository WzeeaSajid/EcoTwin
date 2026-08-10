# EcoTwin GIKI

Digital Twin for a Sustainable Future — monitoring, simulating, and optimizing environmental resilience at GIKI campus.

## Project Structure

```
EcoTwin/
├── frontend/    # Next.js dashboard (Tailwind + shadcn/ui)
├── backend/     # FastAPI server + CNN inference (coming soon)
└── model/       # WasteTwin CNN training pipeline
```

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS, shadcn/ui, Recharts
- **Backend:** FastAPI + PyTorch (coming soon)
- **ML:** ResNet18/MobileNetV2 transfer learning for pollution-risk classification
