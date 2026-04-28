import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
import { Progress } from '@/components/ui/progress';
import { Search, Plus, FileDown, Loader2, Pencil, PackagePlus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface MaterialItem {
  id: string;
  codigo: string;
  produto: string;
  categoria: string;
  quantidade: number;
  minimo: number;
  unidade: string;
}

const categorias = ['Perfis', 'Vidros', 'Acessórios', 'Insumos', 'Fixação', 'Outros'];

const categoriaCores: Record<string, { bg: string; text: string; border: string }> = {
  Perfis: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-300 dark:border-blue-700',
  },
  Vidros: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-300 dark:border-emerald-700',
  },
  Acessórios: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-700 dark:text-purple-400',
    border: 'border-purple-300 dark:border-purple-700',
  },
  Insumos: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-300 dark:border-amber-700',
  },
  Fixação: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-700 dark:text-rose-400',
    border: 'border-rose-300 dark:border-rose-700',
  },
  Outros: {
    bg: 'bg-gray-500/10',
    text: 'text-gray-700 dark:text-gray-400',
    border: 'border-gray-300 dark:border-gray-700',
  },
};

const RelacaoMateriais = () => {
  const [search, setSearch] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string | null>(null);
  const [materiais, setMateriais] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<MaterialItem | null>(null);
  const [reabastecerItem, setReabastecerItem] = useState<MaterialItem | null>(null);
  const [reabastecerQtd, setReabastecerQtd] = useState(0);
  const [form, setForm] = useState({
    produto: '',
    categoria: 'Perfis',
    quantidade: 0,
    minimo: 0,
    unidade: 'pçs',
  });

  const fetchMateriais = async () => {
    const { data, error } = await supabase.from('estoque').select('*').order('codigo');
    if (!error && data) setMateriais(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMateriais();
  }, []);

  const filtered = materiais.filter(item => {
    if (categoriaFiltro && item.categoria !== categoriaFiltro) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return item.produto.toLowerCase().includes(s) || item.codigo.toLowerCase().includes(s);
  });

  const categoriaCounts = categorias.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = materiais.filter(m => m.categoria === cat).length;
    return acc;
  }, {});

  const lowStockCount = materiais.filter(m => m.quantidade <= m.minimo).length;

  const handleAddMaterial = async () => {
    if (!form.produto.trim()) {
      toast.error('Nome do produto é obrigatório');
      return;
    }
    const codigo = `EST-${String(materiais.length + 1).padStart(3, '0')}`;
    const { error } = await supabase.from('estoque').insert({ codigo, ...form });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Material adicionado!');
    setDialogOpen(false);
    setForm({ produto: '', categoria: 'Perfis', quantidade: 0, minimo: 0, unidade: 'pçs' });
    fetchMateriais();
  };

  const handleEdit = (item: MaterialItem) => {
    setEditItem(item);
    setForm({
      produto: item.produto,
      categoria: item.categoria,
      quantidade: item.quantidade,
      minimo: item.minimo,
      unidade: item.unidade,
    });
    setDialogOpen(true);
  };

  const handleUpdateMaterial = async () => {
    if (!editItem) return;
    const { error } = await supabase
      .from('estoque')
      .update({
        produto: form.produto,
        categoria: form.categoria,
        quantidade: form.quantidade,
        minimo: form.minimo,
        unidade: form.unidade,
      })
      .eq('id', editItem.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Material atualizado!');
    setDialogOpen(false);
    setEditItem(null);
    setForm({ produto: '', categoria: 'Perfis', quantidade: 0, minimo: 0, unidade: 'pçs' });
    fetchMateriais();
  };

  const handleReabastecer = async () => {
    if (!reabastecerItem || reabastecerQtd <= 0) return;
    const novaQtd = reabastecerItem.quantidade + reabastecerQtd;
    const { error } = await supabase
      .from('estoque')
      .update({ quantidade: novaQtd })
      .eq('id', reabastecerItem.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`+${reabastecerQtd} ${reabastecerItem.unidade} adicionado(s)!`);
    setReabastecerItem(null);
    setReabastecerQtd(0);
    fetchMateriais();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('estoque').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Material excluído!');
    fetchMateriais();
  };

  const getStockLevel = (item: MaterialItem) => {
    if (item.minimo === 0) return 100;
    const ratio = (item.quantidade / (item.minimo * 3)) * 100;
    return Math.min(100, Math.max(0, ratio));
  };

  const getStockColor = (item: MaterialItem) => {
    const baixo = item.quantidade <= item.minimo;
    const medio = item.quantidade <= item.minimo * 1.5;
    if (baixo) return 'bg-destructive';
    if (medio) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relação de Materiais</h1>
          <p className="text-muted-foreground text-sm">
            {materiais.length} itens •{' '}
            {lowStockCount > 0 && (
              <span className="text-destructive font-medium">
                {lowStockCount} com baixo estoque
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileDown className="h-4 w-4" /> Exportar
          </Button>
          <Button
            className="gap-2"
            onClick={() => {
              setEditItem(null);
              setForm({
                produto: '',
                categoria: 'Perfis',
                quantidade: 0,
                minimo: 0,
                unidade: 'pçs',
              });
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Novo Material
          </Button>
        </div>
      </div>

      {/* Filtros por Categoria */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={categoriaFiltro === null ? 'default' : 'outline'}
          size="sm"
          className="text-xs h-8"
          onClick={() => setCategoriaFiltro(null)}
        >
          Todos ({materiais.length})
        </Button>
        {categorias.map(cat => {
          const cores = categoriaCores[cat] || categoriaCores.Outros;
          const count = categoriaCounts[cat] || 0;
          if (count === 0) return null;
          return (
            <Button
              key={cat}
              variant={categoriaFiltro === cat ? 'default' : 'outline'}
              size="sm"
              className={`text-xs h-8 gap-1.5 ${categoriaFiltro !== cat ? `${cores.text}` : ''}`}
              onClick={() => setCategoriaFiltro(categoriaFiltro === cat ? null : cat)}
            >
              {cat}
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 ml-0.5">
                {count}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Busca */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou código..."
          className="pl-9"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead className="hidden sm:table-cell">Mínimo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(item => {
                const baixo = item.quantidade <= item.minimo;
                const cores = categoriaCores[item.categoria] || categoriaCores.Outros;
                return (
                  <TableRow
                    key={item.id}
                    className={baixo ? 'bg-destructive/5 hover:bg-destructive/10' : ''}
                  >
                    <TableCell className="font-mono text-xs font-medium">{item.codigo}</TableCell>
                    <TableCell className="font-medium">{item.produto}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[11px] border ${cores.bg} ${cores.text} ${cores.border}`}
                      >
                        {item.categoria}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 min-w-[120px]">
                        <span
                          className={`text-sm font-semibold ${baixo ? 'text-destructive' : ''}`}
                        >
                          {item.quantidade} {item.unidade}
                        </span>
                        <Progress
                          value={getStockLevel(item)}
                          className={`h-1.5 ${getStockColor(item)}`}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm hidden sm:table-cell">
                      {item.minimo} {item.unidade}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold ${baixo ? 'text-destructive' : 'text-emerald-600 dark:text-emerald-400'}`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${baixo ? 'bg-destructive animate-pulse' : 'bg-emerald-500'}`}
                        />
                        {baixo ? 'Baixo Estoque' : 'Normal'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title="Reabastecer"
                          onClick={() => {
                            setReabastecerItem(item);
                            setReabastecerQtd(item.minimo);
                          }}
                        >
                          <PackagePlus className="h-3.5 w-3.5 text-emerald-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title="Editar"
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7" title="Excluir">
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir material?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir "{item.produto}"? Esta ação não pode
                                ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(item.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    Nenhum material encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialog Criar/Editar */}
      <Dialog
        open={dialogOpen}
        onOpenChange={open => {
          setDialogOpen(open);
          if (!open) setEditItem(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Editar Material' : 'Novo Material'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Produto</Label>
              <Input
                value={form.produto}
                onChange={e => setForm({ ...form, produto: e.target.value })}
                placeholder="Nome do material"
              />
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select
                value={form.categoria}
                onValueChange={v => setForm({ ...form, categoria: v })}
              >
                <SelectTrigger>
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
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Quantidade</Label>
                <Input
                  type="number"
                  value={form.quantidade}
                  onChange={e => setForm({ ...form, quantidade: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Mínimo</Label>
                <Input
                  type="number"
                  value={form.minimo}
                  onChange={e => setForm({ ...form, minimo: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Unidade</Label>
                <Select value={form.unidade} onValueChange={v => setForm({ ...form, unidade: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pçs">pçs</SelectItem>
                    <SelectItem value="m">m</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="barras">barras</SelectItem>
                    <SelectItem value="chapas">chapas</SelectItem>
                    <SelectItem value="tubos">tubos</SelectItem>
                    <SelectItem value="metros">metros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setEditItem(null);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={editItem ? handleUpdateMaterial : handleAddMaterial}>
              {editItem ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Reabastecer */}
      <Dialog
        open={!!reabastecerItem}
        onOpenChange={open => {
          if (!open) setReabastecerItem(null);
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Reabastecer Estoque</DialogTitle>
          </DialogHeader>
          {reabastecerItem && (
            <div className="space-y-4 py-2">
              <p className="text-sm">
                <span className="font-semibold">{reabastecerItem.produto}</span>
                <span className="text-muted-foreground">
                  {' '}
                  — Atual: {reabastecerItem.quantidade} {reabastecerItem.unidade}
                </span>
              </p>
              <div className="space-y-2">
                <Label>Quantidade a adicionar</Label>
                <Input
                  type="number"
                  min={1}
                  value={reabastecerQtd}
                  onChange={e => setReabastecerQtd(Math.max(0, Number(e.target.value)))}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Novo total:{' '}
                <span className="font-semibold text-foreground">
                  {reabastecerItem.quantidade + reabastecerQtd} {reabastecerItem.unidade}
                </span>
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReabastecerItem(null)}>
              Cancelar
            </Button>
            <Button onClick={handleReabastecer} disabled={reabastecerQtd <= 0} className="gap-1.5">
              <PackagePlus className="h-4 w-4" /> Reabastecer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RelacaoMateriais;
