import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { formatCurrency, type OrdemProducao } from "@/data/mockData";
import { FileText, Download } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ordem: OrdemProducao;
}

const gerarTextoContrato = (op: OrdemProducao) => `CONTRATO DE PRESTAÇÃO DE SERVIÇOS

CONTRATANTE: ${op.cliente}
Endereço: ${op.endereco}
Telefone: ${op.telefone}

CONTRATADA: [Nome da Empresa]

OBJETO: Fabricação e instalação de esquadrias de alumínio conforme pedido nº ${op.pedidoNum}.

VALOR TOTAL: ${formatCurrency(op.valor)}

PRAZO DE ENTREGA: ${op.previsao}

CONDIÇÕES:
1. O pagamento deverá ser efetuado conforme acordado entre as partes.
2. O prazo de garantia é de 5 (cinco) anos para defeitos de fabricação.
3. Eventuais alterações no projeto poderão acarretar reajuste no valor.

VENDEDOR RESPONSÁVEL: ${op.vendedor}

____________________________          ____________________________
       CONTRATANTE                          CONTRATADA

Data: ___/___/______
`;

export default function ContratoDialog({ open, onOpenChange, ordem }: Props) {
  const [texto, setTexto] = useState(() => gerarTextoContrato(ordem));

  const handleDownload = () => {
    const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contrato_pedido_${ordem.pedidoNum}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Contrato baixado", description: `Contrato do pedido ${ordem.pedidoNum} exportado.` });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Contrato – Pedido {ordem.pedidoNum}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Label>Texto do contrato (editável)</Label>
          <Textarea
            className="min-h-[300px] font-mono text-xs"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
          <Button className="gap-1" onClick={handleDownload}>
            <Download className="h-4 w-4" /> Baixar contrato
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
