import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/use-page-title";
import { supabase } from "@/integrations/supabase/client";
import { Save, Settings2, RotateCcw } from "lucide-react";

const defaultConfig: Record<string, string> = {
  nome: "AlumPRO Esquadrias",
  cnpj: "12.345.678/0001-90",
  telefone: "(11) 3456-7890",
  email: "contato@alumpro.com",
  margem: "35",
  descontoMax: "15",
};

const defaultFolgas = {
  perfil_offset: 0,
  vidro_largura_offset: 0,
  vidro_altura_offset: 0,
};

const Configuracoes = () => {
  usePageTitle("Configurações");
  const [config, setConfig] = useState<Record<string, string>>(defaultConfig);
  const [folgas, setFolgas] = useState(defaultFolgas);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const { data } = await supabase.from("configuracoes").select("chave, valor");
      if (data && data.length > 0) {
        const map: Record<string, string> = {};
        data.forEach((r) => { map[r.chave] = r.valor; });
        setConfig((prev) => ({ ...prev, ...map }));

        // Load global folgas
        if (map.folgas_global) {
          try {
            const parsed = JSON.parse(map.folgas_global);
            setFolgas((prev) => ({ ...prev, ...parsed }));
          } catch { /* ignore */ }
        }
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  const update = (key: string, value: string) => setConfig((prev) => ({ ...prev, [key]: value }));

  const updateFolga = (key: keyof typeof defaultFolgas, value: number) =>
    setFolgas((prev) => ({ ...prev, [key]: value }));

  const resetFolgas = () => setFolgas(defaultFolgas);

  const handleSave = async () => {
    // Save config entries
    for (const [chave, valor] of Object.entries(config)) {
      if (chave === "folgas_global") continue;
      await supabase.from("configuracoes").upsert({ chave, valor }, { onConflict: "chave" });
    }
    // Save global folgas
    const folgasPayload = JSON.stringify(folgas);
    const { data: existing } = await supabase.from("configuracoes").select("id").eq("chave", "folgas_global").maybeSingle();
    if (existing) {
      await supabase.from("configuracoes").update({ valor: folgasPayload }).eq("chave", "folgas_global");
    } else {
      await supabase.from("configuracoes").insert({ chave: "folgas_global", valor: folgasPayload });
    }
    toast({ title: "Configurações salvas", description: "Suas alterações foram salvas." });
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

      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Folgas Padrão (Global)</CardTitle>
            </div>
            <Button variant="ghost" size="sm" className="text-xs gap-1.5" onClick={resetFolgas}>
              <RotateCcw className="h-3 w-3" /> Zerar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Defina ajustes globais de folga em milímetros. Esses valores serão somados às folgas do catálogo em todos os novos planos de corte. 
            Valores negativos = menos desconto (peça maior), positivos = mais desconto (peça menor).
          </p>

          <Separator />

          <div>
            <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3">Perfis</h4>
            <div className="space-y-2">
              <Label className="text-sm">Ajuste de folga nos perfis (mm)</Label>
              <Input
                type="number"
                className="max-w-[200px]"
                value={folgas.perfil_offset}
                onChange={(e) => updateFolga("perfil_offset", Number(e.target.value))}
              />
              <p className="text-[11px] text-muted-foreground">
                Ex: valor <strong>+2</strong> aumenta o desconto de todos os perfis em 2mm. Valor <strong>-3</strong> reduz o desconto em 3mm.
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3">Vidros</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Ajuste de folga na largura (mm)</Label>
                <Input
                  type="number"
                  value={folgas.vidro_largura_offset}
                  onChange={(e) => updateFolga("vidro_largura_offset", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Ajuste de folga na altura (mm)</Label>
                <Input
                  type="number"
                  value={folgas.vidro_altura_offset}
                  onChange={(e) => updateFolga("vidro_altura_offset", Number(e.target.value))}
                />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Esses valores são somados às constantes de largura e altura de cada vidro no catálogo.
            </p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="gap-2">
        <Save className="h-4 w-4" /> Salvar Configurações
      </Button>
    </div>
  );
};

export default Configuracoes;
