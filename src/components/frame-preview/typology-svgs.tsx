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

// ===== UNIQUE ID COUNTER =====
let _filterId = 0;
let _shadowId = 0;
function nextShadowId() { return `shadow-${++_shadowId}`; }
function nextId() { return `id-${++_filterId}-${Math.random().toString(36).slice(2, 7)}`; }

// ===== REALISTIC GLASS PANEL =====
function Glass({ x, y, w, h, color }: { x: number; y: number; w: number; h: number; color: AluminumColor }) {
  const id = nextId();
  const refl1 = nextId();
  const refl2 = nextId();
  const refl3 = nextId();
  return (
    <g>
      <defs>
        {/* Glass base gradient - diagonal light effect */}
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color.glassColor} stopOpacity={color.glassOpacity * 0.5} />
          <stop offset="25%" stopColor={color.glassColor} stopOpacity={color.glassOpacity * 0.85} />
          <stop offset="50%" stopColor={color.glassColor} stopOpacity={color.glassOpacity} />
          <stop offset="75%" stopColor={color.glassColor} stopOpacity={color.glassOpacity * 0.8} />
          <stop offset="100%" stopColor={color.glassColor} stopOpacity={color.glassOpacity * 0.6} />
        </linearGradient>
        
        {/* Primary reflection - diagonal streak */}
        <linearGradient id={refl1} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="40%" stopColor="white" stopOpacity="0.35" />
          <stop offset="60%" stopColor="white" stopOpacity="0.35" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        
        {/* Secondary reflection - soft glow */}
        <radialGradient id={refl2} cx="20%" cy="20%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="0.2" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        
        {/* Edge highlight */}
        <linearGradient id={refl3} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.15" />
          <stop offset="50%" stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity="0.1" />
        </linearGradient>
        
        {/* Subtle frosted texture filter */}
        <filter id={`noise-${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" in2="noise" mode="soft-light" result="blend" />
          <feComposite in="blend" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      
      {/* Glass base */}
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id})`} />
      
      {/* Edge depth effect */}
      <rect x={x} y={y} width={w} height={h} fill={`url(#${refl3})`} />
      
      {/* Primary diagonal reflection streak */}
      <rect 
        x={x + w * 0.08} 
        y={y + h * 0.05} 
        width={w * 0.25} 
        height={h * 0.9} 
        fill={`url(#${refl1})`}
        transform={`rotate(-8 ${x + w * 0.2} ${y + h * 0.5})`}
      />
      
      {/* Secondary soft glow reflection */}
      <ellipse cx={x + w * 0.25} cy={y + h * 0.25} rx={w * 0.2} ry={h * 0.15} fill={`url(#${refl2})`} />
      
      {/* Top corner highlight */}
      <path 
        d={`M ${x} ${y} L ${x + w * 0.4} ${y} L ${x} ${y + h * 0.4} Z`} 
        fill="white" 
        opacity="0.08" 
      />
      
      {/* Subtle horizontal reflection line */}
      <line 
        x1={x + w * 0.15} 
        y1={y + h * 0.5} 
        x2={x + w * 0.75} 
        y2={y + h * 0.5} 
        stroke="white" 
        strokeWidth="0.5" 
        opacity="0.12" 
      />
    </g>
  );
}

