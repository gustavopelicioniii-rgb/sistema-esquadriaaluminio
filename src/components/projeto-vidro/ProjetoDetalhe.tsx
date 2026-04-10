import { useState, useRef } from "react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus, ArrowLeft, Trash2, Edit2, FileDown, Loader2,
  Copy, Upload, Check, X, FileSpreadsheet, MessageSquare,
} from "lucide-react";
import { exportProjetoVidroPDF } from "@/utils/projetoVidroPdfGenerator";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/formatters";
import { ProjetoVidro, VidroItem, tiposVidro, espessuras, cores, calcAreaM2, calcAreaEfetiva } from "./types";
import { GlassPreviewTile } from "./glass-svg-helpers";
import { EditableRow } from "./EditableRow";

interface ProjetoDetalheProps {
  projeto: ProjetoVidro;
  onBack: () => void;
  onUpdate: (p: Partial<ProjetoVidro> & { id: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onDuplicate: (id: string) => Promise<void>;
  onAddItem: (projetoId: string, item: Omit<VidroItem, "id">) => Promise<void>;
  onUpdateItem: (itemId: string, updates: Partial<VidroItem>) => Promise<void>;
  onRemoveItem: (itemId: string) => Promise<void>;
}

export function ProjetoDetalhe({
  projeto, onBack, onUpdate, onDelete, onDuplicate, onAddItem, onUpdateItem, onRemoveItem,
}: ProjetoDetalheProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [csvOpen, setCsvOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [editTitulo, setEditTitulo] = useState(projeto.titulo);
  const [editTipo, setEditTipo] = useState(projeto.tipo);
  const [editEspessura, setEditEspessura] = useState(projeto.espessura);
  const [editCor, setEditCor] = useState(projeto.cor);
  const [editPrecoM2, setEditPrecoM2] = useState(projeto.precoM2);
  const [editAreaMinima, setEditAreaMinima] = useState(projeto.areaMinimaM2);

  const [itemDesc, setItemDesc] = useState("");
  const [itemLarg, setItemLarg] = useState(1000);
  const [itemAlt, setItemAlt] = useState(1000);
  const [itemQtd, setItemQtd] = useState(1);
  const [itemObs, setItemObs] = useState("");

  const [csvText, setCsvText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const areaTotal = projeto.itens.reduce(
    (sum, it) => sum + calcAreaEfetiva(it.larguraMm, it.alturaMm, projeto.areaMinimaM2) * it.quantidade, 0
  );
  const valorTotal = areaTotal * projeto.precoM2;

  const handleSaveEdit = async () => {
    if (!editTitulo) { toast.error("Informe o título"); return; }
    setSaving(true);
    try {
      await onUpdate({ id: projeto.id, titulo: editTitulo, tipo: editTipo, espessura: editEspessura, cor: editCor, precoM2: editPrecoM2, areaMinimaM2: editAreaMinima });
      setEditOpen(false);
      toast.success("Projeto atualizado!");
    } catch { toast.error("Erro ao salvar"); }
    setSaving(false);
  };

  const handleAddItem = async () => {
    if (!itemDesc) { toast.error("Informe a descrição"); return; }
    setSaving(true);
    try {
      await onAddItem(projeto.id, { descricao: itemDesc, larguraMm: itemLarg, alturaMm: itemAlt, quantidade: itemQtd, observacao: itemObs });
      setAddItemOpen(false);
      setItemDesc(""); setItemLarg(1000); setItemAlt(1000); setItemQtd(1); setItemObs("");
      toast.success("Vidro adicionado!");
    } catch { toast.error("Erro ao adicionar"); }
    setSaving(false);
  };

  const handleInlineSave = async (itemId: string, updates: Partial<VidroItem>) => {
    setSaving(true);
    try {
      await onUpdateItem(itemId, updates);
      setEditingItemId(null);
      toast.success("Item atualizado!");
    } catch { toast.error("Erro ao atualizar"); }
    setSaving(false);
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await onRemoveItem(itemId);
      toast.success("Item removido");
    } catch { toast.error("Erro ao remover"); }
  };

  const parseCSV = (text: string): Omit<VidroItem, "id">[] => {
    const lines = text.trim().split("\n").filter(Boolean);
    const items: Omit<VidroItem, "id">[] = [];
    for (const line of lines) {
      const parts = line.split(/[;,\t]/).map(s => s.trim());
      if (parts.length < 3) continue;
      const desc = parts[0];
      const larg = parseInt(parts[1]);
      const alt = parseInt(parts[2]);
      const qtd = parseInt(parts[3]) || 1;
      const obs = parts[4] || "";
      if (!desc || isNaN(larg) || isNaN(alt)) continue;
      items.push({ descricao: desc, larguraMm: larg, alturaMm: alt, quantidade: qtd, observacao: obs });
    }
    return items;
  };

  const handleImportCSV = async () => {
    const items = parseCSV(csvText);
    if (items.length === 0) { toast.error("Nenhum item válido encontrado"); return; }
    setSaving(true);
    try {
      for (const item of items) {
        await onAddItem(projeto.id, item);
      }
      setCsvOpen(false);
      setCsvText("");
      toast.success(`${items.length} vidro(s) importado(s)!`);
    } catch { toast.error("Erro ao importar"); }
    setSaving(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCsvText(ev.target?.result as string || "");
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => {
            exportProjetoVidroPDF({ ...projeto, itens: projeto.itens });
            toast.success("PDF exportado!");
          }}>
            <FileDown className="h-3.5 w-3.5" /> PDF
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setCsvOpen(true)}>
            <Upload className="h-3.5 w-3.5" /> Importar
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={async () => { await onDuplicate(projeto.id); onBack(); }}>
            <Copy className="h-3.5 w-3.5" /> Duplicar
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setEditOpen(true)}>
            <Edit2 className="h-3.5 w-3.5" /> Editar
          </Button>
          <Button variant="destructive" size="sm" className="gap-2" onClick={() => setDeleteConfirmOpen(true)}>
            <Trash2 className="h-3.5 w-3.5" /> Excluir
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-5">
            <GlassPreviewTile tipo={projeto.tipo} />
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold">{projeto.titulo}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">{projeto.tipo}</Badge>
                <Badge variant="outline">{projeto.espessura}</Badge>
                <Badge variant="outline">{projeto.cor}</Badge>
                {projeto.areaMinimaM2 > 0 && (
                  <Badge variant="outline" className="text-amber-600 border-amber-300">Mín: {projeto.areaMinimaM2} m²</Badge>
                )}
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
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projeto.itens.map((item) => {
                    if (editingItemId === item.id) {
                      return (
                        <EditableRow
                          key={item.id}
                          item={item}
                          areaMinimaM2={projeto.areaMinimaM2}
                          precoM2={projeto.precoM2}
                          onSave={(updates) => handleInlineSave(item.id, updates)}
                          onCancel={() => setEditingItemId(null)}
                        />
                      );
                    }
                    const areaReal = calcAreaM2(item.larguraMm, item.alturaMm);
                    const areaEfetiva = calcAreaEfetiva(item.larguraMm, item.alturaMm, projeto.areaMinimaM2);
                    const areaTotalItem = areaEfetiva * item.quantidade;
                    const isMinApplied = projeto.areaMinimaM2 > 0 && areaReal < projeto.areaMinimaM2;
                    return (
                      <TableRow key={item.id} className="group">
                        <TableCell>
                          <span className="font-medium">{item.descricao}</span>
                          {item.observacao && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MessageSquare className="h-3 w-3" /> {item.observacao}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="text-center font-mono">{item.larguraMm}</TableCell>
                        <TableCell className="text-center font-mono">{item.alturaMm}</TableCell>
                        <TableCell className="text-center font-semibold">{item.quantidade}</TableCell>
                        <TableCell className="text-right font-mono">
                          {areaTotalItem.toFixed(2)}
                          {isMinApplied && (
                            <span className="text-[10px] text-amber-600 block">mín aplicado</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                          {formatCurrency(areaTotalItem * projeto.precoM2)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingItemId(item.id)}>
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleRemoveItem(item.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
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
              <span className="text-muted-foreground">{projeto.itens.length} vidro(s) • {areaTotal.toFixed(2)} m² total</span>
              <span className="font-bold text-primary">{formatCurrency(valorTotal)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit project dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader><DialogTitle>Editar Projeto</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Título</Label>
              <Input value={editTitulo} onChange={(e) => setEditTitulo(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Tipo</Label>
                <Select value={editTipo} onValueChange={setEditTipo}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>{tiposVidro.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Espessura</Label>
                <Select value={editEspessura} onValueChange={setEditEspessura}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>{espessuras.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Cor</Label>
                <Select value={editCor} onValueChange={setEditCor}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>{cores.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Preço por m²</Label>
                <Input type="number" value={editPrecoM2} onChange={(e) => setEditPrecoM2(Number(e.target.value))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Área mínima de cobrança (m²)</Label>
              <Input type="number" step="0.01" value={editAreaMinima} onChange={(e) => setEditAreaMinima(Number(e.target.value))} placeholder="0 = sem mínimo" />
              <p className="text-xs text-muted-foreground">Peças menores serão cobradas por esta área mínima</p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add item dialog */}
      <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader><DialogTitle>Adicionar Vidro</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Descrição</Label>
              <Input value={itemDesc} onChange={(e) => setItemDesc(e.target.value)} placeholder="Ex: Vidro sala de estar" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Largura (mm)</Label>
                <Input type="number" value={itemLarg} onChange={(e) => setItemLarg(Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Altura (mm)</Label>
                <Input type="number" value={itemAlt} onChange={(e) => setItemAlt(Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Quantidade</Label>
                <Input type="number" value={itemQtd} onChange={(e) => setItemQtd(Number(e.target.value))} min={1} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Observação</Label>
              <Input value={itemObs} onChange={(e) => setItemObs(e.target.value)} placeholder="Ex: temperado com furo, cantos lapidados" />
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Área unitária:</span>
                <span className="font-mono">{calcAreaM2(itemLarg, itemAlt).toFixed(4)} m²</span>
              </div>
              {projeto.areaMinimaM2 > 0 && calcAreaM2(itemLarg, itemAlt) < projeto.areaMinimaM2 && (
                <div className="flex justify-between text-amber-600">
                  <span>Área mínima aplicada:</span>
                  <span className="font-mono">{projeto.areaMinimaM2.toFixed(2)} m²</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Área total:</span>
                <span className="font-mono font-semibold">{(calcAreaEfetiva(itemLarg, itemAlt, projeto.areaMinimaM2) * itemQtd).toFixed(4)} m²</span>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setAddItemOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddItem} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSV Import dialog */}
      <Dialog open={csvOpen} onOpenChange={setCsvOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Importar Vidros via CSV</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Formato: <code className="text-xs bg-muted px-1 rounded">Descrição;Largura(mm);Altura(mm);Qtd;Observação</code>
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-2">
                <FileSpreadsheet className="h-3.5 w-3.5" /> Selecionar arquivo
              </Button>
              <input ref={fileInputRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />
            </div>
            <Textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder={"Vidro Sala;1200;800;2;Temperado\nVidro Banheiro;600;400;1;Jateado"}
              rows={8}
              className="font-mono text-xs"
            />
            {csvText && (
              <p className="text-xs text-muted-foreground">
                {parseCSV(csvText).length} item(ns) válido(s) encontrado(s)
              </p>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setCsvOpen(false)}>Cancelar</Button>
            <Button onClick={handleImportCSV} disabled={saving || !csvText}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Importar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir projeto?</AlertDialogTitle>
            <AlertDialogDescription>
              O projeto <strong>"{projeto.titulo}"</strong> e todos os seus vidros serão excluídos permanentemente. Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={async () => { await onDelete(projeto.id); onBack(); }}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
