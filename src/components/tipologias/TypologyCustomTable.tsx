import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Layers, Plus } from 'lucide-react';
import { Edit2, Copy, Trash2, Scissors } from 'lucide-react';

const CATEGORIES = [
  { value: 'janela', label: 'Janela' },
  { value: 'porta', label: 'Porta' },
  { value: 'vitro', label: 'Vitrô' },
  { value: 'veneziana', label: 'Veneziana' },
  { value: 'maxim_ar', label: 'Maxim-Ar' },
  { value: 'camarao', label: 'Camarão' },
  { value: 'pivotante', label: 'Pivotante' },
  { value: 'basculante', label: 'Basculante' },
  { value: 'fachada', label: 'Fachada' },
];

interface CustomTypology {
  id: string;
  product_line_id: string;
  name: string;
  category: string;
  subcategory: string | null;
  num_folhas: number;
  has_veneziana: boolean;
  has_bandeira: boolean;
  notes: string | null;
  active: boolean;
  min_width_mm: number | null;
  max_width_mm: number | null;
  min_height_mm: number | null;
  max_height_mm: number | null;
}

interface Props {
  items: CustomTypology[];
  loading: boolean;
  getLineName: (id: string) => string;
  onEdit: (t: CustomTypology) => void;
  onDuplicate: (t: CustomTypology) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, active: boolean) => void;
  onRules: (t: CustomTypology) => void;
  onNew: () => void;
}

export function TypologyCustomTable({
  items,
  loading,
  getLineName,
  onEdit,
  onDuplicate,
  onDelete,
  onToggle,
  onRules,
  onNew,
}: Props) {
  const getCategoryLabel = (cat: string) => CATEGORIES.find(c => c.value === cat)?.label || cat;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        Carregando...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="shadow-sm border-border/50">
        <CardContent className="py-12 text-center">
          <Layers className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground text-sm">Nenhuma tipologia customizada ainda.</p>
          <p className="text-xs text-muted-foreground mt-1">Crie uma nova ou clone do catálogo.</p>
          <Button className="mt-4 gap-2" onClick={onNew}>
            <Plus className="h-4 w-4" /> Criar Tipologia
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-border/50">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Linha</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="hidden md:table-cell">Folhas</TableHead>
              <TableHead className="hidden lg:table-cell">Dimensões (mm)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(t => (
              <TableRow key={t.id} className={!t.active ? 'opacity-50' : ''}>
                <TableCell className="font-medium text-sm">{t.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-[10px]">
                    {getLineName(t.product_line_id)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{getCategoryLabel(t.category)}</TableCell>
                <TableCell className="hidden md:table-cell text-sm">{t.num_folhas}</TableCell>
                <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                  {t.min_width_mm}–{t.max_width_mm} × {t.min_height_mm}–{t.max_height_mm}
                </TableCell>
                <TableCell>
                  <Switch checked={t.active} onCheckedChange={() => onToggle(t.id, t.active)} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onRules(t)}
                      title="Regras de Corte"
                    >
                      <Scissors className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onDuplicate(t)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(t)}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDelete(t.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
