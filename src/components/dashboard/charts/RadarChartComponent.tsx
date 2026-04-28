import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface RadarChartComponentProps {
  data: any[];
  dataKey: string | string[];
  nameKey: string;
  title?: string;
  colors?: string[];
  height?: number;
}

const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function RadarChartComponent({
  data,
  dataKey,
  nameKey,
  title,
  colors = defaultColors,
  height = 300,
}: RadarChartComponentProps) {
  const keys = Array.isArray(dataKey) ? dataKey : [dataKey];

  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-medium mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={data}>
          <PolarGrid className="stroke-muted" />
          <PolarAngleAxis
            dataKey={nameKey}
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
          />
          <PolarRadiusAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
          {keys.map((key, index) => (
            <Radar
              key={key}
              name={key}
              dataKey={key}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              fillOpacity={0.2}
            />
          ))}
          {keys.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
