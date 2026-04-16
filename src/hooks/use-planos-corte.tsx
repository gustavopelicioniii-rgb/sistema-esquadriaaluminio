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
  const [error, setError] = useState<string | null>(null);

  const fetchPlanos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: err } = await supabase
        .from("planos_corte")
        .select("*")
        .order("created_at", { ascending: false });

      if (err) {
        console.error("Error fetching planos:", err);
        setError(err.message);
        toast.error("Erro ao carregar planos de corte");
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
    } catch (e) {
      console.error("Unexpected error:", e);
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchPlanos(); 
  }, [fetchPlanos]);

  const addPlano = useCallback(async (plano: Omit<PlanoCorte, "id" | "created_at">) => {
    try {
      const { data, error: err } = await supabase
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

      if (err) {
        toast.error("Erro ao salvar plano");
        return null;
      }
      toast.success("Plano adicionado!");
      await fetchPlanos();
      return data;
    } catch (e) {
      toast.error("Erro inesperado ao adicionar plano");
      return null;
    }
  }, [fetchPlanos]);

  const updatePlano = useCallback(async (id: string, updates: Partial<PlanoCorte>) => {
    try {
      const { error: err } = await supabase
        .from("planos_corte")
        .update(updates)
        .eq("id", id);

      if (err) {
        toast.error("Erro ao atualizar plano");
        return false;
      }
      await fetchPlanos();
      return true;
    } catch (e) {
      toast.error("Erro inesperado ao atualizar");
      return false;
    }
  }, [fetchPlanos]);

  const deletePlano = useCallback(async (id: string) => {
    try {
      const { error: err } = await supabase
        .from("planos_corte")
        .delete()
        .eq("id", id);

      if (err) {
        toast.error("Erro ao excluir plano");
        return false;
      }
      toast.success("Plano excluído!");
      await fetchPlanos();
      return true;
    } catch (e) {
      toast.error("Erro inesperado ao excluir");
      return false;
    }
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

  const syncWithTypologies = useCallback(async (allTypologies: ExtendedTypology[]) => {
    try {
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

      const { error: err } = await supabase
        .from("planos_corte")
        .insert(inserts);

      if (err) {
        console.error("Erro ao sincronizar planos:", err);
      } else if (missing.length > 0) {
        toast.success(`${missing.length} plano(s) de corte criado(s) automaticamente`);
        await fetchPlanos();
      }
    } catch (e) {
      console.error("Erro inesperado na sincronização:", e);
    }
  }, [fetchPlanos]);

  return { planos, loading, error, addPlano, updatePlano, deletePlano, duplicatePlano, refetch: fetchPlanos, syncWithTypologies };
}
