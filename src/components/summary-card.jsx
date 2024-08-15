import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, DollarSign } from "lucide-react";

function SummaryCard({ title, value, description, icon: Icon }) {
  return (
    <Card className="bg-card text-card-foreground shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

export function SummarySection({ effectiveness }) {
  const { percentage, hits, total, profit } = effectiveness;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <SummaryCard
        title="Effectiveness"
        value={`${percentage.toFixed(2)}%`}
        description={`${hits} hits out of ${total} predictions`}
        icon={Target}
      />
      <SummaryCard
        title="Total Predictions"
        value={total}
        description="Completed predictions"
        icon={TrendingUp}
      />
      <SummaryCard
        title="Total Profit"
        value={`€${profit.toFixed(2)}`}
        description="Accumulated profit"
        icon={DollarSign}
      />
    </div>
  );
}
