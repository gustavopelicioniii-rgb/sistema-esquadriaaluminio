import type { GlassRule, TypologyComponent } from "@/types/calculation";

// ============================================
// GLASS RULES - SUPREMA
// ============================================
const supremaGlassRules: GlassRule[] = [
  { id: "gr-su-jc2f", typology_id: "typ-su-jc2f", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -86, height_reference: "H", height_constant_mm: -139, quantity: 2, glass_type: "comum", min_thickness_mm: 4, max_thickness_mm: 6 },
  { id: "gr-su-jc4f", typology_id: "typ-su-jc4f", glass_name: "Vidro Folha", width_reference: "L/4", width_constant_mm: -86, height_reference: "H", height_constant_mm: -139, quantity: 4, glass_type: "comum", min_thickness_mm: 4 },
  { id: "gr-su-jc3f", typology_id: "typ-su-jc3f", glass_name: "Vidro Folha", width_reference: "L/3", width_constant_mm: -86, height_reference: "H", height_constant_mm: -139, quantity: 3 },
  { id: "gr-su-jc4fp-f", typology_id: "typ-su-jc4fp", glass_name: "Vidro Folha", width_reference: "L/4", width_constant_mm: -86, height_reference: "H", height_constant_mm: -212, quantity: 4 },
  { id: "gr-su-jc4fp-p", typology_id: "typ-su-jc4fp", glass_name: "Vidro Peitoril", width_reference: "L/2", width_constant_mm: -86, height_reference: "H", height_constant_mm: -200, quantity: 2, glass_type: "comum" },
  { id: "gr-su-jma1", typology_id: "typ-su-jma1", glass_name: "Vidro Folha", width_reference: "L", width_constant_mm: -151, height_reference: "H", height_constant_mm: -145, quantity: 1, glass_type: "temperado", min_thickness_mm: 4, max_thickness_mm: 8 },
  { id: "gr-su-jma2", typology_id: "typ-su-jma2", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -151, height_reference: "H", height_constant_mm: -145, quantity: 2, glass_type: "temperado" },
  { id: "gr-su-jcam", typology_id: "typ-su-jcam", glass_name: "Vidro Folha", width_reference: "L/4", width_constant_mm: -86, height_reference: "H", height_constant_mm: -139, quantity: 4 },
  { id: "gr-su-pc2f", typology_id: "typ-su-pc2f", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -86, height_reference: "H", height_constant_mm: -120, quantity: 2, glass_type: "temperado", min_thickness_mm: 6, max_thickness_mm: 10 },
  { id: "gr-su-pc4f", typology_id: "typ-su-pc4f", glass_name: "Vidro Folha", width_reference: "L/4", width_constant_mm: -86, height_reference: "H", height_constant_mm: -120, quantity: 4, glass_type: "temperado" },
  { id: "gr-su-pg1f", typology_id: "typ-su-pg1f", glass_name: "Vidro Folha", width_reference: "L", width_constant_mm: -125, height_reference: "H", height_constant_mm: -120, quantity: 1, glass_type: "temperado", min_thickness_mm: 6, max_thickness_mm: 10 },
  { id: "gr-su-pg2f", typology_id: "typ-su-pg2f", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -125, height_reference: "H", height_constant_mm: -120, quantity: 2, glass_type: "temperado" },
  { id: "gr-su-jc2fv", typology_id: "typ-su-jc2fv", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -86, height_reference: "H", height_constant_mm: -139, quantity: 2, glass_type: "comum" },
  { id: "gr-su-jc2fb", typology_id: "typ-su-jc2fb", glass_name: "Vidro Folha Correr", width_reference: "L/2", width_constant_mm: -86, height_reference: "H", height_constant_mm: -212, quantity: 2 },
  { id: "gr-su-jc6f", typology_id: "typ-su-jc6f", glass_name: "Vidro Folha", width_reference: "L/6", width_constant_mm: -86, height_reference: "H", height_constant_mm: -139, quantity: 6 },
  { id: "gr-su-pc3f", typology_id: "typ-su-pc3f", glass_name: "Vidro Folha", width_reference: "L/3", width_constant_mm: -86, height_reference: "H", height_constant_mm: -120, quantity: 3, glass_type: "temperado" },
];

// ============================================
// GLASS RULES - GOLD
// ============================================
const goldGlassRules: GlassRule[] = [
  { id: "gr-go-jc2f", typology_id: "typ-go-jc2f", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -97, height_reference: "H", height_constant_mm: -155, quantity: 2, glass_type: "comum", min_thickness_mm: 4, max_thickness_mm: 8 },
  { id: "gr-go-jc4f", typology_id: "typ-go-jc4f", glass_name: "Vidro Folha", width_reference: "L/4", width_constant_mm: -97, height_reference: "H", height_constant_mm: -155, quantity: 4 },
  { id: "gr-go-jc3f", typology_id: "typ-go-jc3f", glass_name: "Vidro Folha", width_reference: "L/3", width_constant_mm: -97, height_reference: "H", height_constant_mm: -155, quantity: 3 },
  { id: "gr-go-jma1", typology_id: "typ-go-jma1", glass_name: "Vidro Folha", width_reference: "L", width_constant_mm: -170, height_reference: "H", height_constant_mm: -160, quantity: 1, glass_type: "temperado" },
  { id: "gr-go-jma2", typology_id: "typ-go-jma2", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -170, height_reference: "H", height_constant_mm: -160, quantity: 2, glass_type: "temperado" },
  { id: "gr-go-pc2f", typology_id: "typ-go-pc2f", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -97, height_reference: "H", height_constant_mm: -135, quantity: 2, glass_type: "temperado", min_thickness_mm: 6, max_thickness_mm: 10 },
  { id: "gr-go-pc4f", typology_id: "typ-go-pc4f", glass_name: "Vidro Folha", width_reference: "L/4", width_constant_mm: -97, height_reference: "H", height_constant_mm: -135, quantity: 4, glass_type: "temperado" },
  { id: "gr-go-pg1f", typology_id: "typ-go-pg1f", glass_name: "Vidro Folha", width_reference: "L", width_constant_mm: -140, height_reference: "H", height_constant_mm: -135, quantity: 1, glass_type: "temperado", min_thickness_mm: 6 },
  { id: "gr-go-pg2f", typology_id: "typ-go-pg2f", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -140, height_reference: "H", height_constant_mm: -135, quantity: 2, glass_type: "temperado" },
  { id: "gr-go-jc4fp", typology_id: "typ-go-jc4fp", glass_name: "Vidro Folha", width_reference: "L/4", width_constant_mm: -97, height_reference: "H", height_constant_mm: -230, quantity: 4 },
  { id: "gr-go-jcam", typology_id: "typ-go-jcam", glass_name: "Vidro Folha", width_reference: "L/4", width_constant_mm: -97, height_reference: "H", height_constant_mm: -155, quantity: 4 },
  { id: "gr-go-jc2fv", typology_id: "typ-go-jc2fv", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -97, height_reference: "H", height_constant_mm: -155, quantity: 2, glass_type: "comum" },
  { id: "gr-go-jgiro", typology_id: "typ-go-jgiro", glass_name: "Vidro Folha", width_reference: "L", width_constant_mm: -170, height_reference: "H", height_constant_mm: -160, quantity: 1, glass_type: "temperado" },
  { id: "gr-go-pint-f", typology_id: "typ-go-pint", glass_name: "Vidro Folha Correr", width_reference: "L/3", width_constant_mm: -97, height_reference: "H", height_constant_mm: -135, quantity: 2, glass_type: "temperado" },
  { id: "gr-go-pint-x", typology_id: "typ-go-pint", glass_name: "Vidro Fixo", width_reference: "L/3", width_constant_mm: -97, height_reference: "H", height_constant_mm: -80, quantity: 1, glass_type: "temperado" },
  { id: "gr-go-jc6f", typology_id: "typ-go-jc6f", glass_name: "Vidro Folha", width_reference: "L/6", width_constant_mm: -97, height_reference: "H", height_constant_mm: -155, quantity: 6 },
];

