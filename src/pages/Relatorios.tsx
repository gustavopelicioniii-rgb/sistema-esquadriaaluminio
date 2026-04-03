import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, TrendingUp, DollarSign, Package, Users, FileText, BarChart3, Loader2, FileSpreadsheet, CalendarIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
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
        const receber = contas!.filter((c: any) => c.tipo === "receber");
        const pagar = contas!.filter((c: any) => c.tipo === "pagar");
        const totalRec = receber.reduce((s, c: any) => s + Number(c.valor), 0);
        const totalPag = pagar.reduce((s, c: any) => s + Number(c.valor), 0);
        return {
          title: "Faturamento Mensal", subtitle: "Receitas e despesas do período",
          headers: ["Tipo", "Cliente", "Descrição", "Valor", "Status"],
          columnWidths: [25, 40, 40, 30, 25],
          summaryCards: [
            { label: "A Receber", value: formatCurrency(totalRec) },
            { label: "A Pagar", value: formatCurrency(totalPag) },
            { label: "Saldo", value: formatCurrency(totalRec - totalPag) },
          ],
          rows: contas!.map((c: any) => [
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
        const total = orcamentos!.reduce((s, o) => s + Number(o.valor), 0);
        return {
          title: "Orçamentos Emitidos", subtitle: "Todos os orçamentos do período",
          headers: ["Número", "Cliente", "Produto", "Valor", "Data", "Status"],
          columnWidths: [25, 40, 40, 30, 25, 25],
          summaryCards: [
            { label: "Total", value: String(orcamentos!.length) },
            { label: "Valor Total", value: formatCurrency(total) },
            { label: "Aprovados", value: String(orcamentos!.filter((o) => o.status === "aprovado").length) },
          ],
          rows: orcamentos!.map((o) => [o.numero, o.cliente, o.produto, formatCurrency(Number(o.valor)), o.data, o.status]),
        };
      }
      case "producao": {
        const { data: pedidos = [] } = await supabase.from("pedidos").select("*");
        const totalValor = pedidos!.reduce((s, o) => s + Number(o.valor), 0);
        return {
          title: "Desempenho Produção", subtitle: "Métricas de produção e eficiência",
          headers: ["Pedido", "Cliente", "Valor", "Status", "Previsão"],
          columnWidths: [20, 50, 30, 28, 35],
          summaryCards: [
            { label: "Pedidos", value: String(pedidos!.length) },
            { label: "Valor Total", value: formatCurrency(totalValor) },
            { label: "Em Andamento", value: String(pedidos!.filter((o) => o.status === "em_andamento").length) },
          ],
          rows: pedidos!.map((o) => [
            String(o.pedido_num), o.cliente, formatCurrency(Number(o.valor)), o.status, o.previsao || "-",
          ]),
        };
      }
      default:
        throw new Error("Relatório não encontrado");
    }
  };

  const exportReport = async (key: string, format: "pdf" | "excel") => {
    setGenerating(`${key}-${format}`);
    try {
      const data = await fetchReportData(key);
      if (format === "pdf") {
        generateReportPdf({ ...data, filename: `${key}.pdf` });
      } else {
        generateExcel({ ...data, filename: `${key}.xlsx` });
      }
      toast({ title: `${format === "pdf" ? "PDF" : "Excel"} gerado`, description: `${data.rows.length} registros exportados` });
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {relatorios.map((r) => (
          <Card key={r.key} className="group relative overflow-hidden border-border/40 bg-card/80 backdrop-blur-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
                  <r.icon className="h-5 w-5 text-primary" />
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
                  className="flex-1 gap-1.5 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
                  onClick={() => exportReport(r.key, "pdf")}
                  disabled={generating === `${r.key}-pdf`}
                >
                  {generating === `${r.key}-pdf` ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5 hover:bg-success/10 hover:text-success hover:border-success/30 transition-colors"
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
    </div>
  );
};

export default Relatorios;
