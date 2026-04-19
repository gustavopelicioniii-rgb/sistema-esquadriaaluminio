import type { Typology } from "@/types/calculation";

// ============================================
// URL base para imagens fotorrealistas
// ============================================
const IMG_CDN = "https://aluflow-landing.vercel.app/images/typologies";

// ============================================
// MAPEAMENTO DE IMAGENS POR TIPOLOGIA
// ============================================
const typologyImages: Record<string, string> = {
  // Janela de Correr 2 Folhas
  "typ-su-jc2f": `${IMG_CDN}/tipologia-janela-correr-2p---photorealistic-01.png`,
  "typ-go-jc2f": `${IMG_CDN}/tipologia-janela-correr-2p---photorealistic-01.png`,
  "typ-tp-jc2f": `${IMG_CDN}/tipologia-janela-correr-2p---photorealistic-01.png`,
  // Janela de Correr 4 Folhas
  "typ-su-jc4f": `${IMG_CDN}/tipologia-janela-correr-4p---photorealistic-02.png`,
  "typ-go-jc4f": `${IMG_CDN}/tipologia-janela-correr-4p---photorealistic-02.png`,
  "typ-tp-jc4f": `${IMG_CDN}/tipologia-janela-correr-4p---photorealistic-02.png`,
  // Porta de Correr 2 Folhas
  "typ-su-pc2f": `${IMG_CDN}/tipologia-porta-correr-2p---photorealistic-03.png`,
  "typ-go-pc2f": `${IMG_CDN}/tipologia-porta-correr-2p---photorealistic-03.png`,
  "typ-tp-pc2f": `${IMG_CDN}/tipologia-porta-correr-2p---photorealistic-03.png`,
  // Porta de Correr 4 Folhas
  "typ-su-pc4f": `${IMG_CDN}/tipologia-porta-correr-4p---photorealistic-04.png`,
  "typ-go-pc4f": `${IMG_CDN}/tipologia-porta-correr-4p---photorealistic-04.png`,
  "typ-tp-pc4f": `${IMG_CDN}/tipologia-porta-correr-4p---photorealistic-04.png`,
  // Porta de Giro / Janela Giro
  "typ-su-pg1f": `${IMG_CDN}/tipologia-janela-giro---photorealistic-05.png`,
  "typ-su-pg2f": `${IMG_CDN}/tipologia-janela-giro---photorealistic-05.png`,
  "typ-go-pg1f": `${IMG_CDN}/tipologia-janela-giro---photorealistic-05.png`,
  "typ-go-pg2f": `${IMG_CDN}/tipologia-janela-giro---photorealistic-05.png`,
  "typ-go-jgiro": `${IMG_CDN}/tipologia-janela-giro---photorealistic-05.png`,
  "typ-tp-pg1f": `${IMG_CDN}/tipologia-janela-giro---photorealistic-05.png`,
  "typ-tp-pg2f": `${IMG_CDN}/tipologia-janela-giro---photorealistic-05.png`,
  // Porta Pivotante
  "typ-su-jpiv": `${IMG_CDN}/tipologia-porta-pivotante---photorealistic-06.png`,
  "typ-go-jpiv": `${IMG_CDN}/tipologia-porta-pivotante---photorealistic-06.png`,
  // Maxim Air
  "typ-su-jma1": `${IMG_CDN}/tipologia-janela-maxair---photorealistic-07.png`,
  "typ-su-jma2": `${IMG_CDN}/tipologia-janela-maxair---photorealistic-07.png`,
  "typ-go-jma1": `${IMG_CDN}/tipologia-janela-maxair---photorealistic-07.png`,
  "typ-go-jma2": `${IMG_CDN}/tipologia-janela-maxair---photorealistic-07.png`,
  "typ-tp-jma1": `${IMG_CDN}/tipologia-janela-maxair---photorealistic-07.png`,
  // Box
  "typ-su-box": `${IMG_CDN}/tipologia-box---photorealistic-08.png`,
  "typ-go-box": `${IMG_CDN}/tipologia-box---photorealistic-08.png`,
  // Guarda Roupa
  "typ-su-gr": `${IMG_CDN}/tipologia-guarda-roupa---photorealistic-09.png`,
  "typ-go-gr": `${IMG_CDN}/tipologia-guarda-roupa---photorealistic-09.png`,
  // Divisória
  "typ-su-div": `${IMG_CDN}/tipologia-divisoria---photorealistic-10.png`,
  "typ-go-div": `${IMG_CDN}/tipologia-divisoria---photorealistic-10.png`,
  // Janela com Veneziana / Persiana
  "typ-su-jc2fv": `${IMG_CDN}/tipologia-janela-persiana---photorealistic-11.png`,
  "typ-su-jc4fv": `${IMG_CDN}/tipologia-janela-persiana---photorealistic-11.png`,
  "typ-go-jc2fv": `${IMG_CDN}/tipologia-janela-persiana---photorealistic-11.png`,
  "typ-su-jc6f": `${IMG_CDN}/tipologia-janela-persiana---photorealistic-11.png`,
  // Janela Fixa
  "typ-su-vfix": `${IMG_CDN}/tipologia-janela-fixa---photorealistic-12.png`,
  "typ-go-vfix": `${IMG_CDN}/tipologia-janela-fixa---photorealistic-12.png`,
  "typ-tp-vfix": `${IMG_CDN}/tipologia-janela-fixa---photorealistic-12.png`,
  // Janela de Porão
  "typ-su-por": `${IMG_CDN}/tipologia-janela-porao---photorealistic-13.png`,
  "typ-go-por": `${IMG_CDN}/tipologia-janela-porao---photorealistic-13.png`,
  // Closet
  "typ-su-closet": `${IMG_CDN}/tipologia-closet---photorealistic-14.png`,
  "typ-go-closet": `${IMG_CDN}/tipologia-closet---photorealistic-14.png`,
};

