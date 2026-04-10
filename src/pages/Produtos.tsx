import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Search, Eye, Trash2, Package, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Produto {
  id: string;
  codigo: string;
  nome: string;
  categoria: string;
  preco: number;
  unidade: string;
  ativo: boolean;
}

const CATEGORIAS = ["Janelas", "Portas", "Fachadas", "Box", "Guarda-corpo", "Outros"];
const UNIDADES = ["m²", "ml", "pç", "un"];

const Produtos = () => {
  const [search, setSearch] = useState("");
  const [viewProduct, setViewProduct] = useState<Produto | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Produto | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ codigo: "", nome: "", categoria: "Janelas", preco: "", unidade: "m²", ativo: true });

  const queryClient = useQueryClient();

  const { data: produtos = [], isLoading } = useQuery({
    queryKey: ["produtos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("produtos").select("*").order("codigo");
      if (error) throw error;
      return data as Produto[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (p: Omit<Produto, "id">) => {
      const { error } = await supabase.from("produtos").insert(p);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      toast.success("Produto criado", { description: "Produto cadastrado com sucesso." });
      setShowCreate(false);
      setForm({ codigo: "", nome: "", categoria: "Janelas", preco: "", unidade: "m²", ativo: true });
    },
    onError: (err: any) => toast.error("Erro", { description: err.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("produtos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      toast.success("Produto removido", { description: "Produto excluído com sucesso." });
      setDeleteProduct(null);
    },
    onError: (err: any) => toast.error("Erro", { description: err.message }),
  });

  const filtered = produtos.filter((p) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return p.nome.toLowerCase().includes(s) || p.codigo.toLowerCase().includes(s) || p.categoria.toLowerCase().includes(s);
  });

  const handleCreate = () => {
    if (!form.codigo.trim() || !form.nome.trim()) {
      toast.error("Campos obrigatórios", { description: "Preencha código e nome." });
      return;
    }
    createMutation.mutate({
      codigo: form.codigo.trim(),
      nome: form.nome.trim(),
      categoria: form.categoria,
      preco: parseFloat(form.preco) || 0,
      unidade: form.unidade,
      ativo: form.ativo,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground text-sm">Catálogo de produtos e serviços</p>
        </div>
        <Button className="gap-2" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4" /> Novo Produto
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar produto..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum produto encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.codigo}</TableCell>
                    <TableCell className="font-medium">{p.nome}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{p.categoria}</Badge></TableCell>
                    <TableCell className="font-semibold">{formatCurrency(p.preco)}/{p.unidade}</TableCell>
                    <TableCell className="text-muted-foreground">{p.unidade}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${p.ativo ? "text-success" : "text-muted-foreground"}`}>
                        <span className={`h-2 w-2 rounded-full ${p.ativo ? "bg-success" : "bg-muted-foreground"}`} />
                        {p.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-0.5">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewProduct(p)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteProduct(p)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Dialog Novo Produto */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Novo Produto
            </DialogTitle>
            <DialogDescription>Preencha os dados do produto</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código *</Label>
                <Input id="codigo" placeholder="P-009" value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select value={form.categoria} onValueChange={(v) => setForm({ ...form, categoria: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIAS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Produto *</Label>
              <Input id="nome" placeholder="Janela de Correr 4 Folhas" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preco">Preço (R$)</Label>
                <Input id="preco" type="number" step="0.01" placeholder="0,00" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidade">Unidade</Label>
                <Select value={form.unidade} onValueChange={(v) => setForm({ ...form, unidade: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {UNIDADES.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="ativo" checked={form.ativo} onCheckedChange={(v) => setForm({ ...form, ativo: v })} />
              <Label htmlFor="ativo">Produto ativo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending} className="gap-2">
              {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Cadastrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Visualização */}
      <Dialog open={!!viewProduct} onOpenChange={(open) => !open && setViewProduct(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              {viewProduct?.nome}
            </DialogTitle>
            <DialogDescription>Detalhes do produto</DialogDescription>
          </DialogHeader>
          {viewProduct && (
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Código</p>
                <p className="font-semibold">{viewProduct.codigo}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Categoria</p>
                <Badge variant="secondary">{viewProduct.categoria}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Preço</p>
                <p className="font-bold text-lg text-primary">{formatCurrency(viewProduct.preco)}/{viewProduct.unidade}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Unidade</p>
                <p className="font-medium">{viewProduct.unidade}</p>
              </div>
              <div className="space-y-1 col-span-2">
                <p className="text-xs text-muted-foreground">Status</p>
                <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${viewProduct.ativo ? "text-success" : "text-muted-foreground"}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${viewProduct.ativo ? "bg-success" : "bg-muted-foreground"}`} />
                  {viewProduct.ativo ? "Ativo" : "Inativo"}
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewProduct(null)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Exclusão */}
      <AlertDialog open={!!deleteProduct} onOpenChange={(open) => !open && setDeleteProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{deleteProduct?.nome}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProduct && deleteMutation.mutate(deleteProduct.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Produtos;
