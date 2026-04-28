// Professional PDF Generator with Company Branding
// Generates high-quality proposals with logo, colors, and contract terms

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { type CompanyBranding, hexToRgb, darkenColor, loadBranding } from './companyConfig';

interface BudgetItem {
  produto: string;
  tipo?: string;
  linha?: string;
  tratamento?: string;
  larguraCm: number;
  alturaCm: number;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  localizacao?: string;
  descricaoCompleta?: string;
  svgDataUrl?: string;
}

interface ProfessionalPdfConfig {
  // Budget data
  numero?: string;
  data?: Date;
  validadeDias?: number;

  // Client
  cliente: string;
  clienteTelefone?: string;
  clienteEmail?: string;
  clienteEndereco?: string;
  clienteBairro?: string;
  clienteCidade?: string;

  // Seller
  vendedor?: string;

  // Items
  itens: BudgetItem[];
  obra?: string;

  // Totals
  subtotal: number;
  desconto?: number;
  descontoPercent?: number;
  valorFinal: number;

  // Payment
  condicaoPagamento?: string;
  formaPagamento?: string;

  // Observations
  observacoes?: string;

  // Extra services
  servicosExtras?: { descricao: string; valor: number }[];

  // Optional custom branding (uses default if not provided)
  branding?: Partial<CompanyBranding>;

  // Include contract terms
  includeContractTerms?: boolean;
  includeWarrantyTerms?: boolean;
}

const formatBRL = (v: number) => {
  const num = typeof v === 'number' && !isNaN(v) ? v : 0;
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDateBR = (date: Date) => {
  const d = date || new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear());
  return `${dd}/${mm}/${yy}`;
};

const formatCep = (cep: string) => {
  if (!cep) return '';
  const clean = cep.replace(/\D/g, '');
  if (clean.length === 8) {
    return `${clean.slice(0, 5)}-${clean.slice(5)}`;
  }
  return cep;
};

async function loadImage(url: string): Promise<string | null> {
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/png');
  } catch {
    return null;
  }
}

