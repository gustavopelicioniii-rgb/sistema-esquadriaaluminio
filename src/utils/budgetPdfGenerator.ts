import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface BudgetItem {
  descricao: string;
  dimensoes: string;
  quantidade: number;
  area: string;
  valorUnitario: string;
  valorTotal: string;
}

interface EmpresaData {
  nome: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  cnpj?: string;
  fax?: string;
  logoUrl?: string;
}

interface BudgetPdfConfig {
  numero?: string;
  cliente: string;
  clienteTelefone?: string;
  clienteEmail?: string;
  clienteEndereco?: string;
  produto: string;
  larguraCm: number;
  alturaCm: number;
  quantidade: number;
  areaM2: number;
  custoTotal: number;
  margem: number;
  valorFinal: number;
  corAluminio?: string;
  corFerragem?: string;
  tipoVidro?: string;
  ambiente?: string;
  observacoes?: string;
  empresa?: EmpresaData;
  condicoesComerciais?: string[];
  validadeDias?: number;
  vendedor?: string;
  obra?: string;
  bairro?: string;
  cidade?: string;
  tratamento?: string;
  linha?: string;
  tipo?: string;
  servicosExtras?: { descricao: string; valor: number }[];
  condicaoPagamento?: string;
  formaPagamento?: string;
  responsavel?: string;

  /** Multiple items support */
  itensMultiplos?: Array<{
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
  }>;
}

