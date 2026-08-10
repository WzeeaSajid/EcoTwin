const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface PredictResult {
  risk_score: number;
  risk_level: string;
  class_probabilities: Record<string, number>;
}

export interface Zone {
  x: number;
  y: number;
  risk: number;
  bucket: string;
}

export interface HeatmapResult {
  image_size: { width: number; height: number };
  grid_dimensions: { rows: number; cols: number };
  summary: {
    average_risk: number;
    high_risk_patches: number;
    total_patches: number;
    high_risk_percentage: number;
  };
  top_risk_zones: Zone[];
  heatmap_url: string;
  grid_url: string;
}

export interface CampusStats {
  available: boolean;
  eco_resilience_score?: number;
  waste_pressure?: number;
  high_risk_zones?: number;
  medium_risk_zones?: number;
  low_risk_zones?: number;
  total_patches?: number;
  message?: string;
}

export interface HealthStatus {
  status: string;
  model_loaded: boolean;
  model_exists: boolean;
  device: string;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API error: ${res.status}`);
  }
  return res.json();
}

export async function getHealth(): Promise<HealthStatus> {
  return apiFetch<HealthStatus>("/health");
}

export async function predict(file: File): Promise<PredictResult> {
  const form = new FormData();
  form.append("file", file);
  return apiFetch<PredictResult>("/predict", { method: "POST", body: form });
}

export async function generateHeatmap(file: File): Promise<HeatmapResult> {
  const form = new FormData();
  form.append("file", file);
  return apiFetch<HeatmapResult>("/heatmap", { method: "POST", body: form });
}

export async function getZones(n = 5): Promise<Zone[]> {
  return apiFetch<Zone[]>(`/zones?n=${n}`);
}

export async function getCampusStats(): Promise<CampusStats> {
  return apiFetch<CampusStats>("/campus-stats");
}

export function getHeatmapImageUrl(): string {
  return `${API_URL}/heatmap/image`;
}

export function getGridUrl(): string {
  return `${API_URL}/grid`;
}
