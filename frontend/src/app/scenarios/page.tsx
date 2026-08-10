"use client";

import { useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const scenarioOptions = [
  {
    id: "bau",
    name: "Business As Usual",
    description: "Continue current trends with no additional interventions.",
    icon: "📊",
    recommended: false,
  },
  {
    id: "eco",
    name: "Eco Intervention",
    description: "Apply sustainable interventions to improve environmental resilience.",
    icon: "🌿",
    recommended: true,
  },
  {
    id: "climate",
    name: "Climate Stress",
    description: "Extreme climate conditions with higher pressure on resources.",
    icon: "🌡️",
    recommended: false,
  },
];

export default function ScenariosPage() {
  const [selectedScenario, setSelectedScenario] = useState("eco");
  const [wasteInterception, setWasteInterception] = useState(50);
  const [drainageFiltration, setDrainageFiltration] = useState(30);
  const [greenBuffer, setGreenBuffer] = useState(20);
  const [renewableEnergy, setRenewableEnergy] = useState(40);

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
          {scenarioOptions.map((scenario) => (
            <Card
              key={scenario.id}
              className={`cursor-pointer transition-all ${
                selectedScenario === scenario.id
                  ? "border-primary ring-2 ring-primary/20 bg-card"
                  : "bg-card hover:border-primary/50"
              }`}
              onClick={() => setSelectedScenario(scenario.id)}
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
                  <span className="text-xs font-medium">{wasteInterception}%</span>
                </div>
                <Slider
                  value={[wasteInterception]}
                  onValueChange={(v) => setWasteInterception(Array.isArray(v) ? v[0] : v)}
                  max={100}
                  step={5}
                />
              </div>
              <div>
                <div className="mb-2 flex justify-between">
                  <label className="text-xs text-muted-foreground">
                    Drainage Filtration Efficiency
                  </label>
                  <span className="text-xs font-medium">{drainageFiltration}%</span>
                </div>
                <Slider
                  value={[drainageFiltration]}
                  onValueChange={(v) => setDrainageFiltration(Array.isArray(v) ? v[0] : v)}
                  max={100}
                  step={5}
                />
              </div>
              <div>
                <div className="mb-2 flex justify-between">
                  <label className="text-xs text-muted-foreground">
                    Green Buffer & Bio-swales
                  </label>
                  <span className="text-xs font-medium">{greenBuffer}%</span>
                </div>
                <Slider
                  value={[greenBuffer]}
                  onValueChange={(v) => setGreenBuffer(Array.isArray(v) ? v[0] : v)}
                  max={100}
                  step={5}
                />
              </div>
              <div>
                <div className="mb-2 flex justify-between">
                  <label className="text-xs text-muted-foreground">
                    Renewable Energy Adoption
                  </label>
                  <span className="text-xs font-medium">{renewableEnergy}%</span>
                </div>
                <Slider
                  value={[renewableEnergy]}
                  onValueChange={(v) => setRenewableEnergy(Array.isArray(v) ? v[0] : v)}
                  max={100}
                  step={5}
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button className="flex-1 gap-2">
                <Play className="h-4 w-4" /> Simulate Scenario
              </Button>
              <Button variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" /> Reset to Baseline
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right: Expected Impact */}
        <Card className="bg-card">
          <CardContent className="p-6">
            <h3 className="mb-4 text-sm font-semibold">Expected Impact</h3>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-lg">🌿</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Eco-Resilience Score</p>
                    <p className="text-lg font-bold">82 /100</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-lg">💧</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Water Exposure</p>
                  <p className="text-lg font-bold text-blue-600">-55%</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                  <span className="text-lg">🐟</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Food Web Exposure</p>
                  <p className="text-lg font-bold text-orange-600">-60%</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <span className="text-lg">☁️</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Carbon Footprint</p>
                  <p className="text-lg font-bold text-gray-600">-31%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
