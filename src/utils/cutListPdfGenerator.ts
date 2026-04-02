import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import type { CalculationOutput, OptimizationResult } from "@/types/calculation";

const A4_W = 210;
const A4_H = 297;
const M = 12; // margin
const CW = A4_W - M * 2; // content width
const FONT = "helvetica";

function addHeader(pdf: jsPDF, title: string, subtitle: string) {
  pdf.setFillColor(37, 99, 235); // primary blue
  pdf.rect(0, 0, A4_W, 28, "F");
  pdf.setFont(FONT, "bold");
  pdf.setFontSize(16);
  pdf.setTextColor(255, 255, 255);
  pdf.text(title, M, 12);
  pdf.setFontSize(9);
  pdf.setFont(FONT, "normal");
  pdf.text(subtitle, M, 20);
  pdf.setTextColor(0, 0, 0);
}

function addSectionTitle(pdf: jsPDF, y: number, text: string): number {
  if (y > A4_H - 30) {
    pdf.addPage();
    y = M;
  }
  pdf.setFont(FONT, "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(37, 99, 235);
  pdf.text(text, M, y);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont(FONT, "normal");
  return y + 6;
}

function drawTableRow(
  pdf: jsPDF,
  y: number,
  cols: { x: number; w: number; text: string; align?: "left" | "center" | "right" }[],
  isHeader: boolean,
  rowH: number = 6
): number {
  if (y > A4_H - M - rowH) {
    pdf.addPage();
    y = M;
  }

  if (isHeader) {
    pdf.setFillColor(241, 245, 249); // slate-100
    pdf.rect(M, y - 4, CW, rowH, "F");
    pdf.setFont(FONT, "bold");
    pdf.setFontSize(7);
    pdf.setTextColor(100, 116, 139);
  } else {
    pdf.setFont(FONT, "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(30, 41, 59);
  }

  for (const col of cols) {
    const align = col.align ?? "left";
    let tx = col.x;
    if (align === "right") tx = col.x + col.w;
    if (align === "center") tx = col.x + col.w / 2;
    pdf.text(col.text, tx, y, { align });
  }

  // thin bottom line
  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.2);
  pdf.line(M, y + 2, M + CW, y + 2);

  return y + rowH;
}

export async function generateCutListPDF(
  result: CalculationOutput,
  barResults: OptimizationResult[],
  svgPreviewElementId?: string
) {
  const pdf = new jsPDF("p", "mm", "a4");
  const now = new Date();
  const dateStr = now.toLocaleDateString("pt-BR");

  // === HEADER ===
  addHeader(
    pdf,
    `Lista de Corte — ${result.typology_name}`,
    `${result.input.width_mm} × ${result.input.height_mm} mm  |  Qtd: ${result.input.quantity}  |  ${dateStr}`
  );

  let y = 36;

  // === SUMMARY ROW ===
  const summaryItems = [
    { label: "Peças", value: String(result.cuts.reduce((s, c) => s + c.quantity, 0)) },
    { label: "Peso Alumínio", value: `${result.total_aluminum_weight_kg.toFixed(2)} kg` },
    { label: "Área Vidro", value: `${result.total_glass_area_m2.toFixed(4)} m²` },
    { label: "Barras", value: String(result.profiles_summary.reduce((s, p) => s + p.total_bars_needed, 0)) },
  ];
  const boxW = CW / summaryItems.length;
  pdf.setFillColor(248, 250, 252);
  pdf.roundedRect(M, y, CW, 14, 2, 2, "F");
  summaryItems.forEach((item, i) => {
    const bx = M + i * boxW;
    pdf.setFont(FONT, "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(100, 116, 139);
    pdf.text(item.label, bx + boxW / 2, y + 5, { align: "center" });
    pdf.setFont(FONT, "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(30, 41, 59);
    pdf.text(item.value, bx + boxW / 2, y + 11, { align: "center" });
  });
  y += 20;

  // === 1. LISTA DE CORTE ===
  y = addSectionTitle(pdf, y, "1. Lista de Corte");

  const cutCols = [
    { x: M, w: 6 },
    { x: M + 7, w: 48 },
    { x: M + 56, w: 22 },
    { x: M + 79, w: 28 },
    { x: M + 108, w: 22 },
    { x: M + 131, w: 14 },
    { x: M + 146, w: 22 },
  ];
  y = drawTableRow(pdf, y, [
    { ...cutCols[0], text: "#" },
    { ...cutCols[1], text: "PEÇA" },
    { ...cutCols[2], text: "PERFIL" },
    { ...cutCols[3], text: "MEDIDA (mm)", align: "right" },
    { ...cutCols[4], text: "ÂNGULO", align: "center" },
    { ...cutCols[5], text: "QTD", align: "center" },
    { ...cutCols[6], text: "PESO (kg)", align: "right" },
  ], true);

  result.cuts.forEach((cut, i) => {
    y = drawTableRow(pdf, y, [
      { ...cutCols[0], text: String(i + 1), align: "center" },
      { ...cutCols[1], text: cut.piece_name },
      { ...cutCols[2], text: cut.profile_code },
      { ...cutCols[3], text: String(cut.cut_length_mm), align: "right" },
      { ...cutCols[4], text: `${cut.cut_angle_left}°/${cut.cut_angle_right}°`, align: "center" },
      { ...cutCols[5], text: String(cut.quantity), align: "center" },
      { ...cutCols[6], text: cut.weight_kg.toFixed(3), align: "right" },
    ], false);
  });

  y += 6;

  // === 2. VIDROS ===
  y = addSectionTitle(pdf, y, "2. Vidros");

  const glassCols = [
    { x: M, w: 44 },
    { x: M + 45, w: 28 },
    { x: M + 74, w: 28 },
    { x: M + 103, w: 14 },
    { x: M + 118, w: 28 },
  ];
  y = drawTableRow(pdf, y, [
    { ...glassCols[0], text: "VIDRO" },
    { ...glassCols[1], text: "LARGURA (mm)", align: "right" },
    { ...glassCols[2], text: "ALTURA (mm)", align: "right" },
    { ...glassCols[3], text: "QTD", align: "center" },
    { ...glassCols[4], text: "ÁREA (m²)", align: "right" },
  ], true);

  result.glasses.forEach((glass) => {
    y = drawTableRow(pdf, y, [
      { ...glassCols[0], text: glass.glass_name },
      { ...glassCols[1], text: String(glass.width_mm), align: "right" },
      { ...glassCols[2], text: String(glass.height_mm), align: "right" },
      { ...glassCols[3], text: String(glass.quantity), align: "center" },
      { ...glassCols[4], text: glass.area_m2.toFixed(4), align: "right" },
    ], false);
  });

  y += 6;

  // === 3. COMPONENTES ===
  if (result.components.length > 0) {
    y = addSectionTitle(pdf, y, "3. Componentes");

    const compCols = [
      { x: M, w: 50 },
      { x: M + 51, w: 30 },
      { x: M + 82, w: 14 },
      { x: M + 97, w: 20 },
      { x: M + 118, w: 30 },
    ];
    y = drawTableRow(pdf, y, [
      { ...compCols[0], text: "COMPONENTE" },
      { ...compCols[1], text: "TIPO" },
      { ...compCols[2], text: "QTD", align: "center" },
      { ...compCols[3], text: "UNIDADE" },
      { ...compCols[4], text: "COMP. TOTAL", align: "right" },
    ], true);

    result.components.forEach((comp) => {
      y = drawTableRow(pdf, y, [
        { ...compCols[0], text: comp.component_name },
        { ...compCols[1], text: comp.component_type },
        { ...compCols[2], text: String(comp.quantity), align: "center" },
        { ...compCols[3], text: comp.unit },
        { ...compCols[4], text: comp.total_length_mm ? `${comp.total_length_mm} mm` : "—", align: "right" },
      ], false);
    });

    y += 6;
  }

  // === 4. PLANO DE BARRAS (visual) ===
  if (barResults.length > 0) {
    y = addSectionTitle(pdf, y, "4. Plano de Barras");

    for (const opt of barResults) {
      if (y > A4_H - 40) {
        pdf.addPage();
        y = M;
      }

      pdf.setFont(FONT, "bold");
      pdf.setFontSize(8);
      pdf.setTextColor(30, 41, 59);
      pdf.text(`${opt.profile_code}  —  ${opt.total_bars} barra(s) de ${opt.bar_length_mm}mm  |  Aproveitamento: ${opt.overall_utilization_percent}%`, M, y);
      y += 5;

      for (const bar of opt.bars) {
        if (y > A4_H - 20) {
          pdf.addPage();
          y = M;
        }

        // Label
        pdf.setFont(FONT, "normal");
        pdf.setFontSize(6);
        pdf.setTextColor(100, 116, 139);
        pdf.text(`Barra ${bar.bar_number}  •  Sobra: ${bar.waste_mm}mm (${(100 - bar.utilization_percent).toFixed(1)}%)`, M, y);
        y += 3;

        // Draw bar
        const barH = 7;
        const barW = CW;
        pdf.setDrawColor(203, 213, 225);
        pdf.setFillColor(248, 250, 252);
        pdf.roundedRect(M, y, barW, barH, 1, 1, "FD");

        // Draw pieces
        const colors = [
          [59, 130, 246],  // blue-500
          [99, 102, 241],  // indigo-500
          [139, 92, 246],  // violet-500
          [14, 165, 233],  // sky-500
          [6, 182, 212],   // cyan-500
          [34, 197, 94],   // green-500
        ];

        for (let pi = 0; pi < bar.pieces.length; pi++) {
          const piece = bar.pieces[pi];
          const px = M + (piece.position_mm / opt.bar_length_mm) * barW;
          const pw = (piece.length_mm / opt.bar_length_mm) * barW;
          const [r, g, b] = colors[pi % colors.length];
          pdf.setFillColor(r, g, b);
          if (pi === 0) {
            pdf.roundedRect(px, y, pw, barH, 1, 1, "F");
          } else {
            pdf.rect(px, y, pw, barH, "F");
          }

          // Piece label
          if (pw > 8) {
            pdf.setFont(FONT, "bold");
            pdf.setFontSize(5.5);
            pdf.setTextColor(255, 255, 255);
            pdf.text(String(piece.length_mm), px + pw / 2, y + barH / 2 + 1.5, { align: "center" });
          }
        }

        // Waste
        if (bar.waste_mm > 0) {
          const wasteX = M + ((opt.bar_length_mm - bar.waste_mm) / opt.bar_length_mm) * barW;
          const wasteW = (bar.waste_mm / opt.bar_length_mm) * barW;
          pdf.setFillColor(254, 202, 202); // red-200
          pdf.rect(wasteX, y, wasteW, barH, "F");
          if (wasteW > 8) {
            pdf.setFont(FONT, "normal");
            pdf.setFontSize(5);
            pdf.setTextColor(220, 38, 38);
            pdf.text(String(bar.waste_mm), wasteX + wasteW / 2, y + barH / 2 + 1.5, { align: "center" });
          }
        }

        y += barH + 3;
      }
      y += 3;
    }
  }

  // === 5. RESUMO POR PERFIL ===
  y = addSectionTitle(pdf, y, "5. Resumo por Perfil");

  const sumCols = [
    { x: M, w: 30 },
    { x: M + 31, w: 35 },
    { x: M + 67, w: 20 },
    { x: M + 88, w: 30 },
    { x: M + 119, w: 30 },
  ];
  y = drawTableRow(pdf, y, [
    { ...sumCols[0], text: "PERFIL" },
    { ...sumCols[1], text: "COMP. TOTAL (mm)", align: "right" },
    { ...sumCols[2], text: "BARRAS", align: "center" },
    { ...sumCols[3], text: "PESO/m (kg)", align: "right" },
    { ...sumCols[4], text: "PESO TOTAL (kg)", align: "right" },
  ], true);

  result.profiles_summary.forEach((p) => {
    y = drawTableRow(pdf, y, [
      { ...sumCols[0], text: p.profile_code },
      { ...sumCols[1], text: String(p.total_length_mm), align: "right" },
      { ...sumCols[2], text: String(p.total_bars_needed), align: "center" },
      { ...sumCols[3], text: p.weight_per_meter.toFixed(3), align: "right" },
      { ...sumCols[4], text: p.total_weight_kg.toFixed(3), align: "right" },
    ], false);
  });

  // Total row
  pdf.setFont(FONT, "bold");
  pdf.setFontSize(8);
  y += 2;
  pdf.text("TOTAL", M, y);
  pdf.text(
    String(result.profiles_summary.reduce((s, p) => s + p.total_bars_needed, 0)),
    sumCols[2].x + sumCols[2].w / 2,
    y,
    { align: "center" }
  );
  pdf.setTextColor(37, 99, 235);
  pdf.text(
    `${result.total_aluminum_weight_kg.toFixed(3)} kg`,
    sumCols[4].x + sumCols[4].w,
    y,
    { align: "right" }
  );
  pdf.setTextColor(0, 0, 0);

  y += 8;

  // === 6. PREVIEW SVG (via html2canvas) ===
  if (svgPreviewElementId) {
    const svgEl = document.getElementById(svgPreviewElementId);
    if (svgEl) {
      try {
        const canvas = await html2canvas(svgEl, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });
        const imgData = canvas.toDataURL("image/png");
        const imgW = CW * 0.6;
        const imgH = (canvas.height / canvas.width) * imgW;

        if (y + imgH + 10 > A4_H - M) {
          pdf.addPage();
          y = M;
        }

        y = addSectionTitle(pdf, y, "6. Preview da Esquadria");
        const centerX = M + (CW - imgW) / 2;
        pdf.addImage(imgData, "PNG", centerX, y, imgW, imgH);
        y += imgH + 4;
      } catch {
        // silently skip preview if html2canvas fails
      }
    }
  }

  // === FOOTER ===
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFont(FONT, "normal");
    pdf.setFontSize(6);
    pdf.setTextColor(160, 174, 192);
    pdf.text(`Página ${i}/${totalPages}`, A4_W - M, A4_H - 5, { align: "right" });
    pdf.text(`Gerado em ${dateStr} — Sistema de Cálculo de Esquadrias`, M, A4_H - 5);
  }

  pdf.save(`lista-corte-${result.typology_name.replace(/\s+/g, "-").toLowerCase()}-${result.input.width_mm}x${result.input.height_mm}.pdf`);
}
