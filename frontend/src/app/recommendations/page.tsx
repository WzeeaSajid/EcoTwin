import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

const interventions = [
  {
    priority: 1,
    name: "Advanced Waste Segregation System",
    impact: 92,
    cost: "Rs. 1,800,000",
    score: 92,
    color: "text-primary",
  },
  {
    priority: 2,
    name: "Smart Drainage Filtration Upgrade",
    impact: 85,
    cost: "Rs. 2,200,000",
    score: 85,
    color: "text-primary",
  },
  {
    priority: 3,
    name: "Riparian Green Buffer Expansion",
    impact: 78,
    cost: "Rs. 800,000",
    score: 78,
    color: "text-primary",
  },
  {
    priority: 4,
    name: "Campus Plastic Ban & Awareness",
    impact: 65,
    cost: "Rs. 200,000",
    score: 65,
    color: "text-primary",
  },
];

function ImpactDots({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full ${
            i < Math.round(count / 20) ? "bg-primary" : "bg-muted"
          }`}
        />
      ))}
    </div>
  );
}

export default function RecommendationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Recommendations</h1>
        <p className="text-muted-foreground">
          Get data-driven intervention suggestions optimized for maximum impact.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Optimization Goal */}
        <div className="space-y-4">
          <Card className="bg-card">
            <CardContent className="p-5">
              <h3 className="mb-1 text-sm font-semibold">Optimization Goal</h3>
              <p className="mb-4 text-xs text-muted-foreground">
                Maximize Eco-Resilience within budget
              </p>
              <div className="mb-4">
                <p className="mb-1 text-xs text-muted-foreground">
                  Available Budget
                </p>
                <p className="text-2xl font-bold">Rs. 5,000,000</p>
              </div>
              <div>
                <p className="mb-2 text-xs text-muted-foreground">
                  Budget Allocation Preference
                </p>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Cost Saving</span>
                  <span>Balanced</span>
                  <span>Impact Focused</span>
                </div>
                <Slider defaultValue={[50]} max={100} step={10} className="mt-1" />
              </div>
            </CardContent>
          </Card>

          <Button className="w-full">Optimize Plan</Button>
        </div>

        {/* Middle: Recommended Intervention Plan */}
        <Card className="bg-card lg:col-span-2">
          <CardContent className="p-5">
            <h3 className="mb-4 text-sm font-semibold">
              Recommended Intervention Plan
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="pb-3 font-medium">Priority</th>
                    <th className="pb-3 font-medium">Intervention</th>
                    <th className="pb-3 font-medium">Impact</th>
                    <th className="pb-3 font-medium">Cost</th>
                    <th className="pb-3 font-medium">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {interventions.map((item) => (
                    <tr
                      key={item.priority}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-3 font-medium">{item.priority}</td>
                      <td className="py-3">{item.name}</td>
                      <td className="py-3">
                        <ImpactDots count={item.impact} />
                      </td>
                      <td className="py-3 text-muted-foreground">{item.cost}</td>
                      <td className="py-3">
                        <span className={`font-semibold ${item.color}`}>
                          {item.score}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {" "}
                          /100
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expected Outcome */}
      <Card className="bg-card">
        <CardContent className="p-6">
          <h3 className="mb-4 text-sm font-semibold">Expected Outcome</h3>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <span className="text-xl">🌿</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Eco-Resilience Score
                </p>
                <p className="text-lg font-bold">
                  82 <span className="text-muted-foreground">→</span> 91
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <span className="text-xl">💧</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Water Exposure</p>
                <p className="text-lg font-bold text-blue-600">-68%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <span className="text-xl">🐟</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Food Web Exposure
                </p>
                <p className="text-lg font-bold text-orange-600">-63%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <span className="text-xl">☁️</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Carbon Footprint</p>
                <p className="text-lg font-bold text-gray-600">-35%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
