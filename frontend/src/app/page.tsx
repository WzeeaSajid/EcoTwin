"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type LucideIcon,
  Leaf,
  Droplets,
  Fish,
  Cloud,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Minus,
  Info,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getOverview,
  type MetricTier,
  type OverviewMetric,
  type OverviewMetrics,
  type OverviewPayload,
} from "@/lib/overview";

// ---------------------------------------------------------------------------
// Provenance tiers — fixed vocabulary from the data contract.
// ---------------------------------------------------------------------------

const TIER_STYLES: Record<MetricTier, { dot: string; label: string; description: string }> = {
  measured: {
    dot: "bg-green-500",
    label: "Measured",
    description: "Computed directly from the CNN pollution risk grid.",
  },
  derived: {
    dot: "bg-amber-500",
    label: "Derived",
    description: "Calculated from another metric via a fixed coefficient.",
  },
  assumed: {
    dot: "bg-orange-500",
    label: "Assumed",
    description: "Estimated from a non-imagery assumption, not measured.",
  },
  composite: {
    dot: "bg-blue-500",
    label: "Composite",
    description: "A weighted combination of the other metrics.",
  },
};

const TIER_ORDER: MetricTier[] = ["measured", "derived", "assumed", "composite"];

// ---------------------------------------------------------------------------
// Band severity — derived from each metric's qualitative `bucket` label plus
// whether a higher value is good (eco_resilience) or bad (everything else).
// No numeric thresholds are hardcoded; only the JSON's own wording is read.
// ---------------------------------------------------------------------------

type BandSeverity = "good" | "warn" | "bad";

const BAND_STYLES: Record<BandSeverity, { badge: string; text: string; trendGood: string; trendBad: string }> = {
  good: { badge: "bg-primary/10 text-primary", text: "text-primary", trendGood: "text-primary", trendBad: "text-primary" },
  warn: { badge: "bg-amber-100 text-amber-700", text: "text-amber-600", trendGood: "text-primary", trendBad: "text-red-500" },
  bad: { badge: "bg-red-100 text-red-700", text: "text-red-600", trendGood: "text-primary", trendBad: "text-red-500" },
};

function bandSeverity(bucket: string, higherIsBetter: boolean): BandSeverity {
  const text = bucket.toLowerCase();
  if (text.includes("low")) return higherIsBetter ? "bad" : "good";
  if (text.includes("high")) return higherIsBetter ? "good" : "bad";
  return "warn";
}

// ---------------------------------------------------------------------------
// Trend — only ever computed from an explicit `history` array. When absent,
// we render a flat, neutral sparkline instead of inventing a direction.
// ---------------------------------------------------------------------------

type Trend = "up" | "down" | "flat" | null;

function computeTrend(history?: number[]): Trend {
  if (!history || history.length < 2) return null;
  const first = history[0];
  const last = history[history.length - 1];
  if (last > first) return "up";
  if (last < first) return "down";
  return "flat";
}

function Sparkline({ history, colorClass }: { history?: number[]; colorClass: string }) {
  const hasHistory = Array.isArray(history) && history.length >= 2;
  const strokeClass = hasHistory ? colorClass.replace("text-", "stroke-") : "stroke-muted-foreground/40";

  let points = "0,20 200,20";
  if (hasHistory) {
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 1;
    points = history
      .map((v, i) => {
        const x = (i / (history.length - 1)) * 200;
        const y = 36 - ((v - min) / range) * 32;
        return `${x},${y}`;
      })
      .join(" ");
  }

  return (
    <svg viewBox="0 0 200 40" className="h-full w-full" aria-hidden="true">
      <polyline
        fill="none"
        strokeWidth="2"
        points={points}
        className={strokeClass}
        strokeDasharray={hasHistory ? undefined : "4 3"}
      />
    </svg>
  );
}

function TrendIndicator({ trend, colorClass }: { trend: Trend; colorClass: string }) {
  if (trend === null) {
    return <Minus className="h-4 w-4 text-muted-foreground/50" aria-label="No trend data available" />;
  }
  if (trend === "up") {
    return <TrendingUp className={`h-4 w-4 ${colorClass}`} aria-label="Trending up" />;
  }
  if (trend === "down") {
    return <TrendingDown className={`h-4 w-4 ${colorClass}`} aria-label="Trending down" />;
  }
  return <Minus className="h-4 w-4 text-muted-foreground/50" aria-label="No change" />;
}

// ---------------------------------------------------------------------------
// Provenance affordance — tier dot + (i) tooltip showing tier/formula/note.
// ---------------------------------------------------------------------------

