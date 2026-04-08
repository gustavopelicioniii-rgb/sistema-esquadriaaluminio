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
// 12 TIPOLOGIAS TOP (40mm) — Fachadas e alto padrão
// ============================================
const topTypologies: Typology[] = [
  // Janelas de Correr
  { id: "typ-tp-jc2f", product_line_id: "line-top", name: "Janela de Correr 2 Folhas", category: "janela", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 800, max_width_mm: 5000, min_height_mm: 500, max_height_mm: 3200 },
  { id: "typ-tp-jc4f", product_line_id: "line-top", name: "Janela de Correr 4 Folhas", category: "janela", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1600, max_width_mm: 8000, min_height_mm: 500, max_height_mm: 3200 },
  // Maxim-Ar
  { id: "typ-tp-jma1", product_line_id: "line-top", name: "Janela Maxim-Ar 1 Folha", category: "maxim_ar", subcategory: "maxim_ar", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 400, max_width_mm: 1800, min_height_mm: 400, max_height_mm: 1600 },
  // Portas de Correr
  { id: "typ-tp-pc2f", product_line_id: "line-top", name: "Porta de Correr 2 Folhas", category: "porta", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1200, max_width_mm: 6000, min_height_mm: 2000, max_height_mm: 3500 },
  { id: "typ-tp-pc4f", product_line_id: "line-top", name: "Porta de Correr 4 Folhas", category: "porta", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 2400, max_width_mm: 8000, min_height_mm: 2000, max_height_mm: 3500 },
  // Portas de Giro
  { id: "typ-tp-pg1f", product_line_id: "line-top", name: "Porta de Giro 1 Folha", category: "porta", subcategory: "giro", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 1400, min_height_mm: 2000, max_height_mm: 3500 },
  { id: "typ-tp-pg2f", product_line_id: "line-top", name: "Porta de Giro 2 Folhas", category: "porta", subcategory: "giro", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 2800, min_height_mm: 2000, max_height_mm: 3500 },
  // Vitrô Fixo (pano de vidro fachada)
  { id: "typ-tp-vfix", product_line_id: "line-top", name: "Vitrô Fixo Fachada", category: "vitro", subcategory: "fixo", num_folhas: 0, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 400, max_width_mm: 4000, min_height_mm: 400, max_height_mm: 4000 },
  // Porta Integrada (Correr + Fixo)
  { id: "typ-tp-pint", product_line_id: "line-top", name: "Porta Integrada (Correr + Fixo)", category: "porta", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, notes: "2 folhas de correr + 1 fixo", min_width_mm: 1800, max_width_mm: 8000, min_height_mm: 2000, max_height_mm: 3500 },
  // Camarão
  { id: "typ-tp-jcam", product_line_id: "line-top", name: "Porta Camarão Fachada", category: "camarao", subcategory: "camarao", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1200, max_width_mm: 6000, min_height_mm: 2000, max_height_mm: 3500 },
  // Pivotante
  { id: "typ-tp-jpiv", product_line_id: "line-top", name: "Janela Pivotante Fachada", category: "pivotante", subcategory: "pivotante", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 500, max_width_mm: 1800, min_height_mm: 500, max_height_mm: 2500 },
  // Giro (Abre e Tomba)
  { id: "typ-tp-jgiro", product_line_id: "line-top", name: "Janela Giro-Tomba Fachada", category: "janela", subcategory: "giro", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 500, max_width_mm: 1600, min_height_mm: 500, max_height_mm: 2400 },
  // Pele de Vidro (Curtain Wall)
  { id: "typ-tp-cw1", product_line_id: "line-top", name: "Pele de Vidro 1 Módulo", category: "fachada", subcategory: "curtain_wall", num_folhas: 0, has_veneziana: false, has_bandeira: false, active: true, notes: "Módulo unitário de fachada curtain wall com montantes e travessas estruturais", min_width_mm: 600, max_width_mm: 2000, min_height_mm: 1000, max_height_mm: 4000 },
  { id: "typ-tp-cw2", product_line_id: "line-top", name: "Pele de Vidro 2 Módulos", category: "fachada", subcategory: "curtain_wall", num_folhas: 0, has_veneziana: false, has_bandeira: false, active: true, notes: "2 módulos lado a lado com montante intermediário", min_width_mm: 1200, max_width_mm: 4000, min_height_mm: 1000, max_height_mm: 4000 },
  { id: "typ-tp-cw3", product_line_id: "line-top", name: "Pele de Vidro 3 Módulos", category: "fachada", subcategory: "curtain_wall", num_folhas: 0, has_veneziana: false, has_bandeira: false, active: true, notes: "3 módulos com 2 montantes intermediários", min_width_mm: 1800, max_width_mm: 6000, min_height_mm: 1000, max_height_mm: 4000 },
  // Muro Cortina (montantes estruturais contínuos piso-a-piso)
  { id: "typ-tp-mc1", product_line_id: "line-top", name: "Muro Cortina 1 Módulo", category: "fachada", subcategory: "muro_cortina", num_folhas: 0, has_veneziana: false, has_bandeira: false, active: true, notes: "Montantes estruturais contínuos piso-a-piso com travessas intercaladas", min_width_mm: 600, max_width_mm: 2000, min_height_mm: 2500, max_height_mm: 6000 },
  { id: "typ-tp-mc2", product_line_id: "line-top", name: "Muro Cortina 2 Módulos", category: "fachada", subcategory: "muro_cortina", num_folhas: 0, has_veneziana: false, has_bandeira: false, active: true, notes: "2 módulos com montante central estrutural", min_width_mm: 1200, max_width_mm: 4000, min_height_mm: 2500, max_height_mm: 6000 },
  { id: "typ-tp-mc2t", product_line_id: "line-top", name: "Muro Cortina 2 Módulos c/ Travessa", category: "fachada", subcategory: "muro_cortina", num_folhas: 0, has_veneziana: false, has_bandeira: false, active: true, notes: "2 módulos com travessa horizontal intermediária dividindo em 2 panos", min_width_mm: 1200, max_width_mm: 4000, min_height_mm: 3000, max_height_mm: 6000 },
];

