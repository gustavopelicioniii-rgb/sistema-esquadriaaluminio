import { useState } from "react";
import { Sparkles, Loader2, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { aiOneShot } from "@/hooks/use-ai-chat";
import ReactMarkdown from "react-markdown";

export function OrcamentoAiHelper() {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const prompt = `O cliente descreveu o seguinte projeto de esquadrias:
"${description}"

Com base nessa descrição, sugira:
1. Tipos de esquadrias recomendados (com quantidades)
2. Dimensões sugeridas (largura x altura em cm)
3. Tipo de vidro recomendado
4. Acabamento/cor do alumínio
5. Estimativa de área total em m²

Formate como uma lista clara e organizada.`;

      const result = await aiOneShot("orcamento", prompt);
      setSuggestion(result);
    } catch (e) {
      setSuggestion(`❌ ${e instanceof Error ? e.message : "Erro"}`);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-2 border-primary/30 text-primary hover:bg-primary/5"
        onClick={() => setOpen(true)}
      >
        <Sparkles className="h-3.5 w-3.5" />
        Sugerir com IA
      </Button>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Assistente de Orçamento
          </CardTitle>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setOpen(false); setSuggestion(null); }}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva o projeto... Ex: 'Apartamento com 3 quartos, preciso de janelas de correr para a sala (3m), banheiros com maxim-ar e porta de giro para os quartos'"
          className="min-h-[80px] text-sm resize-none"
        />
        <Button
          size="sm"
          className="w-full gap-2"
          onClick={generate}
          disabled={loading || !description.trim()}
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MessageCircle className="h-3.5 w-3.5" />}
          {loading ? "Gerando sugestão..." : "Gerar sugestão"}
        </Button>

        {suggestion && (
          <div className="prose prose-sm dark:prose-invert max-w-none text-sm border-t pt-3 [&>p]:mb-1.5">
            <ReactMarkdown>{suggestion}</ReactMarkdown>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
