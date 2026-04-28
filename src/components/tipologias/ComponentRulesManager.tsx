import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useCustomComponentRules,
  type CustomComponentRuleRow,
} from '@/hooks/use-custom-component-rules';
import { findBaseTypologyId } from '@/hooks/use-all-typologies';
import { Plus, Trash2, Edit2, Download, Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';

const COMPONENT_TYPES = [
  { value: 'roldana', label: 'Roldana' },
  { value: 'fecho', label: 'Fecho' },
  { value: 'concha', label: 'Concha' },
  { value: 'puxador', label: 'Puxador' },
  { value: 'dobradica', label: 'Dobradiça' },
  { value: 'macaneta', label: 'Maçaneta' },
  { value: 'braço', label: 'Braço' },
  { value: 'haste', label: 'Haste' },
  { value: 'guia', label: 'Guia' },
  { value: 'vedador', label: 'Vedador' },
  { value: 'contrafecho', label: 'Contrafecho' },
  { value: 'ferragem', label: 'Ferragem' },
  { value: 'acessorio', label: 'Acessório' },
  { value: 'vedacao', label: 'Vedação' },
  { value: 'fixacao', label: 'Fixação' },
  { value: 'acabamento', label: 'Acabamento' },
];

const UNITS = [
  { value: 'un', label: 'un' },
  { value: 'm', label: 'm' },
  { value: 'par', label: 'par' },
  { value: 'jg', label: 'jogo' },
  { value: 'rolo', label: 'rolo' },
];

const emptyRule = {
  component_name: '',
  component_code: '',
  component_type: 'ferragem',
  quantity_formula: '1',
  unit: 'un',
  length_reference: '',
  length_constant_mm: 0,
  notes: '',
  sort_order: 0,
};

interface Props {
  typology: {
    id: string;
    product_line_id: string;
    category: string;
    subcategory?: string | null;
    num_folhas: number;
    name: string;
  };
}

export function ComponentRulesManager({ typology }: Props) {
  const { rules, loading, addRule, updateRule, deleteRule, inheritFromBase } =
    useCustomComponentRules(typology.id);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyRule);
  const [inheriting, setInheriting] = useState(false);

  const handleSave = async () => {
    if (!form.component_name.trim()) {
      toast.error('Preencha o nome do componente');
      return;
    }
    try {
      if (editId) {
        await updateRule(editId, {
          component_name: form.component_name,
          component_code: form.component_code,
          component_type: form.component_type,
          quantity_formula: form.quantity_formula,
          unit: form.unit,
          length_reference: form.length_reference || null,
          length_constant_mm: Number(form.length_constant_mm),
          notes: form.notes || null,
          sort_order: form.sort_order,
        } as any);
        toast.success('Componente atualizado');
      } else {
        await addRule({
          typology_id: typology.id,
          component_name: form.component_name,
          component_code: form.component_code,
          component_type: form.component_type,
          quantity_formula: form.quantity_formula,
          unit: form.unit,
          length_reference: form.length_reference || null,
          length_constant_mm: Number(form.length_constant_mm),
          notes: form.notes || null,
          sort_order: rules.length,
        } as any);
        toast.success('Componente adicionado');
      }
      setShowForm(false);
      setEditId(null);
      setForm(emptyRule);
    } catch (err: any) {
      toast.error('Erro ao salvar', { description: err.message });
    }
  };

  const handleEdit = (rule: CustomComponentRuleRow) => {
    setEditId(rule.id);
    setForm({
      component_name: rule.component_name,
      component_code: rule.component_code || '',
      component_type: rule.component_type,
      quantity_formula: rule.quantity_formula,
      unit: rule.unit,
      length_reference: rule.length_reference || '',
      length_constant_mm: Number(rule.length_constant_mm),
      notes: rule.notes || '',
      sort_order: rule.sort_order,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRule(id);
      toast.error('Componente removido');
    } catch (err: any) {
      toast.error('Erro ao remover', { description: err.message });
    }
  };

  const handleInherit = async () => {
    const baseId = findBaseTypologyId(typology as any);
    if (!baseId) {
      toast.error('Tipologia base não encontrada', {
        description: 'Não foi possível identificar a tipologia de origem.',
      });
      return;
    }
    setInheriting(true);
    try {
      await inheritFromBase(baseId);
      toast.success('Componentes herdados', {
        description: 'Regras de componentes do catálogo foram copiadas.',
      });
    } catch (err: any) {
      toast.error('Erro ao herdar', { description: err.message });
    }
    setInheriting(false);
  };

  const getTypeLabel = (type: string) => COMPONENT_TYPES.find(t => t.value === type)?.label || type;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" /> Componentes Customizados
            <Badge variant="secondary" className="text-[10px]">
              {rules.length}
            </Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={handleInherit}
              disabled={inheriting}
            >
              {inheriting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Download className="h-3 w-3" />
              )}
              Herdar do Catálogo
            </Button>
            <Button
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => {
                setForm(emptyRule);
                setEditId(null);
                setShowForm(true);
              }}
            >
              <Plus className="h-3 w-3" /> Adicionar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="flex items-center justify-center py-6 text-muted-foreground gap-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando...
          </div>
        ) : rules.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm">
            <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>Nenhum componente cadastrado.</p>
            <p className="text-xs mt-1">Adicione ou herde do catálogo base.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-center">Qtd</TableHead>
                  <TableHead className="text-center">Un.</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map(rule => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium text-xs">{rule.component_name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {rule.component_code || '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px]">
                        {getTypeLabel(rule.component_type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-xs font-mono">
                      {rule.quantity_formula}
                    </TableCell>
                    <TableCell className="text-center text-xs">{rule.unit}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleEdit(rule)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(rule.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Add/Edit Dialog */}
      <Dialog
        open={showForm}
        onOpenChange={o => {
          if (!o) {
            setShowForm(false);
            setEditId(null);
            setForm(emptyRule);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editId ? 'Editar Componente' : 'Adicionar Componente'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">Nome do Componente</Label>
                <Input
                  value={form.component_name}
                  onChange={e => setForm({ ...form, component_name: e.target.value })}
                  placeholder="Ex: Roldana c/ regulagem"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Código</Label>
                <Input
                  value={form.component_code}
                  onChange={e => setForm({ ...form, component_code: e.target.value })}
                  placeholder="Ex: ROL-426"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">Tipo</Label>
                <Select
                  value={form.component_type}
                  onValueChange={v => setForm({ ...form, component_type: v })}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPONENT_TYPES.map(t => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Quantidade</Label>
                <Input
                  value={form.quantity_formula}
                  onChange={e => setForm({ ...form, quantity_formula: e.target.value })}
                  placeholder="Ex: 4"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Unidade</Label>
                <Select value={form.unit} onValueChange={v => setForm({ ...form, unit: v })}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map(u => (
                      <SelectItem key={u.value} value={u.value}>
                        {u.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setEditId(null);
                setForm(emptyRule);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave}>{editId ? 'Salvar' : 'Adicionar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
