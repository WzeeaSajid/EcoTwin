"use client";

import { useState, useMemo } from "react";
import { Play, RotateCcw, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const scenarioPresets = {
  bau: {
    name: "Business As Usual",
    description: "Continue current trends with no additional interventions.",
    icon: "📊",
    recommended: false,
    values: { waste: 10, drainage: 5, green: 5, renewable: 10 },
  },
  eco: {
    name: "Eco Intervention",
    description: "Apply sustainable interventions to improve environmental resilience.",
    icon: "🌿",
    recommended: true,
    values: { waste: 50, drainage: 30, green: 20, renewable: 40 },
  },
  climate: {
    name: "Climate Stress",
    description: "Extreme climate conditions with higher pressure on resources.",
    icon: "🌡️",
    recommended: false,
    values: { waste: 15, drainage: 10, green: 8, renewable: 15 },
  },
};

const BASELINE = {
  resilience: 64,
  waterExposure: 52,
  foodWebExposure: 33,
  carbonFootprint: 2.1,
};

function computeImpact(waste: number, drainage: number, green: number, renewable: number) {
  const w = waste / 100;
  const d = drainage / 100;
  const g = green / 100;
  const r = renewable / 100;

  const resilienceGain = w * 12 + d * 8 + g * 6 + r * 4;
  const resilience = Math.min(100, Math.round(BASELINE.resilience + resilienceGain));

  const waterReduction = d * 55 + g * 20 + w * 5;
  const waterExposure = Math.max(0, Math.round(BASELINE.waterExposure * (1 - waterReduction / 100)));

  const foodReduction = w * 35 + d * 25 + g * 10;
  const foodWebExposure = Math.max(0, Math.round(BASELINE.foodWebExposure * (1 - foodReduction / 100)));

  const carbonReduction = r * 30 + g * 15 + w * 5;
  const carbonFootprint = Math.max(0, +(BASELINE.carbonFootprint * (1 - carbonReduction / 100)).toFixed(2));

  return { resilience, waterExposure, foodWebExposure, carbonFootprint };
}

function ImpactRow({
  icon,
  iconBg,
  label,
  baseline,
  predicted,
  unit,
  lowerBetter,
}: {
  icon: string;
  iconBg: string;
  label: string;
  baseline: number;
  predicted: number;
  unit: string;
  lowerBetter: boolean;
}) {
  const diff = predicted - baseline;
  const pctChange = baseline !== 0 ? Math.round((diff / baseline) * 100) : 0;
  const improved = lowerBetter ? diff < 0 : diff > 0;

  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold">
            {predicted} <span className="text-xs font-normal text-muted-foreground">{unit}</span>
          </p>
          {diff !== 0 && (
            <span
              className={`flex items-center gap-0.5 text-xs font-medium ${
                improved ? "text-primary" : "text-red-500"
              }`}
            >
              {diff > 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : diff < 0 ? (
                <TrendingDown className="h-3 w-3" />
              ) : (
                <Minus className="h-3 w-3" />
              )}
              {pctChange > 0 ? "+" : ""}
              {pctChange}%
            </span>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground">
          Baseline: {baseline} {unit}
        </p>
      </div>
    </div>
  );
}

export default function ScenariosPage() {
  const [selectedScenario, setSelectedScenario] = useState("eco");
  const [waste, setWaste] = useState(50);
  const [drainage, setDrainage] = useState(30);
  const [green, setGreen] = useState(20);
  const [renewable, setRenewable] = useState(40);
  const [simulated, setSimulated] = useState(true);

  const impact = useMemo(
    () => computeImpact(waste, drainage, green, renewable),
    [waste, drainage, green, renewable]
  );

  const selectScenario = (id: string) => {
    setSelectedScenario(id);
    const preset = scenarioPresets[id as keyof typeof scenarioPresets];
    setWaste(preset.values.waste);
    setDrainage(preset.values.drainage);
    setGreen(preset.values.green);
    setRenewable(preset.values.renewable);
    setSimulated(true);
  };

  const reset = () => {
    selectScenario("bau");
  };

  const avgImpact =
    ((impact.resilience - BASELINE.resilience) /
      BASELINE.resilience) *
    100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Scenarios</h1>
        <p className="text-muted-foreground">
          Simulate different interventions and see future impact.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Choose Scenario */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Choose Scenario</h3>
          {Object.entries(scenarioPresets).map(([id, scenario]) => (
            <Card
              key={id}
              className={`cursor-pointer transition-all ${
                selectedScenario === id
                  ? "border-primary ring-2 ring-primary/20 bg-card"
                  : "bg-card hover:border-primary/50"
              }`}
              onClick={() => selectScenario(id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{scenario.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{scenario.name}</p>
                      {scenario.recommended && (
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary"
                        >
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {scenario.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Middle: Intervention Controls */}
        <Card className="bg-card">
          <CardContent className="p-6">
            <h3 className="mb-4 text-sm font-semibold">Intervention Controls</h3>
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex justify-between">
                  <label className="text-xs text-muted-foreground">
                    Waste Interception (Recycling + Segregation)
                  </label>
                  <span className="text-xs font-medium">{waste}%</span>
                </div>
                <Slider
                  value={[waste]}
                  onValueChange={(v) => { setWaste(Array.isArray(v) ? v[0] : v); setSimulated(true); }}
                  max={100}
                  step={5}
                />
              </div>
              <div>
                <div className="mb-2 flex justify-between">
                  <label className="text-xs text-muted-foreground">
                    Drainage Filtration Efficiency
                  </label>
                  <span className="text-xs font-medium">{drainage}%</span>
                </div>
                <Slider
                  value={[drainage]}
                  onValueChange={(v) => { setDrainage(Array.isArray(v) ? v[0] : v); setSimulated(true); }}
                  max={100}
                  step={5}
                />
              </div>
              <div>
                <div className="mb-2 flex justify-between">
                  <label className="text-xs text-muted-foreground">
                    Green Buffer & Bio-swales
                  </label>
                  <span className="text-xs font-medium">{green}%</span>
                </div>
                <Slider
                  value={[green]}
                  onValueChange={(v) => { setGreen(Array.isArray(v) ? v[0] : v); setSimulated(true); }}
                  max={100}
                  step={5}
                />
              </div>
              <div>
                <div className="mb-2 flex justify-between">
                  <label className="text-xs text-muted-foreground">
                    Renewable Energy Adoption
                  </label>
                  <span className="text-xs font-medium">{renewable}%</span>
                </div>
                <Slider
                  value={[renewable]}
                  onValueChange={(v) => { setRenewable(Array.isArray(v) ? v[0] : v); setSimulated(true); }}
                  max={100}
                  step={5}
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button className="flex-1 gap-2" onClick={() => setSimulated(true)}>
                <Play className="h-4 w-4" /> Simulate Scenario
              </Button>
              <Button variant="outline" className="gap-2" onClick={reset}>
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right: Expected Impact */}
        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Expected Impact</h3>
              {simulated && (
                <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px]">
                  Live
                </Badge>
              )}
            </div>
            <div className="space-y-4">
              <div className="rounded-lg bg-primary/5 p-3">
                <p className="text-xs text-muted-foreground">Eco-Resilience Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">
                    {impact.resilience}
                  </span>
                  <span className="text-sm text-muted-foreground">/100</span>
                  <span
                    className={`text-xs font-medium ${
                      impact.resilience > BASELINE.resilience
                        ? "text-primary"
                        : impact.resilience < BASELINE.resilience
                        ? "text-red-500"
                        : "text-muted-foreground"
                    }`}
                  >
                    {impact.resilience > BASELINE.resilience ? "+" : ""}
                    {impact.resilience - BASELINE.resilience} from baseline
                  </span>
                </div>
              </div>

              <div className="h-px bg-border" />

              <ImpactRow
                icon="💧"
                iconBg="bg-blue-100"
                label="Water Exposure"
                baseline={BASELINE.waterExposure}
                predicted={impact.waterExposure}
                unit="/100"
                lowerBetter
              />

              <ImpactRow
                icon="🐟"
                iconBg="bg-orange-100"
                label="Food Web Exposure"
                baseline={BASELINE.foodWebExposure}
                predicted={impact.foodWebExposure}
                unit="/100"
                lowerBetter
              />

              <ImpactRow
                icon="☁️"
                iconBg="bg-gray-100"
                label="Carbon Footprint"
                baseline={BASELINE.carbonFootprint}
                predicted={impact.carbonFootprint}
                unit="tCO₂/day"
                lowerBetter
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
