// Manufacturing Drawing Generator - Enhanced
// Creates detailed technical drawings for aluminum frame fabrication

import type { CalculationOutput } from '@/types/calculation';

export interface DrawingOptions {
  title: string;
  projectName?: string;
  clientName?: string;
  scale?: number;
  showDimensions?: boolean;
  showNotes?: boolean;
  showGrid?: boolean;
  format?: 'A4' | 'A3' | 'A2' | 'custom';
  orientation?: 'portrait' | 'landscape';
}

export interface DrawingData {
  width: number;
  height: number;
  typologyName: string;
  category: string;
  subcategory: string;
  numFolhas: number;
  pieces: DrawingPiece[];
  totalWeight: number;
  glassArea?: number;
  notes?: string;
  client?: string;
  date?: string;
}

export interface DrawingPiece {
  name: string;
  code: string;
  quantity: number;
  length: number;
  profile: string;
  profileType?: string;
  cuts: CutInfo[];
  material?: string;
  finish?: string;
}

export interface CutInfo {
  angle: number;
  description: string;
  position?: number;
}

// Drawing view types
export type DrawingViewType = 'front' | 'section' | 'detail' | 'assembly' | 'profile';

// Generate professional SVG front view
export function generateFrontView(data: DrawingData, options: DrawingOptions): string {
  const { width, height, typologyName, numFolhas } = data;
  const { title, projectName, clientName, scale = 1, showGrid = false, format = 'A4' } = options;

  const dw = format === 'A4' ? 190 * scale : 277 * scale;
  const dh = format === 'A4' ? 277 * scale : 190 * scale;
  const padding = 15 * scale;
  const labelFontSize = 3 * scale;
  const titleFontSize = 5 * scale;
  const smallFont = 2.5 * scale;

  const frameThickness = Math.min(dw, dh) * 0.04;
  const leafWidth = (dw - 2 * padding - frameThickness * 2) / numFolhas;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dw} ${dh}" width="${dw}" height="${dh}">`;

  // White background
  svg += `<rect width="100%" height="100%" fill="white"/>`;

  // Grid
  if (showGrid) {
    svg += `<defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f0f0f0" stroke-width="0.5"/></pattern></defs>`;
    svg += `<rect width="100%" height="100%" fill="url(#grid)"/>`;
  }

  // Border
  svg += `<rect x="5" y="5" width="${dw - 10}" height="${dh - 10}" fill="none" stroke="black" stroke-width="0.5"/>`;

  // Title block
  svg += `<rect x="5" y="${dh - 25}" width="${dw - 10}" height="20" fill="none" stroke="black" stroke-width="0.5"/>`;
  svg += `<text x="${dw / 2}" y="${dh - 18}" text-anchor="middle" font-family="Arial" font-size="${titleFontSize}" font-weight="bold">${title}</text>`;
  svg += `<text x="${dw / 2}" y="${dh - 12}" text-anchor="middle" font-family="Arial" font-size="${smallFont}">${typologyName}</text>`;
  if (projectName || clientName) {
    svg += `<text x="${dw / 2}" y="${dh - 7}" text-anchor="middle" font-family="Arial" font-size="${smallFont}">${projectName || ''}${clientName ? ` | ${clientName}` : ''}</text>`;
  }

  // Main frame
  const frameX = padding + 20;
  const frameY = padding + 10;
  const frameW = dw - 2 * padding - 40;
  const frameH = dh - 2 * padding - 50;

  svg += `<rect x="${frameX}" y="${frameY}" width="${frameW}" height="${frameH}" fill="none" stroke="black" stroke-width="1.5"/>`;

  // Outer frame (main frame profile)
  svg += `<rect x="${frameX}" y="${frameY}" width="${frameW}" height="${frameH}" fill="none" stroke="#333" stroke-width="3"/>`;

  // Inner frame
  svg += `<rect x="${frameX + frameThickness}" y="${frameY + frameThickness}" width="${frameW - 2 * frameThickness}" height="${frameH - 2 * frameThickness}" fill="none" stroke="black" stroke-width="1"/>`;

  // Glass area (hatched)
  svg += `<rect x="${frameX + frameThickness}" y="${frameY + frameThickness}" width="${frameW - 2 * frameThickness}" height="${frameH - 2 * frameThickness}" fill="#e8f4fc" stroke="none"/>`;

  // Leaf divisions
  for (let i = 1; i < numFolhas; i++) {
    const x = frameX + frameThickness + leafWidth * i;
    svg += `<line x1="${x}" y1="${frameY + frameThickness}" x2="${x}" y2="${frameY + frameH - frameThickness}" stroke="black" stroke-width="1"/>`;
  }

  // Handle indicators for sliding windows
  if (data.subcategory === 'correr' || data.subcategory === 'deslizante') {
    const handleY = frameY + frameH / 2;
    for (let i = 0; i < numFolhas; i++) {
      const handleX = frameX + frameThickness + leafWidth * (i + 0.5);
      svg += `<circle cx="${handleX}" cy="${handleY}" r="2" fill="none" stroke="#666" stroke-width="0.5"/>`;
      svg += `<line x1="${handleX - 1.5}" y1="${handleY}" x2="${handleX + 1.5}" y2="${handleY}" stroke="#666" stroke-width="0.5"/>`;
    }
  }

  // Dimension lines
  // Width
  const dimY1 = frameY + frameH + 8;
  const dimY2 = frameY + frameH + 15;
  svg += `<line x1="${frameX}" y1="${dimY1}" x2="${frameX + frameW}" y2="${dimY1}" stroke="black" stroke-width="0.3"/>`;
  svg += `<line x1="${frameX}" y1="${dimY1 - 2}" x2="${frameX}" y2="${dimY2}" stroke="black" stroke-width="0.3"/>`;
  svg += `<line x1="${frameX + frameW}" y1="${dimY1 - 2}" x2="${frameX + frameW}" y2="${dimY2}" stroke="black" stroke-width="0.3"/>`;
  svg += `<text x="${frameX + frameW / 2}" y="${dimY1 + 3}" text-anchor="middle" font-family="Arial" font-size="${labelFontSize}">${width} mm</text>`;

  // Height
  const dimX1 = frameX - 8;
  const dimX2 = frameX - 15;
  svg += `<line x1="${dimX1}" y1="${frameY}" x2="${dimX1}" y2="${frameY + frameH}" stroke="black" stroke-width="0.3"/>`;
  svg += `<line x1="${dimX1 - 2}" y1="${frameY}" x2="${dimX2}" y2="${frameY}" stroke="black" stroke-width="0.3"/>`;
  svg += `<line x1="${dimX1 - 2}" y1="${frameY + frameH}" x2="${dimX2}" y2="${frameY + frameH}" stroke="black" stroke-width="0.3"/>`;
  svg += `<text x="${dimX1 - 5}" y="${frameY + frameH / 2}" text-anchor="middle" font-family="Arial" font-size="${labelFontSize}" transform="rotate(-90 ${dimX1 - 5} ${frameY + frameH / 2})">${height} mm</text>`;

  // Glass dimension
  const glassW = frameW - 2 * frameThickness;
  const glassH = frameH - 2 * frameThickness;
  svg += `<text x="${frameX + frameThickness + glassW / 2}" y="${frameY + frameThickness + glassH / 2 + 1}" text-anchor="middle" font-family="Arial" font-size="${smallFont}" fill="#666">${glassW.toFixed(0)} x ${glassH.toFixed(0)}</text>`;

  svg += `</svg>`;
  return svg;
}

