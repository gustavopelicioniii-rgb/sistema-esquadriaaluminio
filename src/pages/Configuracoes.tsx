import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/use-page-title";
import { supabase } from "@/integrations/supabase/client";

const defaultConfig: Record<string, string> = {
  nome: "AlumPRO Esquadrias",
  cnpj: "12.345.678/0001-90",
  telefone: "(11) 3456-7890",
  email: "contato@alumpro.com",
  margem: "35",
  descontoMax: "15",
};

const Configuracoes = () => {
  usePageTitle("Configurações");
  const [config, setConfig] = useState<Record<string, string>>(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("configuracoes").select("chave, valor");
      if (data && data.length > 0) {
        const map: Record<string, string> = {};
        data.forEach((r) => { map[r.chave] = r.valor; });
        setConfig((prev) => ({ ...prev, ...map }));
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const update = (key: string, value: string) => setConfig((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    for (const [chave, valor] of Object.entries(config)) {
      await supabase.from("configuracoes").upsert({ chave, valor }, { onConflict: "chave" });
    }
    toast({ title: "Configurações salvas", description: "Suas alterações foram salvas no banco de dados." });
  };

  if (loading) return <div className="p-6 text-muted-foreground">Carregando...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground text-sm">Gerencie as configurações do sistema</p>
      </div>

      <Card className="shadow-sm border-border/50">
        <CardHeader><CardTitle className="text-base">Dados da Empresa</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Nome da Empresa</Label><Input value={config.nome} onChange={(e) => update("nome", e.target.value)} /></div>
            <div className="space-y-2"><Label>CNPJ</Label><Input value={config.cnpj} onChange={(e) => update("cnpj", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Telefone</Label><Input value={config.telefone} onChange={(e) => update("telefone", e.target.value)} /></div>
            <div className="space-y-2"><Label>E-mail</Label><Input value={config.email} onChange={(e) => update("email", e.target.value)} /></div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border/50">
        <CardHeader><CardTitle className="text-base">Margem Padrão</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Margem de Lucro (%)</Label><Input type="number" value={config.margem} onChange={(e) => update("margem", e.target.value)} /></div>
            <div className="space-y-2"><Label>Desconto Máximo (%)</Label><Input type="number" value={config.descontoMax} onChange={(e) => update("descontoMax", e.target.value)} /></div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave}>Salvar Configurações</Button>
    </div>
  );
};

export default Configuracoes;
