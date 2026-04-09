// Aluminum color presets for frame visualization
export interface AluminumColor {
  id: string;
  name: string;
  hex: string;
  frameColor: string;      // Main profile color
  frameDark: string;        // Shadow/depth color
  frameLight: string;       // Highlight color
  glassColor: string;       // Glass tint
  glassOpacity: number;
}

export const aluminumColors: AluminumColor[] = [
  {
    id: "natural",
    name: "Natural (Fosco)",
    hex: "#C0C0C0",
    frameColor: "#B8B8B8",
    frameDark: "#8A8A8A",
    frameLight: "#D4D4D4",
    glassColor: "#B8D4E8",
    glassOpacity: 0.35,
  },
  {
    id: "branco",
    name: "Branco",
    hex: "#F0F0F0",
    frameColor: "#EBEBEB",
    frameDark: "#C8C8C8",
    frameLight: "#FFFFFF",
    glassColor: "#C8E0F0",
    glassOpacity: 0.3,
  },
  {
    id: "preto",
    name: "Preto",
    hex: "#333333",
    frameColor: "#2D2D2D",
    frameDark: "#1A1A1A",
    frameLight: "#484848",
    glassColor: "#90B8D4",
    glassOpacity: 0.4,
  },
  {
    id: "bronze",
    name: "Bronze",
    hex: "#8B6914",
    frameColor: "#7A5C10",
    frameDark: "#5A4008",
    frameLight: "#A07820",
    glassColor: "#B8D4E8",
    glassOpacity: 0.35,
  },
  {
    id: "champagne",
    name: "Champagne",
    hex: "#D4C4A0",
    frameColor: "#C8B890",
    frameDark: "#A09070",
    frameLight: "#E0D4B8",
    glassColor: "#B8D4E8",
    glassOpacity: 0.3,
  },
  {
    id: "grafite",
    name: "Grafite",
    hex: "#505050",
    frameColor: "#484848",
    frameDark: "#303030",
    frameLight: "#606060",
    glassColor: "#90B8D4",
    glassOpacity: 0.38,
  },
  {
    id: "corten",
    name: "Corten",
    hex: "#8B4513",
    frameColor: "#7A3B10",
    frameDark: "#5A2808",
    frameLight: "#A05018",
    glassColor: "#B8D4E8",
    glassOpacity: 0.35,
  },
  // Cores amadeiradas — Metal Centenário Amadeirado
  {
    id: "carvalho",
    name: "Carvalho",
    hex: "#8B6F47",
    frameColor: "#7D6340",
    frameDark: "#5A4830",
    frameLight: "#A08058",
    glassColor: "#B8D4E8",
    glassOpacity: 0.35,
  },
  {
    id: "mogno",
    name: "Mogno",
    hex: "#6B3A2A",
    frameColor: "#5E3224",
    frameDark: "#3E2018",
    frameLight: "#804838",
    glassColor: "#B8D4E8",
    glassOpacity: 0.35,
  },
  {
    id: "imbuia",
    name: "Imbuia",
    hex: "#5C4033",
    frameColor: "#50362B",
    frameDark: "#38261E",
    frameLight: "#6E5040",
    glassColor: "#B8D4E8",
    glassOpacity: 0.35,
  },
  {
    id: "cerejeira",
    name: "Cerejeira",
    hex: "#A0522D",
    frameColor: "#904828",
    frameDark: "#6B3520",
    frameLight: "#B86038",
    glassColor: "#B8D4E8",
    glassOpacity: 0.35,
  },
  {
    id: "marfim",
    name: "Marfim",
    hex: "#E8D8B8",
    frameColor: "#DDD0AA",
    frameDark: "#C0B090",
    frameLight: "#F0E4C8",
    glassColor: "#C8E0F0",
    glassOpacity: 0.3,
  },
];

// Mapeamento de cores disponíveis por linha de produto (fabricante)
// Baseado nos catálogos oficiais de cada fabricante
export const colorsByProductLine: Record<string, string[]> = {
  // Alcoa / Novelis — cores padrão anodizado
  "line-suprema": ["natural", "branco", "preto", "bronze", "champagne"],
  "line-gold": ["natural", "branco", "preto", "bronze", "champagne"],
  "line-top": ["natural", "branco", "preto", "bronze", "champagne"],
  "line-suprema-plus": ["natural", "branco", "preto", "bronze", "champagne"],

  // Decamp — catálogo completo com pintura eletrostática
  "line-decamp45": ["natural", "branco", "preto", "bronze", "champagne", "grafite", "corten"],
  "line-decamp-pratic20": ["natural", "branco", "preto", "bronze", "champagne", "grafite"],
  "line-decamp-pratic25": ["natural", "branco", "preto", "bronze", "champagne", "grafite"],
  "line-decamp-pratic30": ["natural", "branco", "preto", "bronze", "champagne", "grafite"],
  "line-decamp-pratic32": ["natural", "branco", "preto", "bronze", "champagne", "grafite"],
  "line-decamp-pratic42": ["natural", "branco", "preto", "bronze", "champagne", "grafite"],
  "line-decamp-fachada": ["natural", "branco", "preto", "bronze", "champagne", "grafite", "corten"],
  "line-decamp-perfetta-fachada": ["natural", "branco", "preto", "bronze", "champagne", "grafite", "corten"],
  "line-decamp-estufas": ["natural", "branco"],
  "line-decamp-muxarabi": ["natural", "branco", "preto", "bronze", "champagne", "grafite", "corten"],
  "line-decamp-geral": ["natural", "branco", "preto", "bronze", "champagne", "grafite"],

  // Metal Centenário — Máxima e Perfetta
  "line-cent-maxima": ["natural", "branco", "preto", "bronze", "champagne", "grafite", "corten"],
  "line-cent-perfetta": ["natural", "branco", "preto", "bronze", "champagne", "grafite", "corten"],
  // Centenário Amadeirado — cores amadeiradas + padrão
  "line-cent-amadeirado": ["natural", "branco", "preto", "carvalho", "mogno", "imbuia", "cerejeira", "marfim"],
  // Centenário Padronizados — natural apenas (sem pintura)
  "line-cent-padronizado": ["natural"],
};

/** Retorna as cores disponíveis para uma linha de produto. Se não mapeado, retorna todas. */
export function getColorsForLine(productLineId?: string): AluminumColor[] {
  if (!productLineId || !colorsByProductLine[productLineId]) {
    return aluminumColors;
  }
  const allowedIds = colorsByProductLine[productLineId];
  return aluminumColors.filter(c => allowedIds.includes(c.id));
}

export function getColorById(id: string): AluminumColor {
  return aluminumColors.find(c => c.id === id) ?? aluminumColors[0];
}
