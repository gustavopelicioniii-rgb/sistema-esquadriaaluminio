import React from "react";
import type { AluminumColor } from "./colors";

interface SvgProps {
  width: number;   // mm
  height: number;  // mm
  color: AluminumColor;
  numFolhas?: number;
  svgWidth: number;  // px
  svgHeight: number; // px
}

// Frame thickness relative to smallest dimension
const FRAME_RATIO = 0.06;
const MIN_FRAME = 8;

function frameThickness(w: number, h: number) {
  return Math.max(MIN_FRAME, Math.min(w, h) * FRAME_RATIO);
}

// ===== SHARED SVG PATTERNS =====
function GlassPanel({ x, y, w, h, color, key: k }: { x: number; y: number; w: number; h: number; color: AluminumColor; key?: string }) {
  return (
    <g key={k}>
      <rect x={x} y={y} width={w} height={h} fill={color.glassColor} opacity={color.glassOpacity} />
      {/* Glass reflection */}
      <line x1={x + w * 0.15} y1={y + h * 0.1} x2={x + w * 0.35} y2={y + h * 0.85} stroke="white" strokeWidth={1} opacity={0.3} />
      <line x1={x + w * 0.25} y1={y + h * 0.1} x2={x + w * 0.45} y2={y + h * 0.85} stroke="white" strokeWidth={0.5} opacity={0.2} />
    </g>
  );
}

function FrameRect({ x, y, w, h, color, thickness }: { x: number; y: number; w: number; h: number; color: AluminumColor; thickness: number }) {
  const t = thickness;
  return (
    <g>
      {/* Outer frame */}
      <rect x={x} y={y} width={w} height={h} fill={color.frameColor} rx={1} />
      {/* Inner cutout */}
      <rect x={x + t} y={y + t} width={w - 2 * t} height={h - 2 * t} fill="none" stroke={color.frameDark} strokeWidth={0.5} />
      {/* Top highlight */}
      <rect x={x} y={y} width={w} height={t} fill={color.frameLight} opacity={0.5} rx={1} />
      {/* Left highlight */}
      <rect x={x} y={y} width={t * 0.6} height={h} fill={color.frameLight} opacity={0.3} />
      {/* Bottom shadow */}
      <rect x={x} y={y + h - t * 0.4} width={w} height={t * 0.4} fill={color.frameDark} opacity={0.4} />
      {/* Right shadow */}
      <rect x={x + w - t * 0.4} y={y} width={t * 0.4} height={h} fill={color.frameDark} opacity={0.3} />
    </g>
  );
}

function SlidingArrows({ x, y, w, h, numFolhas, color }: { x: number; y: number; w: number; h: number; numFolhas: number; color: AluminumColor }) {
  const arrowY = y + h / 2;
  const arrowSize = Math.min(12, w * 0.03);
  const arrows: React.ReactNode[] = [];
  
  for (let i = 0; i < Math.min(numFolhas, 4); i++) {
    const folhaW = w / numFolhas;
    const cx = x + folhaW * i + folhaW / 2;
    const dir = i % 2 === 0 ? 1 : -1;
    arrows.push(
      <g key={i} opacity={0.4}>
        <line x1={cx - dir * arrowSize} y1={arrowY} x2={cx + dir * arrowSize} y2={arrowY} stroke={color.frameDark} strokeWidth={1.5} />
        <polyline points={`${cx + dir * arrowSize * 0.4},${arrowY - arrowSize * 0.5} ${cx + dir * arrowSize},${arrowY} ${cx + dir * arrowSize * 0.4},${arrowY + arrowSize * 0.5}`} fill="none" stroke={color.frameDark} strokeWidth={1.5} />
      </g>
    );
  }
  return <>{arrows}</>;
}

