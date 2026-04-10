import { VidroItem, calcAreaM2 } from "./types";

interface VidroVisualPreviewProps {
  itens: VidroItem[];
  areaMinimaM2: number;
}

export function VidroVisualPreview({ itens, areaMinimaM2 }: VidroVisualPreviewProps) {
  if (itens.length === 0) return null;
  const maxDim = Math.max(...itens.map((it) => Math.max(it.larguraMm, it.alturaMm)), 1);
  const scale = 80 / maxDim;

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-lg">
      {itens.map((item) => {
        const w = Math.max(item.larguraMm * scale, 12);
        const h = Math.max(item.alturaMm * scale, 12);
        const isMinArea = areaMinimaM2 > 0 && calcAreaM2(item.larguraMm, item.alturaMm) < areaMinimaM2;
        return (
          <div key={item.id} className="flex flex-col items-center gap-1">
            <div
              className={`border-2 rounded-sm flex items-center justify-center text-[9px] font-mono ${isMinArea ? "border-amber-400 bg-amber-50 dark:bg-amber-950/30" : "border-primary/40 bg-primary/5"}`}
              style={{ width: `${w}px`, height: `${h}px`, minWidth: 20, minHeight: 16 }}
              title={`${item.larguraMm}×${item.alturaMm}mm`}
            >
              {item.quantidade > 1 && <span>×{item.quantidade}</span>}
            </div>
            <span className="text-[9px] text-muted-foreground truncate max-w-[80px]">{item.descricao}</span>
          </div>
        );
      })}
    </div>
  );
}
