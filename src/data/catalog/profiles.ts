import type { Profile } from "@/types/calculation";

// ============================================
// PERFIS - LINHA SUPREMA (25mm) — Pesos atualizados do catálogo
// ============================================
const supremaProfiles: Profile[] = [
  { id: "p-su010", product_line_id: "line-suprema", code: "SU-010", name: "Marco Superior", profile_type: "marco", weight_per_meter: 0.580, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su012", product_line_id: "line-suprema", code: "SU-012", name: "Marco Inferior / Trilho 2F", profile_type: "trilho", weight_per_meter: 0.850, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su013", product_line_id: "line-suprema", code: "SU-013", name: "Marco Lateral 3 Folhas", profile_type: "marco", weight_per_meter: 0.720, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su014", product_line_id: "line-suprema", code: "SU-014", name: "Marco Lateral", profile_type: "marco", weight_per_meter: 0.650, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su039", product_line_id: "line-suprema", code: "SU-039", name: "Montante Folha c/ Baguete", profile_type: "montante", weight_per_meter: 0.500, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su053", product_line_id: "line-suprema", code: "SU-053", name: "Travessa da Folha", profile_type: "travessa", weight_per_meter: 0.380, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su068", product_line_id: "line-suprema", code: "SU-068", name: "Montante Folha Veneziana", profile_type: "montante", weight_per_meter: 0.520, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su072", product_line_id: "line-suprema", code: "SU-072", name: "Montante Camarão", profile_type: "montante", weight_per_meter: 0.480, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su073", product_line_id: "line-suprema", code: "SU-073", name: "Travessa Camarão", profile_type: "travessa", weight_per_meter: 0.360, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su079", product_line_id: "line-suprema", code: "SU-079", name: "Montante Maxim-Ar", profile_type: "montante", weight_per_meter: 0.510, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su080", product_line_id: "line-suprema", code: "SU-080", name: "Travessa Maxim-Ar 45°", profile_type: "travessa", weight_per_meter: 0.400, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su089", product_line_id: "line-suprema", code: "SU-089", name: "Batente/Marco Porta Giro", profile_type: "marco", weight_per_meter: 0.750, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su111", product_line_id: "line-suprema", code: "SU-111", name: "Montante Folha Porta Giro", profile_type: "montante", weight_per_meter: 0.631, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su121", product_line_id: "line-suprema", code: "SU-121", name: "Trilho Superior 3/4/6 Folhas", profile_type: "trilho", weight_per_meter: 1.498, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su279", product_line_id: "line-suprema", code: "SU-279", name: "Cadeirinha Porta Giro", profile_type: "arremate", weight_per_meter: 0.290, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su292", product_line_id: "line-suprema", code: "SU-292", name: "Montante Central Maxim-Ar", profile_type: "montante", weight_per_meter: 0.620, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-isu502", product_line_id: "line-suprema", code: "ISU-502", name: "Baguete Arredondado", profile_type: "baguete", weight_per_meter: 0.110, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-cm200", product_line_id: "line-suprema", code: "CM-200", name: "Contramarco", profile_type: "contramarco", weight_per_meter: 0.350, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-pal", product_line_id: "line-suprema", code: "PAL", name: "Palheta Veneziana", profile_type: "arremate", weight_per_meter: 0.150, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
];

// ============================================
// PERFIS - LINHA GOLD (32mm)
// ============================================
const goldProfiles: Profile[] = [
  { id: "p-go010", product_line_id: "line-gold", code: "GO-010", name: "Marco Superior Gold", profile_type: "marco", weight_per_meter: 0.720, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-go012", product_line_id: "line-gold", code: "GO-012", name: "Marco Inferior / Trilho Gold", profile_type: "trilho", weight_per_meter: 1.050, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-go013", product_line_id: "line-gold", code: "GO-013", name: "Marco Lateral 3F Gold", profile_type: "marco", weight_per_meter: 0.880, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-go014", product_line_id: "line-gold", code: "GO-014", name: "Marco Lateral Gold", profile_type: "marco", weight_per_meter: 0.800, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-go039", product_line_id: "line-gold", code: "GO-039", name: "Montante Folha Gold", profile_type: "montante", weight_per_meter: 0.620, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-go053", product_line_id: "line-gold", code: "GO-053", name: "Travessa Folha Gold", profile_type: "travessa", weight_per_meter: 0.480, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-go068", product_line_id: "line-gold", code: "GO-068", name: "Montante Veneziana Gold", profile_type: "montante", weight_per_meter: 0.640, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-go072", product_line_id: "line-gold", code: "GO-072", name: "Montante Camarão Gold", profile_type: "montante", weight_per_meter: 0.590, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-go073", product_line_id: "line-gold", code: "GO-073", name: "Travessa Camarão Gold", profile_type: "travessa", weight_per_meter: 0.450, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-go079", product_line_id: "line-gold", code: "GO-079", name: "Montante Maxim-Ar Gold", profile_type: "montante", weight_per_meter: 0.630, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-go080", product_line_id: "line-gold", code: "GO-080", name: "Travessa Maxim-Ar Gold", profile_type: "travessa", weight_per_meter: 0.500, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-go089", product_line_id: "line-gold", code: "GO-089", name: "Marco Porta Giro Gold", profile_type: "marco", weight_per_meter: 0.920, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-go111", product_line_id: "line-gold", code: "GO-111", name: "Montante Porta Giro Gold", profile_type: "montante", weight_per_meter: 0.780, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-go121", product_line_id: "line-gold", code: "GO-121", name: "Trilho 3/6F Gold", profile_type: "trilho", weight_per_meter: 1.820, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-go292", product_line_id: "line-gold", code: "GO-292", name: "Montante Central Gold", profile_type: "montante", weight_per_meter: 0.760, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-igo502", product_line_id: "line-gold", code: "IGO-502", name: "Baguete Gold", profile_type: "baguete", weight_per_meter: 0.140, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
];

// ============================================
// FUNÇÃO DE CLONAGEM PARA LINHAS COMPATÍVEIS
// ============================================

interface ProfileMapping {
  prefix: string;
  lineId: string;
  weightOffset: number; // multiplicador de peso (1.0 = mesmo peso)
}

const compatibleLines: ProfileMapping[] = [
  { prefix: "25", lineId: "line-mega25", weightOffset: 1.0 },
  { prefix: "HY", lineId: "line-hyspex25su", weightOffset: 1.0 },
  { prefix: "AL", lineId: "line-alumasa25", weightOffset: 1.0 },
  { prefix: "DS", lineId: "line-ds-suprema", weightOffset: 1.0 },
];

function cloneSupremaProfiles(mapping: ProfileMapping): Profile[] {
  return supremaProfiles.map(p => {
    // Map SU-xxx → PREFIX-xxx, ISU-xxx → I+PREFIX-xxx, CM-xxx stays, PAL stays
    let newCode: string;
    if (p.code.startsWith("SU-")) {
      newCode = `${mapping.prefix}-${p.code.slice(3)}`;
    } else if (p.code.startsWith("ISU-")) {
      newCode = `I${mapping.prefix}-${p.code.slice(4)}`;
    } else if (p.code === "CM-200") {
      newCode = `CM-200`; // contramarco é universal
    } else if (p.code === "PAL") {
      newCode = "PAL";
    } else {
      newCode = `${mapping.prefix}-${p.code}`;
    }
    return {
      ...p,
      id: `p-${newCode.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      product_line_id: mapping.lineId,
      code: newCode,
      weight_per_meter: Math.round(p.weight_per_meter * mapping.weightOffset * 1000) / 1000,
    };
  });
}

const clonedProfiles = compatibleLines.flatMap(m => cloneSupremaProfiles(m));

export const profiles: Profile[] = [
  ...supremaProfiles,
  ...goldProfiles,
  ...clonedProfiles,
];

// Helper: get profile by code and line
export function getProfileByCode(code: string, lineId: string): Profile | undefined {
  return profiles.find(p => p.code === code && p.product_line_id === lineId);
}

export function getProfileById(id: string): Profile | undefined {
  return profiles.find(p => p.id === id);
}