// ===== SLIDING WINDOW (2F, 3F, 4F, 6F) =====
function SlidingWindow({ svgWidth: sw, svgHeight: sh, color, numFolhas = 2 }: SvgProps) {
  const pad = 8;
  const w = sw - pad * 2;
  const h = sh - pad * 2;
  const t = frameThickness(w, h);
  const folhaW = (w - 2 * t) / numFolhas;
  const folhaH = h - 2 * t;

  return (
    <g>
      <FrameRect x={pad} y={pad} w={w} h={h} color={color} thickness={t} />
      {/* Folhas */}
      {Array.from({ length: numFolhas }).map((_, i) => {
        const fx = pad + t + folhaW * i;
        const fy = pad + t;
        const leafT = t * 0.6;
        return (
          <g key={i}>
            {/* Leaf frame */}
            <rect x={fx + 1} y={fy + 1} width={folhaW - 2} height={folhaH - 2} fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.5} />
            {/* Leaf inner frame */}
            <rect x={fx + leafT} y={fy + leafT} width={folhaW - leafT * 2} height={folhaH - leafT * 2} fill={color.frameDark} opacity={0.15} />
            <GlassPanel x={fx + leafT + 1} y={fy + leafT + 1} w={folhaW - leafT * 2 - 2} h={folhaH - leafT * 2 - 2} color={color} />
            {/* Divider line */}
            {i < numFolhas - 1 && (
              <line x1={fx + folhaW} y1={fy} x2={fx + folhaW} y2={fy + folhaH} stroke={color.frameDark} strokeWidth={1} />
            )}
          </g>
        );
      })}
      {/* Rail indicator at bottom */}
      <rect x={pad + t} y={pad + h - t - 2} width={w - 2 * t} height={2} fill={color.frameDark} opacity={0.3} />
      <SlidingArrows x={pad + t} y={pad + t} w={w - 2 * t} h={folhaH} numFolhas={numFolhas} color={color} />
    </g>
  );
}

// ===== MAXIM-AR 1F =====
function MaximAr1({ svgWidth: sw, svgHeight: sh, color }: SvgProps) {
  const pad = 8;
  const w = sw - pad * 2;
  const h = sh - pad * 2;
  const t = frameThickness(w, h);
  const leafT = t * 0.6;

  return (
    <g>
      <FrameRect x={pad} y={pad} w={w} h={h} color={color} thickness={t} />
      {/* Leaf with 45° frame */}
      <rect x={pad + t + 2} y={pad + t + 2} width={w - 2 * t - 4} height={h - 2 * t - 4} fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.5} />
      <GlassPanel x={pad + t + leafT + 2} y={pad + t + leafT + 2} w={w - 2 * t - 2 * leafT - 4} h={h - 2 * t - 2 * leafT - 4} color={color} />
      {/* Opening indicator - arc at bottom */}
      <path d={`M ${pad + t + 10} ${pad + h - t - 5} Q ${pad + w / 2} ${pad + h - t - 25} ${pad + w - t - 10} ${pad + h - t - 5}`}
        fill="none" stroke={color.frameDark} strokeWidth={1} opacity={0.4} strokeDasharray="4 3" />
      {/* Hinge dots at top */}
      <circle cx={pad + t + 15} cy={pad + t + 8} r={2.5} fill={color.frameDark} opacity={0.5} />
      <circle cx={pad + w - t - 15} cy={pad + t + 8} r={2.5} fill={color.frameDark} opacity={0.5} />
    </g>
  );
}

// ===== MAXIM-AR 2F =====
function MaximAr2({ svgWidth: sw, svgHeight: sh, color }: SvgProps) {
  const pad = 8;
  const w = sw - pad * 2;
  const h = sh - pad * 2;
  const t = frameThickness(w, h);
  const leafT = t * 0.6;
  const halfW = (w - 2 * t - t * 0.5) / 2;

  return (
    <g>
      <FrameRect x={pad} y={pad} w={w} h={h} color={color} thickness={t} />
      {/* Central mullion */}
      <rect x={pad + t + halfW} y={pad + t} width={t * 0.5} height={h - 2 * t} fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.3} />
      {/* Two leaves */}
      {[0, 1].map(i => {
        const lx = pad + t + (halfW + t * 0.5) * i + (i === 0 ? 0 : 0);
        return (
          <g key={i}>
            <rect x={lx + 1} y={pad + t + 1} width={halfW - 2} height={h - 2 * t - 2} fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.3} />
            <GlassPanel x={lx + leafT} y={pad + t + leafT} w={halfW - leafT * 2} h={h - 2 * t - leafT * 2} color={color} />
            {/* Arc */}
            <path d={`M ${lx + 8} ${pad + h - t - 5} Q ${lx + halfW / 2} ${pad + h - t - 18} ${lx + halfW - 8} ${pad + h - t - 5}`}
              fill="none" stroke={color.frameDark} strokeWidth={0.8} opacity={0.3} strokeDasharray="3 3" />
          </g>
        );
      })}
    </g>
  );
}

