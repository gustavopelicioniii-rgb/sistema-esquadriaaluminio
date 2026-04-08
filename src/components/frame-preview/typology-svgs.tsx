import React from "react";
import type { AluminumColor } from "./colors";

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

// ===== REALISTIC GLASS PANEL =====
function Glass({ x, y, w, h, color }: { x: number; y: number; w: number; h: number; color: AluminumColor }) {
  const id = `glass-${x}-${y}-${Math.random().toString(36).slice(2, 6)}`;
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color.glassColor} stopOpacity={color.glassOpacity * 0.6} />
          <stop offset="35%" stopColor={color.glassColor} stopOpacity={color.glassOpacity} />
          <stop offset="65%" stopColor={color.glassColor} stopOpacity={color.glassOpacity * 0.85} />
          <stop offset="100%" stopColor={color.glassColor} stopOpacity={color.glassOpacity * 0.7} />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id})`} />
      {/* Primary reflection diagonal */}
      <line x1={x + w * 0.12} y1={y + h * 0.08} x2={x + w * 0.3} y2={y + h * 0.92}
        stroke="white" strokeWidth={1.5} opacity={0.25} />
      <line x1={x + w * 0.18} y1={y + h * 0.06} x2={x + w * 0.36} y2={y + h * 0.9}
        stroke="white" strokeWidth={0.8} opacity={0.15} />
      {/* Subtle secondary reflection */}
      <line x1={x + w * 0.55} y1={y + h * 0.05} x2={x + w * 0.65} y2={y + h * 0.35}
        stroke="white" strokeWidth={0.5} opacity={0.1} />
    </g>
  );
}

// ===== DROP SHADOW FILTER =====
let _filterId = 0;
function useFilterId() { return `frame-shadow-${++_filterId}`; }

// ===== REALISTIC ALUMINUM PROFILE (FRAME) =====
function ProfileFrame({ x, y, w, h, color, t }: { x: number; y: number; w: number; h: number; color: AluminumColor; t: number }) {
  const groove = t * 0.15;
  const inner = t * 0.25;
  const fId = useFilterId();
  return (
    <g>
      <defs>
        <filter id={fId} x="-8%" y="-6%" width="120%" height="120%">
          <feDropShadow dx="2" dy="3" stdDeviation="4" floodColor={color.frameDark} floodOpacity="0.25" />
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor={color.frameDark} floodOpacity="0.15" />
        </filter>
      </defs>
      {/* Outer body with drop shadow */}
      <rect x={x} y={y} width={w} height={h} fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.8} filter={`url(#${fId})`} />
      {/* Top bevel highlight */}
      <rect x={x} y={y} width={w} height={t * 0.35} fill={color.frameLight} opacity={0.55} />
      {/* Left bevel highlight */}
      <rect x={x} y={y} width={t * 0.3} height={h} fill={color.frameLight} opacity={0.35} />
      {/* Bottom shadow */}
      <rect x={x} y={y + h - t * 0.3} width={w} height={t * 0.3} fill={color.frameDark} opacity={0.45} />
      {/* Right shadow */}
      <rect x={x + w - t * 0.25} y={y} width={t * 0.25} height={h} fill={color.frameDark} opacity={0.35} />
      {/* Inner groove - top */}
      <rect x={x + inner} y={y + t - groove * 2} width={w - inner * 2} height={groove} fill={color.frameDark} opacity={0.5} rx={0.3} />
      {/* Inner groove - bottom */}
      <rect x={x + inner} y={y + h - t + groove} width={w - inner * 2} height={groove} fill={color.frameDark} opacity={0.5} rx={0.3} />
      {/* Inner groove - left */}
      <rect x={x + t - groove * 2} y={y + inner} width={groove} height={h - inner * 2} fill={color.frameDark} opacity={0.5} rx={0.3} />
      {/* Inner groove - right */}
      <rect x={x + w - t + groove} y={y + inner} width={groove} height={h - inner * 2} fill={color.frameDark} opacity={0.5} rx={0.3} />
      {/* Inner edge line */}
      <rect x={x + t} y={y + t} width={w - 2 * t} height={h - 2 * t} fill="none" stroke={color.frameDark} strokeWidth={0.6} />
    </g>
  );
}

