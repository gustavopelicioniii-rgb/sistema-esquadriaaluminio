import type { Typology } from "@/types/calculation";

// ============================================
// 15 TIPOLOGIAS SUPREMA (25mm)
// ============================================
const supremaTypologies: Typology[] = [
  { id: "typ-su-jc2f", product_line_id: "line-suprema", name: "Janela de Correr 2 Folhas", category: "janela", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 4000, min_height_mm: 400, max_height_mm: 2500 },
  { id: "typ-su-jc4f", product_line_id: "line-suprema", name: "Janela de Correr 4 Folhas", category: "janela", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1200, max_width_mm: 6000, min_height_mm: 400, max_height_mm: 2500 },
  { id: "typ-su-jc3f", product_line_id: "line-suprema", name: "Janela de Correr 3 Folhas", category: "janela", subcategory: "correr", num_folhas: 3, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 900, max_width_mm: 5000, min_height_mm: 400, max_height_mm: 2500 },
  { id: "typ-su-jc4fp", product_line_id: "line-suprema", name: "Janela de Correr 4F c/ Peitoril Fixo", category: "janela", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, notes: "Com peitoril fixo inferior", min_width_mm: 1200, max_width_mm: 6000, min_height_mm: 600, max_height_mm: 2500 },
  { id: "typ-su-jma1", product_line_id: "line-suprema", name: "Janela Maxim-Ar 1 Folha", category: "maxim_ar", subcategory: "maxim_ar", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 300, max_width_mm: 1400, min_height_mm: 300, max_height_mm: 1200 },
  { id: "typ-su-jma2", product_line_id: "line-suprema", name: "Janela Maxim-Ar 2 Folhas", category: "maxim_ar", subcategory: "maxim_ar", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 2500, min_height_mm: 300, max_height_mm: 1400 },
  { id: "typ-su-jcam", product_line_id: "line-suprema", name: "Janela Camarão (Sanfonada)", category: "camarao", subcategory: "camarao", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 5000, min_height_mm: 500, max_height_mm: 2500 },
  { id: "typ-su-pc2f", product_line_id: "line-suprema", name: "Porta de Correr 2 Folhas", category: "porta", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 5000, min_height_mm: 1900, max_height_mm: 3000 },
  { id: "typ-su-pc4f", product_line_id: "line-suprema", name: "Porta de Correr 4 Folhas", category: "porta", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 2000, max_width_mm: 6000, min_height_mm: 1900, max_height_mm: 3000 },
  { id: "typ-su-pg1f", product_line_id: "line-suprema", name: "Porta de Giro 1 Folha", category: "porta", subcategory: "giro", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 500, max_width_mm: 1200, min_height_mm: 1900, max_height_mm: 3000 },
  { id: "typ-su-pg2f", product_line_id: "line-suprema", name: "Porta de Giro 2 Folhas", category: "porta", subcategory: "giro", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 900, max_width_mm: 2400, min_height_mm: 1900, max_height_mm: 3000 },
  { id: "typ-su-jc2fv", product_line_id: "line-suprema", name: "Janela de Correr 2F c/ Veneziana", category: "veneziana", subcategory: "correr", num_folhas: 2, has_veneziana: true, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 4000, min_height_mm: 500, max_height_mm: 2500 },
  { id: "typ-su-jc2fb", product_line_id: "line-suprema", name: "Janela de Correr 2F c/ Bandeira Móvel", category: "janela", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: true, active: true, min_width_mm: 600, max_width_mm: 4000, min_height_mm: 600, max_height_mm: 2800 },
  { id: "typ-su-jc6f", product_line_id: "line-suprema", name: "Janela de Correr 6 Folhas", category: "janela", subcategory: "correr", num_folhas: 6, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1800, max_width_mm: 6000, min_height_mm: 400, max_height_mm: 2500 },
  { id: "typ-su-pc3f", product_line_id: "line-suprema", name: "Porta de Correr 3 Folhas", category: "porta", subcategory: "correr", num_folhas: 3, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1500, max_width_mm: 6000, min_height_mm: 1900, max_height_mm: 3000 },
];

