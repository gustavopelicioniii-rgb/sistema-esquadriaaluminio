// MOF - Mídia Oficial do Fornecedor
// Bibliotecas oficiais dos principais fabricantes de esquadrias de alumínio

export interface SupplierProfile {
  id: string;
  name: string;
  manufacturer: string;
  line: string;
  profile_type: "pingadeira" | "guideline" | "main_frame" | "main_frame_60" | "batente" | "requadro" | "veneziana" | "complementar";
  code: string;
  description: string;
  weight_kg_m: number;
  standard_mm: number;
  color_finishes: string[];
  available: boolean;
  // Technical specs
  thickness_mm?: number;
  width_mm?: number;
  height_mm?: number;
  inertia_x?: number;
  inertia_y?: number;
}

export interface CutRule {
  profile_id: string;
  cut_type: "straight" | "45deg" | "45deg_inverse" | "compound";
  allowance_mm: number;  // milimeters to add for cut
  blade_thickness_mm: number;  // saw blade thickness
  description: string;
}

export interface SupplierGlass {
  id: string;
  name: string;
  manufacturer: string;
  type: "temperado" | "laminado" | "refletivo" | "fantasia" | "insulado";
  thickness_mm: number;
  color: string;
  price_m2: number;
  available: boolean;
}

export interface SupplierComponent {
  id: string;
  name: string;
  manufacturer: string;
  type: "rolamento" | "trinco" | "cantoneira" | "borracha" | "parafuso" | "guarnicao" | "fecho" | "cremalheira" | "roldana" | "puxador";
  code: string;
  unit: string;
  price: number;
  available: boolean;
}

// ===== GOLD (Alcoa) =====
export const goldProfiles: SupplierProfile[] = [
  // Pingadeiras
  {
    id: "gold-ping-01",
    name: "Gold Pingadeira 25mm",
    manufacturer: "Gold (Alcoa)",
    line: "Gold",
    profile_type: "pingadeira",
    code: "GOLD-PING-25",
    description: "Pingadeira 25mm para janelas",
    weight_kg_m: 0.38,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "bronze"],
    available: true,
    thickness_mm: 1.2,
    width_mm: 25,
    height_mm: 18,
  },
  {
    id: "gold-ping-02",
    name: "Gold Pingadeira 30mm",
    manufacturer: "Gold (Alcoa)",
    line: "Gold",
    profile_type: "pingadeira",
    code: "GOLD-PING-30",
    description: "Pingadeira 30mm para portas",
    weight_kg_m: 0.45,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "bronze"],
    available: true,
    thickness_mm: 1.2,
    width_mm: 30,
    height_mm: 22,
  },
  // Guidelines
  {
    id: "gold-guid-01",
    name: "Gold Guideline 25mm",
    manufacturer: "Gold (Alcoa)",
    line: "Gold",
    profile_type: "guideline",
    code: "GOLD-GUID-25",
    description: "Guideline 25mm para porta deslizante",
    weight_kg_m: 0.52,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "bronze"],
    available: true,
    thickness_mm: 1.5,
    width_mm: 25,
    height_mm: 40,
  },
  {
    id: "gold-guid-02",
    name: "Gold Guideline 40mm",
    manufacturer: "Gold (Alcoa)",
    line: "Gold",
    profile_type: "guideline",
    code: "GOLD-GUID-40",
    description: "Guideline 40mm para porta deslizante",
    weight_kg_m: 0.68,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "bronze"],
    available: true,
    thickness_mm: 1.5,
    width_mm: 40,
    height_mm: 50,
  },
  // Main Frames
  {
    id: "gold-mf-40",
    name: "Gold Main Frame 40mm",
    manufacturer: "Gold (Alcoa)",
    line: "Gold",
    profile_type: "main_frame",
    code: "GOLD-MF-40",
    description: "Batente 40mm para janela",
    weight_kg_m: 0.78,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "bronze", "champagne"],
    available: true,
    thickness_mm: 1.5,
    width_mm: 40,
    height_mm: 40,
    inertia_x: 4.2,
    inertia_y: 3.8,
  },
  {
    id: "gold-mf-60",
    name: "Gold Main Frame 60mm",
    manufacturer: "Gold (Alcoa)",
    line: "Gold",
    profile_type: "main_frame_60",
    code: "GOLD-MF-60",
    description: "Batente 60mm para porta",
    weight_kg_m: 1.05,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "bronze", "champagne"],
    available: true,
    thickness_mm: 1.8,
    width_mm: 60,
    height_mm: 60,
    inertia_x: 12.5,
    inertia_y: 10.8,
  },
  {
    id: "gold-mf-70",
    name: "Gold Main Frame 70mm",
    manufacturer: "Gold (Alcoa)",
    line: "Gold",
    profile_type: "main_frame_60",
    code: "GOLD-MF-70",
    description: "Batente 70mm para porta de alto desempenho",
    weight_kg_m: 1.25,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "bronze"],
    available: true,
    thickness_mm: 2.0,
    width_mm: 70,
    height_mm: 70,
    inertia_x: 18.2,
    inertia_y: 15.6,
  },
];

