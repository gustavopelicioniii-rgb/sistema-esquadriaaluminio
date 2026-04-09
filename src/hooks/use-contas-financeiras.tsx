import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const CATEGORIAS_FINANCEIRAS = [
  "material", "mão de obra", "aluguel", "transporte", "energia", "impostos", "outros"
] as const;

export type CategoriaFinanceira = typeof CATEGORIAS_FINANCEIRAS[number];

export interface ContaFinanceira {
  id: string;
  cliente: string;
  descricao: string;
  valor: number;
  vencimento: string;
  status: "pendente" | "pago" | "vencido";
  tipo: "receber" | "pagar";
  categoria: CategoriaFinanceira;
  created_at: string;
}

export function useContasFinanceiras() {
  const { user, isLoading: authLoading } = useAuth();
  return useQuery({
    queryKey: ["contas_financeiras", user?.id],
    enabled: !authLoading && !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contas_financeiras")
        .select("*")
        .order("vencimento", { ascending: true });
      if (error) throw error;
      return (data ?? []) as ContaFinanceira[];
    },
  });
}

export function useCreateConta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (conta: Omit<ContaFinanceira, "id" | "created_at">) => {
      const { error } = await supabase.from("contas_financeiras").insert(conta);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contas_financeiras"] }),
  });
}

export function useUpdateConta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<ContaFinanceira> & { id: string }) => {
      const { error } = await supabase.from("contas_financeiras").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contas_financeiras"] }),
  });
}

export function useDeleteConta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contas_financeiras").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contas_financeiras"] }),
  });
}
