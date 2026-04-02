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
];

export function getColorById(id: string): AluminumColor {
  return aluminumColors.find(c => c.id === id) ?? aluminumColors[0];
}
