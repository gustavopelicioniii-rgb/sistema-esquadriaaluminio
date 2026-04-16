// Online Proposal - Generate shareable links for clients
// Client can view, approve/reject, and digitally sign proposals

import type { CalculationOutput } from "@/types/calculation";

export interface ProposalItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface ProposalData {
  id: string;
  createdAt: string;
  validUntil: string;
  client: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  items: ProposalItem[];
  subtotal: number;
  discount: number;
  total: number;
  notes?: string;
  status: "pending" | "approved" | "rejected" | "expired";
  // Metadata
  companyName?: string;
  companyLogo?: string;
  salesmanName?: string;
  salesmanPhone?: string;
}

export interface ProposalLink {
  token: string;
  url: string;
  expiresAt: string;
  proposalId: string;
}

// Generate unique token for proposal
function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Create proposal from calculation
export function createProposalFromCalculation(
  calculation: CalculationOutput,
  clientData: {
    name: string;
    email?: string;
    phone?: string;
  },
  options: {
    validDays?: number;
    discount?: number;
    notes?: string;
    companyName?: string;
  } = {}
): ProposalData {
  const { validDays = 15, discount = 0, notes, companyName } = options;

  // Convert calculation to proposal items
  const items: ProposalItem[] = [];

  // Add profile cuts
  for (const cut of calculation.cuts) {
    items.push({
      description: `Perfil ${cut.piece_name}`,
      quantity: cut.quantity,
      unit: "pcs",
      unitPrice: cut.price_per_mm || 0,
      totalPrice: cut.total_price || cut.cut_length_mm * (cut.price_per_mm || 0) * cut.quantity,
    });
  }

  // Add glass
  if (calculation.glass) {
    items.push({
      description: `Vidro ${calculation.glass.glass_type || " temperado"} ${calculation.glass.thickness_mm}mm`,
      quantity: calculation.glass.quantity || 1,
      unit: "m²",
      unitPrice: calculation.glass.price_per_m2 || 0,
      totalPrice: calculation.glass.total_price || 0,
    });
  }

  // Add components
  for (const comp of calculation.components) {
    items.push({
      description: comp.component_name,
      quantity: comp.quantity,
      unit: comp.unit || "pcs",
      unitPrice: comp.unit_price || 0,
      totalPrice: comp.total_price || 0,
    });
  }

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const total = subtotal - discount;

  const now = new Date();
  const expires = new Date(now.getTime() + validDays * 24 * 60 * 60 * 1000);

  return {
    id: `PRO-${Date.now()}`,
    createdAt: now.toISOString(),
    validUntil: expires.toISOString(),
    client: clientData,
    items,
    subtotal,
    discount,
    total,
    notes,
    status: "pending",
    companyName,
  };
}

// Generate shareable link
export function generateProposalLink(proposal: ProposalData): ProposalLink {
  const token = generateToken();
  
  // In a real app, this would save to database
  // For now, we'll use localStorage + URL params
  const baseUrl = window.location.origin;
  const url = `${baseUrl}/proposta/${token}`;

  return {
    token,
    url,
    expiresAt: proposal.validUntil,
    proposalId: proposal.id,
  };
}

// Encode proposal for URL
export function encodeProposalForUrl(proposal: ProposalData): string {
  const data = JSON.stringify(proposal);
  return btoa(encodeURIComponent(data));
}

// Decode proposal from URL
export function decodeProposalFromUrl(encoded: string): ProposalData | null {
  try {
    const data = decodeURIComponent(atob(encoded));
    return JSON.parse(data);
  } catch {
    return null;
  }
}

