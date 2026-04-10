import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Etapa } from "./etapasConfig";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  etapa: Etapa;
  onSaved: () => void;
}

export default function EditEtapaDialog({ open, onOpenChange, etapa, onSaved }: Props) {
  const [label, setLabel] = useState(etapa.label);
  const [items, setItems] = useState<string[]>(etapa.items.map((i) => i.label));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setLabel(etapa.label);
      setItems(etapa.items.map((i) => i.label));
    }
  }, [open, etapa]);

  const addItem = () => setItems((prev) => [...prev, ""]);
  const removeItem = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));
  const updateItem = (idx: number, val: string) =>
    setItems((prev) => prev.map((v, i) => (i === idx ? val : v)));

  const handleSave = async () => {
    if (!label.trim()) {
      toast.error("Erro", { description: "Informe o nome da etapa." });
      return;
    }
    const validItems = items.filter((i) => i.trim());
    if (validItems.length === 0) {
      toast.error("Erro", { description: "Adicione pelo menos 1 item." });
      return;
    }
    if (!etapa.dbId) return;

    setSaving(true);

    // Update etapa label
    await supabase
      .from("pedido_custom_etapas")
      .update({ label: label.trim() } as any)
      .eq("id", etapa.dbId);

    // Delete old items and re-insert
    await supabase.from("pedido_custom_items").delete().eq("etapa_id", etapa.dbId);

    const itemsToInsert = validItems.map((item, idx) => ({
      etapa_id: etapa.dbId,
      item_key: `item_${idx}_${Date.now()}`,
      label: item.trim(),
      ordem: idx,
    }));

    await supabase.from("pedido_custom_items").insert(itemsToInsert as any);

    setSaving(false);
    toast({ title: "Etapa atualizada", description: `"${label}" salva com sucesso.` });
    onOpenChange(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Etapa</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Nome da etapa</Label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Itens do checklist</Label>
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    placeholder={`Item ${idx + 1}`}
                    value={item}
                    onChange={(e) => updateItem(idx, e.target.value)}
                  />
                  {items.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removeItem(idx)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={addItem}>
              <Plus className="h-3.5 w-3.5" />
              Adicionar item
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Salvando..." : "Salvar alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
