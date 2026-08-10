import json
from pathlib import Path

from app.config import BINARY_MODE, HIGH_RISK_THRESHOLD

if BINARY_MODE:
    RISK_WEIGHTS = {
        "Not-High-Risk": 0.0,
        "High-Pollution": 1.0,
    }
else:
    RISK_WEIGHTS = {
        "Low-Pollution": 0.0,
        "Medium-Pollution": 0.5,
        "High-Pollution": 1.0,
    }


def risk_score_from_probs(probs, idx_to_class):
    score = 0.0
    for idx, p in enumerate(probs):
        class_name = idx_to_class[idx]
        score += RISK_WEIGHTS.get(class_name, 0.0) * float(p)
    return score


def risk_bucket(score):
    if BINARY_MODE:
        return "HIGH" if score >= HIGH_RISK_THRESHOLD else "NOT-HIGH"
    if score >= 0.66:
        return "HIGH"
    if score >= 0.33:
        return "MEDIUM"
    return "LOW"


def risk_color(score):
    if BINARY_MODE:
        if score >= HIGH_RISK_THRESHOLD:
            return (197, 50, 45)
        return (150, 150, 150)
    if score >= 0.66:
        return (197, 50, 45)
    if score >= 0.33:
        return (196, 122, 30)
    return (78, 122, 52)


def load_class_mapping(path: Path):
    with open(path) as f:
        data = json.load(f)
    idx_to_class = {int(k): v for k, v in data["idx_to_class"].items()}
    return data["class_to_idx"], idx_to_class
