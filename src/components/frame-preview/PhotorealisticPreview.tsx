import { useState } from "react";
import FramePreview from "./FramePreview";
import { cn } from "@/lib/utils";

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

  // If we have a valid image URL and haven't errored, show the photo
  if (imagemUrl && !imageError) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center cursor-pointer",
          className
        )}
        style={{
          width: displayWidth,
          height: displayHeight,
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
            isLoading ? "opacity-0" : "opacity-100"
          )}
          style={{
            width: displayWidth,
            height: displayHeight,
            objectFit: "contain",
            transform: hoverTransform,
            transformOrigin: animationType === "maxim-ar" ? "center top"
              : animationType === "basculante" ? "center bottom"
              : "center center",
            transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s",
            boxShadow: hovered ? "0 20px 40px rgba(0,0,0,0.15)" : "0 4px 12px rgba(0,0,0,0.08)",
          }}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setImageError(true);
            setIsLoading(false);
          }}
        />
        {/* Dimension badge */}
        {showDimensions && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-mono">
            {width_mm} x {height_mm} mm
          </div>
        )}
        {/* Hover indicator */}
        {hovered && (
          <div className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-medium">
            {animationType ? (animationType === "maxim-ar" ? "Abrindo..." : animationType === "giro" ? "Girando..." : "Animando...") : "Visualizando"}
          </div>
        )}
      </div>
    );
  }

  // Fallback to SVG preview
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
