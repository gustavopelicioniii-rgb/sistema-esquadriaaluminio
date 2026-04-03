import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export async function generatePdfFromElement(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID "${elementId}" not found.`);
    return;
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  });

  const imgWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const pdf = new jsPDF("p", "mm", "a4");
  const imgData = canvas.toDataURL("image/png");

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
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
}

export async function generateBudgetPDF(data: BudgetPdfData, svgElementId: string) {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Header
  pdf.setFillColor(37, 99, 235); // primary blue
  pdf.rect(0, 0, pageWidth, 40, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.text("ORÇAMENTO", margin, 18);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, margin, 28);
  pdf.text(`Cliente: ${data.cliente}`, margin, 34);
  y = 50;

  // Product info section
  pdf.setTextColor(30, 30, 30);
  pdf.setFontSize(13);
  pdf.setFont("helvetica", "bold");
  pdf.text("Dados do Produto", margin, y);
  y += 8;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  const rows = [
    ["Produto", data.produto],
    ["Dimensões", `${data.larguraCm} × ${data.alturaCm} cm`],
    ["Quantidade", String(data.quantidade)],
    ["Área unitária", `${data.areaM2.toFixed(2)} m²`],
  ];

  for (const [label, value] of rows) {
    pdf.setTextColor(100, 100, 100);
    pdf.text(label, margin, y);
    pdf.setTextColor(30, 30, 30);
    pdf.setFont("helvetica", "bold");
    pdf.text(value, margin + 50, y);
    pdf.setFont("helvetica", "normal");
    y += 7;
  }

  y += 5;

  // Pricing section
  pdf.setDrawColor(220, 220, 220);
  pdf.line(margin, y, margin + contentWidth, y);
  y += 8;

  pdf.setFontSize(13);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(30, 30, 30);
  pdf.text("Valores", margin, y);
  y += 8;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  const formatBRL = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const priceRows = [
    ["Custo estimado", formatBRL(data.custoTotal)],
    ["Margem (35%)", formatBRL(data.margem)],
  ];

  for (const [label, value] of priceRows) {
    pdf.setTextColor(100, 100, 100);
    pdf.text(label, margin, y);
    pdf.setTextColor(30, 30, 30);
    pdf.text(value, margin + contentWidth, y, { align: "right" });
    y += 7;
  }

  y += 3;
  pdf.setDrawColor(37, 99, 235);
  pdf.setLineWidth(0.5);
  pdf.line(margin, y, margin + contentWidth, y);
  y += 8;

  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(37, 99, 235);
  pdf.text("Valor Final", margin, y);
  pdf.text(formatBRL(data.valorFinal), margin + contentWidth, y, { align: "right" });
  y += 15;

  // SVG Preview
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
      const maxImgWidth = contentWidth * 0.7;
      const imgW = maxImgWidth;
      const imgH = imgW / imgAspect;

      // Check if fits on current page
      if (y + imgH + 20 > 280) {
        pdf.addPage();
        y = margin;
      }

      pdf.setFontSize(13);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(30, 30, 30);
      pdf.text("Visualização da Esquadria", margin, y);
      y += 8;

      const imgX = margin + (contentWidth - imgW) / 2;
      pdf.addImage(imgData, "PNG", imgX, y, imgW, imgH);
    } catch (err) {
      console.warn("Could not capture SVG preview for PDF:", err);
    }
  }

  pdf.save(`orcamento-${data.cliente.replace(/\s+/g, "-").toLowerCase() || "novo"}.pdf`);
}
