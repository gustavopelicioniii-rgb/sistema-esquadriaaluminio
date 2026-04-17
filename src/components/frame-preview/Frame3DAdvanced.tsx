import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Html } from "@react-three/drei";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCw, ZoomIn, Move, Box, Maximize, Eye } from "lucide-react";
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

interface WindowProps {
  width: number;
  height: number;
  depth: number;
  color: string;
  glassColor: string;
  numFolhas: number;
  isOpen?: boolean;
}

function AluminumProfile({ width, height, depth, color, position, rotation }: {
  width: number;
  height: number;
  depth: number;
  color: string;
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.3} />
    </mesh>
  );
}

function GlassPane({ width, height, depth, color, position }: {
  width: number;
  height: number;
  depth: number;
  color: string;
  position: [number, number, number];
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={[width, height, depth]} />
      <meshPhysicalMaterial
        color={color}
        transparent
        opacity={0.4}
        metalness={0}
        roughness={0}
        transmission={0.9}
        thickness={0.5}
      />
    </mesh>
  );
}

function SlidingWindow3D({ width, height, depth, color, glassColor, numFolhas }: WindowProps) {
  const scale = 0.01; // mm to scene units
  const w = width * scale;
  const h = height * scale;
  const d = depth * scale;
  const frameThickness = 0.03;
  const glassThickness = 0.002;

  // Calculate dimensions
  const frameColor = color || "#B8B8B8";
  const glassCol = glassColor || "#B8D4E8";

  return (
    <group>
      {/* Frame - Outer */}
      {/* Top */}
      <AluminumProfile width={w} height={frameThickness} depth={d} color={frameColor} position={[0, h / 2, 0]} />
      {/* Bottom */}
      <AluminumProfile width={w} height={frameThickness} depth={d} color={frameColor} position={[0, -h / 2, 0]} />
      {/* Left */}
      <AluminumProfile width={frameThickness} height={h - frameThickness * 2} depth={d} color={frameColor} position={[-w / 2 + frameThickness / 2, 0, 0]} />
      {/* Right */}
      <AluminumProfile width={frameThickness} height={h - frameThickness * 2} depth={d} color={frameColor} position={[w / 2 - frameThickness / 2, 0, 0]} />

      {/* Glass - Single pane or divided */}
      {numFolhas === 1 ? (
        <GlassPane width={w - frameThickness * 2} height={h - frameThickness * 2} depth={glassThickness} color={glassCol} position={[0, 0, d / 2 + glassThickness / 2]} />
      ) : (
        <>
          {/* Middle rail for multi-panel */}
          {numFolhas === 2 && (
            <AluminumProfile width={frameThickness} height={h - frameThickness * 2} depth={d} color={frameColor} position={[0, 0, 0]} />
          )}
          {/* Glass panes */}
          {numFolhas === 2 && (
            <>
              <GlassPane width={w / 2 - frameThickness} height={h - frameThickness * 2} depth={glassThickness} color={glassCol} position={[-w / 4, 0, d / 2 + glassThickness / 2]} />
              <GlassPane width={w / 2 - frameThickness} height={h - frameThickness * 2} depth={glassThickness} color={glassCol} position={[w / 4, 0, d / 2 + glassThickness / 2]} />
            </>
          )}
          {numFolhas === 4 && (
            <>
              {/* Horizontal middle */}
              <AluminumProfile width={w} height={frameThickness} depth={d} color={frameColor} position={[0, 0, 0]} />
              {/* Vertical middle */}
              <AluminumProfile width={frameThickness} height={h} depth={d} color={frameColor} position={[0, 0, 0]} />
              {/* Glass panes */}
              <GlassPane width={w / 2 - frameThickness} height={h / 2 - frameThickness} depth={glassThickness} color={glassCol} position={[-w / 4, h / 4, d / 2 + glassThickness / 2]} />
              <GlassPane width={w / 2 - frameThickness} height={h / 2 - frameThickness} depth={glassThickness} color={glassCol} position={[w / 4, h / 4, d / 2 + glassThickness / 2]} />
              <GlassPane width={w / 2 - frameThickness} height={h / 2 - frameThickness} depth={glassThickness} color={glassCol} position={[-w / 4, -h / 4, d / 2 + glassThickness / 2]} />
              <GlassPane width={w / 2 - frameThickness} height={h / 2 - frameThickness} depth={glassThickness} color={glassCol} position={[w / 4, -h / 4, d / 2 + glassThickness / 2]} />
            </>
          )}
        </>
      )}
    </group>
  );
}

