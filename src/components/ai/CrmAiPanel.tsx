import { useState } from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { aiOneShot } from '@/hooks/use-ai-chat';
import ReactMarkdown from 'react-markdown';

interface Lead {
  nome: string;
  status: string;
  valor: number;
  follow_up_date?: string | null;
  observacao?: string | null;
}

interface Props {
  leads: Lead[];
}

export function CrmAiPanel({ leads }: Props) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (leads.length === 0) return;
    setLoading(true);
    try {
      const leadsData = leads
        .slice(0, 20)
        .map(
          l =>
            `- ${l.nome}: status=${l.status}, valor=R$${l.valor}, follow_up=${l.follow_up_date || 'sem data'}, obs=${l.observacao || 'nenhuma'}`
        )
        .join('\n');

      const prompt = `Analise estes leads do CRM e forneça:
1. Classificação por probabilidade de conversão (alta/média/baixa)
2. Top 3 leads prioritários e por quê
3. Sugestões de follow-up para cada prioridade
4. Padrões identificados

Leads:
${leadsData}

Seja conciso (máx 200 palavras).`;

      const result = await aiOneShot('crm', prompt);
      setInsight(result);
    } catch (e) {
      setInsight(`❌ ${e instanceof Error ? e.message : 'Erro'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Análise IA dos Leads
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!insight && !loading && (
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={analyze}
            disabled={leads.length === 0}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Analisar leads com IA
          </Button>
        )}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analisando leads...
          </div>
        )}

        {insight && !loading && (
          <div className="space-y-3">
            <div className="prose prose-sm dark:prose-invert max-w-none text-sm [&>p]:mb-1.5">
              <ReactMarkdown>{insight}</ReactMarkdown>
            </div>
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={analyze}>
              <RefreshCw className="h-3 w-3" />
              Reanalisar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
