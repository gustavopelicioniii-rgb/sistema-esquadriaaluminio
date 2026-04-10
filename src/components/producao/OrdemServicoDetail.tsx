import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, CheckCircle2, Circle, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Pedido } from "@/pages/Producao";
import { defaultEtapasConfig, type Etapa } from "./checklist/etapasConfig";
import EtapaCard from "./checklist/EtapaCard";
import AddEtapaDialog from "./checklist/AddEtapaDialog";
import EditEtapaDialog from "./checklist/EditEtapaDialog";
import CalculoFilters from "./CalculoFilters";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";

interface Props {
  pedido: Pedido;
  onBack: () => void;
}

export default function OrdemServicoDetail({ pedido, onBack }: Props) {
  const [etapas, setEtapas] = useState<Etapa[]>(defaultEtapasConfig);
  const [checkStates, setCheckStates] = useState<Record<string, Record<string, boolean>>>({});
  const [annotations, setAnnotations] = useState<Record<string, string>>({});
  const [expandedEtapas, setExpandedEtapas] = useState<Record<string, boolean>>({ conferir_medidas: true });
  const [loading, setLoading] = useState(true);
  const [showAddEtapa, setShowAddEtapa] = useState(false);
  const [editingEtapa, setEditingEtapa] = useState<Etapa | null>(null);

  // Drag state
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const fetchCustomEtapas = useCallback(async () => {
    const { data: customEtapas } = await supabase
      .from("pedido_custom_etapas")
      .select("*")
      .eq("pedido_id", pedido.id)
      .order("ordem");

    if (!customEtapas || customEtapas.length === 0) return [];

    const etapaIds = (customEtapas as any[]).map((e) => e.id);
    const { data: customItems } = await supabase
      .from("pedido_custom_items")
      .select("*")
      .in("etapa_id", etapaIds)
      .order("ordem");

    return (customEtapas as any[]).map((e) => ({
      id: e.etapa_key,
      label: e.label,
      isCustom: true,
      dbId: e.id,
      items: ((customItems as any[]) || [])
        .filter((i) => i.etapa_id === e.id)
        .map((i) => ({ key: i.item_key, label: i.label })),
    })) as Etapa[];
  }, [pedido.id]);

  const fetchChecklist = useCallback(async () => {
    const { data, error } = await supabase
      .from("pedido_checklists")
      .select("*")
      .eq("pedido_id", pedido.id);

    if (error) {
      toast.error("Erro", { description: error.message });
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
  }, [pedido.id]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const custom = await fetchCustomEtapas();
    setEtapas([...defaultEtapasConfig, ...custom]);
    await fetchChecklist();
    setLoading(false);
  }, [fetchCustomEtapas, fetchChecklist]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const toggleCheck = async (etapaId: string, itemKey: string, currentVal: boolean) => {
    const newVal = !currentVal;
    setCheckStates((prev) => ({
      ...prev,
      [etapaId]: { ...prev[etapaId], [itemKey]: newVal },
    }));

    const { error } = await supabase.from("pedido_checklists").upsert(
      { pedido_id: pedido.id, etapa: etapaId, item_key: itemKey, checked: newVal } as any,
      { onConflict: "pedido_id,etapa,item_key" }
    );

    if (error) {
      toast.error("Erro ao salvar", { description: error.message });
      setCheckStates((prev) => ({
        ...prev,
        [etapaId]: { ...prev[etapaId], [itemKey]: currentVal },
      }));
    }
  };

  const saveAnnotation = async (etapaId: string, text: string) => {
    setAnnotations((prev) => ({ ...prev, [etapaId]: text }));
    await supabase.from("pedido_checklists").upsert(
      { pedido_id: pedido.id, etapa: etapaId, item_key: "_anotacao", checked: false, anotacao: text } as any,
      { onConflict: "pedido_id,etapa,item_key" }
    );
  };

  const selectAll = async (etapaId: string, items: { key: string }[], check: boolean) => {
    const newStates = { ...checkStates };
    if (!newStates[etapaId]) newStates[etapaId] = {};
    items.forEach((item) => { newStates[etapaId][item.key] = check; });
    setCheckStates(newStates);

    for (const item of items) {
      await supabase.from("pedido_checklists").upsert(
        { pedido_id: pedido.id, etapa: etapaId, item_key: item.key, checked: check } as any,
        { onConflict: "pedido_id,etapa,item_key" }
      );
    }
  };

  const deleteCustomEtapa = async (etapa: Etapa) => {
    if (!etapa.dbId) return;
    await supabase.from("pedido_custom_etapas").delete().eq("id", etapa.dbId);
    await supabase.from("pedido_checklists").delete().eq("pedido_id", pedido.id).eq("etapa", etapa.id);
    toast({ title: "Etapa excluída", description: `"${etapa.label}" foi removida.` });
    loadAll();
  };

  // Drag and drop handlers
  const handleDragStart = (idx: number) => {
    setDragIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setOverIdx(idx);
  };

  const handleDrop = async (idx: number) => {
    if (dragIdx === null || dragIdx === idx) {
      setDragIdx(null);
      setOverIdx(null);
      return;
    }

    const newEtapas = [...etapas];
    const [moved] = newEtapas.splice(dragIdx, 1);
    newEtapas.splice(idx, 0, moved);
    setEtapas(newEtapas);
    setDragIdx(null);
    setOverIdx(null);

    // Persist order for custom etapas
    const customInOrder = newEtapas.filter((e) => e.isCustom && e.dbId);
    for (let i = 0; i < customInOrder.length; i++) {
      await supabase
        .from("pedido_custom_etapas")
        .update({ ordem: i } as any)
        .eq("id", customInOrder[i].dbId!);
    }
  };

  // Progress summary
  const getEtapaProgress = (etapa: Etapa) => {
    const states = checkStates[etapa.id] || {};
    const checked = etapa.items.filter((i) => states[i.key]).length;
    return { checked, total: etapa.items.length, complete: checked === etapa.items.length && etapa.items.length > 0 };
  };

  const completedEtapas = etapas.filter((e) => getEtapaProgress(e).complete).length;
  const totalEtapas = etapas.length;
  const totalItems = etapas.reduce((sum, e) => sum + e.items.length, 0);
  const totalChecked = etapas.reduce((sum, e) => sum + getEtapaProgress(e).checked, 0);
  const overallPct = totalItems > 0 ? Math.round((totalChecked / totalItems) * 100) : 0;

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Carregando checklist...</div>;
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 sm:h-9 sm:w-9" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div className="min-w-0">
            <h2 className="text-base sm:text-xl font-bold truncate">Serviço {pedido.pedido_num}</h2>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{pedido.cliente}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-1 sm:gap-1.5 text-xs sm:text-sm shrink-0" onClick={() => setShowAddEtapa(true)}>
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Nova etapa</span>
          <span className="sm:hidden">Nova</span>
        </Button>
      </div>

      {/* Progress Summary */}
      <div className="rounded-lg border bg-card p-3 sm:p-5 space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-xs sm:text-sm">Progresso Geral</h3>
          <span className={cn(
            "rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold",
            overallPct === 100 ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary"
          )}>
            {overallPct}%
          </span>
        </div>
        <div className="h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-500", overallPct === 100 ? "bg-emerald-500" : "bg-primary")}
            style={{ width: `${overallPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground">
          <span>{completedEtapas}/{totalEtapas} etapas concluídas</span>
          <span>{totalChecked}/{totalItems} itens marcados</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-2 pt-1">
          {etapas.map((etapa) => {
            const prog = getEtapaProgress(etapa);
            return (
              <button
                key={etapa.id}
                onClick={() => setExpandedEtapas((prev) => ({ ...prev, [etapa.id]: true }))}
                className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs rounded-md border px-1.5 sm:px-2 py-1 sm:py-1.5 hover:bg-muted/50 transition-colors text-left"
              >
                {prog.complete ? (
                  <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground shrink-0" />
                )}
                <span className="truncate">{etapa.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Configuração de Cálculo */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
            <Settings2 className="h-3.5 w-3.5" />
            Configuração de Cálculo da Obra
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <CalculoFilters />
        </CollapsibleContent>
      </Collapsible>

      {/* Etapas with drag and drop */}
      {etapas.map((etapa, idx) => (
        <div
          key={etapa.id}
          draggable
          onDragStart={() => handleDragStart(idx)}
          onDragOver={(e) => handleDragOver(e, idx)}
          onDrop={() => handleDrop(idx)}
          onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
          className={cn(
            "transition-opacity",
            dragIdx === idx && "opacity-50",
            overIdx === idx && dragIdx !== idx && "border-t-2 border-primary"
          )}
        >
          <EtapaCard
            etapa={etapa}
            pedidoId={pedido.id}
            checkStates={checkStates[etapa.id] || {}}
            annotation={annotations[etapa.id] || ""}
            isExpanded={expandedEtapas[etapa.id] ?? false}
            onToggleExpand={() => setExpandedEtapas((prev) => ({ ...prev, [etapa.id]: !prev[etapa.id] }))}
            onToggleCheck={(itemKey, currentVal) => toggleCheck(etapa.id, itemKey, currentVal)}
            onSelectAll={(check) => selectAll(etapa.id, etapa.items, check)}
            onAnnotationChange={(text) => setAnnotations((prev) => ({ ...prev, [etapa.id]: text }))}
            onAnnotationBlur={(text) => saveAnnotation(etapa.id, text)}
            onDeleteEtapa={etapa.isCustom ? () => deleteCustomEtapa(etapa) : undefined}
            onEditEtapa={etapa.isCustom ? () => setEditingEtapa(etapa) : undefined}
            dragHandleProps={{
              onMouseDown: (e: React.MouseEvent) => e.stopPropagation(),
            }}
          />
        </div>
      ))}

      {/* Add Etapa Dialog */}
      <AddEtapaDialog
        open={showAddEtapa}
        onOpenChange={setShowAddEtapa}
        pedidoId={pedido.id}
        onCreated={loadAll}
      />

      {/* Edit Etapa Dialog */}
      {editingEtapa && (
        <EditEtapaDialog
          open={!!editingEtapa}
          onOpenChange={(open) => !open && setEditingEtapa(null)}
          etapa={editingEtapa}
          onSaved={loadAll}
        />
      )}
    </div>
  );
}