// ============================================
// GLASS RULES - TOP (40mm)
// ============================================
const topGlassRules: GlassRule[] = [
  { id: "gr-tp-jc2f", typology_id: "typ-tp-jc2f", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -115, height_reference: "H", height_constant_mm: -185, quantity: 2, glass_type: "temperado", min_thickness_mm: 6, max_thickness_mm: 10 },
  { id: "gr-tp-jc4f", typology_id: "typ-tp-jc4f", glass_name: "Vidro Folha", width_reference: "L/4", width_constant_mm: -115, height_reference: "H", height_constant_mm: -185, quantity: 4, glass_type: "temperado" },
  { id: "gr-tp-jma1", typology_id: "typ-tp-jma1", glass_name: "Vidro Folha", width_reference: "L", width_constant_mm: -200, height_reference: "H", height_constant_mm: -190, quantity: 1, glass_type: "temperado", min_thickness_mm: 6, max_thickness_mm: 10 },
  { id: "gr-tp-pc2f", typology_id: "typ-tp-pc2f", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -115, height_reference: "H", height_constant_mm: -160, quantity: 2, glass_type: "temperado", min_thickness_mm: 8, max_thickness_mm: 12 },
  { id: "gr-tp-pc4f", typology_id: "typ-tp-pc4f", glass_name: "Vidro Folha", width_reference: "L/4", width_constant_mm: -115, height_reference: "H", height_constant_mm: -160, quantity: 4, glass_type: "temperado" },
  { id: "gr-tp-pg1f", typology_id: "typ-tp-pg1f", glass_name: "Vidro Folha", width_reference: "L", width_constant_mm: -168, height_reference: "H", height_constant_mm: -160, quantity: 1, glass_type: "temperado", min_thickness_mm: 8, max_thickness_mm: 12 },
  { id: "gr-tp-pg2f", typology_id: "typ-tp-pg2f", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -168, height_reference: "H", height_constant_mm: -160, quantity: 2, glass_type: "temperado" },
  { id: "gr-tp-vfix", typology_id: "typ-tp-vfix", glass_name: "Vidro Fixo", width_reference: "L", width_constant_mm: -95, height_reference: "H", height_constant_mm: -95, quantity: 1, glass_type: "temperado", min_thickness_mm: 8, max_thickness_mm: 12 },
  { id: "gr-tp-pint-f", typology_id: "typ-tp-pint", glass_name: "Vidro Folha Correr", width_reference: "L/3", width_constant_mm: -115, height_reference: "H", height_constant_mm: -160, quantity: 2, glass_type: "temperado" },
  { id: "gr-tp-pint-x", typology_id: "typ-tp-pint", glass_name: "Vidro Fixo", width_reference: "L/3", width_constant_mm: -115, height_reference: "H", height_constant_mm: -95, quantity: 1, glass_type: "temperado" },
  { id: "gr-tp-jcam", typology_id: "typ-tp-jcam", glass_name: "Vidro Folha", width_reference: "L/4", width_constant_mm: -115, height_reference: "H", height_constant_mm: -185, quantity: 4, glass_type: "temperado" },
  { id: "gr-tp-jpiv", typology_id: "typ-tp-jpiv", glass_name: "Vidro Folha", width_reference: "L", width_constant_mm: -200, height_reference: "H", height_constant_mm: -190, quantity: 1, glass_type: "temperado" },
  { id: "gr-tp-jgiro", typology_id: "typ-tp-jgiro", glass_name: "Vidro Folha", width_reference: "L", width_constant_mm: -200, height_reference: "H", height_constant_mm: -190, quantity: 1, glass_type: "temperado" },
  // Pele de Vidro (Curtain Wall)
  { id: "gr-tp-cw1", typology_id: "typ-tp-cw1", glass_name: "Vidro Módulo", width_reference: "L", width_constant_mm: -50, height_reference: "H", height_constant_mm: -30, quantity: 1, glass_type: "laminado", min_thickness_mm: 8, max_thickness_mm: 12 },
  { id: "gr-tp-cw2", typology_id: "typ-tp-cw2", glass_name: "Vidro Módulo", width_reference: "L/2", width_constant_mm: -50, height_reference: "H", height_constant_mm: -30, quantity: 2, glass_type: "laminado", min_thickness_mm: 8, max_thickness_mm: 12 },
  { id: "gr-tp-cw3", typology_id: "typ-tp-cw3", glass_name: "Vidro Módulo", width_reference: "L/3", width_constant_mm: -50, height_reference: "H", height_constant_mm: -30, quantity: 3, glass_type: "laminado", min_thickness_mm: 8, max_thickness_mm: 12 },
  // Muro Cortina
  { id: "gr-tp-mc1", typology_id: "typ-tp-mc1", glass_name: "Vidro Pano", width_reference: "L", width_constant_mm: -40, height_reference: "H", height_constant_mm: -20, quantity: 1, glass_type: "laminado", min_thickness_mm: 10, max_thickness_mm: 12 },
  { id: "gr-tp-mc2", typology_id: "typ-tp-mc2", glass_name: "Vidro Pano", width_reference: "L/2", width_constant_mm: -40, height_reference: "H", height_constant_mm: -20, quantity: 2, glass_type: "laminado", min_thickness_mm: 10, max_thickness_mm: 12 },
  { id: "gr-tp-mc2t-s", typology_id: "typ-tp-mc2t", glass_name: "Vidro Pano Superior", width_reference: "L/2", width_constant_mm: -40, height_reference: "H/2", height_constant_mm: -20, quantity: 2, glass_type: "laminado", min_thickness_mm: 10, max_thickness_mm: 12 },
  { id: "gr-tp-mc2t-i", typology_id: "typ-tp-mc2t", glass_name: "Vidro Pano Inferior", width_reference: "L/2", width_constant_mm: -40, height_reference: "H/2", height_constant_mm: -20, quantity: 2, glass_type: "laminado", min_thickness_mm: 10, max_thickness_mm: 12 },
];



// ============================================
// GLASS RULES - DECAMP LINHA 45
// ============================================
const decampL45GlassRules: GlassRule[] = [
  { id: "gr-dc-jc2f", typology_id: "typ-dc-jc2f", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -97, height_reference: "H", height_constant_mm: -152, quantity: 2, glass_type: "comum", min_thickness_mm: 4, max_thickness_mm: 8 },
  { id: "gr-dc-jc3f", typology_id: "typ-dc-jc3f", glass_name: "Vidro Folha", width_reference: "L/3", width_constant_mm: -97, height_reference: "H", height_constant_mm: -152, quantity: 3 },
  { id: "gr-dc-jc4f", typology_id: "typ-dc-jc4f", glass_name: "Vidro Folha", width_reference: "L/4", width_constant_mm: -97, height_reference: "H", height_constant_mm: -152, quantity: 4 },
  { id: "gr-dc-jc6f", typology_id: "typ-dc-jc6f", glass_name: "Vidro Folha", width_reference: "L/6", width_constant_mm: -97, height_reference: "H", height_constant_mm: -152, quantity: 6 },
  { id: "gr-dc-jma1", typology_id: "typ-dc-jma1", glass_name: "Vidro Folha", width_reference: "L", width_constant_mm: -167, height_reference: "H", height_constant_mm: -160, quantity: 1, glass_type: "temperado", min_thickness_mm: 4, max_thickness_mm: 8 },
  { id: "gr-dc-jma2", typology_id: "typ-dc-jma2", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -167, height_reference: "H", height_constant_mm: -160, quantity: 2, glass_type: "temperado" },
  { id: "gr-dc-jcam", typology_id: "typ-dc-jcam", glass_name: "Vidro Folha", width_reference: "L/4", width_constant_mm: -97, height_reference: "H", height_constant_mm: -152, quantity: 4 },
  { id: "gr-dc-pc2f", typology_id: "typ-dc-pc2f", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -97, height_reference: "H", height_constant_mm: -132, quantity: 2, glass_type: "temperado", min_thickness_mm: 6, max_thickness_mm: 10 },
  { id: "gr-dc-pc3f", typology_id: "typ-dc-pc3f", glass_name: "Vidro Folha", width_reference: "L/3", width_constant_mm: -97, height_reference: "H", height_constant_mm: -132, quantity: 3, glass_type: "temperado" },
  { id: "gr-dc-pc4f", typology_id: "typ-dc-pc4f", glass_name: "Vidro Folha", width_reference: "L/4", width_constant_mm: -97, height_reference: "H", height_constant_mm: -132, quantity: 4, glass_type: "temperado" },
  { id: "gr-dc-pg1f", typology_id: "typ-dc-pg1f", glass_name: "Vidro Folha", width_reference: "L", width_constant_mm: -138, height_reference: "H", height_constant_mm: -132, quantity: 1, glass_type: "temperado", min_thickness_mm: 6, max_thickness_mm: 10 },
  { id: "gr-dc-pg2f", typology_id: "typ-dc-pg2f", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -138, height_reference: "H", height_constant_mm: -132, quantity: 2, glass_type: "temperado" },
  { id: "gr-dc-jc2fv", typology_id: "typ-dc-jc2fv", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -97, height_reference: "H", height_constant_mm: -152, quantity: 2, glass_type: "comum" },
  { id: "gr-dc-jc4fv", typology_id: "typ-dc-jc4fv", glass_name: "Vidro Folha", width_reference: "L/4", width_constant_mm: -97, height_reference: "H", height_constant_mm: -152, quantity: 4, glass_type: "comum" },
  { id: "gr-dc-jbas1", typology_id: "typ-dc-jbas1", glass_name: "Vidro Folha", width_reference: "L", width_constant_mm: -167, height_reference: "H", height_constant_mm: -152, quantity: 1, glass_type: "comum" },
  { id: "gr-dc-vfix", typology_id: "typ-dc-vfix", glass_name: "Vidro Fixo", width_reference: "L", width_constant_mm: -20, height_reference: "H", height_constant_mm: -77, quantity: 1, glass_type: "comum", min_thickness_mm: 4, max_thickness_mm: 10 },
  { id: "gr-dc-jpiv", typology_id: "typ-dc-jpiv", glass_name: "Vidro Folha", width_reference: "L", width_constant_mm: -167, height_reference: "H", height_constant_mm: -160, quantity: 1, glass_type: "temperado" },
  { id: "gr-dc-pbal", typology_id: "typ-dc-pbal", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -97, height_reference: "H", height_constant_mm: -132, quantity: 2, glass_type: "temperado" },
];