// Generate section view with profile details
export function generateSectionView(data: DrawingPiece, options: DrawingOptions): string {
  const { scale = 2, format = 'A4' } = options;

  const dw = format === 'A4' ? 190 * scale : 277 * scale;
  const dh = 60 * scale;
  const padding = 10;

  // Profile cross-section dimensions
  const profileW = 40;
  const profileH = 20;
  const centerX = dw / 2;
  const centerY = dh / 2;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dw} ${dh}" width="${dw}" height="${dh}">`;

  svg += `<rect width="100%" height="100%" fill="white"/>`;

  // Title
  svg += `<text x="${centerX}" y="8" text-anchor="middle" font-family="Arial" font-size="4" font-weight="bold">SEÇÃO ${piece.code}</text>`;

  // Profile outline (T-shaped for main frame)
  const x = centerX - profileW / 2;
  const y = centerY - profileH / 2;

  // T-profile shape
  svg += `<path d="M${x},${y - 5} L${x + profileW},${y - 5} L${x + profileW},${y} L${x + profileW / 2 + 5},${y} L${x + profileW / 2 + 5},${y + profileH} L${x + profileW / 2 - 5},${y + profileH} L${x + profileW / 2 - 5},${y} L${x},${y} Z" fill="none" stroke="black" stroke-width="0.5"/>`;

  // Dimensions
  svg += `<line x1="${x}" y1="${y - 8}" x2="${x + profileW}" y2="${y - 8}" stroke="black" stroke-width="0.3"/>`;
  svg += `<line x1="${x}" y1="${y - 10}" x2="${x}" y2="${y - 6}" stroke="black" stroke-width="0.3"/>`;
  svg += `<line x1="${x + profileW}" y1="${y - 10}" x2="${x + profileW}" y2="${y - 6}" stroke="black" stroke-width="0.3"/>`;
  svg += `<text x="${centerX}" y="${y - 9}" text-anchor="middle" font-family="Arial" font-size="2.5">${profileW}mm</text>`;

  // Info
  svg += `<text x="${centerX}" y="${centerY + 15}" text-anchor="middle" font-family="Arial" font-size="2.5">${piece.profile}</text>`;

  svg += `</svg>`;
  return svg;
}

