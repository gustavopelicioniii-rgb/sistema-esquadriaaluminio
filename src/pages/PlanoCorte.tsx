import { planosCorte } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function CutBar({ comprimentoBarra, cortes, aproveitamento }: {
  comprimentoBarra: number;
  cortes: { comprimento: number; quantidade: number }[];
  aproveitamento: number;
}) {
  const colors = [
    "hsl(217, 91%, 53%)",
    "hsl(142, 71%, 45%)",
    "hsl(38, 92%, 50%)",
    "hsl(280, 67%, 55%)",
  ];

  const allCuts: number[] = [];
  cortes.forEach((c) => {
    for (let i = 0; i < c.quantidade; i++) allCuts.push(c.comprimento);
  });

  const usedLength = allCuts.reduce((s, c) => s + c, 0);
  const wasteLength = comprimentoBarra - usedLength;

  return (
    <div className="space-y-1">
      <div className="flex h-8 w-full rounded overflow-hidden border">
        {allCuts.map((cut, i) => (
          <div
            key={i}
            className="flex items-center justify-center text-[10px] font-semibold text-white border-r border-white/30"
            style={{
              width: `${(cut / comprimentoBarra) * 100}%`,
              backgroundColor: colors[i % colors.length],
            }}
          >
            {cut}mm
          </div>
        ))}
        {wasteLength > 0 && (
          <div
            className="flex items-center justify-center text-[10px] text-muted-foreground bg-muted"
            style={{ width: `${(wasteLength / comprimentoBarra) * 100}%` }}
          >
            {wasteLength}mm
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Barra: {comprimentoBarra}mm · Aproveitamento: <span className={aproveitamento >= 90 ? "text-success font-semibold" : "text-warning font-semibold"}>{aproveitamento}%</span>
      </p>
    </div>
  );
}

const PlanoCorte = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Plano de Corte</h1>
        <p className="text-muted-foreground text-sm">Otimização de cortes de perfis de alumínio</p>
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Cortes</TableHead>
              <TableHead className="w-[40%]">Visualização</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {planosCorte.map((pc) => (
              <TableRow key={pc.id}>
                <TableCell className="font-medium">{pc.id}</TableCell>
                <TableCell>{pc.perfil}</TableCell>
                <TableCell>
                  <div className="space-y-0.5 text-xs">
                    {pc.cortes.map((c, i) => (
                      <div key={i}>{c.comprimento}mm × {c.quantidade}</div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <CutBar comprimentoBarra={pc.comprimentoBarra} cortes={pc.cortes} aproveitamento={pc.aproveitamento} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PlanoCorte;