function ProvenanceInfo({
  tier,
  formula,
  note,
  weights,
}: {
  tier: MetricTier;
  formula: string;
  note?: string;
  weights?: Record<string, number>;
}) {
  const style = TIER_STYLES[tier];
  return (
    <Tooltip>
      <TooltipTrigger
        aria-label={`Data provenance: ${style.label}`}
        className="inline-flex shrink-0 items-center gap-1 rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className={`h-2 w-2 rounded-full ${style.dot}`} />
        <Info className="h-3.5 w-3.5" />
      </TooltipTrigger>
      <TooltipContent>
        <p className="mb-1 flex items-center gap-1.5 font-semibold text-foreground">
          <span className={`h-2 w-2 rounded-full ${style.dot}`} />
          {style.label}
        </p>
        <p className="break-words font-mono text-[11px] text-muted-foreground">{formula}</p>
        {weights && (
          <ul className="mt-1.5 space-y-0.5 text-[11px] text-muted-foreground">
            {Object.entries(weights).map(([k, v]) => (
              <li key={k}>
                {k}: {v}
              </li>
            ))}
          </ul>
        )}
        {note && <p className="mt-1.5 text-muted-foreground">{note}</p>}
      </TooltipContent>
    </Tooltip>
  );
}

function TierLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
      <span className="font-medium text-foreground/70">Data provenance:</span>
      {TIER_ORDER.map((tier) => (
        <span key={tier} className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${TIER_STYLES[tier].dot}`} />
          {TIER_STYLES[tier].label}
        </span>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Metric card row
// ---------------------------------------------------------------------------

interface MetricCardConfig {
  key: keyof OverviewMetrics;
  label: string;
  icon: LucideIcon;
  iconColor: string;
  higherIsBetter: boolean;
}

const METRIC_CARDS: MetricCardConfig[] = [
  { key: "waste_pressure", label: "Waste Pressure", icon: Leaf, iconColor: "bg-primary/10 text-primary", higherIsBetter: false },
  { key: "water_exposure", label: "Water Exposure Index", icon: Droplets, iconColor: "bg-blue-100 text-blue-600", higherIsBetter: false },
  { key: "food_web_exposure", label: "Food Web Exposure", icon: Fish, iconColor: "bg-orange-100 text-orange-600", higherIsBetter: false },
  { key: "carbon_footprint", label: "Carbon Footprint", icon: Cloud, iconColor: "bg-gray-100 text-gray-600", higherIsBetter: false },
];

function MetricCard({
  config,
  metric,
}: {
  config: MetricCardConfig;
  metric: OverviewMetric;
}) {
  const severity = bandSeverity(metric.bucket, config.higherIsBetter);
  const styles = BAND_STYLES[severity];
  const trend = computeTrend(metric.history);
  const improved = trend && trend !== "flat" ? (config.higherIsBetter ? trend === "up" : trend === "down") : null;
  const trendColor = improved === null ? "text-muted-foreground/50" : improved ? styles.trendGood : styles.trendBad;

  return (
    <Card className="bg-card">
      <CardContent className="p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.iconColor}`}>
              <config.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{config.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{metric.value}</span>
                {metric.unit && <span className="text-sm text-muted-foreground">{metric.unit}</span>}
              </div>
            </div>
          </div>
          <ProvenanceInfo tier={metric.tier} formula={metric.formula} note={metric.note} weights={metric.weights} />
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${styles.text}`}>{metric.bucket}</span>
          <TrendIndicator trend={trend} colorClass={trendColor} />
        </div>
        <div className="mt-3 h-8 w-full">
          <Sparkline history={metric.history} colorClass={trendColor} />
        </div>
      </CardContent>
    </Card>
  );
}

function MetricCardSkeleton() {
  return (
    <Card className="bg-card">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <Skeleton className="mt-3 h-8 w-full" />
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Key highlights panel — hidden entirely when no scenario has been simulated.
// ---------------------------------------------------------------------------

function KeyHighlightsPanel({ scenario }: { scenario: NonNullable<OverviewPayload["scenario"]> }) {
  const h = scenario.key_highlights;
  const items: { icon: LucideIcon; iconBg: string; text: string }[] = [
    { icon: TrendingUp, iconBg: "bg-primary/10 text-primary", text: `${h.resilience_increase_pct}% increase in resilience from baseline` },
    { icon: Droplets, iconBg: "bg-blue-100 text-blue-600", text: `Water exposure reduced by ${h.water_exposure_reduced_pct}%` },
    { icon: Fish, iconBg: "bg-orange-100 text-orange-600", text: `Food web exposure reduced by ${h.food_web_reduced_pct}%` },
    { icon: Cloud, iconBg: "bg-gray-100 text-gray-600", text: `Carbon footprint reduced by ${h.carbon_reduced_pct}%` },
  ];

  return (
    <Card className="bg-card">
      <CardContent className="p-6">
        <h3 className="mb-4 text-sm font-semibold">Key Highlights</h3>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.text} className="flex items-start gap-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.iconBg}`}>
                <item.icon className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium">{item.text}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function KeyHighlightsSkeleton() {
  return (
    <Card className="bg-card">
      <CardContent className="p-6">
        <Skeleton className="mb-4 h-4 w-28" />
        <div className="space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Hero card
// ---------------------------------------------------------------------------

function HeroCard({ metric }: { metric: OverviewMetric }) {
  const severity = bandSeverity(metric.bucket, true);
  const styles = BAND_STYLES[severity];

  return (
    <Card className="bg-card">
      <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Leaf className="h-7 w-7 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground">Eco-Resilience Score</p>
        <div className="my-2 flex items-baseline gap-1">
          <span className="text-5xl font-bold text-primary">{metric.value}</span>
          <span className="text-lg text-muted-foreground">/100</span>
        </div>
        <div className="mb-4 flex items-center gap-2">
          <Badge variant="secondary" className={styles.badge}>
            {metric.bucket}
          </Badge>
          <ProvenanceInfo tier={metric.tier} formula={metric.formula} note={metric.note} weights={metric.weights} />
        </div>
        <Progress value={metric.value} className="mb-3 w-full" />
        <p className="text-sm text-muted-foreground">
          Your campus is more resilient compared to the baseline.
        </p>
        <Button variant="outline" className="mt-4 gap-2">
          View Details <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function HeroCardSkeleton() {
  return (
    <Card className="bg-card">
      <CardContent className="flex h-full flex-col items-center justify-center gap-3 p-6">
        <Skeleton className="h-14 w-14 rounded-full" />
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-12 w-28" />
        <Skeleton className="h-5 w-32 rounded-full" />
        <Skeleton className="h-1 w-full rounded-full" />
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-8 w-28 rounded-lg" />
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Active scenario — shows the intervention mix behind the simulated numbers.
// ---------------------------------------------------------------------------

function ActiveScenarioCard({ scenario }: { scenario: NonNullable<OverviewPayload["scenario"]> }) {
  return (
    <Card className="bg-card">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">{scenario.scenario_name}</h3>
          </div>
          {scenario.active && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Active
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(scenario.interventions).map(([name, pct]) => (
            <div key={name} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
              <span className="text-xs text-muted-foreground">{name}</span>
              <span className="text-xs font-bold text-primary">{pct}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Error state
// ---------------------------------------------------------------------------

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card className="border-red-200 bg-card">
      <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <p className="text-sm font-semibold">Couldn&apos;t load overview data</p>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function OverviewPage() {
  const [data, setData] = useState<OverviewPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = useCallback(() => {
    getOverview()
      .then((payload) => setData(payload))
      .catch((err: unknown) => {
        setData(null);
        setError(err instanceof Error ? err.message : "Unknown error while loading overview data.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const retry = () => {
    setLoading(true);
    setError(null);
    fetchOverview();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome to EcoTwin GIKI</h1>
        <p className="text-muted-foreground">
          Monitor. Understand. Act for a sustainable future.
        </p>
      </div>

      {error && !loading && <ErrorState message={error} onRetry={retry} />}

      {!error && (
        <TooltipProvider>
          {loading || !data ? (
            <>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <HeroCardSkeleton />
                <KeyHighlightsSkeleton />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {METRIC_CARDS.map((c) => (
                  <MetricCardSkeleton key={c.key} />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className={`grid grid-cols-1 gap-6 ${data.scenario ? "lg:grid-cols-2" : ""}`}>
                <HeroCard metric={data.overview.eco_resilience} />
                {data.scenario && <KeyHighlightsPanel scenario={data.scenario} />}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-muted-foreground">Live Metrics</h2>
                <TierLegend />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {METRIC_CARDS.map((c) => (
                  <MetricCard key={c.key} config={c} metric={data.overview[c.key]} />
                ))}
              </div>

              {data.scenario && <ActiveScenarioCard scenario={data.scenario} />}
            </>
          )}
        </TooltipProvider>
      )}
    </div>
  );
}
