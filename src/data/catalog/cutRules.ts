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
// TOP (40mm) - 12 TIPOLOGIAS FACHADA
// ============================================
const T = "line-top";

const topCutRules: CutRule[] = [
  // T1: Janela Correr 2F Top
  cr("tp-jc2f-01","typ-tp-jc2f","TP-010",T,"Marco Superior","marco_sup","L",-10,90,90,"1",1),
  cr("tp-jc2f-02","typ-tp-jc2f","TP-012",T,"Marco Inferior (Trilho)","marco_inf","L",-10,90,90,"1",2),
  cr("tp-jc2f-03","typ-tp-jc2f","TP-014",T,"Marco Lateral","marco_lat","H",-78,90,90,"2",3),
  cr("tp-jc2f-04","typ-tp-jc2f","TP-039",T,"Montante Folha","montante","H",-168,90,90,"4",4),
  cr("tp-jc2f-05","typ-tp-jc2f","TP-053",T,"Travessa Superior Folha","travessa_sup","L/2",-98,90,90,"2",5),
  cr("tp-jc2f-06","typ-tp-jc2f","TP-053",T,"Travessa Inferior Folha","travessa_inf","L/2",-98,90,90,"2",6),
  cr("tp-jc2f-07","typ-tp-jc2f","ITP-502",T,"Baguete Vertical","baguete_v","H",-185,90,90,"4",7),
  cr("tp-jc2f-08","typ-tp-jc2f","ITP-502",T,"Baguete Horizontal","baguete_h","L/2",-115,90,90,"4",8),

  // T2: Janela Correr 4F Top
  cr("tp-jc4f-01","typ-tp-jc4f","TP-010",T,"Marco Superior","marco_sup","L",-10,90,90,"1",1),
  cr("tp-jc4f-02","typ-tp-jc4f","TP-012",T,"Marco Inferior (Trilho)","marco_inf","L",-10,90,90,"1",2),
  cr("tp-jc4f-03","typ-tp-jc4f","TP-014",T,"Marco Lateral","marco_lat","H",-78,90,90,"2",3),
  cr("tp-jc4f-04","typ-tp-jc4f","TP-039",T,"Montante Folha","montante","H",-168,90,90,"8",4),
  cr("tp-jc4f-05","typ-tp-jc4f","TP-053",T,"Travessa Folha","travessa","L/4",-98,90,90,"8",5),
  cr("tp-jc4f-06","typ-tp-jc4f","ITP-502",T,"Baguete V","baguete_v","H",-185,90,90,"8",6),
  cr("tp-jc4f-07","typ-tp-jc4f","ITP-502",T,"Baguete H","baguete_h","L/4",-115,90,90,"8",7),

  // T3: Maxim-Ar 1F Top
  cr("tp-jma1-01","typ-tp-jma1","TP-010",T,"Marco Superior","marco_sup","L",-10,90,90,"1",1),
  cr("tp-jma1-02","typ-tp-jma1","TP-010",T,"Marco Inferior","marco_inf","L",-10,90,90,"1",2),
  cr("tp-jma1-03","typ-tp-jma1","TP-014",T,"Marco Lateral","marco_lat","H",-78,90,90,"2",3),
  cr("tp-jma1-04","typ-tp-jma1","TP-079",T,"Montante Folha","montante","H",-168,90,90,"2",4),
  cr("tp-jma1-05","typ-tp-jma1","TP-080",T,"Travessa Sup Folha","travessa_sup","L",-185,45,45,"1",5),
  cr("tp-jma1-06","typ-tp-jma1","TP-080",T,"Travessa Inf Folha","travessa_inf","L",-185,45,45,"1",6),
  cr("tp-jma1-07","typ-tp-jma1","ITP-502",T,"Baguete V","baguete_v","H",-190,90,90,"2",7),
  cr("tp-jma1-08","typ-tp-jma1","ITP-502",T,"Baguete H","baguete_h","L",-200,90,90,"2",8),

  // T4: Porta Correr 2F Top
  cr("tp-pc2f-01","typ-tp-pc2f","TP-010",T,"Marco Superior","marco_sup","L",-10,90,90,"1",1),
  cr("tp-pc2f-02","typ-tp-pc2f","TP-012",T,"Marco Inferior (Trilho)","marco_inf","L",-10,90,90,"1",2),
  cr("tp-pc2f-03","typ-tp-pc2f","TP-014",T,"Marco Lateral","marco_lat","H",-55,90,90,"2",3),
  cr("tp-pc2f-04","typ-tp-pc2f","TP-111",T,"Montante Folha Porta","montante","H",-145,90,90,"4",4),
  cr("tp-pc2f-05","typ-tp-pc2f","TP-053",T,"Travessa Sup Folha","travessa_sup","L/2",-98,90,90,"2",5),
  cr("tp-pc2f-06","typ-tp-pc2f","TP-053",T,"Travessa Inf Folha","travessa_inf","L/2",-98,90,90,"2",6),
  cr("tp-pc2f-07","typ-tp-pc2f","ITP-502",T,"Baguete V","baguete_v","H",-160,90,90,"4",7),
  cr("tp-pc2f-08","typ-tp-pc2f","ITP-502",T,"Baguete H","baguete_h","L/2",-115,90,90,"4",8),

  // T5: Porta Correr 4F Top
  cr("tp-pc4f-01","typ-tp-pc4f","TP-010",T,"Marco Superior","marco_sup","L",-10,90,90,"1",1),
  cr("tp-pc4f-02","typ-tp-pc4f","TP-012",T,"Marco Inferior (Trilho)","marco_inf","L",-10,90,90,"1",2),
  cr("tp-pc4f-03","typ-tp-pc4f","TP-014",T,"Marco Lateral","marco_lat","H",-55,90,90,"2",3),
  cr("tp-pc4f-04","typ-tp-pc4f","TP-111",T,"Montante Folha Porta","montante","H",-145,90,90,"8",4),
  cr("tp-pc4f-05","typ-tp-pc4f","TP-053",T,"Travessa Folha","travessa","L/4",-98,90,90,"8",5),
  cr("tp-pc4f-06","typ-tp-pc4f","ITP-502",T,"Baguete V","baguete_v","H",-160,90,90,"8",6),
  cr("tp-pc4f-07","typ-tp-pc4f","ITP-502",T,"Baguete H","baguete_h","L/4",-115,90,90,"8",7),

  // T6: Porta Giro 1F Top
  cr("tp-pg1f-01","typ-tp-pg1f","TP-089",T,"Marco Superior","marco_sup","L",-12,90,90,"1",1),
  cr("tp-pg1f-02","typ-tp-pg1f","TP-089",T,"Marco Lateral","marco_lat","H",-48,90,90,"2",2),
  cr("tp-pg1f-03","typ-tp-pg1f","TP-111",T,"Montante Folha","montante","H",-140,45,45,"2",3),
  cr("tp-pg1f-04","typ-tp-pg1f","TP-111",T,"Travessa Sup Folha","travessa_sup","L",-148,45,45,"1",4),
  cr("tp-pg1f-05","typ-tp-pg1f","TP-111",T,"Travessa Inf Folha","travessa_inf","L",-148,45,45,"1",5),
  cr("tp-pg1f-06","typ-tp-pg1f","ITP-502",T,"Baguete V","baguete_v","H",-160,90,90,"2",6),
  cr("tp-pg1f-07","typ-tp-pg1f","ITP-502",T,"Baguete H","baguete_h","L",-168,90,90,"2",7),

  // T7: Porta Giro 2F Top
  cr("tp-pg2f-01","typ-tp-pg2f","TP-089",T,"Marco Superior","marco_sup","L",-12,90,90,"1",1),
  cr("tp-pg2f-02","typ-tp-pg2f","TP-089",T,"Marco Lateral","marco_lat","H",-48,90,90,"2",2),
  cr("tp-pg2f-03","typ-tp-pg2f","TP-111",T,"Montante Folha","montante","H",-140,45,45,"4",3),
  cr("tp-pg2f-04","typ-tp-pg2f","TP-111",T,"Travessa Folha","travessa","L/2",-148,45,45,"4",4),
  cr("tp-pg2f-05","typ-tp-pg2f","ITP-502",T,"Baguete V","baguete_v","H",-160,90,90,"4",5),
  cr("tp-pg2f-06","typ-tp-pg2f","ITP-502",T,"Baguete H","baguete_h","L/2",-168,90,90,"4",6),

  // T8: Vitrô Fixo Fachada Top
  cr("tp-vfix-01","typ-tp-vfix","TP-010",T,"Marco Superior","marco_sup","L",-10,90,90,"1",1),
  cr("tp-vfix-02","typ-tp-vfix","TP-010",T,"Marco Inferior","marco_inf","L",-10,90,90,"1",2),
  cr("tp-vfix-03","typ-tp-vfix","TP-014",T,"Marco Lateral","marco_lat","H",-78,90,90,"2",3),
  cr("tp-vfix-04","typ-tp-vfix","ITP-502",T,"Baguete V","baguete_v","H",-95,90,90,"2",4),
  cr("tp-vfix-05","typ-tp-vfix","ITP-502",T,"Baguete H","baguete_h","L",-95,90,90,"2",5),

  // T9: Porta Integrada Top
  cr("tp-pint-01","typ-tp-pint","TP-010",T,"Marco Superior","marco_sup","L",-10,90,90,"1",1),
  cr("tp-pint-02","typ-tp-pint","TP-012",T,"Marco Inferior","marco_inf","L",-10,90,90,"1",2),
  cr("tp-pint-03","typ-tp-pint","TP-014",T,"Marco Lateral","marco_lat","H",-55,90,90,"2",3),
  cr("tp-pint-04","typ-tp-pint","TP-292",T,"Montante Fixo","montante_fixo","H",-78,90,90,"1",4),
  cr("tp-pint-05","typ-tp-pint","TP-111",T,"Montante Folha","montante","H",-145,90,90,"4",5),
  cr("tp-pint-06","typ-tp-pint","TP-053",T,"Travessa Folha","travessa","L/3",-98,90,90,"4",6),
  cr("tp-pint-07","typ-tp-pint","ITP-502",T,"Baguete V Folha","baguete_v","H",-160,90,90,"4",7),
  cr("tp-pint-08","typ-tp-pint","ITP-502",T,"Baguete H Folha","baguete_h","L/3",-115,90,90,"4",8),
  cr("tp-pint-09","typ-tp-pint","ITP-502",T,"Baguete V Fixo","baguete_vf","H",-95,90,90,"2",9),
  cr("tp-pint-10","typ-tp-pint","ITP-502",T,"Baguete H Fixo","baguete_hf","L/3",-115,90,90,"2",10),

  // T10: Porta Camarão Fachada Top
  cr("tp-jcam-01","typ-tp-jcam","TP-010",T,"Marco Superior","marco_sup","L",-10,90,90,"1",1),
  cr("tp-jcam-02","typ-tp-jcam","TP-012",T,"Marco Inferior","marco_inf","L",-10,90,90,"1",2),
  cr("tp-jcam-03","typ-tp-jcam","TP-014",T,"Marco Lateral","marco_lat","H",-78,90,90,"2",3),
  cr("tp-jcam-04","typ-tp-jcam","TP-072",T,"Montante Camarão","montante","H",-168,90,90,"6",4),
  cr("tp-jcam-05","typ-tp-jcam","TP-073",T,"Travessa Camarão","travessa","L/4",-98,90,90,"8",5),
  cr("tp-jcam-06","typ-tp-jcam","ITP-502",T,"Baguete V","baguete_v","H",-185,90,90,"6",6),
  cr("tp-jcam-07","typ-tp-jcam","ITP-502",T,"Baguete H","baguete_h","L/4",-115,90,90,"6",7),

  // T11: Janela Pivotante Fachada Top
  cr("tp-jpiv-01","typ-tp-jpiv","TP-010",T,"Marco Superior","marco_sup","L",-10,90,90,"1",1),
  cr("tp-jpiv-02","typ-tp-jpiv","TP-010",T,"Marco Inferior","marco_inf","L",-10,90,90,"1",2),
  cr("tp-jpiv-03","typ-tp-jpiv","TP-014",T,"Marco Lateral","marco_lat","H",-78,90,90,"2",3),
  cr("tp-jpiv-04","typ-tp-jpiv","TP-095",T,"Montante Pivotante","montante","H",-168,90,90,"2",4),
  cr("tp-jpiv-05","typ-tp-jpiv","TP-096",T,"Travessa Pivotante","travessa","L",-185,90,90,"2",5),
  cr("tp-jpiv-06","typ-tp-jpiv","ITP-502",T,"Baguete V","baguete_v","H",-190,90,90,"2",6),
  cr("tp-jpiv-07","typ-tp-jpiv","ITP-502",T,"Baguete H","baguete_h","L",-200,90,90,"2",7),

  // T12: Janela Giro-Tomba Fachada Top
  cr("tp-jgiro-01","typ-tp-jgiro","TP-010",T,"Marco Superior","marco_sup","L",-10,90,90,"1",1),
  cr("tp-jgiro-02","typ-tp-jgiro","TP-010",T,"Marco Inferior","marco_inf","L",-10,90,90,"1",2),
  cr("tp-jgiro-03","typ-tp-jgiro","TP-014",T,"Marco Lateral","marco_lat","H",-78,90,90,"2",3),
  cr("tp-jgiro-04","typ-tp-jgiro","TP-111",T,"Montante Folha","montante","H",-168,45,45,"2",4),
  cr("tp-jgiro-05","typ-tp-jgiro","TP-111",T,"Travessa Sup Folha","travessa_sup","L",-185,45,45,"1",5),
  cr("tp-jgiro-06","typ-tp-jgiro","TP-111",T,"Travessa Inf Folha","travessa_inf","L",-185,45,45,"1",6),
  cr("tp-jgiro-07","typ-tp-jgiro","ITP-502",T,"Baguete V","baguete_v","H",-190,90,90,"2",7),
  cr("tp-jgiro-08","typ-tp-jgiro","ITP-502",T,"Baguete H","baguete_h","L",-200,90,90,"2",8),

  // ===== PELE DE VIDRO (CURTAIN WALL) =====

  // CW1: Pele de Vidro 1 Módulo — 2 montantes + 2 travessas + 4 pressões
  cr("tp-cw1-01","typ-tp-cw1","TP-601",T,"Montante Estrutural Esq","montante_esq","H",-20,90,90,"1",1),
  cr("tp-cw1-02","typ-tp-cw1","TP-601",T,"Montante Estrutural Dir","montante_dir","H",-20,90,90,"1",2),
  cr("tp-cw1-03","typ-tp-cw1","TP-602",T,"Travessa Superior","travessa_sup","L",-40,90,90,"1",3),
  cr("tp-cw1-04","typ-tp-cw1","TP-602",T,"Travessa Inferior","travessa_inf","L",-40,90,90,"1",4),
  cr("tp-cw1-05","typ-tp-cw1","TP-604",T,"Pressão Vidro Vertical","pressao_v","H",-30,90,90,"2",5),
  cr("tp-cw1-06","typ-tp-cw1","TP-604",T,"Pressão Vidro Horizontal","pressao_h","L",-50,90,90,"2",6),

  // CW2: Pele de Vidro 2 Módulos
  cr("tp-cw2-01","typ-tp-cw2","TP-601",T,"Montante Estrutural Esq","montante_esq","H",-20,90,90,"1",1),
  cr("tp-cw2-02","typ-tp-cw2","TP-601",T,"Montante Estrutural Dir","montante_dir","H",-20,90,90,"1",2),
  cr("tp-cw2-03","typ-tp-cw2","TP-603",T,"Montante Intermediário","montante_int","H",-20,90,90,"1",3),
  cr("tp-cw2-04","typ-tp-cw2","TP-602",T,"Travessa Superior","travessa_sup","L",-40,90,90,"1",4),
  cr("tp-cw2-05","typ-tp-cw2","TP-602",T,"Travessa Inferior","travessa_inf","L",-40,90,90,"1",5),
  cr("tp-cw2-06","typ-tp-cw2","TP-604",T,"Pressão Vidro Vertical","pressao_v","H",-30,90,90,"4",6),
  cr("tp-cw2-07","typ-tp-cw2","TP-604",T,"Pressão Vidro Horizontal","pressao_h","L/2",-50,90,90,"4",7),

  // CW3: Pele de Vidro 3 Módulos
  cr("tp-cw3-01","typ-tp-cw3","TP-601",T,"Montante Estrutural Esq","montante_esq","H",-20,90,90,"1",1),
  cr("tp-cw3-02","typ-tp-cw3","TP-601",T,"Montante Estrutural Dir","montante_dir","H",-20,90,90,"1",2),
  cr("tp-cw3-03","typ-tp-cw3","TP-603",T,"Montante Intermediário","montante_int","H",-20,90,90,"2",3),
  cr("tp-cw3-04","typ-tp-cw3","TP-602",T,"Travessa Superior","travessa_sup","L",-40,90,90,"1",4),
  cr("tp-cw3-05","typ-tp-cw3","TP-602",T,"Travessa Inferior","travessa_inf","L",-40,90,90,"1",5),
  cr("tp-cw3-06","typ-tp-cw3","TP-604",T,"Pressão Vidro Vertical","pressao_v","H",-30,90,90,"6",6),
  cr("tp-cw3-07","typ-tp-cw3","TP-604",T,"Pressão Vidro Horizontal","pressao_h","L/3",-50,90,90,"6",7),

  // ===== MURO CORTINA =====

  // MC1: Muro Cortina 1 Módulo — montantes contínuos piso-a-piso
  cr("tp-mc1-01","typ-tp-mc1","TP-601",T,"Montante Estrutural Esq","montante_esq","H",-10,90,90,"1",1),
  cr("tp-mc1-02","typ-tp-mc1","TP-601",T,"Montante Estrutural Dir","montante_dir","H",-10,90,90,"1",2),
  cr("tp-mc1-03","typ-tp-mc1","TP-602",T,"Travessa Superior","travessa_sup","L",-30,90,90,"1",3),
  cr("tp-mc1-04","typ-tp-mc1","TP-602",T,"Travessa Inferior","travessa_inf","L",-30,90,90,"1",4),
  cr("tp-mc1-05","typ-tp-mc1","TP-604",T,"Pressão Vidro V","pressao_v","H",-20,90,90,"2",5),
  cr("tp-mc1-06","typ-tp-mc1","TP-604",T,"Pressão Vidro H","pressao_h","L",-40,90,90,"2",6),

  // MC2: Muro Cortina 2 Módulos
  cr("tp-mc2-01","typ-tp-mc2","TP-601",T,"Montante Estrutural Esq","montante_esq","H",-10,90,90,"1",1),
  cr("tp-mc2-02","typ-tp-mc2","TP-601",T,"Montante Estrutural Dir","montante_dir","H",-10,90,90,"1",2),
  cr("tp-mc2-03","typ-tp-mc2","TP-603",T,"Montante Central Estrutural","montante_central","H",-10,90,90,"1",3),
  cr("tp-mc2-04","typ-tp-mc2","TP-602",T,"Travessa Superior","travessa_sup","L",-30,90,90,"1",4),
  cr("tp-mc2-05","typ-tp-mc2","TP-602",T,"Travessa Inferior","travessa_inf","L",-30,90,90,"1",5),
  cr("tp-mc2-06","typ-tp-mc2","TP-604",T,"Pressão Vidro V","pressao_v","H",-20,90,90,"4",6),
  cr("tp-mc2-07","typ-tp-mc2","TP-604",T,"Pressão Vidro H","pressao_h","L/2",-40,90,90,"4",7),

  // MC2T: Muro Cortina 2 Módulos c/ Travessa Intermediária (4 panos de vidro)
  cr("tp-mc2t-01","typ-tp-mc2t","TP-601",T,"Montante Estrutural Esq","montante_esq","H",-10,90,90,"1",1),
  cr("tp-mc2t-02","typ-tp-mc2t","TP-601",T,"Montante Estrutural Dir","montante_dir","H",-10,90,90,"1",2),
  cr("tp-mc2t-03","typ-tp-mc2t","TP-603",T,"Montante Central Estrutural","montante_central","H",-10,90,90,"1",3),
  cr("tp-mc2t-04","typ-tp-mc2t","TP-602",T,"Travessa Superior","travessa_sup","L",-30,90,90,"1",4),
  cr("tp-mc2t-05","typ-tp-mc2t","TP-602",T,"Travessa Inferior","travessa_inf","L",-30,90,90,"1",5),
  cr("tp-mc2t-06","typ-tp-mc2t","TP-605",T,"Travessa Intermediária","travessa_int","L",-30,90,90,"1",6),
  cr("tp-mc2t-07","typ-tp-mc2t","TP-604",T,"Pressão Vidro V","pressao_v","H/2",-20,90,90,"8",7),
  cr("tp-mc2t-08","typ-tp-mc2t","TP-604",T,"Pressão Vidro H","pressao_h","L/2",-40,90,90,"8",8),
];



