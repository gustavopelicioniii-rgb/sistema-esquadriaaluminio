import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Save, Upload, Eye, Palette, Building, Phone, Mail, MapPin, Check
} from "lucide-react";
import { toast } from "sonner";

interface CompanyBranding {
  companyName: string;
  primaryColor: string;
  secondaryColor: string;
  cnpj: string;
  phone: string;
  email: string;
  address: string;
  logoUrl: string;
  showProposal: boolean;
  showCatalog: boolean;
  showContact: boolean;
  showSocial: boolean;
  instagram: string;
  facebook: string;
  whatsapp: string;
}

const defaultBranding: CompanyBranding = {
  companyName: "",
  primaryColor: "#1e3a5f",
  secondaryColor: "#4a90d9",
  cnpj: "",
  phone: "",
  email: "",
  address: "",
  logoUrl: "",
  showProposal: true,
  showCatalog: true,
  showContact: true,
  showSocial: true,
  instagram: "",
  facebook: "",
  whatsapp: "",
};

interface MarcaTabProps {
  config: Record<string, string>;
  onConfigChange: (key: string, value: string) => void;
  onSave: () => void;
}

export function MarcaTab({ config, onConfigChange, onSave }: MarcaTabProps) {
  const [branding, setBranding] = useState<CompanyBranding>(defaultBranding);
  const [saved, setSaved] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    // Load from config
    setBranding({
      companyName: config.nome || "",
      primaryColor: config.cor_marca || "#1e3a5f",
      secondaryColor: config.cor_marca_secundaria || "#4a90d9",
      cnpj: config.cnpj || "",
      phone: config.telefone || "",
      email: config.email || "",
      address: config.endereco || "",
      logoUrl: config.logo_url || "",
      showProposal: config.exibir_proposta !== "false",
      showCatalog: config.exibir_catalogo !== "false",
      showContact: config.exibir_contato !== "false",
      showSocial: config.exibir_social !== "false",
      instagram: config.instagram || "",
      facebook: config.facebook || "",
      whatsapp: config.whatsapp || "",
    });
    if (config.logo_url) {
      setLogoPreview(config.logo_url);
    }
  }, [config]);

  const handleSave = () => {
    // Save to config
    onConfigChange("nome", branding.companyName);
    onConfigChange("cor_marca", branding.primaryColor);
    onConfigChange("cor_marca_secundaria", branding.secondaryColor);
    onConfigChange("cnpj", branding.cnpj);
    onConfigChange("telefone", branding.phone);
    onConfigChange("email", branding.email);
    onConfigChange("endereco", branding.address);
    onConfigChange("logo_url", branding.logoUrl);
    onConfigChange("exibir_proposta", String(branding.showProposal));
    onConfigChange("exibir_catalogo", String(branding.showCatalog));
    onConfigChange("exibir_contato", String(branding.showContact));
    onConfigChange("exibir_social", String(branding.showSocial));
    onConfigChange("instagram", branding.instagram);
    onConfigChange("facebook", branding.facebook);
    onConfigChange("whatsapp", branding.whatsapp);
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setLogoPreview(dataUrl);
      setBranding((prev) => ({ ...prev, logoUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const updateField = (field: keyof CompanyBranding, value: any) => {
    setBranding((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Configuração de Marca</h2>
          <p className="text-muted-foreground text-sm">
            Personalize sua proposta com logo, cores e informações
          </p>
        </div>
        <Button onClick={handleSave} className="gap-2" disabled={saved}>
          {saved ? (
            <><Check className="h-4 w-4" /> Salvo!</>
          ) : (
            <><Save className="h-4 w-4" /> Salvar</>
          )}
        </Button>
      </div>

      {/* Preview */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Preview da Proposta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div 
              className="h-16 rounded-t-lg flex items-center px-4 gap-4"
              style={{ backgroundColor: branding.primaryColor }}
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="h-10 object-contain" />
              ) : (
                <div className="text-white font-bold text-lg">{branding.companyName || "Sua Empresa"}</div>
              )}
              <div className="flex-1 text-right text-white text-sm">
                PROPOSTA COMERCIAL
              </div>
            </div>
            <div className="p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cliente:</span>
                <span className="font-medium">João Silva</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor Total:</span>
                <span className="font-bold" style={{ color: branding.primaryColor }}>
                  R$ 12.500,00
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="empresa" className="w-full">
        <TabsList>
          <TabsTrigger value="empresa" className="gap-1">
            <Building className="h-4 w-4" /> Empresa
          </TabsTrigger>
          <TabsTrigger value="cores" className="gap-1">
            <Palette className="h-4 w-4" /> Cores
          </TabsTrigger>
          <TabsTrigger value="contato" className="gap-1">
            <Phone className="h-4 w-4" /> Contato
          </TabsTrigger>
        </TabsList>

        <TabsContent value="empresa" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nome da Empresa</Label>
              <Input
                id="companyName"
                value={branding.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
                placeholder="Sua Empresa LTDA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={branding.cnpj}
                onChange={(e) => updateField("cnpj", e.target.value)}
                placeholder="00.000.000/0001-00"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Logo da Empresa</Label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="flex-1"
              />
              {logoPreview && (
                <img src={logoPreview} alt="Logo preview" className="h-12 w-auto rounded border" />
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cores" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Cor Principal</Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={branding.primaryColor}
                  onChange={(e) => updateField("primaryColor", e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  value={branding.primaryColor}
                  onChange={(e) => updateField("primaryColor", e.target.value)}
                  placeholder="#1e3a5f"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Cor Secundária</Label>
              <div className="flex gap-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={branding.secondaryColor}
                  onChange={(e) => updateField("secondaryColor", e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  value={branding.secondaryColor}
                  onChange={(e) => updateField("secondaryColor", e.target.value)}
                  placeholder="#4a90d9"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="showProposal"
                checked={branding.showProposal}
                onCheckedChange={(v) => updateField("showProposal", v)}
              />
              <Label htmlFor="showProposal">Exibir na Proposta</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="showCatalog"
                checked={branding.showCatalog}
                onCheckedChange={(v) => updateField("showCatalog", v)}
              />
              <Label htmlFor="showCatalog">Exibir no Catálogo</Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contato" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={branding.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={branding.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="contato@empresa.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Textarea
              id="address"
              value={branding.address}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="Rua exemplo, 123 - Cidade/UF"
            />
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={branding.whatsapp}
                onChange={(e) => updateField("whatsapp", e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={branding.instagram}
                onChange={(e) => updateField("instagram", e.target.value)}
                placeholder="@seuinstagram"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={branding.facebook}
                onChange={(e) => updateField("facebook", e.target.value)}
                placeholder="facebook.com/sua pagina"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