// Generate piece detail with cuts
export function generatePieceDetail(
  piece: DrawingPiece,
  index: number,
  options: DrawingOptions
): string {
  const { scale = 1.5 } = options;

  const length = Math.min((piece.length * scale) / 10, 300);
  const height = 30;
  const padding = 10;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${length + padding * 2} ${height + 40}" width="${length + padding * 2}" height="${height + 40}">`;

  svg += `<rect width="100%" height="100%" fill="white"/>`;

  // Title
  svg += `<text x="${(length + padding * 2) / 2}" y="8" text-anchor="middle" font-family="Arial" font-size="3" font-weight="bold">Peça #${index + 1}: ${piece.name}</text>`;

  // Profile bar
  svg += `<rect x="${padding}" y="15" width="${length}" height="${height}" fill="#e0e0e0" stroke="black" stroke-width="0.5"/>`;

  // End marks
  svg += `<line x1="${padding}" y1="12" x2="${padding}" y2="18" stroke="black" stroke-width="0.5"/>`;
  svg += `<line x1="${padding + length}" y1="12" x2="${padding + length}" y2="18" stroke="black" stroke-width="0.5"/>`;

  // Cut marks
  if (piece.cuts.length > 0) {
    piece.cuts.forEach((cut, i) => {
      const pos = padding + (length / (piece.cuts.length + 1)) * (i + 1);
      svg += `<line x1="${pos}" y1="10" x2="${pos}" y2="20" stroke="red" stroke-width="0.5"/>`;
      svg += `<text x="${pos}" y="8" text-anchor="middle" font-family="Arial" font-size="2" fill="red">${cut.angle}°</text>`;
    });
  }

  // Length dimension
  svg += `<text x="${padding + length / 2}" y="${height + 30}" text-anchor="middle" font-family="Arial" font-size="3" font-weight="bold">${piece.length}mm</text>`;

  // Info
  svg += `<text x="${padding + length / 2}" y="${height + 35}" text-anchor="middle" font-family="Arial" font-size="2">${piece.profile} | Qtd: ${piece.quantity}</text>`;

  svg += `</svg>`;
  return svg;
}

// Generate complete fabrication drawing with all views
export function generateCompleteDrawing(
  data: DrawingData,
  options: DrawingOptions
): { front: string; pieces: string[] } {
  const frontView = generateFrontView(data, options);
  const pieceViews = data.pieces.map((piece, i) => generatePieceDetail(piece, i, options));

  return { front: frontView, pieces: pieceViews };
}

// Export as SVG string
export function exportDrawingAsSVG(data: DrawingData, options: DrawingOptions): string {
  const { front, pieces } = generateCompleteDrawing(data, options);
  return front;
}

// Export as PNG (base64)
export async function exportDrawingAsPNG(
  data: DrawingData,
  options: DrawingOptions
): Promise<string> {
  const svg = exportDrawingAsSVG(data, options);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  const scale = 2; // Higher resolution
  canvas.width = 800 * scale;
  canvas.height = 600 * scale;

  return new Promise(resolve => {
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svg);
  });
}

// Download drawing as SVG file
export function downloadDrawingSVG(data: DrawingData, options: DrawingOptions): void {
  const svg = exportDrawingAsSVG(data, options);
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `desenho_${data.typologyName.replace(/\s+/g, '_')}_${Date.now()}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Generate PDF-ready data structure
export function generateDrawingPDFData(
  calculation: CalculationOutput,
  options: Partial<DrawingOptions> = {}
): DrawingData {
  const pieces: DrawingPiece[] = calculation.cuts.map((cut, index) => ({
    name: cut.piece_name,
    code: cut.profile_code || `COR-${String(index + 1).padStart(3, '0')}`,
    quantity: cut.quantity,
    length: cut.cut_length_mm,
    profile: cut.profile_code || 'N/A',
    profileType: cut.profile_type || 'main_frame',
    cuts: [{ angle: 90, description: 'Corte reto' }],
  }));

  const totalWeight = calculation.cuts.reduce(
    (sum, cut) => sum + (cut.weight_kg_m || 0) * (cut.cut_length_mm / 1000) * cut.quantity,
    0
  );

  const glassArea = calculation.glass_area_m2 || 0;

  return {
    width: calculation.dimensions?.width_mm || 0,
    height: calculation.dimensions?.height_mm || 0,
    typologyName: calculation.typology_name || 'Janela',
    category: calculation.category || 'janela',
    subcategory: calculation.subcategory || 'correr',
    numFolhas: calculation.num_folhas || 2,
    pieces,
    totalWeight,
    glassArea,
    notes: calculation.notes,
    client: options.clientName,
    date: new Date().toLocaleDateString('pt-BR'),
  };
}
