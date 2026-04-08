import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/formatters";
import { ArrowLeft, FileDown, Minus, Plus, Pencil, Trash2, List, MessageCircle, CreditCard, Percent } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { useCreateOrcamento, useUpdateOrcamento, useOrcamentoById } from "@/hooks/use-orcamentos";
import { useAddOrcamentoHistorico } from "@/hooks/use-orcamento-historico";
import { FramePreview } from "@/components/frame-preview";
import { getColorById, aluminumColors } from "@/components/frame-preview/colors";
import Frame3DWrapper from "@/components/frame-preview/Frame3DWrapper";
import { generateProfessionalBudgetPDF } from "@/utils/budgetPdfGenerator";
import { cn } from "@/lib/utils";
import MaterialDetailDialog from "@/components/orcamento/MaterialDetailDialog";
import { OrcamentoAiHelper } from "@/components/ai/OrcamentoAiHelper";
import { tiposProduto, formasPagamento, validateDimensions } from "@/data/orcamento-produtos";

const vidroOptions = ["Comum", "Temperado", "Laminado", "Jateado", "Nenhum"];
const ferragemColors = [
  { id: "cromado", name: "Cromado", hex: "#C0C0C0" },
  { id: "preto", name: "Preto", hex: "#333333" },
  { id: "branco", name: "Branco", hex: "#F0F0F0" },
  { id: "bronze", name: "Bronze", hex: "#8B6914" },
];

interface OrcamentoItem {
  id: string;
  tipo: string;
  largura: number;
  altura: number;
  quantidade: number;
  colorId: string;
  ferragemColorId: string;
  vidroTipo: string;
  ambiente: string;
}

const createEmptyItem = (): OrcamentoItem => ({
  id: crypto.randomUUID(),
  tipo: "janela_correr_2f",
  largura: 200,
  altura: 120,
  quantidade: 1,
  colorId: "natural",
  ferragemColorId: "preto",
  vidroTipo: "Nenhum",
  ambiente: "",
});

