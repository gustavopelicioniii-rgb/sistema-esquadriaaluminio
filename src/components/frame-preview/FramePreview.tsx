import { useMemo } from "react";
import { getTypologySvg } from "./typology-svgs";
import { getColorById, aluminumColors, type AluminumColor } from "./colors";

interface FramePreviewProps {
  width_mm: number;
  height_mm: number;
  category: string;
  subcategory: string;
  num_folhas: number;
  has_veneziana?: boolean;
  has_bandeira?: boolean;
  notes?: string;
  colorId?: string;
  maxWidth?: number;
  maxHeight?: number;
  showDimensions?: boolean;
  className?: string;
}

export default function FramePreview({
  width_mm,
  height_mm,
  category,
  subcategory,
  num_folhas,
  has_veneziana,
  has_bandeira,
  notes,
  colorId = "natural",
  maxWidth = 360,
  maxHeight = 300,
  showDimensions = true,
  className = "",
}: FramePreviewProps) {
  const color = getColorById(colorId);

  // Scale proportionally to fit maxWidth/maxHeight
  const { svgW, svgH } = useMemo(() => {
    const aspect = width_mm / height_mm;
    let w = maxWidth;
    let h = w / aspect;
    if (h > maxHeight) {
      h = maxHeight;
      w = h * aspect;
    }
    return { svgW: Math.round(w), svgH: Math.round(h) };
  }, [width_mm, height_mm, maxWidth, maxHeight]);

  const dimFontSize = Math.max(9, Math.min(11, svgW * 0.03));

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <svg
        width={svgW + 50}
        height={svgH + 40}
        viewBox={`0 0 ${svgW + 50} ${svgH + 40}`}
        xmlns="http://www.w3.org/2000/svg"
        className="select-none"
      >
        {/* Background */}
        <rect width={svgW + 50} height={svgH + 40} fill="none" />

        {/* Frame offset for dimension labels */}
        <g transform="translate(25, 10)">
          {getTypologySvg({
            width: width_mm,
            height: height_mm,
            color,
            numFolhas: num_folhas,
            svgWidth: svgW,
            svgHeight: svgH,
            category,
            subcategory,
            num_folhas,
            has_veneziana,
            has_bandeira,
            notes,
          })}
        </g>

        {/* Dimension labels */}
        {showDimensions && (
          <>
            {/* Width dimension - top */}
            <line x1={25 + 8} y1={5} x2={25 + svgW - 8} y2={5} stroke="hsl(var(--muted-foreground))" strokeWidth={0.8} />
            <line x1={25 + 8} y1={2} x2={25 + 8} y2={8} stroke="hsl(var(--muted-foreground))" strokeWidth={0.8} />
            <line x1={25 + svgW - 8} y1={2} x2={25 + svgW - 8} y2={8} stroke="hsl(var(--muted-foreground))" strokeWidth={0.8} />
            <text x={25 + svgW / 2} y={5} textAnchor="middle" dominantBaseline="middle" fontSize={dimFontSize} fill="hsl(var(--foreground))" fontWeight={600} fontFamily="Inter, system-ui">
              <tspan dy={-1}>{width_mm}</tspan>
              <tspan fontSize={dimFontSize * 0.7}> mm</tspan>
            </text>

            {/* Height dimension - left */}
            <line x1={18} y1={10 + 8} x2={18} y2={10 + svgH - 8} stroke="hsl(var(--muted-foreground))" strokeWidth={0.8} />
            <line x1={15} y1={10 + 8} x2={21} y2={10 + 8} stroke="hsl(var(--muted-foreground))" strokeWidth={0.8} />
            <line x1={15} y1={10 + svgH - 8} x2={21} y2={10 + svgH - 8} stroke="hsl(var(--muted-foreground))" strokeWidth={0.8} />
            <text x={12} y={10 + svgH / 2} textAnchor="middle" dominantBaseline="middle" fontSize={dimFontSize} fill="hsl(var(--foreground))" fontWeight={600} fontFamily="Inter, system-ui" transform={`rotate(-90, 12, ${10 + svgH / 2})`}>
              <tspan>{height_mm}</tspan>
              <tspan fontSize={dimFontSize * 0.7}> mm</tspan>
            </text>
          </>
        )}
      </svg>
    </div>
  );
}

export { aluminumColors, type AluminumColor };