function FixedWindow3D({ width, height, depth, color, glassColor }: Omit<WindowProps, "numFolhas">) {
  const scale = 0.01;
  const w = width * scale;
  const h = height * scale;
  const d = depth * scale;
  const frameThickness = 0.03;
  const frameColor = color || "#B8B8B8";
  const glassCol = glassColor || "#B8D4E8";

  return (
    <group>
      {/* Frame */}
      <AluminumProfile width={w} height={frameThickness} depth={d} color={frameColor} position={[0, h / 2, 0]} />
      <AluminumProfile width={w} height={frameThickness} depth={d} color={frameColor} position={[0, -h / 2, 0]} />
      <AluminumProfile width={frameThickness} height={h} depth={d} color={frameColor} position={[-w / 2, 0, 0]} />
      <AluminumProfile width={frameThickness} height={h} depth={d} color={frameColor} position={[w / 2, 0, 0]} />
      {/* Glass */}
      <GlassPane width={w - frameThickness * 2} height={h - frameThickness * 2} depth={glassThickness} color={glassCol} position={[0, 0, d / 2]} />
    </group>
  );
}

const glassThickness = 0.002;

function Scene({ width, height, category, color, glassColor, numFolhas }: Omit<Frame3DAdvancedProps, "className">) {
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

  const getGlassColor = (colorId: string) => {
    const colors: Record<string, string> = {
      natural: "#B8D4E8",
      branco: "#E8F4FC",
      preto: "#4A4A4A",
      bronze: "#D4C4A8",
      prata: "#C8D8E8",
      champagne: "#E8DCC8",
    };
    return colors[colorId] || colors.natural;
  };

  const frameColor = getColorHex(color || "natural");
  const glassCol = getGlassColor(glassColor || "natural");

  const depth = 0.08; // Window depth

  return (
    <>
      <PerspectiveCamera makeDefault position={[2, 1.5, 3]} fov={50} />
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={1}
        maxDistance={10}
        maxPolarAngle={Math.PI / 1.8}
      />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.3} />

      {/* Window */}
      <group rotation={[0, -0.3, 0]}>
        {category === "fixa" || category === "basculante" ? (
          <FixedWindow3D width={width} height={height} depth={depth} color={frameColor} glassColor={glassCol} />
        ) : (
          <SlidingWindow3D width={width} height={height} depth={depth} color={frameColor} glassColor={glassCol} numFolhas={numFolhas} />
        )}
      </group>

      {/* Floor shadow */}
      <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={10} blur={2} />

      {/* Environment for reflections */}
      <Environment preset="city" />

      {/* Grid helper */}
      <gridHelper args={[10, 10, "#444444", "#333333"]} position={[0, -1, 0]} />
    </>
  );
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatDimensions = (mm: number) => {
    if (mm >= 1000) {
      return `${(mm / 1000).toFixed(2)}m`;
    }
    return `${mm}mm`;
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Box className="h-4 w-4" />
            Visualização 3D
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant={viewMode === "3d" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("3d")}
              className="h-8 px-2"
            >
              <RotateCw className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFullscreen}
              className="h-8 px-2"
            >
              <Maximize className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>L: {formatDimensions(width_mm)}</span>
          <span>A: {formatDimensions(height_mm)}</span>
          <span>{num_folhas} folha{num_folhas > 1 ? "s" : ""}</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div
          ref={containerRef}
          className={cn(
            "relative bg-gradient-to-b from-slate-900 to-slate-800 transition-all",
            isFullscreen ? "h-screen" : "h-[300px]"
          )}
        >
          {viewMode === "3d" ? (
            <>
              <Canvas shadows>
                <Scene
                  width={width_mm}
                  height={height_mm}
                  category={category}
                  color={color}
                  glassColor={glassColor}
                  numFolhas={num_folhas}
                />
              </Canvas>

              {/* Controls hint */}
              <div className="absolute bottom-2 left-2 flex items-center gap-3 text-xs text-white/60">
                <span className="flex items-center gap-1">
                  <RotateCw className="h-3 w-3" />
                  Arrastar = Rotacionar
                </span>
                <span className="flex items-center gap-1">
                  <ZoomIn className="h-3 w-3" />
                  Scroll = Zoom
                </span>
                <span className="flex items-center gap-1">
                  <Move className="h-3 w-3" />
                  Direito = Mover
                </span>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-white/40">
              <Eye className="h-12 w-12" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
