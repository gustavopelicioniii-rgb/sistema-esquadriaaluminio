import { cn } from "@/lib/utils";

interface GaugeChartComponentProps {
  value: number;
  maxValue?: number;
  title?: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
  showValue?: boolean;
}

export function GaugeChartComponent({
  value,
  maxValue = 100,
  title,
  subtitle,
  size = "md",
  color = "#3b82f6",
  showValue = true,
}: GaugeChartComponentProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const strokeDasharray = `${percentage} ${100 - percentage}`;
  const sizeConfig = {
    sm: { size: 80, strokeWidth: 8, fontSize: "text-lg" },
    md: { size: 120, strokeWidth: 10, fontSize: "text-2xl" },
    lg: { size: 160, strokeWidth: 12, fontSize: "text-3xl" },
  };
  const config = sizeConfig[size];
  const radius = (config.size - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: config.size, height: config.size }}>
        <svg
          className="transform -rotate-90"
          width={config.size}
          height={config.size}
        >
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={config.strokeWidth}
          />
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showValue && (
            <span className={cn("font-bold", config.fontSize)} style={{ color }}>
              {typeof value === "number" ? value.toFixed(1) : value}
              {size !== "sm" && <span className="text-xs font-normal text-muted-foreground">%</span>}
            </span>
          )}
        </div>
      </div>
      {title && (
        <p className="text-sm font-medium mt-2 text-center">{title}</p>
      )}
      {subtitle && (
        <p className="text-xs text-muted-foreground text-center">{subtitle}</p>
      )}
    </div>
  );
}