// ============================================
// GLASS RULES - DECAMP PRATIC 20 (20mm)
// ============================================
const pratic20GlassRules: GlassRule[] = [
  { id: "gr-p20-jc2f", typology_id: "typ-p20-jc2f", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -65, height_reference: "H", height_constant_mm: -105, quantity: 2, glass_type: "comum", min_thickness_mm: 3, max_thickness_mm: 5 },
  { id: "gr-p20-jc4f", typology_id: "typ-p20-jc4f", glass_name: "Vidro Folha", width_reference: "L/4", width_constant_mm: -65, height_reference: "H", height_constant_mm: -105, quantity: 4 },
  { id: "gr-p20-jma1", typology_id: "typ-p20-jma1", glass_name: "Vidro Folha", width_reference: "L", width_constant_mm: -115, height_reference: "H", height_constant_mm: -110, quantity: 1, glass_type: "temperado", min_thickness_mm: 3, max_thickness_mm: 5 },
  { id: "gr-p20-jma2", typology_id: "typ-p20-jma2", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -115, height_reference: "H", height_constant_mm: -110, quantity: 2, glass_type: "temperado" },
  { id: "gr-p20-jbas1", typology_id: "typ-p20-jbas1", glass_name: "Vidro Folha", width_reference: "L", width_constant_mm: -115, height_reference: "H", height_constant_mm: -105, quantity: 1, glass_type: "comum" },
  { id: "gr-p20-vfix", typology_id: "typ-p20-vfix", glass_name: "Vidro Fixo", width_reference: "L", width_constant_mm: -50, height_reference: "H", height_constant_mm: -50, quantity: 1, glass_type: "comum", min_thickness_mm: 3, max_thickness_mm: 6 },
  { id: "gr-p20-pg1f", typology_id: "typ-p20-pg1f", glass_name: "Vidro Folha", width_reference: "L", width_constant_mm: -90, height_reference: "H", height_constant_mm: -85, quantity: 1, glass_type: "temperado", min_thickness_mm: 4, max_thickness_mm: 6 },
  { id: "gr-p20-pc2f", typology_id: "typ-p20-pc2f", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -65, height_reference: "H", height_constant_mm: -88, quantity: 2, glass_type: "temperado", min_thickness_mm: 4, max_thickness_mm: 6 },
];

// ============================================
// GLASS RULES - DECAMP PRATIC 32 (32mm)
// ============================================
const pratic32GlassRules: GlassRule[] = [
  { id: "gr-p32-jc2f", typology_id: "typ-p32-jc2f", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -97, height_reference: "H", height_constant_mm: -152, quantity: 2, glass_type: "comum", min_thickness_mm: 4, max_thickness_mm: 8 },
  { id: "gr-p32-jc3f", typology_id: "typ-p32-jc3f", glass_name: "Vidro Folha", width_reference: "L/3", width_constant_mm: -97, height_reference: "H", height_constant_mm: -152, quantity: 3 },
  { id: "gr-p32-jc4f", typology_id: "typ-p32-jc4f", glass_name: "Vidro Folha", width_reference: "L/4", width_constant_mm: -97, height_reference: "H", height_constant_mm: -152, quantity: 4 },
  { id: "gr-p32-jma1", typology_id: "typ-p32-jma1", glass_name: "Vidro Folha", width_reference: "L", width_constant_mm: -167, height_reference: "H", height_constant_mm: -160, quantity: 1, glass_type: "temperado", min_thickness_mm: 4, max_thickness_mm: 8 },
  { id: "gr-p32-jma2", typology_id: "typ-p32-jma2", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -167, height_reference: "H", height_constant_mm: -160, quantity: 2, glass_type: "temperado" },
  { id: "gr-p32-jcam", typology_id: "typ-p32-jcam", glass_name: "Vidro Folha", width_reference: "L/4", width_constant_mm: -97, height_reference: "H", height_constant_mm: -152, quantity: 4 },
  { id: "gr-p32-pc2f", typology_id: "typ-p32-pc2f", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -97, height_reference: "H", height_constant_mm: -132, quantity: 2, glass_type: "temperado", min_thickness_mm: 6, max_thickness_mm: 10 },
  { id: "gr-p32-pc3f", typology_id: "typ-p32-pc3f", glass_name: "Vidro Folha", width_reference: "L/3", width_constant_mm: -97, height_reference: "H", height_constant_mm: -132, quantity: 3, glass_type: "temperado" },
  { id: "gr-p32-pc4f", typology_id: "typ-p32-pc4f", glass_name: "Vidro Folha", width_reference: "L/4", width_constant_mm: -97, height_reference: "H", height_constant_mm: -132, quantity: 4, glass_type: "temperado" },
  { id: "gr-p32-pg1f", typology_id: "typ-p32-pg1f", glass_name: "Vidro Folha", width_reference: "L", width_constant_mm: -138, height_reference: "H", height_constant_mm: -132, quantity: 1, glass_type: "temperado", min_thickness_mm: 6, max_thickness_mm: 10 },
  { id: "gr-p32-pg2f", typology_id: "typ-p32-pg2f", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -138, height_reference: "H", height_constant_mm: -132, quantity: 2, glass_type: "temperado" },
  { id: "gr-p32-jc2fv", typology_id: "typ-p32-jc2fv", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -97, height_reference: "H", height_constant_mm: -152, quantity: 2, glass_type: "comum" },
  { id: "gr-p32-jbas1", typology_id: "typ-p32-jbas1", glass_name: "Vidro Folha", width_reference: "L", width_constant_mm: -167, height_reference: "H", height_constant_mm: -152, quantity: 1, glass_type: "comum" },
  { id: "gr-p32-vfix", typology_id: "typ-p32-vfix", glass_name: "Vidro Fixo", width_reference: "L", width_constant_mm: -78, height_reference: "H", height_constant_mm: -78, quantity: 1, glass_type: "comum", min_thickness_mm: 4, max_thickness_mm: 10 },
  { id: "gr-p32-jpiv", typology_id: "typ-p32-jpiv", glass_name: "Vidro Folha", width_reference: "L", width_constant_mm: -167, height_reference: "H", height_constant_mm: -160, quantity: 1, glass_type: "temperado" },
];

// glassRules exported at end of file after perfetta rules

