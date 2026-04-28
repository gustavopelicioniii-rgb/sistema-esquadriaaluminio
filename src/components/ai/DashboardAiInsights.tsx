import { useState } from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { aiOneShot } from '@/hooks/use-ai-chat';
import ReactMarkdown from 'react-markdown';

interface Props {
  stats: {
    totalOrcamentos: number;
    totalPedidos: number;
    receitaTotal: number;
    pedidosAtrasados: number;
  } | null;
  receitaMensal: { mes: string; total: number }[];
  statusPedidos: { status: string; count: number }[];
}

export function DashboardAiInsights({ stats, receitaMensal, statusPedidos }: Props) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateInsight = async () => {
    if (!stats) return;
    setLoading(true);
    try {
      const prompt = `Dados do dashboard:
- Total orçamentos: ${stats.totalOrcamentos}
- Total pedidos: ${stats.totalPedidos}
- Receita total: R$ ${stats.receitaTotal.toFixed(2)}
- Pedidos atrasados: ${stats.pedidosAtrasados}
- Status pedidos: ${statusPedidos.map(s => `${s.status}: ${s.count}`).join(', ')}
- Receita últimos meses: ${receitaMensal
        .slice(-3)
        .map(r => `${r.mes}: R$ ${r.total.toFixed(2)}`)
        .join(', ')}

Gere um resumo executivo curto (máx 150 palavras) com insights e recomendações.`;

      const result = await aiOneShot('dashboard', prompt);
      setInsight(result);
    } catch (e) {
      setInsight(`❌ ${e instanceof Error ? e.message : 'Erro ao gerar insights'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Insights com IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!insight && !loading && (
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={generateInsight}
            disabled={!stats}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Gerar análise inteligente
          </Button>
        )}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analisando dados...
          </div>
        )}

        {insight && !loading && (
          <div className="space-y-3">
            <div className="prose prose-sm dark:prose-invert max-w-none text-sm [&>p]:mb-1.5">
              <ReactMarkdown>{insight}</ReactMarkdown>
            </div>
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={generateInsight}>
              <RefreshCw className="h-3 w-3" />
              Atualizar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
