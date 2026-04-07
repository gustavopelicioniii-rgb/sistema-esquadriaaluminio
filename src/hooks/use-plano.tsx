import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { BILLING_ENABLED } from "@/lib/billing";

export type PlanTier = "basico" | "profissional" | "premium";

// Stripe product/price mapping
export const STRIPE_TIERS = {
  profissional: {
    product_id: "prod_UHxh0xuKj0hnIy",
    price_id: "price_1TJNlqHEW9ELxlXGLT0Aishl",
  },
  premium: {
    product_id: "prod_UHxiUmZE42zDOa",
    price_id: "price_1TJNmvHEW9ELxlXGUCGzI9Gb",
  },
} as const;

// Define which routes each plan can access
const PLAN_FEATURES: Record<PlanTier, string[]> = {
  basico: [
    "/",
    "/clientes",
    "/orcamentos",
    "/orcamentos/novo",
    "/orcamentos/editar",
    "/configuracoes",
    "/notificacoes",
    "/planos",
  ],
  profissional: [
    "/",
    "/clientes",
    "/orcamentos",
    "/orcamentos/novo",
    "/orcamentos/editar",
    "/configuracoes",
    "/notificacoes",
    "/planos",
    "/crm",
    "/producao",
    "/calculo-esquadrias",
    "/relacao-materiais",
    "/plano-corte",
    "/projeto-vidro",
    "/agenda",
    "/produtos",
    "/preco-itens",
    "/estoque",
  ],
  premium: [
    "/",
    "/clientes",
    "/orcamentos",
    "/orcamentos/novo",
    "/orcamentos/editar",
    "/configuracoes",
    "/notificacoes",
    "/planos",
    "/crm",
    "/producao",
    "/calculo-esquadrias",
    "/relacao-materiais",
    "/plano-corte",
    "/projeto-vidro",
    "/agenda",
    "/produtos",
    "/preco-itens",
    "/estoque",
    "/financeiro",
    "/nota-fiscal",
    "/relatorios",
    "/mapa",
    "/importar-csv",
    "/tipologias",
    "/funcionarios",
    "/administradores",
  ],
};

export const PLAN_LABELS: Record<PlanTier, string> = {
  basico: "Teste",
  profissional: "Profissional",
  premium: "Premium",
};

export const PLAN_PRICES: Record<PlanTier, number> = {
  basico: 0,
  profissional: 99.90,
  premium: 199.90,
};

export const PLAN_DESCRIPTIONS: Record<PlanTier, string> = {
  basico: "Teste gratuito de 10 dias com clientes, orçamentos e configurações",
  profissional: "CRM, produção, cálculos, estoque e agenda",
  premium: "Financeiro, relatórios, mapa, importação e tipologias",
};

function productIdToTier(productId: string | null): PlanTier {
  if (productId === STRIPE_TIERS.premium.product_id) return "premium";
  if (productId === STRIPE_TIERS.profissional.product_id) return "profissional";
  return "basico";
}

export function usePlano() {
  const { user, role } = useAuth();
  const [plano, setPlano] = useState<PlanTier>("basico");
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setPlano("basico");
      setIsLoading(false);
      return;
    }

    if (!BILLING_ENABLED) {
      setIsLoading(true);
      try {
        await fallbackToDb();
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke("check-subscription");

      if (error) {
        console.error("Error checking subscription:", error);
        // Fallback to DB-based plan
        await fallbackToDb();
        return;
      }

      if (data?.subscribed && data?.product_id) {
        const tier = productIdToTier(data.product_id);
        setPlano(tier);
        setSubscriptionEnd(data.subscription_end);

        // Sync to DB
        await syncPlanToDb(tier);
      } else {
        // No Stripe subscription — check DB
        await fallbackToDb();
      }
    } catch {
      await fallbackToDb();
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fallbackToDb = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("assinaturas")
      .select("plano")
      .eq("user_id", user.id)
      .eq("ativo", true)
      .maybeSingle();

    if (!error && data) {
      setPlano(data.plano as PlanTier);
    } else if (!error && !data) {
      await supabase
        .from("assinaturas")
        .insert({ user_id: user.id, plano: "basico", ativo: true } as any);
      setPlano("basico");
    }
  };

  const syncPlanToDb = async (tier: PlanTier) => {
    if (!user) return;
    // Deactivate old, insert new
    await supabase
      .from("assinaturas")
      .update({ ativo: false } as any)
      .eq("user_id", user.id)
      .eq("ativo", true);
    await supabase
      .from("assinaturas")
      .insert({ user_id: user.id, plano: tier, ativo: true } as any);
  };

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  // Auto-refresh every 60s
  useEffect(() => {
    if (!user || !BILLING_ENABLED) return;
    const interval = setInterval(checkSubscription, 60_000);
    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  const isAdmin = role === "admin";

  const hasAccess = (route: string): boolean => {
    if (isAdmin) return true;
    const allowedRoutes = PLAN_FEATURES[plano] ?? PLAN_FEATURES.basico;
    return allowedRoutes.some(
      (r) => route === r || (r !== "/" && route.startsWith(r))
    );
  };

  const getRequiredPlan = (route: string): PlanTier | null => {
    const tiers: PlanTier[] = ["basico", "profissional", "premium"];
    for (const tier of tiers) {
      const routes = PLAN_FEATURES[tier];
      if (routes.some((r) => route === r || (r !== "/" && route.startsWith(r)))) {
        return tier;
      }
    }
    return null;
  };

  return { plano, isLoading, hasAccess, getRequiredPlan, subscriptionEnd, refreshSubscription: checkSubscription, isAdmin };
}
