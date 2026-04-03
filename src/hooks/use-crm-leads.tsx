import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type CrmLeadStatus = "novo" | "em_orcamento" | "negociacao" | "fechado";

export interface CrmLead {
  id: string;
  nome: string;
  valor: number;
  telefone: string;
  email: string;
  status: CrmLeadStatus;
  observacao: string;
  created_at: string;
}

export function useCrmLeads() {
  return useQuery({
    queryKey: ["crm_leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as CrmLead[];
    },
  });
}

export function useUpdateLeadStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: CrmLeadStatus }) => {
      const { error } = await supabase
        .from("crm_leads")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["crm_leads"] }),
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (lead: Omit<CrmLead, "id" | "created_at">) => {
      const { error } = await supabase.from("crm_leads").insert(lead);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["crm_leads"] }),
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("crm_leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["crm_leads"] }),
  });
}
