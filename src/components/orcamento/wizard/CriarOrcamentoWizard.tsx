import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCreateOrcamento, useUpdateOrcamento, useOrcamentoById } from '@/hooks/use-orcamentos';
import { useAddOrcamentoHistorico } from '@/hooks/use-orcamento-historico';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { tiposProduto, formasPagamento, validateDimensions } from '@/data/orcamento-produtos';
import { ArrowLeft, ArrowRight, Check, Plus } from 'lucide-react';
import { generateProposalPDF } from '@/utils/generateProposalPdf';
import { getColorById } from '@/components/frame-preview/colors';
import { OrcamentoAiHelper } from '@/components/ai/OrcamentoAiHelper';

import { ClienteStep } from './steps/ClienteStep';
import { ItensStep, type OrcamentoItem } from './steps/ItensStep';
import { CondicoesStep } from './steps/CondicoesStep';
import { RevisaoStep } from './steps/RevisaoStep';

// Types
type WizardStep = 'cliente' | 'itens' | 'condicoes' | 'revisao';

const STEPS: { id: WizardStep; label: string }[] = [
  { id: 'cliente', label: 'Cliente' },
  { id: 'itens', label: 'Itens' },
  { id: 'condicoes', label: 'Condições' },
  { id: 'revisao', label: 'Revisão' },
];

const DRAFT_KEY = 'orcamento_draft';

const createEmptyItem = (): OrcamentoItem => ({
  id: crypto.randomUUID(),
  tipo: 'janela_correr_2f',
  largura: 200,
  altura: 120,
  quantidade: 1,
  colorId: 'natural',
  ferragemColorId: 'preto',
  vidroTipo: 'Nenhum',
  ambiente: '',
});

interface DraftData {
  cliente: string;
  items: OrcamentoItem[];
  margemPercent: number;
  acrescimo: number;
  temAcrescimo: boolean;
  descontoTipo: 'percent' | 'valor';
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
  const [currentStep, setCurrentStep] = useState<WizardStep>('cliente');

  // Form state
  const [cliente, setCliente] = useState('');
  const [items, setItems] = useState<OrcamentoItem[]>([createEmptyItem()]);
  const [activeItemIdx, setActiveItemIdx] = useState(0);
  const [margemPercent, setMargemPercent] = useState(100);
  const [acrescimo, setAcrescimo] = useState(0);
  const [temAcrescimo, setTemAcrescimo] = useState(false);
  const [observacoes, setObservacoes] = useState('');
  const [descontoTipo, setDescontoTipo] = useState<'percent' | 'valor'>('percent');
  const [descontoValor, setDescontoValor] = useState(0);
  const [formaPagamento, setFormaPagamento] = useState('pix');
  const [parcelas, setParcelas] = useState(1);
  const [loaded, setLoaded] = useState(false);

