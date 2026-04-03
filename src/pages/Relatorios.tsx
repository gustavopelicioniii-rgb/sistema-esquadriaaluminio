import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, BarChart3, TrendingUp, DollarSign, Package, Users, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/use-page-title";
import { orcamentos, itensEstoque, contasFinanceiras, ordensProducao, formatCurrency } from "@/data/mockData";

const downloadCSV = (filename: string, headers: string[], rows: string[][]) => {
  const csv = [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const relatorios = [
  {
    titulo: "Vendas por Período", descricao: "Relatório de vendas filtrado por data", icon: TrendingUp,
    generate: () => {
      const approved = orcamentos.filter((o) => o.status === "aprovado");
      downloadCSV("vendas.csv", ["ID", "Cliente", "Produto", "Valor", "Data", "Status"],
        approved.map((o) => [o.id, o.cliente, o.produto, formatCurrency(o.valor), o.data, o.status]));
      toast({ title: "Relatório gerado", description: `${approved.length} vendas exportadas` });
    },
  },
  {
    titulo: "Faturamento Mensal", descricao: "Receita e despesas por mês", icon: DollarSign,
    generate: () => {
      const receber = contasFinanceiras.filter((c) => c.tipo === "receber");
      const pagar = contasFinanceiras.filter((c) => c.tipo === "pagar");
      downloadCSV("faturamento.csv", ["Tipo", "ID", "Cliente", "Descrição", "Valor", "Vencimento", "Status"],
        contasFinanceiras.map((c) => [c.tipo === "receber" ? "Receita" : "Despesa", c.id, c.cliente, c.descricao, formatCurrency(c.valor), c.vencimento, c.status]));
      toast({ title: "Relatório gerado", description: `${receber.length} receitas, ${pagar.length} despesas` });
    },
  },
  {
    titulo: "Estoque Atual", descricao: "Posição atual do estoque de materiais", icon: Package,
    generate: () => {
      downloadCSV("estoque.csv", ["Código", "Produto", "Categoria", "Quantidade", "Unidade", "Mínimo", "Status"],
        itensEstoque.map((i) => [i.id, i.produto, i.categoria, String(i.quantidade), i.unidade, String(i.minimo), i.quantidade <= i.minimo ? "BAIXO" : "Normal"]));
      toast({ title: "Relatório gerado", description: `${itensEstoque.length} itens exportados` });
    },
  },
  {
    titulo: "Clientes Ativos", descricao: "Lista de clientes com orçamentos recentes", icon: Users,
    generate: () => {
      const clientes = [...new Set(orcamentos.map((o) => o.cliente))];
      downloadCSV("clientes_ativos.csv", ["Cliente", "Total Orçamentos", "Valor Total"],
        clientes.map((c) => {
          const orcs = orcamentos.filter((o) => o.cliente === c);
          return [c, String(orcs.length), formatCurrency(orcs.reduce((s, o) => s + o.valor, 0))];
        }));
      toast({ title: "Relatório gerado", description: `${clientes.length} clientes exportados` });
    },
  },
  {
    titulo: "Orçamentos Emitidos", descricao: "Todos os orçamentos do período", icon: FileText,
    generate: () => {
      downloadCSV("orcamentos.csv", ["ID", "Cliente", "Produto", "Valor", "Data", "Status"],
        orcamentos.map((o) => [o.id, o.cliente, o.produto, formatCurrency(o.valor), o.data, o.status]));
      toast({ title: "Relatório gerado", description: `${orcamentos.length} orçamentos exportados` });
    },
  },
  {
    titulo: "Desempenho Produção", descricao: "Métricas de produção e eficiência", icon: BarChart3,
    generate: () => {
      downloadCSV("producao.csv", ["ID", "Pedido", "Cliente", "Valor", "Status", "Previsão"],
        ordensProducao.map((o) => [o.id, String(o.pedidoNum), o.cliente, formatCurrency(o.valor), o.status, o.previsao]));
      toast({ title: "Relatório gerado", description: `${ordensProducao.length} ordens exportadas` });
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
          <Card key={i} className="shadow-sm border-border/50 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <r.icon className="h-4 w-4 text-primary" />
                </div>
                {r.titulo}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{r.descricao}</p>
              <Button variant="outline" size="sm" className="gap-2 w-full" onClick={r.generate}>
                <FileDown className="h-4 w-4" /> Gerar Relatório
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Relatorios;
