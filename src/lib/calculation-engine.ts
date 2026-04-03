import type {
  CutRule,
  GlassRule,
  TypologyComponent,
  Typology,
  CalculationInput,
  CutResult,
  GlassResult,
  ComponentResult,
  ProfileSummary,
  CalculationOutput,
} from "@/types/calculation";

/** Limites padrão por categoria (mm) quando não definidos na tipologia */
const DEFAULT_LIMITS: Record<string, { minW: number; maxW: number; minH: number; maxH: number }> = {
  janela:     { minW: 400, maxW: 6000, minH: 300, maxH: 3000 },
  porta:      { minW: 500, maxW: 6000, minH: 1800, maxH: 3500 },
  vitro:      { minW: 300, maxW: 4000, minH: 300, maxH: 3000 },
  veneziana:  { minW: 400, maxW: 4000, minH: 400, maxH: 3000 },
  maxim_ar:   { minW: 300, maxW: 2500, minH: 300, maxH: 2000 },
  camarao:    { minW: 800, maxW: 6000, minH: 400, maxH: 3000 },
  pivotante:  { minW: 600, maxW: 2000, minH: 1800, maxH: 3500 },
  basculante: { minW: 300, maxW: 2500, minH: 200, maxH: 1500 },
};

/**
 * Valida dimensões contra limites da tipologia ou defaults da categoria
 */
export function validateDimensions(
  widthMm: number,
  heightMm: number,
  typology: Pick<Typology, 'name' | 'category' | 'min_width_mm' | 'max_width_mm' | 'min_height_mm' | 'max_height_mm'>
): { valid: boolean; errors: string[] } {
  const defaults = DEFAULT_LIMITS[typology.category] ?? DEFAULT_LIMITS.janela;
  const minW = typology.min_width_mm ?? defaults.minW;
  const maxW = typology.max_width_mm ?? defaults.maxW;
  const minH = typology.min_height_mm ?? defaults.minH;
  const maxH = typology.max_height_mm ?? defaults.maxH;

  const errors: string[] = [];
  if (widthMm < minW) errors.push(`Largura ${widthMm}mm abaixo do mínimo (${minW}mm) para ${typology.name}`);
  if (widthMm > maxW) errors.push(`Largura ${widthMm}mm acima do máximo (${maxW}mm) para ${typology.name}`);
  if (heightMm < minH) errors.push(`Altura ${heightMm}mm abaixo do mínimo (${minH}mm) para ${typology.name}`);
  if (heightMm > maxH) errors.push(`Altura ${heightMm}mm acima do máximo (${maxH}mm) para ${typology.name}`);

  return { valid: errors.length === 0, errors };
}

/**
 * Resolve a dimensão de referência com base em L e H
 */
function resolveReference(ref: string, L: number, H: number): number {
  switch (ref) {
    case 'L': return L;
    case 'H': return H;
    case 'L/2': return L / 2;
    case 'L/3': return L / 3;
    case 'L/4': return L / 4;
    case 'L/6': return L / 6;
    case 'H/2': return H / 2;
    case 'H/3': return H / 3;
    case 'FIXED': return 0;
    default:
      throw new Error(`Referência desconhecida: ${ref}`);
  }
}

/**
 * Resolve a fórmula de quantidade
 */
function resolveQuantity(formula: string, numFolhas: number, itemQuantity: number): number {
  const expr = formula.replace(/num_folhas/g, String(numFolhas));
  try {
    const result = Function(`"use strict"; return (${expr})`)();
    return Math.ceil(result) * itemQuantity;
  } catch {
    return (parseInt(formula) || 1) * itemQuantity;
  }
}

/**
 * Motor principal de cálculo de esquadrias
 */
