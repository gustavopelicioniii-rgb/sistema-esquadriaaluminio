import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, FileDown, ArrowUpDown, ArrowUp, ArrowDown, FileText, Sheet } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { generateExcel } from "@/utils/excelGenerator";
import { exportPrecoItensPdf } from "@/utils/precoItensPdfGenerator";
import perfilImg from "@/assets/items/perfil.png";
import vidroImg from "@/assets/items/vidro.png";
import ferragemImg from "@/assets/items/ferragem.png";

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
  { id: "3", codigo: "SU-003", descricao: "Perfil Contramarco 75×35", categoria: "Perfis", preco: 208.00, unidade: "barra", cor: "Amadeirado" },
  { id: "4", codigo: "SU-039", descricao: "Perfil Folha Móvel 60mm", categoria: "Perfis", preco: 190.00, unidade: "barra", cor: "Amadeirado" },
  { id: "5", codigo: "VD-001", descricao: "Vidro 6mm Comum Incolor", categoria: "Vidros", preco: 106.25, unidade: "m²", cor: "Incolor" },
  { id: "6", codigo: "VD-002", descricao: "Vidro 8mm Temperado", categoria: "Vidros", preco: 185.00, unidade: "m²", cor: "Incolor" },
  { id: "7", codigo: "FR-001", descricao: "Fechadura Multiponto", categoria: "Ferragens", preco: 89.90, unidade: "pç", cor: "Cromado" },
  { id: "8", codigo: "FR-002", descricao: "Roldana Dupla 30mm", categoria: "Ferragens", preco: 12.50, unidade: "pç", cor: "Preto" },
];

const categoryImage: Record<string, string> = {
  Perfis: perfilImg,
  Vidros: vidroImg,
  Ferragens: ferragemImg,
};

type SortKey = "codigo" | "descricao" | "preco" | "cor";
type SortDir = "asc" | "desc";

const PrecoItens = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />;
  };

  const filtered = useMemo(() => {
    let list = itensMock;

    if (category !== "Todos") {
      list = list.filter((i) => i.categoria === category);
    }

    if (search) {
      const s = search.toLowerCase();
      list = list.filter(
        (i) => i.descricao.toLowerCase().includes(s) || i.codigo.toLowerCase().includes(s) || i.categoria.toLowerCase().includes(s)
      );
    }

    if (sortKey) {
      list = [...list].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDir === "asc" ? aVal - bVal : bVal - aVal;
        }
        const cmp = String(aVal).localeCompare(String(bVal), "pt-BR");
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return list;
  }, [search, category, sortKey, sortDir]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Preço dos Itens</h1>
          <p className="text-muted-foreground text-sm">Tabela de preços de perfis, vidros e ferragens</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <FileDown className="h-4 w-4" /> Exportar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => exportPrecoItensPdf(filtered)}>
              <FileText className="mr-2 h-4 w-4" /> Exportar PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => generateExcel({
              title: "Tabela de Preços",
              headers: ["Código", "Descrição", "Categoria", "Cor", "Preço", "Unidade"],
              rows: filtered.map((i) => [i.codigo, i.descricao, i.categoria, i.cor, formatCurrency(i.preco), i.unidade]),
              filename: "tabela-precos.xlsx",
            })}>
              <Sheet className="mr-2 h-4 w-4" /> Exportar Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs value={category} onValueChange={setCategory}>
        <TabsList>
          <TabsTrigger value="Todos">Todos</TabsTrigger>
          <TabsTrigger value="Perfis">Perfis</TabsTrigger>
          <TabsTrigger value="Vidros">Vidros</TabsTrigger>
          <TabsTrigger value="Ferragens">Ferragens</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar item..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Imagem</TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("codigo")}>
                <span className="inline-flex items-center">Código <SortIcon col="codigo" /></span>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("descricao")}>
                <span className="inline-flex items-center">Descrição <SortIcon col="descricao" /></span>
              </TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("cor")}>
                <span className="inline-flex items-center">Cor <SortIcon col="cor" /></span>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("preco")}>
                <span className="inline-flex items-center">Preço <SortIcon col="preco" /></span>
              </TableHead>
              <TableHead>Unidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Nenhum item encontrado
                </TableCell>
              </TableRow>
            )}
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="h-10 w-10 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center overflow-hidden">
                    <img
                      src={categoryImage[item.categoria]}
                      alt={item.categoria}
                      loading="lazy"
                      width={40}
                      height={40}
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                </TableCell>
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
