import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ExtendedTypology } from "@/hooks/use-all-typologies";

export interface PlanoCorte {
  id: string;
  typology_id: string;
  nome: string;
  responsavel: string;
  largura: number;
  altura: number;
  quantidade: number;
  created_at: string;
}

export function usePlanosCorte() {
  const [planos, setPlanos] = useState<PlanoCorte[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlanos = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("planos_corte")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar planos");
      console.error(error);
    } else {
      setPlanos(
        (data ?? []).map((d: any) => ({
          id: d.id,
          typology_id: d.typology_id,
          nome: d.nome,
          responsavel: d.responsavel,
          largura: d.largura,
          altura: d.altura,
          quantidade: d.quantidade,
          created_at: d.created_at,
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchPlanos(); }, [fetchPlanos]);

  const addPlano = useCallback(async (plano: Omit<PlanoCorte, "id" | "created_at">) => {
    const { data, error } = await supabase
      .from("planos_corte")
      .insert({
        typology_id: plano.typology_id,
        nome: plano.nome,
        responsavel: plano.responsavel,
        largura: plano.largura,
        altura: plano.altura,
        quantidade: plano.quantidade,
      })
      .select()
      .single();

    if (error) {
      toast.error("Erro ao salvar plano");
      return null;
    }
    toast.success("Plano adicionado!");
    await fetchPlanos();
    return data;
  }, [fetchPlanos]);

  const updatePlano = useCallback(async (id: string, updates: Partial<PlanoCorte>) => {
    const { error } = await supabase
      .from("planos_corte")
      .update(updates)
      .eq("id", id);

    if (error) {
      toast.error("Erro ao atualizar plano");
      return false;
    }
    await fetchPlanos();
    return true;
  }, [fetchPlanos]);

  const deletePlano = useCallback(async (id: string) => {
    const { error } = await supabase
      .from("planos_corte")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erro ao excluir plano");
      return false;
    }
    toast.success("Plano excluído!");
    await fetchPlanos();
    return true;
  }, [fetchPlanos]);

  const duplicatePlano = useCallback(async (plano: PlanoCorte) => {
    return addPlano({
      typology_id: plano.typology_id,
      nome: `${plano.nome} (cópia)`,
      responsavel: plano.responsavel,
      largura: plano.largura,
      altura: plano.altura,
      quantidade: plano.quantidade,
    });
  }, [addPlano]);

  /**
   * Syncs planos_corte with all available typologies.
   * Creates a default plano for any typology that doesn't have one yet.
   */
  const syncWithTypologies = useCallback(async (allTypologies: ExtendedTypology[]) => {
    // Fetch current planos to get existing typology_ids
    const { data: existingPlanos } = await supabase
      .from("planos_corte")
      .select("typology_id");

    const existingIds = new Set((existingPlanos ?? []).map((p: any) => p.typology_id));

    const activeTypologies = allTypologies.filter(t => t.active);
    const missing = activeTypologies.filter(t => !existingIds.has(t.id));

    if (missing.length === 0) return;

    const inserts = missing.map(t => ({
      typology_id: t.id,
      nome: t.name,
      responsavel: "",
      largura: 1000,
      altura: 1000,
      quantidade: 1,
    }));

    const { error } = await supabase
      .from("planos_corte")
      .insert(inserts);

    if (error) {
      console.error("Erro ao sincronizar planos:", error);
    } else if (missing.length > 0) {
      toast.success(`${missing.length} plano(s) de corte criado(s) automaticamente`);
      await fetchPlanos();
    }
  }, [fetchPlanos]);

  return { planos, loading, addPlano, updatePlano, deletePlano, duplicatePlano, refetch: fetchPlanos, syncWithTypologies };
}