// ============================================
// 18 TIPOLOGIAS DECAMP LINHA 45 (45mm)
// ============================================
const decampL45Typologies: Typology[] = [
  // Janelas de Correr
  { id: "typ-dc-jc2f", product_line_id: "line-decamp45", name: "Janela de Correr 2 Folhas", category: "janela", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 5000, min_height_mm: 400, max_height_mm: 3000 },
  { id: "typ-dc-jc3f", product_line_id: "line-decamp45", name: "Janela de Correr 3 Folhas", category: "janela", subcategory: "correr", num_folhas: 3, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 900, max_width_mm: 6000, min_height_mm: 400, max_height_mm: 3000 },
  { id: "typ-dc-jc4f", product_line_id: "line-decamp45", name: "Janela de Correr 4 Folhas", category: "janela", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1200, max_width_mm: 6000, min_height_mm: 400, max_height_mm: 3000 },
  { id: "typ-dc-jc6f", product_line_id: "line-decamp45", name: "Janela de Correr 6 Folhas", category: "janela", subcategory: "correr", num_folhas: 6, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1800, max_width_mm: 6000, min_height_mm: 400, max_height_mm: 3000 },
  // Maxim-Ar
  { id: "typ-dc-jma1", product_line_id: "line-decamp45", name: "Janela Maxim-Ar 1 Folha", category: "maxim_ar", subcategory: "maxim_ar", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 300, max_width_mm: 1600, min_height_mm: 300, max_height_mm: 1400 },
  { id: "typ-dc-jma2", product_line_id: "line-decamp45", name: "Janela Maxim-Ar 2 Folhas", category: "maxim_ar", subcategory: "maxim_ar", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 2800, min_height_mm: 300, max_height_mm: 1600 },
  // Camarão
  { id: "typ-dc-jcam", product_line_id: "line-decamp45", name: "Janela Camarão (Sanfonada)", category: "camarao", subcategory: "camarao", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 5500, min_height_mm: 500, max_height_mm: 3000 },
  // Portas de Correr
  { id: "typ-dc-pc2f", product_line_id: "line-decamp45", name: "Porta de Correr 2 Folhas", category: "porta", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 5500, min_height_mm: 1900, max_height_mm: 3200 },
  { id: "typ-dc-pc3f", product_line_id: "line-decamp45", name: "Porta de Correr 3 Folhas", category: "porta", subcategory: "correr", num_folhas: 3, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1500, max_width_mm: 6000, min_height_mm: 1900, max_height_mm: 3200 },
  { id: "typ-dc-pc4f", product_line_id: "line-decamp45", name: "Porta de Correr 4 Folhas", category: "porta", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 2000, max_width_mm: 6000, min_height_mm: 1900, max_height_mm: 3200 },
  // Portas de Giro
  { id: "typ-dc-pg1f", product_line_id: "line-decamp45", name: "Porta de Giro 1 Folha", category: "porta", subcategory: "giro", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 500, max_width_mm: 1300, min_height_mm: 1900, max_height_mm: 3200 },
  { id: "typ-dc-pg2f", product_line_id: "line-decamp45", name: "Porta de Giro 2 Folhas", category: "porta", subcategory: "giro", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 900, max_width_mm: 2600, min_height_mm: 1900, max_height_mm: 3200 },
  // Veneziana
  { id: "typ-dc-jc2fv", product_line_id: "line-decamp45", name: "Janela de Correr 2F c/ Veneziana", category: "veneziana", subcategory: "correr", num_folhas: 2, has_veneziana: true, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 5000, min_height_mm: 500, max_height_mm: 3000 },
  { id: "typ-dc-jc4fv", product_line_id: "line-decamp45", name: "Janela de Correr 4F c/ Veneziana", category: "veneziana", subcategory: "correr", num_folhas: 4, has_veneziana: true, has_bandeira: false, active: true, min_width_mm: 1200, max_width_mm: 6000, min_height_mm: 500, max_height_mm: 3000 },
  // Basculante
  { id: "typ-dc-jbas1", product_line_id: "line-decamp45", name: "Basculante 1 Folha", category: "basculante", subcategory: "basculante", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 300, max_width_mm: 1400, min_height_mm: 300, max_height_mm: 900 },
  // Vitrô Fixo
  { id: "typ-dc-vfix", product_line_id: "line-decamp45", name: "Vitrô Fixo", category: "vitro", subcategory: "fixo", num_folhas: 0, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 300, max_width_mm: 3500, min_height_mm: 300, max_height_mm: 3500 },
  // Pivotante
  { id: "typ-dc-jpiv", product_line_id: "line-decamp45", name: "Janela Pivotante", category: "pivotante", subcategory: "pivotante", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 400, max_width_mm: 1600, min_height_mm: 400, max_height_mm: 2200 },
  // Porta Balcão
  { id: "typ-dc-pbal", product_line_id: "line-decamp45", name: "Porta Balcão 2F (Vidro+Veneziana)", category: "veneziana", subcategory: "correr", num_folhas: 2, has_veneziana: true, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 5000, min_height_mm: 1900, max_height_mm: 3200 },
];

