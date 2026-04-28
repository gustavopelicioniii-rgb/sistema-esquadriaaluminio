import type { OptimizationResult } from '@/types/calculation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const COLORS = [
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-sky-500',
  'bg-cyan-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
];

interface BarVisualizationProps {
  results: OptimizationResult[];
}

export function BarVisualization({ results }: BarVisualizationProps) {
  if (results.length === 0) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-6">
        {results.map((opt, oi) => (
          <div key={oi} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold">{opt.profile_code}</h4>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>
                  {opt.total_bars} barra(s) de {opt.bar_length_mm}mm
                </span>
                <span className="font-semibold text-primary">
                  {opt.overall_utilization_percent}% aproveitamento
                </span>
              </div>
            </div>

            {opt.bars.map(bar => (
              <div key={bar.bar_number} className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Barra {bar.bar_number}</span>
                  <span>
                    Sobra: {bar.waste_mm}mm ({(100 - bar.utilization_percent).toFixed(1)}%)
                  </span>
                </div>
                <div className="relative h-8 rounded-md bg-muted/50 border border-border/50 overflow-hidden flex">
                  {bar.pieces.map((piece, pi) => {
                    const widthPct = (piece.length_mm / opt.bar_length_mm) * 100;
                    return (
                      <Tooltip key={pi}>
                        <TooltipTrigger asChild>
                          <div
                            className={`${COLORS[pi % COLORS.length]} h-full flex items-center justify-center text-white text-[10px] font-bold cursor-default border-r border-white/20 transition-opacity hover:opacity-80`}
                            style={{
                              width: `${widthPct}%`,
                              minWidth: widthPct > 2 ? undefined : '2px',
                            }}
                          >
                            {widthPct > 8 && (
                              <span className="truncate px-1">{piece.length_mm}</span>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          <p className="font-bold">{piece.label}</p>
                          <p>{piece.length_mm}mm</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                  {bar.waste_mm > 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="bg-red-200 dark:bg-red-900/40 h-full flex items-center justify-center cursor-default"
                          style={{ width: `${(bar.waste_mm / opt.bar_length_mm) * 100}%` }}
                        >
                          {(bar.waste_mm / opt.bar_length_mm) * 100 > 6 && (
                            <span className="text-[10px] text-red-600 dark:text-red-400 font-medium">
                              {bar.waste_mm}
                            </span>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        <p className="font-bold text-red-600">Sobra</p>
                        <p>{bar.waste_mm}mm</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Legend */}
        <div className="flex flex-wrap gap-3 pt-2 border-t text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-blue-500" />
            <span>Peças</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-red-200 dark:bg-red-900/40" />
            <span>Sobra</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