// ===== LEAF FRAME (folha) =====
function LeafFrame({ x, y, w, h, color, t }: { x: number; y: number; w: number; h: number; color: AluminumColor; t: number }) {
  const lt = t * LEAF_FRAME_RATIO;
  const groove = lt * 0.2;
  return (
    <g>
      {/* Leaf outer */}
      <rect x={x} y={y} width={w} height={h} fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.6} />
      {/* Top highlight */}
      <rect x={x} y={y} width={w} height={lt * 0.3} fill={color.frameLight} opacity={0.4} />
      {/* Left highlight */}
      <rect x={x} y={y} width={lt * 0.25} height={h} fill={color.frameLight} opacity={0.25} />
      {/* Bottom/right shadow */}
      <rect x={x} y={y + h - lt * 0.25} width={w} height={lt * 0.25} fill={color.frameDark} opacity={0.35} />
      <rect x={x + w - lt * 0.2} y={y} width={lt * 0.2} height={h} fill={color.frameDark} opacity={0.25} />
      {/* Profile groove detail */}
      <rect x={x + lt - groove} y={y + lt * 0.5} width={groove * 0.7} height={h - lt} fill={color.frameDark} opacity={0.35} rx={0.2} />
      <rect x={x + w - lt + groove * 0.3} y={y + lt * 0.5} width={groove * 0.7} height={h - lt} fill={color.frameDark} opacity={0.35} rx={0.2} />
      {/* Glass inset */}
      <Glass x={x + lt} y={y + lt} w={w - lt * 2} h={h - lt * 2} color={color} />
    </g>
  );
}

// ===== RAIL / TRILHO =====
function RailLines({ x, y, w, numRails, color }: { x: number; y: number; w: number; numRails: number; color: AluminumColor }) {
  const spacing = 3;
  return (
    <g>
      {Array.from({ length: numRails }).map((_, i) => (
        <line key={i} x1={x} y1={y + i * spacing} x2={x + w} y2={y + i * spacing}
          stroke={color.frameDark} strokeWidth={0.6} opacity={0.4} />
      ))}
    </g>
  );
}

// ===== SLIDING ARROWS (more detailed) =====
function SlidingArrow({ cx, cy, size, direction, color }: { cx: number; cy: number; size: number; direction: 1 | -1; color: AluminumColor }) {
  const dx = size * direction;
  return (
    <g opacity={0.5}>
      <line x1={cx - dx * 0.8} y1={cy} x2={cx + dx * 0.8} y2={cy} stroke={color.frameDark} strokeWidth={1.8} />
      <polygon
        points={`${cx + dx},${cy} ${cx + dx * 0.4},${cy - size * 0.45} ${cx + dx * 0.4},${cy + size * 0.45}`}
        fill={color.frameDark} />
    </g>
  );
}

// ===== HANDLE (puxador concha) =====
function HandleConcha({ cx, cy, size, color }: { cx: number; cy: number; size: number; color: AluminumColor }) {
  return (
    <g>
      <rect x={cx - size * 0.35} y={cy - size} width={size * 0.7} height={size * 2} rx={size * 0.35}
        fill={color.frameDark} opacity={0.25} />
      <rect x={cx - size * 0.25} y={cy - size * 0.7} width={size * 0.5} height={size * 1.4} rx={size * 0.25}
        fill={color.frameDark} opacity={0.5} />
    </g>
  );
}

// ===== HINGE DOT =====
function Hinge({ cx, cy, color }: { cx: number; cy: number; color: AluminumColor }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={3} fill={color.frameDark} opacity={0.3} />
      <circle cx={cx} cy={cy} r={1.8} fill={color.frameDark} opacity={0.6} />
    </g>
  );
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
      {/* Rail indicators at top and bottom */}
      <RailLines x={pad + t} y={pad + h - t + 2} w={w - 2 * t} numRails={Math.min(nf, 3)} color={color} />
      <RailLines x={pad + t} y={pad + t - 4} w={w - 2 * t} numRails={Math.min(nf, 3)} color={color} />
      {/* Leaves */}
      {Array.from({ length: nf }).map((_, i) => {
        const fx = pad + t + folhaW * i;
        const fy = pad + t;
        return (
          <g key={i}>
            <LeafFrame x={fx + 1} y={fy + 1} w={folhaW - 2} h={folhaH - 2} color={color} t={t} />
            {/* Divider between leaves */}
            {i < nf - 1 && (
              <line x1={fx + folhaW} y1={fy} x2={fx + folhaW} y2={fy + folhaH}
                stroke={color.frameDark} strokeWidth={1.2} />
            )}
          </g>
        );
      })}
      {/* Sliding arrows */}
      {Array.from({ length: nf }).map((_, i) => {
        const cx = pad + t + folhaW * i + folhaW / 2;
        const cy = pad + h / 2;
        const dir = i % 2 === 0 ? 1 : -1;
        return <SlidingArrow key={`a-${i}`} cx={cx} cy={cy} size={arrowSize} direction={dir as 1 | -1} color={color} />;
      })}
      {/* Handle indicators */}
      {nf <= 4 && Array.from({ length: Math.floor(nf / 2) }).map((_, i) => {
        const handleX = pad + t + folhaW * (i * 2 + 1) + lt + 3;
        return <HandleConcha key={`h-${i}`} cx={handleX} cy={pad + h / 2} size={Math.min(8, folhaW * 0.06)} color={color} />;
      })}
    </g>
  );
}

