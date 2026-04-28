import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { OptimizationResult } from '@/types/calculation';

const PIECE_COLORS = [
  'bg-primary/80',
  'bg-primary/60',
  'bg-primary/40',
  'bg-blue-500/70',
  'bg-blue-400/60',
  'bg-indigo-500/60',
];

interface Props {
  barResults: OptimizationResult[];
}

export function BarsVisualization({ barResults }: Props) {
  if (barResults.length === 0) {
    return <p className="text-muted-foreground text-sm text-center py-8">Sem dados de barras.</p>;
  }

  return (
    <div className="space-y-6">
      {barResults.map(opt => (
        <div key={opt.profile_code} className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Badge variant="outline" className="font-mono">
                {opt.profile_code}
              </Badge>
              {opt.total_bars} barra(s) de {opt.bar_length_mm}mm
            </h4>
            <span className="text-xs text-muted-foreground">
              Aproveitamento:{' '}
              <span className="font-semibold text-primary">{opt.overall_utilization_percent}%</span>
            </span>
          </div>
          <div className="space-y-2">
            {opt.bars.map(bar => (
              <div key={bar.bar_number} className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Barra {bar.bar_number}</span>
                  <span>•</span>
                  <span>
                    Sobra: {bar.waste_mm}mm ({(100 - bar.utilization_percent).toFixed(1)}%)
                  </span>
                </div>
                <div className="flex h-8 rounded-md overflow-hidden border border-border bg-muted/30">
                  {bar.pieces.map((piece, pi) => {
                    const widthPercent = (piece.length_mm / opt.bar_length_mm) * 100;
                    return (
                      <div
                        key={pi}
                        className={cn(
                          PIECE_COLORS[pi % PIECE_COLORS.length],
                          'flex items-center justify-center text-[10px] font-medium text-primary-foreground',
                          'border-r border-background/50 truncate px-1'
                        )}
                        style={{ width: `${widthPercent}%` }}
                        title={piece.label}
                      >
                        {piece.length_mm}
                      </div>
                    );
                  })}
                  {bar.waste_mm > 0 && (
                    <div
                      className="bg-destructive/20 flex items-center justify-center text-[10px] text-destructive font-medium"
                      style={{ width: `${(bar.waste_mm / opt.bar_length_mm) * 100}%` }}
                    >
                      {bar.waste_mm}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Separator />
        </div>
      ))}
    </div>
  );
}
