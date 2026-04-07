import type { Profile } from "@/types/calculation";

/**
 * Perfis adicionais extraídos do Catálogo Geral de Perfis - Metal Centenário 2023
 * Estes perfis NÃO estão nos catálogos especializados (Máxima, Perfetta, Amadeirado, Padronizado).
 * Inclui: Box (liso, frisado, temperado, vidro), arremates, brises, contra-marcos,
 * divisórias, balaustradas e perfis diversos.
 * Pesos (kg/m) extraídos via OCR dos PDFs oficiais.
 */
export const profilesGeralCentenario: Profile[] = [
  // ===== ARREMATES =====
  { id: "cent-ge-L431", product_line_id: "line-cent-padronizado", code: "L-431", name: "Arremate", profile_type: "arremate", weight_per_meter: 0.100, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-L432", product_line_id: "line-cent-padronizado", code: "L-432", name: "Arremate", profile_type: "arremate", weight_per_meter: 0.127, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-TMR1221", product_line_id: "line-cent-padronizado", code: "TMR-1221", name: "Arremate", profile_type: "arremate", weight_per_meter: 0.114, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-E613", product_line_id: "line-cent-padronizado", code: "E-613", name: "Arremate", profile_type: "arremate", weight_per_meter: 0.165, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-ME092", product_line_id: "line-cent-padronizado", code: "ME-092", name: "Arremate", profile_type: "arremate", weight_per_meter: 0.162, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-AB127", product_line_id: "line-cent-padronizado", code: "AB-127", name: "Arremate", profile_type: "arremate", weight_per_meter: 0.252, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-DP024", product_line_id: "line-cent-padronizado", code: "DP-024", name: "Arremate", profile_type: "arremate", weight_per_meter: 0.236, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-DP015", product_line_id: "line-cent-padronizado", code: "DP-015", name: "Arremate", profile_type: "arremate", weight_per_meter: 0.214, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-CM169", product_line_id: "line-cent-padronizado", code: "CM-169", name: "Contra-Marco", profile_type: "contramarco", weight_per_meter: 0.211, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-MN014", product_line_id: "line-cent-padronizado", code: "MN-014", name: "Arremate", profile_type: "arremate", weight_per_meter: 0.431, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-T136", product_line_id: "line-cent-padronizado", code: "T-136", name: "Arremate T", profile_type: "arremate", weight_per_meter: 0.184, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-T155", product_line_id: "line-cent-padronizado", code: "T-155", name: "Arremate T", profile_type: "arremate", weight_per_meter: 0.190, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-L516", product_line_id: "line-cent-padronizado", code: "L-516", name: "Arremate L", profile_type: "arremate", weight_per_meter: 0.361, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-U1090", product_line_id: "line-cent-padronizado", code: "U-1090", name: "Arremate U", profile_type: "arremate", weight_per_meter: 0.126, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-E256", product_line_id: "line-cent-padronizado", code: "E-256", name: "Arremate", profile_type: "arremate", weight_per_meter: 0.323, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-E117", product_line_id: "line-cent-padronizado", code: "E-117", name: "Box Liso Arremate", profile_type: "arremate", weight_per_meter: 0.325, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-T214", product_line_id: "line-cent-padronizado", code: "T-214", name: "Arremate T", profile_type: "arremate", weight_per_meter: 0.138, bar_length_mm: 6000, material: "alumínio", active: true },

  // ===== BOX FRISADO =====
  { id: "cent-ge-U655", product_line_id: "line-cent-padronizado", code: "U-655", name: "Box Frisado Montante", profile_type: "montante", weight_per_meter: 0.598, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-U653", product_line_id: "line-cent-padronizado", code: "U-653", name: "Box Frisado", profile_type: "montante", weight_per_meter: 0.260, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BAR4024", product_line_id: "line-cent-padronizado", code: "BAR-4024", name: "Barra Box", profile_type: "arremate", weight_per_meter: 0.249, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-U652", product_line_id: "line-cent-padronizado", code: "U-652", name: "Box Frisado", profile_type: "montante", weight_per_meter: 0.168, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-U654", product_line_id: "line-cent-padronizado", code: "U-654", name: "Box Frisado", profile_type: "montante", weight_per_meter: 0.195, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-I154", product_line_id: "line-cent-padronizado", code: "I-154", name: "Box Frisado I", profile_type: "montante", weight_per_meter: 0.255, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-I155", product_line_id: "line-cent-padronizado", code: "I-155", name: "Box Frisado I", profile_type: "montante", weight_per_meter: 0.336, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-Y311", product_line_id: "line-cent-padronizado", code: "Y-311", name: "Box Frisado Y", profile_type: "montante", weight_per_meter: 0.259, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-Y310", product_line_id: "line-cent-padronizado", code: "Y-310", name: "Box Frisado Y", profile_type: "montante", weight_per_meter: 0.254, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-Y308", product_line_id: "line-cent-padronizado", code: "Y-308", name: "Box Frisado Y", profile_type: "montante", weight_per_meter: 0.349, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BX344", product_line_id: "line-cent-padronizado", code: "BX-344", name: "Box Frisado", profile_type: "montante", weight_per_meter: 0.206, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BX347", product_line_id: "line-cent-padronizado", code: "BX-347", name: "Box Frisado Travessa", profile_type: "travessa", weight_per_meter: 0.203, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BX348A", product_line_id: "line-cent-padronizado", code: "BX-348A", name: "Box Frisado Trilho Superior", profile_type: "trilho", weight_per_meter: 0.471, bar_length_mm: 6000, material: "alumínio", active: true },

  // ===== BOX LISO =====
  { id: "cent-ge-U396", product_line_id: "line-cent-padronizado", code: "U-396", name: "Box Liso U", profile_type: "montante", weight_per_meter: 0.239, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-U397", product_line_id: "line-cent-padronizado", code: "U-397", name: "Box Liso U", profile_type: "montante", weight_per_meter: 0.680, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-U398", product_line_id: "line-cent-padronizado", code: "U-398", name: "Box Liso U", profile_type: "montante", weight_per_meter: 0.249, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-U399", product_line_id: "line-cent-padronizado", code: "U-399", name: "Box Liso U", profile_type: "montante", weight_per_meter: 0.239, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-I083", product_line_id: "line-cent-padronizado", code: "I-083", name: "Box Liso I", profile_type: "montante", weight_per_meter: 0.339, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-Y105", product_line_id: "line-cent-padronizado", code: "Y-105", name: "Box Liso Y", profile_type: "montante", weight_per_meter: 0.379, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-Y106", product_line_id: "line-cent-padronizado", code: "Y-106", name: "Box Liso Y", profile_type: "montante", weight_per_meter: 0.274, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-Y107", product_line_id: "line-cent-padronizado", code: "Y-107", name: "Box Liso Y", profile_type: "montante", weight_per_meter: 0.184, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BX247", product_line_id: "line-cent-padronizado", code: "BX-247", name: "Box Liso", profile_type: "montante", weight_per_meter: 0.222, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BX244", product_line_id: "line-cent-padronizado", code: "BX-244", name: "Box Liso", profile_type: "montante", weight_per_meter: 0.216, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BX248B", product_line_id: "line-cent-padronizado", code: "BX-248B", name: "Box Liso Trilho", profile_type: "trilho", weight_per_meter: 0.471, bar_length_mm: 6000, material: "alumínio", active: true },

  // ===== BOX TEMPERADO =====
  { id: "cent-ge-DP035", product_line_id: "line-cent-padronizado", code: "DP-035", name: "Box Temperado Montante", profile_type: "montante", weight_per_meter: 1.268, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BX003", product_line_id: "line-cent-padronizado", code: "BX-003", name: "Box Temperado", profile_type: "montante", weight_per_meter: 0.816, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BX006A", product_line_id: "line-cent-padronizado", code: "BX-006A", name: "Box Temperado", profile_type: "montante", weight_per_meter: 0.258, bar_length_mm: 6000, material: "alumínio", active: true },

  // ===== BOX VIDRO DIVERSOS =====
  { id: "cent-ge-DP003", product_line_id: "line-cent-padronizado", code: "DP-003", name: "Box Vidro Montante", profile_type: "montante", weight_per_meter: 0.318, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-DP005", product_line_id: "line-cent-padronizado", code: "DP-005", name: "Box Vidro Montante", profile_type: "montante", weight_per_meter: 1.436, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-DP007", product_line_id: "line-cent-padronizado", code: "DP-007", name: "Box Vidro Montante", profile_type: "montante", weight_per_meter: 0.341, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-DP011", product_line_id: "line-cent-padronizado", code: "DP-011", name: "Box Vidro Montante", profile_type: "montante", weight_per_meter: 0.547, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-U164", product_line_id: "line-cent-padronizado", code: "U-164", name: "Box Vidro U", profile_type: "montante", weight_per_meter: 0.650, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-U1108", product_line_id: "line-cent-padronizado", code: "U-1108", name: "Box Vidro U", profile_type: "montante", weight_per_meter: 0.358, bar_length_mm: 6000, material: "alumínio", active: true },

  // ===== BOX VIDRO 8MM =====
  { id: "cent-ge-BX084P", product_line_id: "line-cent-padronizado", code: "BX-084P", name: "Box Vidro 8mm Arredondado", profile_type: "montante", weight_per_meter: 0.789, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-TMR845", product_line_id: "line-cent-padronizado", code: "TMR-845", name: "Box Vidro 8mm", profile_type: "montante", weight_per_meter: 0.585, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BX085", product_line_id: "line-cent-padronizado", code: "BX-085", name: "Box Vidro 8mm", profile_type: "montante", weight_per_meter: 0.214, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BX225", product_line_id: "line-cent-padronizado", code: "BX-225", name: "Box Vidro 8mm Baguete", profile_type: "baguete", weight_per_meter: 0.057, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BX443", product_line_id: "line-cent-padronizado", code: "BX-443", name: "Box Vidro 8mm", profile_type: "montante", weight_per_meter: 0.141, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-TMB081A", product_line_id: "line-cent-padronizado", code: "TMB-081A", name: "Box Vidro 8mm TMB", profile_type: "montante", weight_per_meter: 0.130, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-TMB081", product_line_id: "line-cent-padronizado", code: "TMB-081", name: "Box Vidro 8mm TMB", profile_type: "montante", weight_per_meter: 0.084, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-DP001", product_line_id: "line-cent-padronizado", code: "DP-001", name: "Box Vidro 8mm", profile_type: "montante", weight_per_meter: 0.141, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-DP002", product_line_id: "line-cent-padronizado", code: "DP-002", name: "Box Vidro 8mm", profile_type: "montante", weight_per_meter: 0.138, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-DP020", product_line_id: "line-cent-padronizado", code: "DP-020", name: "Box Vidro 8mm", profile_type: "montante", weight_per_meter: 0.160, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-19560", product_line_id: "line-cent-padronizado", code: "19-560", name: "Box Vidro 8mm", profile_type: "montante", weight_per_meter: 0.290, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BX006", product_line_id: "line-cent-padronizado", code: "BX-006", name: "Box Vidro 8mm Temperado", profile_type: "montante", weight_per_meter: 0.228, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-TMR716", product_line_id: "line-cent-padronizado", code: "TMR-716", name: "Box Vidro 8mm TMR", profile_type: "arremate", weight_per_meter: 0.084, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-L713B", product_line_id: "line-cent-padronizado", code: "L-713B", name: "Box Vidro 8mm L", profile_type: "arremate", weight_per_meter: 0.582, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-TMB106", product_line_id: "line-cent-padronizado", code: "TMB-106", name: "Box Vidro 8mm TMB", profile_type: "montante", weight_per_meter: 0.328, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-E512B", product_line_id: "line-cent-padronizado", code: "E-512B", name: "Box Vidro 8mm E", profile_type: "montante", weight_per_meter: 0.352, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-DP091", product_line_id: "line-cent-padronizado", code: "DP-091", name: "Box Vidro 8mm DP", profile_type: "montante", weight_per_meter: 0.648, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-39137", product_line_id: "line-cent-padronizado", code: "39-137", name: "Box Vidro 8mm", profile_type: "montante", weight_per_meter: 0.157, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-DP1656", product_line_id: "line-cent-padronizado", code: "DP-1656", name: "Box Vidro 8mm DP", profile_type: "montante", weight_per_meter: 0.165, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-TMB090", product_line_id: "line-cent-padronizado", code: "TMB-090", name: "Box Vidro 8mm TMB", profile_type: "arremate", weight_per_meter: 0.187, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BX100", product_line_id: "line-cent-padronizado", code: "BX-100", name: "Box Vidro 8mm", profile_type: "montante", weight_per_meter: 0.171, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BX200", product_line_id: "line-cent-padronizado", code: "BX-200", name: "Box Vidro 8mm", profile_type: "montante", weight_per_meter: 0.120, bar_length_mm: 6000, material: "alumínio", active: true },

  // ===== BOX VIDRO 8/10MM =====
  { id: "cent-ge-Y839", product_line_id: "line-cent-padronizado", code: "Y-839", name: "Box Vidro 8/10mm Y", profile_type: "montante", weight_per_meter: 0.832, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-U1319", product_line_id: "line-cent-padronizado", code: "U-1319", name: "Box Vidro 8/10mm U", profile_type: "montante", weight_per_meter: 0.241, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-39128", product_line_id: "line-cent-padronizado", code: "39-128", name: "Box Vidro 8/10mm", profile_type: "montante", weight_per_meter: 0.163, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-39077", product_line_id: "line-cent-padronizado", code: "39-077", name: "Box Vidro 8/10mm", profile_type: "montante", weight_per_meter: 0.075, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-29022", product_line_id: "line-cent-padronizado", code: "29-022", name: "Box Vidro 8/10mm", profile_type: "montante", weight_per_meter: 0.235, bar_length_mm: 6000, material: "alumínio", active: true },

  // ===== BOX VIDRO 10MM =====
  { id: "cent-ge-E512", product_line_id: "line-cent-padronizado", code: "E-512", name: "Box Vidro 10mm E", profile_type: "montante", weight_per_meter: 0.366, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-DP014", product_line_id: "line-cent-padronizado", code: "DP-014", name: "Box Vidro 10mm DP", profile_type: "montante", weight_per_meter: 0.160, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-E512A", product_line_id: "line-cent-padronizado", code: "E-512A", name: "Box Vidro 10mm E", profile_type: "montante", weight_per_meter: 0.380, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-U491", product_line_id: "line-cent-padronizado", code: "U-491", name: "Box Vidro 10mm U", profile_type: "montante", weight_per_meter: 0.095, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-DP1657", product_line_id: "line-cent-padronizado", code: "DP-1657", name: "Box Vidro 10mm DP", profile_type: "montante", weight_per_meter: 0.165, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-U555A", product_line_id: "line-cent-padronizado", code: "U-555A", name: "Box Vidro 10mm U", profile_type: "montante", weight_per_meter: 0.184, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-DP019", product_line_id: "line-cent-padronizado", code: "DP-019", name: "Box Vidro 10mm DP", profile_type: "montante", weight_per_meter: 0.379, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-DP054", product_line_id: "line-cent-padronizado", code: "DP-054", name: "Box Vidro 10mm Montante", profile_type: "montante", weight_per_meter: 1.537, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-DP055", product_line_id: "line-cent-padronizado", code: "DP-055", name: "Box Vidro 10mm Montante", profile_type: "montante", weight_per_meter: 1.537, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-DP056", product_line_id: "line-cent-padronizado", code: "DP-056", name: "Box Vidro 10mm Montante", profile_type: "montante", weight_per_meter: 1.287, bar_length_mm: 6000, material: "alumínio", active: true },

  // ===== BRISES =====
  { id: "cent-ge-D054", product_line_id: "line-cent-padronizado", code: "D-054", name: "Brise", profile_type: "arremate", weight_per_meter: 0.837, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-D059", product_line_id: "line-cent-padronizado", code: "D-059", name: "Brise", profile_type: "arremate", weight_per_meter: 0.845, bar_length_mm: 6000, material: "alumínio", active: true },

  // ===== BALAUSTRADAS E CORRIMÕES =====
  { id: "cent-ge-29040", product_line_id: "line-cent-padronizado", code: "29-040", name: "Balaustrada/Corrimão", profile_type: "montante", weight_per_meter: 0.186, bar_length_mm: 6000, material: "alumínio", active: true },

  // ===== CANTONEIRAS ADICIONAIS (da tabela geral) =====
  { id: "cent-ge-TMR543", product_line_id: "line-cent-padronizado", code: "TMR-543", name: "Cantoneira 1/2\" x 1mm", profile_type: "arremate", weight_per_meter: 0.060, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-TMR545", product_line_id: "line-cent-padronizado", code: "TMR-545", name: "Cantoneira 5/8\" x 1mm", profile_type: "arremate", weight_per_meter: 0.081, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-L455", product_line_id: "line-cent-padronizado", code: "L-455", name: "Cantoneira 5/8\" x 3/32\"", profile_type: "arremate", weight_per_meter: 0.169, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-TMR544", product_line_id: "line-cent-padronizado", code: "TMR-544", name: "Cantoneira 3/4\" x 1mm", profile_type: "arremate", weight_per_meter: 0.090, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-L012", product_line_id: "line-cent-padronizado", code: "L-012", name: "Cantoneira 7/8\" x 1/8\"", profile_type: "arremate", weight_per_meter: 0.355, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-TMR546", product_line_id: "line-cent-padronizado", code: "TMR-546", name: "Cantoneira 1\" x 1mm", profile_type: "arremate", weight_per_meter: 0.134, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-L741", product_line_id: "line-cent-padronizado", code: "L-741", name: "Cantoneira 1\" x 1.2mm", profile_type: "arremate", weight_per_meter: 0.160, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-L017", product_line_id: "line-cent-padronizado", code: "L-017", name: "Cantoneira 30mm x 5mm", profile_type: "arremate", weight_per_meter: 0.745, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-L744", product_line_id: "line-cent-padronizado", code: "L-744", name: "Cantoneira 1-1/2\" x 1.57mm", profile_type: "arremate", weight_per_meter: 0.317, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-L612", product_line_id: "line-cent-padronizado", code: "L-612", name: "Cantoneira 2\" x 2mm", profile_type: "arremate", weight_per_meter: 0.539, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-L747", product_line_id: "line-cent-padronizado", code: "L-747", name: "Cantoneira 3\" x 1/8\"", profile_type: "arremate", weight_per_meter: 1.284, bar_length_mm: 6000, material: "alumínio", active: true },

  // ===== CANTONEIRAS ABAS DESIGUAIS =====
  { id: "cent-ge-TMR615", product_line_id: "line-cent-padronizado", code: "TMR-615", name: "Cantoneira Desigual 18x5mm", profile_type: "arremate", weight_per_meter: 0.114, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-TMR1382", product_line_id: "line-cent-padronizado", code: "TMR-1382", name: "Cantoneira Desigual 3/4\"x1/2\"", profile_type: "arremate", weight_per_meter: 0.122, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-TMR799", product_line_id: "line-cent-padronizado", code: "TMR-799", name: "Cantoneira Desigual 3/4\"x1/2\"", profile_type: "arremate", weight_per_meter: 0.244, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-L093A", product_line_id: "line-cent-padronizado", code: "L-093A", name: "Cantoneira Desigual 1\"x1/2\"", profile_type: "arremate", weight_per_meter: 0.119, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-L093", product_line_id: "line-cent-padronizado", code: "L-093", name: "Cantoneira Desigual 1\"x1/2\"", profile_type: "arremate", weight_per_meter: 0.300, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-L581", product_line_id: "line-cent-padronizado", code: "L-581", name: "Cantoneira Desigual 32x16mm", profile_type: "arremate", weight_per_meter: 0.165, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-L100", product_line_id: "line-cent-padronizado", code: "L-100", name: "Cantoneira Desigual 1-1/2\"x1\"", profile_type: "arremate", weight_per_meter: 0.521, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-TMR857", product_line_id: "line-cent-padronizado", code: "TMR-857", name: "Cantoneira Desigual 2\"x1\"", profile_type: "arremate", weight_per_meter: 0.303, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-L104", product_line_id: "line-cent-padronizado", code: "L-104", name: "Cantoneira Desigual 2\"x1\"", profile_type: "arremate", weight_per_meter: 0.600, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-L114", product_line_id: "line-cent-padronizado", code: "L-114", name: "Cantoneira Desigual 3\"x1-1/2\"", profile_type: "arremate", weight_per_meter: 0.954, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-L057", product_line_id: "line-cent-padronizado", code: "L-057", name: "Cantoneira Desigual 3\"x2\"", profile_type: "arremate", weight_per_meter: 0.843, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-TMR1113", product_line_id: "line-cent-padronizado", code: "TMR-1113", name: "Cantoneira Desigual 94x30mm", profile_type: "arremate", weight_per_meter: 0.531, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-TMR412", product_line_id: "line-cent-padronizado", code: "TMR-412", name: "Cantoneira Desigual 100x25mm", profile_type: "arremate", weight_per_meter: 0.402, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-L780", product_line_id: "line-cent-padronizado", code: "L-780", name: "Cantoneira Desigual 4\"x2\"", profile_type: "arremate", weight_per_meter: 1.281, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-L439L", product_line_id: "line-cent-padronizado", code: "L-439-L", name: "Cantoneira Desigual 6\"x2\"", profile_type: "arremate", weight_per_meter: 1.718, bar_length_mm: 6000, material: "alumínio", active: true },

  // ===== PERFIS U ADICIONAIS =====
  { id: "cent-ge-U306", product_line_id: "line-cent-padronizado", code: "U-306", name: "Perfil U 1/2\" Pesado", profile_type: "guia", weight_per_meter: 0.274, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-U049", product_line_id: "line-cent-padronizado", code: "U-049", name: "Perfil U 5/8\" Pesado", profile_type: "guia", weight_per_meter: 0.278, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-U083", product_line_id: "line-cent-padronizado", code: "U-083", name: "Perfil U 1-1/2\"", profile_type: "guia", weight_per_meter: 0.930, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-U048", product_line_id: "line-cent-padronizado", code: "U-048", name: "Perfil U Desigual 3/8\"", profile_type: "guia", weight_per_meter: 0.195, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-U037", product_line_id: "line-cent-padronizado", code: "U-037", name: "Perfil U Desigual 1/2\"", profile_type: "guia", weight_per_meter: 0.129, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-U056", product_line_id: "line-cent-padronizado", code: "U-056", name: "Perfil U Desigual 1/2\"x3/4\"", profile_type: "guia", weight_per_meter: 0.257, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-U069", product_line_id: "line-cent-padronizado", code: "U-069", name: "Perfil U Desigual 1/2\"x1\"", profile_type: "guia", weight_per_meter: 0.380, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-U505", product_line_id: "line-cent-padronizado", code: "U-505", name: "Perfil U Desigual 2\"", profile_type: "guia", weight_per_meter: 1.026, bar_length_mm: 6000, material: "alumínio", active: true },

  // ===== BARRAS ADICIONAIS (da tabela geral) =====
  { id: "cent-ge-BAR045", product_line_id: "line-cent-padronizado", code: "BAR-045", name: "Barra 3/8\" x 3/16\"", profile_type: "arremate", weight_per_meter: 0.122, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BAR047", product_line_id: "line-cent-padronizado", code: "BAR-047", name: "Barra 1/2\" x 3/16\"", profile_type: "arremate", weight_per_meter: 0.163, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BAR086", product_line_id: "line-cent-padronizado", code: "BAR-086", name: "Barra 1/2\" x 1/4\"", profile_type: "arremate", weight_per_meter: 0.217, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BAR049", product_line_id: "line-cent-padronizado", code: "BAR-049", name: "Barra 5/8\" x 3/16\"", profile_type: "arremate", weight_per_meter: 0.204, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BAR088", product_line_id: "line-cent-padronizado", code: "BAR-088", name: "Barra 5/8\" x 1/4\"", profile_type: "arremate", weight_per_meter: 0.272, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BAR050", product_line_id: "line-cent-padronizado", code: "BAR-050", name: "Barra 3/4\" x 3/16\"", profile_type: "arremate", weight_per_meter: 0.245, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BAR089", product_line_id: "line-cent-padronizado", code: "BAR-089", name: "Barra 3/4\" x 1/4\"", profile_type: "arremate", weight_per_meter: 0.326, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BAR015", product_line_id: "line-cent-padronizado", code: "BAR-015", name: "Barra 7/8\" x 1/8\"", profile_type: "arremate", weight_per_meter: 0.191, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BAR052", product_line_id: "line-cent-padronizado", code: "BAR-052", name: "Barra 7/8\" x 3/16\"", profile_type: "arremate", weight_per_meter: 0.286, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BAR090", product_line_id: "line-cent-padronizado", code: "BAR-090", name: "Barra 7/8\" x 1/4\"", profile_type: "arremate", weight_per_meter: 0.380, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BAR053", product_line_id: "line-cent-padronizado", code: "BAR-053", name: "Barra 1\" x 3/16\"", profile_type: "arremate", weight_per_meter: 0.326, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BAR091", product_line_id: "line-cent-padronizado", code: "BAR-091", name: "Barra 1\" x 1/4\"", profile_type: "arremate", weight_per_meter: 0.435, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BAR160", product_line_id: "line-cent-padronizado", code: "BAR-160", name: "Barra 1\" x 1/2\"", profile_type: "arremate", weight_per_meter: 0.875, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BAR054", product_line_id: "line-cent-padronizado", code: "BAR-054", name: "Barra 1-1/4\" x 3/16\"", profile_type: "arremate", weight_per_meter: 0.408, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BAR093", product_line_id: "line-cent-padronizado", code: "BAR-093", name: "Barra 1-1/4\" x 1/4\"", profile_type: "arremate", weight_per_meter: 0.544, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BAR132", product_line_id: "line-cent-padronizado", code: "BAR-132", name: "Barra 1-1/4\" x 3/8\"", profile_type: "arremate", weight_per_meter: 0.819, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BAR057", product_line_id: "line-cent-padronizado", code: "BAR-057", name: "Barra 1-1/2\" x 3/16\"", profile_type: "arremate", weight_per_meter: 0.490, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BAR096", product_line_id: "line-cent-padronizado", code: "BAR-096", name: "Barra 1-1/2\" x 1/4\"", profile_type: "arremate", weight_per_meter: 0.653, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BAR061", product_line_id: "line-cent-padronizado", code: "BAR-061", name: "Barra 2\" x 3/16\"", profile_type: "arremate", weight_per_meter: 0.653, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BAR137", product_line_id: "line-cent-padronizado", code: "BAR-137", name: "Barra 2\" x 3/8\"", profile_type: "arremate", weight_per_meter: 1.312, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BAR168", product_line_id: "line-cent-padronizado", code: "BAR-168", name: "Barra 2\" x 1/2\"", profile_type: "arremate", weight_per_meter: 1.748, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BAR032", product_line_id: "line-cent-padronizado", code: "BAR-032", name: "Barra 3\" x 1/8\"", profile_type: "arremate", weight_per_meter: 0.654, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BAR106", product_line_id: "line-cent-padronizado", code: "BAR-106", name: "Barra 3\" x 1/4\"", profile_type: "arremate", weight_per_meter: 1.312, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-BAR175", product_line_id: "line-cent-padronizado", code: "BAR-175", name: "Barra 3\" x 1/2\"", profile_type: "arremate", weight_per_meter: 2.611, bar_length_mm: 6000, material: "alumínio", active: true },

  // ===== TUBOS QUADRADOS ADICIONAIS =====
  { id: "cent-ge-TUB4011L", product_line_id: "line-cent-padronizado", code: "TUB-4011-L", name: "Tubo Quad. 1-1/4\" Leve", profile_type: "montante", weight_per_meter: 0.395, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-TUB4014L", product_line_id: "line-cent-padronizado", code: "TUB-4014-L", name: "Tubo Quad. 1-1/2\" Leve", profile_type: "montante", weight_per_meter: 0.475, bar_length_mm: 6000, material: "alumínio", active: true },
  { id: "cent-ge-TUB4020A", product_line_id: "line-cent-padronizado", code: "TUB-4020A", name: "Tubo Quad. 2\" Leve", profile_type: "montante", weight_per_meter: 0.697, bar_length_mm: 6000, material: "alumínio", active: true },

  // ===== DIVERSOS =====
  { id: "cent-ge-DP082", product_line_id: "line-cent-padronizado", code: "DP-082", name: "Brise/Divisória", profile_type: "montante", weight_per_meter: 0.439, bar_length_mm: 6000, material: "alumínio", active: true },
];