// ===== SUPREMA (Novelis) =====
export const supremaProfiles: SupplierProfile[] = [
  // Pingadeiras
  {
    id: "sup-ping-25",
    name: "Suprema Pingadeira 25mm",
    manufacturer: "Suprema (Novelis)",
    line: "Suprema",
    profile_type: "pingadeira",
    code: "SUP-PING-25",
    description: "Pingadeira 25mm Supreme",
    weight_kg_m: 0.35,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "preto", "bronze", "champagne"],
    available: true,
    thickness_mm: 1.0,
    width_mm: 25,
    height_mm: 16,
  },
  {
    id: "sup-ping-30",
    name: "Suprema Pingadeira 30mm",
    manufacturer: "Suprema (Novelis)",
    line: "Suprema",
    profile_type: "pingadeira",
    code: "SUP-PING-30",
    description: "Pingadeira 30mm Supreme",
    weight_kg_m: 0.42,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "preto", "bronze", "champagne"],
    available: true,
    thickness_mm: 1.2,
    width_mm: 30,
    height_mm: 20,
  },
  // Guidelines
  {
    id: "sup-guid-25",
    name: "Suprema Guideline 25mm",
    manufacturer: "Suprema (Novelis)",
    line: "Suprema",
    profile_type: "guideline",
    code: "SUP-GUID-25",
    description: "Guideline 25mm deslizante",
    weight_kg_m: 0.48,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "preto", "bronze", "champagne"],
    available: true,
    thickness_mm: 1.3,
    width_mm: 25,
    height_mm: 38,
  },
  {
    id: "sup-guid-30",
    name: "Suprema Guideline 30mm",
    manufacturer: "Suprema (Novelis)",
    line: "Suprema",
    profile_type: "guideline",
    code: "SUP-GUID-30",
    description: "Guideline 30mm deslizante",
    weight_kg_m: 0.55,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "preto", "bronze", "champagne"],
    available: true,
    thickness_mm: 1.4,
    width_mm: 30,
    height_mm: 45,
  },
  {
    id: "sup-guid-40",
    name: "Suprema Guideline 40mm",
    manufacturer: "Suprema (Novelis)",
    line: "Suprema",
    profile_type: "guideline",
    code: "SUP-GUID-40",
    description: "Guideline 40mm deslizante pesado",
    weight_kg_m: 0.65,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "preto", "bronze", "champagne"],
    available: true,
    thickness_mm: 1.5,
    width_mm: 40,
    height_mm: 52,
  },
  // Main Frames
  {
    id: "sup-mf-40",
    name: "Suprema Main Frame 40mm",
    manufacturer: "Suprema (Novelis)",
    line: "Suprema",
    profile_type: "main_frame",
    code: "SUP-MF-40",
    description: "Batente 40mm janela",
    weight_kg_m: 0.72,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "preto", "bronze", "champagne"],
    available: true,
    thickness_mm: 1.4,
    width_mm: 40,
    height_mm: 40,
    inertia_x: 3.9,
    inertia_y: 3.5,
  },
  {
    id: "sup-mf-50",
    name: "Suprema Main Frame 50mm",
    manufacturer: "Suprema (Novelis)",
    line: "Suprema",
    profile_type: "main_frame",
    code: "SUP-MF-50",
    description: "Batente 50mm janela/porta",
    weight_kg_m: 0.88,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "preto", "bronze", "champagne"],
    available: true,
    thickness_mm: 1.6,
    width_mm: 50,
    height_mm: 50,
    inertia_x: 8.2,
    inertia_y: 7.1,
  },
  {
    id: "sup-mf-60",
    name: "Suprema Main Frame 60mm",
    manufacturer: "Suprema (Novelis)",
    line: "Suprema",
    profile_type: "main_frame_60",
    code: "SUP-MF-60",
    description: "Batente 60mm porta",
    weight_kg_m: 1.02,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "preto", "bronze", "champagne"],
    available: true,
    thickness_mm: 1.8,
    width_mm: 60,
    height_mm: 60,
    inertia_x: 11.8,
    inertia_y: 10.2,
  },
  // Veneziana
  {
    id: "sup-ven-45",
    name: "Suprema Veneziana 45mm",
    manufacturer: "Suprema (Novelis)",
    line: "Suprema",
    profile_type: "veneziana",
    code: "SUP-VEN-45",
    description: "Perfil veneziana 45mm",
    weight_kg_m: 0.42,
    standard_mm: 6000,
    color_finishes: ["natural", "branco"],
    available: true,
    thickness_mm: 0.8,
    width_mm: 45,
    height_mm: 45,
  },
];

