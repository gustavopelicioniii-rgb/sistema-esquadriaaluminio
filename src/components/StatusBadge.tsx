import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  aprovado: "bg-success/15 text-success border-success/20",
  pendente: "bg-warning/15 text-warning border-warning/20",
  recusado: "bg-destructive/15 text-destructive border-destructive/20",
  em_analise: "bg-primary/15 text-primary border-primary/20",
  pago: "bg-success/15 text-success border-success/20",
  atrasado: "bg-destructive/15 text-destructive border-destructive/20",
  aguardando: "bg-warning/15 text-warning border-warning/20",
  corte: "bg-primary/15 text-primary border-primary/20",
  montagem: "bg-primary/15 text-primary border-primary/20",
  instalacao: "bg-[hsl(280,67%,55%)]/15 text-[hsl(280,67%,55%)] border-[hsl(280,67%,55%)]/20",
  finalizado: "bg-success/15 text-success border-success/20",
  novo: "bg-primary/15 text-primary border-primary/20",
  em_orcamento: "bg-warning/15 text-warning border-warning/20",
  negociacao: "bg-[hsl(280,67%,55%)]/15 text-[hsl(280,67%,55%)] border-[hsl(280,67%,55%)]/20",
  fechado: "bg-success/15 text-success border-success/20",
};

const statusLabels: Record<string, string> = {
  aprovado: "Aprovado",
  pendente: "Pendente",
  recusado: "Recusado",
  em_analise: "Em Análise",
  pago: "Pago",
  atrasado: "Atrasado",
  aguardando: "Aguardando",
  corte: "Corte",
  montagem: "Montagem",
  instalacao: "Instalação",
  finalizado: "Finalizado",
  novo: "Novo",
  em_orcamento: "Em Orçamento",
  negociacao: "Negociação",
  fechado: "Fechado",
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        statusStyles[status] || "bg-muted text-muted-foreground border-border",
        className
      )}
    >
      {label || statusLabels[status] || status}
    </span>
  );
}
