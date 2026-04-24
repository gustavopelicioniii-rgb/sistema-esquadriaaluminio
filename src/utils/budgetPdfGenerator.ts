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
  const MT = 8; // top margin
  const CW = W - ML - MR;

  // Colors
  const BLACK = [0, 0, 0] as const;
  const DARK_GRAY = [60, 60, 60] as const;
  const MID_GRAY = [100, 100, 100] as const;
  const LIGHT_GRAY = [180, 180, 180] as const;
  const VERY_LIGHT_GRAY = [240, 240, 240] as const;
  const HEADER_DARK = [51, 51, 51] as const; // #333
  const SECTION_BG = [51, 51, 51] as const; // #333

  const safeText = (text: string | string[] | null | undefined, x: number, yPos: number, options?: Record<string, unknown>) => {
    let str: string | string[];
    if (Array.isArray(text)) {
      str = text.map((t) => (t == null ? "" : String(t)));
    } else {
      str = text == null ? "" : String(text);
    }
    if (options) pdf.text(str, x, yPos, options);
    else pdf.text(str, x, yPos);
  };

  let currentPage = 1;
  const totalPages = () => pdf.getNumberOfPages();

  // ─── PAGE FOOTER ───
  const drawFooter = (pageNum: number, totalPgs: number) => {
    const footerY = H - 6;
    pdf.setDrawColor(...LIGHT_GRAY);
    pdf.setLineWidth(0.3);
    pdf.line(ML, H - 12, W - MR, H - 12);

    // Left: company name
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...MID_GRAY);
    safeText(config.empresa?.nome || "ALUMÍNIO ESQUADRIAS DE ALUMÍNIO LTDA", ML, footerY);

    // Right: page number
    safeText(`${pageNum}/${totalPgs}`, W - MR, footerY, { align: "right" });

    // Bottom center: system credit
    pdf.setFontSize(6);
    pdf.setTextColor(...LIGHT_GRAY);
    safeText("Sistema AluFlow - Alumínio® Sistemas", W / 2, footerY, { align: "center" });
  };

  // ─── PAGE HEADER ───
  let y = MT;
  const HEADER_LOGO_AREA_W = 40;
  const HEADER_LOGO_AREA_H = 15;

  // Left: Logo area (40x15mm) + company name below
  if (config.empresa?.logoUrl) {
    const logoData = await loadImage(config.empresa.logoUrl);
    if (logoData) {
      pdf.addImage(logoData, "PNG", ML, y, HEADER_LOGO_AREA_W, HEADER_LOGO_AREA_H);
    }
  }
  // Company name below logo
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...BLACK);
  safeText(config.empresa?.nome || "ALUMÍNIO ESQUADRIAS DE ALUMÍNIO LTDA", ML, y + HEADER_LOGO_AREA_H + 4);

  // Center: "Proposta de Orçamento" in bold, large font
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...HEADER_DARK);
  safeText("Proposta de Orçamento", W / 2, y + 10, { align: "center" });

  // Right: "Emitido por: [VENDEDOR] - [TELEFONE]" on first line
  // "[DATA] [HORA] hrs" on second line
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...MID_GRAY);
  const rightInfoX = W - MR - 60;
  safeText("Emitido por:", rightInfoX, y + 5);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...BLACK);
  const vendedorTel = `${config.vendedor || "ADMINISTRADOR"} - ${config.empresa?.telefone || config.clienteTelefone || "-"}`;
  safeText(vendedorTel, rightInfoX + 22, y + 5);

  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...MID_GRAY);
  safeText(formatDateBR(), W - MR, y + 10, { align: "right" });

  y += HEADER_LOGO_AREA_H + 10;

  // ─── CLIENT/PROJECT INFO BOX (thin border, rounded corners) ───
  const infoBoxX = ML;
  const infoBoxW = CW;
  const infoBoxH = 42;

  // Draw rounded border box
  pdf.setDrawColor(...LIGHT_GRAY);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(infoBoxX, y, infoBoxW, infoBoxH, 2, 2, "S");

  // Two columns inside the box
  const leftColX = ML + 4;
  const rightColX = ML + infoBoxW / 2 + 4;
  const labelW = 18;
  const infoFontSize = 7;

  pdf.setFontSize(infoFontSize);

  const drawInfo = (label: string, value: string, x: number, rowY: number) => {
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...MID_GRAY);
    safeText(`${label}:`, x, rowY);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...BLACK);
    safeText(value || "-", x + labelW, rowY);
  };

  // Left column
  let iy = y + 6;
  drawInfo("Cliente", config.cliente, leftColX, iy);
  iy += 6;
  drawInfo("Tel.", config.clienteTelefone || "-", leftColX, iy);
  iy += 6;
  drawInfo("Código", config.empresa?.cnpj || "-", leftColX, iy);
  iy += 6;
  drawInfo("End. obra", config.clienteEndereco || "-", leftColX, iy);
  iy += 6;
  drawInfo("Cidade", config.cidade || "-", leftColX, iy);

  // Right column
  iy = y + 6;
  drawInfo("Vendedor", config.vendedor || "-", rightColX, iy);
  iy += 6;
  drawInfo("Fax", config.empresa?.fax || "-", rightColX, iy);
  iy += 6;
  drawInfo("Obra", config.obra || "-", rightColX, iy);
  iy += 6;
  drawInfo("Bairro", config.bairro || "-", rightColX, iy);
  iy += 6;
  drawInfo("Trat.", config.tratamento || config.corAluminio || "-", rightColX, iy);

  y += infoBoxH + 4;

  // ─── INFORMATIVO SECTION (thin border box) ───
  const infBoxH = 16;
  pdf.setDrawColor(...LIGHT_GRAY);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(infoBoxX, y, infoBoxW, infBoxH, 2, 2, "S");

  // Bold title "INFORMATIVO"
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...BLACK);
  safeText("INFORMATIVO", ML + 4, y + 5);

  // 4 fields in a row
  const infLabelW = 28;
  const infFieldStartX = ML + 40;
  const infFieldSpacing = (CW - 40) / 4;

  pdf.setFontSize(7);
  const infY = y + 5;

  const drawInfField = (label: string, value: string, x: number) => {
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...MID_GRAY);
    safeText(`${label}:`, x, infY);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...BLACK);
    safeText(value, x + infLabelW, infY);
  };

  drawInfField("Prazo de execução", "A COMBINAR", infFieldStartX);
  drawInfField("Validade", "5 DIAS DA DATA PARA INICIO", infFieldStartX + infFieldSpacing);
  drawInfField("Data para início", formatDateBR().split("  ")[0], infFieldStartX + infFieldSpacing * 2);
  drawInfField("Reajuste", "5 DIAS DA DATA PARA INICIO", infFieldStartX + infFieldSpacing * 3);

  y += infBoxH + 4;

  // ─── BUILD ITEMS ARRAY ───
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

  // ─── ELEVAÇÃO / DESCRIÇÃO HEADER ───
  pdf.setFillColor(...HEADER_DARK);
  pdf.rect(ML, y, CW, 7, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  safeText("ELEVAÇÃO", ML + 4, y + 5);
  safeText("DESCRIÇÃO", W / 2 + 4, y + 5);
  y += 9;

  // ─── ITEMS ───
  const elevationW = (CW / 2) - 6;
  const descriptionX = ML + elevationW + 8;
  const descriptionW = CW - elevationW - 8;

  let totalGeral = 0;
  let itemHeights: number[] = [];

  for (let idx = 0; idx < items.length; idx++) {
    const item = items[idx];
    const itemStartY = y;

    // Estimate item height for page break check
    const estimatedItemH = 62;

    // Check if we need a new page
    if (y + estimatedItemH > H - 30) {
      // Draw footer on current page before adding new page
      drawFooter(currentPage, totalPages());
      pdf.addPage();
      currentPage++;
      y = MT;

      // Redraw ELEVAÇÃO/DESCRIÇÃO header on new page
      pdf.setFillColor(...HEADER_DARK);
      pdf.rect(ML, y, CW, 7, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      safeText("ELEVAÇÃO", ML + 4, y + 5);
      safeText("DESCRIÇÃO", W / 2 + 4, y + 5);
      y += 9;
    }

    // Dashed separator line at top of item
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineDashPattern([2, 2], 0);
    pdf.setLineWidth(0.3);
    pdf.line(ML, y, W - MR, y);
    pdf.setLineDashPattern([], 0);
    y += 3;

    // ─ ELEVATION (Left side) ─
    const elevBoxY = y;
    const elevBoxH = 52;

    if (item.svgDataUrl) {
      const maxW = elevationW - 10;
      const maxH = elevBoxH - 6;
      // Try to get image dimensions from SVG if available
      const imgW = Math.min(maxW, maxH);
      const imgH = Math.min(maxH, maxW);
      const imgX = ML + (elevationW - imgW) / 2;
      const imgY = elevBoxY + (elevBoxH - imgH) / 2;
      pdf.addImage(item.svgDataUrl, "PNG", imgX, imgY, imgW, imgH);
    } else {
      // Draw a simple technical 2D line drawing (rectangle with frame lines)
      const frameW = 30;
      const frameH = 38;
      const frameX = ML + (elevationW - frameW) / 2;
      const frameY = elevBoxY + (elevBoxH - frameH) / 2;

      // Outer frame
      pdf.setDrawColor(80, 80, 80);
      pdf.setLineWidth(0.6);
      pdf.rect(frameX, frameY, frameW, frameH);

      // Inner cross lines (window pane effect)
      pdf.setLineWidth(0.3);
      pdf.line(frameX + frameW / 2, frameY, frameX + frameW / 2, frameY + frameH);
      pdf.line(frameX, frameY + frameH / 2, frameX + frameW, frameY + frameH / 2);

      // Small corner marks
      pdf.setLineWidth(0.2);
      const cm = 2;
      // Top-left
      pdf.line(frameX - cm, frameY, frameX, frameY);
      pdf.line(frameX, frameY - cm, frameX, frameY);
      // Top-right
      pdf.line(frameX + frameW, frameY, frameX + frameW + cm, frameY);
      pdf.line(frameX + frameW, frameY - cm, frameX + frameW, frameY);
      // Bottom-left
      pdf.line(frameX - cm, frameY + frameH, frameX, frameY + frameH);
      pdf.line(frameX, frameY + frameH, frameX, frameY + frameH + cm);
      // Bottom-right
      pdf.line(frameX + frameW, frameY + frameH, frameX + frameW + cm, frameY + frameH);
      pdf.line(frameX + frameW, frameY + frameH, frameX + frameW, frameY + frameH + cm);
    }

    // ─ DESCRIPTION (Right side) ─
    let dy = elevBoxY + 2;
    const descX = descriptionX;

    pdf.setFontSize(7);

    // Item + Tipo
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...BLACK);
    safeText("Item:", descX, dy);
    pdf.setFont("helvetica", "normal");
    safeText(`${idx + 1}`, descX + 10, dy);

    pdf.setFont("helvetica", "bold");
    safeText("Tipo:", descX + 28, dy);
    pdf.setFont("helvetica", "normal");
    safeText(item.tipo || "-", descX + 40, dy);
    dy += 5;

    // Local
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...BLACK);
    safeText("Local:", descX, dy);
    pdf.setFont("helvetica", "normal");
    safeText(item.localizacao || "-", descX + 12, dy);
    dy += 5;

    // L x H dimensions in mm
    const dimLarg = item.larguraCm * 10;
    const dimAlt = item.alturaCm * 10;
    pdf.setFont("helvetica", "bold");
    safeText("L:", descX, dy);
    pdf.setFont("helvetica", "normal");
    safeText(`${dimLarg}`, descX + 8, dy);
    pdf.setFont("helvetica", "bold");
    safeText("H:", descX + 28, dy);
    pdf.setFont("helvetica", "normal");
    safeText(`${dimAlt}`, descX + 36, dy);
    // Unit label after dimensions
    pdf.setFont("helvetica", "bold");
    safeText("mm", descX + 52, dy);
    dy += 5;

    // Unit. R$ + Qtd
    pdf.setFont("helvetica", "bold");
    safeText("Unit. R$:", descX, dy);
    pdf.setFont("helvetica", "normal");
    safeText(formatBRL(item.valorUnitario), descX + 18, dy);

    pdf.setFont("helvetica", "bold");
    safeText("Qtd:", descX + 58, dy);
    pdf.setFont("helvetica", "normal");
    safeText(`${item.quantidade}`, descX + 72, dy);
    dy += 5;

    // Total R$
    pdf.setFont("helvetica", "bold");
    safeText("Total R$:", descX, dy);
    pdf.setFont("helvetica", "normal");
    safeText(formatBRL(item.valorTotal), descX + 18, dy);
    dy += 5;

    // Tratamento
    pdf.setFont("helvetica", "bold");
    safeText("Tratamento:", descX, dy);
    pdf.setFont("helvetica", "normal");
    safeText(item.tratamento || config.corAluminio || "-", descX + 22, dy);
    dy += 5;

    // Linha
    pdf.setFont("helvetica", "bold");
    safeText("Linha:", descX, dy);
    pdf.setFont("helvetica", "normal");
    safeText(item.linha || "-", descX + 14, dy);

    totalGeral += item.valorTotal;
    const itemEndY = Math.max(elevBoxY + elevBoxH, dy + 2);
    itemHeights.push(itemEndY - y + 3);
    y = itemEndY + 3;
  }

  // Final dashed separator after items
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineDashPattern([2, 2], 0);
  pdf.setLineWidth(0.3);
  pdf.line(ML, y, W - MR, y);
  pdf.setLineDashPattern([], 0);
  y += 6;

  // ─── OBSERVAÇÃO ───
  if (config.observacoes) {
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...BLACK);
    safeText("Observação:", ML, y);
    y += 4;
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...DARK_GRAY);
    const obsLines = pdf.splitTextToSize(config.observacoes, CW - 4);
    safeText(obsLines, ML + 2, y);
    y += obsLines.length * 3.5 + 2;
  }

  // ─── SERVIÇOS EXTRAS ───
  if (config.servicosExtras && config.servicosExtras.length > 0) {
    // Header
    pdf.setFillColor(...SECTION_BG);
    pdf.rect(ML, y, CW, 7, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    safeText("SERVIÇOS EXTRAS", ML + 4, y + 5);
    y += 9;

    let totalExtras = 0;
    for (const extra of config.servicosExtras) {
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(...BLACK);
      safeText(extra.descricao, ML + 2, y);
      safeText(formatBRL(extra.valor), W - MR, y, { align: "right" });
      totalExtras += extra.valor;
      y += 5;
    }

    // Extras total row
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.line(ML, y, W - MR, y);
    y += 2;
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...BLACK);
    safeText("R$", W - MR - 30, y);
    safeText(formatBRL(totalExtras), W - MR, y, { align: "right" });
    y += 8;
  }

  // ─── PAYMENT CONDITIONS ───
  if (y > H - 35) {
    drawFooter(currentPage, totalPages());
    pdf.addPage();
    currentPage++;
    y = MT;
  }

  pdf.setDrawColor(180, 180, 180);
  pdf.setLineWidth(0.3);
  pdf.line(ML, y, W - MR, y);
  y += 4;

  // Condições | Forma | Total
  const colW = CW / 3;

  pdf.setFillColor(...VERY_LIGHT_GRAY);
  pdf.rect(ML, y, CW, 6, "F");
  pdf.setFontSize(6.5);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...DARK_GRAY);
  safeText("Condições de pagamento", ML + 2, y + 4);
  safeText("Forma de pagamento", ML + colW + 2, y + 4);
  safeText("Total", ML + colW * 2 + 2, y + 4);
  y += 7;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(...BLACK);
  safeText(config.condicaoPagamento || "À vista / 30 dias", ML + 2, y);
  safeText(config.formaPagamento || "Boleto", ML + colW + 2, y);
  pdf.setFont("helvetica", "bold");
  safeText(formatBRL(totalGeral), ML + colW * 2 + 2, y);
  y += 8;

  // ─── RESPONSIBLE SIGNATURE LINE ───
  if (y < H - 25) {
    pdf.setDrawColor(180, 180, 180);
    pdf.setLineWidth(0.2);
    pdf.line(ML, y + 8, ML + 60, y + 8);
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...BLACK);
    safeText(config.responsavel || config.vendedor || config.empresa?.nome || "", ML, y + 12);
  }

  // ─── DRAW FINAL FOOTER ───
  drawFooter(currentPage, totalPages());

  // Save
  const safeName = (config.cliente || "novo").replace(/\s+/g, "-").toLowerCase();
  const numSuffix = config.numero ? `-${config.numero}` : "";
  pdf.save(`proposta-orcamento-${safeName}${numSuffix}.pdf`);
}
