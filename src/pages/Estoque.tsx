import { useState, useEffect, useMemo, useCallback } from "react";
import { PullToRefresh } from "@/components/PullToRefresh";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Pencil, ArrowDownUp } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const categorias = ["Todos", "Perfis", "Vidros", "Acessórios", "Insumos", "Fixação"];

type EstoqueItem = {
  id: string;
  codigo: string;
  produto: string;
  quantidade: number;
  unidade: string;
  minimo: number;
  categoria: string;
};

const emptyForm = { codigo: "", produto: "", quantidade: 0, unidade: "pçs", minimo: 0, categoria: "Perfis" };

const Estoque = () => {
  usePageTitle("Estoque");
  const [itens, setItens] = useState<EstoqueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [movDialog, setMovDialog] = useState<{ item: EstoqueItem; tipo: "entrada" | "saida" } | null>(null);
  const [movQtd, setMovQtd] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchItens = async () => {
    const { data, error } = await supabase.from("estoque").select("*").order("codigo");
    if (!error && data) setItens(data);
    setLoading(false);
  };

  useEffect(() => { fetchItens(); }, []);

  const filtered = useMemo(() => itens.filter((item) => {
    const matchSearch = !search || item.produto.toLowerCase().includes(search.toLowerCase()) || item.codigo.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "Todos" || item.categoria === catFilter;
    return matchSearch && matchCat;
  }), [itens, search, catFilter]);

  const openNew = () => {
    const nextCode = `EST-${String(itens.length + 1).padStart(3, "0")}`;
    setForm({ ...emptyForm, codigo: nextCode });
    setEditingId(null);
    setDialogOpen(true);
  };
  const openEdit = (item: EstoqueItem) => {
    setForm({ codigo: item.codigo, produto: item.produto, quantidade: item.quantidade, unidade: item.unidade, minimo: item.minimo, categoria: item.categoria });
    setEditingId(item.id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.produto.trim()) { toast.error("Nome obrigatório"); return; }
    if (editingId) {
      const { error } = await supabase.from("estoque").update({ produto: form.produto, quantidade: form.quantidade, unidade: form.unidade, minimo: form.minimo, categoria: form.categoria }).eq("id", editingId);
      if (error) { toast.error("Erro", { description: error.message }); return; }
      toast.success("Item atualizado");
    } else {
      const { error } = await supabase.from("estoque").insert({ codigo: form.codigo, produto: form.produto, quantidade: form.quantidade, unidade: form.unidade, minimo: form.minimo, categoria: form.categoria });
      if (error) { toast.error("Erro", { description: error.message }); return; }
      toast.success("Item adicionado");
    }
    setDialogOpen(false);
    fetchItens();
  };

  const handleMov = async () => {
    if (!movDialog || movQtd <= 0) return;
    const newQtd = movDialog.tipo === "entrada" ? movDialog.item.quantidade + movQtd : Math.max(0, movDialog.item.quantidade - movQtd);
    const { error } = await supabase.from("estoque").update({ quantidade: newQtd }).eq("id", movDialog.item.id);
    if (error) { toast.error("Erro", { description: error.message }); return; }
    toast.success(`${movDialog.tipo === "entrada" ? "Entrada" : "Saída"} registrada: ${movQtd} ${movDialog.item.unidade}`);
    setMovDialog(null);
    setMovQtd(0);
    fetchItens();
  };

  const handleRefresh = useCallback(async () => { await fetchItens(); }, []);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
    <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight">Estoque</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">Controle de materiais e insumos</p>
        </div>
        <Button className="gap-2 text-xs sm:text-sm" onClick={openNew}><Plus className="h-4 w-4" /> Novo Item</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar no estoque..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>{categorias.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
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
              <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground text-xs sm:text-sm">Carregando...</TableCell></TableRow>
            ) : filtered.map((item) => {
              const baixo = item.quantidade <= item.minimo;
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-xs sm:text-sm">{item.codigo}</TableCell>
                  <TableCell className="text-xs sm:text-sm">{item.produto}</TableCell>
                  <TableCell className="hidden sm:table-cell"><Badge variant="secondary" className="text-[10px] sm:text-xs">{item.categoria}</Badge></TableCell>
                  <TableCell className={cn("text-xs sm:text-sm", baixo ? "text-destructive font-bold" : "font-medium")}>{item.quantidade} {item.unidade}</TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell text-xs sm:text-sm">{item.minimo} {item.unidade}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold ${baixo ? "text-destructive" : "text-success"}`}>
                      <span className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${baixo ? "bg-destructive" : "bg-success"}`} />
                      {baixo ? "Baixo" : "OK"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-0.5">
                      <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => openEdit(item)}><Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => { setMovDialog({ item, tipo: "entrada" }); setMovQtd(0); }}>
                        <ArrowDownUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {!loading && filtered.length === 0 && <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground text-xs sm:text-sm">Nenhum item encontrado.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
          <DialogHeader><DialogTitle>{editingId ? "Editar Item" : "Novo Item"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Produto *</Label><Input value={form.produto} onChange={(e) => setForm({ ...form, produto: e.target.value })} /></div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5"><Label>Quantidade</Label><Input type="number" value={form.quantidade} onChange={(e) => setForm({ ...form, quantidade: Number(e.target.value) })} /></div>
              <div className="space-y-1.5"><Label>Unidade</Label><Input value={form.unidade} onChange={(e) => setForm({ ...form, unidade: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Mínimo</Label><Input type="number" value={form.minimo} onChange={(e) => setForm({ ...form, minimo: Number(e.target.value) })} /></div>
            </div>
            <div className="space-y-1.5">
              <Label>Categoria</Label>
              <Select value={form.categoria} onValueChange={(v) => setForm({ ...form, categoria: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{categorias.filter((c) => c !== "Todos").map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editingId ? "Salvar" : "Adicionar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!movDialog} onOpenChange={() => setMovDialog(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Movimentação - {movDialog?.item.produto}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button variant={movDialog?.tipo === "entrada" ? "default" : "outline"} className="flex-1" onClick={() => movDialog && setMovDialog({ ...movDialog, tipo: "entrada" })}>Entrada</Button>
              <Button variant={movDialog?.tipo === "saida" ? "default" : "outline"} className="flex-1" onClick={() => movDialog && setMovDialog({ ...movDialog, tipo: "saida" })}>Saída</Button>
            </div>
            <div className="space-y-1.5">
              <Label>Quantidade ({movDialog?.item.unidade})</Label>
              <Input type="number" min={1} value={movQtd || ""} onChange={(e) => setMovQtd(Number(e.target.value))} />
            </div>
            <p className="text-sm text-muted-foreground">Estoque atual: {movDialog?.item.quantidade} {movDialog?.item.unidade}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMovDialog(null)}>Cancelar</Button>
            <Button onClick={handleMov} disabled={movQtd <= 0}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </PullToRefresh>
  );
};

export default Estoque;
