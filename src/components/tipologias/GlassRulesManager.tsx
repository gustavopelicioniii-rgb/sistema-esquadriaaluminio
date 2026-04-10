import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomGlassRules, type CustomGlassRuleRow } from "@/hooks/use-custom-glass-rules";
import { findBaseTypologyId } from "@/hooks/use-all-typologies";
import { Plus, Trash2, Edit2, Download, Loader2, GlassWater } from "lucide-react";
import type { Typology } from "@/types/calculation";
import { toast } from "sonner";

const REFERENCE_DIMENSIONS = [
  { value: "L", label: "L (Largura)" },
  { value: "H", label: "H (Altura)" },
  { value: "L/2", label: "L/2" },
  { value: "L/3", label: "L/3" },
  { value: "L/4", label: "L/4" },
  { value: "L/6", label: "L/6" },
  { value: "H/2", label: "H/2" },
  { value: "H/3", label: "H/3" },
];

const emptyRule = {
  glass_name: "",
  width_reference: "L",
  width_constant_mm: 0,
  height_reference: "H",
  height_constant_mm: 0,
  quantity: 1,
  glass_type: "",
  min_thickness_mm: null as number | null,
  max_thickness_mm: null as number | null,
  notes: "",
};

interface Props {
  typology: {
    id: string;
    product_line_id: string;
    category: string;
    subcategory?: string | null;
    num_folhas: number;
    name: string;
  };
}