// ============================================
// 8 TIPOLOGIAS DECAMP PRATIC 20 (20mm)
// Linha econômica para janelas pequenas e basculantes
// ============================================
const decampP20Typologies: Typology[] = [
  { id: "typ-p20-jc2f", product_line_id: "line-decamp-pratic20", name: "Janela de Correr 2 Folhas", category: "janela", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 400, max_width_mm: 3000, min_height_mm: 300, max_height_mm: 1800 },
  { id: "typ-p20-jc4f", product_line_id: "line-decamp-pratic20", name: "Janela de Correr 4 Folhas", category: "janela", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 800, max_width_mm: 4000, min_height_mm: 300, max_height_mm: 1800 },
  { id: "typ-p20-jma1", product_line_id: "line-decamp-pratic20", name: "Janela Maxim-Ar 1 Folha", category: "maxim_ar", subcategory: "maxim_ar", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 300, max_width_mm: 1200, min_height_mm: 300, max_height_mm: 1000 },
  { id: "typ-p20-jma2", product_line_id: "line-decamp-pratic20", name: "Janela Maxim-Ar 2 Folhas", category: "maxim_ar", subcategory: "maxim_ar", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 2000, min_height_mm: 300, max_height_mm: 1200 },
  { id: "typ-p20-jbas1", product_line_id: "line-decamp-pratic20", name: "Basculante 1 Folha", category: "basculante", subcategory: "basculante", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 300, max_width_mm: 1000, min_height_mm: 200, max_height_mm: 600 },
  { id: "typ-p20-vfix", product_line_id: "line-decamp-pratic20", name: "Vitrô Fixo", category: "vitro", subcategory: "fixo", num_folhas: 0, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 200, max_width_mm: 2000, min_height_mm: 200, max_height_mm: 2000 },
  { id: "typ-p20-pg1f", product_line_id: "line-decamp-pratic20", name: "Porta de Giro 1 Folha", category: "porta", subcategory: "giro", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 500, max_width_mm: 1000, min_height_mm: 1800, max_height_mm: 2500 },
  { id: "typ-p20-pc2f", product_line_id: "line-decamp-pratic20", name: "Porta de Correr 2 Folhas", category: "porta", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 800, max_width_mm: 3500, min_height_mm: 1800, max_height_mm: 2500 },
];

