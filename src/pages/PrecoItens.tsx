import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, FileDown, ArrowUpDown, ArrowUp, ArrowDown, FileText, Sheet, Loader2, Check, X } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { generateExcel } from "@/utils/excelGenerator";
import { exportPrecoItensPdf } from "@/utils/precoItensPdfGenerator";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import perfilImg from "@/assets/items/perfil.png";
import vidroImg from "@/assets/items/vidro.png";
import ferragemImg from "@/assets/items/ferragem.png";

interface Produto {
  id: string;
  codigo: string;
  nome: string;
  categoria: string;
  preco: number;
  unidade: string;
  ativo: boolean;
}

const categoryImage: Record<string, string> = {
  Perfis: perfilImg,
  Vidros: vidroImg,
  Ferragens: ferragemImg,
};

type SortKey = "codigo" | "nome" | "preco" | "categoria";
type SortDir = "asc" | "desc";

const PrecoItens = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const isMobile = useIsMobile();

  const fetchProdutos = useCallback(async () => {
    const { data, error } = await supabase
      .from("produtos")
      .select("id, codigo, nome, categoria, preco, unidade, ativo")
      .eq("ativo", true)
      .order("codigo");
    if (error) {
      toast({ title: "Erro ao carregar produtos", description: error.message, variant: "destructive" });
    } else {
      setProdutos(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchProdutos(); }, [fetchProdutos]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />;
  };

  const startEdit = (item: Produto) => {
    setEditingId(item.id);
    setEditValue(item.preco.toString().replace(".", ","));
  };

  const cancelEdit = () => { setEditingId(null); setEditValue(""); };

  const saveEdit = async (id: string) => {
    const parsed = parseFloat(editValue.replace(",", "."));
    if (isNaN(parsed) || parsed < 0) {
      toast({ title: "Valor inválido", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("produtos").update({ preco: parsed }).eq("id", id);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      setProdutos((prev) => prev.map((p) => (p.id === id ? { ...p, preco: parsed } : p)));
      toast({ title: "Preço atualizado" });
    }
    setSaving(false);
    setEditingId(null);
  };

  const categories = useMemo(() => {
    const cats = new Set(produtos.map((p) => p.categoria));
    return ["Todos", ...Array.from(cats).sort()];
  }, [produtos]);

  const filtered = useMemo(() => {
    let list = produtos;
    if (category !== "Todos") list = list.filter((i) => i.categoria === category);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter((i) => i.nome.toLowerCase().includes(s) || i.codigo.toLowerCase().includes(s) || i.categoria.toLowerCase().includes(s));
    }
    if (sortKey) {
      list = [...list].sort((a, b) => {
        const aVal = a[sortKey]; const bVal = b[sortKey];
        if (typeof aVal === "number" && typeof bVal === "number") return sortDir === "asc" ? aVal - bVal : bVal - aVal;
        const cmp = String(aVal).localeCompare(String(bVal), "pt-BR");
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return list;
  }, [search, category, sortKey, sortDir, produtos]);

  const exportItems = filtered.map((i) => ({
    codigo: i.codigo,
    descricao: i.nome,
    categoria: i.categoria,
    preco: i.preco,
    unidade: i.unidade,
    cor: "",
  }));

  const PriceCell = ({ item }: { item: Produto }) => {
    if (editingId === item.id) {
      return (
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground text-xs">R$</span>
          <Input
            className="h-7 w-24 text-sm"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") saveEdit(item.id); if (e.key === "Escape") cancelEdit(); }}
            autoFocus
            disabled={saving}
          />
          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => saveEdit(item.id)} disabled={saving}>
            {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3 text-green-600" />}
          </Button>
          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={cancelEdit} disabled={saving}>
            <X className="h-3 w-3 text-destructive" />
          </Button>
        </div>
      );
    }
    return (
      <span className="font-bold cursor-pointer hover:text-primary transition-colors" onClick={() => startEdit(item)} title="Clique para editar">
        {formatCurrency(item.preco)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Preço dos Itens</h1>
          <p className="text-muted-foreground text-sm">
            {produtos.length} produtos cadastrados — clique no preço para editar
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <FileDown className="h-4 w-4" /> Exportar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => exportPrecoItensPdf(exportItems)}>
              <FileText className="mr-2 h-4 w-4" /> Exportar PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => generateExcel({
              title: "Tabela de Preços",
              headers: ["Código", "Nome", "Categoria", "Preço", "Unidade"],
              rows: filtered.map((i) => [i.codigo, i.nome, i.categoria, formatCurrency(i.preco), i.unidade]),
              filename: "tabela-precos.xlsx",
            })}>
              <Sheet className="mr-2 h-4 w-4" /> Exportar Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs value={category} onValueChange={setCategory}>
        <TabsList className="w-full sm:w-auto flex-wrap">
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar item..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isMobile ? (
        <div className="space-y-3">
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">Nenhum produto encontrado</p>}
          {filtered.map((item) => (
            <Card key={item.id} className="shadow-sm border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 shrink-0 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center overflow-hidden">
                    <img src={categoryImage[item.categoria] || perfilImg} alt={item.categoria} loading="lazy" width={48} height={48} className="h-10 w-10 object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-primary text-sm">{item.codigo}</span>
                      <Badge variant="secondary" className="text-xs shrink-0">{item.categoria}</Badge>
                    </div>
                    <p className="font-medium text-sm mt-0.5 truncate">{item.nome}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{item.unidade}</span>
                      <PriceCell item={item} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Imagem</TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort("codigo")}>
                  <span className="inline-flex items-center">Código <SortIcon col="codigo" /></span>
                </TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort("nome")}>
                  <span className="inline-flex items-center">Nome <SortIcon col="nome" /></span>
                </TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort("categoria")}>
                  <span className="inline-flex items-center">Categoria <SortIcon col="categoria" /></span>
                </TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort("preco")}>
                  <span className="inline-flex items-center">Preço <SortIcon col="preco" /></span>
                </TableHead>
                <TableHead>Unidade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhum produto encontrado</TableCell></TableRow>
              )}
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="h-10 w-10 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center overflow-hidden">
                      <img src={categoryImage[item.categoria] || perfilImg} alt={item.categoria} loading="lazy" width={40} height={40} className="h-8 w-8 object-contain" />
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-primary">{item.codigo}</TableCell>
                  <TableCell className="font-medium">{item.nome}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{item.categoria}</Badge></TableCell>
                  <TableCell><PriceCell item={item} /></TableCell>
                  <TableCell className="text-muted-foreground">{item.unidade}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default PrecoItens;
