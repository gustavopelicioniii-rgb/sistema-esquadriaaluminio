import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, CheckCircle2, Circle, Printer, Trash2, GripVertical, Pencil } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ChecklistPhotos from "./ChecklistPhotos";
import type { Etapa } from "./etapasConfig";

interface Props {
  etapa: Etapa;
  pedidoId: string;
  checkStates: Record<string, boolean>;
  annotation: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleCheck: (itemKey: string, currentVal: boolean) => void;
  onSelectAll: (check: boolean) => void;
  onAnnotationChange: (text: string) => void;
  onAnnotationBlur: (text: string) => void;
  onDeleteEtapa?: () => void;
  onEditEtapa?: () => void;
  dragHandleProps?: Record<string, any>;
}

export default function EtapaCard({
  etapa,
  pedidoId,
  checkStates,
  annotation,
  isExpanded,
  onToggleExpand,
  onToggleCheck,
  onSelectAll,
  onAnnotationChange,
  onAnnotationBlur,
  onDeleteEtapa,
  onEditEtapa,
  dragHandleProps,
}: Props) {
  const checked = etapa.items.filter((i) => checkStates[i.key]).length;
  const total = etapa.items.length;
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
  const isComplete = pct === 100;
  const allChecked = etapa.items.every((i) => checkStates[i.key]);

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex w-full items-center">
        {dragHandleProps && (
          <div {...dragHandleProps} className="flex items-center px-2 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
            <GripVertical className="h-4 w-4" />
          </div>
        )}
        <button
          onClick={onToggleExpand}
          className="flex flex-1 items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
        >
      >
        <div className="flex items-center gap-3">
          {isComplete ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
          )}
          <div className="text-left">
            <p className="font-semibold text-sm">
              {etapa.label}
              {etapa.isCustom && (
                <span className="ml-2 text-[10px] bg-accent text-accent-foreground rounded px-1.5 py-0.5 font-medium">
                  Personalizada
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              Progresso: {pct}% ({checked}/{total})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[10px] font-bold",
              isComplete ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary"
            )}
          >
            {isComplete ? "Concluído" : "Pendente"}
          </span>
          <ChevronDown
            className={cn("h-4 w-4 text-muted-foreground transition-transform", isExpanded && "rotate-180")}
          />
        </div>
      </button>

      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <div
          className={cn("h-full transition-all duration-300", isComplete ? "bg-emerald-500" : "bg-primary")}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-5 py-4 space-y-4">
          {/* Select all + actions */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer">
              <Checkbox checked={allChecked} onCheckedChange={(v) => onSelectAll(!!v)} />
              Selecionar todos
            </label>
            <div className="flex items-center gap-2">
              {etapa.isCustom && onDeleteEtapa && (
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-destructive" onClick={onDeleteEtapa}>
                  <Trash2 className="h-3.5 w-3.5" />
                  Excluir etapa
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => toast({ title: "Checklist enviado", description: `Etapa "${etapa.label}" enviada.` })}
              >
                <Printer className="h-3.5 w-3.5" />
                Enviar
              </Button>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2">
            {etapa.items.map((item) => {
              const isChecked = checkStates[item.key] ?? false;
              return (
                <label
                  key={item.key}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors",
                    isChecked ? "bg-emerald-500/5 border-emerald-500/20" : "hover:bg-muted/30 border-border/50"
                  )}
                >
                  <Checkbox checked={isChecked} onCheckedChange={() => onToggleCheck(item.key, isChecked)} />
                  <span className={cn("text-sm", isChecked && "line-through text-muted-foreground")}>
                    {item.label}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Photos */}
          <ChecklistPhotos pedidoId={pedidoId} etapaId={etapa.id} />

          {/* Annotation */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Anotação</p>
            <Textarea
              placeholder="Observações sobre esta etapa..."
              value={annotation}
              onChange={(e) => onAnnotationChange(e.target.value)}
              onBlur={(e) => onAnnotationBlur(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
