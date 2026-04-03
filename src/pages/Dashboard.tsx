import { useState } from "react";
import { DollarSign, TrendingUp, Package, Loader2, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboardStats, usePedidosStatus, useReceitaMensal, type PeriodFilter } from "@/hooks/use-dashboard-data";
import { formatCurrency } from "@/lib/formatters";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { cn } from "@/lib/utils";

const periodOptions: { key: PeriodFilter; label: string }[] = [
  { key: "semana", label: "7 dias" },
  { key: "mes", label: "30 dias" },
  { key: "trimestre", label: "3 meses" },
  { key: "ano", label: "12 meses" },
  { key: "todos", label: "Todos" },
];

const Dashboard = () => {
  const [period, setPeriod] = useState<PeriodFilter>("todos");
  const { data: stats, isLoading } = useDashboardStats(period);
  const { data: statusPedidos = [] } = usePedidosStatus(period);
  const { data: receitaMensal = [] } = useReceitaMensal();

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
      {/* Greeting + Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Olá, {saudacao}!</h1>
          <p className="text-muted-foreground text-sm">{capitalizedDia}, {dataFormatada}</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border bg-muted/50 p-1">
          {periodOptions.map((opt) => (
            <Button
              key={opt.key}
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-3 text-xs font-medium rounded-md transition-all",
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
            <CardTitle className="text-base font-semibold">Receita Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            {receitaMensal.length > 0 && receitaMensal.some(r => r.valor > 0) ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={receitaMensal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), "Receita"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[280px] text-muted-foreground">
                <CalendarDays className="h-10 w-10 mb-2 opacity-40" />
                <p className="text-sm">Sem dados de receita nos últimos 6 meses</p>
                <p className="text-xs mt-1">Crie pedidos para ver o gráfico</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Status dos Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            {statusPedidos.some(s => s.value > 0) ? (
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
            ) : (
              <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground">
                <p className="text-sm">Sem pedidos no período</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
