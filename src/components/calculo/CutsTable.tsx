import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { CalculationOutput } from "@/types/calculation";

interface Props {
  cuts: CalculationOutput["cuts"];
}

export function CutsTable({ cuts }: Props) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">#</TableHead>
            <TableHead>Peça</TableHead>
            <TableHead>Perfil</TableHead>
            <TableHead className="text-right">Medida (mm)</TableHead>
            <TableHead className="text-center">Ângulo</TableHead>
            <TableHead className="text-center">Qtd</TableHead>
            <TableHead className="text-right">Peso (kg)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cuts.map((cut, i) => (
            <TableRow key={cut.cut_rule_id}>
              <TableCell className="text-muted-foreground">{i + 1}</TableCell>
              <TableCell className="font-medium">{cut.piece_name}</TableCell>
              <TableCell>
                <Badge variant="outline" className="font-mono text-xs">{cut.profile_code}</Badge>
              </TableCell>
              <TableCell className="text-right font-mono font-semibold text-primary">
                {cut.cut_length_mm}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={cut.cut_angle_left === 45 ? "default" : "secondary"} className="text-xs">
                  {cut.cut_angle_left}°/{cut.cut_angle_right}°
                </Badge>
              </TableCell>
              <TableCell className="text-center font-medium">{cut.quantity}</TableCell>
              <TableCell className="text-right text-muted-foreground">{cut.weight_kg.toFixed(3)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
