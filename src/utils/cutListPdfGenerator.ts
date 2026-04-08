import { jsPDF } from "jspdf";
import type { CalculationOutput, OptimizationResult, ProfileSummary } from "@/types/calculation";

const A4_W = 210;
const A4_H = 297;
const ML = 8;
const MR = 8;
const CW = A4_W - ML - MR;
const FONT = "helvetica";

const GREEN = [0, 128, 0] as const;
const BLACK = [0, 0, 0] as const;
const DARK = [40, 40, 40] as const;
const MID = [100, 100, 100] as const;
const LIGHT = [180, 180, 180] as const;
const HEADER_GREEN = [0, 100, 0] as const;

// ═══════════ PROFILE CROSS-SECTION DRAWING ═══════════
function drawProfileIcon(pdf: jsPDF, type: string, code: string, cx: number, cy: number, s: number) {
  const sc = s / 40; // scale factor relative to 40x40 viewBox
  const ox = cx - s / 2;
  const oy = cy - s / 2;
  const x = (v: number) => ox + v * sc;
  const y = (v: number) => oy + v * sc;

  pdf.setDrawColor(...DARK);
  pdf.setLineWidth(0.3);

  const t = type.toLowerCase();
  const c = code.toUpperCase();

  if (t === "marco" && (c.includes("010") || c.includes("SUPERIOR"))) {
    // U channel
    pdf.line(x(8), y(30), x(8), y(10));
    pdf.line(x(8), y(10), x(32), y(10));
    pdf.line(x(32), y(10), x(32), y(30));
    pdf.line(x(6), y(10), x(12), y(10));
    pdf.line(x(28), y(10), x(34), y(10));
  } else if (t === "trilho") {
    pdf.rect(x(6), y(24), 28 * sc, 6 * sc);
    pdf.line(x(14), y(24), x(14), y(18));
    pdf.line(x(26), y(24), x(26), y(18));
    pdf.line(x(12), y(18), x(16), y(18));
    pdf.line(x(24), y(18), x(28), y(18));
  } else if (t === "marco") {
    pdf.rect(x(10), y(6), 8 * sc, 28 * sc);
    pdf.line(x(18), y(10), x(30), y(10));
    pdf.line(x(18), y(30), x(30), y(30));
  } else if (t === "montante") {
    pdf.rect(x(10), y(6), 6 * sc, 28 * sc);
    pdf.rect(x(24), y(6), 6 * sc, 28 * sc);
    pdf.line(x(16), y(20), x(24), y(20));
  } else if (t === "travessa") {
    pdf.rect(x(6), y(14), 28 * sc, 12 * sc);
    pdf.setLineDashPattern([1, 1], 0);
    pdf.line(x(10), y(20), x(30), y(20));
    pdf.setLineDashPattern([], 0);
  } else if (t === "baguete") {
    pdf.roundedRect(x(12), y(14), 16 * sc, 12 * sc, 4 * sc, 4 * sc);
  } else if (t === "contramarco") {
    pdf.line(x(28), y(8), x(10), y(8));
    pdf.line(x(10), y(8), x(10), y(32));
    pdf.line(x(10), y(32), x(28), y(32));
  } else if (t === "arremate") {
    pdf.rect(x(8), y(16), 24 * sc, 8 * sc);
    pdf.line(x(8), y(12), x(14), y(16));
  } else {
    // Generic rectangular tube
    pdf.rect(x(10), y(10), 20 * sc, 20 * sc);
    pdf.rect(x(14), y(14), 12 * sc, 12 * sc);
  }
}