// ===== REALISTIC ALUMINUM PROFILE (FRAME) =====
function ProfileFrame({ x, y, w, h, color, t }: { x: number; y: number; w: number; h: number; color: AluminumColor; t: number }) {
  const groove = t * 0.15;
  const inner = t * 0.25;
  const fid = nextId();
  const grad1 = nextId();
  const grad2 = nextId();
  
  return (
    <g>
      <defs>
        {/* Drop shadow filter */}
        <filter id={fid} x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="2" dy="4" stdDeviation="5" floodColor={color.frameDark} floodOpacity="0.3" />
          <feDropShadow dx="1" dy="1" stdDeviation="2" floodColor={color.frameDark} floodOpacity="0.15" />
        </filter>
        
        {/* Aluminum metallic gradient - horizontal */}
        <linearGradient id={grad1} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color.frameLight} stopOpacity="1" />
          <stop offset="15%" stopColor={color.frameColor} stopOpacity="1" />
          <stop offset="50%" stopColor={color.frameColor} stopOpacity="1" />
          <stop offset="85%" stopColor={color.frameDark} stopOpacity="1" />
          <stop offset="100%" stopColor={color.frameDark} stopOpacity="1" />
        </linearGradient>
        
        {/* Inner bevel highlight */}
        <linearGradient id={grad2} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color.frameLight} stopOpacity="0.6" />
          <stop offset="50%" stopColor={color.frameLight} stopOpacity="0" />
          <stop offset="100%" stopColor={color.frameDark} stopOpacity="0.3" />
        </linearGradient>
        
        {/* Aluminum texture noise */}
        <filter id={`metal-${fid}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" result="noise" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" in2="noise" mode="soft-light" result="blend" />
          <feComposite in="blend" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      
      {/* Outer body with drop shadow */}
      <rect 
        x={x} 
        y={y} 
        width={w} 
        height={h} 
        fill={color.frameColor}
        stroke={color.frameDark} 
        strokeWidth="0.5"
        filter={`url(#${fid})`}
      />
      
      {/* Metallic gradient overlay */}
      <rect x={x} y={y} width={w} height={h} fill={`url(#${grad1})`} opacity="0.4" />
      
      {/* Top bevel highlight - bright aluminum */}
      <rect x={x} y={y} width={w} height={t * 0.4} fill={color.frameLight} opacity="0.7" />
      
      {/* Left bevel highlight */}
      <rect x={x} y={y} width={t * 0.35} height={h} fill={color.frameLight} opacity="0.5" />
      
      {/* Bottom shadow */}
      <rect x={x} y={y + h - t * 0.35} width={w} height={t * 0.35} fill={color.frameDark} opacity="0.6" />
      
      {/* Right shadow */}
      <rect x={x + w - t * 0.3} y={y} width={t * 0.3} height={h} fill={color.frameDark} opacity="0.5" />
      
      {/* Inner groove detail - top */}
      <rect 
        x={x + inner} 
        y={y + t - groove * 2} 
        width={w - inner * 2} 
        height={groove} 
        fill={color.frameDark} 
        opacity="0.5" 
        rx="0.5" 
      />
      
      {/* Inner groove detail - bottom */}
      <rect 
        x={x + inner} 
        y={y + h - t + groove} 
        width={w - inner * 2} 
        height={groove} 
        fill={color.frameDark} 
        opacity="0.5" 
        rx="0.5" 
      />
      
      {/* Inner groove detail - left */}
      <rect 
        x={x + t - groove * 2} 
        y={y + inner} 
        width={groove} 
        height={h - inner * 2} 
        fill={color.frameDark} 
        opacity="0.5" 
        rx="0.5" 
      />
      
      {/* Inner groove detail - right */}
      <rect 
        x={x + w - t + groove} 
        y={y + inner} 
        width={groove} 
        height={h - inner * 2} 
        fill={color.frameDark} 
        opacity="0.5" 
        rx="0.5" 
      />
      
      {/* Inner edge line */}
      <rect 
        x={x + t} 
        y={y + t} 
        width={w - 2 * t} 
        height={h - 2 * t} 
        fill="none" 
        stroke={color.frameDark} 
        strokeWidth="0.5" 
      />
      
      {/* Subtle metallic texture */}
      <rect x={x} y={y} width={w} height={h} fill={`url(#${grad2})`} style={{ mixBlendMode: 'overlay' }} />
    </g>
  );
}

