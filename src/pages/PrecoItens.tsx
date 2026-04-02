import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, FileDown } from "lucide-react";
import { formatCurrency } from "@/data/mockData";

interface ItemPreco {
  id: string;
  codigo: string;
  descricao: string;
  categoria: string;
  preco: number;
  unidade: string;
  cor: string;
}

const itensMock: ItemPreco[] = [
  { id: "1", codigo: "SU-001", descricao: "Perfil Montante 40x25", categoria: "Perfis", preco: 288.20, unidade: "barra", cor: "Amadeirado" },
  { id: "2", codigo: "SU-002", descricao: "Perfil Trilho 50x30", categoria: "Perfis", preco: 276.36, unidade: "barra", cor: "Amadeirado" },
  { id: "3", codigo: "SU-003", descricao: "Perfil Contramarco 75x35", categoria: "Perfis", preco: 208.00, unidade: "barra", cor: "Amadeirado" },
  { id: "4", codigo: "SU-039", descricao: "Perfil Folha Móvel 60mm", categoria: "Perfis", preco: 190.00, unidade: "barra", cor: "Amadeirado" },
  { id: "5", codigo: "VD-001", descricao: "Vidro 6mm Comum Incolor", categoria: "Vidros", preco: 106.25, unidade: "m²", cor: "Incolor" },
  { id: "6", codigo: "VD-002", descricao: "Vidro 8mm Temperado", categoria: "Vidros", preco: 185.00, unidade: "m²", cor: "Incolor" },
  { id: "7", codigo: "FR-001", descricao: "Fechadura Multiponto", categoria: "Ferragens", preco: 89.90, unidade: "pç", cor: "Cromado" },
  { id: "8", codigo: "FR-002", descricao: "Roldana Dupla 30mm", categoria: "Ferragens", preco: 12.50, unidade: "pç", cor: "Preto" },
];

const PrecoItens = () => {
  const [search, setSearch] = useState("");

  const filtered = itensMock.filter((item) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return item.descricao.toLowerCase().includes(s) || item.codigo.toLowerCase().includes(s) || item.categoria.toLowerCase().includes(s);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Preço dos Itens</h1>
          <p className="text-muted-foreground text-sm">Tabela de preços de perfis, vidros e ferragens</p>
        </div>
        <Button variant="outline" className="gap-2">
          <FileDown className="h-4 w-4" /> Exportar
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar item..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Cor</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Unidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-semibold text-primary">{item.codigo}</TableCell>
                <TableCell className="font-medium">{item.descricao}</TableCell>
                <TableCell><Badge variant="secondary" className="text-xs">{item.categoria}</Badge></TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <span className={`h-3 w-3 rounded-full ${item.cor === "Amadeirado" ? "bg-amber-600" : item.cor === "Cromado" ? "bg-gray-400" : item.cor === "Preto" ? "bg-foreground" : "bg-blue-200"}`} />
                    <span className="text-sm">{item.cor}</span>
                  </div>
                </TableCell>
                <TableCell className="font-bold">{formatCurrency(item.preco)}</TableCell>
                <TableCell className="text-muted-foreground">{item.unidade}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PrecoItens;
