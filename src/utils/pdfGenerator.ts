import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export async function generatePdfFromElement(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    // Element not found
    return;
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const imgWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgData = canvas.toDataURL('image/png');

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
}

interface BudgetPdfData {
  cliente: string;
  produto: string;
  larguraCm: number;
  alturaCm: number;
  quantidade: number;
  areaM2: number;
  custoTotal: number;
  margem: number;
  valorFinal: number;
  empresa?: {
    nome: string;
    telefone?: string;
    email?: string;
    endereco?: string;
    logoUrl?: string;
  };
}

export async function generateBudgetPDF(data: BudgetPdfData, svgElementId: string) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Header
  pdf.setFillColor(37, 99, 235);
  pdf.rect(0, 0, pageWidth, 44, 'F');

  // Logo
  let logoEndX = margin;
  if (data.empresa?.logoUrl) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = data.empresa!.logoUrl!;
      });
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const logoData = canvas.toDataURL('image/png');
      const logoH = 16;
      const logoW = (img.width / img.height) * logoH;
      pdf.addImage(logoData, 'PNG', margin, 6, logoW, logoH);
      logoEndX = margin + logoW + 5;
    } catch {
      logoEndX = margin;
    }
  }

  // Company name or default
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text(data.empresa?.nome || 'ORÇAMENTO', logoEndX, 18);

  // Company contact info (right-aligned)
  const contactLines: string[] = [];
  if (data.empresa?.telefone) contactLines.push(data.empresa.telefone);
  if (data.empresa?.email) contactLines.push(data.empresa.email);
  if (data.empresa?.endereco) contactLines.push(data.empresa.endereco);

  if (contactLines.length > 0) {
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    contactLines.forEach((line, i) => {
      pdf.text(line, pageWidth - margin, 10 + i * 4, { align: 'right' });
    });
  }

  // Date and client below company name
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, logoEndX, 28);
  pdf.text(`Cliente: ${data.cliente}`, logoEndX, 34);

  // "ORÇAMENTO" subtitle if company name was used
  if (data.empresa?.nome) {
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ORÇAMENTO', logoEndX, 40);
  }

  y = 54;

  // Product info section
  pdf.setTextColor(30, 30, 30);
  pdf.setFontSize(13);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Dados do Produto', margin, y);
  y += 8;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const rows = [
    ['Produto', data.produto],
    ['Dimensões', `${data.larguraCm} × ${data.alturaCm} cm`],
    ['Quantidade', String(data.quantidade)],
    ['Área unitária', `${data.areaM2.toFixed(2)} m²`],
  ];

  for (const [label, value] of rows) {
    pdf.setTextColor(100, 100, 100);
    pdf.text(label, margin, y);
    pdf.setTextColor(30, 30, 30);
    pdf.setFont('helvetica', 'bold');
    pdf.text(value, margin + 50, y);
    pdf.setFont('helvetica', 'normal');
    y += 7;
  }

  y += 5;

  // Pricing section
  pdf.setDrawColor(220, 220, 220);
  pdf.line(margin, y, margin + contentWidth, y);
  y += 8;

  pdf.setFontSize(13);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 30, 30);
  pdf.text('Valores', margin, y);
  y += 8;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const formatBRL = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const priceRows = [
    ['Custo estimado', formatBRL(data.custoTotal)],
    ['Margem (35%)', formatBRL(data.margem)],
  ];

  for (const [label, value] of priceRows) {
    pdf.setTextColor(100, 100, 100);
    pdf.text(label, margin, y);
    pdf.setTextColor(30, 30, 30);
    pdf.text(value, margin + contentWidth, y, { align: 'right' });
    y += 7;
  }

  y += 3;
  pdf.setDrawColor(37, 99, 235);
  pdf.setLineWidth(0.5);
  pdf.line(margin, y, margin + contentWidth, y);
  y += 8;

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(37, 99, 235);
  pdf.text('Valor Final', margin, y);
  pdf.text(formatBRL(data.valorFinal), margin + contentWidth, y, { align: 'right' });
  y += 15;

  // SVG Preview
  const svgElement = document.getElementById(svgElementId);
  if (svgElement) {
    try {
      const canvas = await html2canvas(svgElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const imgAspect = canvas.width / canvas.height;
      const maxImgWidth = contentWidth * 0.7;
      const imgW = maxImgWidth;
      const imgH = imgW / imgAspect;

      // Check if fits on current page
      if (y + imgH + 20 > 280) {
        pdf.addPage();
        y = margin;
      }

      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 30, 30);
      pdf.text('Visualização da Esquadria', margin, y);
      y += 8;

      const imgX = margin + (contentWidth - imgW) / 2;
      pdf.addImage(imgData, 'PNG', imgX, y, imgW, imgH);
    } catch (err) {
      // Could not capture SVG
    }
  }

  pdf.save(`orcamento-${data.cliente.replace(/\s+/g, '-').toLowerCase() || 'novo'}.pdf`);
}
