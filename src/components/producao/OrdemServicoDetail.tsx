import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronLeft, CheckCircle2, Circle, Printer } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Pedido } from "@/pages/Producao";

interface Props {
  pedido: Pedido;
  onBack: () => void;
}

interface ChecklistItem {
  key: string;
  label: string;
  checked: boolean;
}

interface Etapa {
  id: string;
  label: string;
  items: { key: string; label: string }[];
}

const etapasConfig: Etapa[] = [
  {
    id: "conferir_medidas",
    label: "Conferir medidas do vão",
    items: [
      { key: "medir_largura", label: "Medir largura do vão" },
      { key: "medir_altura", label: "Medir altura do vão" },
      { key: "verificar_prumo", label: "Verificar prumo e nível" },
      { key: "conferir_esquadro", label: "Conferir esquadro" },
      { key: "registrar_medidas", label: "Registrar medidas no sistema" },
      { key: "foto_vao", label: "Tirar foto do vão" },
    ],
  },
  {
    id: "solicitar_materiais",
    label: "Solicitar materiais",
    items: [
      { key: "listar_acessorios", label: "Acessórios – listar e conferir" },
      { key: "listar_aluminios", label: "Alumínios – listar perfis necessários" },
      { key: "listar_vidros", label: "Vidros – especificar tipo, cor e espessura" },
      { key: "enviar_pedido_fornecedor", label: "Enviar pedido ao fornecedor" },
      { key: "confirmar_prazo", label: "Confirmar prazo de entrega" },
    ],
  },
  {
    id: "recebimento",
    label: "Recebimento dos materiais",
    items: [
      { key: "conferir_nf", label: "Conferir nota fiscal" },
      { key: "conferir_quantidades", label: "Conferir quantidades recebidas" },
      { key: "verificar_danos", label: "Verificar danos no transporte" },
      { key: "armazenar", label: "Armazenar materiais corretamente" },
      { key: "dar_baixa_estoque", label: "Dar baixa no estoque" },
    ],
  },
  {
    id: "instalacao",
    label: "Instalação",
    items: [
      { key: "preparar_local", label: "Preparar local de instalação" },
      { key: "montar_esquadria", label: "Montar esquadria" },
      { key: "fixar_contramarco", label: "Fixar contramarco" },
      { key: "instalar_vidros", label: "Instalar vidros" },
      { key: "aplicar_silicone", label: "Aplicar silicone e vedação" },
      { key: "testar_funcionamento", label: "Testar funcionamento (abrir/fechar)" },
      { key: "limpar_local", label: "Limpar local após instalação" },
    ],
  },
  {
    id: "entrega",
    label: "Entrega",
    items: [
      { key: "agendar_entrega", label: "Agendar data de entrega com cliente" },
      { key: "embalar_pecas", label: "Embalar peças para transporte" },
      { key: "carregar_veiculo", label: "Carregar veículo" },
      { key: "entregar_cliente", label: "Entregar ao cliente" },
      { key: "coletar_assinatura", label: "Coletar assinatura de recebimento" },
    ],
  },
  {
    id: "vistoria",
    label: "Vistoria",
    items: [
      { key: "verificar_acabamento", label: "Verificar acabamento final" },
      { key: "testar_vedacao", label: "Testar vedação contra água" },
      { key: "verificar_ferragens", label: "Verificar ferragens e fechaduras" },
      { key: "cliente_aprovar", label: "Cliente aprovar o serviço" },
      { key: "registrar_garantia", label: "Registrar garantia" },
      { key: "foto_final", label: "Tirar foto do serviço finalizado" },
    ],
  },
];

