import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { ExportButtons } from "@/components/ExportButtons";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat("pt-BR").format(new Date(dateStr));

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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar lançamentos..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" /> {tipo === "receber" ? "Nova Receita" : "Nova Despesa"}
        </Button>
      </div>

      <Tabs value={statusFilter} onValueChange={v => setStatusFilter(v as StatusFilter)}>
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="pendente">Pendente</TabsTrigger>
          <TabsTrigger value="pago">Pago</TabsTrigger>
          <TabsTrigger value="vencido">Vencido</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(conta => (
                  <TableRow key={conta.id}>
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
                          onClick={() => updateConta.mutate({ id: conta.id, status: "pago" }, { onSuccess: () => toast.success("Marcado como pago") })}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Recebido
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Nenhum lançamento encontrado.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
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
  const { data: contas = [], isLoading } = useContasFinanceiras();
  const [activeTab, setActiveTab] = useState<"resumo" | "receber" | "pagar">("resumo");

  const aReceber = contas.filter(c => c.tipo === "receber").reduce((s, c) => s + Number(c.valor), 0);
  const aPagar = contas.filter(c => c.tipo === "pagar").reduce((s, c) => s + Number(c.valor), 0);
  const totalPago = contas.filter(c => c.status === "pago").reduce((s, c) => s + Number(c.valor), 0);
  const saldo = aReceber - aPagar;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-muted-foreground text-sm">Visão geral das finanças da empresa</p>
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
          { label: "Total a Receber", valor: aReceber, icon: TrendingUp, color: "text-success" },
          { label: "Total a Pagar", valor: aPagar, icon: TrendingDown, color: "text-destructive" },
          { label: "Pago", valor: totalPago, icon: Wallet, color: "text-primary" },
          { label: "Saldo", valor: saldo, icon: DollarSign, color: saldo >= 0 ? "text-success" : "text-destructive" },
        ].map(card => (
          <Card key={card.label} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{card.label}</span>
                <card.icon className={cn("h-4 w-4", card.color)} />
              </div>
              <p className="text-lg sm:text-2xl font-bold">{formatCurrency(card.valor)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="receber">A Receber</TabsTrigger>
          <TabsTrigger value="pagar">A Pagar</TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === "resumo" && (
        <Card>
          <CardHeader><CardTitle className="text-sm font-bold">Últimas Contas</CardTitle></CardHeader>
          <CardContent>
            {contas.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contas.slice(0, 10).map(c => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.cliente}</TableCell>
                        <TableCell className="text-muted-foreground">{c.descricao}</TableCell>
                        <TableCell>{c.tipo === "receber" ? <ArrowDownCircle className="h-4 w-4 text-success" /> : <ArrowUpCircle className="h-4 w-4 text-destructive" />}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(c.valor)}</TableCell>
                        <TableCell><StatusBadge status={c.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center text-muted-foreground text-sm py-8">Nenhuma movimentação financeira ainda.</p>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "receber" && <ContasView tipo="receber" contas={contas} />}
      {activeTab === "pagar" && <ContasView tipo="pagar" contas={contas} />}
    </div>
  );
};

export default Financeiro;
