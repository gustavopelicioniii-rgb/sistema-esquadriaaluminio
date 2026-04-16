// MOF - Mídia Oficial do Fornecedor
// Bibliotecas oficiais dos principais fabricantes

export interface SupplierProfile {
  id: string;
  name: string;
  manufacturer: string;
  line: string;
  profile_type: string;
  code: string;
  description: string;
  weight_kg_m: number;
  standard_mm: number;
  color_finishes: string[];
  available: boolean;
}

export interface SupplierGlass {
  id: string;
  name: string;
  manufacturer: string;
  type: string;
  thickness_mm: number;
  price_m2: number;
  available: boolean;
}

export interface SupplierComponent {
  id: string;
  name: string;
  manufacturer: string;
  type: string;
  code: string;
  unit: string;
  price: number;
  available: boolean;
}

// ===== GOLD (Alcoa) =====
export const goldProfiles: SupplierProfile[] = [
  {
    id: "gold-01",
    name: "Gold 01 -hs- Pingadeira",
    manufacturer: "Gold (Alcoa)",
    line: "Gold",
    profile_type: "pingadeira",
    code: "GOLD-01",
    description: "Pingadeira para janelas",
    weight_kg_m: 0.42,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "bronze"],
    available: true,
  },
  {
    id: "gold-02",
    name: "Gold 02 -hs- Guideline",
    manufacturer: "Gold (Alcoa)",
    line: "Gold",
    profile_type: "guideline",
    code: "GOLD-02",
    description: "Guideline para porta",
    weight_kg_m: 0.68,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "bronze"],
    available: true,
  },
  {
    id: "gold-03",
    name: "Gold 03 -hs- Main Frame",
    manufacturer: "Gold (Alcoa)",
    line: "Gold",
    profile_type: "main_frame",
    code: "GOLD-03",
    description: "Batente principal",
    weight_kg_m: 0.85,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "bronze"],
    available: true,
  },
];

// ===== SUPREMA (Novelis) =====
export const supremaProfiles: SupplierProfile[] = [
  {
    id: "suprema-01",
    name: "Suprema 01 -hs- Pingadeira",
    manufacturer: "Suprema (Novelis)",
    line: "Suprema",
    profile_type: "pingadeira",
    code: "SUP-01",
    description: "Pingadeira para janelas",
    weight_kg_m: 0.38,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "preto", "bronze", "champagne"],
    available: true,
  },
  {
    id: "suprema-02",
    name: "Suprema 02 -hs- Guideline",
    manufacturer: "Suprema (Novelis)",
    line: "Suprema",
    profile_type: "guideline",
    code: "SUP-02",
    description: "Guideline para porta deslizante",
    weight_kg_m: 0.62,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "preto", "bronze", "champagne"],
    available: true,
  },
  {
    id: "suprema-03",
    name: "Suprema 03 -hs- Main Frame 40mm",
    manufacturer: "Suprema (Novelis)",
    line: "Suprema",
    profile_type: "main_frame",
    code: "SUP-03",
    description: "Batente 40mm para janela",
    weight_kg_m: 0.78,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "preto", "bronze", "champagne"],
    available: true,
  },
  {
    id: "suprema-04",
    name: "Suprema 04 -hs- Main Frame 60mm",
    manufacturer: "Suprema (Novelis)",
    line: "Suprema",
    profile_type: "main_frame_60",
    code: "SUP-04",
    description: "Batente 60mm para porta",
    weight_kg_m: 1.05,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "preto", "bronze", "champagne"],
    available: true,
  },
];

// ===== ALUPRIME =====
export const aluprimeProfiles: SupplierProfile[] = [
  {
    id: "aluprime-01",
    name: "Aluprime 01 -hs- Pingadeira",
    manufacturer: "Aluprime",
    line: "Aluprime",
    profile_type: "pingadeira",
    code: "ALP-01",
    description: "Pingadeira standard",
    weight_kg_m: 0.35,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "bronze"],
    available: true,
  },
  {
    id: "aluprime-02",
    name: "Aluprime 02 -hs- Guideline 30mm",
    manufacturer: "Aluprime",
    line: "Aluprime",
    profile_type: "guideline_30",
    code: "ALP-02",
    description: "Guideline 30mm",
    weight_kg_m: 0.55,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "bronze"],
    available: true,
  },
];

