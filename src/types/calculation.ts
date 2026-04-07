// ============================================
// TIPOS DO MOTOR DE CÁLCULO DE ESQUADRIAS
// ============================================

export interface Manufacturer {
  id: string;
  name: string;
  logo_url?: string;
  active: boolean;
}

export interface ProductLine {
  id: string;
  manufacturer_id: string;
  name: string;
  bitola_mm: number;
  description?: string;
  active: boolean;
}

export interface Profile {
  id: string;
  product_line_id: string;
  code: string;
  name: string;
  profile_type: 'marco' | 'montante' | 'travessa' | 'trilho' | 'baguete' | 'contramarco' | 'arremate' | 'guia' | 'adaptador';
  weight_per_meter: number;
  bar_length_mm: number;
  material: string;
  active: boolean;
  notes?: string;
}

export interface Typology {
  id: string;
  product_line_id: string;
  name: string;
  category: 'janela' | 'porta' | 'vitro' | 'veneziana' | 'maxim_ar' | 'camarao' | 'pivotante' | 'basculante' | 'fachada';
  subcategory?: 'correr' | 'giro' | 'maxim_ar' | 'camarao' | 'basculante' | 'pivotante' | 'fixo' | 'curtain_wall' | 'muro_cortina';
  num_folhas: number;
  has_veneziana: boolean;
  has_bandeira: boolean;
  drawing_url?: string;
  notes?: string;
  active: boolean;
  /** Dimensões mínimas e máximas do vão em mm */
  min_width_mm?: number;
  max_width_mm?: number;
  min_height_mm?: number;
  max_height_mm?: number;
}

export interface CutRule {
  id: string;
  typology_id: string;
  profile_id: string;
  piece_name: string;
  piece_function: string;
  reference_dimension: 'L' | 'H' | 'L/2' | 'L/3' | 'L/4' | 'L/6' | 'H/2' | 'H/3' | 'FIXED';
  coefficient: number;
  constant_mm: number;
  fixed_value_mm: number | null;
  cut_angle_left: number;
  cut_angle_right: number;
  quantity_formula: string;
  sort_order: number;
  notes?: string;
  // Joined from profile
  profile_code?: string;
  weight_per_meter?: number;
}

export interface GlassRule {
  id: string;
  typology_id: string;
  glass_name: string;
  width_reference: string;
  width_constant_mm: number;
  height_reference: string;
  height_constant_mm: number;
  quantity: number;
  glass_type?: string;
  min_thickness_mm?: number;
  max_thickness_mm?: number;
}

export interface TypologyComponent {
  id: string;
  typology_id: string;
  component_name: string;
  component_code?: string;
  component_type: string;
  quantity_formula: string;
  unit: string;
  length_reference?: string;
  length_constant_mm?: number;
}

// ============================================
// INPUTS E OUTPUTS DO CÁLCULO
// ============================================

export interface CalculationInput {
  typology_id: string;
  width_mm: number;
  height_mm: number;
  quantity: number;
  num_folhas?: number;
  glass_type?: string;
  glass_thickness_mm?: number;
  color?: string;
  location_label?: string;
}

export interface CutResult {
  cut_rule_id: string;
  profile_id: string;
  profile_code: string;
  piece_name: string;
  piece_function: string;
  cut_length_mm: number;
  cut_angle_left: number;
  cut_angle_right: number;
  quantity: number;
  weight_kg: number;
}

export interface GlassResult {
  glass_rule_id: string;
  glass_name: string;
  width_mm: number;
  height_mm: number;
  quantity: number;
  area_m2: number;
}

export interface ComponentResult {
  component_name: string;
  component_code?: string;
  component_type: string;
  quantity: number;
  unit: string;
  total_length_mm?: number;
}

export interface ProfileSummary {
  profile_code: string;
  profile_name: string;
  total_length_mm: number;
  total_bars_needed: number;
  weight_per_meter: number;
  total_weight_kg: number;
}

export interface CalculationOutput {
  input: CalculationInput;
  typology_name: string;
  cuts: CutResult[];
  glasses: GlassResult[];
  components: ComponentResult[];
  total_aluminum_weight_kg: number;
  total_glass_area_m2: number;
  profiles_summary: ProfileSummary[];
}

// ============================================
// OTIMIZAÇÃO DE BARRAS
// ============================================

export interface CutPiece {
  id: string;
  length_mm: number;
  label: string;
  profile_code: string;
}

export interface BarPiece {
  cut_piece_id: string;
  position_mm: number;
  length_mm: number;
  label: string;
}

export interface Bar {
  bar_number: number;
  pieces: BarPiece[];
  waste_mm: number;
  utilization_percent: number;
}

export interface OptimizationResult {
  profile_code: string;
  bar_length_mm: number;
  bars: Bar[];
  total_bars: number;
  total_waste_mm: number;
  overall_utilization_percent: number;
}
