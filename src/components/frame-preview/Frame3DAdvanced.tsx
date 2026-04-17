// Frame3DAdvanced - Simplified version without Three.js dependencies
// For production 3D, integrate @react-three/fiber when React 19 is available
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Box, Maximize, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Frame3DAdvancedProps {
  width_mm: number;
  height_mm: number;
  category: string;
  subcategory: string;
  num_folhas: number;
  color?: string;
  glassColor?: string;
  className?: string;
}

export default function Frame3DAdvanced({
  width_mm,
  height_mm,
  category,
  subcategory,
  num_folhas,
  color,
  glassColor,
  className,
}: Frame3DAdvancedProps) {
  const formatDimensions = (mm: number) => {
    if (mm >= 1000) {
      return `${(mm / 1000).toFixed(2)}m`;
    }
    return `${mm}mm`;
  };

  const getColorHex = (colorId: string) => {
    const colors: Record<string, string> = {
      natural: "#C0C0C0",
      branco: "#F5F5F5",
      preto: "#333333",
      bronze: "#8B6914",
      prata: "#A8A8A8",
      champagne: "#D4C4A8",
    };
    return colors[colorId] || colors.natural;
  };

  const frameColor = getColorHex(color || "natural");

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Box className="h-4 w-4" />
          Visualização 3D
          <span className="text-xs font-normal text-muted-foreground ml-2">
            (3D avançado em breve)
          </span>
        </CardTitle>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>L: {formatDimensions(width_mm)}</span>
          <span>A: {formatDimensions(height_mm)}</span>
          <span>{num_folhas} folha{num_folhas > 1 ? "s" : ""}</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative bg-gradient-to-b from-slate-900 to-slate-800 h-[300px] flex flex-col items-center justify-center">
          {/* Simple 3D-like representation using CSS */}
          <div
            className="relative"
            style={{
              width: "120px",
              height: "100px",
              transform: "perspective(200px) rotateX(10deg) rotateY(-10deg)",
            }}
          >
            {/* Window frame */}
            <div
              className="absolute inset-0 border-4 rounded-sm"
              style={{ borderColor: frameColor, backgroundColor: "rgba(184, 212, 232, 0.3)" }}
            >
              {/* Glass reflection */}
              <div
                className="absolute inset-2 bg-gradient-to-br from-white/20 to-transparent rounded-sm"
              />
              {/* Frame dividers for multi-pane */}
              {num_folhas === 2 && (
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-inherit -translate-x-1/2" style={{ backgroundColor: frameColor }} />
              )}
              {num_folhas === 4 && (
                <>
                  <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-inherit -translate-x-1/2" style={{ backgroundColor: frameColor }} />
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-inherit -translate-y-1/2" style={{ backgroundColor: frameColor }} />
                </>
              )}
            </div>
          </div>

          {/* Info text */}
          <div className="mt-4 text-center">
            <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
              <Info className="h-3 w-3" />
              <span>Preview simplificado</span>
            </div>
            <p className="text-white/40 text-xs">
              3D completo disponível em breve
            </p>
          </div>

          {/* Category badge */}
          <div className="absolute top-3 right-3">
            <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/60">
              {category}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
