import { Card, CardContent } from "@/components/ui/card";
import { Layers, Weight, Grid3X3, Package } from "lucide-react";
import type { CalculationOutput } from "@/types/calculation";

interface Props {
  result: CalculationOutput;
}

export function SummaryCards({ result }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Layers className="h-3.5 w-3.5" />
            Peças de Alumínio
          </div>
          <div className="text-lg sm:text-2xl font-bold text-foreground">
            {result.cuts.reduce((s, c) => s + c.quantity, 0)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Weight className="h-3.5 w-3.5" />
            Peso Total Alumínio
          </div>
          <div className="text-lg sm:text-2xl font-bold text-foreground">
            {result.total_aluminum_weight_kg.toFixed(2)} kg
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Grid3X3 className="h-3.5 w-3.5" />
            Área de Vidro
          </div>
          <div className="text-lg sm:text-2xl font-bold text-foreground">
            {result.total_glass_area_m2.toFixed(4)} m²
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Package className="h-3.5 w-3.5" />
            Barras Necessárias
          </div>
          <div className="text-lg sm:text-2xl font-bold text-foreground">
            {result.profiles_summary.reduce((s, p) => s + p.total_bars_needed, 0)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
