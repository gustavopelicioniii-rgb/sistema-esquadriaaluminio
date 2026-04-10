import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { usePageTitle } from "@/hooks/use-page-title";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const EsqueciSenha = () => {
  usePageTitle("Esqueci a Senha");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error("Erro", { description: error.message });
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Mail className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Recuperar Senha</CardTitle>
          <CardDescription>
            {sent
              ? "E-mail enviado! Verifique sua caixa de entrada."
              : "Digite seu e-mail para receber o link de redefinição"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.
              </p>
              <Link to="/login">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Voltar ao login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <form onSubmit={handleReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  <Mail className="h-4 w-4" />
                  {loading ? "Enviando..." : "Enviar link de recuperação"}
                </Button>
              </form>
              <p className="text-center text-sm text-muted-foreground mt-4">
                <Link to="/login" className="text-primary font-medium hover:underline">Voltar ao login</Link>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EsqueciSenha;
