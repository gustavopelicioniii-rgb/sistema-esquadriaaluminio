import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Monitor, ArrowLeft, Trash2, Edit2, Eye, Search } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/data/mockData";

// Types
interface VidroItem {
  id: string;
  descricao: string;
  larguraMm: number;
  alturaMm: number;
  quantidade: number;
}

interface ProjetoVidro {
  id: string;
  titulo: string;
  tipo: string;
  espessura: string;
  cor: string;
  precoM2: number;
  itens: VidroItem[];
  criadoEm: string;
}

const tiposVidro = [
  "Comum",
  "Temperado",
  "Laminado",
  "Temperado Laminado",
  "Insulado",
  "Serigrafado",
  "Espelhado",
  "Acidato",
];

const espessuras = ["4mm", "6mm", "8mm", "10mm", "12mm", "15mm", "19mm"];
const cores = ["Incolor", "Fumê", "Verde", "Bronze", "Cinza", "Preto", "Branco Leitoso"];

function calcAreaM2(largMm: number, altMm: number): number {
  return (largMm * altMm) / 1_000_000;
}

// ============ DETAIL VIEW ============
function ProjetoDetalhe({
  projeto,
  onBack,
  onUpdate,
  onDelete,
}: {
  projeto: ProjetoVidro;
  onBack: () => void;
  onUpdate: (p: ProjetoVidro) => void;
  onDelete: (id: string) => void;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [addItemOpen, setAddItemOpen] = useState(false);

  // Edit state
  const [editTitulo, setEditTitulo] = useState(projeto.titulo);
  const [editTipo, setEditTipo] = useState(projeto.tipo);
  const [editEspessura, setEditEspessura] = useState(projeto.espessura);
  const [editCor, setEditCor] = useState(projeto.cor);
  const [editPrecoM2, setEditPrecoM2] = useState(projeto.precoM2);

  // New item state
  const [itemDesc, setItemDesc] = useState("");
  const [itemLarg, setItemLarg] = useState(1000);
  const [itemAlt, setItemAlt] = useState(1000);
  const [itemQtd, setItemQtd] = useState(1);

  const areaTotal = projeto.itens.reduce(
    (sum, it) => sum + calcAreaM2(it.larguraMm, it.alturaMm) * it.quantidade,
    0
  );
  const valorTotal = areaTotal * projeto.precoM2;

  const handleSaveEdit = () => {
    if (!editTitulo) {
      toast.error("Informe o título do projeto");
      return;
    }
    onUpdate({
      ...projeto,
      titulo: editTitulo,
      tipo: editTipo,
      espessura: editEspessura,
      cor: editCor,
      precoM2: editPrecoM2,
    });
    setEditOpen(false);
    toast.success("Projeto atualizado!");
  };

  const handleAddItem = () => {
    if (!itemDesc) {
      toast.error("Informe a descrição do vidro");
      return;
    }
    const novoItem: VidroItem = {
      id: `vi-${Date.now()}`,
      descricao: itemDesc,
      larguraMm: itemLarg,
      alturaMm: itemAlt,
      quantidade: itemQtd,
    };
    onUpdate({ ...projeto, itens: [...projeto.itens, novoItem] });
    setAddItemOpen(false);
    setItemDesc("");
    setItemLarg(1000);
    setItemAlt(1000);
    setItemQtd(1);
    toast.success("Vidro adicionado!");
  };

  const handleRemoveItem = (itemId: string) => {
    onUpdate({ ...projeto, itens: projeto.itens.filter((it) => it.id !== itemId) });
    toast.success("Item removido");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setEditOpen(true)}>
            <Edit2 className="h-3.5 w-3.5" /> Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={() => {
              onDelete(projeto.id);
              onBack();
            }}
          >
            <Trash2 className="h-3.5 w-3.5" /> Excluir
          </Button>
        </div>
      </div>

      {/* Project summary */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Monitor className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold">{projeto.titulo}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">{projeto.tipo}</Badge>
                <Badge variant="outline">{projeto.espessura}</Badge>
                <Badge variant="outline">{projeto.cor}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Preço/m²</p>
                  <p className="font-semibold text-sm">{formatCurrency(projeto.precoM2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Área Total</p>
                  <p className="font-semibold text-sm">{areaTotal.toFixed(2)} m²</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Valor Total</p>
                  <p className="font-bold text-sm text-primary">{formatCurrency(valorTotal)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items table */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold">Vidros do Projeto</CardTitle>
          <Button size="sm" className="gap-2" onClick={() => setAddItemOpen(true)}>
            <Plus className="h-3.5 w-3.5" /> Adicionar Vidro
          </Button>
        </CardHeader>
        <CardContent>
          {projeto.itens.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Nenhum vidro adicionado. Clique em "Adicionar Vidro" para começar.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-center">Largura (mm)</TableHead>
                    <TableHead className="text-center">Altura (mm)</TableHead>
                    <TableHead className="text-center">Qtd</TableHead>
                    <TableHead className="text-right">Área (m²)</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projeto.itens.map((item) => {
                    const area = calcAreaM2(item.larguraMm, item.alturaMm) * item.quantidade;
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.descricao}</TableCell>
                        <TableCell className="text-center font-mono">{item.larguraMm}</TableCell>
                        <TableCell className="text-center font-mono">{item.alturaMm}</TableCell>
                        <TableCell className="text-center font-semibold">{item.quantidade}</TableCell>
                        <TableCell className="text-right font-mono">{area.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                          {formatCurrency(area * projeto.precoM2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
          {projeto.itens.length > 0 && (
            <div className="flex justify-between items-center pt-3 border-t mt-3 text-sm">
              <span className="text-muted-foreground">
                {projeto.itens.length} vidro(s) • {areaTotal.toFixed(2)} m² total
              </span>
              <span className="font-bold text-primary">{formatCurrency(valorTotal)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Projeto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={editTitulo} onChange={(e) => setEditTitulo(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={editTipo} onValueChange={setEditTipo}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {tiposVidro.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Espessura</Label>
                <Select value={editEspessura} onValueChange={setEditEspessura}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {espessuras.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Cor</Label>
                <Select value={editCor} onValueChange={setEditCor}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {cores.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Preço por m²</Label>
                <Input
                  type="number"
                  value={editPrecoM2}
                  onChange={(e) => setEditPrecoM2(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveEdit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add item dialog */}
      <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Vidro</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input
                value={itemDesc}
                onChange={(e) => setItemDesc(e.target.value)}
                placeholder="Ex: Vidro sala de estar"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Largura (mm)</Label>
                <Input type="number" value={itemLarg} onChange={(e) => setItemLarg(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Altura (mm)</Label>
                <Input type="number" value={itemAlt} onChange={(e) => setItemAlt(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Quantidade</Label>
                <Input type="number" value={itemQtd} onChange={(e) => setItemQtd(Number(e.target.value))} min={1} />
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Área unitária:</span>
                <span className="font-mono">{calcAreaM2(itemLarg, itemAlt).toFixed(4)} m²</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-muted-foreground">Área total:</span>
                <span className="font-mono font-semibold">
                  {(calcAreaM2(itemLarg, itemAlt) * itemQtd).toFixed(4)} m²
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddItemOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddItem}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============ MAIN VIEW ============
const initialProjetos: ProjetoVidro[] = [
  {
    id: "pv1",
    titulo: "Vidro 6mm Comum - Incolor",
    tipo: "Comum",
    espessura: "6mm",
    cor: "Incolor",
    precoM2: 106.25,
    criadoEm: new Date().toLocaleDateString("pt-BR"),
    itens: [
      { id: "vi1", descricao: "Vidro Folha Sala", larguraMm: 1200, alturaMm: 1000, quantidade: 2 },
      { id: "vi2", descricao: "Vidro Folha Cozinha", larguraMm: 800, alturaMm: 600, quantidade: 1 },
    ],
  },
  {
    id: "pv2",
    titulo: "Vidro 8mm Temperado - Fumê",
    tipo: "Temperado",
    espessura: "8mm",
    cor: "Fumê",
    precoM2: 185.83,
    criadoEm: new Date().toLocaleDateString("pt-BR"),
    itens: [
      { id: "vi3", descricao: "Box Banheiro", larguraMm: 1800, alturaMm: 2000, quantidade: 1 },
      { id: "vi4", descricao: "Porta Pivotante", larguraMm: 900, alturaMm: 2100, quantidade: 1 },
    ],
  },
  {
    id: "pv3",
    titulo: "Vidro Laminado 10mm",
    tipo: "Laminado",
    espessura: "10mm",
    cor: "Incolor",
    precoM2: 200.0,
    criadoEm: new Date().toLocaleDateString("pt-BR"),
    itens: [
      { id: "vi5", descricao: "Guarda-corpo", larguraMm: 3000, alturaMm: 1100, quantidade: 2 },
    ],
  },
];

const ProjetoVidroPage = () => {
  const [projetos, setProjetos] = useState<ProjetoVidro[]>(initialProjetos);
  const [selected, setSelected] = useState<ProjetoVidro | null>(null);
  const [search, setSearch] = useState("");
  const [novoOpen, setNovoOpen] = useState(false);

  // New project state
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoTipo, setNovoTipo] = useState("Comum");
  const [novoEspessura, setNovoEspessura] = useState("6mm");
  const [novoCor, setNovoCor] = useState("Incolor");
  const [novoPrecoM2, setNovoPrecoM2] = useState(106);

  const filtered = projetos.filter(
    (p) => !search || p.titulo.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!novoTitulo) {
      toast.error("Informe o título do projeto");
      return;
    }
    const novo: ProjetoVidro = {
      id: `pv-${Date.now()}`,
      titulo: novoTitulo,
      tipo: novoTipo,
      espessura: novoEspessura,
      cor: novoCor,
      precoM2: novoPrecoM2,
      itens: [],
      criadoEm: new Date().toLocaleDateString("pt-BR"),
    };
    setProjetos((prev) => [novo, ...prev]);
    setNovoOpen(false);
    setNovoTitulo("");
    setNovoPrecoM2(106);
    toast.success("Projeto criado! Adicione os vidros.");
    setSelected(novo);
  };

  const handleUpdate = (updated: ProjetoVidro) => {
    setProjetos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setSelected(updated);
  };

  const handleDelete = (id: string) => {
    setProjetos((prev) => prev.filter((p) => p.id !== id));
    toast.success("Projeto excluído");
  };

  if (selected) {
    // Sync with latest state
    const latest = projetos.find((p) => p.id === selected.id) || selected;
    return (
      <ProjetoDetalhe
        projeto={latest}
        onBack={() => setSelected(null)}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Projeto Vidro</h1>
          <p className="text-muted-foreground text-sm">Visualize e configure projetos de vidro</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={() => setNovoOpen(true)}>
          <Plus className="h-4 w-4" /> Novo Projeto
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar projeto..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((projeto) => {
          const areaTotal = projeto.itens.reduce(
            (sum, it) => sum + calcAreaM2(it.larguraMm, it.alturaMm) * it.quantidade,
            0
          );
          const valorTotal = areaTotal * projeto.precoM2;
          return (
            <Card key={projeto.id} className="shadow-sm border-border/50 hover:shadow-md hover:border-primary/30 transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-primary" />
                  {projeto.titulo}
                </CardTitle>
                <div className="flex gap-1.5 mt-1">
                  <Badge variant="secondary" className="text-[10px]">{projeto.tipo}</Badge>
                  <Badge variant="outline" className="text-[10px]">{projeto.espessura}</Badge>
                  <Badge variant="outline" className="text-[10px]">{projeto.cor}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Área</span>
                    <span className="font-semibold">{areaTotal.toFixed(2)} M²</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">TOTAL</span>
                    <span className="font-bold text-primary">{formatCurrency(valorTotal)}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4 gap-2"
                  onClick={() => setSelected(projeto)}
                >
                  <Eye className="h-3.5 w-3.5" /> Ver detalhes
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          Nenhum projeto encontrado.
        </div>
      )}

      {/* New project dialog */}
      <Dialog open={novoOpen} onOpenChange={setNovoOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle className="text-lg">Novo Projeto de Vidro</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Título</Label>
              <Input
                value={novoTitulo}
                onChange={(e) => setNovoTitulo(e.target.value)}
                placeholder="Ex: Vidro 8mm Temperado - Fumê"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Tipo</Label>
                <Select value={novoTipo} onValueChange={setNovoTipo}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {tiposVidro.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Espessura</Label>
                <Select value={novoEspessura} onValueChange={setNovoEspessura}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {espessuras.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Cor</Label>
                <Select value={novoCor} onValueChange={setNovoCor}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {cores.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Preço por m²</Label>
                <Input
                  type="number"
                  value={novoPrecoM2}
                  onChange={(e) => setNovoPrecoM2(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setNovoOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate}>Criar Projeto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjetoVidroPage;
