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
];

// Clone glass rules for compatible lines
function cloneGlassRules(rules: GlassRule[], prefixFrom: string, prefixTo: string, idPrefixFrom: string, idPrefixTo: string): GlassRule[] {
  return rules.map(r => ({
    ...r,
    id: r.id.replace(idPrefixFrom, idPrefixTo),
    typology_id: r.typology_id.replace(prefixFrom, prefixTo),
  }));
}

// All 25mm lines clone from Suprema
const clone25GlassLines = [
  ["mg25"], ["hy"], ["al"], ["ds"], ["br"], ["cb"], ["re"], ["lp"],
  ["ax"], ["ab"], ["sm"], ["pr"], ["hb"], ["pn"], ["sp"],
];
const cloned25GlassRules = clone25GlassLines.flatMap(([p]) =>
  cloneGlassRules(supremaGlassRules, "typ-su-", `typ-${p}-`, "gr-su-", `gr-${p}-`)
);

// All 32mm lines clone from Gold
const clone32GlassLines = [
  ["dg"], ["bg"], ["c32"], ["r32"], ["l32"], ["x32"], ["a32"],
  ["s32"], ["p32"], ["h32"], ["n32"], ["hx32"], ["m32"], ["am32"],
];
const cloned32GlassRules = clone32GlassLines.flatMap(([p]) =>
  cloneGlassRules(goldGlassRules, "typ-go-", `typ-${p}-`, "gr-go-", `gr-${p}-`)
);

// All 40mm lines clone from Top
const clone40GlassLines = [["h40"], ["m40"]];
const cloned40GlassRules = clone40GlassLines.flatMap(([p]) =>
  cloneGlassRules(topGlassRules, "typ-tp-", `typ-${p}-`, "gr-tp-", `gr-${p}-`)
);

export const glassRules: GlassRule[] = [
  ...supremaGlassRules,
  ...goldGlassRules,
  ...topGlassRules,
  ...cloned25GlassRules,
  ...cloned32GlassRules,
  ...cloned40GlassRules,
];

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
];

// Clone components for compatible lines
function cloneComponents(source: TypologyComponent[], prefixFrom: string, prefixTo: string, idFrom: string, idTo: string): TypologyComponent[] {
  return source.map(c => ({
    ...c,
    id: c.id.replace(idFrom, idTo),
    typology_id: c.typology_id.replace(prefixFrom, prefixTo),
  }));
}

// All 25mm lines clone from Suprema
const clone25CompLines = [
  ["mg25"], ["hy"], ["al"], ["ds"], ["br"], ["cb"], ["re"], ["lp"],
  ["ax"], ["ab"], ["sm"], ["pr"], ["hb"], ["pn"], ["sp"],
];
const cloned25Components = clone25CompLines.flatMap(([p]) =>
  cloneComponents(supremaComponents, "typ-su-", `typ-${p}-`, "tc-su-", `tc-${p}-`)
);

// All 32mm lines clone from Gold
const clone32CompLines = [
  ["dg"], ["bg"], ["c32"], ["r32"], ["l32"], ["x32"], ["a32"],
  ["s32"], ["p32"], ["h32"], ["n32"], ["hx32"], ["m32"], ["am32"],
];
const cloned32Components = clone32CompLines.flatMap(([p]) =>
  cloneComponents(goldComponents, "typ-go-", `typ-${p}-`, "tc-go-", `tc-${p}-`)
);

// All 40mm lines clone from Top
const clone40CompLines = [["h40"], ["m40"]];
const cloned40Components = clone40CompLines.flatMap(([p]) =>
  cloneComponents(topComponents, "typ-tp-", `typ-${p}-`, "tc-tp-", `tc-${p}-`)
);

export const typologyComponents: TypologyComponent[] = [
  ...supremaComponents,
  ...goldComponents,
  ...topComponents,
  ...cloned25Components,
  ...cloned32Components,
  ...cloned40Components,
];
