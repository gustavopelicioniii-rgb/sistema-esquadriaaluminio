import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, TrendingUp, DollarSign, Package, Users, FileText, BarChart3, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/use-page-title";
import { formatCurrency } from "@/lib/formatters";
import { generateReportPdf } from "@/utils/reportPdfGenerator";
import { supabase } from "@/integrations/supabase/client";

const Relatorios = () => {
  usePageTitle("Relatórios");
  const [generating, setGenerating] = useState<string | null>(null);

  const generate = async (key: string, fn: () => Promise<void>) => {
    setGenerating(key);
    try { await fn(); }
    catch (e: any) { toast({ title: "Erro", description: e.message, variant: "destructive" }); }
    finally { setGenerating(null); }
  };

  const relatorios = [
    {
      key: "vendas",
      titulo: "Vendas por Período",
      descricao: "Relatório de vendas filtrado por data",
      icon: TrendingUp,
      generate: () => generate("vendas", async () => {
        const { data: orcamentos = [] } = await supabase.from("orcamentos").select("*");
        const approved = orcamentos!.filter((o) => o.status === "aprovado");
        const total = approved.reduce((s, o) => s + Number(o.valor), 0);
        generateReportPdf({
          title: "Vendas por Período", subtitle: "Relatório de vendas aprovadas", filename: "vendas.pdf",
          headers: ["Número", "Cliente", "Produto", "Valor", "Data"],
          columnWidths: [25, 45, 45, 30, 35],
          summaryCards: [
            { label: "Total Vendas", value: String(approved.length) },
            { label: "Valor Total", value: formatCurrency(total) },
            { label: "Ticket Médio", value: formatCurrency(approved.length ? total / approved.length : 0) },
          ],
          rows: approved.map((o) => [o.numero, o.cliente, o.produto, formatCurrency(Number(o.valor)), o.data]),
        });
        toast({ title: "PDF gerado", description: `${approved.length} vendas exportadas` });
      }),
    },
    {
      key: "faturamento",
      titulo: "Faturamento Mensal",
      descricao: "Receita e despesas por mês",
      icon: DollarSign,
      generate: () => generate("faturamento", async () => {
        const { data: contas = [] } = await supabase.from("contas_financeiras").select("*");
        const receber = contas!.filter((c: any) => c.tipo === "receber");
        const pagar = contas!.filter((c: any) => c.tipo === "pagar");
        const totalRec = receber.reduce((s, c: any) => s + Number(c.valor), 0);
        const totalPag = pagar.reduce((s, c: any) => s + Number(c.valor), 0);
        generateReportPdf({
          title: "Faturamento Mensal", subtitle: "Receitas e despesas do período", filename: "faturamento.pdf",
          headers: ["Tipo", "Cliente", "Descrição", "Valor", "Status"],
          columnWidths: [25, 40, 40, 30, 25],
          summaryCards: [
            { label: "A Receber", value: formatCurrency(totalRec) },
            { label: "A Pagar", value: formatCurrency(totalPag) },
            { label: "Saldo", value: formatCurrency(totalRec - totalPag) },
          ],
          rows: contas!.map((c: any) => [
            c.tipo === "receber" ? "Receita" : "Despesa",
            c.cliente, c.descricao, formatCurrency(Number(c.valor)), c.status,
          ]),
        });
        toast({ title: "PDF gerado", description: `${receber.length} receitas, ${pagar.length} despesas` });
      }),
    },
    {
      key: "estoque",
      titulo: "Estoque Atual",
      descricao: "Posição atual do estoque de materiais",
      icon: Package,
      generate: () => generate("estoque", async () => {
        const { data: itens = [] } = await supabase.from("estoque").select("*");
        const baixo = itens!.filter((i) => i.quantidade <= i.minimo).length;
        generateReportPdf({
          title: "Estoque Atual", subtitle: "Posição atual do estoque de materiais", filename: "estoque.pdf",
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
        });
        toast({ title: "PDF gerado", description: `${itens!.length} itens exportados` });
      }),
    },
    {
      key: "clientes",
      titulo: "Clientes Ativos",
      descricao: "Lista de clientes com orçamentos recentes",
      icon: Users,
      generate: () => generate("clientes", async () => {
        const { data: clientes = [] } = await supabase.from("clientes").select("*");
        generateReportPdf({
          title: "Clientes Ativos", subtitle: "Clientes cadastrados", filename: "clientes_ativos.pdf",
          headers: ["Nome", "Telefone", "Email", "Cidade"],
          columnWidths: [50, 35, 50, 40],
          summaryCards: [{ label: "Total Clientes", value: String(clientes!.length) }],
          rows: clientes!.map((c) => [c.nome, c.telefone || "", c.email || "", c.cidade || ""]),
        });
        toast({ title: "PDF gerado", description: `${clientes!.length} clientes exportados` });
      }),
    },
    {
      key: "orcamentos",
      titulo: "Orçamentos Emitidos",
      descricao: "Todos os orçamentos do período",
      icon: FileText,
      generate: () => generate("orcamentos", async () => {
        const { data: orcamentos = [] } = await supabase.from("orcamentos").select("*");
        const total = orcamentos!.reduce((s, o) => s + Number(o.valor), 0);
        generateReportPdf({
          title: "Orçamentos Emitidos", subtitle: "Todos os orçamentos do período", filename: "orcamentos.pdf",
          headers: ["Número", "Cliente", "Produto", "Valor", "Data", "Status"],
          columnWidths: [25, 40, 40, 30, 25, 25],
          summaryCards: [
            { label: "Total", value: String(orcamentos!.length) },
            { label: "Valor Total", value: formatCurrency(total) },
            { label: "Aprovados", value: String(orcamentos!.filter((o) => o.status === "aprovado").length) },
          ],
          rows: orcamentos!.map((o) => [o.numero, o.cliente, o.produto, formatCurrency(Number(o.valor)), o.data, o.status]),
        });
        toast({ title: "PDF gerado", description: `${orcamentos!.length} orçamentos exportados` });
      }),
    },
    {
      key: "producao",
      titulo: "Desempenho Produção",
      descricao: "Métricas de produção e eficiência",
      icon: BarChart3,
      generate: () => generate("producao", async () => {
        const { data: pedidos = [] } = await supabase.from("pedidos").select("*");
        const totalValor = pedidos!.reduce((s, o) => s + Number(o.valor), 0);
        generateReportPdf({
          title: "Desempenho Produção", subtitle: "Métricas de produção e eficiência", filename: "producao.pdf",
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
        });
        toast({ title: "PDF gerado", description: `${pedidos!.length} pedidos exportados` });
      }),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground text-sm">Gere relatórios e análises do sistema</p>
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
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 mt-1 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
                onClick={r.generate}
                disabled={generating === r.key}
              >
                {generating === r.key ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
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
