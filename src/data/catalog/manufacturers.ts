import type { Manufacturer, ProductLine } from "@/types/calculation";

export const manufacturers: Manufacturer[] = [
  // Grandes fabricantes nacionais
  { id: "fab-alcoa", name: "Alcoa / Novelis", active: true },
  { id: "fab-asa", name: "ASA Alumínio", active: true },
  { id: "fab-hyspex", name: "Hyspex", active: true },
  { id: "fab-alumasa", name: "Alumasa", active: true },
  { id: "fab-daluminio", name: "D'Alumínio (DS)", active: true },
  // Novos fabricantes
  { id: "fab-brimetal", name: "Brimetal", active: true },
  { id: "fab-cba", name: "CBA (Votorantim)", active: true },
  { id: "fab-real", name: "Real Alumínio", active: true },
  { id: "fab-lp", name: "Laminação Paulista (LP)", active: true },
  { id: "fab-alux", name: "Alux Alumínio", active: true },
  { id: "fab-albras", name: "Albrás", active: true },
  { id: "fab-saomarcos", name: "São Marcos Alumínio", active: true },
  { id: "fab-prado", name: "Prado Alumínio", active: true },
  { id: "fab-hydro", name: "Hydro (Sapa)", active: true },
  { id: "fab-pinhalense", name: "Pinhalense Alumínio", active: true },
];

