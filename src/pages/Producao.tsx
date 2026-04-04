import { useState, useEffect, useCallback } from "react";
import { PullToRefresh } from "@/components/PullToRefresh";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/formatters";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import {
  Plus, Search, MapPin, Phone, User, Calendar,
  RefreshCcw, CreditCard, FileText, Printer, GitBranch,
  Eye, Pencil, ListChecks, Share2, CheckCircle2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import ReagendarDialog from "@/components/producao/ReagendarDialog";
import PagamentosDialog from "@/components/producao/PagamentosDialog";
import ContratoDialog from "@/components/producao/ContratoDialog";
import ImpressoesDialog from "@/components/producao/ImpressoesDialog";
import AlterarEtapaDialog from "@/components/producao/AlterarEtapaDialog";
import OrdemServicoDetail from "@/components/producao/OrdemServicoDetail";
import EditarServicoDialog from "@/components/producao/EditarServicoDialog";
import { ExportButtons } from "@/components/ExportButtons";

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

const filters: { key: FilterKey; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "atrasado", label: "Atrasados" },
  { key: "em_andamento", label: "Em andamento" },
  { key: "concluido", label: "Concluídos" },
];

const actionButtons = [
  { key: "reagendar" as const, icon: RefreshCcw, label: "Alterar prazo" },
  { key: "pagamentos" as const, icon: CreditCard, label: "Pagamentos" },
  { key: "custos" as const, icon: Eye, label: "Ver custos" },
  { key: "contrato" as const, icon: FileText, label: "Contrato" },
  { key: "impressoes" as const, icon: Printer, label: "Impressões" },
  { key: "editar" as const, icon: Pencil, label: "Editar serviço" },
  { key: "tarefas" as const, icon: ListChecks, label: "Tarefas" },
  { key: "compartilhar" as const, icon: Share2, label: "Compartilhar" },
];

