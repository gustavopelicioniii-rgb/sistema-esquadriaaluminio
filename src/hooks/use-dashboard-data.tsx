import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard_stats"],
    queryFn: async () => {
      const [pedidosRes, orcamentosRes, estoqueRes, contasRes] = await Promise.all([
        supabase.from("pedidos").select("*"),
        supabase.from("orcamentos").select("*"),
        supabase.from("estoque").select("*"),
        supabase.from("contas_financeiras").select("*"),
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

export function usePedidosStatus() {
  return useQuery({
    queryKey: ["pedidos_status"],
    queryFn: async () => {
      const { data } = await supabase.from("pedidos").select("status");
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
