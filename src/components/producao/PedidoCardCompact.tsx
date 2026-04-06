import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";
import {
  User, MoreVertical, CheckCircle2,
  RefreshCcw, CreditCard, FileText, Printer,
  Eye, Pencil, ListChecks, Share2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Pedido } from "@/pages/Producao";

type DialogType = "reagendar" | "pagamentos" | "contrato" | "impressoes" | "etapa" | "custos" | "editar" | "tarefas" | "compartilhar";

const actionItems: { key: DialogType; icon: React.ElementType; label: string }[] = [
  { key: "reagendar", icon: RefreshCcw, label: "Alterar prazo" },
  { key: "pagamentos", icon: CreditCard, label: "Pagamentos" },
  { key: "custos", icon: Eye, label: "Ver custos" },
  { key: "contrato", icon: FileText, label: "Contrato" },
  { key: "impressoes", icon: Printer, label: "Impressões" },
  { key: "editar", icon: Pencil, label: "Editar serviço" },
  { key: "tarefas", icon: ListChecks, label: "Tarefas" },
  { key: "compartilhar", icon: Share2, label: "Compartilhar" },
];

function getUrgencyBadge(op: Pedido) {
  if (op.status === "concluido") {
    return { label: "Concluído", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };
  }
  const d = op.dias_restantes ?? 0;
  if (d < 0) return { label: `Atrasado ${Math.abs(d)}d`, className: "bg-destructive/15 text-destructive" };
  if (d <= 7) return { label: `${d}d restantes`, className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
  if (d <= 15) return { label: `${d}d restantes`, className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" };
  return { label: `${d}d restantes`, className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };
}

interface Props {
  pedido: Pedido;
  progress?: number;
  onOpenDetail: (p: Pedido) => void;
  onOpenDialog: (type: string, p: Pedido) => void;
  onConcluir: (p: Pedido) => void;
  onCancelar: (p: Pedido) => void;
  isDragging?: boolean;
}

export default function PedidoCardCompact({ pedido: op, progress: progressProp, onOpenDetail, onOpenDialog, onConcluir, onCancelar, isDragging }: Props) {
  const badge = getUrgencyBadge(op);
  const progress = progressProp ?? (op.status === "concluido" ? 100 : 0);

  const handleAction = (key: DialogType) => {
    if (key === "tarefas") {
      onOpenDetail(op);
    } else if (key === "compartilhar") {
      const text = `Pedido ${op.pedido_num} - ${op.cliente} - ${op.etapa || ""}`;
      if (navigator.share) {
        navigator.share({ title: `Pedido ${op.pedido_num}`, text });
      } else {
        navigator.clipboard.writeText(text);
        toast({ title: "Copiado!", description: "Informações do pedido copiadas." });
      }
    } else if (key === "custos") {
      onOpenDialog("pagamentos", op);
    } else {
      onOpenDialog(key, op);
    }
  };

  return (
    <Card className={cn(
      "shadow-sm border-border/50 transition-shadow",
      isDragging && "shadow-lg ring-2 ring-primary/30"
    )}>
      <CardContent className="p-3 sm:p-4 space-y-2.5">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2">
          <h3
            className="font-bold text-sm sm:text-base cursor-pointer hover:text-primary transition-colors truncate"
            onClick={() => onOpenDetail(op)}
          >
            PEDIDO {op.pedido_num}
          </h3>
            <span className={cn("rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-bold whitespace-nowrap", badge.className)}>
              {badge.label}
            </span>
          </div>
        </div>

        {/* Client + Etapa */}
        <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
            <User className="h-3 w-3 shrink-0" />
            <span className="truncate">{op.cliente}</span>
          </div>
          {op.etapa && (
            <span className="font-semibold uppercase text-[10px] sm:text-xs text-muted-foreground shrink-0">
              {op.etapa}
            </span>
          )}
        </div>

        {/* Value + Progress */}
        <div className="flex items-center justify-between gap-2">
          <p className={cn(
            "text-sm sm:text-base font-bold",
            op.valor > 0 ? "text-emerald-600" : "text-muted-foreground"
          )}>
            {op.valor > 0 ? formatCurrency(op.valor) : "Sem valor"}
          </p>
          <div className="flex items-center gap-2 min-w-[100px]">
            <Progress value={progress} className="h-1.5 flex-1" />
            <span className="text-[10px] text-muted-foreground font-medium">{progress}%</span>
          </div>
        </div>

        {/* Action buttons row */}
        <div className="flex flex-wrap gap-1 pt-0.5">
          {actionItems.map(({ key, icon: Icon, label }) => (
            <Button
              key={key}
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-[10px] sm:text-xs gap-1 text-muted-foreground hover:text-foreground"
              onClick={() => handleAction(key)}
              title={label}
            >
              <Icon className="h-3 w-3 shrink-0" />
              <span className="hidden sm:inline">{label}</span>
            </Button>
          ))}
        </div>

        {/* Quick actions row */}
        <div className="flex gap-1.5 pt-0.5">
          <Button variant="outline" size="sm" className="flex-1 text-[10px] sm:text-xs h-7" onClick={() => onCancelar(op)}>
            Cancelar
          </Button>
          <Button size="sm" className="flex-1 text-[10px] sm:text-xs h-7" onClick={() => onConcluir(op)}>
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Concluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
