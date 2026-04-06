import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { CutRule } from "@/types/calculation";
import { getCutRulesForTypology } from "@/data/catalog";

export interface CustomCutRuleRow {
  id: string;
  typology_id: string;
  profile_code: string;
  piece_name: string;
  piece_function: string;
  reference_dimension: string;
  coefficient: number;
  constant_mm: number;
  fixed_value_mm: number | null;
  cut_angle_left: number;
  cut_angle_right: number;
  quantity_formula: string;
  sort_order: number;
  weight_per_meter: number;
  notes: string | null;
  user_id: string;
}

/**
 * Converts a DB row to a CutRule compatible with the calculation engine
 */
function toCutRule(row: CustomCutRuleRow): CutRule {
  return {
    id: row.id,
    typology_id: row.typology_id,
    profile_id: "",
    piece_name: row.piece_name,
    piece_function: row.piece_function,
    reference_dimension: row.reference_dimension as CutRule["reference_dimension"],
    coefficient: Number(row.coefficient),
    constant_mm: Number(row.constant_mm),
    fixed_value_mm: row.fixed_value_mm != null ? Number(row.fixed_value_mm) : null,
    cut_angle_left: Number(row.cut_angle_left),
    cut_angle_right: Number(row.cut_angle_right),
    quantity_formula: row.quantity_formula,
    sort_order: row.sort_order,
    profile_code: row.profile_code,
    weight_per_meter: Number(row.weight_per_meter),
  };
}

/**
 * Hook to fetch and manage custom cut rules for a specific custom typology.
 */
export function useCustomCutRules(typologyId: string | null) {
  const [rules, setRules] = useState<CustomCutRuleRow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRules = useCallback(async () => {
    if (!typologyId) { setRules([]); return; }
    setLoading(true);
    const { data } = await supabase
      .from("regras_corte_customizadas")
      .select("*")
      .eq("typology_id", typologyId)
      .order("sort_order", { ascending: true });
    if (data) setRules(data as unknown as CustomCutRuleRow[]);
    setLoading(false);
  }, [typologyId]);

  useEffect(() => { fetchRules(); }, [fetchRules]);

  const addRule = async (rule: Omit<CustomCutRuleRow, "id" | "user_id">) => {
    const { error } = await supabase.from("regras_corte_customizadas").insert(rule as any);
    if (error) throw error;
    await fetchRules();
  };

  const updateRule = async (id: string, updates: Partial<CustomCutRuleRow>) => {
    const { error } = await supabase
      .from("regras_corte_customizadas")
      .update(updates as any)
      .eq("id", id);
    if (error) throw error;
    await fetchRules();
  };

  const deleteRule = async (id: string) => {
    const { error } = await supabase
      .from("regras_corte_customizadas")
      .delete()
      .eq("id", id);
    if (error) throw error;
    await fetchRules();
  };

  /**
   * Copy all catalog cut rules from the base typology into custom rules
   */
  const inheritFromBase = async (baseTypologyId: string) => {
    const catalogRules = getCutRulesForTypology(baseTypologyId);
    if (catalogRules.length === 0) throw new Error("Nenhuma regra encontrada na tipologia base");

    const inserts = catalogRules.map((r) => ({
      typology_id: typologyId!,
      profile_code: r.profile_code ?? "",
      piece_name: r.piece_name,
      piece_function: r.piece_function,
      reference_dimension: r.reference_dimension,
      coefficient: r.coefficient,
      constant_mm: r.constant_mm,
      fixed_value_mm: r.fixed_value_mm,
      cut_angle_left: r.cut_angle_left,
      cut_angle_right: r.cut_angle_right,
      quantity_formula: r.quantity_formula,
      sort_order: r.sort_order,
      weight_per_meter: r.weight_per_meter ?? 0,
      notes: r.notes ?? null,
    }));

    const { error } = await supabase.from("regras_corte_customizadas").insert(inserts as any);
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
    /** Convert all rules to CutRule[] for the calculation engine */
    asCutRules: rules.map(toCutRule),
  };
}

/**
 * Gets the effective cut rules for a typology.
 * If it's a custom typology with custom rules in DB, use those.
 * Otherwise fall back to catalog rules via baseTypologyId.
 */
export async function getEffectiveCutRules(
  typologyId: string,
  isCustom: boolean,
  baseTypologyId?: string,
): Promise<CutRule[]> {
  if (isCustom) {
    // Check if custom rules exist in DB
    const { data } = await supabase
      .from("regras_corte_customizadas")
      .select("*")
      .eq("typology_id", typologyId)
      .order("sort_order", { ascending: true });

    if (data && data.length > 0) {
      return (data as unknown as CustomCutRuleRow[]).map(toCutRule);
    }
  }

  // Fall back to catalog rules
  return getCutRulesForTypology(typologyId, baseTypologyId);
}
