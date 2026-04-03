import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Search, Eye, Trash2, Package } from "lucide-react";
import { formatCurrency } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

interface Produto {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  unidade: string;
  ativo: boolean;
}

const produtosIniciais: Produto[] = [
  { id: "P-001", nome: "Janela de Correr 2 Folhas", categoria: "Janelas", preco: 850, unidade: "m²", ativo: true },
  { id: "P-002", nome: "Janela Maxim-Ar", categoria: "Janelas", preco: 920, unidade: "m²", ativo: true },
  { id: "P-003", nome: "Porta de Correr 3 Folhas", categoria: "Portas", preco: 1050, unidade: "m²", ativo: true },
  { id: "P-004", nome: "Porta de Abrir", categoria: "Portas", preco: 950, unidade: "m²", ativo: true },
  { id: "P-005", nome: "Fachada em Vidro", categoria: "Fachadas", preco: 1400, unidade: "m²", ativo: true },
  { id: "P-006", nome: "Janela Pivotante", categoria: "Janelas", preco: 1100, unidade: "m²", ativo: false },
  { id: "P-007", nome: "Box de Banheiro", categoria: "Box", preco: 750, unidade: "m²", ativo: true },
  { id: "P-008", nome: "Guarda-corpo Alumínio", categoria: "Guarda-corpo", preco: 680, unidade: "ml", ativo: true },
];

const Produtos = () => {
  const [search, setSearch] = useState("");
  const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais);
  const [viewProduct, setViewProduct] = useState<Produto | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Produto | null>(null);

  const filtered = produtos.filter((p) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return p.nome.toLowerCase().includes(s) || p.categoria.toLowerCase().includes(s);
  });

  const handleDelete = () => {
    if (!deleteProduct) return;
    setProdutos((prev) => prev.filter((p) => p.id !== deleteProduct.id));
    toast({ title: "Produto removido", description: `${deleteProduct.nome} foi excluído com sucesso.` });
    setDeleteProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground text-sm">Catálogo de produtos e serviços</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Novo Produto
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar produto..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
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
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.id}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de Visualização */}
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
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Código</p>
                  <p className="font-semibold">{viewProduct.id}</p>
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
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewProduct(null)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
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
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Produtos;