const Producao = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("todos");
  const [search, setSearch] = useState("");
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [detailPedido, setDetailPedido] = useState<Pedido | null>(null);

  const fetchPedidos = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    const { data, error } = await supabase.from("pedidos").select("*").order("pedido_num", { ascending: true });
    if (error) {
      setPedidos([]);
      setLoadError(error.message);
      setLoading(false);
      toast({ title: "Erro ao carregar pedidos", description: error.message, variant: "destructive" });
      return;
    }

    setPedidos((data ?? []) as Pedido[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPedidos(); }, [fetchPedidos]);

  const filtered = pedidos.filter((op) => {
    if (filter !== "todos" && op.status !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return op.cliente.toLowerCase().includes(s) || op.pedido_num.toString().includes(s);
    }
    return true;
  });

  const getCounts = (key: FilterKey) =>
    key === "todos" ? pedidos.length : pedidos.filter((o) => o.status === key).length;

  const getDiasLabel = (op: Pedido) => {
    if (op.dias_restantes < 0) return { label: `Atrasado ${Math.abs(op.dias_restantes)} dias`, color: "bg-destructive text-destructive-foreground" };
    return { label: `Faltam ${op.dias_restantes} dias`, color: "bg-primary/10 text-primary" };
  };

  const handleConcluir = async (op: Pedido) => {
    await supabase.from("pedidos").update({ status: "concluido", etapa: "Finalizado" } as any).eq("id", op.id);
    toast({ title: "Pedido concluído", description: `Pedido ${op.pedido_num} foi finalizado.` });
    fetchPedidos();
  };

  const [cancelConfirm, setCancelConfirm] = useState<Pedido | null>(null);

  const handleCancelar = async () => {
    if (!cancelConfirm) return;
    await supabase.from("pedidos").delete().eq("id", cancelConfirm.id);
    toast({ title: "Pedido cancelado", description: `Pedido ${cancelConfirm.pedido_num} foi removido.`, variant: "destructive" });
    setCancelConfirm(null);
    fetchPedidos();
  };

  const openDialog = (type: DialogType, op: Pedido) => {
    setSelectedPedido(op);
    setActiveDialog(type);
  };

  const closeDialog = () => {
    setActiveDialog(null);
    setSelectedPedido(null);
    fetchPedidos();
  };

  const handleNovoPedido = async () => {
    const maxNum = pedidos.length > 0 ? Math.max(...pedidos.map(p => p.pedido_num)) : 0;
    const { error } = await supabase.from("pedidos").insert({
      pedido_num: maxNum + 1,
      cliente: "Novo Cliente",
      endereco: "",
      telefone: "",
      vendedor: "",
      valor: 0,
      status: "em_andamento",
      dias_restantes: 30,
      etapa: "Orçamento",
    } as any);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Pedido criado", description: `Pedido ${maxNum + 1} criado.` });
    fetchPedidos();
  };

  if (detailPedido) {
    return (
      <div className="space-y-6">
        <OrdemServicoDetail pedido={detailPedido} onBack={() => setDetailPedido(null)} />
      </div>
    );
  }

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
        {/* Desktop sidebar - hidden on mobile */}
        <div className="hidden md:block w-48 shrink-0 space-y-4">
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
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">AÇÕES</p>
            <button className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline" onClick={handleNovoPedido}>
              <Plus className="h-3.5 w-3.5" /> Novo pedido
            </button>
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar pedido ou cliente..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Carregando pedidos...</div>
          ) : loadError ? (
            <div className="rounded-lg border border-dashed bg-card p-8 text-center">
              <p className="font-medium">Não foi possível carregar os pedidos.</p>
              <p className="mt-1 text-sm text-muted-foreground">{loadError}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={fetchPedidos}>
                Tentar novamente
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
              {filtered.map((op) => {
                const dias = getDiasLabel(op);
                return (
                  <Card key={op.id} className="shadow-sm border-border/50">
                    <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                      {/* Title + icon */}
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-base sm:text-lg cursor-pointer hover:text-primary transition-colors" onClick={() => setDetailPedido(op)}>
                          PEDIDO {op.pedido_num}
                        </h3>
                        <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" />
                      </div>

                      {/* Client info */}
                      <div className="space-y-0.5 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                          <span className="truncate">{op.cliente}</span>
                        </div>
                        {op.endereco && (
                          <div className="flex items-start gap-1.5">
                            <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 mt-0.5 shrink-0" />
                            <span className="line-clamp-2">{op.endereco}</span>
                          </div>
                        )}
                        {op.telefone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                            <span>{op.telefone}</span>
                          </div>
                        )}
                      </div>

                      {/* Etapa + vendedor + previsão */}
                      <div className="space-y-0.5 text-xs sm:text-sm">
                        {op.etapa && <p className="font-bold uppercase text-xs sm:text-sm">{op.etapa}</p>}
                        {op.vendedor && <p className="text-muted-foreground"><span className="font-medium text-foreground">Vendedor:</span> {op.vendedor}</p>}
                        {op.previsao && (
                          <p className="text-muted-foreground">
                            <span className="font-medium text-foreground">Previsão:</span> {op.previsao}
                          </p>
                        )}
                      </div>

                      {/* Valor + dias badge */}
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <p className="text-lg sm:text-xl font-bold text-emerald-600">{formatCurrency(op.valor)}</p>
                        <span className={cn("rounded-full px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold whitespace-nowrap", dias.color)}>
                          {dias.label}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Progresso do serviço 0%</p>
                        <Progress value={0} className="h-1 sm:h-1.5" />
                      </div>

                      {/* Action icons grid */}
                      <div className="grid grid-cols-4 gap-1.5 sm:gap-3 pt-1">
                        {actionButtons.map(({ key, icon: Icon, label }) => (
                          <button
                            key={key}
                            className="flex flex-col items-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 text-muted-foreground hover:text-foreground transition-colors"
                            title={label}
                            onClick={() => {
                              if (key === "tarefas") {
                                setDetailPedido(op);
                              } else if (["reagendar", "pagamentos", "contrato", "impressoes"].includes(key)) {
                                openDialog(key as DialogType, op);
                              } else {
                                toast({ title: label, description: `Função "${label}" em desenvolvimento.` });
                              }
                            }}
                          >
                            <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-muted">
                              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                            <span className="text-[8px] sm:text-[10px] leading-tight text-center line-clamp-2">{label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Cancelar / Concluir */}
                      <div className="flex gap-2 sm:gap-3 pt-1">
                        <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm" onClick={() => setCancelConfirm(op)}>Cancelar</Button>
                        <Button size="sm" className="flex-1 text-xs sm:text-sm" onClick={() => handleConcluir(op)}>Concluir</Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {filtered.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">Nenhum pedido encontrado.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedPedido && (
        <>
          <ReagendarDialog open={activeDialog === "reagendar"} onOpenChange={(v) => !v && closeDialog()} pedido={selectedPedido} />
          <PagamentosDialog open={activeDialog === "pagamentos"} onOpenChange={(v) => !v && closeDialog()} pedido={selectedPedido} />
          <ContratoDialog open={activeDialog === "contrato"} onOpenChange={(v) => !v && closeDialog()} pedido={selectedPedido} />
          <ImpressoesDialog open={activeDialog === "impressoes"} onOpenChange={(v) => !v && closeDialog()} pedido={selectedPedido} />
          <AlterarEtapaDialog open={activeDialog === "etapa"} onOpenChange={(v) => !v && closeDialog()} pedido={selectedPedido} />
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
