import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PieChartComponentProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  title?: string;
  colors?: string[];
  height?: number;
  showPercent?: boolean;
  donut?: boolean;
}

const defaultColors = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
];

export function PieChartComponent({
  data,
  dataKey,
  nameKey,
  title,
  colors = defaultColors,
  height = 300,
  showPercent = true,
  donut = true,
}: PieChartComponentProps) {
  const total = data.reduce((sum, item) => sum + (item[dataKey] || 0), 0);

  const renderLabel = (entry: any) => {
    if (!showPercent) return entry[nameKey];
    const percent = ((entry[dataKey] / total) * 100).toFixed(1);
    return `${entry[nameKey]}: ${percent}%`;
  };

  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-medium mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={donut ? '40%' : 0}
            outerRadius="80%"
            paddingAngle={2}
            labelLine={false}
            label={renderLabel}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry[nameKey]}
                fill={colors[index % colors.length]}
                stroke="hsl(var(--background))"
                strokeWidth={2}
              />
            ))}
          </Pie>
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
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            formatter={value => <span className="text-foreground">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
