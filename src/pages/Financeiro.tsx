import { useState } from "react";
import { contasFinanceiras, financeiroResumo, formatCurrency, formatDate } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  TrendingUp, TrendingDown, Wallet, AlertTriangle,
  Search, Plus, CheckCircle2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Secao = "receber" | "pagar" | "resumo";
type StatusFilter = "todos" | "pendente" | "pago" | "vencido";

const secoes: { key: Secao; label: string }[] = [
  { key: "receber", label: "A Receber" },
  { key: "pagar", label: "A Pagar" },
  { key: "resumo", label: "Resumo" },
];

const Financeiro = () => {
  const [secao, setSecao] = useState<Secao>("receber");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");
  const [search, setSearch] = useState("");

  const contas = contasFinanceiras.filter((c) => c.tipo === (secao === "pagar" ? "pagar" : "receber"));
  const filtered = contas.filter((c) => {
    if (statusFilter !== "todos" && c.status !== statusFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return c.cliente.toLowerCase().includes(s) || c.descricao.toLowerCase().includes(s) || c.id.toLowerCase().includes(s);
    }
    return true;
  });

  const handleRecebido = (id: string) => {
    toast({ title: "Pagamento confirmado", description: `${id} marcado como recebido.` });
  };

  const summaryCards = [
    { label: "A Receber", valor: financeiroResumo.aReceber, icon: TrendingUp, color: "text-success" },
    { label: "A Pagar", valor: financeiroResumo.aPagar, icon: TrendingDown, color: "text-destructive" },
    { label: "Saldo Projetado", valor: financeiroResumo.saldoProjetado, icon: Wallet, color: "text-primary" },
    { label: "Inadimplência", valor: financeiroResumo.inadimplencia, icon: AlertTriangle, color: "text-destructive" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Financeiro</h1>
        <p className="text-muted-foreground text-sm">Gestão financeira</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.label} className="shadow-sm border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{card.label}</span>
                <card.icon className={cn("h-5 w-5", card.color)} />
              </div>
              <p className={cn("text-2xl font-bold", card.color)}>
                {formatCurrency(card.valor)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 shrink-0 space-y-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">SEÇÕES</p>
            <div className="space-y-0.5">
              {secoes.map((s) => (
                <button
                  key={s.key}
                  onClick={() => { setSecao(s.key); setStatusFilter("todos"); }}
                  className={cn(
                    "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    secao === s.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">AÇÕES</p>
            <button className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
              <Plus className="h-3.5 w-3.5" /> Nova Receita
            </button>
            <button className="flex items-center gap-1.5 text-sm text-destructive font-medium hover:underline mt-1">
              <Plus className="h-3.5 w-3.5" /> Nova Despesa
            </button>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 space-y-4">
          {secao === "resumo" ? (
            <Card className="shadow-sm border-border/50">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">Resumo Financeiro</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Total a Receber</span>
                    <span className="font-bold text-success">{formatCurrency(financeiroResumo.aReceber)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Total a Pagar</span>
                    <span className="font-bold text-destructive">{formatCurrency(financeiroResumo.aPagar)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Saldo Projetado</span>
                    <span className="font-bold text-primary">{formatCurrency(financeiroResumo.saldoProjetado)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Inadimplência</span>
                    <span className="font-bold text-destructive">{formatCurrency(financeiroResumo.inadimplencia)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Search + actions */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Buscar lançamentos..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" /> Nova Receita
                </Button>
                <Button variant="destructive" className="gap-2">
                  <Plus className="h-4 w-4" /> Nova Despesa
                </Button>
              </div>

              {/* Tabs */}
              <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                <TabsList>
                  <TabsTrigger value="todos">Todos</TabsTrigger>
                  <TabsTrigger value="pendente">Pendente</TabsTrigger>
                  <TabsTrigger value="pago">Pago</TabsTrigger>
                  <TabsTrigger value="vencido">Vencido</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Table */}
              <div className="rounded-lg border bg-card shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((conta) => (
                      <TableRow key={conta.id}>
                        <TableCell className="font-medium">{conta.id}</TableCell>
                        <TableCell className="font-medium">{conta.cliente}</TableCell>
                        <TableCell className="text-muted-foreground">{conta.descricao}</TableCell>
                        <TableCell>{formatDate(conta.vencimento)}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(conta.valor)}</TableCell>
                        <TableCell><StatusBadge status={conta.status} /></TableCell>
                        <TableCell className="text-right">
                          {conta.status !== "pago" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1.5 text-xs"
                              onClick={() => handleRecebido(conta.id)}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Recebido
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                          Nenhum lançamento encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Financeiro;