export const productLines: ProductLine[] = [
  // ===================== Alcoa / Novelis =====================
  { id: "line-suprema", manufacturer_id: "fab-alcoa", name: "Linha Suprema (25mm)", bitola_mm: 25, description: "Linha 25mm mais popular do Brasil. Residencial e edifícios.", active: true },
  { id: "line-gold", manufacturer_id: "fab-alcoa", name: "Linha Gold (32mm)", bitola_mm: 32, description: "Linha 32mm para grandes vãos e alto padrão.", active: true },
  { id: "line-top", manufacturer_id: "fab-alcoa", name: "Linha Top (40mm)", bitola_mm: 40, description: "Linha 40mm para projetos de alto padrão e fachadas.", active: true },
  { id: "line-suprema-plus", manufacturer_id: "fab-alcoa", name: "Suprema Plus (25mm)", bitola_mm: 25, description: "Suprema com reforço estrutural para grandes vãos.", active: true },

  // ===================== ASA Alumínio =====================
  { id: "line-mega20", manufacturer_id: "fab-asa", name: "Mega 20", bitola_mm: 20, description: "Linha econômica para janelas pequenas e basculantes.", active: true },
  { id: "line-mega25", manufacturer_id: "fab-asa", name: "Mega 25", bitola_mm: 25, description: "Linha intermediária, compatível com padrão 25mm.", active: true },
  { id: "line-mega32", manufacturer_id: "fab-asa", name: "Mega 32", bitola_mm: 32, description: "Linha robusta para grandes vãos e fachadas.", active: true },
  { id: "line-mega40", manufacturer_id: "fab-asa", name: "Mega 40", bitola_mm: 40, description: "Linha premium 40mm para fachadas e projetos especiais.", active: true },

  // ===================== Hyspex =====================
  { id: "line-hyspex25", manufacturer_id: "fab-hyspex", name: "Linha 25", bitola_mm: 25, description: "Linha 25mm padrão Hyspex.", active: true },
  { id: "line-hyspex25su", manufacturer_id: "fab-hyspex", name: "Linha 25 90° SU", bitola_mm: 25, description: "Linha 25mm compatível com padrão Suprema.", active: true },
  { id: "line-hyspex-mp", manufacturer_id: "fab-hyspex", name: "Módulo Prático (20mm)", bitola_mm: 20, description: "Linha 20mm econômica.", active: true },
  { id: "line-hyspex32", manufacturer_id: "fab-hyspex", name: "Linha 32", bitola_mm: 32, description: "Linha 32mm Hyspex para grandes vãos.", active: true },

  // ===================== Alumasa =====================
  { id: "line-alumasa25", manufacturer_id: "fab-alumasa", name: "Linha 25", bitola_mm: 25, description: "Linha 25mm Alumasa, padrão mercado.", active: true },
  { id: "line-alumasa32", manufacturer_id: "fab-alumasa", name: "Linha 32", bitola_mm: 32, description: "Linha 32mm Alumasa para grandes vãos.", active: true },
  { id: "line-alumasa20", manufacturer_id: "fab-alumasa", name: "Linha 20", bitola_mm: 20, description: "Linha 20mm econômica Alumasa.", active: true },

  // ===================== D'Alumínio (DS) =====================
  { id: "line-ds-suprema", manufacturer_id: "fab-daluminio", name: "Suprema Classic (25mm)", bitola_mm: 25, description: "Compatível com Suprema Alcoa.", active: true },
  { id: "line-ds-gold", manufacturer_id: "fab-daluminio", name: "Gold Classic (32mm)", bitola_mm: 32, description: "Compatível com Gold Alcoa.", active: true },

  // ===================== Brimetal =====================
  { id: "line-brimetal25", manufacturer_id: "fab-brimetal", name: "Linha 25 Brimetal", bitola_mm: 25, description: "Linha 25mm compatível Suprema. Boa relação custo-benefício.", active: true },
  { id: "line-brimetal32", manufacturer_id: "fab-brimetal", name: "Linha 32 Brimetal", bitola_mm: 32, description: "Linha 32mm compatível Gold.", active: true },
  { id: "line-brimetal20", manufacturer_id: "fab-brimetal", name: "Linha 20 Brimetal", bitola_mm: 20, description: "Linha 20mm econômica.", active: true },

  // ===================== CBA (Votorantim) =====================
  { id: "line-cba25", manufacturer_id: "fab-cba", name: "CBA 25", bitola_mm: 25, description: "Linha 25mm CBA. Amplamente disponível no mercado.", active: true },
  { id: "line-cba32", manufacturer_id: "fab-cba", name: "CBA 32", bitola_mm: 32, description: "Linha 32mm CBA para grandes vãos.", active: true },

  // ===================== Real Alumínio =====================
  { id: "line-real25", manufacturer_id: "fab-real", name: "Real 25", bitola_mm: 25, description: "Linha 25mm Real Alumínio, compatível Suprema.", active: true },
  { id: "line-real32", manufacturer_id: "fab-real", name: "Real 32", bitola_mm: 32, description: "Linha 32mm Real Alumínio.", active: true },
  { id: "line-real20", manufacturer_id: "fab-real", name: "Real 20 Econômica", bitola_mm: 20, description: "Linha 20mm econômica.", active: true },

  // ===================== Laminação Paulista (LP) =====================
  { id: "line-lp25", manufacturer_id: "fab-lp", name: "LP 25", bitola_mm: 25, description: "Linha 25mm LP, compatível Suprema.", active: true },
  { id: "line-lp32", manufacturer_id: "fab-lp", name: "LP 32", bitola_mm: 32, description: "Linha 32mm LP.", active: true },

  // ===================== Alux Alumínio =====================
  { id: "line-alux25", manufacturer_id: "fab-alux", name: "Alux 25", bitola_mm: 25, description: "Linha 25mm Alux, compatível Suprema.", active: true },
  { id: "line-alux32", manufacturer_id: "fab-alux", name: "Alux 32", bitola_mm: 32, description: "Linha 32mm Alux.", active: true },
  { id: "line-alux20", manufacturer_id: "fab-alux", name: "Alux 20", bitola_mm: 20, description: "Linha 20mm econômica.", active: true },

  // ===================== Albrás =====================
  { id: "line-albras25", manufacturer_id: "fab-albras", name: "Albrás 25", bitola_mm: 25, description: "Linha 25mm Albrás, padrão mercado.", active: true },
  { id: "line-albras32", manufacturer_id: "fab-albras", name: "Albrás 32", bitola_mm: 32, description: "Linha 32mm Albrás.", active: true },

  // ===================== São Marcos Alumínio =====================
  { id: "line-sm25", manufacturer_id: "fab-saomarcos", name: "São Marcos 25", bitola_mm: 25, description: "Linha 25mm São Marcos.", active: true },
  { id: "line-sm32", manufacturer_id: "fab-saomarcos", name: "São Marcos 32", bitola_mm: 32, description: "Linha 32mm São Marcos.", active: true },

  // ===================== Prado Alumínio =====================
  { id: "line-prado25", manufacturer_id: "fab-prado", name: "Prado 25", bitola_mm: 25, description: "Linha 25mm Prado, padrão Suprema.", active: true },
  { id: "line-prado32", manufacturer_id: "fab-prado", name: "Prado 32", bitola_mm: 32, description: "Linha 32mm Prado.", active: true },

  // ===================== Hydro (Sapa) =====================
  { id: "line-hydro25", manufacturer_id: "fab-hydro", name: "Hydro 25", bitola_mm: 25, description: "Linha 25mm Hydro, padrão internacional.", active: true },
  { id: "line-hydro32", manufacturer_id: "fab-hydro", name: "Hydro 32", bitola_mm: 32, description: "Linha 32mm Hydro premium.", active: true },
  { id: "line-hydro40", manufacturer_id: "fab-hydro", name: "Hydro 40 Fachada", bitola_mm: 40, description: "Linha 40mm para fachadas e projetos especiais.", active: true },

  // ===================== Pinhalense Alumínio =====================
  { id: "line-pin25", manufacturer_id: "fab-pinhalense", name: "Pinhalense 25", bitola_mm: 25, description: "Linha 25mm Pinhalense.", active: true },
  { id: "line-pin32", manufacturer_id: "fab-pinhalense", name: "Pinhalense 32", bitola_mm: 32, description: "Linha 32mm Pinhalense.", active: true },
];
