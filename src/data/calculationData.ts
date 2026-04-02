import type {
  Manufacturer,
  ProductLine,
  Profile,
  Typology,
  CutRule,
  GlassRule,
  TypologyComponent,
} from "@/types/calculation";

// ============================================
// FABRICANTES
// ============================================
export const manufacturers: Manufacturer[] = [
  { id: "fab-alcoa", name: "Alcoa / Novelis", active: true },
  { id: "fab-hydro", name: "Hydro", active: true },
  { id: "fab-belmetal", name: "Belmetal", active: true },
];

// ============================================
// LINHAS DE PRODUTO
// ============================================
export const productLines: ProductLine[] = [
  { id: "line-suprema", manufacturer_id: "fab-alcoa", name: "Suprema", bitola_mm: 25, description: "Linha 25mm - residencial e edifícios", active: true },
  { id: "line-gold", manufacturer_id: "fab-alcoa", name: "Gold", bitola_mm: 32, description: "Linha 32mm - alto padrão", active: true },
  { id: "line-mp", manufacturer_id: "fab-alcoa", name: "Módulo Prático", bitola_mm: 20, description: "Linha 20mm - econômica", active: true },
];

// ============================================
// PERFIS - LINHA SUPREMA
// ============================================
export const profiles: Profile[] = [
  // Marcos
  { id: "p-su010", product_line_id: "line-suprema", code: "SU-010", name: "Marco Superior", profile_type: "marco", weight_per_meter: 0.450, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su012", product_line_id: "line-suprema", code: "SU-012", name: "Marco Inferior / Trilho", profile_type: "trilho", weight_per_meter: 0.520, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su014", product_line_id: "line-suprema", code: "SU-014", name: "Marco Lateral", profile_type: "marco", weight_per_meter: 0.380, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  // Folhas de correr
  { id: "p-su039", product_line_id: "line-suprema", code: "SU-039", name: "Montante Folha de Correr", profile_type: "montante", weight_per_meter: 0.631, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su053", product_line_id: "line-suprema", code: "SU-053", name: "Travessa Folha de Correr", profile_type: "travessa", weight_per_meter: 0.485, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  // Baguetes
  { id: "p-isu502", product_line_id: "line-suprema", code: "ISU-502", name: "Baguete", profile_type: "baguete", weight_per_meter: 0.120, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  // Contramarco
  { id: "p-cm200", product_line_id: "line-suprema", code: "CM-200", name: "Contramarco", profile_type: "contramarco", weight_per_meter: 0.250, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  // Porta de giro
  { id: "p-su089", product_line_id: "line-suprema", code: "SU-089", name: "Marco Porta de Giro", profile_type: "marco", weight_per_meter: 0.580, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su111", product_line_id: "line-suprema", code: "SU-111", name: "Montante/Travessa Porta Giro", profile_type: "montante", weight_per_meter: 0.720, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  // Maxim-ar
  { id: "p-su060", product_line_id: "line-suprema", code: "SU-060", name: "Marco Maxim-Ar", profile_type: "marco", weight_per_meter: 0.410, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su062", product_line_id: "line-suprema", code: "SU-062", name: "Montante Maxim-Ar", profile_type: "montante", weight_per_meter: 0.550, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su064", product_line_id: "line-suprema", code: "SU-064", name: "Travessa Maxim-Ar", profile_type: "travessa", weight_per_meter: 0.510, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  // Porta de correr
  { id: "p-su070", product_line_id: "line-suprema", code: "SU-070", name: "Marco Superior Porta Correr", profile_type: "marco", weight_per_meter: 0.600, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su072", product_line_id: "line-suprema", code: "SU-072", name: "Trilho Inferior Porta Correr", profile_type: "trilho", weight_per_meter: 0.680, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su074", product_line_id: "line-suprema", code: "SU-074", name: "Marco Lateral Porta Correr", profile_type: "marco", weight_per_meter: 0.520, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su076", product_line_id: "line-suprema", code: "SU-076", name: "Montante Porta Correr", profile_type: "montante", weight_per_meter: 0.750, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su078", product_line_id: "line-suprema", code: "SU-078", name: "Travessa Porta Correr", profile_type: "travessa", weight_per_meter: 0.620, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  // Basculante
  { id: "p-su080", product_line_id: "line-suprema", code: "SU-080", name: "Marco Basculante", profile_type: "marco", weight_per_meter: 0.390, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su082", product_line_id: "line-suprema", code: "SU-082", name: "Folha Basculante", profile_type: "montante", weight_per_meter: 0.460, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  // Vitro fixo
  { id: "p-su090", product_line_id: "line-suprema", code: "SU-090", name: "Marco Vitro Fixo", profile_type: "marco", weight_per_meter: 0.420, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  // Veneziana
  { id: "p-su095", product_line_id: "line-suprema", code: "SU-095", name: "Montante Veneziana", profile_type: "montante", weight_per_meter: 0.580, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su097", product_line_id: "line-suprema", code: "SU-097", name: "Travessa Veneziana", profile_type: "travessa", weight_per_meter: 0.490, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  // Guia
  { id: "p-su100", product_line_id: "line-suprema", code: "SU-100", name: "Guia Lateral", profile_type: "guia", weight_per_meter: 0.290, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
];

// ============================================
// TIPOLOGIAS - LINHA SUPREMA
// ============================================
export const typologies: Typology[] = [
  { id: "typ-jc2f", product_line_id: "line-suprema", name: "Janela 2 Folhas de Correr", category: "janela", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true },
  { id: "typ-jc3f", product_line_id: "line-suprema", name: "Janela 3 Folhas de Correr", category: "janela", subcategory: "correr", num_folhas: 3, has_veneziana: false, has_bandeira: false, active: true },
  { id: "typ-jc4f", product_line_id: "line-suprema", name: "Janela 4 Folhas de Correr", category: "janela", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true },
  { id: "typ-jma", product_line_id: "line-suprema", name: "Janela Maxim-Ar", category: "maxim_ar", subcategory: "maxim_ar", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true },
  { id: "typ-jma2", product_line_id: "line-suprema", name: "Janela Maxim-Ar 2 Folhas", category: "maxim_ar", subcategory: "maxim_ar", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true },
  { id: "typ-pc2f", product_line_id: "line-suprema", name: "Porta 2 Folhas de Correr", category: "porta", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true },
  { id: "typ-pc4f", product_line_id: "line-suprema", name: "Porta 4 Folhas de Correr", category: "porta", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true },
  { id: "typ-pg1f", product_line_id: "line-suprema", name: "Porta de Giro 1 Folha", category: "porta", subcategory: "giro", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true },
  { id: "typ-jbasc", product_line_id: "line-suprema", name: "Janela Basculante", category: "basculante", subcategory: "basculante", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true },
  { id: "typ-vf", product_line_id: "line-suprema", name: "Vitro Fixo", category: "vitro", subcategory: "fixo", num_folhas: 0, has_veneziana: false, has_bandeira: false, active: true },
  { id: "typ-jc2fv", product_line_id: "line-suprema", name: "Janela 2 Folhas de Correr com Veneziana", category: "veneziana", subcategory: "correr", num_folhas: 2, has_veneziana: true, has_bandeira: false, active: true },
];

// ============================================
// REGRAS DE CORTE - POR TIPOLOGIA
// ============================================
export const cutRules: CutRule[] = [
  // ========================================
  // JANELA 2 FOLHAS DE CORRER (typ-jc2f)
  // ========================================
  { id: "cr-jc2f-01", typology_id: "typ-jc2f", profile_id: "p-su010", piece_name: "Marco Superior", piece_function: "marco_sup", reference_dimension: "L", coefficient: 1, constant_mm: -6, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "1", sort_order: 1, profile_code: "SU-010", weight_per_meter: 0.450 },
  { id: "cr-jc2f-02", typology_id: "typ-jc2f", profile_id: "p-su012", piece_name: "Marco Inferior (Trilho)", piece_function: "marco_inf", reference_dimension: "L", coefficient: 1, constant_mm: -6, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "1", sort_order: 2, profile_code: "SU-012", weight_per_meter: 0.520 },
  { id: "cr-jc2f-03", typology_id: "typ-jc2f", profile_id: "p-su014", piece_name: "Marco Lateral", piece_function: "marco_lat", reference_dimension: "H", coefficient: 1, constant_mm: -57, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 3, profile_code: "SU-014", weight_per_meter: 0.380 },
  { id: "cr-jc2f-04", typology_id: "typ-jc2f", profile_id: "p-su039", piece_name: "Montante Folha", piece_function: "montante", reference_dimension: "H", coefficient: 1, constant_mm: -127, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "num_folhas * 2", sort_order: 4, profile_code: "SU-039", weight_per_meter: 0.631 },
  { id: "cr-jc2f-05", typology_id: "typ-jc2f", profile_id: "p-su053", piece_name: "Travessa Superior Folha", piece_function: "travessa_sup", reference_dimension: "L/2", coefficient: 1, constant_mm: -74, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "num_folhas", sort_order: 5, profile_code: "SU-053", weight_per_meter: 0.485 },
  { id: "cr-jc2f-06", typology_id: "typ-jc2f", profile_id: "p-su053", piece_name: "Travessa Inferior Folha", piece_function: "travessa_inf", reference_dimension: "L/2", coefficient: 1, constant_mm: -74, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "num_folhas", sort_order: 6, profile_code: "SU-053", weight_per_meter: 0.485 },
  { id: "cr-jc2f-07", typology_id: "typ-jc2f", profile_id: "p-isu502", piece_name: "Baguete Vertical", piece_function: "baguete_v", reference_dimension: "H", coefficient: 1, constant_mm: -139, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "num_folhas * 2", sort_order: 7, profile_code: "ISU-502", weight_per_meter: 0.120 },
  { id: "cr-jc2f-08", typology_id: "typ-jc2f", profile_id: "p-isu502", piece_name: "Baguete Horizontal", piece_function: "baguete_h", reference_dimension: "L/2", coefficient: 1, constant_mm: -86, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "num_folhas * 2", sort_order: 8, profile_code: "ISU-502", weight_per_meter: 0.120 },
  { id: "cr-jc2f-09", typology_id: "typ-jc2f", profile_id: "p-cm200", piece_name: "Contramarco Lateral", piece_function: "contramarco_lat", reference_dimension: "H", coefficient: 1, constant_mm: -3, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 9, profile_code: "CM-200", weight_per_meter: 0.250 },
  { id: "cr-jc2f-10", typology_id: "typ-jc2f", profile_id: "p-cm200", piece_name: "Contramarco Sup/Inf", piece_function: "contramarco_h", reference_dimension: "L", coefficient: 1, constant_mm: -3, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 10, profile_code: "CM-200", weight_per_meter: 0.250 },

  // ========================================
  // JANELA 3 FOLHAS DE CORRER (typ-jc3f)
  // ========================================
  { id: "cr-jc3f-01", typology_id: "typ-jc3f", profile_id: "p-su010", piece_name: "Marco Superior", piece_function: "marco_sup", reference_dimension: "L", coefficient: 1, constant_mm: -6, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "1", sort_order: 1, profile_code: "SU-010", weight_per_meter: 0.450 },
  { id: "cr-jc3f-02", typology_id: "typ-jc3f", profile_id: "p-su012", piece_name: "Marco Inferior (Trilho)", piece_function: "marco_inf", reference_dimension: "L", coefficient: 1, constant_mm: -6, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "1", sort_order: 2, profile_code: "SU-012", weight_per_meter: 0.520 },
  { id: "cr-jc3f-03", typology_id: "typ-jc3f", profile_id: "p-su014", piece_name: "Marco Lateral", piece_function: "marco_lat", reference_dimension: "H", coefficient: 1, constant_mm: -57, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 3, profile_code: "SU-014", weight_per_meter: 0.380 },
  { id: "cr-jc3f-04", typology_id: "typ-jc3f", profile_id: "p-su039", piece_name: "Montante Folha", piece_function: "montante", reference_dimension: "H", coefficient: 1, constant_mm: -127, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "num_folhas * 2", sort_order: 4, profile_code: "SU-039", weight_per_meter: 0.631 },
  { id: "cr-jc3f-05", typology_id: "typ-jc3f", profile_id: "p-su053", piece_name: "Travessa Folha", piece_function: "travessa", reference_dimension: "L/3", coefficient: 1, constant_mm: -74, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "num_folhas * 2", sort_order: 5, profile_code: "SU-053", weight_per_meter: 0.485 },
  { id: "cr-jc3f-06", typology_id: "typ-jc3f", profile_id: "p-isu502", piece_name: "Baguete Vertical", piece_function: "baguete_v", reference_dimension: "H", coefficient: 1, constant_mm: -139, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "num_folhas * 2", sort_order: 6, profile_code: "ISU-502", weight_per_meter: 0.120 },
  { id: "cr-jc3f-07", typology_id: "typ-jc3f", profile_id: "p-isu502", piece_name: "Baguete Horizontal", piece_function: "baguete_h", reference_dimension: "L/3", coefficient: 1, constant_mm: -86, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "num_folhas * 2", sort_order: 7, profile_code: "ISU-502", weight_per_meter: 0.120 },
  { id: "cr-jc3f-08", typology_id: "typ-jc3f", profile_id: "p-cm200", piece_name: "Contramarco", piece_function: "contramarco", reference_dimension: "H", coefficient: 1, constant_mm: -3, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 8, profile_code: "CM-200", weight_per_meter: 0.250 },
  { id: "cr-jc3f-09", typology_id: "typ-jc3f", profile_id: "p-cm200", piece_name: "Contramarco Sup/Inf", piece_function: "contramarco_h", reference_dimension: "L", coefficient: 1, constant_mm: -3, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 9, profile_code: "CM-200", weight_per_meter: 0.250 },

  // ========================================
  // JANELA 4 FOLHAS DE CORRER (typ-jc4f)
  // ========================================
  { id: "cr-jc4f-01", typology_id: "typ-jc4f", profile_id: "p-su010", piece_name: "Marco Superior", piece_function: "marco_sup", reference_dimension: "L", coefficient: 1, constant_mm: -6, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "1", sort_order: 1, profile_code: "SU-010", weight_per_meter: 0.450 },
  { id: "cr-jc4f-02", typology_id: "typ-jc4f", profile_id: "p-su012", piece_name: "Marco Inferior (Trilho)", piece_function: "marco_inf", reference_dimension: "L", coefficient: 1, constant_mm: -6, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "1", sort_order: 2, profile_code: "SU-012", weight_per_meter: 0.520 },
  { id: "cr-jc4f-03", typology_id: "typ-jc4f", profile_id: "p-su014", piece_name: "Marco Lateral", piece_function: "marco_lat", reference_dimension: "H", coefficient: 1, constant_mm: -57, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 3, profile_code: "SU-014", weight_per_meter: 0.380 },
  { id: "cr-jc4f-04", typology_id: "typ-jc4f", profile_id: "p-su039", piece_name: "Montante Folha", piece_function: "montante", reference_dimension: "H", coefficient: 1, constant_mm: -127, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "num_folhas * 2", sort_order: 4, profile_code: "SU-039", weight_per_meter: 0.631 },
  { id: "cr-jc4f-05", typology_id: "typ-jc4f", profile_id: "p-su053", piece_name: "Travessa Folha", piece_function: "travessa", reference_dimension: "L/4", coefficient: 1, constant_mm: -74, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "num_folhas * 2", sort_order: 5, profile_code: "SU-053", weight_per_meter: 0.485 },
  { id: "cr-jc4f-06", typology_id: "typ-jc4f", profile_id: "p-isu502", piece_name: "Baguete Vertical", piece_function: "baguete_v", reference_dimension: "H", coefficient: 1, constant_mm: -139, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "num_folhas * 2", sort_order: 6, profile_code: "ISU-502", weight_per_meter: 0.120 },
  { id: "cr-jc4f-07", typology_id: "typ-jc4f", profile_id: "p-isu502", piece_name: "Baguete Horizontal", piece_function: "baguete_h", reference_dimension: "L/4", coefficient: 1, constant_mm: -86, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "num_folhas * 2", sort_order: 7, profile_code: "ISU-502", weight_per_meter: 0.120 },
  { id: "cr-jc4f-08", typology_id: "typ-jc4f", profile_id: "p-cm200", piece_name: "Contramarco Lateral", piece_function: "contramarco_lat", reference_dimension: "H", coefficient: 1, constant_mm: -3, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 8, profile_code: "CM-200", weight_per_meter: 0.250 },
  { id: "cr-jc4f-09", typology_id: "typ-jc4f", profile_id: "p-cm200", piece_name: "Contramarco Sup/Inf", piece_function: "contramarco_h", reference_dimension: "L", coefficient: 1, constant_mm: -3, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 9, profile_code: "CM-200", weight_per_meter: 0.250 },

  // ========================================
  // JANELA MAXIM-AR 1 FOLHA (typ-jma)
  // ========================================
  { id: "cr-jma-01", typology_id: "typ-jma", profile_id: "p-su060", piece_name: "Marco Superior", piece_function: "marco_sup", reference_dimension: "L", coefficient: 1, constant_mm: -8, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "1", sort_order: 1, profile_code: "SU-060", weight_per_meter: 0.410 },
  { id: "cr-jma-02", typology_id: "typ-jma", profile_id: "p-su060", piece_name: "Marco Inferior", piece_function: "marco_inf", reference_dimension: "L", coefficient: 1, constant_mm: -8, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "1", sort_order: 2, profile_code: "SU-060", weight_per_meter: 0.410 },
  { id: "cr-jma-03", typology_id: "typ-jma", profile_id: "p-su060", piece_name: "Marco Lateral", piece_function: "marco_lat", reference_dimension: "H", coefficient: 1, constant_mm: -55, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 3, profile_code: "SU-060", weight_per_meter: 0.410 },
  { id: "cr-jma-04", typology_id: "typ-jma", profile_id: "p-su062", piece_name: "Montante Folha", piece_function: "montante", reference_dimension: "H", coefficient: 1, constant_mm: -110, fixed_value_mm: null, cut_angle_left: 45, cut_angle_right: 45, quantity_formula: "2", sort_order: 4, profile_code: "SU-062", weight_per_meter: 0.550 },
  { id: "cr-jma-05", typology_id: "typ-jma", profile_id: "p-su064", piece_name: "Travessa Superior Folha", piece_function: "travessa_sup", reference_dimension: "L", coefficient: 1, constant_mm: -85, fixed_value_mm: null, cut_angle_left: 45, cut_angle_right: 45, quantity_formula: "1", sort_order: 5, profile_code: "SU-064", weight_per_meter: 0.510 },
  { id: "cr-jma-06", typology_id: "typ-jma", profile_id: "p-su064", piece_name: "Travessa Inferior Folha", piece_function: "travessa_inf", reference_dimension: "L", coefficient: 1, constant_mm: -85, fixed_value_mm: null, cut_angle_left: 45, cut_angle_right: 45, quantity_formula: "1", sort_order: 6, profile_code: "SU-064", weight_per_meter: 0.510 },
  { id: "cr-jma-07", typology_id: "typ-jma", profile_id: "p-isu502", piece_name: "Baguete Vertical", piece_function: "baguete_v", reference_dimension: "H", coefficient: 1, constant_mm: -125, fixed_value_mm: null, cut_angle_left: 45, cut_angle_right: 45, quantity_formula: "2", sort_order: 7, profile_code: "ISU-502", weight_per_meter: 0.120 },
  { id: "cr-jma-08", typology_id: "typ-jma", profile_id: "p-isu502", piece_name: "Baguete Horizontal", piece_function: "baguete_h", reference_dimension: "L", coefficient: 1, constant_mm: -98, fixed_value_mm: null, cut_angle_left: 45, cut_angle_right: 45, quantity_formula: "2", sort_order: 8, profile_code: "ISU-502", weight_per_meter: 0.120 },
  { id: "cr-jma-09", typology_id: "typ-jma", profile_id: "p-cm200", piece_name: "Contramarco", piece_function: "contramarco", reference_dimension: "H", coefficient: 1, constant_mm: -3, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 9, profile_code: "CM-200", weight_per_meter: 0.250 },
  { id: "cr-jma-10", typology_id: "typ-jma", profile_id: "p-cm200", piece_name: "Contramarco Sup/Inf", piece_function: "contramarco_h", reference_dimension: "L", coefficient: 1, constant_mm: -3, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 10, profile_code: "CM-200", weight_per_meter: 0.250 },

  // ========================================
  // JANELA MAXIM-AR 2 FOLHAS (typ-jma2)
  // ========================================
  { id: "cr-jma2-01", typology_id: "typ-jma2", profile_id: "p-su060", piece_name: "Marco Superior", piece_function: "marco_sup", reference_dimension: "L", coefficient: 1, constant_mm: -8, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "1", sort_order: 1, profile_code: "SU-060", weight_per_meter: 0.410 },
  { id: "cr-jma2-02", typology_id: "typ-jma2", profile_id: "p-su060", piece_name: "Marco Inferior", piece_function: "marco_inf", reference_dimension: "L", coefficient: 1, constant_mm: -8, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "1", sort_order: 2, profile_code: "SU-060", weight_per_meter: 0.410 },
  { id: "cr-jma2-03", typology_id: "typ-jma2", profile_id: "p-su060", piece_name: "Marco Lateral", piece_function: "marco_lat", reference_dimension: "H", coefficient: 1, constant_mm: -55, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 3, profile_code: "SU-060", weight_per_meter: 0.410 },
  { id: "cr-jma2-04", typology_id: "typ-jma2", profile_id: "p-su060", piece_name: "Montante Central (Fixo)", piece_function: "montante_central", reference_dimension: "H", coefficient: 1, constant_mm: -55, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "1", sort_order: 4, profile_code: "SU-060", weight_per_meter: 0.410 },
  { id: "cr-jma2-05", typology_id: "typ-jma2", profile_id: "p-su062", piece_name: "Montante Folha", piece_function: "montante", reference_dimension: "H", coefficient: 1, constant_mm: -110, fixed_value_mm: null, cut_angle_left: 45, cut_angle_right: 45, quantity_formula: "num_folhas * 2", sort_order: 5, profile_code: "SU-062", weight_per_meter: 0.550 },
  { id: "cr-jma2-06", typology_id: "typ-jma2", profile_id: "p-su064", piece_name: "Travessa Folha", piece_function: "travessa", reference_dimension: "L/2", coefficient: 1, constant_mm: -85, fixed_value_mm: null, cut_angle_left: 45, cut_angle_right: 45, quantity_formula: "num_folhas * 2", sort_order: 6, profile_code: "SU-064", weight_per_meter: 0.510 },
  { id: "cr-jma2-07", typology_id: "typ-jma2", profile_id: "p-isu502", piece_name: "Baguete Vertical", piece_function: "baguete_v", reference_dimension: "H", coefficient: 1, constant_mm: -125, fixed_value_mm: null, cut_angle_left: 45, cut_angle_right: 45, quantity_formula: "num_folhas * 2", sort_order: 7, profile_code: "ISU-502", weight_per_meter: 0.120 },
  { id: "cr-jma2-08", typology_id: "typ-jma2", profile_id: "p-isu502", piece_name: "Baguete Horizontal", piece_function: "baguete_h", reference_dimension: "L/2", coefficient: 1, constant_mm: -98, fixed_value_mm: null, cut_angle_left: 45, cut_angle_right: 45, quantity_formula: "num_folhas * 2", sort_order: 8, profile_code: "ISU-502", weight_per_meter: 0.120 },

  // ========================================
  // PORTA 2 FOLHAS DE CORRER (typ-pc2f)
  // ========================================
  { id: "cr-pc2f-01", typology_id: "typ-pc2f", profile_id: "p-su070", piece_name: "Marco Superior", piece_function: "marco_sup", reference_dimension: "L", coefficient: 1, constant_mm: -8, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "1", sort_order: 1, profile_code: "SU-070", weight_per_meter: 0.600 },
  { id: "cr-pc2f-02", typology_id: "typ-pc2f", profile_id: "p-su072", piece_name: "Trilho Inferior", piece_function: "marco_inf", reference_dimension: "L", coefficient: 1, constant_mm: -8, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "1", sort_order: 2, profile_code: "SU-072", weight_per_meter: 0.680 },
  { id: "cr-pc2f-03", typology_id: "typ-pc2f", profile_id: "p-su074", piece_name: "Marco Lateral", piece_function: "marco_lat", reference_dimension: "H", coefficient: 1, constant_mm: -62, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 3, profile_code: "SU-074", weight_per_meter: 0.520 },
  { id: "cr-pc2f-04", typology_id: "typ-pc2f", profile_id: "p-su076", piece_name: "Montante Folha", piece_function: "montante", reference_dimension: "H", coefficient: 1, constant_mm: -135, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "num_folhas * 2", sort_order: 4, profile_code: "SU-076", weight_per_meter: 0.750 },
  { id: "cr-pc2f-05", typology_id: "typ-pc2f", profile_id: "p-su078", piece_name: "Travessa Folha", piece_function: "travessa", reference_dimension: "L/2", coefficient: 1, constant_mm: -80, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "num_folhas * 2", sort_order: 5, profile_code: "SU-078", weight_per_meter: 0.620 },
  { id: "cr-pc2f-06", typology_id: "typ-pc2f", profile_id: "p-isu502", piece_name: "Baguete Vertical", piece_function: "baguete_v", reference_dimension: "H", coefficient: 1, constant_mm: -150, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "num_folhas * 2", sort_order: 6, profile_code: "ISU-502", weight_per_meter: 0.120 },
  { id: "cr-pc2f-07", typology_id: "typ-pc2f", profile_id: "p-isu502", piece_name: "Baguete Horizontal", piece_function: "baguete_h", reference_dimension: "L/2", coefficient: 1, constant_mm: -92, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "num_folhas * 2", sort_order: 7, profile_code: "ISU-502", weight_per_meter: 0.120 },
  { id: "cr-pc2f-08", typology_id: "typ-pc2f", profile_id: "p-cm200", piece_name: "Contramarco Lateral", piece_function: "contramarco_lat", reference_dimension: "H", coefficient: 1, constant_mm: -3, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 8, profile_code: "CM-200", weight_per_meter: 0.250 },
  { id: "cr-pc2f-09", typology_id: "typ-pc2f", profile_id: "p-cm200", piece_name: "Contramarco Sup/Inf", piece_function: "contramarco_h", reference_dimension: "L", coefficient: 1, constant_mm: -3, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 9, profile_code: "CM-200", weight_per_meter: 0.250 },

  // ========================================
  // PORTA 4 FOLHAS DE CORRER (typ-pc4f)
  // ========================================
  { id: "cr-pc4f-01", typology_id: "typ-pc4f", profile_id: "p-su070", piece_name: "Marco Superior", piece_function: "marco_sup", reference_dimension: "L", coefficient: 1, constant_mm: -8, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "1", sort_order: 1, profile_code: "SU-070", weight_per_meter: 0.600 },
  { id: "cr-pc4f-02", typology_id: "typ-pc4f", profile_id: "p-su072", piece_name: "Trilho Inferior", piece_function: "marco_inf", reference_dimension: "L", coefficient: 1, constant_mm: -8, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "1", sort_order: 2, profile_code: "SU-072", weight_per_meter: 0.680 },
  { id: "cr-pc4f-03", typology_id: "typ-pc4f", profile_id: "p-su074", piece_name: "Marco Lateral", piece_function: "marco_lat", reference_dimension: "H", coefficient: 1, constant_mm: -62, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 3, profile_code: "SU-074", weight_per_meter: 0.520 },
  { id: "cr-pc4f-04", typology_id: "typ-pc4f", profile_id: "p-su076", piece_name: "Montante Folha", piece_function: "montante", reference_dimension: "H", coefficient: 1, constant_mm: -135, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "num_folhas * 2", sort_order: 4, profile_code: "SU-076", weight_per_meter: 0.750 },
  { id: "cr-pc4f-05", typology_id: "typ-pc4f", profile_id: "p-su078", piece_name: "Travessa Folha", piece_function: "travessa", reference_dimension: "L/4", coefficient: 1, constant_mm: -80, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "num_folhas * 2", sort_order: 5, profile_code: "SU-078", weight_per_meter: 0.620 },
  { id: "cr-pc4f-06", typology_id: "typ-pc4f", profile_id: "p-isu502", piece_name: "Baguete Vertical", piece_function: "baguete_v", reference_dimension: "H", coefficient: 1, constant_mm: -150, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "num_folhas * 2", sort_order: 6, profile_code: "ISU-502", weight_per_meter: 0.120 },
  { id: "cr-pc4f-07", typology_id: "typ-pc4f", profile_id: "p-isu502", piece_name: "Baguete Horizontal", piece_function: "baguete_h", reference_dimension: "L/4", coefficient: 1, constant_mm: -92, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "num_folhas * 2", sort_order: 7, profile_code: "ISU-502", weight_per_meter: 0.120 },
  { id: "cr-pc4f-08", typology_id: "typ-pc4f", profile_id: "p-cm200", piece_name: "Contramarco Lateral", piece_function: "contramarco_lat", reference_dimension: "H", coefficient: 1, constant_mm: -3, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 8, profile_code: "CM-200", weight_per_meter: 0.250 },
  { id: "cr-pc4f-09", typology_id: "typ-pc4f", profile_id: "p-cm200", piece_name: "Contramarco Sup/Inf", piece_function: "contramarco_h", reference_dimension: "L", coefficient: 1, constant_mm: -3, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 9, profile_code: "CM-200", weight_per_meter: 0.250 },

  // ========================================
  // PORTA DE GIRO 1 FOLHA (typ-pg1f)
  // ========================================
  { id: "cr-pg1f-01", typology_id: "typ-pg1f", profile_id: "p-su089", piece_name: "Marco Superior", piece_function: "marco_sup", reference_dimension: "L", coefficient: 1, constant_mm: -10, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "1", sort_order: 1, profile_code: "SU-089", weight_per_meter: 0.580 },
  { id: "cr-pg1f-02", typology_id: "typ-pg1f", profile_id: "p-su089", piece_name: "Marco Lateral", piece_function: "marco_lat", reference_dimension: "H", coefficient: 1, constant_mm: -45, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 2, profile_code: "SU-089", weight_per_meter: 0.580 },
  { id: "cr-pg1f-03", typology_id: "typ-pg1f", profile_id: "p-su111", piece_name: "Montante Folha", piece_function: "montante", reference_dimension: "H", coefficient: 1, constant_mm: -105, fixed_value_mm: null, cut_angle_left: 45, cut_angle_right: 45, quantity_formula: "2", sort_order: 3, profile_code: "SU-111", weight_per_meter: 0.720 },
  { id: "cr-pg1f-04", typology_id: "typ-pg1f", profile_id: "p-su111", piece_name: "Travessa Superior Folha", piece_function: "travessa_sup", reference_dimension: "L", coefficient: 1, constant_mm: -90, fixed_value_mm: null, cut_angle_left: 45, cut_angle_right: 45, quantity_formula: "1", sort_order: 4, profile_code: "SU-111", weight_per_meter: 0.720 },
  { id: "cr-pg1f-05", typology_id: "typ-pg1f", profile_id: "p-su111", piece_name: "Travessa Inferior Folha", piece_function: "travessa_inf", reference_dimension: "L", coefficient: 1, constant_mm: -90, fixed_value_mm: null, cut_angle_left: 45, cut_angle_right: 45, quantity_formula: "1", sort_order: 5, profile_code: "SU-111", weight_per_meter: 0.720 },
  { id: "cr-pg1f-06", typology_id: "typ-pg1f", profile_id: "p-isu502", piece_name: "Baguete Vertical", piece_function: "baguete_v", reference_dimension: "H", coefficient: 1, constant_mm: -120, fixed_value_mm: null, cut_angle_left: 45, cut_angle_right: 45, quantity_formula: "2", sort_order: 6, profile_code: "ISU-502", weight_per_meter: 0.120 },
  { id: "cr-pg1f-07", typology_id: "typ-pg1f", profile_id: "p-isu502", piece_name: "Baguete Horizontal", piece_function: "baguete_h", reference_dimension: "L", coefficient: 1, constant_mm: -105, fixed_value_mm: null, cut_angle_left: 45, cut_angle_right: 45, quantity_formula: "2", sort_order: 7, profile_code: "ISU-502", weight_per_meter: 0.120 },
  { id: "cr-pg1f-08", typology_id: "typ-pg1f", profile_id: "p-cm200", piece_name: "Contramarco Lateral", piece_function: "contramarco_lat", reference_dimension: "H", coefficient: 1, constant_mm: -3, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 8, profile_code: "CM-200", weight_per_meter: 0.250 },
  { id: "cr-pg1f-09", typology_id: "typ-pg1f", profile_id: "p-cm200", piece_name: "Contramarco Superior", piece_function: "contramarco_h", reference_dimension: "L", coefficient: 1, constant_mm: -3, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "1", sort_order: 9, profile_code: "CM-200", weight_per_meter: 0.250 },

  // ========================================
  // JANELA BASCULANTE (typ-jbasc)
  // ========================================
  { id: "cr-jbasc-01", typology_id: "typ-jbasc", profile_id: "p-su080", piece_name: "Marco Superior", piece_function: "marco_sup", reference_dimension: "L", coefficient: 1, constant_mm: -6, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "1", sort_order: 1, profile_code: "SU-080", weight_per_meter: 0.390 },
  { id: "cr-jbasc-02", typology_id: "typ-jbasc", profile_id: "p-su080", piece_name: "Marco Inferior", piece_function: "marco_inf", reference_dimension: "L", coefficient: 1, constant_mm: -6, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "1", sort_order: 2, profile_code: "SU-080", weight_per_meter: 0.390 },
  { id: "cr-jbasc-03", typology_id: "typ-jbasc", profile_id: "p-su080", piece_name: "Marco Lateral", piece_function: "marco_lat", reference_dimension: "H", coefficient: 1, constant_mm: -50, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 3, profile_code: "SU-080", weight_per_meter: 0.390 },
  { id: "cr-jbasc-04", typology_id: "typ-jbasc", profile_id: "p-su082", piece_name: "Montante Folha", piece_function: "montante", reference_dimension: "H", coefficient: 1, constant_mm: -100, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 4, profile_code: "SU-082", weight_per_meter: 0.460 },
  { id: "cr-jbasc-05", typology_id: "typ-jbasc", profile_id: "p-su082", piece_name: "Travessa Folha", piece_function: "travessa", reference_dimension: "L", coefficient: 1, constant_mm: -70, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 5, profile_code: "SU-082", weight_per_meter: 0.460 },
  { id: "cr-jbasc-06", typology_id: "typ-jbasc", profile_id: "p-isu502", piece_name: "Baguete Vertical", piece_function: "baguete_v", reference_dimension: "H", coefficient: 1, constant_mm: -115, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 6, profile_code: "ISU-502", weight_per_meter: 0.120 },
  { id: "cr-jbasc-07", typology_id: "typ-jbasc", profile_id: "p-isu502", piece_name: "Baguete Horizontal", piece_function: "baguete_h", reference_dimension: "L", coefficient: 1, constant_mm: -82, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 7, profile_code: "ISU-502", weight_per_meter: 0.120 },

  // ========================================
  // VITRO FIXO (typ-vf)
  // ========================================
  { id: "cr-vf-01", typology_id: "typ-vf", profile_id: "p-su090", piece_name: "Marco Superior", piece_function: "marco_sup", reference_dimension: "L", coefficient: 1, constant_mm: -6, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "1", sort_order: 1, profile_code: "SU-090", weight_per_meter: 0.420 },
  { id: "cr-vf-02", typology_id: "typ-vf", profile_id: "p-su090", piece_name: "Marco Inferior", piece_function: "marco_inf", reference_dimension: "L", coefficient: 1, constant_mm: -6, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "1", sort_order: 2, profile_code: "SU-090", weight_per_meter: 0.420 },
  { id: "cr-vf-03", typology_id: "typ-vf", profile_id: "p-su090", piece_name: "Marco Lateral", piece_function: "marco_lat", reference_dimension: "H", coefficient: 1, constant_mm: -52, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 3, profile_code: "SU-090", weight_per_meter: 0.420 },
  { id: "cr-vf-04", typology_id: "typ-vf", profile_id: "p-isu502", piece_name: "Baguete Vertical", piece_function: "baguete_v", reference_dimension: "H", coefficient: 1, constant_mm: -65, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 4, profile_code: "ISU-502", weight_per_meter: 0.120 },
  { id: "cr-vf-05", typology_id: "typ-vf", profile_id: "p-isu502", piece_name: "Baguete Horizontal", piece_function: "baguete_h", reference_dimension: "L", coefficient: 1, constant_mm: -18, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 5, profile_code: "ISU-502", weight_per_meter: 0.120 },
  { id: "cr-vf-06", typology_id: "typ-vf", profile_id: "p-cm200", piece_name: "Contramarco Lateral", piece_function: "contramarco_lat", reference_dimension: "H", coefficient: 1, constant_mm: -3, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 6, profile_code: "CM-200", weight_per_meter: 0.250 },
  { id: "cr-vf-07", typology_id: "typ-vf", profile_id: "p-cm200", piece_name: "Contramarco Sup/Inf", piece_function: "contramarco_h", reference_dimension: "L", coefficient: 1, constant_mm: -3, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 7, profile_code: "CM-200", weight_per_meter: 0.250 },

  // ========================================
  // JANELA 2 FOLHAS COM VENEZIANA (typ-jc2fv)
  // ========================================
  // Marcos iguais à janela 2 folhas de correr
  { id: "cr-jc2fv-01", typology_id: "typ-jc2fv", profile_id: "p-su010", piece_name: "Marco Superior", piece_function: "marco_sup", reference_dimension: "L", coefficient: 1, constant_mm: -6, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "1", sort_order: 1, profile_code: "SU-010", weight_per_meter: 0.450 },
  { id: "cr-jc2fv-02", typology_id: "typ-jc2fv", profile_id: "p-su012", piece_name: "Marco Inferior (Trilho)", piece_function: "marco_inf", reference_dimension: "L", coefficient: 1, constant_mm: -6, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "1", sort_order: 2, profile_code: "SU-012", weight_per_meter: 0.520 },
  { id: "cr-jc2fv-03", typology_id: "typ-jc2fv", profile_id: "p-su014", piece_name: "Marco Lateral", piece_function: "marco_lat", reference_dimension: "H", coefficient: 1, constant_mm: -57, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 3, profile_code: "SU-014", weight_per_meter: 0.380 },
  // Folha vidro
  { id: "cr-jc2fv-04", typology_id: "typ-jc2fv", profile_id: "p-su039", piece_name: "Montante Folha Vidro", piece_function: "montante", reference_dimension: "H", coefficient: 1, constant_mm: -127, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "num_folhas * 2", sort_order: 4, profile_code: "SU-039", weight_per_meter: 0.631 },
  { id: "cr-jc2fv-05", typology_id: "typ-jc2fv", profile_id: "p-su053", piece_name: "Travessa Folha Vidro", piece_function: "travessa", reference_dimension: "L/2", coefficient: 1, constant_mm: -74, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "num_folhas * 2", sort_order: 5, profile_code: "SU-053", weight_per_meter: 0.485 },
  // Folha veneziana
  { id: "cr-jc2fv-06", typology_id: "typ-jc2fv", profile_id: "p-su095", piece_name: "Montante Veneziana", piece_function: "montante_ven", reference_dimension: "H", coefficient: 1, constant_mm: -127, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "num_folhas * 2", sort_order: 6, profile_code: "SU-095", weight_per_meter: 0.580 },
  { id: "cr-jc2fv-07", typology_id: "typ-jc2fv", profile_id: "p-su097", piece_name: "Travessa Veneziana", piece_function: "travessa_ven", reference_dimension: "L/2", coefficient: 1, constant_mm: -74, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "num_folhas * 2", sort_order: 7, profile_code: "SU-097", weight_per_meter: 0.490 },
  // Baguetes vidro
  { id: "cr-jc2fv-08", typology_id: "typ-jc2fv", profile_id: "p-isu502", piece_name: "Baguete Vertical", piece_function: "baguete_v", reference_dimension: "H", coefficient: 1, constant_mm: -139, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "num_folhas * 2", sort_order: 8, profile_code: "ISU-502", weight_per_meter: 0.120 },
  { id: "cr-jc2fv-09", typology_id: "typ-jc2fv", profile_id: "p-isu502", piece_name: "Baguete Horizontal", piece_function: "baguete_h", reference_dimension: "L/2", coefficient: 1, constant_mm: -86, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "num_folhas * 2", sort_order: 9, profile_code: "ISU-502", weight_per_meter: 0.120 },
  { id: "cr-jc2fv-10", typology_id: "typ-jc2fv", profile_id: "p-cm200", piece_name: "Contramarco", piece_function: "contramarco", reference_dimension: "H", coefficient: 1, constant_mm: -3, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 10, profile_code: "CM-200", weight_per_meter: 0.250 },
  { id: "cr-jc2fv-11", typology_id: "typ-jc2fv", profile_id: "p-cm200", piece_name: "Contramarco Sup/Inf", piece_function: "contramarco_h", reference_dimension: "L", coefficient: 1, constant_mm: -3, fixed_value_mm: null, cut_angle_left: 90, cut_angle_right: 90, quantity_formula: "2", sort_order: 11, profile_code: "CM-200", weight_per_meter: 0.250 },
];

// ============================================
// REGRAS DE VIDRO - POR TIPOLOGIA
// ============================================
export const glassRules: GlassRule[] = [
  // Janela 2F Correr
  { id: "gr-jc2f-01", typology_id: "typ-jc2f", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -86, height_reference: "H", height_constant_mm: -139, quantity: 2, glass_type: "comum", min_thickness_mm: 4, max_thickness_mm: 6 },
  // Janela 3F Correr
  { id: "gr-jc3f-01", typology_id: "typ-jc3f", glass_name: "Vidro Folha", width_reference: "L/3", width_constant_mm: -86, height_reference: "H", height_constant_mm: -139, quantity: 3 },
  // Janela 4F Correr
  { id: "gr-jc4f-01", typology_id: "typ-jc4f", glass_name: "Vidro Folha", width_reference: "L/4", width_constant_mm: -86, height_reference: "H", height_constant_mm: -139, quantity: 4 },
  // Maxim-Ar 1F
  { id: "gr-jma-01", typology_id: "typ-jma", glass_name: "Vidro Folha", width_reference: "L", width_constant_mm: -98, height_reference: "H", height_constant_mm: -125, quantity: 1, glass_type: "temperado", min_thickness_mm: 4, max_thickness_mm: 8 },
  // Maxim-Ar 2F
  { id: "gr-jma2-01", typology_id: "typ-jma2", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -98, height_reference: "H", height_constant_mm: -125, quantity: 2, glass_type: "temperado" },
  // Porta 2F Correr
  { id: "gr-pc2f-01", typology_id: "typ-pc2f", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -92, height_reference: "H", height_constant_mm: -150, quantity: 2, glass_type: "temperado", min_thickness_mm: 6, max_thickness_mm: 10 },
  // Porta 4F Correr
  { id: "gr-pc4f-01", typology_id: "typ-pc4f", glass_name: "Vidro Folha", width_reference: "L/4", width_constant_mm: -92, height_reference: "H", height_constant_mm: -150, quantity: 4, glass_type: "temperado" },
  // Porta Giro 1F
  { id: "gr-pg1f-01", typology_id: "typ-pg1f", glass_name: "Vidro Folha", width_reference: "L", width_constant_mm: -105, height_reference: "H", height_constant_mm: -120, quantity: 1, glass_type: "temperado", min_thickness_mm: 6, max_thickness_mm: 10 },
  // Basculante
  { id: "gr-jbasc-01", typology_id: "typ-jbasc", glass_name: "Vidro Folha", width_reference: "L", width_constant_mm: -82, height_reference: "H", height_constant_mm: -115, quantity: 1, glass_type: "comum", min_thickness_mm: 4 },
  // Vitro Fixo
  { id: "gr-vf-01", typology_id: "typ-vf", glass_name: "Vidro", width_reference: "L", width_constant_mm: -18, height_reference: "H", height_constant_mm: -65, quantity: 1, glass_type: "comum", min_thickness_mm: 4 },
  // Veneziana 2F
  { id: "gr-jc2fv-01", typology_id: "typ-jc2fv", glass_name: "Vidro Folha", width_reference: "L/2", width_constant_mm: -86, height_reference: "H", height_constant_mm: -139, quantity: 2, glass_type: "comum" },
];

// ============================================
// COMPONENTES / ACESSÓRIOS POR TIPOLOGIA
// ============================================
export const typologyComponents: TypologyComponent[] = [
  // Janela 2F Correr
  { id: "tc-jc2f-01", typology_id: "typ-jc2f", component_name: "Roldana SU", component_type: "roldana", quantity_formula: "num_folhas * 2", unit: "un" },
  { id: "tc-jc2f-02", typology_id: "typ-jc2f", component_name: "Fecho Concha", component_type: "fecho", quantity_formula: "1", unit: "un" },
  { id: "tc-jc2f-03", typology_id: "typ-jc2f", component_name: "Guarnição de Vedação", component_type: "guarnicao", quantity_formula: "1", unit: "m", length_reference: "L", length_constant_mm: 0 },
  { id: "tc-jc2f-04", typology_id: "typ-jc2f", component_name: "Escova 7x7", component_type: "escova", quantity_formula: "1", unit: "m", length_reference: "H", length_constant_mm: 0 },

  // Janela 3F Correr
  { id: "tc-jc3f-01", typology_id: "typ-jc3f", component_name: "Roldana SU", component_type: "roldana", quantity_formula: "num_folhas * 2", unit: "un" },
  { id: "tc-jc3f-02", typology_id: "typ-jc3f", component_name: "Fecho Concha", component_type: "fecho", quantity_formula: "1", unit: "un" },

  // Janela 4F Correr
  { id: "tc-jc4f-01", typology_id: "typ-jc4f", component_name: "Roldana SU", component_type: "roldana", quantity_formula: "num_folhas * 2", unit: "un" },
  { id: "tc-jc4f-02", typology_id: "typ-jc4f", component_name: "Fecho Concha", component_type: "fecho", quantity_formula: "2", unit: "un" },

  // Maxim-ar
  { id: "tc-jma-01", typology_id: "typ-jma", component_name: "Braço Articulado", component_type: "braco", quantity_formula: "2", unit: "un" },
  { id: "tc-jma-02", typology_id: "typ-jma", component_name: "Fecho Maxim-Ar", component_type: "fecho", quantity_formula: "1", unit: "un" },

  // Maxim-ar 2F
  { id: "tc-jma2-01", typology_id: "typ-jma2", component_name: "Braço Articulado", component_type: "braco", quantity_formula: "num_folhas * 2", unit: "un" },
  { id: "tc-jma2-02", typology_id: "typ-jma2", component_name: "Fecho Maxim-Ar", component_type: "fecho", quantity_formula: "num_folhas", unit: "un" },

  // Porta 2F Correr
  { id: "tc-pc2f-01", typology_id: "typ-pc2f", component_name: "Roldana Porta SU", component_type: "roldana", quantity_formula: "num_folhas * 2", unit: "un" },
  { id: "tc-pc2f-02", typology_id: "typ-pc2f", component_name: "Trinco Concha Porta", component_type: "fecho", quantity_formula: "1", unit: "un" },
  { id: "tc-pc2f-03", typology_id: "typ-pc2f", component_name: "Puxador Concha", component_type: "puxador", quantity_formula: "num_folhas", unit: "un" },

  // Porta 4F Correr
  { id: "tc-pc4f-01", typology_id: "typ-pc4f", component_name: "Roldana Porta SU", component_type: "roldana", quantity_formula: "num_folhas * 2", unit: "un" },
  { id: "tc-pc4f-02", typology_id: "typ-pc4f", component_name: "Trinco Concha Porta", component_type: "fecho", quantity_formula: "2", unit: "un" },
  { id: "tc-pc4f-03", typology_id: "typ-pc4f", component_name: "Puxador Concha", component_type: "puxador", quantity_formula: "num_folhas", unit: "un" },

  // Porta Giro
  { id: "tc-pg1f-01", typology_id: "typ-pg1f", component_name: "Dobradiça com Rolamento", component_type: "dobradica", quantity_formula: "3", unit: "un" },
  { id: "tc-pg1f-02", typology_id: "typ-pg1f", component_name: "Fechadura Porta", component_type: "fechadura", quantity_formula: "1", unit: "un" },
  { id: "tc-pg1f-03", typology_id: "typ-pg1f", component_name: "Puxador 300mm", component_type: "puxador", quantity_formula: "1", unit: "par" },

  // Basculante
  { id: "tc-jbasc-01", typology_id: "typ-jbasc", component_name: "Alavanca Basculante", component_type: "alavanca", quantity_formula: "1", unit: "un" },
  { id: "tc-jbasc-02", typology_id: "typ-jbasc", component_name: "Pivô Basculante", component_type: "pivo", quantity_formula: "2", unit: "un" },

  // Veneziana
  { id: "tc-jc2fv-01", typology_id: "typ-jc2fv", component_name: "Roldana SU", component_type: "roldana", quantity_formula: "num_folhas * 4", unit: "un" },
  { id: "tc-jc2fv-02", typology_id: "typ-jc2fv", component_name: "Fecho Concha", component_type: "fecho", quantity_formula: "1", unit: "un" },
];

// ============================================
// HELPERS
// ============================================

export function getTypologyById(id: string): Typology | undefined {
  return typologies.find(t => t.id === id);
}

export function getCutRulesForTypology(typologyId: string): CutRule[] {
  return cutRules.filter(r => r.typology_id === typologyId).sort((a, b) => a.sort_order - b.sort_order);
}

export function getGlassRulesForTypology(typologyId: string): GlassRule[] {
  return glassRules.filter(r => r.typology_id === typologyId);
}

export function getComponentsForTypology(typologyId: string): TypologyComponent[] {
  return typologyComponents.filter(c => c.typology_id === typologyId);
}

export function getTypologiesByLine(lineId: string): Typology[] {
  return typologies.filter(t => t.product_line_id === lineId && t.active);
}

export function getProfilesByLine(lineId: string): Profile[] {
  return profiles.filter(p => p.product_line_id === lineId && p.active);
}
