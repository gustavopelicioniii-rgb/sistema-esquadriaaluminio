import type { AluminumColor } from './colors';

interface ProfileSection {
  code: string;
  name: string;
  type: string;
  weight_per_meter?: number;
}

interface ProfileCrossSectionPanelProps {
  profiles: ProfileSection[];
  color: AluminumColor;
  className?: string;
}

/** Typical cross-section dimensions (width × height in mm) by profile type */
function getTypicalDimensions(type: string, name: string): { w: number; h: number } | null {
  const t = type.toLowerCase();
  const n = name.toLowerCase();
  if (t === 'trilho' || n.includes('inferior')) return { w: 50, h: 15 };
  if (t === 'marco' && (n.includes('superior') || n.includes('sup'))) return { w: 40, h: 30 };
  if (t === 'marco') return { w: 25, h: 40 };
  if (t === 'montante') return { w: 22, h: 40 };
  if (t === 'travessa') return { w: 40, h: 20 };
  if (t === 'baguete') return { w: 18, h: 12 };
  if (t === 'contramarco') return { w: 30, h: 35 };
  if (t === 'arremate') return { w: 35, h: 12 };
  if (t === 'guia') return { w: 30, h: 10 };
  return { w: 25, h: 25 };
}

/** Dimension annotation lines (cotas) rendered inside the SVG */
function DimensionAnnotations({ dims, vb }: { dims: { w: number; h: number }; vb: number }) {
  const fontSize = 5.5;
  const tickLen = 2;
  const cotaColor = 'hsl(var(--muted-foreground))';

  return (
    <g opacity={0.7}>
      {/* Width dimension — bottom */}
      <line x1={4} y1={vb - 2} x2={vb - 4} y2={vb - 2} stroke={cotaColor} strokeWidth={0.5} />
      <line
        x1={4}
        y1={vb - 2 - tickLen}
        x2={4}
        y2={vb - 2 + tickLen}
        stroke={cotaColor}
        strokeWidth={0.5}
      />
      <line
        x1={vb - 4}
        y1={vb - 2 - tickLen}
        x2={vb - 4}
        y2={vb - 2 + tickLen}
        stroke={cotaColor}
        strokeWidth={0.5}
      />
      <text
        x={vb / 2}
        y={vb + 1}
        textAnchor="middle"
        fontSize={fontSize}
        fill={cotaColor}
        fontFamily="Inter, system-ui"
        fontWeight={600}
      >
        {dims.w}
      </text>

      {/* Height dimension — right */}
      <line x1={vb - 1} y1={3} x2={vb - 1} y2={vb - 6} stroke={cotaColor} strokeWidth={0.5} />
      <line
        x1={vb - 1 - tickLen}
        y1={3}
        x2={vb - 1 + tickLen}
        y2={3}
        stroke={cotaColor}
        strokeWidth={0.5}
      />
      <line
        x1={vb - 1 - tickLen}
        y1={vb - 6}
        x2={vb - 1 + tickLen}
        y2={vb - 6}
        stroke={cotaColor}
        strokeWidth={0.5}
      />
      <text
        x={vb + 1}
        y={(vb - 3) / 2 + 1}
        textAnchor="start"
        fontSize={fontSize}
        fill={cotaColor}
        fontFamily="Inter, system-ui"
        fontWeight={600}
        transform={`rotate(90, ${vb + 1}, ${(vb - 3) / 2 + 1})`}
      >
        {dims.h}
      </text>
    </g>
  );
}

/**
 * Renders realistic cross-section SVGs for aluminum profiles used in the selected typology.
 */
