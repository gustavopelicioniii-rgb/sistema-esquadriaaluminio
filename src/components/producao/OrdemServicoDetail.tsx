import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Pedido } from "@/pages/Producao";
import { defaultEtapasConfig, type Etapa } from "./checklist/etapasConfig";
import EtapaCard from "./checklist/EtapaCard";
import AddEtapaDialog from "./checklist/AddEtapaDialog";

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
    // Also clean checklist states
    await supabase.from("pedido_checklists").delete().eq("pedido_id", pedido.id).eq("etapa", etapa.id);
    toast({ title: "Etapa excluída", description: `"${etapa.label}" foi removida.` });
    loadAll();
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Carregando checklist...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold">Serviço {pedido.pedido_num}</h2>
            <p className="text-sm text-muted-foreground">{pedido.cliente}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowAddEtapa(true)}>
          <Plus className="h-4 w-4" />
          Nova etapa
        </Button>
      </div>

      {/* Etapas */}
      {etapas.map((etapa) => (
        <EtapaCard
          key={etapa.id}
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
        />
      ))}

      {/* Add Etapa Dialog */}
      <AddEtapaDialog
        open={showAddEtapa}
        onOpenChange={setShowAddEtapa}
        pedidoId={pedido.id}
        onCreated={loadAll}
      />
    </div>
  );
}