// ===== ALUPRIME =====
export const aluprimeProfiles: SupplierProfile[] = [
  {
    id: "alp-ping-25",
    name: "Aluprime Pingadeira 25mm",
    manufacturer: "Aluprime",
    line: "Aluprime",
    profile_type: "pingadeira",
    code: "ALP-PING-25",
    description: "Pingadeira econômica 25mm",
    weight_kg_m: 0.32,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "bronze"],
    available: true,
    thickness_mm: 0.9,
    width_mm: 25,
    height_mm: 15,
  },
  {
    id: "alp-guid-25",
    name: "Aluprime Guideline 25mm",
    manufacturer: "Aluprime",
    line: "Aluprime",
    profile_type: "guideline",
    code: "ALP-GUID-25",
    description: "Guideline econômica 25mm",
    weight_kg_m: 0.45,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "bronze"],
    available: true,
    thickness_mm: 1.2,
    width_mm: 25,
    height_mm: 35,
  },
  {
    id: "alp-mf-40",
    name: "Aluprime Main Frame 40mm",
    manufacturer: "Aluprime",
    line: "Aluprime",
    profile_type: "main_frame",
    code: "ALP-MF-40",
    description: "Batente 40mm standard",
    weight_kg_m: 0.68,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "bronze"],
    available: true,
    thickness_mm: 1.3,
    width_mm: 40,
    height_mm: 40,
    inertia_x: 3.5,
    inertia_y: 3.2,
  },
  {
    id: "alp-mf-60",
    name: "Aluprime Main Frame 60mm",
    manufacturer: "Aluprime",
    line: "Aluprime",
    profile_type: "main_frame_60",
    code: "ALP-MF-60",
    description: "Batente 60mm porta",
    weight_kg_m: 0.95,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "bronze"],
    available: true,
    thickness_mm: 1.6,
    width_mm: 60,
    height_mm: 60,
    inertia_x: 10.5,
    inertia_y: 9.2,
  },
];

// ===== DECA =====
export const decaProfiles: SupplierProfile[] = [
  {
    id: "dec-mf-45",
    name: "Deca Main Frame 45mm",
    manufacturer: "Deca",
    line: "Deca",
    profile_type: "main_frame",
    code: "DEC-MF-45",
    description: "Batente 45mm Deca",
    weight_kg_m: 0.75,
    standard_mm: 6000,
    color_finishes: ["branco", "bronze"],
    available: true,
    thickness_mm: 1.4,
    width_mm: 45,
    height_mm: 45,
    inertia_x: 5.8,
    inertia_y: 5.2,
  },
  {
    id: "dec-guid-35",
    name: "Deca Guideline 35mm",
    manufacturer: "Deca",
    line: "Deca",
    profile_type: "guideline",
    code: "DEC-GUID-35",
    description: "Guideline 35mm Deca",
    weight_kg_m: 0.55,
    standard_mm: 6000,
    color_finishes: ["branco", "bronze"],
    available: true,
    thickness_mm: 1.3,
    width_mm: 35,
    height_mm: 42,
  },
];

