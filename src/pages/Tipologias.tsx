import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePageTitle } from "@/hooks/use-page-title";
import { supabase } from "@/integrations/supabase/client";
import { typologies as catalogTypologies } from "@/data/catalog/typologies";
import { productLines } from "@/data/catalog/manufacturers";
import { Plus, Trash2, Edit2, Search, Layers, BookOpen, Loader2, Copy, Scissors, GlassWater, Package, Filter, Eye, FileDown } from "lucide-react";
import { generateReportPdf } from "@/utils/reportPdfGenerator";
import { CutRulesManager } from "@/components/tipologias/CutRulesManager";
import { TypologyDetailDialog } from "@/components/tipologias/TypologyDetailDialog";
import { GlassRulesManager } from "@/components/tipologias/GlassRulesManager";
import { ComponentRulesManager } from "@/components/tipologias/ComponentRulesManager";
import { RulesValidatorWrapper } from "@/components/ai/RulesValidatorWrapper";
import { FramePreview } from "@/components/frame-preview";
import PhotorealisticPreview from "@/components/frame-preview/PhotorealisticPreview";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "janela", label: "Janela" },
  { value: "porta", label: "Porta" },
  { value: "vitro", label: "Vitrô" },
  { value: "veneziana", label: "Veneziana" },
  { value: "maxim_ar", label: "Maxim-Ar" },
  { value: "camarao", label: "Camarão" },
  { value: "pivotante", label: "Pivotante" },
  { value: "basculante", label: "Basculante" },
  { value: "fachada", label: "Fachada" },
];

const SUBCATEGORIES = [
  { value: "correr", label: "Correr" },
  { value: "giro", label: "Giro" },
  { value: "maxim_ar", label: "Maxim-Ar" },
  { value: "camarao", label: "Camarão" },
  { value: "basculante", label: "Basculante" },
  { value: "pivotante", label: "Pivotante" },
  { value: "fixo", label: "Fixo" },
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
  product_line_id: "line-suprema",
  name: "",
  category: "janela",
  subcategory: "correr",
  num_folhas: 2,
  has_veneziana: false,
  has_bandeira: false,
  notes: "",
  min_width_mm: 600,
  max_width_mm: 4000,
  min_height_mm: 400,
  max_height_mm: 2500,
};

