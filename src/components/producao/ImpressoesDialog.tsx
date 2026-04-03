import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { formatCurrency, type OrdemProducao } from "@/data/mockData";
import { Printer, FileText, Receipt, ClipboardList } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ordem: OrdemProducao;
}

const impressoes = [
  { id: "os", label: "Ordem de Serviço", desc: "Documento com detalhes do pedido para produção", icon: ClipboardList },
  { id: "orcamento", label: "Orçamento", desc: "Documento para o cliente com valores", icon: FileText },
  { id: "recibo", label: "Recibo", desc: "Comprovante de pagamento", icon: Receipt },
  { id: "etiquetas", label: "Etiquetas", desc: "Etiquetas de identificação das peças", icon: Printer },
];

export default function ImpressoesDialog({ open, onOpenChange, ordem }: Props) {
  const handleImprimir = (tipo: string) => {
    // Generate a simple printable document
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast({ title: "Erro", description: "Popup bloqueado. Permita popups para imprimir.", variant: "destructive" });
      return;
    }

    const content = `
      <html>
        <head>
          <title>${tipo} - Pedido ${ordem.pedidoNum}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            h1 { font-size: 20px; border-bottom: 2px solid #3B82F6; padding-bottom: 8px; }
            .info { margin: 20px 0; }
            .info p { margin: 4px 0; font-size: 14px; }
            .label { font-weight: bold; display: inline-block; width: 140px; }
            .valor { font-size: 24px; font-weight: bold; color: #3B82F6; margin: 20px 0; }
            .footer { margin-top: 40px; border-top: 1px solid #ddd; padding-top: 16px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <h1>${tipo.toUpperCase()} – PEDIDO Nº ${ordem.pedidoNum}</h1>
          <div class="info">
            <p><span class="label">Cliente:</span> ${ordem.cliente}</p>
            <p><span class="label">Endereço:</span> ${ordem.endereco}</p>
            <p><span class="label">Telefone:</span> ${ordem.telefone}</p>
            <p><span class="label">Vendedor:</span> ${ordem.vendedor}</p>
            <p><span class="label">Previsão:</span> ${ordem.previsao}</p>
            ${ordem.etapa ? `<p><span class="label">Etapa atual:</span> ${ordem.etapa}</p>` : ""}
            ${ordem.anotacao ? `<p><span class="label">Anotação:</span> ${ordem.anotacao}</p>` : ""}
          </div>
          <div class="valor">Valor: ${formatCurrency(ordem.valor)}</div>
          <div class="footer">
            Documento gerado em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
    toast({ title: "Impressão enviada", description: `${tipo} do pedido ${ordem.pedidoNum}` });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-4 w-4" /> Impressões – Pedido {ordem.pedidoNum}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-2">
          {impressoes.map(({ id, label, desc, icon: Icon }) => (
            <button
              key={id}
              className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors text-left"
              onClick={() => handleImprimir(label)}
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
