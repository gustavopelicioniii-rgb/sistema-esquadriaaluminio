import type { CutRule } from "@/types/calculation";
import { profiles } from "./profiles";

// Helper to build a cut rule with profile data auto-filled
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

const L = "line-suprema";
const G = "line-gold";

// ============================================
// SUPREMA - 15 TIPOLOGIAS
// ============================================

const supremaCutRules: CutRule[] = [
  // T1: Janela Correr 2F
  cr("su-jc2f-01","typ-su-jc2f","SU-010",L,"Marco Superior","marco_sup","L",-6,90,90,"1",1),
  cr("su-jc2f-02","typ-su-jc2f","SU-012",L,"Marco Inferior (Trilho)","marco_inf","L",-6,90,90,"1",2),
  cr("su-jc2f-03","typ-su-jc2f","SU-014",L,"Marco Lateral","marco_lat","H",-57,90,90,"2",3),
  cr("su-jc2f-04","typ-su-jc2f","SU-039",L,"Montante Folha","montante","H",-127,90,90,"4",4),
  cr("su-jc2f-05","typ-su-jc2f","SU-053",L,"Travessa Superior Folha","travessa_sup","L/2",-74,90,90,"2",5),
  cr("su-jc2f-06","typ-su-jc2f","SU-053",L,"Travessa Inferior Folha","travessa_inf","L/2",-74,90,90,"2",6),
  cr("su-jc2f-07","typ-su-jc2f","ISU-502",L,"Baguete Vertical","baguete_v","H",-139,90,90,"4",7),
  cr("su-jc2f-08","typ-su-jc2f","ISU-502",L,"Baguete Horizontal","baguete_h","L/2",-86,90,90,"4",8),
  cr("su-jc2f-09","typ-su-jc2f","CM-200",L,"Contramarco Lateral","contramarco_lat","H",-3,90,90,"2",9),
  cr("su-jc2f-10","typ-su-jc2f","CM-200",L,"Contramarco Sup/Inf","contramarco_h","L",-3,90,90,"2",10),

  // T2: Janela Correr 4F
  cr("su-jc4f-01","typ-su-jc4f","SU-010",L,"Marco Superior","marco_sup","L",-6,90,90,"1",1),
  cr("su-jc4f-02","typ-su-jc4f","SU-012",L,"Marco Inferior (Trilho)","marco_inf","L",-6,90,90,"1",2),
  cr("su-jc4f-03","typ-su-jc4f","SU-014",L,"Marco Lateral","marco_lat","H",-57,90,90,"2",3),
  cr("su-jc4f-04","typ-su-jc4f","SU-039",L,"Montante Folha","montante","H",-127,90,90,"8",4),
  cr("su-jc4f-05","typ-su-jc4f","SU-053",L,"Travessa Superior Folha","travessa_sup","L/4",-74,90,90,"4",5),
  cr("su-jc4f-06","typ-su-jc4f","SU-053",L,"Travessa Inferior Folha","travessa_inf","L/4",-74,90,90,"4",6),
  cr("su-jc4f-07","typ-su-jc4f","ISU-502",L,"Baguete Vertical","baguete_v","H",-139,90,90,"8",7),
  cr("su-jc4f-08","typ-su-jc4f","ISU-502",L,"Baguete Horizontal","baguete_h","L/4",-86,90,90,"8",8),
  cr("su-jc4f-09","typ-su-jc4f","CM-200",L,"Contramarco Lateral","contramarco_lat","H",-3,90,90,"2",9),
  cr("su-jc4f-10","typ-su-jc4f","CM-200",L,"Contramarco Sup/Inf","contramarco_h","L",-3,90,90,"2",10),

  // T3: Janela Correr 3F
  cr("su-jc3f-01","typ-su-jc3f","SU-010",L,"Marco Superior","marco_sup","L",-6,90,90,"1",1),
  cr("su-jc3f-02","typ-su-jc3f","SU-121",L,"Marco Inferior (Trilho 3F)","marco_inf","L",-6,90,90,"1",2),
  cr("su-jc3f-03","typ-su-jc3f","SU-013",L,"Marco Lateral 3F","marco_lat","H",-57,90,90,"2",3),
  cr("su-jc3f-04","typ-su-jc3f","SU-039",L,"Montante Folha","montante","H",-127,90,90,"6",4),
  cr("su-jc3f-05","typ-su-jc3f","SU-053",L,"Travessa Superior Folha","travessa_sup","L/3",-74,90,90,"3",5),
  cr("su-jc3f-06","typ-su-jc3f","SU-053",L,"Travessa Inferior Folha","travessa_inf","L/3",-74,90,90,"3",6),
  cr("su-jc3f-07","typ-su-jc3f","ISU-502",L,"Baguete Vertical","baguete_v","H",-139,90,90,"6",7),
  cr("su-jc3f-08","typ-su-jc3f","ISU-502",L,"Baguete Horizontal","baguete_h","L/3",-86,90,90,"6",8),

  // T4: Janela Correr 4F c/ Peitoril Fixo
  cr("su-jc4fp-01","typ-su-jc4fp","SU-010",L,"Marco Superior","marco_sup","L",-6,90,90,"1",1),
  cr("su-jc4fp-02","typ-su-jc4fp","SU-012",L,"Marco Inferior (Trilho)","marco_inf","L",-6,90,90,"1",2),
  cr("su-jc4fp-03","typ-su-jc4fp","SU-014",L,"Marco Lateral","marco_lat","H",-57,90,90,"2",3),
  cr("su-jc4fp-04","typ-su-jc4fp","SU-053",L,"Travessa Central (divisor)","travessa_div","L",-70,90,90,"1",4),
  cr("su-jc4fp-05","typ-su-jc4fp","SU-039",L,"Montante Folha","montante","H",-200,90,90,"8",5),
  cr("su-jc4fp-06","typ-su-jc4fp","SU-053",L,"Travessa Sup/Inf Folha","travessa","L/4",-74,90,90,"8",6),
  cr("su-jc4fp-07","typ-su-jc4fp","ISU-502",L,"Baguete V Folha","baguete_v","H",-212,90,90,"8",7),
  cr("su-jc4fp-08","typ-su-jc4fp","ISU-502",L,"Baguete H Folha","baguete_h","L/4",-86,90,90,"8",8),
  cr("su-jc4fp-09","typ-su-jc4fp","ISU-502",L,"Baguete V Peitoril","baguete_vp","H",-200,90,90,"2",9),
  cr("su-jc4fp-10","typ-su-jc4fp","ISU-502",L,"Baguete H Peitoril","baguete_hp","L/2",-86,90,90,"2",10),

  // T5: Maxim-Ar 1F
  cr("su-jma1-01","typ-su-jma1","SU-010",L,"Marco Superior","marco_sup","L",-6,90,90,"1",1),
  cr("su-jma1-02","typ-su-jma1","SU-010",L,"Marco Inferior","marco_inf","L",-6,90,90,"1",2),
  cr("su-jma1-03","typ-su-jma1","SU-014",L,"Marco Lateral","marco_lat","H",-57,90,90,"2",3),
  cr("su-jma1-04","typ-su-jma1","SU-079",L,"Montante Folha","montante","H",-127,90,90,"2",4),
  cr("su-jma1-05","typ-su-jma1","SU-080",L,"Travessa Superior Folha","travessa_sup","L",-139,45,45,"1",5),
  cr("su-jma1-06","typ-su-jma1","SU-080",L,"Travessa Inferior Folha","travessa_inf","L",-139,45,45,"1",6),
  cr("su-jma1-07","typ-su-jma1","ISU-502",L,"Baguete Vertical","baguete_v","H",-145,90,90,"2",7),
  cr("su-jma1-08","typ-su-jma1","ISU-502",L,"Baguete Horizontal","baguete_h","L",-151,90,90,"2",8),

  // T6: Maxim-Ar 2F
  cr("su-jma2-01","typ-su-jma2","SU-010",L,"Marco Superior","marco_sup","L",-6,90,90,"1",1),
  cr("su-jma2-02","typ-su-jma2","SU-010",L,"Marco Inferior","marco_inf","L",-6,90,90,"1",2),
  cr("su-jma2-03","typ-su-jma2","SU-014",L,"Marco Lateral","marco_lat","H",-57,90,90,"2",3),
  cr("su-jma2-04","typ-su-jma2","SU-292",L,"Montante Central (fixo)","montante_central","H",-57,90,90,"1",4),
  cr("su-jma2-05","typ-su-jma2","SU-079",L,"Montante Folha","montante","H",-127,90,90,"4",5),
  cr("su-jma2-06","typ-su-jma2","SU-080",L,"Travessa Sup Folha","travessa_sup","L/2",-139,45,45,"2",6),
  cr("su-jma2-07","typ-su-jma2","SU-080",L,"Travessa Inf Folha","travessa_inf","L/2",-139,45,45,"2",7),
  cr("su-jma2-08","typ-su-jma2","ISU-502",L,"Baguete V","baguete_v","H",-145,90,90,"4",8),
  cr("su-jma2-09","typ-su-jma2","ISU-502",L,"Baguete H","baguete_h","L/2",-151,90,90,"4",9),

  // T7: Janela Camarão
  cr("su-jcam-01","typ-su-jcam","SU-010",L,"Marco Superior","marco_sup","L",-6,90,90,"1",1),
  cr("su-jcam-02","typ-su-jcam","SU-012",L,"Marco Inferior","marco_inf","L",-6,90,90,"1",2),
  cr("su-jcam-03","typ-su-jcam","SU-014",L,"Marco Lateral","marco_lat","H",-57,90,90,"2",3),
  cr("su-jcam-04","typ-su-jcam","SU-072",L,"Montante Camarão","montante","H",-127,90,90,"6",4),
  cr("su-jcam-05","typ-su-jcam","SU-073",L,"Travessa Camarão","travessa","L/4",-74,90,90,"8",5),
  cr("su-jcam-06","typ-su-jcam","ISU-502",L,"Baguete V","baguete_v","H",-139,90,90,"6",6),
  cr("su-jcam-07","typ-su-jcam","ISU-502",L,"Baguete H","baguete_h","L/4",-86,90,90,"6",7),

  // T8: Porta Correr 2F
  cr("su-pc2f-01","typ-su-pc2f","SU-010",L,"Marco Superior","marco_sup","L",-6,90,90,"1",1),
  cr("su-pc2f-02","typ-su-pc2f","SU-012",L,"Marco Inferior (Trilho)","marco_inf","L",-6,90,90,"1",2),
  cr("su-pc2f-03","typ-su-pc2f","SU-014",L,"Marco Lateral","marco_lat","H",-38,90,90,"2",3),
  cr("su-pc2f-04","typ-su-pc2f","SU-111",L,"Montante Folha Porta","montante","H",-108,90,90,"4",4),
  cr("su-pc2f-05","typ-su-pc2f","SU-053",L,"Travessa Superior Folha","travessa_sup","L/2",-74,90,90,"2",5),
  cr("su-pc2f-06","typ-su-pc2f","SU-053",L,"Travessa Inferior Folha","travessa_inf","L/2",-74,90,90,"2",6),
  cr("su-pc2f-07","typ-su-pc2f","ISU-502",L,"Baguete V","baguete_v","H",-120,90,90,"4",7),
  cr("su-pc2f-08","typ-su-pc2f","ISU-502",L,"Baguete H","baguete_h","L/2",-86,90,90,"4",8),

  // T9: Porta Correr 4F
  cr("su-pc4f-01","typ-su-pc4f","SU-010",L,"Marco Superior","marco_sup","L",-6,90,90,"1",1),
  cr("su-pc4f-02","typ-su-pc4f","SU-012",L,"Marco Inferior (Trilho)","marco_inf","L",-6,90,90,"1",2),
  cr("su-pc4f-03","typ-su-pc4f","SU-014",L,"Marco Lateral","marco_lat","H",-38,90,90,"2",3),
  cr("su-pc4f-04","typ-su-pc4f","SU-111",L,"Montante Folha Porta","montante","H",-108,90,90,"8",4),
  cr("su-pc4f-05","typ-su-pc4f","SU-053",L,"Travessa Sup Folha","travessa_sup","L/4",-74,90,90,"4",5),
  cr("su-pc4f-06","typ-su-pc4f","SU-053",L,"Travessa Inf Folha","travessa_inf","L/4",-74,90,90,"4",6),
  cr("su-pc4f-07","typ-su-pc4f","ISU-502",L,"Baguete V","baguete_v","H",-120,90,90,"8",7),
  cr("su-pc4f-08","typ-su-pc4f","ISU-502",L,"Baguete H","baguete_h","L/4",-86,90,90,"8",8),

  // T10: Porta Giro 1F
  cr("su-pg1f-01","typ-su-pg1f","SU-089",L,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("su-pg1f-02","typ-su-pg1f","SU-089",L,"Marco Lateral","marco_lat","H",-35,90,90,"2",2),
  cr("su-pg1f-03","typ-su-pg1f","SU-111",L,"Montante Folha","montante","H",-105,45,45,"2",3),
  cr("su-pg1f-04","typ-su-pg1f","SU-111",L,"Travessa Superior Folha","travessa_sup","L",-110,45,45,"1",4),
  cr("su-pg1f-05","typ-su-pg1f","SU-111",L,"Travessa Inferior Folha","travessa_inf","L",-110,45,45,"1",5),
  cr("su-pg1f-06","typ-su-pg1f","SU-279",L,"Cadeirinha","cadeirinha","L",-115,90,90,"1",6),
  cr("su-pg1f-07","typ-su-pg1f","ISU-502",L,"Baguete V","baguete_v","H",-120,90,90,"2",7),
  cr("su-pg1f-08","typ-su-pg1f","ISU-502",L,"Baguete H","baguete_h","L",-125,90,90,"2",8),

  // T11: Porta Giro 2F
  cr("su-pg2f-01","typ-su-pg2f","SU-089",L,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("su-pg2f-02","typ-su-pg2f","SU-089",L,"Marco Lateral","marco_lat","H",-35,90,90,"2",2),
  cr("su-pg2f-03","typ-su-pg2f","SU-111",L,"Montante Folha","montante","H",-105,45,45,"4",3),
  cr("su-pg2f-04","typ-su-pg2f","SU-111",L,"Travessa Sup Folha","travessa_sup","L/2",-110,45,45,"2",4),
  cr("su-pg2f-05","typ-su-pg2f","SU-111",L,"Travessa Inf Folha","travessa_inf","L/2",-110,45,45,"2",5),
  cr("su-pg2f-06","typ-su-pg2f","SU-279",L,"Cadeirinha","cadeirinha","L/2",-115,90,90,"2",6),
  cr("su-pg2f-07","typ-su-pg2f","ISU-502",L,"Baguete V","baguete_v","H",-120,90,90,"4",7),
  cr("su-pg2f-08","typ-su-pg2f","ISU-502",L,"Baguete H","baguete_h","L/2",-125,90,90,"4",8),

  // T12: Janela Correr 2F c/ Veneziana
  cr("su-jc2fv-01","typ-su-jc2fv","SU-010",L,"Marco Superior","marco_sup","L",-6,90,90,"1",1),
  cr("su-jc2fv-02","typ-su-jc2fv","SU-012",L,"Marco Inferior (Trilho)","marco_inf","L",-6,90,90,"1",2),
  cr("su-jc2fv-03","typ-su-jc2fv","SU-014",L,"Marco Lateral","marco_lat","H",-57,90,90,"2",3),
  cr("su-jc2fv-04","typ-su-jc2fv","SU-039",L,"Montante Folha Vidro","montante","H",-127,90,90,"4",4),
  cr("su-jc2fv-05","typ-su-jc2fv","SU-053",L,"Travessa Folha Vidro","travessa","L/2",-74,90,90,"4",5),
  cr("su-jc2fv-06","typ-su-jc2fv","SU-068",L,"Montante Folha Veneziana","montante_ven","H",-127,90,90,"4",6),
  cr("su-jc2fv-07","typ-su-jc2fv","SU-053",L,"Travessa Folha Veneziana","travessa_ven","L/2",-74,90,90,"4",7),
  cr("su-jc2fv-08","typ-su-jc2fv","PAL",L,"Palheta Veneziana","palheta","L/2",-80,90,90,"12",8),
  cr("su-jc2fv-09","typ-su-jc2fv","ISU-502",L,"Baguete V","baguete_v","H",-139,90,90,"4",9),
  cr("su-jc2fv-10","typ-su-jc2fv","ISU-502",L,"Baguete H","baguete_h","L/2",-86,90,90,"4",10),

  // T13: Janela Correr 2F c/ Bandeira Móvel
  cr("su-jc2fb-01","typ-su-jc2fb","SU-010",L,"Marco Superior","marco_sup","L",-6,90,90,"1",1),
  cr("su-jc2fb-02","typ-su-jc2fb","SU-012",L,"Marco Inferior","marco_inf","L",-6,90,90,"1",2),
  cr("su-jc2fb-03","typ-su-jc2fb","SU-014",L,"Marco Lateral","marco_lat","H",-57,90,90,"2",3),
  cr("su-jc2fb-04","typ-su-jc2fb","SU-053",L,"Travessa Divisória (bandeira)","travessa_div","L",-70,90,90,"1",4),
  cr("su-jc2fb-05","typ-su-jc2fb","SU-039",L,"Montante Folha Correr","montante","H",-200,90,90,"4",5),
  cr("su-jc2fb-06","typ-su-jc2fb","SU-053",L,"Travessa Folha Correr","travessa","L/2",-74,90,90,"4",6),
  cr("su-jc2fb-07","typ-su-jc2fb","SU-079",L,"Montante Bandeira","montante_band","H",-130,90,90,"2",7),
  cr("su-jc2fb-08","typ-su-jc2fb","SU-080",L,"Travessa Bandeira","travessa_band","L",-139,45,45,"2",8),

  // T14: Janela Correr 6F
  cr("su-jc6f-01","typ-su-jc6f","SU-010",L,"Marco Superior","marco_sup","L",-6,90,90,"1",1),
  cr("su-jc6f-02","typ-su-jc6f","SU-121",L,"Marco Inferior (Trilho)","marco_inf","L",-6,90,90,"1",2),
  cr("su-jc6f-03","typ-su-jc6f","SU-013",L,"Marco Lateral","marco_lat","H",-57,90,90,"2",3),
  cr("su-jc6f-04","typ-su-jc6f","SU-039",L,"Montante Folha","montante","H",-127,90,90,"12",4),
  cr("su-jc6f-05","typ-su-jc6f","SU-053",L,"Travessa Folha","travessa","L/6",-74,90,90,"12",5),
  cr("su-jc6f-06","typ-su-jc6f","ISU-502",L,"Baguete V","baguete_v","H",-139,90,90,"12",6),
  cr("su-jc6f-07","typ-su-jc6f","ISU-502",L,"Baguete H","baguete_h","L/6",-86,90,90,"12",7),

  // T15: Porta Correr 3F
  cr("su-pc3f-01","typ-su-pc3f","SU-010",L,"Marco Superior","marco_sup","L",-6,90,90,"1",1),
  cr("su-pc3f-02","typ-su-pc3f","SU-121",L,"Marco Inferior (Trilho 3F)","marco_inf","L",-6,90,90,"1",2),
  cr("su-pc3f-03","typ-su-pc3f","SU-013",L,"Marco Lateral 3F","marco_lat","H",-38,90,90,"2",3),
  cr("su-pc3f-04","typ-su-pc3f","SU-111",L,"Montante Folha Porta","montante","H",-108,90,90,"6",4),
  cr("su-pc3f-05","typ-su-pc3f","SU-053",L,"Travessa Sup Folha","travessa_sup","L/3",-74,90,90,"3",5),
  cr("su-pc3f-06","typ-su-pc3f","SU-053",L,"Travessa Inf Folha","travessa_inf","L/3",-74,90,90,"3",6),
  cr("su-pc3f-07","typ-su-pc3f","ISU-502",L,"Baguete V","baguete_v","H",-120,90,90,"6",7),
  cr("su-pc3f-08","typ-su-pc3f","ISU-502",L,"Baguete H","baguete_h","L/3",-86,90,90,"6",8),
];

// ============================================
// GOLD - 15 TIPOLOGIAS
// ============================================

const goldCutRules: CutRule[] = [
  // T1: Janela Correr 2F Gold
  cr("go-jc2f-01","typ-go-jc2f","GO-010",G,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("go-jc2f-02","typ-go-jc2f","GO-012",G,"Marco Inferior (Trilho)","marco_inf","L",-8,90,90,"1",2),
  cr("go-jc2f-03","typ-go-jc2f","GO-014",G,"Marco Lateral","marco_lat","H",-65,90,90,"2",3),
  cr("go-jc2f-04","typ-go-jc2f","GO-039",G,"Montante Folha","montante","H",-140,90,90,"4",4),
  cr("go-jc2f-05","typ-go-jc2f","GO-053",G,"Travessa Superior Folha","travessa_sup","L/2",-82,90,90,"2",5),
  cr("go-jc2f-06","typ-go-jc2f","GO-053",G,"Travessa Inferior Folha","travessa_inf","L/2",-82,90,90,"2",6),
  cr("go-jc2f-07","typ-go-jc2f","IGO-502",G,"Baguete Vertical","baguete_v","H",-155,90,90,"4",7),
  cr("go-jc2f-08","typ-go-jc2f","IGO-502",G,"Baguete Horizontal","baguete_h","L/2",-97,90,90,"4",8),

  // T2: Janela Correr 4F Gold
  cr("go-jc4f-01","typ-go-jc4f","GO-010",G,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("go-jc4f-02","typ-go-jc4f","GO-012",G,"Marco Inferior (Trilho)","marco_inf","L",-8,90,90,"1",2),
  cr("go-jc4f-03","typ-go-jc4f","GO-014",G,"Marco Lateral","marco_lat","H",-65,90,90,"2",3),
  cr("go-jc4f-04","typ-go-jc4f","GO-039",G,"Montante Folha","montante","H",-140,90,90,"8",4),
  cr("go-jc4f-05","typ-go-jc4f","GO-053",G,"Travessa Folha","travessa","L/4",-82,90,90,"8",5),
  cr("go-jc4f-06","typ-go-jc4f","IGO-502",G,"Baguete V","baguete_v","H",-155,90,90,"8",6),
  cr("go-jc4f-07","typ-go-jc4f","IGO-502",G,"Baguete H","baguete_h","L/4",-97,90,90,"8",7),

  // T3: Janela Correr 3F Gold
  cr("go-jc3f-01","typ-go-jc3f","GO-010",G,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("go-jc3f-02","typ-go-jc3f","GO-121",G,"Marco Inferior (Trilho 3F)","marco_inf","L",-8,90,90,"1",2),
  cr("go-jc3f-03","typ-go-jc3f","GO-013",G,"Marco Lateral 3F","marco_lat","H",-65,90,90,"2",3),
  cr("go-jc3f-04","typ-go-jc3f","GO-039",G,"Montante Folha","montante","H",-140,90,90,"6",4),
  cr("go-jc3f-05","typ-go-jc3f","GO-053",G,"Travessa Folha","travessa","L/3",-82,90,90,"6",5),
  cr("go-jc3f-06","typ-go-jc3f","IGO-502",G,"Baguete V","baguete_v","H",-155,90,90,"6",6),
  cr("go-jc3f-07","typ-go-jc3f","IGO-502",G,"Baguete H","baguete_h","L/3",-97,90,90,"6",7),

  // T4: Maxim-Ar 1F Gold
  cr("go-jma1-01","typ-go-jma1","GO-010",G,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("go-jma1-02","typ-go-jma1","GO-010",G,"Marco Inferior","marco_inf","L",-8,90,90,"1",2),
  cr("go-jma1-03","typ-go-jma1","GO-014",G,"Marco Lateral","marco_lat","H",-65,90,90,"2",3),
  cr("go-jma1-04","typ-go-jma1","GO-079",G,"Montante Folha","montante","H",-140,90,90,"2",4),
  cr("go-jma1-05","typ-go-jma1","GO-080",G,"Travessa Sup Folha","travessa_sup","L",-155,45,45,"1",5),
  cr("go-jma1-06","typ-go-jma1","GO-080",G,"Travessa Inf Folha","travessa_inf","L",-155,45,45,"1",6),
  cr("go-jma1-07","typ-go-jma1","IGO-502",G,"Baguete V","baguete_v","H",-160,90,90,"2",7),
  cr("go-jma1-08","typ-go-jma1","IGO-502",G,"Baguete H","baguete_h","L",-170,90,90,"2",8),

  // T5: Maxim-Ar 2F Gold
  cr("go-jma2-01","typ-go-jma2","GO-010",G,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("go-jma2-02","typ-go-jma2","GO-010",G,"Marco Inferior","marco_inf","L",-8,90,90,"1",2),
  cr("go-jma2-03","typ-go-jma2","GO-014",G,"Marco Lateral","marco_lat","H",-65,90,90,"2",3),
  cr("go-jma2-04","typ-go-jma2","GO-292",G,"Montante Central","montante_central","H",-65,90,90,"1",4),
  cr("go-jma2-05","typ-go-jma2","GO-079",G,"Montante Folha","montante","H",-140,90,90,"4",5),
  cr("go-jma2-06","typ-go-jma2","GO-080",G,"Travessa Folha","travessa","L/2",-155,45,45,"4",6),
  cr("go-jma2-07","typ-go-jma2","IGO-502",G,"Baguete V","baguete_v","H",-160,90,90,"4",7),
  cr("go-jma2-08","typ-go-jma2","IGO-502",G,"Baguete H","baguete_h","L/2",-170,90,90,"4",8),

  // T6: Porta Correr 2F Gold
  cr("go-pc2f-01","typ-go-pc2f","GO-010",G,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("go-pc2f-02","typ-go-pc2f","GO-012",G,"Marco Inferior (Trilho)","marco_inf","L",-8,90,90,"1",2),
  cr("go-pc2f-03","typ-go-pc2f","GO-014",G,"Marco Lateral","marco_lat","H",-45,90,90,"2",3),
  cr("go-pc2f-04","typ-go-pc2f","GO-111",G,"Montante Folha Porta","montante","H",-120,90,90,"4",4),
  cr("go-pc2f-05","typ-go-pc2f","GO-053",G,"Travessa Sup Folha","travessa_sup","L/2",-82,90,90,"2",5),
  cr("go-pc2f-06","typ-go-pc2f","GO-053",G,"Travessa Inf Folha","travessa_inf","L/2",-82,90,90,"2",6),
  cr("go-pc2f-07","typ-go-pc2f","IGO-502",G,"Baguete V","baguete_v","H",-135,90,90,"4",7),
  cr("go-pc2f-08","typ-go-pc2f","IGO-502",G,"Baguete H","baguete_h","L/2",-97,90,90,"4",8),

  // T7: Porta Correr 4F Gold
  cr("go-pc4f-01","typ-go-pc4f","GO-010",G,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("go-pc4f-02","typ-go-pc4f","GO-012",G,"Marco Inferior (Trilho)","marco_inf","L",-8,90,90,"1",2),
  cr("go-pc4f-03","typ-go-pc4f","GO-014",G,"Marco Lateral","marco_lat","H",-45,90,90,"2",3),
  cr("go-pc4f-04","typ-go-pc4f","GO-111",G,"Montante Folha Porta","montante","H",-120,90,90,"8",4),
  cr("go-pc4f-05","typ-go-pc4f","GO-053",G,"Travessa Folha","travessa","L/4",-82,90,90,"8",5),
  cr("go-pc4f-06","typ-go-pc4f","IGO-502",G,"Baguete V","baguete_v","H",-135,90,90,"8",6),
  cr("go-pc4f-07","typ-go-pc4f","IGO-502",G,"Baguete H","baguete_h","L/4",-97,90,90,"8",7),

  // T8: Porta Giro 1F Gold
  cr("go-pg1f-01","typ-go-pg1f","GO-089",G,"Marco Superior","marco_sup","L",-10,90,90,"1",1),
  cr("go-pg1f-02","typ-go-pg1f","GO-089",G,"Marco Lateral","marco_lat","H",-40,90,90,"2",2),
  cr("go-pg1f-03","typ-go-pg1f","GO-111",G,"Montante Folha","montante","H",-115,45,45,"2",3),
  cr("go-pg1f-04","typ-go-pg1f","GO-111",G,"Travessa Sup Folha","travessa_sup","L",-120,45,45,"1",4),
  cr("go-pg1f-05","typ-go-pg1f","GO-111",G,"Travessa Inf Folha","travessa_inf","L",-120,45,45,"1",5),
  cr("go-pg1f-06","typ-go-pg1f","IGO-502",G,"Baguete V","baguete_v","H",-135,90,90,"2",6),
  cr("go-pg1f-07","typ-go-pg1f","IGO-502",G,"Baguete H","baguete_h","L",-140,90,90,"2",7),

  // T9: Porta Giro 2F Gold
  cr("go-pg2f-01","typ-go-pg2f","GO-089",G,"Marco Superior","marco_sup","L",-10,90,90,"1",1),
  cr("go-pg2f-02","typ-go-pg2f","GO-089",G,"Marco Lateral","marco_lat","H",-40,90,90,"2",2),
  cr("go-pg2f-03","typ-go-pg2f","GO-111",G,"Montante Folha","montante","H",-115,45,45,"4",3),
  cr("go-pg2f-04","typ-go-pg2f","GO-111",G,"Travessa Folha","travessa","L/2",-120,45,45,"4",4),
  cr("go-pg2f-05","typ-go-pg2f","IGO-502",G,"Baguete V","baguete_v","H",-135,90,90,"4",5),
  cr("go-pg2f-06","typ-go-pg2f","IGO-502",G,"Baguete H","baguete_h","L/2",-140,90,90,"4",6),

  // T10: Janela Correr 4F c/ Peitoril Gold
  cr("go-jc4fp-01","typ-go-jc4fp","GO-010",G,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("go-jc4fp-02","typ-go-jc4fp","GO-012",G,"Marco Inferior","marco_inf","L",-8,90,90,"1",2),
  cr("go-jc4fp-03","typ-go-jc4fp","GO-014",G,"Marco Lateral","marco_lat","H",-65,90,90,"2",3),
  cr("go-jc4fp-04","typ-go-jc4fp","GO-053",G,"Travessa Divisória","travessa_div","L",-78,90,90,"1",4),
  cr("go-jc4fp-05","typ-go-jc4fp","GO-039",G,"Montante Folha","montante","H",-215,90,90,"8",5),
  cr("go-jc4fp-06","typ-go-jc4fp","GO-053",G,"Travessa Folha","travessa","L/4",-82,90,90,"8",6),
  cr("go-jc4fp-07","typ-go-jc4fp","IGO-502",G,"Baguete V Folha","baguete_v","H",-230,90,90,"8",7),
  cr("go-jc4fp-08","typ-go-jc4fp","IGO-502",G,"Baguete H Folha","baguete_h","L/4",-97,90,90,"8",8),

  // T11: Janela Camarão Gold
  cr("go-jcam-01","typ-go-jcam","GO-010",G,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("go-jcam-02","typ-go-jcam","GO-012",G,"Marco Inferior","marco_inf","L",-8,90,90,"1",2),
  cr("go-jcam-03","typ-go-jcam","GO-014",G,"Marco Lateral","marco_lat","H",-65,90,90,"2",3),
  cr("go-jcam-04","typ-go-jcam","GO-072",G,"Montante Camarão","montante","H",-140,90,90,"6",4),
  cr("go-jcam-05","typ-go-jcam","GO-073",G,"Travessa Camarão","travessa","L/4",-82,90,90,"8",5),
  cr("go-jcam-06","typ-go-jcam","IGO-502",G,"Baguete V","baguete_v","H",-155,90,90,"6",6),
  cr("go-jcam-07","typ-go-jcam","IGO-502",G,"Baguete H","baguete_h","L/4",-97,90,90,"6",7),

  // T12: Janela Correr 2F c/ Veneziana Gold
  cr("go-jc2fv-01","typ-go-jc2fv","GO-010",G,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("go-jc2fv-02","typ-go-jc2fv","GO-012",G,"Marco Inferior","marco_inf","L",-8,90,90,"1",2),
  cr("go-jc2fv-03","typ-go-jc2fv","GO-014",G,"Marco Lateral","marco_lat","H",-65,90,90,"2",3),
  cr("go-jc2fv-04","typ-go-jc2fv","GO-039",G,"Montante Folha Vidro","montante","H",-140,90,90,"4",4),
  cr("go-jc2fv-05","typ-go-jc2fv","GO-053",G,"Travessa Folha Vidro","travessa","L/2",-82,90,90,"4",5),
  cr("go-jc2fv-06","typ-go-jc2fv","GO-068",G,"Montante Folha Veneziana","montante_ven","H",-140,90,90,"4",6),
  cr("go-jc2fv-07","typ-go-jc2fv","GO-053",G,"Travessa Folha Veneziana","travessa_ven","L/2",-82,90,90,"4",7),
  cr("go-jc2fv-08","typ-go-jc2fv","IGO-502",G,"Baguete V","baguete_v","H",-155,90,90,"4",8),
  cr("go-jc2fv-09","typ-go-jc2fv","IGO-502",G,"Baguete H","baguete_h","L/2",-97,90,90,"4",9),

  // T13: Janela Giro (Abre e Tomba) Gold
  cr("go-jgiro-01","typ-go-jgiro","GO-010",G,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("go-jgiro-02","typ-go-jgiro","GO-010",G,"Marco Inferior","marco_inf","L",-8,90,90,"1",2),
  cr("go-jgiro-03","typ-go-jgiro","GO-014",G,"Marco Lateral","marco_lat","H",-65,90,90,"2",3),
  cr("go-jgiro-04","typ-go-jgiro","GO-111",G,"Montante Folha","montante","H",-140,45,45,"2",4),
  cr("go-jgiro-05","typ-go-jgiro","GO-111",G,"Travessa Sup Folha","travessa_sup","L",-155,45,45,"1",5),
  cr("go-jgiro-06","typ-go-jgiro","GO-111",G,"Travessa Inf Folha","travessa_inf","L",-155,45,45,"1",6),
  cr("go-jgiro-07","typ-go-jgiro","IGO-502",G,"Baguete V","baguete_v","H",-160,90,90,"2",7),
  cr("go-jgiro-08","typ-go-jgiro","IGO-502",G,"Baguete H","baguete_h","L",-170,90,90,"2",8),

  // T14: Porta Integrada (Correr + Fixo) Gold
  cr("go-pint-01","typ-go-pint","GO-010",G,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("go-pint-02","typ-go-pint","GO-012",G,"Marco Inferior","marco_inf","L",-8,90,90,"1",2),
  cr("go-pint-03","typ-go-pint","GO-014",G,"Marco Lateral","marco_lat","H",-45,90,90,"2",3),
  cr("go-pint-04","typ-go-pint","GO-292",G,"Montante Fixo","montante_fixo","H",-65,90,90,"1",4),
  cr("go-pint-05","typ-go-pint","GO-111",G,"Montante Folha","montante","H",-120,90,90,"4",5),
  cr("go-pint-06","typ-go-pint","GO-053",G,"Travessa Folha","travessa","L/3",-82,90,90,"4",6),
  cr("go-pint-07","typ-go-pint","IGO-502",G,"Baguete V Folha","baguete_v","H",-135,90,90,"4",7),
  cr("go-pint-08","typ-go-pint","IGO-502",G,"Baguete H Folha","baguete_h","L/3",-97,90,90,"4",8),
  cr("go-pint-09","typ-go-pint","IGO-502",G,"Baguete V Fixo","baguete_vf","H",-80,90,90,"2",9),
  cr("go-pint-10","typ-go-pint","IGO-502",G,"Baguete H Fixo","baguete_hf","L/3",-97,90,90,"2",10),

  // T15: Janela Correr 6F Gold
  cr("go-jc6f-01","typ-go-jc6f","GO-010",G,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("go-jc6f-02","typ-go-jc6f","GO-121",G,"Marco Inferior (Trilho)","marco_inf","L",-8,90,90,"1",2),
  cr("go-jc6f-03","typ-go-jc6f","GO-013",G,"Marco Lateral","marco_lat","H",-65,90,90,"2",3),
  cr("go-jc6f-04","typ-go-jc6f","GO-039",G,"Montante Folha","montante","H",-140,90,90,"12",4),
  cr("go-jc6f-05","typ-go-jc6f","GO-053",G,"Travessa Folha","travessa","L/6",-82,90,90,"12",5),
  cr("go-jc6f-06","typ-go-jc6f","IGO-502",G,"Baguete V","baguete_v","H",-155,90,90,"12",6),
  cr("go-jc6f-07","typ-go-jc6f","IGO-502",G,"Baguete H","baguete_h","L/6",-97,90,90,"12",7),
];

// ============================================
// CLONE CUT RULES FOR COMPATIBLE LINES (Mega25, Hyspex, Alumasa, DS)
// ============================================

interface CloneMapping {
  lineId: string;
  typologyPrefix: string;
  idPrefix: string;
  profileCodeMap: (code: string) => string;
  constantOffset: number; // ASA Mega has +1mm offset
}

const cloneMappings: CloneMapping[] = [
  {
    lineId: "line-mega25", typologyPrefix: "typ-mg25-", idPrefix: "mg25-",
    profileCodeMap: (c) => {
      if (c.startsWith("SU-")) return `25-${c.slice(3)}`;
      if (c.startsWith("ISU-")) return `I25-${c.slice(4)}`;
      if (c === "PAL") return "PAL";
      return `25-${c}`;
    },
    constantOffset: -1, // Mega tends to be ~1mm more desconto
  },
  {
    lineId: "line-hyspex25su", typologyPrefix: "typ-hy-", idPrefix: "hy-",
    profileCodeMap: (c) => {
      if (c.startsWith("SU-")) return `HY-${c.slice(3)}`;
      if (c.startsWith("ISU-")) return `IHY-${c.slice(4)}`;
      if (c === "PAL") return "PAL";
      return `HY-${c}`;
    },
    constantOffset: 0,
  },
  {
    lineId: "line-alumasa25", typologyPrefix: "typ-al-", idPrefix: "al-",
    profileCodeMap: (c) => {
      if (c.startsWith("SU-")) return `AL-${c.slice(3)}`;
      if (c.startsWith("ISU-")) return `IAL-${c.slice(4)}`;
      if (c === "PAL") return "PAL";
      return `AL-${c}`;
    },
    constantOffset: 0,
  },
  {
    lineId: "line-ds-suprema", typologyPrefix: "typ-ds-", idPrefix: "ds-",
    profileCodeMap: (c) => {
      if (c.startsWith("SU-")) return `DS-${c.slice(3)}`;
      if (c.startsWith("ISU-")) return `IDS-${c.slice(4)}`;
      if (c === "PAL") return "PAL";
      return `DS-${c}`;
    },
    constantOffset: 0,
  },
];

function cloneCutRules(source: CutRule[], mapping: CloneMapping): CutRule[] {
  return source.map(rule => {
    const newProfileCode = mapping.profileCodeMap(rule.profile_code ?? "");
    const profile = profiles.find(p => p.code === newProfileCode && p.product_line_id === mapping.lineId);
    return {
      ...rule,
      id: rule.id.replace("su-", mapping.idPrefix),
      typology_id: rule.typology_id.replace("typ-su-", mapping.typologyPrefix),
      profile_id: profile?.id ?? rule.profile_id,
      profile_code: newProfileCode,
      weight_per_meter: profile?.weight_per_meter ?? rule.weight_per_meter,
      constant_mm: rule.constant_mm + mapping.constantOffset,
    };
  });
}

const clonedCutRules = cloneMappings.flatMap(m => cloneCutRules(supremaCutRules, m));

export const cutRules: CutRule[] = [
  ...supremaCutRules,
  ...goldCutRules,
  ...clonedCutRules,
];
