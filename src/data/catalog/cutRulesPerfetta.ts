import type { CutRule } from "@/types/calculation";
import { profiles } from "./profiles";

const PF = "line-cent-perfetta";

function cr(
  id: string, typologyId: string, profileCode: string, lineId: string,
  pieceName: string, pieceFunc: string,
  ref: CutRule["reference_dimension"], constant: number,
  angleL: number, angleR: number, qty: string, sort: number,
  fixedVal: number | null = null,
  coefficient: number = 1
): CutRule {
  const profile = profiles.find(p => p.code === profileCode && p.product_line_id === lineId);
  return {
    id, typology_id: typologyId, profile_id: profile?.id ?? "",
    piece_name: pieceName, piece_function: pieceFunc,
    reference_dimension: ref, coefficient, constant_mm: constant,
    fixed_value_mm: fixedVal,
    cut_angle_left: angleL, cut_angle_right: angleR,
    quantity_formula: qty, sort_order: sort,
    profile_code: profileCode,
    weight_per_meter: profile?.weight_per_meter ?? 0,
  };
}

// ============================================
// CENTENÁRIO PERFETTA 45 - CUT RULES
// ============================================

export const perfettaCutRules: CutRule[] = [
  // T1: Janela de Correr 2F
  cr("cpf-jc2f-01","typ-cpf-jc2f","PF-005",PF,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("cpf-jc2f-02","typ-cpf-jc2f","PF-004",PF,"Marco Inferior","marco_inf","L",-8,90,90,"1",2),
  cr("cpf-jc2f-03","typ-cpf-jc2f","PF-043",PF,"Marco Lateral","marco_lat","H",-55,90,90,"2",3),
  cr("cpf-jc2f-04","typ-cpf-jc2f","PF-045",PF,"Montante Folha","montante","H",-130,90,90,"4",4),
  cr("cpf-jc2f-05","typ-cpf-jc2f","PF-046",PF,"Travessa Superior Folha","travessa_sup","L/2",-80,90,90,"2",5),
  cr("cpf-jc2f-06","typ-cpf-jc2f","PF-046",PF,"Travessa Inferior Folha","travessa_inf","L/2",-80,90,90,"2",6),
  cr("cpf-jc2f-07","typ-cpf-jc2f","PF-047",PF,"Baguete Vertical","baguete_v","H",-142,90,90,"4",7),
  cr("cpf-jc2f-08","typ-cpf-jc2f","PF-047",PF,"Baguete Horizontal","baguete_h","L/2",-92,90,90,"4",8),

  // T2: Janela de Correr 4F
  cr("cpf-jc4f-01","typ-cpf-jc4f","PF-005",PF,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("cpf-jc4f-02","typ-cpf-jc4f","PF-004",PF,"Marco Inferior","marco_inf","L",-8,90,90,"1",2),
  cr("cpf-jc4f-03","typ-cpf-jc4f","PF-043",PF,"Marco Lateral","marco_lat","H",-55,90,90,"2",3),
  cr("cpf-jc4f-04","typ-cpf-jc4f","PF-045",PF,"Montante Folha","montante","H",-130,90,90,"8",4),
  cr("cpf-jc4f-05","typ-cpf-jc4f","PF-046",PF,"Travessa Superior Folha","travessa_sup","L/4",-80,90,90,"4",5),
  cr("cpf-jc4f-06","typ-cpf-jc4f","PF-046",PF,"Travessa Inferior Folha","travessa_inf","L/4",-80,90,90,"4",6),
  cr("cpf-jc4f-07","typ-cpf-jc4f","PF-047",PF,"Baguete Vertical","baguete_v","H",-142,90,90,"8",7),
  cr("cpf-jc4f-08","typ-cpf-jc4f","PF-047",PF,"Baguete Horizontal","baguete_h","L/4",-92,90,90,"8",8),

  // T3: Porta de Correr 2F
  cr("cpf-pc2f-01","typ-cpf-pc2f","PF-005",PF,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("cpf-pc2f-02","typ-cpf-pc2f","PF-004",PF,"Marco Inferior","marco_inf","L",-8,90,90,"1",2),
  cr("cpf-pc2f-03","typ-cpf-pc2f","PF-043",PF,"Marco Lateral","marco_lat","H",-55,90,90,"2",3),
  cr("cpf-pc2f-04","typ-cpf-pc2f","PF-045",PF,"Montante Folha","montante","H",-120,90,90,"4",4),
  cr("cpf-pc2f-05","typ-cpf-pc2f","PF-046",PF,"Travessa Superior Folha","travessa_sup","L/2",-80,90,90,"2",5),
  cr("cpf-pc2f-06","typ-cpf-pc2f","PF-046",PF,"Travessa Inferior Folha","travessa_inf","L/2",-80,90,90,"2",6),
  cr("cpf-pc2f-07","typ-cpf-pc2f","PF-047",PF,"Baguete Vertical","baguete_v","H",-132,90,90,"4",7),
  cr("cpf-pc2f-08","typ-cpf-pc2f","PF-047",PF,"Baguete Horizontal","baguete_h","L/2",-92,90,90,"4",8),

  // T4: Porta de Correr 4F
  cr("cpf-pc4f-01","typ-cpf-pc4f","PF-005",PF,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("cpf-pc4f-02","typ-cpf-pc4f","PF-004",PF,"Marco Inferior","marco_inf","L",-8,90,90,"1",2),
  cr("cpf-pc4f-03","typ-cpf-pc4f","PF-043",PF,"Marco Lateral","marco_lat","H",-55,90,90,"2",3),
  cr("cpf-pc4f-04","typ-cpf-pc4f","PF-045",PF,"Montante Folha","montante","H",-120,90,90,"8",4),
  cr("cpf-pc4f-05","typ-cpf-pc4f","PF-046",PF,"Travessa Superior Folha","travessa_sup","L/4",-80,90,90,"4",5),
  cr("cpf-pc4f-06","typ-cpf-pc4f","PF-046",PF,"Travessa Inferior Folha","travessa_inf","L/4",-80,90,90,"4",6),
  cr("cpf-pc4f-07","typ-cpf-pc4f","PF-047",PF,"Baguete Vertical","baguete_v","H",-132,90,90,"8",7),
  cr("cpf-pc4f-08","typ-cpf-pc4f","PF-047",PF,"Baguete Horizontal","baguete_h","L/4",-92,90,90,"8",8),

  // T5: Maxim-Ar 1F
  cr("cpf-jma1-01","typ-cpf-jma1","PF-107",PF,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("cpf-jma1-02","typ-cpf-jma1","PF-106",PF,"Marco Inferior","marco_inf","L",-8,90,90,"1",2),
  cr("cpf-jma1-03","typ-cpf-jma1","PF-105",PF,"Marco Lateral","marco_lat","H",-60,90,90,"2",3),
  cr("cpf-jma1-04","typ-cpf-jma1","PF-098",PF,"Montante Folha","montante","H",-150,90,90,"2",4),
  cr("cpf-jma1-05","typ-cpf-jma1","PF-101",PF,"Travessa Superior Folha","travessa_sup","L",-160,90,90,"1",5),
  cr("cpf-jma1-06","typ-cpf-jma1","PF-101",PF,"Travessa Inferior Folha","travessa_inf","L",-160,90,90,"1",6),

  // T6: Maxim-Ar 2F
  cr("cpf-jma2-01","typ-cpf-jma2","PF-107",PF,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("cpf-jma2-02","typ-cpf-jma2","PF-106",PF,"Marco Inferior","marco_inf","L",-8,90,90,"1",2),
  cr("cpf-jma2-03","typ-cpf-jma2","PF-105",PF,"Marco Lateral","marco_lat","H",-60,90,90,"2",3),
  cr("cpf-jma2-04","typ-cpf-jma2","PF-104",PF,"Montante Divisor","montante_div","H",-60,90,90,"1",4),
  cr("cpf-jma2-05","typ-cpf-jma2","PF-098",PF,"Montante Folha","montante","H",-150,90,90,"4",5),
  cr("cpf-jma2-06","typ-cpf-jma2","PF-101",PF,"Travessa Superior Folha","travessa_sup","L/2",-160,90,90,"2",6),
  cr("cpf-jma2-07","typ-cpf-jma2","PF-101",PF,"Travessa Inferior Folha","travessa_inf","L/2",-160,90,90,"2",7),

  // T7: Porta de Giro 1F
  cr("cpf-pg1f-01","typ-cpf-pg1f","PF-117",PF,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("cpf-pg1f-02","typ-cpf-pg1f","PF-118",PF,"Marco Inferior","marco_inf","L",-8,90,90,"1",2),
  cr("cpf-pg1f-03","typ-cpf-pg1f","PF-117",PF,"Marco Lateral","marco_lat","H",-55,90,90,"2",3),
  cr("cpf-pg1f-04","typ-cpf-pg1f","PF-120",PF,"Montante Folha","montante","H",-125,90,90,"2",4),
  cr("cpf-pg1f-05","typ-cpf-pg1f","PF-119",PF,"Travessa Superior Folha","travessa_sup","L",-130,90,90,"1",5),
  cr("cpf-pg1f-06","typ-cpf-pg1f","PF-119",PF,"Travessa Inferior Folha","travessa_inf","L",-130,90,90,"1",6),
  cr("cpf-pg1f-07","typ-cpf-pg1f","PF-121",PF,"Baguete Vertical","baguete_v","H",-137,90,90,"2",7),
  cr("cpf-pg1f-08","typ-cpf-pg1f","PF-121",PF,"Baguete Horizontal","baguete_h","L",-142,90,90,"2",8),

  // T8: Porta de Giro 2F
  cr("cpf-pg2f-01","typ-cpf-pg2f","PF-117",PF,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("cpf-pg2f-02","typ-cpf-pg2f","PF-118",PF,"Marco Inferior","marco_inf","L",-8,90,90,"1",2),
  cr("cpf-pg2f-03","typ-cpf-pg2f","PF-117",PF,"Marco Lateral","marco_lat","H",-55,90,90,"2",3),
  cr("cpf-pg2f-04","typ-cpf-pg2f","PF-120",PF,"Montante Folha","montante","H",-125,90,90,"4",4),
  cr("cpf-pg2f-05","typ-cpf-pg2f","PF-119",PF,"Travessa Superior Folha","travessa_sup","L/2",-130,90,90,"2",5),
  cr("cpf-pg2f-06","typ-cpf-pg2f","PF-119",PF,"Travessa Inferior Folha","travessa_inf","L/2",-130,90,90,"2",6),
  cr("cpf-pg2f-07","typ-cpf-pg2f","PF-121",PF,"Baguete Vertical","baguete_v","H",-137,90,90,"4",7),
  cr("cpf-pg2f-08","typ-cpf-pg2f","PF-121",PF,"Baguete Horizontal","baguete_h","L/2",-142,90,90,"4",8),

  // T9: Camarão 4F
  cr("cpf-jcam-01","typ-cpf-jcam","PF-4510",PF,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("cpf-jcam-02","typ-cpf-jcam","PF-4508",PF,"Marco Inferior","marco_inf","L",-8,90,90,"1",2),
  cr("cpf-jcam-03","typ-cpf-jcam","PF-4510",PF,"Marco Lateral","marco_lat","H",-55,90,90,"2",3),
  cr("cpf-jcam-04","typ-cpf-jcam","PF-4509",PF,"Montante Folha","montante","H",-130,90,90,"8",4),
  cr("cpf-jcam-05","typ-cpf-jcam","PF-046",PF,"Travessa Superior Folha","travessa_sup","L/4",-80,90,90,"4",5),
  cr("cpf-jcam-06","typ-cpf-jcam","PF-046",PF,"Travessa Inferior Folha","travessa_inf","L/4",-80,90,90,"4",6),
  cr("cpf-jcam-07","typ-cpf-jcam","PF-047",PF,"Baguete Vertical","baguete_v","H",-142,90,90,"8",7),
  cr("cpf-jcam-08","typ-cpf-jcam","PF-047",PF,"Baguete Horizontal","baguete_h","L/4",-92,90,90,"8",8),
];
