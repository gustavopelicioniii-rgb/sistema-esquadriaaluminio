import { aluminumColors } from "./colors";
import { cn } from "@/lib/utils";

interface ColorSelectorProps {
  selectedColorId: string;
  onColorChange: (colorId: string) => void;
  className?: string;
}

export default function ColorSelector({ selectedColorId, onColorChange, className }: ColorSelectorProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {aluminumColors.map(c => (
        <button
          key={c.id}
          onClick={() => onColorChange(c.id)}
          className={cn(
            "w-7 h-7 rounded-full border-2 transition-all hover:scale-110",
            selectedColorId === c.id
              ? "border-primary ring-2 ring-primary/30 scale-110"
              : "border-border"
          )}
          style={{ backgroundColor: c.hex }}
          title={c.name}
        />
      ))}
    </div>
  );
}