// Share proposal via native share API or fallback
export async function shareProposal(link: ProposalLink, proposal: ProposalData): Promise<boolean> {
  const shareData = {
    title: `Proposta ${proposal.id}`,
    text: `Olá ${proposal.client.name}, segue nossa proposta comercial. Válida até ${new Date(link.expiresAt).toLocaleDateString("pt-BR")}.`,
    url: link.url,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return true;
    } catch {
      // User cancelled or error
      return false;
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`);
      return true;
    } catch {
      return false;
    }
  }
}

// Format currency
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// Generate HTML for proposal (for email/print)
export function generateProposalHTML(proposal: ProposalData): string {
  const itemsHTML = proposal.items
    .map(
      (item) => `
    <tr>
      <td>${item.description}</td>
      <td style="text-align: center">${item.quantity}</td>
      <td style="text-align: center">${item.unit}</td>
      <td style="text-align: right">${formatCurrency(item.unitPrice)}</td>
      <td style="text-align: right">${formatCurrency(item.totalPrice)}</td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Proposta ${proposal.id}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
    .header { text-align: center; margin-bottom: 30px; }
    .company { font-size: 24px; font-weight: bold; color: #7c3aed; }
    .title { font-size: 18px; margin-top: 10px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
    .info-box { background: #f9f9f9; padding: 15px; border-radius: 8px; }
    .info-box h3 { margin-top: 0; color: #7c3aed; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { background: #7c3aed; color: white; padding: 10px; text-align: left; }
    td { padding: 8px; border-bottom: 1px solid #ddd; }
    .total-row { font-weight: bold; background: #f9f9f9; }
    .status { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
    .status.pending { background: #fef3c7; color: #92400e; }
    .status.approved { background: #d1fae5; color: #065f46; }
    .status.rejected { background: #fee2e2; color: #991b1b; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 40px; }
    .valid { color: #dc2626; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header">
    <div class="company">${proposal.companyName || "AluFlow"}</div>
    <div class="title">Proposta Comercial - ${proposal.id}</div>
  </div>

  <div class="info-grid">
    <div class="info-box">
      <h3>Dados do Cliente</h3>
      <p><strong>Nome:</strong> ${proposal.client.name}</p>
      ${proposal.client.email ? `<p><strong>Email:</strong> ${proposal.client.email}</p>` : ""}
      ${proposal.client.phone ? `<p><strong>Telefone:</strong> ${proposal.client.phone}</p>` : ""}
      ${proposal.client.address ? `<p><strong>Endereço:</strong> ${proposal.client.address}</p>` : ""}
    </div>
    <div class="info-box">
      <h3>Dados da Proposta</h3>
      <p><strong>Criação:</strong> ${new Date(proposal.createdAt).toLocaleDateString("pt-BR")}</p>
      <p><strong>Validade:</strong> <span class="valid">${new Date(proposal.validUntil).toLocaleDateString("pt-BR")}</span></p>
      <p><strong>Status:</strong> <span class="status ${proposal.status}">${proposal.status.toUpperCase()}</span></p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Descrição</th>
        <th style="text-align: center">Qtd</th>
        <th style="text-align: center">Unidade</th>
        <th style="text-align: right">Valor Unit.</th>
        <th style="text-align: right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHTML}
    </tbody>
  </table>

  <table style="width: 300px; margin-left: auto;">
    <tr>
      <td>Subtotal:</td>
      <td style="text-align: right">${formatCurrency(proposal.subtotal)}</td>
    </tr>
    ${proposal.discount > 0 ? `
    <tr>
      <td>Desconto:</td>
      <td style="text-align: right; color: #059669;">-${formatCurrency(proposal.discount)}</td>
    </tr>
    ` : ""}
    <tr class="total-row">
      <td>Total:</td>
      <td style="text-align: right; font-size: 18px;">${formatCurrency(proposal.total)}</td>
    </tr>
  </table>

  ${proposal.notes ? `
  <div style="margin-top: 30px;">
    <h3>Observações</h3>
    <p>${proposal.notes}</p>
  </div>
  ` : ""}

  <div class="footer">
    <p>Proposta gerada por AluFlow - Sistema de Gestão para Esquadrias de Alumínio</p>
    <p>Este documento é válido até ${new Date(proposal.validUntil).toLocaleDateString("pt-BR")}</p>
  </div>
</body>
</html>
  `;
}
