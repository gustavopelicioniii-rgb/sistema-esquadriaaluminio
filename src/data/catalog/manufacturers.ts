import type { Manufacturer, ProductLine } from "@/types/calculation";

export const manufacturers: Manufacturer[] = [
  { id: "fab-alcoa", name: "Alcoa / Novelis", active: true },
  { id: "fab-asa", name: "ASA Alumínio", active: true },
  { id: "fab-hyspex", name: "Hyspex", active: true },
  { id: "fab-alumasa", name: "Alumasa", active: true },
  { id: "fab-daluminio", name: "D'Alumínio (DS)", active: true },
];

export const productLines: ProductLine[] = [
  // Alcoa / Novelis
  { id: "line-suprema", manufacturer_id: "fab-alcoa", name: "Linha Suprema", bitola_mm: 25, description: "Linha 25mm mais popular do Brasil. Residencial e edifícios.", active: true },
  { id: "line-gold", manufacturer_id: "fab-alcoa", name: "Linha Gold", bitola_mm: 32, description: "Linha 32mm para grandes vãos e alto padrão.", active: true },
  // ASA Alumínio
  { id: "line-mega20", manufacturer_id: "fab-asa", name: "Mega 20", bitola_mm: 20, description: "Linha econômica para janelas pequenas e basculantes.", active: true },
  { id: "line-mega25", manufacturer_id: "fab-asa", name: "Mega 25", bitola_mm: 25, description: "Linha intermediária, compatível com padrão 25mm do mercado.", active: true },
  { id: "line-mega32", manufacturer_id: "fab-asa", name: "Mega 32", bitola_mm: 32, description: "Linha robusta para grandes vãos e fachadas.", active: true },
  // Hyspex
  { id: "line-hyspex25", manufacturer_id: "fab-hyspex", name: "Linha 25", bitola_mm: 25, description: "Linha 25mm padrão Hyspex para serralherias.", active: true },
  { id: "line-hyspex25su", manufacturer_id: "fab-hyspex", name: "Linha 25 90° SU", bitola_mm: 25, description: "Linha 25mm compatível com padrão Suprema.", active: true },
  { id: "line-hyspex-mp", manufacturer_id: "fab-hyspex", name: "Módulo Prático", bitola_mm: 20, description: "Linha 20mm econômica.", active: true },
  // Alumasa
  { id: "line-alumasa25", manufacturer_id: "fab-alumasa", name: "Linha 25", bitola_mm: 25, description: "Linha 25mm Alumasa, padrão mercado.", active: true },
  { id: "line-alumasa32", manufacturer_id: "fab-alumasa", name: "Linha 32", bitola_mm: 32, description: "Linha 32mm Alumasa para grandes vãos.", active: true },
  // D'Alumínio
  { id: "line-ds-suprema", manufacturer_id: "fab-daluminio", name: "Suprema Classic", bitola_mm: 25, description: "Compatível com Suprema Alcoa. Amplamente usado no mercado.", active: true },
];
