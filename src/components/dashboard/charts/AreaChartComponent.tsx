import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface AreaChartComponentProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  title?: string;
  colors?: string[];
  height?: number;
}

const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function AreaChartComponent({
  data,
  dataKey,
  xAxisKey,
  title,
  colors = defaultColors,
  height = 300,
}: AreaChartComponentProps) {
  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-medium mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            {colors.map((color, index) => (
              <linearGradient key={index} id={`areaGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            className="text-muted-foreground"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            className="text-muted-foreground"
            tickFormatter={value =>
              value >= 1000000
                ? `${(value / 1000000).toFixed(1)}M`
                : value >= 1000
                  ? `${(value / 1000).toFixed(0)}k`
                  : value
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: any) => [
              typeof value === 'number'
                ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                : value,
              '',
            ]}
          />
          {colors.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {colors.map((color, index) => (
            <Area
              key={index}
              type="monotone"
              dataKey={Array.isArray(dataKey) ? dataKey[index] : dataKey}
              stroke={color}
              strokeWidth={2}
              fill={`url(#areaGradient${index})`}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
