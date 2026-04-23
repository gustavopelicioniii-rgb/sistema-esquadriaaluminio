import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useCreateOrcamento, useUpdateOrcamento, useOrcamentoById } from "@/hooks/use-orcamentos";
import { useAddOrcamentoHistorico } from "@/hooks/use-orcamento-historico";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { tiposProduto, formasPagamento, validateDimensions } from "@/data/orcamento-produtos";
import { ArrowLeft, ArrowRight, Check, FileDown, MessageCircle, Plus, Minus, Trash2, List, Pencil } from "lucide-react";
import { generateProposalPDF } from "@/utils/generateProposalPdf";
import { getColorById, aluminumColors } from "@/components/frame-preview/colors";
import MaterialDetailDialog from "@/components/orcamento/MaterialDetailDialog";
import { OrcamentoAiHelper } from "@/components/ai/OrcamentoAiHelper";
import Frame3DWrapper from "@/components/frame-preview/Frame3DWrapper";
import PhotorealisticPreview from "@/components/frame-preview/PhotorealisticPreview";
import { FramePreview } from "@/components/frame-preview";
import { CreditCard, Percent } from "lucide-react";

// Types
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

type WizardStep = "cliente" | "itens" | "condicoes" | "revisao";

const vidroOptions = ["Comum", "Temperado", "Laminado", "Jateado", "Nenhum"];
const ferragemColors = [
  { id: "cromado", name: "Cromado", hex: "#C0C0C0" },
  { id: "preto", name: "Preto", hex: "#333333" },
  { id: "branco", name: "Branco", hex: "#F0F0F0" },
  { id: "bronze", name: "Bronze", hex: "#8B6914" },
];

const STEPS: { id: WizardStep; label: string }[] = [
  { id: "cliente", label: "Cliente" },
  { id: "itens", label: "Itens" },
  { id: "condicoes", label: "Condições" },
  { id: "revisao", label: "Revisão" },
];

const DRAFT_KEY = "orcamento_draft";

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

interface DraftData {
  cliente: string;
  items: OrcamentoItem[];
  margemPercent: number;
  acrescimo: number;
  temAcrescimo: boolean;
  descontoTipo: "percent" | "valor";
  descontoValor: number;
  formaPagamento: string;
  parcelas: number;
  observacoes: string;
  lastUpdate: number;
}

