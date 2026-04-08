import React from "react";

const GLASS = "#A7D3E8";
const STROKE = "#7A7A7A";
const SW = 1;
const M = 6; // margin
const S = 100 - M * 2; // usable size (88)

const base = { fill: GLASS, stroke: STROKE, strokeWidth: SW };

/** Vidro inteiro */
export const VidroInteiro = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect x={M} y={M} width={S} height={S} {...base} />
  </svg>
);

/** 1 divisão vertical — 2 partes */
export const Vidro1DivVertical = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect x={M} y={M} width={S} height={S} {...base} />
    <line x1={50} y1={M} x2={50} y2={100 - M} stroke={STROKE} strokeWidth={SW} />
  </svg>
);

/** 2 divisões verticais — 3 partes */
export const Vidro2DivVerticais = () => {
  const x1 = M + S / 3;
  const x2 = M + (2 * S) / 3;
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x={M} y={M} width={S} height={S} {...base} />
      <line x1={x1} y1={M} x2={x1} y2={100 - M} stroke={STROKE} strokeWidth={SW} />
      <line x1={x2} y1={M} x2={x2} y2={100 - M} stroke={STROKE} strokeWidth={SW} />
    </svg>
  );
};

/** 2 divisões horizontais — 3 partes */
export const Vidro2DivHorizontais = () => {
  const y1 = M + S / 3;
  const y2 = M + (2 * S) / 3;
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x={M} y={M} width={S} height={S} {...base} />
      <line x1={M} y1={y1} x2={100 - M} y2={y1} stroke={STROKE} strokeWidth={SW} />
      <line x1={M} y1={y2} x2={100 - M} y2={y2} stroke={STROKE} strokeWidth={SW} />
    </svg>
  );
};

/** Grade quadriculada — 4 partes (2x2) */
export const VidroGrade4 = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect x={M} y={M} width={S} height={S} {...base} />
    <line x1={50} y1={M} x2={50} y2={100 - M} stroke={STROKE} strokeWidth={SW} />
    <line x1={M} y1={50} x2={100 - M} y2={50} stroke={STROKE} strokeWidth={SW} />
  </svg>
);

/** Grade 6 partes — 3 colunas x 2 linhas */
export const VidroGrade6 = () => {
  const x1 = M + S / 3;
  const x2 = M + (2 * S) / 3;
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x={M} y={M} width={S} height={S} {...base} />
      <line x1={x1} y1={M} x2={x1} y2={100 - M} stroke={STROKE} strokeWidth={SW} />
      <line x1={x2} y1={M} x2={x2} y2={100 - M} stroke={STROKE} strokeWidth={SW} />
      <line x1={M} y1={50} x2={100 - M} y2={50} stroke={STROKE} strokeWidth={SW} />
    </svg>
  );
};

/** Bandeira superior — divisão horizontal no topo (25% / 75%) */
export const VidroBandeiraSuperior = () => {
  const yDiv = M + S * 0.25;
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x={M} y={M} width={S} height={S} {...base} />
      <line x1={M} y1={yDiv} x2={100 - M} y2={yDiv} stroke={STROKE} strokeWidth={SW} />
    </svg>
  );
};

/** Travessa central — divisão horizontal no meio */
export const VidroTravessaCentral = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect x={M} y={M} width={S} height={S} {...base} />
    <line x1={M} y1={50} x2={100 - M} y2={50} stroke={STROKE} strokeWidth={SW} />
  </svg>
);

/** Divisão assimétrica vertical — 70/30 */
export const VidroAssimetrico = () => {
  const xDiv = M + S * 0.7;
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x={M} y={M} width={S} height={S} {...base} />
      <line x1={xDiv} y1={M} x2={xDiv} y2={100 - M} stroke={STROKE} strokeWidth={SW} />
    </svg>
  );
};