const formatBRL = (v: number) => {
  const num = typeof v === "number" && !isNaN(v) ? v : 0;
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const formatDateBR = () => {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear());
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${dd}.${mm}.${yy}  ${hh}:${mi} hrs`;
};

async function loadImage(url: string): Promise<string | null> {
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}

export async function generateProfessionalBudgetPDF(
  config: BudgetPdfConfig,
  svgElementId?: string
) {
  const pdf = new jsPDF("p", "mm", "a4");
  const W = 210;
  const H = 297;
  const ML = 8; // left margin
  const MR = 8; // right margin
  const CW = W - ML - MR;
  let y = 0;

  const safeText = (text: any, x: number, yPos: number, options?: any) => {
    let str: string | string[];
    if (Array.isArray(text)) {
      str = text.map((t: any) => (t == null ? "" : String(t)));
    } else {
      str = text == null ? "" : String(text);
    }
    if (options) pdf.text(str, x, yPos, options);
    else pdf.text(str, x, yPos);
  };

  // Colors
  const BLACK = [0, 0, 0] as const;
  const DARK_GRAY = [50, 50, 50] as const;
  const MID_GRAY = [100, 100, 100] as const;
  const LIGHT_GRAY = [180, 180, 180] as const;
  const HEADER_BG = [60, 60, 60] as const;
  const SECTION_BG = [35, 35, 35] as const;

  // ─── HEADER ───
  // Logo area (left)
  let logoEndX = ML;
  if (config.empresa?.logoUrl) {
    const logoData = await loadImage(config.empresa.logoUrl);
    if (logoData) {
      pdf.addImage(logoData, "PNG", ML, 5, 40, 15);
      logoEndX = ML + 42;
    }
  }
  if (!config.empresa?.logoUrl || logoEndX === ML) {
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...BLACK);
    safeText(config.empresa?.nome || "EMPRESA", ML, 15);
    logoEndX = ML + 45;
  }

  // Title box (right) - dark background
  const titleBoxW = 70;
  const titleBoxX = W - MR - titleBoxW;
  pdf.setFillColor(...HEADER_BG);
  pdf.rect(titleBoxX, 3, titleBoxW, 16, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  safeText("Proposta de Orçamento", titleBoxX + 4, 13);

  // Emitido por + data
  y = 24;
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...MID_GRAY);
  safeText(`Emitido por:`, titleBoxX, y);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...BLACK);
  safeText(config.vendedor || "ADMINISTRADOR", titleBoxX + 22, y);
  safeText(formatDateBR(), W - MR, y, { align: "right" });

  y = 30;
  // Separator line
  pdf.setDrawColor(...LIGHT_GRAY);
  pdf.setLineWidth(0.3);
  pdf.line(ML, y, W - MR, y);
  y += 3;

  // ─── CLIENT / VENDOR INFO ───
  const leftColX = ML;
  const rightColX = W / 2 + 5;
  const labelW = 22;

  pdf.setFontSize(7);

  const drawInfoRow = (label: string, value: string, x: number, rowY: number, labelWidth = labelW) => {
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...MID_GRAY);
    safeText(`${label}:`, x, rowY);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...DARK_GRAY);
    safeText(value || "-", x + labelWidth, rowY);
  };

  // Left column
  drawInfoRow("Cliente", config.cliente, leftColX, y);
  drawInfoRow("Vendedor", config.vendedor || "-", rightColX, y);
  y += 4;
  drawInfoRow("Tel.", config.clienteTelefone || "-", leftColX, y);
  drawInfoRow("Fax", config.empresa?.fax || "-", rightColX, y, 14);
  y += 4;
  drawInfoRow("Código", config.empresa?.cnpj || "-", leftColX, y);
  drawInfoRow("E-mail", config.empresa?.email || config.clienteEmail || "-", rightColX, y, 14);
  y += 4;
  drawInfoRow("End. física", config.clienteEndereco || "-", leftColX, y, 22);
  drawInfoRow("Obra", config.obra || "-", rightColX, y, 14);
  y += 4;
  drawInfoRow("Bairro", config.bairro || "-", rightColX, y, 14);
  drawInfoRow("Trat.", config.tratamento || config.corAluminio || "-", leftColX, y, 12);
  y += 4;
  drawInfoRow("Cidade", config.cidade || "-", rightColX, y, 14);
  y += 3;

  // ─── ELEVAÇÃO / DESCRIÇÃO HEADER ───
  pdf.setFillColor(...SECTION_BG);
  pdf.rect(ML, y, CW, 7, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  safeText("ELEVAÇÃO", ML + 20, y + 5);
  safeText("DESCRIÇÃO", W / 2 + 10, y + 5);
  y += 9;

  // ─── ITEMS ───
  // Build items array from config
  const items = config.itensMultiplos && config.itensMultiplos.length > 0
    ? config.itensMultiplos
    : [{
        produto: config.produto,
        tipo: config.tipo || "-",
        linha: config.linha || "-",
        tratamento: config.tratamento || config.corAluminio || "-",
        larguraCm: config.larguraCm,
        alturaCm: config.alturaCm,
        quantidade: config.quantidade,
        valorUnitario: config.valorFinal / (config.quantidade || 1),
        valorTotal: config.valorFinal,
        localizacao: config.ambiente || "-",
        descricaoCompleta: config.produto,
        svgDataUrl: undefined as string | undefined,
      }];

  // Try to capture the SVG preview if available
  if (svgElementId && items.length === 1 && !items[0].svgDataUrl) {
    const svgElement = document.getElementById(svgElementId);
    if (svgElement) {
      try {
        const canvas = await html2canvas(svgElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        });
        items[0].svgDataUrl = canvas.toDataURL("image/png");
      } catch {
        // skip
      }
    }
  }

  const elevationW = (CW / 2) - 5;
  const descriptionX = ML + elevationW + 10;
  const descriptionW = CW - elevationW - 10;

  let totalGeral = 0;

  for (let idx = 0; idx < items.length; idx++) {
    const item = items[idx];
    const itemStartY = y;

    // Check if we need a new page
    if (y + 65 > H - 50) {
      pdf.addPage();
      y = 10;
    }

    // Light separator line at top of item
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.2);
    pdf.line(ML, y, W - MR, y);
    y += 2;

    // ─ ELEVATION (Left side) ─
    const elevBoxY = y;
    const elevBoxH = 50;

    // Draw frame placeholder or SVG
    if (item.svgDataUrl) {
      const imgAspect = 1;
      const maxW = elevationW - 10;
      const maxH = elevBoxH - 6;
      const imgW = Math.min(maxW, maxH * imgAspect);
      const imgH = imgW / imgAspect;
      const imgX = ML + (elevationW - imgW) / 2;
      pdf.addImage(item.svgDataUrl, "PNG", imgX, elevBoxY + 3, imgW, imgH);
    } else {
      // Draw a simple placeholder frame
      const frameW = 35;
      const frameH = 40;
      const frameX = ML + (elevationW - frameW) / 2;
      const frameY = elevBoxY + 5;
      pdf.setDrawColor(150, 150, 150);
      pdf.setLineWidth(0.5);
      pdf.rect(frameX, frameY, frameW, frameH);
      // Cross lines to indicate window
      pdf.setLineWidth(0.2);
      pdf.line(frameX + frameW / 2, frameY, frameX + frameW / 2, frameY + frameH);
      pdf.line(frameX, frameY + frameH / 2, frameX + frameW, frameY + frameH / 2);
    }

    // ─ DESCRIPTION (Right side) ─
    let dy = elevBoxY;

    // Item number + Treatment
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...BLACK);
    safeText(`Item:`, descriptionX, dy + 3);
    pdf.setFont("helvetica", "normal");
    safeText(`${idx + 1}`, descriptionX + 12, dy + 3);

    pdf.setFont("helvetica", "bold");
    safeText(`Tratamento:`, descriptionX + 50, dy + 3);
    pdf.setFont("helvetica", "normal");
    safeText(item.tratamento || config.corAluminio || "-", descriptionX + 75, dy + 3);
    dy += 5;

    // Type + Line
    pdf.setFont("helvetica", "bold");
    safeText(`Tipo:`, descriptionX, dy + 3);
    pdf.setFont("helvetica", "normal");
    safeText(item.tipo || "-", descriptionX + 12, dy + 3);

    pdf.setFont("helvetica", "bold");
    safeText(`Linha:`, descriptionX + 50, dy + 3);
    pdf.setFont("helvetica", "normal");
    safeText(item.linha || "-", descriptionX + 65, dy + 3);
    dy += 5;

    // Location
    pdf.setFont("helvetica", "bold");
    safeText(`Localização:`, descriptionX, dy + 3);
    pdf.setFont("helvetica", "normal");
    safeText(item.localizacao || "-", descriptionX + 25, dy + 3);
    dy += 6;

    // L / H / Qty row
    pdf.setFont("helvetica", "bold");
    safeText(`L:`, descriptionX, dy + 3);
    pdf.setFont("helvetica", "normal");
    safeText(`${item.larguraCm * 10}`, descriptionX + 7, dy + 3);

    pdf.setFont("helvetica", "bold");
    safeText(`H:`, descriptionX + 30, dy + 3);
    pdf.setFont("helvetica", "normal");
    safeText(`${item.alturaCm * 10}`, descriptionX + 37, dy + 3);

    pdf.setFont("helvetica", "bold");
    safeText(`Qtd:`, descriptionX + 60, dy + 3);
    pdf.setFont("helvetica", "normal");
    safeText(`${item.quantidade}`, descriptionX + 72, dy + 3);
    dy += 6;

    // Valor unitário / Valor total
    pdf.setFont("helvetica", "bold");
    safeText(`Valor unit.:`, descriptionX, dy + 3);
    pdf.setFont("helvetica", "normal");
    safeText(formatBRL(item.valorUnitario), descriptionX + 25, dy + 3);

    pdf.setFont("helvetica", "bold");
    safeText(`Valor total:`, descriptionX + 60, dy + 3);
    pdf.setFont("helvetica", "normal");
    safeText(formatBRL(item.valorTotal), descriptionX + 82, dy + 3);
    dy += 6;

    // Description text
    pdf.setFontSize(6.5);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...MID_GRAY);
    const descText = item.descricaoCompleta || item.produto || "-";
    const descLines = pdf.splitTextToSize(descText.toUpperCase(), descriptionW);
    safeText(descLines, descriptionX, dy + 3);

    totalGeral += item.valorTotal;
    y = Math.max(elevBoxY + elevBoxH + 2, dy + 8);
  }

  // ─── OBSERVAÇÃO ───
  y += 2;
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...BLACK);
  safeText("Observação:", ML, y);
  y += 4;
  if (config.observacoes) {
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...DARK_GRAY);
    pdf.setFontSize(7);
    const obsLines = pdf.splitTextToSize(config.observacoes, CW - 4);
    safeText(obsLines, ML + 2, y);
    y += obsLines.length * 3.5 + 2;
  }
  y += 2;

  // ─── SERVIÇOS EXTRAS ───
  pdf.setFillColor(...SECTION_BG);
  pdf.rect(ML, y, CW, 7, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  safeText("SERVIÇOS EXTRAS", ML + 4, y + 5);
  y += 9;

  const extras = config.servicosExtras || [];
  let totalExtras = 0;

  if (extras.length > 0) {
    for (const extra of extras) {
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(...BLACK);
      safeText(extra.descricao, ML + 2, y + 3);
      safeText(formatBRL(extra.valor), W - MR, y + 3, { align: "right" });
      totalExtras += extra.valor;
      y += 5;
    }
  } else {
    // Empty row placeholder
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...MID_GRAY);
    safeText("-", ML + 2, y + 3);
    y += 5;
  }

  // Extras total row
  pdf.setDrawColor(200, 200, 200);
  pdf.line(ML, y, W - MR, y);
  y += 1;
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...BLACK);
  safeText("R$", W - MR - 30, y + 4);
  safeText(formatBRL(totalExtras), W - MR, y + 4, { align: "right" });
  y += 8;

  // ─── PAYMENT CONDITIONS FOOTER ───
  // Separator
  pdf.setDrawColor(150, 150, 150);
  pdf.setLineWidth(0.3);
  pdf.line(ML, y, W - MR, y);
  y += 2;

  // Table with 4 columns: Condições | Forma | Total | Total + Extras
  const colW = CW / 4;
  const footHeaders = ["Condições de pagamento", "Forma de pagamento", "Total", "Total + Extras"];
  const totalComExtras = totalGeral + totalExtras;

  // Header row
  pdf.setFillColor(240, 240, 240);
  pdf.rect(ML, y, CW, 6, "F");
  pdf.setFontSize(6.5);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...DARK_GRAY);
  footHeaders.forEach((h, i) => {
    safeText(h, ML + colW * i + 2, y + 4);
  });
  y += 7;

  // Values row
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(...BLACK);
  safeText(config.condicaoPagamento || "À vista / 30 dias", ML + 2, y + 3);
  safeText(config.formaPagamento || "Boleto", ML + colW + 2, y + 3);
  safeText(formatBRL(totalGeral), ML + colW * 2 + 2, y + 3);
  pdf.setFont("helvetica", "bold");
  safeText(formatBRL(totalComExtras), ML + colW * 3 + 2, y + 3);
  y += 8;

  // ─── SIGNATURE & FOOTER ───
  // Separator
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.2);
  pdf.line(ML, y, W - MR, y);
  y += 6;

  // Responsible name
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...BLACK);
  safeText(config.responsavel || config.vendedor || config.empresa?.nome || "", ML, y);
  y += 8;

  // Page number
  const footY = H - 8;
  pdf.setFillColor(240, 240, 240);
  pdf.rect(0, footY - 5, W, 15, "F");
  pdf.setDrawColor(200, 200, 200);
  pdf.line(ML, footY - 5, W - MR, footY - 5);

  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...MID_GRAY);
  const totalPages = (pdf as any).internal.getNumberOfPages();
  safeText(`${totalPages} / ${totalPages}`, W - MR, footY, { align: "right" });

  // System credit
  pdf.setFontSize(6);
  pdf.setTextColor(...LIGHT_GRAY);
  safeText("Sistema AluFlow - Alumínio® Sistemas", W / 2, footY, { align: "center" });

  // Save
  const safeName = (config.cliente || "novo").replace(/\s+/g, "-").toLowerCase();
  const numSuffix = config.numero ? `-${config.numero}` : "";
  pdf.save(`proposta-orcamento-${safeName}${numSuffix}.pdf`);
}
