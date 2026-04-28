import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ProfileCrossSection } from '@/components/orcamento/ProfileCrossSection';
import type { CalculationOutput } from '@/types/calculation';

interface Props {
  result: CalculationOutput;
}

export function CutsTable({ result }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold">Lista de Corte</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Perfil</TableHead>
                <TableHead className="text-center">Medida (mm)</TableHead>
                <TableHead className="text-center hidden sm:table-cell">Qtd</TableHead>
                <TableHead className="text-center hidden md:table-cell">Ângulo</TableHead>
                <TableHead className="text-right hidden sm:table-cell">Peso (kg)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.cuts.map(cut => (
                <TableRow key={cut.cut_rule_id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="shrink-0 w-9 h-9 rounded-md bg-muted/50 flex items-center justify-center text-primary">
                        <ProfileCrossSection
                          profileType={cut.piece_function || cut.piece_name}
                          profileCode={cut.profile_code}
                          size={32}
                        />
                      </div>
                      <div>
                        <span className="font-bold text-xs">{cut.profile_code}</span>
                        <p className="text-[10px] text-muted-foreground">{cut.piece_name}</p>
                        <div className="flex gap-2 sm:hidden text-[10px] text-muted-foreground mt-0.5">
                          <span>×{cut.quantity}</span>
                          <span>{cut.weight_kg.toFixed(2)}kg</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-semibold font-mono">
                    {cut.cut_length_mm}
                  </TableCell>
                  <TableCell className="text-center font-semibold hidden sm:table-cell">
                    {cut.quantity}
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    <div className="flex justify-center gap-1">
                      <Badge
                        variant={cut.cut_angle_left === 45 ? 'default' : 'secondary'}
                        className="text-[10px] px-2"
                      >
                        {cut.cut_angle_left}°
                      </Badge>
                      <Badge
                        variant={cut.cut_angle_right === 45 ? 'default' : 'secondary'}
                        className="text-[10px] px-2"
                      >
                        {cut.cut_angle_right}°
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono hidden sm:table-cell">
                    {cut.weight_kg.toFixed(3)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="px-4 py-2.5 bg-muted/30 border-t text-xs text-muted-foreground flex justify-between">
          <span>
            {result.profiles_summary.length} perfis •{' '}
            {result.cuts.reduce((s, c) => s + c.quantity, 0)} peças
          </span>
          <span>Peso: {result.total_aluminum_weight_kg.toFixed(2)} kg</span>
        </div>
      </CardContent>
    </Card>
  );
}
