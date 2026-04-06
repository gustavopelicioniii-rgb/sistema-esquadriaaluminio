import { useState } from "react";
import { useOrcamentos, useDeleteOrcamento, useUpdateOrcamentoStatus } from "@/hooks/use-orcamentos";
import { PullToRefresh } from "@/components/PullToRefresh";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Eye, Trash2, Search, Loader2, Calendar, User, Package, Hash, DollarSign, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { ExportButtons } from "@/components/ExportButtons";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat("pt-BR").format(new Date(dateStr));

type FilterStatus = "todos" | "pendente" | "aprovado" | "recusado";

const filterItems: { key: FilterStatus; label: string; icon: React.ReactNode }[] = [
  { key: "todos", label: "Todos", icon: <FileText className="h-3.5 w-3.5" /> },
  { key: "pendente", label: "Pendente", icon: <Clock className="h-3.5 w-3.5" /> },
  { key: "aprovado", label: "Aprovado", icon: <CheckCircle className="h-3.5 w-3.5" /> },
  { key: "recusado", label: "Recusado", icon: <XCircle className="h-3.5 w-3.5" /> },
];

const OrcamentoDetailDialog = ({ orc, open, onClose }: { orc: any; open: boolean; onClose: () => void }) => {
  const updateStatus = useUpdateOrcamentoStatus();
  const itens = orc?.itens as Record<string, unknown> | null;

  const handleStatusChange = (status: string) => {
    updateStatus.mutate({ id: orc.id, status }, {
      onSuccess: () => toast({ title: `Status alterado para ${status}` }),
    });
  };

  if (!orc) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-2xl p-0 overflow-hidden">
        {/* Header gradient */}
        <div className="bg-gradient-to-r from-primary/10 via-accent/30 to-primary/5 px-6 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Hash className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">{orc.numero}</DialogTitle>
                <DialogDescription className="text-xs">Criado em {formatDate(orc.created_at)}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="mt-3">
            <StatusBadge status={orc.status} />
          </div>
        </div>

        <div className="px-6 pb-6 space-y-5">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border bg-muted/30 p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Cliente</span>
              </div>
              <p className="font-semibold text-sm">{orc.cliente}</p>
            </div>
            <div className="rounded-xl border bg-muted/30 p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Data</span>
              </div>
              <p className="font-semibold text-sm">{formatDate(orc.data)}</p>
            </div>
            <div className="rounded-xl border bg-muted/30 p-3.5 space-y-1 col-span-2">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Package className="h-3.5 w-3.5" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Produto</span>
              </div>
              <p className="font-semibold text-sm">{orc.produto}</p>
            </div>
          </div>

          {/* Itens details if available */}
          {itens && Object.keys(itens).length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Detalhes do Item</p>
              <div className="rounded-xl border bg-muted/20 divide-y">
                {Object.entries(itens).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center px-4 py-2.5 text-sm">
                    <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
                    <span className="font-medium">{typeof value === "number" ? (key.toLowerCase().includes("valor") || key.toLowerCase().includes("preco") ? formatCurrency(value) : value) : String(value ?? "-")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total */}
          <div className="rounded-xl bg-gradient-to-r from-primary/5 to-accent/20 border border-primary/10 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm">Valor Total</span>
            </div>
            <span className="text-xl font-bold text-primary">{formatCurrency(orc.valor)}</span>
          </div>

          {/* Action buttons */}
          {orc.status === "pendente" && (
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 gap-1.5"
                onClick={() => handleStatusChange("aprovado")}
                disabled={updateStatus.isPending}
              >
                <CheckCircle className="h-4 w-4" />
                Aprovar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="flex-1 gap-1.5"
                onClick={() => handleStatusChange("recusado")}
                disabled={updateStatus.isPending}
              >
                <XCircle className="h-4 w-4" />
                Recusar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Orcamentos = () => {
  const { data: orcamentos = [], isLoading, refetch } = useOrcamentos();
  const deleteOrcamento = useDeleteOrcamento();
  const [selectedOrcamento, setSelectedOrcamento] = useState<any>(null);
  const [filter, setFilter] = useState<FilterStatus>("todos");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = orcamentos.filter((orc) => {
    if (filter !== "todos" && orc.status !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return orc.cliente.toLowerCase().includes(s) || orc.produto.toLowerCase().includes(s) || orc.numero.toLowerCase().includes(s);
    }
    return true;
  });

  const getCounts = (status: FilterStatus) =>
    status === "todos" ? orcamentos.length : orcamentos.filter((o) => o.status === status).length;

  const totalValue = filtered.reduce((s, o) => s + o.valor, 0);

  const handleDelete = (orc: any) => {
    deleteOrcamento.mutate(orc.id, {
      onSuccess: () => toast({ title: "Orçamento excluído" }),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={async () => { await refetch(); }}>
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight">Orçamentos</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">Gerencie os orçamentos emitidos.</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButtons getConfig={() => ({
            title: "Orçamentos Emitidos",
            headers: ["Número", "Cliente", "Produto", "Valor", "Data", "Status"],
            columnWidths: [25, 40, 40, 30, 25, 25],
            summaryCards: [
              { label: "Total", value: String(filtered.length) },
              { label: "Valor Total", value: formatCurrency(totalValue) },
            ],
            rows: filtered.map((o) => [o.numero, o.cliente, o.produto, formatCurrency(o.valor), o.data, o.status]),
            filename: "orcamentos",
          })} />
          <Button onClick={() => navigate("/orcamentos/novo")} className="gap-2 text-xs sm:text-sm">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Novo Orçamento</span>
            <span className="sm:hidden">Novo</span>
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {filterItems.map((item) => {
          const count = getCounts(item.key);
          const isActive = filter === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={cn(
                "rounded-xl border p-3 text-left transition-all",
                isActive
                  ? "bg-primary/5 border-primary/30 ring-1 ring-primary/20"
                  : "bg-card hover:bg-muted/50 border-border"
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn("text-xs font-medium", isActive ? "text-primary" : "text-muted-foreground")}>
                  {item.label}
                </span>
                <span className={cn("transition-colors", isActive ? "text-primary" : "text-muted-foreground/60")}>
                  {item.icon}
                </span>
              </div>
              <p className={cn("text-xl font-bold mt-1", isActive ? "text-primary" : "text-foreground")}>{count}</p>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar por cliente, produto ou número..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold">Número</TableHead>
              <TableHead className="font-semibold">Cliente</TableHead>
              <TableHead className="hidden sm:table-cell font-semibold">Produto</TableHead>
              <TableHead className="hidden md:table-cell font-semibold">Data</TableHead>
              <TableHead className="font-semibold text-right">Valor</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((orc) => (
              <TableRow key={orc.id} className="cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => setSelectedOrcamento(orc)}>
                <TableCell className="font-semibold text-primary text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                      <Hash className="h-3.5 w-3.5 text-primary" />
                    </div>
                    {orc.numero}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-xs sm:text-sm">{orc.cliente}</TableCell>
                <TableCell className="text-muted-foreground hidden sm:table-cell text-xs sm:text-sm">{orc.produto}</TableCell>
                <TableCell className="text-muted-foreground hidden md:table-cell text-xs sm:text-sm">{formatDate(orc.data)}</TableCell>
                <TableCell className="font-semibold text-xs sm:text-sm text-right">{formatCurrency(orc.valor)}</TableCell>
                <TableCell><StatusBadge status={orc.status} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-0.5" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => setSelectedOrcamento(orc)} title="Visualizar">
                      <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(orc)} title="Excluir">
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Nenhum orçamento encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Table footer */}
        {filtered.length > 0 && (
          <div className="border-t bg-muted/20 px-4 py-3 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{filtered.length} orçamento(s)</span>
            <span className="font-bold text-primary">{formatCurrency(totalValue)}</span>
          </div>
        )}
      </div>

      <OrcamentoDetailDialog
        orc={selectedOrcamento}
        open={!!selectedOrcamento}
        onClose={() => setSelectedOrcamento(null)}
      />
    </div>
    </PullToRefresh>
  );
};

export default Orcamentos;