function CrossSection({
  code,
  name,
  type,
  color,
  weight_per_meter,
  size = 64,
}: ProfileSection & { color: AluminumColor; size?: number }) {
  const fc = color.frameColor;
  const fl = color.frameLight;
  const fd = color.frameDark;
  const sw = 1.2;
  const vb = 48; // viewBox size to accommodate annotations

  const t = type.toLowerCase();
  const dims = getTypicalDimensions(type, name);

  const shape = (() => {
    // Marco Superior — U-channel with internal ribs
    if (
      t === 'marco' &&
      (code.includes('010') || code.includes('SUP') || name.toLowerCase().includes('superior'))
    ) {
      return (
        <g>
          <path
            d="M6 32 L6 8 Q6 6 8 6 L32 6 Q34 6 34 8 L34 32"
            stroke={fd}
            fill={fc}
            strokeWidth={sw}
          />
          <path d="M10 32 L10 12 L30 12 L30 32" stroke={fd} fill="none" strokeWidth={sw * 0.7} />
          <rect x="6" y="6" width="28" height="3" fill={fl} opacity={0.5} rx="1" />
          <line x1="14" y1="12" x2="14" y2="28" stroke={fd} strokeWidth={0.5} opacity={0.3} />
          <line x1="26" y1="12" x2="26" y2="28" stroke={fd} strokeWidth={0.5} opacity={0.3} />
          <rect x="8" y="9" width="24" height="1.5" fill={fd} opacity={0.15} rx="0.3" />
        </g>
      );
    }

    // Marco Inferior / Trilho — rail with tracks
    if (t === 'trilho' || name.toLowerCase().includes('inferior')) {
      return (
        <g>
          <rect
            x="4"
            y="22"
            width="32"
            height="10"
            rx="1.5"
            fill={fc}
            stroke={fd}
            strokeWidth={sw}
          />
          <rect x="4" y="22" width="32" height="3" fill={fl} opacity={0.4} rx="1" />
          <rect
            x="12"
            y="14"
            width="2.5"
            height="8"
            fill={fc}
            stroke={fd}
            strokeWidth={sw * 0.7}
            rx="0.5"
          />
          <rect
            x="25"
            y="14"
            width="2.5"
            height="8"
            fill={fc}
            stroke={fd}
            strokeWidth={sw * 0.7}
            rx="0.5"
          />
          <rect x="12" y="14" width="2.5" height="2" fill={fl} opacity={0.4} rx="0.3" />
          <rect x="25" y="14" width="2.5" height="2" fill={fl} opacity={0.4} rx="0.3" />
          <rect x="6" y="28" width="28" height="2" fill={fd} opacity={0.2} rx="0.3" />
        </g>
      );
    }

    // Marco Lateral — rectangular tube with internal web
    if (t === 'marco') {
      return (
        <g>
          <rect x="10" y="4" width="12" height="32" rx="1" fill={fc} stroke={fd} strokeWidth={sw} />
          <rect x="10" y="4" width="3" height="32" fill={fl} opacity={0.35} rx="0.5" />
          <rect x="19" y="4" width="1.5" height="32" fill={fd} opacity={0.2} rx="0.3" />
          <rect
            x="22"
            y="8"
            width="8"
            height="3"
            fill={fc}
            stroke={fd}
            strokeWidth={sw * 0.7}
            rx="0.5"
          />
          <rect
            x="22"
            y="28"
            width="8"
            height="3"
            fill={fc}
            stroke={fd}
            strokeWidth={sw * 0.7}
            rx="0.5"
          />
          <rect x="22" y="8" width="8" height="1" fill={fl} opacity={0.3} rx="0.3" />
          <rect x="22" y="28" width="8" height="1" fill={fl} opacity={0.3} rx="0.3" />
        </g>
      );
    }

    // Montante — H-beam / mullion
    if (t === 'montante') {
      return (
        <g>
          <rect x="8" y="4" width="8" height="32" rx="0.8" fill={fc} stroke={fd} strokeWidth={sw} />
          <rect
            x="24"
            y="4"
            width="8"
            height="32"
            rx="0.8"
            fill={fc}
            stroke={fd}
            strokeWidth={sw}
          />
          <rect
            x="16"
            y="16"
            width="8"
            height="8"
            fill={fc}
            stroke={fd}
            strokeWidth={sw * 0.8}
            rx="0.5"
          />
          <rect x="8" y="4" width="2" height="32" fill={fl} opacity={0.35} rx="0.3" />
          <rect x="24" y="4" width="2" height="32" fill={fl} opacity={0.35} rx="0.3" />
        </g>
      );
    }

    // Travessa — horizontal bar
    if (t === 'travessa') {
      return (
        <g>
          <rect
            x="4"
            y="12"
            width="32"
            height="16"
            rx="1.5"
            fill={fc}
            stroke={fd}
            strokeWidth={sw}
          />
          <rect x="4" y="12" width="32" height="4" fill={fl} opacity={0.4} rx="1" />
          <line x1="8" y1="20" x2="32" y2="20" stroke={fd} strokeWidth={0.6} opacity={0.3} />
          <rect x="6" y="24" width="28" height="2" fill={fd} opacity={0.15} rx="0.3" />
        </g>
      );
    }

    // Baguete — small clip
    if (t === 'baguete') {
      return (
        <g>
          <rect
            x="12"
            y="13"
            width="16"
            height="14"
            rx="7"
            fill={fc}
            stroke={fd}
            strokeWidth={sw}
          />
          <rect x="12" y="13" width="16" height="4" rx="4" fill={fl} opacity={0.4} />
          <path d="M17 27 L17 32 L23 32 L23 27" fill={fc} stroke={fd} strokeWidth={sw * 0.7} />
        </g>
      );
    }

    // Contramarco — C-channel
    if (t === 'contramarco') {
      return (
        <g>
          <path
            d="M30 6 L10 6 Q8 6 8 8 L8 32 Q8 34 10 34 L30 34"
            fill={fc}
            stroke={fd}
            strokeWidth={sw}
          />
          <path d="M26 10 L14 10 L14 30 L26 30" fill="none" stroke={fd} strokeWidth={sw * 0.6} />
          <rect x="8" y="6" width="3" height="28" fill={fl} opacity={0.35} rx="0.5" />
          <rect x="10" y="8" width="2" height="24" fill={fd} opacity={0.1} rx="0.3" />
        </g>
      );
    }

    // Arremate
    if (t === 'arremate') {
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
        <rect
          x="12"
          y="12"
          width="16"
          height="16"
          rx="0.8"
          fill="none"
          stroke={fd}
          strokeWidth={sw * 0.6}
        />
        <rect x="8" y="8" width="24" height="4" fill={fl} opacity={0.35} rx="1" />
      </g>
    );
  })();

  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg width={size} height={size} viewBox={`0 0 ${vb} ${vb}`} className="shrink-0">
        {shape}
        {dims && <DimensionAnnotations dims={dims} vb={vb} />}
      </svg>
      <span
        className="text-[9px] text-muted-foreground leading-tight text-center max-w-[80px] truncate"
        title={`${code} — ${name}`}
      >
        {code}
      </span>
      {dims && (
        <span className="text-[8px] text-muted-foreground/70 leading-none">
          {dims.w}×{dims.h} mm
        </span>
      )}
      {weight_per_meter != null && weight_per_meter > 0 && (
        <span className="text-[7px] text-muted-foreground/50 leading-none">
          {weight_per_meter.toFixed(3)} kg/m
        </span>
      )}
    </div>
  );
}

export default function ProfileCrossSectionPanel({
  profiles,
  color,
  className = '',
}: ProfileCrossSectionPanelProps) {
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
      <div className="flex flex-wrap gap-4 justify-center">
        {Array.from(uniqueTypes.values()).map(p => (
          <CrossSection key={p.code} {...p} color={color} />
        ))}
      </div>
    </div>
  );
}
