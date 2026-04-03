import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import type { OrdemProducao } from "@/data/mockData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ordem: OrdemProducao;
}

export default function ReagendarDialog({ open, onOpenChange, ordem }: Props) {
  const [novaData, setNovaData] = useState("");
  const [motivo, setMotivo] = useState("");

  const handleSalvar = () => {
    if (!novaData) {
      toast({ title: "Erro", description: "Informe a nova data.", variant: "destructive" });
      return;
    }
    toast({ title: "Reagendado", description: `Pedido ${ordem.pedidoNum} reagendado para ${novaData}.` });
    setNovaData("");
    setMotivo("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reagendar Pedido {ordem.pedidoNum}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Previsão atual</Label>
            <Input value={ordem.previsao} disabled />
          </div>
          <div className="space-y-2">
            <Label>Nova data de previsão</Label>
            <Input type="date" value={novaData} onChange={(e) => setNovaData(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Motivo do reagendamento</Label>
            <Textarea placeholder="Ex: Material atrasado pelo fornecedor..." value={motivo} onChange={(e) => setMotivo(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSalvar}>Reagendar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
