import { useState, useCallback } from "react";
import { DollarSign, TrendingUp, Package, Loader2, CalendarDays, Crown, ArrowRight, LayoutDashboard, Gauge, Download, RefreshCw, Users, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { PullToRefresh } from "@/components/PullToRefresh";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  useDashboardStats, usePedidosStatus, useReceitaMensal,
  useOrcamentosStatus, useProducaoEtapas, type PeriodFilter,
} from "@/hooks/use-dashboard-data";
import { usePlano, PLAN_LABELS } from "@/hooks/use-plano";
import { formatCurrency } from "@/lib/formatters";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  KpiCard,
  AreaChartComponent,
  BarChartComponent,
  PieChartComponent,
  LineChartComponent,
  FunnelChartComponent,
  GaugeChartComponent,
  HeatmapComponent,
} from "@/components/dashboard";

const periodOptions: { key: PeriodFilter; label: string }[] = [
  { key: "semana", label: "7d" },
  { key: "mes", label: "30d" },
  { key: "trimestre", label: "3m" },
  { key: "ano", label: "12m" },
  { key: "todos", label: "Todos" },
];

type ViewMode = "simples" | "avancado";
type DashboardTab = "executivo" | "vendas" | "producao" | "financeiro" | "crm";

// Mock data generators
const generateSparkData = (base: number, length = 12) =>
  Array.from({ length }, (_, i) => base + Math.random() * base * 0.3 * (i % 3 === 0 ? -1 : 1));

const mockReceitaMensal = [
  { mes: "Jan", valor: 45000, meta: 40000 },
  { mes: "Fev", valor: 52000, meta: 45000 },
  { mes: "Mar", valor: 48000, meta: 50000 },
  { mes: "Abr", valor: 61000, meta: 55000 },
  { mes: "Mai", valor: 58000, meta: 60000 },
  { mes: "Jun", valor: 72000, meta: 65000 },
];

const mockVendasPorTipologia = [
  { nome: "Janela Correr", quantidade: 45, valor: 125000 },
  { nome: "Porta Correr", quantidade: 32, valor: 145000 },
  { nome: "Porta Pivotante", quantidade: 18, valor: 98000 },
  { nome: "Max Air", quantidade: 25, valor: 75000 },
  { nome: "Box", quantidade: 38, valor: 52000 },
  { nome: "Veneziana", quantidade: 15, valor: 45000 },
];

const mockFunilVendas = [
  { name: "Leads", value: 150 },
  { name: "Qualificados", value: 85 },
  { name: "Proposta", value: 45 },
  { name: "Negociação", value: 25 },
  { name: "Fechado", value: 18 },
];

const mockProducaoEtapas = [
  { etapa: "Cortado", quantidade: 42, tempoMedio: 2.5 },
  { etapa: "Montado", quantidade: 38, tempoMedio: 4.2 },
  { etapa: "Vedação", quantidade: 35, tempoMedio: 1.8 },
  { etapa: "Instalação", quantidade: 30, tempoMedio: 3.5 },
  { etapa: "Pintura", quantidade: 28, tempoMedio: 2.0 },
  { etapa: "Acabamento", quantidade: 25, tempoMedio: 1.5 },
  { etapa: "QC", quantidade: 24, tempoMedio: 0.5 },
];

const mockContasReceber = [
  { status: "Em Dia", quantidade: 45, valor: 180000 },
  { status: "Vence em 7d", quantidade: 12, valor: 45000 },
  { status: "Vence em 15d", quantidade: 8, valor: 32000 },
  { status: "Vencido", quantidade: 5, valor: 18000 },
];

const chartTooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: "12px",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { plano, isLoading: planoLoading } = usePlano();
  const [period, setPeriod] = useState<PeriodFilter>("todos");
  const [viewMode, setViewMode] = useState<ViewMode>("simples");
  const [advancedTab, setAdvancedTab] = useState<DashboardTab>("executivo");

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

  const advancedTabs = [
    { id: "executivo" as const, label: "Executivo", icon: TrendingUp },
    { id: "vendas" as const, label: "Vendas", icon: DollarSign },
    { id: "producao" as const, label: "Produção", icon: Package },
    { id: "financeiro" as const, label: "Financeiro", icon: DollarSign },
    { id: "crm" as const, label: "CRM", icon: Users },
  ];

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

  // Simple View
  if (viewMode === "simples") {
    return (
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight">Olá, {saudacao}!</h1>
                <p className="text-muted-foreground text-xs sm:text-sm">{capitalizedDia}, {dataFormatada}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setViewMode("avancado")}
              >
                <Gauge className="h-4 w-4" />
                <span className="hidden sm:inline">Avançado</span>
              </Button>
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

          {/* Plan Banner */}
          {!planoLoading && (
            <Card className={cn(
              "border-0 shadow-md overflow-hidden",
              plano === "premium"
                ? "bg-gradient-to-r from-amber-500/10 to-yellow-400/10"
                : plano === "profissional"
                ? "bg-gradient-to-r from-primary/10 to-primary/5"
                : "bg-gradient-to-r from-muted to-muted/60"
            )}>
              <CardContent className="p-3 sm:p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className={cn(
                    "p-1.5 sm:p-2 rounded-lg shrink-0",
                    plano === "premium" ? "bg-amber-500/20" : plano === "profissional" ? "bg-primary/20" : "bg-muted"
                  )}>
                    <Crown className={cn(
                      "h-4 w-4",
                      plano === "premium" ? "text-amber-500" : plano === "profissional" ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base">{PLAN_LABELS[plano || "free"]}</p>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      {plano === "premium" ? "Aproveite todos os recursos avançados"
                        : plano === "profissional" ? "Desbloqueie mais recursos"
                        : "Atualize para acessar mais recursos"}
                    </p>
                  </div>
                </div>
                {plano !== "premium" && (
                  <Button size="sm" variant={plano === "profissional" ? "default" : "outline"} className="gap-1 shrink-0" onClick={() => navigate("/configuracoes?tab=planos")}>
                    Upgrade <ArrowRight className="h-3 w-3" />
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Stats Grid - Simple KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="overflow-hidden">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Faturamento</p>
                    <p className="text-base sm:text-lg font-bold truncate">{formatCurrency(stats.faturamentoTotal)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Orçamentos</p>
                    <p className="text-base sm:text-lg font-bold truncate">{stats.totalOrcamentos}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Package className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Pedidos</p>
                    <p className="text-base sm:text-lg font-bold truncate">{stats.totalPedidos}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <CalendarDays className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Em Produção</p>
                    <p className="text-base sm:text-lg font-bold truncate">{stats.emProducao}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Receita Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Faturamento Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockReceitaMensal}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="mes" fontSize={12} tickLine={false} />
                      <YAxis fontSize={12} tickLine={false} tickFormatter={(v) => `R$ ${v / 1000}k`} />
                      <Tooltip contentStyle={chartTooltipStyle} formatter={(value: number) => [formatCurrency(value), "Valor"]} />
                      <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Status Orçamentos */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Status Orçamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orcamentosStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="count"
                      >
                        {orcamentosStatus.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={["hsl(142.1 76.2% 36.3%)", "hsl(221.2 83.2% 53.3%)", "hsl(38 92% 50%)", "hsl(0 84.2% 60.2%)"][index % 4]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={chartTooltipStyle} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Pedidos Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {statusPedidos.slice(0, 5).map((pedido, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn(
                        "p-1.5 rounded-lg shrink-0",
                        pedido.status === "aprovado" ? "bg-emerald-500/10" :
                        pedido.status === "pendente" ? "bg-amber-500/10" :
                        pedido.status === "rejeitado" ? "bg-red-500/10" : "bg-blue-500/10"
                      )}>
                        {pedido.status === "aprovado" ? <CheckCircle className="h-4 w-4 text-emerald-500" /> :
                         pedido.status === "pendente" ? <Clock className="h-4 w-4 text-amber-500" /> :
                         pedido.status === "rejeitado" ? <XCircle className="h-4 w-4 text-red-500" /> :
                         <AlertCircle className="h-4 w-4 text-blue-500" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{pedido.cliente || "Cliente"}</p>
                        <p className="text-xs text-muted-foreground">{pedido.numero || `#${i + 1}`}</p>
                      </div>
                    </div>
                    <Badge variant={pedido.status === "aprovado" ? "default" : "secondary"} className="shrink-0">
                      {pedido.status}
                    </Badge>
                  </div>
                ))}
                {statusPedidos.length === 0 && (
                  <p className="text-center py-4 text-muted-foreground text-sm">Nenhum pedido encontrado</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </PullToRefresh>
    );
  }

  // Advanced View
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => setViewMode("simples")}>
            <LayoutDashboard className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Dashboard Avançado</h1>
            <p className="text-muted-foreground text-sm">Análise completa estilo Power BI</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            <span className="hidden sm:inline">Este Ano</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={advancedTab} onValueChange={(v) => setAdvancedTab(v as DashboardTab)}>
        <TabsList className="grid w-full grid-cols-5 h-auto p-1">
          {advancedTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex flex-col items-center gap-1 py-2 px-1"
            >
              <tab.icon className="h-4 w-4" />
              <span className="text-xs">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* EXECUTIVO */}
        <TabsContent value="executivo" className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              title="Receita Total"
              value="R$ 487K"
              subtitle="Este ano"
              trend={18.5}
              trendLabel="vs meta"
              icon={<DollarSign className="h-5 w-5 text-blue-500" />}
              sparkData={generateSparkData(40000)}
              accentColor="hsl(221.2 83.2% 53.3%)"
            />
            <KpiCard
              title="Propostas"
              value="156"
              subtitle="Este ano"
              trend={12.3}
              trendLabel="vs ano anterior"
              icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
              sparkData={generateSparkData(13)}
              accentColor="hsl(142.1 76.2% 36.3%)"
            />
            <KpiCard
              title="Taxa Conversão"
              value="28.5%"
              subtitle="Proposta → Venda"
              trend={3.2}
              trendLabel="pp"
              icon={<CheckCircle className="h-5 w-5 text-purple-500" />}
              sparkData={generateSparkData(25)}
              accentColor="hsl(280 85% 55%)"
            />
            <KpiCard
              title="Em Produção"
              value="24"
              subtitle="Pedidos ativos"
              trend={-5.2}
              trendLabel="vs semana passada"
              icon={<Package className="h-5 w-5 text-amber-500" />}
              sparkData={generateSparkData(24)}
              accentColor="hsl(38 92% 50%)"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Receita x Meta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockReceitaMensal}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" fontSize={12} />
                      <YAxis fontSize={12} tickFormatter={(v) => `R$ ${v / 1000}k`} />
                      <Tooltip contentStyle={chartTooltipStyle} />
                      <Bar dataKey="meta" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Funil de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <FunnelChartComponent data={mockFunilVendas} />
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* VENDAS */}
        <TabsContent value="vendas" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Vendas por Tipologia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockVendasPorTipologia} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" fontSize={12} tickFormatter={(v) => `R$ ${v / 1000}k`} />
                      <YAxis type="category" dataKey="nome" fontSize={12} width={100} />
                      <Tooltip contentStyle={chartTooltipStyle} formatter={(value: number) => [formatCurrency(value), "Valor"]} />
                      <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Sazonalidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChartComponent
                      data={[
                        { mes: "Jan", residencial: 35, comercial: 15 },
                        { mes: "Fev", residencial: 42, comercial: 18 },
                        { mes: "Mar", residencial: 55, comercial: 22 },
                        { mes: "Abr", residencial: 68, comercial: 35 },
                        { mes: "Mai", residencial: 72, comercial: 42 },
                        { mes: "Jun", residencial: 65, comercial: 38 },
                      ]}
                      lines={[
                        { key: "residencial", color: "hsl(142.1 76.2% 36.3%)", name: "Residencial" },
                        { key: "comercial", color: "hsl(221.2 83.2% 53.3%)", name: "Comercial" },
                      ]}
                    />
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* PRODUÇÃO */}
        <TabsContent value="producao" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Etapas de Produção</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockProducaoEtapas}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="etapa" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip contentStyle={chartTooltipStyle} />
                      <Bar dataKey="quantidade" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Mapa de Calor - Atendimentos</CardTitle>
              </CardHeader>
              <CardContent>
                <HeatmapComponent />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FINANCEIRO */}
        <TabsContent value="financeiro" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Contas a Receber</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockContasReceber}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="valor"
                      >
                        <Cell fill="hsl(142.1 76.2% 36.3%)" />
                        <Cell fill="hsl(48 92% 50%)" />
                        <Cell fill="hsl(280 85% 55%)" />
                        <Cell fill="hsl(0 84.2% 60.2%)" />
                      </Pie>
                      <Tooltip contentStyle={chartTooltipStyle} formatter={(value: number) => [formatCurrency(value), "Valor"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Margem de Lucro</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[300px]">
                <GaugeChartComponent value={35} label="Margem Média" max={50} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* CRM */}
        <TabsContent value="crm" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Pipeline de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <FunnelChartComponent data={mockFunilVendas} />
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
