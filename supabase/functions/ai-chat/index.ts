import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple in-memory rate limiter (resets on cold start)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute in ms

function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(identifier, { count: 1, resetAt: now + RATE_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT - 1, resetAt: now + RATE_WINDOW };
  }

  if (record.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT - record.count, resetAt: record.resetAt };
}

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

  // Rate limiting
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0] || "anonymous";
  const rateLimit = checkRateLimit(clientIp);

  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({
        error: "Limite de requisições excedido",
        message: `Você excedeu o limite de ${RATE_LIMIT} requisições por minuto. Tente novamente em alguns instantes.`,
        retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "X-RateLimit-Limit": String(RATE_LIMIT),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
          "X-RateLimit-Reset": String(rateLimit.resetAt),
        },
      }
    );
  }

  try {
    const { messages, context = "assistant" } = await req.json();
    
    // Get AI API key from environment (supports OpenAI, MiniMax, or any OpenAI-compatible API)
    const AI_API_KEY = Deno.env.get("AI_API_KEY") || Deno.env.get("OPENAI_API_KEY");
    const AI_ENDPOINT = Deno.env.get("AI_ENDPOINT") || "https://api.openai.com/v1/chat/completions";
    
    if (!AI_API_KEY) {
      // Return a friendly message when AI is not configured
      return new Response(
        JSON.stringify({ 
          error: "IA não configurada",
          message: "O recurso de IA não está disponível no momento. Configure a variável AI_API_KEY nas Edge Functions do Supabase.",
          suggestion: "Você pode usar OpenAI, MiniMax, ou qualquer API compatível com OpenAI."
        }), {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const systemPrompt = SYSTEM_PROMPTS[context] || SYSTEM_PROMPTS.assistant;

    const response = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("AI API error:", response.status, errorData);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns instantes." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: `Erro do serviço de IA: ${response.status}` }), {
        status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("AI function error:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
