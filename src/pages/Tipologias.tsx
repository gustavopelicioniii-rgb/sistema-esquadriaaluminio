import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
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
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { usePageTitle } from '@/hooks/use-page-title';
import { supabase } from '@/integrations/supabase/client';
import { typologies as catalogTypologies } from '@/data/catalog/typologies';
import { productLines } from '@/data/catalog/manufacturers';
import { Plus, Edit2, Search, Layers, BookOpen, FileDown } from 'lucide-react';
import { generateReportPdf } from '@/utils/reportPdfGenerator';
import { CutRulesManager } from '@/components/tipologias/CutRulesManager';
import { TypologyDetailDialog } from '@/components/tipologias/TypologyDetailDialog';
import { GlassRulesManager } from '@/components/tipologias/GlassRulesManager';
import { ComponentRulesManager } from '@/components/tipologias/ComponentRulesManager';
import { RulesValidatorWrapper } from '@/components/ai/RulesValidatorWrapper';
import { toast } from 'sonner';
import { TypologyFilters } from '@/components/tipologias/TypologyFilters';
import { TypologyCatalogGrid } from '@/components/tipologias/TypologyCatalogGrid';
import { TypologyCustomTable } from '@/components/tipologias/TypologyCustomTable';

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

const SUBCATEGORIES = [
  { value: 'correr', label: 'Correr' },
  { value: 'giro', label: 'Giro' },
  { value: 'maxim_ar', label: 'Maxim-Ar' },
  { value: 'camarao', label: 'Camarão' },
  { value: 'basculante', label: 'Basculante' },
  { value: 'pivotante', label: 'Pivotante' },
  { value: 'fixo', label: 'Fixo' },
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

const emptyForm = {
  product_line_id: 'line-suprema',
  name: '',
  category: 'janela',
  subcategory: 'correr',
  num_folhas: 2,
  has_veneziana: false,
  has_bandeira: false,
  notes: '',
  min_width_mm: 600,
  max_width_mm: 4000,
  min_height_mm: 400,
  max_height_mm: 2500,
};

const ITEMS_PER_PAGE = 24;

const Tipologias = () => {
  usePageTitle('Tipologias');
  const [tab, setTab] = useState('catalogo');
  const [search, setSearch] = useState('');
  const [filterLine, setFilterLine] = useState('all');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterSubcategory, setFilterSubcategory] = useState<string | null>(null);
  const [filterFolhas, setFilterFolhas] = useState<number | null>(null);
  const [filterVeneziana, setFilterVeneziana] = useState<boolean | null>(null);
  const [filterBandeira, setFilterBandeira] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [customs, setCustoms] = useState<CustomTypology[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [rulesTypology, setRulesTypology] = useState<CustomTypology | null>(null);
  const [detailTypology, setDetailTypology] = useState<(typeof catalogTypologies)[0] | null>(null);

  const fetchCustoms = async () => {
    const { data } = await supabase
      .from('tipologias_customizadas')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setCustoms(data as unknown as CustomTypology[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchCustoms();
  }, []);

  const getLineName = (lineId: string) => productLines.find(l => l.id === lineId)?.name || lineId;
  const getCategoryLabel = (cat: string) => CATEGORIES.find(c => c.value === cat)?.label || cat;

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    filterLine,
    filterCategory,
    filterSubcategory,
    filterFolhas,
    filterVeneziana,
    filterBandeira,
  ]);

  const filteredCatalog = useMemo(
    () =>
      catalogTypologies.filter(t => {
        const matchSearch =
          !search ||
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          (t.id && t.id.toLowerCase().includes(search.toLowerCase()));
        const matchLine = filterLine === 'all' || t.product_line_id === filterLine;
        const matchCategory = !filterCategory || t.category === filterCategory;
        const matchSubcategory = !filterSubcategory || t.subcategory === filterSubcategory;
        const matchFolhas = !filterFolhas || t.num_folhas === filterFolhas;
        const matchVeneziana = filterVeneziana === null || t.has_veneziana === filterVeneziana;
        const matchBandeira = filterBandeira === null || t.has_bandeira === filterBandeira;
        return (
          matchSearch &&
          matchLine &&
          matchCategory &&
          matchSubcategory &&
          matchFolhas &&
          matchVeneziana &&
          matchBandeira
        );
      }),
    [
      search,
      filterLine,
      filterCategory,
      filterSubcategory,
      filterFolhas,
      filterVeneziana,
      filterBandeira,
    ]
  );

  const totalPages = Math.ceil(filteredCatalog.length / ITEMS_PER_PAGE);
  const paginatedCatalog = filteredCatalog.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const uniqueCategories = useMemo(() => [...new Set(catalogTypologies.map(t => t.category))], []);
  const uniqueSubcategories = useMemo(
    () => [...new Set(catalogTypologies.map(t => t.subcategory).filter(Boolean))],
    []
  );
  const uniqueFolhas = useMemo(
    () => [...new Set(catalogTypologies.map(t => t.num_folhas))].sort((a, b) => a - b),
    []
  );
  const uniqueLines = useMemo(
    () =>
      [...new Set(catalogTypologies.map(t => t.product_line_id))].map(id => ({
        id,
        name: getLineName(id),
      })),
    []
  );

  const filteredCustom = useMemo(
    () =>
      customs.filter(t => {
        const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
        const matchLine = filterLine === 'all' || t.product_line_id === filterLine;
        return matchSearch && matchLine;
      }),
    [customs, search, filterLine]
  );

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Nome obrigatório');
      return;
    }
    const payload = {
      product_line_id: form.product_line_id,
      name: form.name,
      category: form.category,
      subcategory: form.subcategory,
      num_folhas: form.num_folhas,
      has_veneziana: form.has_veneziana,
      has_bandeira: form.has_bandeira,
      notes: form.notes,
      min_width_mm: form.min_width_mm,
      max_width_mm: form.max_width_mm,
      min_height_mm: form.min_height_mm,
      max_height_mm: form.max_height_mm,
    };
    if (editId) {
      const { error } = await supabase
        .from('tipologias_customizadas')
        .update(payload)
        .eq('id', editId);
      if (error) {
        toast.error('Erro ao atualizar', { description: error.message });
        return;
      }
      toast.success('Tipologia atualizada');
    } else {
      const { error } = await supabase.from('tipologias_customizadas').insert([payload]);
      if (error) {
        toast.error('Erro ao criar', { description: error.message });
        return;
      }
      toast.success('Tipologia criada');
    }
    setForm(emptyForm);
    setEditId(null);
    setShowAdd(false);
    fetchCustoms();
  };

  const handleEdit = (t: CustomTypology) => {
    setForm({
      product_line_id: t.product_line_id,
      name: t.name,
      category: t.category,
      subcategory: t.subcategory || 'correr',
      num_folhas: t.num_folhas,
      has_veneziana: t.has_veneziana,
      has_bandeira: t.has_bandeira,
      notes: t.notes || '',
      min_width_mm: t.min_width_mm || 600,
      max_width_mm: t.max_width_mm || 4000,
      min_height_mm: t.min_height_mm || 400,
      max_height_mm: t.max_height_mm || 2500,
    });
    setEditId(t.id);
    setShowAdd(true);
  };

  const handleDuplicate = (t: CustomTypology) => {
    setForm({
      product_line_id: t.product_line_id,
      name: t.name + ' (Cópia)',
      category: t.category,
      subcategory: t.subcategory || 'correr',
      num_folhas: t.num_folhas,
      has_veneziana: t.has_veneziana,
      has_bandeira: t.has_bandeira,
      notes: t.notes || '',
      min_width_mm: t.min_width_mm || 600,
      max_width_mm: t.max_width_mm || 4000,
      min_height_mm: t.min_height_mm || 400,
      max_height_mm: t.max_height_mm || 2500,
    });
    setEditId(null);
    setShowAdd(true);
  };

  const handleCloneFromCatalog = (t: (typeof catalogTypologies)[0]) => {
    setForm({
      product_line_id: t.product_line_id,
      name: t.name + ' (Customizada)',
      category: t.category,
      subcategory: t.subcategory || 'correr',
      num_folhas: t.num_folhas,
      has_veneziana: t.has_veneziana,
      has_bandeira: t.has_bandeira,
      notes: t.notes || '',
      min_width_mm: t.min_width_mm || 600,
      max_width_mm: t.max_width_mm || 4000,
      min_height_mm: t.min_height_mm || 400,
      max_height_mm: t.max_height_mm || 2500,
    });
    setEditId(null);
    setShowAdd(true);
    setTab('customizadas');
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('tipologias_customizadas').delete().eq('id', id);
    if (error) {
      toast.error('Erro', { description: error.message });
      return;
    }
    toast.error('Tipologia removida');
    fetchCustoms();
  };

  const handleToggle = async (id: string, active: boolean) => {
    const { error } = await supabase
      .from('tipologias_customizadas')
      .update({ active: !active })
      .eq('id', id);
    if (error) {
      toast.error('Erro', { description: error.message });
      return;
    }
    fetchCustoms();
  };

  const clearFilters = () => {
    setFilterCategory(null);
    setFilterSubcategory(null);
    setFilterFolhas(null);
    setFilterVeneziana(null);
    setFilterBandeira(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tipologias</h1>
          <p className="text-muted-foreground text-sm">
            {catalogTypologies.length} do catálogo + {customs.length} customizadas
          </p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            setForm(emptyForm);
            setEditId(null);
            setShowAdd(true);
            setTab('customizadas');
          }}
        >
          <Plus className="h-4 w-4" /> Nova Tipologia
        </Button>
      </div>

      {/* Search + line filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar tipologia..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterLine} onValueChange={setFilterLine}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Todas as linhas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as linhas</SelectItem>
            {uniqueLines.map(l => (
              <SelectItem key={l.id} value={l.id}>
                {l.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="catalogo" className="gap-1.5">
            <BookOpen className="h-4 w-4" /> Catálogo ({filteredCatalog.length})
          </TabsTrigger>
          <TabsTrigger value="customizadas" className="gap-1.5">
            <Layers className="h-4 w-4" /> Customizadas ({filteredCustom.length})
          </TabsTrigger>
        </TabsList>

        {/* CATALOG TAB */}
        <TabsContent value="catalogo" className="mt-4">
          <div className="flex gap-4">
            <TypologyFilters
              filterCategory={filterCategory}
              filterSubcategory={filterSubcategory}
              filterFolhas={filterFolhas}
              filterVeneziana={filterVeneziana}
              filterBandeira={filterBandeira}
              uniqueCategories={uniqueCategories}
              uniqueSubcategories={uniqueSubcategories}
              uniqueFolhas={uniqueFolhas}
              onFilterCategory={setFilterCategory}
              onFilterSubcategory={setFilterSubcategory}
              onFilterFolhas={setFilterFolhas}
              onFilterVeneziana={setFilterVeneziana}
              onFilterBandeira={setFilterBandeira}
              onClearAll={clearFilters}
              totalCount={catalogTypologies.length}
              filteredCount={filteredCatalog.length}
            />
            <TypologyCatalogGrid
              items={paginatedCatalog as any}
              getLineName={getLineName}
              filteredCount={filteredCatalog.length}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onDetail={setDetailTypology as any}
              onClone={handleCloneFromCatalog}
            />
          </div>
        </TabsContent>

        {/* CUSTOM TAB */}
        <TabsContent value="customizadas" className="mt-4">
          <TypologyCustomTable
            items={filteredCustom as any}
            loading={loading}
            getLineName={getLineName}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onToggle={handleToggle}
            onRules={setRulesTypology}
            onNew={() => {
              setForm(emptyForm);
              setEditId(null);
              setShowAdd(true);
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog
        open={showAdd}
        onOpenChange={o => {
          setShowAdd(o);
          if (!o) {
            setEditId(null);
            setForm(emptyForm);
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? 'Editar Tipologia' : 'Nova Tipologia Customizada'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Janela de Correr 2F Especial"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Linha do Produto</Label>
                <Select
                  value={form.product_line_id}
                  onValueChange={v => setForm({ ...form, product_line_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {productLines
                      .filter(l => l.active)
                      .map(l => (
                        <SelectItem key={l.id} value={l.id}>
                          {l.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={form.category}
                  onValueChange={v => setForm({ ...form, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subcategoria</Label>
                <Select
                  value={form.subcategory}
                  onValueChange={v => setForm({ ...form, subcategory: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBCATEGORIES.map(c => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nº de Folhas</Label>
                <Input
                  type="number"
                  min={0}
                  max={12}
                  value={form.num_folhas}
                  onChange={e => setForm({ ...form, num_folhas: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.has_veneziana}
                  onCheckedChange={v => setForm({ ...form, has_veneziana: v })}
                />
                <Label className="text-sm">Veneziana</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.has_bandeira}
                  onCheckedChange={v => setForm({ ...form, has_bandeira: v })}
                />
                <Label className="text-sm">Bandeira</Label>
              </div>
            </div>
            <Separator />
            <h4 className="text-xs font-bold uppercase text-muted-foreground">
              Dimensões do Vão (mm)
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Largura Mín.</Label>
                <Input
                  type="number"
                  value={form.min_width_mm}
                  onChange={e => setForm({ ...form, min_width_mm: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Largura Máx.</Label>
                <Input
                  type="number"
                  value={form.max_width_mm}
                  onChange={e => setForm({ ...form, max_width_mm: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Altura Mín.</Label>
                <Input
                  type="number"
                  value={form.min_height_mm}
                  onChange={e => setForm({ ...form, min_height_mm: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Altura Máx.</Label>
                <Input
                  type="number"
                  value={form.max_height_mm}
                  onChange={e => setForm({ ...form, max_height_mm: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                placeholder="Notas opcionais..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAdd(false);
                setEditId(null);
                setForm(emptyForm);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} className="gap-2">
              {editId ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {editId ? 'Salvar' : 'Criar Tipologia'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rules Dialog */}
      <Dialog
        open={!!rulesTypology}
        onOpenChange={o => {
          if (!o) setRulesTypology(null);
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Regras — {rulesTypology?.name}</DialogTitle>
          </DialogHeader>
          {rulesTypology && (
            <div className="space-y-6">
              <RulesValidatorWrapper typology={rulesTypology} />
              <CutRulesManager typology={rulesTypology} />
              <GlassRulesManager typology={rulesTypology} />
              <ComponentRulesManager typology={rulesTypology} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <TypologyDetailDialog
        typology={detailTypology}
        open={!!detailTypology}
        onOpenChange={o => {
          if (!o) setDetailTypology(null);
        }}
      />
    </div>
  );
};

export default Tipologias;
