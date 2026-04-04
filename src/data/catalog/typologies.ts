import type { Typology } from "@/types/calculation";

// ============================================
// 22 TIPOLOGIAS SUPREMA (25mm) — Expandida
// ============================================
const supremaTypologies: Typology[] = [
  // Janelas de Correr
  { id: "typ-su-jc2f", product_line_id: "line-suprema", name: "Janela de Correr 2 Folhas", category: "janela", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 4000, min_height_mm: 400, max_height_mm: 2500 },
  { id: "typ-su-jc3f", product_line_id: "line-suprema", name: "Janela de Correr 3 Folhas", category: "janela", subcategory: "correr", num_folhas: 3, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 900, max_width_mm: 5000, min_height_mm: 400, max_height_mm: 2500 },
  { id: "typ-su-jc4f", product_line_id: "line-suprema", name: "Janela de Correr 4 Folhas", category: "janela", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1200, max_width_mm: 6000, min_height_mm: 400, max_height_mm: 2500 },
  { id: "typ-su-jc6f", product_line_id: "line-suprema", name: "Janela de Correr 6 Folhas", category: "janela", subcategory: "correr", num_folhas: 6, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1800, max_width_mm: 6000, min_height_mm: 400, max_height_mm: 2500 },
  { id: "typ-su-jc4fp", product_line_id: "line-suprema", name: "Janela de Correr 4F c/ Peitoril Fixo", category: "janela", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, notes: "Com peitoril fixo inferior", min_width_mm: 1200, max_width_mm: 6000, min_height_mm: 600, max_height_mm: 2500 },
  { id: "typ-su-jc2fb", product_line_id: "line-suprema", name: "Janela de Correr 2F c/ Bandeira Móvel", category: "janela", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: true, active: true, min_width_mm: 600, max_width_mm: 4000, min_height_mm: 600, max_height_mm: 2800 },
  // Maxim-Ar
  { id: "typ-su-jma1", product_line_id: "line-suprema", name: "Janela Maxim-Ar 1 Folha", category: "maxim_ar", subcategory: "maxim_ar", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 300, max_width_mm: 1400, min_height_mm: 300, max_height_mm: 1200 },
  { id: "typ-su-jma2", product_line_id: "line-suprema", name: "Janela Maxim-Ar 2 Folhas", category: "maxim_ar", subcategory: "maxim_ar", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 2500, min_height_mm: 300, max_height_mm: 1400 },
  // Camarão
  { id: "typ-su-jcam", product_line_id: "line-suprema", name: "Janela Camarão (Sanfonada)", category: "camarao", subcategory: "camarao", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 5000, min_height_mm: 500, max_height_mm: 2500 },
  // Portas de Correr
  { id: "typ-su-pc2f", product_line_id: "line-suprema", name: "Porta de Correr 2 Folhas", category: "porta", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 5000, min_height_mm: 1900, max_height_mm: 3000 },
  { id: "typ-su-pc3f", product_line_id: "line-suprema", name: "Porta de Correr 3 Folhas", category: "porta", subcategory: "correr", num_folhas: 3, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1500, max_width_mm: 6000, min_height_mm: 1900, max_height_mm: 3000 },
  { id: "typ-su-pc4f", product_line_id: "line-suprema", name: "Porta de Correr 4 Folhas", category: "porta", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 2000, max_width_mm: 6000, min_height_mm: 1900, max_height_mm: 3000 },
  // Portas de Giro
  { id: "typ-su-pg1f", product_line_id: "line-suprema", name: "Porta de Giro 1 Folha", category: "porta", subcategory: "giro", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 500, max_width_mm: 1200, min_height_mm: 1900, max_height_mm: 3000 },
  { id: "typ-su-pg2f", product_line_id: "line-suprema", name: "Porta de Giro 2 Folhas", category: "porta", subcategory: "giro", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 900, max_width_mm: 2400, min_height_mm: 1900, max_height_mm: 3000 },
  // Veneziana
  { id: "typ-su-jc2fv", product_line_id: "line-suprema", name: "Janela de Correr 2F c/ Veneziana", category: "veneziana", subcategory: "correr", num_folhas: 2, has_veneziana: true, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 4000, min_height_mm: 500, max_height_mm: 2500 },
  { id: "typ-su-jc4fv", product_line_id: "line-suprema", name: "Janela de Correr 4F c/ Veneziana", category: "veneziana", subcategory: "correr", num_folhas: 4, has_veneziana: true, has_bandeira: false, active: true, min_width_mm: 1200, max_width_mm: 6000, min_height_mm: 500, max_height_mm: 2500 },
  // Basculante
  { id: "typ-su-jbas1", product_line_id: "line-suprema", name: "Basculante 1 Folha", category: "basculante", subcategory: "basculante", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 300, max_width_mm: 1200, min_height_mm: 300, max_height_mm: 800 },
  { id: "typ-su-jbas2", product_line_id: "line-suprema", name: "Basculante 2 Folhas", category: "basculante", subcategory: "basculante", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 2000, min_height_mm: 300, max_height_mm: 800 },
  // Vitro Fixo
  { id: "typ-su-vfix", product_line_id: "line-suprema", name: "Vitrô Fixo", category: "vitro", subcategory: "fixo", num_folhas: 0, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 300, max_width_mm: 3000, min_height_mm: 300, max_height_mm: 3000 },
  // Pivotante
  { id: "typ-su-jpiv", product_line_id: "line-suprema", name: "Janela Pivotante", category: "pivotante", subcategory: "pivotante", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 400, max_width_mm: 1500, min_height_mm: 400, max_height_mm: 2000 },
  // Porta Balcão
  { id: "typ-su-pbal", product_line_id: "line-suprema", name: "Porta Balcão 2F (Vidro+Veneziana)", category: "veneziana", subcategory: "correr", num_folhas: 2, has_veneziana: true, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 4000, min_height_mm: 1900, max_height_mm: 3000 },
  // Porta Camarão
  { id: "typ-su-pcam", product_line_id: "line-suprema", name: "Porta Camarão (Sanfonada)", category: "camarao", subcategory: "camarao", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 5000, min_height_mm: 1900, max_height_mm: 3000 },
];

