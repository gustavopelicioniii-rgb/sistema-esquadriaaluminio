/**
 * Simple SVG cross-section illustrations for aluminum profile types.
 * Each shape is a stylised representation of the extrusion.
 */

interface ProfileCrossSectionProps {
  profileType: string;
  profileCode: string;
  size?: number;
  color?: string;
}

export function ProfileCrossSection({
  profileType,
  profileCode,
  size = 40,
  color = "currentColor",
}: ProfileCrossSectionProps) {
  const stroke = color;
  const fill = "none";
  const sw = 1.5; // stroke width

  // Determine shape from profile_type or code patterns
  const type = profileType.toLowerCase();
  const code = profileCode.toUpperCase();

  const renderShape = () => {
    // Marco Superior — U channel shape
    if (type === "marco" && (code.includes("010") || code.includes("superior"))) {
      return (
        <g>
          <path d={`M8 30 L8 10 L32 10 L32 30`} stroke={stroke} fill={fill} strokeWidth={sw} />
          <line x1="6" y1="10" x2="12" y2="10" stroke={stroke} strokeWidth={sw} />
          <line x1="28" y1="10" x2="34" y2="10" stroke={stroke} strokeWidth={sw} />
          <rect x="10" y="14" width="20" height="3" fill={stroke} opacity={0.15} rx="0.5" />
        </g>
      );
    }

    // Marco Inferior / Trilho — rail shape with tracks
    if (type === "trilho") {
      return (
        <g>
          <rect x="6" y="24" width="28" height="6" stroke={stroke} fill={fill} strokeWidth={sw} rx="1" />
          <line x1="14" y1="24" x2="14" y2="18" stroke={stroke} strokeWidth={sw} />
          <line x1="26" y1="24" x2="26" y2="18" stroke={stroke} strokeWidth={sw} />
          <path d="M12 18 L16 18" stroke={stroke} strokeWidth={sw} />
          <path d="M24 18 L28 18" stroke={stroke} strokeWidth={sw} />
          <rect x="8" y="26" width="24" height="2" fill={stroke} opacity={0.1} />
        </g>
      );
    }

    // Marco Lateral — L-shaped or rectangular tube
    if (type === "marco") {
      return (
        <g>
          <rect x="10" y="6" width="8" height="28" stroke={stroke} fill={fill} strokeWidth={sw} rx="1" />
          <line x1="18" y1="10" x2="30" y2="10" stroke={stroke} strokeWidth={sw} />
          <line x1="18" y1="30" x2="30" y2="30" stroke={stroke} strokeWidth={sw} />
          <rect x="12" y="8" width="4" height="24" fill={stroke} opacity={0.08} />
        </g>
      );
    }

    // Montante — vertical H or I beam shape
    if (type === "montante") {
      return (
        <g>
          <rect x="10" y="6" width="6" height="28" stroke={stroke} fill={fill} strokeWidth={sw} rx="0.5" />
          <rect x="24" y="6" width="6" height="28" stroke={stroke} fill={fill} strokeWidth={sw} rx="0.5" />
          <line x1="16" y1="20" x2="24" y2="20" stroke={stroke} strokeWidth={sw} />
          <rect x="12" y="8" width="2" height="24" fill={stroke} opacity={0.1} />
          <rect x="26" y="8" width="2" height="24" fill={stroke} opacity={0.1} />
        </g>
      );
    }

    // Travessa — flat horizontal bar with lip
    if (type === "travessa") {
      return (
        <g>
          <rect x="6" y="14" width="28" height="12" stroke={stroke} fill={fill} strokeWidth={sw} rx="1" />
          <line x1="10" y1="20" x2="30" y2="20" stroke={stroke} strokeWidth={sw} strokeDasharray="2 2" />
          <rect x="8" y="16" width="24" height="2" fill={stroke} opacity={0.1} />
        </g>
      );
    }

    // Baguete — small rounded strip
    if (type === "baguete") {
      return (
        <g>
          <rect x="12" y="14" width="16" height="12" rx="6" stroke={stroke} fill={fill} strokeWidth={sw} />
          <ellipse cx="20" cy="20" rx="4" ry="3" fill={stroke} opacity={0.1} />
        </g>
      );
    }

    // Contramarco — C-channel
    if (type === "contramarco") {
      return (
        <g>
          <path d="M28 8 L10 8 L10 32 L28 32" stroke={stroke} fill={fill} strokeWidth={sw} />
          <line x1="10" y1="20" x2="22" y2="20" stroke={stroke} strokeWidth={sw} strokeDasharray="2 2" />
          <rect x="11" y="10" width="4" height="20" fill={stroke} opacity={0.06} />
        </g>
      );
    }

    // Arremate / Palheta / others — simple flat profile
    if (type === "arremate") {
      return (
        <g>
          <rect x="8" y="16" width="24" height="8" stroke={stroke} fill={fill} strokeWidth={sw} rx="1" />
          <line x1="8" y1="12" x2="14" y2="16" stroke={stroke} strokeWidth={sw} />
          <rect x="10" y="18" width="20" height="4" fill={stroke} opacity={0.08} />
        </g>
      );
    }

    // Default — generic rectangular tube
    return (
      <g>
        <rect x="10" y="10" width="20" height="20" stroke={stroke} fill={fill} strokeWidth={sw} rx="1" />
        <rect x="14" y="14" width="12" height="12" stroke={stroke} fill={fill} strokeWidth={sw * 0.7} rx="0.5" />
      </g>
    );
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className="shrink-0"
      aria-label={`Perfil ${profileCode}`}
    >
      {renderShape()}
    </svg>
  );
}
