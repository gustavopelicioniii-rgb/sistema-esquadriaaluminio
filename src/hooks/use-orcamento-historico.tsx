import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useOrcamentoHistorico(orcamentoId: string | undefined) {
  return useQuery({
    queryKey: ["orcamento_historico", orcamentoId],
    queryFn: async () => {
      if (!orcamentoId) return [];
      const { data, error } = await supabase
        .from("orcamento_historico")
        .select("*")
        .eq("orcamento_id", orcamentoId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!orcamentoId,
  });
}

export function useAddOrcamentoHistorico() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { orcamento_id: string; status_anterior: string | null; status_novo: string }) => {
      const { error } = await supabase.from("orcamento_historico").insert(input);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["orcamento_historico", vars.orcamento_id] });
    },
  });
}