// ============================================================
// MAXIM-AR 1F
// ============================================================
function MaximAr1({ svgWidth: sw, svgHeight: sh, color }: SvgProps) {
  const pad = 6;
  const w = sw - pad * 2;
  const h = sh - pad * 2;
  const t = ft(w, h);
  const lt = t * LEAF_FRAME_RATIO;

  return (
    <g>
      <ProfileFrame x={pad} y={pad} w={w} h={h} color={color} t={t} />
      <LeafFrame x={pad + t + 2} y={pad + t + 2} w={w - 2 * t - 4} h={h - 2 * t - 4} color={color} t={t} />
      {/* Opening arc at bottom */}
      <path
        d={`M ${pad + t + 15} ${pad + h - t - 8} Q ${pad + w / 2} ${pad + h - t - 30} ${pad + w - t - 15} ${pad + h - t - 8}`}
        fill="none" stroke={color.frameDark} strokeWidth={1.2} opacity={0.45} strokeDasharray="5 3" />
      {/* Hinge dots at top */}
      <Hinge cx={pad + t + 15} cy={pad + t + 10} color={color} />
      <Hinge cx={pad + w - t - 15} cy={pad + t + 10} color={color} />
      {/* Opening direction V arrows */}
      {[0.35, 0.5, 0.65].map((frac, i) => {
        const cx = pad + w * frac;
        const topY = pad + t + lt + 20;
        const botY = pad + h - t - lt - 10;
        return (
          <g key={i} opacity={0.3}>
            <line x1={cx} y1={topY} x2={cx} y2={botY} stroke={color.frameDark} strokeWidth={0.5} />
            <polygon
              points={`${cx},${botY} ${cx - 4},${botY - 8} ${cx + 4},${botY - 8}`}
              fill={color.frameDark} />
          </g>
        );
      })}
    </g>
  );
}

// ============================================================
// MAXIM-AR 2F
// ============================================================
function MaximAr2({ svgWidth: sw, svgHeight: sh, color }: SvgProps) {
  const pad = 6;
  const w = sw - pad * 2;
  const h = sh - pad * 2;
  const t = ft(w, h);
  const lt = t * LEAF_FRAME_RATIO;
  const mullionW = t * 0.45;
  const halfW = (w - 2 * t - mullionW) / 2;

  return (
    <g>
      <ProfileFrame x={pad} y={pad} w={w} h={h} color={color} t={t} />
      {/* Central mullion */}
      <rect x={pad + t + halfW} y={pad + t} width={mullionW} height={h - 2 * t}
        fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.5} />
      <rect x={pad + t + halfW} y={pad + t} width={mullionW * 0.3} height={h - 2 * t}
        fill={color.frameLight} opacity={0.3} />
      {/* Two leaves */}
      {[0, 1].map(i => {
        const lx = pad + t + (halfW + mullionW) * i;
        return (
          <g key={i}>
            <LeafFrame x={lx + 1} y={pad + t + 1} w={halfW - 2} h={h - 2 * t - 2} color={color} t={t} />
            {/* Opening arc */}
            <path d={`M ${lx + 8} ${pad + h - t - 8} Q ${lx + halfW / 2} ${pad + h - t - 22} ${lx + halfW - 8} ${pad + h - t - 8}`}
              fill="none" stroke={color.frameDark} strokeWidth={1} opacity={0.35} strokeDasharray="4 3" />
            <Hinge cx={lx + 12} cy={pad + t + 10} color={color} />
            <Hinge cx={lx + halfW - 12} cy={pad + t + 10} color={color} />
          </g>
        );
      })}
    </g>
  );
}