// ===== PORTA DE GIRO 1F =====
function PortaGiro1({ svgWidth: sw, svgHeight: sh, color }: SvgProps) {
  const pad = 8;
  const w = sw - pad * 2;
  const h = sh - pad * 2;
  const t = frameThickness(w, h);
  const leafT = t * 0.6;

  return (
    <g>
      <FrameRect x={pad} y={pad} w={w} h={h} color={color} thickness={t} />
      {/* Door leaf */}
      <rect x={pad + t + 2} y={pad + t + 2} width={w - 2 * t - 4} height={h - 2 * t - 4} fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.5} />
      <GlassPanel x={pad + t + leafT + 2} y={pad + t + leafT + 2} w={w - 2 * t - 2 * leafT - 4} h={h - 2 * t - 2 * leafT - 4} color={color} />
      {/* Handle */}
      <rect x={pad + w - t - leafT - 8} y={pad + h * 0.45} width={3} height={18} rx={1.5} fill={color.frameDark} opacity={0.7} />
      {/* Hinge indicators */}
      <circle cx={pad + t + 6} cy={pad + t + 30} r={2} fill={color.frameDark} opacity={0.5} />
      <circle cx={pad + t + 6} cy={pad + h / 2} r={2} fill={color.frameDark} opacity={0.5} />
      <circle cx={pad + t + 6} cy={pad + h - t - 30} r={2} fill={color.frameDark} opacity={0.5} />
      {/* Opening arc */}
      <path d={`M ${pad + w - t} ${pad + t + 5} A ${w - 2 * t} ${w - 2 * t} 0 0 0 ${pad + w - t - (w - 2 * t) * 0.15} ${pad + h - t - 5}`}
        fill="none" stroke={color.frameDark} strokeWidth={0.8} opacity={0.25} strokeDasharray="4 4" />
    </g>
  );
}

// ===== PORTA DE GIRO 2F =====
function PortaGiro2({ svgWidth: sw, svgHeight: sh, color }: SvgProps) {
  const pad = 8;
  const w = sw - pad * 2;
  const h = sh - pad * 2;
  const t = frameThickness(w, h);
  const leafT = t * 0.6;
  const halfW = (w - 2 * t) / 2;

  return (
    <g>
      <FrameRect x={pad} y={pad} w={w} h={h} color={color} thickness={t} />
      {[0, 1].map(i => {
        const lx = pad + t + halfW * i;
        return (
          <g key={i}>
            <rect x={lx + 1} y={pad + t + 1} width={halfW - 2} height={h - 2 * t - 2} fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.5} />
            <GlassPanel x={lx + leafT} y={pad + t + leafT} w={halfW - leafT * 2} h={h - 2 * t - leafT * 2} color={color} />
            {/* Handle */}
            <rect x={i === 0 ? lx + halfW - leafT - 8 : lx + leafT + 5} y={pad + h * 0.45} width={3} height={18} rx={1.5} fill={color.frameDark} opacity={0.7} />
          </g>
        );
      })}
      {/* Center divider */}
      <line x1={pad + w / 2} y1={pad + t} x2={pad + w / 2} y2={pad + h - t} stroke={color.frameDark} strokeWidth={1} />
    </g>
  );
}

// ===== JANELA CAMARÃO (Sanfonada) =====
function JanelaCamarao({ svgWidth: sw, svgHeight: sh, color }: SvgProps) {
  const pad = 8;
  const w = sw - pad * 2;
  const h = sh - pad * 2;
  const t = frameThickness(w, h);
  const panels = 4;
  const panelW = (w - 2 * t) / panels;
  const leafT = t * 0.5;

  return (
    <g>
      <FrameRect x={pad} y={pad} w={w} h={h} color={color} thickness={t} />
      {Array.from({ length: panels }).map((_, i) => {
        const px = pad + t + panelW * i;
        const offset = i % 2 === 0 ? 2 : -2; // Accordion effect
        return (
          <g key={i}>
            <rect x={px + 1} y={pad + t + 1} width={panelW - 2} height={h - 2 * t - 2}
              fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.4}
              transform={`skewX(${offset})`} style={{ transformOrigin: `${px + panelW / 2}px ${pad + h / 2}px` }} />
            <GlassPanel x={px + leafT} y={pad + t + leafT} w={panelW - leafT * 2} h={h - 2 * t - leafT * 2} color={color} />
            {/* Hinge between panels */}
            {i < panels - 1 && (
              <>
                <circle cx={px + panelW} cy={pad + t + 20} r={1.5} fill={color.frameDark} opacity={0.4} />
                <circle cx={px + panelW} cy={pad + h - t - 20} r={1.5} fill={color.frameDark} opacity={0.4} />
              </>
            )}
          </g>
        );
      })}
    </g>
  );
}

