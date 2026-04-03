import { itensEstoque } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Search, Plus, FileDown } from "lucide-react";
import { toast } from "sonner";

interface MaterialItem {
  id: string;
  produto: string;
  categoria: string;
  quantidade: number;
  minimo: number;
  unidade: string;
}

const categorias = ["Perfil", "Vidro", "Ferragem", "Vedação", "Acabamento", "Fixação", "Outros"];

const RelacaoMateriais = () => {
  const [search, setSearch] = useState("");
  const [materiais, setMateriais] = useState<MaterialItem[]>(
    itensEstoque.map(item => ({
      id: item.id,
      produto: item.produto,
      categoria: item.categoria,
      quantidade: item.quantidade,
      minimo: item.minimo,
      unidade: item.unidade,
    }))
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [novoProduto, setNovoProduto] = useState("");
  const [novoCategoria, setNovoCategoria] = useState("");
  const [novoQuantidade, setNovoQuantidade] = useState(0);
  const [novoMinimo, setNovoMinimo] = useState(0);
  const [novoUnidade, setNovoUnidade] = useState("pçs");

  const filtered = materiais.filter((item) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return item.produto.toLowerCase().includes(s) || item.categoria.toLowerCase().includes(s);
  });

  const handleAddMaterial = () => {
    if (!novoProduto || !novoCategoria) {
      toast.error("Preencha o nome do produto e a categoria");
      return;
    }
    const novo: MaterialItem = {
      id: `MAT-${Date.now()}`,
      produto: novoProduto,
      categoria: novoCategoria,
      quantidade: novoQuantidade,
      minimo: novoMinimo,
      unidade: novoUnidade,
    };
    setMateriais(prev => [novo, ...prev]);
    setDialogOpen(false);
    setNovoProduto("");
    setNovoCategoria("");
    setNovoQuantidade(0);
    setNovoMinimo(0);
    setNovoUnidade("pçs");
    toast.success("Material adicionado com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relação de Materiais</h1>
          <p className="text-muted-foreground text-sm">Lista completa de materiais e insumos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileDown className="h-4 w-4" /> Exportar
          </Button>
          <Button className="gap-2" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" /> Novo Material
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar material..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
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
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.produto}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{item.categoria}</Badge>
                  </TableCell>
                  <TableCell className={baixo ? "text-destructive font-bold" : "font-medium"}>
                    {item.quantidade} {item.unidade}
                  </TableCell>
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
          </TableBody>
        </Table>
      </div>

      {/* Dialog Novo Material */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Material</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Produto</Label>
              <Input value={novoProduto} onChange={e => setNovoProduto(e.target.value)} placeholder="Nome do material" />
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={novoCategoria} onValueChange={setNovoCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria..." />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Quantidade</Label>
                <Input type="number" value={novoQuantidade} onChange={e => setNovoQuantidade(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Mínimo</Label>
                <Input type="number" value={novoMinimo} onChange={e => setNovoMinimo(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Unidade</Label>
                <Select value={novoUnidade} onValueChange={setNovoUnidade}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pçs">pçs</SelectItem>
                    <SelectItem value="m">m</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="un">un</SelectItem>
                    <SelectItem value="L">L</SelectItem>
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