export function calculateTypology(
  input: CalculationInput,
  cutRules: CutRule[],
  glassRules: GlassRule[],
  components: TypologyComponent[],
  typologyName: string,
  typologyNumFolhas: number,
  typology?: Pick<Typology, 'category' | 'min_width_mm' | 'max_width_mm' | 'min_height_mm' | 'max_height_mm'>
): CalculationOutput {
  const { width_mm: L, height_mm: H, quantity } = input;
  const numFolhas = input.num_folhas ?? typologyNumFolhas;

  // ===== VALIDAR DIMENSÕES =====
  if (typology) {
    const validation = validateDimensions(L, H, { ...typology, name: typologyName });
    if (!validation.valid) {
      throw new Error(validation.errors.join('; '));
    }
  }

  // ===== CALCULAR CORTES =====
  const cuts: CutResult[] = cutRules.map(rule => {
    let cutLength: number;

    if (rule.reference_dimension === 'FIXED' && rule.fixed_value_mm !== null) {
      cutLength = rule.fixed_value_mm;
    } else {
      const refValue = resolveReference(rule.reference_dimension, L, H);
      cutLength = (refValue * rule.coefficient) + rule.constant_mm;
    }

    cutLength = Math.round(cutLength);

    if (cutLength <= 0) {
      throw new Error(
        `Corte inválido para "${rule.piece_name}": ${cutLength}mm. Verifique as dimensões do vão (L=${L}, H=${H}).`
      );
    }

    const qty = resolveQuantity(rule.quantity_formula, numFolhas, quantity);
    const wpm = rule.weight_per_meter ?? 0;
    const weightKg = (cutLength / 1000) * wpm * qty;

    return {
      cut_rule_id: rule.id,
      profile_id: rule.profile_id,
      profile_code: rule.profile_code ?? '',
      piece_name: rule.piece_name,
      piece_function: rule.piece_function,
      cut_length_mm: cutLength,
      cut_angle_left: rule.cut_angle_left,
      cut_angle_right: rule.cut_angle_right,
      quantity: qty,
      weight_kg: Math.round(weightKg * 1000) / 1000,
    };
  });

  // ===== CALCULAR VIDROS =====
  const glasses: GlassResult[] = glassRules.map(rule => {
    const glassWidth = resolveReference(rule.width_reference, L, H) + rule.width_constant_mm;
    const glassHeight = resolveReference(rule.height_reference, L, H) + rule.height_constant_mm;
    const qty = rule.quantity * quantity;
    const areaM2 = (glassWidth / 1000) * (glassHeight / 1000) * qty;

    return {
      glass_rule_id: rule.id,
      glass_name: rule.glass_name,
      width_mm: Math.round(glassWidth),
      height_mm: Math.round(glassHeight),
      quantity: qty,
      area_m2: Math.round(areaM2 * 10000) / 10000,
    };
  });

  // ===== CALCULAR COMPONENTES =====
  const componentResults: ComponentResult[] = components.map(comp => {
    const qty = resolveQuantity(comp.quantity_formula, numFolhas, quantity);
    let totalLength: number | undefined;

    if (comp.length_reference) {
      const baseLen = resolveReference(comp.length_reference, L, H);
      totalLength = Math.round(baseLen + (comp.length_constant_mm ?? 0)) * qty;
    }

    return {
      component_name: comp.component_name,
      component_code: comp.component_code,
      component_type: comp.component_type,
      quantity: qty,
      unit: comp.unit,
      total_length_mm: totalLength,
    };
  });

  // ===== RESUMO POR PERFIL =====
  const profileMap = new Map<string, ProfileSummary>();

  for (const cut of cuts) {
    const totalLength = cut.cut_length_mm * cut.quantity;
    const existing = profileMap.get(cut.profile_code);

    if (existing) {
      existing.total_length_mm += totalLength;
      existing.total_weight_kg += cut.weight_kg;
    } else {
      const rule = cutRules.find(r => (r.profile_code ?? '') === cut.profile_code);
      profileMap.set(cut.profile_code, {
        profile_code: cut.profile_code,
        profile_name: cut.piece_name,
        total_length_mm: totalLength,
        total_bars_needed: 0,
        weight_per_meter: rule?.weight_per_meter ?? 0,
        total_weight_kg: cut.weight_kg,
      });
    }
  }

  for (const summary of profileMap.values()) {
    summary.total_bars_needed = Math.ceil(summary.total_length_mm / 6000);
    summary.total_weight_kg = Math.round(summary.total_weight_kg * 1000) / 1000;
  }

  const profilesSummary = Array.from(profileMap.values());
  const totalWeight = profilesSummary.reduce((s, p) => s + p.total_weight_kg, 0);
  const totalGlassArea = glasses.reduce((s, g) => s + g.area_m2, 0);

  return {
    input,
    typology_name: typologyName,
    cuts,
    glasses,
    components: componentResults,
    total_aluminum_weight_kg: Math.round(totalWeight * 1000) / 1000,
    total_glass_area_m2: Math.round(totalGlassArea * 10000) / 10000,
    profiles_summary: profilesSummary,
  };
}