const formatDateBR = () => {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear());
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yy}  ${hh}:${mi}`;
};

const safeText = (pdf: jsPDF, text: any, x: number, y: number, options?: any) => {
  const str = text == null ? "" : String(text);
  if (options) pdf.text(str, x, y, options);
  else pdf.text(str, x, y);
};

interface RelacaoBarrasConfig {
  obraCod?: string;
  nomeObra?: string;
  cliente?: string;
  tratamento?: string;
  dataCalc?: string;
  responsavel?: string;
  logoUrl?: string;
  empresaNome?: string;
}

export async function generateCutListPDF(
  result: CalculationOutput,
  barResults: OptimizationResult[],
  _svgPreviewElementId?: string,
  config?: RelacaoBarrasConfig
) {
  const pdf = new jsPDF("p", "mm", "a4");
  const dateStr = formatDateBR();
  const cfg = config || {};

  let y = 0;

  // ═══════════ HEADER ═══════════
  // Top green line
  pdf.setFillColor(...HEADER_GREEN);
  pdf.rect(0, 0, A4_W, 1.5, "F");

  y = 6;

  // Logo area (left)
  pdf.setFontSize(10);
  pdf.setFont(FONT, "bold");
  pdf.setTextColor(...HEADER_GREEN);
  safeText(pdf, cfg.empresaNome || "EMPRESA", ML, y + 5);

  // Title (center)
  pdf.setFontSize(14);
  pdf.setFont(FONT, "bold");
  pdf.setTextColor(...BLACK);
  safeText(pdf, "Relação de Barras", A4_W / 2, y + 4, { align: "center" });

  // Right side: Emitido por + date
  pdf.setFontSize(7);
  pdf.setFont(FONT, "normal");
  pdf.setTextColor(...MID);
  safeText(pdf, "Emitido por:", A4_W - MR - 55, y);
  pdf.setFont(FONT, "bold");
  pdf.setTextColor(...BLACK);
  safeText(pdf, "ADMINISTRADOR", A4_W - MR - 35, y);
  safeText(pdf, dateStr, A4_W - MR, y, { align: "right" });

  y = 16;

  // Separator
  pdf.setDrawColor(...LIGHT);
  pdf.setLineWidth(0.3);
  pdf.line(ML, y, A4_W - MR, y);
  y += 3;

  // ═══════════ INFO BLOCK ═══════════
  const infoLabelW = 30;
  const infoValueX = ML + infoLabelW;
  const infoRightLabelX = A4_W / 2 + 10;
  const infoRightValueX = infoRightLabelX + 25;

  const drawInfoRow = (label: string, value: string, x: number, iy: number, lw = infoLabelW) => {
    pdf.setFontSize(7);
    pdf.setFont(FONT, "bold");
    pdf.setTextColor(...MID);
    safeText(pdf, `${label}:`, x, iy);
    pdf.setFont(FONT, "normal");
    pdf.setTextColor(...DARK);
    safeText(pdf, value || "-", x + lw, iy);
  };

  drawInfoRow("Obra cod.", cfg.obraCod || "-", ML, y);
  drawInfoRow("Nome", cfg.nomeObra || result.typology_name, infoRightLabelX, y, 15);
  y += 4;
  drawInfoRow("Cliente", cfg.cliente || "-", ML, y);
  y += 4;
  drawInfoRow("Trat./Cor/acabam.", cfg.tratamento || "-", ML, y, 35);
  drawInfoRow("Data Calc.", cfg.dataCalc || dateStr, infoRightLabelX, y, 20);
  y += 5;

  // Obs line
  pdf.setFontSize(6);
  pdf.setFont(FONT, "normal");
  pdf.setTextColor(...MID);
  safeText(pdf, "Obs.: Para que o material abaixo seja suficiente para a montagem de todos os caixilhos é preciso seguir o relatório de Orientação de Cortes da Obra", ML, y);
  y += 5;

  // ═══════════ TABLE HEADER ═══════════
  // Column definitions matching image
  const colDefs = {
    perfil: { x: ML, w: 22 },
    tratCor: { x: ML + 23, w: 45 },
    qtde: { x: ML + 69, w: 12 },
    barra: { x: ML + 82, w: 22 },
    peso: { x: ML + 105, w: 22 },
    sobra: { x: ML + 128, w: 22 },
    pct: { x: ML + 151, w: 18 },
  };

  const drawTableHeader = (hy: number): number => {
    pdf.setFillColor(240, 240, 240);
    pdf.rect(ML, hy - 3.5, CW, 5.5, "F");
    pdf.setFontSize(6.5);
    pdf.setFont(FONT, "bold");
    pdf.setTextColor(...DARK);
    safeText(pdf, "Perfil", colDefs.perfil.x + 1, hy);
    safeText(pdf, "Trat./Cor", colDefs.tratCor.x + 1, hy);
    safeText(pdf, "Qtde", colDefs.qtde.x + colDefs.qtde.w, hy, { align: "right" });
    safeText(pdf, "Barra", colDefs.barra.x + colDefs.barra.w, hy, { align: "right" });
    safeText(pdf, "Peso (kg)", colDefs.peso.x + colDefs.peso.w, hy, { align: "right" });
    safeText(pdf, "Sobra (kg)", colDefs.sobra.x + colDefs.sobra.w, hy, { align: "right" });
    safeText(pdf, "( % )", colDefs.pct.x + colDefs.pct.w, hy, { align: "right" });

    // Bottom line
    pdf.setDrawColor(...LIGHT);
    pdf.setLineWidth(0.2);
    pdf.line(ML, hy + 1.5, A4_W - MR, hy + 1.5);
    return hy + 4;
  };

  y = drawTableHeader(y);

  // ═══════════ BUILD GROUPS BY PROFILE ═══════════
  // Group profiles by a common alloy prefix (first profile group)
  // Each OptimizationResult has profile_code, bars, totals

  // We need to create profile groups. In the reference image, profiles are grouped
  // by alloy (e.g., "AZ-A-1001-A18", "CM", "SA-A-1001-A18")
  // For our data, we group by the first part of profile_code or just list them

  interface ProfileGroupRow {
    profileCode: string;
    pieceFunction: string;
    treatment: string;
    quantity: number;
    barLength: number;
    weightKg: number;
    wasteKg: number;
    wastePct: number;
    isSubProfile?: boolean;
  }

  interface ProfileGroup {
    groupCode: string;
    treatment: string;
    rows: ProfileGroupRow[];
    totalWeight: number;
    totalWaste: number;
    totalWastePct: number;
  }

  // Build groups from profiles_summary + barResults
  const groups: ProfileGroup[] = [];

  for (const prof of result.profiles_summary) {
    const barOpt = barResults.find(b => b.profile_code === prof.profile_code);
    const barLen = barOpt?.bar_length_mm || 6000;
    const totalBars = prof.total_bars_needed;
    const totalWeightKg = prof.total_weight_kg;
    const totalBarLengthMm = totalBars * barLen;
    const usedLengthMm = prof.total_length_mm;
    const wasteLengthMm = totalBarLengthMm - usedLengthMm;
    const wasteWeightKg = (wasteLengthMm / 1000) * prof.weight_per_meter;
    const wastePct = totalBarLengthMm > 0 ? (wasteLengthMm / totalBarLengthMm) * 100 : 0;

    // Find related cuts to show sub-rows
    const relatedCuts = result.cuts.filter(c => c.profile_code === prof.profile_code);

    const rows: ProfileGroupRow[] = [];

    // Main profile row
    rows.push({
      profileCode: prof.profile_code,
      treatment: cfg.tratamento || "-",
      quantity: totalBars,
      barLength: barLen,
      weightKg: totalWeightKg,
      wasteKg: wasteWeightKg,
      wastePct: wastePct,
    });

    // Sub-rows for each cut piece
    for (const cut of relatedCuts) {
      const pieceWeightKg = cut.weight_kg;
      rows.push({
        profileCode: cut.piece_name,
        treatment: cfg.tratamento || "-",
        quantity: cut.quantity,
        barLength: cut.cut_length_mm,
        weightKg: pieceWeightKg,
        wasteKg: 0,
        wastePct: 0,
        isSubProfile: true,
      });
    }

    groups.push({
      groupCode: prof.profile_code,
      treatment: cfg.tratamento || "-",
      rows,
      totalWeight: totalWeightKg + wasteWeightKg,
      totalWaste: wasteWeightKg,
      totalWastePct: wastePct,
    });
  }

  // ═══════════ DRAW GROUPS ═══════════
  let grandTotalWeight = 0;
  let grandTotalWaste = 0;

  for (const group of groups) {
    // Check page space
    if (y + (group.rows.length + 3) * 4.5 > A4_H - 25) {
      pdf.addPage();
      y = 10;
      y = drawTableHeader(y);
    }

    // Group header (bold, green-ish)
    pdf.setFontSize(7);
    pdf.setFont(FONT, "bold");
    pdf.setTextColor(...HEADER_GREEN);
    safeText(pdf, group.groupCode, colDefs.perfil.x + 1, y);

    pdf.setFont(FONT, "normal");
    pdf.setTextColor(...DARK);
    safeText(pdf, group.treatment, colDefs.tratCor.x + 1, y);
    y += 4;

    // Sub-rows (individual pieces)
    for (const row of group.rows) {
      if (y > A4_H - 20) {
        pdf.addPage();
        y = 10;
        y = drawTableHeader(y);
      }

      pdf.setFontSize(6.5);
      if (row.isSubProfile) {
        pdf.setFont(FONT, "normal");
        pdf.setTextColor(...DARK);
        safeText(pdf, row.profileCode, colDefs.perfil.x + 5, y);
      } else {
        pdf.setFont(FONT, "bold");
        pdf.setTextColor(...BLACK);
        safeText(pdf, row.profileCode, colDefs.perfil.x + 1, y);
      }

      pdf.setFont(FONT, "normal");
      pdf.setTextColor(...DARK);

      if (!row.isSubProfile) {
        safeText(pdf, row.treatment, colDefs.tratCor.x + 1, y);
      } else {
        safeText(pdf, cfg.tratamento || "-", colDefs.tratCor.x + 1, y);
      }

      safeText(pdf, String(row.quantity), colDefs.qtde.x + colDefs.qtde.w, y, { align: "right" });
      safeText(pdf, String(row.barLength), colDefs.barra.x + colDefs.barra.w, y, { align: "right" });

      if (!row.isSubProfile) {
        safeText(pdf, row.weightKg.toFixed(2), colDefs.peso.x + colDefs.peso.w, y, { align: "right" });
        safeText(pdf, row.wasteKg.toFixed(2), colDefs.sobra.x + colDefs.sobra.w, y, { align: "right" });
        safeText(pdf, row.wastePct.toFixed(2), colDefs.pct.x + colDefs.pct.w, y, { align: "right" });
      } else {
        // Individual piece weight
        safeText(pdf, row.weightKg.toFixed(2), colDefs.peso.x + colDefs.peso.w, y, { align: "right" });
      }

      // Light line
      pdf.setDrawColor(230, 230, 230);
      pdf.setLineWidth(0.1);
      pdf.line(ML, y + 1.2, A4_W - MR, y + 1.2);

      y += 4;
    }

    // Group subtotal line
    pdf.setDrawColor(...LIGHT);
    pdf.setLineWidth(0.3);
    pdf.line(colDefs.peso.x, y - 0.5, A4_W - MR, y - 0.5);

    const groupTotalWeight = group.rows.reduce((s, r) => s + r.weightKg, 0);
    const groupWaste = group.rows.find(r => !r.isSubProfile)?.wasteKg || 0;
    const groupWastePct = group.rows.find(r => !r.isSubProfile)?.wastePct || 0;

    pdf.setFontSize(7);
    pdf.setFont(FONT, "bold");
    pdf.setTextColor(...BLACK);
    safeText(pdf, groupTotalWeight.toFixed(2), colDefs.peso.x + colDefs.peso.w, y + 1, { align: "right" });
    safeText(pdf, groupWaste.toFixed(2), colDefs.sobra.x + colDefs.sobra.w, y + 1, { align: "right" });
    safeText(pdf, groupWastePct.toFixed(2), colDefs.pct.x + colDefs.pct.w, y + 1, { align: "right" });

    grandTotalWeight += groupTotalWeight;
    grandTotalWaste += groupWaste;

    y += 5;

    // Liga / Têmpera row
    pdf.setFontSize(6.5);
    pdf.setFont(FONT, "bold");
    pdf.setTextColor(...MID);
    safeText(pdf, "Liga:", ML + 5, y);

    // Green tag for Liga
    pdf.setFillColor(200, 230, 200);
    pdf.roundedRect(ML + 14, y - 2.8, 15, 4, 1, 1, "F");
    pdf.setFontSize(6);
    pdf.setFont(FONT, "bold");
    pdf.setTextColor(...HEADER_GREEN);
    safeText(pdf, "6063", ML + 16, y);

    pdf.setFont(FONT, "bold");
    pdf.setTextColor(...MID);
    safeText(pdf, "Têmpera:", ML + 35, y);

    pdf.setFillColor(200, 230, 200);
    pdf.roundedRect(ML + 52, y - 2.8, 10, 4, 1, 1, "F");
    pdf.setFontSize(6);
    pdf.setFont(FONT, "bold");
    pdf.setTextColor(...HEADER_GREEN);
    safeText(pdf, "T5", ML + 54, y);

    y += 6;
  }

  // ═══════════ GRAND TOTAL ═══════════
  if (groups.length > 1) {
    pdf.setDrawColor(...HEADER_GREEN);
    pdf.setLineWidth(0.5);
    pdf.line(colDefs.peso.x, y - 1, A4_W - MR, y - 1);

    pdf.setFontSize(8);
    pdf.setFont(FONT, "bold");
    pdf.setTextColor(...BLACK);
    safeText(pdf, "TOTAL GERAL:", colDefs.tratCor.x + 1, y + 2);

    const grandWastePct = grandTotalWeight > 0 ? (grandTotalWaste / (grandTotalWeight)) * 100 : 0;

    safeText(pdf, grandTotalWeight.toFixed(2), colDefs.peso.x + colDefs.peso.w, y + 2, { align: "right" });
    safeText(pdf, grandTotalWaste.toFixed(2), colDefs.sobra.x + colDefs.sobra.w, y + 2, { align: "right" });
    safeText(pdf, grandWastePct.toFixed(2), colDefs.pct.x + colDefs.pct.w, y + 2, { align: "right" });
    y += 8;
  }

  // ═══════════ RESPONSIBLE ═══════════
  y += 4;
  pdf.setFontSize(7);
  pdf.setFont(FONT, "bold");
  pdf.setTextColor(...BLACK);
  safeText(pdf, cfg.responsavel || "ADMINISTRADOR", ML, y);

  // ═══════════ FOOTER (all pages) ═══════════
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    const footY = A4_H - 6;

    // Top line
    pdf.setDrawColor(...LIGHT);
    pdf.setLineWidth(0.2);
    pdf.line(ML, footY - 3, A4_W - MR, footY - 3);

    // Page number
    pdf.setFontSize(7);
    pdf.setFont(FONT, "normal");
    pdf.setTextColor(...MID);
    safeText(pdf, `${i} / ${totalPages}`, A4_W - MR, footY, { align: "right" });

    // System credit
    pdf.setFontSize(6);
    pdf.setTextColor(...LIGHT);
    safeText(pdf, "Sistema AluFlow - Alumínio® Sistemas", A4_W / 2, footY, { align: "center" });
  }

  // Save
  const safeName = result.typology_name.replace(/\s+/g, "-").toLowerCase();
  pdf.save(`relacao-barras-${safeName}-${result.input.width_mm}x${result.input.height_mm}.pdf`);
}
