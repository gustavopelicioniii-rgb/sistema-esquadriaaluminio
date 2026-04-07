import type { Manufacturer, ProductLine } from "@/types/calculation";

export const manufacturers: Manufacturer[] = [
  // Grandes fabricantes nacionais
  { id: "fab-alcoa", name: "Alcoa / Novelis", active: true },
  { id: "fab-asa", name: "ASA Alumínio", active: true },
  { id: "fab-hyspex", name: "Hyspex", active: true },
  { id: "fab-alumasa", name: "Alumasa", active: true },
  { id: "fab-daluminio", name: "D'Alumínio (DS)", active: true },
  // Distribuidores com linhas próprias
  { id: "fab-decamp", name: "Decamp Alumínio", active: true },
  // Fabricantes sem catálogo confirmado (desativados)
  { id: "fab-brimetal", name: "Brimetal", active: false },
  { id: "fab-cba", name: "CBA (Votorantim)", active: false },
  { id: "fab-real", name: "Real Alumínio", active: false },
  { id: "fab-lp", name: "Laminação Paulista (LP)", active: false },
  { id: "fab-alux", name: "Alux Alumínio", active: false },
  { id: "fab-albras", name: "Albrás", active: false },
  { id: "fab-saomarcos", name: "São Marcos Alumínio", active: false },
  { id: "fab-prado", name: "Prado Alumínio", active: false },
  { id: "fab-hydro", name: "Hydro (Sapa)", active: false },
  { id: "fab-pinhalense", name: "Pinhalense Alumínio", active: false },
];

