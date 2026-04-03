import { DollarSign, FileCheck, TrendingUp, Factory, ExternalLink, BarChart3, Receipt, Package, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStats, usePedidosStatus } from "@/hooks/use-dashboard-data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const Dashboard = () => {
  const { data: stats, isLoading } = useDashboardStats();
  const { data: statusPedidos = [] } = usePedidosStatus();

  const now = new Date();
  const hora = now.getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
  const diaSemana = now.toLocaleDateString("pt-BR", { weekday: "long" });
  const dataFormatada = now.toLocaleDateString("pt-BR", { day: "numeric", month: "long" });
  const capitalizedDia = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Olá, {saudacao}!</h1>
          <p className="text-muted-foreground text-sm">{capitalizedDia}, {dataFormatada}</p>
        </div>
      </div>

      {/* Top stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-foreground text-background border-0 shadow-lg">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">VENDAS</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(stats.vendas)}</p>
            <div className="mt-3 flex gap-6 text-xs opacity-70">
              <div>
                <span className="block">Ticket-médio</span>
                <span className="font-semibold">{formatCurrency(stats.ticketMedio)}</span>
              </div>
              <div>
                <span className="block">Vendas totais</span>
                <span className="font-semibold">{stats.vendasCount} vendas</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardContent className="p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">OBRAS ENTREGUES</span>
            <p className="text-3xl font-bold mt-2">{stats.obrasEntregues}</p>
            <p className="text-xs text-muted-foreground mt-1">concluídas</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardContent className="p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">ORÇAMENTOS</span>
            <p className="text-2xl font-bold mt-2">{formatCurrency(stats.orcamentosRealizados)}</p>
            <div className="mt-3 flex gap-6 text-xs text-muted-foreground">
              <div>
                <span className="block">Qtd. total</span>
                <span className="font-semibold text-foreground">{stats.orcamentosCount} orçamentos</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground border-0 shadow-lg">
          <CardContent className="p-5">
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">PRODUÇÃO</span>
            <p className="text-3xl font-bold mt-2">{stats.producaoAndamento}</p>
            <p className="text-xs opacity-80 mt-1">pedidos em andamento</p>
          </CardContent>
        </Card>
      </div>

      {/* Second row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="shadow-sm border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <span className="text-sm font-semibold">A Receber</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(stats.aReceber)}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
                <DollarSign className="h-4 w-4 text-destructive" />
              </div>
              <span className="text-sm font-semibold">A Pagar</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(stats.aPagar)}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
                <Package className="h-4 w-4 text-warning" />
              </div>
              <span className="text-sm font-semibold">Estoque</span>
            </div>
            <p className="text-2xl font-bold">{stats.estoqueTotal}</p>
            <p className="text-xs text-muted-foreground mt-1">itens no inventário</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Saldo Financeiro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[200px]">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{formatCurrency(stats.saldoProjetado)}</p>
                <p className="text-sm text-muted-foreground mt-1">saldo projetado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Status dos Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusPedidos} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={4} dataKey="value">
                  {statusPedidos.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
