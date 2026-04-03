import { aluminumColors } from "./colors";
import { cn } from "@/lib/utils";

interface ColorSelectorProps {
  selectedColorId: string;
  onColorChange: (colorId: string) => void;
  className?: string;
}

export default function ColorSelector({ selectedColorId, onColorChange, className }: ColorSelectorProps) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {aluminumColors.map(c => (
        <button
          key={c.id}
          onClick={() => onColorChange(c.id)}
          className={cn(
            "flex flex-col items-center gap-1 transition-all hover:scale-110",
            selectedColorId === c.id ? "scale-110" : ""
          )}
        >
          <div
            className={cn(
              "w-7 h-7 rounded-full border-2 transition-all",
              selectedColorId === c.id
                ? "border-primary ring-2 ring-primary/30"
                : "border-border"
            )}
            style={{ backgroundColor: c.hex }}
          />
          <span className="text-[10px] text-muted-foreground leading-tight max-w-[48px] text-center">
            {c.name}
          </span>
        </button>
      ))}
    </div>
  );
}
