import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { CalculationOutput } from "@/types/calculation";

interface Props {
  glasses: CalculationOutput["glasses"];
}

export function GlassTable({ glasses }: Props) {
  return (
    <div className="space-y-4">
      {/* Glass visual preview */}
      {glasses.length > 0 && (
        <div className="flex flex-wrap gap-4 justify-center py-2">
          {glasses.map((glass, i) => {
            const aspectRatio = glass.width_mm / glass.height_mm;
            const maxW = 120;
            const maxH = 100;
            const w = aspectRatio >= 1 ? maxW : maxH * aspectRatio;
            const h = aspectRatio >= 1 ? maxW / aspectRatio : maxH;
            return (
              <div key={glass.glass_rule_id + "-preview-" + i} className="flex flex-col items-center gap-1.5">
                <div
                  className="relative border-2 border-sky-300/60 bg-sky-100/40 dark:bg-sky-900/20 rounded-sm flex items-center justify-center"
                  style={{ width: w, height: h }}
                >
                  <span className="text-[9px] text-sky-600 dark:text-sky-400 font-mono font-medium">
                    {glass.width_mm}×{glass.height_mm}
                  </span>
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] text-muted-foreground font-mono">
                    {glass.width_mm} mm
                  </span>
                  <span className="absolute -right-10 top-1/2 -translate-y-1/2 text-[8px] text-muted-foreground font-mono rotate-90 whitespace-nowrap">
                    {glass.height_mm} mm
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground font-medium mt-1">{glass.glass_name} ×{glass.quantity}</span>
              </div>
            );
          })}
        </div>
      )}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vidro</TableHead>
              <TableHead className="text-right">Largura</TableHead>
              <TableHead className="text-right">Altura</TableHead>
              <TableHead className="text-center">Qtd</TableHead>
              <TableHead className="text-right">Área (m²)</TableHead>
              <TableHead>Tipo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {glasses.map((glass) => (
              <TableRow key={glass.glass_rule_id}>
                <TableCell className="font-medium">{glass.glass_name}</TableCell>
                <TableCell className="text-right font-mono">{glass.width_mm}</TableCell>
                <TableCell className="text-right font-mono">{glass.height_mm}</TableCell>
                <TableCell className="text-center">{glass.quantity}</TableCell>
                <TableCell className="text-right font-mono text-primary font-semibold">
                  {glass.area_m2.toFixed(4)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs capitalize">{glass.glass_name}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