  // Autosave draft
  const saveDraft = useCallback(() => {
    if (isEditing) return;
    const draft: DraftData = {
      cliente,
      items,
      margemPercent,
      acrescimo,
      temAcrescimo,
      descontoTipo,
      descontoValor,
      formaPagamento,
      parcelas,
      observacoes,
      lastUpdate: Date.now(),
    };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // localStorage unavailable (private mode, full, etc)
    }
  }, [
    cliente,
    items,
    margemPercent,
    acrescimo,
    temAcrescimo,
    descontoTipo,
    descontoValor,
    formaPagamento,
    parcelas,
    observacoes,
    isEditing,
  ]);

  // Load draft on mount (only for new orçamento)
  useEffect(() => {
    if (!isEditing && !loaded) {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem(DRAFT_KEY);
      } catch {
        // localStorage unavailable
      }
      if (saved) {
        try {
          const draft: DraftData = JSON.parse(saved);
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
            toast.success('Rascunho restaurado!');
          }
        } catch {
          /* ignore */
        }
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
          setItems(
            itens.items.map((item: any) => ({
              id: crypto.randomUUID(),
              tipo: item.tipo ?? 'janela_correr_2f',
              largura: item.largura_cm ?? 200,
              altura: item.altura_cm ?? 120,
              quantidade: item.quantidade ?? 1,
              colorId: item.cor_aluminio ?? 'natural',
              ferragemColorId: item.cor_ferragem ?? 'preto',
              vidroTipo: item.vidro_tipo ?? 'Nenhum',
              ambiente: item.ambiente ?? '',
            }))
          );
        } else {
          setItems([
            {
              id: crypto.randomUUID(),
              tipo: itens.tipo ?? 'janela_correr_2f',
              largura: itens.largura_cm ?? 200,
              altura: itens.altura_cm ?? 120,
              quantidade: itens.quantidade ?? 1,
              colorId: itens.cor_aluminio ?? 'natural',
              ferragemColorId: itens.cor_ferragem ?? 'preto',
              vidroTipo: itens.vidro_tipo ?? 'Nenhum',
              ambiente: itens.ambiente ?? '',
            },
          ]);
        }
        setMargemPercent(itens.margem_percent ?? 100);
        setAcrescimo(itens.acrescimo ?? 0);
        setTemAcrescimo((itens.acrescimo ?? 0) > 0);
        setObservacoes(itens.observacoes ?? '');
        setDescontoTipo(itens.desconto_tipo ?? 'percent');
        setDescontoValor(itens.desconto_valor ?? 0);
        setFormaPagamento(itens.forma_pagamento ?? 'pix');
        setParcelas(itens.parcelas ?? 1);
      }
      setLoaded(true);
    }
  }, [existingOrc, loaded, isEditing]);

  // Calculations
  const totalCusto = items.reduce((sum, item) => {
    const prod = tiposProduto.find(t => t.value === item.tipo);
    if (!prod) return sum;
    const areaM2 = (item.largura / 100) * (item.altura / 100);
    return sum + areaM2 * prod.precoM2 * item.quantidade;
  }, 0);

  const lucro = totalCusto * (margemPercent / 100);
  const subtotal = totalCusto + lucro;
  const acrescimoVal = temAcrescimo ? acrescimo : 0;
  const beforeDiscount = subtotal + acrescimoVal;
  const descontoCalc =
    descontoValor > 0
      ? descontoTipo === 'percent'
        ? beforeDiscount * (descontoValor / 100)
        : descontoValor
      : 0;
  const total = Math.max(0, beforeDiscount - descontoCalc);

  const hasValidationErrors = items.some(
    item => validateDimensions(item.tipo, item.largura, item.altura) !== null
  );

  // Step navigation
  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
  const canGoNext = currentStep === 'cliente' ? !!cliente.trim() : !hasValidationErrors;
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
    setItems(prev => prev.map((item, i) => (i === idx ? { ...item, ...updates } : item)));
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
      toast.error('Dimensões inválidas', { description: 'Corrija as dimensões fora dos limites.' });
      return;
    }
    const itemsData = items.map(item => {
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

    const produtoLabel =
      items.length === 1
        ? (tiposProduto.find(t => t.value === items[0].tipo)?.label ?? 'Esquadria')
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
        toast.success('Orçamento atualizado!');
      } else {
        const result = await createOrcamento.mutateAsync(payload);
        if (result?.id) {
          addHistorico.mutate({
            orcamento_id: result.id,
            status_anterior: null,
            status_novo: 'pendente',
          });
        }
        toast.success('Orçamento criado!');
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch {
          // localStorage unavailable
        }
      }
      navigate('/orcamentos');
    } catch (err: any) {
      toast.error('Erro ao salvar', { description: err.message });
    }
  };

  // PDF
  const handlePDF = async () => {
    toast.info('Gerando PDF...');
    const imageUrlByType: Record<string, string> = {
      janela_correr_2f:
        'https://aluflow-landing.vercel.app/images/typologies/tipologia-janela-correr-2p---photorealistic-01.png',
      janela_correr_4f:
        'https://aluflow-landing.vercel.app/images/typologies/tipologia-janela-correr-4p---photorealistic-02.png',
      porta_correr_2f:
        'https://aluflow-landing.vercel.app/images/typologies/tipologia-porta-correr-2p---photorealistic-03.png',
      porta_correr_4f:
        'https://aluflow-landing.vercel.app/images/typologies/tipologia-porta-correr-4p---photorealistic-04.png',
      janela_maximar_1f:
        'https://aluflow-landing.vercel.app/images/typologies/tipologia-janela-maxair---photorealistic-07.png',
      janela_maximar_2f:
        'https://aluflow-landing.vercel.app/images/typologies/tipologia-janela-maxair---photorealistic-07.png',
      porta_giro_1f:
        'https://aluflow-landing.vercel.app/images/typologies/tipologia-janela-giro---photorealistic-05.png',
      porta_giro_2f:
        'https://aluflow-landing.vercel.app/images/typologies/tipologia-janela-giro---photorealistic-05.png',
      janela_veneziana:
        'https://aluflow-landing.vercel.app/images/typologies/tipologia-janela-persiana---photorealistic-11.png',
      janela_camarao:
        'https://aluflow-landing.vercel.app/images/typologies/tipologia-janela-persiana---photorealistic-11.png',
    };

    const activeItem = items[activeItemIdx];
    const produtoSelecionado = tiposProduto.find(t => t.value === activeItem?.tipo);
    const ferragemColors = [
      { id: 'cromado', name: 'Cromado', hex: '#C0C0C0' },
      { id: 'preto', name: 'Preto', hex: '#333333' },
      { id: 'branco', name: 'Branco', hex: '#F0F0F0' },
      { id: 'bronze', name: 'Bronze', hex: '#8B6914' },
    ];

    const pdf = await generateProposalPDF({
      cliente: { nome: cliente || 'Cliente' },
      vendedor: 'AluFlow',
      tratamento: getColorById(activeItem.colorId).name,
      validadeDias: 15,
      prazo: 'A combinar',
      observacoes: observacoes,
      itens: [
        {
          codigo: produtoSelecionado?.value.toUpperCase() || '',
          nome: produtoSelecionado?.label || '',
          linha: produtoSelecionado?.line || 'Padrão',
          tratamento: getColorById(activeItem.colorId).name,
          localizacao: activeItem.ambiente || '-',
          larguraMm: activeItem.largura * 10,
          alturaMm: activeItem.altura * 10,
          quantidade: activeItem.quantidade,
          valorUnitario: total / activeItem.quantidade,
          valorTotal: total,
          descricaoCompleta: `${produtoSelecionado?.label} - ${activeItem.vidroTipo} - ${ferragemColors.find(c => c.id === activeItem.ferragemColorId)?.name || 'Cromado'}`,
          imagemUrl: imageUrlByType[produtoSelecionado?.value || ''] || null,
        },
      ],
    });
    pdf.save(`proposta-orcamento-${Date.now()}.pdf`);
    toast.success('PDF exportado!');
  };

  // WhatsApp
  const handleWhatsApp = () => {
    const itemsDesc = items
      .map(item => {
        const prod = tiposProduto.find(t => t.value === item.tipo);
        return `📐 *${prod?.label}* ${item.largura * 10}×${item.altura * 10}mm (${item.quantidade}un)`;
      })
      .join('\n');
    const msg = [
      `Olá${cliente ? ` ${cliente}` : ''}! Segue seu orçamento:`,
      '',
      itemsDesc,
      '',
      `💰 *Valor: ${formatCurrency(total)}*`,
      parcelas > 1 ? `💳 ${parcelas}x de ${formatCurrency(total / parcelas)}` : '',
      '',
      observacoes ? `Obs: ${observacoes}\n` : '',
      'Válido por 15 dias.',
    ]
      .filter(Boolean)
      .join('\n');
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    toast.success('WhatsApp aberto!');
  };

  // Clear draft
  const handleLimpar = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // localStorage unavailable
    }
    setCliente('');
    setItems([createEmptyItem()]);
    setActiveItemIdx(0);
    setMargemPercent(100);
    setAcrescimo(0);
    setTemAcrescimo(false);
    setObservacoes('');
    setDescontoTipo('percent');
    setDescontoValor(0);
    setFormaPagamento('pix');
    setParcelas(1);
    toast.success('Rascunho limpo!');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate('/orcamentos')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-muted-foreground">Orçamentos</span>
        </div>
        <div className="flex items-center gap-2">
          <OrcamentoAiHelper />
          {!isEditing && (
            <Button variant="ghost" size="sm" onClick={handleLimpar}>
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Stepper */}
      <div className="border-b px-3 py-1.5">
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => idx < currentStepIndex + 1 && setCurrentStep(step.id)}
                disabled={idx > currentStepIndex + 1}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                  currentStep === step.id
                    ? 'bg-primary text-primary-foreground'
                    : idx < currentStepIndex
                      ? 'bg-primary/20 text-primary cursor-pointer'
                      : 'bg-muted text-muted-foreground'
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
                <div
                  className={cn(
                    'w-8 h-0.5 mx-1',
                    idx < currentStepIndex ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto">
        {currentStep === 'cliente' && (
          <ClienteStep cliente={cliente} onClienteChange={setCliente} />
        )}

        {currentStep === 'itens' && (
          <ItensStep
            items={items}
            activeItemIdx={activeItemIdx}
            onActiveItemChange={setActiveItemIdx}
            onItemUpdate={updateItem}
            onAddItem={addItem}
            onRemoveItem={removeItem}
          />
        )}

        {currentStep === 'condicoes' && (
          <CondicoesStep
            margemPercent={margemPercent}
            onMargemChange={setMargemPercent}
            temAcrescimo={temAcrescimo}
            onTemAcrescimoChange={setTemAcrescimo}
            acrescimo={acrescimo}
            onAcrescimoChange={setAcrescimo}
            descontoTipo={descontoTipo}
            onDescontoTipoChange={setDescontoTipo}
            descontoValor={descontoValor}
            onDescontoValorChange={setDescontoValor}
            formaPagamento={formaPagamento}
            onFormaPagamentoChange={setFormaPagamento}
            parcelas={parcelas}
            onParcelasChange={setParcelas}
            observacoes={observacoes}
            onObservacoesChange={setObservacoes}
            totalCusto={totalCusto}
            lucro={lucro}
            subtotal={subtotal}
            descontoCalc={descontoCalc}
            total={total}
          />
        )}

        {currentStep === 'revisao' && (
          <RevisaoStep
            cliente={cliente}
            items={items}
            margemPercent={margemPercent}
            acrescimo={acrescimoVal}
            descontoCalc={descontoCalc}
            formaPagamento={formaPagamento}
            parcelas={parcelas}
            observacoes={observacoes}
            total={total}
            onEditItens={() => setCurrentStep('itens')}
            onPDF={handlePDF}
            onWhatsApp={handleWhatsApp}
          />
        )}
      </div>

      {/* Footer navigation */}
      <div className="flex items-center justify-between px-4 py-2 border-t">
        <Button variant="outline" onClick={goBack} disabled={!canGoBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        {currentStep === 'revisao' ? (
          <Button
            onClick={handleSalvar}
            disabled={!cliente || hasValidationErrors}
            className="gap-2 bg-primary"
          >
            <Check className="h-4 w-4" /> {isEditing ? 'Atualizar' : 'Salvar'}
          </Button>
        ) : (
          <Button onClick={goNext} disabled={!canGoNext} className="gap-2">
            Próximo <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
