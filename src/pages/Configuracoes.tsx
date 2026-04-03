import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/use-page-title";

const initialConfig = {
  nome: "AlumPRO Esquadrias",
  cnpj: "12.345.678/0001-90",
  telefone: "(11) 3456-7890",
  email: "contato@alumpro.com",
  margem: 35,
  descontoMax: 15,
};

const Configuracoes = () => {
  usePageTitle("Configurações");
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem("alumpro-config");
    return saved ? JSON.parse(saved) : initialConfig;
  });

  const update = (field: string, value: string | number) =>
    setConfig((prev: typeof config) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    localStorage.setItem("alumpro-config", JSON.stringify(config));
    toast({ title: "Configurações salvas", description: "Suas alterações foram salvas com sucesso." });
  };

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
            <div className="space-y-2"><Label>Margem de Lucro (%)</Label><Input type="number" value={config.margem} onChange={(e) => update("margem", Number(e.target.value))} /></div>
            <div className="space-y-2"><Label>Desconto Máximo (%)</Label><Input type="number" value={config.descontoMax} onChange={(e) => update("descontoMax", Number(e.target.value))} /></div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave}>Salvar Configurações</Button>
    </div>
  );
};

export default Configuracoes;
