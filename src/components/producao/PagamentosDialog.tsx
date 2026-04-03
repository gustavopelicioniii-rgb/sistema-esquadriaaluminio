import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { formatCurrency, type OrdemProducao } from "@/data/mockData";
import { Check, Plus } from "lucide-react";

interface Pagamento {
  id: string;
  valor: number;
  data: string;
  forma: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ordem: OrdemProducao;
}

export default function PagamentosDialog({ open, onOpenChange, ordem }: Props) {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [forma, setForma] = useState("pix");

  const totalPago = pagamentos.reduce((s, p) => s + p.valor, 0);
  const restante = ordem.valor - totalPago;

  const handleAdd = () => {
    const v = parseFloat(valor);
    if (!v || v <= 0 || !data) {
      toast({ title: "Erro", description: "Preencha valor e data.", variant: "destructive" });
      return;
    }
    setPagamentos([...pagamentos, { id: crypto.randomUUID(), valor: v, data, forma }]);
    setValor("");
    setData("");
    toast({ title: "Pagamento registrado", description: `${formatCurrency(v)} via ${forma}` });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Pagamentos – Pedido {ordem.pedidoNum}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="font-bold text-sm">{formatCurrency(ordem.valor)}</p>
            </div>
            <div className="rounded-lg bg-primary/10 p-3">
              <p className="text-xs text-muted-foreground">Pago</p>
              <p className="font-bold text-sm text-primary">{formatCurrency(totalPago)}</p>
            </div>
            <div className="rounded-lg bg-destructive/10 p-3">
              <p className="text-xs text-muted-foreground">Restante</p>
              <p className="font-bold text-sm text-destructive">{formatCurrency(Math.max(0, restante))}</p>
            </div>
          </div>

          {pagamentos.length > 0 && (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {pagamentos.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-xs p-2 bg-muted/30 rounded">
                  <span className="flex items-center gap-1"><Check className="h-3 w-3 text-primary" />{p.data}</span>
                  <span className="capitalize">{p.forma}</span>
                  <span className="font-medium">{formatCurrency(p.valor)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="border-t pt-3 space-y-3">
            <p className="text-sm font-medium">Novo pagamento</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Valor (R$)</Label>
                <Input type="number" placeholder="0,00" value={valor} onChange={(e) => setValor(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Data</Label>
                <Input type="date" value={data} onChange={(e) => setData(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Forma</Label>
                <Select value={forma} onValueChange={setForma}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="cartao">Cartão</SelectItem>
                    <SelectItem value="boleto">Boleto</SelectItem>
                    <SelectItem value="transferencia">Transferência</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button size="sm" className="gap-1" onClick={handleAdd}>
              <Plus className="h-3 w-3" /> Registrar pagamento
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
