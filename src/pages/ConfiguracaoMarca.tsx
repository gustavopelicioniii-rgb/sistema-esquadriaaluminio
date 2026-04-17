import { useState, useEffect } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
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
  Save, Upload, Eye, Download, Palette, Building, FileText, 
  CreditCard, Truck, Shield, Phone, Mail, MapPin, Globe, 
  Instagram, MessageCircle, Check
} from "lucide-react";
import { toast } from "sonner";
import {
  type CompanyBranding,
  defaultBranding,
  saveBranding,
  loadBranding,
  aluminumColorOptions,
} from "@/utils/branding/companyConfig";

export default function ConfiguracaoMarca() {
  usePageTitle("Configuração de Marca");
  
  const [branding, setBranding] = useState<CompanyBranding>(defaultBranding);
  const [saved, setSaved] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Load saved branding on mount
  useEffect(() => {
    const saved = loadBranding();
    setBranding(saved);
    if (saved.logoUrl) {
      setLogoPreview(saved.logoUrl);
    }
  }, []);

  const handleSave = () => {
    saveBranding(branding);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    toast.success("Configurações salvas com sucesso!");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione um arquivo de imagem.");
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
          <h1 className="text-2xl font-bold">Configuração de Marca</h1>
          <p className="text-muted-foreground">
            Personalize sua proposta com logo, cores e informações da empresa
          </p>
        </div>
        <Button onClick={handleSave} className="gap-2" disabled={saved}>
          {saved ? (
            <>
              <Check className="h-4 w-4" /> Salvo!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Salvar Configurações
            </>
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
          <CardDescription>
            Veja como sua proposta vai ficar com as configurações atuais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            {/* Mini preview header */}
            <div 
              className="h-16 rounded-t-lg flex items-center px-4 gap-4"
              style={{ backgroundColor: branding.primaryColor }}
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="h-10 object-contain" />
              ) : (
                <div className="text-white font-bold text-lg">{branding.companyName}</div>
              )}
              <div className="flex-1 text-right text-white text-sm">
                PROPOSTA COMERCIAL
              </div>
            </div>
            {/* Mini content */}
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
          <TabsTrigger value="termos" className="gap-1">
            <FileText className="h-4 w-4" /> Termos
          </TabsTrigger>
          <TabsTrigger value="pagamento" className="gap-1">
            <CreditCard className="h-4 w-4" /> Pagamento
          </TabsTrigger>
        </TabsList>

        {/* Empresa Tab */}
        <TabsContent value="empresa" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Empresa</CardTitle>
              <CardDescription>
                Informações que aparecem na proposta comercial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nome da Empresa *</Label>
                  <Input
                    id="companyName"
                    value={branding.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    placeholder="Sua Empresa de Esquadrias"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={branding.tagline || ""}
                    onChange={(e) => updateField("tagline", e.target.value)}
                    placeholder="Qualidade e tradição em alumínio"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Logo da Empresa</Label>
                <div className="flex items-center gap-4">
                  <div className="border-2 border-dashed rounded-lg p-4 w-40 h-20 flex items-center justify-center bg-muted/50">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="max-h-14 object-contain" />
                    ) : (
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="logoUpload" className="cursor-pointer">
                      <Button variant="outline" asChild className="gap-2">
                        <span>
                          <Upload className="h-4 w-4" /> Carregar Logo
                        </span>
                      </Button>
                    </Label>
                    <Input
                      id="logoUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG ou SVG. Recomendado: 200x80px
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={branding.cnpj || ""}
                    onChange={(e) => updateField("cnpj", e.target.value)}
                    placeholder="00.000.000/0001-00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ie">Inscrição Estadual</Label>
                  <Input
                    id="ie"
                    value={branding.ie || ""}
                    onChange={(e) => updateField("ie", e.target.value)}
                    placeholder="000.000.000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={branding.cep || ""}
                    onChange={(e) => updateField("cep", e.target.value)}
                    placeholder="00000-000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cores Tab */}
        <TabsContent value="cores" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cores da Marca</CardTitle>
              <CardDescription>
                Escolha as cores que aparecem na proposta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <p className="text-xs text-muted-foreground">
                    Usada no cabeçalho e destaques
                  </p>
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
                      placeholder="#2d5a87"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Usada em seções secundárias
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Cor de Destaque</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={branding.accentColor}
                      onChange={(e) => updateField("accentColor", e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={branding.accentColor}
                      onChange={(e) => updateField("accentColor", e.target.value)}
                      placeholder="#f59e0b"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Usada para valores e informações importantes
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Previews</Label>
                <div className="flex gap-4">
                  <div 
                    className="w-20 h-12 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: branding.primaryColor }}
                  >
                    Principal
                  </div>
                  <div 
                    className="w-20 h-12 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: branding.secondaryColor }}
                  >
                    Secundária
                  </div>
                  <div 
                    className="w-20 h-12 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: branding.accentColor }}
                  >
                    Destaque
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contato Tab */}
        <TabsContent value="contato" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
              <CardDescription>
                Como os clientes podem entrar em contato
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Telefone
                  </Label>
                  <Input
                    id="phone"
                    value={branding.phone || ""}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" /> E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={branding.email || ""}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="contato@empresa.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" /> Website
                  </Label>
                  <Input
                    id="website"
                    value={branding.website || ""}
                    onChange={(e) => updateField("website", e.target.value)}
                    placeholder="www.empresa.com.br"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </Label>
                  <Input
                    id="whatsapp"
                    value={branding.whatsapp || ""}
                    onChange={(e) => updateField("whatsapp", e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram" className="flex items-center gap-2">
                    <Instagram className="h-4 w-4" /> Instagram
                  </Label>
                  <Input
                    id="instagram"
                    value={branding.instagram || ""}
                    onChange={(e) => updateField("instagram", e.target.value)}
                    placeholder="@empresa"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Endereço Completo
                </Label>
                <Input
                  id="address"
                  value={branding.address || ""}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="Rua Exemplo, 123 - Bairro"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={branding.city || ""}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="São Paulo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    value={branding.state || ""}
                    onChange={(e) => updateField("state", e.target.value)}
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Termos Tab */}
        <TabsContent value="termos" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" /> Termos e Condições
              </CardTitle>
              <CardDescription>
                Termos que aparecem no verso da proposta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contractTerms">Termos do Contrato</Label>
                <Textarea
                  id="contractTerms"
                  value={branding.contractTerms || ""}
                  onChange={(e) => updateField("contractTerms", e.target.value)}
                  rows={6}
                  placeholder="1. O presente orçamento tem validade de 10 dias..."
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="warrantyTerms" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Termos de Garantia
                </Label>
                <Textarea
                  id="warrantyTerms"
                  value={branding.warrantyTerms || ""}
                  onChange={(e) => updateField("warrantyTerms", e.target.value)}
                  rows={4}
                  placeholder="1. Garantia de 5 anos contra defeitos de fabricação..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pagamento Tab */}
        <TabsContent value="pagamento" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" /> Dados Bancários
              </CardTitle>
              <CardDescription>
                Informações para pagamento que aparecem na proposta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Banco</Label>
                  <Input
                    id="bankName"
                    value={branding.bankInfo?.bank || ""}
                    onChange={(e) => updateField("bankInfo", { ...branding.bankInfo, bank: e.target.value })}
                    placeholder="Banco do Brasil"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agency">Agência</Label>
                  <Input
                    id="agency"
                    value={branding.bankInfo?.agency || ""}
                    onChange={(e) => updateField("bankInfo", { ...branding.bankInfo, agency: e.target.value })}
                    placeholder="0000-0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="account">Conta</Label>
                  <Input
                    id="account"
                    value={branding.bankInfo?.account || ""}
                    onChange={(e) => updateField("bankInfo", { ...branding.bankInfo, account: e.target.value })}
                    placeholder="00000-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankCnpj">CNPJ (para PIX)</Label>
                  <Input
                    id="bankCnpj"
                    value={branding.bankInfo?.ccpj || ""}
                    onChange={(e) => updateField("bankInfo", { ...branding.bankInfo, ccpj: e.target.value })}
                    placeholder="00.000.000/0001-00"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="paymentConditions">Condições de Pagamento Padrão</Label>
                <Textarea
                  id="paymentConditions"
                  value={branding.paymentConditions || ""}
                  onChange={(e) => updateField("paymentConditions", e.target.value)}
                  rows={4}
                  placeholder="• Entrada: 50% na aprovação do orçamento
• Saída: 50% na entrega dos materiais
• Aceitamos: PIX, transferência, boleto"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
