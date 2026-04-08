export interface ProdutoOrcamento {
  value: string;
  label: string;
  precoM2: number;
  category: string;
  subcategory: string;
  numFolhas: number;
  veneziana?: boolean;
  typologyId: string;
  /** Min/max dimensions in cm */
  minLarguraCm: number;
  maxLarguraCm: number;
  minAlturaCm: number;
  maxAlturaCm: number;
}

export const tiposProduto: ProdutoOrcamento[] = [
  { value: "janela_correr_2f", label: "Janela de Correr 2F", precoM2: 850, category: "janela_correr", subcategory: "2_folhas", numFolhas: 2, typologyId: "typ-su-jc2f", minLarguraCm: 80, maxLarguraCm: 400, minAlturaCm: 40, maxAlturaCm: 250 },
  { value: "janela_correr_4f", label: "Janela de Correr 4F", precoM2: 880, category: "janela_correr", subcategory: "4_folhas", numFolhas: 4, typologyId: "typ-su-jc4f", minLarguraCm: 160, maxLarguraCm: 600, minAlturaCm: 40, maxAlturaCm: 250 },
  { value: "janela_maximar_1f", label: "Janela Maxim-Ar 1F", precoM2: 920, category: "janela_maximar", subcategory: "1_folha", numFolhas: 1, typologyId: "typ-su-jma1", minLarguraCm: 40, maxLarguraCm: 200, minAlturaCm: 40, maxAlturaCm: 150 },
  { value: "janela_maximar_2f", label: "Janela Maxim-Ar 2F", precoM2: 950, category: "janela_maximar", subcategory: "2_folhas", numFolhas: 2, typologyId: "typ-su-jma2", minLarguraCm: 80, maxLarguraCm: 300, minAlturaCm: 40, maxAlturaCm: 150 },
  { value: "porta_giro_1f", label: "Porta de Giro 1F", precoM2: 950, category: "porta_giro", subcategory: "1_folha", numFolhas: 1, typologyId: "typ-su-pg1f", minLarguraCm: 60, maxLarguraCm: 130, minAlturaCm: 180, maxAlturaCm: 280 },
  { value: "porta_giro_2f", label: "Porta de Giro 2F", precoM2: 1000, category: "porta_giro", subcategory: "2_folhas", numFolhas: 2, typologyId: "typ-su-pg2f", minLarguraCm: 100, maxLarguraCm: 260, minAlturaCm: 180, maxAlturaCm: 280 },
  { value: "porta_correr_2f", label: "Porta de Correr 2F", precoM2: 1050, category: "porta_correr", subcategory: "2_folhas", numFolhas: 2, typologyId: "typ-su-pc2f", minLarguraCm: 100, maxLarguraCm: 400, minAlturaCm: 180, maxAlturaCm: 280 },
  { value: "porta_correr_4f", label: "Porta de Correr 4F", precoM2: 1100, category: "porta_correr", subcategory: "4_folhas", numFolhas: 4, typologyId: "typ-su-pc4f", minLarguraCm: 200, maxLarguraCm: 600, minAlturaCm: 180, maxAlturaCm: 280 },
  { value: "janela_veneziana", label: "Janela c/ Veneziana 2F", precoM2: 1200, category: "janela_correr", subcategory: "2_folhas", numFolhas: 2, veneziana: true, typologyId: "typ-su-jc2fv", minLarguraCm: 80, maxLarguraCm: 400, minAlturaCm: 40, maxAlturaCm: 250 },
  { value: "janela_camarao", label: "Janela Camarão", precoM2: 1300, category: "janela_camarao", subcategory: "4_folhas", numFolhas: 4, typologyId: "typ-su-jcam", minLarguraCm: 100, maxLarguraCm: 400, minAlturaCm: 40, maxAlturaCm: 200 },
];

export const getProdutoByValue = (value: string) =>
  tiposProduto.find((t) => t.value === value);

/** Returns validation errors for the given dimensions against the product limits. Null = valid. */
export function validateDimensions(tipo: string, larguraCm: number, alturaCm: number): { largura?: string; altura?: string } | null {
  const produto = getProdutoByValue(tipo);
  if (!produto) return null;
  const errors: { largura?: string; altura?: string } = {};
  if (larguraCm < produto.minLarguraCm) errors.largura = `Mín. ${produto.minLarguraCm} cm`;
  if (larguraCm > produto.maxLarguraCm) errors.largura = `Máx. ${produto.maxLarguraCm} cm`;
  if (alturaCm < produto.minAlturaCm) errors.altura = `Mín. ${produto.minAlturaCm} cm`;
  if (alturaCm > produto.maxAlturaCm) errors.altura = `Máx. ${produto.maxAlturaCm} cm`;
  return Object.keys(errors).length > 0 ? errors : null;
}

export const formasPagamento = [
  { value: "pix", label: "PIX" },
  { value: "boleto", label: "Boleto" },
  { value: "cartao", label: "Cartão" },
  { value: "transferencia", label: "Transferência" },
  { value: "dinheiro", label: "Dinheiro" },
  { value: "cheque", label: "Cheque" },
];
