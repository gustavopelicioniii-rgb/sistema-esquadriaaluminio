import { jsPDF } from "jspdf";
import type { CalculationOutput, OptimizationResult } from "@/types/calculation";

const A4_W = 210;
const A4_H = 297;
const ML = 8;
const MR = 8;
const CW = A4_W - ML - MR;

const BLACK = [0, 0, 0] as const;
const DARK = [40, 40, 40] as const;
const MID = [100, 100, 100] as const;
const LIGHT = [180, 180, 180] as const;
const GRAY_BG = [245, 245, 245] as const;
const HEADER_BG = [230, 230, 230] as const;

const formatDateBR = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const safeText = (pdf: jsPDF, text: any, x: number, y: number, opts?: any) => {
  const str = text == null ? "" : String(text);
  if (opts) pdf.text(str, x, y, opts);
  else pdf.text(str, x, y);
};

export interface ImpressaoObraConfig {
  empresaNome?: string;
  codigoEsquadria?: string;
  projeto?: string;
  codigoObra?: string;
  cliente?: string;
  nomeObra?: string;
  tratamento?: string;
  previsaoEntrega?: string;
  responsavel?: string;
  vidroTipo?: string;
  localizacao?: string;
}

export async function generateImpressaoObraPDF(
  result: CalculationOutput,
  barResults: OptimizationResult[],
  config?: ImpressaoObraConfig
) {
  const pdf = new jsPDF("p", "mm", "a4");
  const cfg = config || {};
  const dateStr = formatDateBR();
  const typoCode = cfg.codigoEsquadria || result.typology_name.split(" ")[0] || "J2";
  const W = result.input.width_mm;
  const H = result.input.height_mm;
  const qty = result.input.quantity;

  let y = 0;

  // ════════ HEADER ════════
  // Company name / logo area (left)
  pdf.setFillColor(255, 255, 255);
  pdf.setDrawColor(...LIGHT);
  pdf.setLineWidth(0.3);
  pdf.rect(ML, 5, 45, 16, "S");

  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...DARK);
  safeText(pdf, cfg.empresaNome || "ESQUADGROUP", ML + 3, 14);

  // Large typology code (center-right)
  pdf.setFontSize(28);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...BLACK);
  safeText(pdf, typoCode, A4_W / 2 + 20, 18, { align: "center" });

  // Emitido por + date (right)
  pdf.setFontSize(6.5);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...MID);
  safeText(pdf, "Emitido por:", A4_W - MR - 58, 8);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...DARK);
  safeText(pdf, "ADMINISTRADOR", A4_W - MR - 38, 8);
  safeText(pdf, dateStr, A4_W - MR, 8, { align: "right" });

  y = 26;

  // ════════ INFO BLOCK ════════
  const drawField = (label: string, value: string, fx: number, fy: number, labelW = 22) => {
    pdf.setFontSize(6);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...MID);
    safeText(pdf, label + ":", fx, fy);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...DARK);
    safeText(pdf, value, fx + labelW, fy);
  };

  // Row 1
  drawField("Cód Esqud", cfg.codigoEsquadria || typoCode, ML, y, 18);
  drawField("Proj.", cfg.projeto || "BASE-CUSTOM", ML + 60, y, 10);
  y += 4;

  // Row 2 - Descrição
  drawField("Descrição", result.typology_name, ML, y, 18);
  y += 4;

  // Row 3 - Qtde, L, H
  drawField("Qtde", String(qty), ML, y, 10);
  drawField("L", String(W), ML + 25, y, 5);
  drawField("H", String(H), ML + 50, y, 5);
  y += 4;

  // Row 4 - Tratamento
  drawField("Tratamento", cfg.tratamento || "ANODIZADO BRONZE", ML, y, 22);
  y += 4;

  // Row 5 - Cód Obra
  drawField("Cód. Obra", cfg.codigoObra || "-", ML, y, 18);
  drawField("Previsão de Entrega", cfg.previsaoEntrega || "-", ML + 80, y, 32);
  y += 4;

  // Row 6 - Calc date, Cliente
  drawField("Calc", dateStr, ML, y, 10);
  drawField("Cliente", cfg.cliente || "-", ML + 60, y, 15);
  y += 4;

  // Row 7 - Obra
  drawField("Obra", cfg.nomeObra || "-", ML, y, 10);
  y += 4;

  // Row 8 - Vidros + Localização
  drawField("Vidros", cfg.vidroTipo || "Temperado de 8 mm incolor", ML, y, 12);
  drawField("Localização", cfg.localizacao || "-", ML + 100, y, 20);
  y += 6;

  // ════════ DRAWING PLACEHOLDER ════════
  // Draw a placeholder area for the typology diagram (right side)
  const diagramX = A4_W - MR - 55;
  const diagramY = 28;
  const diagramW = 52;
  const diagramH = 35;
  pdf.setDrawColor(...LIGHT);
  pdf.setLineWidth(0.2);
  pdf.rect(diagramX, diagramY, diagramW, diagramH, "S");

  // Simple frame representation
  const frameMargin = 4;
  const fx = diagramX + frameMargin;
  const fy = diagramY + frameMargin;
  const fw = diagramW - frameMargin * 2;
  const fh = diagramH - frameMargin * 2;

  pdf.setDrawColor(...DARK);
  pdf.setLineWidth(0.5);
  pdf.rect(fx, fy, fw, fh, "S");

  // Inner divisions based on num_folhas
  const numFolhas = result.input.num_folhas || 2;
  const leafW = fw / numFolhas;
  for (let i = 1; i < numFolhas; i++) {
    pdf.line(fx + leafW * i, fy, fx + leafW * i, fy + fh);
  }

  // Labels F (folha) in each section
  pdf.setFontSize(6);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...MID);
  for (let i = 0; i < numFolhas; i++) {
    safeText(pdf, "F", fx + leafW * i + leafW / 2, fy + 3, { align: "center" });
  }

  // Glass labels below diagram
  pdf.setFontSize(5.5);
  for (let i = 0; i < Math.min(numFolhas, 4); i++) {
    safeText(pdf, "VIDRO", fx + leafW * i + leafW / 2, fy + fh + 4, { align: "center" });
  }

  // Dimension arrows
  pdf.setFontSize(5);
  pdf.setTextColor(...DARK);
  // Width dimension
  safeText(pdf, `${W}`, diagramX + diagramW / 2, diagramY + diagramH + 10, { align: "center" });
  // Height dimension
  safeText(pdf, `${H}`, diagramX + diagramW + 3, diagramY + diagramH / 2, { align: "left" });

  // ════════ DIMENSIONS TABLE ════════
  pdf.setDrawColor(...LIGHT);
  pdf.setLineWidth(0.3);
  pdf.line(ML, y, A4_W - MR, y);
  y += 4;

  // Table headers: Vão Acabado, Marco, Contramarco
  const dimColW = CW / 3;
  pdf.setFontSize(6.5);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...DARK);
  safeText(pdf, "Vão Acabado", ML + dimColW * 0 + dimColW / 2, y, { align: "center" });
  safeText(pdf, "Marco", ML + dimColW * 1 + dimColW / 2, y, { align: "center" });
  safeText(pdf, "Contramarco", ML + dimColW * 2 + dimColW / 2, y, { align: "center" });
  y += 4;

  // Dimension rows
  const drawDimRow = (label: string, v1: string, v2: string, v3: string, dy: number) => {
    pdf.setFontSize(6);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...MID);
    safeText(pdf, label, ML + 2, dy);
    pdf.setTextColor(...DARK);
    safeText(pdf, v1, ML + dimColW * 0 + dimColW / 2, dy, { align: "center" });
    safeText(pdf, v2, ML + dimColW * 1 + dimColW / 2, dy, { align: "center" });
    safeText(pdf, v3, ML + dimColW * 2 + dimColW / 2, dy, { align: "center" });
  };

  drawDimRow("Largura:", String(W), String(W - 5), String(W + 24), y);
  y += 4;
  drawDimRow("Altura:", String(H), String(H - 4), String(H + 24), y);
  y += 5;

  // Note
  pdf.setFontSize(5);
  pdf.setTextColor(200, 0, 0);
  safeText(pdf, "* Atenção! com as dimensões utilize as de edição da obra", A4_W - MR, y, { align: "right" });
  y += 5;

  // ════════ TECHNICAL SPECS ════════
  pdf.setDrawColor(...LIGHT);
  pdf.setLineWidth(0.3);
  pdf.line(ML, y, A4_W - MR, y);
  y += 4;

  const specCol1X = ML;
  const specCol2X = ML + 45;

  const drawSpec = (label: string, value: string, sx: number, sy: number) => {
    pdf.setFontSize(6);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...DARK);
    safeText(pdf, label, sx, sy);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...MID);
    safeText(pdf, ": " + value, sx + pdf.getTextWidth(label), sy);
  };

  const specs = [
    ["USA O CONTRAMARCO", "SIM"],
    ["REFERENCIA DAS MEDIDAS", "INTERNA DO CONTRAMARCO"],
    ["TRILHO INFERIOR", "CONVENCIONAL"],
    ["TIPO DO CONTRAMARCO", "FECHADO - CORTE 45°/45°"],
    ["CONTRAMARCO", "UNICO"],
    ["ARREMATE", "FACE INTERNO RETO"],
    ["AMBIENTE PARA PISO", "COM ARREMATE ALTO PARA PISO"],
    ["TIPO DE MARCO", "MARCO UNICO"],
    ["FOLHA LATERAL", "SEM REFORCO"],
    ["MAO DE APOIO", "REFORCO INTERNO"],
    ["TIPO DE PERFIL C/ REFORCO", "REFORCO ARREDONDADO"],
    ["USA TRAVESSA", "COM TRAVESSA"],
    ["ALTURA DA TRAVESSA", "1000"],
    ["FOLHA FIXA", "FOLHAS FIXAS"],
    ["LADO FOLHA FIXA", "LADO DIREITO"],
    ["BAGUETES", "QUADRADO"],
    ["TIPO DE FECHO", "FECHO CONCHA C/ TRAVA"],
    ["ROLDANA", "DUPLA (80KG)"],
    ["COR DO COMPONENTE", "BRANCO"],
  ];

  for (const [label, value] of specs) {
    if (y > A4_H - 60) {
      pdf.addPage();
      y = 15;
    }
    drawSpec(label, value, specCol1X, y);
    y += 3.5;
  }

  y += 4;

  // ════════ PERFIS TABLE ════════
  pdf.setDrawColor(...LIGHT);
  pdf.setLineWidth(0.3);
  pdf.line(ML, y, A4_W - MR, y);
  y += 4;

  // Section title
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...BLACK);
  safeText(pdf, "Perfis", ML + CW / 2, y, { align: "center" });

  // PESO = Peso Líquido label
  pdf.setFontSize(5.5);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...MID);
  safeText(pdf, "PESO = Peso Líquido", A4_W - MR, y, { align: "right" });
  y += 4;

  // Table columns
  const perfCols = [
    { label: "Pos.", w: 10 },
    { label: "Código", w: 22 },
    { label: "ID:", w: 20 },
    { label: "L/M", w: 12 },
    { label: "Corte", w: 16 },
    { label: "Tam.", w: 18 },
    { label: "Qtde", w: 12 },
    { label: "Peso", w: 16 },
    { label: "Observação", w: CW - 126 },
  ];

  const drawPerfHeader = (hy: number) => {
    pdf.setFillColor(...HEADER_BG);
    pdf.rect(ML, hy - 3, CW, 5, "F");
    pdf.setFontSize(6);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...BLACK);

    let cx = ML;
    for (const col of perfCols) {
      safeText(pdf, col.label, cx + 1, hy);
      cx += col.w;
    }

    pdf.setDrawColor(...LIGHT);
    pdf.setLineWidth(0.2);
    pdf.line(ML, hy + 1.5, A4_W - MR, hy + 1.5);
    return hy + 4.5;
  };

  y = drawPerfHeader(y);

  // Draw cut rows
  let pos = 1;
  for (const cut of result.cuts) {
    if (y > A4_H - 20) {
      pdf.addPage();
      y = 10;
      y = drawPerfHeader(y);
    }

    // Alternating bg
    if (pos % 2 === 0) {
      pdf.setFillColor(...GRAY_BG);
      pdf.rect(ML, y - 2.8, CW, 4, "F");
    }

    pdf.setFontSize(6);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...DARK);

    let cx = ML;
    // Pos
    safeText(pdf, String(pos), cx + 1, y);
    cx += perfCols[0].w;

    // Código (profile code)
    safeText(pdf, cut.profile_code, cx + 1, y);
    cx += perfCols[1].w;

    // ID (piece name)
    safeText(pdf, cut.piece_function || cut.piece_name, cx + 1, y);
    cx += perfCols[2].w;

    // L/M (orientation H or L)
    const ref = cut.cut_angle_left === 45 ? "H" : "L";
    safeText(pdf, ref, cx + 1, y);
    cx += perfCols[3].w;

    // Corte (angle)
    const angleStr = `${cut.cut_angle_left}/${cut.cut_angle_right}`;
    safeText(pdf, angleStr, cx + 1, y);
    cx += perfCols[4].w;

    // Tam. (cut length)
    safeText(pdf, String(cut.cut_length_mm.toFixed(1)), cx + 1, y);
    cx += perfCols[5].w;

    // Qtde
    safeText(pdf, String(cut.quantity), cx + 1, y);
    cx += perfCols[6].w;

    // Peso
    safeText(pdf, cut.weight_kg.toFixed(3), cx + 1, y);
    cx += perfCols[7].w;

    // Observação (piece name)
    const obs = cut.piece_name;
    pdf.setFontSize(5.5);
    safeText(pdf, obs, cx + 1, y);

    // Row line
    pdf.setDrawColor(235, 235, 235);
    pdf.setLineWidth(0.1);
    pdf.line(ML, y + 1.2, A4_W - MR, y + 1.2);

    y += 4;
    pos++;
  }

  // ════════ RESPONSIBLE + FOOTER ════════
  y += 4;
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...BLACK);
  safeText(pdf, cfg.responsavel || "ADMINISTRADOR", ML, y);

  // Footer on all pages
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    const footY = A4_H - 6;

    pdf.setDrawColor(...LIGHT);
    pdf.setLineWidth(0.2);
    pdf.line(ML, footY - 3, A4_W - MR, footY - 3);

    pdf.setFontSize(6);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...LIGHT);
    safeText(pdf, "Sistema CDH - Alumisoft Sistemas", A4_W / 2, footY, { align: "center" });

    pdf.setFontSize(7);
    pdf.setTextColor(...MID);
    safeText(pdf, `${i} / ${totalPages}`, A4_W - MR, footY, { align: "right" });
  }

  const safeName = result.typology_name.replace(/\s+/g, "-").toLowerCase();
  pdf.save(`impressao-obra-${safeName}-${W}x${H}.pdf`);
}
