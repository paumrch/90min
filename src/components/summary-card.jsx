import { Activity } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

function SummaryCard({ title, value, description }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

export function SummarySection() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <SummaryCard
        title="Últimos 7 Días"
        value="70%"
        description="de acierto"
      />
      <SummaryCard
        title="Últimos 30 Días"
        value="65%"
        description="de acierto"
      />
      <SummaryCard title="Total" value="68%" description="de acierto global" />
    </div>
  );
}
