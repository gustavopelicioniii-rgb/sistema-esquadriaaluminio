import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { OrdemProducao } from "@/data/mockData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ordem: OrdemProducao;
}

const etapas = [
  { id: "orcamento", label: "Orçamento", color: "bg-blue-500" },
  { id: "aprovado", label: "Aprovado", color: "bg-emerald-500" },
  { id: "corte", label: "Corte", color: "bg-amber-500" },
  { id: "montagem", label: "Montagem", color: "bg-orange-500" },
  { id: "conferencia", label: "Conferência", color: "bg-purple-500" },
  { id: "instalacao", label: "Instalação", color: "bg-cyan-500" },
  { id: "finalizado", label: "Finalizado", color: "bg-primary" },
  { id: "fechado", label: "Fechado", color: "bg-muted-foreground" },
];

export default function AlterarEtapaDialog({ open, onOpenChange, ordem }: Props) {
  const [selected, setSelected] = useState(
    ordem.etapa ? etapas.find((e) => e.label.toLowerCase() === ordem.etapa?.toLowerCase())?.id || "" : ""
  );
  const [obs, setObs] = useState("");

  const handleSalvar = () => {
    if (!selected) {
      toast({ title: "Erro", description: "Selecione uma etapa.", variant: "destructive" });
      return;
    }
    const etapa = etapas.find((e) => e.id === selected);
    toast({ title: "Etapa alterada", description: `Pedido ${ordem.pedidoNum} → ${etapa?.label}` });
    setObs("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alterar Etapa – Pedido {ordem.pedidoNum}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {ordem.etapa && (
            <p className="text-sm text-muted-foreground">
              Etapa atual: <span className="font-medium text-foreground">{ordem.etapa}</span>
            </p>
          )}
          <div className="space-y-2">
            <Label>Nova etapa</Label>
            <div className="grid grid-cols-2 gap-2">
              {etapas.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setSelected(e.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors text-left",
                    selected === e.id ? "border-primary bg-primary/5 font-medium" : "hover:bg-muted/50"
                  )}
                >
                  <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", e.color)} />
                  {e.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Observação (opcional)</Label>
            <Textarea placeholder="Ex: Peças conferidas, aguardando transporte..." value={obs} onChange={(e) => setObs(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSalvar}>Salvar etapa</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
