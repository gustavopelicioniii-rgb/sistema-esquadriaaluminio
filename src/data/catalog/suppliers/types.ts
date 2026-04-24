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
