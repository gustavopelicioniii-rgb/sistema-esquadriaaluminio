import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type PeriodFilter = "semana" | "mes" | "trimestre" | "ano" | "todos";

function getDateRange(period: PeriodFilter): { from: string | null } {
  if (period === "todos") return { from: null };
  const now = new Date();
  const d = new Date(now);
  switch (period) {
    case "semana": d.setDate(d.getDate() - 7); break;
    case "mes": d.setMonth(d.getMonth() - 1); break;
    case "trimestre": d.setMonth(d.getMonth() - 3); break;
    case "ano": d.setFullYear(d.getFullYear() - 1); break;
  }
  return { from: d.toISOString().split("T")[0] };
}

export function useDashboardStats(period: PeriodFilter = "todos") {
  const { user, isLoading: authLoading } = useAuth();
  return useQuery({
    queryKey: ["dashboard_stats", period, user?.id],
    enabled: !authLoading && !!user,
    queryFn: async () => {
      const { from } = getDateRange(period);

      let pedidosQuery = supabase.from("pedidos").select("*");
      let orcamentosQuery = supabase.from("orcamentos").select("*");
      let contasQuery = supabase.from("contas_financeiras").select("*");

      if (from) {
        pedidosQuery = pedidosQuery.gte("created_at", from);
        orcamentosQuery = orcamentosQuery.gte("created_at", from);
        contasQuery = contasQuery.gte("created_at", from);
      }

      const [pedidosRes, orcamentosRes, estoqueRes, contasRes] = await Promise.all([
        pedidosQuery,
        orcamentosQuery,
        supabase.from("estoque").select("*"),
        contasQuery,
      ]);

      const pedidos = pedidosRes.data ?? [];
      const orcamentos = orcamentosRes.data ?? [];
      const estoque = estoqueRes.data ?? [];
      const contas = contasRes.data ?? [];

      const totalVendas = pedidos.reduce((s, p) => s + Number(p.valor), 0);
      const concluidos = pedidos.filter(p => p.status === "concluido").length;
      const emAndamento = pedidos.filter(p => p.status === "em_andamento").length;
      const totalOrcamentos = orcamentos.reduce((s, o) => s + Number(o.valor), 0);
      const estoqueTotal = estoque.reduce((s, e) => s + e.quantidade, 0);

      const aReceber = contas.filter((c: any) => c.tipo === "receber").reduce((s: number, c: any) => s + Number(c.valor), 0);
      const aPagar = contas.filter((c: any) => c.tipo === "pagar").reduce((s: number, c: any) => s + Number(c.valor), 0);

      return {
        vendas: totalVendas,
        obrasEntregues: concluidos,
        orcamentosRealizados: totalOrcamentos,
        producaoAndamento: emAndamento,
        ticketMedio: pedidos.length > 0 ? totalVendas / pedidos.length : 0,
        vendasCount: pedidos.length,
        orcamentosCount: orcamentos.length,
        estoqueTotal,
        aReceber,
        aPagar,
        saldoProjetado: aReceber - aPagar,
      };
    },
  });
}

export function usePedidosStatus(period: PeriodFilter = "todos") {
  return useQuery({
    queryKey: ["pedidos_status", period],
    queryFn: async () => {
      const { from } = getDateRange(period);
      let query = supabase.from("pedidos").select("status");
      if (from) query = query.gte("created_at", from);
      const { data } = await query;
      const pedidos = data ?? [];
      const counts: Record<string, number> = {};
      pedidos.forEach(p => { counts[p.status] = (counts[p.status] || 0) + 1; });
      return [
        { name: "Aguardando", value: counts["aguardando"] ?? 0, color: "hsl(38, 92%, 50%)" },
        { name: "Em Andamento", value: counts["em_andamento"] ?? 0, color: "hsl(217, 91%, 53%)" },
        { name: "Concluído", value: counts["concluido"] ?? 0, color: "hsl(142, 71%, 45%)" },
        { name: "Atrasado", value: counts["atrasado"] ?? 0, color: "hsl(0, 84%, 60%)" },
      ];
    },
  });
}

export function useReceitaMensal() {
  return useQuery({
    queryKey: ["receita_mensal"],
    queryFn: async () => {
      const { data: pedidos = [] } = await supabase.from("pedidos").select("valor, created_at");
      const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
      const now = new Date();
      const result: { mes: string; valor: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = d.getFullYear();
        const month = d.getMonth();
        const total = pedidos
          .filter(p => { const pd = new Date(p.created_at); return pd.getFullYear() === year && pd.getMonth() === month; })
          .reduce((s, p) => s + Number(p.valor), 0);
        result.push({ mes: meses[month], valor: total });
      }
      return result;
    },
  });
}

export function useOrcamentosStatus(period: PeriodFilter = "todos") {
  return useQuery({
    queryKey: ["orcamentos_status", period],
    queryFn: async () => {
      const { from } = getDateRange(period);
      let query = supabase.from("orcamentos").select("status, valor");
      if (from) query = query.gte("created_at", from);
      const { data } = await query;
      const orcamentos = data ?? [];
      const grouped: Record<string, { count: number; total: number }> = {};
      orcamentos.forEach(o => {
        if (!grouped[o.status]) grouped[o.status] = { count: 0, total: 0 };
        grouped[o.status].count++;
        grouped[o.status].total += Number(o.valor);
      });
      return [
        { name: "Pendente", value: grouped["pendente"]?.count ?? 0, total: grouped["pendente"]?.total ?? 0, color: "hsl(38, 92%, 50%)" },
        { name: "Aprovado", value: grouped["aprovado"]?.count ?? 0, total: grouped["aprovado"]?.total ?? 0, color: "hsl(142, 71%, 45%)" },
        { name: "Recusado", value: grouped["recusado"]?.count ?? 0, total: grouped["recusado"]?.total ?? 0, color: "hsl(0, 84%, 60%)" },
      ];
    },
  });
}

export function useProducaoEtapas(period: PeriodFilter = "todos") {
  return useQuery({
    queryKey: ["producao_etapas", period],
    queryFn: async () => {
      const { from } = getDateRange(period);
      let query = supabase.from("pedidos").select("etapa").eq("status", "em_andamento");
      if (from) query = query.gte("created_at", from);
      const { data } = await query;
      const pedidos = data ?? [];
      const counts: Record<string, number> = {};
      pedidos.forEach(p => {
        const etapa = p.etapa?.trim() || "Sem etapa";
        counts[etapa] = (counts[etapa] || 0) + 1;
      });
      const colors = [
        "hsl(217, 91%, 53%)", "hsl(38, 92%, 50%)", "hsl(142, 71%, 45%)",
        "hsl(280, 67%, 55%)", "hsl(0, 84%, 60%)", "hsl(180, 60%, 45%)",
      ];
      return Object.entries(counts).map(([name, value], i) => ({
        name,
        value,
        color: colors[i % colors.length],
      }));
    },
  });
}
