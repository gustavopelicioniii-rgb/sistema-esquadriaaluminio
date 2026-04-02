import { ordensProducao, type StatusProducao } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/data/mockData";

const steps: { key: StatusProducao; label: string }[] = [
  { key: "aguardando", label: "Aguardando" },
  { key: "corte", label: "Corte" },
  { key: "montagem", label: "Montagem" },
  { key: "instalacao", label: "Instalação" },
  { key: "finalizado", label: "Finalizado" },
];

function ProgressSteps({ status }: { status: StatusProducao }) {
  const currentIdx = steps.findIndex((s) => s.key === status);
  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => (
        <div key={step.key} className="flex items-center gap-1">
          <div
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              i <= currentIdx
                ? i === currentIdx
                  ? "bg-primary ring-2 ring-primary/30"
                  : "bg-primary"
                : "bg-muted"
            }`}
            title={step.label}
          />
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-4 ${i < currentIdx ? "bg-primary" : "bg-muted"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

const Producao = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Produção</h1>
        <p className="text-muted-foreground text-sm">Acompanhe as ordens de produção</p>
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Progresso</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prazo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordensProducao.map((op) => (
              <TableRow key={op.id}>
                <TableCell className="font-medium">{op.id}</TableCell>
                <TableCell>{op.cliente}</TableCell>
                <TableCell>{op.produto}</TableCell>
                <TableCell><ProgressSteps status={op.status} /></TableCell>
                <TableCell><StatusBadge status={op.status} /></TableCell>
                <TableCell>{formatDate(op.prazo)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Producao;
