import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePageTitle } from '@/hooks/use-page-title';
import { UserPlus, CheckCircle2, Shield, Zap, Calculator, ArrowLeft } from 'lucide-react';
import logoLight from '@/assets/aluflow-logo.png';
import { toast } from 'sonner';

const benefits = [
  'Cálculo automático de esquadrias com precisão milimétrica',
  'Plano de corte otimizado para reduzir desperdício',
  'Orçamentos profissionais em PDF em poucos cliques',
  'Controle completo de estoque, financeiro e clientes',
  'Suporte a 5+ fabricantes e 90+ tipologias',
  'Acesso para toda a equipe — administradores e funcionários',
];

const Cadastro = () => {
  usePageTitle('Cadastro — AluFlow');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Senhas não coincidem');
      return;
    }
    if (password.length < 6) {
      toast.error('Senha deve ter pelo menos 6 caracteres');
      return;
    }
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });

    if (error) {
      setLoading(false);
      toast.error('Erro no cadastro', { description: error.message });
      return;
    }

    // If signup successful, create user_roles and assinaturas records
    if (data.user) {
      // Check if user_roles already exists for this user
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', data.user.id)
        .single();

      if (!existingRole) {
        // Get current user count to determine role
        const { count } = await supabase
          .from('user_roles')
          .select('*', { count: 'exact', head: true });

        const role = (count ?? 0) === 0 ? 'admin' : 'funcionario';

        // Insert user_roles
        const { error: roleError } = await supabase.from('user_roles').insert({
          user_id: data.user.id,
          role: role,
        });
        if (roleError) {
          setLoading(false);
          toast.error('Erro', { description: roleError.message });
          return;
        }

        // Insert assinatura
        const { error: assError } = await supabase.from('assinaturas').insert({
          user_id: data.user.id,
          plano: 'basico',
          ativo: true,
        });
        if (assError) {
          setLoading(false);
          toast.error('Erro', { description: assError.message });
          return;
        }
      }
    }

    setLoading(false);
    toast.success('Conta criada!', {
      description: 'Verifique seu e-mail para confirmar o cadastro.',
    });
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 app-bg" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl -translate-y-1/2 -translate-x-1/3" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/8 blur-3xl translate-y-1/2 translate-x-1/3" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between py-6">
          <Link to="/login" className="flex items-center gap-3">
            <img src={logoLight} alt="AluFlow" className="h-10 object-contain" />
          </Link>
          <Link to="/login">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar ao login
            </Button>
          </Link>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center py-12 sm:py-20">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Zap className="h-3.5 w-3.5" />
                Comece gratuitamente
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-[1.1] tracking-tight">
                Crie sua conta e<span className="text-primary block">transforme seu negócio</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                Tenha acesso a todas as ferramentas que sua vidraçaria precisa para crescer.
              </p>
            </div>

            <div className="space-y-4">
              {benefits.map(benefit => (
                <div key={benefit} className="flex gap-3 items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-foreground text-sm sm:text-base">{benefit}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-6 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                Dados seguros
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calculator className="h-4 w-4 text-primary" />
                Sem cartão de crédito
              </div>
            </div>
          </div>

          <div>
            <div className="p-6 sm:p-8 rounded-2xl border border-border/60 bg-card shadow-xl">
              <div className="text-center space-y-2 mb-6">
                <h2 className="text-xl font-bold text-foreground">Criar sua conta</h2>
                <p className="text-sm text-muted-foreground">
                  Preencha os dados abaixo para começar
                </p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repita sua senha"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full gap-2 mt-2" disabled={loading}>
                  <UserPlus className="h-4 w-4" />
                  {loading ? 'Cadastrando...' : 'Criar conta gratuita'}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-5">
                Já tem conta?{' '}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Fazer login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