// ============================================
// 15 TIPOLOGIAS DECAMP PRATIC 32 (32mm)
// Linha robusta para grandes vãos
// ============================================
const decampP32Typologies: Typology[] = [
  { id: "typ-p32-jc2f", product_line_id: "line-decamp-pratic32", name: "Janela de Correr 2 Folhas", category: "janela", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 4500, min_height_mm: 400, max_height_mm: 2800 },
  { id: "typ-p32-jc3f", product_line_id: "line-decamp-pratic32", name: "Janela de Correr 3 Folhas", category: "janela", subcategory: "correr", num_folhas: 3, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 900, max_width_mm: 5500, min_height_mm: 400, max_height_mm: 2800 },
  { id: "typ-p32-jc4f", product_line_id: "line-decamp-pratic32", name: "Janela de Correr 4 Folhas", category: "janela", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1200, max_width_mm: 6000, min_height_mm: 400, max_height_mm: 2800 },
  { id: "typ-p32-jma1", product_line_id: "line-decamp-pratic32", name: "Janela Maxim-Ar 1 Folha", category: "maxim_ar", subcategory: "maxim_ar", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 300, max_width_mm: 1600, min_height_mm: 300, max_height_mm: 1400 },
  { id: "typ-p32-jma2", product_line_id: "line-decamp-pratic32", name: "Janela Maxim-Ar 2 Folhas", category: "maxim_ar", subcategory: "maxim_ar", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 2800, min_height_mm: 300, max_height_mm: 1600 },
  { id: "typ-p32-jcam", product_line_id: "line-decamp-pratic32", name: "Janela Camarão", category: "camarao", subcategory: "camarao", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 5500, min_height_mm: 500, max_height_mm: 2800 },
  { id: "typ-p32-pc2f", product_line_id: "line-decamp-pratic32", name: "Porta de Correr 2 Folhas", category: "porta", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 5500, min_height_mm: 1900, max_height_mm: 3200 },
  { id: "typ-p32-pc3f", product_line_id: "line-decamp-pratic32", name: "Porta de Correr 3 Folhas", category: "porta", subcategory: "correr", num_folhas: 3, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1500, max_width_mm: 6000, min_height_mm: 1900, max_height_mm: 3200 },
  { id: "typ-p32-pc4f", product_line_id: "line-decamp-pratic32", name: "Porta de Correr 4 Folhas", category: "porta", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 2000, max_width_mm: 6000, min_height_mm: 1900, max_height_mm: 3200 },
  { id: "typ-p32-pg1f", product_line_id: "line-decamp-pratic32", name: "Porta de Giro 1 Folha", category: "porta", subcategory: "giro", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 500, max_width_mm: 1300, min_height_mm: 1900, max_height_mm: 3200 },
  { id: "typ-p32-pg2f", product_line_id: "line-decamp-pratic32", name: "Porta de Giro 2 Folhas", category: "porta", subcategory: "giro", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 900, max_width_mm: 2600, min_height_mm: 1900, max_height_mm: 3200 },
  { id: "typ-p32-jc2fv", product_line_id: "line-decamp-pratic32", name: "Janela de Correr 2F c/ Veneziana", category: "veneziana", subcategory: "correr", num_folhas: 2, has_veneziana: true, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 4500, min_height_mm: 500, max_height_mm: 2800 },
  { id: "typ-p32-jbas1", product_line_id: "line-decamp-pratic32", name: "Basculante 1 Folha", category: "basculante", subcategory: "basculante", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 300, max_width_mm: 1400, min_height_mm: 300, max_height_mm: 900 },
  { id: "typ-p32-vfix", product_line_id: "line-decamp-pratic32", name: "Vitrô Fixo", category: "vitro", subcategory: "fixo", num_folhas: 0, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 300, max_width_mm: 3500, min_height_mm: 300, max_height_mm: 3500 },
  { id: "typ-p32-jpiv", product_line_id: "line-decamp-pratic32", name: "Janela Pivotante", category: "pivotante", subcategory: "pivotante", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 400, max_width_mm: 1600, min_height_mm: 400, max_height_mm: 2200 },
];

