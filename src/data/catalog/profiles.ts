import type { Profile } from "@/types/calculation";

// ============================================
// PERFIS - LINHA SUPREMA (25mm)
// Dados reais compilados de: Alubold, Poliformas, Bogoni, Alueste
// Fonte: catálogos públicos de distribuidores (2024/2025)
// ============================================
const supremaProfiles: Profile[] = [
  // --- Perfis de Trilho / Marco Superior/Inferior ---
  { id: "p-su001", product_line_id: "line-suprema", code: "SU-001", name: "Trilho Superior 2F", profile_type: "trilho", weight_per_meter: 0.738, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su002", product_line_id: "line-suprema", code: "SU-002", name: "Marco Inferior / Trilho 2F", profile_type: "trilho", weight_per_meter: 0.493, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su003", product_line_id: "line-suprema", code: "SU-003", name: "Marco Lateral 2F", profile_type: "marco", weight_per_meter: 0.493, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su004", product_line_id: "line-suprema", code: "SU-004", name: "Marco Superior Bandeira / Peitoril", profile_type: "marco", weight_per_meter: 0.502, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su005", product_line_id: "line-suprema", code: "SU-005", name: "Trilho Inferior 3F", profile_type: "trilho", weight_per_meter: 1.093, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su006", product_line_id: "line-suprema", code: "SU-006", name: "Trilho Superior 3F", profile_type: "trilho", weight_per_meter: 1.042, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su007", product_line_id: "line-suprema", code: "SU-007", name: "Baguete", profile_type: "baguete", weight_per_meter: 0.385, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su008", product_line_id: "line-suprema", code: "SU-008", name: "Batente Lateral", profile_type: "arremate", weight_per_meter: 0.247, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su009", product_line_id: "line-suprema", code: "SU-009", name: "Marco Lateral 3F", profile_type: "marco", weight_per_meter: 0.906, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su010", product_line_id: "line-suprema", code: "SU-010", name: "Marco Superior", profile_type: "marco", weight_per_meter: 0.989, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su011", product_line_id: "line-suprema", code: "SU-011", name: "Marco Lateral Fixo", profile_type: "marco", weight_per_meter: 0.939, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su012", product_line_id: "line-suprema", code: "SU-012", name: "Guia Inferior", profile_type: "guia", weight_per_meter: 0.542, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  // Fonte: Poliformas — SU-013 e SU-014
  { id: "p-su013", product_line_id: "line-suprema", code: "SU-013", name: "Marco Lateral Duplo 3 Folhas", profile_type: "marco", weight_per_meter: 0.725, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su014", product_line_id: "line-suprema", code: "SU-014", name: "Marco Lateral Único 3 Folhas", profile_type: "marco", weight_per_meter: 0.628, bar_length_mm: 6000, material: "AL 6063-T5", active: true },

  // --- Perfis de Montante e Travessa de Folha ---
  { id: "p-su036", product_line_id: "line-suprema", code: "SU-036", name: "Montante da Folha", profile_type: "montante", weight_per_meter: 0.428, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su039", product_line_id: "line-suprema", code: "SU-039", name: "Montante Folha c/ Baguete", profile_type: "montante", weight_per_meter: 0.488, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su040", product_line_id: "line-suprema", code: "SU-040", name: "Travessa da Folha", profile_type: "travessa", weight_per_meter: 0.455, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su041", product_line_id: "line-suprema", code: "SU-041", name: "Montante Camarão", profile_type: "montante", weight_per_meter: 0.485, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su042", product_line_id: "line-suprema", code: "SU-042", name: "Montante Camarão c/ Baguete", profile_type: "montante", weight_per_meter: 0.531, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su047", product_line_id: "line-suprema", code: "SU-047", name: "Trilho Superior 4F", profile_type: "trilho", weight_per_meter: 1.048, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su049", product_line_id: "line-suprema", code: "SU-049", name: "Trilho Inferior 4F", profile_type: "trilho", weight_per_meter: 1.068, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su053", product_line_id: "line-suprema", code: "SU-053", name: "Travessa da Folha", profile_type: "travessa", weight_per_meter: 0.470, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  // Fonte: Poliformas — SU-068
  { id: "p-su068", product_line_id: "line-suprema", code: "SU-068", name: "Montante Folha sem Baguete", profile_type: "montante", weight_per_meter: 0.518, bar_length_mm: 6000, material: "AL 6063-T5", active: true },

  // --- Perfis de Camarão ---
  // Fonte: Alueste — SU-072
  { id: "p-su072", product_line_id: "line-suprema", code: "SU-072", name: "Montante Camarão", profile_type: "montante", weight_per_meter: 0.439, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  // SU-073: Travessa Camarão — peso confirmado pela Pacre como perfil camarão
  { id: "p-su073", product_line_id: "line-suprema", code: "SU-073", name: "Travessa Camarão", profile_type: "travessa", weight_per_meter: 0.380, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Peso estimado — confirmar com catálogo do fabricante" },

  // --- Perfis de Cadeirinha / Arremate ---
  { id: "p-su071", product_line_id: "line-suprema", code: "SU-071", name: "Cadeirinha", profile_type: "arremate", weight_per_meter: 0.276, bar_length_mm: 6000, material: "AL 6063-T5", active: true },

  // --- Perfis Maxim-Ar ---
  { id: "p-su079", product_line_id: "line-suprema", code: "SU-079", name: "Montante Maxim-Ar", profile_type: "montante", weight_per_meter: 0.341, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su080", product_line_id: "line-suprema", code: "SU-080", name: "Travessa Maxim-Ar", profile_type: "travessa", weight_per_meter: 0.360, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su081", product_line_id: "line-suprema", code: "SU-081", name: "Montante Maxim-Ar c/ Baguete", profile_type: "montante", weight_per_meter: 0.406, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su082", product_line_id: "line-suprema", code: "SU-082", name: "Travessa Maxim-Ar c/ Baguete", profile_type: "travessa", weight_per_meter: 0.382, bar_length_mm: 6000, material: "AL 6063-T5", active: true },

  // --- Perfis Veneziana ---
  { id: "p-su083", product_line_id: "line-suprema", code: "SU-083", name: "Palheta Veneziana", profile_type: "arremate", weight_per_meter: 0.145, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su192", product_line_id: "line-suprema", code: "SU-192", name: "Montante Folha Veneziana", profile_type: "montante", weight_per_meter: 0.524, bar_length_mm: 6000, material: "AL 6063-T5", active: true },

  // --- Perfis Basculante ---
  { id: "p-su085", product_line_id: "line-suprema", code: "SU-085", name: "Montante Basculante", profile_type: "montante", weight_per_meter: 0.485, bar_length_mm: 6000, material: "AL 6063-T5", active: true },

  // --- Perfis Porta de Giro ---
  { id: "p-su086", product_line_id: "line-suprema", code: "SU-086", name: "Marco Porta de Giro", profile_type: "marco", weight_per_meter: 0.595, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  // SU-089: Batente/Marco Porta Giro — peso não encontrado online, estimativa baseada em perfis similares
  { id: "p-su089", product_line_id: "line-suprema", code: "SU-089", name: "Batente / Marco Porta Giro", profile_type: "marco", weight_per_meter: 0.750, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Peso estimado — confirmar com catálogo do fabricante" },
  { id: "p-su110", product_line_id: "line-suprema", code: "SU-110", name: "Montante Porta de Giro", profile_type: "montante", weight_per_meter: 0.534, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su111", product_line_id: "line-suprema", code: "SU-111", name: "Montante Porta Giro c/ Baguete", profile_type: "montante", weight_per_meter: 0.615, bar_length_mm: 6000, material: "AL 6063-T5", active: true },

  // --- Perfis Baguete / Insert ---
  { id: "p-su102", product_line_id: "line-suprema", code: "SU-102", name: "Baguete Reto", profile_type: "baguete", weight_per_meter: 0.110, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-isu502", product_line_id: "line-suprema", code: "ISU-502", name: "Baguete Arredondado", profile_type: "baguete", weight_per_meter: 0.110, bar_length_mm: 6000, material: "AL 6063-T5", active: true },

  // --- Perfis de Arremate ---
  { id: "p-su103", product_line_id: "line-suprema", code: "SU-103", name: "Arremate", profile_type: "arremate", weight_per_meter: 0.141, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su108", product_line_id: "line-suprema", code: "SU-108", name: "Arremate Veneziana", profile_type: "arremate", weight_per_meter: 0.141, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su271", product_line_id: "line-suprema", code: "SU-271", name: "Cadeirinha", profile_type: "arremate", weight_per_meter: 0.299, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su272", product_line_id: "line-suprema", code: "SU-272", name: "Arremate", profile_type: "arremate", weight_per_meter: 0.411, bar_length_mm: 6000, material: "AL 6063-T5", active: true },

  // --- Perfis Porta de Correr ---
  { id: "p-su120", product_line_id: "line-suprema", code: "SU-120", name: "Marco Lateral Porta Correr", profile_type: "marco", weight_per_meter: 0.466, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su121", product_line_id: "line-suprema", code: "SU-121", name: "Trilho Superior 3/4/6 Folhas", profile_type: "trilho", weight_per_meter: 1.415, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su122", product_line_id: "line-suprema", code: "SU-122", name: "Trilho Inferior 3/4/6 Folhas", profile_type: "trilho", weight_per_meter: 1.413, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su123", product_line_id: "line-suprema", code: "SU-123", name: "Marco Lateral 4F", profile_type: "marco", weight_per_meter: 0.968, bar_length_mm: 6000, material: "AL 6063-T5", active: true },

  // --- Perfis Porta ---
  { id: "p-su225", product_line_id: "line-suprema", code: "SU-225", name: "Marco Porta Correr", profile_type: "marco", weight_per_meter: 0.996, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su227", product_line_id: "line-suprema", code: "SU-227", name: "Marco Porta Correr", profile_type: "marco", weight_per_meter: 0.996, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su230", product_line_id: "line-suprema", code: "SU-230", name: "Marco Inferior Porta Correr", profile_type: "marco", weight_per_meter: 0.932, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su243", product_line_id: "line-suprema", code: "SU-243", name: "Montante", profile_type: "montante", weight_per_meter: 0.713, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su244", product_line_id: "line-suprema", code: "SU-244", name: "Montante", profile_type: "montante", weight_per_meter: 0.742, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su245", product_line_id: "line-suprema", code: "SU-245", name: "Travessa", profile_type: "travessa", weight_per_meter: 0.672, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su250", product_line_id: "line-suprema", code: "SU-250", name: "Montante", profile_type: "montante", weight_per_meter: 0.728, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su260", product_line_id: "line-suprema", code: "SU-260", name: "Montante", profile_type: "montante", weight_per_meter: 0.610, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su279", product_line_id: "line-suprema", code: "SU-279", name: "Montante Caixilho Porta Giro", profile_type: "montante", weight_per_meter: 0.552, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su280", product_line_id: "line-suprema", code: "SU-280", name: "Marco Porta", profile_type: "marco", weight_per_meter: 0.969, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su291", product_line_id: "line-suprema", code: "SU-291", name: "Batente Central", profile_type: "arremate", weight_per_meter: 0.252, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  // Fonte: Poliformas — SU-292
  { id: "p-su292", product_line_id: "line-suprema", code: "SU-292", name: "Inversor para Baguete", profile_type: "montante", weight_per_meter: 0.210, bar_length_mm: 6000, material: "AL 6063-T5", active: true },

  // --- Perfis Especiais ---
  { id: "p-su200", product_line_id: "line-suprema", code: "SU-200", name: "Contramarco", profile_type: "contramarco", weight_per_meter: 0.443, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-sutrilho", product_line_id: "line-suprema", code: "TRILHO-MAC", name: "Trilho Macarrão", profile_type: "trilho", weight_per_meter: 0.183, bar_length_mm: 6000, material: "AL 6063-T5", active: true },

  // Códigos auxiliares usados pelas regras de corte
  { id: "p-cm200", product_line_id: "line-suprema", code: "CM-200", name: "Contramarco", profile_type: "contramarco", weight_per_meter: 0.443, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-pal", product_line_id: "line-suprema", code: "PAL", name: "Palheta Veneziana", profile_type: "arremate", weight_per_meter: 0.145, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
];

// ============================================
// PERFIS - LINHA GOLD (32mm)
// Dados reais: Alubold (código LG-xxx com pesos reais)
// Os códigos GO-xxx são mantidos para compatibilidade com regras de corte
// existentes, com pesos estimados por equivalência funcional.
// ============================================
const goldProfiles: Profile[] = [
  // --- Perfis reais da Linha Gold (fonte: Alubold) ---
  { id: "p-lg002", product_line_id: "line-gold", code: "LG-002", name: "Marco / Travessa Gold", profile_type: "marco", weight_per_meter: 0.640, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg003", product_line_id: "line-gold", code: "LG-003", name: "Marco Gold", profile_type: "marco", weight_per_meter: 0.751, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg004", product_line_id: "line-gold", code: "LG-004", name: "Trilho Inferior Gold", profile_type: "trilho", weight_per_meter: 1.997, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg006", product_line_id: "line-gold", code: "LG-006", name: "Marco Lateral Gold", profile_type: "marco", weight_per_meter: 0.678, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg007", product_line_id: "line-gold", code: "LG-007", name: "Trilho / Marco Gold", profile_type: "trilho", weight_per_meter: 1.216, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg015", product_line_id: "line-gold", code: "LG-015", name: "Baguete Gold", profile_type: "baguete", weight_per_meter: 0.138, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg016", product_line_id: "line-gold", code: "LG-016", name: "Arremate Gold", profile_type: "arremate", weight_per_meter: 0.301, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg018", product_line_id: "line-gold", code: "LG-018", name: "Trilho Gold", profile_type: "trilho", weight_per_meter: 1.572, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg022", product_line_id: "line-gold", code: "LG-022", name: "Marco Gold", profile_type: "marco", weight_per_meter: 1.059, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg024", product_line_id: "line-gold", code: "LG-024", name: "Marco Porta Gold", profile_type: "marco", weight_per_meter: 1.262, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg027", product_line_id: "line-gold", code: "LG-027", name: "Baguete Gold", profile_type: "baguete", weight_per_meter: 0.154, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg028", product_line_id: "line-gold", code: "LG-028", name: "Arremate / Cadeirinha Gold", profile_type: "arremate", weight_per_meter: 0.458, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg042", product_line_id: "line-gold", code: "LG-042", name: "Marco Superior Gold", profile_type: "marco", weight_per_meter: 1.103, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg043", product_line_id: "line-gold", code: "LG-043", name: "Marco Lateral Gold", profile_type: "marco", weight_per_meter: 0.903, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg044", product_line_id: "line-gold", code: "LG-044", name: "Marco Gold", profile_type: "marco", weight_per_meter: 1.231, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg045", product_line_id: "line-gold", code: "LG-045", name: "Marco Lateral 3F Gold", profile_type: "marco", weight_per_meter: 0.955, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg047", product_line_id: "line-gold", code: "LG-047", name: "Marco / Trilho Gold", profile_type: "trilho", weight_per_meter: 1.122, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg048", product_line_id: "line-gold", code: "LG-048", name: "Montante Gold", profile_type: "montante", weight_per_meter: 0.886, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg049", product_line_id: "line-gold", code: "LG-049", name: "Montante Folha Gold", profile_type: "montante", weight_per_meter: 0.840, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg050", product_line_id: "line-gold", code: "LG-050", name: "Montante Gold", profile_type: "montante", weight_per_meter: 0.794, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg051", product_line_id: "line-gold", code: "LG-051", name: "Montante Gold", profile_type: "montante", weight_per_meter: 0.900, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg052", product_line_id: "line-gold", code: "LG-052", name: "Trilho Inferior Gold", profile_type: "trilho", weight_per_meter: 1.666, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg055", product_line_id: "line-gold", code: "LG-055", name: "Montante Veneziana Gold", profile_type: "montante", weight_per_meter: 0.752, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg056", product_line_id: "line-gold", code: "LG-056", name: "Travessa Gold", profile_type: "travessa", weight_per_meter: 0.610, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg057", product_line_id: "line-gold", code: "LG-057", name: "Baguete Gold", profile_type: "baguete", weight_per_meter: 0.175, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg058", product_line_id: "line-gold", code: "LG-058", name: "Montante Maxim-Ar Gold", profile_type: "montante", weight_per_meter: 0.732, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg059", product_line_id: "line-gold", code: "LG-059", name: "Baguete Arredondado Gold", profile_type: "baguete", weight_per_meter: 0.171, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg061", product_line_id: "line-gold", code: "LG-061", name: "Cadeirinha Gold", profile_type: "arremate", weight_per_meter: 0.317, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg062", product_line_id: "line-gold", code: "LG-062", name: "Trilho 3/6F Gold", profile_type: "trilho", weight_per_meter: 1.723, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg064", product_line_id: "line-gold", code: "LG-064", name: "Marco Gold", profile_type: "marco", weight_per_meter: 1.356, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg066", product_line_id: "line-gold", code: "LG-066", name: "Marco / Trilho Gold", profile_type: "trilho", weight_per_meter: 1.522, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg068", product_line_id: "line-gold", code: "LG-068", name: "Arremate Gold", profile_type: "arremate", weight_per_meter: 0.444, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg070", product_line_id: "line-gold", code: "LG-070", name: "Trilho Pesado Gold", profile_type: "trilho", weight_per_meter: 2.265, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg071", product_line_id: "line-gold", code: "LG-071", name: "Trilho Gold", profile_type: "trilho", weight_per_meter: 2.011, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg072", product_line_id: "line-gold", code: "LG-072", name: "Marco / Montante Gold", profile_type: "montante", weight_per_meter: 1.165, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg085", product_line_id: "line-gold", code: "LG-085", name: "Travessa Gold", profile_type: "travessa", weight_per_meter: 0.558, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-lg158", product_line_id: "line-gold", code: "LG-158", name: "Montante Gold", profile_type: "montante", weight_per_meter: 0.850, bar_length_mm: 6000, material: "AL 6063-T5", active: true },

  // --- Códigos GO-xxx (compatibilidade com regras de corte existentes) ---
  // NOTA: Estes códigos são mapeamentos funcionais. Os pesos são estimados
  // por equivalência com os perfis LG-xxx reais acima.
  { id: "p-go010", product_line_id: "line-gold", code: "GO-010", name: "Marco Superior Gold", profile_type: "marco", weight_per_meter: 1.103, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Equivalente funcional a LG-042" },
  { id: "p-go012", product_line_id: "line-gold", code: "GO-012", name: "Marco Inferior / Trilho Gold", profile_type: "trilho", weight_per_meter: 1.572, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Equivalente funcional a LG-018" },
  { id: "p-go013", product_line_id: "line-gold", code: "GO-013", name: "Marco Lateral 3F Gold", profile_type: "marco", weight_per_meter: 0.955, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Equivalente funcional a LG-045" },
  { id: "p-go014", product_line_id: "line-gold", code: "GO-014", name: "Marco Lateral Gold", profile_type: "marco", weight_per_meter: 0.903, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Equivalente funcional a LG-043" },
  { id: "p-go039", product_line_id: "line-gold", code: "GO-039", name: "Montante Folha Gold", profile_type: "montante", weight_per_meter: 0.840, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Equivalente funcional a LG-049" },
  { id: "p-go053", product_line_id: "line-gold", code: "GO-053", name: "Travessa Folha Gold", profile_type: "travessa", weight_per_meter: 0.610, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Equivalente funcional a LG-056" },
  { id: "p-go068", product_line_id: "line-gold", code: "GO-068", name: "Montante Veneziana Gold", profile_type: "montante", weight_per_meter: 0.752, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Equivalente funcional a LG-055" },
  { id: "p-go072", product_line_id: "line-gold", code: "GO-072", name: "Montante Camarão Gold", profile_type: "montante", weight_per_meter: 0.794, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Equivalente funcional a LG-050" },
  { id: "p-go073", product_line_id: "line-gold", code: "GO-073", name: "Travessa Camarão Gold", profile_type: "travessa", weight_per_meter: 0.558, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Equivalente funcional a LG-085" },
  { id: "p-go079", product_line_id: "line-gold", code: "GO-079", name: "Montante Maxim-Ar Gold", profile_type: "montante", weight_per_meter: 0.732, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Equivalente funcional a LG-058" },
  { id: "p-go080", product_line_id: "line-gold", code: "GO-080", name: "Travessa Maxim-Ar Gold", profile_type: "travessa", weight_per_meter: 0.640, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Equivalente funcional a LG-002" },
  { id: "p-go089", product_line_id: "line-gold", code: "GO-089", name: "Marco Porta Giro Gold", profile_type: "marco", weight_per_meter: 1.262, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Equivalente funcional a LG-024" },
  { id: "p-go111", product_line_id: "line-gold", code: "GO-111", name: "Montante Porta Giro Gold", profile_type: "montante", weight_per_meter: 1.059, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Equivalente funcional a LG-022" },
  { id: "p-go121", product_line_id: "line-gold", code: "GO-121", name: "Trilho 3/6F Gold", profile_type: "trilho", weight_per_meter: 1.723, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Equivalente funcional a LG-062" },
  { id: "p-go292", product_line_id: "line-gold", code: "GO-292", name: "Montante Central Gold", profile_type: "montante", weight_per_meter: 0.886, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Equivalente funcional a LG-048" },
  { id: "p-igo502", product_line_id: "line-gold", code: "IGO-502", name: "Baguete Gold", profile_type: "baguete", weight_per_meter: 0.175, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Equivalente funcional a LG-057" },
];

// ============================================
// PERFIS - LINHA TOP (40mm) — Fachadas
// NOTA: Dados NÃO confirmados com catálogo real.
// Precisam de atualização com catálogo do fabricante.
// ============================================
const topProfiles: Profile[] = [
  { id: "p-tp010", product_line_id: "line-top", code: "TP-010", name: "Marco Superior Top", profile_type: "marco", weight_per_meter: 0.880, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Peso não confirmado — aguardando catálogo real" },
  { id: "p-tp012", product_line_id: "line-top", code: "TP-012", name: "Marco Inferior / Trilho Top", profile_type: "trilho", weight_per_meter: 1.280, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Peso não confirmado" },
  { id: "p-tp014", product_line_id: "line-top", code: "TP-014", name: "Marco Lateral Top", profile_type: "marco", weight_per_meter: 0.960, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Peso não confirmado" },
  { id: "p-tp039", product_line_id: "line-top", code: "TP-039", name: "Montante Folha Top", profile_type: "montante", weight_per_meter: 0.750, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Peso não confirmado" },
  { id: "p-tp053", product_line_id: "line-top", code: "TP-053", name: "Travessa Folha Top", profile_type: "travessa", weight_per_meter: 0.580, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Peso não confirmado" },
  { id: "p-tp072", product_line_id: "line-top", code: "TP-072", name: "Montante Camarão Top", profile_type: "montante", weight_per_meter: 0.720, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Peso não confirmado" },
  { id: "p-tp073", product_line_id: "line-top", code: "TP-073", name: "Travessa Camarão Top", profile_type: "travessa", weight_per_meter: 0.550, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Peso não confirmado" },
  { id: "p-tp079", product_line_id: "line-top", code: "TP-079", name: "Montante Maxim-Ar Top", profile_type: "montante", weight_per_meter: 0.770, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Peso não confirmado" },
  { id: "p-tp080", product_line_id: "line-top", code: "TP-080", name: "Travessa Maxim-Ar Top", profile_type: "travessa", weight_per_meter: 0.610, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Peso não confirmado" },
  { id: "p-tp089", product_line_id: "line-top", code: "TP-089", name: "Marco Porta Giro Top", profile_type: "marco", weight_per_meter: 1.120, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Peso não confirmado" },
  { id: "p-tp095", product_line_id: "line-top", code: "TP-095", name: "Montante Pivotante Top", profile_type: "montante", weight_per_meter: 0.830, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Peso não confirmado" },
  { id: "p-tp096", product_line_id: "line-top", code: "TP-096", name: "Travessa Pivotante Top", profile_type: "travessa", weight_per_meter: 0.640, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Peso não confirmado" },
  { id: "p-tp111", product_line_id: "line-top", code: "TP-111", name: "Montante Porta Giro Top", profile_type: "montante", weight_per_meter: 0.950, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Peso não confirmado" },
  { id: "p-tp292", product_line_id: "line-top", code: "TP-292", name: "Montante Central Top", profile_type: "montante", weight_per_meter: 0.920, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Peso não confirmado" },
  { id: "p-itp502", product_line_id: "line-top", code: "ITP-502", name: "Baguete Top", profile_type: "baguete", weight_per_meter: 0.170, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Peso não confirmado" },
  // Perfis estruturais para Fachada
  { id: "p-tp601", product_line_id: "line-top", code: "TP-601", name: "Montante Estrutural Fachada", profile_type: "montante", weight_per_meter: 1.850, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Peso não confirmado" },
  { id: "p-tp602", product_line_id: "line-top", code: "TP-602", name: "Travessa Estrutural Fachada", profile_type: "travessa", weight_per_meter: 1.420, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Peso não confirmado" },
  { id: "p-tp603", product_line_id: "line-top", code: "TP-603", name: "Montante Intermediário Fachada", profile_type: "montante", weight_per_meter: 1.650, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Peso não confirmado" },
  { id: "p-tp604", product_line_id: "line-top", code: "TP-604", name: "Perfil Pressão Vidro Fachada", profile_type: "baguete", weight_per_meter: 0.380, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Peso não confirmado" },
  { id: "p-tp605", product_line_id: "line-top", code: "TP-605", name: "Travessa Intermediária Muro Cortina", profile_type: "travessa", weight_per_meter: 1.320, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Peso não confirmado" },
];

// ============================================
// PERFIS - DECAMP LINHA 45 (Catálogo Geral / Madeira)
// Fonte: Catálogo Geral Decamp Edição 01/2026
// Todos os pesos (kg/m) são reais, extraídos do catálogo oficial
// ============================================
const decampLinha45Profiles: Profile[] = [
  // --- PF-45.xxx: Marcos e Trilhos (estrutura 45mm) ---
  { id: "p-dc-pf45016", product_line_id: "line-decamp45", code: "PF-45.016", name: "Arremate", profile_type: "arremate", weight_per_meter: 0.236, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf45017", product_line_id: "line-decamp45", code: "PF-45.017", name: "Baguete", profile_type: "baguete", weight_per_meter: 0.242, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf45018", product_line_id: "line-decamp45", code: "PF-45.018", name: "Marco Superior / Inferior", profile_type: "marco", weight_per_meter: 2.122, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf45019", product_line_id: "line-decamp45", code: "PF-45.019", name: "Marco Lateral", profile_type: "marco", weight_per_meter: 1.250, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf45023", product_line_id: "line-decamp45", code: "PF-45.023", name: "Arremate Inferior", profile_type: "arremate", weight_per_meter: 0.414, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf45024", product_line_id: "line-decamp45", code: "PF-45.024", name: "Marco Inferior / Trilho", profile_type: "trilho", weight_per_meter: 1.560, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf45043", product_line_id: "line-decamp45", code: "PF-45.043", name: "Marco Lateral Pesado", profile_type: "marco", weight_per_meter: 1.933, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf45044", product_line_id: "line-decamp45", code: "PF-45.044", name: "Marco Lateral", profile_type: "marco", weight_per_meter: 1.087, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf45045", product_line_id: "line-decamp45", code: "PF-45.045", name: "Marco / Travessa", profile_type: "marco", weight_per_meter: 1.342, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf45046", product_line_id: "line-decamp45", code: "PF-45.046", name: "Guia", profile_type: "guia", weight_per_meter: 0.593, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf45047", product_line_id: "line-decamp45", code: "PF-45.047", name: "Arremate / Guia", profile_type: "arremate", weight_per_meter: 0.271, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf45048", product_line_id: "line-decamp45", code: "PF-45.048", name: "Cadeirinha", profile_type: "arremate", weight_per_meter: 0.186, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf45061", product_line_id: "line-decamp45", code: "PF-45.061", name: "Guia Inferior", profile_type: "guia", weight_per_meter: 0.621, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf45110", product_line_id: "line-decamp45", code: "PF-45.110", name: "Marco / Travessa", profile_type: "marco", weight_per_meter: 1.472, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf45120", product_line_id: "line-decamp45", code: "PF-45.120", name: "Arremate / Contramarco", profile_type: "contramarco", weight_per_meter: 0.453, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf45121", product_line_id: "line-decamp45", code: "PF-45.121", name: "Baguete / Arremate", profile_type: "baguete", weight_per_meter: 0.252, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf45122", product_line_id: "line-decamp45", code: "PF-45.122", name: "Marco Lateral", profile_type: "marco", weight_per_meter: 0.970, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf45123", product_line_id: "line-decamp45", code: "PF-45.123", name: "Marco / Trilho", profile_type: "trilho", weight_per_meter: 1.113, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf4510", product_line_id: "line-decamp45", code: "PF-4510", name: "Marco / Trilho Principal", profile_type: "trilho", weight_per_meter: 1.334, bar_length_mm: 6000, material: "AL 6063-T5", active: true },

  // --- PF-xxx: Perfis complementares ---
  { id: "p-dc-pf050", product_line_id: "line-decamp45", code: "PF-050", name: "Arremate", profile_type: "arremate", weight_per_meter: 0.282, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf051", product_line_id: "line-decamp45", code: "PF-051", name: "Arremate", profile_type: "arremate", weight_per_meter: 0.268, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf052", product_line_id: "line-decamp45", code: "PF-052", name: "Arremate", profile_type: "arremate", weight_per_meter: 0.238, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf056", product_line_id: "line-decamp45", code: "PF-056", name: "Arremate / Capa", profile_type: "arremate", weight_per_meter: 0.233, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf130", product_line_id: "line-decamp45", code: "PF-130", name: "Marco Lateral", profile_type: "marco", weight_per_meter: 0.667, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf131", product_line_id: "line-decamp45", code: "PF-131", name: "Baguete / Vedação", profile_type: "baguete", weight_per_meter: 0.499, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf133", product_line_id: "line-decamp45", code: "PF-133", name: "Arremate", profile_type: "arremate", weight_per_meter: 0.128, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf135", product_line_id: "line-decamp45", code: "PF-135", name: "Marco Lateral Porta de Giro", profile_type: "marco", weight_per_meter: 1.056, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf139", product_line_id: "line-decamp45", code: "PF-139", name: "Marco", profile_type: "marco", weight_per_meter: 0.751, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf140", product_line_id: "line-decamp45", code: "PF-140", name: "Marco / Trilho", profile_type: "trilho", weight_per_meter: 1.092, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pf141", product_line_id: "line-decamp45", code: "PF-141", name: "Marco", profile_type: "marco", weight_per_meter: 0.691, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pfm013", product_line_id: "line-decamp45", code: "PFM-013", name: "Perfil Muxarabi Complementar", profile_type: "arremate", weight_per_meter: 0.275, bar_length_mm: 6000, material: "AL 6063-T5", active: true },

  // --- TMG-xxx: Travessa / Montante para Janelas ---
  { id: "p-dc-tmg002", product_line_id: "line-decamp45", code: "TMG-002", name: "Montante Folha 2F", profile_type: "montante", weight_per_meter: 0.642, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg003", product_line_id: "line-decamp45", code: "TMG-003", name: "Montante Folha 2F c/ Baguete", profile_type: "montante", weight_per_meter: 0.694, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg006", product_line_id: "line-decamp45", code: "TMG-006", name: "Travessa Folha", profile_type: "travessa", weight_per_meter: 0.677, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg007", product_line_id: "line-decamp45", code: "TMG-007", name: "Montante Central", profile_type: "montante", weight_per_meter: 1.229, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg015", product_line_id: "line-decamp45", code: "TMG-015", name: "Palheta Veneziana", profile_type: "arremate", weight_per_meter: 0.147, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg016", product_line_id: "line-decamp45", code: "TMG-016", name: "Palheta Veneziana", profile_type: "arremate", weight_per_meter: 0.338, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg018", product_line_id: "line-decamp45", code: "TMG-018", name: "Montante Maxim-Ar", profile_type: "montante", weight_per_meter: 1.572, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg020", product_line_id: "line-decamp45", code: "TMG-020", name: "Montante Camarão", profile_type: "montante", weight_per_meter: 1.116, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg022", product_line_id: "line-decamp45", code: "TMG-022", name: "Travessa Central", profile_type: "travessa", weight_per_meter: 1.064, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg026", product_line_id: "line-decamp45", code: "TMG-026", name: "Palheta Veneziana", profile_type: "arremate", weight_per_meter: 0.158, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg027", product_line_id: "line-decamp45", code: "TMG-027", name: "Palheta Veneziana", profile_type: "arremate", weight_per_meter: 0.149, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg028", product_line_id: "line-decamp45", code: "TMG-028", name: "Montante Folha", profile_type: "montante", weight_per_meter: 0.455, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg042", product_line_id: "line-decamp45", code: "TMG-042", name: "Montante Camarão", profile_type: "montante", weight_per_meter: 1.169, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg043", product_line_id: "line-decamp45", code: "TMG-043", name: "Travessa Camarão", profile_type: "travessa", weight_per_meter: 0.807, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg044", product_line_id: "line-decamp45", code: "TMG-044", name: "Montante Folha 2F", profile_type: "montante", weight_per_meter: 1.244, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg045", product_line_id: "line-decamp45", code: "TMG-045", name: "Montante Maxim-Ar", profile_type: "montante", weight_per_meter: 0.957, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg046", product_line_id: "line-decamp45", code: "TMG-046", name: "Baguete / Arremate", profile_type: "baguete", weight_per_meter: 0.206, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg047", product_line_id: "line-decamp45", code: "TMG-047", name: "Montante Folha 2F", profile_type: "montante", weight_per_meter: 1.133, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg048", product_line_id: "line-decamp45", code: "TMG-048", name: "Montante Folha", profile_type: "montante", weight_per_meter: 0.886, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg049", product_line_id: "line-decamp45", code: "TMG-049", name: "Montante Folha", profile_type: "montante", weight_per_meter: 0.886, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg050", product_line_id: "line-decamp45", code: "TMG-050", name: "Travessa Folha", profile_type: "travessa", weight_per_meter: 0.811, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg051", product_line_id: "line-decamp45", code: "TMG-051", name: "Travessa Folha", profile_type: "travessa", weight_per_meter: 0.919, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg052", product_line_id: "line-decamp45", code: "TMG-052", name: "Montante Maxim-Ar", profile_type: "montante", weight_per_meter: 1.666, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg053", product_line_id: "line-decamp45", code: "TMG-053", name: "Montante Maxim-Ar", profile_type: "montante", weight_per_meter: 1.630, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg054", product_line_id: "line-decamp45", code: "TMG-054", name: "Montante Maxim-Ar", profile_type: "montante", weight_per_meter: 1.587, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg055", product_line_id: "line-decamp45", code: "TMG-055", name: "Travessa Central", profile_type: "travessa", weight_per_meter: 0.759, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg056", product_line_id: "line-decamp45", code: "TMG-056", name: "Travessa Camarão", profile_type: "travessa", weight_per_meter: 0.664, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg057", product_line_id: "line-decamp45", code: "TMG-057", name: "Palheta Veneziana", profile_type: "arremate", weight_per_meter: 0.167, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg059", product_line_id: "line-decamp45", code: "TMG-059", name: "Palheta Veneziana", profile_type: "arremate", weight_per_meter: 0.169, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg062", product_line_id: "line-decamp45", code: "TMG-062", name: "Montante Basculante", profile_type: "montante", weight_per_meter: 1.172, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg066", product_line_id: "line-decamp45", code: "TMG-066", name: "Montante Basculante", profile_type: "montante", weight_per_meter: 1.522, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg068", product_line_id: "line-decamp45", code: "TMG-068", name: "Travessa Veneziana", profile_type: "travessa", weight_per_meter: 0.405, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg070", product_line_id: "line-decamp45", code: "TMG-070", name: "Montante Pivotante", profile_type: "montante", weight_per_meter: 2.273, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg071", product_line_id: "line-decamp45", code: "TMG-071", name: "Montante Pivotante", profile_type: "montante", weight_per_meter: 2.210, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg072", product_line_id: "line-decamp45", code: "TMG-072", name: "Travessa Pivotante", profile_type: "travessa", weight_per_meter: 1.250, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg074", product_line_id: "line-decamp45", code: "TMG-074", name: "Travessa Camarão", profile_type: "travessa", weight_per_meter: 0.760, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg079", product_line_id: "line-decamp45", code: "TMG-079", name: "Travessa Camarão", profile_type: "travessa", weight_per_meter: 0.770, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg083", product_line_id: "line-decamp45", code: "TMG-083", name: "Travessa Veneziana", profile_type: "travessa", weight_per_meter: 0.409, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg085", product_line_id: "line-decamp45", code: "TMG-085", name: "Montante Veneziana", profile_type: "montante", weight_per_meter: 0.529, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg091", product_line_id: "line-decamp45", code: "TMG-091", name: "Travessa Veneziana", profile_type: "travessa", weight_per_meter: 0.405, bar_length_mm: 6000, material: "AL 6063-T5", active: true, notes: "Peso estimado = TMG-068" },
  { id: "p-dc-tmg111", product_line_id: "line-decamp45", code: "TMG-111", name: "Arremate", profile_type: "arremate", weight_per_meter: 0.114, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg116", product_line_id: "line-decamp45", code: "TMG-116", name: "Montante Basculante", profile_type: "montante", weight_per_meter: 1.454, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg157a", product_line_id: "line-decamp45", code: "TMG-157A", name: "Arremate", profile_type: "arremate", weight_per_meter: 0.268, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg158", product_line_id: "line-decamp45", code: "TMG-158", name: "Montante Folha", profile_type: "montante", weight_per_meter: 0.876, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg159", product_line_id: "line-decamp45", code: "TMG-159", name: "Montante Maxim-Ar", profile_type: "montante", weight_per_meter: 1.027, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg160", product_line_id: "line-decamp45", code: "TMG-160", name: "Montante Pivotante", profile_type: "montante", weight_per_meter: 1.979, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg162", product_line_id: "line-decamp45", code: "TMG-162", name: "Travessa Folha", profile_type: "travessa", weight_per_meter: 1.074, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg164", product_line_id: "line-decamp45", code: "TMG-164", name: "Palheta Veneziana", profile_type: "arremate", weight_per_meter: 0.160, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmg201", product_line_id: "line-decamp45", code: "TMG-201", name: "Montante Camarão", profile_type: "montante", weight_per_meter: 1.192, bar_length_mm: 6000, material: "AL 6063-T5", active: true },

  // --- TMS-xxx: Travessa / Montante para Venezianas ---
  { id: "p-dc-tms001", product_line_id: "line-decamp45", code: "TMS-001", name: "Montante Veneziana", profile_type: "montante", weight_per_meter: 0.739, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms002", product_line_id: "line-decamp45", code: "TMS-002", name: "Montante Veneziana", profile_type: "montante", weight_per_meter: 0.692, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms003", product_line_id: "line-decamp45", code: "TMS-003", name: "Travessa Veneziana", profile_type: "travessa", weight_per_meter: 0.493, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms007", product_line_id: "line-decamp45", code: "TMS-007", name: "Travessa Veneziana", profile_type: "travessa", weight_per_meter: 0.385, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms010", product_line_id: "line-decamp45", code: "TMS-010", name: "Montante Veneziana", profile_type: "montante", weight_per_meter: 0.989, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms011", product_line_id: "line-decamp45", code: "TMS-011", name: "Montante Veneziana", profile_type: "montante", weight_per_meter: 0.939, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms012", product_line_id: "line-decamp45", code: "TMS-012", name: "Travessa Veneziana", profile_type: "travessa", weight_per_meter: 0.543, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms039", product_line_id: "line-decamp45", code: "TMS-039", name: "Montante Veneziana", profile_type: "montante", weight_per_meter: 0.489, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms040", product_line_id: "line-decamp45", code: "TMS-040", name: "Montante Veneziana", profile_type: "montante", weight_per_meter: 0.478, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms041", product_line_id: "line-decamp45", code: "TMS-041", name: "Travessa Veneziana", profile_type: "travessa", weight_per_meter: 0.486, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms042", product_line_id: "line-decamp45", code: "TMS-042", name: "Travessa Veneziana", profile_type: "travessa", weight_per_meter: 0.561, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms047", product_line_id: "line-decamp45", code: "TMS-047", name: "Montante Veneziana", profile_type: "montante", weight_per_meter: 1.082, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms049", product_line_id: "line-decamp45", code: "TMS-049", name: "Montante Veneziana", profile_type: "montante", weight_per_meter: 1.070, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms053", product_line_id: "line-decamp45", code: "TMS-053", name: "Travessa Veneziana", profile_type: "travessa", weight_per_meter: 0.470, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms079", product_line_id: "line-decamp45", code: "TMS-079", name: "Travessa Veneziana", profile_type: "travessa", weight_per_meter: 0.333, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms081", product_line_id: "line-decamp45", code: "TMS-081", name: "Montante Veneziana", profile_type: "montante", weight_per_meter: 0.404, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms082", product_line_id: "line-decamp45", code: "TMS-082", name: "Arremate Veneziana", profile_type: "arremate", weight_per_meter: 0.282, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms084", product_line_id: "line-decamp45", code: "TMS-084", name: "Palheta", profile_type: "arremate", weight_per_meter: 0.115, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms086", product_line_id: "line-decamp45", code: "TMS-086", name: "Montante Veneziana", profile_type: "montante", weight_per_meter: 0.607, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms102", product_line_id: "line-decamp45", code: "TMS-102", name: "Palheta", profile_type: "arremate", weight_per_meter: 0.111, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms102a", product_line_id: "line-decamp45", code: "TMS-102A", name: "Palheta", profile_type: "arremate", weight_per_meter: 0.099, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms103", product_line_id: "line-decamp45", code: "TMS-103", name: "Palheta", profile_type: "arremate", weight_per_meter: 0.141, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms108", product_line_id: "line-decamp45", code: "TMS-108", name: "Palheta", profile_type: "arremate", weight_per_meter: 0.143, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms110", product_line_id: "line-decamp45", code: "TMS-110", name: "Montante Veneziana", profile_type: "montante", weight_per_meter: 0.532, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms111", product_line_id: "line-decamp45", code: "TMS-111", name: "Montante Veneziana", profile_type: "montante", weight_per_meter: 0.614, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms121", product_line_id: "line-decamp45", code: "TMS-121", name: "Montante Veneziana", profile_type: "montante", weight_per_meter: 1.450, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms122", product_line_id: "line-decamp45", code: "TMS-122", name: "Montante Veneziana", profile_type: "montante", weight_per_meter: 1.402, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms123", product_line_id: "line-decamp45", code: "TMS-123", name: "Travessa Veneziana", profile_type: "travessa", weight_per_meter: 0.967, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms192", product_line_id: "line-decamp45", code: "TMS-192", name: "Montante Veneziana", profile_type: "montante", weight_per_meter: 0.519, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms200", product_line_id: "line-decamp45", code: "TMS-200", name: "Montante Veneziana", profile_type: "montante", weight_per_meter: 0.442, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms203", product_line_id: "line-decamp45", code: "TMS-203", name: "Palheta", profile_type: "arremate", weight_per_meter: 0.132, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms225", product_line_id: "line-decamp45", code: "TMS-225", name: "Montante Veneziana", profile_type: "montante", weight_per_meter: 0.997, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms227", product_line_id: "line-decamp45", code: "TMS-227", name: "Travessa Veneziana", profile_type: "travessa", weight_per_meter: 0.556, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms241", product_line_id: "line-decamp45", code: "TMS-241", name: "Montante Veneziana", profile_type: "montante", weight_per_meter: 0.623, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms242", product_line_id: "line-decamp45", code: "TMS-242", name: "Travessa Veneziana", profile_type: "travessa", weight_per_meter: 0.711, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms243", product_line_id: "line-decamp45", code: "TMS-243", name: "Travessa Veneziana", profile_type: "travessa", weight_per_meter: 0.712, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms245", product_line_id: "line-decamp45", code: "TMS-245", name: "Montante Veneziana", profile_type: "montante", weight_per_meter: 0.671, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms279", product_line_id: "line-decamp45", code: "TMS-279", name: "Montante Veneziana", profile_type: "montante", weight_per_meter: 0.549, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms280", product_line_id: "line-decamp45", code: "TMS-280", name: "Montante Veneziana", profile_type: "montante", weight_per_meter: 0.959, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tms291", product_line_id: "line-decamp45", code: "TMS-291", name: "Arremate Veneziana", profile_type: "arremate", weight_per_meter: 0.240, bar_length_mm: 6000, material: "AL 6063-T5", active: true },

  // --- TMN-xxx: Travessa / Montante para Portas com Painel ---
  { id: "p-dc-tmn001", product_line_id: "line-decamp45", code: "TMN-001", name: "Montante Porta Painel", profile_type: "montante", weight_per_meter: 1.377, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmn002", product_line_id: "line-decamp45", code: "TMN-002", name: "Travessa Porta Painel", profile_type: "travessa", weight_per_meter: 0.699, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmn003", product_line_id: "line-decamp45", code: "TMN-003", name: "Montante Porta Painel", profile_type: "montante", weight_per_meter: 1.033, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmn031", product_line_id: "line-decamp45", code: "TMN-031", name: "Montante Porta Painel", profile_type: "montante", weight_per_meter: 1.339, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmn032", product_line_id: "line-decamp45", code: "TMN-032", name: "Montante Porta Painel", profile_type: "montante", weight_per_meter: 1.661, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmn039", product_line_id: "line-decamp45", code: "TMN-039", name: "Montante Porta Painel", profile_type: "montante", weight_per_meter: 1.398, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmn050", product_line_id: "line-decamp45", code: "TMN-050", name: "Travessa Porta Painel", profile_type: "travessa", weight_per_meter: 0.710, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmn055", product_line_id: "line-decamp45", code: "TMN-055", name: "Travessa Porta Painel", profile_type: "travessa", weight_per_meter: 0.380, bar_length_mm: 6000, material: "AL 6063-T5", active: true },

  // --- PR-xxx: Perfis para Portas ---
  { id: "p-dc-pr001", product_line_id: "line-decamp45", code: "PR-001", name: "Marco Porta de Abrir", profile_type: "marco", weight_per_meter: 1.840, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pr002", product_line_id: "line-decamp45", code: "PR-002", name: "Marco Porta de Abrir", profile_type: "marco", weight_per_meter: 1.786, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pr006", product_line_id: "line-decamp45", code: "PR-006", name: "Marco Porta Camarão", profile_type: "marco", weight_per_meter: 0.819, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pr007", product_line_id: "line-decamp45", code: "PR-007", name: "Marco Porta de Abrir", profile_type: "marco", weight_per_meter: 1.864, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pr015", product_line_id: "line-decamp45", code: "PR-015", name: "Marco Porta", profile_type: "marco", weight_per_meter: 0.981, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pr017", product_line_id: "line-decamp45", code: "PR-017", name: "Marco Porta", profile_type: "marco", weight_per_meter: 1.079, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pr018", product_line_id: "line-decamp45", code: "PR-018", name: "Marco Porta Pivotante", profile_type: "marco", weight_per_meter: 1.326, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pr019", product_line_id: "line-decamp45", code: "PR-019", name: "Marco Porta Camarão", profile_type: "marco", weight_per_meter: 1.544, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pr20096", product_line_id: "line-decamp45", code: "PR-20.096", name: "Marco Porta", profile_type: "marco", weight_per_meter: 0.715, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pr021", product_line_id: "line-decamp45", code: "PR-021", name: "Marco Porta", profile_type: "marco", weight_per_meter: 0.816, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pr022", product_line_id: "line-decamp45", code: "PR-022", name: "Marco Porta Pivotante", profile_type: "marco", weight_per_meter: 1.141, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pr023", product_line_id: "line-decamp45", code: "PR-023", name: "Marco Porta Camarão", profile_type: "marco", weight_per_meter: 1.786, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pr024", product_line_id: "line-decamp45", code: "PR-024", name: "Marco Porta", profile_type: "marco", weight_per_meter: 1.685, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pr30001", product_line_id: "line-decamp45", code: "PR-30.001", name: "Marco / Trilho 30mm", profile_type: "marco", weight_per_meter: 1.103, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pr30002", product_line_id: "line-decamp45", code: "PR-30.002", name: "Marco 30mm", profile_type: "marco", weight_per_meter: 1.062, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pr32021", product_line_id: "line-decamp45", code: "PR-32.021", name: "Marco Porta de Giro 32mm", profile_type: "marco", weight_per_meter: 1.735, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pr32137", product_line_id: "line-decamp45", code: "PR-32.137", name: "Marco Porta de Giro 32mm", profile_type: "marco", weight_per_meter: 1.582, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pr32140", product_line_id: "line-decamp45", code: "PR-32.140", name: "Marco Porta de Giro 32mm", profile_type: "marco", weight_per_meter: 1.585, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pr32234", product_line_id: "line-decamp45", code: "PR-32.234", name: "Marco Porta 32mm", profile_type: "marco", weight_per_meter: 1.068, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pr32507", product_line_id: "line-decamp45", code: "PR-32.507", name: "Montante Porta 32mm", profile_type: "montante", weight_per_meter: 1.314, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pr32556", product_line_id: "line-decamp45", code: "PR-32.556", name: "Travessa Porta 32mm", profile_type: "travessa", weight_per_meter: 0.707, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pr32614", product_line_id: "line-decamp45", code: "PR-32.614", name: "Montante Porta 32mm", profile_type: "montante", weight_per_meter: 1.362, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pr42001", product_line_id: "line-decamp45", code: "PR-42.001", name: "Marco Porta 42mm", profile_type: "marco", weight_per_meter: 2.058, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pr42002", product_line_id: "line-decamp45", code: "PR-42.002", name: "Marco Porta 42mm", profile_type: "marco", weight_per_meter: 1.510, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pr42003", product_line_id: "line-decamp45", code: "PR-42.003", name: "Montante Porta 42mm", profile_type: "montante", weight_per_meter: 1.111, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pr42004", product_line_id: "line-decamp45", code: "PR-42.004", name: "Travessa Porta 42mm", profile_type: "travessa", weight_per_meter: 0.374, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pr42006", product_line_id: "line-decamp45", code: "PR-42.006", name: "Marco Porta 42mm", profile_type: "marco", weight_per_meter: 1.830, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-pr400", product_line_id: "line-decamp45", code: "PR-400", name: "Marco Porta Grande", profile_type: "marco", weight_per_meter: 6.152, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmb143", product_line_id: "line-decamp45", code: "TMB-143", name: "Travessa", profile_type: "travessa", weight_per_meter: 0.575, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmr1381", product_line_id: "line-decamp45", code: "TMR-1381", name: "Montante", profile_type: "montante", weight_per_meter: 0.945, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tmf085", product_line_id: "line-decamp45", code: "TMF-085", name: "Travessa", profile_type: "travessa", weight_per_meter: 0.280, bar_length_mm: 6000, material: "AL 6063-T5", active: true },

  // --- DP-xxx: Divisórias e Painéis ---
  { id: "p-dc-dp005", product_line_id: "line-decamp45", code: "DP-005", name: "Marco Divisória", profile_type: "marco", weight_per_meter: 1.516, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-dp037", product_line_id: "line-decamp45", code: "DP-037", name: "Arremate Divisória", profile_type: "arremate", weight_per_meter: 0.198, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-dp040", product_line_id: "line-decamp45", code: "DP-040", name: "Montante Veneziana", profile_type: "montante", weight_per_meter: 0.618, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-dp049", product_line_id: "line-decamp45", code: "DP-049", name: "Arremate", profile_type: "arremate", weight_per_meter: 0.296, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-dp050", product_line_id: "line-decamp45", code: "DP-050", name: "Arremate", profile_type: "arremate", weight_per_meter: 0.273, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-dp074", product_line_id: "line-decamp45", code: "DP-074", name: "Montante Porta", profile_type: "montante", weight_per_meter: 0.986, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-dp083", product_line_id: "line-decamp45", code: "DP-083", name: "Marco Porta Camarão", profile_type: "marco", weight_per_meter: 1.076, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-dp092", product_line_id: "line-decamp45", code: "DP-092", name: "Marco Porta Pivotante", profile_type: "marco", weight_per_meter: 1.328, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-dp121", product_line_id: "line-decamp45", code: "DP-121", name: "Marco Porta Pivotante", profile_type: "marco", weight_per_meter: 1.130, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-dp124", product_line_id: "line-decamp45", code: "DP-124", name: "Marco Pesado", profile_type: "marco", weight_per_meter: 1.545, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-dp129", product_line_id: "line-decamp45", code: "DP-129", name: "Montante Porta", profile_type: "montante", weight_per_meter: 1.013, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-dp135", product_line_id: "line-decamp45", code: "DP-135", name: "Marco Porta", profile_type: "marco", weight_per_meter: 1.534, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-dp140", product_line_id: "line-decamp45", code: "DP-140", name: "Marco Porta", profile_type: "marco", weight_per_meter: 1.385, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-dp142", product_line_id: "line-decamp45", code: "DP-142", name: "Montante Porta", profile_type: "montante", weight_per_meter: 0.962, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-dp200", product_line_id: "line-decamp45", code: "DP-200", name: "Marco Pesado Especial", profile_type: "marco", weight_per_meter: 4.780, bar_length_mm: 6000, material: "AL 6063-T5", active: true },

  // --- Perfis diversos (A, D, L, P, U, etc.) ---
  { id: "p-dc-42035", product_line_id: "line-decamp45", code: "42-035", name: "Marco / Trilho 42mm", profile_type: "trilho", weight_per_meter: 1.062, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-80049", product_line_id: "line-decamp45", code: "80-049", name: "Montante Maxim-Ar", profile_type: "montante", weight_per_meter: 0.812, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-a058", product_line_id: "line-decamp45", code: "A-058", name: "Arremate / Capa", profile_type: "arremate", weight_per_meter: 0.233, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-a104", product_line_id: "line-decamp45", code: "A-104", name: "Montante Muxarabi 42mm", profile_type: "montante", weight_per_meter: 0.870, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-a144", product_line_id: "line-decamp45", code: "A-144", name: "Marco / Arremate", profile_type: "arremate", weight_per_meter: 0.829, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-a209", product_line_id: "line-decamp45", code: "A-209", name: "Arremate", profile_type: "arremate", weight_per_meter: 0.463, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-d055", product_line_id: "line-decamp45", code: "D-055", name: "Montante Muxarabi", profile_type: "montante", weight_per_meter: 0.544, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-d069", product_line_id: "line-decamp45", code: "D-069", name: "Montante Pesado", profile_type: "montante", weight_per_meter: 1.103, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-d078", product_line_id: "line-decamp45", code: "D-078", name: "Marco", profile_type: "marco", weight_per_meter: 0.794, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-d079", product_line_id: "line-decamp45", code: "D-079", name: "Montante", profile_type: "montante", weight_per_meter: 0.523, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-d082", product_line_id: "line-decamp45", code: "D-082", name: "Montante Muxarabi", profile_type: "montante", weight_per_meter: 0.329, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-d102", product_line_id: "line-decamp45", code: "D-102", name: "Montante", profile_type: "montante", weight_per_meter: 0.629, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-d103", product_line_id: "line-decamp45", code: "D-103", name: "Montante Muxarabi", profile_type: "montante", weight_per_meter: 0.802, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-l519", product_line_id: "line-decamp45", code: "L-519", name: "Marco / Trilho", profile_type: "trilho", weight_per_meter: 0.374, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-l521", product_line_id: "line-decamp45", code: "L-521", name: "Arremate", profile_type: "arremate", weight_per_meter: 0.356, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-l592", product_line_id: "line-decamp45", code: "L-592", name: "Arremate", profile_type: "arremate", weight_per_meter: 0.375, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-mp347", product_line_id: "line-decamp45", code: "MP-347", name: "Arremate / Módulo Prático", profile_type: "arremate", weight_per_meter: 0.202, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-p078", product_line_id: "line-decamp45", code: "P-078", name: "Marco", profile_type: "marco", weight_per_meter: 0.793, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-p264", product_line_id: "line-decamp45", code: "P-264", name: "Marco", profile_type: "marco", weight_per_meter: 1.195, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-p268a", product_line_id: "line-decamp45", code: "P-268A", name: "Marco Superior Porta", profile_type: "marco", weight_per_meter: 1.355, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-p269", product_line_id: "line-decamp45", code: "P-269", name: "Marco", profile_type: "marco", weight_per_meter: 0.854, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-p270", product_line_id: "line-decamp45", code: "P-270", name: "Marco", profile_type: "marco", weight_per_meter: 0.780, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-p273", product_line_id: "line-decamp45", code: "P-273", name: "Marco", profile_type: "marco", weight_per_meter: 0.615, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-p279", product_line_id: "line-decamp45", code: "P-279", name: "Marco Lateral Porta", profile_type: "marco", weight_per_meter: 1.275, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-p280", product_line_id: "line-decamp45", code: "P-280", name: "Marco Inferior Porta", profile_type: "marco", weight_per_meter: 0.825, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-y181", product_line_id: "line-decamp45", code: "Y-181", name: "Arremate / Cadeirinha", profile_type: "arremate", weight_per_meter: 0.469, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-y335", product_line_id: "line-decamp45", code: "Y-335", name: "Montante Porta", profile_type: "montante", weight_per_meter: 0.841, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-z203", product_line_id: "line-decamp45", code: "Z-203", name: "Montante Veneziana", profile_type: "montante", weight_per_meter: 0.322, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-vz051", product_line_id: "line-decamp45", code: "VZ-051", name: "Montante Veneziana", profile_type: "montante", weight_per_meter: 0.308, bar_length_mm: 6000, material: "AL 6063-T5", active: true },

  // --- TUB-xxx: Tubulares ---
  { id: "p-dc-tub4003", product_line_id: "line-decamp45", code: "TUB-4003", name: "Tubo Redondo", profile_type: "montante", weight_per_meter: 0.299, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tub4008", product_line_id: "line-decamp45", code: "TUB-4008", name: "Tubo Quadrado", profile_type: "montante", weight_per_meter: 0.408, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tub4020p", product_line_id: "line-decamp45", code: "TUB-4020P", name: "Tubo Retangular", profile_type: "montante", weight_per_meter: 1.055, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tub4054", product_line_id: "line-decamp45", code: "TUB-4054", name: "Tubo Retangular Pesado", profile_type: "montante", weight_per_meter: 2.686, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tub4501", product_line_id: "line-decamp45", code: "TUB-4501", name: "Tubo Quadrado Muxarabi", profile_type: "montante", weight_per_meter: 0.299, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tub4509", product_line_id: "line-decamp45", code: "TUB-4509", name: "Tubo Quadrado", profile_type: "montante", weight_per_meter: 0.499, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tub4536", product_line_id: "line-decamp45", code: "TUB-4536", name: "Tubo Retangular", profile_type: "montante", weight_per_meter: 0.517, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tub4559", product_line_id: "line-decamp45", code: "TUB-4559", name: "Tubo Retangular Pesado", profile_type: "montante", weight_per_meter: 3.206, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tub4563", product_line_id: "line-decamp45", code: "TUB-4563", name: "Tubo Retangular", profile_type: "montante", weight_per_meter: 0.482, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-tub4599", product_line_id: "line-decamp45", code: "TUB-4599", name: "Tubo Retangular", profile_type: "montante", weight_per_meter: 1.609, bar_length_mm: 6000, material: "AL 6063-T5", active: true },

  // --- U-xxx: Perfis U ---
  { id: "p-dc-u482", product_line_id: "line-decamp45", code: "U-482", name: "Perfil U", profile_type: "arremate", weight_per_meter: 0.115, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-u495", product_line_id: "line-decamp45", code: "U-495", name: "Perfil U Muxarabi", profile_type: "arremate", weight_per_meter: 0.166, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-u496", product_line_id: "line-decamp45", code: "U-496", name: "Perfil U Muxarabi", profile_type: "arremate", weight_per_meter: 0.380, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-u509", product_line_id: "line-decamp45", code: "U-509", name: "Perfil U Muxarabi", profile_type: "arremate", weight_per_meter: 0.191, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-u611", product_line_id: "line-decamp45", code: "U-611", name: "Perfil U", profile_type: "arremate", weight_per_meter: 0.225, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-u679", product_line_id: "line-decamp45", code: "U-679", name: "Perfil U", profile_type: "arremate", weight_per_meter: 0.178, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-u683", product_line_id: "line-decamp45", code: "U-683", name: "Perfil U", profile_type: "arremate", weight_per_meter: 0.154, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-u696", product_line_id: "line-decamp45", code: "U-696", name: "Perfil U", profile_type: "arremate", weight_per_meter: 0.202, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-u1076", product_line_id: "line-decamp45", code: "U-1076", name: "Perfil U", profile_type: "arremate", weight_per_meter: 0.208, bar_length_mm: 6000, material: "AL 6063-T5", active: true },

  // --- Muxarabi-specific ---
  { id: "p-dc-dp066", product_line_id: "line-decamp45", code: "DP-066", name: "Montante Muxarabi", profile_type: "montante", weight_per_meter: 0.399, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-dp082", product_line_id: "line-decamp45", code: "DP-082", name: "Montante Muxarabi", profile_type: "montante", weight_per_meter: 0.439, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-dp088", product_line_id: "line-decamp45", code: "DP-088", name: "Montante Muxarabi", profile_type: "montante", weight_per_meter: 0.296, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-dp089", product_line_id: "line-decamp45", code: "DP-089", name: "Montante Muxarabi", profile_type: "montante", weight_per_meter: 0.743, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-dp095", product_line_id: "line-decamp45", code: "DP-095", name: "Montante Muxarabi", profile_type: "montante", weight_per_meter: 0.368, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-dp153", product_line_id: "line-decamp45", code: "DP-153", name: "Arremate Muxarabi", profile_type: "arremate", weight_per_meter: 0.222, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-dp158", product_line_id: "line-decamp45", code: "DP-158", name: "Montante Muxarabi Camarão", profile_type: "montante", weight_per_meter: 0.710, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-dp452", product_line_id: "line-decamp45", code: "DP-452", name: "Arremate Muxarabi", profile_type: "arremate", weight_per_meter: 0.290, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-dp453", product_line_id: "line-decamp45", code: "DP-453", name: "Arremate Muxarabi", profile_type: "arremate", weight_per_meter: 0.133, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-dp454", product_line_id: "line-decamp45", code: "DP-454", name: "Arremate Muxarabi", profile_type: "arremate", weight_per_meter: 0.172, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-dp462", product_line_id: "line-decamp45", code: "DP-462", name: "Montante Muxarabi", profile_type: "montante", weight_per_meter: 0.507, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-dp463", product_line_id: "line-decamp45", code: "DP-463", name: "Arremate Muxarabi", profile_type: "arremate", weight_per_meter: 0.133, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
];

// ============================================
// PERFIS - DECAMP ESTUFAS
// Fonte: Catálogo Decamp Estufas (Edição 2021)
// Todos os pesos (kg/m) são reais
// ============================================
const decampEstufasProfiles: Profile[] = [
  { id: "p-dc-es1641", product_line_id: "line-decamp-estufas", code: "ES-1641", name: "Perfil Conector Estufa", profile_type: "arremate", weight_per_meter: 0.197, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-es1642", product_line_id: "line-decamp-estufas", code: "ES-1642", name: "Perfil Estrutural Estufa", profile_type: "montante", weight_per_meter: 1.520, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-es1643", product_line_id: "line-decamp-estufas", code: "ES-1643", name: "Perfil Lateral Estufa", profile_type: "montante", weight_per_meter: 0.525, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-es1644", product_line_id: "line-decamp-estufas", code: "ES-1644", name: "Perfil Conector Estufa", profile_type: "arremate", weight_per_meter: 0.157, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-es1645", product_line_id: "line-decamp-estufas", code: "ES-1645", name: "Perfil Estrutural Estufa", profile_type: "montante", weight_per_meter: 2.187, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-es1646", product_line_id: "line-decamp-estufas", code: "ES-1646", name: "Perfil Conector Estufa", profile_type: "arremate", weight_per_meter: 0.230, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-es1647", product_line_id: "line-decamp-estufas", code: "ES-1647", name: "Perfil Estrutural Estufa", profile_type: "montante", weight_per_meter: 1.431, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-es1648", product_line_id: "line-decamp-estufas", code: "ES-1648", name: "Perfil Lateral Estufa", profile_type: "montante", weight_per_meter: 0.634, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-es1649", product_line_id: "line-decamp-estufas", code: "ES-1649", name: "Perfil Estrutural Estufa Grande", profile_type: "montante", weight_per_meter: 2.368, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-es1650", product_line_id: "line-decamp-estufas", code: "ES-1650", name: "Perfil Estrutural Estufa", profile_type: "montante", weight_per_meter: 1.545, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-es1655", product_line_id: "line-decamp-estufas", code: "ES-1655", name: "Perfil Montagem Estufa", profile_type: "montante", weight_per_meter: 1.252, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-dc-es1656", product_line_id: "line-decamp-estufas", code: "ES-1656", name: "Perfil Estrutural Estufa", profile_type: "montante", weight_per_meter: 2.003, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
];

// ============================================
// EXPORTAÇÃO
// ============================================

export const profiles: Profile[] = [
  ...supremaProfiles,
  ...goldProfiles,
  ...topProfiles,
  ...decampLinha45Profiles,
  ...decampEstufasProfiles,
];

export function getProfileByCode(code: string, lineId: string): Profile | undefined {
  return profiles.find(p => p.code === code && p.product_line_id === lineId);
}

export function getProfileById(id: string): Profile | undefined {
  return profiles.find(p => p.id === id);
}
