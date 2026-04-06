import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  assistant: `Você é o AluFlow AI, assistente inteligente de um sistema de cálculo de esquadrias de alumínio.
Você ajuda com:
- Escolha de tipologias (janela de correr, maxim-ar, porta de giro, etc.)
- Dimensões recomendadas e limites
- Regras de corte e vidro
- Dúvidas sobre o sistema
- Cálculos de esquadrias
- Orientação sobre plano de corte e otimização
Seja sempre útil, conciso e técnico quando necessário. Responda em português brasileiro.`,

  dashboard: `Você é um analista de negócios do AluFlow. Analise os dados fornecidos e gere um resumo executivo com:
1. Visão geral do período
2. Destaques positivos
3. Pontos de atenção
4. Recomendações práticas
Seja conciso, use emojis para destaque. Responda em português brasileiro.`,

  crm: `Você é um consultor de vendas do AluFlow. Com base nos dados dos leads:
1. Classifique a probabilidade de conversão (alta/média/baixa)
2. Sugira próximas ações de follow-up
3. Identifique padrões de comportamento
4. Priorize os leads mais promissores
Responda em português brasileiro, seja prático e direto.`,

  orcamento: `Você é um especialista em esquadrias de alumínio do AluFlow. Com base na descrição do projeto:
1. Sugira os tipos de esquadrias adequados
2. Recomende dimensões padrão
3. Estime quantidades
4. Sugira acabamentos e vidros
Responda em português brasileiro com uma lista estruturada de itens para o orçamento.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, context = "assistant" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = SYSTEM_PROMPTS[context] || SYSTEM_PROMPTS.assistant;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns instantes." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados. Adicione créditos na sua conta." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no serviço de IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
