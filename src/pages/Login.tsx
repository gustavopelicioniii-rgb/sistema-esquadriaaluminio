import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePageTitle } from "@/hooks/use-page-title";
import {
  LogIn, Calculator, ClipboardList, Scissors, BarChart3,
  Package, Users, FileText, Shield, Zap, CheckCircle2,
  ArrowRight, Star, Eye, EyeOff, Sparkles, TrendingUp,
  Layers, ChevronRight,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import logoLight from "@/assets/aluflow-logo.png";
import { toast } from "sonner";

const features = [
  {
    icon: Calculator,
    title: "Cálculo de Esquadrias",
    desc: "Motor de cálculo automático com precisão milimétrica para perfis, vidros e acessórios.",
  },
  {
    icon: Scissors,
    title: "Plano de Corte Otimizado",
    desc: "Otimização inteligente que reduz desperdício de barras em até 30%.",
  },
  {
    icon: ClipboardList,
    title: "Orçamentos Profissionais",
    desc: "Gere PDFs detalhados com sua marca em poucos cliques.",
  },
  {
    icon: Package,
    title: "Controle de Estoque",
    desc: "Alertas de mínimo, rastreamento completo e gestão visual.",
  },
  {
    icon: BarChart3,
    title: "Relatórios & Financeiro",
    desc: "Visão completa de receitas, despesas e desempenho.",
  },
  {
    icon: Users,
    title: "Gestão de Clientes",
    desc: "CRM integrado com histórico, agenda e mapa de clientes.",
  },
];

const stats = [
  { value: "5+", label: "Fabricantes", icon: Layers },
  { value: "90+", label: "Tipologias", icon: Sparkles },
  { value: "100%", label: "Automático", icon: Zap },
  { value: "30%", label: "Menos desperdício", icon: TrendingUp },
];

const Login = () => {
  usePageTitle("Login — AluFlow");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Erro no login", { description: error.message });
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden min-h-screen">
        {/* Animated background elements */}
        <div className="absolute inset-0 app-bg" />
        <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-primary/[0.07] blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/[0.05] blur-[80px]" />
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-primary/[0.03] blur-[60px]" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col">
          {/* Nav */}
          <nav className="flex items-center justify-between py-5 z-10">
            <div className="flex items-center gap-3">
              <img src={logoLight} alt="AluFlow" className="h-9 object-contain" />
            </div>
            <div className="flex items-center gap-2">
              <Link to="/cadastro">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Criar conta
                </Button>
              </Link>
              <a href="#login">
                <Button size="sm" className="gap-1.5 shadow-lg shadow-primary/20">
                  <LogIn className="h-3.5 w-3.5" />
                  Entrar
                </Button>
              </a>
            </div>
          </nav>

          {/* Hero content */}
          <div className="flex-1 grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-20 items-center py-10 sm:py-16">
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">Sistema completo para vidraçarias</span>
              </div>

              {/* Headline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-foreground leading-[1.08] tracking-tight">
                  Gerencie sua{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 text-primary">vidraçaria</span>
                    <span className="absolute -bottom-1 left-0 right-0 h-3 bg-primary/10 rounded-sm -skew-x-3" />
                  </span>
                  <br />
                  com inteligência
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed">
                  Do orçamento à instalação — calcule esquadrias, otimize cortes, controle estoque e
                  gerencie finanças em um só lugar.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/cadastro">
                  <Button size="lg" className="gap-2 text-base px-8 w-full sm:w-auto shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                    Começar grátis
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button size="lg" variant="outline" className="text-base px-8 w-full sm:w-auto backdrop-blur-sm">
                    Ver funcionalidades
                  </Button>
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                {stats.map((s) => (
                  <div key={s.label} className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <s.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-lg font-extrabold text-foreground leading-none">{s.value}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Login card */}
            <div id="login" className="scroll-mt-24 w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <div className="relative">
                {/* Card glow */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-xl" />

                <div className="relative p-6 sm:p-8 rounded-2xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/5">
                  {/* Card header */}
                  <div className="text-center space-y-1.5 mb-7">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <LogIn className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Acesse sua conta</h2>
                    <p className="text-sm text-muted-foreground">Entre para gerenciar sua vidraçaria</p>
                  </div>

                  {/* Google button first */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2.5 h-11 font-medium border-border/60 hover:bg-muted/50 transition-all"
                    disabled={loading}
                    onClick={async () => {
                      setLoading(true);
                      const { error } = await supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                          redirectTo: window.location.origin,
                        },
                      });
                      if (error) {
                        toast.error("Erro ao entrar com Google", { description: error.message });
                        setLoading(false);
                      }
                    }}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continuar com Google
                  </Button>

                  {/* Divider */}
                  <div className="relative my-6">
                    <Separator className="bg-border/60" />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground font-medium">
                      ou entre com e-mail
                    </span>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-11 bg-muted/30 border-border/50 focus:bg-background transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">Senha</Label>
                        <Link to="/esqueci-senha" className="text-xs text-primary/80 hover:text-primary hover:underline transition-colors">
                          Esqueceu a senha?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="h-11 bg-muted/30 border-border/50 focus:bg-background transition-colors pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full gap-2 h-11 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Entrando...
                        </span>
                      ) : (
                        <>
                          Entrar
                          <ChevronRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>

                  <p className="text-center text-sm text-muted-foreground mt-6">
                    Não tem conta?{" "}
                    <Link to="/cadastro" className="text-primary font-semibold hover:underline">
                      Cadastre-se grátis
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-20 sm:py-28 scroll-mt-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5">
              <Star className="h-3.5 w-3.5 text-primary" />
              <span className="text-sm font-medium text-primary">Funcionalidades</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Tudo que sua vidraçaria precisa
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Ferramentas profissionais para otimizar cada etapa do seu negócio.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group relative p-6 rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500 hover:-translate-y-1"
              >
                {/* Number watermark */}
                <span className="absolute top-4 right-5 text-5xl font-black text-foreground/[0.03] select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/25 transition-all duration-300">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                  Por que escolher o{" "}
                  <span className="text-primary">AluFlow</span>?
                </h2>
                <p className="text-muted-foreground text-base">
                  Simplifique processos, reduza desperdício e aumente a produtividade.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  "Cálculos automáticos com precisão milimétrica para todas as tipologias",
                  "Otimização de barras que reduz desperdício em até 30%",
                  "Orçamentos profissionais prontos em minutos, não horas",
                  "Controle financeiro completo com notas fiscais integradas",
                  "Agenda e mapa de clientes para organizar instalações",
                  "Suporte a 5+ fabricantes e 90+ tipologias de esquadrias",
                ].map((benefit) => (
                  <div key={benefit} className="flex gap-3 items-start group">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5 group-hover:bg-primary/20 transition-colors">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <p className="text-foreground text-sm leading-relaxed">{benefit}</p>
                  </div>
                ))}
              </div>
              <Link to="/cadastro">
                <Button size="lg" className="gap-2 mt-2 shadow-lg shadow-primary/20">
                  Criar conta gratuita
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, title: "Seguro", desc: "Dados protegidos com criptografia de ponta" },
                { icon: Zap, title: "Rápido", desc: "Resultados em segundos, não minutos" },
                { icon: FileText, title: "PDFs", desc: "Documentos profissionais automáticos" },
                { icon: Users, title: "Multi-usuário", desc: "Acesso para toda a equipe" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="group p-6 rounded-2xl border border-border/40 bg-card/80 hover:shadow-lg hover:border-primary/20 transition-all duration-300 space-y-3"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-foreground">{item.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-primary/[0.02]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-[80px]" />
        <div className="relative max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            Pronto para transformar{" "}
            <span className="text-primary">sua vidraçaria</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Junte-se a vidraçarias que já otimizaram seus processos com o AluFlow.
            Comece gratuitamente — sem cartão de crédito.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link to="/cadastro">
              <Button size="lg" className="gap-2 text-base px-10 w-full sm:w-auto shadow-xl shadow-primary/25">
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
      <footer className="border-t border-border/40 py-8">
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
