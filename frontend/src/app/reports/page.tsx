"use client";

import { useRef, useState } from "react";
import {
  ArrowRight,
  Download,
  BarChart3,
  GitBranch,
  CheckCircle,
  FileText,
  Leaf,
  Droplets,
  Fish,
  Cloud,
  Calendar,
  Building2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const reports = [
  {
    id: "simulation",
    title: "Simulation Summary",
    description: "Detailed simulation results and key impact metrics.",
    icon: FileText,
    color: "bg-primary/10 text-primary",
  },
  {
    id: "comparison",
    title: "Impact Comparison",
    description: "Compare different scenarios side by side.",
    icon: BarChart3,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "pathway",
    title: "Environmental Pathway Analysis",
    description: "Detailed analysis of the environmental pathway.",
    icon: GitBranch,
    color: "bg-orange-100 text-orange-600",
  },
  {
    id: "intervention",
    title: "Intervention Effectiveness",
    description: "See how each intervention contributes to outcomes.",
    icon: CheckCircle,
    color: "bg-green-100 text-green-600",
  },
];

const simulationData = {
  scenario: "Eco Intervention",
  date: "25 May 2025",
  resilienceScore: 82,
  baselineScore: 64,
  metrics: [
    { label: "Waste Pressure", value: 42, unit: "/100", status: "Moderate" },
    { label: "Water Exposure", value: 23, unit: "/100", status: "Low" },
    { label: "Food Web Exposure", value: 13, unit: "/100", status: "Low" },
    { label: "Carbon Footprint", value: 1.48, unit: "tCO2/day", status: "Moderate" },
  ],
  interventions: [
    { name: "Waste Interception", coverage: 50 },
    { name: "Drainage Filtration", coverage: 30 },
    { name: "Green Buffer", coverage: 20 },
    { name: "Renewable Energy", coverage: 40 },
  ],
  pathwayImpact: [
    { stage: "Waste Generation", value: 1.6, unit: "kg/day" },
    { stage: "Microplastic Transport", value: 28.4, unit: "ug/L" },
    { stage: "Water & Soil Contamination", value: 18.2, unit: "index" },
    { stage: "Aquatic Life Exposure", value: 7, unit: "index" },
    { stage: "Food Chain Exposure", value: 8.7, unit: "index" },
    { stage: "Human Exposure", value: 12.3, unit: "index" },
  ],
};

function ReportDetail({ reportId }: { reportId: string }) {
  if (reportId === "simulation") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Simulation Summary</h3>
            <p className="text-sm text-muted-foreground">
              Eco Intervention Scenario &bull; {simulationData.date}
            </p>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Active
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Eco-Resilience Score</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-primary">
                  {simulationData.resilienceScore}
                </span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                +{simulationData.resilienceScore - simulationData.baselineScore} from baseline ({simulationData.baselineScore})
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Risk Reduction</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-primary">31%</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Average across all metrics</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Key Metrics</h4>
          <div className="grid grid-cols-2 gap-3">
            {simulationData.metrics.map((m) => (
              <div key={m.label} className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold">{m.value}</span>
                  <span className="text-xs text-muted-foreground">{m.unit}</span>
                </div>
                <Badge
                  variant="secondary"
                  className={`mt-1 text-[10px] ${
                    m.status === "Low"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {m.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Active Interventions</h4>
          <div className="space-y-2">
            {simulationData.interventions.map((inv) => (
              <div key={inv.name}>
                <div className="flex justify-between text-xs">
                  <span>{inv.name}</span>
                  <span className="font-medium">{inv.coverage}%</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${inv.coverage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (reportId === "comparison") {
    const scenarios = [
      { name: "Business As Usual", resilience: 64, water: -10, food: -8, carbon: -5 },
      { name: "Eco Intervention", resilience: 82, water: -55, food: -60, carbon: -31 },
      { name: "Climate Stress", resilience: 51, water: +15, food: +20, carbon: +12 },
    ];
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-bold">Impact Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="pb-3 font-medium">Scenario</th>
                <th className="pb-3 font-medium">Resilience</th>
                <th className="pb-3 font-medium">Water</th>
                <th className="pb-3 font-medium">Food Web</th>
                <th className="pb-3 font-medium">Carbon</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((s) => (
                <tr key={s.name} className="border-b border-border">
                  <td className="py-3 font-medium">{s.name}</td>
                  <td className="py-3">
                    <span className={`font-bold ${s.resilience >= 70 ? "text-primary" : s.resilience >= 55 ? "text-yellow-600" : "text-red-600"}`}>
                      {s.resilience}/100
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={s.water < 0 ? "text-primary" : "text-red-600"}>
                      {s.water > 0 ? "+" : ""}{s.water}%
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={s.food < 0 ? "text-primary" : "text-red-600"}>
                      {s.food > 0 ? "+" : ""}{s.food}%
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={s.carbon < 0 ? "text-primary" : "text-red-600"}>
                      {s.carbon > 0 ? "+" : ""}{s.carbon}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (reportId === "pathway") {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-bold">Environmental Pathway Analysis</h3>
        <p className="text-sm text-muted-foreground">
          How campus impacts flow through the environment to humans (Eco Intervention scenario).
        </p>
        <div className="space-y-3">
          {simulationData.pathwayImpact.map((p, i) => (
            <div key={p.stage}>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{p.stage}</span>
                    <span className="text-sm">
                      {p.value} <span className="text-xs text-muted-foreground">{p.unit}</span>
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(p.value / 30) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (reportId === "intervention") {
    const interventions = [
      { name: "Advanced Waste Segregation", impact: 92, cost: "Rs. 1,800,000" },
      { name: "Smart Drainage Filtration", impact: 85, cost: "Rs. 2,200,000" },
      { name: "Riparian Green Buffer", impact: 78, cost: "Rs. 800,000" },
      { name: "Campus Plastic Ban", impact: 65, cost: "Rs. 200,000" },
    ];
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-bold">Intervention Effectiveness</h3>
        <div className="space-y-3">
          {interventions.map((inv, i) => (
            <div key={inv.name} className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{inv.name}</p>
                    <p className="text-xs text-muted-foreground">{inv.cost}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">{inv.impact}</p>
                  <p className="text-[10px] text-muted-foreground">/100 impact score</p>
                </div>
              </div>
              <div className="mt-3 h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${inv.impact}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    const jsPDF = (await import("jspdf")).default;
    const html2canvas = (await import("html2canvas")).default;

    const el = reportRef.current;
    if (!el) return;

    const canvas = await html2canvas(el, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`ecotwin-${activeReport || "full"}-report.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Download comprehensive reports with all insights and charts.
          </p>
        </div>
        {activeReport && (
          <Button variant="outline" onClick={() => setActiveReport(null)}>
            Back to Reports
          </Button>
        )}
      </div>

      {activeReport ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="bg-card">
              <CardContent className="p-6" ref={reportRef}>
                <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Leaf className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold">EcoTwin GIKI</h2>
                    <p className="text-[10px] text-muted-foreground">
                      Digital Twin for a Sustainable Future
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{simulationData.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      <span>GIKI Campus</span>
                    </div>
                  </div>
                </div>
                <ReportDetail reportId={activeReport} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="bg-card">
              <CardContent className="p-5">
                <h3 className="mb-3 text-sm font-semibold">Export Options</h3>
                <Button className="w-full gap-2" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4" /> Download PDF
                </Button>
                <Button
                  variant="outline"
                  className="mt-2 w-full gap-2"
                  onClick={() => window.print()}
                >
                  <FileText className="h-4 w-4" /> Print Report
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="p-5">
                <h3 className="mb-3 text-sm font-semibold">Report Info</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scenario</span>
                    <span className="font-medium">{simulationData.scenario}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{simulationData.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reports.map((report) => (
              <Card
                key={report.id}
                className="cursor-pointer bg-card transition-all hover:shadow-md"
                onClick={() => setActiveReport(report.id)}
              >
                <CardContent className="flex h-full flex-col p-5">
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${report.color}`}
                  >
                    <report.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-sm font-semibold">{report.title}</h3>
                  <p className="mb-4 flex-1 text-xs text-muted-foreground">
                    {report.description}
                  </p>
                  <Button variant="outline" size="sm" className="w-fit gap-1">
                    View Report <ArrowRight className="h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-primary/20 bg-card">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Download className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Download Full Report</h3>
                  <p className="text-xs text-muted-foreground">
                    Comprehensive report with all insights and charts.
                  </p>
                </div>
              </div>
              <Button
                className="gap-2"
                onClick={() => {
                  setActiveReport("simulation");
                  setTimeout(handleDownloadPDF, 500);
                }}
              >
                <Download className="h-4 w-4" /> Download PDF
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
