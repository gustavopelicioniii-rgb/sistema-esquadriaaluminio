import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, BarChart3, TrendingUp, DollarSign, Package, Users, FileText } from "lucide-react";

const relatorios = [
  { titulo: "Vendas por Período", descricao: "Relatório de vendas filtrado por data", icon: TrendingUp },
  { titulo: "Faturamento Mensal", descricao: "Receita e despesas por mês", icon: DollarSign },
  { titulo: "Estoque Atual", descricao: "Posição atual do estoque de materiais", icon: Package },
  { titulo: "Clientes Ativos", descricao: "Lista de clientes com orçamentos recentes", icon: Users },
  { titulo: "Orçamentos Emitidos", descricao: "Todos os orçamentos do período", icon: FileText },
  { titulo: "Desempenho Produção", descricao: "Métricas de produção e eficiência", icon: BarChart3 },
];

const Relatorios = () => {
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
              <Button variant="outline" size="sm" className="gap-2 w-full">
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