export default function OrdemServicoDetail({ pedido, onBack }: Props) {
  const [checkStates, setCheckStates] = useState<Record<string, Record<string, boolean>>>({});
  const [annotations, setAnnotations] = useState<Record<string, string>>({});
  const [expandedEtapas, setExpandedEtapas] = useState<Record<string, boolean>>({ conferir_medidas: true });
  const [loading, setLoading] = useState(true);

  const fetchChecklist = useCallback(async () => {
    const { data, error } = await supabase
      .from("pedido_checklists")
      .select("*")
      .eq("pedido_id", pedido.id);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }

    const states: Record<string, Record<string, boolean>> = {};
    const annots: Record<string, string> = {};

    (data || []).forEach((row: any) => {
      if (!states[row.etapa]) states[row.etapa] = {};
      states[row.etapa][row.item_key] = row.checked;
      if (row.item_key === "_anotacao") {
        annots[row.etapa] = row.anotacao || "";
      }
    });

    setCheckStates(states);
    setAnnotations(annots);
    setLoading(false);
  }, [pedido.id]);

  useEffect(() => {
    fetchChecklist();
  }, [fetchChecklist]);

  const toggleCheck = async (etapaId: string, itemKey: string, currentVal: boolean) => {
    const newVal = !currentVal;
    setCheckStates((prev) => ({
      ...prev,
      [etapaId]: { ...prev[etapaId], [itemKey]: newVal },
    }));

    const { error } = await supabase.from("pedido_checklists").upsert(
      {
        pedido_id: pedido.id,
        etapa: etapaId,
        item_key: itemKey,
        checked: newVal,
      } as any,
      { onConflict: "pedido_id,etapa,item_key" }
    );

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
      setCheckStates((prev) => ({
        ...prev,
        [etapaId]: { ...prev[etapaId], [itemKey]: currentVal },
      }));
    }
  };

  const saveAnnotation = async (etapaId: string, text: string) => {
    setAnnotations((prev) => ({ ...prev, [etapaId]: text }));

    await supabase.from("pedido_checklists").upsert(
      {
        pedido_id: pedido.id,
        etapa: etapaId,
        item_key: "_anotacao",
        checked: false,
        anotacao: text,
      } as any,
      { onConflict: "pedido_id,etapa,item_key" }
    );
  };

  const selectAll = async (etapaId: string, items: { key: string }[], check: boolean) => {
    const newStates = { ...checkStates };
    if (!newStates[etapaId]) newStates[etapaId] = {};
    items.forEach((item) => {
      newStates[etapaId][item.key] = check;
    });
    setCheckStates(newStates);

    for (const item of items) {
      await supabase.from("pedido_checklists").upsert(
        {
          pedido_id: pedido.id,
          etapa: etapaId,
          item_key: item.key,
          checked: check,
        } as any,
        { onConflict: "pedido_id,etapa,item_key" }
      );
    }
  };

  const getProgress = (etapaId: string, items: { key: string }[]) => {
    const states = checkStates[etapaId] || {};
    const checked = items.filter((i) => states[i.key]).length;
    return { checked, total: items.length, pct: items.length > 0 ? Math.round((checked / items.length) * 100) : 0 };
  };

  const toggleExpand = (etapaId: string) => {
    setExpandedEtapas((prev) => ({ ...prev, [etapaId]: !prev[etapaId] }));
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Carregando checklist...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-xl font-bold">Serviço {pedido.pedido_num}</h2>
          <p className="text-sm text-muted-foreground">{pedido.cliente}</p>
        </div>
      </div>

      {/* Etapas */}
      {etapasConfig.map((etapa, idx) => {
        const progress = getProgress(etapa.id, etapa.items);
        const isExpanded = expandedEtapas[etapa.id] ?? false;
        const isComplete = progress.pct === 100;
        const allChecked = etapa.items.every((i) => checkStates[etapa.id]?.[i.key]);

        return (
          <div key={etapa.id} className="rounded-lg border bg-card overflow-hidden">
            {/* Etapa header */}
            <button
              onClick={() => toggleExpand(etapa.id)}
              className="flex w-full items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                {isComplete ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
                <div className="text-left">
                  <p className="font-semibold text-sm">{etapa.label}</p>
                  <p className="text-xs text-muted-foreground">
                    Progresso: {progress.pct}% ({progress.checked}/{progress.total})
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
                style={{ width: `${progress.pct}%` }}
              />
            </div>

            {/* Expanded content */}
            {isExpanded && (
              <div className="px-5 py-4 space-y-4">
                {/* Select all */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer">
                    <Checkbox
                      checked={allChecked}
                      onCheckedChange={(v) => selectAll(etapa.id, etapa.items, !!v)}
                    />
                    Selecionar todos
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={() => toast({ title: "Checklist enviado", description: `Etapa "${etapa.label}" enviada.` })}
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Enviar checklist
                  </Button>
                </div>

                {/* Checklist items */}
                <div className="space-y-2">
                  {etapa.items.map((item) => {
                    const isChecked = checkStates[etapa.id]?.[item.key] ?? false;
                    return (
                      <label
                        key={item.key}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors",
                          isChecked
                            ? "bg-emerald-500/5 border-emerald-500/20"
                            : "hover:bg-muted/30 border-border/50"
                        )}
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleCheck(etapa.id, item.key, isChecked)}
                        />
                        <span
                          className={cn(
                            "text-sm",
                            isChecked && "line-through text-muted-foreground"
                          )}
                        >
                          {item.label}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {/* Annotation */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Anotação
                  </p>
                  <Textarea
                    placeholder="Observações sobre esta etapa..."
                    value={annotations[etapa.id] || ""}
                    onChange={(e) => setAnnotations((prev) => ({ ...prev, [etapa.id]: e.target.value }))}
                    onBlur={(e) => saveAnnotation(etapa.id, e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
