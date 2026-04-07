import { useState } from "react";
import { Check, Crown, Rocket, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { usePlano, PlanTier, PLAN_LABELS, PLAN_PRICES, PLAN_DESCRIPTIONS } from "@/hooks/use-plano";

const PLAN_ICONS: Record<PlanTier, React.ReactNode> = {
  basico: <Sparkles className="h-6 w-6" />,
  profissional: <Rocket className="h-6 w-6" />,
  premium: <Crown className="h-6 w-6" />,
};

const PLAN_FEATURES_LIST: Record<PlanTier, string[]> = {
  basico: [
    "Dashboard",
    "Cadastro de clientes",
    "Orcamentos (criar/editar)",
    "Configuracoes",
    "Notificacoes",
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
  const { plano: currentPlan, isLoading } = usePlano();
  const [upgrading, setUpgrading] = useState(false);

  const handleSelectPlan = async (tier: PlanTier) => {
    if (!user || tier === currentPlan) return;

    setUpgrading(true);
    try {
      // Deactivate current plan
      await supabase
        .from("assinaturas")
        .update({ ativo: false } as any)
        .eq("user_id", user.id)
        .eq("ativo", true);

      // Create new subscription
      await supabase
        .from("assinaturas")
        .insert({ user_id: user.id, plano: tier, ativo: true } as any);

      toast({ title: `Plano alterado para ${PLAN_LABELS[tier]}!`, description: "As novas funcoes ja estao disponiveis." });
      // Reload to refresh plan state
      window.location.reload();
    } catch {
      toast({ title: "Erro ao alterar plano", variant: "destructive" });
    } finally {
      setUpgrading(false);
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
      </div>

      <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {tiers.map((tier) => {
          const isCurrent = tier === currentPlan;
          const isPremium = tier === "premium";

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
                  <span className="text-3xl font-extrabold">
                    {PLAN_PRICES[tier] === 0 ? "Gratis" : `R$ ${PLAN_PRICES[tier].toFixed(2).replace(".", ",")}`}
                  </span>
                  {PLAN_PRICES[tier] > 0 && (
                    <span className="text-muted-foreground text-sm">/mes</span>
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
                  disabled={isCurrent || upgrading || isLoading}
                  onClick={() => handleSelectPlan(tier)}
                >
                  {isCurrent ? "Plano atual" : upgrading ? "Alterando..." : "Selecionar plano"}
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
