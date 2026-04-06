import { useState, useCallback } from "react";
import { DollarSign, TrendingUp, Package, Loader2, CalendarDays } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { PullToRefresh } from "@/components/PullToRefresh";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useDashboardStats, usePedidosStatus, useReceitaMensal,
  useOrcamentosStatus, useProducaoEtapas, type PeriodFilter,
} from "@/hooks/use-dashboard-data";
import { formatCurrency } from "@/lib/formatters";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { DashboardAiInsights } from "@/components/ai/DashboardAiInsights";

const periodOptions: { key: PeriodFilter; label: string }[] = [
  { key: "semana", label: "7d" },
  { key: "mes", label: "30d" },
  { key: "trimestre", label: "3m" },
  { key: "ano", label: "12m" },
  { key: "todos", label: "Todos" },
];

const chartTooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: "12px",
};

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [period, setPeriod] = useState<PeriodFilter>("todos");
  const handleRefresh = useCallback(async () => {
    await queryClient.invalidateQueries();
  }, [queryClient]);
  const { data: stats, isLoading, isError, refetch: refetchStats } = useDashboardStats(period);
  const { data: statusPedidos = [] } = usePedidosStatus(period);
  const { data: receitaMensal = [] } = useReceitaMensal();
  const { data: orcamentosStatus = [] } = useOrcamentosStatus(period);
  const { data: producaoEtapas = [] } = useProducaoEtapas(period);

  const now = new Date();
  const hora = now.getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
  const diaSemana = now.toLocaleDateString("pt-BR", { weekday: "long" });
  const dataFormatada = now.toLocaleDateString("pt-BR", { day: "numeric", month: "long" });
  const capitalizedDia = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
          <p className="text-sm font-medium">Não foi possível carregar o dashboard.</p>
          <Button variant="outline" size="sm" onClick={() => void refetchStats()}>
            Tentar novamente
          </Button>
        </div>
      </PullToRefresh>
    );
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
    <div className="space-y-4 sm:space-y-6">
      {/* Greeting + Period Filter */}
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight">Olá, {saudacao}!</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">{capitalizedDia}, {dataFormatada}</p>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1 rounded-lg border bg-muted/50 p-0.5 sm:p-1 overflow-x-auto w-fit">
          {periodOptions.map((opt) => (
            <Button
              key={opt.key}
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 sm:h-8 px-2 sm:px-3 text-[10px] sm:text-xs font-medium rounded-md transition-all shrink-0",
                period === opt.key
                  ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setPeriod(opt.key)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Top stats row */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
        <Card className="bg-foreground text-background border-0 shadow-lg col-span-2 sm:col-span-1">
          <CardContent className="p-3 sm:p-5">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider opacity-80">VENDAS</span>
            <p className="text-lg sm:text-2xl font-bold mt-1">{formatCurrency(stats.vendas)}</p>
            <div className="mt-2 sm:mt-3 flex gap-4 sm:gap-6 text-[10px] sm:text-xs opacity-70">
              <div>
                <span className="block">Ticket-médio</span>
                <span className="font-semibold">{formatCurrency(stats.ticketMedio)}</span>
              </div>
              <div>
                <span className="block">Vendas totais</span>
                <span className="font-semibold">{stats.vendasCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardContent className="p-3 sm:p-5">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">OBRAS</span>
            <p className="text-xl sm:text-3xl font-bold mt-1 sm:mt-2">{stats.obrasEntregues}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">concluídas</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardContent className="p-3 sm:p-5">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">ORÇAMENTOS</span>
            <p className="text-base sm:text-2xl font-bold mt-1 sm:mt-2">{formatCurrency(stats.orcamentosRealizados)}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{stats.orcamentosCount} orç.</p>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground border-0 shadow-lg">
          <CardContent className="p-3 sm:p-5">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider opacity-80">PRODUÇÃO</span>
            <p className="text-xl sm:text-3xl font-bold mt-1 sm:mt-2">{stats.producaoAndamento}</p>
            <p className="text-[10px] sm:text-xs opacity-80">em andamento</p>
          </CardContent>
        </Card>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {[
          { label: "A Receber", valor: stats.aReceber, icon: TrendingUp, color: "text-success", iconBg: "bg-success/10" },
          { label: "A Pagar", valor: stats.aPagar, icon: DollarSign, color: "text-destructive", iconBg: "bg-destructive/10" },
          { label: "Estoque", valor: stats.estoqueTotal, icon: Package, color: "text-warning", iconBg: "bg-warning/10", isCount: true },
        ].map(card => (
          <Card key={card.label} className="shadow-sm border-border/50">
            <CardContent className="p-3 sm:p-5">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                <div className={cn("flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg", card.iconBg)}>
                  <card.icon className={cn("h-3 w-3 sm:h-4 sm:w-4", card.color)} />
                </div>
                <span className="text-[10px] sm:text-sm font-semibold truncate">{card.label}</span>
              </div>
              <p className="text-sm sm:text-2xl font-bold">
                {card.isCount ? card.valor : formatCurrency(card.valor as number)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 — Receita + Status Pedidos */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-sm border-border/50">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-sm sm:text-base font-semibold">Receita Mensal</CardTitle>
          </CardHeader>
          <CardContent className="px-1 sm:px-6">
            {receitaMensal.length > 0 && receitaMensal.some(r => r.valor > 0) ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={receitaMensal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} width={35} />
                  <Tooltip formatter={(value: number) => [formatCurrency(value), "Receita"]} contentStyle={chartTooltipStyle} />
                  <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[220px] text-muted-foreground">
                <CalendarDays className="h-8 w-8 mb-2 opacity-40" />
                <p className="text-xs sm:text-sm">Sem dados de receita</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-sm border-border/50">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-sm sm:text-base font-semibold">Status dos Pedidos</CardTitle>
          </CardHeader>
          <CardContent className="px-1 sm:px-6">
            {statusPedidos.some(s => s.value > 0) ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={statusPedidos} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value">
                    {statusPedidos.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "10px" }} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[220px] text-muted-foreground">
                <p className="text-xs sm:text-sm">Sem pedidos no período</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-sm sm:text-base font-semibold">Orçamentos por Status</CardTitle>
          </CardHeader>
          <CardContent className="px-1 sm:px-6">
            {orcamentosStatus.some(s => s.value > 0) ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={orcamentosStatus} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis type="number" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="name" fontSize={10} tickLine={false} axisLine={false} width={65} />
                    <Tooltip
                      formatter={(value: number, _name: string, props: any) => [
                        `${value} orçamentos · ${formatCurrency(props.payload.total)}`,
                        "Quantidade",
                      ]}
                      contentStyle={chartTooltipStyle}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {orcamentosStatus.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex gap-3 sm:gap-4 mt-2 justify-center">
                  {orcamentosStatus.map((s) => (
                    <div key={s.name} className="text-center">
                      <p className="text-sm sm:text-lg font-bold">{s.value}</p>
                      <p className="text-[10px] sm:text-[11px] text-muted-foreground">{s.name}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                <p className="text-xs sm:text-sm">Sem orçamentos no período</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-sm sm:text-base font-semibold">Produção por Etapa</CardTitle>
          </CardHeader>
          <CardContent className="px-1 sm:px-6">
            {producaoEtapas.length > 0 && producaoEtapas.some(e => e.value > 0) ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={producaoEtapas} cx="50%" cy="50%" innerRadius={35} outerRadius={65} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name} (${value})`} fontSize={10}>
                    {producaoEtapas.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend iconType="circle" iconSize={6} wrapperStyle={{ fontSize: "10px" }} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[220px] text-muted-foreground">
                <p className="text-xs sm:text-sm">Sem pedidos em produção</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </div>

      {/* AI Insights */}
      <DashboardAiInsights
        stats={{
          totalOrcamentos: stats.orcamentosCount,
          totalPedidos: stats.vendasCount,
          receitaTotal: stats.vendas,
          pedidosAtrasados: stats.producaoAndamento,
        }}
        receitaMensal={receitaMensal.map(r => ({ mes: r.mes, total: r.valor }))}
        statusPedidos={statusPedidos.map(s => ({ status: s.name, count: s.value }))}
      />
    </div>
    </PullToRefresh>
  );
};

export default Dashboard;
