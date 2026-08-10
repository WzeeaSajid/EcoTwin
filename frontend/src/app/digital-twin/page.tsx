"use client";

import { useState, useRef } from "react";
import { Maximize2, ArrowRight, Upload, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { generateHeatmap, getHeatmapImageUrl, type HeatmapResult, type Zone } from "@/lib/api";

const layers = [
  { id: "pollution", label: "Pollution Intensity", color: "bg-red-500" },
  { id: "water", label: "Water Flow", color: "bg-blue-500" },
  { id: "vegetation", label: "Vegetation Health", color: "bg-green-500" },
  { id: "waste", label: "Waste Hotspots", color: "bg-orange-500" },
  { id: "drainage", label: "Drainage Network", color: "bg-cyan-500" },
  { id: "land", label: "Land Use", color: "bg-purple-500" },
];

const scenarios = ["Eco Intervention", "Business As Usual", "Climate Stress"];

export default function DigitalTwinPage() {
  const [activeLayers, setActiveLayers] = useState<string[]>(["pollution"]);
  const [selectedScenario, setSelectedScenario] = useState("Eco Intervention");
  const [heatmapResult, setHeatmapResult] = useState<HeatmapResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleLayer = (id: string) => {
    setActiveLayers((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setHeatmapResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      const result = await generateHeatmap(selectedFile);
      setHeatmapResult(result);
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">GIKI Digital Twin</h1>
          <p className="text-muted-foreground">
            Explore the campus and its environmental layers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Current Scenario:</span>
          <select
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            {scenarios.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="relative overflow-hidden bg-card lg:col-span-2">
          <CardContent className="p-0">
            <div className="relative h-[500px] bg-gradient-to-br from-green-100 via-green-50 to-blue-50">
              <div className="absolute left-4 top-4 z-10 rounded-xl bg-card/95 p-4 shadow-lg backdrop-blur-sm">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  View Layers
                </p>
                <div className="space-y-2">
                  {layers.map((layer) => (
                    <label key={layer.id} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={activeLayers.includes(layer.id)}
                        onChange={() => toggleLayer(layer.id)}
                        className="h-3.5 w-3.5 rounded border-gray-300 accent-primary"
                      />
                      <span className={`h-2 w-2 rounded-full ${layer.color}`} />
                      <span className="text-xs">{layer.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-4 left-4 z-10 rounded-lg bg-card/95 px-4 py-2 shadow-lg backdrop-blur-sm">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Pollution Intensity
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">Low</span>
                  <div className="h-2 w-32 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500" />
                  <span className="text-[10px] text-muted-foreground">High</span>
                </div>
              </div>

              <button className="absolute right-4 top-4 z-10 rounded-lg bg-card/95 p-2 shadow-lg backdrop-blur-sm hover:bg-card">
                <Maximize2 className="h-4 w-4" />
              </button>

              {heatmapResult ? (
                <img
                  src={getHeatmapImageUrl()}
                  alt="Pollution heatmap"
                  className="absolute inset-0 h-full w-full object-contain"
                />
              ) : previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Selected satellite image"
                  className="absolute inset-0 h-full w-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                      <Upload className="h-10 w-10 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Upload a satellite image to analyze
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Drag to rotate &bull; Scroll to zoom &bull; Click on a zone for details
                    </p>
                  </div>
                </div>
              )}

              {heatmapResult && (
                <div className="absolute bottom-20 right-6 z-10 w-56 rounded-xl bg-card p-4 shadow-xl">
                  <p className="text-xs font-semibold">Top Risk Zone</p>
                  <Badge
                    variant="secondary"
                    className={`mb-2 mt-1 ${
                      heatmapResult.top_risk_zones[0]?.bucket === "HIGH"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {heatmapResult.top_risk_zones[0]?.bucket || "N/A"}
                  </Badge>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Risk Score</span>
                      <span className="font-medium">
                        {((heatmapResult.top_risk_zones[0]?.risk || 0) * 100).toFixed(0)} /100
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">High Risk Patches</span>
                      <span className="font-medium">{heatmapResult.summary.high_risk_patches}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Patches</span>
                      <span className="font-medium">{heatmapResult.summary.total_patches}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="bg-card">
            <CardContent className="p-5">
              <h3 className="mb-3 text-sm font-semibold">Upload Satellite Image</h3>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
                {selectedFile ? selectedFile.name : "Choose Image"}
              </Button>
              <Button
                className="mt-3 w-full gap-2"
                onClick={handleAnalyze}
                disabled={!selectedFile || loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Analyze"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-5">
              <h3 className="mb-3 text-sm font-semibold">Zone Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-xs">High Pollution Zone</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="text-xs">Medium Pollution Zone</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-xs">Low Pollution Zone</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {heatmapResult && (
            <Card className="bg-card">
              <CardContent className="p-5">
                <h3 className="mb-3 text-sm font-semibold">Analysis Results</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Avg Risk</span>
                      <span className="font-medium">
                        {(heatmapResult.summary.average_risk * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${heatmapResult.summary.average_risk * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">High Risk %</span>
                      <span className="font-medium">
                        {heatmapResult.summary.high_risk_percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-red-500"
                        style={{ width: `${heatmapResult.summary.high_risk_percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-card">
            <CardContent className="p-5">
              <h3 className="mb-3 text-sm font-semibold">Campus Stats</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Green Coverage</span>
                    <span className="font-medium">58%</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-muted">
                    <div className="h-full w-[58%] rounded-full bg-primary" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Waste Interception</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-muted">
                    <div className="h-full w-[45%] rounded-full bg-primary" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Water Quality</span>
                    <span className="font-medium">72%</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-muted">
                    <div className="h-full w-[72%] rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
