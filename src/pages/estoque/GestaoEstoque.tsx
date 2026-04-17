import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, ArrowUpDown, Loader2, Package, AlertTriangle, TrendingUp, TrendingDown, History } from "lucide-react";
import { toast } from "sonner";

interface EstoqueItem {
  id: string;
  codigo: string;
  produto: string;
  quantidade: number;
  unidade: string;
  minimo: number;
  categoria: string;
}

interface EstoqueMovimento {
  id: string;
  produto_id: string;
  tipo_movimento: "entrada" | "saida" | "ajuste";
  quantidade: number;
  observacao: string;
  created_at: string;
}

const categorias = [
  "Perfis de Alumínio",
  "Vidros",
  "Ferragens",
  "Componentes",
  "Acessórios",
  "Outros",
];

const unidades = ["un", "m", "m²", "kg", "l", "pç"];

export default function GestaoEstoque() {
  const [itens, setItens] = useState<EstoqueItem[]>([]);
  const [movimentos, setMovimentos] = useState<EstoqueMovimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [movimentoDialogOpen, setMovimentoDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EstoqueItem | null>(null);
  const [editData, setEditData] = useState<Partial<EstoqueItem>>({});
  const [movimentoData, setMovimentoData] = useState<Partial<EstoqueMovimento>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [estoqueRes, movRes] = await Promise.all([
        supabase.from("estoque").select("*").order("produto"),
        supabase.from("estoque_movimentos").select("*").order("created_at", { ascending: false }).limit(50),
      ]);

      if (estoqueRes.error) throw estoqueRes.error;
      if (movRes.error) throw movRes.error;

      setItens(estoqueRes.data || []);
      setMovimentos(movRes.data || []);
    } catch (err: any) {
      toast.error("Erro ao carregar dados:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editData.codigo || !editData.produto) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    try {
      if (editingItem) {
        const { error } = await supabase
          .from("estoque")
          .update({
            codigo: editData.codigo,
            produto: editData.produto,
            quantidade: editData.quantidade || 0,
            unidade: editData.unidade || "un",
            minimo: editData.minimo || 0,
            categoria: editData.categoria || "Outros",
          })
          .eq("id", editingItem.id);

        if (error) throw error;
        toast.success("Item atualizado!");
      } else {
        const { error } = await supabase.from("estoque").insert([{
          codigo: editData.codigo,
          produto: editData.produto,
          quantidade: editData.quantidade || 0,
          unidade: editData.unidade || "un",
          minimo: editData.minimo || 0,
          categoria: editData.categoria || "Outros",
        }]);

        if (error) throw error;
        toast.success("Item criado!");
      }

      setDialogOpen(false);
      setEditingItem(null);
      setEditData({});
      loadData();
    } catch (err: any) {
      toast.error("Erro ao salvar:", err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    try {
      const { error } = await supabase.from("estoque").delete().eq("id", id);
      if (error) throw error;
      toast.success("Item excluído!");
      loadData();
    } catch (err: any) {
      toast.error("Erro ao excluir:", err.message);
    }
  };

  const handleMovimento = async () => {
    if (!movimentoData.produto_id || !movimentoData.tipo_movimento || !movimentoData.quantidade) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      // Add movement record
      const { error: movError } = await supabase.from("estoque_movimentos").insert([{
        produto_id: movimentoData.produto_id,
        tipo_movimento: movimentoData.tipo_movimento,
        quantidade: movimentoData.quantidade,
        observacao: movimentoData.observacao || "",
      }]);

      if (movError) throw movError;

      // Update stock
      const item = itens.find(i => i.id === movimentoData.produto_id);
      if (item) {
        let newQty = item.quantidade;
        if (movimentoData.tipo_movimento === "entrada") {
          newQty += movimentoData.quantidade!;
        } else if (movimentoData.tipo_movimento === "saida") {
          newQty -= movimentoData.quantidade!;
        } else {
          newQty = movimentoData.quantidade!;
        }

        const { error: updateError } = await supabase
          .from("estoque")
          .update({ quantidade: newQty })
          .eq("id", item.id);

        if (updateError) throw updateError;
      }

      toast.success("Movimentação registrada!");
      setMovimentoDialogOpen(false);
      setMovimentoData({});
      loadData();
    } catch (err: any) {
      toast.error("Erro ao registrar:", err.message);
    }
  };

  const startEdit = (item: EstoqueItem) => {
    setEditingItem(item);
    setEditData({ ...item });
    setDialogOpen(true);
  };

  const startNew = () => {
    setEditingItem(null);
    setEditData({});
    setDialogOpen(true);
  };

  const openMovimento = (item: EstoqueItem) => {
    setMovimentoData({ produto_id: item.id });
    setMovimentoDialogOpen(true);
  };

  const getStockStatus = (quantidade: number, minimo: number) => {
    if (quantidade <= 0) return { label: "Sem estoque", color: "bg-red-500", icon: <AlertTriangle className="h-3 w-3" /> };
    if (quantidade < minimo) return { label: "Baixo", color: "bg-yellow-500", icon: <AlertTriangle className="h-3 w-3" /> };
    return { label: "Normal", color: "bg-green-500", icon: <Package className="h-3 w-3" /> };
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Estoque</h1>
          <p className="text-muted-foreground">Controle de materiais e componentes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setMovimentoDialogOpen(true)} className="gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Movimentar
          </Button>
          <Button onClick={startNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Item
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{itens.length}</p>
                <p className="text-xs text-muted-foreground">Total de Itens</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{itens.filter(i => i.quantidade <= 0).length}</p>
                <p className="text-xs text-muted-foreground">Sem Estoque</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{itens.filter(i => i.quantidade > 0 && i.quantidade < i.minimo).length}</p>
                <p className="text-xs text-muted-foreground">Estoque Baixo</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{itens.filter(i => i.quantidade >= i.minimo).length}</p>
                <p className="text-xs text-muted-foreground">Bem Abastecido</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="estoque">
        <TabsList>
          <TabsTrigger value="estoque">Estoque</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="estoque">
          <Card>
            <CardHeader>
              <CardTitle>Itens em Estoque</CardTitle>
              <CardDescription>Lista de todos os materiais cadastrados</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-right">Quantidade</TableHead>
                      <TableHead>Mínimo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itens.map((item) => {
                      const status = getStockStatus(item.quantidade, item.minimo);
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono">{item.codigo}</TableCell>
                          <TableCell>{item.produto}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.categoria}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {item.quantidade.toFixed(2)} {item.unidade}
                          </TableCell>
                          <TableCell>{item.minimo} {item.unidade}</TableCell>
                          <TableCell>
                            <Badge className={`${status.color} text-white`}>
                              {status.icon}
                              <span className="ml-1">{status.label}</span>
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => openMovimento(item)}>
                                <ArrowUpDown className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => startEdit(item)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historico">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Movimentações</CardTitle>
              <CardDescription>Registro de entradas e saídas</CardDescription>
            </CardHeader>
            <CardContent>
              {movimentos.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Nenhuma movimentação registrada</p>
              ) : (
                <div className="space-y-3">
                  {movimentos.map((mov) => {
                    const item = itens.find(i => i.id === mov.produto_id);
                    return (
                      <div key={mov.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            mov.tipo_movimento === "entrada" ? "bg-green-100" :
                            mov.tipo_movimento === "saida" ? "bg-red-100" : "bg-blue-100"
                          }`}>
                            {mov.tipo_movimento === "entrada" ? <TrendingUp className="h-5 w-5 text-green-600" /> :
                             mov.tipo_movimento === "saida" ? <TrendingDown className="h-5 w-5 text-red-600" /> :
                             <ArrowUpDown className="h-5 w-5 text-blue-600" />}
                          </div>
                          <div>
                            <p className="font-medium">{item?.produto || mov.produto_id}</p>
                            <p className="text-sm text-muted-foreground">
                              {mov.tipo_movimento === "entrada" ? "Entrada" :
                               mov.tipo_movimento === "saida" ? "Saída" : "Ajuste"}: {mov.quantidade} {item?.unidade || ""}
                            </p>
                            {mov.observacao && <p className="text-xs text-muted-foreground">{mov.observacao}</p>}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{formatDate(mov.created_at)}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Item Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Editar Item" : "Novo Item"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Código *</Label>
                <Input
                  placeholder="Ex: AL-001"
                  value={editData.codigo || ""}
                  onChange={(e) => setEditData({ ...editData, codigo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Unidade</Label>
                <select
                  className="w-full h-10 px-3 border rounded-md bg-background"
                  value={editData.unidade || "un"}
                  onChange={(e) => setEditData({ ...editData, unidade: e.target.value })}
                >
                  {unidades.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Produto *</Label>
              <Input
                placeholder="Nome do produto..."
                value={editData.produto || ""}
                onChange={(e) => setEditData({ ...editData, produto: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quantidade Inicial</Label>
                <Input
                  type="number"
                  min="0"
                  value={editData.quantidade || 0}
                  onChange={(e) => setEditData({ ...editData, quantidade: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Estoque Mínimo</Label>
                <Input
                  type="number"
                  min="0"
                  value={editData.minimo || 0}
                  onChange={(e) => setEditData({ ...editData, minimo: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <select
                className="w-full h-10 px-3 border rounded-md bg-background"
                value={editData.categoria || "Outros"}
                onChange={(e) => setEditData({ ...editData, categoria: e.target.value })}
              >
                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Movement Dialog */}
      <Dialog open={movimentoDialogOpen} onOpenChange={setMovimentoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Movimentação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Produto</Label>
              <select
                className="w-full h-10 px-3 border rounded-md bg-background"
                value={movimentoData.produto_id || ""}
                onChange={(e) => setMovimentoData({ ...movimentoData, produto_id: e.target.value })}
              >
                <option value="">Selecione...</option>
                {itens.map(i => (
                  <option key={i.id} value={i.id}>{i.codigo} - {i.produto}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Tipo de Movimentação</Label>
              <select
                className="w-full h-10 px-3 border rounded-md bg-background"
                value={movimentoData.tipo_movimento || ""}
                onChange={(e) => setMovimentoData({ ...movimentoData, tipo_movimento: e.target.value as any })}
              >
                <option value="">Selecione...</option>
                <option value="entrada">Entrada (compra/reposição)</option>
                <option value="saida">Saída (uso/venda)</option>
                <option value="ajuste">Ajuste (correção de contagem)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Quantidade</Label>
              <Input
                type="number"
                min="0"
                value={movimentoData.quantidade || ""}
                onChange={(e) => setMovimentoData({ ...movimentoData, quantidade: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Observação</Label>
              <Input
                placeholder="Ex: Compra de reposição..."
                value={movimentoData.observacao || ""}
                onChange={(e) => setMovimentoData({ ...movimentoData, observacao: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMovimentoDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleMovimento}>Registrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
