import { useState } from "react";
import { planosCorte, type PlanoCorte as PlanoCorteType } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Plus, Search, Scissors, Layers, Wrench, Play, FileDown, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { generatePdfFromElement } from "@/utils/pdfGenerator";

type Categoria = "perfis" | "vidros" | "ferragens";

const categorias: { key: Categoria; label: string; icon: React.ElementType }[] = [
  { key: "perfis", label: "Perfis", icon: Scissors },
  { key: "vidros", label: "Vidros", icon: Layers },
  { key: "ferragens", label: "Ferragens", icon: Wrench },
];

function CutVisualization({ plano }: { plano: PlanoCorteType }) {
  const usedLength = plano.cortes.reduce((s, c) => s + c.comprimento, 0);
  const waste = plano.comprimentoBarra - usedLength;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-muted-foreground">
          Barra: {plano.perfil} ({(plano.comprimentoBarra / 1000).toFixed(2)}m)
        </span>
        <span className={cn("font-bold", plano.eficiencia >= 90 ? "text-success" : "text-warning")}>
          Eficiência: {plano.eficiencia}%
        </span>
      </div>
      <div className="flex h-10 w-full rounded overflow-hidden border">
        {plano.cortes.map((c, i) => (
          <div
            key={i}
            className="flex items-center justify-center text-xs font-bold text-white border-r border-white/30"
            style={{
              width: `${(c.comprimento / plano.comprimentoBarra) * 100}%`,
              backgroundColor: c.cor,
            }}
          >
            {(c.comprimento / 1000).toFixed(2)}m
          </div>
        ))}
        {waste > 0 && (
          <div
            className="flex items-center justify-center text-xs text-muted-foreground bg-muted font-medium"
            style={{ width: `${(waste / plano.comprimentoBarra) * 100}%` }}
          >
            {waste >= 500 ? "Retalho" : "Sobra"}
          </div>
        )}
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>0m</span>
        <span>{(plano.comprimentoBarra / 1000).toFixed(0)}m</span>
      </div>
    </div>
  );
}

const PlanoCorte = () => {
  const [categoria, setCategoria] = useState<Categoria>("perfis");
  const [search, setSearch] = useState("");

  const filtered = planosCorte.filter((p) => {
    if (p.categoria !== categoria) return false;
    if (search) return p.perfil.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Plano de Corte</h1>
          <p className="text-muted-foreground text-sm">Otimize seus materiais</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={async () => {
              toast({ title: "Gerando PDF...", description: "Aguarde um momento." });
              await generatePdfFromElement("plano-corte-content", "plano-de-corte.pdf");
              toast({ title: "PDF gerado!", description: "Plano de corte exportado com sucesso." });
            }}
          >
            <FileDown className="h-4 w-4" /> Exportar PDF
          </Button>
          <Button className="gap-2">
            <Play className="h-4 w-4" /> Gerar Plano
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 shrink-0 space-y-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">CATEGORIAS</p>
            <div className="space-y-0.5">
              {categorias.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setCategoria(cat.key)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    categoria === cat.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <cat.icon className="h-4 w-4" />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">AÇÕES</p>
            <button className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
              <Plus className="h-3.5 w-3.5" /> Novo perfil
            </button>
            <button className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline mt-1">
              <Play className="h-3.5 w-3.5" /> Gerar plano
            </button>
            <button className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline mt-1">
              <FileDown className="h-3.5 w-3.5" /> Exportar PDF
            </button>
          </div>
        </div>

        {/* Main */}
        <div id="plano-corte-content" className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar perfil..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Button variant="outline" size="sm" className="ml-4 gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Adicionar
            </Button>
          </div>

          {/* Table */}
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Listagem de Perfis</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo de Perfil</TableHead>
                    <TableHead>Comprimento</TableHead>
                    <TableHead>Qtd. Barras</TableHead>
                    <TableHead className="w-[30%]">Eficiência</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.perfil}</TableCell>
                      <TableCell>{p.comprimento}</TableCell>
                      <TableCell>{p.qtdBarras}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn("h-full rounded-full", p.eficiencia >= 90 ? "bg-success" : "bg-warning")}
                              style={{ width: `${p.eficiencia}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold w-10 text-right">{p.eficiencia}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => toast({ title: "Perfil removido", variant: "destructive" })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        Nenhum perfil encontrado nesta categoria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Cut Visualizations */}
          {filtered.length > 0 && (
            <Card className="shadow-sm border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Scissors className="h-4 w-4" /> Visualização do Corte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {filtered.map((plano, i) => (
                  <CutVisualization key={plano.id} plano={plano} />
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanoCorte;
