import { useState, useEffect, useCallback } from "react";
import { PullToRefresh } from "@/components/PullToRefresh";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Plus, Search, LayoutGrid, List, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ExportButtons } from "@/components/ExportButtons";
import PedidoCardCompact from "@/components/producao/PedidoCardCompact";
import KanbanBoard from "@/components/producao/KanbanBoard";
import ReagendarDialog from "@/components/producao/ReagendarDialog";
import PagamentosDialog from "@/components/producao/PagamentosDialog";
import ContratoDialog from "@/components/producao/ContratoDialog";
import ImpressoesDialog from "@/components/producao/ImpressoesDialog";
import AlterarEtapaDialog from "@/components/producao/AlterarEtapaDialog";
import OrdemServicoDetail from "@/components/producao/OrdemServicoDetail";
import EditarServicoDialog from "@/components/producao/EditarServicoDialog";
import NovoPedidoDialog from "@/components/producao/NovoPedidoDialog";

export interface Pedido {
  id: string;
  pedido_num: number;
  cliente: string;
  endereco: string;
  telefone: string;
  vendedor: string;
  previsao: string | null;
  valor: number;
  status: string;
  dias_restantes: number;
  etapa: string;
  etapa_data: string;
  anotacao: string;
}

type FilterKey = "todos" | "atrasado" | "em_andamento" | "concluido";
type DialogType = "reagendar" | "pagamentos" | "contrato" | "impressoes" | "etapa" | "custos" | "editar" | "tarefas" | "compartilhar" | null;
type ViewMode = "grid" | "kanban";

const filters: { key: FilterKey; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "atrasado", label: "Atrasados" },
  { key: "em_andamento", label: "Em andamento" },
  { key: "concluido", label: "Concluídos" },
];

const periodOptions = [
  { value: "todos", label: "Todos os períodos" },
  { value: "7", label: "Últimos 7 dias" },
  { value: "30", label: "Últimos 30 dias" },
  { value: "90", label: "Últimos 90 dias" },
];

const valueOptions = [
  { value: "todos", label: "Qualquer valor" },
  { value: "0", label: "Sem valor (R$0)" },
  { value: "1-5000", label: "R$1 – R$5.000" },
  { value: "5000-20000", label: "R$5.000 – R$20.000" },
  { value: "20000+", label: "Acima de R$20.000" },
];