/** Múltiplas divisões tipo grade — 4 colunas x 3 linhas (12 partes) */
export const VidroGradeMultipla = () => {
  const cols = 4;
  const rows = 3;
  const lines: React.ReactElement[] = [];
  for (let c = 1; c < cols; c++) {
    const x = M + (S * c) / cols;
    lines.push(<line key={`v${c}`} x1={x} y1={M} x2={x} y2={100 - M} stroke={STROKE} strokeWidth={SW} />);
  }
  for (let r = 1; r < rows; r++) {
    const y = M + (S * r) / rows;
    lines.push(<line key={`h${r}`} x1={M} y1={y} x2={100 - M} y2={y} stroke={STROKE} strokeWidth={SW} />);
  }
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x={M} y={M} width={S} height={S} {...base} />
      {lines}
    </svg>
  );
};

/** Veneziana — lâminas horizontais */
export const VidroVeneziana = () => {
  const count = 7;
  const lines: React.ReactElement[] = [];
  for (let i = 1; i < count; i++) {
    const y = M + (S * i) / count;
    lines.push(<line key={i} x1={M + 4} y1={y} x2={100 - M - 4} y2={y - 3} stroke={STROKE} strokeWidth={SW} />);
  }
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x={M} y={M} width={S} height={S} {...base} />
      {lines}
    </svg>
  );
};

/** Pivotante — eixo central com indicação de rotação */
export const VidroPivotante = () => {
  const cx = 50;
  const cy = 50;
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x={M} y={M} width={S} height={S} {...base} />
      <line x1={cx} y1={M} x2={cx} y2={100 - M} stroke={STROKE} strokeWidth={SW} />
      <circle cx={cx} cy={cy} r={3} fill={STROKE} />
      <line x1={M} y1={cy} x2={cx - 6} y2={cy} stroke={STROKE} strokeWidth={SW} strokeDasharray="3 2" />
      <line x1={cx + 6} y1={cy} x2={100 - M} y2={cy} stroke={STROKE} strokeWidth={SW} strokeDasharray="3 2" />
    </svg>
  );
};

/** Maxim-ar — abertura basculante superior */
export const VidroMaximAr = () => {
  const top = M;
  const bot = 100 - M;
  const left = M;
  const right = 100 - M;
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x={M} y={M} width={S} height={S} {...base} />
      <line x1={left} y1={top + S * 0.3} x2={right} y2={top + S * 0.3} stroke={STROKE} strokeWidth={SW} />
      <line x1={left} y1={top} x2={50} y2={top + S * 0.28} stroke={STROKE} strokeWidth={SW} strokeDasharray="3 2" />
      <line x1={right} y1={top} x2={50} y2={top + S * 0.28} stroke={STROKE} strokeWidth={SW} strokeDasharray="3 2" />
    </svg>
  );
};

/** Catálogo completo */
export const vidroTypologies = [
  { id: "vidro_inteiro", label: "Vidro Inteiro", Icon: VidroInteiro },
  { id: "vidro_1_div_vertical", label: "1 Divisão Vertical", Icon: Vidro1DivVertical },
  { id: "vidro_2_div_verticais", label: "2 Divisões Verticais", Icon: Vidro2DivVerticais },
  { id: "vidro_2_div_horizontais", label: "2 Divisões Horizontais", Icon: Vidro2DivHorizontais },
  { id: "vidro_grade_4", label: "Grade 4 Partes", Icon: VidroGrade4 },
  { id: "vidro_grade_6", label: "Grade 6 Partes", Icon: VidroGrade6 },
  { id: "vidro_bandeira_superior", label: "Bandeira Superior", Icon: VidroBandeiraSuperior },
  { id: "vidro_travessa_central", label: "Travessa Central", Icon: VidroTravessaCentral },
  { id: "vidro_assimetrico", label: "Divisão Assimétrica 70/30", Icon: VidroAssimetrico },
  { id: "vidro_grade_multipla", label: "Grade Múltipla", Icon: VidroGradeMultipla },
  { id: "vidro_veneziana", label: "Veneziana", Icon: VidroVeneziana },
  { id: "vidro_pivotante", label: "Pivotante", Icon: VidroPivotante },
  { id: "vidro_maxim_ar", label: "Maxim-Ar", Icon: VidroMaximAr },
] as const;