// ============================================================
// PORTA DE GIRO 1F
// ============================================================
function PortaGiro1({ svgWidth: sw, svgHeight: sh, color }: SvgProps) {
  const pad = 6;
  const w = sw - pad * 2;
  const h = sh - pad * 2;
  const t = ft(w, h);
  const lt = t * LEAF_FRAME_RATIO;

  return (
    <g>
      <ProfileFrame x={pad} y={pad} w={w} h={h} color={color} t={t} />
      <LeafFrame x={pad + t + 2} y={pad + t + 2} w={w - 2 * t - 4} h={h - 2 * t - 4} color={color} t={t} />
      {/* Handle bar */}
      <rect x={pad + w - t - lt - 10} y={pad + h * 0.42} width={4} height={22} rx={2}
        fill={color.frameDark} opacity={0.65} />
      <rect x={pad + w - t - lt - 11} y={pad + h * 0.42 + 5} width={6} height={12} rx={1}
        fill={color.frameDark} opacity={0.3} />
      {/* Hinge indicators */}
      <Hinge cx={pad + t + 8} cy={pad + t + 35} color={color} />
      <Hinge cx={pad + t + 8} cy={pad + h / 2} color={color} />
      <Hinge cx={pad + t + 8} cy={pad + h - t - 35} color={color} />
      {/* Opening arc */}
      <path d={`M ${pad + w - t - 2} ${pad + t + 8} A ${w - 2 * t - 4} ${w - 2 * t - 4} 0 0 0 ${pad + w - t - 2 - (w - 2 * t) * 0.12} ${pad + h - t - 8}`}
        fill="none" stroke={color.frameDark} strokeWidth={1} opacity={0.3} strokeDasharray="5 4" />
    </g>
  );
}

// ============================================================
// PORTA DE GIRO 2F
// ============================================================
function PortaGiro2({ svgWidth: sw, svgHeight: sh, color }: SvgProps) {
  const pad = 6;
  const w = sw - pad * 2;
  const h = sh - pad * 2;
  const t = ft(w, h);
  const lt = t * LEAF_FRAME_RATIO;
  const halfW = (w - 2 * t) / 2;

  return (
    <g>
      <ProfileFrame x={pad} y={pad} w={w} h={h} color={color} t={t} />
      {[0, 1].map(i => {
        const lx = pad + t + halfW * i;
        return (
          <g key={i}>
            <LeafFrame x={lx + 1} y={pad + t + 1} w={halfW - 2} h={h - 2 * t - 2} color={color} t={t} />
            {/* Handle */}
            <rect x={i === 0 ? lx + halfW - lt - 10 : lx + lt + 6} y={pad + h * 0.42}
              width={4} height={22} rx={2} fill={color.frameDark} opacity={0.65} />
          </g>
        );
      })}
      {/* Center meeting rail */}
      <line x1={pad + w / 2} y1={pad + t} x2={pad + w / 2} y2={pad + h - t}
        stroke={color.frameDark} strokeWidth={1.5} />
      {/* Hinges */}
      <Hinge cx={pad + t + 8} cy={pad + t + 35} color={color} />
      <Hinge cx={pad + t + 8} cy={pad + h - t - 35} color={color} />
      <Hinge cx={pad + w - t - 8} cy={pad + t + 35} color={color} />
      <Hinge cx={pad + w - t - 8} cy={pad + h - t - 35} color={color} />
    </g>
  );
}

// ============================================================
// JANELA CAMARÃO (Sanfonada) - accordion/folding
// ============================================================
function JanelaCamarao({ svgWidth: sw, svgHeight: sh, color }: SvgProps) {
  const pad = 6;
  const w = sw - pad * 2;
  const h = sh - pad * 2;
  const t = ft(w, h);
  const lt = t * LEAF_FRAME_RATIO;
  const panels = 4;
  const panelW = (w - 2 * t) / panels;

  return (
    <g>
      <ProfileFrame x={pad} y={pad} w={w} h={h} color={color} t={t} />
      {Array.from({ length: panels }).map((_, i) => {
        const px = pad + t + panelW * i;
        const fy = pad + t;
        const fh = h - 2 * t;
        return (
          <g key={i}>
            <LeafFrame x={px + 1} y={fy + 1} w={panelW - 2} h={fh - 2} color={color} t={t} />
            {/* Hinge between panels */}
            {i < panels - 1 && (
              <>
                <Hinge cx={px + panelW} cy={fy + 22} color={color} />
                <Hinge cx={px + panelW} cy={fy + fh - 22} color={color} />
              </>
            )}
            {/* Fold direction "V" or "Λ" */}
            {i < panels && (
              <g opacity={0.3}>
                <line x1={px + panelW * 0.2} y1={fy + fh * 0.3} x2={px + panelW * 0.5} y2={fy + fh * 0.5}
                  stroke={color.frameDark} strokeWidth={1} />
                <line x1={px + panelW * 0.5} y1={fy + fh * 0.5} x2={px + panelW * 0.8} y2={fy + fh * 0.3}
                  stroke={color.frameDark} strokeWidth={1} />
                <line x1={px + panelW * 0.2} y1={fy + fh * 0.7} x2={px + panelW * 0.5} y2={fy + fh * 0.5}
                  stroke={color.frameDark} strokeWidth={1} />
                <line x1={px + panelW * 0.5} y1={fy + fh * 0.5} x2={px + panelW * 0.8} y2={fy + fh * 0.7}
                  stroke={color.frameDark} strokeWidth={1} />
              </g>
            )}
          </g>
        );
      })}
      {/* "F" labels on fixed panels */}
      <text x={pad + t + panelW * 0.5} y={pad + t + 18} textAnchor="middle" fontSize={9}
        fill={color.frameDark} opacity={0.45} fontWeight="bold">F</text>
      <text x={pad + t + panelW * 3.5} y={pad + t + 18} textAnchor="middle" fontSize={9}
        fill={color.frameDark} opacity={0.45} fontWeight="bold">F</text>
    </g>
  );
}

