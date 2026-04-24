// Company Branding Configuration
// Configure logo, colors, and contract terms for PDF exports

export interface CompanyBranding {
  // Company Info
  companyName: string;
  tagline?: string;
  cnpj?: string;
  ie?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  cep?: string;
  
  // Logo
  logoUrl?: string;  // URL or base64
  logoPosition?: "left" | "center" | "right";
  
  // Colors (hex)
  primaryColor: string;  // Main brand color
  secondaryColor: string; // Secondary color
  accentColor: string;    // Accent/highlight
  
  // Fonts
  fontFamily?: string;
  
  // Contract Terms
  contractTerms?: string;
  warrantyTerms?: string;
  paymentConditions?: string;
  deliveryTerms?: string;
  installationTerms?: string;
  
  // Bank info for payment
  bankInfo?: {
    bank: string;
    agency: string;
    account: string;
    ccpj?: string;
    operations?: string;
  };
  
  // Social media
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
}

// Default branding template
export const defaultBranding: CompanyBranding = {
  companyName: "Sua Empresa de Esquadrias",
  tagline: "Qualidade e tradição em alumínio",
  primaryColor: "#1e3a5f",     // Dark blue
  secondaryColor: "#2d5a87",   // Medium blue
  accentColor: "#f59e0b",      // Amber
  contractTerms: `1. O presente orçamento tem validade de 10 dias corridos a partir da data de emissão.
2. O início dos serviços está condicionado à aprovação deste orçamento e pagamento de 50% de entrada.
3. O restante do valor deve ser pago na entrega/ent installation.
4. alterations e aceitações devem ser feitas por escrito.
5. O prazo de entrega começa a contar após aprovação e confirmação do pagamento.`,
  warrantyTerms: `1. Garantia de 5 anos contra defeitos de fabricação.
2. A garantia não cobre danos por uso indevido, mau uso ou terceros.
3. Vidros danificados durante a instalação não são cobertos pela garantia.
4. Para acionar a garantia, apresentar este documento.`,
  paymentConditions: `• Entrada: 50% na aprovação do orçamento
• Saída: 50% na entrega dos materiais
• Aceitamos: PIX, transferência, boleto
• Prazo de entrega: 15 a 25 dias úteis após aprovação`,
  deliveryTerms: `• Entrega em nossa fábrica ou obra (consulte)
• A responsabilidade de descarga é do cliente
• Verificar mercadorias no ato da entrega
• Reclamações devem ser feitas em até 24h`,
};

// Brazilian common colors for aluminum
export const aluminumColorOptions = [
  { id: "natural", name: "Alumínio Natural", hex: "#C0C0C0" },
  { id: "branco", name: "Branco", hex: "#FFFFFF" },
  { id: "bronze", name: "Bronze", hex: "#8B4513" },
  { id: "preto", name: "Preto", hex: "#1A1A1A" },
  { id: "champagne", name: "Champagne", hex: "#F7E7CE" },
  { id: "grafite", name: "Grafite", hex: "#4A4A4A" },
  { id: "marrom", name: "Marrom", hex: "#654321" },
  { id: "verde", name: "Verde", hex: "#228B22" },
  { id: "azul", name: "Azul", hex: "#1E90FF" },
];

// Save/Load branding from localStorage
export function saveBranding(branding: CompanyBranding): void {
  try {
    localStorage.setItem("aluflow_branding", JSON.stringify(branding));
  } catch {
    // localStorage unavailable
  }
}

export function loadBranding(): CompanyBranding {
  try {
    const stored = localStorage.getItem("aluflow_branding");
    if (stored) {
      return { ...defaultBranding, ...JSON.parse(stored) };
    }
  } catch {
    // ignore parse errors or localStorage unavailability
  }
  return defaultBranding;
}

// Convert hex to RGB array for jsPDF
export function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
    ];
  }
  return [0, 0, 0];
}

// Darken a hex color
export function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  const darkened = rgb.map((c) => Math.max(0, Math.floor(c * (1 - percent / 100))));
  return `#${darkened.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

// Lighten a hex color
export function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  const lightened = rgb.map((c) => Math.min(255, Math.floor(c + (255 - c) * (percent / 100))));
  return `#${lightened.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}