// ============================================
// 20 TIPOLOGIAS GOLD (32mm) — Expandida
// ============================================
const goldTypologies: Typology[] = [
  // Janelas de Correr
  { id: "typ-go-jc2f", product_line_id: "line-gold", name: "Janela de Correr 2 Folhas", category: "janela", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 4500, min_height_mm: 400, max_height_mm: 2800 },
  { id: "typ-go-jc3f", product_line_id: "line-gold", name: "Janela de Correr 3 Folhas", category: "janela", subcategory: "correr", num_folhas: 3, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 900, max_width_mm: 5500, min_height_mm: 400, max_height_mm: 2800 },
  { id: "typ-go-jc4f", product_line_id: "line-gold", name: "Janela de Correr 4 Folhas", category: "janela", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1200, max_width_mm: 6000, min_height_mm: 400, max_height_mm: 2800 },
  { id: "typ-go-jc6f", product_line_id: "line-gold", name: "Janela de Correr 6 Folhas", category: "janela", subcategory: "correr", num_folhas: 6, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1800, max_width_mm: 6000, min_height_mm: 400, max_height_mm: 2800 },
  { id: "typ-go-jc4fp", product_line_id: "line-gold", name: "Janela de Correr 4F c/ Peitoril Fixo", category: "janela", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1200, max_width_mm: 6000, min_height_mm: 600, max_height_mm: 2800 },
  // Maxim-Ar
  { id: "typ-go-jma1", product_line_id: "line-gold", name: "Janela Maxim-Ar 1 Folha", category: "maxim_ar", subcategory: "maxim_ar", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 300, max_width_mm: 1600, min_height_mm: 300, max_height_mm: 1400 },
  { id: "typ-go-jma2", product_line_id: "line-gold", name: "Janela Maxim-Ar 2 Folhas", category: "maxim_ar", subcategory: "maxim_ar", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 2800, min_height_mm: 300, max_height_mm: 1600 },
  // Camarão
  { id: "typ-go-jcam", product_line_id: "line-gold", name: "Janela Camarão", category: "camarao", subcategory: "camarao", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 5500, min_height_mm: 500, max_height_mm: 2800 },
  // Portas de Correr
  { id: "typ-go-pc2f", product_line_id: "line-gold", name: "Porta de Correr 2 Folhas", category: "porta", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 5500, min_height_mm: 1900, max_height_mm: 3200 },
  { id: "typ-go-pc4f", product_line_id: "line-gold", name: "Porta de Correr 4 Folhas", category: "porta", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 2000, max_width_mm: 6000, min_height_mm: 1900, max_height_mm: 3200 },
  // Portas de Giro
  { id: "typ-go-pg1f", product_line_id: "line-gold", name: "Porta de Giro 1 Folha", category: "porta", subcategory: "giro", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 500, max_width_mm: 1300, min_height_mm: 1900, max_height_mm: 3200 },
  { id: "typ-go-pg2f", product_line_id: "line-gold", name: "Porta de Giro 2 Folhas", category: "porta", subcategory: "giro", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 900, max_width_mm: 2600, min_height_mm: 1900, max_height_mm: 3200 },
  // Veneziana
  { id: "typ-go-jc2fv", product_line_id: "line-gold", name: "Janela de Correr 2F c/ Veneziana", category: "veneziana", subcategory: "correr", num_folhas: 2, has_veneziana: true, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 4500, min_height_mm: 500, max_height_mm: 2800 },
  // Giro (Abre e Tomba)
  { id: "typ-go-jgiro", product_line_id: "line-gold", name: "Janela Giro (Abre e Tomba)", category: "janela", subcategory: "giro", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 400, max_width_mm: 1400, min_height_mm: 400, max_height_mm: 2000 },
  // Porta Integrada
  { id: "typ-go-pint", product_line_id: "line-gold", name: "Porta Integrada (Correr + Fixo)", category: "porta", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, notes: "2 folhas de correr + 1 fixo", min_width_mm: 1500, max_width_mm: 6000, min_height_mm: 1900, max_height_mm: 3200 },
  // Basculante
  { id: "typ-go-jbas1", product_line_id: "line-gold", name: "Basculante 1 Folha Gold", category: "basculante", subcategory: "basculante", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 300, max_width_mm: 1400, min_height_mm: 300, max_height_mm: 900 },
  // Vitrô Fixo
  { id: "typ-go-vfix", product_line_id: "line-gold", name: "Vitrô Fixo Gold", category: "vitro", subcategory: "fixo", num_folhas: 0, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 300, max_width_mm: 3500, min_height_mm: 300, max_height_mm: 3500 },
  // Pivotante
  { id: "typ-go-jpiv", product_line_id: "line-gold", name: "Janela Pivotante Gold", category: "pivotante", subcategory: "pivotante", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 400, max_width_mm: 1600, min_height_mm: 400, max_height_mm: 2200 },
  // Porta Balcão
  { id: "typ-go-pbal", product_line_id: "line-gold", name: "Porta Balcão 2F Gold", category: "veneziana", subcategory: "correr", num_folhas: 2, has_veneziana: true, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 4500, min_height_mm: 1900, max_height_mm: 3200 },
  // Porta Camarão
  { id: "typ-go-pcam", product_line_id: "line-gold", name: "Porta Camarão Gold", category: "camarao", subcategory: "camarao", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 5500, min_height_mm: 1900, max_height_mm: 3200 },
];

