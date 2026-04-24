import React from "react";
import type { AluminumColor } from "./colorResolver";
import { DEFAULT_ALUMINUM_COLOR } from "./colorResolver";
import {
  Glass,
  ProfileFrame,
  LeafFrame,
  RailLines,
  SlidingArrow,
} from "./svgTemplates";

interface SvgProps {
  width: number;
  height: number;
  color: AluminumColor;
  numFolhas?: number;
  svgWidth: number;
  svgHeight: number;
}

// ===== REALISTIC FRAME CONSTANTS =====
const FRAME_RATIO = 0.07;
const MIN_FRAME = 10;
const LEAF_FRAME_RATIO = 0.55;

function ft(w: number, h: number) {
  return Math.max(MIN_FRAME, Math.min(w, h) * FRAME_RATIO);
}

// ============================================================
// SLIDING WINDOW (2F, 3F, 4F, 6F)
// ============================================================
function SlidingWindow({ svgWidth: sw, svgHeight: sh, color, numFolhas = 2 }: SvgProps) {
  const pad = 6;
  const w = sw - pad * 2;
  const h = sh - pad * 2;
  const t = ft(w, h);
  const nf = numFolhas;
  const folhaW = (w - 2 * t) / nf;
  const folhaH = h - 2 * t;
  const lt = t * LEAF_FRAME_RATIO;
  const arrowSize = Math.min(14, folhaW * 0.12);

  return (
    <g>
      <ProfileFrame x={pad} y={pad} w={w} h={h} color={color} t={t} />
      {/* Rail indicators */}
      <RailLines x={pad + t} y={pad + h - t + 2} w={w - 2 * t} numRails={Math.min(nf, 3)} color={color} />
      <RailLines x={pad + t} y={pad + t - 4} w={w - 2 * t} numRails={Math.min(nf, 3)} color={color} />
      {/* Leaves */}
      {Array.from({ length: nf }).map((_, i) => {
        const fx = pad + t + folhaW * i;
        const fy = pad + t;
        return (
          <g key={i}>
            <LeafFrame x={fx + 1} y={fy + 1} w={folhaW - 2} h={folhaH - 2} color={color} t={t} />
            {i < nf - 1 && (
              <line x1={fx + folhaW} y1={fy} x2={fx + folhaW} y2={fy + folhaH} stroke={color.frameDark} strokeWidth="1" />
            )}
          </g>
        );
      })}
      {/* Sliding arrows */}
      {Array.from({ length: nf }).map((_, i) => {
        const cx = pad + t + folhaW * i + folhaW / 2;
        const cy = pad + h / 2;
        const dir = i % 2 === 0 ? 1 : -1;
        return <SlidingArrow key={i} cx={cx} cy={cy} size={arrowSize} direction={dir as 1 | -1} color={color} />;
      })}
    </g>
  );
}

// ============================================================
// FIXED WINDOW (1F, 2F, 3F)
// ============================================================
function FixedWindow({ svgWidth: sw, svgHeight: sh, color, numFolhas = 1 }: SvgProps) {
  const pad = 6;
  const w = sw - pad * 2;
  const h = sh - pad * 2;
  const t = ft(w, h);
  const nf = numFolhas;
  const cols = nf === 3 ? 3 : nf === 2 ? 2 : 1;
  const rows = nf === 3 ? 1 : 1;
  const folhaW = (w - 2 * t - (cols - 1) * 4) / cols;
  const folhaH = h - 2 * t;

  return (
    <g>
      <ProfileFrame x={pad} y={pad} w={w} h={h} color={color} t={t} />
      {Array.from({ length: nf }).map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const fx = pad + t + col * (folhaW + 4);
        const fy = pad + t;
        return (
          <g key={i}>
            <LeafFrame x={fx} y={fy} w={folhaW} h={folhaH} color={color} t={t} />
            {col < cols - 1 && (
              <line x1={fx + folhaW + 2} y1={fy} x2={fx + folhaW + 2} y2={fy + folhaH} stroke={color.frameDark} strokeWidth="0.8" />
            )}
          </g>
        );
      })}
    </g>
  );
}

// ============================================================
// PROJECTION WINDOW (maxim-ar) - with open effect
// ============================================================
function MaximArWindow({ svgWidth: sw, svgHeight: sh, color, numFolhas = 1 }: SvgProps) {
  const pad = 6;
  const w = sw - pad * 2;
  const h = sh - pad * 2;
  const t = ft(w, h);
  const gap = 6;
  const nf = numFolhas;
  const folhaW = (w - 2 * t - (nf - 1) * gap) / nf;
  const folhaH = h - 2 * t;

  return (
    <g>
      {/* Main frame */}
      <ProfileFrame x={pad} y={pad} w={w} h={h} color={color} t={t} />
      {/* Leaves projected outward */}
      {Array.from({ length: nf }).map((_, i) => {
        const offset = (i - (nf - 1) / 2) * gap * 0.5;
        const fx = pad + t + (w - 2 * t - folhaW) * (0.15 + i * 0.7 / (nf - 1 || 1));
        const fy = pad + t - offset;
        return (
          <g key={i} opacity="0.9">
            <LeafFrame x={fx} y={fy} w={folhaW} h={folhaH} color={color} t={t} />
          </g>
        );
      })}
    </g>
  );
}

// ============================================================
// TYPOLOGY SVG DISPATCHER
// ============================================================
export function getTypologySvg(type: string, props: SvgProps): React.ReactElement {
  const slidingTypes = ["2f", "3f", "4f", "6f", "deslizante"];
  const fixedTypes = ["1f", "2fx", "3fx", "fixa", "maxim_ar"];
  
  // Safety check: ensure color is never undefined
  const safeProps = {
    ...props,
    color: props.color || DEFAULT_ALUMINUM_COLOR,
  };
  
  if (slidingTypes.includes(type)) {
    return <SlidingWindow {...safeProps} />;
  }
  if (fixedTypes.includes(type)) {
    return <FixedWindow {...safeProps} />;
  }
  if (type === "projetante" || type === "maxim-ar") {
    return <MaximArWindow {...safeProps} />;
  }
  // Default to sliding 2F
  return <SlidingWindow {...safeProps} />;
}

export type { SvgProps };
