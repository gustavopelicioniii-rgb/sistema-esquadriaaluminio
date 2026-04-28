import type { CutRule, Profile } from '@/types/calculation';

// Helper to build a cut rule with profile data auto-filled
export function createCutRule(
  id: string,
  typologyId: string,
  profileCode: string,
  lineId: string,
  pieceName: string,
  pieceFunc: string,
  ref: CutRule['reference_dimension'],
  constant: number,
  angleL: number,
  angleR: number,
  qty: string,
  sort: number,
  profiles: Profile[],
  fixedVal: number | null = null,
  coefficient: number = 1
): CutRule {
  const profile = profiles.find(p => p.code === profileCode && p.product_line_id === lineId);
  return {
    id,
    typology_id: typologyId,
    profile_id: profile?.id ?? '',
    piece_name: pieceName,
    piece_function: pieceFunc,
    reference_dimension: ref,
    coefficient,
    constant_mm: constant,
    fixed_value_mm: fixedVal,
    cut_angle_left: angleL,
    cut_angle_right: angleR,
    quantity_formula: qty,
    sort_order: sort,
    profile_code: profileCode,
    weight_per_meter: profile?.weight_per_meter ?? 0,
  };
}