// ============================================
// COMPONENTS - SUPREMA
// ============================================
const supremaComponents: TypologyComponent[] = [
  // Janela 2F Correr
  { id: "tc-su-jc2f-01", typology_id: "typ-su-jc2f", component_name: "Roldana c/ regulagem", component_code: "ROL-426", component_type: "roldana", quantity_formula: "4", unit: "un" },
  { id: "tc-su-jc2f-02", typology_id: "typ-su-jc2f", component_name: "Guia deslizante", component_code: "NYL-332", component_type: "guia", quantity_formula: "4", unit: "un" },
  { id: "tc-su-jc2f-03", typology_id: "typ-su-jc2f", component_name: "Fecho concha s/ chave", component_code: "FEC-636", component_type: "fecho", quantity_formula: "1", unit: "un" },
  { id: "tc-su-jc2f-04", typology_id: "typ-su-jc2f", component_name: "Concha simples", component_code: "CON-280", component_type: "concha", quantity_formula: "1", unit: "un" },
  { id: "tc-su-jc2f-05", typology_id: "typ-su-jc2f", component_name: "Vedador de vento", component_code: "NYL-335", component_type: "vedador", quantity_formula: "4", unit: "un" },

  // Janela 4F
  { id: "tc-su-jc4f-01", typology_id: "typ-su-jc4f", component_name: "Roldana c/ regulagem", component_code: "ROL-426", component_type: "roldana", quantity_formula: "8", unit: "un" },
  { id: "tc-su-jc4f-02", typology_id: "typ-su-jc4f", component_name: "Fecho concha s/ chave", component_code: "FEC-636", component_type: "fecho", quantity_formula: "2", unit: "un" },

  // Janela 3F
  { id: "tc-su-jc3f-01", typology_id: "typ-su-jc3f", component_name: "Roldana c/ regulagem", component_code: "ROL-426", component_type: "roldana", quantity_formula: "6", unit: "un" },
  { id: "tc-su-jc3f-02", typology_id: "typ-su-jc3f", component_name: "Fecho concha s/ chave", component_code: "FEC-636", component_type: "fecho", quantity_formula: "1", unit: "un" },

  // Maxim-Ar 1F
  { id: "tc-su-jma1-01", typology_id: "typ-su-jma1", component_name: "Braço maxim-ar", component_code: "BRA-702/703/705", component_type: "braço", quantity_formula: "2", unit: "un" },
  { id: "tc-su-jma1-02", typology_id: "typ-su-jma1", component_name: "Fecho esquerdo maxim", component_code: "FEC-009", component_type: "fecho", quantity_formula: "1", unit: "un" },
  { id: "tc-su-jma1-03", typology_id: "typ-su-jma1", component_name: "Haste de comando", component_code: "FEC-011", component_type: "haste", quantity_formula: "1", unit: "un" },

  // Maxim-Ar 2F
  { id: "tc-su-jma2-01", typology_id: "typ-su-jma2", component_name: "Braço maxim-ar", component_code: "BRA-702/703/705", component_type: "braço", quantity_formula: "4", unit: "un" },
  { id: "tc-su-jma2-02", typology_id: "typ-su-jma2", component_name: "Fecho esquerdo maxim", component_code: "FEC-009", component_type: "fecho", quantity_formula: "2", unit: "un" },

  // Porta Correr 2F
  { id: "tc-su-pc2f-01", typology_id: "typ-su-pc2f", component_name: "Roldana Porta SU", component_type: "roldana", quantity_formula: "4", unit: "un" },
  { id: "tc-su-pc2f-02", typology_id: "typ-su-pc2f", component_name: "Trinco Concha Porta", component_type: "fecho", quantity_formula: "1", unit: "un" },
  { id: "tc-su-pc2f-03", typology_id: "typ-su-pc2f", component_name: "Puxador Concha", component_type: "puxador", quantity_formula: "2", unit: "un" },

  // Porta Correr 4F
  { id: "tc-su-pc4f-01", typology_id: "typ-su-pc4f", component_name: "Roldana Porta SU", component_type: "roldana", quantity_formula: "8", unit: "un" },
  { id: "tc-su-pc4f-02", typology_id: "typ-su-pc4f", component_name: "Trinco Concha Porta", component_type: "fecho", quantity_formula: "2", unit: "un" },
  { id: "tc-su-pc4f-03", typology_id: "typ-su-pc4f", component_name: "Puxador Concha", component_type: "puxador", quantity_formula: "4", unit: "un" },

  // Porta Giro 1F
  { id: "tc-su-pg1f-01", typology_id: "typ-su-pg1f", component_name: "Dobradiça", component_code: "DOB-837", component_type: "dobradica", quantity_formula: "3", unit: "un" },
  { id: "tc-su-pg1f-02", typology_id: "typ-su-pg1f", component_name: "Maçaneta c/ espelho", component_code: "MAC-927", component_type: "macaneta", quantity_formula: "1", unit: "un" },
  { id: "tc-su-pg1f-03", typology_id: "typ-su-pg1f", component_name: "Contratesta", component_code: "CON-295", component_type: "contrafecho", quantity_formula: "1", unit: "un" },

  // Porta Giro 2F
  { id: "tc-su-pg2f-01", typology_id: "typ-su-pg2f", component_name: "Dobradiça", component_code: "DOB-837", component_type: "dobradica", quantity_formula: "6", unit: "un" },
  { id: "tc-su-pg2f-02", typology_id: "typ-su-pg2f", component_name: "Maçaneta c/ espelho", component_code: "MAC-927", component_type: "macaneta", quantity_formula: "2", unit: "un" },

  // Camarão
  { id: "tc-su-jcam-01", typology_id: "typ-su-jcam", component_name: "Dobradiça Camarão", component_type: "dobradica", quantity_formula: "8", unit: "un" },
  { id: "tc-su-jcam-02", typology_id: "typ-su-jcam", component_name: "Carrinho Camarão", component_type: "roldana", quantity_formula: "4", unit: "un" },

  // Janela 6F
  { id: "tc-su-jc6f-01", typology_id: "typ-su-jc6f", component_name: "Roldana c/ regulagem", component_type: "roldana", quantity_formula: "12", unit: "un" },
  { id: "tc-su-jc6f-02", typology_id: "typ-su-jc6f", component_name: "Fecho concha", component_type: "fecho", quantity_formula: "2", unit: "un" },

  // Porta 3F
  { id: "tc-su-pc3f-01", typology_id: "typ-su-pc3f", component_name: "Roldana Porta SU", component_type: "roldana", quantity_formula: "6", unit: "un" },
  { id: "tc-su-pc3f-02", typology_id: "typ-su-pc3f", component_name: "Trinco Concha", component_type: "fecho", quantity_formula: "1", unit: "un" },

  // Veneziana 2F
  { id: "tc-su-jc2fv-01", typology_id: "typ-su-jc2fv", component_name: "Roldana c/ regulagem", component_type: "roldana", quantity_formula: "8", unit: "un" },
  { id: "tc-su-jc2fv-02", typology_id: "typ-su-jc2fv", component_name: "Fecho concha", component_type: "fecho", quantity_formula: "1", unit: "un" },
];

// ============================================
// COMPONENTS - GOLD
// ============================================
const goldComponents: TypologyComponent[] = [
  // Janela 2F Correr Gold
  { id: "tc-go-jc2f-01", typology_id: "typ-go-jc2f", component_name: "Roldana c/ regulagem", component_code: "ROL-426", component_type: "roldana", quantity_formula: "4", unit: "un" },
  { id: "tc-go-jc2f-02", typology_id: "typ-go-jc2f", component_name: "Guia deslizante", component_code: "NYL-332", component_type: "guia", quantity_formula: "4", unit: "un" },
  { id: "tc-go-jc2f-03", typology_id: "typ-go-jc2f", component_name: "Fecho concha s/ chave", component_code: "FEC-636", component_type: "fecho", quantity_formula: "1", unit: "un" },
  { id: "tc-go-jc2f-04", typology_id: "typ-go-jc2f", component_name: "Concha simples", component_code: "CON-280", component_type: "concha", quantity_formula: "1", unit: "un" },
  { id: "tc-go-jc2f-05", typology_id: "typ-go-jc2f", component_name: "Vedador de vento", component_code: "NYL-335", component_type: "vedador", quantity_formula: "4", unit: "un" },
  // Janela 4F Gold
  { id: "tc-go-jc4f-01", typology_id: "typ-go-jc4f", component_name: "Roldana c/ regulagem", component_code: "ROL-426", component_type: "roldana", quantity_formula: "8", unit: "un" },
  { id: "tc-go-jc4f-02", typology_id: "typ-go-jc4f", component_name: "Fecho concha s/ chave", component_code: "FEC-636", component_type: "fecho", quantity_formula: "2", unit: "un" },
  // Janela 3F Gold
  { id: "tc-go-jc3f-01", typology_id: "typ-go-jc3f", component_name: "Roldana c/ regulagem", component_code: "ROL-426", component_type: "roldana", quantity_formula: "6", unit: "un" },
  { id: "tc-go-jc3f-02", typology_id: "typ-go-jc3f", component_name: "Fecho concha s/ chave", component_code: "FEC-636", component_type: "fecho", quantity_formula: "1", unit: "un" },
  // Maxim-Ar 1F Gold
  { id: "tc-go-jma1-01", typology_id: "typ-go-jma1", component_name: "Braço maxim-ar", component_code: "BRA-702/703/705", component_type: "braço", quantity_formula: "2", unit: "un" },
  { id: "tc-go-jma1-02", typology_id: "typ-go-jma1", component_name: "Fecho esquerdo maxim", component_code: "FEC-009", component_type: "fecho", quantity_formula: "1", unit: "un" },
  { id: "tc-go-jma1-03", typology_id: "typ-go-jma1", component_name: "Haste de comando", component_code: "FEC-011", component_type: "haste", quantity_formula: "1", unit: "un" },
  // Maxim-Ar 2F Gold
  { id: "tc-go-jma2-01", typology_id: "typ-go-jma2", component_name: "Braço maxim-ar", component_code: "BRA-702/703/705", component_type: "braço", quantity_formula: "4", unit: "un" },
  { id: "tc-go-jma2-02", typology_id: "typ-go-jma2", component_name: "Fecho esquerdo maxim", component_code: "FEC-009", component_type: "fecho", quantity_formula: "2", unit: "un" },
  // Porta Correr 2F Gold
  { id: "tc-go-pc2f-01", typology_id: "typ-go-pc2f", component_name: "Roldana Porta GO", component_type: "roldana", quantity_formula: "4", unit: "un" },
  { id: "tc-go-pc2f-02", typology_id: "typ-go-pc2f", component_name: "Trinco Concha Porta", component_type: "fecho", quantity_formula: "1", unit: "un" },
  { id: "tc-go-pc2f-03", typology_id: "typ-go-pc2f", component_name: "Puxador Concha", component_type: "puxador", quantity_formula: "2", unit: "un" },
  // Porta Correr 4F Gold
  { id: "tc-go-pc4f-01", typology_id: "typ-go-pc4f", component_name: "Roldana Porta GO", component_type: "roldana", quantity_formula: "8", unit: "un" },
  { id: "tc-go-pc4f-02", typology_id: "typ-go-pc4f", component_name: "Trinco Concha Porta", component_type: "fecho", quantity_formula: "2", unit: "un" },
  { id: "tc-go-pc4f-03", typology_id: "typ-go-pc4f", component_name: "Puxador Concha", component_type: "puxador", quantity_formula: "4", unit: "un" },
  // Porta Giro 1F Gold
  { id: "tc-go-pg1f-01", typology_id: "typ-go-pg1f", component_name: "Dobradiça", component_code: "DOB-837", component_type: "dobradica", quantity_formula: "3", unit: "un" },
  { id: "tc-go-pg1f-02", typology_id: "typ-go-pg1f", component_name: "Maçaneta c/ espelho", component_code: "MAC-927", component_type: "macaneta", quantity_formula: "1", unit: "un" },
  { id: "tc-go-pg1f-03", typology_id: "typ-go-pg1f", component_name: "Contratesta", component_code: "CON-295", component_type: "contrafecho", quantity_formula: "1", unit: "un" },
  // Porta Giro 2F Gold
  { id: "tc-go-pg2f-01", typology_id: "typ-go-pg2f", component_name: "Dobradiça", component_code: "DOB-837", component_type: "dobradica", quantity_formula: "6", unit: "un" },
  { id: "tc-go-pg2f-02", typology_id: "typ-go-pg2f", component_name: "Maçaneta c/ espelho", component_code: "MAC-927", component_type: "macaneta", quantity_formula: "2", unit: "un" },
  // Camarão Gold
  { id: "tc-go-jcam-01", typology_id: "typ-go-jcam", component_name: "Dobradiça Camarão", component_type: "dobradica", quantity_formula: "8", unit: "un" },
  { id: "tc-go-jcam-02", typology_id: "typ-go-jcam", component_name: "Carrinho Camarão", component_type: "roldana", quantity_formula: "4", unit: "un" },
  // Janela 6F Gold
  { id: "tc-go-jc6f-01", typology_id: "typ-go-jc6f", component_name: "Roldana c/ regulagem", component_type: "roldana", quantity_formula: "12", unit: "un" },
  { id: "tc-go-jc6f-02", typology_id: "typ-go-jc6f", component_name: "Fecho concha", component_type: "fecho", quantity_formula: "2", unit: "un" },
  // Veneziana 2F Gold
  { id: "tc-go-jc2fv-01", typology_id: "typ-go-jc2fv", component_name: "Roldana c/ regulagem", component_type: "roldana", quantity_formula: "8", unit: "un" },
  { id: "tc-go-jc2fv-02", typology_id: "typ-go-jc2fv", component_name: "Fecho concha", component_type: "fecho", quantity_formula: "1", unit: "un" },
  // Giro (Abre e Tomba) Gold
  { id: "tc-go-jgiro-01", typology_id: "typ-go-jgiro", component_name: "Dobradiça com regulagem", component_type: "dobradica", quantity_formula: "3", unit: "un" },
  { id: "tc-go-jgiro-02", typology_id: "typ-go-jgiro", component_name: "Maçaneta Giro-Tomba", component_type: "macaneta", quantity_formula: "1", unit: "un" },
  // Porta Integrada Gold
  { id: "tc-go-pint-01", typology_id: "typ-go-pint", component_name: "Roldana Porta GO", component_type: "roldana", quantity_formula: "4", unit: "un" },
  { id: "tc-go-pint-02", typology_id: "typ-go-pint", component_name: "Trinco Concha", component_type: "fecho", quantity_formula: "1", unit: "un" },
  // Porta Camarão Gold
  { id: "tc-go-pcam-01", typology_id: "typ-go-pcam", component_name: "Dobradiça Camarão", component_type: "dobradica", quantity_formula: "8", unit: "un" },
  { id: "tc-go-pcam-02", typology_id: "typ-go-pcam", component_name: "Carrinho Camarão", component_type: "roldana", quantity_formula: "4", unit: "un" },
];

