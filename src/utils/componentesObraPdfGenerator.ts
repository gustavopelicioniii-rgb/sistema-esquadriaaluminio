import { jsPDF } from "jspdf";
import type { CalculationOutput } from "@/types/calculation";

const A4_W = 210;
const A4_H = 297;
const ML = 8;
const MR = 8;
const CW = A4_W - ML - MR;
const FONT = "helvetica";

const BLACK = [0, 0, 0] as const;
const DARK = [40, 40, 40] as const;
const MID = [100, 100, 100] as const;
const LIGHT = [180, 180, 180] as const;
const GREEN = [0, 100, 0] as const;

const formatDateBR = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}  ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const formatBRL = (v: number) =>
  (typeof v === "number" && !isNaN(v) ? v : 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const safe = (pdf: jsPDF, text: any, x: number, y: number, opts?: any) => {
  const s = text == null ? "" : String(text);
  if (opts) pdf.text(s, x, y, opts);
  else pdf.text(s, x, y);
};

export interface ComponenteObraItem {
  codigo: string;
  descricao: string;
  cor: string;
  qtdLiquida: string;
  custo: number;
  qtdeEntregue?: string;
  cxm?: string;
  custoTotal: number;
}

export interface ComponentesObraConfig {
  obraCod?: string;
  nomeObra?: string;
  cliente?: string;
  tratamento?: string;
  empresaNome?: string;
  dataCalc?: string;
  referencia?: string;
  ipiIncluso?: boolean;
  items?: ComponenteObraItem[];
}

/**
 * Generates a "Componentes da Obra - Protocolo de Entrega" PDF.
 * Can use calculation output components or explicit items list.
 */
export function generateComponentesObraPDF(
  result?: CalculationOutput,
  config?: ComponentesObraConfig
) {
  const pdf = new jsPDF("p", "mm", "a4");
  const dateStr = formatDateBR();
  const cfg = config || {};
  let y = 0;

  const checkPage = (needed: number): number => {
    if (y + needed > A4_H - 18) {
      pdf.addPage();
      y = 10;
      y = drawTableHeader(y);
    }
    return y;
  };

  // ═══════════ HEADER ═══════════
  pdf.setFillColor(...GREEN);
  pdf.rect(0, 0, A4_W, 1.2, "F");
  y = 6;

  // Logo
  pdf.setFontSize(9);
  pdf.setFont(FONT, "bold");
  pdf.setTextColor(...GREEN);
  safe(pdf, cfg.empresaNome || "EMPRESA", ML, y + 4);

  // Title
  pdf.setFontSize(12);
  pdf.setFont(FONT, "bold");
  pdf.setTextColor(...BLACK);
  safe(pdf, "Componentes da Obra - Protocolo de Entrega", A4_W / 2, y + 3, { align: "center" });

  // Right
  pdf.setFontSize(6.5);
  pdf.setFont(FONT, "normal");
  pdf.setTextColor(...MID);
  safe(pdf, "Emitido por:", A4_W - MR - 52, y);
  pdf.setFont(FONT, "bold");
  pdf.setTextColor(...BLACK);
  safe(pdf, "ADMINISTRADOR", A4_W - MR - 32, y);
  safe(pdf, dateStr, A4_W - MR, y + 4, { align: "right" });

  y = 15;
  pdf.setDrawColor(...LIGHT);
  pdf.setLineWidth(0.3);
  pdf.line(ML, y, A4_W - MR, y);
  y += 3;

  // ═══════════ INFO BLOCK ═══════════
  pdf.setFontSize(6.5);
  const infoRow = (label: string, value: string, x: number, iy: number, lw = 22) => {
    pdf.setFont(FONT, "bold");
    pdf.setTextColor(...MID);
    safe(pdf, `${label}:`, x, iy);
    pdf.setFont(FONT, "normal");
    pdf.setTextColor(...DARK);
    safe(pdf, value || "-", x + lw, iy);
  };

  infoRow("Obra cod.", cfg.obraCod || "-", ML, y);
  infoRow("Nome", cfg.nomeObra || (result?.typology_name ?? "-"), A4_W / 2, y, 14);
  infoRow("Data Calc.", cfg.dataCalc || dateStr, A4_W / 2 + 50, y, 18);
  y += 3.5;
  infoRow("Cliente", cfg.cliente || "-", ML, y);
  y += 3.5;
  infoRow("Trat./Cor produt.", cfg.tratamento || "-", ML, y, 32);
  infoRow("Gamp.", "Bronze", A4_W / 2 + 20, y, 14);
  y += 3.5;

  // IPI note
  pdf.setFontSize(6);
  pdf.setFont(FONT, "bold");
  pdf.setTextColor(180, 0, 0);
  safe(pdf, cfg.ipiIncluso ? "IPI incluso" : "IPI não incluso", A4_W - MR, y, { align: "right" });
  y += 4;

  // ═══════════ TABLE ═══════════
  // Column definitions
  const cols = {
    codigo:    { x: ML,       w: 22 },
    descricao: { x: ML + 23,  w: 58 },
    cor:       { x: ML + 82,  w: 18 },
    qtdLiq:    { x: ML + 101, w: 16 },
    custo:     { x: ML + 118, w: 18 },
    qtdeEntr:  { x: ML + 137, w: 16 },
    cxm:       { x: ML + 154, w: 14 },
    custoT:    { x: ML + 169, w: 22 },
  };

  function drawTableHeader(hy: number): number {
    pdf.setFillColor(60, 60, 60);
    pdf.rect(ML, hy - 3.5, CW, 5.5, "F");
    pdf.setFontSize(6);
    pdf.setFont(FONT, "bold");
    pdf.setTextColor(255, 255, 255);
    safe(pdf, "Código", cols.codigo.x + 1, hy);
    safe(pdf, "Descrição", cols.descricao.x + 1, hy);
    safe(pdf, "Cor", cols.cor.x + 1, hy);
    safe(pdf, "Qtd Liq.", cols.qtdLiq.x + cols.qtdLiq.w, hy, { align: "right" });
    safe(pdf, "Custo", cols.custo.x + cols.custo.w, hy, { align: "right" });
    safe(pdf, "Qtde Entr.", cols.qtdeEntr.x + cols.qtdeEntr.w, hy, { align: "right" });
    safe(pdf, "Cxm", cols.cxm.x + cols.cxm.w, hy, { align: "right" });
    safe(pdf, "$ Custo", cols.custoT.x + cols.custoT.w, hy, { align: "right" });
    return hy + 4;
  }

  y = drawTableHeader(y);

  // ═══════════ REFERÊNCIA SECTION ═══════════
  pdf.setFontSize(7);
  pdf.setFont(FONT, "bold");
  pdf.setTextColor(...BLACK);
  safe(pdf, `Referência:`, ML + 1, y + 1);

  // Green tag
  pdf.setFillColor(200, 230, 200);
  pdf.roundedRect(ML + 22, y - 2, 22, 4, 1, 1, "F");
  pdf.setFontSize(6.5);
  pdf.setFont(FONT, "bold");
  pdf.setTextColor(...GREEN);
  safe(pdf, cfg.referencia || "MERCADO", ML + 24, y + 1);
  y += 5;

  // ═══════════ BUILD ITEMS ═══════════
  let items: ComponenteObraItem[] = [];

  if (cfg.items && cfg.items.length > 0) {
    items = cfg.items;
  } else if (result) {
    // Build from calculation output
    // Components
    for (const comp of result.components) {
      items.push({
        codigo: comp.component_code || comp.component_name.substring(0, 12).toUpperCase(),
        descricao: comp.component_name.toUpperCase(),
        cor: "-",
        qtdLiquida: `${comp.quantity} ${comp.unit}`,
        custo: 0,
        qtdeEntregue: "-",
        cxm: "-",
        custoTotal: 0,
      });
    }

    // Cuts (profiles as components)
    for (const cut of result.cuts) {
      items.push({
        codigo: cut.profile_code,
        descricao: `${cut.piece_name.toUpperCase()} - ${cut.cut_length_mm}mm`,
        cor: "-",
        qtdLiquida: `${cut.quantity} PC`,
        custo: 0,
        qtdeEntregue: "-",
        cxm: "-",
        custoTotal: 0,
      });
    }

    // Glasses
    for (const glass of result.glasses) {
      items.push({
        codigo: "VIDRO",
        descricao: `${glass.glass_name.toUpperCase()} ${glass.width_mm}x${glass.height_mm}mm`,
        cor: "-",
        qtdLiquida: `${glass.quantity} PC`,
        custo: 0,
        qtdeEntregue: "-",
        cxm: "-",
        custoTotal: 0,
      });
    }
  }

  // ═══════════ DRAW ROWS ═══════════
  let grandTotal = 0;
  let isOdd = false;

  for (const item of items) {
    y = checkPage(5);

    // Alternating row background
    if (isOdd) {
      pdf.setFillColor(248, 248, 248);
      pdf.rect(ML, y - 2.5, CW, 4.2, "F");
    }
    isOdd = !isOdd;

    pdf.setFontSize(5.8);
    pdf.setFont(FONT, "normal");
    pdf.setTextColor(...DARK);

    safe(pdf, item.codigo, cols.codigo.x + 1, y);

    // Truncate description if too long
    const maxDescW = cols.descricao.w - 2;
    const desc = item.descricao;
    const descLines = pdf.splitTextToSize(desc, maxDescW);
    safe(pdf, descLines[0] || "-", cols.descricao.x + 1, y);

    safe(pdf, item.cor, cols.cor.x + 1, y);
    safe(pdf, item.qtdLiquida, cols.qtdLiq.x + cols.qtdLiq.w, y, { align: "right" });

    if (item.custo > 0) {
      safe(pdf, item.custo.toFixed(2), cols.custo.x + cols.custo.w, y, { align: "right" });
    }

    safe(pdf, item.qtdeEntregue || "-", cols.qtdeEntr.x + cols.qtdeEntr.w, y, { align: "right" });
    safe(pdf, item.cxm || "-", cols.cxm.x + cols.cxm.w, y, { align: "right" });

    if (item.custoTotal > 0) {
      safe(pdf, item.custoTotal.toFixed(2), cols.custoT.x + cols.custoT.w, y, { align: "right" });
      grandTotal += item.custoTotal;
    }

    // Light separator
    pdf.setDrawColor(235, 235, 235);
    pdf.setLineWidth(0.1);
    pdf.line(ML, y + 1.2, A4_W - MR, y + 1.2);

    y += 4;
  }

  // ═══════════ TOTAL ROW ═══════════
  y += 2;
  pdf.setDrawColor(150, 150, 150);
  pdf.setLineWidth(0.4);
  pdf.line(cols.custoT.x, y - 1, A4_W - MR, y - 1);

  if (grandTotal > 0) {
    pdf.setFontSize(7);
    pdf.setFont(FONT, "bold");
    pdf.setTextColor(...BLACK);
    safe(pdf, "TOTAL:", cols.cxm.x, y + 2);
    safe(pdf, formatBRL(grandTotal), cols.custoT.x + cols.custoT.w, y + 2, { align: "right" });
  }

  // ═══════════ FOOTER (all pages) ═══════════
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    const footY = A4_H - 6;
    pdf.setDrawColor(...LIGHT);
    pdf.setLineWidth(0.2);
    pdf.line(ML, footY - 3, A4_W - MR, footY - 3);

    pdf.setFontSize(7);
    pdf.setFont(FONT, "normal");
    pdf.setTextColor(...MID);
    safe(pdf, `${i} / ${totalPages}`, A4_W - MR, footY, { align: "right" });

    pdf.setFontSize(6);
    pdf.setTextColor(...LIGHT);
    safe(pdf, "Sistema AluFlow - Alumínio® Sistemas", A4_W / 2, footY, { align: "center" });
  }

  const safeName = (result?.typology_name || "obra").replace(/\s+/g, "-").toLowerCase();
  pdf.save(`componentes-obra-${safeName}.pdf`);
}
