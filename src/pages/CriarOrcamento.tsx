import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { formatCurrency } from "@/data/mockData";
import { ArrowLeft, FileDown, Building2, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { FramePreview, ColorSelector } from "@/components/frame-preview";
import Frame3DWrapper from "@/components/frame-preview/Frame3DWrapper";
import { generateBudgetPDF } from "@/utils/pdfGenerator";

const tiposProduto = [
  { value: "janela_correr_2f", label: "Janela de Correr 2F", precoM2: 850, category: "janela_correr", subcategory: "2_folhas", numFolhas: 2 },
  { value: "janela_correr_4f", label: "Janela de Correr 4F", precoM2: 880, category: "janela_correr", subcategory: "4_folhas", numFolhas: 4 },
  { value: "janela_maximar_1f", label: "Janela Maxim-Ar 1F", precoM2: 920, category: "janela_maximar", subcategory: "1_folha", numFolhas: 1 },
  { value: "janela_maximar_2f", label: "Janela Maxim-Ar 2F", precoM2: 950, category: "janela_maximar", subcategory: "2_folhas", numFolhas: 2 },
  { value: "porta_giro_1f", label: "Porta de Giro 1F", precoM2: 950, category: "porta_giro", subcategory: "1_folha", numFolhas: 1 },
  { value: "porta_giro_2f", label: "Porta de Giro 2F", precoM2: 1000, category: "porta_giro", subcategory: "2_folhas", numFolhas: 2 },
  { value: "porta_correr_2f", label: "Porta de Correr 2F", precoM2: 1050, category: "porta_correr", subcategory: "2_folhas", numFolhas: 2 },
  { value: "porta_correr_4f", label: "Porta de Correr 4F", precoM2: 1100, category: "porta_correr", subcategory: "4_folhas", numFolhas: 4 },
  { value: "janela_veneziana", label: "Janela c/ Veneziana 2F", precoM2: 1200, category: "janela_correr", subcategory: "2_folhas", numFolhas: 2, veneziana: true },
  { value: "janela_camarao", label: "Janela Camarão", precoM2: 1300, category: "janela_camarao", subcategory: "4_folhas", numFolhas: 4 },
];

const CriarOrcamento = () => {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState("");
  const [tipo, setTipo] = useState("");
  const [largura, setLargura] = useState(150);
  const [altura, setAltura] = useState(120);
  const [quantidade, setQuantidade] = useState(1);
  const [colorId, setColorId] = useState("natural");
  const [empresaNome, setEmpresaNome] = useState("");
  const [empresaTelefone, setEmpresaTelefone] = useState("");
  const [empresaEmail, setEmpresaEmail] = useState("");
  const [empresaEndereco, setEmpresaEndereco] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [empresaOpen, setEmpresaOpen] = useState(false);
  const produtoSelecionado = tiposProduto.find((t) => t.value === tipo);

  const calculo = useMemo(() => {
    const produto = tiposProduto.find((t) => t.value === tipo);
    if (!produto) return null;
    const areaM2 = (largura / 100) * (altura / 100);
    const custoUnitario = areaM2 * produto.precoM2;
    const custoTotal = custoUnitario * quantidade;
    const margem = custoTotal * 0.35;
    const valorFinal = custoTotal + margem;
    return { custoUnitario, custoTotal, margem, valorFinal, areaM2 };
  }, [tipo, largura, altura, quantidade]);

  const handleSalvar = () => {
    toast({ title: "Orçamento criado!", description: `Orçamento para ${cliente} salvo com sucesso.` });
    navigate("/orcamentos");
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/orcamentos")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Novo Orçamento</h1>
          <p className="text-muted-foreground text-sm">Preencha os dados do orçamento</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Dados do Produto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Input placeholder="Nome do cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Produto</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger><SelectValue placeholder="Selecione o produto" /></SelectTrigger>
                <SelectContent>
                  {tiposProduto.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Largura (cm)</Label>
                <Input type="number" value={largura} onChange={(e) => setLargura(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Altura (cm)</Label>
                <Input type="number" value={altura} onChange={(e) => setAltura(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Quantidade</Label>
                <Input type="number" value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))} min={1} />
              </div>
            </div>

            {/* Company info collapsible */}
            <Collapsible open={empresaOpen} onOpenChange={setEmpresaOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-between text-muted-foreground gap-2">
                  <span className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Dados da empresa no PDF
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${empresaOpen ? "rotate-180" : ""}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label className="text-xs">Nome da Empresa</Label>
                  <Input placeholder="Ex: AlumPro Esquadrias" value={empresaNome} onChange={e => setEmpresaNome(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Telefone</Label>
                    <Input placeholder="(11) 99999-0000" value={empresaTelefone} onChange={e => setEmpresaTelefone(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Email</Label>
                    <Input placeholder="contato@empresa.com" value={empresaEmail} onChange={e => setEmpresaEmail(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Endereço</Label>
                  <Input placeholder="Rua, nº - Cidade/UF" value={empresaEndereco} onChange={e => setEmpresaEndereco(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">URL do Logotipo</Label>
                  <Input placeholder="https://... (imagem PNG/JPG)" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} />
                  {logoUrl && (
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <img src={logoUrl} alt="Logo" className="h-8 w-auto object-contain" onError={(e) => (e.currentTarget.style.display = "none")} />
                      <span className="text-xs text-muted-foreground">Preview do logo</span>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="flex gap-2">
              <Button onClick={handleSalvar} disabled={!cliente || !tipo} className="flex-1">
                Salvar Orçamento
              </Button>
              <Button
                variant="outline"
                disabled={!cliente || !tipo || !calculo}
                className="gap-2"
                onClick={async () => {
                  if (!calculo || !produtoSelecionado) return;
                  sonnerToast.info("Gerando PDF...");
                  const empresa = empresaNome ? {
                    nome: empresaNome,
                    telefone: empresaTelefone || undefined,
                    email: empresaEmail || undefined,
                    endereco: empresaEndereco || undefined,
                    logoUrl: logoUrl || undefined,
                  } : undefined;
                  await generateBudgetPDF(
                    {
                      cliente,
                      produto: produtoSelecionado.label,
                      larguraCm: largura,
                      alturaCm: altura,
                      quantidade,
                      areaM2: calculo.areaM2,
                      custoTotal: calculo.custoTotal,
                      margem: calculo.margem,
                      valorFinal: calculo.valorFinal,
                      empresa,
                    },
                    "budget-frame-preview"
                  );
                  sonnerToast.success("PDF exportado!");
                }}
              >
                <FileDown className="h-4 w-4" />
                PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview & Calculation */}
        <div className="space-y-4">
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Visualização da Esquadria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Frame3DWrapper className="flex items-center justify-center min-h-[260px]">
                <div id="budget-frame-preview">
                  <FramePreview
                    width_mm={largura * 10}
                    height_mm={altura * 10}
                    category={produtoSelecionado?.category ?? "janela_correr"}
                    subcategory={produtoSelecionado?.subcategory ?? "2_folhas"}
                    num_folhas={produtoSelecionado?.numFolhas ?? 2}
                    has_veneziana={produtoSelecionado?.veneziana}
                    colorId={colorId}
                    maxWidth={320}
                    maxHeight={260}
                  />
                </div>
              </Frame3DWrapper>
              <ColorSelector selectedColorId={colorId} onColorChange={setColorId} />
            </CardContent>
          </Card>

          {calculo && (
            <Card className="shadow-sm border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Resultado do Cálculo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Área unitária</span>
                    <span className="font-medium">{calculo.areaM2.toFixed(2)} m²</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Custo estimado</span>
                    <span className="font-medium">{formatCurrency(calculo.custoTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Margem (35%)</span>
                    <span className="font-medium">{formatCurrency(calculo.margem)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold">Valor Final</span>
                    <span className="text-xl font-bold text-primary">{formatCurrency(calculo.valorFinal)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CriarOrcamento;
