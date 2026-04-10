import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { Printer, FileText, Receipt, ClipboardList } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { generateProfessionalBudgetPDF } from "@/utils/budgetPdfGenerator";
import type { Pedido } from "@/pages/Producao";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pedido: Pedido;
}

const impressoes = [
  { id: "os", label: "Ordem de Serviço", desc: "Documento com detalhes do pedido para produção", icon: ClipboardList },
  { id: "orcamento", label: "Orçamento", desc: "Documento para o cliente com valores", icon: FileText },
  { id: "recibo", label: "Recibo", desc: "Comprovante de pagamento", icon: Receipt },
  { id: "etiquetas", label: "Etiquetas", desc: "Etiquetas de identificação das peças", icon: Printer },
];

function buildOrdemServicoHTML(pedido: Pedido): string {
  const now = new Date();
  const dataFormatada = now.toLocaleDateString("pt-BR");
  const horaFormatada = now.toLocaleTimeString("pt-BR");
  const cidade = pedido.endereco || "";

  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<title>Ordem de Serviço - Pedido ${pedido.pedido_num}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Arial,Helvetica,sans-serif;color:#222;font-size:13px;background:#fff}
@page{size:A4;margin:12mm 10mm}
.page{max-width:780px;margin:0 auto;padding:20px 28px}
/* Header */
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;padding-bottom:14px;border-bottom:3px solid #2563EB}
.header-left h1{font-size:20px;font-weight:700;color:#1e293b;letter-spacing:0.5px}
.header-left p{font-size:11px;color:#64748b;margin-top:2px}
.header-right{text-align:right}
.header-right .obra-box{display:inline-flex;align-items:center;gap:6px;background:#EFF6FF;border:1.5px solid #BFDBFE;border-radius:6px;padding:5px 14px;margin-bottom:6px}
.obra-box span:first-child{font-size:11px;font-weight:600;color:#2563EB}
.obra-box span:last-child{font-size:16px;font-weight:800;color:#1e40af}
.header-right .date{font-size:13px;font-weight:600;color:#334155}
/* Sections */
.section{margin-bottom:14px}
.section-title{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#fff;background:#2563EB;padding:5px 12px;border-radius:4px 4px 0 0}
.section-body{border:1px solid #CBD5E1;border-top:none;border-radius:0 0 4px 4px;padding:12px 14px}
/* Info grid */
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px 24px}
.info-row{display:flex;gap:6px;font-size:12.5px;line-height:1.7}
.info-row .lbl{font-weight:700;color:#475569;min-width:100px;flex-shrink:0}
.info-row .val{color:#1e293b}
.info-row.full{grid-column:1/-1}
/* Colors bar */
.colors-bar{display:flex;gap:24px;font-size:12px;padding:8px 14px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:4px;margin-bottom:14px}
.colors-bar .lbl{font-weight:700;color:#475569}
.colors-bar .val{color:#1e293b}
/* Items table */
.items-table{width:100%;border-collapse:collapse;font-size:12px;margin-top:0}
.items-table th{background:#F1F5F9;font-weight:700;text-align:left;padding:7px 10px;border:1px solid #CBD5E1;color:#334155;font-size:11px;text-transform:uppercase;letter-spacing:0.5px}
.items-table td{padding:8px 10px;border:1px solid #E2E8F0;vertical-align:top}
.items-table tr:nth-child(even) td{background:#FAFBFC}
.item-num{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:4px;background:#2563EB;color:#fff;font-size:11px;font-weight:700}
.item-code{font-weight:700;color:#1e40af;font-size:12.5px}
.item-desc{color:#475569;font-size:11.5px;margin-top:2px}
.item-detail{font-size:11.5px;margin-top:3px;color:#334155}
.item-detail .lbl{font-weight:700}
/* Value */
.valor-section{display:flex;justify-content:flex-end;margin:18px 0 10px;padding:12px 18px;background:#EFF6FF;border:2px solid #2563EB;border-radius:6px}
.valor-section .lbl{font-size:14px;font-weight:600;color:#334155;margin-right:12px;line-height:1.6}
.valor-section .amount{font-size:22px;font-weight:800;color:#1e40af}
/* Observations */
.obs-box{border:1px solid #E2E8F0;border-radius:4px;padding:10px 14px;min-height:60px;margin-bottom:14px;font-size:12px;color:#64748b;font-style:italic}
/* Signatures */
.signatures{display:flex;justify-content:space-between;margin-top:30px;padding-top:10px}
.sig-block{text-align:center;width:44%}
.sig-line{border-top:1.5px solid #94A3B8;margin-bottom:4px;margin-top:40px}
.sig-label{font-size:11px;color:#64748b;font-weight:600}
/* Footer */
.footer{margin-top:24px;padding-top:10px;border-top:1px solid #E2E8F0;display:flex;justify-content:space-between;font-size:10px;color:#94A3B8}
/* Status badge */
.status-badge{display:inline-block;padding:3px 10px;border-radius:12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px}
.status-aprovado{background:#D1FAE5;color:#065F46}
.status-producao{background:#DBEAFE;color:#1E40AF}
.status-entregue{background:#E0E7FF;color:#3730A3}
.status-default{background:#F1F5F9;color:#475569}
</style></head><body>
<div class="page">

  <!-- HEADER -->
  <div class="header">
    <div class="header-left">
      <h1>ORDEM DE SERVIÇO</h1>
      <p>Documento para controle de produção</p>
    </div>
    <div class="header-right">
      <div class="obra-box"><span>Pedido Nº</span><span>${pedido.pedido_num}</span></div>
      <div class="date">${dataFormatada}</div>
    </div>
  </div>

  <!-- DADOS DO CLIENTE -->
  <div class="section">
    <div class="section-title">Dados do Cliente</div>
    <div class="section-body">
      <div class="info-grid">
        <div class="info-row"><span class="lbl">Nome:</span><span class="val" style="font-weight:700">${pedido.cliente}</span></div>
        <div class="info-row"><span class="lbl">Telefone:</span><span class="val">${pedido.telefone || "—"}</span></div>
        <div class="info-row full"><span class="lbl">Endereço:</span><span class="val">${pedido.endereco || "—"}</span></div>
        <div class="info-row"><span class="lbl">Vendedor:</span><span class="val">${pedido.vendedor || "—"}</span></div>
        <div class="info-row"><span class="lbl">Previsão:</span><span class="val">${pedido.previsao || "N/A"}</span></div>
        <div class="info-row"><span class="lbl">Status:</span><span class="val"><span class="status-badge ${getStatusClass(pedido.status)}">${pedido.status}</span></span></div>
        ${pedido.etapa ? `<div class="info-row"><span class="lbl">Etapa:</span><span class="val">${pedido.etapa}</span></div>` : ""}
      </div>
    </div>
  </div>

  <!-- VALOR -->
  <div class="valor-section">
    <span class="lbl">Valor Total:</span>
    <span class="amount">${formatCurrency(pedido.valor)}</span>
  </div>

  <!-- OBSERVAÇÕES -->
  ${pedido.anotacao ? `
  <div class="section">
    <div class="section-title">Observações</div>
    <div class="obs-box">${pedido.anotacao}</div>
  </div>` : ""}

  <!-- ASSINATURAS -->
  <div class="signatures">
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-label">Vendedor</div>
    </div>
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-label">Responsável</div>
    </div>
  </div>

  ${cidade ? `<p style="text-align:right;font-size:12px;color:#475569;margin-top:16px">${cidade}, ${dataFormatada}</p>` : ""}

  <!-- FOOTER -->
  <div class="footer">
    <span>Gerado em ${dataFormatada} às ${horaFormatada}</span>
    <span>Página 1/1</span>
  </div>
</div>
<script>window.print();</script>
</body></html>`;
}

function getStatusClass(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("aprovado")) return "status-aprovado";
  if (s.includes("produ")) return "status-producao";
  if (s.includes("entregue") || s.includes("conclu")) return "status-entregue";
  return "status-default";
}

function buildGenericHTML(tipo: string, pedido: Pedido): string {
  return `<html><head><title>${tipo} - Pedido ${pedido.pedido_num}</title>
<style>body{font-family:'Segoe UI',Arial,sans-serif;padding:40px;color:#333}h1{font-size:20px;border-bottom:2px solid #2563EB;padding-bottom:8px}.info{margin:20px 0}.info p{margin:4px 0;font-size:14px}.label{font-weight:bold;display:inline-block;width:140px}.valor{font-size:24px;font-weight:bold;color:#1e40af;margin:20px 0}.footer{margin-top:40px;border-top:1px solid #ddd;padding-top:16px;font-size:12px;color:#999}</style></head>
<body><h1>${tipo.toUpperCase()} – PEDIDO Nº ${pedido.pedido_num}</h1>
<div class="info"><p><span class="label">Cliente:</span> ${pedido.cliente}</p><p><span class="label">Endereço:</span> ${pedido.endereco || "—"}</p><p><span class="label">Telefone:</span> ${pedido.telefone || "—"}</p><p><span class="label">Vendedor:</span> ${pedido.vendedor || "—"}</p><p><span class="label">Previsão:</span> ${pedido.previsao || "N/A"}</p>${pedido.etapa ? `<p><span class="label">Etapa:</span> ${pedido.etapa}</p>` : ""}</div>
<div class="valor">Valor: ${formatCurrency(pedido.valor)}</div>
<div class="footer">Gerado em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}</div>
<script>window.print();</script></body></html>`;
}

export default function ImpressoesDialog({ open, onOpenChange, pedido }: Props) {
  const handleImprimir = async (tipo: string, id: string) => {
    if (id === "orcamento") {
      // Fetch real orcamento from database matching this pedido's client
      try {
        const { data: orcamentos } = await supabase
          .from("orcamentos")
          .select("*")
          .eq("cliente", pedido.cliente)
          .order("created_at", { ascending: false })
          .limit(1);

        const orc = orcamentos?.[0];
        if (!orc) {
          toast.error("Nenhum orçamento encontrado", { description: `Não há orçamento cadastrado para o cliente "${pedido.cliente}".` });
          return;
        }

        const itens = Array.isArray(orc.itens) ? orc.itens as any[] : [];
        const itensMultiplos = itens.map((item: any, idx: number) => ({
          produto: item.produto || item.descricao || `Item ${idx + 1}`,
          tipo: item.tipo || "",
          linha: item.linha || "",
          tratamento: item.tratamento || item.cor || "",
          larguraCm: item.larguraCm || item.largura || 0,
          alturaCm: item.alturaCm || item.altura || 0,
          quantidade: item.quantidade || 1,
          valorUnitario: item.valorUnitario || item.valor_unitario || 0,
          valorTotal: item.valorTotal || item.valor_total || 0,
          localizacao: item.localizacao || item.ambiente || "",
          descricaoCompleta: item.descricaoCompleta || item.descricao || "",
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
          vendedor: pedido.vendedor || "",
          itensMultiplos: itensMultiplos.length > 0 ? itensMultiplos : undefined,
        });

        toast.success("PDF gerado", { description: `Orçamento ${orc.numero} do cliente ${orc.cliente}` });
      } catch (err) {
        console.error("Erro ao gerar orçamento:", err);
        toast.error("Erro", { description: "Falha ao gerar o PDF do orçamento." });
      }
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Erro", { description: "Popup bloqueado. Permita popups para imprimir." });
      return;
    }

    const content = id === "os"
      ? buildOrdemServicoHTML(pedido)
      : buildGenericHTML(tipo, pedido);

    printWindow.document.write(content);
    printWindow.document.close();
    toast.success("Impressão enviada", { description: `${tipo} do pedido ${pedido.pedido_num}` });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Printer className="h-4 w-4" /> Impressões – Pedido {pedido.pedido_num}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-2">
          {impressoes.map(({ id, label, desc, icon: Icon }) => (
            <button key={id} className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors text-left" onClick={() => handleImprimir(label, id)}>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10"><Icon className="h-4 w-4 text-primary" /></div>
              <div><p className="text-sm font-medium">{label}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
            </button>
          ))}
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
