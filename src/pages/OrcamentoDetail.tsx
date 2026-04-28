import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  ResponsiveDialog,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
} from '@/components/ui/responsive-dialog';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Calendar,
  Hash,
  Package,
  Edit,
  Download,
  MoreVertical,
  Check,
  Clock,
  X,
  AlertCircle,
  Truck,
  CreditCard,
} from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('pt-BR');
};
import { generateProfessionalBudgetPDF } from '@/utils/budgetPdfGenerator';
import { StatusBadge } from '@/components/StatusBadge';

const statusConfig: Record<
  string,
  { icon: React.ElementType; color: string; bg: string; label: string }
> = {
  rascunho: { icon: Edit, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Rascunho' },
  pendente: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-500/10', label: 'Pendente' },
  aprovado: { icon: Check, color: 'text-emerald-600', bg: 'bg-emerald-500/10', label: 'Aprovado' },
  recusado: { icon: X, color: 'text-rose-600', bg: 'bg-rose-500/10', label: 'Recusado' },
  em_andamento: {
    icon: Truck,
    color: 'text-blue-600',
    bg: 'bg-blue-500/10',
    label: 'Em Andamento',
  },
  concluido: {
    icon: Check,
    color: 'text-emerald-600',
    bg: 'bg-emerald-500/10',
    label: 'Concluído',
  },
  cancelado: {
    icon: AlertCircle,
    color: 'text-slate-600',
    bg: 'bg-slate-500/10',
    label: 'Cancelado',
  },
};

export function OrcamentoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(true);
  const [empresaData, setEmpresaData] = useState<Record<string, string>>({});

  // Fetch orçamento
  const { data: orc, isLoading } = useQuery({
    queryKey: ['orcamento', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('orcamentos').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
  });

  // Fetch empresa config
  useEffect(() => {
    const loadEmpresa = async () => {
      const { data } = await supabase.from('configuracoes').select('chave, valor');
      if (data) {
        const map: Record<string, string> = {};
        data.forEach(r => {
          map[r.chave] = r.valor;
        });
        setEmpresaData(map);
      }
    };
    loadEmpresa();
  }, []);

  // Update status mutation
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('orcamentos')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['orcamentos'] });
      queryClient.invalidateQueries({ queryKey: ['orcamento', id] });
      toast.success(`Status alterado para ${status}`);
    },
    onError: error => {
      toast.error('Erro ao atualizar status', { description: error.message });
    },
  });

  // Add histórico mutation
  const addHistorico = useMutation({
    mutationFn: async (payload: any) => {
      const { error } = await supabase.from('orcamento_historico').insert(payload);
      if (error) throw error;
    },
  });

  const handleStatusChange = (status: string) => {
    const previousStatus = orc?.status;
    updateStatus.mutate(
      { id: id!, status },
      {
        onSuccess: async () => {
          addHistorico.mutate({
            orcamento_id: id,
            status_anterior: previousStatus,
            status_novo: status,
          });

          // Auto-create pedido when approved
          if (status === 'aprovado') {
            try {
              const { data: lastPedido } = await supabase
                .from('pedidos')
                .select('pedido_num')
                .order('pedido_num', { ascending: false })
                .limit(1);
              const nextNum = (lastPedido?.[0]?.pedido_num ?? 0) + 1;

              const { data: clienteData } = await supabase
                .from('clientes')
                .select('telefone, endereco')
                .eq('nome', orc.cliente)
                .limit(1);
              const cliente = clienteData?.[0];

              const { error: pedidoError } = await supabase.from('pedidos').insert({
                pedido_num: nextNum,
                cliente: orc.cliente,
                endereco: cliente?.endereco ?? '',
                telefone: cliente?.telefone ?? '',
                vendedor: '',
                valor: orc.valor,
                status: 'em_andamento',
                dias_restantes: 30,
                etapa: 'Orçamento',
                anotacao: `Gerado automaticamente do orçamento ${orc.numero}`,
              } as any);

              if (pedidoError) {
                toast.error('Erro ao gerar pedido', { description: pedidoError.message });
              } else {
                toast.success('Pedido gerado', {
                  description: `Pedido #${nextNum} criado automaticamente.`,
                });
              }
            } catch (e: any) {
              toast.error('Erro ao gerar pedido', { description: e.message });
            }
          }
        },
      }
    );
  };

  const handleDownloadPdf = async () => {
    if (!orc) return;
    const itensData = orc.itens as Record<string, any> | null;
    try {
      await generateProfessionalBudgetPDF({
        numero: orc.numero,
        cliente: orc.cliente,
        produto: orc.produto,
        larguraCm: itensData?.largura_cm ?? 200,
        alturaCm: itensData?.altura_cm ?? 120,
        quantidade: itensData?.quantidade ?? 1,
        areaM2: itensData?.area_m2 ?? 0,
        custoTotal: itensData?.custo ?? 0,
        margem: itensData?.margem_percent ?? 0,
        valorFinal: orc.valor,
        corAluminio: itensData?.cor_aluminio,
        corFerragem: itensData?.cor_ferragem,
        tipoVidro: itensData?.vidro_tipo,
        ambiente: itensData?.ambiente,
        observacoes: itensData?.observacoes,
        empresa: {
          nome: empresaData.nome || 'AluFlow',
          cnpj: empresaData.cnpj || '',
          telefone: empresaData.telefone || '',
          email: empresaData.email || '',
          endereco: empresaData.endereco || '',
          logoUrl: empresaData.logo_url || '',
        },
      });
      toast.success('PDF gerado com sucesso!');
    } catch (err: any) {
      toast.error('Erro ao gerar PDF', { description: err.message });
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate('/orcamentos');
  };

  if (!open) return null;

  if (isLoading) {
    return (
      <ResponsiveDialog open={open} onOpenChange={handleClose} size="lg">
        <div className="p-6 space-y-4">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        </div>
      </ResponsiveDialog>
    );
  }

  if (!orc) {
    return (
      <ResponsiveDialog open={open} onOpenChange={handleClose} size="md">
        <div className="p-6 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-rose-500 mb-4" />
          <h3 className="text-lg font-semibold">Orçamento não encontrado</h3>
          <p className="text-muted-foreground mt-2">Este orçamento pode ter sido excluído.</p>
          <Button onClick={handleClose} className="mt-4">
            Voltar para Orçamentos
          </Button>
        </div>
      </ResponsiveDialog>
    );
  }

  const itens = orc.itens as Record<string, any> | null;
  const itemsList: any[] = itens?.items ?? (itens?.tipo ? [itens] : []);

  const dimensionKeys = ['largura_cm', 'altura_cm', 'quantidade', 'area_m2'];
  const financialKeys = ['custo', 'lucro', 'subtotal', 'acrescimo', 'margem_percent'];
  const styleKeys = ['cor_aluminio', 'cor_ferragem', 'vidro_tipo'];

  const labelMap: Record<string, string> = {
    tipo: 'Tipologia',
    custo: 'Custo Material',
    lucro: 'Margem de Lucro',
    subtotal: 'Subtotal',
    acrescimo: 'Acréscimo',
    margem_percent: 'Margem %',
    area_m2: 'Área Total',
    largura_cm: 'Largura',
    altura_cm: 'Altura',
    quantidade: 'Quantidade',
    cor_aluminio: 'Cor Alumínio',
    cor_ferragem: 'Cor Ferragem',
    vidro_tipo: 'Tipo de Vidro',
    ambiente: 'Ambiente',
    observacoes: 'Observações',
    desconto_tipo: 'Tipo Desconto',
    desconto_valor: 'Desconto',
    forma_pagamento: 'Forma Pagamento',
    parcelas: 'Parcelas',
  };

  const formatItemValue = (key: string, value: unknown) => {
    if (value === null || value === undefined || value === '') return '—';
    if (typeof value === 'number') {
      if (['custo', 'lucro', 'subtotal', 'acrescimo', 'desconto_valor'].some(k => k === key))
        return key === 'desconto_valor' && itens?.desconto_tipo === 'percent'
          ? `${value}%`
          : formatCurrency(value);
      if (key === 'area_m2') return `${value} m²`;
      if (key === 'largura_cm' || key === 'altura_cm') return `${value} cm`;
      if (key === 'margem_percent') return `${value}%`;
      return String(value);
    }
    return String(value);
  };

  const ItemRow = ({
    label,
    value,
    accent,
  }: {
    label: string;
    value: string;
    accent?: boolean;
  }) => (
    <div className="flex justify-between items-center py-3 px-4 group hover:bg-primary/[0.03] transition-colors">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn('text-sm font-semibold tabular-nums', accent && 'text-primary')}>
        {value}
      </span>
    </div>
  );

  return (
    <ResponsiveDialog open={open} onOpenChange={handleClose} size="lg">
      {/* Premium header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/5 to-accent/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.1),transparent_60%)]" />
        <div className="relative px-6 pt-7 pb-5">
          {/* Back button and header */}
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <ResponsiveDialogTitle className="text-xl font-bold tracking-tight">
                Orçamento {orc.numero}
              </ResponsiveDialogTitle>
              <ResponsiveDialogDescription className="text-xs flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                Criado em {formatDate(orc.created_at)}
              </ResponsiveDialogDescription>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <StatusBadge status={orc.status} />
            {itens?.tipo && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-accent/60 text-accent-foreground border border-accent-foreground/10">
                <Package className="h-3 w-3" />
                {String(itens.tipo).replace(/_/g, ' ')}
              </span>
            )}
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="px-6 pb-6 space-y-5 overflow-y-auto flex-1">
        {/* Client & Product */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Cliente
            </p>
            <p className="font-semibold">{orc.cliente || '—'}</p>
            {orc.telefone && <p className="text-sm text-muted-foreground">{orc.telefone}</p>}
          </div>
          <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Produto
            </p>
            <p className="font-semibold">{orc.produto || orc.descricao_produto || '—'}</p>
            {orc.vendedor && (
              <p className="text-sm text-muted-foreground">Vendedor: {orc.vendedor}</p>
            )}
          </div>
        </div>

        {/* Dimension / Technical details */}
        {dimensionKeys.some(k =>
          itemsList.some(item => item[k] !== undefined && item[k] !== null && item[k] !== '')
        ) && (
          <div className="rounded-xl border border-border/40 overflow-hidden">
            <div className="px-4 py-3 bg-muted/20 border-b border-border/40">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Dimensões
              </p>
            </div>
            {itemsList.map((item, idx) => (
              <div key={idx}>
                {idx > 0 && <Separator className="border-border/20" />}
                <div>
                  {dimensionKeys
                    .filter(k => item[k] !== undefined && item[k] !== null && item[k] !== '')
                    .map(key => (
                      <ItemRow
                        key={key}
                        label={labelMap[key] || key}
                        value={formatItemValue(key, item[key])}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Financial */}
        {financialKeys.some(k =>
          itemsList.some(item => item[k] !== undefined && item[k] !== null && item[k] !== '')
        ) && (
          <div className="rounded-xl border border-border/40 overflow-hidden">
            <div className="px-4 py-3 bg-muted/20 border-b border-border/40">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Valores
              </p>
            </div>
            {itemsList.map((item, idx) => (
              <div key={idx}>
                {idx > 0 && <Separator className="border-border/20" />}
                <div>
                  {financialKeys
                    .filter(k => item[k] !== undefined && item[k] !== null && item[k] !== '')
                    .map(key => (
                      <ItemRow
                        key={key}
                        label={labelMap[key] || key}
                        value={formatItemValue(key, item[key])}
                        accent
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Style details */}
        {styleKeys.some(k =>
          itemsList.some(item => item[k] !== undefined && item[k] !== null && item[k] !== '')
        ) && (
          <div className="rounded-xl border border-border/40 overflow-hidden">
            <div className="px-4 py-3 bg-muted/20 border-b border-border/40">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Acabamento
              </p>
            </div>
            {itemsList.map((item, idx) => (
              <div key={idx}>
                {idx > 0 && <Separator className="border-border/20" />}
                <div>
                  {styleKeys
                    .filter(k => item[k] !== undefined && item[k] !== null && item[k] !== '')
                    .map(key => (
                      <ItemRow
                        key={key}
                        label={labelMap[key] || key}
                        value={formatItemValue(key, item[key])}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Total */}
        <div className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border border-primary/20 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Valor Final
              </p>
              <p className="text-2xl font-bold text-primary tabular-nums">
                {formatCurrency(orc.valor)}
              </p>
            </div>
            {itens?.margem_percent && (
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Margem
                </p>
                <p className="text-lg font-bold text-emerald-500">{itens.margem_percent}%</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment & Observation */}
        {(itens?.forma_pagamento || itens?.parcelas || itens?.observacoes || orc.observacoes) && (
          <div className="space-y-3">
            {itens?.forma_pagamento && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/40">
                <CreditCard className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Forma de Pagamento
                  </p>
                  <p className="text-sm font-medium">
                    {itens.forma_pagamento} {itens.parcelas ? `( ${itens.parcelas}x )` : ''}
                  </p>
                </div>
              </div>
            )}
            {(itens?.observacoes || orc.observacoes) && (
              <div className="p-4 rounded-xl bg-muted/30 border border-border/40">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Observações
                </p>
                <p className="text-sm whitespace-pre-wrap">
                  {itens?.observacoes || orc.observacoes}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Status Actions */}
        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Alterar Status
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(statusConfig).map(([status, config]) => {
              const Icon = config.icon;
              const isActive = orc.status === status;
              return (
                <Button
                  key={status}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => !isActive && handleStatusChange(status)}
                  disabled={isActive}
                  className={cn('gap-1.5 text-xs h-8', isActive && 'opacity-100')}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {config.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <ResponsiveDialogFooter className="px-6 py-4 border-t border-border/40 bg-muted/10">
        <Button variant="outline" onClick={handleClose} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate(`/orcamentos/editar/${id}`)}
          className="gap-2"
        >
          <Edit className="h-4 w-4" />
          Editar
        </Button>
        <Button onClick={handleDownloadPdf} className="gap-2">
          <Download className="h-4 w-4" />
          Baixar PDF
        </Button>
      </ResponsiveDialogFooter>
    </ResponsiveDialog>
  );
}

export default OrcamentoDetail;