// Função helper para obter imagem
export function getTypologyImage(typologyId: string): string | undefined {
  return typologyImages[typologyId];
}

// ============================================
// 22 TIPOLOGIAS SUPREMA (25mm) — Com imagens
// ============================================
const supremaTypologies: (Typology & { imagem_url?: string })[] = [
  // Janelas de Correr
  { id: "typ-su-jc2f", product_line_id: "line-suprema", name: "Janela de Correr 2 Folhas", category: "janela", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 4000, min_height_mm: 400, max_height_mm: 2500, imagem_url: typologyImages["typ-su-jc2f"] },
  { id: "typ-su-jc3f", product_line_id: "line-suprema", name: "Janela de Correr 3 Folhas", category: "janela", subcategory: "correr", num_folhas: 3, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 900, max_width_mm: 5000, min_height_mm: 400, max_height_mm: 2500, imagem_url: typologyImages["typ-su-jc2f"] },
  { id: "typ-su-jc4f", product_line_id: "line-suprema", name: "Janela de Correr 4 Folhas", category: "janela", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1200, max_width_mm: 6000, min_height_mm: 400, max_height_mm: 2500, imagem_url: typologyImages["typ-su-jc4f"] },
  { id: "typ-su-jc6f", product_line_id: "line-suprema", name: "Janela de Correr 6 Folhas", category: "janela", subcategory: "correr", num_folhas: 6, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1800, max_width_mm: 6000, min_height_mm: 400, max_height_mm: 2500, imagem_url: typologyImages["typ-su-jc6f"] || typologyImages["typ-su-jc4f"] },
  { id: "typ-su-jc4fp", product_line_id: "line-suprema", name: "Janela de Correr 4F c/ Peitoril Fixo", category: "janela", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, notes: "Com peitoril fixo inferior", min_width_mm: 1200, max_width_mm: 6000, min_height_mm: 600, max_height_mm: 2500, imagem_url: typologyImages["typ-su-jc4f"] },
  { id: "typ-su-jc2fb", product_line_id: "line-suprema", name: "Janela de Correr 2F c/ Bandeira Móvel", category: "janela", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: true, active: true, min_width_mm: 600, max_width_mm: 4000, min_height_mm: 600, max_height_mm: 2800, imagem_url: typologyImages["typ-su-jc2f"] },
  // Maxim-Ar
  { id: "typ-su-jma1", product_line_id: "line-suprema", name: "Janela Maxim-Ar 1 Folha", category: "maxim_ar", subcategory: "maxim_ar", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 300, max_width_mm: 1400, min_height_mm: 300, max_height_mm: 1200, imagem_url: typologyImages["typ-su-jma1"] },
  { id: "typ-su-jma2", product_line_id: "line-suprema", name: "Janela Maxim-Ar 2 Folhas", category: "maxim_ar", subcategory: "maxim_ar", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 2500, min_height_mm: 300, max_height_mm: 1400, imagem_url: typologyImages["typ-su-jma2"] },
  // Camarão
  { id: "typ-su-jcam", product_line_id: "line-suprema", name: "Janela Camarão (Sanfonada)", category: "camarao", subcategory: "camarao", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 5000, min_height_mm: 500, max_height_mm: 2500, imagem_url: typologyImages["typ-su-jc4f"] },
  // Portas de Correr
  { id: "typ-su-pc2f", product_line_id: "line-suprema", name: "Porta de Correr 2 Folhas", category: "porta", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 5000, min_height_mm: 1900, max_height_mm: 3000, imagem_url: typologyImages["typ-su-pc2f"] },
  { id: "typ-su-pc3f", product_line_id: "line-suprema", name: "Porta de Correr 3 Folhas", category: "porta", subcategory: "correr", num_folhas: 3, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1500, max_width_mm: 6000, min_height_mm: 1900, max_height_mm: 3000, imagem_url: typologyImages["typ-su-pc2f"] },
  { id: "typ-su-pc4f", product_line_id: "line-suprema", name: "Porta de Correr 4 Folhas", category: "porta", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 2000, max_width_mm: 6000, min_height_mm: 1900, max_height_mm: 3000, imagem_url: typologyImages["typ-su-pc4f"] },
  // Portas de Giro
  { id: "typ-su-pg1f", product_line_id: "line-suprema", name: "Porta de Giro 1 Folha", category: "porta", subcategory: "giro", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 500, max_width_mm: 1200, min_height_mm: 1900, max_height_mm: 3000, imagem_url: typologyImages["typ-su-pg1f"] },
  { id: "typ-su-pg2f", product_line_id: "line-suprema", name: "Porta de Giro 2 Folhas", category: "porta", subcategory: "giro", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 900, max_width_mm: 2400, min_height_mm: 1900, max_height_mm: 3000, imagem_url: typologyImages["typ-su-pg2f"] },
  // Veneziana
  { id: "typ-su-jc2fv", product_line_id: "line-suprema", name: "Janela de Correr 2F c/ Veneziana", category: "veneziana", subcategory: "correr", num_folhas: 2, has_veneziana: true, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 4000, min_height_mm: 500, max_height_mm: 2500, imagem_url: typologyImages["typ-su-jc2fv"] },
  { id: "typ-su-jc4fv", product_line_id: "line-suprema", name: "Janela de Correr 4F c/ Veneziana", category: "veneziana", subcategory: "correr", num_folhas: 4, has_veneziana: true, has_bandeira: false, active: true, min_width_mm: 1200, max_width_mm: 6000, min_height_mm: 500, max_height_mm: 2500, imagem_url: typologyImages["typ-su-jc4fv"] },
  // Basculante
  { id: "typ-su-jbas1", product_line_id: "line-suprema", name: "Basculante 1 Folha", category: "basculante", subcategory: "basculante", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 300, max_width_mm: 1200, min_height_mm: 300, max_height_mm: 800, imagem_url: typologyImages["typ-su-jc2f"] },
  { id: "typ-su-jbas2", product_line_id: "line-suprema", name: "Basculante 2 Folhas", category: "basculante", subcategory: "basculante", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 2000, min_height_mm: 300, max_height_mm: 800, imagem_url: typologyImages["typ-su-jc2f"] },
  // Vitro Fixo
  { id: "typ-su-vfix", product_line_id: "line-suprema", name: "Vitrô Fixo", category: "vitro", subcategory: "fixo", num_folhas: 0, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 300, max_width_mm: 3000, min_height_mm: 300, max_height_mm: 3000, imagem_url: typologyImages["typ-su-vfix"] },
  // Pivotante
  { id: "typ-su-jpiv", product_line_id: "line-suprema", name: "Janela Pivotante", category: "pivotante", subcategory: "pivotante", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 400, max_width_mm: 1500, min_height_mm: 400, max_height_mm: 2000, imagem_url: typologyImages["typ-su-jpiv"] },
  // Porta Balcão
  { id: "typ-su-pbal", product_line_id: "line-suprema", name: "Porta Balcão 2F (Vidro+Veneziana)", category: "veneziana", subcategory: "correr", num_folhas: 2, has_veneziana: true, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 4000, min_height_mm: 1900, max_height_mm: 3000, imagem_url: typologyImages["typ-su-jc2fv"] },
  // Porta Camarão
  { id: "typ-su-pcam", product_line_id: "line-suprema", name: "Porta Camarão (Sanfonada)", category: "camarao", subcategory: "camarao", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 5000, min_height_mm: 1900, max_height_mm: 3000, imagem_url: typologyImages["typ-su-pc4f"] },
];

