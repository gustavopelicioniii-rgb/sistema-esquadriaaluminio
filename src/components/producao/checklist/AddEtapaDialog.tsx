import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pedidoId: string;
  onCreated: () => void;
}

export default function AddEtapaDialog({ open, onOpenChange, pedidoId, onCreated }: Props) {
  const [label, setLabel] = useState("");
  const [items, setItems] = useState<string[]>([""]);
  const [saving, setSaving] = useState(false);

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

    setSaving(true);
    const etapaKey = `custom_${Date.now()}`;

    const { data: etapaData, error: etapaErr } = await supabase
      .from("pedido_custom_etapas")
      .insert({ pedido_id: pedidoId, etapa_key: etapaKey, label: label.trim(), ordem: 99 } as any)
      .select()
      .single();

    if (etapaErr || !etapaData) {
      toast.error("Erro", { description: etapaErr?.message || "Erro ao criar etapa." });
      setSaving(false);
      return;
    }

    const itemsToInsert = validItems.map((item, idx) => ({
      etapa_id: (etapaData as any).id,
      item_key: `item_${idx}_${Date.now()}`,
      label: item.trim(),
      ordem: idx,
    }));

    const { error: itemsErr } = await supabase
      .from("pedido_custom_items")
      .insert(itemsToInsert as any);

    setSaving(false);

    if (itemsErr) {
      toast.error("Erro", { description: itemsErr.message });
      return;
    }

    toast.success("Etapa criada", { description: `"${label}" adicionada com ${validItems.length} itens.` });
    setLabel("");
    setItems([""]);
    onOpenChange(false);
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Etapa Personalizada</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Nome da etapa</Label>
            <Input
              placeholder="Ex: Pintura, Acabamento..."
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
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
            {saving ? "Salvando..." : "Criar etapa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