// ============================================================
// JANELA C/ VENEZIANA
// ============================================================
function JanelaVeneziana({ svgWidth: sw, svgHeight: sh, color, numFolhas = 2 }: SvgProps) {
  const pad = 6;
  const w = sw - pad * 2;
  const h = sh - pad * 2;
  const t = ft(w, h);
  const lt = t * LEAF_FRAME_RATIO;
  const halfW = (w - 2 * t) / 2;
  const slatCount = Math.floor((h - 2 * t - lt * 2 - 10) / 10);
  const arrowSize = Math.min(12, halfW * 0.12);

  return (
    <g>
      <ProfileFrame x={pad} y={pad} w={w} h={h} color={color} t={t} />
      {/* Glass side (left half - 2 sliding leaves) */}
      {[0, 1].map(i => {
        const lx = pad + t + (halfW / 2) * i;
        const fw = halfW / 2;
        return (
          <g key={`gl-${i}`}>
            <LeafFrame x={lx + 1} y={pad + t + 1} w={fw - 2} h={h - 2 * t - 2} color={color} t={t} />
          </g>
        );
      })}
      {/* Divider between glass and veneziana */}
      <rect x={pad + t + halfW - 1} y={pad + t} width={3} height={h - 2 * t}
        fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.4} />
      {/* Veneziana side (right half) */}
      <rect x={pad + t + halfW + 2} y={pad + t + 1} width={halfW - 3} height={h - 2 * t - 2}
        fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.5} />
      {/* Venetian slats - 3D perspective with depth */}
      {Array.from({ length: slatCount }).map((_, i) => {
        const sy = pad + t + lt + 5 + i * 10;
        const sx = pad + t + halfW + lt + 4;
        const sw2 = halfW - lt * 2 - 8;
        const angle = -15;
        const slatH = 6;
        const depthOffset = 2.5;
        const cx = sx + sw2 / 2;
        const cy = sy + slatH / 2;
        return (
          <g key={`s-${i}`}>
            {/* Shadow/depth underneath slat */}
            <rect x={sx + 1} y={sy + depthOffset} width={sw2} height={slatH} rx={0.5}
              fill={color.frameDark} opacity={0.2}
              transform={`rotate(${angle}, ${cx + 1}, ${cy + depthOffset})`} />
            {/* Slat body - main surface */}
            <rect x={sx} y={sy} width={sw2} height={slatH} rx={0.5}
              fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.4}
              transform={`rotate(${angle}, ${cx}, ${cy})`} />
            {/* Slat top bevel highlight */}
            <rect x={sx} y={sy} width={sw2} height={slatH * 0.3} rx={0.3}
              fill={color.frameLight} opacity={0.5}
              transform={`rotate(${angle}, ${cx}, ${cy - slatH * 0.35})`} />
            {/* Slat bottom edge shadow */}
            <rect x={sx} y={sy + slatH * 0.7} width={sw2} height={slatH * 0.3} rx={0.3}
              fill={color.frameDark} opacity={0.25}
              transform={`rotate(${angle}, ${cx}, ${cy + slatH * 0.35})`} />
          </g>
        );
      })}
      {/* Sliding arrows on glass side */}
      <SlidingArrow cx={pad + t + halfW * 0.25} cy={pad + h / 2} size={arrowSize} direction={1} color={color} />
      <SlidingArrow cx={pad + t + halfW * 0.75} cy={pad + h / 2} size={arrowSize} direction={-1} color={color} />
    </g>
  );
}

