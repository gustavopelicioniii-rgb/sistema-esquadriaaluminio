import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, Calendar, TrendingUp, Users, Package, DollarSign, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { useDashboardStats } from "@/hooks/use-dashboard-data";

// Mock data generators for demonstration
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
  { etapa: "Instalação Vidro", quantidade: 30, tempoMedio: 3.5 },
  { etapa: "Pintura", quantidade: 28, tempoMedio: 2.0 },
  { etapa: "Acabamento", quantidade: 25, tempoMedio: 1.5 },
  { etapa: " QC", quantidade: 24, tempoMedio: 0.5 },
];

const mockContasReceber = [
  { status: "Em Dia", quantidade: 45, valor: 180000 },
  { status: "Vence em 7d", quantidade: 12, valor: 45000 },
  { status: "Vence em 15d", quantidade: 8, valor: 32000 },
  { status: "Vencido", quantidade: 5, valor: 18000 },
];

const mockVendasPorVendedor = [
  { nome: "João Silva", vendas: 125000, metas: 100000, conversao: 32 },
  { nome: "Maria Santos", vendas: 98000, metas: 100000, conversao: 28 },
  { nome: "Pedro Costa", vendas: 87000, metas: 80000, conversao: 25 },
  { nome: "Ana Oliveira", vendas: 76000, metas: 80000, conversao: 22 },
];

const mockSazonalidade = [
  { mes: "Jan", residencial: 35, comercial: 15 },
  { mes: "Fev", residencial: 42, comercial: 18 },
  { mes: "Mar", residencial: 55, comercial: 22 },
  { mes: "Abr", residencial: 68, comercial: 35 },
  { mes: "Mai", residencial: 72, comercial: 42 },
  { mes: "Jun", residencial: 65, comercial: 38 },
  { mes: "Jul", residencial: 58, comercial: 32 },
  { mes: "Ago", residencial: 62, comercial: 36 },
  { mes: "Set", residencial: 70, comercial: 45 },
  { mes: "Out", residencial: 78, comercial: 48 },
  { mes: "Nov", residencial: 85, comercial: 52 },
  { mes: "Dez", residencial: 45, comercial: 25 },
];

const heatmapData = [
  { label: "Seg", values: [
    { label: "8h", value: 2 }, { label: "9h", value: 5 }, { label: "10h", value: 8 },
    { label: "11h", value: 12 }, { label: "14h", value: 10 }, { label: "15h", value: 7 },
    { label: "16h", value: 6 }, { label: "17h", value: 4 }, { label: "18h", value: 3 },
  ]},
  { label: "Ter", values: [
    { label: "8h", value: 3 }, { label: "9h", value: 6 }, { label: "10h", value: 10 },
    { label: "11h", value: 14 }, { label: "14h", value: 12 }, { label: "15h", value: 9 },
    { label: "16h", value: 8 }, { label: "17h", value: 5 }, { label: "18h", value: 4 },
  ]},
  { label: "Qua", values: [
    { label: "8h", value: 4 }, { label: "9h", value: 7 }, { label: "10h", value: 11 },
    { label: "11h", value: 15 }, { label: "14h", value: 14 }, { label: "15h", value: 10 },
    { label: "16h", value: 9 }, { label: "17h", value: 6 }, { label: "18h", value: 5 },
  ]},
  { label: "Qui", values: [
    { label: "8h", value: 3 }, { label: "9h", value: 8 }, { label: "10h", value: 12 },
    { label: "11h", value: 16 }, { label: "14h", value: 13 }, { label: "15h", value: 11 },
    { label: "16h", value: 8 }, { label: "17h", value: 5 }, { label: "18h", value: 4 },
  ]},
  { label: "Sex", values: [
    { label: "8h", value: 2 }, { label: "9h", value: 5 }, { label: "10h", value: 9 },
    { label: "11h", value: 11 }, { label: "14h", value: 8 }, { label: "15h", value: 6 },
    { label: "16h", value: 4 }, { label: "17h", value: 3 }, { label: "18h", value: 2 },
  ]},
];

type DashboardTab = "executivo" | "vendas" | "producao" | "financeiro" | "crm";

