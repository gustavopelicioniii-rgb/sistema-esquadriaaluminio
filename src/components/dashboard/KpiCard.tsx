import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { SparkAreaChart } from "./charts/SparkAreaChart";

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
  sparkData?: number[];
  format?: "currency" | "percent" | "number";
  className?: string;
  accentColor?: string;
}

export function KpiCard({
  title,
  value,
  subtitle,
  trend,
  trendLabel,
  icon,
  sparkData,
  format = "number",
  className,
  accentColor = "hsl(221.2 83.2% 53.3%)",
}: KpiCardProps) {
  const getTrendIcon = () => {
    if (trend === undefined || trend === 0) return <Minus className="h-3 w-3" />;
    return trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />;
  };

  const getTrendColor = () => {
    if (trend === undefined || trend === 0) return "text-muted-foreground";
    return trend > 0 ? "text-emerald-500" : "text-red-500";
  };

  const formatValue = (val: string) => {
    if (format === "currency") {
      return val;
    }
    if (format === "percent") {
      return `${val}%`;
    }
    return val;
  };

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: accentColor }}
      />
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
              {title}
            </p>
            <p className="text-xl sm:text-3xl font-bold mt-1 truncate">
              {formatValue(value)}
            </p>
            {subtitle && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {subtitle}
              </p>
            )}
            {trend !== undefined && (
              <div className={cn("flex items-center gap-1 mt-2", getTrendColor())}>
                {getTrendIcon()}
                <span className="text-xs font-medium">
                  {Math.abs(trend).toFixed(1)}%
                </span>
                {trendLabel && (
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {trendLabel}
                  </span>
                )}
              </div>
            )}
          </div>
          {icon && (
            <div
              className="p-2 sm:p-3 rounded-lg"
              style={{ backgroundColor: `${accentColor}15` }}
            >
              {icon}
            </div>
          )}
        </div>
        {sparkData && sparkData.length > 0 && (
          <div className="h-12 mt-4">
            <SparkAreaChart data={sparkData} color={accentColor} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