// ============================================================
// JANELA C/ BANDEIRA MÓVEL
// ============================================================
function JanelaBandeira({ svgWidth: sw, svgHeight: sh, color }: SvgProps) {
  const pad = 6;
  const w = sw - pad * 2;
  const h = sh - pad * 2;
  const t = ft(w, h);
  const lt = t * LEAF_FRAME_RATIO;
  const bandeiraH = (h - 2 * t) * 0.28;
  const divH = t * 0.4;
  const correrH = (h - 2 * t) - bandeiraH - divH;
  const halfW = (w - 2 * t) / 2;
  const arrowSize = Math.min(12, halfW * 0.12);

  return (
    <g>
      <ProfileFrame x={pad} y={pad} w={w} h={h} color={color} t={t} />
      {/* Bandeira (top) */}
      <LeafFrame x={pad + t + 1} y={pad + t + 1} w={w - 2 * t - 2} h={bandeiraH - 2} color={color} t={t} />
      {/* Divider rail */}
      <rect x={pad + t} y={pad + t + bandeiraH} width={w - 2 * t} height={divH}
        fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.5} />
      <rect x={pad + t} y={pad + t + bandeiraH} width={w - 2 * t} height={divH * 0.3}
        fill={color.frameLight} opacity={0.3} />
      {/* Sliding panels below */}
      {[0, 1].map(i => {
        const fx = pad + t + halfW * i;
        const fy = pad + t + bandeiraH + divH;
        return (
          <g key={i}>
            <LeafFrame x={fx + 1} y={fy + 1} w={halfW - 2} h={correrH - 2} color={color} t={t} />
          </g>
        );
      })}
      <SlidingArrow cx={pad + t + halfW * 0.5} cy={pad + t + bandeiraH + divH + correrH / 2} size={arrowSize} direction={1} color={color} />
      <SlidingArrow cx={pad + t + halfW * 1.5} cy={pad + t + bandeiraH + divH + correrH / 2} size={arrowSize} direction={-1} color={color} />
      {/* Bandeira label */}
      <text x={pad + w / 2} y={pad + t + bandeiraH / 2 + 3} textAnchor="middle" fontSize={7}
        fill={color.frameDark} opacity={0.35} fontWeight="bold">BANDEIRA</text>
    </g>
  );
}

// ============================================================
// JANELA C/ PEITORIL FIXO
// ============================================================
function JanelaPeitoril({ svgWidth: sw, svgHeight: sh, color, numFolhas = 4 }: SvgProps) {
  const pad = 6;
  const w = sw - pad * 2;
  const h = sh - pad * 2;
  const t = ft(w, h);
  const lt = t * LEAF_FRAME_RATIO;
  const peitorilH = (h - 2 * t) * 0.3;
  const divH = t * 0.4;
  const correrH = (h - 2 * t) - peitorilH - divH;
  const folhaW = (w - 2 * t) / numFolhas;
  const arrowSize = Math.min(12, folhaW * 0.12);

  return (
    <g>
      <ProfileFrame x={pad} y={pad} w={w} h={h} color={color} t={t} />
      {/* Sliding panels top */}
      {Array.from({ length: numFolhas }).map((_, i) => {
        const fx = pad + t + folhaW * i;
        return (
          <g key={i}>
            <LeafFrame x={fx + 1} y={pad + t + 1} w={folhaW - 2} h={correrH - 2} color={color} t={t} />
            <SlidingArrow cx={fx + folhaW / 2} cy={pad + t + correrH / 2} size={arrowSize}
              direction={(i % 2 === 0 ? 1 : -1) as 1 | -1} color={color} />
          </g>
        );
      })}
      {/* Divider */}
      <rect x={pad + t} y={pad + t + correrH} width={w - 2 * t} height={divH}
        fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.5} />
      {/* Fixed peitoril */}
      <LeafFrame x={pad + t + 1} y={pad + t + correrH + divH + 1} w={w - 2 * t - 2} h={peitorilH - 2} color={color} t={t} />
      <text x={pad + w / 2} y={pad + t + correrH + divH + peitorilH / 2 + 3} textAnchor="middle" fontSize={7}
        fill={color.frameDark} opacity={0.35} fontWeight="bold">FIXO</text>
    </g>
  );
}

