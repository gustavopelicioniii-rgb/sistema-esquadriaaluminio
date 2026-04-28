import React from 'react';
import {
  VidroInteiro,
  Vidro1DivVertical,
  Vidro2DivVerticais,
  VidroGrade4,
  VidroGrade6,
  VidroBandeiraSuperior,
  VidroTravessaCentral,
  VidroAssimetrico,
  VidroGradeMultipla,
  VidroVeneziana,
  VidroPivotante,
  VidroMaximAr,
} from '@/components/tipologias/vidro-svgs';

export const glassVariantToSvg: Record<string, React.FC> = {
  comum: VidroInteiro,
  temperado: VidroGrade4,
  laminado: Vidro2DivVerticais,
  'temperado-laminado': VidroGrade6,
  insulado: Vidro1DivVertical,
  veneziana: VidroVeneziana,
  pivotante: VidroPivotante,
  'maxim-ar': VidroMaximAr,
  serigrafado: VidroGradeMultipla,
  espelhado: VidroTravessaCentral,
  acidato: VidroBandeiraSuperior,
};

export type GlassSvgSize = 'sm' | 'md' | 'lg';
export type GlassVariant =
  | 'comum'
  | 'temperado'
  | 'laminado'
  | 'temperado-laminado'
  | 'insulado'
  | 'veneziana'
  | 'pivotante'
  | 'maxim-ar'
  | 'serigrafado'
  | 'espelhado'
  | 'acidato';

export function getGlassVariant(tipo: string): GlassVariant {
  const t = tipo.toLowerCase();
  if (t.includes('temperado') && t.includes('laminado')) return 'temperado-laminado';
  if (t.includes('veneziana')) return 'veneziana';
  if (t.includes('pivotante')) return 'pivotante';
  if (t.includes('maxim')) return 'maxim-ar';
  if (t.includes('insulado')) return 'insulado';
  if (t.includes('laminado')) return 'laminado';
  if (t.includes('temperado')) return 'temperado';
  if (t.includes('serigrafado')) return 'serigrafado';
  if (t.includes('espelhado')) return 'espelhado';
  if (t.includes('acidato')) return 'acidato';
  return 'comum';
}

export function GlassPreviewTile({ tipo }: { tipo: string }) {
  const variant = getGlassVariant(tipo);
  const SvgComponent = glassVariantToSvg[variant] ?? VidroInteiro;
  return (
    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/70 bg-background sm:h-24 sm:w-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at top left, hsl(var(--primary) / 0.16), transparent 62%)',
        }}
      />
      <div className="pointer-events-none absolute inset-[12%] rounded-xl border border-border/40" />
      <div className="relative h-[66px] w-[66px] sm:h-[74px] sm:w-[74px]" aria-hidden="true">
        <SvgComponent />
      </div>
    </div>
  );
}