const CriarOrcamento = () => {
  const navigate = useNavigate();
  const { id: editId } = useParams<{ id: string }>();
  const isEditing = !!editId;
  const createOrcamento = useCreateOrcamento();
  const updateOrcamento = useUpdateOrcamento();
  const addHistorico = useAddOrcamentoHistorico();
  const { data: existingOrc } = useOrcamentoById(editId);

  const [cliente, setCliente] = useState("");
  const [items, setItems] = useState<OrcamentoItem[]>([createEmptyItem()]);
  const [activeItemIdx, setActiveItemIdx] = useState(0);
  const [margemPercent, setMargemPercent] = useState(100);
  const [acrescimo, setAcrescimo] = useState(0);
  const [temAcrescimo, setTemAcrescimo] = useState(false);
  const [observacoes, setObservacoes] = useState("");
  // Discount & payment
  const [descontoTipo, setDescontoTipo] = useState<"percent" | "valor">("percent");
  const [descontoValor, setDescontoValor] = useState(0);
  const [formaPagamento, setFormaPagamento] = useState("pix");
  const [parcelas, setParcelas] = useState(1);
  const [loaded, setLoaded] = useState(false);

  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);

  // Load existing orcamento data when editing
  useEffect(() => {
    if (existingOrc && !loaded) {
      setCliente(existingOrc.cliente);
      const itens = existingOrc.itens as Record<string, any> | null;
      if (itens) {
        // Support new multi-item format
        if (itens.items && Array.isArray(itens.items)) {
          setItems(itens.items.map((item: any) => ({
            id: crypto.randomUUID(),
            tipo: item.tipo ?? "janela_correr_2f",
            largura: item.largura_cm ?? 200,
            altura: item.altura_cm ?? 120,
            quantidade: item.quantidade ?? 1,
            colorId: item.cor_aluminio ?? "natural",
            ferragemColorId: item.cor_ferragem ?? "preto",
            vidroTipo: item.vidro_tipo ?? "Nenhum",
            ambiente: item.ambiente ?? "",
          })));
        } else {
          // Old single-item format
          setItems([{
            id: crypto.randomUUID(),
            tipo: itens.tipo ?? "janela_correr_2f",
            largura: itens.largura_cm ?? 200,
            altura: itens.altura_cm ?? 120,
            quantidade: itens.quantidade ?? 1,
            colorId: itens.cor_aluminio ?? "natural",
            ferragemColorId: itens.cor_ferragem ?? "preto",
            vidroTipo: itens.vidro_tipo ?? "Nenhum",
            ambiente: itens.ambiente ?? "",
          }]);
        }
        setMargemPercent(itens.margem_percent ?? 100);
        setAcrescimo(itens.acrescimo ?? 0);
        setTemAcrescimo((itens.acrescimo ?? 0) > 0);
        setObservacoes(itens.observacoes ?? "");
        setDescontoTipo(itens.desconto_tipo ?? "percent");
        setDescontoValor(itens.desconto_valor ?? 0);
        setFormaPagamento(itens.forma_pagamento ?? "pix");
        setParcelas(itens.parcelas ?? 1);
      }
      setLoaded(true);
    }
  }, [existingOrc, loaded]);

  const activeItem = items[activeItemIdx] || items[0];
  const produtoSelecionado = tiposProduto.find((t) => t.value === activeItem?.tipo);

  const updateItem = (idx: number, updates: Partial<OrcamentoItem>) => {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, ...updates } : item));
  };

  const addItem = () => {
    const newItem = createEmptyItem();
    setItems(prev => [...prev, newItem]);
    setActiveItemIdx(items.length);
  };

  const removeItem = (idx: number) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, i) => i !== idx));
    if (activeItemIdx >= items.length - 1) setActiveItemIdx(Math.max(0, items.length - 2));
  };

  const calculo = useMemo(() => {
    let totalCusto = 0;
    let totalArea = 0;
    const itemCalcs = items.map(item => {
      const produto = tiposProduto.find((t) => t.value === item.tipo);
      if (!produto) return null;
      const areaM2 = (item.largura / 100) * (item.altura / 100);
      const custo = areaM2 * produto.precoM2 * item.quantidade;
      totalCusto += custo;
      totalArea += areaM2 * item.quantidade;
      return { areaM2, custo };
    });

    const lucro = totalCusto * (margemPercent / 100);
    const subtotal = totalCusto + lucro;
    const acrescimoVal = temAcrescimo ? acrescimo : 0;
    const beforeDiscount = subtotal + acrescimoVal;
    const descontoCalc = descontoValor > 0
      ? descontoTipo === "percent"
        ? beforeDiscount * (descontoValor / 100)
        : descontoValor
      : 0;
    const total = Math.max(0, beforeDiscount - descontoCalc);
    return { totalArea, custo: totalCusto, lucro, subtotal, acrescimo: acrescimoVal, desconto: descontoCalc, total, itemCalcs };
  }, [items, margemPercent, temAcrescimo, acrescimo, descontoTipo, descontoValor]);

  const hasValidationErrors = items.some(item => validateDimensions(item.tipo, item.largura, item.altura) !== null);

  const handleSalvar = async () => {
    if (!calculo || !cliente) return;
    if (hasValidationErrors) {
      toast({ title: "Dimensões inválidas", description: "Corrija as dimensões fora dos limites antes de salvar.", variant: "destructive" });
      return;
    }
    const itemsData = items.map((item, i) => {
      const produto = tiposProduto.find(t => t.value === item.tipo);
      const ic = calculo.itemCalcs[i];
      return {
        tipo: item.tipo,
        largura_cm: item.largura,
        altura_cm: item.altura,
        quantidade: item.quantidade,
        area_m2: ic?.areaM2 ?? 0,
        custo: ic?.custo ?? 0,
        cor_aluminio: item.colorId,
        cor_ferragem: item.ferragemColorId,
        vidro_tipo: item.vidroTipo,
        ambiente: item.ambiente,
        subtotal: ic?.custo ?? 0,
      };
    });

    const produtoLabel = items.length === 1
      ? tiposProduto.find(t => t.value === items[0].tipo)?.label ?? "Esquadria"
      : `${items.length} itens`;

    const payload = {
      cliente,
      produto: produtoLabel,
      valor: calculo.total,
      itens: {
        items: itemsData,
        margem_percent: margemPercent,
        acrescimo: calculo.acrescimo,
        desconto_tipo: descontoTipo,
        desconto_valor: descontoValor,
        forma_pagamento: formaPagamento,
        parcelas,
        observacoes,
        // Keep backward-compat flat keys for single item
        ...(items.length === 1 ? {
          tipo: items[0].tipo,
          largura_cm: items[0].largura,
          altura_cm: items[0].altura,
          quantidade: items[0].quantidade,
          area_m2: calculo.itemCalcs[0]?.areaM2 ?? 0,
          custo: calculo.custo,
          lucro: calculo.lucro,
          subtotal: calculo.subtotal,
          cor_aluminio: items[0].colorId,
          cor_ferragem: items[0].ferragemColorId,
          vidro_tipo: items[0].vidroTipo,
          ambiente: items[0].ambiente,
        } : {}),
      },
    };
    try {
      if (isEditing && editId) {
        await updateOrcamento.mutateAsync({ ...payload, id: editId });
        toast({ title: "Orçamento atualizado!", description: `Orçamento para ${cliente} atualizado.` });
      } else {
        const result = await createOrcamento.mutateAsync(payload);
        // Add history entry for creation
        if (result?.id) {
          addHistorico.mutate({ orcamento_id: result.id, status_anterior: null, status_novo: "pendente" });
        }
        toast({ title: "Orçamento criado!", description: `Orçamento para ${cliente} salvo com sucesso.` });
      }
      navigate("/orcamentos");
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    }
  };

  const handleLimpar = () => {
    setCliente("");
    setItems([createEmptyItem()]);
    setActiveItemIdx(0);
    setMargemPercent(100);
    setAcrescimo(0);
    setTemAcrescimo(false);
    setObservacoes("");
    setDescontoTipo("percent");
    setDescontoValor(0);
    setFormaPagamento("pix");
    setParcelas(1);
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
          <OrcamentoAiHelper />
          {!isEditing && <Button variant="ghost" size="sm" onClick={handleLimpar}>Limpar</Button>}
          <Button size="sm" onClick={handleSalvar} className="bg-primary">
            {isEditing ? "Atualizar" : "Salvar"}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Preview + Items list */}
        <div className="w-[280px] shrink-0 border-r border-border/50 flex flex-col bg-muted/30">
          <div className="flex-1 flex items-center justify-center p-4">
            <Frame3DWrapper className="flex items-center justify-center">
              <div id="budget-frame-preview">
                <FramePreview
                  width_mm={activeItem.largura * 10}
                  height_mm={activeItem.altura * 10}
                  category={produtoSelecionado?.category ?? "janela_correr"}
                  subcategory={produtoSelecionado?.subcategory ?? "2_folhas"}
                  num_folhas={produtoSelecionado?.numFolhas ?? 2}
                  has_veneziana={produtoSelecionado?.veneziana}
                  colorId={activeItem.colorId}
                  maxWidth={220}
                  maxHeight={200}
                />
              </div>
            </Frame3DWrapper>
          </div>

          {/* Items list */}
          <div className="px-3 pb-3 space-y-1 border-t border-border/50 pt-3 max-h-[200px] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Itens ({items.length})</p>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={addItem}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
            {items.map((item, idx) => {
              const prod = tiposProduto.find(t => t.value === item.tipo);
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveItemIdx(idx)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors text-xs",
                    activeItemIdx === idx ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/50"
                  )}
                >
                  <div className="shrink-0 w-8 h-8 bg-muted/40 rounded flex items-center justify-center">
                    <FramePreview
                      width_mm={item.largura * 10}
                      height_mm={item.altura * 10}
                      category={prod?.category ?? "janela_correr"}
                      subcategory={prod?.subcategory ?? "2_folhas"}
                      num_folhas={prod?.numFolhas ?? 2}
                      has_veneziana={prod?.veneziana}
                      colorId={item.colorId}
                      maxWidth={24}
                      maxHeight={24}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{prod?.label ?? "Item"}</p>
                    <p className="text-muted-foreground text-[10px]">{item.largura * 10}×{item.altura * 10}mm</p>
                  </div>
                  {items.length > 1 && (
                    <Button
                      variant="ghost" size="icon" className="h-5 w-5 shrink-0 text-destructive/60 hover:text-destructive"
                      onClick={(e) => { e.stopPropagation(); removeItem(idx); }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </button>
              );
            })}
          </div>

          <div className="px-4 pb-4 border-t border-border/50 pt-3 space-y-1">
            <p className="text-sm font-bold uppercase tracking-wide">
              {produtoSelecionado?.label ?? "Selecione"}
            </p>
            <p className="text-xs text-muted-foreground">{cliente || "Cliente não informado"}</p>
            <button
              onClick={() => setMaterialDialogOpen(true)}
              className="flex items-center gap-1 text-xs text-primary font-medium mt-1 hover:underline"
            >
              <List className="h-3 w-3" /> Ver materiais
            </button>
          </div>
        </div>

        {/* Right panel - Form */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-xl mx-auto p-6 space-y-6">
            {/* Cliente */}
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Input placeholder="Nome do cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} />
            </div>

            {/* Current item form */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Tipo de Produto {items.length > 1 && `(Item ${activeItemIdx + 1})`}</Label>
              </div>
              <Select value={activeItem.tipo} onValueChange={(v) => updateItem(activeItemIdx, { tipo: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {tiposProduto.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dimensões */}
            {(() => {
              const dimErrors = validateDimensions(activeItem.tipo, activeItem.largura, activeItem.altura);
              const prod = tiposProduto.find(t => t.value === activeItem.tipo);
              return (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Largura (cm)</Label>
                      <Input
                        type="number"
                        value={activeItem.largura}
                        onChange={(e) => updateItem(activeItemIdx, { largura: Number(e.target.value) })}
                        className={cn(dimErrors?.largura && "border-destructive focus-visible:ring-destructive")}
                      />
                      {dimErrors?.largura ? (
                        <p className="text-[11px] font-medium text-destructive">{dimErrors.largura}</p>
                      ) : prod && (
                        <p className="text-[10px] text-muted-foreground">{prod.minLarguraCm}–{prod.maxLarguraCm} cm</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label>Altura (cm)</Label>
                      <Input
                        type="number"
                        value={activeItem.altura}
                        onChange={(e) => updateItem(activeItemIdx, { altura: Number(e.target.value) })}
                        className={cn(dimErrors?.altura && "border-destructive focus-visible:ring-destructive")}
                      />
                      {dimErrors?.altura ? (
                        <p className="text-[11px] font-medium text-destructive">{dimErrors.altura}</p>
                      ) : prod && (
                        <p className="text-[10px] text-muted-foreground">{prod.minAlturaCm}–{prod.maxAlturaCm} cm</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Tipo de vidro */}
            <div className="space-y-2">
              <Label>Tipo de vidro</Label>
              <div className="flex flex-wrap gap-2">
                {vidroOptions.map((v) => (
                  <button
                    key={v}
                    onClick={() => updateItem(activeItemIdx, { vidroTipo: v })}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                      activeItem.vidroTipo === v
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
                    onClick={() => updateItem(activeItemIdx, { colorId: c.id })}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                      activeItem.colorId === c.id
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-muted/30 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <span className="w-4 h-4 rounded-full border border-border/50" style={{ backgroundColor: c.hex }} />
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
                    onClick={() => updateItem(activeItemIdx, { ferragemColorId: c.id })}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                      activeItem.ferragemColorId === c.id
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-muted/30 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <span className="w-4 h-4 rounded-full border border-border/50" style={{ backgroundColor: c.hex }} />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantidade */}
            <div className="space-y-2">
              <Label>Quantidade</Label>
              <div className="flex items-center gap-0">
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-r-none" onClick={() => updateItem(activeItemIdx, { quantidade: Math.max(1, activeItem.quantidade - 1) })}>
                  <Minus className="h-4 w-4" />
                </Button>
                <Input type="number" value={activeItem.quantidade} onChange={(e) => updateItem(activeItemIdx, { quantidade: Math.max(1, Number(e.target.value)) })} className="rounded-none text-center w-full border-x-0" min={1} />
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-l-none" onClick={() => updateItem(activeItemIdx, { quantidade: activeItem.quantidade + 1 })}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Ambiente */}
            <div className="space-y-2">
              <Label>Ambiente (opcional)</Label>
              <Input placeholder="Ex: Sala, Quarto, Cozinha..." value={activeItem.ambiente} onChange={(e) => updateItem(activeItemIdx, { ambiente: e.target.value })} />
            </div>

            {/* Add another item button */}
            <Button variant="outline" className="w-full gap-2 border-dashed" onClick={addItem}>
              <Plus className="h-4 w-4" /> Adicionar outro item
            </Button>

            {/* Separator - global settings */}
            <div className="border-t pt-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Condições gerais</p>
            </div>

            {/* Margem de lucro */}
            <div className="space-y-2">
              <Label>Margem de lucro</Label>
              <div className="flex items-center gap-0">
                <span className="flex items-center justify-center h-10 w-10 bg-primary text-primary-foreground rounded-l-md text-sm font-bold shrink-0">%</span>
                <Input type="number" value={margemPercent} onChange={(e) => setMargemPercent(Number(e.target.value))} className="rounded-l-none" min={0} />
              </div>
            </div>

            {/* Acréscimo */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-0">
                <button onClick={() => setTemAcrescimo(false)} className={cn("py-2.5 text-sm font-medium rounded-l-lg border transition-colors", !temAcrescimo ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 text-muted-foreground border-border")}>
                  Sem acréscimo
                </button>
                <button onClick={() => setTemAcrescimo(true)} className={cn("py-2.5 text-sm font-medium rounded-r-lg border border-l-0 transition-colors", temAcrescimo ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 text-muted-foreground border-border")}>
                  Adicionar acréscimo
                </button>
              </div>
              {temAcrescimo && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">R$</span>
                  <Input type="number" value={acrescimo} onChange={(e) => setAcrescimo(Number(e.target.value))} placeholder="0,00" min={0} />
                </div>
              )}
            </div>

            {/* Desconto */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Percent className="h-3.5 w-3.5" /> Desconto</Label>
              <div className="flex gap-2">
                <div className="grid grid-cols-2 gap-0 flex-1">
                  <button onClick={() => setDescontoTipo("percent")} className={cn("py-2 text-sm font-medium rounded-l-lg border transition-colors", descontoTipo === "percent" ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 text-muted-foreground border-border")}>
                    %
                  </button>
                  <button onClick={() => setDescontoTipo("valor")} className={cn("py-2 text-sm font-medium rounded-r-lg border border-l-0 transition-colors", descontoTipo === "valor" ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 text-muted-foreground border-border")}>
                    R$
                  </button>
                </div>
                <Input type="number" value={descontoValor} onChange={(e) => setDescontoValor(Number(e.target.value))} placeholder="0" min={0} className="w-32" />
              </div>
            </div>

            {/* Forma de pagamento */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5" /> Forma de pagamento</Label>
              <Select value={formaPagamento} onValueChange={setFormaPagamento}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {formasPagamento.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Parcelas */}
            <div className="space-y-2">
              <Label>Parcelas</Label>
              <div className="flex items-center gap-0">
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-r-none" onClick={() => setParcelas(Math.max(1, parcelas - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <Input type="number" value={parcelas} onChange={(e) => setParcelas(Math.max(1, Number(e.target.value)))} className="rounded-none text-center w-full border-x-0" min={1} />
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-l-none" onClick={() => setParcelas(parcelas + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {parcelas > 1 && calculo && (
                <p className="text-xs text-muted-foreground">{parcelas}x de {formatCurrency(calculo.total / parcelas)}</p>
              )}
            </div>

            {/* Observações */}
            <div className="space-y-2">
              <Label>Observações (opcional)</Label>
              <Textarea placeholder="Observações adicionais..." value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows={3} />
            </div>

            {/* Cost summary */}
            {calculo && (
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Custo ({items.length} {items.length === 1 ? "item" : "itens"})</span>
                  <span className="font-medium text-destructive">{formatCurrency(calculo.custo)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Lucro ({margemPercent}%)</span>
                  <span className="font-medium text-green-600">{formatCurrency(calculo.lucro)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(calculo.subtotal)}</span>
                </div>
                {calculo.acrescimo > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Acréscimo</span>
                    <span className="font-medium">+ {formatCurrency(calculo.acrescimo)}</span>
                  </div>
                )}
                {calculo.desconto > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Desconto</span>
                    <span className="font-medium text-green-600">- {formatCurrency(calculo.desconto)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-bold text-base">TOTAL</span>
                  <span className="font-bold text-lg">{formatCurrency(calculo.total)}</span>
                </div>
                {parcelas > 1 && (
                  <p className="text-xs text-muted-foreground text-right">{parcelas}x de {formatCurrency(calculo.total / parcelas)} • {formasPagamento.find(f => f.value === formaPagamento)?.label}</p>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 pb-6">
              <Button onClick={handleSalvar} disabled={!cliente} className="flex-1 gap-2">
                <Plus className="h-4 w-4" />
                {isEditing ? "Atualizar" : "Adicionar"}
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
                      larguraCm: activeItem.largura,
                      alturaCm: activeItem.altura,
                      quantidade: activeItem.quantidade,
                      areaM2: calculo.totalArea,
                      custoTotal: calculo.custo,
                      margem: calculo.lucro,
                      valorFinal: calculo.total,
                      corAluminio: getColorById(activeItem.colorId).name,
                      corFerragem: ferragemColors.find(c => c.id === activeItem.ferragemColorId)?.name,
                      tipoVidro: activeItem.vidroTipo,
                      ambiente: activeItem.ambiente,
                      observacoes,
                      validadeDias: 15,
                    },
                    "budget-frame-preview"
                  );
                  sonnerToast.success("PDF exportado!");
                }}
              >
                <FileDown className="h-4 w-4" /> PDF
              </Button>
              <Button
                variant="outline"
                disabled={!cliente || !calculo}
                className="gap-2 text-green-600 border-green-600/30 hover:bg-green-600/10"
                onClick={() => {
                  if (!calculo) return;
                  const itemsDesc = items.map(item => {
                    const prod = tiposProduto.find(t => t.value === item.tipo);
                    return `📐 *${prod?.label}* ${item.largura * 10}×${item.altura * 10}mm (${item.quantidade}un)`;
                  }).join("\n");
                  const msg = [
                    `Olá${cliente ? ` ${cliente}` : ""}! Segue seu orçamento:`,
                    "",
                    itemsDesc,
                    "",
                    `💰 *Valor: ${formatCurrency(calculo.total)}*`,
                    parcelas > 1 ? `💳 ${parcelas}x de ${formatCurrency(calculo.total / parcelas)}` : "",
                    "",
                    observacoes ? `Obs: ${observacoes}\n` : "",
                    "Válido por 15 dias.",
                  ].filter(Boolean).join("\n");
                  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
                  sonnerToast.success("WhatsApp aberto!");
                }}
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
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
          larguraCm={activeItem.largura}
          alturaCm={activeItem.altura}
          quantidade={activeItem.quantidade}
          colorName={getColorById(activeItem.colorId).name}
          colorHex={getColorById(activeItem.colorId).hex}
        />
      )}
    </div>
  );
};

export default CriarOrcamento;
