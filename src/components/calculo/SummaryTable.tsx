import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { CalculationOutput } from '@/types/calculation';

interface Props {
  profilesSummary: CalculationOutput['profiles_summary'];
  totalAluminumWeight: number;
}

export function SummaryTable({ profilesSummary, totalAluminumWeight }: Props) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Perfil</TableHead>
            <TableHead className="text-right">Comp. (mm)</TableHead>
            <TableHead className="text-center">Barras</TableHead>
            <TableHead className="text-right">Peso/m</TableHead>
            <TableHead className="text-right">Peso Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profilesSummary.map(p => (
            <TableRow key={p.profile_code}>
              <TableCell>
                <Badge variant="outline" className="font-mono">
                  {p.profile_code}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono">{p.total_length_mm}</TableCell>
              <TableCell className="text-center font-semibold">{p.total_bars_needed}</TableCell>
              <TableCell className="text-right text-muted-foreground">
                {p.weight_per_meter.toFixed(3)}
              </TableCell>
              <TableCell className="text-right font-mono font-semibold text-primary">
                {p.total_weight_kg.toFixed(3)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="font-bold border-t-2">
            <TableCell colSpan={2}>TOTAL</TableCell>
            <TableCell className="text-center">
              {profilesSummary.reduce((s, p) => s + p.total_bars_needed, 0)}
            </TableCell>
            <TableCell />
            <TableCell className="text-right text-primary">
              {totalAluminumWeight.toFixed(3)} kg
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
