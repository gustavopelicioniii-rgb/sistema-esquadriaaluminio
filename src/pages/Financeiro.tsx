import { useState, useMemo } from "react";
import { PullToRefresh } from "@/components/PullToRefresh";
import { useContasFinanceiras, useCreateConta, useUpdateConta, type ContaFinanceira } from "@/hooks/use-contas-financeiras";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  TrendingUp, TrendingDown, Wallet, DollarSign,
  Search, Plus, CheckCircle2, Loader2,
  CreditCard, ArrowDownCircle, ArrowUpCircle,
  CalendarIcon, ChevronLeft, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { ExportButtons } from "@/components/ExportButtons";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat("pt-BR").format(new Date(dateStr));

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

type StatusFilter = "todos" | "pendente" | "pago" | "vencido";

function ContasView({ tipo, contas }: { tipo: "receber" | "pagar"; contas: ContaFinanceira[] }) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");
  const [search, setSearch] = useState("");
  const updateConta = useUpdateConta();
  const [dialogOpen, setDialogOpen] = useState(false);
  const createConta = useCreateConta();
  const [form, setForm] = useState({ cliente: "", descricao: "", valor: 0, vencimento: "" });

  const filtered = contas
    .filter(c => c.tipo === tipo)
    .filter(c => {
      if (statusFilter !== "todos" && c.status !== statusFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return c.cliente.toLowerCase().includes(s) || c.descricao.toLowerCase().includes(s);
      }
      return true;
    });

  const handleCreate = () => {
    if (!form.cliente.trim()) { toast.error("Cliente obrigatório"); return; }
    createConta.mutate(
      { ...form, tipo, status: "pendente" },
      {
        onSuccess: () => { toast.success("Conta criada"); setDialogOpen(false); setForm({ cliente: "", descricao: "", valor: 0, vencimento: "" }); },
      }
    );
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar lançamentos..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Button className="gap-2 w-full sm:w-auto text-xs sm:text-sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" /> {tipo === "receber" ? "Nova Receita" : "Nova Despesa"}
        </Button>
      </div>

      <Tabs value={statusFilter} onValueChange={v => setStatusFilter(v as StatusFilter)}>
        <TabsList className="h-8 sm:h-9">
          <TabsTrigger value="todos" className="text-xs sm:text-sm px-2 sm:px-3">Todos</TabsTrigger>
          <TabsTrigger value="pendente" className="text-xs sm:text-sm px-2 sm:px-3">Pendente</TabsTrigger>
          <TabsTrigger value="pago" className="text-xs sm:text-sm px-2 sm:px-3">Pago</TabsTrigger>
          <TabsTrigger value="vencido" className="text-xs sm:text-sm px-2 sm:px-3">Vencido</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="hidden sm:table-cell">Descrição</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(conta => (
                  <TableRow key={conta.id}>
                    <TableCell className="font-medium text-xs sm:text-sm">{conta.cliente}</TableCell>
                    <TableCell className="text-muted-foreground hidden sm:table-cell">{conta.descricao}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{formatDate(conta.vencimento)}</TableCell>
                    <TableCell className="font-semibold text-xs sm:text-sm">{formatCurrency(conta.valor)}</TableCell>
                    <TableCell><StatusBadge status={conta.status} /></TableCell>
                    <TableCell className="text-right">
                      {conta.status !== "pago" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 text-[10px] sm:text-xs h-7 sm:h-8 px-2 sm:px-3"
                          onClick={() => updateConta.mutate({ id: conta.id, status: "pago" }, { onSuccess: () => toast.success("Marcado como pago") })}
                        >
                          <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          <span className="hidden sm:inline">Recebido</span>
                          <span className="sm:hidden">Pago</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground text-xs sm:text-sm">Nenhum lançamento encontrado.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
          <DialogHeader><DialogTitle>{tipo === "receber" ? "Nova Receita" : "Nova Despesa"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Cliente *</Label><Input value={form.cliente} onChange={e => setForm({ ...form, cliente: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Descrição</Label><Input value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Valor</Label><Input type="number" value={form.valor || ""} onChange={e => setForm({ ...form, valor: Number(e.target.value) })} /></div>
              <div className="space-y-1.5"><Label>Vencimento</Label><Input type="date" value={form.vencimento} onChange={e => setForm({ ...form, vencimento: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={createConta.isPending}>Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const Financeiro = () => {
  const { data: contas = [], isLoading, refetch } = useContasFinanceiras();
  const [activeTab, setActiveTab] = useState<"resumo" | "receber" | "pagar">("resumo");
  
  const now = new Date();
  const [filterMonth, setFilterMonth] = useState(now.getMonth()); // 0-11
  const [filterYear, setFilterYear] = useState(now.getFullYear());
  const [filterAll, setFilterAll] = useState(false);

  const filteredContas = useMemo(() => {
    if (filterAll) return contas;
    return contas.filter(c => {
      const d = new Date(c.vencimento);
      return d.getMonth() === filterMonth && d.getFullYear() === filterYear;
    });
  }, [contas, filterMonth, filterYear, filterAll]);

  const prevMonth = () => {
    if (filterMonth === 0) { setFilterMonth(11); setFilterYear(y => y - 1); }
    else setFilterMonth(m => m - 1);
    setFilterAll(false);
  };
  const nextMonth = () => {
    if (filterMonth === 11) { setFilterMonth(0); setFilterYear(y => y + 1); }
    else setFilterMonth(m => m + 1);
    setFilterAll(false);
  };

  const aReceber = filteredContas.filter(c => c.tipo === "receber").reduce((s, c) => s + Number(c.valor), 0);
  const aPagar = filteredContas.filter(c => c.tipo === "pagar").reduce((s, c) => s + Number(c.valor), 0);
  const totalPago = filteredContas.filter(c => c.status === "pago").reduce((s, c) => s + Number(c.valor), 0);
  const saldo = aReceber - aPagar;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={async () => { await refetch(); }}>
    <div className="space-y-3 sm:space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">Visão geral das finanças</p>
        </div>
        <ExportButtons getConfig={() => ({
          title: "Relatório Financeiro",
          headers: ["Tipo", "Cliente", "Descrição", "Valor", "Vencimento", "Status"],
          columnWidths: [22, 38, 38, 28, 28, 22],
          summaryCards: [
            { label: "A Receber", value: formatCurrency(aReceber) },
            { label: "A Pagar", value: formatCurrency(aPagar) },
            { label: "Saldo", value: formatCurrency(saldo) },
          ],
          rows: contas.map((c) => [
            c.tipo === "receber" ? "Receita" : "Despesa", c.cliente, c.descricao, formatCurrency(c.valor), c.vencimento, c.status,
          ]),
          filename: "financeiro",
        })} />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {[
          { label: "A Receber", valor: aReceber, icon: TrendingUp, color: "text-success" },
          { label: "A Pagar", valor: aPagar, icon: TrendingDown, color: "text-destructive" },
          { label: "Pago", valor: totalPago, icon: Wallet, color: "text-primary" },
          { label: "Saldo", valor: saldo, icon: DollarSign, color: saldo >= 0 ? "text-success" : "text-destructive" },
        ].map(card => (
          <Card key={card.label} className="shadow-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] sm:text-xs text-muted-foreground">{card.label}</span>
                <card.icon className={cn("h-3 w-3 sm:h-4 sm:w-4", card.color)} />
              </div>
              <p className="text-sm sm:text-2xl font-bold">{formatCurrency(card.valor)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as any)}>
        <TabsList className="h-8 sm:h-9">
          <TabsTrigger value="resumo" className="text-xs sm:text-sm px-2 sm:px-3">Resumo</TabsTrigger>
          <TabsTrigger value="receber" className="text-xs sm:text-sm px-2 sm:px-3">A Receber</TabsTrigger>
          <TabsTrigger value="pagar" className="text-xs sm:text-sm px-2 sm:px-3">A Pagar</TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === "resumo" && (
        <Card>
          <CardHeader className="px-3 sm:px-6"><CardTitle className="text-xs sm:text-sm font-bold">Últimas Contas</CardTitle></CardHeader>
          <CardContent className="px-0 sm:px-6">
            {contas.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead className="hidden sm:table-cell">Descrição</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contas.slice(0, 10).map(c => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium text-xs sm:text-sm">{c.cliente}</TableCell>
                        <TableCell className="text-muted-foreground hidden sm:table-cell">{c.descricao}</TableCell>
                        <TableCell>{c.tipo === "receber" ? <ArrowDownCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-success" /> : <ArrowUpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-destructive" />}</TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm">{formatCurrency(c.valor)}</TableCell>
                        <TableCell><StatusBadge status={c.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center text-muted-foreground text-xs sm:text-sm py-8">Nenhuma movimentação financeira ainda.</p>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "receber" && <ContasView tipo="receber" contas={contas} />}
      {activeTab === "pagar" && <ContasView tipo="pagar" contas={contas} />}
    </div>
    </PullToRefresh>
  );
};

export default Financeiro;
