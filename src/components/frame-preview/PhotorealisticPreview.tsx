// This component is deprecated - use FramePreview directly for SVG rendering
// Photorealistic images have been removed per user request
import FramePreview from "./FramePreview";

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

export default function PhotorealisticPreview(props: PhotorealisticPreviewProps) {
  // Always use SVG FramePreview - photorealistic images disabled
  return <FramePreview {...props} />;
}