// ===== JANELA C/ VENEZIANA =====
function JanelaVeneziana({ svgWidth: sw, svgHeight: sh, color }: SvgProps) {
  const pad = 8;
  const w = sw - pad * 2;
  const h = sh - pad * 2;
  const t = frameThickness(w, h);
  const halfW = (w - 2 * t) / 2;
  const leafT = t * 0.5;
  const slats = Math.floor((h - 2 * t - 20) / 12);

  return (
    <g>
      <FrameRect x={pad} y={pad} w={w} h={h} color={color} thickness={t} />
      {/* Glass side (left) */}
      {[0, 1].map(i => {
        const lx = pad + t + (halfW) * i;
        return (
          <g key={`glass-${i}`}>
            <rect x={lx + 1} y={pad + t + 1} width={halfW - 2} height={h - 2 * t - 2} fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.3} />
            <GlassPanel x={lx + leafT} y={pad + t + leafT} w={halfW - leafT * 2} h={h - 2 * t - leafT * 2} color={color} />
          </g>
        );
      })}
      {/* Venetian overlay on right half — draw slats over glass */}
      {Array.from({ length: slats }).map((_, i) => {
        const sy = pad + t + 10 + i * 12;
        return (
          <rect key={`slat-${i}`} x={pad + t + halfW + leafT + 2} y={sy} width={halfW - leafT * 2 - 4} height={6}
            fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.3} rx={0.5}
            transform={`rotate(-15, ${pad + t + halfW + halfW / 2}, ${sy + 3})`} opacity={0.85} />
        );
      })}
    </g>
  );
}

// ===== JANELA C/ BANDEIRA MÓVEL =====
function JanelaBandeira({ svgWidth: sw, svgHeight: sh, color }: SvgProps) {
  const pad = 8;
  const w = sw - pad * 2;
  const h = sh - pad * 2;
  const t = frameThickness(w, h);
  const leafT = t * 0.5;
  const bandeiraH = (h - 2 * t) * 0.3;
  const correrH = (h - 2 * t) - bandeiraH - t * 0.4;

  return (
    <g>
      <FrameRect x={pad} y={pad} w={w} h={h} color={color} thickness={t} />
      {/* Bandeira (top) */}
      <rect x={pad + t + 1} y={pad + t + 1} width={w - 2 * t - 2} height={bandeiraH - 2} fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.3} />
      <GlassPanel x={pad + t + leafT} y={pad + t + leafT} w={w - 2 * t - leafT * 2} h={bandeiraH - leafT * 2} color={color} />
      {/* Divider */}
      <rect x={pad + t} y={pad + t + bandeiraH} width={w - 2 * t} height={t * 0.4} fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.3} />
      {/* Sliding panels below */}
      {[0, 1].map(i => {
        const fx = pad + t + ((w - 2 * t) / 2) * i;
        const fy = pad + t + bandeiraH + t * 0.4;
        const fw = (w - 2 * t) / 2;
        return (
          <g key={i}>
            <rect x={fx + 1} y={fy + 1} width={fw - 2} height={correrH - 2} fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.3} />
            <GlassPanel x={fx + leafT} y={fy + leafT} w={fw - leafT * 2} h={correrH - leafT * 2} color={color} />
          </g>
        );
      })}
    </g>
  );
}

// ===== JANELA C/ PEITORIL FIXO =====
function JanelaPeitoril({ svgWidth: sw, svgHeight: sh, color, numFolhas = 4 }: SvgProps) {
  const pad = 8;
  const w = sw - pad * 2;
  const h = sh - pad * 2;
  const t = frameThickness(w, h);
  const leafT = t * 0.5;
  const peitorilH = (h - 2 * t) * 0.3;
  const correrH = (h - 2 * t) - peitorilH - t * 0.4;
  const folhaW = (w - 2 * t) / numFolhas;

  return (
    <g>
      <FrameRect x={pad} y={pad} w={w} h={h} color={color} thickness={t} />
      {/* Sliding panels top */}
      {Array.from({ length: numFolhas }).map((_, i) => {
        const fx = pad + t + folhaW * i;
        return (
          <g key={i}>
            <rect x={fx + 1} y={pad + t + 1} width={folhaW - 2} height={correrH - 2} fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.3} />
            <GlassPanel x={fx + leafT} y={pad + t + leafT} w={folhaW - leafT * 2} h={correrH - leafT * 2} color={color} />
          </g>
        );
      })}
      {/* Divider */}
      <rect x={pad + t} y={pad + t + correrH} width={w - 2 * t} height={t * 0.4} fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.3} />
      {/* Fixed peitoril */}
      <rect x={pad + t + 1} y={pad + t + correrH + t * 0.4 + 1} width={w - 2 * t - 2} height={peitorilH - 2} fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.3} />
      <GlassPanel x={pad + t + leafT} y={pad + t + correrH + t * 0.4 + leafT} w={w - 2 * t - leafT * 2} h={peitorilH - leafT * 2} color={color} />
    </g>
  );
}

