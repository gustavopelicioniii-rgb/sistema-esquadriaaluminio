import { itensEstoque } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, Plus, FileDown } from "lucide-react";

const RelacaoMateriais = () => {
  const [search, setSearch] = useState("");

  const filtered = itensEstoque.filter((item) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return item.produto.toLowerCase().includes(s) || item.categoria.toLowerCase().includes(s);
  });

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
          <Button className="gap-2">
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
    </div>
  );
};

export default RelacaoMateriais;
