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
  color = 'currentColor',
}: ProfileCrossSectionProps) {
  const stroke = color;
  const fill = 'none';
  const sw = 1.5; // stroke width

  // Determine shape from profile_type or code patterns
  const type = profileType.toLowerCase();
  const code = profileCode.toUpperCase();

  const renderShape = () => {
    // Marco Superior — U channel shape
    if (type === 'marco' && (code.includes('010') || code.includes('superior'))) {
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
    if (type === 'trilho') {
      return (
        <g>
          <rect
            x="6"
            y="24"
            width="28"
            height="6"
            stroke={stroke}
            fill={fill}
            strokeWidth={sw}
            rx="1"
          />
          <line x1="14" y1="24" x2="14" y2="18" stroke={stroke} strokeWidth={sw} />
          <line x1="26" y1="24" x2="26" y2="18" stroke={stroke} strokeWidth={sw} />
          <path d="M12 18 L16 18" stroke={stroke} strokeWidth={sw} />
          <path d="M24 18 L28 18" stroke={stroke} strokeWidth={sw} />
          <rect x="8" y="26" width="24" height="2" fill={stroke} opacity={0.1} />
        </g>
      );
    }

    // Marco Lateral — L-shaped or rectangular tube
    if (type === 'marco') {
      return (
        <g>
          <rect
            x="10"
            y="6"
            width="8"
            height="28"
            stroke={stroke}
            fill={fill}
            strokeWidth={sw}
            rx="1"
          />
          <line x1="18" y1="10" x2="30" y2="10" stroke={stroke} strokeWidth={sw} />
          <line x1="18" y1="30" x2="30" y2="30" stroke={stroke} strokeWidth={sw} />
          <rect x="12" y="8" width="4" height="24" fill={stroke} opacity={0.08} />
        </g>
      );
    }

    // Montante — vertical H or I beam shape
    if (type === 'montante') {
      return (
        <g>
          <rect
            x="10"
            y="6"
            width="6"
            height="28"
            stroke={stroke}
            fill={fill}
            strokeWidth={sw}
            rx="0.5"
          />
          <rect
            x="24"
            y="6"
            width="6"
            height="28"
            stroke={stroke}
            fill={fill}
            strokeWidth={sw}
            rx="0.5"
          />
          <line x1="16" y1="20" x2="24" y2="20" stroke={stroke} strokeWidth={sw} />
          <rect x="12" y="8" width="2" height="24" fill={stroke} opacity={0.1} />
          <rect x="26" y="8" width="2" height="24" fill={stroke} opacity={0.1} />
        </g>
      );
    }

    // Travessa — flat horizontal bar with lip
    if (type === 'travessa') {
      return (
        <g>
          <rect
            x="6"
            y="14"
            width="28"
            height="12"
            stroke={stroke}
            fill={fill}
            strokeWidth={sw}
            rx="1"
          />
          <line
            x1="10"
            y1="20"
            x2="30"
            y2="20"
            stroke={stroke}
            strokeWidth={sw}
            strokeDasharray="2 2"
          />
          <rect x="8" y="16" width="24" height="2" fill={stroke} opacity={0.1} />
        </g>
      );
    }

    // Baguete — small rounded strip
    if (type === 'baguete') {
      return (
        <g>
          <rect
            x="12"
            y="14"
            width="16"
            height="12"
            rx="6"
            stroke={stroke}
            fill={fill}
            strokeWidth={sw}
          />
          <ellipse cx="20" cy="20" rx="4" ry="3" fill={stroke} opacity={0.1} />
        </g>
      );
    }

    // Contramarco — C-channel
    if (type === 'contramarco') {
      return (
        <g>
          <path d="M28 8 L10 8 L10 32 L28 32" stroke={stroke} fill={fill} strokeWidth={sw} />
          <line
            x1="10"
            y1="20"
            x2="22"
            y2="20"
            stroke={stroke}
            strokeWidth={sw}
            strokeDasharray="2 2"
          />
          <rect x="11" y="10" width="4" height="20" fill={stroke} opacity={0.06} />
        </g>
      );
    }

    // Arremate / Palheta / others — simple flat profile
    if (type === 'arremate') {
      return (
        <g>
          <rect
            x="8"
            y="16"
            width="24"
            height="8"
            stroke={stroke}
            fill={fill}
            strokeWidth={sw}
            rx="1"
          />
          <line x1="8" y1="12" x2="14" y2="16" stroke={stroke} strokeWidth={sw} />
          <rect x="10" y="18" width="20" height="4" fill={stroke} opacity={0.08} />
        </g>
      );
    }

    // Vidro — glass pane with reflection
    if (type === 'vidro') {
      return (
        <g>
          <rect
            x="8"
            y="6"
            width="24"
            height="28"
            stroke={stroke}
            fill={fill}
            strokeWidth={sw}
            rx="1"
          />
          <line x1="12" y1="10" x2="16" y2="18" stroke={stroke} strokeWidth={0.8} opacity={0.4} />
          <line x1="14" y1="10" x2="18" y2="18" stroke={stroke} strokeWidth={0.8} opacity={0.4} />
          <rect x="10" y="8" width="20" height="24" fill={stroke} opacity={0.05} />
        </g>
      );
    }

    // Ferragem — bolt/screw shape
    if (type === 'ferragem') {
      return (
        <g>
          <circle cx="20" cy="18" r="8" stroke={stroke} fill={fill} strokeWidth={sw} />
          <circle
            cx="20"
            cy="18"
            r="3"
            stroke={stroke}
            fill={stroke}
            strokeWidth={0.5}
            opacity={0.3}
          />
          <line x1="20" y1="26" x2="20" y2="34" stroke={stroke} strokeWidth={sw + 0.5} />
          <line x1="16" y1="32" x2="24" y2="32" stroke={stroke} strokeWidth={sw} />
        </g>
      );
    }

    // Acessório — gear/cog shape
    if (type === 'acessorio') {
      return (
        <g>
          <circle cx="20" cy="20" r="7" stroke={stroke} fill={fill} strokeWidth={sw} />
          <circle
            cx="20"
            cy="20"
            r="3"
            stroke={stroke}
            fill={stroke}
            strokeWidth={0.5}
            opacity={0.2}
          />
          <line x1="20" y1="7" x2="20" y2="13" stroke={stroke} strokeWidth={2.5} />
          <line x1="20" y1="27" x2="20" y2="33" stroke={stroke} strokeWidth={2.5} />
          <line x1="7" y1="20" x2="13" y2="20" stroke={stroke} strokeWidth={2.5} />
          <line x1="27" y1="20" x2="33" y2="20" stroke={stroke} strokeWidth={2.5} />
          <line x1="11" y1="11" x2="15" y2="15" stroke={stroke} strokeWidth={2} />
          <line x1="25" y1="25" x2="29" y2="29" stroke={stroke} strokeWidth={2} />
          <line x1="25" y1="15" x2="29" y2="11" stroke={stroke} strokeWidth={2} />
          <line x1="11" y1="29" x2="15" y2="25" stroke={stroke} strokeWidth={2} />
        </g>
      );
    }

    // Vedação — rubber seal / gasket shape
    if (type === 'vedacao') {
      return (
        <g>
          <path d="M10 28 Q10 12 20 12 Q30 12 30 28" stroke={stroke} fill={fill} strokeWidth={sw} />
          <line x1="8" y1="28" x2="32" y2="28" stroke={stroke} strokeWidth={sw} />
          <path
            d="M14 28 Q14 18 20 18 Q26 18 26 28"
            stroke={stroke}
            fill={stroke}
            strokeWidth={0.5}
            opacity={0.1}
          />
        </g>
      );
    }

    // Puxador — handle shape
    if (type === 'puxador') {
      return (
        <g>
          <rect
            x="18"
            y="6"
            width="4"
            height="28"
            stroke={stroke}
            fill={fill}
            strokeWidth={sw}
            rx="2"
          />
          <line x1="14" y1="10" x2="18" y2="10" stroke={stroke} strokeWidth={sw} />
          <line x1="14" y1="30" x2="18" y2="30" stroke={stroke} strokeWidth={sw} />
          <line x1="14" y1="10" x2="14" y2="30" stroke={stroke} strokeWidth={sw} />
          <rect x="19" y="8" width="2" height="24" fill={stroke} opacity={0.08} />
        </g>
      );
    }

    // Fechadura — lock shape
    if (type === 'fechadura') {
      return (
        <g>
          <rect
            x="12"
            y="16"
            width="16"
            height="14"
            stroke={stroke}
            fill={fill}
            strokeWidth={sw}
            rx="1"
          />
          <path
            d="M15 16 L15 12 Q15 8 20 8 Q25 8 25 12 L25 16"
            stroke={stroke}
            fill={fill}
            strokeWidth={sw}
          />
          <circle
            cx="20"
            cy="23"
            r="2.5"
            stroke={stroke}
            fill={stroke}
            strokeWidth={0.5}
            opacity={0.3}
          />
          <line x1="20" y1="25" x2="20" y2="28" stroke={stroke} strokeWidth={sw} />
        </g>
      );
    }

    // Roldana — roller/wheel shape
    if (type === 'roldana') {
      return (
        <g>
          <circle cx="20" cy="22" r="10" stroke={stroke} fill={fill} strokeWidth={sw} />
          <circle cx="20" cy="22" r="4" stroke={stroke} fill={fill} strokeWidth={sw} />
          <circle cx="20" cy="22" r="1.5" fill={stroke} opacity={0.3} />
          <line x1="16" y1="10" x2="16" y2="14" stroke={stroke} strokeWidth={sw} />
          <line x1="24" y1="10" x2="24" y2="14" stroke={stroke} strokeWidth={sw} />
          <line x1="16" y1="10" x2="24" y2="10" stroke={stroke} strokeWidth={sw} />
        </g>
      );
    }

    // Parafuso — screw
    if (type === 'parafuso') {
      return (
        <g>
          <circle cx="20" cy="12" r="6" stroke={stroke} fill={fill} strokeWidth={sw} />
          <line x1="17" y1="12" x2="23" y2="12" stroke={stroke} strokeWidth={sw} />
          <line x1="20" y1="9" x2="20" y2="15" stroke={stroke} strokeWidth={sw} />
          <line x1="18" y1="18" x2="22" y2="18" stroke={stroke} strokeWidth={sw} />
          <line x1="17" y1="22" x2="23" y2="22" stroke={stroke} strokeWidth={sw} />
          <line x1="18" y1="26" x2="22" y2="26" stroke={stroke} strokeWidth={sw} />
          <line x1="19" y1="30" x2="21" y2="30" stroke={stroke} strokeWidth={sw} />
          <line x1="20" y1="18" x2="20" y2="34" stroke={stroke} strokeWidth={sw * 0.7} />
        </g>
      );
    }

    // Default — generic rectangular tube
    return (
      <g>
        <rect
          x="10"
          y="10"
          width="20"
          height="20"
          stroke={stroke}
          fill={fill}
          strokeWidth={sw}
          rx="1"
        />
        <rect
          x="14"
          y="14"
          width="12"
          height="12"
          stroke={stroke}
          fill={fill}
          strokeWidth={sw * 0.7}
          rx="0.5"
        />
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
