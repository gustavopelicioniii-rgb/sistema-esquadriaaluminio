import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type PlanTier = "basico" | "profissional" | "premium";

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
  basico: "Básico",
  profissional: "Profissional",
  premium: "Premium",
};

export const PLAN_PRICES: Record<PlanTier, number> = {
  basico: 0,
  profissional: 99.90,
  premium: 199.90,
};

export const PLAN_DESCRIPTIONS: Record<PlanTier, string> = {
  basico: "Clientes, orçamentos e configurações básicas",
  profissional: "CRM, produção, cálculos, estoque e agenda",
  premium: "Financeiro, relatórios, mapa, importação e tipologias",
};

export function usePlano() {
  const { user } = useAuth();
  const [plano, setPlano] = useState<PlanTier>("basico");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPlano("basico");
      setIsLoading(false);
      return;
    }

    const fetchPlano = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("assinaturas")
        .select("plano")
        .eq("user_id", user.id)
        .eq("ativo", true)
        .maybeSingle();

      if (!error && data) {
        setPlano(data.plano as PlanTier);
      } else if (!error && !data) {
        // No subscription exists — create a basic one
        await supabase
          .from("assinaturas")
          .insert({ user_id: user.id, plano: "basico", ativo: true } as any);
        setPlano("basico");
      }
      setIsLoading(false);
    };

    fetchPlano();
  }, [user]);

  const hasAccess = (route: string): boolean => {
    const allowedRoutes = PLAN_FEATURES[plano] ?? PLAN_FEATURES.basico;
    // Check exact match or prefix match for dynamic routes
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

  return { plano, isLoading, hasAccess, getRequiredPlan };
}
