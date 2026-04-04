import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useOrcamentos() {
  return useQuery({
    queryKey: ["orcamentos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orcamentos")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export interface CreateOrcamentoInput {
  cliente: string;
  produto: string;
  valor: number;
  itens: Record<string, unknown>;
}

export function useCreateOrcamento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateOrcamentoInput) => {
      // Generate sequential number
      const { data: last } = await supabase
        .from("orcamentos")
        .select("numero")
        .order("created_at", { ascending: false })
        .limit(1);

      const lastNum = last?.[0]?.numero
        ? parseInt(last[0].numero.replace(/\D/g, ""), 10)
        : 0;
      const numero = `ORC-${String((lastNum || 0) + 1).padStart(4, "0")}`;

      const { data, error } = await supabase.from("orcamentos").insert({
        numero,
        cliente: input.cliente,
        produto: input.produto,
        valor: input.valor,
        status: "pendente",
        itens: input.itens as any,
      }).select().single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orcamentos"] }),
  });
}

export function useUpdateOrcamentoStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("orcamentos")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orcamentos"] }),
  });
}

export function useDeleteOrcamento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("orcamentos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orcamentos"] }),
  });
}