// ===== TAMIZZI (Italínea) =====
export const tamizziProfiles: SupplierProfile[] = [
  {
    id: "tam-mf-45",
    name: "Tamizzi Main Frame 45mm",
    manufacturer: "Tamizzi (Italínea)",
    line: "Tamizzi",
    profile_type: "main_frame",
    code: "TAM-MF-45",
    description: "Batente 45mm Tamizzi Premium",
    weight_kg_m: 0.82,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "bronze", "preto"],
    available: true,
    thickness_mm: 1.5,
    width_mm: 45,
    height_mm: 45,
    inertia_x: 6.2,
    inertia_y: 5.5,
  },
  {
    id: "tam-mf-55",
    name: "Tamizzi Main Frame 55mm",
    manufacturer: "Tamizzi (Italínea)",
    line: "Tamizzi",
    profile_type: "main_frame_60",
    code: "TAM-MF-55",
    description: "Batente 55mm Tamizzi",
    weight_kg_m: 0.98,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "bronze", "preto"],
    available: true,
    thickness_mm: 1.7,
    width_mm: 55,
    height_mm: 55,
    inertia_x: 9.8,
    inertia_y: 8.6,
  },
  {
    id: "tam-guid-40",
    name: "Tamizzi Guideline 40mm",
    manufacturer: "Tamizzi (Italínea)",
    line: "Tamizzi",
    profile_type: "guideline",
    code: "TAM-GUID-40",
    description: "Guideline 40mm Tamizzi",
    weight_kg_m: 0.62,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "bronze", "preto"],
    available: true,
    thickness_mm: 1.4,
    width_mm: 40,
    height_mm: 48,
  },
];

// ===== ALUVID (Vidual) =====
export const aluvidProfiles: SupplierProfile[] = [
  {
    id: "alv-mf-42",
    name: "Aluvid Main Frame 42mm",
    manufacturer: "Aluvid (Vidual)",
    line: "Aluvid",
    profile_type: "main_frame",
    code: "ALV-MF-42",
    description: "Batente 42mm Aluvid",
    weight_kg_m: 0.70,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "bronze", "grafite"],
    available: true,
    thickness_mm: 1.4,
    width_mm: 42,
    height_mm: 42,
    inertia_x: 4.5,
    inertia_y: 4.0,
  },
  {
    id: "alv-guid-28",
    name: "Aluvid Guideline 28mm",
    manufacturer: "Aluvid (Vidual)",
    line: "Aluvid",
    profile_type: "guideline",
    code: "ALV-GUID-28",
    description: "Guideline 28mm Aluvid",
    weight_kg_m: 0.50,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "bronze", "grafite"],
    available: true,
    thickness_mm: 1.3,
    width_mm: 28,
    height_mm: 38,
  },
];

// ===== GLASTER (Beaut/Arazil) =====
export const glasterProfiles: SupplierProfile[] = [
  {
    id: "gls-mf-40",
    name: "Glaster Main Frame 40mm",
    manufacturer: "Glaster (Beaut/Arazil)",
    line: "Glaster",
    profile_type: "main_frame",
    code: "GLS-MF-40",
    description: "Batente 40mm Glaster",
    weight_kg_m: 0.68,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "bronze"],
    available: true,
    thickness_mm: 1.3,
    width_mm: 40,
    height_mm: 40,
    inertia_x: 3.8,
    inertia_y: 3.4,
  },
  {
    id: "gls-mf-55",
    name: "Glaster Main Frame 55mm",
    manufacturer: "Glaster (Beaut/Arazil)",
    line: "Glaster",
    profile_type: "main_frame_60",
    code: "GLS-MF-55",
    description: "Batente 55mm Glaster",
    weight_kg_m: 0.88,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "bronze"],
    available: true,
    thickness_mm: 1.5,
    width_mm: 55,
    height_mm: 55,
    inertia_x: 8.5,
    inertia_y: 7.4,
  },
];

// ===== ALL PROFILES =====
export const allSupplierProfiles: SupplierProfile[] = [
  ...goldProfiles,
  ...supremaProfiles,
  ...aluprimeProfiles,
  ...decaProfiles,
  ...tamizziProfiles,
  ...aluvidProfiles,
  ...glasterProfiles,
];

// ===== CUT RULES (Standard for most profiles) =====
export const standardCutRules: CutRule[] = [
  // Standard 90 degree cuts
  { profile_id: "all", cut_type: "straight", allowance_mm: 0, blade_thickness_mm: 3, description: "Corte reto padrão" },
  // 45 degree cuts for frames
  { profile_id: "all-main_frame", cut_type: "45deg", allowance_mm: 0, blade_thickness_mm: 3, description: "Corte 45° para canto" },
  { profile_id: "all-main_frame_60", cut_type: "45deg", allowance_mm: 0, blade_thickness_mm: 3, description: "Corte 45° para canto" },
];

