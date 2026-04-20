import { useState } from "react";
import FramePreview from "./FramePreview";
import { cn } from "@/lib/utils";
import { getColorById } from "./colors";

// Helper to calculate hue rotation for color tinting
function getHueRotation(hexColor: string): number {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  if (max !== min) {
    const d = max - min;
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return h * 360;
}

interface PhotorealisticPreviewProps {
  imagemUrl?: string;
  width_mm: number;
  height_mm: number;
  category: string;
  subcategory: string;
  num_folhas: number;
  has_veneziana?: boolean;
  has_bandeira?: boolean;
  colorId?: string;
  maxWidth?: number;
  maxHeight?: number;
  showDimensions?: boolean;
  className?: string;
}

export default function PhotorealisticPreview({
  imagemUrl,
  width_mm,
  height_mm,
  category,
  subcategory,
  num_folhas,
  has_veneziana,
  has_bandeira,
  colorId = "natural",
  maxWidth = 360,
  maxHeight = 300,
  showDimensions = true,
  className,
}: PhotorealisticPreviewProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hovered, setHovered] = useState(false);

  // Calculate aspect ratio
  const aspectRatio = width_mm / height_mm;
  const displayWidth = Math.min(maxWidth, maxHeight * aspectRatio);
  const displayHeight = Math.min(maxHeight, maxWidth / aspectRatio);

  // Determine animation type based on typology (for hover effect)
  const animationType = (() => {
    if (category === "maxim_ar") return "maxim-ar";
    if (subcategory === "giro" || category === "pivotante") return "giro";
    if (category === "camarao") return "camarao";
    if (category === "basculante") return "basculante";
    return null;
  })();

  // CSS transform for hover effect
  const hoverTransform = (() => {
    if (!hovered || !animationType) return "";
    switch (animationType) {
      case "maxim-ar":
        return `perspective(${displayWidth * 2}px) rotateX(-8deg) scale(1.02)`;
      case "giro":
        return `perspective(${displayWidth * 2}px) rotateY(10deg) scale(1.02)`;
      case "camarao":
        return `perspective(${displayWidth * 2}px) rotateY(6deg) scaleX(0.98)`;
      case "basculante":
        return `perspective(${displayWidth * 2}px) rotateX(8deg) scale(1.02)`;
      default:
        return `scale(1.03)`;
    }
  })();

  // Get color info for tinting
  const colorInfo = getColorById(colorId || "natural");
  const isNaturalColor = colorId === "natural" || !colorId;
  
  // If we have a valid image URL, show the photo (with color tint if selected)
  if (imagemUrl && !imageError) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-lg flex items-center justify-center cursor-pointer",
          className
        )}
        style={{
          width: displayWidth,
          height: displayHeight,
          background: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
        <img
          src={imagemUrl}
          alt={`${category} - ${num_folhas} folhas`}
          className={cn(
            "max-w-full max-h-full object-contain transition-all duration-300",
            !isNaturalColor && "transition-all duration-500"
          )}
          style={{
            width: displayWidth,
            height: displayHeight,
            objectFit: "contain",
            transform: hovered ? hoverTransform : "",
            transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s, filter 0.5s",
            filter: hovered 
              ? isNaturalColor 
                ? "brightness(1.05)" 
                : `brightness(0.95) sepia(0.3) saturate(1.5) hue-rotate(${getHueRotation(colorInfo.hex)}deg)`
              : isNaturalColor 
                ? "brightness(1)" 
                : `brightness(0.95) sepia(0.3) saturate(1.5) hue-rotate(${getHueRotation(colorInfo.hex)}deg)`,
          }}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setImageError(true);
            setIsLoading(false);
          }}
        />
        {/* Color tint overlay for non-natural colors */}
        {!isNaturalColor && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500"
            style={{
              backgroundColor: colorInfo.hex,
              opacity: 0.25,
              mixBlendMode: "multiply",
            }}
          />
        )}
        {/* Dimension badge */}
        {showDimensions && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-mono">
            {width_mm} x {height_mm} mm
          </div>
        )}
      </div>
    );
  }

  // Fallback to SVG preview (only if image fails to load)
  return (
    <FramePreview
      width_mm={width_mm}
      height_mm={height_mm}
      category={category}
      subcategory={subcategory}
      num_folhas={num_folhas}
      has_veneziana={has_veneziana}
      has_bandeira={has_bandeira}
      colorId={colorId}
      maxWidth={maxWidth}
      maxHeight={maxHeight}
      showDimensions={showDimensions}
      className={className}
    />
  );
}
