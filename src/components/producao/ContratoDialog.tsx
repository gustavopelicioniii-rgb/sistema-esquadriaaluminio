import { useState } from 'react';
import {
  ResponsiveDialog,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogFooter,
} from '@/components/ui/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/formatters';
import { FileText, Download } from 'lucide-react';
import type { Pedido } from '@/pages/Producao';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pedido: Pedido;
}

const gerarTextoContrato = (op: Pedido) => `CONTRATO DE PRESTAÇÃO DE SERVIÇOS

CONTRATANTE: ${op.cliente}
Endereço: ${op.endereco}
Telefone: ${op.telefone}

CONTRATADA: [Nome da Empresa]

OBJETO: Fabricação e instalação de esquadrias de alumínio conforme pedido nº ${op.pedido_num}.

VALOR TOTAL: ${formatCurrency(op.valor)}

PRAZO DE ENTREGA: ${op.previsao || 'A definir'}

CONDIÇÕES:
1. O pagamento deverá ser efetuado conforme acordado entre as partes.
2. O prazo de garantia é de 5 (cinco) anos para defeitos de fabricação.
3. Eventuais alterações no projeto poderão acarretar reajuste no valor.

VENDEDOR RESPONSÁVEL: ${op.vendedor}

____________________________          ____________________________
       CONTRATANTE                          CONTRATADA

Data: ___/___/______
`;

export default function ContratoDialog({ open, onOpenChange, pedido }: Props) {
  const [texto, setTexto] = useState(() => gerarTextoContrato(pedido));

  const handleDownload = () => {
    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contrato_pedido_${pedido.pedido_num}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Contrato baixado', {
      description: `Contrato do pedido ${pedido.pedido_num} exportado.`,
    });
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange} size="md">
      <ResponsiveDialogHeader>
        <ResponsiveDialogTitle className="flex items-center gap-2">
          <FileText className="h-4 w-4" /> Contrato – Pedido {pedido.pedido_num}
        </ResponsiveDialogTitle>
      </ResponsiveDialogHeader>
      <div className="space-y-3 py-2">
        <Label>Texto do contrato (editável)</Label>
        <Textarea
          className="min-h-[300px] font-mono text-xs"
          value={texto}
          onChange={e => setTexto(e.target.value)}
        />
      </div>
      <ResponsiveDialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Fechar
        </Button>
        <Button className="gap-1" onClick={handleDownload}>
          <Download className="h-4 w-4" /> Baixar contrato
        </Button>
      </ResponsiveDialogFooter>
    </ResponsiveDialog>
  );
}
