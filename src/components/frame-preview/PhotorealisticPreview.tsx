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

  // Calculate aspect ratio
  const aspectRatio = width_mm / height_mm;
  const displayWidth = Math.min(maxWidth, maxHeight * aspectRatio);
  const displayHeight = Math.min(maxHeight, maxWidth / aspectRatio);

  // If we have a valid image URL and haven't errored, show the photo
  if (imagemUrl && !imageError) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center",
          className
        )}
        style={{
          width: displayWidth,
          height: displayHeight,
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
        <img
          src={imagemUrl}
          alt={`${category} - ${num_folhas} folhas`}
          className={cn(
            "max-w-full max-h-full object-contain transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          style={{
            width: displayWidth,
            height: displayHeight,
            objectFit: "contain",
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
