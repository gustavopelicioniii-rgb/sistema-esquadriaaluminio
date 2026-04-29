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
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomCutRules, type CustomCutRuleRow } from '@/hooks/use-custom-cut-rules';
import { findBaseTypologyId } from '@/hooks/use-all-typologies';
import { Plus, Trash2, Edit2, Download, Loader2, Scissors } from 'lucide-react';
import type { Typology } from '@/types/calculation';
import { toast } from 'sonner';

const REFERENCE_DIMENSIONS = [
  { value: 'L', label: 'L (Largura)' },
  { value: 'H', label: 'H (Altura)' },
  { value: 'L/2', label: 'L/2' },
  { value: 'L/3', label: 'L/3' },
  { value: 'L/4', label: 'L/4' },
  { value: 'L/6', label: 'L/6' },
  { value: 'H/2', label: 'H/2' },
  { value: 'H/3', label: 'H/3' },
  { value: 'FIXED', label: 'Fixo' },
];

const emptyRule = {
  profile_code: '',
  piece_name: '',
  piece_function: '',
  reference_dimension: 'L',
  coefficient: 1,
  constant_mm: 0,
  fixed_value_mm: null as number | null,
  cut_angle_left: 90,
  cut_angle_right: 90,
  quantity_formula: '1',
  sort_order: 0,
  weight_per_meter: 0,
  notes: '',
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

export function CutRulesManager({ typology }: Props) {
  const { rules, loading, addRule, updateRule, deleteRule, inheritFromBase } = useCustomCutRules(
    typology.id
  );
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyRule);
  const [inheriting, setInheriting] = useState(false);

  const handleSave = async () => {
    if (!form.piece_name.trim() || !form.profile_code.trim()) {
      toast.error('Preencha código do perfil e nome da peça');
      return;
    }
    try {
      if (editId) {
        await updateRule(editId, {
          profile_code: form.profile_code,
          piece_name: form.piece_name,
          piece_function: form.piece_function,
          reference_dimension: form.reference_dimension,
          coefficient: form.coefficient,
          constant_mm: form.constant_mm,
          fixed_value_mm: form.reference_dimension === 'FIXED' ? form.fixed_value_mm : null,
          cut_angle_left: form.cut_angle_left,
          cut_angle_right: form.cut_angle_right,
          quantity_formula: form.quantity_formula,
          sort_order: form.sort_order,
          weight_per_meter: form.weight_per_meter,
          notes: form.notes || null,
        } as Partial<CustomCutRuleRow>);
        toast.success('Regra atualizada');
      } else {
        await addRule({
          typology_id: typology.id,
          profile_code: form.profile_code,
          piece_name: form.piece_name,
          piece_function: form.piece_function,
          reference_dimension: form.reference_dimension,
          coefficient: form.coefficient,
          constant_mm: form.constant_mm,
          fixed_value_mm: form.reference_dimension === 'FIXED' ? form.fixed_value_mm : null,
          cut_angle_left: form.cut_angle_left,
          cut_angle_right: form.cut_angle_right,
          quantity_formula: form.quantity_formula,
          sort_order: rules.length + 1,
          weight_per_meter: form.weight_per_meter,
          notes: form.notes || null,
        } as Omit<CustomCutRuleRow, 'id' | 'user_id'>);
        toast.success('Regra adicionada');
      }
      setForm(emptyRule);
      setEditId(null);
      setShowForm(false);
    } catch (err: any) {
      toast.error('Erro', { description: err.message });
    }
  };

  const handleEdit = (r: CustomCutRuleRow) => {
    setForm({
      profile_code: r.profile_code,
      piece_name: r.piece_name,
      piece_function: r.piece_function,
      reference_dimension: r.reference_dimension,
      coefficient: Number(r.coefficient),
      constant_mm: Number(r.constant_mm),
      fixed_value_mm: r.fixed_value_mm != null ? Number(r.fixed_value_mm) : null,
      cut_angle_left: Number(r.cut_angle_left),
      cut_angle_right: Number(r.cut_angle_right),
      quantity_formula: r.quantity_formula,
      sort_order: r.sort_order,
      weight_per_meter: Number(r.weight_per_meter),
      notes: r.notes || '',
    });
    setEditId(r.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRule(id);
      toast.error('Regra removida');
    } catch (err: any) {
      toast.error('Erro', { description: err.message });
    }
  };

  const handleInherit = async () => {
    setInheriting(true);
    try {
      const baseId = findBaseTypologyId({
        product_line_id: typology.product_line_id,
        category: typology.category as Typology['category'],
        subcategory: (typology.subcategory ?? undefined) as Typology['subcategory'],
        num_folhas: typology.num_folhas,
      });
      if (!baseId) {
        toast.error('Nenhuma tipologia base encontrada no catálogo');
        return;
      }
      await inheritFromBase(baseId);
      toast.success('Regras herdadas do catálogo com sucesso!');
    } catch (err: any) {
      toast.error('Erro ao herdar regras', { description: err.message });
    } finally {
      setInheriting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Carregando regras...
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Scissors className="h-4 w-4 text-primary" />
            Regras de Corte — {typology.name}
          </CardTitle>
          <div className="flex gap-2">
            {rules.length === 0 && (
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
            )}
            <Button
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => {
                setForm({ ...emptyRule, sort_order: rules.length + 1 });
                setEditId(null);
                setShowForm(true);
              }}
            >
              <Plus className="h-3 w-3" /> Nova Regra
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {rules.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm space-y-3">
            <p>Nenhuma regra de corte definida.</p>
            <p className="text-xs">
              Use "Herdar do Catálogo" para copiar regras de uma tipologia similar, ou crie do zero.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">#</TableHead>
                  <TableHead className="text-xs">Perfil</TableHead>
                  <TableHead className="text-xs">Peça</TableHead>
                  <TableHead className="text-xs">Ref.</TableHead>
                  <TableHead className="text-xs">Coef.</TableHead>
                  <TableHead className="text-xs">Constante</TableHead>
                  <TableHead className="text-xs">Qtd</TableHead>
                  <TableHead className="text-xs">Ângulos</TableHead>
                  <TableHead className="text-xs">Peso/m</TableHead>
                  <TableHead className="text-xs text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="text-xs">{r.sort_order}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {r.profile_code}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-medium">{r.piece_name}</TableCell>
                    <TableCell className="text-xs">{r.reference_dimension}</TableCell>
                    <TableCell className="text-xs">{Number(r.coefficient)}</TableCell>
                    <TableCell className="text-xs">{Number(r.constant_mm)}mm</TableCell>
                    <TableCell className="text-xs">{r.quantity_formula}</TableCell>
                    <TableCell className="text-xs">
                      {Number(r.cut_angle_left)}°/{Number(r.cut_angle_right)}°
                    </TableCell>
                    <TableCell className="text-xs">{Number(r.weight_per_meter)} kg/m</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleEdit(r)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => handleDelete(r.id)}
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

      {/* Add/Edit Rule Dialog */}
      <Dialog
        open={showForm}
        onOpenChange={o => {
          setShowForm(o);
          if (!o) {
            setEditId(null);
            setForm(emptyRule);
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? 'Editar Regra de Corte' : 'Nova Regra de Corte'}</DialogTitle>
            <DialogDescription>
              {editId ? 'Atualize os dados da regra de corte.' : 'Preencha os dados da nova regra de corte.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Código do Perfil *</Label>
                <Input
                  value={form.profile_code}
                  onChange={e => setForm({ ...form, profile_code: e.target.value })}
                  placeholder="Ex: SU-010"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Nome da Peça *</Label>
                <Input
                  value={form.piece_name}
                  onChange={e => setForm({ ...form, piece_name: e.target.value })}
                  placeholder="Ex: Marco Superior"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Função</Label>
                <Input
                  value={form.piece_function}
                  onChange={e => setForm({ ...form, piece_function: e.target.value })}
                  placeholder="Ex: marco_sup"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Dimensão de Referência</Label>
                <Select
                  value={form.reference_dimension}
                  onValueChange={v => setForm({ ...form, reference_dimension: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REFERENCE_DIMENSIONS.map(d => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Coeficiente</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.coefficient}
                  onChange={e => setForm({ ...form, coefficient: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Constante (mm)</Label>
                <Input
                  type="number"
                  value={form.constant_mm}
                  onChange={e => setForm({ ...form, constant_mm: Number(e.target.value) })}
                />
              </div>
              {form.reference_dimension === 'FIXED' && (
                <div className="space-y-2">
                  <Label className="text-xs">Valor Fixo (mm)</Label>
                  <Input
                    type="number"
                    value={form.fixed_value_mm ?? ''}
                    onChange={e =>
                      setForm({
                        ...form,
                        fixed_value_mm: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Ângulo Esq. (°)</Label>
                <Input
                  type="number"
                  value={form.cut_angle_left}
                  onChange={e => setForm({ ...form, cut_angle_left: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Ângulo Dir. (°)</Label>
                <Input
                  type="number"
                  value={form.cut_angle_right}
                  onChange={e => setForm({ ...form, cut_angle_right: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Fórmula Qtd</Label>
                <Input
                  value={form.quantity_formula}
                  onChange={e => setForm({ ...form, quantity_formula: e.target.value })}
                  placeholder="Ex: 2 ou num_folhas*2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Peso/metro (kg)</Label>
                <Input
                  type="number"
                  step="0.001"
                  value={form.weight_per_meter}
                  onChange={e => setForm({ ...form, weight_per_meter: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Ordem</Label>
                <Input
                  type="number"
                  value={form.sort_order}
                  onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })}
                />
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
