export interface ProdutoOrcamento {
  value: string;
  label: string;
  precoM2: number;
  category: string;
  subcategory: string;
  numFolhas: number;
  veneziana?: boolean;
  typologyId: string;
}

export const tiposProduto: ProdutoOrcamento[] = [
  { value: "janela_correr_2f", label: "Janela de Correr 2F", precoM2: 850, category: "janela_correr", subcategory: "2_folhas", numFolhas: 2, typologyId: "typ-su-jc2f" },
  { value: "janela_correr_4f", label: "Janela de Correr 4F", precoM2: 880, category: "janela_correr", subcategory: "4_folhas", numFolhas: 4, typologyId: "typ-su-jc4f" },
  { value: "janela_maximar_1f", label: "Janela Maxim-Ar 1F", precoM2: 920, category: "janela_maximar", subcategory: "1_folha", numFolhas: 1, typologyId: "typ-su-jma1" },
  { value: "janela_maximar_2f", label: "Janela Maxim-Ar 2F", precoM2: 950, category: "janela_maximar", subcategory: "2_folhas", numFolhas: 2, typologyId: "typ-su-jma2" },
  { value: "porta_giro_1f", label: "Porta de Giro 1F", precoM2: 950, category: "porta_giro", subcategory: "1_folha", numFolhas: 1, typologyId: "typ-su-pg1f" },
  { value: "porta_giro_2f", label: "Porta de Giro 2F", precoM2: 1000, category: "porta_giro", subcategory: "2_folhas", numFolhas: 2, typologyId: "typ-su-pg2f" },
  { value: "porta_correr_2f", label: "Porta de Correr 2F", precoM2: 1050, category: "porta_correr", subcategory: "2_folhas", numFolhas: 2, typologyId: "typ-su-pc2f" },
  { value: "porta_correr_4f", label: "Porta de Correr 4F", precoM2: 1100, category: "porta_correr", subcategory: "4_folhas", numFolhas: 4, typologyId: "typ-su-pc4f" },
  { value: "janela_veneziana", label: "Janela c/ Veneziana 2F", precoM2: 1200, category: "janela_correr", subcategory: "2_folhas", numFolhas: 2, veneziana: true, typologyId: "typ-su-jc2fv" },
  { value: "janela_camarao", label: "Janela Camarão", precoM2: 1300, category: "janela_camarao", subcategory: "4_folhas", numFolhas: 4, typologyId: "typ-su-jcam" },
];

export const getProdutoByValue = (value: string) =>
  tiposProduto.find((t) => t.value === value);

export const formasPagamento = [
  { value: "pix", label: "PIX" },
  { value: "boleto", label: "Boleto" },
  { value: "cartao", label: "Cartão" },
  { value: "transferencia", label: "Transferência" },
  { value: "dinheiro", label: "Dinheiro" },
  { value: "cheque", label: "Cheque" },
];