export function GlassRulesManager({ typology }: Props) {
  const { rules, loading, addRule, updateRule, deleteRule, inheritFromBase } = useCustomGlassRules(typology.id);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyRule);
  const [inheriting, setInheriting] = useState(false);

  const handleSave = async () => {
    if (!form.glass_name.trim()) {
      toast.error("Preencha o nome do vidro");
      return;
    }
    try {
      if (editId) {
        await updateRule(editId, {
          glass_name: form.glass_name,
          width_reference: form.width_reference,
          width_constant_mm: form.width_constant_mm,
          height_reference: form.height_reference,
          height_constant_mm: form.height_constant_mm,
          quantity: form.quantity,
          glass_type: form.glass_type || null,
          min_thickness_mm: form.min_thickness_mm,
          max_thickness_mm: form.max_thickness_mm,
          notes: form.notes || null,
        } as Partial<CustomGlassRuleRow>);
        toast.success("Regra atualizada");
      } else {
        await addRule({
          typology_id: typology.id,
          glass_name: form.glass_name,
          width_reference: form.width_reference,
          width_constant_mm: form.width_constant_mm,
          height_reference: form.height_reference,
          height_constant_mm: form.height_constant_mm,
          quantity: form.quantity,
          glass_type: form.glass_type || null,
          min_thickness_mm: form.min_thickness_mm,
          max_thickness_mm: form.max_thickness_mm,
          notes: form.notes || null,
        } as Omit<CustomGlassRuleRow, "id" | "user_id">);
        toast.success("Regra adicionada");
      }
      setForm(emptyRule);
      setEditId(null);
      setShowForm(false);
    } catch (err: any) {
      toast.error("Erro", { description: err.message });
    }
  };

  const handleEdit = (r: CustomGlassRuleRow) => {
    setForm({
      glass_name: r.glass_name,
      width_reference: r.width_reference,
      width_constant_mm: Number(r.width_constant_mm),
      height_reference: r.height_reference,
      height_constant_mm: Number(r.height_constant_mm),
      quantity: r.quantity,
      glass_type: r.glass_type || "",
      min_thickness_mm: r.min_thickness_mm != null ? Number(r.min_thickness_mm) : null,
      max_thickness_mm: r.max_thickness_mm != null ? Number(r.max_thickness_mm) : null,
      notes: r.notes || "",
    });
    setEditId(r.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRule(id);
      toast.error("Regra removida");
    } catch (err: any) {
      toast.error("Erro", { description: err.message });
    }
  };

  const handleInherit = async () => {
    setInheriting(true);
    try {
      const baseId = findBaseTypologyId({
        product_line_id: typology.product_line_id,
        category: typology.category as Typology["category"],
        subcategory: (typology.subcategory ?? undefined) as Typology["subcategory"],
        num_folhas: typology.num_folhas,
      });
      if (!baseId) {
        toast.error("Nenhuma tipologia base encontrada no catálogo");
        return;
      }
      await inheritFromBase(baseId);
      toast.success("Regras de vidro herdadas do catálogo!");
    } catch (err: any) {
      toast.error("Erro ao herdar regras", { description: err.message });
    } finally {
      setInheriting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Carregando regras de vidro...
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <GlassWater className="h-4 w-4 text-primary" />
            Regras de Vidro — {typology.name}
          </CardTitle>
          <div className="flex gap-2">
            {rules.length === 0 && (
              <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleInherit} disabled={inheriting}>
                {inheriting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                Herdar do Catálogo
              </Button>
            )}
            <Button size="sm" className="gap-1.5 text-xs" onClick={() => { setForm(emptyRule); setEditId(null); setShowForm(true); }}>
              <Plus className="h-3 w-3" /> Nova Regra
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {rules.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm space-y-3">
            <p>Nenhuma regra de vidro definida.</p>
            <p className="text-xs">Use "Herdar do Catálogo" para copiar regras, ou crie do zero.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Nome</TableHead>
                  <TableHead className="text-xs">Larg. Ref.</TableHead>
                  <TableHead className="text-xs">Larg. Const.</TableHead>
                  <TableHead className="text-xs">Alt. Ref.</TableHead>
                  <TableHead className="text-xs">Alt. Const.</TableHead>
                  <TableHead className="text-xs">Qtd</TableHead>
                  <TableHead className="text-xs">Tipo</TableHead>
                  <TableHead className="text-xs">Espessura</TableHead>
                  <TableHead className="text-xs text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-xs font-medium">{r.glass_name}</TableCell>
                    <TableCell className="text-xs">{r.width_reference}</TableCell>
                    <TableCell className="text-xs">{Number(r.width_constant_mm)}mm</TableCell>
                    <TableCell className="text-xs">{r.height_reference}</TableCell>
                    <TableCell className="text-xs">{Number(r.height_constant_mm)}mm</TableCell>
                    <TableCell className="text-xs">{r.quantity}</TableCell>
                    <TableCell className="text-xs">
                      {r.glass_type ? <Badge variant="outline" className="text-[10px]">{r.glass_type}</Badge> : "—"}
                    </TableCell>
                    <TableCell className="text-xs">
                      {r.min_thickness_mm || r.max_thickness_mm
                        ? `${r.min_thickness_mm ?? "?"}–${r.max_thickness_mm ?? "?"}mm`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(r)}>
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(r.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={showForm} onOpenChange={(o) => { setShowForm(o); if (!o) { setEditId(null); setForm(emptyRule); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? "Editar Regra de Vidro" : "Nova Regra de Vidro"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs">Nome do Vidro *</Label>
              <Input value={form.glass_name} onChange={(e) => setForm({ ...form, glass_name: e.target.value })} placeholder="Ex: Vidro Folha" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Ref. Largura</Label>
                <Select value={form.width_reference} onValueChange={(v) => setForm({ ...form, width_reference: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {REFERENCE_DIMENSIONS.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Constante Largura (mm)</Label>
                <Input type="number" value={form.width_constant_mm} onChange={(e) => setForm({ ...form, width_constant_mm: Number(e.target.value) })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Ref. Altura</Label>
                <Select value={form.height_reference} onValueChange={(v) => setForm({ ...form, height_reference: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {REFERENCE_DIMENSIONS.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Constante Altura (mm)</Label>
                <Input type="number" value={form.height_constant_mm} onChange={(e) => setForm({ ...form, height_constant_mm: Number(e.target.value) })} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Quantidade</Label>
                <Input type="number" min={1} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Tipo de Vidro</Label>
                <Input value={form.glass_type} onChange={(e) => setForm({ ...form, glass_type: e.target.value })} placeholder="comum, temperado..." />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Espessura Mín. (mm)</Label>
                <Input type="number" value={form.min_thickness_mm ?? ""} onChange={(e) => setForm({ ...form, min_thickness_mm: e.target.value ? Number(e.target.value) : null })} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Espessura Máx. (mm)</Label>
                <Input type="number" value={form.max_thickness_mm ?? ""} onChange={(e) => setForm({ ...form, max_thickness_mm: e.target.value ? Number(e.target.value) : null })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditId(null); setForm(emptyRule); }}>Cancelar</Button>
            <Button onClick={handleSave}>{editId ? "Salvar" : "Adicionar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