// ============================================
// COMPONENTS - TOP (40mm)
// ============================================
const topComponents: TypologyComponent[] = [
  // Janela 2F Correr Top
  { id: "tc-tp-jc2f-01", typology_id: "typ-tp-jc2f", component_name: "Roldana reforçada 40mm", component_code: "ROL-440", component_type: "roldana", quantity_formula: "4", unit: "un" },
  { id: "tc-tp-jc2f-02", typology_id: "typ-tp-jc2f", component_name: "Guia deslizante 40mm", component_type: "guia", quantity_formula: "4", unit: "un" },
  { id: "tc-tp-jc2f-03", typology_id: "typ-tp-jc2f", component_name: "Fecho concha s/ chave", component_code: "FEC-636", component_type: "fecho", quantity_formula: "1", unit: "un" },
  // Janela 4F Top
  { id: "tc-tp-jc4f-01", typology_id: "typ-tp-jc4f", component_name: "Roldana reforçada 40mm", component_code: "ROL-440", component_type: "roldana", quantity_formula: "8", unit: "un" },
  { id: "tc-tp-jc4f-02", typology_id: "typ-tp-jc4f", component_name: "Fecho concha", component_type: "fecho", quantity_formula: "2", unit: "un" },
  // Maxim-Ar 1F Top
  { id: "tc-tp-jma1-01", typology_id: "typ-tp-jma1", component_name: "Braço maxim-ar reforçado", component_code: "BRA-740", component_type: "braço", quantity_formula: "2", unit: "un" },
  { id: "tc-tp-jma1-02", typology_id: "typ-tp-jma1", component_name: "Fecho esquerdo maxim", component_code: "FEC-009", component_type: "fecho", quantity_formula: "1", unit: "un" },
  { id: "tc-tp-jma1-03", typology_id: "typ-tp-jma1", component_name: "Haste de comando", component_code: "FEC-011", component_type: "haste", quantity_formula: "1", unit: "un" },
  // Porta Correr 2F Top
  { id: "tc-tp-pc2f-01", typology_id: "typ-tp-pc2f", component_name: "Roldana Porta reforçada", component_code: "ROL-440P", component_type: "roldana", quantity_formula: "4", unit: "un" },
  { id: "tc-tp-pc2f-02", typology_id: "typ-tp-pc2f", component_name: "Trinco Concha Porta", component_type: "fecho", quantity_formula: "1", unit: "un" },
  { id: "tc-tp-pc2f-03", typology_id: "typ-tp-pc2f", component_name: "Puxador Concha", component_type: "puxador", quantity_formula: "2", unit: "un" },
  // Porta Correr 4F Top
  { id: "tc-tp-pc4f-01", typology_id: "typ-tp-pc4f", component_name: "Roldana Porta reforçada", component_code: "ROL-440P", component_type: "roldana", quantity_formula: "8", unit: "un" },
  { id: "tc-tp-pc4f-02", typology_id: "typ-tp-pc4f", component_name: "Trinco Concha Porta", component_type: "fecho", quantity_formula: "2", unit: "un" },
  { id: "tc-tp-pc4f-03", typology_id: "typ-tp-pc4f", component_name: "Puxador Concha", component_type: "puxador", quantity_formula: "4", unit: "un" },
  // Porta Giro 1F Top
  { id: "tc-tp-pg1f-01", typology_id: "typ-tp-pg1f", component_name: "Dobradiça reforçada", component_code: "DOB-840", component_type: "dobradica", quantity_formula: "4", unit: "un" },
  { id: "tc-tp-pg1f-02", typology_id: "typ-tp-pg1f", component_name: "Maçaneta c/ espelho", component_code: "MAC-927", component_type: "macaneta", quantity_formula: "1", unit: "un" },
  { id: "tc-tp-pg1f-03", typology_id: "typ-tp-pg1f", component_name: "Contratesta", component_code: "CON-295", component_type: "contrafecho", quantity_formula: "1", unit: "un" },
  // Porta Giro 2F Top
  { id: "tc-tp-pg2f-01", typology_id: "typ-tp-pg2f", component_name: "Dobradiça reforçada", component_code: "DOB-840", component_type: "dobradica", quantity_formula: "8", unit: "un" },
  { id: "tc-tp-pg2f-02", typology_id: "typ-tp-pg2f", component_name: "Maçaneta c/ espelho", component_code: "MAC-927", component_type: "macaneta", quantity_formula: "2", unit: "un" },
  // Vitrô Fixo Top - sem componentes móveis
  // Porta Integrada Top
  { id: "tc-tp-pint-01", typology_id: "typ-tp-pint", component_name: "Roldana Porta reforçada", component_code: "ROL-440P", component_type: "roldana", quantity_formula: "4", unit: "un" },
  { id: "tc-tp-pint-02", typology_id: "typ-tp-pint", component_name: "Trinco Concha", component_type: "fecho", quantity_formula: "1", unit: "un" },
  // Camarão Top
  { id: "tc-tp-jcam-01", typology_id: "typ-tp-jcam", component_name: "Dobradiça Camarão reforçada", component_type: "dobradica", quantity_formula: "10", unit: "un" },
  { id: "tc-tp-jcam-02", typology_id: "typ-tp-jcam", component_name: "Carrinho Camarão reforçado", component_type: "roldana", quantity_formula: "4", unit: "un" },
  // Pivotante Top
  { id: "tc-tp-jpiv-01", typology_id: "typ-tp-jpiv", component_name: "Pivô central reforçado", component_type: "dobradica", quantity_formula: "2", unit: "un" },
  { id: "tc-tp-jpiv-02", typology_id: "typ-tp-jpiv", component_name: "Freio hidráulico", component_type: "freio", quantity_formula: "1", unit: "un" },
  // Giro-Tomba Top
  { id: "tc-tp-jgiro-01", typology_id: "typ-tp-jgiro", component_name: "Dobradiça com regulagem", component_type: "dobradica", quantity_formula: "3", unit: "un" },
  { id: "tc-tp-jgiro-02", typology_id: "typ-tp-jgiro", component_name: "Maçaneta Giro-Tomba", component_type: "macaneta", quantity_formula: "1", unit: "un" },
  // Pele de Vidro (Curtain Wall) — vedação e fixação
  { id: "tc-tp-cw1-01", typology_id: "typ-tp-cw1", component_name: "Gaxeta EPDM vertical", component_code: "GAX-601", component_type: "vedacao", quantity_formula: "1", unit: "un", length_reference: "H", length_constant_mm: -10 },
  { id: "tc-tp-cw1-02", typology_id: "typ-tp-cw1", component_name: "Gaxeta EPDM horizontal", component_code: "GAX-602", component_type: "vedacao", quantity_formula: "1", unit: "un", length_reference: "L", length_constant_mm: -20 },
  { id: "tc-tp-cw1-03", typology_id: "typ-tp-cw1", component_name: "Parafuso fixação estrutural", component_code: "PAR-810", component_type: "fixacao", quantity_formula: "12", unit: "un" },
  { id: "tc-tp-cw1-04", typology_id: "typ-tp-cw1", component_name: "Calço de apoio vidro", component_code: "CAL-220", component_type: "calco", quantity_formula: "4", unit: "un" },
  { id: "tc-tp-cw2-01", typology_id: "typ-tp-cw2", component_name: "Gaxeta EPDM vertical", component_code: "GAX-601", component_type: "vedacao", quantity_formula: "1", unit: "un", length_reference: "H", length_constant_mm: -10 },
  { id: "tc-tp-cw2-02", typology_id: "typ-tp-cw2", component_name: "Gaxeta EPDM horizontal", component_code: "GAX-602", component_type: "vedacao", quantity_formula: "1", unit: "un", length_reference: "L", length_constant_mm: -20 },
  { id: "tc-tp-cw2-03", typology_id: "typ-tp-cw2", component_name: "Parafuso fixação estrutural", component_code: "PAR-810", component_type: "fixacao", quantity_formula: "18", unit: "un" },
  { id: "tc-tp-cw2-04", typology_id: "typ-tp-cw2", component_name: "Calço de apoio vidro", component_code: "CAL-220", component_type: "calco", quantity_formula: "8", unit: "un" },
  { id: "tc-tp-cw3-01", typology_id: "typ-tp-cw3", component_name: "Gaxeta EPDM vertical", component_code: "GAX-601", component_type: "vedacao", quantity_formula: "1", unit: "un", length_reference: "H", length_constant_mm: -10 },
  { id: "tc-tp-cw3-02", typology_id: "typ-tp-cw3", component_name: "Gaxeta EPDM horizontal", component_code: "GAX-602", component_type: "vedacao", quantity_formula: "1", unit: "un", length_reference: "L", length_constant_mm: -20 },
  { id: "tc-tp-cw3-03", typology_id: "typ-tp-cw3", component_name: "Parafuso fixação estrutural", component_code: "PAR-810", component_type: "fixacao", quantity_formula: "24", unit: "un" },
  { id: "tc-tp-cw3-04", typology_id: "typ-tp-cw3", component_name: "Calço de apoio vidro", component_code: "CAL-220", component_type: "calco", quantity_formula: "12", unit: "un" },
  // Muro Cortina — vedação e fixação
  { id: "tc-tp-mc1-01", typology_id: "typ-tp-mc1", component_name: "Gaxeta EPDM vertical", component_code: "GAX-601", component_type: "vedacao", quantity_formula: "1", unit: "un", length_reference: "H", length_constant_mm: -5 },
  { id: "tc-tp-mc1-02", typology_id: "typ-tp-mc1", component_name: "Gaxeta EPDM horizontal", component_code: "GAX-602", component_type: "vedacao", quantity_formula: "1", unit: "un", length_reference: "L", length_constant_mm: -15 },
  { id: "tc-tp-mc1-03", typology_id: "typ-tp-mc1", component_name: "Âncora fixação laje", component_code: "ANC-400", component_type: "fixacao", quantity_formula: "4", unit: "un" },
  { id: "tc-tp-mc1-04", typology_id: "typ-tp-mc1", component_name: "Parafuso fixação estrutural", component_code: "PAR-810", component_type: "fixacao", quantity_formula: "16", unit: "un" },
  { id: "tc-tp-mc1-05", typology_id: "typ-tp-mc1", component_name: "Calço de apoio vidro", component_code: "CAL-220", component_type: "calco", quantity_formula: "4", unit: "un" },
  { id: "tc-tp-mc2-01", typology_id: "typ-tp-mc2", component_name: "Gaxeta EPDM vertical", component_code: "GAX-601", component_type: "vedacao", quantity_formula: "1", unit: "un", length_reference: "H", length_constant_mm: -5 },
  { id: "tc-tp-mc2-02", typology_id: "typ-tp-mc2", component_name: "Gaxeta EPDM horizontal", component_code: "GAX-602", component_type: "vedacao", quantity_formula: "1", unit: "un", length_reference: "L", length_constant_mm: -15 },
  { id: "tc-tp-mc2-03", typology_id: "typ-tp-mc2", component_name: "Âncora fixação laje", component_code: "ANC-400", component_type: "fixacao", quantity_formula: "6", unit: "un" },
  { id: "tc-tp-mc2-04", typology_id: "typ-tp-mc2", component_name: "Parafuso fixação estrutural", component_code: "PAR-810", component_type: "fixacao", quantity_formula: "24", unit: "un" },
  { id: "tc-tp-mc2-05", typology_id: "typ-tp-mc2", component_name: "Calço de apoio vidro", component_code: "CAL-220", component_type: "calco", quantity_formula: "8", unit: "un" },
  { id: "tc-tp-mc2t-01", typology_id: "typ-tp-mc2t", component_name: "Gaxeta EPDM vertical", component_code: "GAX-601", component_type: "vedacao", quantity_formula: "1", unit: "un", length_reference: "H", length_constant_mm: -5 },
  { id: "tc-tp-mc2t-02", typology_id: "typ-tp-mc2t", component_name: "Gaxeta EPDM horizontal", component_code: "GAX-602", component_type: "vedacao", quantity_formula: "1", unit: "un", length_reference: "L", length_constant_mm: -15 },
  { id: "tc-tp-mc2t-03", typology_id: "typ-tp-mc2t", component_name: "Âncora fixação laje", component_code: "ANC-400", component_type: "fixacao", quantity_formula: "6", unit: "un" },
  { id: "tc-tp-mc2t-04", typology_id: "typ-tp-mc2t", component_name: "Parafuso fixação estrutural", component_code: "PAR-810", component_type: "fixacao", quantity_formula: "32", unit: "un" },
  { id: "tc-tp-mc2t-05", typology_id: "typ-tp-mc2t", component_name: "Calço de apoio vidro", component_code: "CAL-220", component_type: "calco", quantity_formula: "16", unit: "un" },
];