// ============================================
// CLONE PARA TODAS AS LINHAS COMPATÍVEIS
// ============================================
interface LineClone {
  lineId: string;
  prefix: string;
}

// Linhas 25mm → clonam tipologias Suprema
const compatible25Lines: LineClone[] = [
  { lineId: "line-mega25", prefix: "mg25" },
  { lineId: "line-hyspex25su", prefix: "hy" },
  { lineId: "line-alumasa25", prefix: "al" },
  { lineId: "line-ds-suprema", prefix: "ds" },
  { lineId: "line-brimetal25", prefix: "br" },
  { lineId: "line-cba25", prefix: "cb" },
  { lineId: "line-real25", prefix: "re" },
  { lineId: "line-lp25", prefix: "lp" },
  { lineId: "line-alux25", prefix: "ax" },
  { lineId: "line-albras25", prefix: "ab" },
  { lineId: "line-sm25", prefix: "sm" },
  { lineId: "line-prado25", prefix: "pr" },
  { lineId: "line-hydro25", prefix: "hb" },
  { lineId: "line-pin25", prefix: "pn" },
  { lineId: "line-suprema-plus", prefix: "sp" },
];

// Linhas 32mm → clonam tipologias Gold
const compatible32Lines: LineClone[] = [
  { lineId: "line-ds-gold", prefix: "dg" },
  { lineId: "line-brimetal32", prefix: "bg" },
  { lineId: "line-cba32", prefix: "c32" },
  { lineId: "line-real32", prefix: "r32" },
  { lineId: "line-lp32", prefix: "l32" },
  { lineId: "line-alux32", prefix: "x32" },
  { lineId: "line-albras32", prefix: "a32" },
  { lineId: "line-sm32", prefix: "s32" },
  { lineId: "line-prado32", prefix: "p32" },
  { lineId: "line-hydro32", prefix: "h32" },
  { lineId: "line-pin32", prefix: "n32" },
  { lineId: "line-hyspex32", prefix: "hx32" },
  { lineId: "line-mega32", prefix: "m32" },
  { lineId: "line-alumasa32", prefix: "am32" },
];

function cloneTypologies(source: Typology[], clone: LineClone, sourcePrefix: string): Typology[] {
  return source.map(t => ({
    ...t,
    id: t.id.replace(`typ-${sourcePrefix}-`, `typ-${clone.prefix}-`),
    product_line_id: clone.lineId,
  }));
}

const cloned25Typologies = compatible25Lines.flatMap(c => cloneTypologies(supremaTypologies, c, "su"));
const cloned32Typologies = compatible32Lines.flatMap(c => cloneTypologies(goldTypologies, c, "go"));

export const typologies: Typology[] = [
  ...supremaTypologies,
  ...goldTypologies,
  ...cloned25Typologies,
  ...cloned32Typologies,
];
