import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, FileText, Receipt, ClipboardList } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { generateProfessionalBudgetPDF } from '@/utils/budgetPdfGenerator';
import { buildOrdemServicoHTML, buildGenericHTML } from '@/utils/printTemplates/ordemServicoTemplate';
import type { Pedido } from '@/pages/Producao';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pedido: Pedido;
}

const impressoes = [
  {
    id: 'os',
    label: 'Ordem de Serviço',
    desc: 'Documento com detalhes do pedido para produção',
    icon: ClipboardList,
  },
  {
    id: 'orcamento',
    label: 'Orçamento',
    desc: 'Documento para o cliente com valores',
    icon: FileText,
  },
  { id: 'recibo', label: 'Recibo', desc: 'Comprovante de pagamento', icon: Receipt },
  {
    id: 'etiquetas',
    label: 'Etiquetas',
    desc: 'Etiquetas de identificação das peças',
    icon: Printer,
  },
];

export default function ImpressoesDialog({ open, onOpenChange, pedido }: Props) {
  const handleImprimir = async (tipo: string, id: string) => {
    if (id === 'orcamento') {
      try {
        const { data: orcamentos } = await supabase
          .from('orcamentos')
          .select('*')
          .eq('cliente', pedido.cliente)
          .order('created_at', { ascending: false })
          .limit(1);

        const orc = orcamentos?.[0];
        if (!orc) {
          toast.error('Nenhum orçamento encontrado', {
            description: `Não há orçamento cadastrado para o cliente "${pedido.cliente}".`,
          });
          return;
        }

        const itens = Array.isArray(orc.itens) ? (orc.itens as any[]) : [];
        const itensMultiplos = itens.map((item: any, idx: number) => ({
          produto: item.produto || item.descricao || `Item ${idx + 1}`,
          tipo: item.tipo || '',
          linha: item.linha || '',
          tratamento: item.tratamento || item.cor || '',
          larguraCm: item.larguraCm || item.largura || 0,
          alturaCm: item.alturaCm || item.altura || 0,
          quantidade: item.quantidade || 1,
          valorUnitario: item.valorUnitario || item.valor_unitario || 0,
          valorTotal: item.valorTotal || item.valor_total || 0,
          localizacao: item.localizacao || item.ambiente || '',
          descricaoCompleta: item.descricaoCompleta || item.descricao || '',
        }));

        await generateProfessionalBudgetPDF({
          numero: orc.numero,
          cliente: orc.cliente,
          produto: orc.produto,
          larguraCm: 0,
          alturaCm: 0,
          quantidade: 1,
          areaM2: 0,
          custoTotal: orc.valor,
          margem: 0,
          valorFinal: orc.valor,
          vendedor: pedido.vendedor || '',
          itensMultiplos: itensMultiplos.length > 0 ? itensMultiplos : undefined,
        });

        toast.success('PDF gerado', {
          description: `Orçamento ${orc.numero} do cliente ${orc.cliente}`,
        });
      } catch (err) {
        toast.error('Erro', { description: 'Falha ao gerar o PDF do orçamento.' });
      }
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Erro', { description: 'Popup bloqueado. Permita popups para imprimir.' });
      return;
    }

    const content = id === 'os' ? buildOrdemServicoHTML(pedido) : buildGenericHTML(tipo, pedido);

    printWindow.document.write(content);
    printWindow.document.close();
    toast.success('Impressão enviada', { description: `${tipo} do pedido ${pedido.pedido_num}` });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-4 w-4" /> Impressões – Pedido {pedido.pedido_num}
          </DialogTitle>
          <DialogDescription>
            Selecione o documento que deseja imprimir para este pedido.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          {impressoes.map(({ id, label, desc, icon: Icon }) => (
            <button
              key={id}
              className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors text-left"
              onClick={() => handleImprimir(label, id)}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </button>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