// ============================================
// COMPONENTS - DECAMP LINHA 45
// ============================================
const decampL45Components: TypologyComponent[] = [
  // Janela Correr 2F
  { id: "tc-dc-jc2f-01", typology_id: "typ-dc-jc2f", component_name: "Roldana inferior", component_type: "roldana", quantity_formula: "4", unit: "un" },
  { id: "tc-dc-jc2f-02", typology_id: "typ-dc-jc2f", component_name: "Fecho/Trinco", component_type: "fechamento", quantity_formula: "1", unit: "un" },
  { id: "tc-dc-jc2f-03", typology_id: "typ-dc-jc2f", component_name: "Escova de vedação", component_type: "vedacao", quantity_formula: "1", unit: "un", length_reference: "H", length_constant_mm: -10 },
  // Janela Correr 4F
  { id: "tc-dc-jc4f-01", typology_id: "typ-dc-jc4f", component_name: "Roldana inferior", component_type: "roldana", quantity_formula: "8", unit: "un" },
  { id: "tc-dc-jc4f-02", typology_id: "typ-dc-jc4f", component_name: "Fecho/Trinco", component_type: "fechamento", quantity_formula: "2", unit: "un" },
  { id: "tc-dc-jc4f-03", typology_id: "typ-dc-jc4f", component_name: "Escova de vedação", component_type: "vedacao", quantity_formula: "1", unit: "un", length_reference: "H", length_constant_mm: -10 },
  // Porta Correr 2F
  { id: "tc-dc-pc2f-01", typology_id: "typ-dc-pc2f", component_name: "Roldana inferior porta", component_type: "roldana", quantity_formula: "4", unit: "un" },
  { id: "tc-dc-pc2f-02", typology_id: "typ-dc-pc2f", component_name: "Puxador concha", component_type: "puxador", quantity_formula: "2", unit: "un" },
  { id: "tc-dc-pc2f-03", typology_id: "typ-dc-pc2f", component_name: "Fecho/Trinco", component_type: "fechamento", quantity_formula: "1", unit: "un" },
  // Porta Giro 1F
  { id: "tc-dc-pg1f-01", typology_id: "typ-dc-pg1f", component_name: "Dobradiça", component_type: "dobradica", quantity_formula: "3", unit: "un" },
  { id: "tc-dc-pg1f-02", typology_id: "typ-dc-pg1f", component_name: "Fechadura", component_type: "fechamento", quantity_formula: "1", unit: "un" },
  { id: "tc-dc-pg1f-03", typology_id: "typ-dc-pg1f", component_name: "Puxador", component_type: "puxador", quantity_formula: "1", unit: "par" },
  // Maxim-Ar 1F
  { id: "tc-dc-jma1-01", typology_id: "typ-dc-jma1", component_name: "Braço articulado", component_type: "braco", quantity_formula: "2", unit: "un" },
  { id: "tc-dc-jma1-02", typology_id: "typ-dc-jma1", component_name: "Fecho/Trinco", component_type: "fechamento", quantity_formula: "1", unit: "un" },
  // Pivotante
  { id: "tc-dc-jpiv-01", typology_id: "typ-dc-jpiv", component_name: "Pivô superior", component_type: "pivo", quantity_formula: "1", unit: "un" },
  { id: "tc-dc-jpiv-02", typology_id: "typ-dc-jpiv", component_name: "Pivô inferior", component_type: "pivo", quantity_formula: "1", unit: "un" },
  { id: "tc-dc-jpiv-03", typology_id: "typ-dc-jpiv", component_name: "Fecho/Trinco", component_type: "fechamento", quantity_formula: "1", unit: "un" },
];