// ============================================
// 9 TIPOLOGIAS CENTENÁRIO PERFETTA 45
// ============================================
const perfettaTypologies: Typology[] = [
  // Janelas de Correr
  { id: "typ-cpf-jc2f", product_line_id: "line-cent-perfetta", name: "Janela de Correr 2 Folhas", category: "janela", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 4500, min_height_mm: 400, max_height_mm: 2800 },
  { id: "typ-cpf-jc4f", product_line_id: "line-cent-perfetta", name: "Janela de Correr 4 Folhas", category: "janela", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1200, max_width_mm: 6000, min_height_mm: 400, max_height_mm: 2800 },
  // Portas de Correr
  { id: "typ-cpf-pc2f", product_line_id: "line-cent-perfetta", name: "Porta de Correr 2 Folhas", category: "porta", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 5500, min_height_mm: 1900, max_height_mm: 3200 },
  { id: "typ-cpf-pc4f", product_line_id: "line-cent-perfetta", name: "Porta de Correr 4 Folhas", category: "porta", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 2000, max_width_mm: 6000, min_height_mm: 1900, max_height_mm: 3200 },
  // Maxim-Ar
  { id: "typ-cpf-jma1", product_line_id: "line-cent-perfetta", name: "Janela Maxim-Ar 1 Folha", category: "maxim_ar", subcategory: "maxim_ar", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 300, max_width_mm: 1600, min_height_mm: 300, max_height_mm: 1400 },
  { id: "typ-cpf-jma2", product_line_id: "line-cent-perfetta", name: "Janela Maxim-Ar 2 Folhas", category: "maxim_ar", subcategory: "maxim_ar", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 2800, min_height_mm: 300, max_height_mm: 1600 },
  // Porta de Giro
  { id: "typ-cpf-pg1f", product_line_id: "line-cent-perfetta", name: "Porta de Giro 1 Folha", category: "porta", subcategory: "giro", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 500, max_width_mm: 1300, min_height_mm: 1900, max_height_mm: 3200 },
  { id: "typ-cpf-pg2f", product_line_id: "line-cent-perfetta", name: "Porta de Giro 2 Folhas", category: "porta", subcategory: "giro", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 900, max_width_mm: 2600, min_height_mm: 1900, max_height_mm: 3200 },
  // Camarão
  { id: "typ-cpf-jcam", product_line_id: "line-cent-perfetta", name: "Janela Camarão (Sanfonada)", category: "camarao", subcategory: "camarao", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 5500, min_height_mm: 500, max_height_mm: 2800 },
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

// Linhas 40mm → clonam tipologias Top
const compatible40Lines: LineClone[] = [
  { lineId: "line-hydro40", prefix: "h40" },
  { lineId: "line-mega40", prefix: "m40" },
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
const cloned40Typologies = compatible40Lines.flatMap(c => cloneTypologies(topTypologies, c, "tp"));

export const typologies: Typology[] = [
  ...supremaTypologies,
  ...goldTypologies,
  ...topTypologies,
  ...decampL45Typologies,
  ...decampP20Typologies,
  ...decampP32Typologies,
  ...perfettaTypologies,
  ...cloned25Typologies,
  ...cloned32Typologies,
  ...cloned40Typologies,
];