// ===== LEAF FRAME (folha) =====
function LeafFrame({ x, y, w, h, color, t }: { x: number; y: number; w: number; h: number; color: AluminumColor; t: number }) {
  const lt = t * LEAF_FRAME_RATIO;
  const groove = lt * 0.2;
  const lid = nextId();
  const lgrad = nextId();
  
  return (
    <g>
      <defs>
        <linearGradient id={lid} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color.frameLight} stopOpacity="0.5" />
          <stop offset="50%" stopColor={color.frameColor} stopOpacity="0" />
          <stop offset="100%" stopColor={color.frameDark} stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id={lgrad} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color.frameLight} stopOpacity="0.6" />
          <stop offset="30%" stopColor={color.frameColor} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color.frameDark} stopOpacity="0.4" />
        </linearGradient>
      </defs>
      
      {/* Leaf outer with subtle shadow */}
      <rect 
        x={x} 
        y={y} 
        width={w} 
        height={h} 
        fill={color.frameColor} 
        stroke={color.frameDark} 
        strokeWidth="0.4"
        filter="url(#shadow-leaf)"
      />
      
      {/* Metallic gradient */}
      <rect x={x} y={y} width={w} height={h} fill={`url(#${lgrad})`} />
      
      {/* Top highlight */}
      <rect x={x} y={y} width={w} height={lt * 0.35} fill={color.frameLight} opacity="0.5" />
      
      {/* Left highlight */}
      <rect x={x} y={y} width={lt * 0.3} height={h} fill={color.frameLight} opacity="0.35" />
      
      {/* Bottom/right shadow */}
      <rect x={x} y={y + h - lt * 0.3} width={w} height={lt * 0.3} fill={color.frameDark} opacity="0.45" />
      <rect x={x + w - lt * 0.25} y={y} width={lt * 0.25} height={h} fill={color.frameDark} opacity="0.35" />
      
      {/* Profile groove detail - left */}
      <rect 
        x={x + lt - groove} 
        y={y + lt * 0.5} 
        width={groove * 0.7} 
        height={h - lt} 
        fill={color.frameDark} 
        opacity="0.4" 
        rx="0.3" 
      />
      
      {/* Profile groove detail - right */}
      <rect 
        x={x + w - lt + groove * 0.3} 
        y={y + lt * 0.5} 
        width={groove * 0.7} 
        height={h - lt} 
        fill={color.frameDark} 
        opacity="0.4" 
        rx="0.3" 
      />
      
      {/* Inner bevel overlay */}
      <rect x={x} y={y} width={w} height={h} fill={`url(#${lid})`} style={{ mixBlendMode: 'overlay' }} />
      
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
        <line 
          key={i} 
          x1={x} 
          y1={y + i * spacing} 
          x2={x + w} 
          y2={y + i * spacing}
          stroke={color.frameDark} 
          strokeWidth="0.5" 
          opacity="0.4" 
        />
      ))}
    </g>
  );
}

// ===== SLIDING ARROWS =====
function SlidingArrow({ cx, cy, size, direction, color }: { cx: number; cy: number; size: number; direction: 1 | -1; color: AluminumColor }) {
  const dx = size * direction;
  return (
    <g opacity="0.6">
      <line 
        x1={cx - dx * 0.8} 
        y1={cy} 
        x2={cx + dx * 0.8} 
        y2={cy} 
        stroke={color.frameDark} 
        strokeWidth="1.5" 
      />
      <polygon
        points={`${cx + dx},${cy} ${cx + dx * 0.4},${cy - size * 0.4} ${cx + dx * 0.4},${cy + size * 0.4}`}
        fill={color.frameDark}
      />
    </g>
  );
}

// ===== HANDLE (puxador concha) - MORE REALISTIC =====
function HandleConcha({ cx, cy, size, color }: { cx: number; cy: number; size: number; color: AluminumColor }) {
  const hid = nextId();
  return (
    <g>
      <defs>
        <radialGradient id={hid} cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor={color.frameLight} stopOpacity="0.8" />
          <stop offset="50%" stopColor={color.frameColor} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color.frameDark} stopOpacity="0.9" />
        </radialGradient>
      </defs>
      {/* Handle shadow */}
      <ellipse cx={cx} cy={cy + 1} rx={size * 0.4} ry={size * 1.1} fill={color.frameDark} opacity="0.3" />
      {/* Handle body */}
      <rect 
        x={cx - size * 0.4} 
        y={cy - size} 
        width={size * 0.8} 
        height={size * 2} 
        rx={size * 0.4}
        fill={`url(#${hid})`}
        stroke={color.frameDark}
        strokeWidth="0.5"
      />
      {/* Handle highlight */}
      <rect 
        x={cx - size * 0.25} 
        y={cy - size * 0.6} 
        width={size * 0.2} 
        height={size * 1.2} 
        rx={size * 0.1}
        fill={color.frameLight}
        opacity="0.4"
      />
    </g>
  );
}

