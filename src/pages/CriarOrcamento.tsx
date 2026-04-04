import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/formatters";
import { ArrowLeft, FileDown, Minus, Plus, Pencil, Trash2, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { useCreateOrcamento } from "@/hooks/use-orcamentos";
import { FramePreview } from "@/components/frame-preview";
import { getColorById, aluminumColors } from "@/components/frame-preview/colors";
import Frame3DWrapper from "@/components/frame-preview/Frame3DWrapper";
import { generateProfessionalBudgetPDF } from "@/utils/budgetPdfGenerator";
import { cn } from "@/lib/utils";
import MaterialDetailDialog from "@/components/orcamento/MaterialDetailDialog";

const tiposProduto = [
  { value: "janela_correr_2f", label: "Janela de Correr 2F", precoM2: 850, category: "janela_correr", subcategory: "2_folhas", numFolhas: 2, typologyId: "typ-su-jc2f" },
  { value: "janela_correr_4f", label: "Janela de Correr 4F", precoM2: 880, category: "janela_correr", subcategory: "4_folhas", numFolhas: 4, typologyId: "typ-su-jc4f" },
  { value: "janela_maximar_1f", label: "Janela Maxim-Ar 1F", precoM2: 920, category: "janela_maximar", subcategory: "1_folha", numFolhas: 1, typologyId: "typ-su-jma1" },
  { value: "janela_maximar_2f", label: "Janela Maxim-Ar 2F", precoM2: 950, category: "janela_maximar", subcategory: "2_folhas", numFolhas: 2, typologyId: "typ-su-jma2" },
  { value: "porta_giro_1f", label: "Porta de Giro 1F", precoM2: 950, category: "porta_giro", subcategory: "1_folha", numFolhas: 1, typologyId: "typ-su-pg1f" },
  { value: "porta_giro_2f", label: "Porta de Giro 2F", precoM2: 1000, category: "porta_giro", subcategory: "2_folhas", numFolhas: 2, typologyId: "typ-su-pg2f" },
  { value: "porta_correr_2f", label: "Porta de Correr 2F", precoM2: 1050, category: "porta_correr", subcategory: "2_folhas", numFolhas: 2, typologyId: "typ-su-pc2f" },
  { value: "porta_correr_4f", label: "Porta de Correr 4F", precoM2: 1100, category: "porta_correr", subcategory: "4_folhas", numFolhas: 4, typologyId: "typ-su-pc4f" },
  { value: "janela_veneziana", label: "Janela c/ Veneziana 2F", precoM2: 1200, category: "janela_correr", subcategory: "2_folhas", numFolhas: 2, veneziana: true, typologyId: "typ-su-jc2fv" },
  { value: "janela_camarao", label: "Janela Camarão", precoM2: 1300, category: "janela_camarao", subcategory: "4_folhas", numFolhas: 4, typologyId: "typ-su-jcam" },
];

const vidroOptions = ["Comum", "Temperado", "Laminado", "Jateado", "Nenhum"];
const ferragemColors = [
  { id: "cromado", name: "Cromado", hex: "#C0C0C0" },
  { id: "preto", name: "Preto", hex: "#333333" },
  { id: "branco", name: "Branco", hex: "#F0F0F0" },
  { id: "bronze", name: "Bronze", hex: "#8B6914" },
];

const CriarOrcamento = () => {
  const navigate = useNavigate();
  const createOrcamento = useCreateOrcamento();
  const [cliente, setCliente] = useState("");
  const [tipo, setTipo] = useState("janela_correr_2f");
  const [largura, setLargura] = useState(200);
  const [altura, setAltura] = useState(120);
  const [quantidade, setQuantidade] = useState(1);
  const [colorId, setColorId] = useState("natural");
  const [ferragemColorId, setFerragemColorId] = useState("preto");
  const [vidroTipo, setVidroTipo] = useState("Nenhum");
  const [margemPercent, setMargemPercent] = useState(100);
  const [acrescimo, setAcrescimo] = useState(0);
  const [temAcrescimo, setTemAcrescimo] = useState(false);
  const [ambiente, setAmbiente] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);

  const produtoSelecionado = tiposProduto.find((t) => t.value === tipo);

  const calculo = useMemo(() => {
    const produto = tiposProduto.find((t) => t.value === tipo);
    if (!produto) return null;
    const areaM2 = (largura / 100) * (altura / 100);
    const custo = areaM2 * produto.precoM2 * quantidade;
    const lucro = custo * (margemPercent / 100);
    const subtotal = custo + lucro;
    const acrescimoVal = temAcrescimo ? acrescimo : 0;
    const total = subtotal + acrescimoVal;
    return { areaM2, custo, lucro, subtotal, acrescimo: acrescimoVal, total };
  }, [tipo, largura, altura, quantidade, margemPercent, temAcrescimo, acrescimo]);

  const handleSalvar = async () => {
    if (!calculo || !produtoSelecionado || !cliente) return;
    try {
      await createOrcamento.mutateAsync({
        cliente,
        produto: produtoSelecionado.label,
        valor: calculo.total,
        itens: {
          tipo,
          largura_cm: largura,
          altura_cm: altura,
          quantidade,
          area_m2: calculo.areaM2,
          custo: calculo.custo,
          lucro: calculo.lucro,
          subtotal: calculo.subtotal,
          acrescimo: calculo.acrescimo,
          margem_percent: margemPercent,
          cor_aluminio: colorId,
          cor_ferragem: ferragemColorId,
          vidro_tipo: vidroTipo,
          ambiente,
          observacoes,
        },
      });
      toast({ title: "Orçamento criado!", description: `Orçamento para ${cliente} salvo com sucesso.` });
      navigate("/orcamentos");
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    }
  };

  const handleLimpar = () => {
    setCliente("");
    setTipo("janela_correr_2f");
    setLargura(200);
    setAltura(120);
    setQuantidade(1);
    setColorId("natural");
    setFerragemColorId("preto");
    setVidroTipo("Nenhum");
    setMargemPercent(100);
    setAcrescimo(0);
    setTemAcrescimo(false);
    setAmbiente("");
    setObservacoes("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/orcamentos")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-muted-foreground">Orçamentos</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleLimpar}>Limpar</Button>
          <Button size="sm" onClick={handleSalvar} className="bg-primary">Salvar</Button>
        </div>
      </div>

      {/* Main content - two columns */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Preview */}
        <div className="w-[280px] shrink-0 border-r border-border/50 flex flex-col bg-muted/30">
          <div className="flex-1 flex items-center justify-center p-4">
            <Frame3DWrapper className="flex items-center justify-center">
              <div id="budget-frame-preview">
                <FramePreview
                  width_mm={largura * 10}
                  height_mm={altura * 10}
                  category={produtoSelecionado?.category ?? "janela_correr"}
                  subcategory={produtoSelecionado?.subcategory ?? "2_folhas"}
                  num_folhas={produtoSelecionado?.numFolhas ?? 2}
                  has_veneziana={produtoSelecionado?.veneziana}
                  colorId={colorId}
                  maxWidth={220}
                  maxHeight={200}
                />
              </div>
            </Frame3DWrapper>
          </div>
          <div className="px-4 pb-4 space-y-1">
            <p className="text-sm font-bold uppercase tracking-wide">
              {produtoSelecionado?.label ?? "Selecione"}
            </p>
            <p className="text-xs text-muted-foreground">{cliente || "Cliente não informado"}</p>
            <p className="text-xs text-muted-foreground">
              Largura: {largura * 10} × {altura * 10} mm
            </p>
            <button className="flex items-center gap-1 text-xs text-primary font-medium mt-1 hover:underline">
              <Pencil className="h-3 w-3" /> Editar produto
            </button>
            <button
              onClick={() => setMaterialDialogOpen(true)}
              className="flex items-center gap-1 text-xs text-primary font-medium mt-1 hover:underline"
            >
              <List className="h-3 w-3" /> Ver materiais
            </button>
          </div>
        </div>

        {/* Right panel - Scrollable form */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-xl mx-auto p-6 space-y-6">
            {/* Cliente */}
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Input placeholder="Nome do cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} />
            </div>

            {/* Tipo de Produto */}
            <div className="space-y-2">
              <Label>Tipo de Produto</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {tiposProduto.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dimensões */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Largura (cm)</Label>
                <Input type="number" value={largura} onChange={(e) => setLargura(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Altura (cm)</Label>
                <Input type="number" value={altura} onChange={(e) => setAltura(Number(e.target.value))} />
              </div>
            </div>

            {/* Tipo de vidro */}
            <div className="space-y-2">
              <Label>Tipo de vidro</Label>
              <div className="flex flex-wrap gap-2">
                {vidroOptions.map((v) => (
                  <button
                    key={v}
                    onClick={() => setVidroTipo(v)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                      vidroTipo === v
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
                    )}
                  >
                    {v.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Cor dos alumínios */}
            <div className="space-y-2">
              <Label>Cor dos alumínios</Label>
              <div className="flex flex-wrap gap-2">
                {aluminumColors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setColorId(c.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                      colorId === c.id
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-muted/30 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-border/50"
                      style={{ backgroundColor: c.hex }}
                    />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Cor das ferragens */}
            <div className="space-y-2">
              <Label>Cor das ferragens</Label>
              <div className="flex flex-wrap gap-2">
                {ferragemColors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setFerragemColorId(c.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                      ferragemColorId === c.id
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-muted/30 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-border/50"
                      style={{ backgroundColor: c.hex }}
                    />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantidade */}
            <div className="space-y-2">
              <Label>Quantidade</Label>
              <div className="flex items-center gap-0">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-r-none"
                  onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Math.max(1, Number(e.target.value)))}
                  className="rounded-none text-center w-full border-x-0"
                  min={1}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-l-none"
                  onClick={() => setQuantidade(quantidade + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Acréscimo toggle */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-0">
                <button
                  onClick={() => setTemAcrescimo(false)}
                  className={cn(
                    "py-2.5 text-sm font-medium rounded-l-lg border transition-colors",
                    !temAcrescimo
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/50 text-muted-foreground border-border"
                  )}
                >
                  Sem acréscimo
                </button>
                <button
                  onClick={() => setTemAcrescimo(true)}
                  className={cn(
                    "py-2.5 text-sm font-medium rounded-r-lg border border-l-0 transition-colors",
                    temAcrescimo
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/50 text-muted-foreground border-border"
                  )}
                >
                  Adicionar acréscimo
                </button>
              </div>
              {temAcrescimo && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">R$</span>
                  <Input
                    type="number"
                    value={acrescimo}
                    onChange={(e) => setAcrescimo(Number(e.target.value))}
                    placeholder="0,00"
                    min={0}
                  />
                </div>
              )}
            </div>

            {/* Margem de lucro */}
            <div className="space-y-2">
              <Label>Margem de lucro</Label>
              <div className="flex items-center gap-0">
                <span className="flex items-center justify-center h-10 w-10 bg-primary text-primary-foreground rounded-l-md text-sm font-bold shrink-0">
                  %
                </span>
                <Input
                  type="number"
                  value={margemPercent}
                  onChange={(e) => setMargemPercent(Number(e.target.value))}
                  className="rounded-l-none"
                  min={0}
                />
              </div>
            </div>

            {/* Ambiente */}
            <div className="space-y-2">
              <Label>Ambiente da instalação (opcional)</Label>
              <Input
                placeholder="Ex: Sala, Quarto, Cozinha..."
                value={ambiente}
                onChange={(e) => setAmbiente(e.target.value)}
              />
            </div>

            {/* Observações */}
            <div className="space-y-2">
              <Label>Adicionar observações (opcional)</Label>
              <Textarea
                placeholder="Observações adicionais..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Cost summary */}
            {calculo && (
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Custo</span>
                  <span className="font-medium text-destructive">{formatCurrency(calculo.custo)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Lucro</span>
                  <span className="font-medium text-green-600">{formatCurrency(calculo.lucro)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(calculo.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Acréscimo</span>
                  <span className="font-medium">+ {formatCurrency(calculo.acrescimo)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-bold text-base">TOTAL</span>
                  <span className="font-bold text-lg">{formatCurrency(calculo.total)}</span>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 pb-6">
              <Button onClick={handleSalvar} disabled={!cliente} className="flex-1 gap-2">
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
              <Button
                variant="outline"
                disabled={!cliente || !calculo}
                className="gap-2"
                onClick={async () => {
                  if (!calculo || !produtoSelecionado) return;
                  sonnerToast.info("Gerando PDF profissional...");
                  await generateProfessionalBudgetPDF(
                    {
                      cliente,
                      produto: produtoSelecionado.label,
                      larguraCm: largura,
                      alturaCm: altura,
                      quantidade,
                      areaM2: calculo.areaM2,
                      custoTotal: calculo.custo,
                      margem: calculo.lucro,
                      valorFinal: calculo.total,
                      corAluminio: getColorById(colorId).name,
                      corFerragem: ferragemColors.find(c => c.id === ferragemColorId)?.name,
                      tipoVidro: vidroTipo,
                      ambiente,
                      observacoes,
                      validadeDias: 15,
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
          </div>
        </div>
      </div>

      {/* Material Detail Dialog */}
      {produtoSelecionado && (
        <MaterialDetailDialog
          open={materialDialogOpen}
          onOpenChange={setMaterialDialogOpen}
          typologyId={produtoSelecionado.typologyId}
          larguraCm={largura}
          alturaCm={altura}
          quantidade={quantidade}
          colorName={getColorById(colorId).name}
          colorHex={getColorById(colorId).hex}
        />
      )}
    </div>
  );
};

export default CriarOrcamento;