// ============================================
// COMPONENTS - DECAMP PRATIC 20
// ============================================
const pratic20Components: TypologyComponent[] = [
  { id: "tc-p20-jc2f-01", typology_id: "typ-p20-jc2f", component_name: "Roldana 20mm", component_type: "roldana", quantity_formula: "4", unit: "un" },
  { id: "tc-p20-jc2f-02", typology_id: "typ-p20-jc2f", component_name: "Fecho concha", component_type: "fecho", quantity_formula: "1", unit: "un" },
  { id: "tc-p20-jc4f-01", typology_id: "typ-p20-jc4f", component_name: "Roldana 20mm", component_type: "roldana", quantity_formula: "8", unit: "un" },
  { id: "tc-p20-jc4f-02", typology_id: "typ-p20-jc4f", component_name: "Fecho concha", component_type: "fecho", quantity_formula: "2", unit: "un" },
  { id: "tc-p20-jma1-01", typology_id: "typ-p20-jma1", component_name: "Braço maxim-ar", component_type: "braco", quantity_formula: "2", unit: "un" },
  { id: "tc-p20-jma1-02", typology_id: "typ-p20-jma1", component_name: "Fecho/Trinco", component_type: "fechamento", quantity_formula: "1", unit: "un" },
  { id: "tc-p20-jma2-01", typology_id: "typ-p20-jma2", component_name: "Braço maxim-ar", component_type: "braco", quantity_formula: "4", unit: "un" },
  { id: "tc-p20-jma2-02", typology_id: "typ-p20-jma2", component_name: "Fecho/Trinco", component_type: "fechamento", quantity_formula: "2", unit: "un" },
  { id: "tc-p20-jbas1-01", typology_id: "typ-p20-jbas1", component_name: "Trinco basculante", component_type: "fechamento", quantity_formula: "1", unit: "un" },
  { id: "tc-p20-pg1f-01", typology_id: "typ-p20-pg1f", component_name: "Dobradiça", component_type: "dobradica", quantity_formula: "3", unit: "un" },
  { id: "tc-p20-pg1f-02", typology_id: "typ-p20-pg1f", component_name: "Maçaneta", component_type: "macaneta", quantity_formula: "1", unit: "un" },
  { id: "tc-p20-pc2f-01", typology_id: "typ-p20-pc2f", component_name: "Roldana 20mm", component_type: "roldana", quantity_formula: "4", unit: "un" },
  { id: "tc-p20-pc2f-02", typology_id: "typ-p20-pc2f", component_name: "Trinco Concha", component_type: "fecho", quantity_formula: "1", unit: "un" },
];

// ============================================
// COMPONENTS - DECAMP PRATIC 32
// ============================================
const pratic32Components: TypologyComponent[] = [
  { id: "tc-p32-jc2f-01", typology_id: "typ-p32-jc2f", component_name: "Roldana 32mm", component_type: "roldana", quantity_formula: "4", unit: "un" },
  { id: "tc-p32-jc2f-02", typology_id: "typ-p32-jc2f", component_name: "Fecho concha", component_type: "fecho", quantity_formula: "1", unit: "un" },
  { id: "tc-p32-jc2f-03", typology_id: "typ-p32-jc2f", component_name: "Vedador de vento", component_type: "vedador", quantity_formula: "4", unit: "un" },
  { id: "tc-p32-jc3f-01", typology_id: "typ-p32-jc3f", component_name: "Roldana 32mm", component_type: "roldana", quantity_formula: "6", unit: "un" },
  { id: "tc-p32-jc3f-02", typology_id: "typ-p32-jc3f", component_name: "Fecho concha", component_type: "fecho", quantity_formula: "1", unit: "un" },
  { id: "tc-p32-jc4f-01", typology_id: "typ-p32-jc4f", component_name: "Roldana 32mm", component_type: "roldana", quantity_formula: "8", unit: "un" },
  { id: "tc-p32-jc4f-02", typology_id: "typ-p32-jc4f", component_name: "Fecho concha", component_type: "fecho", quantity_formula: "2", unit: "un" },
  { id: "tc-p32-jma1-01", typology_id: "typ-p32-jma1", component_name: "Braço articulado", component_type: "braco", quantity_formula: "2", unit: "un" },
  { id: "tc-p32-jma1-02", typology_id: "typ-p32-jma1", component_name: "Fecho/Trinco", component_type: "fechamento", quantity_formula: "1", unit: "un" },
  { id: "tc-p32-jma2-01", typology_id: "typ-p32-jma2", component_name: "Braço articulado", component_type: "braco", quantity_formula: "4", unit: "un" },
  { id: "tc-p32-jma2-02", typology_id: "typ-p32-jma2", component_name: "Fecho/Trinco", component_type: "fechamento", quantity_formula: "2", unit: "un" },
  { id: "tc-p32-jcam-01", typology_id: "typ-p32-jcam", component_name: "Dobradiça Camarão", component_type: "dobradica", quantity_formula: "8", unit: "un" },
  { id: "tc-p32-jcam-02", typology_id: "typ-p32-jcam", component_name: "Carrinho Camarão", component_type: "roldana", quantity_formula: "4", unit: "un" },
  { id: "tc-p32-pc2f-01", typology_id: "typ-p32-pc2f", component_name: "Roldana Porta 32mm", component_type: "roldana", quantity_formula: "4", unit: "un" },
  { id: "tc-p32-pc2f-02", typology_id: "typ-p32-pc2f", component_name: "Trinco Concha Porta", component_type: "fecho", quantity_formula: "1", unit: "un" },
  { id: "tc-p32-pc2f-03", typology_id: "typ-p32-pc2f", component_name: "Puxador Concha", component_type: "puxador", quantity_formula: "2", unit: "un" },
  { id: "tc-p32-pc3f-01", typology_id: "typ-p32-pc3f", component_name: "Roldana Porta 32mm", component_type: "roldana", quantity_formula: "6", unit: "un" },
  { id: "tc-p32-pc3f-02", typology_id: "typ-p32-pc3f", component_name: "Trinco Concha", component_type: "fecho", quantity_formula: "1", unit: "un" },
  { id: "tc-p32-pc4f-01", typology_id: "typ-p32-pc4f", component_name: "Roldana Porta 32mm", component_type: "roldana", quantity_formula: "8", unit: "un" },
  { id: "tc-p32-pc4f-02", typology_id: "typ-p32-pc4f", component_name: "Trinco Concha Porta", component_type: "fecho", quantity_formula: "2", unit: "un" },
  { id: "tc-p32-pg1f-01", typology_id: "typ-p32-pg1f", component_name: "Dobradiça", component_type: "dobradica", quantity_formula: "3", unit: "un" },
  { id: "tc-p32-pg1f-02", typology_id: "typ-p32-pg1f", component_name: "Maçaneta c/ espelho", component_type: "macaneta", quantity_formula: "1", unit: "un" },
  { id: "tc-p32-pg1f-03", typology_id: "typ-p32-pg1f", component_name: "Contratesta", component_type: "contrafecho", quantity_formula: "1", unit: "un" },
  { id: "tc-p32-pg2f-01", typology_id: "typ-p32-pg2f", component_name: "Dobradiça", component_type: "dobradica", quantity_formula: "6", unit: "un" },
  { id: "tc-p32-pg2f-02", typology_id: "typ-p32-pg2f", component_name: "Maçaneta c/ espelho", component_type: "macaneta", quantity_formula: "2", unit: "un" },
  { id: "tc-p32-jc2fv-01", typology_id: "typ-p32-jc2fv", component_name: "Roldana 32mm", component_type: "roldana", quantity_formula: "4", unit: "un" },
  { id: "tc-p32-jc2fv-02", typology_id: "typ-p32-jc2fv", component_name: "Fecho concha", component_type: "fecho", quantity_formula: "1", unit: "un" },
  { id: "tc-p32-jbas1-01", typology_id: "typ-p32-jbas1", component_name: "Trinco basculante", component_type: "fechamento", quantity_formula: "1", unit: "un" },
  { id: "tc-p32-jpiv-01", typology_id: "typ-p32-jpiv", component_name: "Pivô superior", component_type: "pivo", quantity_formula: "1", unit: "un" },
  { id: "tc-p32-jpiv-02", typology_id: "typ-p32-jpiv", component_name: "Pivô inferior", component_type: "pivo", quantity_formula: "1", unit: "un" },
  { id: "tc-p32-jpiv-03", typology_id: "typ-p32-jpiv", component_name: "Fecho/Trinco", component_type: "fechamento", quantity_formula: "1", unit: "un" },
];

