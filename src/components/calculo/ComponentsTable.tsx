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
  components: CalculationOutput['components'];
}

export function ComponentsTable({ components }: Props) {
  if (components.length === 0) {
    return (
      <p className="text-muted-foreground text-sm text-center py-8">
        Nenhum componente cadastrado para esta tipologia.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Componente</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-center">Qtd</TableHead>
            <TableHead>Unidade</TableHead>
            <TableHead className="text-right">Comp. Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {components.map((comp, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{comp.component_name}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs capitalize">
                  {comp.component_type}
                </Badge>
              </TableCell>
              <TableCell className="text-center font-medium">{comp.quantity}</TableCell>
              <TableCell className="text-muted-foreground">{comp.unit}</TableCell>
              <TableCell className="text-right font-mono">
                {comp.total_length_mm ? `${comp.total_length_mm} mm` : '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