// ===== GLASSES =====
export const supplierGlasses: SupplierGlass[] = [
  // BFV
  { id: "bfv-4-incolor", name: "BFV 4mm Incolor", manufacturer: "BFV", type: "temperado", thickness_mm: 4, color: "incolor", price_m2: 85.00, available: true },
  { id: "bfv-5-incolor", name: "BFV 5mm Incolor", manufacturer: "BFV", type: "temperado", thickness_mm: 5, color: "incolor", price_m2: 98.00, available: true },
  { id: "bfv-6-incolor", name: "BFV 6mm Incolor", manufacturer: "BFV", type: "temperado", thickness_mm: 6, color: "incolor", price_m2: 115.00, available: true },
  { id: "bfv-8-incolor", name: "BFV 8mm Incolor", manufacturer: "BFV", type: "temperado", thickness_mm: 8, color: "incolor", price_m2: 145.00, available: true },
  { id: "bfv-10-incolor", name: "BFV 10mm Incolor", manufacturer: "BFV", type: "temperado", thickness_mm: 10, color: "incolor", price_m2: 185.00, available: true },
  { id: "bfv-6-refletivo", name: "BFV 6mm Refletivo Bronze", manufacturer: "BFV", type: "refletivo", thickness_mm: 6, color: "bronze", price_m2: 165.00, available: true },
  { id: "bfv-6-refletivo-prata", name: "BFV 6mm Refletivo Prata", manufacturer: "BFV", type: "refletivo", thickness_mm: 6, color: "prata", price_m2: 175.00, available: true },
  { id: "bfv-6-branco", name: "BFV 6mm Branco", manufacturer: "BFV", type: "fantasia", thickness_mm: 6, color: "branco", price_m2: 155.00, available: true },
  // CEMPERFIL
  { id: "cemp-4-incolor", name: "Cemperfil 4mm Incolor", manufacturer: "Cemperfil", type: "laminado", thickness_mm: 4, color: "incolor", price_m2: 95.00, available: true },
  { id: "cemp-6-incolor", name: "Cemperfil 6mm Incolor", manufacturer: "Cemperfil", type: "laminado", thickness_mm: 6, color: "incolor", price_m2: 125.00, available: true },
  // BOX INGLÊS
  { id: "box-4-incolor", name: "Box Inglês 4mm Incolor", manufacturer: "Box Inglês", type: "temperado", thickness_mm: 4, color: "incolor", price_m2: 75.00, available: true },
  { id: "box-6-fumê", name: "Box Inglês 6mm Fumê", manufacturer: "Box Inglês", type: "temperado", thickness_mm: 6, color: "fume", price_m2: 135.00, available: true },
  // TERMOCUILT
  { id: "term-20-incolor", name: "Termocuil 20mm Incolor", manufacturer: "Termocuil", type: "insulado", thickness_mm: 20, color: "incolor", price_m2: 320.00, available: true },
  { id: "term-24-bronze", name: "Termocuil 24mm Bronze", manufacturer: "Termocuil", type: "insulado", thickness_mm: 24, color: "bronze", price_m2: 385.00, available: true },
];

