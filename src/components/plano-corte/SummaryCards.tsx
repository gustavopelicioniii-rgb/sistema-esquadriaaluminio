import { Card, CardContent } from "@/components/ui/card";
import { Scissors, Boxes, BarChart3, Weight } from "lucide-react";
import type { CalculationOutput, OptimizationResult } from "@/types/calculation";

interface Props {
  result: CalculationOutput;
  barResults: OptimizationResult[];
}

export function PlanoSummaryCards({ result, barResults }: Props) {
  const totalPieces = result.cuts.reduce((s, c) => s + c.quantity, 0);
  const totalBars = barResults.reduce((s, o) => s + o.total_bars, 0);
  const totalWaste = barResults.reduce((s, o) => s + o.total_waste_mm, 0);
  const totalBarLength = barResults.reduce((s, o) => s + o.total_bars * o.bar_length_mm, 0);
  const wastePct = totalBarLength > 0 ? ((totalWaste / totalBarLength) * 100).toFixed(1) : "0";

  const cards = [
    { icon: Scissors, label: "Total Peças", value: String(totalPieces), color: "text-blue-600" },
    { icon: Boxes, label: "Barras", value: String(totalBars), color: "text-indigo-600" },
    { icon: BarChart3, label: "Desperdício", value: `${wastePct}%`, color: "text-amber-600" },
    { icon: Weight, label: "Peso Total", value: `${result.total_aluminum_weight_kg.toFixed(2)} kg`, color: "text-emerald-600" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map((c) => (
        <Card key={c.label}>
          <CardContent className="p-3 flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-muted/50 ${c.color}`}>
              <c.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{c.label}</p>
              <p className="text-lg font-bold leading-tight">{c.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
