import { useState, useEffect, useMemo, useCallback } from 'react';
import { PullToRefresh } from '@/components/PullToRefresh';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Search,
  Pencil,
  ArrowDownUp,
  TrendingUp,
  TrendingDown,
  History,
  Package,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { usePageTitle } from '@/hooks/use-page-title';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const categorias = ['Todos', 'Perfis', 'Vidros', 'Acessórios', 'Insumos', 'Fixação'];

type EstoqueItem = {
  id: string;
  codigo: string;
  produto: string;
  quantidade: number;
  unidade: string;
  minimo: number;
  categoria: string;
};

type EstoqueMovimento = {
  id: string;
  produto_id: string;
  tipo_movimento: 'entrada' | 'saida' | 'ajuste';
  quantidade: number;
  observacao: string;
  created_at: string;
};

const emptyForm = {
  codigo: '',
  produto: '',
  quantidade: 0,
  unidade: 'pçs',
  minimo: 0,
  categoria: 'Perfis',
};

const Estoque = () => {
  usePageTitle('Estoque');
  const [itens, setItens] = useState<EstoqueItem[]>([]);
  const [movimentos, setMovimentos] = useState<EstoqueMovimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Todos');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [movDialog, setMovDialog] = useState<{
    item: EstoqueItem;
    tipo: 'entrada' | 'saida' | 'ajuste';
  } | null>(null);
  const [movQtd, setMovQtd] = useState(0);
  const [movObs, setMovObs] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [movimentoDialogOpen, setMovimentoDialogOpen] = useState(false);
  const [movimentoData, setMovimentoData] = useState<{
    produto_id: string;
    tipo_movimento: string;
    quantidade: number;
    observacao: string;
  }>({
    produto_id: '',
    tipo_movimento: '',
    quantidade: 0,
    observacao: '',
  });

  const fetchItens = useCallback(async () => {
    const { data, error } = await supabase.from('estoque').select('*').order('codigo');
    if (!error && data) setItens(data);
    setLoading(false);
  }, []);

  const fetchMovimentos = useCallback(async () => {
    const { data } = await supabase
      .from('estoque_movimentos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (data) setMovimentos(data);
  }, []);

  const fetchAll = useCallback(async () => {
    await Promise.all([fetchItens(), fetchMovimentos()]);
  }, [fetchItens, fetchMovimentos]);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const filtered = useMemo(
    () =>
      itens.filter(item => {
        const matchSearch =
          !search ||
          item.produto.toLowerCase().includes(search.toLowerCase()) ||
          item.codigo.toLowerCase().includes(search.toLowerCase());
        const matchCat = catFilter === 'Todos' || item.categoria === catFilter;
        return matchSearch && matchCat;
      }),
    [itens, search, catFilter]
  );

  const getStockStatus = (quantidade: number, minimo: number) => {
    if (quantidade <= 0)
      return {
        label: 'Sem estoque',
        color: 'bg-destructive',
        icon: <AlertTriangle className="h-3 w-3" />,
      };
    if (quantidade < minimo)
      return {
        label: 'Baixo',
        color: 'bg-yellow-500',
        icon: <AlertTriangle className="h-3 w-3" />,
      };
    return { label: 'OK', color: 'bg-green-500', icon: <Package className="h-3 w-3" /> };
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateStr));
  };

  // Stats
  const totalItens = itens.length;
  const semEstoque = itens.filter(i => i.quantidade <= 0).length;
  const estoqueBaixo = itens.filter(i => i.quantidade > 0 && i.quantidade < i.minimo).length;
  const bemAbastecido = itens.filter(i => i.quantidade >= i.minimo).length;

  const openNew = () => {
    const nextCode = `EST-${String(itens.length + 1).padStart(3, '0')}`;
    setForm({ ...emptyForm, codigo: nextCode });
    setEditingId(null);
    setDialogOpen(true);
  };
  const openEdit = (item: EstoqueItem) => {
    setForm({
      codigo: item.codigo,
      produto: item.produto,
      quantidade: item.quantidade,
      unidade: item.unidade,
      minimo: item.minimo,
      categoria: item.categoria,
    });
    setEditingId(item.id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.produto.trim()) {
      toast.error('Nome obrigatório');
      return;
    }
    if (editingId) {
      const { error } = await supabase
        .from('estoque')
        .update({
          produto: form.produto,
          quantidade: form.quantidade,
          unidade: form.unidade,
          minimo: form.minimo,
          categoria: form.categoria,
        })
        .eq('id', editingId);
      if (error) {
        toast.error('Erro', { description: error.message });
        return;
      }
      toast.success('Item atualizado');
    } else {
      const { error } = await supabase
        .from('estoque')
        .insert({
          codigo: form.codigo,
          produto: form.produto,
          quantidade: form.quantidade,
          unidade: form.unidade,
          minimo: form.minimo,
          categoria: form.categoria,
        });
      if (error) {
        toast.error('Erro', { description: error.message });
        return;
      }
      toast.success('Item adicionado');
    }
    setDialogOpen(false);
    fetchAll();
  };

  const handleMov = async () => {
    if (!movDialog || movQtd <= 0) return;
    const tipo = movDialog.tipo;
    const newQtd =
      tipo === 'entrada'
        ? movDialog.item.quantidade + movQtd
        : tipo === 'saida'
          ? Math.max(0, movDialog.item.quantidade - movQtd)
          : movQtd;

    // Record movement
    const { error: movError } = await supabase.from('estoque_movimentos').insert({
      produto_id: movDialog.item.id,
      tipo_movimento: tipo,
      quantidade: movQtd,
      observacao: movObs,
    });
    if (movError) {
      toast.error('Erro', { description: movError.message });
      return;
    }

    // Update stock
    const { error } = await supabase
      .from('estoque')
      .update({ quantidade: newQtd })
      .eq('id', movDialog.item.id);
    if (error) {
      toast.error('Erro', { description: error.message });
      return;
    }

    toast.success(
      `${tipo === 'entrada' ? 'Entrada' : tipo === 'saida' ? 'Saída' : 'Ajuste'} registrada: ${movQtd} ${movDialog.item.unidade}`
    );
    setMovDialog(null);
    setMovQtd(0);
    setMovObs('');
    fetchAll();
  };

  const handleMovimento = async () => {
    if (!movimentoData.produto_id || !movimentoData.tipo_movimento || !movimentoData.quantidade) {
      toast.error('Preencha todos os campos');
      return;
    }
    const item = itens.find(i => i.id === movimentoData.produto_id);
    if (!item) return;

    await supabase.from('estoque_movimentos').insert({
      produto_id: movimentoData.produto_id,
      tipo_movimento: movimentoData.tipo_movimento,
      quantidade: movimentoData.quantidade,
      observacao: movimentoData.observacao,
    });
    const { error: movError2 } = await supabase
      .from('estoque')
      .update({ quantidade: newQty })
      .eq('id', item.id);
    if (movError2) {
      toast.error('Erro', { description: movError2.message });
      return;
    }

    let newQty = item.quantidade;
    if (movimentoData.tipo_movimento === 'entrada') newQty += movimentoData.quantidade;
    else if (movimentoData.tipo_movimento === 'saida') newQty -= movimentoData.quantidade;
    else newQty = movimentoData.quantidade;

    await supabase.from('estoque').update({ quantidade: newQty }).eq('id', item.id);
    toast.success('Movimentação registrada!');
    setMovimentoDialogOpen(false);
    setMovimentoData({ produto_id: '', tipo_movimento: '', quantidade: 0, observacao: '' });
    fetchAll();
  };

  const handleRefresh = useCallback(async () => {
    await fetchAll();
  }, [fetchAll]);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight">Estoque</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Controle de materiais e insumos
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setMovimentoDialogOpen(true)}
            >
              <ArrowDownUp className="h-4 w-4" /> Movimentar
            </Button>
            <Button size="sm" className="gap-2" onClick={openNew}>
              <Plus className="h-4 w-4" /> Novo Item
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total', value: totalItens, icon: Package, color: 'text-blue-600 bg-blue-50' },
            {
              label: 'Sem Estoque',
              value: semEstoque,
              icon: AlertTriangle,
              color: 'text-red-600 bg-red-50',
            },
            {
              label: 'Baixo',
              value: estoqueBaixo,
              icon: AlertTriangle,
              color: 'text-yellow-600 bg-yellow-50',
            },
            {
              label: 'OK',
              value: bemAbastecido,
              icon: TrendingUp,
              color: 'text-green-600 bg-green-50',
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="flex items-center gap-2.5 rounded-lg border bg-card p-3">
              <div
                className={cn(
                  'h-9 w-9 rounded-full flex items-center justify-center shrink-0',
                  color.split(' ')[1]
                )}
              >
                <Icon className={cn('h-4 w-4', color.split(' ')[0])} />
              </div>
              <div>
                <p className="text-lg font-bold leading-none">{value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="inventario">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="inventario">Inventário</TabsTrigger>
            <TabsTrigger value="movimentos">Movimentos</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>

          {/* TAB: Inventário */}
          <TabsContent value="inventario" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar no estoque..."
                  className="pl-9"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <Select value={catFilter} onValueChange={setCatFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map(c => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Código</TableHead>
                    <TableHead className="text-xs">Produto</TableHead>
                    <TableHead className="hidden sm:table-cell text-xs">Categoria</TableHead>
                    <TableHead className="text-xs">Qtd</TableHead>
                    <TableHead className="hidden md:table-cell text-xs">Mínimo</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-right text-xs">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-24 text-center text-muted-foreground text-xs sm:text-sm"
                      >
                        <Loader2 className="h-5 w-5 animate-spin inline-block" /> Carregando...
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map(item => {
                      const status = getStockStatus(item.quantidade, item.minimo);
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium text-xs sm:text-sm">
                            {item.codigo}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">{item.produto}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant="secondary" className="text-[10px] sm:text-xs">
                              {item.categoria}
                            </Badge>
                          </TableCell>
                          <TableCell
                            className={cn(
                              'text-xs sm:text-sm',
                              item.quantidade <= item.minimo
                                ? 'text-destructive font-bold'
                                : 'font-medium'
                            )}
                          >
                            {item.quantidade} {item.unidade}
                          </TableCell>
                          <TableCell className="text-muted-foreground hidden md:table-cell text-xs sm:text-sm">
                            {item.minimo} {item.unidade}
                          </TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                'inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold',
                                item.quantidade <= 0
                                  ? 'text-destructive'
                                  : item.quantidade < item.minimo
                                    ? 'text-yellow-600'
                                    : 'text-green-600'
                              )}
                            >
                              <span
                                className={cn(
                                  'h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full',
                                  item.quantidade <= 0
                                    ? 'bg-destructive'
                                    : item.quantidade < item.minimo
                                      ? 'bg-yellow-500'
                                      : 'bg-green-500'
                                )}
                              />
                              {status.label}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-0.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 sm:h-8 sm:w-8"
                                onClick={() => {
                                  setMovDialog({ item, tipo: 'entrada' });
                                  setMovQtd(0);
                                  setMovObs('');
                                }}
                              >
                                <ArrowDownUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 sm:h-8 sm:w-8"
                                onClick={() => openEdit(item)}
                              >
                                <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                  {!loading && filtered.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-24 text-center text-muted-foreground text-xs sm:text-sm"
                      >
                        Nenhum item encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* TAB: Movimentos */}
          <TabsContent value="movimentos" className="space-y-4">
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label>Produto</Label>
                    <Select
                      value={movimentoData.produto_id}
                      onValueChange={v => setMovimentoData(d => ({ ...d, produto_id: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {itens.map(i => (
                          <SelectItem key={i.id} value={i.id}>
                            {i.codigo} – {i.produto}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Tipo</Label>
                    <div className="flex gap-2">
                      {(['entrada', 'saida', 'ajuste'] as const).map(t => (
                        <Button
                          key={t}
                          variant={movimentoData.tipo_movimento === t ? 'default' : 'outline'}
                          className="flex-1"
                          onClick={() => setMovimentoData(d => ({ ...d, tipo_movimento: t }))}
                        >
                          {t === 'entrada' && <TrendingUp className="h-4 w-4 mr-1" />}
                          {t === 'saida' && <TrendingDown className="h-4 w-4 mr-1" />}
                          {t === 'ajuste' && <ArrowDownUp className="h-4 w-4 mr-1" />}
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Quantidade</Label>
                      <Input
                        type="number"
                        min={0}
                        value={movimentoData.quantidade || ''}
                        onChange={e =>
                          setMovimentoData(d => ({ ...d, quantidade: Number(e.target.value) }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Observação</Label>
                      <Input
                        placeholder="Ex: Compra reposição"
                        value={movimentoData.observacao}
                        onChange={e =>
                          setMovimentoData(d => ({ ...d, observacao: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleMovimento}
                    disabled={
                      !movimentoData.produto_id ||
                      !movimentoData.tipo_movimento ||
                      !movimentoData.quantidade
                    }
                  >
                    <ArrowDownUp className="h-4 w-4 mr-2" /> Registrar Movimentação
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: Histórico */}
          <TabsContent value="historico" className="space-y-4">
            {movimentos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <History className="h-12 w-12 mb-3 opacity-20" />
                <p className="text-sm">Nenhuma movimentação registrada</p>
              </div>
            ) : (
              <div className="space-y-2">
                {movimentos.map(mov => {
                  const item = itens.find(i => i.id === mov.produto_id);
                  const isEntrada = mov.tipo_movimento === 'entrada';
                  const isAjuste = mov.tipo_movimento === 'ajuste';
                  return (
                    <div
                      key={mov.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'h-9 w-9 rounded-full flex items-center justify-center shrink-0',
                            isEntrada ? 'bg-green-100' : isAjuste ? 'bg-blue-100' : 'bg-red-100'
                          )}
                        >
                          {isEntrada ? (
                            <TrendingUp className={cn('h-4 w-4 text-green-600')} />
                          ) : isAjuste ? (
                            <ArrowDownUp className={cn('h-4 w-4 text-blue-600')} />
                          ) : (
                            <TrendingDown className={cn('h-4 w-4 text-red-600')} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {item?.produto || 'Produto removido'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {isEntrada ? 'Entrada' : isAjuste ? 'Ajuste' : 'Saída'}:{' '}
                            <span className="font-semibold">
                              {mov.quantidade} {item?.unidade}
                            </span>
                            {mov.observacao ? ` — ${mov.observacao}` : ''}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                        {formatDate(mov.created_at)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Item Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar Item' : 'Novo Item'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Produto *</Label>
                <Input
                  value={form.produto}
                  onChange={e => setForm({ ...form, produto: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    value={form.quantidade}
                    onChange={e => setForm({ ...form, quantidade: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Unidade</Label>
                  <Input
                    value={form.unidade}
                    onChange={e => setForm({ ...form, unidade: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Mínimo</Label>
                  <Input
                    type="number"
                    value={form.minimo}
                    onChange={e => setForm({ ...form, minimo: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Categoria</Label>
                <Select
                  value={form.categoria}
                  onValueChange={v => setForm({ ...form, categoria: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias
                      .filter(c => c !== 'Todos')
                      .map(c => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>{editingId ? 'Salvar' : 'Adicionar'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Quick Movement Dialog */}
        <Dialog open={!!movDialog} onOpenChange={() => setMovDialog(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Movimentação – {movDialog?.item.produto}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="flex gap-2">
                {(['entrada', 'saida', 'ajuste'] as const).map(t => (
                  <Button
                    key={t}
                    variant={movDialog?.tipo === t ? 'default' : 'outline'}
                    className="flex-1"
                    size="sm"
                    onClick={() => movDialog && setMovDialog({ ...movDialog, tipo: t })}
                  >
                    {t === 'entrada' ? 'Entrada' : t === 'saida' ? 'Saída' : 'Ajuste'}
                  </Button>
                ))}
              </div>
              <div className="space-y-1.5">
                <Label>Quantidade ({movDialog?.item.unidade})</Label>
                <Input
                  type="number"
                  min={1}
                  value={movQtd || ''}
                  onChange={e => setMovQtd(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Observação</Label>
                <Input
                  placeholder="Opcional"
                  value={movObs}
                  onChange={e => setMovObs(e.target.value)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Estoque atual: {movDialog?.item.quantidade} {movDialog?.item.unidade}
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setMovDialog(null)}>
                Cancelar
              </Button>
              <Button onClick={handleMov} disabled={movQtd <= 0}>
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Full Movement Dialog */}
        <Dialog open={movimentoDialogOpen} onOpenChange={setMovimentoDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Movimentação</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Produto</Label>
                <Select
                  value={movimentoData.produto_id}
                  onValueChange={v => setMovimentoData(d => ({ ...d, produto_id: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {itens.map(i => (
                      <SelectItem key={i.id} value={i.id}>
                        {i.codigo} – {i.produto}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    min={0}
                    value={movimentoData.quantidade || ''}
                    onChange={e =>
                      setMovimentoData(d => ({ ...d, quantidade: Number(e.target.value) }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Observação</Label>
                  <Input
                    placeholder="Opcional"
                    value={movimentoData.observacao}
                    onChange={e => setMovimentoData(d => ({ ...d, observacao: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Tipo</Label>
                <div className="flex gap-2">
                  {(['entrada', 'saida', 'ajuste'] as const).map(t => (
                    <Button
                      key={t}
                      variant={movimentoData.tipo_movimento === t ? 'default' : 'outline'}
                      className="flex-1"
                      size="sm"
                      onClick={() => setMovimentoData(d => ({ ...d, tipo_movimento: t }))}
                    >
                      {t === 'entrada' ? 'Entrada' : t === 'saida' ? 'Saída' : 'Ajuste'}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setMovimentoDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleMovimento}
                disabled={
                  !movimentoData.produto_id ||
                  !movimentoData.tipo_movimento ||
                  !movimentoData.quantidade
                }
              >
                Registrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PullToRefresh>
  );
};

export default Estoque;
