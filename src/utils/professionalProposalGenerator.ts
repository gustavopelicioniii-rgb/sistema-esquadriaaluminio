import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface ProposalItem {
  id?: string;
  codigo?: string;
  nome: string;
  linha?: string;
  tratamento?: string;
  localizacao?: string;
  larguraMm?: number;
  alturaMm?: number;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  descricaoCompleta?: string;
  imagemUrl?: string;
  specs?: string;
}

interface ProposalConfig {
  empresa?: {
    nome: string;
    telefone?: string;
    email?: string;
    endereco?: string;
    cnpj?: string;
    logoUrl?: string;
  };
  cliente?: {
    nome: string;
    telefone?: string;
    email?: string;
    endereco?: string;
    cidade?: string;
    bairro?: string;
  };
  vendedor?: string;
  obra?: string;
  tratamento?: string;
  validadeDias?: number;
  prazo?: string;
  itens: ProposalItem[];
  observacoes?: string;
  condicoesPagamento?: string;
  dataEmissao?: Date;
}

const formatBRL = (v: number) => {
  const num = typeof v === 'number' && !isNaN(v) ? v : 0;
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDateBR = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear());
  return `${dd}/${mm}/${yy}`;
};

const formatDateTimeBR = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear());
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${dd}.${mm}.${yy}  ${hh}:${mi} pm`;
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

export async function generateProfessionalProposalPDF(config: ProposalConfig): Promise<jsPDF> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const W = 210;
  const H = 297;
  const ML = 10;
  const MR = 10;
  const CW = W - ML - MR;
  let y = 0;

  // Colors - Professional dark theme
  const BLACK = [0, 0, 0] as const;
  const WHITE = [255, 255, 255] as const;
  const DARK_GRAY = [40, 40, 40] as const;
  const MID_GRAY = [80, 80, 80] as const;
  const LIGHT_GRAY = [200, 200, 200] as const;
  const ACCENT = [0, 100, 180] as const; // Professional blue
  const HEADER_BG = [35, 35, 35] as const;
  const SECTION_BG = [25, 25, 25] as const;
  const INFO_BG = [245, 245, 245] as const;

  const safeText = (
    text: string | string[] | null | undefined,
    x: number,
    yPos: number,
    options?: Record<string, unknown>
  ) => {
    let str: string | string[];
    if (Array.isArray(text)) {
      str = text.map(t => (t == null ? '' : String(t)));
    } else {
      str = text == null ? '' : String(text);
    }
    if (options) pdf.text(str, x, yPos, options);
    else pdf.text(str, x, yPos);
  };

  const dataEmissao = config.dataEmissao || new Date();

  // ═══════════════════════════════════════════
  // HEADER
  // ═══════════════════════════════════════════

  // Header background
  pdf.setFillColor(...HEADER_BG);
  pdf.rect(0, 0, W, 35, 'F');

  // Logo area (left)
  let logoEndX = ML;
  if (config.empresa?.logoUrl) {
    const logoData = await loadImage(config.empresa.logoUrl);
    if (logoData) {
      pdf.addImage(logoData, 'PNG', ML, 6, 45, 18);
      logoEndX = ML + 48;
    }
  }

  // Company name
  if (!config.empresa?.logoUrl || logoEndX === ML) {
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...WHITE);
    safeText(config.empresa?.nome || 'EMPRESA', ML, 18);
  }

  // "Proposta de Orçamento" title box (right)
  const titleBoxW = 75;
  const titleBoxX = W - MR - titleBoxW;
  pdf.setFillColor(...ACCENT);
  pdf.rect(titleBoxX, 5, titleBoxW, 22, 'F');

  pdf.setTextColor(...WHITE);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  safeText('Proposta de Orçamento', titleBoxX + titleBoxW / 2, 14, { align: 'center' });

  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  safeText(`Emitido por: ${config.vendedor || 'ADMIN'}`, titleBoxX + titleBoxW / 2, 20, {
    align: 'center',
  });
  safeText(formatDateTimeBR(dataEmissao), titleBoxX + titleBoxW / 2, 24, { align: 'center' });

  // ═══════════════════════════════════════════
  // CLIENT & PROJECT INFO
  // ═══════════════════════════════════════════
  y = 42;

  // Left column - Client info
  const leftW = CW * 0.55;
  const rightW = CW * 0.45;

  // Client data box
  pdf.setFillColor(...INFO_BG);
  pdf.roundedRect(ML, y, leftW, 45, 2, 2, 'F');

  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...MID_GRAY);
  safeText('DADOS DO CLIENTE', ML + 3, y + 5);

  pdf.setDrawColor(...LIGHT_GRAY);
  pdf.setLineWidth(0.3);
  pdf.line(ML + 3, y + 7, ML + leftW - 3, y + 7);

  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...DARK_GRAY);
  pdf.setFontSize(8);

  const clientY = y + 13;
  safeText(`Cliente:`, ML + 3, clientY);
  pdf.setFont('helvetica', 'bold');
  safeText(config.cliente?.nome || '-', ML + 20, clientY);

  pdf.setFont('helvetica', 'normal');
  safeText(`Tel.:`, ML + 3, clientY + 6);
  pdf.setFont('helvetica', 'bold');
  safeText(config.cliente?.telefone || '-', ML + 14, clientY + 6);

  pdf.setFont('helvetica', 'normal');
  safeText(`Código:`, ML + 3, clientY + 12);
  pdf.setFont('helvetica', 'bold');
  safeText(config.cliente?.email || '-', ML + 16, clientY + 12);

  // Right column - Project info
  pdf.setFillColor(...INFO_BG);
  pdf.roundedRect(ML + leftW + 5, y, rightW - 5, 45, 2, 2, 'F');

  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...MID_GRAY);
  safeText('DADOS DO PROJETO', ML + leftW + 8, y + 5);

  pdf.setDrawColor(...LIGHT_GRAY);
  pdf.line(ML + leftW + 8, y + 7, ML + CW - 3, y + 7);

  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...DARK_GRAY);
  pdf.setFontSize(8);

  const projY = y + 13;
  safeText(`Obra:`, ML + leftW + 8, projY);
  pdf.setFont('helvetica', 'bold');
  safeText(config.obra || '-', ML + leftW + 20, projY);

  pdf.setFont('helvetica', 'normal');
  safeText(`Cidade:`, ML + leftW + 8, projY + 6);
  pdf.setFont('helvetica', 'bold');
  safeText(`${config.cliente?.cidade || '-'}`, ML + leftW + 25, projY + 6);

  pdf.setFont('helvetica', 'normal');
  safeText(`Tratamento:`, ML + leftW + 8, projY + 12);
  pdf.setFont('helvetica', 'bold');
  safeText(config.tratamento || '-', ML + leftW + 30, projY + 12);

  // ═══════════════════════════════════════════
  // INFORMATION BAR
  // ═══════════════════════════════════════════
  y += 52;

  pdf.setFillColor(...SECTION_BG);
  pdf.roundedRect(ML, y, CW, 12, 2, 2, 'F');

  pdf.setTextColor(...WHITE);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');

  const infoY = y + 8;
  const infoItems = [
    { label: 'PRAZO EXECUÇÃO:', value: config.prazo || 'A COMBINAR' },
    { label: 'VALIDADE:', value: `${config.validadeDias || 5} DIAS` },
    { label: 'AJUSTE PREÇO:', value: `${config.validadeDias || 5} DIAS` },
    { label: 'INÍCIO:', value: formatDateBR(dataEmissao) },
  ];

  let infoX = ML + 5;
  infoItems.forEach((item, i) => {
    safeText(item.label, infoX, infoY);
    pdf.setFont('helvetica', 'normal');
    safeText(item.value, infoX + 30, infoY);
    pdf.setFont('helvetica', 'bold');
    infoX += 50;
  });

  // ═══════════════════════════════════════════
  // ITEMS TABLE HEADER
  // ═══════════════════════════════════════════
  y += 18;

  pdf.setFillColor(...HEADER_BG);
  pdf.rect(ML, y, CW, 8, 'F');

  pdf.setTextColor(...WHITE);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');

  const colELEV = ML + 5;
  const colDESC = ML + 55;
  const colLINE = ML + 110;
  const colDIM = ML + 135;
  const colQTD = ML + 155;
  const colVLR = ML + 168;
  const colTOTAL = ML + 185;

  safeText('ELEVAÇÃO', colELEV, y + 5);
  safeText('DESCRIÇÃO', colDESC, y + 5);
  safeText('LINHA', colLINE, y + 5);
  safeText('L x A', colDIM, y + 5);
  safeText('QTD', colQTD, y + 5);
  safeText('VLR UNIT', colVLR, y + 5);
  safeText('TOTAL', colTOTAL, y + 5);

  y += 8;

  // ═══════════════════════════════════════════
  // ITEMS
  // ═══════════════════════════════════════════
  let totalGeral = 0;

  for (let idx = 0; idx < config.itens.length; idx++) {
    const item = config.itens[idx];
    const itemH = 55;

    // Check if need new page
    if (y + itemH > H - 40) {
      pdf.addPage();
      y = 15;
    }

    // Separator line
    pdf.setDrawColor(...LIGHT_GRAY);
    pdf.setLineWidth(0.2);
    pdf.line(ML, y, W - MR, y);
    y += 2;

    // ══ ELEVATION COLUMN (left) ══
    const elevW = 45;
    const elevH = 45;

    // Load and draw item image
    if (item.imagemUrl) {
      const imgData = await loadImage(item.imagemUrl);
      if (imgData) {
        const imgAspect = 1.33; // typical window aspect
        const maxW = elevW - 6;
        const maxH = elevH - 6;
        let imgW = maxW;
        let imgH = imgW / imgAspect;
        if (imgH > maxH) {
          imgH = maxH;
          imgW = imgH * imgAspect;
        }
        const imgX = ML + (elevW - imgW) / 2;
        const imgY = y + (elevH - imgH) / 2;
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgW, imgH);
      }
    } else {
      // Draw placeholder frame
      const frameW = 30;
      const frameH = 35;
      const frameX = ML + (elevW - frameW) / 2;
      const frameY = y + (elevH - frameH) / 2;
      pdf.setDrawColor(150, 150, 150);
      pdf.setLineWidth(0.5);
      pdf.rect(frameX, frameY, frameW, frameH);
      // Dividers
      pdf.setLineWidth(0.2);
      pdf.line(frameX + frameW / 2, frameY, frameX + frameW / 2, frameY + frameH);
      pdf.line(frameX, frameY + frameH / 2, frameX + frameW, frameY + frameH / 2);
    }

    // Item code below image
    pdf.setFontSize(6);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...MID_GRAY);
    safeText(item.codigo || `ITEM ${idx + 1}`, ML + elevW / 2, y + elevH + 4, { align: 'center' });

    // ══ DESCRIPTION COLUMN ══
    let descY = y + 5;
    pdf.setFontSize(8);
    pdf.setTextColor(...DARK_GRAY);

    // Item name
    pdf.setFont('helvetica', 'bold');
    safeText(item.nome, colDESC, descY);

    // Location
    descY += 5;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(...MID_GRAY);
    safeText(`Local: ${item.localizacao || '-'}`, colDESC, descY);

    // Treatment
    descY += 4;
    safeText(`Trat: ${item.tratamento || '-'}`, colDESC, descY);

    // Description specs
    descY += 6;
    pdf.setFontSize(6);
    pdf.setTextColor(...MID_GRAY);
    if (item.descricaoCompleta) {
      const specLines = pdf.splitTextToSize(item.descricaoCompleta.toUpperCase(), 60);
      safeText(specLines.slice(0, 4), colDESC, descY);
    }

    // ══ LINE COLUMN ══
    pdf.setFontSize(7);
    pdf.setTextColor(...DARK_GRAY);
    pdf.setFont('helvetica', 'normal');
    safeText(item.linha || '-', colLINE, y + 15);

    // ══ DIMENSIONS COLUMN ══
    const dimText = `${(item.larguraMm || 0) / 10} x ${(item.alturaMm || 0) / 10}`;
    safeText(dimText, colDIM, y + 15);

    // ══ QUANTITY COLUMN ══
    safeText(`${item.quantidade}`, colQTD, y + 15);

    // ══ UNIT VALUE COLUMN ══
    pdf.setFontSize(7);
    safeText(formatBRL(item.valorUnitario), colVLR, y + 15);

    // ══ TOTAL VALUE COLUMN ══
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(...ACCENT);
    safeText(formatBRL(item.valorTotal), colTOTAL, y + 15);

    totalGeral += item.valorTotal;
    y += itemH;
  }

  // ═══════════════════════════════════════════
  // TOTALS
  // ═══════════════════════════════════════════
  y += 5;
  pdf.setDrawColor(...LIGHT_GRAY);
  pdf.setLineWidth(0.5);
  pdf.line(ML, y, W - MR, y);
  y += 5;

  // Total geral
  pdf.setFillColor(...INFO_BG);
  pdf.roundedRect(ML + 120, y, CW - 120, 12, 2, 2, 'F');

  pdf.setTextColor(...DARK_GRAY);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  safeText('TOTAL GERAL:', ML + 125, y + 8);

  pdf.setTextColor(...ACCENT);
  pdf.setFontSize(12);
  safeText(formatBRL(totalGeral), ML + 160, y + 8, { align: 'right' });

  // ═══════════════════════════════════════════
  // OBSERVATIONS
  // ═══════════════════════════════════════════
  if (config.observacoes) {
    y += 18;
    pdf.setFillColor(...INFO_BG);
    pdf.roundedRect(ML, y, CW, 20, 2, 2, 'F');

    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...DARK_GRAY);
    safeText('OBSERVAÇÕES:', ML + 3, y + 6);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.5);
    const obsLines = pdf.splitTextToSize(config.observacoes, CW - 10);
    safeText(obsLines.slice(0, 3), ML + 3, y + 12);
    y += 20;
  }

  // ═══════════════════════════════════════════
  // FOOTER
  // ═══════════════════════════════════════════
  pdf.setFillColor(...HEADER_BG);
  pdf.rect(0, H - 18, W, 18, 'F');

  pdf.setTextColor(...WHITE);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');

  const footerY = H - 12;
  safeText(config.empresa?.nome?.toUpperCase() || 'EMPRESA', ML, footerY);

  pdf.setTextColor(...LIGHT_GRAY);
  safeText(
    `${config.empresa?.endereco || ''} ${config.empresa?.telefone || ''}`.trim(),
    ML,
    footerY + 5
  );

  // Page number
  const pageNum = `1 / ${pdf.getNumberOfPages()}`;
  safeText(pageNum, W / 2, footerY, { align: 'center' });

  // Software credit
  pdf.setTextColor(...LIGHT_GRAY);
  pdf.setFontSize(6);
  safeText('Sistema AluFlow - GESTÃO INTELIGENTE', W - MR, footerY, { align: 'right' });

  return pdf;
}

export default generateProfessionalProposalPDF;
