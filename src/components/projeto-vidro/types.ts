export interface VidroItem {
  id: string;
  descricao: string;
  larguraMm: number;
  alturaMm: number;
  quantidade: number;
  observacao: string;
}

export interface ProjetoVidro {
  id: string;
  titulo: string;
  tipo: string;
  espessura: string;
  cor: string;
  precoM2: number;
  areaMinimaM2: number;
  itens: VidroItem[];
  criadoEm: string;
  archived?: boolean;
}

export const tiposVidro = ["Comum", "Temperado", "Laminado", "Temperado Laminado", "Insulado", "Veneziana", "Pivotante", "Maxim-Ar", "Serigrafado", "Espelhado", "Acidato"];
export const espessuras = ["4mm", "6mm", "8mm", "10mm", "12mm", "15mm", "19mm"];
export const cores = ["Incolor", "Fumê", "Verde", "Bronze", "Cinza", "Preto", "Branco Leitoso"];

export function calcAreaM2(largMm: number, altMm: number): number {
  return (largMm * altMm) / 1_000_000;
}

export function calcAreaEfetiva(largMm: number, altMm: number, areaMinimaM2: number): number {
  const real = calcAreaM2(largMm, altMm);
  return areaMinimaM2 > 0 ? Math.max(real, areaMinimaM2) : real;
}