// ===== COMPONENTS =====
export const supplierComponents: SupplierComponent[] = [
  // Pormade - Rolamentos
  { id: "porm-rol-20d", name: "Rolamento Duplo 20mm", manufacturer: "Pormade", type: "rolamento", code: "PORM-ROL-20D", unit: "peça", price: 14.50, available: true },
  { id: "porm-rol-25d", name: "Rolamento Duplo 25mm", manufacturer: "Pormade", type: "rolamento", code: "PORM-ROL-25D", unit: "peça", price: 16.80, available: true },
  { id: "porm-rol-30d", name: "Rolamento Duplo 30mm", manufacturer: "Pormade", type: "rolamento", code: "PORM-ROL-30D", unit: "peça", price: 19.20, available: true },
  { id: "porm-rol-35d", name: "Rolamento Duplo 35mm", manufacturer: "Pormade", type: "rolamento", code: "PORM-ROL-35D", unit: "peça", price: 22.50, available: true },
  // Pormade - Trincos
  { id: "porm-tri-01", name: "Trinco Lateral 2 Pontas", manufacturer: "Pormade", type: "trinco", code: "PORM-TRI-02P", unit: "peça", price: 28.00, available: true },
  { id: "porm-tri-02", name: "Trinco Central 3 Pontas", manufacturer: "Pormade", type: "trinco", code: "PORM-TRI-03P", unit: "peça", price: 35.00, available: true },
  { id: "porm-tri-03", name: "Trinco para Portão", manufacturer: "Pormade", type: "trinco", code: "PORM-TRI-PORT", unit: "peça", price: 45.00, available: true },
  // Pormade - Cremalheiras
  { id: "porm-crem-16", name: "Cremalheira 16 dentes (6m)", manufacturer: "Pormade", type: "cremalheira", code: "PORM-CREM-16", unit: "barra", price: 85.00, available: true },
  { id: "porm-crem-18", name: "Cremalheira 18 dentes (6m)", manufacturer: "Pormade", type: "cremalheira", code: "PORM-CREM-18", unit: "barra", price: 95.00, available: true },
  // Pormade - Guias
  { id: "porm-rold-01", name: "Roldana Dupla para Guia", manufacturer: "Pormade", type: "roldana", code: "PORM-ROLD-D", unit: "peça", price: 8.50, available: true },
  // Suprema - Borrachas
  { id: "sup-borr-10m", name: "Borracha Vedação 10m", manufacturer: "Suprema", type: "borracha", code: "SUP-BORR-10M", unit: "rolo", price: 35.00, available: true },
  { id: "sup-guarn-10m", name: "Guarnição Perimetral 10m", manufacturer: "Suprema", type: "guarnicao", code: "SUP-GUARN-10M", unit: "rolo", price: 42.00, available: true },
  // Gold - Cantoneiras
  { id: "gold-can-30", name: "Cantoneira 30x30mm (6m)", manufacturer: "Gold", type: "cantoneira", code: "GOLD-CAN-30", unit: "barra", price: 28.00, available: true },
  { id: "gold-can-40", name: "Cantoneira 40x40mm (6m)", manufacturer: "Gold", type: "cantoneira", code: "GOLD-CAN-40", unit: "barra", price: 35.00, available: true },
  // Puxadores
  { id: "pux-ret-150", name: "Puxador Reto 150mm", manufacturer: "Pormade", type: "puxador", code: "PUX-RET-150", unit: "peça", price: 18.00, available: true },
  { id: "pux-ret-200", name: "Puxador Reto 200mm", manufacturer: "Pormade", type: "puxador", code: "PUX-RET-200", unit: "peça", price: 22.00, available: true },
  { id: "pux-arc-150", name: "Puxador Arredondado 150mm", manufacturer: "Pormade", type: "puxador", code: "PUX-ARC-150", unit: "peça", price: 25.00, available: true },
  // Fechos
  { id: "fech-01", name: "Fecho Interno Portão", manufacturer: "Pormade", type: "fecho", code: "FECH-INT-01", unit: "peça", price: 32.00, available: true },
];

// ===== HELPER FUNCTIONS =====
export function getProfilesByLine(line: string): SupplierProfile[] {
  const lineLower = line.toLowerCase();
  return allSupplierProfiles.filter(p => 
    p.line.toLowerCase().includes(lineLower) || 
    p.manufacturer.toLowerCase().includes(lineLower)
  );
}

export function getProfilesByType(type: string): SupplierProfile[] {
  return allSupplierProfiles.filter(p => p.profile_type === type);
}

export function getGlassesByThickness(thickness: number): SupplierGlass[] {
  return supplierGlasses.filter(g => g.thickness_mm === thickness);
}

export function getGlassesByType(type: string): SupplierGlass[] {
  return supplierGlasses.filter(g => g.type === type);
}

export function getComponentsByType(type: string): SupplierComponent[] {
  return supplierComponents.filter(c => c.type === type);
}

export function getComponentPrice(id: string): number {
  const comp = supplierComponents.find(c => c.id === id);
  return comp?.price || 0;
}

// Get all manufacturers
export function getAllManufacturers(): string[] {
  const manufacturers = new Set(allSupplierProfiles.map(p => p.manufacturer));
  return Array.from(manufacturers).sort();
}

// Get all lines
export function getAllLines(): { manufacturer: string; line: string }[] {
  const lines = new Map<string, { manufacturer: string; line: string }>();
  allSupplierProfiles.forEach(p => {
    const key = `${p.manufacturer}-${p.line}`;
    if (!lines.has(key)) {
      lines.set(key, { manufacturer: p.manufacturer, line: p.line });
    }
  });
  return Array.from(lines.values()).sort((a, b) => a.manufacturer.localeCompare(b.manufacturer));
}
