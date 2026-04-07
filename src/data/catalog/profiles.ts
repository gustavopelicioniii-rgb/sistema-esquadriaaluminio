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
// EXPORTAÇÃO — Sem perfis clonados/falsos
// Os fabricantes secundários (Brimetal, CBA, Real, LP, etc.)
// foram removidos por falta de catálogos reais.
// ============================================

export const profiles: Profile[] = [
  ...supremaProfiles,
  ...goldProfiles,
  ...topProfiles,
];

export function getProfileByCode(code: string, lineId: string): Profile | undefined {
  return profiles.find(p => p.code === code && p.product_line_id === lineId);
}

export function getProfileById(id: string): Profile | undefined {
  return profiles.find(p => p.id === id);
}
