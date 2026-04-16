// Manufacturing Drawing Generator
// Creates detailed technical drawings for fabrication

import type { CalculationOutput } from "@/types/calculation";

export interface DrawingOptions {
  title: string;
  projectName?: string;
  clientName?: string;
  scale?: number;
  showDimensions?: boolean;
  showNotes?: boolean;
  format?: "A4" | "A3" | "A2";
}

export interface DrawingData {
  width: number;
  height: number;
  typologyName: string;
  category: string;
  subcategory: string;
  numFolhas: number;
  pieces: {
    name: string;
    code: string;
    quantity: number;
    length: number;
    profile: string;
    cuts: { angle: number; description: string }[];
  }[];
  totalWeight: number;
  notes?: string;
}

// Generate SVG Drawing
export function generateFabricationDrawing(
  data: DrawingData,
  options: DrawingOptions
): string {
  const { width, height, typologyName, category, numFolhas, pieces, totalWeight, notes } = data;
  const { title, projectName, clientName, scale = 1, showDimensions = true } = options;

  // Drawing area dimensions
  const dw = 400 * scale;
  const dh = 300 * scale;
  const padding = 30 * scale;
  const labelFontSize = 8 * scale;
  const titleFontSize = 12 * scale;

  // Calculate frame thickness
  const frameThickness = Math.min(dw, dh) * 0.05;

  // Calculate leaf dimensions for multi-leaf windows
  const leafWidth = (dw - 2 * padding - frameThickness * 2) / numFolhas;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dw + 100} ${dh + 200}" width="${dw + 100}" height="${dh + 200}">`;
  
  // Background
  svg += `<rect width="100%" height="100%" fill="white"/>`;
  
  // Title
  svg += `<text x="${(dw + 100) / 2}" y="25" text-anchor="middle" font-family="Arial" font-size="${titleFontSize}" font-weight="bold">${title}</text>`;
  svg += `<text x="${(dw + 100) / 2}" y="40" text-anchor="middle" font-family="Arial" font-size="${labelFontSize}">${typologyName}</text>`;

  if (projectName || clientName) {
    svg += `<text x="${(dw + 100) / 2}" y="55" text-anchor="middle" font-family="Arial" font-size="${labelFontSize * 0.9}">${projectName || ""} ${clientName ? ` - ${clientName}` : ""}</text>`;
  }

  // Main frame
  svg += `<rect x="${padding}" y="${padding + 60}" width="${dw}" height="${dh}" fill="none" stroke="black" stroke-width="2"/>`;

  // Inner frame (glass area)
  svg += `<rect x="${padding + frameThickness}" y="${padding + 60 + frameThickness}" width="${dw - 2 * frameThickness}" height="${dh - 2 * frameThickness}" fill="none" stroke="black" stroke-width="1"/>`;

  // Leaf divisions
  for (let i = 1; i < numFolhas; i++) {
    const x = padding + frameThickness + leafWidth * i;
    svg += `<line x1="${x}" y1="${padding + 60 + frameThickness}" x2="${x}" y2="${padding + 60 + dh - frameThickness}" stroke="black" stroke-width="1"/>`;
  }

  // Dimension lines
  if (showDimensions) {
    // Width dimension
    svg += `<line x1="${padding}" y1="${padding + 60 + dh + 15}" x2="${padding + dw}" y2="${padding + 60 + dh + 15}" stroke="black" stroke-width="0.5"/>`;
    svg += `<line x1="${padding}" y1="${padding + 60 + dh + 10}" x2="${padding}" y2="${padding + 60 + dh + 20}" stroke="black" stroke-width="0.5"/>`;
    svg += `<line x1="${padding + dw}" y1="${padding + 60 + dh + 10}" x2="${padding + dw}" y2="${padding + 60 + dh + 20}" stroke="black" stroke-width="0.5"/>`;
    svg += `<text x="${padding + dw / 2}" y="${padding + 60 + dh + 28}" text-anchor="middle" font-family="Arial" font-size="${labelFontSize}">${width} mm</text>`;

    // Height dimension
    svg += `<line x1="${padding - 15}" y1="${padding + 60}" x2="${padding - 15}" y2="${padding + 60 + dh}" stroke="black" stroke-width="0.5"/>`;
    svg += `<line x1="${padding - 20}" y1="${padding + 60}" x2="${padding - 10}" y2="${padding + 60}" stroke="black" stroke-width="0.5"/>`;
    svg += `<line x1="${padding - 20}" y1="${padding + 60 + dh}" x2="${padding - 10}" y2="${padding + 60 + dh}" stroke="black" stroke-width="0.5"/>`;
    svg += `<text x="${padding - 25}" y="${padding + 60 + dh / 2}" text-anchor="middle" font-family="Arial" font-size="${labelFontSize}" transform="rotate(-90 ${padding - 25} ${padding + 60 + dh / 2})">${height} mm</text>`;
  }

  // Piece list
  let yPos = padding + 60 + dh + 60;
  svg += `<text x="${padding}" y="${yPos}" font-family="Arial" font-size="${titleFontSize}" font-weight="bold">Lista de Peças:</text>`;
  
  yPos += 15;
  svg += `<line x1="${padding}" y1="${yPos}" x2="${dw - padding}" y2="${yPos}" stroke="black" stroke-width="0.5"/>`;
  
  yPos += 5;
  svg += `<text x="${padding}" y="${yPos}" font-family="Arial" font-size="${labelFontSize}" font-weight="bold">Código</text>`;
  svg += `<text x="${padding + 100}" y="${yPos}" font-family="Arial" font-size="${labelFontSize}" font-weight="bold">Descrição</text>`;
  svg += `<text x="${padding + 250}" y="${yPos}" font-family="Arial" font-size="${labelFontSize}" font-weight="bold">Qtd</text>`;
  svg += `<text x="${padding + 300}" y="${yPos}" font-family="Arial" font-size="${labelFontSize}" font-weight="bold">Medida</text>`;

  yPos += 15;
  for (const piece of pieces) {
    svg += `<text x="${padding}" y="${yPos}" font-family="Arial" font-size="${labelFontSize}">${piece.code}</text>`;
    svg += `<text x="${padding + 100}" y="${yPos}" font-family="Arial" font-size="${labelFontSize}">${piece.name}</text>`;
    svg += `<text x="${padding + 250}" y="${yPos}" font-family="Arial" font-size="${labelFontSize}">${piece.quantity}x</text>`;
    svg += `<text x="${padding + 300}" y="${yPos}" font-family="Arial" font-size="${labelFontSize}">${piece.length}mm</text>`;
    yPos += 12;
  }

  // Total weight
  yPos += 10;
  svg += `<line x1="${padding}" y1="${yPos}" x2="${dw - padding}" y2="${yPos}" stroke="black" stroke-width="0.5"/>`;
  yPos += 10;
  svg += `<text x="${padding}" y="${yPos}" font-family="Arial" font-size="${labelFontSize}">Peso Total Estimado: <tspan font-weight="bold">${totalWeight.toFixed(2)} kg</tspan></text>`;

  // Notes
  if (notes) {
    yPos += 20;
    svg += `<text x="${padding}" y="${yPos}" font-family="Arial" font-size="${labelFontSize}" font-style="italic">Observações: ${notes}</text>`;
  }

  // Footer
  svg += `<text x="${(dw + 100) / 2}" y="${dh + 190}" text-anchor="middle" font-family="Arial" font-size="${labelFontSize * 0.8}">Gerado por AluFlow - ${new Date().toLocaleDateString("pt-BR")}</text>`;

  svg += `</svg>`;
  return svg;
}

// Generate PDF-ready data structure
export function generateDrawingPDFData(
  calculation: CalculationOutput,
  options: DrawingOptions
): DrawingData {
  const pieces = calculation.cuts.map((cut, index) => ({
    name: cut.piece_name,
    code: cut.profile_code || `COR-${String(index + 1).padStart(3, "0")}`,
    quantity: cut.quantity,
    length: cut.cut_length_mm,
    profile: cut.profile_code || "N/A",
    cuts: [{ angle: 90, description: "Corte reto" }],
  }));

  const totalWeight = calculation.cuts.reduce(
    (sum, cut) => sum + (cut.weight_kg_m || 0) * (cut.cut_length_mm / 1000) * cut.quantity,
    0
  );

  return {
    width: calculation.dimensions?.width_mm || 0,
    height: calculation.dimensions?.height_mm || 0,
    typologyName: calculation.typology_name || "Janela",
    category: calculation.category || "janela",
    subcategory: calculation.subcategory || "correr",
    numFolhas: calculation.num_folhas || 2,
    pieces,
    totalWeight,
    notes: calculation.notes,
  };
}