// ===== DECA =====
export const decaProfiles: SupplierProfile[] = [
  {
    id: "deca-01",
    name: "Deca 01 -hs- Batente 20mm",
    manufacturer: "Deca",
    line: "Deca",
    profile_type: "batente_20",
    code: "DECA-01",
    description: "Batente 20mm",
    weight_kg_m: 0.45,
    standard_mm: 6000,
    color_finishes: ["branco", "bronze"],
    available: true,
  },
];

// ===== All Profiles =====
export const allSupplierProfiles: SupplierProfile[] = [
  ...goldProfiles,
  ...supremaProfiles,
  ...aluprimeProfiles,
  ...decaProfiles,
];

// ===== Glasses by Supplier =====
export const supplierGlasses: SupplierGlass[] = [
  {
    id: "glass-bfv-4mm",
    name: "BFV 4mm Incolor",
    manufacturer: "BFV",
    type: "temperado",
    thickness_mm: 4,
    price_m2: 85.00,
    available: true,
  },
  {
    id: "glass-bfv-6mm",
    name: "BFV 6mm Incolor",
    manufacturer: "BFV",
    type: "temperado",
    thickness_mm: 6,
    price_m2: 120.00,
    available: true,
  },
  {
    id: "glass-bfv-8mm",
    name: "BFV 8mm Incolor",
    manufacturer: "BFV",
    type: "temperado",
    thickness_mm: 8,
    price_m2: 155.00,
    available: true,
  },
  {
    id: "glass-cemperfil-4mm",
    name: "Cemperfil 4mm",
    manufacturer: "Cemperfil",
    type: "laminado",
    thickness_mm: 4,
    price_m2: 95.00,
    available: true,
  },
  {
    id: "glass-bfv-refletivo-6mm",
    name: "BFV 6mm Refletivo",
    manufacturer: "BFV",
    type: "temperado_refletivo",
    thickness_mm: 6,
    price_m2: 145.00,
    available: true,
  },
];

// ===== Components by Supplier =====
export const supplierComponents: SupplierComponent[] = [
  {
    id: "comp-rolamento-01",
    name: "Rolamento 20mm Duplo",
    manufacturer: "Pormade",
    type: "rolamento",
    code: "PORM-ROL-20",
    unit: "peça",
    price: 12.50,
    available: true,
  },
  {
    id: "comp-rolamento-02",
    name: "Rolamento 30mm Duplo",
    manufacturer: "Pormade",
    type: "rolamento",
    code: "PORM-ROL-30",
    unit: "peça",
    price: 15.00,
    available: true,
  },
  {
    id: "comp-trinco-01",
    name: "Trinco para Portão",
    manufacturer: "Pormade",
    type: "trinco",
    code: "PORM-TRI-01",
    unit: "peça",
    price: 28.00,
    available: true,
  },
  {
    id: "comp-cantoneira-01",
    name: "Cantoneira 30x30mm",
    manufacturer: "Gold",
    type: "cantoneira",
    code: "GOLD-CAN-30",
    unit: "peça",
    price: 4.50,
    available: true,
  },
  {
    id: "comp-borracha-01",
    name: "Borracha Vedação 10m",
    manufacturer: "Suprema",
    type: "borracha",
    code: "SUP-BOR-10",
    unit: "rolo",
    price: 35.00,
    available: true,
  },
];

// ===== Helper Functions =====
export function getProfilesByLine(line: string): SupplierProfile[] {
  return allSupplierProfiles.filter(p => p.line.toLowerCase().includes(line.toLowerCase()));
}

export function getProfilesByManufacturer(manufacturer: string): SupplierProfile[] {
  return allSupplierProfiles.filter(p => p.manufacturer.toLowerCase().includes(manufacturer.toLowerCase()));
}

export function getGlassesByThickness(thickness: number): SupplierGlass[] {
  return supplierGlasses.filter(g => g.thickness_mm === thickness);
}

export function getComponentsByType(type: string): SupplierComponent[] {
  return supplierComponents.filter(c => c.type === type);
}