const Tipologias = () => {
  usePageTitle("Tipologias");
  const [tab, setTab] = useState("catalogo");
  const [search, setSearch] = useState("");
  const [filterLine, setFilterLine] = useState("all");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterSubcategory, setFilterSubcategory] = useState<string | null>(null);
  const [filterFolhas, setFilterFolhas] = useState<number | null>(null);
  const [filterVeneziana, setFilterVeneziana] = useState<boolean | null>(null);
  const [filterBandeira, setFilterBandeira] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 24;

  // Custom typologies
  const [customs, setCustoms] = useState<CustomTypology[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [rulesTypology, setRulesTypology] = useState<CustomTypology | null>(null);
  const [detailTypology, setDetailTypology] = useState<typeof catalogTypologies[0] | null>(null);

  const fetchCustoms = async () => {
    const { data } = await supabase.from("tipologias_customizadas").select("*").order("created_at", { ascending: false });
    if (data) setCustoms(data as unknown as CustomTypology[]);
    setLoading(false);
  };

  useEffect(() => { fetchCustoms(); }, []);

  const getLineName = (lineId: string) => {
    const line = productLines.find(l => l.id === lineId);
    return line ? line.name : lineId;
  };

  const getCategoryLabel = (cat: string) => CATEGORIES.find(c => c.value === cat)?.label || cat;

  // Reset page when filters change
  useEffect(() => { setCurrentPage(1); }, [search, filterLine, filterCategory, filterSubcategory, filterFolhas, filterVeneziana, filterBandeira]);

  // Filtered catalog typologies
  const filteredCatalog = catalogTypologies.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || (t.id && t.id.toLowerCase().includes(search.toLowerCase()));
    const matchLine = filterLine === "all" || t.product_line_id === filterLine;
    const matchCategory = !filterCategory || t.category === filterCategory;
    const matchSubcategory = !filterSubcategory || t.subcategory === filterSubcategory;
    const matchFolhas = !filterFolhas || t.num_folhas === filterFolhas;
    const matchVeneziana = filterVeneziana === null || t.has_veneziana === filterVeneziana;
    const matchBandeira = filterBandeira === null || t.has_bandeira === filterBandeira;
    return matchSearch && matchLine && matchCategory && matchSubcategory && matchFolhas && matchVeneziana && matchBandeira;
  });

  const totalPages = Math.ceil(filteredCatalog.length / ITEMS_PER_PAGE);
  const paginatedCatalog = filteredCatalog.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Unique values for sidebar filters
  const uniqueCategories = useMemo(() => [...new Set(catalogTypologies.map(t => t.category))], []);
  const uniqueSubcategories = useMemo(() => [...new Set(catalogTypologies.map(t => t.subcategory).filter(Boolean))], []);
  const uniqueFolhas = useMemo(() => [...new Set(catalogTypologies.map(t => t.num_folhas))].sort((a, b) => a - b), []);

  // Filtered custom typologies
  const filteredCustom = customs.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
    const matchLine = filterLine === "all" || t.product_line_id === filterLine;
    return matchSearch && matchLine;
  });

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Nome obrigatório");
      return;
    }

    if (editId) {
      const { error } = await supabase.from("tipologias_customizadas").update({
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
      }).eq("id", editId);
      if (error) { toast.error("Erro ao atualizar", { description: error.message }); return; }
      toast.success("Tipologia atualizada");
    } else {
      const { error } = await supabase.from("tipologias_customizadas").insert({
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
      });
      if (error) { toast.error("Erro ao criar", { description: error.message }); return; }
      toast.success("Tipologia criada");
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
      subcategory: t.subcategory || "correr",
      num_folhas: t.num_folhas,
      has_veneziana: t.has_veneziana,
      has_bandeira: t.has_bandeira,
      notes: t.notes || "",
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
      name: t.name + " (Cópia)",
      category: t.category,
      subcategory: t.subcategory || "correr",
      num_folhas: t.num_folhas,
      has_veneziana: t.has_veneziana,
      has_bandeira: t.has_bandeira,
      notes: t.notes || "",
      min_width_mm: t.min_width_mm || 600,
      max_width_mm: t.max_width_mm || 4000,
      min_height_mm: t.min_height_mm || 400,
      max_height_mm: t.max_height_mm || 2500,
    });
    setEditId(null);
    setShowAdd(true);
  };

  const handleCloneFromCatalog = (t: typeof catalogTypologies[0]) => {
    setForm({
      product_line_id: t.product_line_id,
      name: t.name + " (Customizada)",
      category: t.category,
      subcategory: t.subcategory || "correr",
      num_folhas: t.num_folhas,
      has_veneziana: t.has_veneziana,
      has_bandeira: t.has_bandeira,
      notes: t.notes || "",
      min_width_mm: t.min_width_mm || 600,
      max_width_mm: t.max_width_mm || 4000,
      min_height_mm: t.min_height_mm || 400,
      max_height_mm: t.max_height_mm || 2500,
    });
    setEditId(null);
    setShowAdd(true);
    setTab("customizadas");
  };

  const handleDelete = async (id: string) => {
    await supabase.from("tipologias_customizadas").delete().eq("id", id);
    toast.error("Tipologia removida");
    fetchCustoms();
  };

  const handleToggle = async (id: string, active: boolean) => {
    await supabase.from("tipologias_customizadas").update({ active: !active }).eq("id", id);
    fetchCustoms();
  };

  // Unique product lines from catalog for filter
  const uniqueLines = [...new Set(catalogTypologies.map(t => t.product_line_id))].map(id => ({
    id,
    name: getLineName(id),
  }));

  const formDialog = (
    <Dialog open={showAdd} onOpenChange={(o) => { setShowAdd(o); if (!o) { setEditId(null); setForm(emptyForm); } }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editId ? "Editar Tipologia" : "Nova Tipologia Customizada"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Nome *</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Janela de Correr 2F Especial" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Linha do Produto</Label>
              <Select value={form.product_line_id} onValueChange={(v) => setForm({ ...form, product_line_id: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {productLines.filter(l => l.active).map(l => (
                    <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Subcategoria</Label>
              <Select value={form.subcategory} onValueChange={(v) => setForm({ ...form, subcategory: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SUBCATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nº de Folhas</Label>
              <Input type="number" min={0} max={12} value={form.num_folhas} onChange={(e) => setForm({ ...form, num_folhas: Number(e.target.value) })} />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={form.has_veneziana} onCheckedChange={(v) => setForm({ ...form, has_veneziana: v })} />
              <Label className="text-sm">Veneziana</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.has_bandeira} onCheckedChange={(v) => setForm({ ...form, has_bandeira: v })} />
              <Label className="text-sm">Bandeira</Label>
            </div>
          </div>

          <Separator />

          <h4 className="text-xs font-bold uppercase text-muted-foreground">Dimensões do Vão (mm)</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Largura Mín.</Label>
              <Input type="number" value={form.min_width_mm} onChange={(e) => setForm({ ...form, min_width_mm: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Largura Máx.</Label>
              <Input type="number" value={form.max_width_mm} onChange={(e) => setForm({ ...form, max_width_mm: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Altura Mín.</Label>
              <Input type="number" value={form.min_height_mm} onChange={(e) => setForm({ ...form, min_height_mm: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Altura Máx.</Label>
              <Input type="number" value={form.max_height_mm} onChange={(e) => setForm({ ...form, max_height_mm: Number(e.target.value) })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notas opcionais..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { setShowAdd(false); setEditId(null); setForm(emptyForm); }}>Cancelar</Button>
          <Button onClick={handleSave} className="gap-2">
            {editId ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {editId ? "Salvar" : "Criar Tipologia"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tipologias</h1>
          <p className="text-muted-foreground text-sm">
            {catalogTypologies.length} do catálogo + {customs.length} customizadas
          </p>
        </div>
        <Button className="gap-2" onClick={() => { setForm(emptyForm); setEditId(null); setShowAdd(true); setTab("customizadas"); }}>
          <Plus className="h-4 w-4" /> Nova Tipologia
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar tipologia..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterLine} onValueChange={setFilterLine}>
          <SelectTrigger className="w-full sm:w-[220px]"><SelectValue placeholder="Todas as linhas" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as linhas</SelectItem>
            {uniqueLines.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
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
            {/* Sidebar Filters */}
            <div className="hidden md:block w-52 shrink-0">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="space-y-4 pr-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Tipologia</h4>
                    <div className="space-y-0.5">
                      {uniqueCategories.map(cat => (
                        <button key={cat} onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
                          className={`block w-full text-left text-sm px-2 py-1 rounded-md transition-colors ${filterCategory === cat ? "bg-primary/10 text-primary font-medium" : "text-foreground/70 hover:bg-muted"}`}>
                          {getCategoryLabel(cat)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Sistema de Abertura</h4>
                    <div className="space-y-0.5">
                      {uniqueSubcategories.map(sub => (
                        <button key={sub} onClick={() => setFilterSubcategory(filterSubcategory === sub ? null : sub)}
                          className={`block w-full text-left text-sm px-2 py-1 rounded-md transition-colors ${filterSubcategory === sub ? "bg-primary/10 text-primary font-medium" : "text-foreground/70 hover:bg-muted"}`}>
                          {SUBCATEGORIES.find(s => s.value === sub)?.label || sub}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Quantidade de Folhas</h4>
                    <div className="space-y-0.5">
                      {uniqueFolhas.map(n => (
                        <button key={n} onClick={() => setFilterFolhas(filterFolhas === n ? null : n)}
                          className={`block w-full text-left text-sm px-2 py-1 rounded-md transition-colors ${filterFolhas === n ? "bg-primary/10 text-primary font-medium" : "text-foreground/70 hover:bg-muted"}`}>
                          {n} Folha{n !== 1 ? "s" : ""}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Extras</h4>
                    <div className="space-y-0.5">
                      <button onClick={() => setFilterVeneziana(filterVeneziana === true ? null : true)}
                        className={`block w-full text-left text-sm px-2 py-1 rounded-md transition-colors ${filterVeneziana === true ? "bg-primary/10 text-primary font-medium" : "text-foreground/70 hover:bg-muted"}`}>
                        Com Veneziana
                      </button>
                      <button onClick={() => setFilterVeneziana(filterVeneziana === false ? null : false)}
                        className={`block w-full text-left text-sm px-2 py-1 rounded-md transition-colors ${filterVeneziana === false ? "bg-primary/10 text-primary font-medium" : "text-foreground/70 hover:bg-muted"}`}>
                        Sem Veneziana
                      </button>
                      <button onClick={() => setFilterBandeira(filterBandeira === true ? null : true)}
                        className={`block w-full text-left text-sm px-2 py-1 rounded-md transition-colors ${filterBandeira === true ? "bg-primary/10 text-primary font-medium" : "text-foreground/70 hover:bg-muted"}`}>
                        Com Bandeira
                      </button>
                      <button onClick={() => setFilterBandeira(filterBandeira === false ? null : false)}
                        className={`block w-full text-left text-sm px-2 py-1 rounded-md transition-colors ${filterBandeira === false ? "bg-primary/10 text-primary font-medium" : "text-foreground/70 hover:bg-muted"}`}>
                        Sem Bandeira
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Grid of typology cards */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">{filteredCatalog.length} tipologias — página {currentPage} de {totalPages || 1}</p>
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => {
                    const headers = ["Nome", "ID", "Linha", "Categoria", "Subcategoria", "Folhas", "Veneziana", "Bandeira"];
                    const colWidths = [42, 30, 28, 22, 22, 14, 16, 16];
                    const rows = filteredCatalog.map(t => [
                      t.name,
                      t.id,
                      getLineName(t.product_line_id),
                      getCategoryLabel(t.category),
                      t.subcategory ? (SUBCATEGORIES.find(s => s.value === t.subcategory)?.label || t.subcategory) : "–",
                      String(t.num_folhas),
                      t.has_veneziana ? "Sim" : "Não",
                      t.has_bandeira ? "Sim" : "Não",
                    ]);
                    generateReportPdf({
                      title: "Catálogo de Tipologias",
                      subtitle: `${filteredCatalog.length} tipologias filtradas`,
                      headers,
                      rows,
                      columnWidths: colWidths,
                      filename: "tipologias-catalogo.pdf",
                      summaryCards: [
                        { label: "Total", value: String(filteredCatalog.length) },
                        { label: "Categorias", value: String(new Set(filteredCatalog.map(t => t.category)).size) },
                        { label: "Linhas", value: String(new Set(filteredCatalog.map(t => t.product_line_id)).size) },
                      ],
                    });
                    toast.success("PDF gerado", { description: `${filteredCatalog.length} tipologias exportadas` });
                  }}>
                    <FileDown className="h-3.5 w-3.5" /> Exportar PDF
                  </Button>
                </div>
                {(filterCategory || filterSubcategory || filterFolhas || filterVeneziana !== null || filterBandeira !== null) && (
                  <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => { setFilterCategory(null); setFilterSubcategory(null); setFilterFolhas(null); setFilterVeneziana(null); setFilterBandeira(null); }}>
                    Limpar filtros
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedCatalog.map((t) => (
                  <Card key={t.id} className="group hover:shadow-md transition-shadow border-border/60 overflow-hidden">
                    <div className="bg-muted/30 p-4 flex items-center justify-center aspect-square cursor-pointer"
                      onClick={() => setDetailTypology(t)}>
                      <PhotorealisticPreview
                        imagemUrl={(t as any).imagem_url}
                        width_mm={t.max_width_mm || 1200}
                        height_mm={t.max_height_mm || 1400}
                        category={t.category}
                        subcategory={t.subcategory || "correr"}
                        num_folhas={t.num_folhas}
                        has_veneziana={t.has_veneziana}
                        has_bandeira={t.has_bandeira}
                        maxWidth={180}
                        maxHeight={180}
                        showDimensions={false}
                      />
                    </div>
                    <CardContent className="p-2.5 space-y-1.5">
                      <p className="text-xs text-primary leading-tight line-clamp-2 font-medium">{t.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wide truncate">{t.id}</p>
                      <div className="flex gap-1 pt-0.5">
                        <Button variant="ghost" size="sm" className="h-6 text-[10px] px-1.5 flex-1 gap-1" onClick={() => setDetailTypology(t)}>
                          <Eye className="h-3 w-3" /> Detalhes
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 text-[10px] px-1.5 flex-1 gap-1" onClick={() => handleCloneFromCatalog(t)}>
                          <Copy className="h-3 w-3" /> Clonar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6 pb-2">
                  <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                    Anterior
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                      .reduce<(number | string)[]>((acc, p, idx, arr) => {
                        if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, i) =>
                        typeof p === "string" ? (
                          <span key={`ellipsis-${i}`} className="flex items-center justify-center w-8 h-8 text-xs text-muted-foreground">…</span>
                        ) : (
                          <Button key={p} variant={currentPage === p ? "default" : "outline"} size="sm" className="w-8 h-8 p-0 text-xs" onClick={() => setCurrentPage(p)}>
                            {p}
                          </Button>
                        )
                      )}
                  </div>
                  <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                    Próximo
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* CUSTOM TAB */}
        <TabsContent value="customizadas" className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Carregando...
            </div>
          ) : filteredCustom.length === 0 ? (
            <Card className="shadow-sm border-border/50">
              <CardContent className="py-12 text-center">
                <Layers className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground text-sm">Nenhuma tipologia customizada ainda.</p>
                <p className="text-xs text-muted-foreground mt-1">Crie uma nova ou clone do catálogo.</p>
                <Button className="mt-4 gap-2" onClick={() => { setForm(emptyForm); setEditId(null); setShowAdd(true); }}>
                  <Plus className="h-4 w-4" /> Criar Tipologia
                </Button>
              </CardContent>
            </Card>
          ) : (
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
                    {filteredCustom.map((t) => (
                      <TableRow key={t.id} className={!t.active ? "opacity-50" : ""}>
                        <TableCell className="font-medium text-sm">{t.name}</TableCell>
                        <TableCell><Badge variant="secondary" className="text-[10px]">{getLineName(t.product_line_id)}</Badge></TableCell>
                        <TableCell className="text-sm">{getCategoryLabel(t.category)}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{t.num_folhas}</TableCell>
                        <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                          {t.min_width_mm}–{t.max_width_mm} × {t.min_height_mm}–{t.max_height_mm}
                        </TableCell>
                        <TableCell>
                          <Switch checked={t.active} onCheckedChange={() => handleToggle(t.id, t.active)} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setRulesTypology(t)} title="Regras de Corte">
                               <Scissors className="h-3.5 w-3.5" />
                             </Button>
                             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDuplicate(t)}>
                               <Copy className="h-3.5 w-3.5" />
                             </Button>
                             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(t)}>
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(t.id)}>
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
          )}
        </TabsContent>
      </Tabs>

      {formDialog}

      {/* Cut Rules Dialog */}
      <Dialog open={!!rulesTypology} onOpenChange={(o) => { if (!o) setRulesTypology(null); }}>
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
        onOpenChange={(o) => { if (!o) setDetailTypology(null); }}
      />
    </div>
  );
};

export default Tipologias;
