import type { CutRule } from "@/types/calculation";
import { profiles } from "@/data/catalog/profiles";
import { createCutRule } from "./helpers";

const L = "line-suprema";

// ============================================
// SUPREMA - 15 TIPOLOGIAS
// ============================================

const supremaCutRules: CutRule[] = [
  // T1: Janela Correr 2F
  createCutRule("su-jc2f-01","typ-su-jc2f","SU-010",L,"Marco Superior","marco_sup","L",-6,90,90,"1",1,profiles),
  createCutRule("su-jc2f-02","typ-su-jc2f","SU-012",L,"Marco Inferior (Trilho)","marco_inf","L",-6,90,90,"1",2,profiles),
  createCutRule("su-jc2f-03","typ-su-jc2f","SU-014",L,"Marco Lateral","marco_lat","H",-57,90,90,"2",3,profiles),
  createCutRule("su-jc2f-04","typ-su-jc2f","SU-039",L,"Montante Folha","montante","H",-127,90,90,"4",4,profiles),
  createCutRule("su-jc2f-05","typ-su-jc2f","SU-053",L,"Travessa Superior Folha","travessa_sup","L/2",-74,90,90,"2",5,profiles),
  createCutRule("su-jc2f-06","typ-su-jc2f","SU-053",L,"Travessa Inferior Folha","travessa_inf","L/2",-74,90,90,"2",6,profiles),
  createCutRule("su-jc2f-07","typ-su-jc2f","ISU-502",L,"Baguete Vertical","baguete_v","H",-139,90,90,"4",7,profiles),
  createCutRule("su-jc2f-08","typ-su-jc2f","ISU-502",L,"Baguete Horizontal","baguete_h","L/2",-86,90,90,"4",8,profiles),
  createCutRule("su-jc2f-09","typ-su-jc2f","CM-200",L,"Contramarco Lateral","contramarco_lat","H",-3,90,90,"2",9,profiles),
  createCutRule("su-jc2f-10","typ-su-jc2f","CM-200",L,"Contramarco Sup/Inf","contramarco_h","L",-3,90,90,"2",10,profiles),

  // T2: Janela Correr 4F
  createCutRule("su-jc4f-01","typ-su-jc4f","SU-010",L,"Marco Superior","marco_sup","L",-6,90,90,"1",1,profiles),
  createCutRule("su-jc4f-02","typ-su-jc4f","SU-012",L,"Marco Inferior (Trilho)","marco_inf","L",-6,90,90,"1",2,profiles),
  createCutRule("su-jc4f-03","typ-su-jc4f","SU-014",L,"Marco Lateral","marco_lat","H",-57,90,90,"2",3,profiles),
  createCutRule("su-jc4f-04","typ-su-jc4f","SU-039",L,"Montante Folha","montante","H",-127,90,90,"8",4,profiles),
  createCutRule("su-jc4f-05","typ-su-jc4f","SU-053",L,"Travessa Superior Folha","travessa_sup","L/4",-74,90,90,"4",5,profiles),
  createCutRule("su-jc4f-06","typ-su-jc4f","SU-053",L,"Travessa Inferior Folha","travessa_inf","L/4",-74,90,90,"4",6,profiles),
  createCutRule("su-jc4f-07","typ-su-jc4f","ISU-502",L,"Baguete Vertical","baguete_v","H",-139,90,90,"8",7,profiles),
  createCutRule("su-jc4f-08","typ-su-jc4f","ISU-502",L,"Baguete Horizontal","baguete_h","L/4",-86,90,90,"8",8,profiles),
  createCutRule("su-jc4f-09","typ-su-jc4f","CM-200",L,"Contramarco Lateral","contramarco_lat","H",-3,90,90,"2",9,profiles),
  createCutRule("su-jc4f-10","typ-su-jc4f","CM-200",L,"Contramarco Sup/Inf","contramarco_h","L",-3,90,90,"2",10,profiles),

  // T3: Janela Correr 3F
  createCutRule("su-jc3f-01","typ-su-jc3f","SU-010",L,"Marco Superior","marco_sup","L",-6,90,90,"1",1,profiles),
  createCutRule("su-jc3f-02","typ-su-jc3f","SU-121",L,"Marco Inferior (Trilho 3F)","marco_inf","L",-6,90,90,"1",2,profiles),
  createCutRule("su-jc3f-03","typ-su-jc3f","SU-013",L,"Marco Lateral 3F","marco_lat","H",-57,90,90,"2",3,profiles),
  createCutRule("su-jc3f-04","typ-su-jc3f","SU-039",L,"Montante Folha","montante","H",-127,90,90,"6",4,profiles),
  createCutRule("su-jc3f-05","typ-su-jc3f","SU-053",L,"Travessa Superior Folha","travessa_sup","L/3",-74,90,90,"3",5,profiles),
  createCutRule("su-jc3f-06","typ-su-jc3f","SU-053",L,"Travessa Inferior Folha","travessa_inf","L/3",-74,90,90,"3",6,profiles),
  createCutRule("su-jc3f-07","typ-su-jc3f","ISU-502",L,"Baguete Vertical","baguete_v","H",-139,90,90,"6",7,profiles),
  createCutRule("su-jc3f-08","typ-su-jc3f","ISU-502",L,"Baguete Horizontal","baguete_h","L/3",-86,90,90,"6",8,profiles),

  // T4: Janela Correr 4F c/ Peitoril Fixo
  createCutRule("su-jc4fp-01","typ-su-jc4fp","SU-010",L,"Marco Superior","marco_sup","L",-6,90,90,"1",1,profiles),
  createCutRule("su-jc4fp-02","typ-su-jc4fp","SU-012",L,"Marco Inferior (Trilho)","marco_inf","L",-6,90,90,"1",2,profiles),
  createCutRule("su-jc4fp-03","typ-su-jc4fp","SU-014",L,"Marco Lateral","marco_lat","H",-57,90,90,"2",3,profiles),
  createCutRule("su-jc4fp-04","typ-su-jc4fp","SU-053",L,"Travessa Central (divisor)","travessa_div","L",-70,90,90,"1",4,profiles),
  createCutRule("su-jc4fp-05","typ-su-jc4fp","SU-039",L,"Montante Folha","montante","H",-200,90,90,"8",5,profiles),
  createCutRule("su-jc4fp-06","typ-su-jc4fp","SU-053",L,"Travessa Sup/Inf Folha","travessa","L/4",-74,90,90,"8",6,profiles),
  createCutRule("su-jc4fp-07","typ-su-jc4fp","ISU-502",L,"Baguete V Folha","baguete_v","H",-212,90,90,"8",7,profiles),
  createCutRule("su-jc4fp-08","typ-su-jc4fp","ISU-502",L,"Baguete H Folha","baguete_h","L/4",-86,90,90,"8",8,profiles),
  createCutRule("su-jc4fp-09","typ-su-jc4fp","ISU-502",L,"Baguete V Peitoril","baguete_vp","H",-200,90,90,"2",9,profiles),
  createCutRule("su-jc4fp-10","typ-su-jc4fp","ISU-502",L,"Baguete H Peitoril","baguete_hp","L/2",-86,90,90,"2",10,profiles),

  // T5: Maxim-Ar 1F
  createCutRule("su-jma1-01","typ-su-jma1","SU-010",L,"Marco Superior","marco_sup","L",-6,90,90,"1",1,profiles),
  createCutRule("su-jma1-02","typ-su-jma1","SU-010",L,"Marco Inferior","marco_inf","L",-6,90,90,"1",2,profiles),
  createCutRule("su-jma1-03","typ-su-jma1","SU-014",L,"Marco Lateral","marco_lat","H",-57,90,90,"2",3,profiles),
  createCutRule("su-jma1-04","typ-su-jma1","SU-079",L,"Montante Folha","montante","H",-127,90,90,"2",4,profiles),
  createCutRule("su-jma1-05","typ-su-jma1","SU-080",L,"Travessa Superior Folha","travessa_sup","L",-139,45,45,"1",5,profiles),
  createCutRule("su-jma1-06","typ-su-jma1","SU-080",L,"Travessa Inferior Folha","travessa_inf","L",-139,45,45,"1",6,profiles),
  createCutRule("su-jma1-07","typ-su-jma1","ISU-502",L,"Baguete Vertical","baguete_v","H",-145,90,90,"2",7,profiles),
  createCutRule("su-jma1-08","typ-su-jma1","ISU-502",L,"Baguete Horizontal","baguete_h","L",-151,90,90,"2",8,profiles),

  // T6: Maxim-Ar 2F
  createCutRule("su-jma2-01","typ-su-jma2","SU-010",L,"Marco Superior","marco_sup","L",-6,90,90,"1",1,profiles),
  createCutRule("su-jma2-02","typ-su-jma2","SU-010",L,"Marco Inferior","marco_inf","L",-6,90,90,"1",2,profiles),
  createCutRule("su-jma2-03","typ-su-jma2","SU-014",L,"Marco Lateral","marco_lat","H",-57,90,90,"2",3,profiles),
  createCutRule("su-jma2-04","typ-su-jma2","SU-292",L,"Montante Central (fixo)","montante_central","H",-57,90,90,"1",4,profiles),
  createCutRule("su-jma2-05","typ-su-jma2","SU-079",L,"Montante Folha","montante","H",-127,90,90,"4",5,profiles),
  createCutRule("su-jma2-06","typ-su-jma2","SU-080",L,"Travessa Sup Folha","travessa_sup","L/2",-139,45,45,"2",6,profiles),
  createCutRule("su-jma2-07","typ-su-jma2","SU-080",L,"Travessa Inf Folha","travessa_inf","L/2",-139,45,45,"2",7,profiles),
  createCutRule("su-jma2-08","typ-su-jma2","ISU-502",L,"Baguete V","baguete_v","H",-145,90,90,"4",8,profiles),
  createCutRule("su-jma2-09","typ-su-jma2","ISU-502",L,"Baguete H","baguete_h","L/2",-151,90,90,"4",9,profiles),

  // T7: Janela Camarão
  createCutRule("su-jcam-01","typ-su-jcam","SU-010",L,"Marco Superior","marco_sup","L",-6,90,90,"1",1,profiles),
  createCutRule("su-jcam-02","typ-su-jcam","SU-012",L,"Marco Inferior","marco_inf","L",-6,90,90,"1",2,profiles),
  createCutRule("su-jcam-03","typ-su-jcam","SU-014",L,"Marco Lateral","marco_lat","H",-57,90,90,"2",3,profiles),
  createCutRule("su-jcam-04","typ-su-jcam","SU-072",L,"Montante Camarão","montante","H",-127,90,90,"6",4,profiles),
  createCutRule("su-jcam-05","typ-su-jcam","SU-073",L,"Travessa Camarão","travessa","L/4",-74,90,90,"8",5,profiles),
  createCutRule("su-jcam-06","typ-su-jcam","ISU-502",L,"Baguete V","baguete_v","H",-139,90,90,"6",6,profiles),
  createCutRule("su-jcam-07","typ-su-jcam","ISU-502",L,"Baguete H","baguete_h","L/4",-86,90,90,"6",7,profiles),

  // T8: Porta Correr 2F
  createCutRule("su-pc2f-01","typ-su-pc2f","SU-010",L,"Marco Superior","marco_sup","L",-6,90,90,"1",1,profiles),
  createCutRule("su-pc2f-02","typ-su-pc2f","SU-012",L,"Marco Inferior (Trilho)","marco_inf","L",-6,90,90,"1",2,profiles),
  createCutRule("su-pc2f-03","typ-su-pc2f","SU-014",L,"Marco Lateral","marco_lat","H",-38,90,90,"2",3,profiles),
  createCutRule("su-pc2f-04","typ-su-pc2f","SU-111",L,"Montante Folha Porta","montante","H",-108,90,90,"4",4,profiles),
  createCutRule("su-pc2f-05","typ-su-pc2f","SU-053",L,"Travessa Superior Folha","travessa_sup","L/2",-74,90,90,"2",5,profiles),
  createCutRule("su-pc2f-06","typ-su-pc2f","SU-053",L,"Travessa Inferior Folha","travessa_inf","L/2",-74,90,90,"2",6,profiles),
  createCutRule("su-pc2f-07","typ-su-pc2f","ISU-502",L,"Baguete V","baguete_v","H",-120,90,90,"4",7,profiles),
  createCutRule("su-pc2f-08","typ-su-pc2f","ISU-502",L,"Baguete H","baguete_h","L/2",-86,90,90,"4",8,profiles),

  // T9: Porta Correr 4F
  createCutRule("su-pc4f-01","typ-su-pc4f","SU-010",L,"Marco Superior","marco_sup","L",-6,90,90,"1",1,profiles),
  createCutRule("su-pc4f-02","typ-su-pc4f","SU-012",L,"Marco Inferior (Trilho)","marco_inf","L",-6,90,90,"1",2,profiles),
  createCutRule("su-pc4f-03","typ-su-pc4f","SU-014",L,"Marco Lateral","marco_lat","H",-38,90,90,"2",3,profiles),
  createCutRule("su-pc4f-04","typ-su-pc4f","SU-111",L,"Montante Folha Porta","montante","H",-108,90,90,"8",4,profiles),
  createCutRule("su-pc4f-05","typ-su-pc4f","SU-053",L,"Travessa Sup Folha","travessa_sup","L/4",-74,90,90,"4",5,profiles),
  createCutRule("su-pc4f-06","typ-su-pc4f","SU-053",L,"Travessa Inf Folha","travessa_inf","L/4",-74,90,90,"4",6,profiles),
  createCutRule("su-pc4f-07","typ-su-pc4f","ISU-502",L,"Baguete V","baguete_v","H",-120,90,90,"8",7,profiles),
  createCutRule("su-pc4f-08","typ-su-pc4f","ISU-502",L,"Baguete H","baguete_h","L/4",-86,90,90,"8",8,profiles),

  // T10: Porta Giro 1F
  createCutRule("su-pg1f-01","typ-su-pg1f","SU-089",L,"Marco Superior","marco_sup","L",-8,90,90,"1",1,profiles),
  createCutRule("su-pg1f-02","typ-su-pg1f","SU-089",L,"Marco Lateral","marco_lat","H",-35,90,90,"2",2,profiles),
  createCutRule("su-pg1f-03","typ-su-pg1f","SU-111",L,"Montante Folha","montante","H",-105,45,45,"2",3,profiles),
  createCutRule("su-pg1f-04","typ-su-pg1f","SU-111",L,"Travessa Superior Folha","travessa_sup","L",-110,45,45,"1",4,profiles),
  createCutRule("su-pg1f-05","typ-su-pg1f","SU-111",L,"Travessa Inferior Folha","travessa_inf","L",-110,45,45,"1",5,profiles),
  createCutRule("su-pg1f-06","typ-su-pg1f","SU-279",L,"Cadeirinha","cadeirinha","L",-115,90,90,"1",6,profiles),
  createCutRule("su-pg1f-07","typ-su-pg1f","ISU-502",L,"Baguete V","baguete_v","H",-120,90,90,"2",7,profiles),
  createCutRule("su-pg1f-08","typ-su-pg1f","ISU-502",L,"Baguete H","baguete_h","L",-125,90,90,"2",8,profiles),

  // T11: Porta Giro 2F
  createCutRule("su-pg2f-01","typ-su-pg2f","SU-089",L,"Marco Superior","marco_sup","L",-8,90,90,"1",1,profiles),
  createCutRule("su-pg2f-02","typ-su-pg2f","SU-089",L,"Marco Lateral","marco_lat","H",-35,90,90,"2",2,profiles),
  createCutRule("su-pg2f-03","typ-su-pg2f","SU-111",L,"Montante Folha","montante","H",-105,45,45,"4",3,profiles),
  createCutRule("su-pg2f-04","typ-su-pg2f","SU-111",L,"Travessa Sup Folha","travessa_sup","L/2",-110,45,45,"2",4,profiles),
  createCutRule("su-pg2f-05","typ-su-pg2f","SU-111",L,"Travessa Inf Folha","travessa_inf","L/2",-110,45,45,"2",5,profiles),
  createCutRule("su-pg2f-06","typ-su-pg2f","SU-279",L,"Cadeirinha","cadeirinha","L/2",-115,90,90,"2",6,profiles),
  createCutRule("su-pg2f-07","typ-su-pg2f","ISU-502",L,"Baguete V","baguete_v","H",-120,90,90,"4",7,profiles),
  createCutRule("su-pg2f-08","typ-su-pg2f","ISU-502",L,"Baguete H","baguete_h","L/2",-125,90,90,"4",8,profiles),

  // T12: Janela Correr 2F c/ Veneziana
  createCutRule("su-jc2fv-01","typ-su-jc2fv","SU-010",L,"Marco Superior","marco_sup","L",-6,90,90,"1",1,profiles),
  createCutRule("su-jc2fv-02","typ-su-jc2fv","SU-012",L,"Marco Inferior (Trilho)","marco_inf","L",-6,90,90,"1",2,profiles),
  createCutRule("su-jc2fv-03","typ-su-jc2fv","SU-014",L,"Marco Lateral","marco_lat","H",-57,90,90,"2",3,profiles),
  createCutRule("su-jc2fv-04","typ-su-jc2fv","SU-039",L,"Montante Folha Vidro","montante","H",-127,90,90,"4",4,profiles),
  createCutRule("su-jc2fv-05","typ-su-jc2fv","SU-053",L,"Travessa Folha Vidro","travessa","L/2",-74,90,90,"4",5,profiles),
  createCutRule("su-jc2fv-06","typ-su-jc2fv","SU-068",L,"Montante Folha Veneziana","montante_ven","H",-127,90,90,"4",6,profiles),
  createCutRule("su-jc2fv-07","typ-su-jc2fv","SU-053",L,"Travessa Folha Veneziana","travessa_ven","L/2",-74,90,90,"4",7,profiles),
  createCutRule("su-jc2fv-08","typ-su-jc2fv","PAL",L,"Palheta Veneziana","palheta","L/2",-80,90,90,"12",8,profiles),
  createCutRule("su-jc2fv-09","typ-su-jc2fv","ISU-502",L,"Baguete V","baguete_v","H",-139,90,90,"4",9,profiles),
  createCutRule("su-jc2fv-10","typ-su-jc2fv","ISU-502",L,"Baguete H","baguete_h","L/2",-86,90,90,"4",10,profiles),

  // T13: Janela Correr 2F c/ Bandeira Móvel
  createCutRule("su-jc2fb-01","typ-su-jc2fb","SU-010",L,"Marco Superior","marco_sup","L",-6,90,90,"1",1,profiles),
  createCutRule("su-jc2fb-02","typ-su-jc2fb","SU-012",L,"Marco Inferior","marco_inf","L",-6,90,90,"1",2,profiles),
  createCutRule("su-jc2fb-03","typ-su-jc2fb","SU-014",L,"Marco Lateral","marco_lat","H",-57,90,90,"2",3,profiles),
  createCutRule("su-jc2fb-04","typ-su-jc2fb","SU-053",L,"Travessa Divisória (bandeira)","travessa_div","L",-70,90,90,"1",4,profiles),
  createCutRule("su-jc2fb-05","typ-su-jc2fb","SU-039",L,"Montante Folha Correr","montante","H",-200,90,90,"4",5,profiles),
  createCutRule("su-jc2fb-06","typ-su-jc2fb","SU-053",L,"Travessa Folha Correr","travessa","L/2",-74,90,90,"4",6,profiles),
  createCutRule("su-jc2fb-07","typ-su-jc2fb","SU-079",L,"Montante Bandeira","montante_band","H",-130,90,90,"2",7,profiles),
  createCutRule("su-jc2fb-08","typ-su-jc2fb","SU-080",L,"Travessa Bandeira","travessa_band","L",-139,45,45,"2",8,profiles),

  // T14: Janela Correr 6F
  createCutRule("su-jc6f-01","typ-su-jc6f","SU-010",L,"Marco Superior","marco_sup","L",-6,90,90,"1",1,profiles),
  createCutRule("su-jc6f-02","typ-su-jc6f","SU-121",L,"Marco Inferior (Trilho)","marco_inf","L",-6,90,90,"1",2,profiles),
  createCutRule("su-jc6f-03","typ-su-jc6f","SU-013",L,"Marco Lateral","marco_lat","H",-57,90,90,"2",3,profiles),
  createCutRule("su-jc6f-04","typ-su-jc6f","SU-039",L,"Montante Folha","montante","H",-127,90,90,"12",4,profiles),
  createCutRule("su-jc6f-05","typ-su-jc6f","SU-053",L,"Travessa Folha","travessa","L/6",-74,90,90,"12",5,profiles),
  createCutRule("su-jc6f-06","typ-su-jc6f","ISU-502",L,"Baguete V","baguete_v","H",-139,90,90,"12",6,profiles),
  createCutRule("su-jc6f-07","typ-su-jc6f","ISU-502",L,"Baguete H","baguete_h","L/6",-86,90,90,"12",7,profiles),

  // T15: Porta Correr 3F
  createCutRule("su-pc3f-01","typ-su-pc3f","SU-010",L,"Marco Superior","marco_sup","L",-6,90,90,"1",1,profiles),
  createCutRule("su-pc3f-02","typ-su-pc3f","SU-121",L,"Marco Inferior (Trilho 3F)","marco_inf","L",-6,90,90,"1",2,profiles),
  createCutRule("su-pc3f-03","typ-su-pc3f","SU-013",L,"Marco Lateral 3F","marco_lat","H",-38,90,90,"2",3,profiles),
  createCutRule("su-pc3f-04","typ-su-pc3f","SU-111",L,"Montante Folha Porta","montante","H",-108,90,90,"6",4,profiles),
  createCutRule("su-pc3f-05","typ-su-pc3f","SU-053",L,"Travessa Sup Folha","travessa_sup","L/3",-74,90,90,"3",5,profiles),
  createCutRule("su-pc3f-06","typ-su-pc3f","SU-053",L,"Travessa Inf Folha","travessa_inf","L/3",-74,90,90,"3",6,profiles),
  createCutRule("su-pc3f-07","typ-su-pc3f","ISU-502",L,"Baguete V","baguete_v","H",-120,90,90,"6",7,profiles),
  createCutRule("su-pc3f-08","typ-su-pc3f","ISU-502",L,"Baguete H","baguete_h","L/3",-86,90,90,"6",8,profiles),
];

export { supremaCutRules };