// ===== PORTA INTEGRADA (Correr + Fixo) =====
function PortaIntegrada({ svgWidth: sw, svgHeight: sh, color }: SvgProps) {
  const pad = 8;
  const w = sw - pad * 2;
  const h = sh - pad * 2;
  const t = frameThickness(w, h);
  const leafT = t * 0.5;
  const thirdW = (w - 2 * t) / 3;

  return (
    <g>
      <FrameRect x={pad} y={pad} w={w} h={h} color={color} thickness={t} />
      {/* Fixed panel */}
      <rect x={pad + t + 1} y={pad + t + 1} width={thirdW - 2} height={h - 2 * t - 2} fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.3} />
      <GlassPanel x={pad + t + leafT} y={pad + t + leafT} w={thirdW - leafT * 2} h={h - 2 * t - leafT * 2} color={color} />
      <text x={pad + t + thirdW / 2} y={pad + h - t - 8} textAnchor="middle" fontSize={7} fill={color.frameDark} opacity={0.4}>FIXO</text>
      {/* Mullion */}
      <rect x={pad + t + thirdW} y={pad + t} width={t * 0.4} height={h - 2 * t} fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.3} />
      {/* 2 sliding panels */}
      {[0, 1].map(i => {
        const fx = pad + t + thirdW + t * 0.4 + (thirdW - t * 0.2) * i;
        const fw = thirdW - t * 0.2;
        return (
          <g key={i}>
            <rect x={fx + 1} y={pad + t + 1} width={fw - 2} height={h - 2 * t - 2} fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.3} />
            <GlassPanel x={fx + leafT} y={pad + t + leafT} w={fw - leafT * 2} h={h - 2 * t - leafT * 2} color={color} />
          </g>
        );
      })}
    </g>
  );
}

// ===== JANELA GIRO (Abre e Tomba) =====
function JanelaGiro({ svgWidth: sw, svgHeight: sh, color }: SvgProps) {
  const pad = 8;
  const w = sw - pad * 2;
  const h = sh - pad * 2;
  const t = frameThickness(w, h);
  const leafT = t * 0.6;

  return (
    <g>
      <FrameRect x={pad} y={pad} w={w} h={h} color={color} thickness={t} />
      <rect x={pad + t + 2} y={pad + t + 2} width={w - 2 * t - 4} height={h - 2 * t - 4} fill={color.frameColor} stroke={color.frameDark} strokeWidth={0.5} />
      <GlassPanel x={pad + t + leafT + 2} y={pad + t + leafT + 2} w={w - 2 * t - 2 * leafT - 4} h={h - 2 * t - 2 * leafT - 4} color={color} />
      {/* Tilt indicator - dashed triangle at bottom */}
      <path d={`M ${pad + w / 2 - 15} ${pad + h - t - 6} L ${pad + w / 2} ${pad + h - t - 18} L ${pad + w / 2 + 15} ${pad + h - t - 6}`}
        fill="none" stroke={color.frameDark} strokeWidth={0.8} opacity={0.4} strokeDasharray="3 2" />
      {/* Handle */}
      <rect x={pad + w / 2 - 1.5} y={pad + h - t - leafT - 14} width={3} height={12} rx={1.5} fill={color.frameDark} opacity={0.6} />
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
  if (notes?.includes("peitoril") || notes?.includes("Peitoril")) {
    return <JanelaPeitoril {...svgProps} numFolhas={num_folhas} />;
  }

  // Veneziana
  if (has_veneziana) {
    return <JanelaVeneziana {...svgProps} />;
  }

  // Bandeira
  if (has_bandeira) {
    return <JanelaBandeira {...svgProps} />;
  }

  // Porta integrada
  if (notes?.includes("fixo") || notes?.includes("Fixo") || (category === "porta" && subcategory === "correr" && notes?.includes("Integrada"))) {
    return <PortaIntegrada {...svgProps} />;
  }

  // By category/subcategory
  if (category === "maxim_ar") {
    return num_folhas >= 2 ? <MaximAr2 {...svgProps} /> : <MaximAr1 {...svgProps} />;
  }

  if (category === "camarao") {
    return <JanelaCamarao {...svgProps} />;
  }

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
