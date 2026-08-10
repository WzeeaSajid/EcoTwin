import { ArrowRight, Download, BarChart3, GitBranch, CheckCircle, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const reports = [
  {
    title: "Simulation Summary",
    description: "Detailed simulation results and key impact metrics.",
    icon: FileText,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Impact Comparison",
    description: "Compare different scenarios side by side.",
    icon: BarChart3,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Environmental Pathway Analysis",
    description: "Detailed analysis of the environmental pathway.",
    icon: GitBranch,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Intervention Effectiveness",
    description: "See how each intervention contributes to outcomes.",
    icon: CheckCircle,
    color: "bg-green-100 text-green-600",
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-muted-foreground">
          Download comprehensive reports with all insights and charts.
        </p>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reports.map((report) => (
          <Card key={report.title} className="bg-card transition-all hover:shadow-md">
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

      {/* Download Full Report */}
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
          <Button className="gap-2">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