// ===== HANDLE - MODERN RECTANGULAR =====
function HandleModern({ cx, cy, size, color, horizontal = true }: { cx: number; cy: number; size: number; color: AluminumColor; horizontal?: boolean }) {
  const hid = nextId();
  const w = horizontal ? size * 1.5 : size * 0.3;
  const h = horizontal ? size * 0.25 : size;
  return (
    <g>
      <defs>
        <linearGradient id={hid} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color.frameLight} stopOpacity="0.7" />
          <stop offset="50%" stopColor={color.frameColor} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color.frameDark} stopOpacity="0.8" />
        </linearGradient>
      </defs>
      {/* Shadow */}
      <rect 
        x={cx - w/2 + 1} 
        y={cy - h/2 + 2} 
        width={w} 
        height={h} 
        rx="2"
        fill={color.frameDark} 
        opacity="0.25" 
      />
      {/* Handle */}
      <rect 
        x={cx - w/2} 
        y={cy - h/2} 
        width={w} 
        height={h} 
        rx="2"
        fill={`url(#${hid})`}
        stroke={color.frameDark}
        strokeWidth="0.3"
      />
    </g>
  );
}

// ===== HINGE DOT - MORE DETAILED =====
function Hinge({ cx, cy, color }: { cx: number; cy: number; color: AluminumColor }) {
  const hid = nextId();
  return (
    <g>
      <defs>
        <radialGradient id={hid}>
          <stop offset="0%" stopColor={color.frameLight} stopOpacity="0.6" />
          <stop offset="60%" stopColor={color.frameDark} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color.frameDark} stopOpacity="1" />
        </radialGradient>
      </defs>
      {/* Shadow */}
      <circle cx={cx + 0.5} cy={cy + 0.5} r={3.5} fill={color.frameDark} opacity="0.2" />
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={3} fill={color.frameDark} opacity="0.5" />
      {/* Inner */}
      <circle cx={cx} cy={cy} r={2} fill={`url(#${hid})`} />
      {/* Highlight */}
      <circle cx={cx - 0.8} cy={cy - 0.8} r={0.8} fill={color.frameLight} opacity="0.5" />
    </g>
  );
}

// ===== PROFILE CROSS SECTION =====
function ProfileSection({ x, y, w, h, color, type }: { x: number; y: number; w: number; h: number; color: AluminumColor; type: string }) {
  const sid = nextId();
  const sgrad = nextId();
  
  return (
    <g>
      <defs>
        <linearGradient id={sgrad} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color.frameLight} stopOpacity="0.7" />
          <stop offset="50%" stopColor={color.frameColor} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color.frameDark} stopOpacity="0.8" />
        </linearGradient>
      </defs>
      
      {/* Profile body */}
      <rect x={x} y={y} width={w} height={h} fill={color.frameColor} stroke={color.frameDark} strokeWidth="0.5" />
      
      {/* Highlight */}
      <rect x={x} y={y} width={w} height={h * 0.3} fill={color.frameLight} opacity="0.5" />
      
      {/* Shadow */}
      <rect x={x} y={y + h * 0.7} width={w} height={h * 0.3} fill={color.frameDark} opacity="0.4" />
      
      {/* Inner details */}
      <rect x={x + w * 0.2} y={y + h * 0.3} width={w * 0.15} height={h * 0.4} fill={color.frameDark} opacity="0.3" rx="1" />
      <rect x={x + w * 0.6} y={y + h * 0.3} width={w * 0.15} height={h * 0.4} fill={color.frameDark} opacity="0.3" rx="1" />
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
  
  if (slidingTypes.includes(type)) {
    return <SlidingWindow {...props} />;
  }
  if (fixedTypes.includes(type)) {
    return <FixedWindow {...props} />;
  }
  if (type === "projetante" || type === "maxim-ar") {
    return <MaximArWindow {...props} />;
  }
  // Default to sliding 2F
  return <SlidingWindow {...props} />;
}

export type { SvgProps };
