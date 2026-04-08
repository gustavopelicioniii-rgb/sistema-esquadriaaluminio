import { jsPDF } from "jspdf";
import type { CutRule, GlassRule, TypologyComponent, Typology } from "@/types/calculation";

const MARGIN = 14;
const PW = 210;
const PH = 297;
const CW = PW - MARGIN * 2;

const C = {
  primary: [37, 99, 235] as [number, number, number],
  dark: [15, 23, 42] as [number, number, number],
  text: [51, 65, 85] as [number, number, number],
  muted: [120, 130, 150] as [number, number, number],
  border: [210, 218, 230] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  headerBg: [239, 246, 255] as [number, number, number],
  stripeBg: [248, 250, 252] as [number, number, number],
};

interface TypologyPdfData {
  typology: Typology;
  lineName?: string;
  cutRules: CutRule[];
  glassRules: GlassRule[];
  components: TypologyComponent[];
}

export function generateTypologyDetailPdf(data: TypologyPdfData) {
  const { typology, lineName, cutRules, glassRules, components } = data;
  const pdf = new jsPDF("p", "mm", "a4");
  let y = MARGIN;

  const ensureSpace = (need: number) => {
    if (y + need > PH - MARGIN) {
      pdf.addPage();
      y = MARGIN;
    }
  };

  // ── Header ──
  pdf.setFillColor(...C.primary);
  pdf.rect(0, 0, PW, 28, "F");
  pdf.setTextColor(...C.white);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text(typology.name, MARGIN, 12);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text(typology.id.toUpperCase(), MARGIN, 18);
  if (lineName) pdf.text(`Linha: ${lineName}`, MARGIN, 24);

  const cats: string[] = [];
  const CATEGORIES: Record<string, string> = {
    janela: "Janela", porta: "Porta", vitro: "Vitrô", veneziana: "Veneziana",
    maxim_ar: "Maxim-Ar", camarao: "Camarão", pivotante: "Pivotante",
    basculante: "Basculante", fachada: "Fachada",
  };
  cats.push(CATEGORIES[typology.category] || typology.category);
  cats.push(`${typology.num_folhas} Folha${typology.num_folhas !== 1 ? "s" : ""}`);
  if (typology.has_veneziana) cats.push("Veneziana");
  if (typology.has_bandeira) cats.push("Bandeira");
  pdf.text(cats.join("  •  "), PW - MARGIN, 18, { align: "right" });

  y = 34;

  // Dimensions
  if (typology.min_width_mm || typology.max_width_mm || typology.min_height_mm || typology.max_height_mm) {
    pdf.setTextColor(...C.text);
    pdf.setFontSize(8);
    const dimText = `Largura: ${typology.min_width_mm ?? "–"} – ${typology.max_width_mm ?? "–"} mm   |   Altura: ${typology.min_height_mm ?? "–"} – ${typology.max_height_mm ?? "–"} mm`;
    pdf.text(dimText, MARGIN, y);
    y += 6;
  }
  if (typology.notes) {
    pdf.setTextColor(...C.muted);
    pdf.setFontSize(7);
    pdf.text(typology.notes, MARGIN, y);
    y += 6;
  }

  // ── Table helper ──
  const drawTable = (title: string, headers: string[], rows: string[][], colWidths: number[]) => {
    const rowH = 5.5;
    const headerH = 7;
    const titleH = 8;
    const totalH = titleH + headerH + rows.length * rowH + 4;
    ensureSpace(Math.min(totalH, 60));

    // Section title
    pdf.setFillColor(...C.primary);
    pdf.rect(MARGIN, y, 3, 6, "F");
    pdf.setTextColor(...C.dark);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text(title, MARGIN + 6, y + 5);
    y += titleH + 2;

    // Header row
    pdf.setFillColor(...C.headerBg);
    pdf.rect(MARGIN, y, CW, headerH, "F");
    pdf.setTextColor(...C.primary);
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "bold");
    let x = MARGIN + 2;
    headers.forEach((h, i) => {
      pdf.text(h, x, y + 5);
      x += colWidths[i];
    });
    y += headerH;

    // Rows
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...C.text);
    rows.forEach((row, ri) => {
      ensureSpace(rowH + 2);
      if (ri % 2 === 1) {
        pdf.setFillColor(...C.stripeBg);
        pdf.rect(MARGIN, y, CW, rowH, "F");
      }
      pdf.setFontSize(7);
      let rx = MARGIN + 2;
      row.forEach((cell, ci) => {
        const maxW = colWidths[ci] - 2;
        const truncated = pdf.getTextWidth(cell) > maxW ? cell.substring(0, Math.floor(cell.length * maxW / pdf.getTextWidth(cell))) : cell;
        pdf.text(truncated, rx, y + 4);
        rx += colWidths[ci];
      });
      y += rowH;
    });

    // Bottom border
    pdf.setDrawColor(...C.border);
    pdf.setLineWidth(0.3);
    pdf.line(MARGIN, y, MARGIN + CW, y);
    y += 6;
  };

  // ── Cut Rules ──
  if (cutRules.length > 0) {
    const headers = ["Peça", "Perfil", "Ref.", "Constante", "Ângulos", "Qtd"];
    const widths = [38, 28, 22, 26, 30, 18];
    const factor = CW / widths.reduce((a, b) => a + b, 0);
    const scaled = widths.map(w => w * factor);
    const rows = cutRules.map(r => [
      r.piece_name,
      r.profile_code || "",
      `${r.reference_dimension}${r.coefficient !== 1 ? ` ×${r.coefficient}` : ""}`,
      `${r.constant_mm > 0 ? "+" : ""}${r.constant_mm} mm`,
      `${r.cut_angle_left}° / ${r.cut_angle_right}°`,
      r.quantity_formula,
    ]);
    drawTable(`Regras de Corte (${cutRules.length})`, headers, rows, scaled);
  }

  // ── Glass Rules ──
  if (glassRules.length > 0) {
    const headers = ["Nome", "Largura", "Altura", "Qtd", "Tipo", "Espessura"];
    const widths = [34, 28, 28, 14, 30, 28];
    const factor = CW / widths.reduce((a, b) => a + b, 0);
    const scaled = widths.map(w => w * factor);
    const rows = glassRules.map(r => [
      r.glass_name,
      `${r.width_reference} ${r.width_constant_mm > 0 ? "+" : ""}${r.width_constant_mm}mm`,
      `${r.height_reference} ${r.height_constant_mm > 0 ? "+" : ""}${r.height_constant_mm}mm`,
      String(r.quantity),
      r.glass_type || "–",
      r.min_thickness_mm || r.max_thickness_mm ? `${r.min_thickness_mm ?? "–"}–${r.max_thickness_mm ?? "–"}mm` : "–",
    ]);
    drawTable(`Regras de Vidro (${glassRules.length})`, headers, rows, scaled);
  }

  // ── Components ──
  if (components.length > 0) {
    const headers = ["Componente", "Código", "Tipo", "Qtd", "Unidade"];
    const widths = [40, 30, 32, 20, 20];
    const factor = CW / widths.reduce((a, b) => a + b, 0);
    const scaled = widths.map(w => w * factor);
    const rows = components.map(c => [
      c.component_name,
      c.component_code || "–",
      c.component_type,
      c.quantity_formula,
      c.unit,
    ]);
    drawTable(`Componentes (${components.length})`, headers, rows, scaled);
  }

  // ── Footer ──
  const pages = pdf.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(7);
    pdf.setTextColor(...C.muted);
    pdf.text(`Página ${i} de ${pages}`, PW - MARGIN, PH - 8, { align: "right" });
    pdf.text(`Gerado em ${new Date().toLocaleDateString("pt-BR")}`, MARGIN, PH - 8);
  }

  pdf.save(`tipologia-${typology.id}.pdf`);
}