export async function generateProfessionalPdf(config: ProfessionalPdfConfig): Promise<void> {
  const branding = { ...loadBranding(), ...config.branding };
  const pdf = new jsPDF('p', 'mm', 'a4');

  const W = 210;
  const H = 297;
  const ML = 10;
  const MR = 10;
  const CW = W - ML - MR;

  const primary = hexToRgb(branding.primaryColor);
  const secondary = hexToRgb(branding.secondaryColor);
  const accent = hexToRgb(branding.accentColor);
  const primaryDark = hexToRgb(darkenColor(branding.primaryColor, 20));

  const BLACK: [number, number, number] = [0, 0, 0];
  const WHITE: [number, number, number] = [255, 255, 255];
  const GRAY: [number, number, number] = [128, 128, 128];
  const LIGHT_GRAY: [number, number, number] = [240, 240, 240];

  let y = 0;

  const safeText = (text: any, x: number, yPos: number, opts?: any) => {
    let str: string | string[];
    if (Array.isArray(text)) {
      str = text.map((t: any) => (t == null ? '' : String(t)));
    } else {
      str = text == null ? '' : String(text);
    }
    if (opts) pdf.text(str, x, yPos, opts);
    else pdf.text(str, x, yPos);
  };

  // ==================== HEADER ====================
  // Header background gradient effect (solid color)
  pdf.setFillColor(...primary);
  pdf.rect(0, 0, W, 35, 'F');

  // Company name
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  safeText(branding.companyName, ML, 15);

  // Tagline
  if (branding.tagline) {
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    safeText(branding.tagline, ML, 22);
  }

  // Contact info (right side)
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  let contactY = 13;

  if (branding.phone) {
    safeText(`Tel: ${branding.phone}`, W - MR, contactY, { align: 'right' });
    contactY += 4;
  }
  if (branding.email) {
    safeText(branding.email, W - MR, contactY, { align: 'right' });
    contactY += 4;
  }
  if (branding.website) {
    safeText(branding.website, W - MR, contactY, { align: 'right' });
  }

  // Logo (if exists, centered in header)
  if (branding.logoUrl) {
    const logoData = await loadImage(branding.logoUrl);
    if (logoData) {
      // Adjust logo size based on header
      const logoMaxW = 50;
      const logoMaxH = 20;
      pdf.addImage(logoData, 'PNG', (W - logoMaxW) / 2, 5, logoMaxW, logoMaxH);
    }
  }

  y = 40;

  // ==================== PROPOSAL INFO ====================
  // Proposal title bar
  pdf.setFillColor(...primaryDark);
  pdf.rect(ML, y, CW, 12, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  safeText('PROPOSTA COMERCIAL', ML + 5, y + 8);

  // Proposal number and date (right side)
  pdf.setFontSize(10);
  safeText(`Nº ${config.numero || '001'}`, W - MR, y + 8, { align: 'right' });

  y += 16;

  // Info grid
  pdf.setFillColor(...LIGHT_GRAY);
  pdf.rect(ML, y, CW, 22, 'F');

  pdf.setFontSize(8);
  const infoCol1 = ML + 3;
  const infoCol2 = ML + 70;
  const infoCol3 = ML + 130;
  let infoY = y + 6;

  // Row 1
  pdf.setTextColor(...GRAY);
  pdf.setFont('helvetica', 'normal');
  safeText('Cliente:', infoCol1, infoY);
  pdf.setTextColor(...BLACK);
  pdf.setFont('helvetica', 'bold');
  safeText(config.cliente, infoCol1 + 20, infoY);

  pdf.setTextColor(...GRAY);
  pdf.setFont('helvetica', 'normal');
  safeText('Data:', infoCol2, infoY);
  pdf.setTextColor(...BLACK);
  pdf.setFont('helvetica', 'bold');
  safeText(formatDateBR(config.data || new Date()), infoCol2 + 20, infoY);

  pdf.setTextColor(...GRAY);
  pdf.setFont('helvetica', 'normal');
  safeText('Validade:', infoCol3, infoY);
  pdf.setTextColor(...BLACK);
  pdf.setFont('helvetica', 'bold');
  safeText(`${config.validadeDias || 10} dias`, infoCol3 + 22, infoY);

  infoY += 6;

  // Row 2
  pdf.setTextColor(...GRAY);
  pdf.setFont('helvetica', 'normal');
  safeText('Tel:', infoCol1, infoY);
  pdf.setTextColor(...BLACK);
  pdf.setFont('helvetica', 'normal');
  safeText(config.clienteTelefone || '-', infoCol1 + 10, infoY);

  pdf.setTextColor(...GRAY);
  pdf.setFont('helvetica', 'normal');
  safeText('E-mail:', infoCol2, infoY);
  pdf.setTextColor(...BLACK);
  pdf.setFont('helvetica', 'normal');
  safeText(config.clienteEmail || '-', infoCol2 + 20, infoY);

  infoY += 6;

  // Row 3
  pdf.setTextColor(...GRAY);
  pdf.setFont('helvetica', 'normal');
  safeText('Endereço:', infoCol1, infoY);
  pdf.setTextColor(...BLACK);
  pdf.setFont('helvetica', 'normal');
  safeText(
    `${config.clienteEndereco || '-'} ${config.clienteBairro || ''} ${config.clienteCidade || ''}`.trim(),
    infoCol1 + 22,
    infoY
  );

  pdf.setTextColor(...GRAY);
  pdf.setFont('helvetica', 'normal');
  safeText('Vendedor:', infoCol2, infoY);
  pdf.setTextColor(...BLACK);
  pdf.setFont('helvetica', 'normal');
  safeText(config.vendedor || '-', infoCol2 + 22, infoY);

  y += 28;

  // ==================== ITEMS TABLE ====================
  // Table header
  pdf.setFillColor(...primary);
  pdf.rect(ML, y, CW, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');

  const colWidths = [8, 55, 30, 25, 20, 22, 22]; // Seq, Desc, Local, Dims, Qtd, Vlr Unit, Total
  const cols = [ML + 1, ML + 10, ML + 65, ML + 95, ML + 120, ML + 140, ML + 160];

  safeText('SEQ', cols[0], y + 5);
  safeText('DESCRIÇÃO', cols[1], y + 5);
  safeText('LOCAL', cols[2], y + 5);
  safeText('DIMENSÕES', cols[3], y + 5);
  safeText('QTD', cols[4], y + 5);
  safeText('VLR UNIT', cols[5], y + 5);
  safeText('TOTAL', cols[6], y + 5);

  y += 10;

  let totalGeral = 0;

  // Items
  for (let i = 0; i < config.itens.length; i++) {
    const item = config.itens[i];
    const itemH = 20;

    // Check page break
    if (y + itemH > H - 80) {
      pdf.addPage();
      y = 20;
    }

    // Alternating row background
    if (i % 2 === 0) {
      pdf.setFillColor(...LIGHT_GRAY);
      pdf.rect(ML, y, CW, itemH, 'F');
    }

    pdf.setTextColor(...BLACK);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');

    // Seq
    safeText(`${i + 1}`, cols[0], y + 5);

    // Description (multi-line)
    const descLines = pdf.splitTextToSize(
      `${item.produto}${item.tratamento ? ` - ${item.tratamento}` : ''}${item.linha ? ` (${item.linha})` : ''}`,
      colWidths[1] - 5
    );
    safeText(descLines.slice(0, 2), cols[1], y + 5);

    // Local
    safeText(item.localizacao || '-', cols[2], y + 5);

    // Dimensions
    safeText(`${item.larguraCm * 10} x ${item.alturaCm * 10} mm`, cols[3], y + 5);

    // Qty
    safeText(`${item.quantidade}`, cols[4], y + 5);

    // Unit value
    safeText(formatBRL(item.valorUnitario), cols[5], y + 5);

    // Total
    pdf.setFont('helvetica', 'bold');
    safeText(formatBRL(item.valorTotal), cols[6], y + 5);

    totalGeral += item.valorTotal;
    y += itemH;
  }

  y += 5;

  // ==================== TOTALS ====================
  const totalsX = W - MR - 60;

  // Subtotal
  pdf.setTextColor(...GRAY);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  safeText('Subtotal:', totalsX, y);
  pdf.setTextColor(...BLACK);
  pdf.setFont('helvetica', 'bold');
  safeText(formatBRL(config.subtotal || totalGeral), W - MR, y, { align: 'right' });
  y += 6;

  // Discount
  if (config.desconto && config.desconto > 0) {
    pdf.setTextColor(...GRAY);
    pdf.setFont('helvetica', 'normal');
    safeText(`Desconto (${config.descontoPercent || 0}%):`, totalsX, y);
    pdf.setTextColor(...BLACK);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 128, 0); // Green for discount
    safeText(`-${formatBRL(config.desconto)}`, W - MR, y, { align: 'right' });
    y += 6;
  }

  // Total final (highlighted)
  pdf.setFillColor(...primary);
  pdf.rect(totalsX - 2, y - 4, 62, 10, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  safeText('TOTAL GERAL:', totalsX, y + 3);
  safeText(formatBRL(config.valorFinal), W - MR, y + 3, { align: 'right' });

  y += 15;

  // ==================== PAYMENT CONDITIONS ====================
  if (config.condicaoPagamento || config.formaPagamento) {
    pdf.setFillColor(...secondary);
    pdf.rect(ML, y, CW, 8, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    safeText('CONDIÇÕES DE PAGAMENTO', ML + 3, y + 5);
    y += 10;

    pdf.setTextColor(...BLACK);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');

    if (config.condicaoPagamento) {
      const condLines = pdf.splitTextToSize(config.condicaoPagamento, CW - 6);
      safeText(condLines, ML + 3, y);
      y += condLines.length * 4 + 3;
    }

    if (config.formaPagamento) {
      safeText(`Forma: ${config.formaPagamento}`, ML + 3, y);
      y += 8;
    }
  }

  // ==================== BANK INFO ====================
  if (branding.bankInfo) {
    pdf.setFillColor(...LIGHT_GRAY);
    pdf.rect(ML, y, CW, 18, 'F');
    pdf.setTextColor(...primary);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    safeText('DADOS BANCÁRIOS', ML + 3, y + 5);

    pdf.setTextColor(...BLACK);
    pdf.setFont('helvetica', 'normal');
    const { bank, agency, account, ccpj } = branding.bankInfo;
    safeText(
      `Banco: ${bank}  |  Agência: ${agency}  |  Conta: ${account}${ccpj ? `  |  CNPJ: ${ccpj}` : ''}`,
      ML + 3,
      y + 11
    );
    y += 20;
  }

  // ==================== OBSERVATIONS ====================
  if (config.observacoes) {
    pdf.setTextColor(...primary);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    safeText('OBSERVAÇÕES', ML, y);
    y += 6;

    pdf.setTextColor(...BLACK);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    const obsLines = pdf.splitTextToSize(config.observacoes, CW - 2);
    safeText(obsLines, ML + 1, y);
    y += obsLines.length * 4 + 5;
  }

  // ==================== CONTRACT TERMS (if enabled) ====================
  if (config.includeContractTerms && branding.contractTerms) {
    // Check if we need a new page
    if (y > H - 100) {
      pdf.addPage();
      y = 20;
    }

    pdf.setFillColor(...primary);
    pdf.rect(ML, y, CW, 8, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    safeText('TERMOS E CONDIÇÕES', ML + 3, y + 5);
    y += 10;

    pdf.setTextColor(...BLACK);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    const termLines = pdf.splitTextToSize(branding.contractTerms, CW - 4);
    safeText(termLines, ML + 2, y);
    y += termLines.length * 3.5 + 5;
  }

  // Warranty terms
  if (config.includeWarrantyTerms && branding.warrantyTerms) {
    if (y > H - 80) {
      pdf.addPage();
      y = 20;
    }

    pdf.setFillColor(...primary);
    pdf.rect(ML, y, CW, 8, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    safeText('GARANTIA', ML + 3, y + 5);
    y += 10;

    pdf.setTextColor(...BLACK);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    const warLines = pdf.splitTextToSize(branding.warrantyTerms, CW - 4);
    safeText(warLines, ML + 2, y);
    y += warLines.length * 3.5 + 5;
  }

  // ==================== SIGNATURE ====================
  y = Math.max(y, H - 50);

  pdf.setDrawColor(...GRAY);
  pdf.setLineWidth(0.3);
  pdf.line(ML, y, ML + 70, y);
  pdf.line(W - MR - 70, y, W - MR, y);

  y += 4;
  pdf.setTextColor(...GRAY);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  safeText('Assinatura do Cliente', ML, y);
  safeText('Assinatura da Empresa', W - MR - 70, y, { align: 'center' });
  safeText(`${branding.companyName}`, W - MR, y, { align: 'right' });

  // ==================== FOOTER ====================
  const footerY = H - 6;
  pdf.setFillColor(...primary);
  pdf.rect(0, footerY, W, 6, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'normal');

  const footerText = `${branding.companyName}`;
  safeText(footerText, ML, footerY + 4);

  if (branding.address) {
    safeText(
      `${branding.address} ${branding.city ? `, ${branding.city}` : ''} ${branding.cep ? `CEP ${formatCep(branding.cep)}` : ''}`,
      W / 2,
      footerY + 4,
      { align: 'center' }
    );
  }

  safeText(`Página 1`, W - MR, footerY + 4, { align: 'right' });

  // Save
  const safeName = config.cliente.replace(/\s+/g, '-').toLowerCase();
  const numSuffix = config.numero ? `-${config.numero}` : '';
  pdf.save(`proposta-${safeName}${numSuffix}.pdf`);
}
