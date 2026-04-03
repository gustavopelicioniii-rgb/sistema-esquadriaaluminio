import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import {
  Plus, Search, MapPin, Phone, User, Calendar,
  RefreshCcw, CreditCard, FileText, Printer, GitBranch,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ReagendarDialog from "@/components/producao/ReagendarDialog";
import PagamentosDialog from "@/components/producao/PagamentosDialog";
import ContratoDialog from "@/components/producao/ContratoDialog";
import ImpressoesDialog from "@/components/producao/ImpressoesDialog";
import AlterarEtapaDialog from "@/components/producao/AlterarEtapaDialog";

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
type DialogType = "reagendar" | "pagamentos" | "contrato" | "impressoes" | "etapa" | null;

const filters: { key: FilterKey; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "atrasado", label: "Atrasados" },
  { key: "em_andamento", label: "Em andamento" },
  { key: "concluido", label: "Concluídos" },
];

const actionButtons = [
  { key: "reagendar" as const, icon: RefreshCcw, label: "Reagendar" },
  { key: "pagamentos" as const, icon: CreditCard, label: "Pagamentos" },
  { key: "contrato" as const, icon: FileText, label: "Contrato" },
  { key: "impressoes" as const, icon: Printer, label: "Impressões" },
  { key: "etapa" as const, icon: GitBranch, label: "Alterar etapa" },
];

const Producao = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("todos");
  const [search, setSearch] = useState("");
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);

  const fetchPedidos = useCallback(async () => {
    const { data, error } = await supabase.from("pedidos").select("*").order("pedido_num", { ascending: true });
    if (error) {
      toast({ title: "Erro ao carregar pedidos", description: error.message, variant: "destructive" });
      return;
    }
    setPedidos(data as Pedido[]);
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

  const handleCancelar = async (op: Pedido) => {
    await supabase.from("pedidos").delete().eq("id", op.id);
    toast({ title: "Pedido cancelado", description: `Pedido ${op.pedido_num} foi removido.`, variant: "destructive" });
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Serviços</h1>
          <p className="text-muted-foreground text-sm">Pedidos e ordens de serviço</p>
        </div>
        <Button className="gap-2" onClick={handleNovoPedido}>
          <Plus className="h-4 w-4" />
          Novo Pedido
        </Button>
      </div>

      <div className="flex gap-6">
        <div className="w-48 shrink-0 space-y-4">
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

        <div className="flex-1 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar pedido ou cliente..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Carregando pedidos...</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((op) => {
                const dias = getDiasLabel(op);
                return (
                  <Card key={op.id} className="shadow-sm border-border/50">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-base">PEDIDO {op.pedido_num}</h3>
                        <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold", dias.color)}>{dias.label}</span>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5"><User className="h-3 w-3" />{op.cliente}</div>
                        {op.endereco && <div className="flex items-start gap-1.5"><MapPin className="h-3 w-3 mt-0.5 shrink-0" />{op.endereco}</div>}
                        {op.telefone && <div className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{op.telefone}</div>}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {op.vendedor && <span>Vendedor: {op.vendedor}<br /></span>}
                        {op.previsao && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Previsão: {op.previsao}</span>}
                      </div>
                      <p className="text-xl font-bold">{formatCurrency(op.valor)}</p>
                      {op.etapa && (
                        <div className="rounded bg-muted/50 px-3 py-2 text-xs">
                          <span className="font-semibold uppercase text-muted-foreground">{op.etapa}</span>
                          {op.etapa_data && <p className="text-muted-foreground">Data: {op.etapa_data}</p>}
                          {op.anotacao && <p className="text-muted-foreground">Anotação: {op.anotacao}</p>}
                        </div>
                      )}
                      <div className="flex items-center justify-center gap-3 pt-1">
                        {actionButtons.map(({ key, icon: Icon, label }) => (
                          <button key={key} className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors"
                            title={label} onClick={() => openDialog(key, op)}>
                            <Icon className="h-4 w-4" />
                            <span className="text-[9px]">{label}</span>
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => handleCancelar(op)}>Cancelar</Button>
                        <Button size="sm" className="flex-1 text-xs" onClick={() => handleConcluir(op)}>Concluir pedido</Button>
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
    </div>
  );
};

export default Producao;