const Producao = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("todos");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [periodFilter, setPeriodFilter] = useState("todos");
  const [vendedorFilter, setVendedorFilter] = useState("todos");
  const [valorFilter, setValorFilter] = useState("todos");
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [detailPedido, setDetailPedido] = useState<Pedido | null>(null);
  const [cancelConfirm, setCancelConfirm] = useState<Pedido | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  const fetchPedidos = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const [pedidosRes, checklistRes] = await Promise.all([
      supabase.from("pedidos").select("*").order("pedido_num", { ascending: true }),
      supabase.from("pedido_checklists").select("pedido_id, checked"),
    ]);
    if (pedidosRes.error) {
      setPedidos([]);
      setLoadError(pedidosRes.error.message);
      setLoading(false);
      toast({ title: "Erro ao carregar pedidos", description: pedidosRes.error.message, variant: "destructive" });
      return;
    }
    setPedidos((pedidosRes.data ?? []) as Pedido[]);

    // Calculate progress per pedido
    const map: Record<string, { total: number; checked: number }> = {};
    for (const item of checklistRes.data ?? []) {
      if (!map[item.pedido_id]) map[item.pedido_id] = { total: 0, checked: 0 };
      map[item.pedido_id].total++;
      if (item.checked) map[item.pedido_id].checked++;
    }
    const pMap: Record<string, number> = {};
    for (const [id, val] of Object.entries(map)) {
      pMap[id] = val.total > 0 ? Math.round((val.checked / val.total) * 100) : 0;
    }
    setProgressMap(pMap);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPedidos(); }, [fetchPedidos]);

  // Derive unique vendors
  const vendedores = Array.from(new Set(pedidos.map(p => p.vendedor).filter(Boolean)));

  // Filtering logic
  const filtered = pedidos.filter((op) => {
    // Status filter
    if (filter !== "todos" && op.status !== filter) return false;
    // Search
    if (search) {
      const s = search.toLowerCase();
      if (!op.cliente.toLowerCase().includes(s) && !op.pedido_num.toString().includes(s)) return false;
    }
    // Period filter
    if (periodFilter !== "todos") {
      const days = parseInt(periodFilter);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      if (op.previsao && new Date(op.previsao) < cutoff) return false;
    }
    // Vendor filter
    if (vendedorFilter !== "todos" && op.vendedor !== vendedorFilter) return false;
    // Value filter
    if (valorFilter !== "todos") {
      if (valorFilter === "0" && op.valor !== 0) return false;
      if (valorFilter === "1-5000" && (op.valor <= 0 || op.valor > 5000)) return false;
      if (valorFilter === "5000-20000" && (op.valor <= 5000 || op.valor > 20000)) return false;
      if (valorFilter === "20000+" && op.valor <= 20000) return false;
    }
    return true;
  });

  const getCounts = (key: FilterKey) =>
    key === "todos" ? pedidos.length : pedidos.filter((o) => o.status === key).length;

  const handleConcluir = async (op: Pedido) => {
    await supabase.from("pedidos").update({ status: "concluido", etapa: "Finalizado" } as any).eq("id", op.id);
    toast({ title: "Pedido concluído", description: `Pedido ${op.pedido_num} foi finalizado.` });
    fetchPedidos();
  };

  const handleCancelar = async () => {
    if (!cancelConfirm) return;
    await supabase.from("pedidos").delete().eq("id", cancelConfirm.id);
    toast({ title: "Pedido cancelado", description: `Pedido ${cancelConfirm.pedido_num} foi removido.`, variant: "destructive" });
    setCancelConfirm(null);
    fetchPedidos();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await supabase.from("pedidos").update({ status: newStatus } as any).eq("id", id);
    toast({ title: "Status atualizado" });
    fetchPedidos();
  };

  const openDialog = (type: string, op: Pedido) => {
    setSelectedPedido(op);
    setActiveDialog(type as DialogType);
  };

  const closeDialog = () => {
    setActiveDialog(null);
    setSelectedPedido(null);
    fetchPedidos();
  };

  const [novoPedidoOpen, setNovoPedidoOpen] = useState(false);
  const nextPedidoNum = pedidos.length > 0 ? Math.max(...pedidos.map(p => p.pedido_num)) + 1 : 1;

  if (detailPedido) {
    return (
      <div className="space-y-6">
        <OrdemServicoDetail pedido={detailPedido} onBack={() => setDetailPedido(null)} />
      </div>
    );
  }

  const activeFiltersCount = [periodFilter !== "todos", vendedorFilter !== "todos", valorFilter !== "todos"].filter(Boolean).length;

  return (
    <PullToRefresh onRefresh={fetchPedidos}>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Serviços</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">Pedidos e ordens de serviço</p>
          </div>
          <div className="flex items-center gap-2">
            <ExportButtons getConfig={() => ({
              title: "Relatório de Produção",
              headers: ["Pedido", "Cliente", "Valor", "Status", "Etapa", "Previsão"],
              columnWidths: [20, 45, 28, 25, 25, 28],
              summaryCards: [
                { label: "Total Pedidos", value: String(filtered.length) },
                { label: "Valor Total", value: formatCurrency(filtered.reduce((s, o) => s + o.valor, 0)) },
              ],
              rows: filtered.map((o) => [
                String(o.pedido_num), o.cliente, formatCurrency(o.valor), o.status, o.etapa || "-", o.previsao || "-",
              ]),
              filename: "producao",
            })} />
            <Button size="sm" className="gap-1.5 sm:gap-2" onClick={handleNovoPedido}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Novo Pedido</span>
              <span className="sm:hidden">Novo</span>
            </Button>
          </div>
        </div>

        {/* Mobile: horizontal filter tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 md:hidden scrollbar-none">
          {filters.map((item) => (
            <button key={item.key} onClick={() => setFilter(item.key)}
              className={cn("flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors shrink-0",
                filter === item.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
              {item.label}
              <span className={cn("flex h-4 min-w-4 items-center justify-center rounded-full text-[9px] font-bold",
                filter === item.key ? "bg-primary-foreground/20 text-primary-foreground" : "bg-background text-muted-foreground")}>
                {getCounts(item.key)}
              </span>
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <div className="hidden md:block w-52 shrink-0 space-y-5">
            {/* Status filter */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">VISUALIZAR</p>
              <div className="space-y-0.5">
                {filters.map((item) => (
                  <button key={item.key} onClick={() => setFilter(item.key)}
                    className={cn("flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      filter === item.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>
                    {item.label}
                    <span className={cn("flex h-5 min-w-5 items-center justify-center rounded-full text-[10px] font-bold",
                      filter === item.key ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground")}>
                      {getCounts(item.key)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Extra filters */}
            <div className="space-y-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                FILTROS {activeFiltersCount > 0 && <span className="text-primary">({activeFiltersCount})</span>}
              </p>
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {periodOptions.map(o => <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
              {vendedores.length > 0 && (
                <Select value={vendedorFilter} onValueChange={setVendedorFilter}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Vendedor" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos" className="text-xs">Todos vendedores</SelectItem>
                    {vendedores.map(v => <SelectItem key={v} value={v} className="text-xs">{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
              <Select value={valorFilter} onValueChange={setValorFilter}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {valueOptions.map(o => <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" className="w-full text-xs h-7"
                  onClick={() => { setPeriodFilter("todos"); setVendedorFilter("todos"); setValorFilter("todos"); }}>
                  Limpar filtros
                </Button>
              )}
            </div>

            {/* Actions */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">AÇÕES</p>
              <button className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline" onClick={handleNovoPedido}>
                <Plus className="h-3.5 w-3.5" /> Novo pedido
              </button>
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-4">
            {/* Search + view toggle */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar pedido ou cliente..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="hidden sm:flex border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="h-9 w-9 rounded-none"
                  onClick={() => setViewMode("grid")}
                  title="Grade"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "kanban" ? "default" : "ghost"}
                  size="icon"
                  className="h-9 w-9 rounded-none"
                  onClick={() => setViewMode("kanban")}
                  title="Kanban"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Mobile extra filters */}
            <div className="flex gap-2 overflow-x-auto md:hidden scrollbar-none">
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="h-7 text-[10px] w-auto min-w-[120px] shrink-0"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {periodOptions.map(o => <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={valorFilter} onValueChange={setValorFilter}>
                <SelectTrigger className="h-7 text-[10px] w-auto min-w-[120px] shrink-0"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {valueOptions.map(o => <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="text-center py-12 text-muted-foreground flex flex-col items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                Carregando pedidos...
              </div>
            ) : loadError ? (
              <div className="rounded-lg border border-dashed bg-card p-8 text-center">
                <p className="font-medium">Não foi possível carregar os pedidos.</p>
                <p className="mt-1 text-sm text-muted-foreground">{loadError}</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={fetchPedidos}>
                  Tentar novamente
                </Button>
              </div>
            ) : viewMode === "kanban" ? (
              <KanbanBoard
                pedidos={filtered}
                progressMap={progressMap}
                onStatusChange={handleStatusChange}
                onOpenDetail={setDetailPedido}
                onOpenDialog={openDialog}
                onConcluir={handleConcluir}
                onCancelar={setCancelConfirm}
              />
            ) : (
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((op) => (
                  <PedidoCardCompact
                    key={op.id}
                    pedido={op}
                    progress={progressMap[op.id]}
                    onOpenDetail={setDetailPedido}
                    onOpenDialog={openDialog}
                    onConcluir={handleConcluir}
                    onCancelar={setCancelConfirm}
                  />
                ))}
                {filtered.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground">Nenhum pedido encontrado.</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dialogs */}
        {selectedPedido && (
          <>
            <ReagendarDialog open={activeDialog === "reagendar"} onOpenChange={(v) => !v && closeDialog()} pedido={selectedPedido} />
            <PagamentosDialog open={activeDialog === "pagamentos"} onOpenChange={(v) => !v && closeDialog()} pedido={selectedPedido} />
            <ContratoDialog open={activeDialog === "contrato"} onOpenChange={(v) => !v && closeDialog()} pedido={selectedPedido} />
            <ImpressoesDialog open={activeDialog === "impressoes"} onOpenChange={(v) => !v && closeDialog()} pedido={selectedPedido} />
            <AlterarEtapaDialog open={activeDialog === "etapa"} onOpenChange={(v) => !v && closeDialog()} pedido={selectedPedido} />
            <EditarServicoDialog open={activeDialog === "editar"} onOpenChange={(v) => !v && closeDialog()} pedido={selectedPedido} />
          </>
        )}

        <AlertDialog open={!!cancelConfirm} onOpenChange={(v) => !v && setCancelConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancelar pedido {cancelConfirm?.pedido_num}?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação é irreversível. O pedido e todos os pagamentos associados serão removidos permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Voltar</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancelar} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Confirmar cancelamento
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PullToRefresh>
  );
};

export default Producao;
