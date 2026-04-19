interface HeatmapData {
  label: string;
  values: { label: string; value: number }[];
}

interface HeatmapComponentProps {
  data: HeatmapData[];
  title?: string;
  colorScheme?: "blue" | "green" | "red" | "purple";
  showValues?: boolean;
}

const colorSchemes = {
  blue: ["#dbeafe", "#93c5fd", "#3b82f6", "#1d4ed8", "#1e3a8a"],
  green: ["#dcfce7", "#86efac", "#22c55e", "#15803d", "#14532d"],
  red: ["#fee2e2", "#fca5a5", "#ef4444", "#dc2626", "#7f1d1d"],
  purple: ["#f3e8ff", "#d8b4fe", "#a855f7", "#7c3aed", "#581c87"],
};

export function HeatmapComponent({
  data,
  title,
  colorScheme = "blue",
  showValues = false,
}: HeatmapComponentProps) {
  const colors = colorSchemes[colorScheme];
  const allValues = data.flatMap((d) => d.values.map((v) => v.value));
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const range = maxValue - minValue || 1;

  const getColor = (value: number) => {
    const normalized = (value - minValue) / range;
    const index = Math.min(Math.floor(normalized * colors.length), colors.length - 1);
    return colors[index];
  };

  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-medium mb-4">{title}</h3>}
      <div className="space-y-1">
        {data.map((row) => (
          <div key={row.label} className="flex items-center gap-2">
            <span className="text-xs font-medium w-20 truncate text-muted-foreground">
              {row.label}
            </span>
            <div className="flex-1 flex gap-1">
              {row.values.map((cell) => (
                <div
                  key={cell.label}
                  className="flex-1 h-6 rounded-sm flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                  style={{ backgroundColor: getColor(cell.value) }}
                  title={`${cell.label}: ${cell.value}`}
                >
                  {showValues && (
                    <span className="text-[8px] font-medium opacity-70">
                      {cell.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>Menor</span>
        <div className="flex gap-0.5">
          {colors.map((color, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span>Maior</span>
      </div>
    </div>
  );
}
