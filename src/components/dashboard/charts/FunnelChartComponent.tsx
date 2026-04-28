import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FunnelStage {
  name: string;
  value: number;
  color?: string;
}

interface FunnelChartComponentProps {
  data: FunnelStage[];
  title?: string;
  showValues?: boolean;
  showPercent?: boolean;
}

const defaultColors = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe'];

export function FunnelChartComponent({
  data,
  title,
  showValues = true,
  showPercent = true,
}: FunnelChartComponentProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-medium mb-4">{title}</h3>}
      <div className="space-y-2">
        {data.map((stage, index) => {
          const widthPercent = (stage.value / maxValue) * 100;
          const color = stage.color || defaultColors[index % defaultColors.length];
          const percent = ((stage.value / maxValue) * 100).toFixed(1);

          return (
            <div key={stage.name} className="relative">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium w-24 truncate text-muted-foreground">
                  {stage.name}
                </span>
                <div className="flex-1 relative h-8 bg-muted rounded overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded transition-all duration-500"
                    style={{
                      width: `${widthPercent}%`,
                      backgroundColor: color,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white drop-shadow-sm">
                      {showValues && stage.value.toLocaleString('pt-BR')}
                      {showPercent && ` (${percent}%)`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