// ============================================
// GLASS RULES - CENTENÁRIO PERFETTA 45
// ============================================
const perfettaGlassRules: GlassRule[] = [
  { id: "gr-cpf-jc2f", typology_id: "typ-cpf-jc2f", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -92, height_reference: "H", height_constant_mm: -142, quantity: 2, glass_type: "comum", min_thickness_mm: 4, max_thickness_mm: 8 },
  { id: "gr-cpf-jc4f", typology_id: "typ-cpf-jc4f", glass_name: "Vidro Folha", width_reference: "L/4", width_constant_mm: -92, height_reference: "H", height_constant_mm: -142, quantity: 4, glass_type: "comum" },
  { id: "gr-cpf-pc2f", typology_id: "typ-cpf-pc2f", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -92, height_reference: "H", height_constant_mm: -132, quantity: 2, glass_type: "temperado", min_thickness_mm: 6, max_thickness_mm: 10 },
  { id: "gr-cpf-pc4f", typology_id: "typ-cpf-pc4f", glass_name: "Vidro Folha", width_reference: "L/4", width_constant_mm: -92, height_reference: "H", height_constant_mm: -132, quantity: 4, glass_type: "temperado" },
  { id: "gr-cpf-jma1", typology_id: "typ-cpf-jma1", glass_name: "Vidro Folha", width_reference: "L", width_constant_mm: -172, height_reference: "H", height_constant_mm: -162, quantity: 1, glass_type: "temperado", min_thickness_mm: 4, max_thickness_mm: 8 },
  { id: "gr-cpf-jma2", typology_id: "typ-cpf-jma2", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -172, height_reference: "H", height_constant_mm: -162, quantity: 2, glass_type: "temperado" },
  { id: "gr-cpf-pg1f", typology_id: "typ-cpf-pg1f", glass_name: "Vidro Folha", width_reference: "L", width_constant_mm: -142, height_reference: "H", height_constant_mm: -137, quantity: 1, glass_type: "temperado", min_thickness_mm: 6, max_thickness_mm: 10 },
  { id: "gr-cpf-pg2f", typology_id: "typ-cpf-pg2f", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -142, height_reference: "H", height_constant_mm: -137, quantity: 2, glass_type: "temperado" },
  { id: "gr-cpf-jcam", typology_id: "typ-cpf-jcam", glass_name: "Vidro Folha", width_reference: "L/4", width_constant_mm: -92, height_reference: "H", height_constant_mm: -142, quantity: 4, glass_type: "comum" },
];

// ============================================
// COMPONENTS - CENTENÁRIO PERFETTA 45
// ============================================
const perfettaComponents: TypologyComponent[] = [
  // Correr 2F
  { id: "tc-cpf-jc2f-01", typology_id: "typ-cpf-jc2f", component_name: "Roldana Perfetta", component_type: "roldana", quantity_formula: "4", unit: "un" },
  { id: "tc-cpf-jc2f-02", typology_id: "typ-cpf-jc2f", component_name: "Fecho Concha", component_type: "fecho", quantity_formula: "1", unit: "un" },
  { id: "tc-cpf-jc2f-03", typology_id: "typ-cpf-jc2f", component_name: "Escova Vedação 7x7", component_type: "vedacao", quantity_formula: "2", unit: "un", length_reference: "H", length_constant_mm: 0 },
  // Correr 4F
  { id: "tc-cpf-jc4f-01", typology_id: "typ-cpf-jc4f", component_name: "Roldana Perfetta", component_type: "roldana", quantity_formula: "8", unit: "un" },
  { id: "tc-cpf-jc4f-02", typology_id: "typ-cpf-jc4f", component_name: "Fecho Concha", component_type: "fecho", quantity_formula: "2", unit: "un" },
  // Porta Correr 2F
  { id: "tc-cpf-pc2f-01", typology_id: "typ-cpf-pc2f", component_name: "Roldana Porta Perfetta", component_type: "roldana", quantity_formula: "4", unit: "un" },
  { id: "tc-cpf-pc2f-02", typology_id: "typ-cpf-pc2f", component_name: "Puxador Concha", component_type: "puxador", quantity_formula: "2", unit: "un" },
  { id: "tc-cpf-pc2f-03", typology_id: "typ-cpf-pc2f", component_name: "Trinco Concha", component_type: "fecho", quantity_formula: "1", unit: "un" },
  // Porta Correr 4F
  { id: "tc-cpf-pc4f-01", typology_id: "typ-cpf-pc4f", component_name: "Roldana Porta Perfetta", component_type: "roldana", quantity_formula: "8", unit: "un" },
  { id: "tc-cpf-pc4f-02", typology_id: "typ-cpf-pc4f", component_name: "Trinco Concha", component_type: "fecho", quantity_formula: "2", unit: "un" },
  // Maxim-Ar 1F
  { id: "tc-cpf-jma1-01", typology_id: "typ-cpf-jma1", component_name: "Braço Maxim-Ar Perfetta", component_type: "braco", quantity_formula: "2", unit: "un" },
  { id: "tc-cpf-jma1-02", typology_id: "typ-cpf-jma1", component_name: "Fecho/Trinco", component_type: "fechamento", quantity_formula: "1", unit: "un" },
  // Maxim-Ar 2F
  { id: "tc-cpf-jma2-01", typology_id: "typ-cpf-jma2", component_name: "Braço Maxim-Ar Perfetta", component_type: "braco", quantity_formula: "4", unit: "un" },
  { id: "tc-cpf-jma2-02", typology_id: "typ-cpf-jma2", component_name: "Fecho/Trinco", component_type: "fechamento", quantity_formula: "2", unit: "un" },
  // Porta Giro 1F
  { id: "tc-cpf-pg1f-01", typology_id: "typ-cpf-pg1f", component_name: "Dobradiça Perfetta", component_type: "dobradica", quantity_formula: "3", unit: "un" },
  { id: "tc-cpf-pg1f-02", typology_id: "typ-cpf-pg1f", component_name: "Maçaneta c/ espelho", component_type: "macaneta", quantity_formula: "1", unit: "un" },
  { id: "tc-cpf-pg1f-03", typology_id: "typ-cpf-pg1f", component_name: "Contratesta", component_type: "contrafecho", quantity_formula: "1", unit: "un" },
  // Porta Giro 2F
  { id: "tc-cpf-pg2f-01", typology_id: "typ-cpf-pg2f", component_name: "Dobradiça Perfetta", component_type: "dobradica", quantity_formula: "6", unit: "un" },
  { id: "tc-cpf-pg2f-02", typology_id: "typ-cpf-pg2f", component_name: "Maçaneta c/ espelho", component_type: "macaneta", quantity_formula: "2", unit: "un" },
  // Camarão
  { id: "tc-cpf-jcam-01", typology_id: "typ-cpf-jcam", component_name: "Dobradiça Camarão Perfetta", component_type: "dobradica", quantity_formula: "8", unit: "un" },
  { id: "tc-cpf-jcam-02", typology_id: "typ-cpf-jcam", component_name: "Carrinho Camarão", component_type: "roldana", quantity_formula: "4", unit: "un" },
];

export const typologyComponents: TypologyComponent[] = [
  ...supremaComponents,
  ...goldComponents,
  ...topComponents,
  ...decampL45Components,
  ...pratic20Components,
  ...pratic32Components,
  ...perfettaComponents,
];

export const glassRules: GlassRule[] = [
  ...supremaGlassRules,
  ...goldGlassRules,
  ...topGlassRules,
  ...decampL45GlassRules,
  ...pratic20GlassRules,
  ...pratic32GlassRules,
  ...perfettaGlassRules,
];
