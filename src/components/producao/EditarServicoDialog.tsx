import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import type { Pedido } from "@/pages/Producao";
import { toast } from "sonner";

interface EditarServicoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pedido: Pedido;
}

export default function EditarServicoDialog({ open, onOpenChange, pedido }: EditarServicoDialogProps) {
  const [cliente, setCliente] = useState(pedido.cliente);
  const [endereco, setEndereco] = useState(pedido.endereco || "");
  const [telefone, setTelefone] = useState(pedido.telefone || "");
  const [vendedor, setVendedor] = useState(pedido.vendedor || "");
  const [valor, setValor] = useState(String(pedido.valor));
  const [previsao, setPrevisao] = useState(pedido.previsao || "");
  const [anotacao, setAnotacao] = useState(pedido.anotacao || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setCliente(pedido.cliente);
      setEndereco(pedido.endereco || "");
      setTelefone(pedido.telefone || "");
      setVendedor(pedido.vendedor || "");
      setValor(String(pedido.valor));
      setPrevisao(pedido.previsao || "");
      setAnotacao(pedido.anotacao || "");
    }
  }, [open, pedido]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("pedidos")
      .update({
        cliente,
        endereco: endereco || null,
        telefone: telefone || null,
        vendedor: vendedor || null,
        valor: parseFloat(valor) || 0,
        previsao: previsao || null,
        anotacao: anotacao || null,
      } as any)
      .eq("id", pedido.id);

    setSaving(false);
    if (error) {
      toast.error("Erro ao salvar", { description: error.message });
    } else {
      toast({ title: "Serviço atualizado", description: `Pedido ${pedido.pedido_num} foi atualizado.` });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Pedido {pedido.pedido_num}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="edit-cliente">Cliente</Label>
            <Input id="edit-cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-endereco">Endereço</Label>
            <Input id="edit-endereco" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="edit-telefone">Telefone</Label>
              <Input id="edit-telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-vendedor">Vendedor</Label>
              <Input id="edit-vendedor" value={vendedor} onChange={(e) => setVendedor(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="edit-valor">Valor (R$)</Label>
              <Input id="edit-valor" type="number" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-previsao">Previsão</Label>
              <Input id="edit-previsao" type="date" value={previsao} onChange={(e) => setPrevisao(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-anotacao">Anotações</Label>
            <Textarea id="edit-anotacao" rows={3} value={anotacao} onChange={(e) => setAnotacao(e.target.value)} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button className="flex-1" onClick={handleSave} disabled={saving || !cliente.trim()}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
