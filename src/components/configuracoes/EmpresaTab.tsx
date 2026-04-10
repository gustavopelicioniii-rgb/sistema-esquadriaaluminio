import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Save, Settings2, RotateCcw, Building2, Upload, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

interface EmpresaTabProps {
  config: Record<string, string>;
  folgas: { perfil_offset: number; vidro_largura_offset: number; vidro_altura_offset: number };
  onConfigChange: (key: string, value: string) => void;
  onFolgaChange: (key: "perfil_offset" | "vidro_largura_offset" | "vidro_altura_offset", value: number) => void;
  onResetFolgas: () => void;
  onSave: () => Promise<void>;
}

export function EmpresaTab({ config, folgas, onConfigChange, onFolgaChange, onResetFolgas, onSave }: EmpresaTabProps) {
  const { user } = useAuth();
  const [logoUploading, setLogoUploading] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Arquivo inválido", { description: "Selecione uma imagem." });
      return;
    }
    setLogoUploading(true);
    const ext = file.name.split(".").pop();
    const folder = user.id;
    const path = `${folder}/logo.${ext}`;
    const { data: existingFiles } = await supabase.storage.from("company-assets").list(folder, { search: "logo" });
    if (existingFiles && existingFiles.length > 0) {
      await supabase.storage.from("company-assets").remove(existingFiles.map((f) => `${folder}/${f.name}`));
    }
    const { error: uploadErr } = await supabase.storage.from("company-assets").upload(path, file, { upsert: true });
    if (uploadErr) {
      toast.error("Erro no upload", { description: uploadErr.message });
      setLogoUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("company-assets").getPublicUrl(path);
    const logoUrl = urlData.publicUrl + "?t=" + Date.now();
    onConfigChange("logo_url", logoUrl);
    await supabase.from("configuracoes").upsert({ chave: "logo_url", valor: logoUrl }, { onConflict: "chave" });
    setLogoUploading(false);
    toast.success("Logo atualizado!");
  };

  const handleRemoveLogo = async () => {
    if (!user) return;
    const folder = user.id;
    const { data: existingFiles } = await supabase.storage.from("company-assets").list(folder, { search: "logo" });
    if (existingFiles && existingFiles.length > 0) {
      await supabase.storage.from("company-assets").remove(existingFiles.map((f) => `${folder}/${f.name}`));
    }
    onConfigChange("logo_url", "");
    await supabase.from("configuracoes").upsert({ chave: "logo_url", valor: "" }, { onConflict: "chave" });
    toast.success("Logo removido");
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-border/50">
        <CardHeader><CardTitle className="text-base">Dados da Empresa</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Nome da Empresa</Label><Input value={config.nome} onChange={(e) => onConfigChange("nome", e.target.value)} /></div>
            <div className="space-y-2"><Label>CNPJ</Label><Input value={config.cnpj} onChange={(e) => onConfigChange("cnpj", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Telefone</Label><Input value={config.telefone} onChange={(e) => onConfigChange("telefone", e.target.value)} /></div>
            <div className="space-y-2"><Label>E-mail</Label><Input value={config.email} onChange={(e) => onConfigChange("email", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Endereço</Label><Input value={config.endereco || ""} onChange={(e) => onConfigChange("endereco", e.target.value)} /></div>
            <div className="space-y-2"><Label>Cidade</Label><Input value={config.cidade || ""} onChange={(e) => onConfigChange("cidade", e.target.value)} /></div>
            <div className="space-y-2"><Label>Estado</Label><Input value={config.estado || ""} onChange={(e) => onConfigChange("estado", e.target.value)} /></div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border/50">
        <CardHeader><CardTitle className="text-base">Logo da Empresa</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            {config.logo_url ? (
              <div className="relative group">
                <img src={config.logo_url} alt="Logo da empresa" className="h-24 w-24 object-contain rounded-lg border bg-muted p-2" />
                <button onClick={handleRemoveLogo} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="h-24 w-24 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/50">
                <Building2 className="h-8 w-8 text-muted-foreground/50" />
              </div>
            )}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Imagem usada em orçamentos, notas fiscais e relatórios.</p>
              <div>
                <input type="file" accept="image/*" className="hidden" id="logo-upload" onChange={handleLogoUpload} />
                <Button variant="outline" size="sm" className="gap-1.5" disabled={logoUploading} onClick={() => document.getElementById("logo-upload")?.click()}>
                  {logoUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                  {logoUploading ? "Enviando..." : "Enviar logo"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border/50">
        <CardHeader><CardTitle className="text-base">Margem Padrão</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Margem de Lucro (%)</Label><Input type="number" value={config.margem} onChange={(e) => onConfigChange("margem", e.target.value)} /></div>
            <div className="space-y-2"><Label>Desconto Máximo (%)</Label><Input type="number" value={config.descontoMax} onChange={(e) => onConfigChange("descontoMax", e.target.value)} /></div>
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
            <Button variant="ghost" size="sm" className="text-xs gap-1.5" onClick={onResetFolgas}>
              <RotateCcw className="h-3 w-3" /> Zerar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground">Ajustes globais de folga em milímetros somados às folgas do catálogo.</p>
          <Separator />
          <div>
            <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3">Perfis</h4>
            <div className="space-y-2">
              <Label className="text-sm">Ajuste de folga nos perfis (mm)</Label>
              <Input type="number" className="max-w-[200px]" value={folgas.perfil_offset} onChange={(e) => onFolgaChange("perfil_offset", Number(e.target.value))} />
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3">Vidros</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-sm">Ajuste largura (mm)</Label><Input type="number" value={folgas.vidro_largura_offset} onChange={(e) => onFolgaChange("vidro_largura_offset", Number(e.target.value))} /></div>
              <div className="space-y-2"><Label className="text-sm">Ajuste altura (mm)</Label><Input type="number" value={folgas.vidro_altura_offset} onChange={(e) => onFolgaChange("vidro_altura_offset", Number(e.target.value))} /></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={onSave} className="gap-2">
        <Save className="h-4 w-4" /> Salvar Configurações
      </Button>
    </div>
  );
}
