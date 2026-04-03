import { useState } from "react";
import { contasFinanceiras, financeiroResumo, formatCurrency, formatDate } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  TrendingUp, TrendingDown, Wallet, DollarSign,
  Search, Plus, CheckCircle2,
  Receipt, FileText, FolderOpen, BarChart3,
  CreditCard, ArrowDownCircle, ArrowUpCircle, ClipboardList,
} from "lucide-react";
import { toast } from "sonner";

type StatusFilter = "todos" | "pendente" | "pago" | "vencido";

// Module cards matching the reference image
const modulos = [
  { id: "receber", label: "Contas a Receber", desc: "Gerenciar contas a receber", icon: ArrowDownCircle, color: "text-primary" },
  { id: "pagar", label: "Contas a Pagar", desc: "Gerenciar contas a pagar", icon: ArrowUpCircle, color: "text-primary" },
  { id: "pagamentos", label: "Pagamentos", desc: "Registrar pagamentos", icon: CreditCard, color: "text-primary" },
  { id: "notas", label: "Notas Fiscais", desc: "Consultar notas fiscais", icon: Receipt, color: "text-primary" },
  { id: "emissao", label: "Emissão de NF", desc: "Emitir novas NFs", icon: FileText, color: "text-primary" },
  { id: "contratos", label: "Contratos", desc: "Gerenciar contratos", icon: ClipboardList, color: "text-primary" },
  { id: "documentos", label: "Documentos", desc: "Arquivos documentais", icon: FolderOpen, color: "text-primary" },
  { id: "fluxo", label: "Fluxo de Caixa", desc: "Análise de fluxo", icon: BarChart3, color: "text-primary" },
];

// Sub-view for Contas a Receber / Pagar
function ContasView({ tipo }: { tipo: "receber" | "pagar" }) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");
  const [search, setSearch] = useState("");

  const contas = contasFinanceiras.filter(c => c.tipo === tipo);
  const filtered = contas.filter(c => {
    if (statusFilter !== "todos" && c.status !== statusFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return c.cliente.toLowerCase().includes(s) || c.descricao.toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar lançamentos..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Button className="gap-2 w-full sm:w-auto">
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
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => toast.success(`${conta.id} marcado como recebido`)}>
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
    </div>
  );
}

// Placeholder sub-view
function PlaceholderView({ title }: { title: string }) {
  return (
    <Card>
      <CardContent className="p-8 text-center text-muted-foreground">
        <p className="text-sm">Módulo <strong>{title}</strong> em desenvolvimento.</p>
      </CardContent>
    </Card>
  );
}

const Financeiro = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const summaryCards = [
    { label: "Total a Receber", valor: financeiroResumo.aReceber, icon: TrendingUp, color: "text-success", sub: `${contasFinanceiras.filter(c => c.tipo === "receber").length} contas` },
    { label: "Total a Pagar", valor: financeiroResumo.aPagar, icon: TrendingDown, color: "text-destructive", sub: `${contasFinanceiras.filter(c => c.tipo === "pagar").length} contas` },
    { label: "Recebido", valor: financeiroResumo.aReceber - financeiroResumo.inadimplencia, icon: Wallet, color: "text-primary", sub: `${contasFinanceiras.filter(c => c.status === "pago").length} pagas` },
    { label: "Saldo", valor: financeiroResumo.saldoProjetado, icon: DollarSign, color: "text-primary", sub: financeiroResumo.saldoProjetado >= 0 ? "Positivo" : "Negativo" },
  ];

  const renderModule = () => {
    switch (activeModule) {
      case "receber": return <ContasView tipo="receber" />;
      case "pagar": return <ContasView tipo="pagar" />;
      case "notas":
      case "emissao": return <PlaceholderView title="Notas Fiscais" />;
      case "pagamentos": return <PlaceholderView title="Pagamentos" />;
      case "contratos": return <PlaceholderView title="Contratos" />;
      case "documentos": return <PlaceholderView title="Documentos" />;
      case "fluxo": return <PlaceholderView title="Fluxo de Caixa" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Financeiro</h1>
        <p className="text-muted-foreground text-sm">Visão geral das finanças da empresa</p>
      </div>

      {/* Module grid */}
      <div>
        <h2 className="text-sm font-bold mb-3">Acessar Módulos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {modulos.map(mod => (
            <Card
              key={mod.id}
              className={cn(
                "cursor-pointer hover:shadow-md hover:border-primary/30 transition-all",
                activeModule === mod.id && "border-primary shadow-md"
              )}
              onClick={() => setActiveModule(activeModule === mod.id ? null : mod.id)}
            >
              <CardContent className="p-4">
                <mod.icon className={cn("h-5 w-5 mb-2", mod.color)} />
                <h3 className="text-sm font-bold">{mod.label}</h3>
                <p className="text-[11px] text-muted-foreground">{mod.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {summaryCards.map(card => (
          <Card key={card.label} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{card.label}</span>
                <card.icon className={cn("h-4 w-4", card.color)} />
              </div>
              <p className="text-lg sm:text-2xl font-bold">{formatCurrency(card.valor)}</p>
              <p className="text-[11px] text-muted-foreground">{card.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active module content */}
      {activeModule && renderModule()}

      {/* Últimas Contas */}
      {!activeModule && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">Últimas Contas</CardTitle>
          </CardHeader>
          <CardContent>
            {contasFinanceiras.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contasFinanceiras.slice(0, 5).map(c => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.cliente}</TableCell>
                        <TableCell className="text-muted-foreground">{c.descricao}</TableCell>
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
    </div>
  );
};

export default Financeiro;
