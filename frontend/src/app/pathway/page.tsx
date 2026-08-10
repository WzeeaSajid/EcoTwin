"use client";

import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const pathwaySteps = [
  {
    step: 1,
    title: "Plastic Waste Generation",
    description: "Waste generated on campus",
    icon: "🗑️",
    color: "bg-red-100",
  },
  {
    step: 2,
    title: "Microplastic Transport",
    description: "Particles enter drainage and water",
    icon: "🌊",
    color: "bg-blue-100",
  },
  {
    step: 3,
    title: "Water & Soil Contamination",
    description: "Microplastics and chemicals spread",
    icon: "💧",
    color: "bg-cyan-100",
  },
  {
    step: 4,
    title: "Aquatic Life Exposure",
    description: "Ingestion by plankton and small fish",
    icon: "🐟",
    color: "bg-teal-100",
  },
  {
    step: 5,
    title: "Crops & Food Chain",
    description: "Uptake by crops and livestock",
    icon: "🌾",
    color: "bg-green-100",
  },
  {
    step: 6,
    title: "Human Exposure",
    description: "Through food and water consumption",
    icon: "👤",
    color: "bg-orange-100",
  },
];

const impactData = [
  { label: "Waste Generation\n(kg/day)", value: 1.6, maxValue: 3 },
  { label: "Microplastic Transport\n(μg/L)", value: 28.4, maxValue: 50 },
  { label: "Water & Soil\nContamination\n(index)", value: 18.2, maxValue: 40 },
  { label: "Aquatic Life\nExposure\n(index)", value: 7, maxValue: 20 },
  { label: "Food Chain\nExposure\n(index)", value: 8.7, maxValue: 20 },
  { label: "Human Exposure\n(index)", value: 12.3, maxValue: 30 },
];

export default function PathwayPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Environmental Pathway</h1>
        <p className="text-muted-foreground">
          Understand how campus impacts flow through the environment to humans.
        </p>
      </div>

      {/* Pathway Flow */}
      <Card className="bg-card">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {pathwaySteps.map((step, i) => (
              <div key={step.step} className="flex items-center">
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`mb-2 flex h-14 w-14 items-center justify-center rounded-xl ${step.color}`}
                  >
                    <span className="text-2xl">{step.icon}</span>
                  </div>
                  <p className="w-28 text-[11px] font-semibold leading-tight">
                    {step.title}
                  </p>
                  <p className="mt-1 w-28 text-[10px] text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                {i < pathwaySteps.length - 1 && (
                  <ArrowRight className="mx-2 h-4 w-4 shrink-0 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Impact Chart */}
      <Card className="bg-card">
        <CardContent className="p-6">
          <h3 className="mb-2 text-sm font-semibold">
            Pathway Impact (Current Scenario: Eco Intervention)
          </h3>
          <div className="mb-4 flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-[10px] text-muted-foreground">
                Lower Impact (Better)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span className="text-[10px] text-muted-foreground">
                Higher Impact (Worse)
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between gap-4 pt-4">
            {impactData.map((item) => (
              <div key={item.label} className="flex flex-1 flex-col items-center">
                <div className="relative flex h-48 w-full items-end justify-center">
                  <div className="relative w-10">
                    <div className="h-4 w-full rounded bg-primary/20" />
                    <div
                      className="absolute bottom-0 w-full rounded bg-primary"
                      style={{
                        height: `${(item.value / item.maxValue) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="absolute -top-4 text-xs font-medium">
                    {item.value}
                  </span>
                </div>
                <p className="mt-2 text-center text-[9px] leading-tight text-muted-foreground whitespace-pre-line">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
