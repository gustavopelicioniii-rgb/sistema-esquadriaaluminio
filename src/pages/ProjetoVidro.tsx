import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Search, Loader2, Copy, Eye, X, Archive, ArchiveRestore } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/formatters";
import { supabase } from "@/integrations/supabase/client";
import { ProjetoVidro, VidroItem, tiposVidro, espessuras, cores, calcAreaEfetiva } from "@/components/projeto-vidro/types";
import { GlassPreviewTile, getGlassSvgElements } from "@/components/projeto-vidro/glass-svg-helpers";
import { ProjetoDetalhe } from "@/components/projeto-vidro/ProjetoDetalhe";
import { fetchProjetos } from "@/components/projeto-vidro/db-helpers";

const ProjetoVidroPage = () => {
  const [projetos, setProjetos] = useState<ProjetoVidro[]>([]);
  const [selected, setSelected] = useState<ProjetoVidro | null>(null);
  const [search, setSearch] = useState("");
  const [novoOpen, setNovoOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoTipo, setNovoTipo] = useState("Comum");
  const [novoEspessura, setNovoEspessura] = useState("6mm");
  const [novoCor, setNovoCor] = useState("Incolor");
  const [novoPrecoM2, setNovoPrecoM2] = useState(106);
  const [novoAreaMinima, setNovoAreaMinima] = useState(0);
  const [filterTipo, setFilterTipo] = useState<string | null>(null);
  const [filterCor, setFilterCor] = useState<string | null>(null);
  const [filterEspessura, setFilterEspessura] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 24;

  const load = useCallback(async () => {
    try {
      const data = await fetchProjetos();
      setProjetos(data);
    } catch { toast.error("Erro ao carregar projetos"); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = projetos.filter(
    (p) => !search || p.titulo.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => { setCurrentPage(1); }, [search, filterTipo, filterCor, filterEspessura]);

  const handleCreate = async () => {
    if (!novoTitulo) { toast.error("Informe o título"); return; }
    setSaving(true);
    try {
      const { data, error } = await supabase.from("projetos_vidro").insert({
        titulo: novoTitulo, tipo: novoTipo, espessura: novoEspessura,
        cor: novoCor, preco_m2: novoPrecoM2, area_minima_m2: novoAreaMinima,
      } as any).select().single();
      if (error) throw error;
      setNovoOpen(false);
      setNovoTitulo(""); setNovoPrecoM2(106); setNovoAreaMinima(0);
      toast.success("Projeto criado!");
      await load();
      const created: ProjetoVidro = {
        id: data.id, titulo: data.titulo, tipo: data.tipo, espessura: data.espessura,
        cor: data.cor, precoM2: Number(data.preco_m2), areaMinimaM2: Number((data as any).area_minima_m2 ?? 0),
        itens: [], criadoEm: new Date(data.created_at).toLocaleDateString("pt-BR"),
      };
      setSelected(created);
    } catch { toast.error("Erro ao criar projeto"); }
    setSaving(false);
  };

  const handleUpdate = async (updates: Partial<ProjetoVidro> & { id: string }) => {
    const { error } = await supabase.from("projetos_vidro").update({
      titulo: updates.titulo, tipo: updates.tipo, espessura: updates.espessura,
      cor: updates.cor, preco_m2: updates.precoM2, area_minima_m2: updates.areaMinimaM2,
    } as any).eq("id", updates.id);
    if (error) throw error;
    await load();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("projetos_vidro").delete().eq("id", id);
    if (error) throw error;
    toast.success("Projeto excluído");
    await load();
  };

  const handleDuplicate = async (id: string) => {
    const original = projetos.find((p) => p.id === id);
    if (!original) return;
    setSaving(true);
    try {
      const { data, error } = await supabase.from("projetos_vidro").insert({
        titulo: `${original.titulo} (cópia)`, tipo: original.tipo, espessura: original.espessura,
        cor: original.cor, preco_m2: original.precoM2, area_minima_m2: original.areaMinimaM2,
      } as any).select().single();
      if (error) throw error;
      if (original.itens.length > 0) {
        const itensInsert = original.itens.map((it) => ({
          projeto_id: data.id, descricao: it.descricao, largura_mm: it.larguraMm,
          altura_mm: it.alturaMm, quantidade: it.quantidade, observacao: it.observacao,
        }));
        await supabase.from("vidro_itens").insert(itensInsert as any);
      }
      toast.success("Projeto duplicado!");
      await load();
    } catch { toast.error("Erro ao duplicar"); }
    setSaving(false);
  };

  const handleAddItem = async (projetoId: string, item: Omit<VidroItem, "id">) => {
    const { error } = await supabase.from("vidro_itens").insert({
      projeto_id: projetoId, descricao: item.descricao, largura_mm: item.larguraMm,
      altura_mm: item.alturaMm, quantidade: item.quantidade, observacao: item.observacao,
    } as any);
    if (error) throw error;
    await load();
  };

  const handleUpdateItem = async (itemId: string, updates: Partial<VidroItem>) => {
    const dbUpdates: any = {};
    if (updates.descricao !== undefined) dbUpdates.descricao = updates.descricao;
    if (updates.larguraMm !== undefined) dbUpdates.largura_mm = updates.larguraMm;
    if (updates.alturaMm !== undefined) dbUpdates.altura_mm = updates.alturaMm;
    if (updates.quantidade !== undefined) dbUpdates.quantidade = updates.quantidade;
    if (updates.observacao !== undefined) dbUpdates.observacao = updates.observacao;
    const { error } = await supabase.from("vidro_itens").update(dbUpdates).eq("id", itemId);
    if (error) throw error;
    await load();
  };

  const handleRemoveItem = async (itemId: string) => {
    const { error } = await supabase.from("vidro_itens").delete().eq("id", itemId);
    if (error) throw error;
    await load();
  };

  if (selected) {
    const latest = projetos.find((p) => p.id === selected.id) || selected;
    return (
      <ProjetoDetalhe
        projeto={latest}
        onBack={() => setSelected(null)}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onAddItem={handleAddItem}
        onUpdateItem={handleUpdateItem}
        onRemoveItem={handleRemoveItem}
      />
    );
  }

  const uniqueTipos = [...new Set(projetos.map(p => p.tipo))];
  const uniqueCores = [...new Set(projetos.map(p => p.cor))];
  const uniqueEspessuras = [...new Set(projetos.map(p => p.espessura))];

  const filteredFinal = filtered.filter(p => {
    if (filterTipo && p.tipo !== filterTipo) return false;
    if (filterCor && p.cor !== filterCor) return false;
    if (filterEspessura && p.espessura !== filterEspessura) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredFinal.length / ITEMS_PER_PAGE);
  const paginatedFinal = filteredFinal.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const hasActiveFilters = !!filterTipo || !!filterCor || !!filterEspessura;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projeto Vidro</h1>
          <p className="text-muted-foreground text-sm">
            {projetos.filter(p => !p.archived).length} projeto{projetos.filter(p => !p.archived).length !== 1 ? "s" : ""} de vidro
            {projetos.filter(p => p.archived).length > 0 && ` · ${projetos.filter(p => p.archived).length} arquivado${projetos.filter(p => p.archived).length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant={showArchived ? "secondary" : "outline"} size="sm" className="gap-2" onClick={() => setShowArchived(!showArchived)}>
            <Archive className="h-4 w-4" /> {showArchived ? "Arquivados" : "Arquivo"}
          </Button>
          <Button className="gap-2" onClick={() => setNovoOpen(true)}>
            <Plus className="h-4 w-4" /> Novo Projeto
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar projeto..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="flex gap-4">
        {/* Sidebar Filters */}
        <div className="hidden md:block w-52 shrink-0">
          <div className="space-y-4 pr-3">
            <div>
              <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Tipo de Vidro</h4>
              <div className="space-y-0.5">
                {uniqueTipos.map(tipo => (
                  <button key={tipo} onClick={() => setFilterTipo(filterTipo === tipo ? null : tipo)}
                    className={`block w-full text-left text-sm px-2 py-1 rounded-md transition-colors ${filterTipo === tipo ? "bg-primary/10 text-primary font-medium" : "text-foreground/70 hover:bg-muted"}`}>
                    {tipo}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-border" />
            <div>
              <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Cor</h4>
              <div className="space-y-0.5">
                {uniqueCores.map(cor => (
                  <button key={cor} onClick={() => setFilterCor(filterCor === cor ? null : cor)}
                    className={`block w-full text-left text-sm px-2 py-1 rounded-md transition-colors ${filterCor === cor ? "bg-primary/10 text-primary font-medium" : "text-foreground/70 hover:bg-muted"}`}>
                    {cor}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-border" />
            <div>
              <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Espessura</h4>
              <div className="space-y-0.5">
                {uniqueEspessuras.map(esp => (
                  <button key={esp} onClick={() => setFilterEspessura(filterEspessura === esp ? null : esp)}
                    className={`block w-full text-left text-sm px-2 py-1 rounded-md transition-colors ${filterEspessura === esp ? "bg-primary/10 text-primary font-medium" : "text-foreground/70 hover:bg-muted"}`}>
                    {esp}
                  </button>
                ))}
              </div>
            </div>
            {hasActiveFilters && (
              <>
                <div className="border-t border-border" />
                <Button variant="ghost" size="sm" className="text-xs h-7 w-full" onClick={() => { setFilterTipo(null); setFilterCor(null); setFilterEspessura(null); }}>
                  Limpar filtros
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">{filteredFinal.length} projeto{filteredFinal.length !== 1 ? "s" : ""}</p>
            {(hasActiveFilters || search) && (
              <Button variant="outline" size="sm" className="gap-1.5 h-7 text-xs" onClick={() => { setFilterTipo(null); setFilterCor(null); setFilterEspessura(null); setSearch(""); }}>
                <X className="h-3 w-3" /> Limpar filtros
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredFinal.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/5 mb-5">
                <svg width="44" height="44" viewBox="0 0 48 48" fill="none" className="text-primary/40">
                  {getGlassSvgElements("Comum", "lg")}
                </svg>
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">Nenhum projeto encontrado</h3>
              <p className="text-sm text-muted-foreground max-w-xs mb-5">
                {search || hasActiveFilters ? "Tente buscar com outros termos ou limpe os filtros." : "Crie seu primeiro projeto de vidro para começar."}
              </p>
              {!search && !hasActiveFilters && (
                <Button className="gap-2" onClick={() => setNovoOpen(true)}>
                  <Plus className="h-4 w-4" /> Novo Projeto
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedFinal.map((projeto, index) => {
                const areaTotal = projeto.itens.reduce(
                  (sum, it) => sum + calcAreaEfetiva(it.larguraMm, it.alturaMm, projeto.areaMinimaM2) * it.quantidade, 0
                );
                const valorTotal = areaTotal * projeto.precoM2;
                return (
                  <Card key={projeto.id} className="group hover:shadow-md hover:scale-[1.02] transition-all duration-300 border-border/60 overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                    <div className="bg-muted/30 p-4 flex items-center justify-center aspect-square cursor-pointer" onClick={() => setSelected(projeto)}>
                      <GlassPreviewTile tipo={projeto.tipo} />
                    </div>
                    <CardContent className="p-2.5 space-y-1.5">
                      <p className="text-xs text-primary leading-tight line-clamp-2 font-medium">{projeto.titulo}</p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium">{projeto.tipo}</Badge>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium">{projeto.espessura}</Badge>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium">{projeto.cor}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>{projeto.itens.length} vidro{projeto.itens.length !== 1 ? "s" : ""} · {areaTotal.toFixed(2)} m²</span>
                        <span className="font-bold text-xs text-primary">{formatCurrency(valorTotal)}</span>
                      </div>
                      <div className="flex gap-1 pt-0.5">
                        <Button variant="ghost" size="sm" className="h-6 text-[10px] px-1.5 flex-1 gap-1" onClick={() => setSelected(projeto)}>
                          <Eye className="h-3 w-3" /> Detalhes
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 text-[10px] px-1.5 flex-1 gap-1" onClick={() => handleDuplicate(projeto.id)}>
                          <Copy className="h-3 w-3" /> Duplicar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 pb-2">
              <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Anterior</Button>
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
              <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Próximo</Button>
            </div>
          )}
        </div>
      </div>

      {/* New project dialog */}
      <Dialog open={novoOpen} onOpenChange={setNovoOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader><DialogTitle className="text-lg">Novo Projeto de Vidro</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Título</Label>
              <Input value={novoTitulo} onChange={(e) => setNovoTitulo(e.target.value)} placeholder="Ex: Vidro 8mm Temperado - Fumê" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Tipo</Label>
                <Select value={novoTipo} onValueChange={setNovoTipo}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>{tiposVidro.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Espessura</Label>
                <Select value={novoEspessura} onValueChange={setNovoEspessura}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>{espessuras.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Cor</Label>
                <Select value={novoCor} onValueChange={setNovoCor}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>{cores.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Preço por m²</Label>
                <Input type="number" value={novoPrecoM2} onChange={(e) => setNovoPrecoM2(Number(e.target.value))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Área mínima (m²)</Label>
              <Input type="number" step="0.01" value={novoAreaMinima} onChange={(e) => setNovoAreaMinima(Number(e.target.value))} placeholder="0 = sem mínimo" />
              <p className="text-xs text-muted-foreground">Peças menores serão cobradas por esta área mínima</p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setNovoOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Criar Projeto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjetoVidroPage;