// ============================================
// 20 TIPOLOGIAS GOLD (32mm) — Com imagens
// ============================================
const goldTypologies: (Typology & { imagem_url?: string })[] = [
  // Janelas de Correr
  { id: "typ-go-jc2f", product_line_id: "line-gold", name: "Janela de Correr 2 Folhas", category: "janela", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 4500, min_height_mm: 400, max_height_mm: 2800, imagem_url: typologyImages["typ-go-jc2f"] },
  { id: "typ-go-jc3f", product_line_id: "line-gold", name: "Janela de Correr 3 Folhas", category: "janela", subcategory: "correr", num_folhas: 3, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 900, max_width_mm: 5500, min_height_mm: 400, max_height_mm: 2800, imagem_url: typologyImages["typ-go-jc2f"] },
  { id: "typ-go-jc4f", product_line_id: "line-gold", name: "Janela de Correr 4 Folhas", category: "janela", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1200, max_width_mm: 6000, min_height_mm: 400, max_height_mm: 2800, imagem_url: typologyImages["typ-go-jc4f"] },
  { id: "typ-go-jc6f", product_line_id: "line-gold", name: "Janela de Correr 6 Folhas", category: "janela", subcategory: "correr", num_folhas: 6, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1800, max_width_mm: 6000, min_height_mm: 400, max_height_mm: 2800, imagem_url: typologyImages["typ-go-jc4f"] },
  { id: "typ-go-jc4fp", product_line_id: "line-gold", name: "Janela de Correr 4F c/ Peitoril Fixo", category: "janela", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1200, max_width_mm: 6000, min_height_mm: 600, max_height_mm: 2800, imagem_url: typologyImages["typ-go-jc4f"] },
  // Maxim-Ar
  { id: "typ-go-jma1", product_line_id: "line-gold", name: "Janela Maxim-Ar 1 Folha", category: "maxim_ar", subcategory: "maxim_ar", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 300, max_width_mm: 1600, min_height_mm: 300, max_height_mm: 1400, imagem_url: typologyImages["typ-go-jma1"] },
  { id: "typ-go-jma2", product_line_id: "line-gold", name: "Janela Maxim-Ar 2 Folhas", category: "maxim_ar", subcategory: "maxim_ar", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 2800, min_height_mm: 300, max_height_mm: 1600, imagem_url: typologyImages["typ-go-jma2"] },
  // Camarão
  { id: "typ-go-jcam", product_line_id: "line-gold", name: "Janela Camarão", category: "camarao", subcategory: "camarao", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 5500, min_height_mm: 500, max_height_mm: 2800, imagem_url: typologyImages["typ-go-jc4f"] },
  // Portas de Correr
  { id: "typ-go-pc2f", product_line_id: "line-gold", name: "Porta de Correr 2 Folhas", category: "porta", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 5500, min_height_mm: 1900, max_height_mm: 3200, imagem_url: typologyImages["typ-go-pc2f"] },
  { id: "typ-go-pc4f", product_line_id: "line-gold", name: "Porta de Correr 4 Folhas", category: "porta", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 2000, max_width_mm: 6000, min_height_mm: 1900, max_height_mm: 3200, imagem_url: typologyImages["typ-go-pc4f"] },
  // Portas de Giro
  { id: "typ-go-pg1f", product_line_id: "line-gold", name: "Porta de Giro 1 Folha", category: "porta", subcategory: "giro", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 500, max_width_mm: 1300, min_height_mm: 1900, max_height_mm: 3200, imagem_url: typologyImages["typ-go-pg1f"] },
  { id: "typ-go-pg2f", product_line_id: "line-gold", name: "Porta de Giro 2 Folhas", category: "porta", subcategory: "giro", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 900, max_width_mm: 2600, min_height_mm: 1900, max_height_mm: 3200, imagem_url: typologyImages["typ-go-pg2f"] },
  // Veneziana
  { id: "typ-go-jc2fv", product_line_id: "line-gold", name: "Janela de Correr 2F c/ Veneziana", category: "veneziana", subcategory: "correr", num_folhas: 2, has_veneziana: true, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 4500, min_height_mm: 500, max_height_mm: 2800, imagem_url: typologyImages["typ-go-jc2fv"] },
  // Giro (Abre e Tomba)
  { id: "typ-go-jgiro", product_line_id: "line-gold", name: "Janela Giro (Abre e Tomba)", category: "janela", subcategory: "giro", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 400, max_width_mm: 1400, min_height_mm: 400, max_height_mm: 2000, imagem_url: typologyImages["typ-go-jgiro"] },
  // Porta Integrada
  { id: "typ-go-pint", product_line_id: "line-gold", name: "Porta Integrada (Correr + Fixo)", category: "porta", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, notes: "2 folhas de correr + 1 fixo", min_width_mm: 1500, max_width_mm: 6000, min_height_mm: 1900, max_height_mm: 3200, imagem_url: typologyImages["typ-go-pc2f"] },
  // Basculante
  { id: "typ-go-jbas1", product_line_id: "line-gold", name: "Basculante 1 Folha Gold", category: "basculante", subcategory: "basculante", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 300, max_width_mm: 1400, min_height_mm: 300, max_height_mm: 900, imagem_url: typologyImages["typ-go-jc2f"] },
  // Vitrô Fixo
  { id: "typ-go-vfix", product_line_id: "line-gold", name: "Vitrô Fixo Gold", category: "vitro", subcategory: "fixo", num_folhas: 0, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 300, max_width_mm: 3500, min_height_mm: 300, max_height_mm: 3500, imagem_url: typologyImages["typ-go-vfix"] },
  // Pivotante
  { id: "typ-go-jpiv", product_line_id: "line-gold", name: "Janela Pivotante Gold", category: "pivotante", subcategory: "pivotante", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 400, max_width_mm: 1600, min_height_mm: 400, max_height_mm: 2200, imagem_url: typologyImages["typ-go-jpiv"] },
  // Porta Balcão
  { id: "typ-go-pbal", product_line_id: "line-gold", name: "Porta Balcão 2F Gold", category: "veneziana", subcategory: "correr", num_folhas: 2, has_veneziana: true, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 4500, min_height_mm: 1900, max_height_mm: 3200, imagem_url: typologyImages["typ-go-jc2fv"] },
  // Porta Camarão
  { id: "typ-go-pcam", product_line_id: "line-gold", name: "Porta Camarão Gold", category: "camarao", subcategory: "camarao", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 5500, min_height_mm: 1900, max_height_mm: 3200, imagem_url: typologyImages["typ-go-pc4f"] },
];