// ============================================================
// PORTA INTEGRADA (Correr + Fixo)
// ============================================================
function PortaIntegrada({ svgWidth: sw, svgHeight: sh, color }: SvgProps) {
  const pad = 6;
  const w = sw - pad * 2;
  const h = sh - pad * 2;
  const t = ft(w, h);
  const lt = t * LEAF_FRAME_RATIO;
  const mullionW = t * 0.4;
  const fixoW = (w - 2 * t - mullionW) / 3;
  const correrW = fixoW;
  const arrowSize = Math.min(12, correrW * 0.12);

  return (
    <g>
      <ProfileFrame x={pad} y={pad} w={w} h={h} color={color} t={t} />
      {/* Fixed panel */}
      <LeafFrame x={pad + t + 1} y={pad + t + 1} w={fixoW - 2} h={h - 2 * t - 2} color={color} t={t} />
      <text x={pad + t + fixoW / 2} y={pad + h - t - 10} textAnchor="middle" fontSize={8}
        fill={color.frameDark} opacity={0.4} fontWeight="bold">FIXO</text>
      {/* Mullion */}
      <rect x={pad + t + fixoW} y={pad + t} width={mullionW} height={h - 2 * t}
        fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.5} />
      <rect x={pad + t + fixoW} y={pad + t} width={mullionW * 0.3} height={h - 2 * t}
        fill={color.frameLight} opacity={0.3} />
      {/* 2 sliding panels */}
      {[0, 1].map(i => {
        const fx = pad + t + fixoW + mullionW + correrW * i;
        return (
          <g key={i}>
            <LeafFrame x={fx + 1} y={pad + t + 1} w={correrW - 2} h={h - 2 * t - 2} color={color} t={t} />
            <SlidingArrow cx={fx + correrW / 2} cy={pad + h / 2} size={arrowSize}
              direction={(i === 0 ? -1 : 1) as 1 | -1} color={color} />
          </g>
        );
      })}
      <RailLines x={pad + t + fixoW + mullionW} y={pad + h - t + 2} w={(w - 2 * t) * 2 / 3} numRails={2} color={color} />
    </g>
  );
}

// ============================================================
// JANELA GIRO (Abre e Tomba)
// ============================================================
function JanelaGiro({ svgWidth: sw, svgHeight: sh, color }: SvgProps) {
  const pad = 6;
  const w = sw - pad * 2;
  const h = sh - pad * 2;
  const t = ft(w, h);
  const lt = t * LEAF_FRAME_RATIO;

  return (
    <g>
      <ProfileFrame x={pad} y={pad} w={w} h={h} color={color} t={t} />
      <LeafFrame x={pad + t + 2} y={pad + t + 2} w={w - 2 * t - 4} h={h - 2 * t - 4} color={color} t={t} />
      {/* Tilt indicator V at bottom */}
      <g opacity={0.4}>
        <line x1={pad + w / 2 - 18} y1={pad + h - t - 8}
          x2={pad + w / 2} y2={pad + h - t - 22}
          stroke={color.frameDark} strokeWidth={1.2} />
        <line x1={pad + w / 2} y1={pad + h - t - 22}
          x2={pad + w / 2 + 18} y2={pad + h - t - 8}
          stroke={color.frameDark} strokeWidth={1.2} />
      </g>
      {/* Handle */}
      <rect x={pad + w / 2 - 2} y={pad + h - t - lt - 16} width={4} height={14} rx={2}
        fill={color.frameDark} opacity={0.6} />
      {/* Side turn arc */}
      <path d={`M ${pad + w - t - 2} ${pad + t + 10} A ${w * 0.3} ${h * 0.3} 0 0 0 ${pad + w - t - 2 - w * 0.08} ${pad + h - t - 10}`}
        fill="none" stroke={color.frameDark} strokeWidth={0.8} opacity={0.25} strokeDasharray="4 3" />
    </g>
  );
}

// ============================================================
// VITRÔ FIXO
// ============================================================
function VitroFixo({ svgWidth: sw, svgHeight: sh, color }: SvgProps) {
  const pad = 6;
  const w = sw - pad * 2;
  const h = sh - pad * 2;
  const t = ft(w, h);

  return (
    <g>
      <ProfileFrame x={pad} y={pad} w={w} h={h} color={color} t={t} />
      <Glass x={pad + t} y={pad + t} w={w - 2 * t} h={h - 2 * t} color={color} />
      <text x={pad + w / 2} y={pad + h / 2 + 3} textAnchor="middle" fontSize={9}
        fill={color.frameDark} opacity={0.35} fontWeight="bold">FIXO</text>
    </g>
  );
}

