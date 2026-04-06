import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { TypologyComponent } from "@/types/calculation";
import { getComponentsForTypology } from "@/data/catalog";

export interface CustomComponentRuleRow {
  id: string;
  typology_id: string;
  component_name: string;
  component_code: string;
  component_type: string;
  quantity_formula: string;
  unit: string;
  length_reference: string | null;
  length_constant_mm: number;
  notes: string | null;
  sort_order: number;
  user_id: string;
}

function toComponent(row: CustomComponentRuleRow): TypologyComponent {
  return {
    id: row.id,
    typology_id: row.typology_id,
    component_name: row.component_name,
    component_code: row.component_code || undefined,
    component_type: row.component_type,
    quantity_formula: row.quantity_formula,
    unit: row.unit,
    length_reference: row.length_reference ?? undefined,
    length_constant_mm: row.length_constant_mm != null ? Number(row.length_constant_mm) : undefined,
  };
}

export function useCustomComponentRules(typologyId: string | null) {
  const [rules, setRules] = useState<CustomComponentRuleRow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRules = useCallback(async () => {
    if (!typologyId) { setRules([]); return; }
    setLoading(true);
    const { data } = await supabase
      .from("regras_componentes_customizadas")
      .select("*")
      .eq("typology_id", typologyId)
      .order("sort_order", { ascending: true });
    if (data) setRules(data as unknown as CustomComponentRuleRow[]);
    setLoading(false);
  }, [typologyId]);

  useEffect(() => { fetchRules(); }, [fetchRules]);

  const addRule = async (rule: Omit<CustomComponentRuleRow, "id" | "user_id">) => {
    const { error } = await supabase.from("regras_componentes_customizadas").insert(rule as any);
    if (error) throw error;
    await fetchRules();
  };

  const updateRule = async (id: string, updates: Partial<CustomComponentRuleRow>) => {
    const { error } = await supabase.from("regras_componentes_customizadas").update(updates as any).eq("id", id);
    if (error) throw error;
    await fetchRules();
  };

  const deleteRule = async (id: string) => {
    const { error } = await supabase.from("regras_componentes_customizadas").delete().eq("id", id);
    if (error) throw error;
    await fetchRules();
  };

  const inheritFromBase = async (baseTypologyId: string) => {
    const catalogRules = getComponentsForTypology(baseTypologyId);
    if (catalogRules.length === 0) throw new Error("Nenhum componente encontrado na tipologia base");

    const inserts = catalogRules.map((r, i) => ({
      typology_id: typologyId!,
      component_name: r.component_name,
      component_code: r.component_code ?? "",
      component_type: r.component_type,
      quantity_formula: r.quantity_formula,
      unit: r.unit,
      length_reference: r.length_reference ?? null,
      length_constant_mm: r.length_constant_mm ?? 0,
      notes: null,
      sort_order: i,
    }));

    const { error } = await supabase.from("regras_componentes_customizadas").insert(inserts as any);
    if (error) throw error;
    await fetchRules();
  };

  return {
    rules,
    loading,
    fetchRules,
    addRule,
    updateRule,
    deleteRule,
    inheritFromBase,
    asComponents: rules.map(toComponent),
  };
}

export async function getEffectiveComponents(
  typologyId: string,
  isCustom: boolean,
  baseTypologyId?: string,
): Promise<TypologyComponent[]> {
  if (isCustom) {
    const { data } = await supabase
      .from("regras_componentes_customizadas")
      .select("*")
      .eq("typology_id", typologyId)
      .order("sort_order", { ascending: true });

    if (data && data.length > 0) {
      return (data as unknown as CustomComponentRuleRow[]).map(toComponent);
    }
  }
  return getComponentsForTypology(typologyId, baseTypologyId);
}
