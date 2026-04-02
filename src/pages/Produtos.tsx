import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Trash2 } from "lucide-react";
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

const produtosMock: Produto[] = [
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

  const filtered = produtosMock.filter((p) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return p.nome.toLowerCase().includes(s) || p.categoria.toLowerCase().includes(s);
  });

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
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({ title: "Visualizar produto", description: p.nome })}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => toast({ title: "Produto removido", variant: "destructive" })}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Produtos;
