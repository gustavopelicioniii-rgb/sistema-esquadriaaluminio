import { useEffect, useState } from "react";
import { Check, Crown, Rocket, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { usePlano, PlanTier, PLAN_LABELS, PLAN_PRICES, PLAN_DESCRIPTIONS, STRIPE_TIERS } from "@/hooks/use-plano";
import { useSearchParams, useLocation } from "react-router-dom";
import { BILLING_DISABLED_MESSAGE, BILLING_ENABLED } from "@/lib/billing";

const PLAN_ICONS: Record<PlanTier, React.ReactNode> = {
  basico: <Sparkles className="h-6 w-6" />,
  profissional: <Rocket className="h-6 w-6" />,
  premium: <Crown className="h-6 w-6" />,
};

const PLAN_FEATURES_LIST: Record<PlanTier, string[]> = {
  basico: [
    "10 dias grátis",
    "Dashboard",
    "Cadastro de clientes",
    "Orçamentos (criar/editar)",
    "Configurações",
    "Notificações",
  ],
  profissional: [
    "Tudo do Basico +",
    "CRM e Leads",
    "Producao e Servicos",
    "Calculo de Esquadrias",
    "Relacao de Materiais",
    "Plano de Corte",
    "Projeto de Vidro",
    "Agenda",
    "Produtos e Precos",
    "Estoque",
  ],
  premium: [
    "Tudo do Profissional +",
    "Financeiro completo",
    "Nota Fiscal",
    "Relatorios avancados",
    "Mapa de clientes",
    "Importar Planilhas",
    "Tipologias customizadas",
    "Suporte prioritario",
  ],
};

const PLAN_COLORS: Record<PlanTier, string> = {
  basico: "from-muted to-muted/80",
  profissional: "from-primary to-primary/80",
  premium: "from-amber-500 to-yellow-400",
};

const Planos = () => {
  const { user } = useAuth();
  const { plano: currentPlan, isLoading, subscriptionEnd, refreshSubscription } = usePlano();
  const [checkingOut, setCheckingOut] = useState<PlanTier | null>(null);
  const [managingPortal, setManagingPortal] = useState(false);
  const [searchParams] = useSearchParams();
  const billingDisabled = !BILLING_ENABLED;

  // Handle return from Stripe
  useEffect(() => {
    if (!BILLING_ENABLED) return;

    if (searchParams.get("success") === "true") {
      toast({ title: "Pagamento realizado com sucesso!", description: "Seu plano foi atualizado." });
      refreshSubscription();
    } else if (searchParams.get("canceled") === "true") {
      toast({ title: "Pagamento cancelado", variant: "destructive" });
    }
  }, [searchParams, refreshSubscription]);

  const handleCheckout = async (tier: PlanTier) => {
    if (!user || tier === "basico") return;

    if (!BILLING_ENABLED) {
      toast({ title: "Stripe temporariamente desativado", description: BILLING_DISABLED_MESSAGE });
      return;
    }

    const stripeInfo = STRIPE_TIERS[tier as keyof typeof STRIPE_TIERS];
    if (!stripeInfo) return;

    setCheckingOut(tier);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: stripeInfo.price_id },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch {
      toast({ title: "Erro ao iniciar checkout", variant: "destructive" });
    } finally {
      setCheckingOut(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!BILLING_ENABLED) {
      toast({ title: "Stripe temporariamente desativado", description: BILLING_DISABLED_MESSAGE });
      return;
    }

    setManagingPortal(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch {
      toast({ title: "Erro ao abrir portal", description: "Voce precisa ter uma assinatura ativa.", variant: "destructive" });
    } finally {
      setManagingPortal(false);
    }
  };

  const tiers: PlanTier[] = ["basico", "profissional", "premium"];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Planos e Assinatura</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Escolha o plano ideal para o seu negocio
        </p>
        {currentPlan !== "basico" && subscriptionEnd && (
          <p className="text-xs text-muted-foreground mt-2">
            Assinatura ativa ate {new Date(subscriptionEnd).toLocaleDateString("pt-BR")}
          </p>
        )}
      </div>

      {billingDisabled && (
        <Card className="mx-auto max-w-3xl border-border/60 bg-muted/30">
          <CardContent className="pt-6 text-center text-sm text-muted-foreground">
            {BILLING_DISABLED_MESSAGE}
          </CardContent>
        </Card>
      )}

      {currentPlan !== "basico" && !billingDisabled && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleManageSubscription}
            disabled={managingPortal}
          >
            <ExternalLink className="h-4 w-4" />
            {managingPortal ? "Abrindo..." : "Gerenciar assinatura"}
          </Button>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {tiers.map((tier) => {
          const isCurrent = tier === currentPlan;
          const isPremium = tier === "premium";
          const isBasico = tier === "basico";
          const isCheckingOut = checkingOut === tier;

          return (
            <Card
              key={tier}
              className={`relative flex flex-col transition-all ${
                isCurrent ? "ring-2 ring-primary shadow-lg scale-[1.02]" : "hover:shadow-md"
              } ${isPremium ? "border-amber-400/50" : ""}`}
            >
              {isCurrent && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  Plano Atual
                </Badge>
              )}
              {isPremium && !isCurrent && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-400 text-white border-0">
                  Mais Popular
                </Badge>
              )}

              <CardHeader className="text-center pb-2">
                <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${PLAN_COLORS[tier]} text-white mb-2`}>
                  {PLAN_ICONS[tier]}
                </div>
                <CardTitle className="text-lg">{PLAN_LABELS[tier]}</CardTitle>
                <CardDescription className="text-xs">{PLAN_DESCRIPTIONS[tier]}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="text-center mb-4">
                  <span className="text-3xl font-extrabold blur-md select-none">
                    {PLAN_PRICES[tier] === 0 ? "Grátis por 10 dias" : `R$ ${PLAN_PRICES[tier].toFixed(2).replace(".", ",")}`}
                  </span>
                  {PLAN_PRICES[tier] > 0 && (
                    <span className="text-muted-foreground text-sm blur-md select-none">/mes</span>
                  )}
                </div>
                <ul className="space-y-2">
                  {PLAN_FEATURES_LIST[tier].map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={isCurrent ? "outline" : isPremium ? "default" : "secondary"}
                  disabled={billingDisabled || isCurrent || isCheckingOut || isLoading || isBasico}
                  onClick={() => handleCheckout(tier)}
                >
                  {billingDisabled
                    ? "Temporariamente indisponivel"
                    : isCurrent
                    ? "Plano atual"
                    : isBasico
                    ? "Período de teste"
                    : isCheckingOut
                    ? "Redirecionando..."
                    : "Assinar agora"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Planos;
