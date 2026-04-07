import { useState, useEffect } from "react";
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
import { Plus, Eye, Trash2, Search, Loader2, Calendar, User, Package, Hash, DollarSign, FileText, CheckCircle, XCircle, Clock, Pencil, FileDown } from "lucide-react";
import { ExportButtons } from "@/components/ExportButtons";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { generateProfessionalBudgetPDF } from "@/utils/budgetPdfGenerator";

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

const OrcamentoDetailDialog = ({ orc, open, onClose }: { orc: any; open: boolean; onClose: () => void; }) => {
  const navigate = useNavigate();
  const updateStatus = useUpdateOrcamentoStatus();
  const itens = orc?.itens as Record<string, unknown> | null;
  const [empresaData, setEmpresaData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    const loadEmpresa = async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase.from("configuracoes").select("chave, valor");
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((r) => { map[r.chave] = r.valor; });
        setEmpresaData(map);
      }
    };
    loadEmpresa();
  }, [open]);

  const handleStatusChange = (status: string) => {
    updateStatus.mutate({ id: orc.id, status }, {
      onSuccess: () => toast({ title: `Status alterado para ${status}` }),
    });
  };

  const handleDownloadPdf = async () => {
    const itensData = orc.itens as Record<string, any> | null;
    try {
      await generateProfessionalBudgetPDF({
        numero: orc.numero,
        cliente: orc.cliente,
        produto: orc.produto,
        larguraCm: itensData?.largura_cm ?? 200,
        alturaCm: itensData?.altura_cm ?? 120,
        quantidade: itensData?.quantidade ?? 1,
        areaM2: itensData?.area_m2 ?? 0,
        custoTotal: itensData?.custo ?? 0,
        margem: itensData?.margem_percent ?? 0,
        valorFinal: orc.valor,
        corAluminio: itensData?.cor_aluminio,
        corFerragem: itensData?.cor_ferragem,
        tipoVidro: itensData?.vidro_tipo,
        ambiente: itensData?.ambiente,
        observacoes: itensData?.observacoes,
        empresa: {
          nome: empresaData.nome || "AluFlow",
          cnpj: empresaData.cnpj || "",
          telefone: empresaData.telefone || "",
          email: empresaData.email || "",
          endereco: empresaData.endereco || "",
          logoUrl: empresaData.logo_url || "",
        },
      });
      toast({ title: "PDF gerado com sucesso!" });
    } catch (err: any) {
      toast({ title: "Erro ao gerar PDF", description: err.message, variant: "destructive" });
    }
  };

  if (!orc) return null;

  // Organize itens into meaningful groups
  const dimensionKeys = ["largura_cm", "altura_cm", "quantidade", "area_m2"];
  const financialKeys = ["custo", "lucro", "subtotal", "acrescimo", "margem_percent"];
  const styleKeys = ["cor_aluminio", "cor_ferragem", "vidro_tipo"];
  const otherKeys = itens ? Object.keys(itens).filter(k => 
    !dimensionKeys.includes(k) && !financialKeys.includes(k) && !styleKeys.includes(k) && k !== "tipo" && k !== "ambiente" && k !== "observacoes"
  ) : [];

  const labelMap: Record<string, string> = {
    tipo: "Tipologia",
    custo: "Custo Material",
    lucro: "Margem de Lucro",
    subtotal: "Subtotal",
    acrescimo: "Acréscimo",
    margem_percent: "Margem %",
    area_m2: "Área Total",
    largura_cm: "Largura",
    altura_cm: "Altura",
    quantidade: "Quantidade",
    cor_aluminio: "Cor Alumínio",
    cor_ferragem: "Cor Ferragem",
    vidro_tipo: "Tipo de Vidro",
    ambiente: "Ambiente",
    observacoes: "Observações",
  };

  const formatItemValue = (key: string, value: unknown) => {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "number") {
      if (key.includes("valor") || key.includes("preco") || key === "custo" || key === "lucro" || key === "subtotal" || key === "acrescimo") 
        return formatCurrency(value);
      if (key === "area_m2") return `${value} m²`;
      if (key === "largura_cm" || key === "altura_cm") return `${value} cm`;
      if (key === "margem_percent") return `${value}%`;
      return String(value);
    }
    return String(value);
  };

  const ItemRow = ({ label, value, icon, accent }: { label: string; value: string; icon?: React.ReactNode; accent?: boolean }) => (
    <div className="flex justify-between items-center py-3 px-4 group hover:bg-primary/[0.03] transition-colors">
      <div className="flex items-center gap-2.5">
        {icon && <span className="text-muted-foreground/60">{icon}</span>}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className={cn("text-sm font-semibold tabular-nums", accent && "text-primary")}>{value}</span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-2xl p-0 overflow-hidden max-h-[90vh] flex flex-col border-0 shadow-2xl shadow-primary/5">
        {/* Premium header with layered gradient */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/5 to-accent/20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.1),transparent_60%)]" />
          <div className="relative px-6 pt-7 pb-5">
            <DialogHeader>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20 backdrop-blur-sm">
                    <Hash className="h-5 w-5 text-primary" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-primary/20 ring-2 ring-background flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <DialogTitle className="text-xl font-bold tracking-tight">{orc.numero}</DialogTitle>
                  <DialogDescription className="text-xs flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    Criado em {formatDate(orc.created_at)}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="mt-4 flex items-center gap-3">
              <StatusBadge status={orc.status} />
              {itens?.tipo && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-accent/60 text-accent-foreground border border-accent-foreground/10">
                  <Package className="h-3 w-3" />
                  {String(itens.tipo).replace(/_/g, " ")}
                </span>
              )}
            </div>
          </div>
          {/* Decorative separator */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>

        <div className="px-6 pb-6 space-y-5 overflow-y-auto flex-1">
          {/* Client & Product cards */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="group rounded-2xl border border-border/50 bg-gradient-to-b from-muted/40 to-muted/10 p-4 space-y-2 transition-all hover:border-primary/20 hover:shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/8">
                  <User className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Cliente</span>
              </div>
              <p className="font-bold text-sm leading-tight">{orc.cliente}</p>
            </div>
            <div className="group rounded-2xl border border-border/50 bg-gradient-to-b from-muted/40 to-muted/10 p-4 space-y-2 transition-all hover:border-primary/20 hover:shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/8">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Data</span>
              </div>
              <p className="font-bold text-sm">{formatDate(orc.data)}</p>
            </div>
            <div className="group rounded-2xl border border-border/50 bg-gradient-to-b from-muted/40 to-muted/10 p-4 space-y-2 col-span-2 transition-all hover:border-primary/20 hover:shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/8">
                  <Package className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Produto</span>
              </div>
              <p className="font-bold text-sm">{orc.produto}</p>
            </div>
          </div>

          {/* Dimensions section */}
          {itens && dimensionKeys.some(k => itens[k] !== undefined) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <div className="h-1 w-1 rounded-full bg-primary" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Dimensões</p>
              </div>
              <div className="rounded-2xl border border-border/50 overflow-hidden bg-card divide-y divide-border/40">
                {dimensionKeys.filter(k => itens[k] !== undefined).map(k => (
                  <ItemRow key={k} label={labelMap[k] || k} value={formatItemValue(k, itens[k])} />
                ))}
              </div>
            </div>
          )}

          {/* Financial section */}
          {itens && financialKeys.some(k => itens[k] !== undefined) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <div className="h-1 w-1 rounded-full bg-primary" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Financeiro</p>
              </div>
              <div className="rounded-2xl border border-border/50 overflow-hidden bg-card divide-y divide-border/40">
                {financialKeys.filter(k => itens[k] !== undefined).map(k => (
                  <ItemRow key={k} label={labelMap[k] || k} value={formatItemValue(k, itens[k])} icon={<DollarSign className="h-3.5 w-3.5" />} accent={k === "subtotal"} />
                ))}
              </div>
            </div>
          )}

          {/* Style & materials section */}
          {itens && styleKeys.some(k => itens[k] !== undefined && itens[k] !== "" && itens[k] !== "Nenhum") && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <div className="h-1 w-1 rounded-full bg-primary" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Acabamento</p>
              </div>
              <div className="rounded-2xl border border-border/50 overflow-hidden bg-card divide-y divide-border/40">
                {styleKeys.filter(k => itens[k] !== undefined && itens[k] !== "").map(k => (
                  <ItemRow key={k} label={labelMap[k] || k} value={formatItemValue(k, itens[k])} />
                ))}
              </div>
            </div>
          )}

          {/* Other fields */}
          {itens?.ambiente && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <div className="h-1 w-1 rounded-full bg-primary" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ambiente</p>
              </div>
              <div className="rounded-2xl border border-border/50 bg-card px-4 py-3">
                <p className="text-sm font-medium">{String(itens.ambiente)}</p>
              </div>
            </div>
          )}

          {itens?.observacoes && String(itens.observacoes).trim() && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <div className="h-1 w-1 rounded-full bg-primary" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Observações</p>
              </div>
              <div className="rounded-2xl border border-border/50 bg-card px-4 py-3">
                <p className="text-sm text-muted-foreground italic">{String(itens.observacoes)}</p>
              </div>
            </div>
          )}

          {otherKeys.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <div className="h-1 w-1 rounded-full bg-primary" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Outros</p>
              </div>
              <div className="rounded-2xl border border-border/50 overflow-hidden bg-card divide-y divide-border/40">
                {otherKeys.map(k => (
                  <ItemRow key={k} label={labelMap[k] || k.replace(/_/g, " ")} value={formatItemValue(k, itens![k])} />
                ))}
              </div>
            </div>
          )}

          {/* Premium total card */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 p-5">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/4 to-accent/10" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/20">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Valor Total</span>
                  <p className="text-2xl font-black tracking-tight text-primary">{formatCurrency(orc.valor)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Premium action buttons */}
          <div className="flex gap-2 flex-wrap pt-1">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 gap-2 rounded-xl h-10 border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all"
              onClick={handleDownloadPdf}
            >
              <FileDown className="h-4 w-4" />
              PDF
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 gap-2 rounded-xl h-10 border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all"
              onClick={() => { onClose(); navigate(`/orcamentos/editar/${orc.id}`); }}
            >
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
            {orc.status === "pendente" && (
              <>
                <Button
                  size="sm"
                  className="flex-1 gap-2 rounded-xl h-10 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 transition-all"
                  onClick={() => handleStatusChange("aprovado")}
                  disabled={updateStatus.isPending}
                >
                  <CheckCircle className="h-4 w-4" />
                  Aprovar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1 gap-2 rounded-xl h-10 shadow-md shadow-destructive/20 transition-all"
                  onClick={() => handleStatusChange("recusado")}
                  disabled={updateStatus.isPending}
                >
                  <XCircle className="h-4 w-4" />
                  Recusar
                </Button>
              </>
            )}
          </div>
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
                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => navigate(`/orcamentos/editar/${orc.id}`)} title="Editar">
                      <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
