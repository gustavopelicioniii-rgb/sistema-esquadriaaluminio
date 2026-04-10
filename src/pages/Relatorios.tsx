import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileDown, TrendingUp, DollarSign, Package, Users, FileText, BarChart3, Loader2, FileSpreadsheet, CalendarIcon, Eye } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";
import { formatCurrency } from "@/lib/formatters";
import { generateReportPdf } from "@/utils/reportPdfGenerator";
import { generateExcel } from "@/utils/excelGenerator";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

type ReportData = {
  title: string;
  subtitle: string;
  headers: string[];
  columnWidths: number[];
  summaryCards: { label: string; value: string }[];
  rows: string[][];
};

const Relatorios = () => {
  usePageTitle("Relatórios");
  const [generating, setGenerating] = useState<string | null>(null);
  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined);
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined);
  const [previewData, setPreviewData] = useState<ReportData | null>(null);
  const [previewKey, setPreviewKey] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState<string | null>(null);

  const filterByDate = (dateStr: string) => {
    if (!dataInicio && !dataFim) return true;
    const d = new Date(dateStr);
    if (dataInicio && d < dataInicio) return false;
    if (dataFim) {
      const end = new Date(dataFim);
      end.setHours(23, 59, 59, 999);
      if (d > end) return false;
    }
    return true;
  };

  const periodoLabel = () => {
    if (dataInicio && dataFim) return `${format(dataInicio, "dd/MM/yyyy")} a ${format(dataFim, "dd/MM/yyyy")}`;
    if (dataInicio) return `A partir de ${format(dataInicio, "dd/MM/yyyy")}`;
    if (dataFim) return `Até ${format(dataFim, "dd/MM/yyyy")}`;
    return "Todo o período";
  };

  const fetchReportData = async (key: string): Promise<ReportData> => {
    switch (key) {
      case "vendas": {
        const { data: orcamentos = [] } = await supabase.from("orcamentos").select("*");
        const filtered = orcamentos!.filter((o) => filterByDate(o.data));
        const approved = filtered.filter((o) => o.status === "aprovado");
        const total = approved.reduce((s, o) => s + Number(o.valor), 0);
        return {
          title: "Vendas por Período", subtitle: periodoLabel(),
          headers: ["Número", "Cliente", "Produto", "Valor", "Data"],
          columnWidths: [25, 45, 45, 30, 35],
          summaryCards: [
            { label: "Total Vendas", value: String(approved.length) },
            { label: "Valor Total", value: formatCurrency(total) },
            { label: "Ticket Médio", value: formatCurrency(approved.length ? total / approved.length : 0) },
          ],
          rows: approved.map((o) => [o.numero, o.cliente, o.produto, formatCurrency(Number(o.valor)), o.data]),
        };
      }
      case "faturamento": {
        const { data: contas = [] } = await supabase.from("contas_financeiras").select("*");
        const filtered = contas!.filter((c: any) => filterByDate(c.vencimento));
        const receber = filtered.filter((c: any) => c.tipo === "receber");
        const pagar = filtered.filter((c: any) => c.tipo === "pagar");
        const totalRec = receber.reduce((s, c: any) => s + Number(c.valor), 0);
        const totalPag = pagar.reduce((s, c: any) => s + Number(c.valor), 0);
        return {
          title: "Faturamento Mensal", subtitle: periodoLabel(),
          headers: ["Tipo", "Cliente", "Descrição", "Valor", "Status"],
          columnWidths: [25, 40, 40, 30, 25],
          summaryCards: [
            { label: "A Receber", value: formatCurrency(totalRec) },
            { label: "A Pagar", value: formatCurrency(totalPag) },
            { label: "Saldo", value: formatCurrency(totalRec - totalPag) },
          ],
          rows: filtered.map((c: any) => [
            c.tipo === "receber" ? "Receita" : "Despesa", c.cliente, c.descricao, formatCurrency(Number(c.valor)), c.status,
          ]),
        };
      }
      case "estoque": {
        const { data: itens = [] } = await supabase.from("estoque").select("*");
        const baixo = itens!.filter((i) => i.quantidade <= i.minimo).length;
        return {
          title: "Estoque Atual", subtitle: "Posição atual do estoque de materiais",
          headers: ["Código", "Produto", "Categoria", "Qtd", "Un.", "Mín.", "Status"],
          columnWidths: [22, 42, 25, 18, 18, 18, 22],
          summaryCards: [
            { label: "Total Itens", value: String(itens!.length) },
            { label: "Estoque Baixo", value: String(baixo) },
            { label: "Normal", value: String(itens!.length - baixo) },
          ],
          rows: itens!.map((i) => [
            i.codigo, i.produto, i.categoria, String(i.quantidade), i.unidade, String(i.minimo),
            i.quantidade <= i.minimo ? "BAIXO" : "Normal",
          ]),
        };
      }
      case "clientes": {
        const { data: clientes = [] } = await supabase.from("clientes").select("*");
        return {
          title: "Clientes Ativos", subtitle: "Clientes cadastrados",
          headers: ["Nome", "Telefone", "Email", "Cidade"],
          columnWidths: [50, 35, 50, 40],
          summaryCards: [{ label: "Total Clientes", value: String(clientes!.length) }],
          rows: clientes!.map((c) => [c.nome, c.telefone || "", c.email || "", c.cidade || ""]),
        };
      }
      case "orcamentos": {
        const { data: orcamentos = [] } = await supabase.from("orcamentos").select("*");
        const filtered = orcamentos!.filter((o) => filterByDate(o.data));
        const total = filtered.reduce((s, o) => s + Number(o.valor), 0);
        return {
          title: "Orçamentos Emitidos", subtitle: periodoLabel(),
          headers: ["Número", "Cliente", "Produto", "Valor", "Data", "Status"],
          columnWidths: [25, 40, 40, 30, 25, 25],
          summaryCards: [
            { label: "Total", value: String(filtered.length) },
            { label: "Valor Total", value: formatCurrency(total) },
            { label: "Aprovados", value: String(filtered.filter((o) => o.status === "aprovado").length) },
          ],
          rows: filtered.map((o) => [o.numero, o.cliente, o.produto, formatCurrency(Number(o.valor)), o.data, o.status]),
        };
      }
      case "producao": {
        const { data: pedidos = [] } = await supabase.from("pedidos").select("*");
        const filtered = pedidos!.filter((o) => o.previsao ? filterByDate(o.previsao) : !dataInicio && !dataFim);
        const totalValor = filtered.reduce((s, o) => s + Number(o.valor), 0);
        return {
          title: "Desempenho Produção", subtitle: periodoLabel(),
          headers: ["Pedido", "Cliente", "Valor", "Status", "Previsão"],
          columnWidths: [20, 50, 30, 28, 35],
          summaryCards: [
            { label: "Pedidos", value: String(filtered.length) },
            { label: "Valor Total", value: formatCurrency(totalValor) },
            { label: "Em Andamento", value: String(filtered.filter((o) => o.status === "em_andamento").length) },
          ],
          rows: filtered.map((o) => [
            String(o.pedido_num), o.cliente, formatCurrency(Number(o.valor)), o.status, o.previsao || "-",
          ]),
        };
      }
      default:
        throw new Error("Relatório não encontrado");
    }
  };

  const handlePreview = async (key: string) => {
    setLoadingPreview(key);
    try {
      const data = await fetchReportData(key);
      setPreviewData(data);
      setPreviewKey(key);
      setPreviewOpen(true);
    } catch (e: any) {
      toast.error("Erro", { description: e.message });
    } finally {
      setLoadingPreview(null);
    }
  };

  const exportFromPreview = async (fmt: "pdf" | "excel") => {
    if (!previewData) return;
    setGenerating(`${previewKey}-${fmt}`);
    try {
      if (fmt === "pdf") {
        generateReportPdf({ ...previewData, filename: `${previewKey}.pdf` });
      } else {
        generateExcel({ ...previewData, filename: `${previewKey}.xlsx` });
      }
      toast({ title: `${fmt === "pdf" ? "PDF" : "Excel"} gerado`, description: `${previewData.rows.length} registros exportados` });
    } catch (e: any) {
      toast.error("Erro", { description: e.message });
    } finally {
      setGenerating(null);
    }
  };

  const exportReport = async (key: string, fmt: "pdf" | "excel") => {
    setGenerating(`${key}-${fmt}`);
    try {
      const data = await fetchReportData(key);
      if (fmt === "pdf") {
        generateReportPdf({ ...data, filename: `${key}.pdf` });
      } else {
        generateExcel({ ...data, filename: `${key}.xlsx` });
      }
      toast({ title: `${fmt === "pdf" ? "PDF" : "Excel"} gerado`, description: `${data.rows.length} registros exportados` });
    } catch (e: any) {
      toast.error("Erro", { description: e.message });
    } finally {
      setGenerating(null);
    }
  };

  const relatorios = [
    { key: "vendas", titulo: "Vendas por Período", descricao: "Relatório de vendas filtrado por data", icon: TrendingUp },
    { key: "faturamento", titulo: "Faturamento Mensal", descricao: "Receita e despesas por mês", icon: DollarSign },
    { key: "estoque", titulo: "Estoque Atual", descricao: "Posição atual do estoque de materiais", icon: Package },
    { key: "clientes", titulo: "Clientes Ativos", descricao: "Lista de clientes com orçamentos recentes", icon: Users },
    { key: "orcamentos", titulo: "Orçamentos Emitidos", descricao: "Todos os orçamentos do período", icon: FileText },
    { key: "producao", titulo: "Desempenho Produção", descricao: "Métricas de produção e eficiência", icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground text-sm">Gere relatórios e análises do sistema em PDF ou Excel</p>
      </div>

      <Card className="border-border/40 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Período:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className={cn("w-[130px] sm:w-[160px] justify-start text-left font-normal text-xs sm:text-sm", !dataInicio && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataInicio ? format(dataInicio, "dd/MM/yyyy") : "Data inicial"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dataInicio} onSelect={setDataInicio} locale={ptBR} initialFocus className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
            <span className="text-sm text-muted-foreground">até</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className={cn("w-[130px] sm:w-[160px] justify-start text-left font-normal text-xs sm:text-sm", !dataFim && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataFim ? format(dataFim, "dd/MM/yyyy") : "Data final"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dataFim} onSelect={setDataFim} locale={ptBR} initialFocus className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
            {(dataInicio || dataFim) && (
              <Button variant="ghost" size="sm" onClick={() => { setDataInicio(undefined); setDataFim(undefined); }}>
                Limpar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {relatorios.map((r) => (
          <Card key={r.key} className="group relative overflow-hidden border-border/40 bg-card/80 backdrop-blur-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300">
            <CardContent className="p-3 sm:p-5">
              <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
                  <r.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm leading-tight">{r.titulo}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{r.descricao}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5"
                  onClick={() => handlePreview(r.key)}
                  disabled={loadingPreview === r.key}
                >
                  {loadingPreview === r.key ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                  Visualizar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
                  onClick={() => exportReport(r.key, "pdf")}
                  disabled={generating === `${r.key}-pdf`}
                >
                  {generating === `${r.key}-pdf` ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/30 dark:hover:text-emerald-400 transition-colors"
                  onClick={() => exportReport(r.key, "excel")}
                  disabled={generating === `${r.key}-excel`}
                >
                  {generating === `${r.key}-excel` ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
                  Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-lg">{previewData?.title}</DialogTitle>
            {previewData?.subtitle && (
              <p className="text-sm text-muted-foreground">{previewData.subtitle}</p>
            )}
          </DialogHeader>

          {previewData && (
            <div className="flex-1 overflow-hidden flex flex-col gap-4">
              {/* Summary Cards */}
              <div className="flex flex-wrap gap-3">
                {previewData.summaryCards.map((card, i) => (
                  <div key={i} className="flex-1 min-w-[120px] rounded-lg border border-border/50 bg-muted/30 p-3">
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">{card.label}</p>
                    <p className="text-lg font-bold text-foreground mt-0.5">{card.value}</p>
                  </div>
                ))}
              </div>

              {/* Data Table */}
              <div className="flex-1 overflow-auto rounded-lg border border-border/50">
                {previewData.rows.length === 0 ? (
                  <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
                    Nenhum registro encontrado para o período selecionado.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        {previewData.headers.map((h, i) => (
                          <TableHead key={i} className="text-xs font-semibold uppercase tracking-wide whitespace-nowrap">{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.rows.map((row, ri) => (
                        <TableRow key={ri} className="hover:bg-muted/20">
                          {row.map((cell, ci) => (
                            <TableCell key={ci} className="text-sm py-2.5 whitespace-nowrap">
                              {cell === "BAIXO" ? (
                                <Badge variant="destructive" className="text-[10px]">BAIXO</Badge>
                              ) : cell === "aprovado" ? (
                                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">Aprovado</Badge>
                              ) : cell === "pendente" ? (
                                <Badge variant="outline" className="text-amber-600 dark:text-amber-400 border-amber-400/40 text-[10px]">Pendente</Badge>
                              ) : cell === "em_andamento" ? (
                                <Badge variant="outline" className="text-blue-600 dark:text-blue-400 border-blue-400/40 text-[10px]">Em Andamento</Badge>
                              ) : cell === "concluido" ? (
                                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">Concluído</Badge>
                              ) : (
                                cell
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              <p className="text-xs text-muted-foreground text-right">
                {previewData.rows.length} registro{previewData.rows.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/50">
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>Fechar</Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => exportFromPreview("excel")}
              disabled={generating === `${previewKey}-excel`}
            >
              {generating === `${previewKey}-excel` ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
              Excel
            </Button>
            <Button
              className="gap-2"
              onClick={() => exportFromPreview("pdf")}
              disabled={generating === `${previewKey}-pdf`}
            >
              {generating === `${previewKey}-pdf` ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
              Exportar PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Relatorios;
