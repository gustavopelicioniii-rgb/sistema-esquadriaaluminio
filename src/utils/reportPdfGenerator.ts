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
  primary: [37, 99, 235] as [number, number, number],
  primaryDark: [29, 78, 216] as [number, number, number],
  dark: [15, 23, 42] as [number, number, number],
  text: [51, 65, 85] as [number, number, number],
  muted: [148, 163, 184] as [number, number, number],
  border: [226, 232, 240] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  bg: [248, 250, 252] as [number, number, number],
  cardBg: [241, 245, 249] as [number, number, number],
  headerRow: [239, 246, 255] as [number, number, number],
  accent: [59, 130, 246] as [number, number, number],
};

const MARGIN = 18;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function drawRoundedRect(doc: jsPDF, x: number, y: number, w: number, h: number, r: number, style: "F" | "S" | "FD") {
  doc.roundedRect(x, y, w, h, r, r, style);
}

function addHeader(doc: jsPDF, title: string, subtitle?: string) {
  // Gradient-like header with two rects
  doc.setFillColor(...COLORS.primaryDark);
  doc.rect(0, 0, PAGE_WIDTH, 32, "F");
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, PAGE_WIDTH, 30, "F");

  // Decorative accent line at bottom of header
  doc.setFillColor(...COLORS.primaryDark);
  doc.rect(0, 30, PAGE_WIDTH, 2, "F");

  // Title
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text(title, MARGIN, 14);

  if (subtitle) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(255, 255, 255);
    doc.text(subtitle, MARGIN, 22);
  }

  // Right side info
  const dateStr = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 220, 255);
  doc.text(dateStr, PAGE_WIDTH - MARGIN, 14, { align: "right" });

  const timeStr = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
  doc.text(`Gerado às ${timeStr}`, PAGE_WIDTH - MARGIN, 21, { align: "right" });
}

function addFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  const y = PAGE_HEIGHT - 12;

  // Footer line
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y - 3, PAGE_WIDTH - MARGIN, y - 3);

  doc.setFontSize(7);
  doc.setTextColor(...COLORS.muted);
  doc.setFont("helvetica", "normal");
  doc.text("AluFlow · Relatório gerado automaticamente", MARGIN, y);
  doc.text(`Página ${pageNum} de ${totalPages}`, PAGE_WIDTH - MARGIN, y, { align: "right" });
}

function addSummaryCards(doc: jsPDF, cards: { label: string; value: string }[], startY: number): number {
  const gap = 5;
  const maxCards = Math.min(cards.length, 4);
  const cardWidth = (CONTENT_WIDTH - (maxCards - 1) * gap) / maxCards;
  const cardHeight = 26;

  cards.slice(0, maxCards).forEach((card, i) => {
    const x = MARGIN + i * (cardWidth + gap);

    // Card shadow
    doc.setFillColor(0, 0, 0);
    doc.setGState(new (doc as any).GState({ opacity: 0.04 }));
    drawRoundedRect(doc, x + 0.5, startY + 0.8, cardWidth, cardHeight, 3, "F");
    doc.setGState(new (doc as any).GState({ opacity: 1 }));

    // Card background
    doc.setFillColor(...COLORS.white);
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.3);
    drawRoundedRect(doc, x, startY, cardWidth, cardHeight, 3, "FD");

    // Top accent line
    doc.setFillColor(...COLORS.accent);
    doc.rect(x + 8, startY, cardWidth - 16, 1.2, "F");

    // Value
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.dark);
    doc.text(card.value, x + cardWidth / 2, startY + 12, { align: "center" });

    // Label
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.muted);
    doc.text(card.label.toUpperCase(), x + cardWidth / 2, startY + 19, { align: "center" });
  });

  return startY + cardHeight + 10;
}

export function generateReportPdf(options: ReportOptions) {
  const { title, subtitle, headers, rows, filename, summaryCards } = options;

  const doc = new jsPDF("p", "mm", "a4");
  const totalCols = headers.length;

  // Calculate column widths
  const colWidths = options.columnWidths || headers.map(() => CONTENT_WIDTH / totalCols);

  let currentY = 38;

  addHeader(doc, title, subtitle);

  // Summary cards
  if (summaryCards && summaryCards.length > 0) {
    currentY = addSummaryCards(doc, summaryCards, currentY);
  }

  // Section label
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.dark);
  doc.text("DADOS", MARGIN, currentY);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.muted);
  doc.text(`${rows.length} registros`, MARGIN + 16, currentY);
  currentY += 5;

  // Table header
  const ROW_HEIGHT = 8;
  const HEADER_HEIGHT = 9;

  const drawTableHeader = (y: number) => {
    doc.setFillColor(...COLORS.primary);
    drawRoundedRect(doc, MARGIN, y, CONTENT_WIDTH, HEADER_HEIGHT, 2, "F");

    let x = MARGIN;
    headers.forEach((header, i) => {
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...COLORS.white);
      doc.text(header.toUpperCase(), x + 3, y + 6);
      x += colWidths[i];
    });
    return y + HEADER_HEIGHT;
  };

  currentY = drawTableHeader(currentY);

  let pageCount = 1;

  // Table rows
  rows.forEach((row, rowIndex) => {
    if (currentY > PAGE_HEIGHT - 25) {
      doc.addPage();
      pageCount++;
      addHeader(doc, title, subtitle);
      currentY = 38;
      currentY = drawTableHeader(currentY);
    }

    const isEven = rowIndex % 2 === 0;

    // Row background
    if (isEven) {
      doc.setFillColor(...COLORS.bg);
      doc.rect(MARGIN, currentY, CONTENT_WIDTH, ROW_HEIGHT, "F");
    }

    // Bottom border
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.15);
    doc.line(MARGIN, currentY + ROW_HEIGHT, MARGIN + CONTENT_WIDTH, currentY + ROW_HEIGHT);

    let x = MARGIN;
    row.forEach((cell, colIndex) => {
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...COLORS.text);

      // Truncate text if too long
      const maxChars = Math.floor(colWidths[colIndex] / 1.7);
      const text = cell.length > maxChars ? cell.substring(0, maxChars - 1) + "…" : cell;
      doc.text(text, x + 3, currentY + 5.2);

      x += colWidths[colIndex];
    });

    currentY += ROW_HEIGHT;
  });

  // Bottom summary bar
  currentY += 4;
  doc.setFillColor(...COLORS.cardBg);
  drawRoundedRect(doc, MARGIN, currentY, CONTENT_WIDTH, 8, 2, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.text);
  doc.text(`Total: ${rows.length} registros`, MARGIN + 3, currentY + 5.2);

  const dateStr = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.muted);
  doc.text(`Exportado em ${dateStr}`, PAGE_WIDTH - MARGIN - 3, currentY + 5.2, { align: "right" });

  // Add footers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }

  doc.save(filename);
}
