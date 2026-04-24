import type { CutRule } from "@/types/calculation";
import { profiles } from "@/data/catalog/profiles";
import { createCutRule } from "./helpers";

const G = "line-gold";

// ============================================
// GOLD - 15 TIPOLOGIAS
// ============================================

const goldCutRules: CutRule[] = [
  // T1: Janela Correr 2F Gold
  createCutRule("go-jc2f-01","typ-go-jc2f","GO-010",G,"Marco Superior","marco_sup","L",-8,90,90,"1",1,profiles),
  createCutRule("go-jc2f-02","typ-go-jc2f","GO-012",G,"Marco Inferior (Trilho)","marco_inf","L",-8,90,90,"1",2,profiles),
  createCutRule("go-jc2f-03","typ-go-jc2f","GO-014",G,"Marco Lateral","marco_lat","H",-65,90,90,"2",3,profiles),
  createCutRule("go-jc2f-04","typ-go-jc2f","GO-039",G,"Montante Folha","montante","H",-140,90,90,"4",4,profiles),
  createCutRule("go-jc2f-05","typ-go-jc2f","GO-053",G,"Travessa Superior Folha","travessa_sup","L/2",-82,90,90,"2",5,profiles),
  createCutRule("go-jc2f-06","typ-go-jc2f","GO-053",G,"Travessa Inferior Folha","travessa_inf","L/2",-82,90,90,"2",6,profiles),
  createCutRule("go-jc2f-07","typ-go-jc2f","IGO-502",G,"Baguete Vertical","baguete_v","H",-155,90,90,"4",7,profiles),
  createCutRule("go-jc2f-08","typ-go-jc2f","IGO-502",G,"Baguete Horizontal","baguete_h","L/2",-97,90,90,"4",8,profiles),

  // T2: Janela Correr 4F Gold
  createCutRule("go-jc4f-01","typ-go-jc4f","GO-010",G,"Marco Superior","marco_sup","L",-8,90,90,"1",1,profiles),
  createCutRule("go-jc4f-02","typ-go-jc4f","GO-012",G,"Marco Inferior (Trilho)","marco_inf","L",-8,90,90,"1",2,profiles),
  createCutRule("go-jc4f-03","typ-go-jc4f","GO-014",G,"Marco Lateral","marco_lat","H",-65,90,90,"2",3,profiles),
  createCutRule("go-jc4f-04","typ-go-jc4f","GO-039",G,"Montante Folha","montante","H",-140,90,90,"8",4,profiles),
  createCutRule("go-jc4f-05","typ-go-jc4f","GO-053",G,"Travessa Folha","travessa","L/4",-82,90,90,"8",5,profiles),
  createCutRule("go-jc4f-06","typ-go-jc4f","IGO-502",G,"Baguete V","baguete_v","H",-155,90,90,"8",6,profiles),
  createCutRule("go-jc4f-07","typ-go-jc4f","IGO-502",G,"Baguete H","baguete_h","L/4",-97,90,90,"8",7,profiles),

  // T3: Janela Correr 3F Gold
  createCutRule("go-jc3f-01","typ-go-jc3f","GO-010",G,"Marco Superior","marco_sup","L",-8,90,90,"1",1,profiles),
  createCutRule("go-jc3f-02","typ-go-jc3f","GO-121",G,"Marco Inferior (Trilho 3F)","marco_inf","L",-8,90,90,"1",2,profiles),
  createCutRule("go-jc3f-03","typ-go-jc3f","GO-013",G,"Marco Lateral 3F","marco_lat","H",-65,90,90,"2",3,profiles),
  createCutRule("go-jc3f-04","typ-go-jc3f","GO-039",G,"Montante Folha","montante","H",-140,90,90,"6",4,profiles),
  createCutRule("go-jc3f-05","typ-go-jc3f","GO-053",G,"Travessa Folha","travessa","L/3",-82,90,90,"6",5,profiles),
  createCutRule("go-jc3f-06","typ-go-jc3f","IGO-502",G,"Baguete V","baguete_v","H",-155,90,90,"6",6,profiles),
  createCutRule("go-jc3f-07","typ-go-jc3f","IGO-502",G,"Baguete H","baguete_h","L/3",-97,90,90,"6",7,profiles),

  // T4: Maxim-Ar 1F Gold
  createCutRule("go-jma1-01","typ-go-jma1","GO-010",G,"Marco Superior","marco_sup","L",-8,90,90,"1",1,profiles),
  createCutRule("go-jma1-02","typ-go-jma1","GO-010",G,"Marco Inferior","marco_inf","L",-8,90,90,"1",2,profiles),
  createCutRule("go-jma1-03","typ-go-jma1","GO-014",G,"Marco Lateral","marco_lat","H",-65,90,90,"2",3,profiles),
  createCutRule("go-jma1-04","typ-go-jma1","GO-079",G,"Montante Folha","montante","H",-140,90,90,"2",4,profiles),
  createCutRule("go-jma1-05","typ-go-jma1","GO-080",G,"Travessa Sup Folha","travessa_sup","L",-155,45,45,"1",5,profiles),
  createCutRule("go-jma1-06","typ-go-jma1","GO-080",G,"Travessa Inf Folha","travessa_inf","L",-155,45,45,"1",6,profiles),
  createCutRule("go-jma1-07","typ-go-jma1","IGO-502",G,"Baguete V","baguete_v","H",-160,90,90,"2",7,profiles),
  createCutRule("go-jma1-08","typ-go-jma1","IGO-502",G,"Baguete H","baguete_h","L",-170,90,90,"2",8,profiles),

  // T5: Maxim-Ar 2F Gold
  createCutRule("go-jma2-01","typ-go-jma2","GO-010",G,"Marco Superior","marco_sup","L",-8,90,90,"1",1,profiles),
  createCutRule("go-jma2-02","typ-go-jma2","GO-010",G,"Marco Inferior","marco_inf","L",-8,90,90,"1",2,profiles),
  createCutRule("go-jma2-03","typ-go-jma2","GO-014",G,"Marco Lateral","marco_lat","H",-65,90,90,"2",3,profiles),
  createCutRule("go-jma2-04","typ-go-jma2","GO-292",G,"Montante Central","montante_central","H",-65,90,90,"1",4,profiles),
  createCutRule("go-jma2-05","typ-go-jma2","GO-079",G,"Montante Folha","montante","H",-140,90,90,"4",5,profiles),
  createCutRule("go-jma2-06","typ-go-jma2","GO-080",G,"Travessa Folha","travessa","L/2",-155,45,45,"4",6,profiles),
  createCutRule("go-jma2-07","typ-go-jma2","IGO-502",G,"Baguete V","baguete_v","H",-160,90,90,"4",7,profiles),
  createCutRule("go-jma2-08","typ-go-jma2","IGO-502",G,"Baguete H","baguete_h","L/2",-170,90,90,"4",8,profiles),

  // T6: Porta Correr 2F Gold
  createCutRule("go-pc2f-01","typ-go-pc2f","GO-010",G,"Marco Superior","marco_sup","L",-8,90,90,"1",1,profiles),
  createCutRule("go-pc2f-02","typ-go-pc2f","GO-012",G,"Marco Inferior (Trilho)","marco_inf","L",-8,90,90,"1",2,profiles),
  createCutRule("go-pc2f-03","typ-go-pc2f","GO-014",G,"Marco Lateral","marco_lat","H",-45,90,90,"2",3,profiles),
  createCutRule("go-pc2f-04","typ-go-pc2f","GO-111",G,"Montante Folha Porta","montante","H",-120,90,90,"4",4,profiles),
  createCutRule("go-pc2f-05","typ-go-pc2f","GO-053",G,"Travessa Sup Folha","travessa_sup","L/2",-82,90,90,"2",5,profiles),
  createCutRule("go-pc2f-06","typ-go-pc2f","GO-053",G,"Travessa Inf Folha","travessa_inf","L/2",-82,90,90,"2",6,profiles),
  createCutRule("go-pc2f-07","typ-go-pc2f","IGO-502",G,"Baguete V","baguete_v","H",-135,90,90,"4",7,profiles),
  createCutRule("go-pc2f-08","typ-go-pc2f","IGO-502",G,"Baguete H","baguete_h","L/2",-97,90,90,"4",8,profiles),

  // T7: Porta Correr 4F Gold
  createCutRule("go-pc4f-01","typ-go-pc4f","GO-010",G,"Marco Superior","marco_sup","L",-8,90,90,"1",1,profiles),
  createCutRule("go-pc4f-02","typ-go-pc4f","GO-012",G,"Marco Inferior (Trilho)","marco_inf","L",-8,90,90,"1",2,profiles),
  createCutRule("go-pc4f-03","typ-go-pc4f","GO-014",G,"Marco Lateral","marco_lat","H",-45,90,90,"2",3,profiles),
  createCutRule("go-pc4f-04","typ-go-pc4f","GO-111",G,"Montante Folha Porta","montante","H",-120,90,90,"8",4,profiles),
  createCutRule("go-pc4f-05","typ-go-pc4f","GO-053",G,"Travessa Folha","travessa","L/4",-82,90,90,"8",5,profiles),
  createCutRule("go-pc4f-06","typ-go-pc4f","IGO-502",G,"Baguete V","baguete_v","H",-135,90,90,"8",6,profiles),
  createCutRule("go-pc4f-07","typ-go-pc4f","IGO-502",G,"Baguete H","baguete_h","L/4",-97,90,90,"8",7,profiles),

  // T8: Porta Giro 1F Gold
  createCutRule("go-pg1f-01","typ-go-pg1f","GO-089",G,"Marco Superior","marco_sup","L",-10,90,90,"1",1,profiles),
  createCutRule("go-pg1f-02","typ-go-pg1f","GO-089",G,"Marco Lateral","marco_lat","H",-40,90,90,"2",2,profiles),
  createCutRule("go-pg1f-03","typ-go-pg1f","GO-111",G,"Montante Folha","montante","H",-115,45,45,"2",3,profiles),
  createCutRule("go-pg1f-04","typ-go-pg1f","GO-111",G,"Travessa Sup Folha","travessa_sup","L",-120,45,45,"1",4,profiles),
  createCutRule("go-pg1f-05","typ-go-pg1f","GO-111",G,"Travessa Inf Folha","travessa_inf","L",-120,45,45,"1",5,profiles),
  createCutRule("go-pg1f-06","typ-go-pg1f","IGO-502",G,"Baguete V","baguete_v","H",-135,90,90,"2",6,profiles),
  createCutRule("go-pg1f-07","typ-go-pg1f","IGO-502",G,"Baguete H","baguete_h","L",-140,90,90,"2",7,profiles),

  // T9: Porta Giro 2F Gold
  createCutRule("go-pg2f-01","typ-go-pg2f","GO-089",G,"Marco Superior","marco_sup","L",-10,90,90,"1",1,profiles),
  createCutRule("go-pg2f-02","typ-go-pg2f","GO-089",G,"Marco Lateral","marco_lat","H",-40,90,90,"2",2,profiles),
  createCutRule("go-pg2f-03","typ-go-pg2f","GO-111",G,"Montante Folha","montante","H",-115,45,45,"4",3,profiles),
  createCutRule("go-pg2f-04","typ-go-pg2f","GO-111",G,"Travessa Folha","travessa","L/2",-120,45,45,"4",4,profiles),
  createCutRule("go-pg2f-05","typ-go-pg2f","IGO-502",G,"Baguete V","baguete_v","H",-135,90,90,"4",5,profiles),
  createCutRule("go-pg2f-06","typ-go-pg2f","IGO-502",G,"Baguete H","baguete_h","L/2",-140,90,90,"4",6,profiles),

  // T10: Janela Correr 4F c/ Peitoril Gold
  createCutRule("go-jc4fp-01","typ-go-jc4fp","GO-010",G,"Marco Superior","marco_sup","L",-8,90,90,"1",1,profiles),
  createCutRule("go-jc4fp-02","typ-go-jc4fp","GO-012",G,"Marco Inferior","marco_inf","L",-8,90,90,"1",2,profiles),
  createCutRule("go-jc4fp-03","typ-go-jc4fp","GO-014",G,"Marco Lateral","marco_lat","H",-65,90,90,"2",3,profiles),
  createCutRule("go-jc4fp-04","typ-go-jc4fp","GO-053",G,"Travessa Divisória","travessa_div","L",-78,90,90,"1",4,profiles),
  createCutRule("go-jc4fp-05","typ-go-jc4fp","GO-039",G,"Montante Folha","montante","H",-215,90,90,"8",5,profiles),
  createCutRule("go-jc4fp-06","typ-go-jc4fp","GO-053",G,"Travessa Folha","travessa","L/4",-82,90,90,"8",6,profiles),
  createCutRule("go-jc4fp-07","typ-go-jc4fp","IGO-502",G,"Baguete V Folha","baguete_v","H",-230,90,90,"8",7,profiles),
  createCutRule("go-jc4fp-08","typ-go-jc4fp","IGO-502",G,"Baguete H Folha","baguete_h","L/4",-97,90,90,"8",8,profiles),

  // T11: Janela Camarão Gold
  createCutRule("go-jcam-01","typ-go-jcam","GO-010",G,"Marco Superior","marco_sup","L",-8,90,90,"1",1,profiles),
  createCutRule("go-jcam-02","typ-go-jcam","GO-012",G,"Marco Inferior","marco_inf","L",-8,90,90,"1",2,profiles),
  createCutRule("go-jcam-03","typ-go-jcam","GO-014",G,"Marco Lateral","marco_lat","H",-65,90,90,"2",3,profiles),
  createCutRule("go-jcam-04","typ-go-jcam","GO-072",G,"Montante Camarão","montante","H",-140,90,90,"6",4,profiles),
  createCutRule("go-jcam-05","typ-go-jcam","GO-073",G,"Travessa Camarão","travessa","L/4",-82,90,90,"8",5,profiles),
  createCutRule("go-jcam-06","typ-go-jcam","IGO-502",G,"Baguete V","baguete_v","H",-155,90,90,"6",6,profiles),
  createCutRule("go-jcam-07","typ-go-jcam","IGO-502",G,"Baguete H","baguete_h","L/4",-97,90,90,"6",7,profiles),

  // T12: Janela Correr 2F c/ Veneziana Gold
  createCutRule("go-jc2fv-01","typ-go-jc2fv","GO-010",G,"Marco Superior","marco_sup","L",-8,90,90,"1",1,profiles),
  createCutRule("go-jc2fv-02","typ-go-jc2fv","GO-012",G,"Marco Inferior","marco_inf","L",-8,90,90,"1",2,profiles),
  createCutRule("go-jc2fv-03","typ-go-jc2fv","GO-014",G,"Marco Lateral","marco_lat","H",-65,90,90,"2",3,profiles),
  createCutRule("go-jc2fv-04","typ-go-jc2fv","GO-039",G,"Montante Folha Vidro","montante","H",-140,90,90,"4",4,profiles),
  createCutRule("go-jc2fv-05","typ-go-jc2fv","GO-053",G,"Travessa Folha Vidro","travessa","L/2",-82,90,90,"4",5,profiles),
  createCutRule("go-jc2fv-06","typ-go-jc2fv","GO-068",G,"Montante Folha Veneziana","montante_ven","H",-140,90,90,"4",6,profiles),
  createCutRule("go-jc2fv-07","typ-go-jc2fv","GO-053",G,"Travessa Folha Veneziana","travessa_ven","L/2",-82,90,90,"4",7,profiles),
  createCutRule("go-jc2fv-08","typ-go-jc2fv","IGO-502",G,"Baguete V","baguete_v","H",-155,90,90,"4",8,profiles),
  createCutRule("go-jc2fv-09","typ-go-jc2fv","IGO-502",G,"Baguete H","baguete_h","L/2",-97,90,90,"4",9,profiles),

  // T13: Janela Giro (Abre e Tomba) Gold
  createCutRule("go-jgiro-01","typ-go-jgiro","GO-010",G,"Marco Superior","marco_sup","L",-8,90,90,"1",1,profiles),
  createCutRule("go-jgiro-02","typ-go-jgiro","GO-010",G,"Marco Inferior","marco_inf","L",-8,90,90,"1",2,profiles),
  createCutRule("go-jgiro-03","typ-go-jgiro","GO-014",G,"Marco Lateral","marco_lat","H",-65,90,90,"2",3,profiles),
  createCutRule("go-jgiro-04","typ-go-jgiro","GO-111",G,"Montante Folha","montante","H",-140,45,45,"2",4,profiles),
  createCutRule("go-jgiro-05","typ-go-jgiro","GO-111",G,"Travessa Sup Folha","travessa_sup","L",-155,45,45,"1",5,profiles),
  createCutRule("go-jgiro-06","typ-go-jgiro","GO-111",G,"Travessa Inf Folha","travessa_inf","L",-155,45,45,"1",6,profiles),
  createCutRule("go-jgiro-07","typ-go-jgiro","IGO-502",G,"Baguete V","baguete_v","H",-160,90,90,"2",7,profiles),
  createCutRule("go-jgiro-08","typ-go-jgiro","IGO-502",G,"Baguete H","baguete_h","L",-170,90,90,"2",8,profiles),

  // T14: Porta Integrada (Correr + Fixo) Gold
  createCutRule("go-pint-01","typ-go-pint","GO-010",G,"Marco Superior","marco_sup","L",-8,90,90,"1",1,profiles),
  createCutRule("go-pint-02","typ-go-pint","GO-012",G,"Marco Inferior","marco_inf","L",-8,90,90,"1",2,profiles),
  createCutRule("go-pint-03","typ-go-pint","GO-014",G,"Marco Lateral","marco_lat","H",-45,90,90,"2",3,profiles),
  createCutRule("go-pint-04","typ-go-pint","GO-292",G,"Montante Fixo","montante_fixo","H",-65,90,90,"1",4,profiles),
  createCutRule("go-pint-05","typ-go-pint","GO-111",G,"Montante Folha","montante","H",-120,90,90,"4",5,profiles),
  createCutRule("go-pint-06","typ-go-pint","GO-053",G,"Travessa Folha","travessa","L/3",-82,90,90,"4",6,profiles),
  createCutRule("go-pint-07","typ-go-pint","IGO-502",G,"Baguete V Folha","baguete_v","H",-135,90,90,"4",7,profiles),
  createCutRule("go-pint-08","typ-go-pint","IGO-502",G,"Baguete H Folha","baguete_h","L/3",-97,90,90,"4",8,profiles),
  createCutRule("go-pint-09","typ-go-pint","IGO-502",G,"Baguete V Fixo","baguete_vf","H",-80,90,90,"2",9,profiles),
  createCutRule("go-pint-10","typ-go-pint","IGO-502",G,"Baguete H Fixo","baguete_hf","L/3",-97,90,90,"2",10,profiles),

  // T15: Janela Correr 6F Gold
  createCutRule("go-jc6f-01","typ-go-jc6f","GO-010",G,"Marco Superior","marco_sup","L",-8,90,90,"1",1,profiles),
  createCutRule("go-jc6f-02","typ-go-jc6f","GO-121",G,"Marco Inferior (Trilho)","marco_inf","L",-8,90,90,"1",2,profiles),
  createCutRule("go-jc6f-03","typ-go-jc6f","GO-013",G,"Marco Lateral","marco_lat","H",-65,90,90,"2",3,profiles),
  createCutRule("go-jc6f-04","typ-go-jc6f","GO-039",G,"Montante Folha","montante","H",-140,90,90,"12",4,profiles),
  createCutRule("go-jc6f-05","typ-go-jc6f","GO-053",G,"Travessa Folha","travessa","L/6",-82,90,90,"12",5,profiles),
  createCutRule("go-jc6f-06","typ-go-jc6f","IGO-502",G,"Baguete V","baguete_v","H",-155,90,90,"12",6,profiles),
  createCutRule("go-jc6f-07","typ-go-jc6f","IGO-502",G,"Baguete H","baguete_h","L/6",-97,90,90,"12",7,profiles),
];

export { goldCutRules };
