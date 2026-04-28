import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { GlassRule } from '@/types/calculation';
import { getGlassRulesForTypology } from '@/data/catalog';

export interface CustomGlassRuleRow {
  id: string;
  typology_id: string;
  glass_name: string;
  width_reference: string;
  width_constant_mm: number;
  height_reference: string;
  height_constant_mm: number;
  quantity: number;
  glass_type: string | null;
  min_thickness_mm: number | null;
  max_thickness_mm: number | null;
  notes: string | null;
  user_id: string;
}

function toGlassRule(row: CustomGlassRuleRow): GlassRule {
  return {
    id: row.id,
    typology_id: row.typology_id,
    glass_name: row.glass_name,
    width_reference: row.width_reference,
    width_constant_mm: Number(row.width_constant_mm),
    height_reference: row.height_reference,
    height_constant_mm: Number(row.height_constant_mm),
    quantity: row.quantity,
    glass_type: row.glass_type ?? undefined,
    min_thickness_mm: row.min_thickness_mm != null ? Number(row.min_thickness_mm) : undefined,
    max_thickness_mm: row.max_thickness_mm != null ? Number(row.max_thickness_mm) : undefined,
  };
}

export function useCustomGlassRules(typologyId: string | null) {
  const [rules, setRules] = useState<CustomGlassRuleRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRules = useCallback(async () => {
    if (!typologyId) {
      setRules([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from('regras_vidro_customizadas')
        .select('*')
        .eq('typology_id', typologyId)
        .order('created_at', { ascending: true });
      if (err) {
        // Error fetching glass rules
        setError(err.message);
      } else {
        setRules((data as unknown as CustomGlassRuleRow[]) ?? []);
      }
    } catch (e) {
      // Unexpected error
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [typologyId]);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const addRule = async (rule: Omit<CustomGlassRuleRow, 'id' | 'user_id'>) => {
    const { error: err } = await supabase.from('regras_vidro_customizadas').insert(rule as any);
    if (err) throw err;
    await fetchRules();
  };

  const updateRule = async (id: string, updates: Partial<CustomGlassRuleRow>) => {
    const { error: err } = await supabase
      .from('regras_vidro_customizadas')
      .update(updates as any)
      .eq('id', id);
    if (err) throw err;
    await fetchRules();
  };

  const deleteRule = async (id: string) => {
    const { error: err } = await supabase.from('regras_vidro_customizadas').delete().eq('id', id);
    if (err) throw err;
    await fetchRules();
  };

  const inheritFromBase = async (baseTypologyId: string) => {
    const catalogRules = getGlassRulesForTypology(baseTypologyId);
    if (catalogRules.length === 0)
      throw new Error('Nenhuma regra de vidro encontrada na tipologia base');
    const inserts = catalogRules.map(r => ({
      typology_id: typologyId!,
      glass_name: r.glass_name,
      width_reference: r.width_reference,
      width_constant_mm: r.width_constant_mm,
      height_reference: r.height_reference,
      height_constant_mm: r.height_constant_mm,
      quantity: r.quantity,
      glass_type: r.glass_type ?? null,
      min_thickness_mm: r.min_thickness_mm ?? null,
      max_thickness_mm: r.max_thickness_mm ?? null,
      notes: null,
    }));
    const { error: err } = await supabase.from('regras_vidro_customizadas').insert(inserts as any);
    if (err) throw err;
    await fetchRules();
  };

  return {
    rules,
    loading,
    error,
    fetchRules,
    addRule,
    updateRule,
    deleteRule,
    inheritFromBase,
    asGlassRules: rules.map(toGlassRule),
  };
}

export async function getEffectiveGlassRules(
  typologyId: string,
  isCustom: boolean,
  baseTypologyId?: string
): Promise<GlassRule[]> {
  if (isCustom) {
    const { data } = await supabase
      .from('regras_vidro_customizadas')
      .select('*')
      .eq('typology_id', typologyId)
      .order('created_at', { ascending: true });
    if (data && data.length > 0) {
      return (data as unknown as CustomGlassRuleRow[]).map(toGlassRule);
    }
  }
  return getGlassRulesForTypology(typologyId, baseTypologyId);
}