// ============================================
// DECAMP LINHA 45 — 18 TIPOLOGIAS
// Perfis reais do catálogo Decamp 2026
// Constantes ajustadas para bitola 45mm
// ============================================
const DC = "line-decamp45";

const decampL45CutRules: CutRule[] = [
  // T1: Janela Correr 2F
  cr("dc-jc2f-01","typ-dc-jc2f","PF-45.018",DC,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("dc-jc2f-02","typ-dc-jc2f","PF-45.024",DC,"Marco Inferior (Trilho)","marco_inf","L",-8,90,90,"1",2),
  cr("dc-jc2f-03","typ-dc-jc2f","PF-45.044",DC,"Marco Lateral","marco_lat","H",-65,90,90,"2",3),
  cr("dc-jc2f-04","typ-dc-jc2f","TMG-002",DC,"Montante Folha","montante","H",-140,90,90,"4",4),
  cr("dc-jc2f-05","typ-dc-jc2f","TMG-006",DC,"Travessa Superior Folha","travessa_sup","L/2",-85,90,90,"2",5),
  cr("dc-jc2f-06","typ-dc-jc2f","TMG-006",DC,"Travessa Inferior Folha","travessa_inf","L/2",-85,90,90,"2",6),
  cr("dc-jc2f-07","typ-dc-jc2f","PF-45.017",DC,"Baguete Vertical","baguete_v","H",-152,90,90,"4",7),
  cr("dc-jc2f-08","typ-dc-jc2f","PF-45.017",DC,"Baguete Horizontal","baguete_h","L/2",-97,90,90,"4",8),

  // T2: Janela Correr 3F
  cr("dc-jc3f-01","typ-dc-jc3f","PF-45.018",DC,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("dc-jc3f-02","typ-dc-jc3f","PF-45.024",DC,"Marco Inferior (Trilho)","marco_inf","L",-8,90,90,"1",2),
  cr("dc-jc3f-03","typ-dc-jc3f","PF-45.043",DC,"Marco Lateral 3F","marco_lat","H",-65,90,90,"2",3),
  cr("dc-jc3f-04","typ-dc-jc3f","TMG-002",DC,"Montante Folha","montante","H",-140,90,90,"6",4),
  cr("dc-jc3f-05","typ-dc-jc3f","TMG-006",DC,"Travessa Superior Folha","travessa_sup","L/3",-85,90,90,"3",5),
  cr("dc-jc3f-06","typ-dc-jc3f","TMG-006",DC,"Travessa Inferior Folha","travessa_inf","L/3",-85,90,90,"3",6),
  cr("dc-jc3f-07","typ-dc-jc3f","PF-45.017",DC,"Baguete Vertical","baguete_v","H",-152,90,90,"6",7),
  cr("dc-jc3f-08","typ-dc-jc3f","PF-45.017",DC,"Baguete Horizontal","baguete_h","L/3",-97,90,90,"6",8),

  // T3: Janela Correr 4F
  cr("dc-jc4f-01","typ-dc-jc4f","PF-45.018",DC,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("dc-jc4f-02","typ-dc-jc4f","PF-45.024",DC,"Marco Inferior (Trilho)","marco_inf","L",-8,90,90,"1",2),
  cr("dc-jc4f-03","typ-dc-jc4f","PF-45.044",DC,"Marco Lateral","marco_lat","H",-65,90,90,"2",3),
  cr("dc-jc4f-04","typ-dc-jc4f","TMG-002",DC,"Montante Folha","montante","H",-140,90,90,"8",4),
  cr("dc-jc4f-05","typ-dc-jc4f","TMG-006",DC,"Travessa Superior Folha","travessa_sup","L/4",-85,90,90,"4",5),
  cr("dc-jc4f-06","typ-dc-jc4f","TMG-006",DC,"Travessa Inferior Folha","travessa_inf","L/4",-85,90,90,"4",6),
  cr("dc-jc4f-07","typ-dc-jc4f","PF-45.017",DC,"Baguete Vertical","baguete_v","H",-152,90,90,"8",7),
  cr("dc-jc4f-08","typ-dc-jc4f","PF-45.017",DC,"Baguete Horizontal","baguete_h","L/4",-97,90,90,"8",8),

  // T4: Janela Correr 6F
  cr("dc-jc6f-01","typ-dc-jc6f","PF-45.018",DC,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("dc-jc6f-02","typ-dc-jc6f","PF-45.024",DC,"Marco Inferior (Trilho)","marco_inf","L",-8,90,90,"1",2),
  cr("dc-jc6f-03","typ-dc-jc6f","PF-45.043",DC,"Marco Lateral","marco_lat","H",-65,90,90,"2",3),
  cr("dc-jc6f-04","typ-dc-jc6f","TMG-002",DC,"Montante Folha","montante","H",-140,90,90,"12",4),
  cr("dc-jc6f-05","typ-dc-jc6f","TMG-006",DC,"Travessa Folha","travessa","L/6",-85,90,90,"12",5),
  cr("dc-jc6f-06","typ-dc-jc6f","PF-45.017",DC,"Baguete V","baguete_v","H",-152,90,90,"12",6),
  cr("dc-jc6f-07","typ-dc-jc6f","PF-45.017",DC,"Baguete H","baguete_h","L/6",-97,90,90,"12",7),

  // T5: Maxim-Ar 1F
  cr("dc-jma1-01","typ-dc-jma1","PF-45.018",DC,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("dc-jma1-02","typ-dc-jma1","PF-45.018",DC,"Marco Inferior","marco_inf","L",-8,90,90,"1",2),
  cr("dc-jma1-03","typ-dc-jma1","PF-45.044",DC,"Marco Lateral","marco_lat","H",-65,90,90,"2",3),
  cr("dc-jma1-04","typ-dc-jma1","TMG-018",DC,"Montante Maxim-Ar","montante","H",-140,90,90,"2",4),
  cr("dc-jma1-05","typ-dc-jma1","TMG-050",DC,"Travessa Superior","travessa_sup","L",-155,45,45,"1",5),
  cr("dc-jma1-06","typ-dc-jma1","TMG-050",DC,"Travessa Inferior","travessa_inf","L",-155,45,45,"1",6),
  cr("dc-jma1-07","typ-dc-jma1","PF-45.017",DC,"Baguete V","baguete_v","H",-160,90,90,"2",7),
  cr("dc-jma1-08","typ-dc-jma1","PF-45.017",DC,"Baguete H","baguete_h","L",-167,90,90,"2",8),

  // T6: Maxim-Ar 2F
  cr("dc-jma2-01","typ-dc-jma2","PF-45.018",DC,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("dc-jma2-02","typ-dc-jma2","PF-45.018",DC,"Marco Inferior","marco_inf","L",-8,90,90,"1",2),
  cr("dc-jma2-03","typ-dc-jma2","PF-45.044",DC,"Marco Lateral","marco_lat","H",-65,90,90,"2",3),
  cr("dc-jma2-04","typ-dc-jma2","TMG-007",DC,"Montante Central","montante_central","H",-65,90,90,"1",4),
  cr("dc-jma2-05","typ-dc-jma2","TMG-018",DC,"Montante Folha","montante","H",-140,90,90,"4",5),
  cr("dc-jma2-06","typ-dc-jma2","TMG-050",DC,"Travessa Sup Folha","travessa_sup","L/2",-155,45,45,"2",6),
  cr("dc-jma2-07","typ-dc-jma2","TMG-050",DC,"Travessa Inf Folha","travessa_inf","L/2",-155,45,45,"2",7),
  cr("dc-jma2-08","typ-dc-jma2","PF-45.017",DC,"Baguete V","baguete_v","H",-160,90,90,"4",8),
  cr("dc-jma2-09","typ-dc-jma2","PF-45.017",DC,"Baguete H","baguete_h","L/2",-167,90,90,"4",9),

  // T7: Janela Camarão
  cr("dc-jcam-01","typ-dc-jcam","PF-45.018",DC,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("dc-jcam-02","typ-dc-jcam","PF-45.024",DC,"Marco Inferior","marco_inf","L",-8,90,90,"1",2),
  cr("dc-jcam-03","typ-dc-jcam","PF-45.044",DC,"Marco Lateral","marco_lat","H",-65,90,90,"2",3),
  cr("dc-jcam-04","typ-dc-jcam","TMG-020",DC,"Montante Camarão","montante","H",-140,90,90,"6",4),
  cr("dc-jcam-05","typ-dc-jcam","TMG-043",DC,"Travessa Camarão","travessa","L/4",-85,90,90,"8",5),
  cr("dc-jcam-06","typ-dc-jcam","PF-45.017",DC,"Baguete V","baguete_v","H",-152,90,90,"6",6),
  cr("dc-jcam-07","typ-dc-jcam","PF-45.017",DC,"Baguete H","baguete_h","L/4",-97,90,90,"6",7),

  // T8: Porta Correr 2F
  cr("dc-pc2f-01","typ-dc-pc2f","PF-45.018",DC,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("dc-pc2f-02","typ-dc-pc2f","PF-45.024",DC,"Marco Inferior (Trilho)","marco_inf","L",-8,90,90,"1",2),
  cr("dc-pc2f-03","typ-dc-pc2f","PF-45.044",DC,"Marco Lateral","marco_lat","H",-45,90,90,"2",3),
  cr("dc-pc2f-04","typ-dc-pc2f","TMG-044",DC,"Montante Folha Porta","montante","H",-120,90,90,"4",4),
  cr("dc-pc2f-05","typ-dc-pc2f","TMG-006",DC,"Travessa Superior Folha","travessa_sup","L/2",-85,90,90,"2",5),
  cr("dc-pc2f-06","typ-dc-pc2f","TMG-006",DC,"Travessa Inferior Folha","travessa_inf","L/2",-85,90,90,"2",6),
  cr("dc-pc2f-07","typ-dc-pc2f","PF-45.017",DC,"Baguete V","baguete_v","H",-132,90,90,"4",7),
  cr("dc-pc2f-08","typ-dc-pc2f","PF-45.017",DC,"Baguete H","baguete_h","L/2",-97,90,90,"4",8),

  // T9: Porta Correr 3F
  cr("dc-pc3f-01","typ-dc-pc3f","PF-45.018",DC,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("dc-pc3f-02","typ-dc-pc3f","PF-45.024",DC,"Marco Inferior (Trilho)","marco_inf","L",-8,90,90,"1",2),
  cr("dc-pc3f-03","typ-dc-pc3f","PF-45.043",DC,"Marco Lateral 3F","marco_lat","H",-45,90,90,"2",3),
  cr("dc-pc3f-04","typ-dc-pc3f","TMG-044",DC,"Montante Folha Porta","montante","H",-120,90,90,"6",4),
  cr("dc-pc3f-05","typ-dc-pc3f","TMG-006",DC,"Travessa Sup Folha","travessa_sup","L/3",-85,90,90,"3",5),
  cr("dc-pc3f-06","typ-dc-pc3f","TMG-006",DC,"Travessa Inf Folha","travessa_inf","L/3",-85,90,90,"3",6),
  cr("dc-pc3f-07","typ-dc-pc3f","PF-45.017",DC,"Baguete V","baguete_v","H",-132,90,90,"6",7),
  cr("dc-pc3f-08","typ-dc-pc3f","PF-45.017",DC,"Baguete H","baguete_h","L/3",-97,90,90,"6",8),

  // T10: Porta Correr 4F
  cr("dc-pc4f-01","typ-dc-pc4f","PF-45.018",DC,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("dc-pc4f-02","typ-dc-pc4f","PF-45.024",DC,"Marco Inferior (Trilho)","marco_inf","L",-8,90,90,"1",2),
  cr("dc-pc4f-03","typ-dc-pc4f","PF-45.044",DC,"Marco Lateral","marco_lat","H",-45,90,90,"2",3),
  cr("dc-pc4f-04","typ-dc-pc4f","TMG-044",DC,"Montante Folha Porta","montante","H",-120,90,90,"8",4),
  cr("dc-pc4f-05","typ-dc-pc4f","TMG-006",DC,"Travessa Sup Folha","travessa_sup","L/4",-85,90,90,"4",5),
  cr("dc-pc4f-06","typ-dc-pc4f","TMG-006",DC,"Travessa Inf Folha","travessa_inf","L/4",-85,90,90,"4",6),
  cr("dc-pc4f-07","typ-dc-pc4f","PF-45.017",DC,"Baguete V","baguete_v","H",-132,90,90,"8",7),
  cr("dc-pc4f-08","typ-dc-pc4f","PF-45.017",DC,"Baguete H","baguete_h","L/4",-97,90,90,"8",8),

  // T11: Porta Giro 1F
  cr("dc-pg1f-01","typ-dc-pg1f","PR-001",DC,"Marco Superior","marco_sup","L",-10,90,90,"1",1),
  cr("dc-pg1f-02","typ-dc-pg1f","PR-001",DC,"Marco Lateral","marco_lat","H",-42,90,90,"2",2),
  cr("dc-pg1f-03","typ-dc-pg1f","TMG-044",DC,"Montante Folha","montante","H",-118,45,45,"2",3),
  cr("dc-pg1f-04","typ-dc-pg1f","TMG-051",DC,"Travessa Superior Folha","travessa_sup","L",-125,45,45,"1",4),
  cr("dc-pg1f-05","typ-dc-pg1f","TMG-051",DC,"Travessa Inferior Folha","travessa_inf","L",-125,45,45,"1",5),
  cr("dc-pg1f-06","typ-dc-pg1f","PF-45.017",DC,"Baguete V","baguete_v","H",-132,90,90,"2",6),
  cr("dc-pg1f-07","typ-dc-pg1f","PF-45.017",DC,"Baguete H","baguete_h","L",-138,90,90,"2",7),

  // T12: Porta Giro 2F
  cr("dc-pg2f-01","typ-dc-pg2f","PR-001",DC,"Marco Superior","marco_sup","L",-10,90,90,"1",1),
  cr("dc-pg2f-02","typ-dc-pg2f","PR-001",DC,"Marco Lateral","marco_lat","H",-42,90,90,"2",2),
  cr("dc-pg2f-03","typ-dc-pg2f","TMG-044",DC,"Montante Folha","montante","H",-118,45,45,"4",3),
  cr("dc-pg2f-04","typ-dc-pg2f","TMG-051",DC,"Travessa Sup Folha","travessa_sup","L/2",-125,45,45,"2",4),
  cr("dc-pg2f-05","typ-dc-pg2f","TMG-051",DC,"Travessa Inf Folha","travessa_inf","L/2",-125,45,45,"2",5),
  cr("dc-pg2f-06","typ-dc-pg2f","PF-45.017",DC,"Baguete V","baguete_v","H",-132,90,90,"4",6),
  cr("dc-pg2f-07","typ-dc-pg2f","PF-45.017",DC,"Baguete H","baguete_h","L/2",-138,90,90,"4",7),

  // T13: Janela Correr 2F c/ Veneziana
  cr("dc-jc2fv-01","typ-dc-jc2fv","PF-45.018",DC,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("dc-jc2fv-02","typ-dc-jc2fv","PF-45.024",DC,"Marco Inferior (Trilho)","marco_inf","L",-8,90,90,"1",2),
  cr("dc-jc2fv-03","typ-dc-jc2fv","PF-45.044",DC,"Marco Lateral","marco_lat","H",-65,90,90,"2",3),
  cr("dc-jc2fv-04","typ-dc-jc2fv","TMG-002",DC,"Montante Folha Vidro","montante","H",-140,90,90,"4",4),
  cr("dc-jc2fv-05","typ-dc-jc2fv","TMG-006",DC,"Travessa Folha Vidro","travessa","L/2",-85,90,90,"4",5),
  cr("dc-jc2fv-06","typ-dc-jc2fv","TMS-003",DC,"Montante Folha Veneziana","montante_ven","H",-140,90,90,"4",6),
  cr("dc-jc2fv-07","typ-dc-jc2fv","TMG-068",DC,"Travessa Folha Veneziana","travessa_ven","L/2",-85,90,90,"4",7),
  cr("dc-jc2fv-08","typ-dc-jc2fv","TMS-004",DC,"Palheta Veneziana","palheta","L/2",-92,90,90,"12",8),
  cr("dc-jc2fv-09","typ-dc-jc2fv","PF-45.017",DC,"Baguete V","baguete_v","H",-152,90,90,"4",9),
  cr("dc-jc2fv-10","typ-dc-jc2fv","PF-45.017",DC,"Baguete H","baguete_h","L/2",-97,90,90,"4",10),

  // T14: Janela Correr 4F c/ Veneziana
  cr("dc-jc4fv-01","typ-dc-jc4fv","PF-45.018",DC,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("dc-jc4fv-02","typ-dc-jc4fv","PF-45.024",DC,"Marco Inferior (Trilho)","marco_inf","L",-8,90,90,"1",2),
  cr("dc-jc4fv-03","typ-dc-jc4fv","PF-45.044",DC,"Marco Lateral","marco_lat","H",-65,90,90,"2",3),
  cr("dc-jc4fv-04","typ-dc-jc4fv","TMG-002",DC,"Montante Folha Vidro","montante","H",-140,90,90,"8",4),
  cr("dc-jc4fv-05","typ-dc-jc4fv","TMG-006",DC,"Travessa Folha Vidro","travessa","L/4",-85,90,90,"8",5),
  cr("dc-jc4fv-06","typ-dc-jc4fv","TMS-003",DC,"Montante Folha Veneziana","montante_ven","H",-140,90,90,"8",6),
  cr("dc-jc4fv-07","typ-dc-jc4fv","TMG-068",DC,"Travessa Folha Veneziana","travessa_ven","L/4",-85,90,90,"8",7),
  cr("dc-jc4fv-08","typ-dc-jc4fv","TMS-004",DC,"Palheta Veneziana","palheta","L/4",-92,90,90,"24",8),
  cr("dc-jc4fv-09","typ-dc-jc4fv","PF-45.017",DC,"Baguete V","baguete_v","H",-152,90,90,"8",9),
  cr("dc-jc4fv-10","typ-dc-jc4fv","PF-45.017",DC,"Baguete H","baguete_h","L/4",-97,90,90,"8",10),

  // T15: Basculante 1F
  cr("dc-jbas1-01","typ-dc-jbas1","PF-45.018",DC,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("dc-jbas1-02","typ-dc-jbas1","PF-45.018",DC,"Marco Inferior","marco_inf","L",-8,90,90,"1",2),
  cr("dc-jbas1-03","typ-dc-jbas1","PF-45.044",DC,"Marco Lateral","marco_lat","H",-65,90,90,"2",3),
  cr("dc-jbas1-04","typ-dc-jbas1","TMG-028",DC,"Montante Folha","montante","H",-140,90,90,"2",4),
  cr("dc-jbas1-05","typ-dc-jbas1","TMG-050",DC,"Travessa Folha","travessa","L",-155,90,90,"2",5),
  cr("dc-jbas1-06","typ-dc-jbas1","PF-45.017",DC,"Baguete V","baguete_v","H",-152,90,90,"2",6),
  cr("dc-jbas1-07","typ-dc-jbas1","PF-45.017",DC,"Baguete H","baguete_h","L",-167,90,90,"2",7),

  // T16: Vitrô Fixo
  cr("dc-vfix-01","typ-dc-vfix","PF-45.018",DC,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("dc-vfix-02","typ-dc-vfix","PF-45.018",DC,"Marco Inferior","marco_inf","L",-8,90,90,"1",2),
  cr("dc-vfix-03","typ-dc-vfix","PF-45.044",DC,"Marco Lateral","marco_lat","H",-65,90,90,"2",3),
  cr("dc-vfix-04","typ-dc-vfix","PF-45.017",DC,"Baguete V","baguete_v","H",-77,90,90,"2",4),
  cr("dc-vfix-05","typ-dc-vfix","PF-45.017",DC,"Baguete H","baguete_h","L",-20,90,90,"2",5),

  // T17: Janela Pivotante
  cr("dc-jpiv-01","typ-dc-jpiv","PF-45.018",DC,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("dc-jpiv-02","typ-dc-jpiv","PF-45.018",DC,"Marco Inferior","marco_inf","L",-8,90,90,"1",2),
  cr("dc-jpiv-03","typ-dc-jpiv","PF-45.044",DC,"Marco Lateral","marco_lat","H",-65,90,90,"2",3),
  cr("dc-jpiv-04","typ-dc-jpiv","TMG-018",DC,"Montante Pivotante","montante","H",-140,90,90,"2",4),
  cr("dc-jpiv-05","typ-dc-jpiv","TMG-072",DC,"Travessa Pivotante","travessa","L",-155,45,45,"2",5),
  cr("dc-jpiv-06","typ-dc-jpiv","PF-45.017",DC,"Baguete V","baguete_v","H",-160,90,90,"2",6),
  cr("dc-jpiv-07","typ-dc-jpiv","PF-45.017",DC,"Baguete H","baguete_h","L",-167,90,90,"2",7),

  // T18: Porta Balcão 2F (Vidro+Veneziana)
  cr("dc-pbal-01","typ-dc-pbal","PF-45.018",DC,"Marco Superior","marco_sup","L",-8,90,90,"1",1),
  cr("dc-pbal-02","typ-dc-pbal","PF-45.024",DC,"Marco Inferior (Trilho)","marco_inf","L",-8,90,90,"1",2),
  cr("dc-pbal-03","typ-dc-pbal","PF-45.044",DC,"Marco Lateral","marco_lat","H",-45,90,90,"2",3),
  cr("dc-pbal-04","typ-dc-pbal","TMG-044",DC,"Montante Folha Vidro","montante","H",-120,90,90,"4",4),
  cr("dc-pbal-05","typ-dc-pbal","TMG-006",DC,"Travessa Folha Vidro","travessa","L/2",-85,90,90,"4",5),
  cr("dc-pbal-06","typ-dc-pbal","TMS-003",DC,"Montante Folha Veneziana","montante_ven","H",-120,90,90,"4",6),
  cr("dc-pbal-07","typ-dc-pbal","TMG-068",DC,"Travessa Folha Veneziana","travessa_ven","L/2",-85,90,90,"4",7),
  cr("dc-pbal-08","typ-dc-pbal","TMS-004",DC,"Palheta Veneziana","palheta","L/2",-92,90,90,"12",8),
  cr("dc-pbal-09","typ-dc-pbal","PF-45.017",DC,"Baguete V","baguete_v","H",-132,90,90,"4",9),
  cr("dc-pbal-10","typ-dc-pbal","PF-45.017",DC,"Baguete H","baguete_h","L/2",-97,90,90,"4",10),
];

import { pratic20CutRules, pratic32CutRules } from "./cutRulesPratic";
import { perfettaCutRules } from "./cutRulesPerfetta";

export const cutRules: CutRule[] = [
  ...supremaCutRules,
  ...goldCutRules,
  ...topCutRules,
  ...decampL45CutRules,
  ...pratic20CutRules,
  ...pratic32CutRules,
  ...perfettaCutRules,
];
