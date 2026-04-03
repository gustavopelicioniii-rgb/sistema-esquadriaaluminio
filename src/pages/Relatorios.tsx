import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, TrendingUp, DollarSign, Package, Users, FileText, BarChart3 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/use-page-title";
import { orcamentos, itensEstoque, contasFinanceiras, ordensProducao, formatCurrency } from "@/data/mockData";
import { generateReportPdf } from "@/utils/reportPdfGenerator";

const relatorios = [
  {
    titulo: "Vendas por Período",
    descricao: "Relatório de vendas filtrado por data",
    icon: TrendingUp,
    generate: () => {
      const approved = orcamentos.filter((o) => o.status === "aprovado");
      const total = approved.reduce((s, o) => s + o.valor, 0);
      generateReportPdf({
        title: "Vendas por Período",
        subtitle: "Relatório de vendas aprovadas",
        filename: "vendas.pdf",
        headers: ["ID", "Cliente", "Produto", "Valor", "Data"],
        columnWidths: [20, 50, 45, 30, 35],
        summaryCards: [
          { label: "Total Vendas", value: String(approved.length) },
          { label: "Valor Total", value: formatCurrency(total) },
          { label: "Ticket Médio", value: formatCurrency(approved.length ? total / approved.length : 0) },
        ],
        rows: approved.map((o) => [o.id, o.cliente, o.produto, formatCurrency(o.valor), o.data]),
      });
      toast({ title: "PDF gerado", description: `${approved.length} vendas exportadas` });
    },
  },
  {
    titulo: "Faturamento Mensal",
    descricao: "Receita e despesas por mês",
    icon: DollarSign,
    generate: () => {
      const receber = contasFinanceiras.filter((c) => c.tipo === "receber");
      const pagar = contasFinanceiras.filter((c) => c.tipo === "pagar");
      const totalRec = receber.reduce((s, c) => s + c.valor, 0);
      const totalPag = pagar.reduce((s, c) => s + c.valor, 0);
      generateReportPdf({
        title: "Faturamento Mensal",
        subtitle: "Receitas e despesas do período",
        filename: "faturamento.pdf",
        headers: ["Tipo", "ID", "Cliente", "Descrição", "Valor", "Status"],
        columnWidths: [20, 22, 40, 35, 30, 23],
        summaryCards: [
          { label: "A Receber", value: formatCurrency(totalRec) },
          { label: "A Pagar", value: formatCurrency(totalPag) },
          { label: "Saldo", value: formatCurrency(totalRec - totalPag) },
        ],
        rows: contasFinanceiras.map((c) => [
          c.tipo === "receber" ? "Receita" : "Despesa",
          c.id, c.cliente, c.descricao, formatCurrency(c.valor), c.status,
        ]),
      });
      toast({ title: "PDF gerado", description: `${receber.length} receitas, ${pagar.length} despesas` });
    },
  },
  {
    titulo: "Estoque Atual",
    descricao: "Posição atual do estoque de materiais",
    icon: Package,
    generate: () => {
      const baixo = itensEstoque.filter((i) => i.quantidade <= i.minimo).length;
      generateReportPdf({
        title: "Estoque Atual",
        subtitle: "Posição atual do estoque de materiais",
        filename: "estoque.pdf",
        headers: ["Código", "Produto", "Categoria", "Qtd", "Un.", "Mín.", "Status"],
        columnWidths: [22, 42, 25, 18, 18, 18, 22],
        summaryCards: [
          { label: "Total Itens", value: String(itensEstoque.length) },
          { label: "Estoque Baixo", value: String(baixo) },
          { label: "Normal", value: String(itensEstoque.length - baixo) },
        ],
        rows: itensEstoque.map((i) => [
          i.id, i.produto, i.categoria, String(i.quantidade), i.unidade, String(i.minimo),
          i.quantidade <= i.minimo ? "BAIXO" : "Normal",
        ]),
      });
      toast({ title: "PDF gerado", description: `${itensEstoque.length} itens exportados` });
    },
  },
  {
    titulo: "Clientes Ativos",
    descricao: "Lista de clientes com orçamentos recentes",
    icon: Users,
    generate: () => {
      const clientes = [...new Set(orcamentos.map((o) => o.cliente))];
      const clienteData = clientes.map((c) => {
        const orcs = orcamentos.filter((o) => o.cliente === c);
        return [c, String(orcs.length), formatCurrency(orcs.reduce((s, o) => s + o.valor, 0))];
      });
      generateReportPdf({
        title: "Clientes Ativos",
        subtitle: "Clientes com orçamentos no período",
        filename: "clientes_ativos.pdf",
        headers: ["Cliente", "Total Orçamentos", "Valor Total"],
        columnWidths: [70, 50, 60],
        summaryCards: [
          { label: "Total Clientes", value: String(clientes.length) },
          { label: "Orçamentos", value: String(orcamentos.length) },
        ],
        rows: clienteData,
      });
      toast({ title: "PDF gerado", description: `${clientes.length} clientes exportados` });
    },
  },
  {
    titulo: "Orçamentos Emitidos",
    descricao: "Todos os orçamentos do período",
    icon: FileText,
    generate: () => {
      const total = orcamentos.reduce((s, o) => s + o.valor, 0);
      generateReportPdf({
        title: "Orçamentos Emitidos",
        subtitle: "Todos os orçamentos do período",
        filename: "orcamentos.pdf",
        headers: ["ID", "Cliente", "Produto", "Valor", "Data", "Status"],
        columnWidths: [20, 40, 40, 30, 25, 25],
        summaryCards: [
          { label: "Total", value: String(orcamentos.length) },
          { label: "Valor Total", value: formatCurrency(total) },
          { label: "Aprovados", value: String(orcamentos.filter((o) => o.status === "aprovado").length) },
        ],
        rows: orcamentos.map((o) => [o.id, o.cliente, o.produto, formatCurrency(o.valor), o.data, o.status]),
      });
      toast({ title: "PDF gerado", description: `${orcamentos.length} orçamentos exportados` });
    },
  },
  {
    titulo: "Desempenho Produção",
    descricao: "Métricas de produção e eficiência",
    icon: BarChart3,
    generate: () => {
      const totalValor = ordensProducao.reduce((s, o) => s + o.valor, 0);
      generateReportPdf({
        title: "Desempenho Produção",
        subtitle: "Métricas de produção e eficiência",
        filename: "producao.pdf",
        headers: ["ID", "Pedido", "Cliente", "Valor", "Status", "Previsão"],
        columnWidths: [22, 20, 45, 30, 28, 35],
        summaryCards: [
          { label: "Ordens", value: String(ordensProducao.length) },
          { label: "Valor Total", value: formatCurrency(totalValor) },
          { label: "Em Andamento", value: String(ordensProducao.filter((o) => o.status === "em_andamento").length) },
        ],
        rows: ordensProducao.map((o) => [
          o.id, String(o.pedidoNum), o.cliente, formatCurrency(o.valor), o.status, o.previsao,
        ]),
      });
      toast({ title: "PDF gerado", description: `${ordensProducao.length} ordens exportadas` });
    },
  },
];

const Relatorios = () => {
  usePageTitle("Relatórios");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground text-sm">Gere relatórios e análises do sistema</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {relatorios.map((r, i) => (
          <Card key={i} className="group relative overflow-hidden border-border/40 bg-card/80 backdrop-blur-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300">
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
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 mt-1 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
                onClick={r.generate}
              >
                <FileDown className="h-4 w-4" />
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Relatorios;