export function getGlassSvgElements(tipo: string, size: GlassSvgSize = 'md') {
  const variant = getGlassVariant(tipo);

  const c =
    size === 'sm'
      ? {
          fx: 2.5,
          fy: 2.5,
          fw: 19,
          fh: 19,
          ix: 4.5,
          iy: 4.5,
          iw: 15,
          ih: 15,
          stroke: 1.3,
          thin: 0.9,
          panel: 1.6,
          rail: 1.15,
          handle: 0.85,
          dot: 0.7,
          arc: 3.5,
          radius: 1.1,
        }
      : size === 'lg'
        ? {
            fx: 4,
            fy: 4,
            fw: 40,
            fh: 40,
            ix: 8,
            iy: 8,
            iw: 32,
            ih: 32,
            stroke: 2.2,
            thin: 1.4,
            panel: 3,
            rail: 2.2,
            handle: 1.8,
            dot: 1.25,
            arc: 8,
            radius: 2,
          }
        : {
            fx: 10,
            fy: 10,
            fw: 80,
            fh: 80,
            ix: 18,
            iy: 18,
            iw: 64,
            ih: 64,
            stroke: 3,
            thin: 1.9,
            panel: 6,
            rail: 4,
            handle: 3.2,
            dot: 2.2,
            arc: 16,
            radius: 4,
          };

  const right = c.ix + c.iw;
  const bottom = c.iy + c.ih;
  const midX = c.ix + c.iw / 2;
  const midY = c.iy + c.ih / 2;
  const leftPaneX = c.ix + c.panel;
  const rightPaneX = midX - c.panel * 0.35;
  const paneY = c.iy + c.panel;
  const paneH = c.ih - c.panel * 2;
  const paneW = c.iw / 2 + c.panel * 0.35;
  const innerX = c.ix + c.panel;
  const innerY = c.iy + c.panel;
  const innerW = c.iw - c.panel * 2;
  const innerH = c.ih - c.panel * 2;
  const innerRight = innerX + innerW;
  const innerBottom = innerY + innerH;
  const openLeafW = c.iw * 0.68;
  const openLeafX = c.ix + c.panel * 1.05;
  const openLeafY = c.iy + c.panel * 0.9;
  const openLeafH = c.ih - c.panel * 1.8;
  const openLeafRight = openLeafX + openLeafW;
  const openLeafBottom = openLeafY + openLeafH;
  const arcStartX = c.ix + c.panel * 1.6;
  const handleX = midX - c.handle / 2;

  const frame = (
    <>
      <rect
        x={c.fx}
        y={c.fy}
        width={c.fw}
        height={c.fh}
        rx={c.radius * 1.4}
        stroke="currentColor"
        strokeWidth={c.stroke}
        fill="none"
      />
      <path
        d={`M ${c.fx + c.radius} ${c.fy + c.radius * 0.6} H ${c.fx + c.radius * 3.1}
            M ${c.fx + c.radius * 0.6} ${c.fy + c.radius} V ${c.fy + c.radius * 3.1}
            M ${c.fx + c.fw - c.radius * 3.1} ${c.fy + c.radius * 0.6} H ${c.fx + c.fw - c.radius}
            M ${c.fx + c.fw - c.radius * 0.6} ${c.fy + c.radius} V ${c.fy + c.radius * 3.1}
            M ${c.fx + c.radius} ${c.fy + c.fh - c.radius * 0.6} H ${c.fx + c.radius * 3.1}
            M ${c.fx + c.radius * 0.6} ${c.fy + c.fh - c.radius} V ${c.fy + c.fh - c.radius * 3.1}
            M ${c.fx + c.fw - c.radius * 3.1} ${c.fy + c.fh - c.radius * 0.6} H ${c.fx + c.fw - c.radius}
            M ${c.fx + c.fw - c.radius * 0.6} ${c.fy + c.fh - c.radius} V ${c.fy + c.fh - c.radius * 3.1}`}
        stroke="currentColor"
        strokeWidth={c.thin}
        opacity="0.35"
        strokeLinecap="round"
      />
      <line
        x1={c.ix}
        y1={c.iy + c.rail}
        x2={right}
        y2={c.iy + c.rail}
        stroke="currentColor"
        strokeWidth={c.thin}
        opacity="0.22"
      />
      <line
        x1={c.ix}
        y1={bottom - c.rail}
        x2={right}
        y2={bottom - c.rail}
        stroke="currentColor"
        strokeWidth={c.thin}
        opacity="0.22"
      />
    </>
  );

  if (variant === 'temperado') {
    return (
      <>
        {frame}
        <rect
          x={innerX}
          y={innerY}
          width={innerW}
          height={innerH}
          rx={c.radius}
          fill="currentColor"
          opacity="0.08"
        />
        <rect
          x={innerX}
          y={innerY}
          width={innerW}
          height={innerH}
          rx={c.radius}
          stroke="currentColor"
          strokeWidth={c.thin}
          opacity="0.42"
        />
        <line
          x1={innerX + c.panel * 0.6}
          y1={innerBottom - c.panel * 0.6}
          x2={innerRight - c.panel * 0.6}
          y2={innerY + c.panel * 0.6}
          stroke="currentColor"
          strokeWidth={c.thin}
          opacity="0.28"
        />
        <line
          x1={innerX + c.panel * 0.6}
          y1={innerY + c.panel * 0.6}
          x2={innerRight - c.panel * 0.6}
          y2={innerBottom - c.panel * 0.6}
          stroke="currentColor"
          strokeWidth={c.thin}
          opacity="0.18"
        />
        {[
          [innerX + c.panel * 0.65, innerY + c.panel * 0.65],
          [innerRight - c.panel * 0.65, innerY + c.panel * 0.65],
          [innerX + c.panel * 0.65, innerBottom - c.panel * 0.65],
          [innerRight - c.panel * 0.65, innerBottom - c.panel * 0.65],
        ].map(([x, y], index) => (
          <circle key={index} cx={x} cy={y} r={c.dot} fill="currentColor" opacity="0.55" />
        ))}
      </>
    );
  }

  if (variant === 'insulado') {
    return (
      <>
        {frame}
        <rect
          x={innerX - c.panel * 0.35}
          y={innerY - c.panel * 0.35}
          width={innerW}
          height={innerH}
          rx={c.radius}
          fill="currentColor"
          opacity="0.05"
        />
        <rect
          x={innerX + c.panel * 0.55}
          y={innerY + c.panel * 0.55}
          width={innerW - c.panel * 1.1}
          height={innerH - c.panel * 1.1}
          rx={c.radius}
          fill="currentColor"
          opacity="0.12"
        />
        <rect
          x={innerX - c.panel * 0.35}
          y={innerY - c.panel * 0.35}
          width={innerW}
          height={innerH}
          rx={c.radius}
          stroke="currentColor"
          strokeWidth={c.thin}
          opacity="0.28"
        />
        <rect
          x={innerX + c.panel * 0.55}
          y={innerY + c.panel * 0.55}
          width={innerW - c.panel * 1.1}
          height={innerH - c.panel * 1.1}
          rx={c.radius}
          stroke="currentColor"
          strokeWidth={c.thin}
          opacity="0.45"
        />
        <line
          x1={midX - c.panel * 0.7}
          y1={innerY}
          x2={midX - c.panel * 0.7}
          y2={innerBottom}
          stroke="currentColor"
          strokeWidth={c.thin}
          opacity="0.25"
          strokeDasharray={size === 'sm' ? '1 1' : '3 3'}
        />
        <line
          x1={midX + c.panel * 0.7}
          y1={innerY + c.panel * 0.2}
          x2={midX + c.panel * 0.7}
          y2={innerBottom - c.panel * 0.2}
          stroke="currentColor"
          strokeWidth={c.thin}
          opacity="0.25"
          strokeDasharray={size === 'sm' ? '1 1' : '3 3'}
        />
      </>
    );
  }

  if (variant === 'laminado' || variant === 'temperado-laminado') {
    return (
      <>
        {frame}
        <rect
          x={openLeafX}
          y={openLeafY}
          width={openLeafW}
          height={openLeafH}
          rx={c.radius}
          fill="currentColor"
          opacity="0.08"
        />
        <rect
          x={openLeafX}
          y={openLeafY}
          width={openLeafW}
          height={openLeafH}
          rx={c.radius}
          stroke="currentColor"
          strokeWidth={c.thin}
          opacity="0.45"
        />
        <line
          x1={openLeafX}
          y1={openLeafY}
          x2={openLeafX}
          y2={openLeafBottom}
          stroke="currentColor"
          strokeWidth={c.stroke * 0.7}
          opacity="0.55"
        />
        <circle
          cx={openLeafX}
          cy={openLeafY + openLeafH * 0.22}
          r={c.dot}
          fill="currentColor"
          opacity="0.6"
        />
        <circle
          cx={openLeafX}
          cy={openLeafY + openLeafH * 0.78}
          r={c.dot}
          fill="currentColor"
          opacity="0.6"
        />
        <path
          d={`M ${arcStartX} ${midY - c.arc} A ${c.arc} ${c.arc} 0 0 1 ${arcStartX} ${midY + c.arc}`}
          stroke="currentColor"
          strokeWidth={c.thin}
          fill="none"
          opacity="0.35"
        />
        <path
          d={`M ${arcStartX + c.thin} ${midY - c.arc} l ${c.panel * 1.35} ${c.panel * 0.72} l ${-c.panel * 0.2} ${c.panel * 0.95}`}
          stroke="currentColor"
          strokeWidth={c.thin}
          fill="none"
          opacity="0.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {variant === 'temperado-laminado' && (
          <line
            x1={openLeafX + c.panel * 1.2}
            y1={openLeafY + c.panel * 1.1}
            x2={openLeafRight - c.panel * 1.1}
            y2={openLeafBottom - c.panel * 1.1}
            stroke="currentColor"
            strokeWidth={c.thin}
            opacity="0.22"
          />
        )}
      </>
    );
  }

  return (
    <>
      {frame}
      <rect
        x={leftPaneX}
        y={paneY}
        width={paneW - c.panel}
        height={paneH}
        rx={c.radius}
        fill="currentColor"
        opacity="0.08"
      />
      <rect
        x={leftPaneX}
        y={paneY}
        width={paneW - c.panel}
        height={paneH}
        rx={c.radius}
        stroke="currentColor"
        strokeWidth={c.thin}
        opacity="0.36"
      />
      <rect
        x={rightPaneX}
        y={paneY + c.panel * 0.35}
        width={paneW - c.panel}
        height={paneH - c.panel * 0.7}
        rx={c.radius}
        fill="currentColor"
        opacity="0.14"
      />
      <rect
        x={rightPaneX}
        y={paneY + c.panel * 0.35}
        width={paneW - c.panel}
        height={paneH - c.panel * 0.7}
        rx={c.radius}
        stroke="currentColor"
        strokeWidth={c.thin}
        opacity="0.45"
      />
      <line
        x1={midX}
        y1={c.iy}
        x2={midX}
        y2={bottom}
        stroke="currentColor"
        strokeWidth={c.thin}
        opacity="0.24"
      />
      <rect
        x={handleX - c.panel * 0.9}
        y={midY - c.panel * 0.75}
        width={c.handle}
        height={c.panel * 1.5}
        rx={c.handle}
        fill="currentColor"
        opacity="0.6"
      />
      <rect
        x={handleX + c.panel * 0.8}
        y={midY - c.panel * 0.75}
        width={c.handle}
        height={c.panel * 1.5}
        rx={c.handle}
        fill="currentColor"
        opacity="0.32"
      />
    </>
  );
}
