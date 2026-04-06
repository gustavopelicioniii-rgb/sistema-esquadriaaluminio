import { useState } from "react";
import { Sparkles, Loader2, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { aiOneShot } from "@/hooks/use-ai-chat";
import ReactMarkdown from "react-markdown";

interface CutRule {
  profile_code: string;
  piece_name: string;
  piece_function: string;
  reference_dimension: string;
  coefficient: number;
  constant_mm: number;
  quantity_formula: string;
  cut_angle_left: number;
  cut_angle_right: number;
  weight_per_meter: number;
}

interface GlassRule {
  glass_name: string;
  width_reference: string;
  width_constant_mm: number;
  height_reference: string;
  height_constant_mm: number;
  quantity: number;
  glass_type?: string | null;
  min_thickness_mm?: number | null;
  max_thickness_mm?: number | null;
}

interface ComponentRule {
  component_name: string;
  component_type: string;
  quantity_formula: string;
  unit: string;
  length_reference?: string | null;
  length_constant_mm?: number | null;
}

interface Props {
  typologyName: string;
  category: string;
  numFolhas: number;
  cutRules: CutRule[];
  glassRules: GlassRule[];
  componentRules: ComponentRule[];
}

export function RulesAiValidator({ typologyName, category, numFolhas, cutRules, glassRules, componentRules }: Props) {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const totalRules = cutRules.length + glassRules.length + componentRules.length;

  const validate = async () => {
    if (totalRules === 0) return;
    setLoading(true);
    try {
      const cutData = cutRules.map(r =>
        `  - Perfil: ${r.profile_code}, Peça: ${r.piece_name}, Função: ${r.piece_function}, Ref: ${r.reference_dimension}, Coef: ${r.coefficient}, Const: ${r.constant_mm}mm, Qtd: ${r.quantity_formula}, Ângulos: ${r.cut_angle_left}°/${r.cut_angle_right}°, Peso: ${r.weight_per_meter}kg/m`
      ).join("\n");

      const glassData = glassRules.map(r =>
        `  - Vidro: ${r.glass_name}, Larg: ${r.width_reference} ${r.width_constant_mm > 0 ? "+" : ""}${r.width_constant_mm}mm, Alt: ${r.height_reference} ${r.height_constant_mm > 0 ? "+" : ""}${r.height_constant_mm}mm, Qtd: ${r.quantity}, Tipo: ${r.glass_type || "não definido"}, Espessura: ${r.min_thickness_mm ?? "?"}–${r.max_thickness_mm ?? "?"}mm`
      ).join("\n");

      const compData = componentRules.map(r =>
        `  - ${r.component_name} (${r.component_type}): Qtd: ${r.quantity_formula}, Un: ${r.unit}, Ref: ${r.length_reference || "N/A"}, Const: ${r.length_constant_mm ?? 0}mm`
      ).join("\n");

      const prompt = `Você é um engenheiro especialista em esquadrias de alumínio. Analise as regras de corte, vidro e componentes desta tipologia e identifique ERROS, INCONSISTÊNCIAS e MELHORIAS.

Tipologia: ${typologyName}
Categoria: ${category}
Número de folhas: ${numFolhas}

REGRAS DE CORTE (${cutRules.length}):
${cutData || "  Nenhuma"}

REGRAS DE VIDRO (${glassRules.length}):
${glassData || "  Nenhuma"}

REGRAS DE COMPONENTES (${componentRules.length}):
${compData || "  Nenhuma"}

Verifique:
1. **Erros críticos**: constantes com sinal trocado, coeficientes impossíveis, peças faltantes (marco, folha, etc.), ângulos incorretos
2. **Inconsistências**: vidros maiores que o vão, constantes de desconto muito grandes ou muito pequenas, peso por metro zerado
3. **Peças faltantes**: para ${category} com ${numFolhas} folhas, verificar se tem todos os marcos (sup/inf/lat), folhas, trilhos, etc.
4. **Vidros**: quantidade compatível com nº de folhas, constantes de desconto coerentes
5. **Componentes**: verificar se tem roldanas, fechos, puxadores necessários para o tipo

Use emojis: ❌ para erros, ⚠️ para alertas, ✅ para itens corretos, 💡 para sugestões.
Seja conciso (máx 250 palavras). Se tudo estiver correto, diga isso claramente.`;

      const response = await aiOneShot("assistant", prompt);
      setResult(response);
    } catch (e) {
      setResult(`❌ ${e instanceof Error ? e.message : "Erro ao validar"}`);
    } finally {
      setLoading(false);
    }
  };

  const hasErrors = result && (result.includes("❌") || result.includes("⚠️"));

  return (
    <Card className={`border-2 ${result ? (hasErrors ? "border-destructive/30 bg-destructive/5" : "border-green-500/30 bg-green-500/5") : "border-primary/20 bg-gradient-to-br from-primary/5 to-transparent"}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          {result ? (
            hasErrors ? <AlertTriangle className="h-4 w-4 text-destructive" /> : <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <Sparkles className="h-4 w-4 text-primary" />
          )}
          Validação IA das Regras
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!result && !loading && (
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={validate}
            disabled={totalRules === 0}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {totalRules === 0 ? "Adicione regras primeiro" : `Validar ${totalRules} regras com IA`}
          </Button>
        )}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analisando regras...
          </div>
        )}

        {result && !loading && (
          <div className="space-y-3">
            <div className="prose prose-sm dark:prose-invert max-w-none text-sm [&>p]:mb-1.5">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={validate}>
              <RefreshCw className="h-3 w-3" />
              Revalidar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
