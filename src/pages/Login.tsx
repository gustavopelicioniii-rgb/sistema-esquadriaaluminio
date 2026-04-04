import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/use-page-title";
import {
  LogIn, Calculator, ClipboardList, Scissors, BarChart3,
  Package, Users, FileText, Shield, Zap, CheckCircle2,
  ArrowRight, Star,
} from "lucide-react";
import { lovable } from "@/integrations/lovable/index";
import { Separator } from "@/components/ui/separator";
import logoLight from "@/assets/logo-light.jpg";

const features = [
  {
    icon: Calculator,
    title: "Cálculo de Esquadrias",
    desc: "Motor de cálculo automático para perfis, vidros e acessórios com precisão milimétrica.",
  },
  {
    icon: Scissors,
    title: "Plano de Corte Otimizado",
    desc: "Otimização inteligente de barras para reduzir desperdício e economizar material.",
  },
  {
    icon: ClipboardList,
    title: "Orçamentos Profissionais",
    desc: "Gere orçamentos detalhados em PDF com sua marca em poucos cliques.",
  },
  {
    icon: Package,
    title: "Controle de Estoque",
    desc: "Gerencie seu estoque com alertas de mínimo e rastreamento completo.",
  },
  {
    icon: BarChart3,
    title: "Relatórios & Financeiro",
    desc: "Visão completa de receitas, despesas, notas fiscais e desempenho.",
  },
  {
    icon: Users,
    title: "Gestão de Clientes",
    desc: "CRM integrado com histórico de orçamentos, agenda e mapa de clientes.",
  },
];

const stats = [
  { value: "5+", label: "Fabricantes" },
  { value: "90+", label: "Tipologias" },
  { value: "100%", label: "Automático" },
  { value: "0%", label: "Desperdício" },
];

const Login = () => {
  usePageTitle("Login — AluFlow");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Erro no login", description: error.message, variant: "destructive" });
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 app-bg" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/8 blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Nav */}
          <nav className="flex items-center justify-between py-6">
            <div className="flex items-center gap-3">
              <img src={logoLight} alt="AluFlow" className="h-10 object-contain" />
            </div>
            <div className="flex items-center gap-2">
              <Link to="/cadastro">
                <Button variant="ghost" size="sm">Criar conta</Button>
              </Link>
              <a href="#login">
                <Button size="sm" className="gap-1.5">
                  <LogIn className="h-3.5 w-3.5" />
                  Entrar
                </Button>
              </a>
            </div>
          </nav>

          {/* Hero content */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-16 sm:py-24">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Zap className="h-3.5 w-3.5" />
                Sistema completo para vidraçarias
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight">
                Gerencie sua
                <span className="text-primary block">vidraçaria</span>
                com inteligência
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Do orçamento à instalação: calcule esquadrias, otimize cortes, controle estoque e 
                gerencie finanças — tudo em um só lugar.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/cadastro">
                  <Button size="lg" className="gap-2 text-base px-8 w-full sm:w-auto">
                    Começar grátis
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button size="lg" variant="outline" className="text-base px-8 w-full sm:w-auto">
                    Ver funcionalidades
                  </Button>
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 pt-4">
                {stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-2xl sm:text-3xl font-extrabold text-primary">{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Login card */}
            <div id="login" className="scroll-mt-24">
              <div className="p-6 sm:p-8 rounded-2xl border border-border/60 bg-card shadow-xl">
                <div className="text-center space-y-2 mb-6">
                  <h2 className="text-xl font-bold text-foreground">Acesse sua conta</h2>
                  <p className="text-sm text-muted-foreground">Entre para gerenciar sua vidraçaria</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" value={email}
                      onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input id="password" type="password" placeholder="••••••••" value={password}
                      onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <div className="flex justify-end">
                    <Link to="/esqueci-senha" className="text-xs text-muted-foreground hover:text-primary hover:underline">
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <Button type="submit" className="w-full gap-2" disabled={loading}>
                    <LogIn className="h-4 w-4" />
                    {loading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>

                <div className="relative my-5">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">ou</span>
                </div>

                <Button type="button" variant="outline" className="w-full gap-2" disabled={loading}
                  onClick={async () => {
                    setLoading(true);
                    const result = await lovable.auth.signInWithOAuth("google", {
                      redirect_uri: window.location.origin,
                    });
                    if (result.error) {
                      toast({ title: "Erro ao entrar com Google", description: String(result.error), variant: "destructive" });
                      setLoading(false);
                      return;
                    }
                    if (result.redirected) return;
                    navigate("/");
                  }}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Entrar com Google
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-5">
                  Não tem conta?{" "}
                  <Link to="/cadastro" className="text-primary font-semibold hover:underline">
                    Cadastre-se grátis
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-20 sm:py-28 scroll-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Star className="h-3.5 w-3.5" />
              Funcionalidades
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Tudo que sua vidraçaria precisa
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Ferramentas profissionais para otimizar cada etapa do seu negócio, 
              do primeiro contato com o cliente até a entrega final.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-2xl border border-border/50 bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="py-20 sm:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                Por que escolher o AluFlow?
              </h2>
              <div className="space-y-5">
                {[
                  "Cálculos automáticos com precisão milimétrica para todas as tipologias",
                  "Otimização de barras que reduz desperdício em até 30%",
                  "Orçamentos profissionais prontos em minutos, não horas",
                  "Controle financeiro completo com notas fiscais integradas",
                  "Agenda e mapa de clientes para organizar instalações",
                  "Suporte a 5+ fabricantes e 90+ tipologias de esquadrias",
                ].map((benefit) => (
                  <div key={benefit} className="flex gap-3 items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <p className="text-foreground">{benefit}</p>
                  </div>
                ))}
              </div>
              <Link to="/cadastro">
                <Button size="lg" className="gap-2 mt-4">
                  Criar conta gratuita
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, title: "Seguro", desc: "Dados protegidos com criptografia" },
                { icon: Zap, title: "Rápido", desc: "Resultados em segundos" },
                { icon: FileText, title: "PDFs", desc: "Documentos profissionais automáticos" },
                { icon: Users, title: "Multi-usuário", desc: "Acesso para toda a equipe" },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-2xl border border-border/50 bg-card text-center space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mx-auto">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-foreground">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            Pronto para transformar sua vidraçaria?
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Junte-se a vidraçarias que já otimizaram seus processos com o AluFlow. 
            Comece gratuitamente — sem cartão de crédito.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/cadastro">
              <Button size="lg" className="gap-2 text-base px-10 w-full sm:w-auto">
                Começar agora
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#login">
              <Button size="lg" variant="outline" className="text-base px-10 w-full sm:w-auto">
                Já tenho conta
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logoLight} alt="AluFlow" className="h-7 object-contain" />
            <span className="text-xs text-muted-foreground">— Gestão Inteligente de Esquadrias</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AluFlow. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