export const productLines: ProductLine[] = [
  // ===================== Alcoa / Novelis =====================
  { id: "line-suprema", manufacturer_id: "fab-alcoa", name: "Linha Suprema (25mm)", bitola_mm: 25, description: "Linha 25mm mais popular do Brasil. Residencial e edifícios.", active: true },
  { id: "line-gold", manufacturer_id: "fab-alcoa", name: "Linha Gold (32mm)", bitola_mm: 32, description: "Linha 32mm para grandes vãos e alto padrão.", active: true },
  { id: "line-top", manufacturer_id: "fab-alcoa", name: "Linha Top (40mm)", bitola_mm: 40, description: "Linha 40mm para projetos de alto padrão e fachadas.", active: true },
  { id: "line-suprema-plus", manufacturer_id: "fab-alcoa", name: "Suprema Plus (25mm)", bitola_mm: 25, description: "Suprema com reforço estrutural para grandes vãos.", active: true },

  // ===================== ASA Alumínio =====================
  { id: "line-mega20", manufacturer_id: "fab-asa", name: "Mega 20", bitola_mm: 20, description: "Linha econômica para janelas pequenas e basculantes.", active: false },
  { id: "line-mega25", manufacturer_id: "fab-asa", name: "Mega 25", bitola_mm: 25, description: "Linha intermediária, compatível com padrão 25mm.", active: false },
  { id: "line-mega32", manufacturer_id: "fab-asa", name: "Mega 32", bitola_mm: 32, description: "Linha robusta para grandes vãos e fachadas.", active: false },
  { id: "line-mega40", manufacturer_id: "fab-asa", name: "Mega 40", bitola_mm: 40, description: "Linha premium 40mm para fachadas e projetos especiais.", active: false },

  // ===================== Hyspex =====================
  { id: "line-hyspex25", manufacturer_id: "fab-hyspex", name: "Linha 25", bitola_mm: 25, description: "Linha 25mm padrão Hyspex.", active: false },
  { id: "line-hyspex25su", manufacturer_id: "fab-hyspex", name: "Linha 25 90° SU", bitola_mm: 25, description: "Linha 25mm compatível com padrão Suprema.", active: false },
  { id: "line-hyspex-mp", manufacturer_id: "fab-hyspex", name: "Módulo Prático (20mm)", bitola_mm: 20, description: "Linha 20mm econômica.", active: false },
  { id: "line-hyspex32", manufacturer_id: "fab-hyspex", name: "Linha 32", bitola_mm: 32, description: "Linha 32mm Hyspex para grandes vãos.", active: false },

  // ===================== Alumasa =====================
  { id: "line-alumasa25", manufacturer_id: "fab-alumasa", name: "Linha 25", bitola_mm: 25, description: "Linha 25mm Alumasa, padrão mercado.", active: false },
  { id: "line-alumasa32", manufacturer_id: "fab-alumasa", name: "Linha 32", bitola_mm: 32, description: "Linha 32mm Alumasa para grandes vãos.", active: false },
  { id: "line-alumasa20", manufacturer_id: "fab-alumasa", name: "Linha 20", bitola_mm: 20, description: "Linha 20mm econômica Alumasa.", active: false },

  // ===================== D'Alumínio (DS) =====================
  { id: "line-ds-suprema", manufacturer_id: "fab-daluminio", name: "Suprema Classic (25mm)", bitola_mm: 25, description: "Compatível com Suprema Alcoa.", active: false },
  { id: "line-ds-gold", manufacturer_id: "fab-daluminio", name: "Gold Classic (32mm)", bitola_mm: 32, description: "Compatível com Gold Alcoa.", active: false },

  // ===================== Decamp Alumínio =====================
  // Fonte: Catálogos oficiais Decamp Edição 01/2026
  { id: "line-decamp45", manufacturer_id: "fab-decamp", name: "Decamp Linha 45", bitola_mm: 45, description: "Linha principal Decamp 45mm. Marcos, janelas, portas, venezianas. Catálogo Geral 2026.", active: true },
  { id: "line-decamp-pratic20", manufacturer_id: "fab-decamp", name: "Decamp Pratic 20", bitola_mm: 20, description: "Linha Pratic 20mm para portas e janelas econômicas.", active: true },
  { id: "line-decamp-pratic25", manufacturer_id: "fab-decamp", name: "Decamp Pratic 25", bitola_mm: 25, description: "Linha Pratic 25mm padrão.", active: true },
  { id: "line-decamp-pratic30", manufacturer_id: "fab-decamp", name: "Decamp Pratic 30", bitola_mm: 30, description: "Linha Pratic 30mm intermediária.", active: true },
  { id: "line-decamp-pratic32", manufacturer_id: "fab-decamp", name: "Decamp Pratic 32", bitola_mm: 32, description: "Linha Pratic 32mm para grandes vãos.", active: true },
  { id: "line-decamp-pratic42", manufacturer_id: "fab-decamp", name: "Decamp Pratic 42", bitola_mm: 42, description: "Linha Pratic 42mm premium.", active: true },
  { id: "line-decamp-fachada", manufacturer_id: "fab-decamp", name: "Decamp Pratic Fachada", bitola_mm: 0, description: "Perfis para fachadas (PRF, PFG, TMF). Catálogo Geral 2026.", active: true },
  { id: "line-decamp-perfetta-fachada", manufacturer_id: "fab-decamp", name: "Decamp Perfetta Fachada", bitola_mm: 0, description: "Perfis Perfetta para fachadas (PFF). Catálogo Geral 2026.", active: true },
  { id: "line-decamp-estufas", manufacturer_id: "fab-decamp", name: "Decamp Estufas", bitola_mm: 0, description: "Perfis exclusivos para estufas e coberturas. Catálogo Estufas 2021.", active: true },
  { id: "line-decamp-muxarabi", manufacturer_id: "fab-decamp", name: "Decamp Muxarabi", bitola_mm: 0, description: "Perfis para painéis muxarabi, portas camarão e divisores. Catálogo Muxarabi 2026.", active: true },
  { id: "line-decamp-geral", manufacturer_id: "fab-decamp", name: "Decamp Geral", bitola_mm: 0, description: "Tubos, barras, cantoneiras, box, guarda-corpo, moveleiro e acessórios diversos.", active: true },
];
