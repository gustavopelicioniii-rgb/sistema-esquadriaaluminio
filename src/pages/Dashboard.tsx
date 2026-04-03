import { DollarSign, FileCheck, TrendingUp, Factory, ExternalLink, BarChart3, Receipt, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  dashboardStats, receitaMensal, statusPedidos, producaoDetalhe, formatCurrency,
} from "@/data/mockData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const Dashboard = () => {
  const now = new Date();
  const hora = now.getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
  const diaSemana = now.toLocaleDateString("pt-BR", { weekday: "long" });
  const dataFormatada = now.toLocaleDateString("pt-BR", { day: "numeric", month: "long" });
  const capitalizedDia = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Olá, {saudacao}, Admin.</h1>
          <p className="text-muted-foreground text-sm">{capitalizedDia}, {dataFormatada}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium hover:bg-muted transition-colors">
            👥 Parceiros
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium hover:bg-muted transition-colors">
            📋 Assinaturas <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">1</span>
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            ▶ Tutoriais
          </button>
        </div>
      </div>

      {/* Top stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Vendas */}
        <Card className="bg-foreground text-background border-0 shadow-lg">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">VENDAS</span>
              <button className="text-xs opacity-70 hover:opacity-100 flex items-center gap-1">Ver detalhes <ExternalLink className="h-3 w-3" /></button>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(dashboardStats.vendas)}</p>
            <span className="mt-1 inline-block rounded bg-success/20 px-2 py-0.5 text-xs font-semibold text-success">↗ +12%</span>
            <div className="mt-3 flex gap-6 text-xs opacity-70">
              <div>
                <span className="block">Ticket-médio</span>
                <span className="font-semibold text-white">{formatCurrency(dashboardStats.ticketMedio)}</span>
              </div>
              <div>
                <span className="block">Vendas totais</span>
                <span className="font-semibold text-white">{dashboardStats.vendasCount} vendas</span>
              </div>
            </div>
            <p className="mt-2 text-xs opacity-60">Destaque do mês — João Silva — {formatCurrency(34250)}</p>
          </CardContent>
        </Card>

        {/* Obras Entregues */}
        <Card className="shadow-sm border-border/50">
          <CardContent className="p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">OBRAS ENTREGUES</span>
            <p className="text-3xl font-bold mt-2">{dashboardStats.obrasEntregues}</p>
            <p className="text-xs text-muted-foreground mt-1">no total</p>
            <span className="mt-1 inline-block text-xs font-semibold text-destructive">↘ -3% vs mês anterior</span>
            <div className="mt-3 flex gap-6 text-xs text-muted-foreground">
              <div>
                <span className="block">Ticket-médio</span>
                <span className="font-semibold text-foreground">{formatCurrency(dashboardStats.ticketMedio)}</span>
              </div>
            </div>
            <button className="mt-2 text-xs text-primary font-medium flex items-center gap-1">Ver mais <ExternalLink className="h-3 w-3" /></button>
          </CardContent>
        </Card>

        {/* Orçamentos Realizados */}
        <Card className="shadow-sm border-border/50">
          <CardContent className="p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">ORÇAMENTOS REALIZADOS</span>
            <p className="text-2xl font-bold mt-2">{formatCurrency(dashboardStats.orcamentosRealizados)}</p>
            <span className="mt-1 inline-block text-xs font-semibold text-success">↗ +3% vs mês anterior</span>
            <div className="mt-3 flex gap-6 text-xs text-muted-foreground">
              <div>
                <span className="block">Ticket-médio</span>
                <span className="font-semibold text-foreground">{formatCurrency(dashboardStats.ticketMedio)}</span>
              </div>
              <div>
                <span className="block">Qtd. total</span>
                <span className="font-semibold text-foreground">{dashboardStats.orcamentosCount} orçamentos</span>
              </div>
            </div>
            <button className="mt-2 text-xs text-primary font-medium flex items-center gap-1">Ver mais <ExternalLink className="h-3 w-3" /></button>
          </CardContent>
        </Card>

        {/* Produção */}
        <Card className="bg-primary text-primary-foreground border-0 shadow-lg">
          <CardContent className="p-5">
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">PRODUÇÃO</span>
            <p className="text-3xl font-bold mt-2">{dashboardStats.producaoAndamento}</p>
            <p className="text-xs opacity-80 mt-1">pedidos em andamento</p>
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="opacity-80">Corte</span>
                <span className="font-semibold">{producaoDetalhe.corte} pedidos</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">Montagem</span>
                <span className="font-semibold">{producaoDetalhe.montagem} pedidos</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">Instalação</span>
                <span className="font-semibold">{producaoDetalhe.instalacao} pedidos</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second row - Markup, Notas Fiscais, Estoque */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="shadow-sm border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <span className="text-sm font-semibold">Markup</span>
                <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">PLUS</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Markup atual</p>
            <p className="text-2xl font-bold">{dashboardStats.markupAtual}</p>
            <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
              <div>
                <span className="block">Desp. fixas</span>
                <span className="font-semibold text-foreground">{formatCurrency(dashboardStats.despFixas)}</span>
              </div>
              <div>
                <span className="block">Desp. variáveis</span>
                <span className="font-semibold text-foreground">{formatCurrency(dashboardStats.despVariaveis)}</span>
              </div>
              <div>
                <span className="block">Fat. médio</span>
                <span className="font-semibold text-foreground">{formatCurrency(dashboardStats.fatMedio)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                <Receipt className="h-4 w-4 text-success" />
              </div>
              <div>
                <span className="text-sm font-semibold">Notas fiscais</span>
                <span className="ml-2 rounded bg-success/10 px-1.5 py-0.5 text-[10px] font-bold text-success">PLUS</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Valor total (R$)</p>
            <p className="text-2xl font-bold">{formatCurrency(dashboardStats.notasFiscais)}</p>
            <div className="mt-3 flex gap-6 text-xs text-muted-foreground">
              <div>
                <span className="block">Produtos</span>
                <span className="font-semibold text-foreground">{dashboardStats.nfProdutos}</span>
              </div>
              <div>
                <span className="block">Serviços</span>
                <span className="font-semibold text-foreground">{dashboardStats.nfServicos}</span>
              </div>
              <div>
                <span className="block">Total</span>
                <span className="font-semibold text-foreground">{dashboardStats.nfTotal}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
                <Package className="h-4 w-4 text-warning" />
              </div>
              <div>
                <span className="text-sm font-semibold">Estoque</span>
                <span className="ml-2 rounded bg-warning/10 px-1.5 py-0.5 text-[10px] font-bold text-warning">PLUS</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Total do inventário</p>
            <p className="text-2xl font-bold">{dashboardStats.estoqueTotal}</p>
            <div className="mt-3 w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: "72%" }} />
            </div>
            <button className="mt-3 text-xs text-primary font-medium flex items-center gap-1">Desbloquear <ExternalLink className="h-3 w-3" /></button>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Receita Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Status dos Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusPedidos} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
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
