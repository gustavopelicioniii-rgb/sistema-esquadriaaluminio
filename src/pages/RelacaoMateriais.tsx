import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface MaterialItem {
  id: string;
  codigo: string;
  produto: string;
  categoria: string;
  quantidade: number;
  minimo: number;
  unidade: string;
}

const categorias = ["Perfis", "Vidros", "Acessórios", "Insumos", "Fixação", "Outros"];

const RelacaoMateriais = () => {
  const [search, setSearch] = useState("");
  const [materiais, setMateriais] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ produto: "", categoria: "Perfis", quantidade: 0, minimo: 0, unidade: "pçs" });

  const fetchMateriais = async () => {
    const { data, error } = await supabase.from("estoque").select("*").order("codigo");
    if (!error && data) setMateriais(data);
    setLoading(false);
  };

  useEffect(() => { fetchMateriais(); }, []);

  const filtered = materiais.filter((item) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return item.produto.toLowerCase().includes(s) || item.categoria.toLowerCase().includes(s);
  });

  const handleAddMaterial = async () => {
    if (!form.produto.trim()) { toast.error("Nome do produto é obrigatório"); return; }
    const codigo = `EST-${String(materiais.length + 1).padStart(3, "0")}`;
    const { error } = await supabase.from("estoque").insert({ codigo, ...form });
    if (error) { toast.error(error.message); return; }
    toast.success("Material adicionado!");
    setDialogOpen(false);
    setForm({ produto: "", categoria: "Perfis", quantidade: 0, minimo: 0, unidade: "pçs" });
    fetchMateriais();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relação de Materiais</h1>
          <p className="text-muted-foreground text-sm">Lista completa de materiais e insumos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><FileDown className="h-4 w-4" /> Exportar</Button>
          <Button className="gap-2" onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4" /> Novo Material</Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar material..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Mínimo</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const baixo = item.quantidade <= item.minimo;
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.codigo}</TableCell>
                    <TableCell>{item.produto}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{item.categoria}</Badge></TableCell>
                    <TableCell className={baixo ? "text-destructive font-bold" : "font-medium"}>{item.quantidade} {item.unidade}</TableCell>
                    <TableCell className="text-muted-foreground">{item.minimo} {item.unidade}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${baixo ? "text-destructive" : "text-success"}`}>
                        <span className={`h-2 w-2 rounded-full ${baixo ? "bg-destructive" : "bg-success"}`} />
                        {baixo ? "Baixo Estoque" : "Normal"}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Nenhum material encontrado.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Novo Material</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Produto</Label><Input value={form.produto} onChange={e => setForm({ ...form, produto: e.target.value })} placeholder="Nome do material" /></div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={form.categoria} onValueChange={v => setForm({ ...form, categoria: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{categorias.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2"><Label>Quantidade</Label><Input type="number" value={form.quantidade} onChange={e => setForm({ ...form, quantidade: Number(e.target.value) })} /></div>
              <div className="space-y-2"><Label>Mínimo</Label><Input type="number" value={form.minimo} onChange={e => setForm({ ...form, minimo: Number(e.target.value) })} /></div>
              <div className="space-y-2">
                <Label>Unidade</Label>
                <Select value={form.unidade} onValueChange={v => setForm({ ...form, unidade: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddMaterial}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RelacaoMateriais;
