import type { CutPiece, Bar, BarPiece, OptimizationResult } from "@/types/calculation";

/**
 * Otimizador de barras usando FFD (First Fit Decreasing)
 */
export function optimizeBars(
  pieces: CutPiece[],
  barLength: number = 6000,
  bladeWidth: number = 4
): OptimizationResult {
  const sorted = [...pieces].sort((a, b) => b.length_mm - a.length_mm);
  const bars: Bar[] = [];

  for (const piece of sorted) {
    if (piece.length_mm > barLength) {
      throw new Error(
        `Peça "${piece.label}" (${piece.length_mm}mm) excede o comprimento da barra (${barLength}mm)`
      );
    }

    let placed = false;
    for (const bar of bars) {
      const usedLength = bar.pieces.reduce(
        (sum, p) => sum + p.length_mm + bladeWidth, 0
      );
      const available = barLength - usedLength;

      if (piece.length_mm <= available) {
        bar.pieces.push({
          cut_piece_id: piece.id,
          position_mm: usedLength,
          length_mm: piece.length_mm,
          label: piece.label,
        });
        placed = true;
        break;
      }
    }

    if (!placed) {
      bars.push({
        bar_number: bars.length + 1,
        pieces: [{
          cut_piece_id: piece.id,
          position_mm: 0,
          length_mm: piece.length_mm,
          label: piece.label,
        }],
        waste_mm: 0,
        utilization_percent: 0,
      });
    }
  }

  let totalWaste = 0;
  for (const bar of bars) {
    const used = bar.pieces.reduce(
      (sum, p) => sum + p.length_mm + bladeWidth, 0
    ) - bladeWidth;
    bar.waste_mm = barLength - used;
    bar.utilization_percent = Math.round((used / barLength) * 10000) / 100;
    totalWaste += bar.waste_mm;
  }

  return {
    profile_code: pieces[0]?.profile_code ?? '',
    bar_length_mm: barLength,
    bars,
    total_bars: bars.length,
    total_waste_mm: totalWaste,
    overall_utilization_percent:
      bars.length > 0
        ? Math.round(((bars.length * barLength - totalWaste) / (bars.length * barLength)) * 10000) / 100
        : 0,
  };
}