export default function CriarOrcamentoWizard() {
  const navigate = useNavigate();
  const { id: editId } = useParams<{ id: string }>();
  const isEditing = !!editId;
  const createOrcamento = useCreateOrcamento();
  const updateOrcamento = useUpdateOrcamento();
  const addHistorico = useAddOrcamentoHistorico();
  const { data: existingOrc } = useOrcamentoById(editId);

  // Current step
  const [currentStep, setCurrentStep] = useState<WizardStep>("cliente");

  // Form state
  const [cliente, setCliente] = useState("");
  const [items, setItems] = useState<OrcamentoItem[]>([createEmptyItem()]);
  const [activeItemIdx, setActiveItemIdx] = useState(0);
  const [margemPercent, setMargemPercent] = useState(100);
  const [acrescimo, setAcrescimo] = useState(0);
  const [temAcrescimo, setTemAcrescimo] = useState(false);
  const [observacoes, setObservacoes] = useState("");
  const [descontoTipo, setDescontoTipo] = useState<"percent" | "valor">("percent");
  const [descontoValor, setDescontoValor] = useState(0);
  const [formaPagamento, setFormaPagamento] = useState("pix");
  const [parcelas, setParcelas] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);

  // Autosave draft
  const saveDraft = useCallback(() => {
    if (isEditing) return;
    const draft: DraftData = {
      cliente, items, margemPercent, acrescimo, temAcrescimo,
      descontoTipo, descontoValor, formaPagamento, parcelas, observacoes,
      lastUpdate: Date.now(),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [cliente, items, margemPercent, acrescimo, temAcrescimo, descontoTipo, descontoValor, formaPagamento, parcelas, observacoes, isEditing]);

  // Load draft on mount (only for new orçamento)
  useEffect(() => {
    if (!isEditing && !loaded) {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        try {
          const draft: DraftData = JSON.parse(saved);
          // Only restore if draft is less than 24h old
          if (Date.now() - draft.lastUpdate < 24 * 60 * 60 * 1000) {
            setCliente(draft.cliente);
            setItems(draft.items.length > 0 ? draft.items : [createEmptyItem()]);
            setMargemPercent(draft.margemPercent);
            setAcrescimo(draft.acrescimo);
            setTemAcrescimo(draft.temAcrescimo);
            setDescontoTipo(draft.descontoTipo);
            setDescontoValor(draft.descontoValor);
            setFormaPagamento(draft.formaPagamento);
            setParcelas(draft.parcelas);
            setObservacoes(draft.observacoes);
            toast.success("Rascunho restaurado!", { description: "Seu orçamento anterior foi recuperado." });
          }
        } catch { /* ignore */ }
      }
      setLoaded(true);
    }
  }, [isEditing, loaded]);

  // Autosave every 30 seconds
  useEffect(() => {
    if (isEditing) return;
    const interval = setInterval(saveDraft, 30000);
    return () => clearInterval(interval);
  }, [saveDraft, isEditing]);

  // Load existing data when editing
  useEffect(() => {
    if (existingOrc && !loaded && isEditing) {
      setCliente(existingOrc.cliente);
      const itens = existingOrc.itens as Record<string, any> | null;
      if (itens) {
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
  }, [existingOrc, loaded, isEditing]);

  const activeItem = items[activeItemIdx] || items[0];
  const produtoSelecionado = tiposProduto.find((t) => t.value === activeItem?.tipo);

  // Calculations
  const calculo = {
    totalArea: items.reduce((sum, item) => {
      const prod = tiposProduto.find(t => t.value === item.tipo);
      if (!prod) return sum;
      const areaM2 = (item.largura / 100) * (item.altura / 100) * item.quantidade;
      return sum + areaM2;
    }, 0),
    totalCusto: items.reduce((sum, item) => {
      const prod = tiposProduto.find(t => t.value === item.tipo);
      if (!prod) return sum;
      const areaM2 = (item.largura / 100) * (item.altura / 100);
      return sum + areaM2 * prod.precoM2 * item.quantidade;
    }, 0),
  };

  const totalCusto = calculo.totalCusto;
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

  const hasValidationErrors = items.some(item => validateDimensions(item.tipo, item.largura, item.altura) !== null);

  // Step navigation
  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
  const canGoNext = currentStep === "cliente" ? !!cliente.trim() : !hasValidationErrors;
  const canGoBack = currentStepIndex > 0;

  const goNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentStepIndex + 1].id);
    }
  };
  const goBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(STEPS[currentStepIndex - 1].id);
    }
  };

  // Item management
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

  // Save
  const handleSalvar = async () => {
    if (!cliente) return;
    if (hasValidationErrors) {
      toast.error("Dimensões inválidas", { description: "Corrija as dimensões fora dos limites." });
      return;
    }
    const itemsData = items.map((item) => {
      const prod = tiposProduto.find(t => t.value === item.tipo);
      const areaM2 = (item.largura / 100) * (item.altura / 100) * item.quantidade;
      const custo = areaM2 * (prod?.precoM2 || 0);
      return {
        tipo: item.tipo,
        largura_cm: item.largura,
        altura_cm: item.altura,
        quantidade: item.quantidade,
        area_m2: areaM2,
        custo,
        cor_aluminio: item.colorId,
        cor_ferragem: item.ferragemColorId,
        vidro_tipo: item.vidroTipo,
        ambiente: item.ambiente,
        subtotal: custo,
      };
    });

    const produtoLabel = items.length === 1
      ? tiposProduto.find(t => t.value === items[0].tipo)?.label ?? "Esquadria"
      : `${items.length} itens`;

    const payload = {
      cliente,
      produto: produtoLabel,
      valor: total,
      itens: {
        items: itemsData,
        margem_percent: margemPercent,
        acrescimo: acrescimoVal,
        desconto_tipo: descontoTipo,
        desconto_valor: descontoValor,
        forma_pagamento: formaPagamento,
        parcelas,
        observacoes,
      },
    };

    try {
      if (isEditing && editId) {
        await updateOrcamento.mutateAsync({ ...payload, id: editId });
        toast.success("Orçamento atualizado!");
      } else {
        const result = await createOrcamento.mutateAsync(payload);
        if (result?.id) {
          addHistorico.mutate({ orcamento_id: result.id, status_anterior: null, status_novo: "pendente" });
        }
        toast.success("Orçamento criado!");
        // Clear draft
        localStorage.removeItem(DRAFT_KEY);
      }
      navigate("/orcamentos");
    } catch (err: any) {
      toast.error("Erro ao salvar", { description: err.message });
    }
  };

  // PDF generation
  const handlePDF = async () => {
    toast.info("Gerando PDF...");
    const imageUrlByType: Record<string, string> = {
      'janela_correr_2f': 'https://aluflow-landing.vercel.app/images/typologies/tipologia-janela-correr-2p---photorealistic-01.png',
      'janela_correr_4f': 'https://aluflow-landing.vercel.app/images/typologies/tipologia-janela-correr-4p---photorealistic-02.png',
      'porta_correr_2f': 'https://aluflow-landing.vercel.app/images/typologies/tipologia-porta-correr-2p---photorealistic-03.png',
      'porta_correr_4f': 'https://aluflow-landing.vercel.app/images/typologies/tipologia-porta-correr-4p---photorealistic-04.png',
      'janela_maximar_1f': 'https://aluflow-landing.vercel.app/images/typologies/tipologia-janela-maxair---photorealistic-07.png',
      'janela_maximar_2f': 'https://aluflow-landing.vercel.app/images/typologies/tipologia-janela-maxair---photorealistic-07.png',
      'porta_giro_1f': 'https://aluflow-landing.vercel.app/images/typologies/tipologia-janela-giro---photorealistic-05.png',
      'porta_giro_2f': 'https://aluflow-landing.vercel.app/images/typologies/tipologia-janela-giro---photorealistic-05.png',
      'janela_veneziana': 'https://aluflow-landing.vercel.app/images/typologies/tipologia-janela-persiana---photorealistic-11.png',
      'janela_camarao': 'https://aluflow-landing.vercel.app/images/typologies/tipologia-janela-persiana---photorealistic-11.png',
    };

    const pdf = await generateProposalPDF({
      cliente: { nome: cliente || "Cliente" },
      vendedor: "AluFlow",
      tratamento: getColorById(activeItem.colorId).name,
      validadeDias: 15,
      prazo: "A combinar",
      observacoes: observacoes,
      itens: [{
        codigo: produtoSelecionado?.value.toUpperCase() || "",
        nome: produtoSelecionado?.label || "",
        linha: produtoSelecionado?.line || "Padrão",
        tratamento: getColorById(activeItem.colorId).name,
        localizacao: activeItem.ambiente || "-",
        larguraMm: activeItem.largura * 10,
        alturaMm: activeItem.altura * 10,
        quantidade: activeItem.quantidade,
        valorUnitario: total / activeItem.quantidade,
        valorTotal: total,
        descricaoCompleta: `${produtoSelecionado?.label} - ${activeItem.vidroTipo} - ${ferragemColors.find(c => c.id === activeItem.ferragemColorId)?.name || "Cromado"}`,
        imagemUrl: imageUrlByType[produtoSelecionado?.value || ""] || null,
      }],
    });
    pdf.save(`proposta-orcamento-${Date.now()}.pdf`);
    toast.success("PDF exportado!");
  };

  // WhatsApp
  const handleWhatsApp = () => {
    const itemsDesc = items.map(item => {
      const prod = tiposProduto.find(t => t.value === item.tipo);
      return `📐 *${prod?.label}* ${item.largura * 10}×${item.altura * 10}mm (${item.quantidade}un)`;
    }).join("\n");
    const msg = [
      `Olá${cliente ? ` ${cliente}` : ""}! Segue seu orçamento:`,
      "",
      itemsDesc,
      "",
      `💰 *Valor: ${formatCurrency(total)}*`,
      parcelas > 1 ? `💳 ${parcelas}x de ${formatCurrency(total / parcelas)}` : "",
      "",
      observacoes ? `Obs: ${observacoes}\n` : "",
      "Válido por 15 dias.",
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
    toast.success("WhatsApp aberto!");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/orcamentos")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-muted-foreground">Orçamentos</span>
        </div>
        <div className="flex items-center gap-2">
          <OrcamentoAiHelper />
          {!isEditing && (
            <Button variant="ghost" size="sm" onClick={() => {
              localStorage.removeItem(DRAFT_KEY);
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
              toast.success("Rascunho limpo!");
            }}>Limpar</Button>
          )}
        </div>
      </div>

      {/* Stepper */}
      <div className="border-b px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => idx < currentStepIndex + 1 && setCurrentStep(step.id)}
                disabled={idx > currentStepIndex + 1}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                  currentStep === step.id
                    ? "bg-primary text-primary-foreground"
                    : idx < currentStepIndex
                    ? "bg-primary/20 text-primary cursor-pointer"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {idx < currentStepIndex ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="h-5 w-5 rounded-full bg-current/20 text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                )}
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {idx < STEPS.length - 1 && (
                <div className={cn("w-8 h-0.5 mx-1", idx < currentStepIndex ? "bg-primary" : "bg-muted")} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* STEP 1: Cliente */}
        {currentStep === "cliente" && (
          <div className="max-w-md mx-auto p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Dados do Cliente</h2>
              <p className="text-muted-foreground text-sm">Informe o nome do cliente para este orçamento</p>
            </div>
            <div className="space-y-2">
              <Label>Cliente *</Label>
              <Input
                placeholder="Nome completo ou empresa"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                autoFocus
              />
            </div>
          </div>
        )}

        {/* STEP 2: Itens */}
        {currentStep === "itens" && (
          <div className="flex h-full">
            {/* Left sidebar - Items list */}
            <div className="w-[260px] shrink-0 border-r bg-muted/30 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Itens ({items.length})</p>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={addItem}>
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="space-y-1 max-h-[calc(100vh-300px)] overflow-y-auto">
                {items.map((item, idx) => {
                  const prod = tiposProduto.find(t => t.value === item.tipo);
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveItemIdx(idx)}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-colors text-xs",
                        activeItemIdx === idx ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/50"
                      )}
                    >
                      <div className="w-8 h-8 bg-muted/40 rounded flex items-center justify-center shrink-0">
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
                        <Button variant="ghost" size="icon" className="h-5 w-5 shrink-0 text-destructive/60 hover:text-destructive"
                          onClick={(e) => { e.stopPropagation(); removeItem(idx); }}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </button>
                  );
                })}
              </div>
              <Button variant="outline" className="w-full gap-1 text-xs" onClick={addItem}>
                <Plus className="h-3 w-3" /> Adicionar item
              </Button>
              {produtoSelecionado && (
                <button
                  onClick={() => setMaterialDialogOpen(true)}
                  className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                >
                  <List className="h-3 w-3" /> Ver materiais
                </button>
              )}
            </div>

            {/* Right - Item form */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-xl mx-auto p-6 space-y-6">
                <div className="space-y-2">
                  <Label>Tipo de Produto</Label>
                  <Select value={activeItem.tipo} onValueChange={(v) => updateItem(activeItemIdx, { tipo: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {tiposProduto.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Preview */}
                <div className="flex items-center justify-center bg-muted/30 rounded-lg p-4">
                  <Frame3DWrapper className="flex items-center justify-center">
                    <PhotorealisticPreview
                      imagemUrl={produtoSelecionado?.imagem_url}
                      width_mm={activeItem.largura * 10}
                      height_mm={activeItem.altura * 10}
                      category={produtoSelecionado?.category ?? "janela_correr"}
                      subcategory={produtoSelecionado?.subcategory ?? "2_folhas"}
                      num_folhas={produtoSelecionado?.numFolhas ?? 2}
                      has_veneziana={produtoSelecionado?.veneziana}
                      colorId={activeItem.colorId}
                      maxWidth={200}
                      maxHeight={180}
                    />
                  </Frame3DWrapper>
                </div>

                {/* Dimensões */}
                {(() => {
                  const dimErrors = validateDimensions(activeItem.tipo, activeItem.largura, activeItem.altura);
                  const prod = produtoSelecionado;
                  return (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>Largura (cm)</Label>
                        <Input type="number" value={activeItem.largura}
                          onChange={(e) => updateItem(activeItemIdx, { largura: Number(e.target.value) })}
                          className={cn(dimErrors?.largura && "border-destructive")}
                        />
                        {dimErrors?.largura ? (
                          <p className="text-[11px] font-medium text-destructive">{dimErrors.largura}</p>
                        ) : prod && (
                          <p className="text-[10px] text-muted-foreground">{prod.minLarguraCm}–{prod.maxLarguraCm} cm</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label>Altura (cm)</Label>
                        <Input type="number" value={activeItem.altura}
                          onChange={(e) => updateItem(activeItemIdx, { altura: Number(e.target.value) })}
                          className={cn(dimErrors?.altura && "border-destructive")}
                        />
                        {dimErrors?.altura ? (
                          <p className="text-[11px] font-medium text-destructive">{dimErrors.altura}</p>
                        ) : prod && (
                          <p className="text-[10px] text-muted-foreground">{prod.minAlturaCm}–{prod.maxAlturaCm} cm</p>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Quantidade */}
                <div className="space-y-2">
                  <Label>Quantidade</Label>
                  <div className="flex items-center gap-0">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-r-none"
                      onClick={() => updateItem(activeItemIdx, { quantidade: Math.max(1, activeItem.quantidade - 1) })}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input type="number" value={activeItem.quantidade}
                      onChange={(e) => updateItem(activeItemIdx, { quantidade: Math.max(1, Number(e.target.value)) })}
                      className="rounded-none text-center border-x-0" min={1} />
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-l-none"
                      onClick={() => updateItem(activeItemIdx, { quantidade: activeItem.quantidade + 1 })}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Vidro */}
                <div className="space-y-2">
                  <Label>Tipo de vidro</Label>
                  <div className="flex flex-wrap gap-2">
                    {vidroOptions.map((v) => (
                      <button key={v} onClick={() => updateItem(activeItemIdx, { vidroTipo: v })}
                        className={cn("px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                          activeItem.vidroTipo === v ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 border-border")}>
                        {v.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cor alumínio */}
                <div className="space-y-2">
                  <Label>Cor dos alumínios</Label>
                  <div className="flex flex-wrap gap-2">
                    {aluminumColors.map((c) => (
                      <button key={c.id} onClick={() => updateItem(activeItemIdx, { colorId: c.id })}
                        className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                          activeItem.colorId === c.id ? "border-primary bg-primary/10" : "border-border bg-muted/30")}>
                        <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: c.hex }} />
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cor ferragem */}
                <div className="space-y-2">
                  <Label>Cor das ferragens</Label>
                  <div className="flex flex-wrap gap-2">
                    {ferragemColors.map((c) => (
                      <button key={c.id} onClick={() => updateItem(activeItemIdx, { ferragemColorId: c.id })}
                        className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                          activeItem.ferragemColorId === c.id ? "border-primary bg-primary/10" : "border-border bg-muted/30")}>
                        <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: c.hex }} />
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ambiente */}
                <div className="space-y-2">
                  <Label>Ambiente (opcional)</Label>
                  <Input placeholder="Ex: Sala, Quarto..." value={activeItem.ambiente}
                    onChange={(e) => updateItem(activeItemIdx, { ambiente: e.target.value })} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Condições */}
        {currentStep === "condicoes" && (
          <div className="max-w-xl mx-auto p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Condições Comerciais</h2>
              <p className="text-muted-foreground text-sm">Configure margem, desconto e forma de pagamento</p>
            </div>

            {/* Margem */}
            <div className="space-y-2">
              <Label>Margem de lucro (%)</Label>
              <div className="flex items-center gap-0">
                <span className="flex items-center justify-center h-10 w-10 bg-primary text-primary-foreground rounded-l-md text-sm font-bold">%</span>
                <Input type="number" value={margemPercent} onChange={(e) => setMargemPercent(Number(e.target.value))}
                  className="rounded-l-none" min={0} />
              </div>
            </div>

            {/* Acréscimo */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-0">
                <button onClick={() => setTemAcrescimo(false)}
                  className={cn("py-2.5 text-sm font-medium rounded-l-lg border transition-colors",
                    !temAcrescimo ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 border-border")}>
                  Sem acréscimo
                </button>
                <button onClick={() => setTemAcrescimo(true)}
                  className={cn("py-2.5 text-sm font-medium rounded-r-lg border border-l-0 transition-colors",
                    temAcrescimo ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 border-border")}>
                  Com acréscimo
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
                  <button onClick={() => setDescontoTipo("percent")}
                    className={cn("py-2 text-sm font-medium rounded-l-lg border transition-colors",
                      descontoTipo === "percent" ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 border-border")}>
                    %
                  </button>
                  <button onClick={() => setDescontoTipo("valor")}
                    className={cn("py-2 text-sm font-medium rounded-r-lg border border-l-0 transition-colors",
                      descontoTipo === "valor" ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 border-border")}>
                    R$
                  </button>
                </div>
                <Input type="number" value={descontoValor} onChange={(e) => setDescontoValor(Number(e.target.value))}
                  placeholder="0" min={0} className="w-32" />
              </div>
            </div>

            {/* Forma pagamento */}
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
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-r-none"
                  onClick={() => setParcelas(Math.max(1, parcelas - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <Input type="number" value={parcelas} onChange={(e) => setParcelas(Math.max(1, Number(e.target.value)))}
                  className="rounded-none text-center border-x-0" min={1} />
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-l-none"
                  onClick={() => setParcelas(parcelas + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {parcelas > 1 && (
                <p className="text-xs text-muted-foreground">{parcelas}x de {formatCurrency(total / parcelas)}</p>
              )}
            </div>

            {/* Observações */}
            <div className="space-y-2">
              <Label>Observações (opcional)</Label>
              <Textarea placeholder="Observações adicionais..." value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)} rows={3} />
            </div>

            {/* Resumo parcial */}
            <Card className="bg-muted/30">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Custo total</span>
                  <span className="font-medium">{formatCurrency(totalCusto)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Lucro ({margemPercent}%)</span>
                  <span className="font-medium text-green-600">{formatCurrency(lucro)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                {descontoCalc > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Desconto</span>
                    <span>- {formatCurrency(descontoCalc)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t font-bold">
                  <span>TOTAL</span>
                  <span className="text-lg">{formatCurrency(total)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* STEP 4: Revisão */}
        {currentStep === "revisao" && (
          <div className="max-w-2xl mx-auto p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Revisão do Orçamento</h2>
              <p className="text-muted-foreground text-sm">Verifique os dados antes de salvar</p>
            </div>

            {/* Cliente card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-lg">{cliente}</p>
              </CardContent>
            </Card>

            {/* Itens card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Itens ({items.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.map((item, idx) => {
                  const prod = tiposProduto.find(t => t.value === item.tipo);
                  const areaM2 = (item.largura / 100) * (item.altura / 100) * item.quantidade;
                  return (
                    <div key={item.id} className="flex items-start justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{prod?.label || "Item"}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.largura * 10}×{item.altura * 10}mm • Qtd: {item.quantidade} • {item.ambiente || "Sem ambiente"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.vidroTipo} • {getColorById(item.colorId).name} • {ferragemColors.find(c => c.id === item.ferragemColorId)?.name}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setActiveItemIdx(idx); setCurrentStep("itens"); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Condições card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Condições</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Margem</span>
                  <span>{margemPercent}%</span>
                </div>
                {acrescimoVal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Acréscimo</span>
                    <span>+ {formatCurrency(acrescimoVal)}</span>
                  </div>
                )}
                {descontoCalc > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto</span>
                    <span>- {formatCurrency(descontoCalc)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pagamento</span>
                  <span>{formasPagamento.find(f => f.value === formaPagamento)?.label} ({parcelas}x)</span>
                </div>
                {observacoes && (
                  <div className="pt-2 border-t">
                    <p className="text-muted-foreground text-xs">Obs:</p>
                    <p className="text-sm">{observacoes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Total */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">TOTAL</span>
                  <span className="text-2xl font-bold">{formatCurrency(total)}</span>
                </div>
                {parcelas > 1 && (
                  <p className="text-sm text-muted-foreground text-right mt-1">
                    {parcelas}x de {formatCurrency(total / parcelas)}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={handleSalvar} disabled={!cliente || hasValidationErrors}
                className="flex-1 gap-2 bg-primary">
                <Plus className="h-4 w-4" />
                {isEditing ? "Atualizar" : "Salvar Orçamento"}
              </Button>
              <Button variant="outline" onClick={handlePDF} disabled={!cliente} className="gap-2">
                <FileDown className="h-4 w-4" /> PDF
              </Button>
              <Button variant="outline" onClick={handleWhatsApp} disabled={!cliente}
                className="gap-2 text-green-600 border-green-600/30 hover:bg-green-600/10">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer navigation */}
      <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30">
        <Button variant="outline" onClick={goBack} disabled={!canGoBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        {currentStep === "revisao" ? (
          <Button onClick={handleSalvar} disabled={!cliente || hasValidationErrors} className="gap-2 bg-primary">
            <Check className="h-4 w-4" /> {isEditing ? "Atualizar" : "Salvar"}
          </Button>
        ) : (
          <Button onClick={goNext} disabled={!canGoNext} className="gap-2">
            Próximo <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Material Dialog */}
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
}
