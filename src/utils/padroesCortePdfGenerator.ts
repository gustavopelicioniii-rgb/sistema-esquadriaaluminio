import { jsPDF } from "jspdf";
import type { CalculationOutput, OptimizationResult } from "@/types/calculation";

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

const safe = (pdf: jsPDF, text: string | number | null | undefined, x: number, y: number, opts?: Record<string, unknown>) => {
  const s = text == null ? "" : String(text);
  if (opts) pdf.text(s, x, y, opts);
  else pdf.text(s, x, y);
};

interface PadroesCorteConfig {
  codigoObra?: string;
  nomeObra?: string;
  nomeCliente?: string;
  tratamento?: string;
  empresaNome?: string;
}

export async function generatePadroesCortesPDF(
  result: CalculationOutput,
  barResults: OptimizationResult[],
  config?: PadroesCorteConfig,
  options?: { preview?: boolean }
): Promise<{ blob: Blob; filename: string } | void> {
  const pdf = new jsPDF("p", "mm", "a4");
  const dateStr = formatDateBR();
  const cfg = config || {};
  let y = 0;

  // Helper: check/add page
  const checkPage = (needed: number): void => {
    if (y + needed > A4_H - 18) {
      pdf.addPage();
      y = 10;
    }
  };

  // ═══════════ HEADER ═══════════
  pdf.setFillColor(...GREEN);
  pdf.rect(0, 0, A4_W, 1.2, "F");
  y = 6;

  // Logo placeholder
  pdf.setFontSize(9);
  pdf.setFont(FONT, "bold");
  pdf.setTextColor(...GREEN);
  safe(pdf, cfg.empresaNome || "EMPRESA", ML, y + 4);

  // Title
  pdf.setFontSize(14);
  pdf.setFont(FONT, "bold");
  pdf.setTextColor(...BLACK);
  safe(pdf, "Padrões de Cortes", A4_W / 2, y + 3, { align: "center" });

  // Right: emitido por + date
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
  const infoRow = (label: string, value: string, x: number, iy: number, lw = 24) => {
    pdf.setFont(FONT, "bold");
    pdf.setTextColor(...MID);
    safe(pdf, `${label}:`, x, iy);
    pdf.setFont(FONT, "normal");
    pdf.setTextColor(...DARK);
    safe(pdf, value || "-", x + lw, iy);
  };

  infoRow("Código Obra", cfg.codigoObra || "-", ML, y);
  infoRow("Calc.", dateStr, A4_W / 2 + 20, y, 12);
  y += 3.5;
  infoRow("Tratamento", cfg.tratamento || "-", ML, y);
  y += 3.5;
  infoRow("Nome da Obra", cfg.nomeObra || result.typology_name, ML, y);
  y += 3.5;
  infoRow("Nome do Cliente", cfg.nomeCliente || "-", ML, y);
  y += 5;

  // ═══════════ PROFILE SECTIONS ═══════════
  // Group cuts by profile code
  const profileCodes = [...new Set(result.cuts.map(c => c.profile_code))];

  for (let pIdx = 0; pIdx < profileCodes.length; pIdx++) {
    const profileCode = profileCodes[pIdx];
    const profileCuts = result.cuts.filter(c => c.profile_code === profileCode);
    const profSummary = result.profiles_summary.find(p => p.profile_code === profileCode);
    const barOpt = barResults.find(b => b.profile_code === profileCode);

    const totalPieces = profileCuts.reduce((s, c) => s + c.quantity, 0);
    const barLen = barOpt?.bar_length_mm || 6000;
    const totalBars = profSummary?.total_bars_needed || barOpt?.total_bars || 0;

    // Check space for this section
    checkPage(50);

    // ─── Profile header box ───
    // Draw small profile sketch placeholder (left)
    const sketchW = 18;
    const sketchH = 14;
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.rect(ML, y, sketchW, sketchH);
    // Simple L-shape placeholder
    pdf.setLineWidth(0.8);
    pdf.setDrawColor(80, 80, 80);
    pdf.line(ML + 4, y + 3, ML + 4, y + sketchH - 3);
    pdf.line(ML + 4, y + sketchH - 3, ML + sketchW - 4, y + sketchH - 3);

    // Profile info table header
    const tblX = ML + sketchW + 3;
    const tblW = CW - sketchW - 3;

    // Header row
    const hdrCols = [
      { label: "Código", w: 22 },
      { label: "ID", w: 30 },
      { label: "Tratamento", w: 38 },
      { label: "Barras", w: 24 },
      { label: "GLC", w: 12 },
      { label: "Part.", w: 12 },
    ];

    pdf.setFillColor(240, 240, 240);
    pdf.rect(tblX, y, tblW, 5, "F");
    pdf.setFontSize(6);
    pdf.setFont(FONT, "bold");
    pdf.setTextColor(...DARK);
    let cx = tblX + 1;
    for (const col of hdrCols) {
      safe(pdf, col.label, cx, y + 3.5);
      cx += col.w;
    }

    // Values row
    const valY = y + 5;
    pdf.setFontSize(6.5);
    pdf.setFont(FONT, "bold");
    pdf.setTextColor(...BLACK);
    cx = tblX + 1;
    safe(pdf, profileCode, cx, valY + 3.5);
    cx += hdrCols[0].w;
    pdf.setFont(FONT, "normal");
    safe(pdf, profSummary?.profile_name || profileCode, cx, valY + 3.5);
    cx += hdrCols[1].w;
    safe(pdf, cfg.tratamento || "-", cx, valY + 3.5);
    cx += hdrCols[2].w;
    safe(pdf, `${totalBars} x ${barLen}`, cx, valY + 3.5);
    cx += hdrCols[3].w;
    safe(pdf, String(profileCuts.length), cx, valY + 3.5);
    cx += hdrCols[4].w;
    safe(pdf, `${pIdx + 1}/${profileCodes.length}`, cx, valY + 3.5);

    // Profile function name below code
    pdf.setFontSize(5.5);
    pdf.setTextColor(...MID);
    safe(pdf, profileCuts[0]?.piece_function || "", tblX + 1, valY + 7);

    // Nº Barras/Feixes
    pdf.setFontSize(5.5);
    pdf.setTextColor(...MID);
    safe(pdf, "Nº Barras/Feixes:", tblX + hdrCols[0].w + hdrCols[1].w + hdrCols[2].w + 1, valY + 7);
    safe(pdf, "N/A", tblX + hdrCols[0].w + hdrCols[1].w + hdrCols[2].w + 30, valY + 7);

    y += sketchH + 3;

    // ─── Pieces table ───
    checkPage(totalPieces * 4 + 10);

    // Header
    const pieceCols = [
      { x: ML + 5, w: 14, label: "Qtde" },
      { x: ML + 20, w: 20, label: "Tam" },
      { x: ML + 41, w: 16, label: "Corte" },
      { x: ML + 58, w: 22, label: "Tipo" },
    ];

    pdf.setFillColor(245, 245, 245);
    pdf.rect(ML, y - 1, 80, 4.5, "F");
    pdf.setFontSize(6);
    pdf.setFont(FONT, "bold");
    pdf.setTextColor(...DARK);
    for (const col of pieceCols) {
      safe(pdf, col.label, col.x, y + 2);
    }
    y += 5;

    // Piece rows
    let cxTypeCounter = 1;
    for (const cut of profileCuts) {
      checkPage(5);
      pdf.setFontSize(6.5);
      pdf.setFont(FONT, "normal");
      pdf.setTextColor(...BLACK);
      safe(pdf, String(cut.quantity), pieceCols[0].x + pieceCols[0].w, y, { align: "right" });
      safe(pdf, String(cut.cut_length_mm), pieceCols[1].x + pieceCols[1].w, y, { align: "right" });
      safe(pdf, `${cut.cut_angle_left}/${cut.cut_angle_right}`, pieceCols[2].x, y);
      safe(pdf, `CX-${String(cxTypeCounter).padStart(2, "0")}`, pieceCols[3].x, y);
      cxTypeCounter++;
      y += 3.8;
    }

    // Total pieces
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.2);
    pdf.line(ML + 5, y - 0.5, ML + 20, y - 0.5);
    pdf.setFont(FONT, "bold");
    pdf.setFontSize(6.5);
    safe(pdf, String(totalPieces), pieceCols[0].x + pieceCols[0].w, y + 2, { align: "right" });
    y += 5;

    // ─── Separar (Optimization) section ───
    if (barOpt && barOpt.bars.length > 0) {
      checkPage(barOpt.bars.length * 4 + 10);

      // Section header
      const sepCols = [
        { x: ML + 5, label: "Separar" },
        { x: ML + 30, label: "pl/Cortar" },
        { x: ML + 60, label: "Corte" },
        { x: ML + 80, label: "Sobras" },
      ];

      pdf.setFillColor(245, 245, 245);
      pdf.rect(ML, y - 1, CW, 4.5, "F");
      pdf.setFontSize(6);
      pdf.setFont(FONT, "bold");
      pdf.setTextColor(...DARK);
      for (const col of sepCols) {
        safe(pdf, col.label, col.x, y + 2);
      }
      // Barra Útl
      safe(pdf, `Barra Útl: ${barLen}`, A4_W - MR - 30, y + 2);
      y += 5;

      // Optimization rows - one per bar
      for (const bar of barOpt.bars) {
        checkPage(5);
        pdf.setFontSize(6.5);
        pdf.setFont(FONT, "normal");
        pdf.setTextColor(...BLACK);

        // "1 x 6000"
        safe(pdf, `1 x ${barLen}`, sepCols[0].x, y);

        // Pieces summary for this bar
        const piecesSummary = bar.pieces.map(p => `${p.length_mm}`).join(" + ");
        const piecesCount = bar.pieces.length;
        safe(pdf, `${piecesCount} x ${bar.pieces[0]?.length_mm || 0}`, sepCols[1].x, y);

        // Cut angles
        safe(pdf, "90/90", sepCols[2].x, y);

        // Waste
        safe(pdf, `1 x ${bar.waste_mm}`, sepCols[3].x, y);

        y += 3.8;
      }
      y += 3;
    }

    // Separator between profiles
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.line(ML, y, A4_W - MR, y);
    y += 4;
  }

  // ═══════════ SUMMARY TABLE (bottom) ═══════════
  checkPage(20);

  pdf.setDrawColor(150, 150, 150);
  pdf.setLineWidth(0.4);
  pdf.line(ML, y, A4_W - MR, y);
  y += 1;

  // Summary header
  const sumHdrCols = [
    { x: ML + 2, label: "Quantidade" },
    { x: ML + 30, label: "p/ Cortar" },
    { x: ML + 60, label: "Corte" },
    { x: ML + 82, label: "Sobras" },
    { x: ML + 110, label: "Barra Útil" },
  ];

  pdf.setFillColor(240, 240, 240);
  pdf.rect(ML, y, CW, 4.5, "F");
  pdf.setFontSize(6);
  pdf.setFont(FONT, "bold");
  pdf.setTextColor(...DARK);
  for (const col of sumHdrCols) {
    safe(pdf, col.label, col.x, y + 3);
  }
  y += 6;

  // Summary rows - one per bar length used
  const barLengths = [...new Set(barResults.map(b => b.bar_length_mm))];
  for (const bLen of barLengths) {
    const barsWithLen = barResults.filter(b => b.bar_length_mm === bLen);
    const totalBarsCount = barsWithLen.reduce((s, b) => s + b.total_bars, 0);
    const totalPiecesCount = barsWithLen.reduce((s, b) => s + b.bars.reduce((s2, bar) => s2 + bar.pieces.length, 0), 0);
    const totalWaste = barsWithLen.reduce((s, b) => s + b.total_waste_mm, 0);

    checkPage(5);
    pdf.setFontSize(6.5);
    pdf.setFont(FONT, "normal");
    pdf.setTextColor(...BLACK);
    safe(pdf, `${totalBarsCount} x ${bLen}`, sumHdrCols[0].x, y);
    safe(pdf, `${totalPiecesCount} peças`, sumHdrCols[1].x, y);
    safe(pdf, "90/90", sumHdrCols[2].x, y);
    safe(pdf, `${totalWaste}`, sumHdrCols[3].x, y);
    safe(pdf, String(bLen), sumHdrCols[4].x, y);
    y += 4;
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

  const safeName = result.typology_name.replace(/\s+/g, "-").toLowerCase();
  const filename = `padroes-cortes-${safeName}-${result.input.width_mm}x${result.input.height_mm}.pdf`;

  if (options?.preview) {
    return { blob: pdf.output("blob"), filename };
  }
  pdf.save(filename);
}
