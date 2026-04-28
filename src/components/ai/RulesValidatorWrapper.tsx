import { useCustomCutRules } from '@/hooks/use-custom-cut-rules';
import { useCustomGlassRules } from '@/hooks/use-custom-glass-rules';
import { useCustomComponentRules } from '@/hooks/use-custom-component-rules';
import { RulesAiValidator } from './RulesAiValidator';

interface Props {
  typology: {
    id: string;
    name: string;
    category: string;
    num_folhas: number;
  };
}

export function RulesValidatorWrapper({ typology }: Props) {
  const { rules: cutRules, loading: loadingCut } = useCustomCutRules(typology.id);
  const { rules: glassRules, loading: loadingGlass } = useCustomGlassRules(typology.id);
  const { rules: compRules, loading: loadingComp } = useCustomComponentRules(typology.id);

  if (loadingCut || loadingGlass || loadingComp) return null;

  return (
    <RulesAiValidator
      typologyName={typology.name}
      category={typology.category}
      numFolhas={typology.num_folhas}
      cutRules={cutRules.map(r => ({
        profile_code: r.profile_code,
        piece_name: r.piece_name,
        piece_function: r.piece_function,
        reference_dimension: r.reference_dimension,
        coefficient: Number(r.coefficient),
        constant_mm: Number(r.constant_mm),
        quantity_formula: r.quantity_formula,
        cut_angle_left: Number(r.cut_angle_left),
        cut_angle_right: Number(r.cut_angle_right),
        weight_per_meter: Number(r.weight_per_meter),
      }))}
      glassRules={glassRules.map(r => ({
        glass_name: r.glass_name,
        width_reference: r.width_reference,
        width_constant_mm: Number(r.width_constant_mm),
        height_reference: r.height_reference,
        height_constant_mm: Number(r.height_constant_mm),
        quantity: r.quantity,
        glass_type: r.glass_type,
        min_thickness_mm: r.min_thickness_mm != null ? Number(r.min_thickness_mm) : null,
        max_thickness_mm: r.max_thickness_mm != null ? Number(r.max_thickness_mm) : null,
      }))}
      componentRules={compRules.map(r => ({
        component_name: r.component_name,
        component_type: r.component_type,
        quantity_formula: r.quantity_formula,
        unit: r.unit,
        length_reference: r.length_reference,
        length_constant_mm: r.length_constant_mm != null ? Number(r.length_constant_mm) : null,
      }))}
    />
  );
}
