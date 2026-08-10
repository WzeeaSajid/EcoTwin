// Typed contract + loader for the CNN pipeline's overview.json output
// (wastetwin-cnn -> public/data/overview.json). The Overview tab renders
// entirely from this payload — no hardcoded numbers.

export type MetricTier = "measured" | "derived" | "assumed" | "composite";

export interface OverviewMetric {
  value: number;
  bucket: string;
  tier: MetricTier;
  formula: string;
  unit?: string;
  note?: string;
  weights?: Record<string, number>;
  /** Optional trend history. Not guaranteed by the pipeline — render a flat,
   *  neutral sparkline when absent instead of inventing a trend. */
  history?: number[];
}

export interface OverviewMetrics {
  eco_resilience: OverviewMetric;
  waste_pressure: OverviewMetric;
  water_exposure: OverviewMetric;
  food_web_exposure: OverviewMetric;
  carbon_footprint: OverviewMetric;
}

export interface ScenarioKeyHighlights {
  resilience_increase_pct: number;
  water_exposure_reduced_pct: number;
  food_web_reduced_pct: number;
  carbon_reduced_pct: number;
}

export interface ScenarioAdjustedMetrics {
  eco_resilience: number;
  waste_pressure: number;
  water_exposure: number;
  food_web_exposure: number;
  carbon_footprint: number;
}

export interface OverviewScenario {
  scenario_name: string;
  active: boolean;
  interventions: Record<string, string>;
  adjusted: ScenarioAdjustedMetrics;
  key_highlights: ScenarioKeyHighlights;
}

export interface OverviewPayload {
  source_grid: string;
  overview: OverviewMetrics;
  /** Absent when no scenario has been simulated — callers must handle this. */
  scenario?: OverviewScenario;
}

const OVERVIEW_DATA_URL = "/data/overview.json";

const REQUIRED_METRIC_KEYS: (keyof OverviewMetrics)[] = [
  "eco_resilience",
  "waste_pressure",
  "water_exposure",
  "food_web_exposure",
  "carbon_footprint",
];

function isOverviewPayload(data: unknown): data is OverviewPayload {
  if (!data || typeof data !== "object") return false;
  const overview = (data as { overview?: unknown }).overview;
  if (!overview || typeof overview !== "object") return false;
  return REQUIRED_METRIC_KEYS.every(
    (key) => (overview as Record<string, unknown>)[key] !== undefined
  );
}

/** Fetches and validates public/data/overview.json. Throws on any failure —
 *  callers are expected to catch this and render an error state. */
export async function getOverview(): Promise<OverviewPayload> {
  const res = await fetch(OVERVIEW_DATA_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to load overview data (HTTP ${res.status}).`);
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new Error("Overview data is not valid JSON.");
  }

  if (!isOverviewPayload(data)) {
    throw new Error("Overview data is missing required fields.");
  }

  return data;
}