export default function AdvancedDashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("executivo");
  const { data: stats } = useDashboardStats("ano");

  const tabs = [
    { id: "executivo", label: "Executivo", icon: TrendingUp },
    { id: "vendas", label: "Vendas", icon: DollarSign },
    { id: "producao", label: "Produção", icon: Package },
    { id: "financeiro", label: "Financeiro", icon: DollarSign },
    { id: "crm", label: "CRM", icon: Users },
  ] as const;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Dashboard Avançado</h1>
          <p className="text-muted-foreground text-sm">Análise completa estilo Power BI</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Este Ano</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DashboardTab)}>
        <TabsList className="grid w-full grid-cols-5 h-auto p-1">
          {tabs.map((tab) => (
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

        {/* DASHBOARD EXECUTIVO */}
        <TabsContent value="executivo" className="space-y-4">
          {/* KPIs principais */}
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
              accentColor="hsl(280 60% 50%)"
            />
            <KpiCard
              title="No Prazo"
              value="94.2%"
              subtitle="Entregas"
              trend={-1.5}
              trendLabel="vs mês anterior"
              icon={<Clock className="h-5 w-5 text-amber-500" />}
              sparkData={generateSparkData(95)}
              accentColor="hsl(38 92% 50%)"
            />
          </div>

          {/* Gráficos principais */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Receita Mensal vs Meta</CardTitle>
              </CardHeader>
              <CardContent>
                <AreaChartComponent
                  data={mockReceitaMensal}
                  dataKey={["valor", "meta"]}
                  xAxisKey="mes"
                  height={280}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Vendas por Tipologia</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChartComponent
                  data={mockVendasPorTipologia}
                  dataKey="valor"
                  xAxisKey="nome"
                  height={280}
                  colors={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sazonalidade e Efficiency */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Ticket Médio</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <GaugeChartComponent
                  value={2850}
                  maxValue={5000}
                  title="Valor Médio"
                  subtitle="Por orçamento"
                  size="lg"
                  color="#3b82f6"
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Sazonalidade (Residencial vs Comercial)</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChartComponent
                  data={mockSazonalidade}
                  dataKey={["residencial", "comercial"]}
                  xAxisKey="mes"
                  height={200}
                  colors={["#3b82f6", "#10b981"]}
                />
              </CardContent>
            </Card>
          </div>

          {/* KPIs secundários */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              title="Pedidos Ativos"
              value="24"
              subtitle="Em produção"
              icon={<Package className="h-5 w-5 text-blue-500" />}
              accentColor="hsl(221.2 83.2% 53.3%)"
            />
            <KpiCard
              title="Leads"
              value="89"
              subtitle="Este mês"
              trend={24}
              icon={<Users className="h-5 w-5 text-purple-500" />}
              accentColor="hsl(280 60% 50%)"
            />
            <KpiCard
              title="Atrasados"
              value="2"
              subtitle="Requisição ação"
              icon={<AlertCircle className="h-5 w-5 text-red-500" />}
              accentColor="hsl(0 84% 60%)"
            />
            <KpiCard
              title="NPS"
              value="72"
              subtitle="Satisfação"
              trend={5}
              icon={<CheckCircle className="h-5 w-5 text-emerald-500" />}
              accentColor="hsl(142.1 76.2% 36.3%)"
            />
          </div>
        </TabsContent>

        {/* DASHBOARD DE VENDAS */}
        <TabsContent value="vendas" className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              title="Total Vendido"
              value="R$ 487K"
              trend={18.5}
              icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
              sparkData={generateSparkData(40000)}
              accentColor="hsl(142.1 76.2% 36.3%)"
            />
            <KpiCard
              title="Pedidos"
              value="156"
              trend={12}
              icon={<Package className="h-5 w-5 text-blue-500" />}
              sparkData={generateSparkData(13)}
              accentColor="hsl(221.2 83.2% 53.3%)"
            />
            <KpiCard
              title="Ticket Médio"
              value="R$ 2.850"
              trend={8.3}
              icon={<TrendingUp className="h-5 w-5 text-purple-500" />}
              sparkData={generateSparkData(2800)}
              accentColor="hsl(280 60% 50%)"
            />
            <KpiCard
              title="Conversão"
              value="28.5%"
              trend={3.2}
              icon={<CheckCircle className="h-5 w-5 text-amber-500" />}
              sparkData={generateSparkData(25)}
              accentColor="hsl(38 92% 50%)"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Funil de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <FunnelChartComponent
                  data={mockFunilVendas}
                  showPercent
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Vendas por Tipologia (Valor)</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChartComponent
                  data={mockVendasPorTipologia}
                  dataKey="valor"
                  nameKey="nome"
                  height={250}
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Performance por Vendedor</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChartComponent
                  data={mockVendasPorVendedor}
                  dataKey={["vendas", "metas"]}
                  xAxisKey="nome"
                  height={250}
                  colors={["#3b82f6", "#94a3b8"]}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Leads por Hora (Heatmap)</CardTitle>
              </CardHeader>
              <CardContent>
                <HeatmapComponent
                  data={heatmapData}
                  colorScheme="blue"
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Evolução Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <AreaChartComponent
                data={mockSazonalidade}
                dataKey="residencial"
                xAxisKey="mes"
                height={250}
                colors={["#10b981"]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* DASHBOARD DE PRODUÇÃO */}
        <TabsContent value="producao" className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              title="Em Produção"
              value="24"
              icon={<Clock className="h-5 w-5 text-blue-500" />}
              sparkData={generateSparkData(20)}
              accentColor="hsl(221.2 83.2% 53.3%)"
            />
            <KpiCard
              title="Tempo Médio"
              value="3.5d"
              subtitle="Por pedido"
              trend={-12}
              icon={<Package className="h-5 w-5 text-purple-500" />}
              accentColor="hsl(280 60% 50%)"
            />
            <KpiCard
              title="No Prazo"
              value="94.2%"
              trend={-1.5}
              icon={<CheckCircle className="h-5 w-5 text-emerald-500" />}
              sparkData={generateSparkData(95)}
              accentColor="hsl(142.1 76.2% 36.3%)"
            />
            <KpiCard
              title="Eficiência"
              value="87%"
              trend={5}
              icon={<TrendingUp className="h-5 w-5 text-amber-500" />}
              sparkData={generateSparkData(85)}
              accentColor="hsl(38 92% 50%)"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Etapas da Produção</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChartComponent
                  data={mockProducaoEtapas}
                  dataKey="quantidade"
                  xAxisKey="etapa"
                  height={280}
                  horizontal
                  colors={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Tempo Médio por Etapa (horas)</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChartComponent
                  data={mockProducaoEtapas}
                  dataKey="tempoMedio"
                  xAxisKey="etapa"
                  height={280}
                  colors={["#f59e0b"]}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">WIP - Work in Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <FunnelChartComponent
                data={mockProducaoEtapas}
                title="Fluxo de Produção"
                showPercent
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* DASHBOARD FINANCEIRO */}
        <TabsContent value="financeiro" className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              title="Receber"
              value="R$ 275K"
              subtitle="Em aberto"
              icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
              sparkData={generateSparkData(25000)}
              accentColor="hsl(142.1 76.2% 36.3%)"
            />
            <KpiCard
              title="Pagar"
              value="R$ 142K"
              subtitle="Este mês"
              icon={<Package className="h-5 w-5 text-red-500" />}
              sparkData={generateSparkData(15000)}
              accentColor="hsl(0 84% 60%)"
            />
            <KpiCard
              title="Lucro"
              value="R$ 89K"
              subtitle="Este mês"
              trend={22}
              icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
              sparkData={generateSparkData(8000)}
              accentColor="hsl(221.2 83.2% 53.3%)"
            />
            <KpiCard
              title="Margem"
              value="32.4%"
              trend={3.2}
              icon={<CheckCircle className="h-5 w-5 text-purple-500" />}
              sparkData={generateSparkData(30)}
              accentColor="hsl(280 60% 50%)"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Contas a Receber por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChartComponent
                  data={mockContasReceber}
                  dataKey="valor"
                  nameKey="status"
                  height={280}
                  colors={["#10b981", "#f59e0b", "#f97316", "#ef4444"]}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Evolução Financeira</CardTitle>
              </CardHeader>
              <CardContent>
                <AreaChartComponent
                  data={mockReceitaMensal}
                  dataKey="valor"
                  xAxisKey="mes"
                  height={280}
                  colors={["#10b981"]}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Margem por Tipologia</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChartComponent
                data={mockVendasPorTipologia}
                dataKey="valor"
                xAxisKey="nome"
                height={250}
                colors={["#3b82f6"]}
                horizontal
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* DASHBOARD CRM */}
        <TabsContent value="crm" className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              title="Total Leads"
              value="342"
              subtitle="Este ano"
              trend={28}
              icon={<Users className="h-5 w-5 text-blue-500" />}
              sparkData={generateSparkData(30)}
              accentColor="hsl(221.2 83.2% 53.3%)"
            />
            <KpiCard
              title="Qualificados"
              value="156"
              trend={15}
              icon={<CheckCircle className="h-5 w-5 text-emerald-500" />}
              sparkData={generateSparkData(14)}
              accentColor="hsl(142.1 76.2% 36.3%)"
            />
            <KpiCard
              title="Conversão"
              value="18%"
              trend={2.5}
              icon={<TrendingUp className="h-5 w-5 text-purple-500" />}
              sparkData={generateSparkData(16)}
              accentColor="hsl(280 60% 50%)"
            />
            <KpiCard
              title="Follow-ups"
              value="89"
              subtitle="Pendentes"
              icon={<Clock className="h-5 w-5 text-amber-500" />}
              accentColor="hsl(38 92% 50%)"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Funil de Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <FunnelChartComponent
                  data={mockFunilVendas}
                  showPercent
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Leads por Fonte</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChartComponent
                  data={[
                    { nome: "Indicação", value: 45 },
                    { nome: "Instagram", value: 28 },
                    { nome: "Google", value: 35 },
                    { nome: "Feira", value: 12 },
                    { nome: "Outro", value: 8 },
                  ]}
                  dataKey="value"
                  nameKey="nome"
                  height={280}
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Leads por Vendedor</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChartComponent
                  data={mockVendasPorVendedor}
                  dataKey="vendas"
                  xAxisKey="nome"
                  height={280}
                  colors={["#3b82f6"]}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Taxa de Conversão por Vendedor</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <GaugeChartComponent
                  value={28.5}
                  maxValue={50}
                  title="Média Geral"
                  subtitle="Conversão Lead → Venda"
                  size="lg"
                  color="#3b82f6"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
