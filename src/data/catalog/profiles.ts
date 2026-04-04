import type { Profile } from "@/types/calculation";

// ============================================
// PERFIS - LINHA SUPREMA (25mm) — Pesos do catálogo real
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
  // Perfis adicionais Suprema
  { id: "p-su015", product_line_id: "line-suprema", code: "SU-015", name: "Marco Lateral Porta Correr", profile_type: "marco", weight_per_meter: 0.680, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su020", product_line_id: "line-suprema", code: "SU-020", name: "Guia Inferior", profile_type: "guia", weight_per_meter: 0.320, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su045", product_line_id: "line-suprema", code: "SU-045", name: "Montante Fixo", profile_type: "montante", weight_per_meter: 0.460, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su060", product_line_id: "line-suprema", code: "SU-060", name: "Travessa Intermediária", profile_type: "travessa", weight_per_meter: 0.390, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su085", product_line_id: "line-suprema", code: "SU-085", name: "Montante Basculante", profile_type: "montante", weight_per_meter: 0.490, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su086", product_line_id: "line-suprema", code: "SU-086", name: "Travessa Basculante", profile_type: "travessa", weight_per_meter: 0.370, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su095", product_line_id: "line-suprema", code: "SU-095", name: "Montante Pivotante", profile_type: "montante", weight_per_meter: 0.550, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su096", product_line_id: "line-suprema", code: "SU-096", name: "Travessa Pivotante", profile_type: "travessa", weight_per_meter: 0.420, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su130", product_line_id: "line-suprema", code: "SU-130", name: "Adaptador Contramarco", profile_type: "adaptador", weight_per_meter: 0.280, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su140", product_line_id: "line-suprema", code: "SU-140", name: "Arremate Externo", profile_type: "arremate", weight_per_meter: 0.220, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-su150", product_line_id: "line-suprema", code: "SU-150", name: "Guia Superior Porta", profile_type: "guia", weight_per_meter: 0.410, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
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
  // Perfis adicionais Gold
  { id: "p-go015", product_line_id: "line-gold", code: "GO-015", name: "Marco Lateral Porta Gold", profile_type: "marco", weight_per_meter: 0.840, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-go020", product_line_id: "line-gold", code: "GO-020", name: "Guia Inferior Gold", profile_type: "guia", weight_per_meter: 0.400, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-go045", product_line_id: "line-gold", code: "GO-045", name: "Montante Fixo Gold", profile_type: "montante", weight_per_meter: 0.570, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-go095", product_line_id: "line-gold", code: "GO-095", name: "Montante Pivotante Gold", profile_type: "montante", weight_per_meter: 0.680, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-go096", product_line_id: "line-gold", code: "GO-096", name: "Travessa Pivotante Gold", profile_type: "travessa", weight_per_meter: 0.520, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
  { id: "p-go279", product_line_id: "line-gold", code: "GO-279", name: "Cadeirinha Porta Gold", profile_type: "arremate", weight_per_meter: 0.360, bar_length_mm: 6000, material: "AL 6063-T5", active: true },
];

// ============================================
// CLONAGEM PARA TODAS AS LINHAS 25mm E 32mm COMPATÍVEIS
// ============================================

interface ProfileMapping {
  prefix: string;
  lineId: string;
  weightOffset: number;
}

// Linhas 25mm compatíveis com Suprema
const compatible25Lines: ProfileMapping[] = [
  { prefix: "25", lineId: "line-mega25", weightOffset: 1.0 },
  { prefix: "HY", lineId: "line-hyspex25su", weightOffset: 1.0 },
  { prefix: "AL", lineId: "line-alumasa25", weightOffset: 1.0 },
  { prefix: "DS", lineId: "line-ds-suprema", weightOffset: 1.0 },
  { prefix: "BR", lineId: "line-brimetal25", weightOffset: 1.01 },
  { prefix: "CB", lineId: "line-cba25", weightOffset: 1.0 },
  { prefix: "RE", lineId: "line-real25", weightOffset: 0.99 },
  { prefix: "LP", lineId: "line-lp25", weightOffset: 1.0 },
  { prefix: "AX", lineId: "line-alux25", weightOffset: 1.0 },
  { prefix: "AB", lineId: "line-albras25", weightOffset: 1.01 },
  { prefix: "SM", lineId: "line-sm25", weightOffset: 1.0 },
  { prefix: "PR", lineId: "line-prado25", weightOffset: 1.0 },
  { prefix: "HB", lineId: "line-hydro25", weightOffset: 0.98 },
  { prefix: "PN", lineId: "line-pin25", weightOffset: 1.0 },
  { prefix: "SP", lineId: "line-suprema-plus", weightOffset: 1.05 },
];

// Linhas 32mm compatíveis com Gold
const compatible32Lines: ProfileMapping[] = [
  { prefix: "DG", lineId: "line-ds-gold", weightOffset: 1.0 },
  { prefix: "BG", lineId: "line-brimetal32", weightOffset: 1.01 },
  { prefix: "C32", lineId: "line-cba32", weightOffset: 1.0 },
  { prefix: "R32", lineId: "line-real32", weightOffset: 0.99 },
  { prefix: "L32", lineId: "line-lp32", weightOffset: 1.0 },
  { prefix: "X32", lineId: "line-alux32", weightOffset: 1.0 },
  { prefix: "A32", lineId: "line-albras32", weightOffset: 1.01 },
  { prefix: "S32", lineId: "line-sm32", weightOffset: 1.0 },
  { prefix: "P32", lineId: "line-prado32", weightOffset: 1.0 },
  { prefix: "H32", lineId: "line-hydro32", weightOffset: 0.98 },
  { prefix: "N32", lineId: "line-pin32", weightOffset: 1.0 },
  { prefix: "HX32", lineId: "line-hyspex32", weightOffset: 1.0 },
  { prefix: "M32", lineId: "line-mega32", weightOffset: 1.0 },
  { prefix: "AM32", lineId: "line-alumasa32", weightOffset: 1.0 },
];

function cloneProfiles(source: Profile[], mapping: ProfileMapping, sourceCodePrefix: string, sourceInsertPrefix: string): Profile[] {
  return source.map(p => {
    let newCode: string;
    if (p.code.startsWith(sourceCodePrefix + "-")) {
      newCode = `${mapping.prefix}-${p.code.slice(sourceCodePrefix.length + 1)}`;
    } else if (p.code.startsWith("I" + sourceCodePrefix + "-")) {
      newCode = `I${mapping.prefix}-${p.code.slice(sourceInsertPrefix.length + 1)}`;
    } else if (p.code === "CM-200" || p.code === "PAL") {
      newCode = p.code;
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

const cloned25Profiles = compatible25Lines.flatMap(m => cloneProfiles(supremaProfiles, m, "SU", "ISU"));
const cloned32Profiles = compatible32Lines.flatMap(m => cloneProfiles(goldProfiles, m, "GO", "IGO"));

export const profiles: Profile[] = [
  ...supremaProfiles,
  ...goldProfiles,
  ...cloned25Profiles,
  ...cloned32Profiles,
];

export function getProfileByCode(code: string, lineId: string): Profile | undefined {
  return profiles.find(p => p.code === code && p.product_line_id === lineId);
}

export function getProfileById(id: string): Profile | undefined {
  return profiles.find(p => p.id === id);
}