// ============================================
// 15 TIPOLOGIAS GOLD (32mm)
// ============================================
const goldTypologies: Typology[] = [
  { id: "typ-go-jc2f", product_line_id: "line-gold", name: "Janela de Correr 2 Folhas", category: "janela", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 4500, min_height_mm: 400, max_height_mm: 2800 },
  { id: "typ-go-jc4f", product_line_id: "line-gold", name: "Janela de Correr 4 Folhas", category: "janela", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1200, max_width_mm: 6000, min_height_mm: 400, max_height_mm: 2800 },
  { id: "typ-go-jc3f", product_line_id: "line-gold", name: "Janela de Correr 3 Folhas", category: "janela", subcategory: "correr", num_folhas: 3, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 900, max_width_mm: 5500, min_height_mm: 400, max_height_mm: 2800 },
  { id: "typ-go-jma1", product_line_id: "line-gold", name: "Janela Maxim-Ar 1 Folha", category: "maxim_ar", subcategory: "maxim_ar", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 300, max_width_mm: 1600, min_height_mm: 300, max_height_mm: 1400 },
  { id: "typ-go-jma2", product_line_id: "line-gold", name: "Janela Maxim-Ar 2 Folhas", category: "maxim_ar", subcategory: "maxim_ar", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 2800, min_height_mm: 300, max_height_mm: 1600 },
  { id: "typ-go-pc2f", product_line_id: "line-gold", name: "Porta de Correr 2 Folhas", category: "porta", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 5500, min_height_mm: 1900, max_height_mm: 3200 },
  { id: "typ-go-pc4f", product_line_id: "line-gold", name: "Porta de Correr 4 Folhas", category: "porta", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 2000, max_width_mm: 6000, min_height_mm: 1900, max_height_mm: 3200 },
  { id: "typ-go-pg1f", product_line_id: "line-gold", name: "Porta de Giro 1 Folha", category: "porta", subcategory: "giro", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 500, max_width_mm: 1300, min_height_mm: 1900, max_height_mm: 3200 },
  { id: "typ-go-pg2f", product_line_id: "line-gold", name: "Porta de Giro 2 Folhas", category: "porta", subcategory: "giro", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 900, max_width_mm: 2600, min_height_mm: 1900, max_height_mm: 3200 },
  { id: "typ-go-jc4fp", product_line_id: "line-gold", name: "Janela de Correr 4F c/ Peitoril Fixo", category: "janela", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1200, max_width_mm: 6000, min_height_mm: 600, max_height_mm: 2800 },
  { id: "typ-go-jcam", product_line_id: "line-gold", name: "Janela Camarão", category: "camarao", subcategory: "camarao", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 5500, min_height_mm: 500, max_height_mm: 2800 },
  { id: "typ-go-jc2fv", product_line_id: "line-gold", name: "Janela de Correr 2F c/ Veneziana", category: "veneziana", subcategory: "correr", num_folhas: 2, has_veneziana: true, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 4500, min_height_mm: 500, max_height_mm: 2800 },
  { id: "typ-go-jgiro", product_line_id: "line-gold", name: "Janela Giro (Abre e Tomba)", category: "janela", subcategory: "giro", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 400, max_width_mm: 1400, min_height_mm: 400, max_height_mm: 2000 },
  { id: "typ-go-pint", product_line_id: "line-gold", name: "Porta Integrada (Correr + Fixo)", category: "porta", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, notes: "2 folhas de correr + 1 fixo", min_width_mm: 1500, max_width_mm: 6000, min_height_mm: 1900, max_height_mm: 3200 },
  { id: "typ-go-jc6f", product_line_id: "line-gold", name: "Janela de Correr 6 Folhas", category: "janela", subcategory: "correr", num_folhas: 6, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1800, max_width_mm: 6000, min_height_mm: 400, max_height_mm: 2800 },
];

// ============================================
// CLONE TIPOLOGIAS PARA LINHAS COMPATÍVEIS
// ============================================
interface LineClone {
  lineId: string;
  prefix: string;
}

const compatibleLines: LineClone[] = [
  { lineId: "line-mega25", prefix: "mg25" },
  { lineId: "line-hyspex25su", prefix: "hy" },
  { lineId: "line-alumasa25", prefix: "al" },
  { lineId: "line-ds-suprema", prefix: "ds" },
];

function cloneTypologies(source: Typology[], clone: LineClone): Typology[] {
  return source.map(t => ({
    ...t,
    id: t.id.replace("typ-su-", `typ-${clone.prefix}-`),
    product_line_id: clone.lineId,
  }));
}

const clonedTypologies = compatibleLines.flatMap(c => cloneTypologies(supremaTypologies, c));

export const typologies: Typology[] = [
  ...supremaTypologies,
  ...goldTypologies,
  ...clonedTypologies,
];
