import { jsPDF } from "jspdf";

interface ReportOptions {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: string[][];
  filename: string;
  columnWidths?: number[];
  summaryCards?: { label: string; value: string }[];
}

const COLORS = {
  primary: [59, 130, 246] as [number, number, number],
  primaryLight: [239, 246, 255] as [number, number, number],
  dark: [15, 23, 42] as [number, number, number],
  muted: [100, 116, 139] as [number, number, number],
  border: [226, 232, 240] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  bg: [248, 250, 252] as [number, number, number],
  green: [34, 197, 94] as [number, number, number],
  red: [239, 68, 68] as [number, number, number],
  yellow: [245, 158, 11] as [number, number, number],
};

const MARGIN = 15;
const PAGE_WIDTH = 210;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function addHeader(doc: jsPDF, title: string, subtitle?: string) {
  // Header bar
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, PAGE_WIDTH, 28, "F");

  doc.setTextColor(...COLORS.white);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(title, MARGIN, 13);

  if (subtitle) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(subtitle, MARGIN, 20);
  }

  // Date
  const dateStr = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());
  doc.setFontSize(8);
  doc.text(dateStr, PAGE_WIDTH - MARGIN, 13, { align: "right" });
  doc.text("Gerado pelo sistema", PAGE_WIDTH - MARGIN, 20, { align: "right" });
}

function addFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  const y = 290;
  doc.setDrawColor(...COLORS.border);
  doc.line(MARGIN, y - 4, PAGE_WIDTH - MARGIN, y - 4);
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.muted);
  doc.text("Relatório gerado automaticamente", MARGIN, y);
  doc.text(`Página ${pageNum} de ${totalPages}`, PAGE_WIDTH - MARGIN, y, { align: "right" });
}

function addSummaryCards(doc: jsPDF, cards: { label: string; value: string }[], startY: number): number {
  const cardWidth = (CONTENT_WIDTH - (cards.length - 1) * 4) / cards.length;
  const cardHeight = 22;

  cards.forEach((card, i) => {
    const x = MARGIN + i * (cardWidth + 4);
    // Card background
    doc.setFillColor(...COLORS.bg);
    doc.setDrawColor(...COLORS.border);
    doc.roundedRect(x, startY, cardWidth, cardHeight, 2, 2, "FD");

    // Value
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.dark);
    doc.text(card.value, x + cardWidth / 2, startY + 10, { align: "center" });

    // Label
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.muted);
    doc.text(card.label, x + cardWidth / 2, startY + 17, { align: "center" });
  });

  return startY + cardHeight + 8;
}

export function generateReportPdf(options: ReportOptions) {
  const { title, subtitle, headers, rows, filename, summaryCards } = options;

  const doc = new jsPDF("p", "mm", "a4");
  const totalCols = headers.length;

  // Calculate column widths
  const colWidths = options.columnWidths || headers.map(() => CONTENT_WIDTH / totalCols);

  let currentY = 34;

  addHeader(doc, title, subtitle);

  // Summary cards
  if (summaryCards && summaryCards.length > 0) {
    currentY = addSummaryCards(doc, summaryCards, currentY);
  }

  // Table header
  const drawTableHeader = (y: number) => {
    doc.setFillColor(...COLORS.primary);
    let x = MARGIN;
    headers.forEach((header, i) => {
      doc.rect(x, y, colWidths[i], 8, "F");
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...COLORS.white);
      doc.text(header, x + 2, y + 5.5);
      x += colWidths[i];
    });
    return y + 8;
  };

  currentY = drawTableHeader(currentY);

  let pageCount = 1;

  // Table rows
  rows.forEach((row, rowIndex) => {
    if (currentY > 275) {
      doc.addPage();
      pageCount++;
      addHeader(doc, title, subtitle);
      currentY = 34;
      currentY = drawTableHeader(currentY);
    }

    const rowHeight = 7;
    const isEven = rowIndex % 2 === 0;

    let x = MARGIN;
    row.forEach((cell, colIndex) => {
      // Alternating row background
      if (isEven) {
        doc.setFillColor(...COLORS.bg);
        doc.rect(x, currentY, colWidths[colIndex], rowHeight, "F");
      }

      // Cell border bottom
      doc.setDrawColor(...COLORS.border);
      doc.line(x, currentY + rowHeight, x + colWidths[colIndex], currentY + rowHeight);

      // Cell text
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...COLORS.dark);

      // Truncate text if too long
      const maxChars = Math.floor(colWidths[colIndex] / 1.8);
      const text = cell.length > maxChars ? cell.substring(0, maxChars - 1) + "…" : cell;
      doc.text(text, x + 2, currentY + 4.8);

      x += colWidths[colIndex];
    });

    currentY += rowHeight;
  });

  // Total row count
  currentY += 4;
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.muted);
  doc.text(`Total: ${rows.length} registros`, MARGIN, currentY);

  // Add footers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }

  doc.save(filename);
}
