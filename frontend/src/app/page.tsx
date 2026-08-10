import {
  Leaf,
  Droplets,
  Fish,
  Cloud,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Recycle,
  Filter,
  TreePine,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

function MetricCard({
  icon: Icon,
  iconColor,
  label,
  value,
  unit,
  status,
  statusColor,
  trend,
}: {
  icon: React.ElementType;
  iconColor: string;
  label: string;
  value: number;
  unit: string;
  status: string;
  statusColor: string;
  trend: "up" | "down";
}) {
  return (
    <Card className="bg-card">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${iconColor}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{value}</span>
              <span className="text-sm text-muted-foreground">/ {unit}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${statusColor}`}>{status}</span>
          {trend === "down" ? (
            <TrendingDown className="h-4 w-4 text-primary" />
          ) : (
            <TrendingUp className="h-4 w-4 text-orange-500" />
          )}
        </div>
        <div className="mt-3 h-8 w-full">
          <svg viewBox="0 0 200 40" className="h-full w-full">
            <polyline
              fill="none"
              stroke={
                trend === "down" ? "var(--primary)" : "var(--accent)"
              }
              strokeWidth="2"
              points={
                trend === "down"
                  ? "0,30 30,25 60,28 90,18 120,20 150,12 180,15 200,10"
                  : "0,15 30,18 60,14 90,22 120,20 150,28 180,25 200,30"
              }
            />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">Welcome to EcoTwin GIKI</h1>
        <p className="text-muted-foreground">
          Monitor. Understand. Act for a sustainable future.
        </p>
      </div>

      {/* Top Row: Campus Image + Score + Highlights */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Campus Image */}
        <Card className="relative overflow-hidden bg-card lg:col-span-1">
          <div className="relative h-full min-h-[300px] bg-gradient-to-br from-primary/20 to-primary/5">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  GIKI Campus
                </p>
                <p className="text-xs text-muted-foreground">
                  Satellite View
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Eco-Resilience Score */}
        <Card className="bg-card">
          <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Leaf className="h-7 w-7 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Eco-Resilience Score</p>
            <div className="my-2 flex items-baseline gap-1">
              <span className="text-5xl font-bold text-primary">82</span>
              <span className="text-lg text-muted-foreground">/100</span>
            </div>
            <Badge
              variant="secondary"
              className="mb-4 bg-primary/10 text-primary"
            >
              High Resilience
            </Badge>
            <Progress value={82} className="mb-3 w-full" />
            <p className="text-sm text-muted-foreground">
              Your campus is more resilient compared to the baseline.
            </p>
            <Button variant="outline" className="mt-4 gap-2">
              View Details <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Key Highlights */}
        <Card className="bg-card">
          <CardContent className="p-6">
            <h3 className="mb-4 text-sm font-semibold">Key Highlights</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    18% increase in resilience from baseline
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <Droplets className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Water exposure reduced by 55%
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100">
                  <Fish className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Food web exposure reduced by 60%
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
                  <Cloud className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Carbon footprint reduced by 31%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={Leaf}
          iconColor="bg-primary/10 text-primary"
          label="Waste Pressure"
          value={42}
          unit="100"
          status="Moderate"
          statusColor="text-primary"
          trend="down"
        />
        <MetricCard
          icon={Droplets}
          iconColor="bg-blue-100 text-blue-600"
          label="Water Exposure Index"
          value={23}
          unit="100"
          status="Low"
          statusColor="text-blue-600"
          trend="down"
        />
        <MetricCard
          icon={Fish}
          iconColor="bg-orange-100 text-orange-600"
          label="Food Web Exposure"
          value={13}
          unit="100"
          status="Low"
          statusColor="text-orange-600"
          trend="down"
        />
        <MetricCard
          icon={Cloud}
          iconColor="bg-gray-100 text-gray-600"
          label="Carbon Footprint"
          value={1.48}
          unit="tCO₂/day"
          status="Moderate"
          statusColor="text-accent"
          trend="up"
        />
      </div>

      {/* Bottom Row: Recent Simulation + CTA */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Simulation */}
        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Leaf className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Recent Simulation</h3>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">
                      Eco Intervention Scenario
                    </p>
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary"
                    >
                      Active
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Simulated on 25 May 2025
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                View Scenario <ArrowRight className="h-3 w-3" />
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Recycle className="h-5 w-5 text-primary" />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Waste Interception
                </p>
                <p className="text-sm font-bold">50%</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Filter className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Drainage Filtration
                </p>
                <p className="text-sm font-bold">30%</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <TreePine className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Green Buffer
                </p>
                <p className="text-sm font-bold">20%</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                  <Zap className="h-5 w-5 text-yellow-600" />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Renewable Energy
                </p>
                <p className="text-sm font-bold">40%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Card */}
        <Card className="relative overflow-hidden bg-primary text-primary-foreground">
          <CardContent className="relative z-10 flex h-full flex-col justify-between p-6">
            <div>
              <h3 className="mb-2 text-xl font-bold">
                Decisions today shape tomorrow.
              </h3>
              <p className="mb-6 text-sm text-primary-foreground/80">
                Explore scenarios, understand impacts and build a resilient
                future for GIKI and beyond.
              </p>
            </div>
            <Button className="w-fit gap-2 bg-white text-primary hover:bg-white/90">
              Explore Digital Twin <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
          <div className="absolute right-0 bottom-0 opacity-10">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" fill="currentColor" />
            </svg>
          </div>
        </Card>
      </div>
    </div>
  );
}