// ============================================
// 12 TIPOLOGIAS TOP (40mm) — Fachadas e alto padrão (com imagens)
// ============================================
const topTypologies: (Typology & { imagem_url?: string })[] = [
  // Janelas de Correr
  { id: "typ-tp-jc2f", product_line_id: "line-top", name: "Janela de Correr 2 Folhas", category: "janela", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 800, max_width_mm: 5000, min_height_mm: 500, max_height_mm: 3200, imagem_url: typologyImages["typ-tp-jc2f"] },
  { id: "typ-tp-jc4f", product_line_id: "line-top", name: "Janela de Correr 4 Folhas", category: "janela", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1600, max_width_mm: 8000, min_height_mm: 500, max_height_mm: 3200, imagem_url: typologyImages["typ-tp-jc4f"] },
  // Maxim-Ar
  { id: "typ-tp-jma1", product_line_id: "line-top", name: "Janela Maxim-Ar 1 Folha", category: "maxim_ar", subcategory: "maxim_ar", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 400, max_width_mm: 1800, min_height_mm: 400, max_height_mm: 1600, imagem_url: typologyImages["typ-tp-jma1"] },
  // Portas de Correr
  { id: "typ-tp-pc2f", product_line_id: "line-top", name: "Porta de Correr 2 Folhas", category: "porta", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1200, max_width_mm: 6000, min_height_mm: 2000, max_height_mm: 3500, imagem_url: typologyImages["typ-tp-pc2f"] },
  { id: "typ-tp-pc4f", product_line_id: "line-top", name: "Porta de Correr 4 Folhas", category: "porta", subcategory: "correr", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 2400, max_width_mm: 8000, min_height_mm: 2000, max_height_mm: 3500, imagem_url: typologyImages["typ-tp-pc4f"] },
  // Portas de Giro
  { id: "typ-tp-pg1f", product_line_id: "line-top", name: "Porta de Giro 1 Folha", category: "porta", subcategory: "giro", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 600, max_width_mm: 1400, min_height_mm: 2000, max_height_mm: 3500, imagem_url: typologyImages["typ-tp-pg1f"] },
  { id: "typ-tp-pg2f", product_line_id: "line-top", name: "Porta de Giro 2 Folhas", category: "porta", subcategory: "giro", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1000, max_width_mm: 2800, min_height_mm: 2000, max_height_mm: 3500, imagem_url: typologyImages["typ-tp-pg2f"] },
  // Vitrô Fixo (pano de vidro fachada)
  { id: "typ-tp-vfix", product_line_id: "line-top", name: "Vitrô Fixo Fachada", category: "vitro", subcategory: "fixo", num_folhas: 0, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 400, max_width_mm: 4000, min_height_mm: 400, max_height_mm: 4000, imagem_url: typologyImages["typ-tp-vfix"] },
  // Porta Integrada (Correr + Fixo)
  { id: "typ-tp-pint", product_line_id: "line-top", name: "Porta Integrada (Correr + Fixo)", category: "porta", subcategory: "correr", num_folhas: 2, has_veneziana: false, has_bandeira: false, active: true, notes: "2 folhas de correr + 1 fixo", min_width_mm: 1800, max_width_mm: 8000, min_height_mm: 2000, max_height_mm: 3500, imagem_url: typologyImages["typ-tp-pc2f"] },
  // Camarão
  { id: "typ-tp-jcam", product_line_id: "line-top", name: "Janela Camarão Top", category: "camarao", subcategory: "camarao", num_folhas: 4, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 1200, max_width_mm: 6000, min_height_mm: 600, max_height_mm: 3200, imagem_url: typologyImages["typ-tp-jc4f"] },
  // Porta Balcão
  { id: "typ-tp-pbal", product_line_id: "line-top", name: "Porta Balcão Top", category: "veneziana", subcategory: "correr", num_folhas: 2, has_veneziana: true, has_bandeira: false, active: true, min_width_mm: 1200, max_width_mm: 5000, min_height_mm: 2000, max_height_mm: 3500, imagem_url: typologyImages["typ-tp-pc2f"] },
  // Pivotante
  { id: "typ-tp-jpiv", product_line_id: "line-top", name: "Janela Pivotante Top", category: "pivotante", subcategory: "pivotante", num_folhas: 1, has_veneziana: false, has_bandeira: false, active: true, min_width_mm: 500, max_width_mm: 1800, min_height_mm: 500, max_height_mm: 2500, imagem_url: typologyImages["typ-su-jpiv"] },
];

// ============================================
// EXPORTS
// ============================================
export const typologies = [
  ...supremaTypologies,
  ...goldTypologies,
  ...topTypologies,
];

export const productLines = [
  { id: "line-suprema", name: "SUPREMA (25mm)", description: "Linha econômica" },
  { id: "line-gold", name: "GOLD (32mm)", description: "Linha intermediária" },
  { id: "line-top", name: "TOP (40mm)", description: "Linha premium" },
];

export type { Typology };