// ============================================================
// BASCULANTE
// ============================================================
function Basculante1({ svgWidth: sw, svgHeight: sh, color }: SvgProps) {
  const pad = 6;
  const w = sw - pad * 2;
  const h = sh - pad * 2;
  const t = ft(w, h);

  return (
    <g>
      <ProfileFrame x={pad} y={pad} w={w} h={h} color={color} t={t} />
      <LeafFrame x={pad + t + 2} y={pad + t + 2} w={w - 2 * t - 4} h={h - 2 * t - 4} color={color} t={t} />
      {/* Pivot point at center bottom */}
      <Hinge cx={pad + w / 2} cy={pad + h - t - 5} color={color} />
      {/* Opening arc at top */}
      <path d={`M ${pad + t + 15} ${pad + t + 8} Q ${pad + w / 2} ${pad + t - 12} ${pad + w - t - 15} ${pad + t + 8}`}
        fill="none" stroke={color.frameDark} strokeWidth={1} opacity={0.35} strokeDasharray="4 3" />
    </g>
  );
}

// ============================================================
// PIVOTANTE
// ============================================================
function Pivotante({ svgWidth: sw, svgHeight: sh, color }: SvgProps) {
  const pad = 6;
  const w = sw - pad * 2;
  const h = sh - pad * 2;
  const t = ft(w, h);

  return (
    <g>
      <ProfileFrame x={pad} y={pad} w={w} h={h} color={color} t={t} />
      <LeafFrame x={pad + t + 2} y={pad + t + 2} w={w - 2 * t - 4} h={h - 2 * t - 4} color={color} t={t} />
      {/* Pivot points top and bottom center */}
      <Hinge cx={pad + w / 2} cy={pad + t + 6} color={color} />
      <Hinge cx={pad + w / 2} cy={pad + h - t - 6} color={color} />
      {/* Rotation arc */}
      <path d={`M ${pad + w - t - 5} ${pad + h * 0.35} A ${w * 0.15} ${h * 0.15} 0 0 1 ${pad + w - t - 5} ${pad + h * 0.65}`}
        fill="none" stroke={color.frameDark} strokeWidth={1} opacity={0.35} strokeDasharray="4 3" />
      <path d={`M ${pad + t + 5} ${pad + h * 0.65} A ${w * 0.15} ${h * 0.15} 0 0 1 ${pad + t + 5} ${pad + h * 0.35}`}
        fill="none" stroke={color.frameDark} strokeWidth={1} opacity={0.35} strokeDasharray="4 3" />
    </g>
  );
}

// ===== MAPPING =====
type TypologyCategory = string;
type TypologySubcategory = string;

interface TypologyKey {
  category: TypologyCategory;
  subcategory: TypologySubcategory;
  num_folhas: number;
  has_veneziana?: boolean;
  has_bandeira?: boolean;
  notes?: string;
}

export function getTypologySvg(
  props: SvgProps & TypologyKey
): React.ReactNode {
  const { category, subcategory, num_folhas, has_veneziana, has_bandeira, notes, ...svgProps } = props;

  // Peitoril fixo
  if (notes?.toLowerCase().includes("peitoril")) {
    return <JanelaPeitoril {...svgProps} numFolhas={num_folhas} />;
  }

  // Veneziana
  if (has_veneziana) {
    return <JanelaVeneziana {...svgProps} numFolhas={num_folhas} />;
  }

  // Bandeira
  if (has_bandeira) {
    return <JanelaBandeira {...svgProps} />;
  }

  // Porta integrada
  if (notes?.toLowerCase().includes("fixo") || (category === "porta" && subcategory === "correr" && notes?.toLowerCase().includes("integrada"))) {
    return <PortaIntegrada {...svgProps} />;
  }

  // Vitrô fixo
  if (category === "vitro" && subcategory === "fixo") {
    return <VitroFixo {...svgProps} />;
  }

  // Basculante
  if (category === "basculante") {
    return <Basculante1 {...svgProps} />;
  }

  // Pivotante
  if (category === "pivotante") {
    return <Pivotante {...svgProps} />;
  }

  // Maxim-ar
  if (category === "maxim_ar") {
    return num_folhas >= 2 ? <MaximAr2 {...svgProps} /> : <MaximAr1 {...svgProps} />;
  }

  // Camarão
  if (category === "camarao") {
    return <JanelaCamarao {...svgProps} />;
  }

  // Giro
  if (subcategory === "giro") {
    return num_folhas >= 2 ? <PortaGiro2 {...svgProps} /> : <PortaGiro1 {...svgProps} />;
  }

  // Janela Giro (Abre e Tomba)
  if (category === "janela" && subcategory === "giro") {
    return <JanelaGiro {...svgProps} />;
  }

  // Default: sliding window/door
  return <SlidingWindow {...svgProps} numFolhas={num_folhas} />;
}
