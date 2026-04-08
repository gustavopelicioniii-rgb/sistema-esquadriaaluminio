import type { AluminumColor } from "./colors";

interface ProfileSection {
  code: string;
  name: string;
  type: string;
}

interface ProfileCrossSectionPanelProps {
  profiles: ProfileSection[];
  color: AluminumColor;
  className?: string;
}

/**
 * Renders realistic cross-section SVGs for aluminum profiles used in the selected typology.
 */
function CrossSection({ code, name, type, color, size = 56 }: ProfileSection & { color: AluminumColor; size?: number }) {
  const fc = color.frameColor;
  const fl = color.frameLight;
  const fd = color.frameDark;
  const sw = 1.2;

  const t = type.toLowerCase();

  const shape = (() => {
    // Marco Superior — U-channel with internal ribs
    if (t === "marco" && (code.includes("010") || code.includes("SUP") || name.toLowerCase().includes("superior"))) {
      return (
        <g>
          <path d="M6 32 L6 8 Q6 6 8 6 L32 6 Q34 6 34 8 L34 32" stroke={fd} fill={fc} strokeWidth={sw} />
          <path d="M10 32 L10 12 L30 12 L30 32" stroke={fd} fill="none" strokeWidth={sw * 0.7} />
          <rect x="6" y="6" width="28" height="3" fill={fl} opacity={0.5} rx="1" />
          <line x1="14" y1="12" x2="14" y2="28" stroke={fd} strokeWidth={0.5} opacity={0.3} />
          <line x1="26" y1="12" x2="26" y2="28" stroke={fd} strokeWidth={0.5} opacity={0.3} />
          <rect x="8" y="9" width="24" height="1.5" fill={fd} opacity={0.15} rx="0.3" />
        </g>
      );
    }

    // Marco Inferior / Trilho — rail with tracks
    if (t === "trilho" || name.toLowerCase().includes("inferior")) {
      return (
        <g>
          <rect x="4" y="22" width="32" height="10" rx="1.5" fill={fc} stroke={fd} strokeWidth={sw} />
          <rect x="4" y="22" width="32" height="3" fill={fl} opacity={0.4} rx="1" />
          {/* Track fins */}
          <rect x="12" y="14" width="2.5" height="8" fill={fc} stroke={fd} strokeWidth={sw * 0.7} rx="0.5" />
          <rect x="25" y="14" width="2.5" height="8" fill={fc} stroke={fd} strokeWidth={sw * 0.7} rx="0.5" />
          <rect x="12" y="14" width="2.5" height="2" fill={fl} opacity={0.4} rx="0.3" />
          <rect x="25" y="14" width="2.5" height="2" fill={fl} opacity={0.4} rx="0.3" />
          <rect x="6" y="28" width="28" height="2" fill={fd} opacity={0.2} rx="0.3" />
        </g>
      );
    }

    // Marco Lateral — rectangular tube with internal web
    if (t === "marco") {
      return (
        <g>
          <rect x="10" y="4" width="12" height="32" rx="1" fill={fc} stroke={fd} strokeWidth={sw} />
          <rect x="10" y="4" width="3" height="32" fill={fl} opacity={0.35} rx="0.5" />
          <rect x="19" y="4" width="1.5" height="32" fill={fd} opacity={0.2} rx="0.3" />
          {/* Lip */}
          <rect x="22" y="8" width="8" height="3" fill={fc} stroke={fd} strokeWidth={sw * 0.7} rx="0.5" />
          <rect x="22" y="28" width="8" height="3" fill={fc} stroke={fd} strokeWidth={sw * 0.7} rx="0.5" />
          <rect x="22" y="8" width="8" height="1" fill={fl} opacity={0.3} rx="0.3" />
          <rect x="22" y="28" width="8" height="1" fill={fl} opacity={0.3} rx="0.3" />
        </g>
      );
    }

    // Montante — H-beam / mullion
    if (t === "montante") {
      return (
        <g>
          <rect x="8" y="4" width="8" height="32" rx="0.8" fill={fc} stroke={fd} strokeWidth={sw} />
          <rect x="24" y="4" width="8" height="32" rx="0.8" fill={fc} stroke={fd} strokeWidth={sw} />
          <rect x="16" y="16" width="8" height="8" fill={fc} stroke={fd} strokeWidth={sw * 0.8} rx="0.5" />
          <rect x="8" y="4" width="2" height="32" fill={fl} opacity={0.35} rx="0.3" />
          <rect x="24" y="4" width="2" height="32" fill={fl} opacity={0.35} rx="0.3" />
        </g>
      );
    }

    // Travessa — horizontal bar
    if (t === "travessa") {
      return (
        <g>
          <rect x="4" y="12" width="32" height="16" rx="1.5" fill={fc} stroke={fd} strokeWidth={sw} />
          <rect x="4" y="12" width="32" height="4" fill={fl} opacity={0.4} rx="1" />
          <line x1="8" y1="20" x2="32" y2="20" stroke={fd} strokeWidth={0.6} opacity={0.3} />
          <rect x="6" y="24" width="28" height="2" fill={fd} opacity={0.15} rx="0.3" />
        </g>
      );
    }

    // Baguete — small clip
    if (t === "baguete") {
      return (
        <g>
          <rect x="12" y="13" width="16" height="14" rx="7" fill={fc} stroke={fd} strokeWidth={sw} />
          <rect x="12" y="13" width="16" height="4" rx="4" fill={fl} opacity={0.4} />
          <path d="M17 27 L17 32 L23 32 L23 27" fill={fc} stroke={fd} strokeWidth={sw * 0.7} />
        </g>
      );
    }

    // Contramarco — C-channel
    if (t === "contramarco") {
      return (
        <g>
          <path d="M30 6 L10 6 Q8 6 8 8 L8 32 Q8 34 10 34 L30 34" fill={fc} stroke={fd} strokeWidth={sw} />
          <path d="M26 10 L14 10 L14 30 L26 30" fill="none" stroke={fd} strokeWidth={sw * 0.6} />
          <rect x="8" y="6" width="3" height="28" fill={fl} opacity={0.35} rx="0.5" />
          <rect x="10" y="8" width="2" height="24" fill={fd} opacity={0.1} rx="0.3" />
        </g>
      );
    }

    // Arremate
    if (t === "arremate") {
      return (
        <g>
          <rect x="6" y="15" width="28" height="10" rx="1" fill={fc} stroke={fd} strokeWidth={sw} />
          <rect x="6" y="15" width="28" height="3" fill={fl} opacity={0.4} rx="0.5" />
          <path d="M6 15 L2 10 L8 10 Z" fill={fc} stroke={fd} strokeWidth={sw * 0.7} />
        </g>
      );
    }

    // Default — generic tube
    return (
      <g>
        <rect x="8" y="8" width="24" height="24" rx="1.5" fill={fc} stroke={fd} strokeWidth={sw} />
        <rect x="12" y="12" width="16" height="16" rx="0.8" fill="none" stroke={fd} strokeWidth={sw * 0.6} />
        <rect x="8" y="8" width="24" height="4" fill={fl} opacity={0.35} rx="1" />
      </g>
    );
  })();

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox="0 0 40 40" className="shrink-0">
        {shape}
      </svg>
      <span className="text-[9px] text-muted-foreground leading-tight text-center max-w-[70px] truncate" title={`${code} — ${name}`}>
        {code}
      </span>
    </div>
  );
}

export default function ProfileCrossSectionPanel({ profiles, color, className = "" }: ProfileCrossSectionPanelProps) {
  if (!profiles.length) return null;

  // Deduplicate by profile type
  const uniqueTypes = new Map<string, ProfileSection>();
  profiles.forEach(p => {
    const key = p.type.toLowerCase();
    if (!uniqueTypes.has(key)) uniqueTypes.set(key, p);
  });

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
        Seção dos Perfis
      </span>
      <div className="flex flex-wrap gap-3 justify-center">
        {Array.from(uniqueTypes.values()).map(p => (
          <CrossSection key={p.code} {...p} color={color} />
        ))}
      </div>
    </div>
  );
}
