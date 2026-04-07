import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface BudgetItem {
  descricao: string;
  dimensoes: string;
  quantidade: number;
  area: string;
  valorUnitario: string;
  valorTotal: string;
}

interface EmpresaData {
  nome: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  cnpj?: string;
  logoUrl?: string;
}

interface BudgetPdfConfig {
  numero?: string;
  cliente: string;
  clienteTelefone?: string;
  clienteEmail?: string;
  clienteEndereco?: string;
  produto: string;
  larguraCm: number;
  alturaCm: number;
  quantidade: number;
  areaM2: number;
  custoTotal: number;
  margem: number;
  valorFinal: number;
  corAluminio?: string;
  corFerragem?: string;
  tipoVidro?: string;
  ambiente?: string;
  observacoes?: string;
  empresa?: EmpresaData;
  condicoesComerciais?: string[];
  validadeDias?: number;
}

const formatBRL = (v: number) => {
  const num = typeof v === "number" && !isNaN(v) ? v : 0;
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const formatDateBR = () =>
  new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

async function loadImage(url: string): Promise<string | null> {
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}

export async function generateProfessionalBudgetPDF(
  config: BudgetPdfConfig,
  svgElementId?: string
) {
  const pdf = new jsPDF("p", "mm", "a4");
  const W = 210;
  const H = 297;
  const M = 15;
  const CW = W - M * 2;
  let y = 0;

  // Safe text wrapper to prevent "Invalid arguments" errors
  const safeText = (text: any, x: number, yPos: number, options?: any) => {
    const str = text == null ? "" : String(text);
    if (options) {
      safeText(str, x, yPos, options);
    } else {
      safeText(str, x, yPos);
    }
  };

  // ─── HEADER BAR ───
  pdf.setFillColor(37, 99, 235);
  pdf.rect(0, 0, W, 48, "F");

  let logoEndX = M;
  if (config.empresa?.logoUrl) {
    const logoData = await loadImage(config.empresa.logoUrl);
    if (logoData) {
      const logoH = 18;
      const logoW = logoH; // square fallback
      pdf.addImage(logoData, "PNG", M, 6, logoW, logoH);
      logoEndX = M + logoW + 5;
    }
  }

  // Company name
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  safeText(config.empresa?.nome || "ORÇAMENTO", logoEndX, 20);

  // Company subtitle info
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  const contactLines: string[] = [];
  if (config.empresa?.cnpj) contactLines.push(`CNPJ: ${config.empresa.cnpj}`);
  if (config.empresa?.telefone) contactLines.push(config.empresa.telefone);
  if (config.empresa?.email) contactLines.push(config.empresa.email);
  if (config.empresa?.endereco) contactLines.push(config.empresa.endereco);
  if (contactLines.length > 0) {
    contactLines.forEach((line, i) => {
      safeText(line, W - M, 10 + i * 4, { align: "right" });
    });
  }

  // Doc title + number
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  const docTitle = config.numero ? `ORÇAMENTO ${config.numero}` : "ORÇAMENTO";
  safeText(docTitle, logoEndX, 32);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  safeText(`Data: ${formatDateBR()}`, logoEndX, 38);
  if (config.validadeDias) {
    safeText(`Validade: ${config.validadeDias} dias`, logoEndX, 43);
  }

  y = 56;

  // ─── CLIENT INFO ───
  pdf.setTextColor(37, 99, 235);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  safeText("DADOS DO CLIENTE", M, y);
  y += 2;
  pdf.setDrawColor(37, 99, 235);
  pdf.setLineWidth(0.5);
  pdf.line(M, y, M + CW, y);
  y += 6;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(30, 30, 30);

  const clientRows: [string, string][] = [
    ["Cliente", config.cliente || "-"],
  ];
  if (config.clienteTelefone) clientRows.push(["Telefone", config.clienteTelefone]);
  if (config.clienteEmail) clientRows.push(["E-mail", config.clienteEmail]);
  if (config.clienteEndereco) clientRows.push(["Endereço", config.clienteEndereco]);

  for (const [label, value] of clientRows) {
    pdf.setTextColor(120, 120, 120);
    safeText(`${label}:`, M, y);
    pdf.setTextColor(30, 30, 30);
    pdf.setFont("helvetica", "bold");
    safeText(value, M + 30, y);
    pdf.setFont("helvetica", "normal");
    y += 6;
  }

  y += 4;

  // ─── ITEMS TABLE ───
  pdf.setTextColor(37, 99, 235);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  safeText("ITENS DO ORÇAMENTO", M, y);
  y += 2;
  pdf.setDrawColor(37, 99, 235);
  pdf.line(M, y, M + CW, y);
  y += 4;

  // Table header
  const colX = [M, M + 55, M + 95, M + 115, M + 140, M + CW];
  const headers = ["Produto", "Dimensões", "Qtd", "Área m²", "Unit.", "Total"];

  pdf.setFillColor(240, 244, 255);
  pdf.rect(M, y - 3, CW, 8, "F");
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(37, 99, 235);
  headers.forEach((h, i) => {
    const align = i >= 3 ? "right" : "left";
    const x = i >= 3 ? colX[i + 1] : colX[i];
    if (align === "right") {
      safeText(h, x, y, { align: "right" });
    } else {
      safeText(h, x, y);
    }
  });
  y += 7;

  // Table row
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(30, 30, 30);
  pdf.setFontSize(9);

  const specs: string[] = [];
  if (config.corAluminio) specs.push(`Cor: ${config.corAluminio}`);
  if (config.tipoVidro && config.tipoVidro !== "Nenhum") specs.push(`Vidro: ${config.tipoVidro}`);
  if (config.corFerragem) specs.push(`Ferragem: ${config.corFerragem}`);
  if (config.ambiente) specs.push(`Amb: ${config.ambiente}`);
  const specsLine = specs.join(" | ");

  safeText(config.produto || "-", colX[0], y);
  safeText(`${config.larguraCm ?? 0}x${config.alturaCm ?? 0} cm`, colX[1], y);
  safeText(String(config.quantidade ?? 1), colX[2], y);
  safeText((config.areaM2 ?? 0).toFixed(2), colX[4], y, { align: "right" });
  const unitPrice = (config.valorFinal ?? 0) / (config.quantidade || 1);
  safeText(formatBRL(unitPrice), colX[5] - (CW - 140), y, { align: "right" });
  safeText(formatBRL(config.valorFinal ?? 0), colX[5], y, { align: "right" });
  y += 5;

  if (specsLine) {
    pdf.setFontSize(7);
    pdf.setTextColor(120, 120, 120);
    safeText(specsLine, colX[0] + 2, y);
    y += 5;
  }

  // Separator
  pdf.setDrawColor(220, 220, 220);
  pdf.line(M, y, M + CW, y);
  y += 6;

  // ─── PRICING SUMMARY ───
  pdf.setTextColor(37, 99, 235);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  safeText("RESUMO FINANCEIRO", M, y);
  y += 2;
  pdf.setDrawColor(37, 99, 235);
  pdf.line(M, y, M + CW, y);
  y += 7;

  pdf.setFontSize(10);
  const summaryRows: [string, string, string?][] = [
    ["Custo estimado", formatBRL(config.custoTotal)],
    ["Margem de lucro", formatBRL(config.margem)],
  ];

  for (const [label, value] of summaryRows) {
    pdf.setTextColor(100, 100, 100);
    pdf.setFont("helvetica", "normal");
    safeText(label, M, y);
    pdf.setTextColor(30, 30, 30);
    safeText(value, M + CW, y, { align: "right" });
    y += 7;
  }

  // Total highlight
  y += 2;
  pdf.setFillColor(37, 99, 235);
  pdf.roundedRect(M, y - 5, CW, 14, 2, 2, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(13);
  pdf.setFont("helvetica", "bold");
  safeText("VALOR TOTAL", M + 5, y + 3);
  safeText(formatBRL(config.valorFinal), M + CW - 5, y + 3, { align: "right" });
  y += 16;

  // ─── SVG PREVIEW ───
  if (svgElementId) {
    const svgElement = document.getElementById(svgElementId);
    if (svgElement) {
      try {
        const canvas = await html2canvas(svgElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        });
        const imgData = canvas.toDataURL("image/png");
        const imgAspect = canvas.width / canvas.height;
        const maxImgW = CW * 0.5;
        const imgW = maxImgW;
        const imgH = imgW / imgAspect;

        if (y + imgH + 20 > H - 60) {
          pdf.addPage();
          y = M;
        }

        pdf.setTextColor(37, 99, 235);
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        safeText("VISUALIZAÇÃO DO PRODUTO", M, y);
        y += 2;
        pdf.setDrawColor(37, 99, 235);
        pdf.line(M, y, M + CW, y);
        y += 6;

        const imgX = M + (CW - imgW) / 2;
        pdf.setDrawColor(230, 230, 230);
        pdf.setLineWidth(0.3);
        pdf.rect(imgX - 2, y - 2, imgW + 4, imgH + 4);
        pdf.addImage(imgData, "PNG", imgX, y, imgW, imgH);
        y += imgH + 10;
      } catch {
        // skip preview
      }
    }
  }

  // ─── CONDIÇÕES COMERCIAIS ───
  const condicoes = config.condicoesComerciais ?? [
    "Validade da proposta: 15 dias.",
    "Prazo de entrega: a combinar após aprovação.",
    "Pagamento: 50% na aprovação, 50% na entrega.",
    "Garantia de 5 anos contra defeitos de fabricação.",
    "Instalação não inclusa, salvo acordo prévio.",
    "Cores e dimensões conforme especificação acima.",
  ];

  if (y + condicoes.length * 5 + 30 > H - 50) {
    pdf.addPage();
    y = M;
  }

  pdf.setTextColor(37, 99, 235);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  safeText("CONDIÇÕES COMERCIAIS", M, y);
  y += 2;
  pdf.setDrawColor(37, 99, 235);
  pdf.line(M, y, M + CW, y);
  y += 6;

  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(60, 60, 60);
  condicoes.forEach((cond) => {
    safeText(`-  ${cond}`, M + 2, y);
    y += 5;
  });

  y += 4;

  // ─── OBSERVAÇÕES ───
  if (config.observacoes) {
    pdf.setTextColor(37, 99, 235);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    safeText("OBSERVAÇÕES", M, y);
    y += 5;
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(60, 60, 60);
    const lines = pdf.splitTextToSize(config.observacoes, CW - 4);
    safeText(lines, M + 2, y);
    y += lines.length * 4 + 6;
  }

  // ─── ASSINATURA ───
  if (y + 50 > H - M) {
    pdf.addPage();
    y = M + 20;
  }

  const sigY = Math.max(y + 10, H - 55);
  pdf.setDrawColor(180, 180, 180);
  pdf.setLineWidth(0.3);

  // Left signature (company)
  const sigW = CW / 2 - 10;
  pdf.line(M, sigY, M + sigW, sigY);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(30, 30, 30);
  safeText(config.empresa?.nome || "Empresa", M + sigW / 2, sigY + 5, { align: "center" });
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(120, 120, 120);
  safeText("Responsável", M + sigW / 2, sigY + 9, { align: "center" });

  // Right signature (client)
  const sigX2 = M + CW / 2 + 10;
  pdf.line(sigX2, sigY, sigX2 + sigW, sigY);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(30, 30, 30);
  safeText(config.cliente || "Cliente", sigX2 + sigW / 2, sigY + 5, { align: "center" });
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(120, 120, 120);
  safeText("Cliente", sigX2 + sigW / 2, sigY + 9, { align: "center" });

  // ─── FOOTER ───
  const footY = H - 8;
  pdf.setDrawColor(220, 220, 220);
  pdf.line(M, footY - 4, M + CW, footY - 4);
  pdf.setFontSize(7);
  pdf.setTextColor(160, 160, 160);
  pdf.setFont("helvetica", "normal");
  safeText(`Documento gerado em ${formatDateBR()}`, M, footY);
  safeText("Página 1 de 1", M + CW, footY, { align: "right" });

  // Save
  const safeName = config.cliente.replace(/\s+/g, "-").toLowerCase() || "novo";
  const numSuffix = config.numero ? `-${config.numero}` : "";
  pdf.save(`orcamento-${safeName}${numSuffix}.pdf`);
}
