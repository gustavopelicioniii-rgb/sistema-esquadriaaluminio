import { jsPDF } from "jspdf";
import { formatCurrency } from "@/data/mockData";

interface VidroItem {
  id: string;
  descricao: string;
  larguraMm: number;
  alturaMm: number;
  quantidade: number;
}

interface ProjetoVidro {
  id: string;
  titulo: string;
  tipo: string;
  espessura: string;
  cor: string;
  precoM2: number;
  itens: VidroItem[];
  criadoEm: string;
}

function calcAreaM2(largMm: number, altMm: number): number {
  return (largMm * altMm) / 1_000_000;
}

export function exportProjetoVidroPDF(projeto: ProjetoVidro) {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const M = 15;
  const CW = W - M * 2;
  let y = M;

  const areaTotal = projeto.itens.reduce(
    (sum, it) => sum + calcAreaM2(it.larguraMm, it.alturaMm) * it.quantidade,
    0
  );
  const valorTotal = areaTotal * projeto.precoM2;

  // Header bar
  pdf.setFillColor(59, 130, 246);
  pdf.rect(0, 0, W, 28, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text("Projeto de Vidro", M, 12);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, M, 20);
  y = 38;

  // Project info
  pdf.setTextColor(30, 30, 30);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text(projeto.titulo, M, y);
  y += 8;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(100, 100, 100);
  const specs = `Tipo: ${projeto.tipo}  |  Espessura: ${projeto.espessura}  |  Cor: ${projeto.cor}  |  Criado: ${projeto.criadoEm}`;
  pdf.text(specs, M, y);
  y += 10;

  // Summary cards
  const cardW = CW / 3;
  const cardH = 18;
  const cards = [
    { label: "Preco/m2", value: formatCurrency(projeto.precoM2) },
    { label: "Area Total", value: `${areaTotal.toFixed(2)} m2` },
    { label: "Valor Total", value: formatCurrency(valorTotal) },
  ];

  cards.forEach((card, i) => {
    const x = M + i * cardW;
    pdf.setFillColor(245, 247, 250);
    pdf.roundedRect(x + 1, y, cardW - 2, cardH, 2, 2, "F");
    pdf.setFontSize(8);
    pdf.setTextColor(120, 120, 120);
    pdf.text(card.label, x + 4, y + 6);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(30, 30, 30);
    pdf.text(card.value, x + 4, y + 14);
    pdf.setFont("helvetica", "normal");
  });

  y += cardH + 10;

  // Table header
  if (projeto.itens.length > 0) {
    pdf.setFillColor(59, 130, 246);
    pdf.rect(M, y, CW, 8, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");

    const cols = [
      { label: "DESCRICAO", x: M + 2, w: 60 },
      { label: "LARGURA (mm)", x: M + 64, w: 28 },
      { label: "ALTURA (mm)", x: M + 94, w: 28 },
      { label: "QTD", x: M + 124, w: 16 },
      { label: "AREA (m2)", x: M + 142, w: 22 },
      { label: "VALOR", x: M + 166, w: 14 },
    ];

    cols.forEach((col) => {
      pdf.text(col.label, col.x, y + 5.5);
    });

    y += 8;

    // Table rows
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);

    projeto.itens.forEach((item, idx) => {
      if (y > 270) {
        pdf.addPage();
        y = M;
      }

      const area = calcAreaM2(item.larguraMm, item.alturaMm) * item.quantidade;
      const valor = area * projeto.precoM2;
      const rowH = 8;

      if (idx % 2 === 0) {
        pdf.setFillColor(249, 250, 251);
        pdf.rect(M, y, CW, rowH, "F");
      }

      pdf.setTextColor(50, 50, 50);
      pdf.text(item.descricao.substring(0, 30), cols[0].x, y + 5.5);
      pdf.text(String(item.larguraMm), cols[1].x, y + 5.5);
      pdf.text(String(item.alturaMm), cols[2].x, y + 5.5);
      pdf.text(String(item.quantidade), cols[3].x, y + 5.5);
      pdf.text(area.toFixed(2), cols[4].x, y + 5.5);
      pdf.setTextColor(59, 130, 246);
      pdf.text(formatCurrency(valor), cols[5].x, y + 5.5);

      y += rowH;
    });

    // Table footer
    pdf.setDrawColor(200, 200, 200);
    pdf.line(M, y, M + CW, y);
    y += 5;

    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(9);
    pdf.text(`${projeto.itens.length} vidro(s)  •  ${areaTotal.toFixed(2)} m2 total`, M, y + 3);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(59, 130, 246);
    pdf.setFontSize(11);
    pdf.text(formatCurrency(valorTotal), M + CW - 2, y + 3, { align: "right" });
  } else {
    pdf.setTextColor(150, 150, 150);
    pdf.setFontSize(10);
    pdf.text("Nenhum vidro adicionado ao projeto.", M, y + 5);
  }

  // Footer
  const pageH = 297;
  pdf.setDrawColor(220, 220, 220);
  pdf.line(M, pageH - 12, M + CW, pageH - 12);
  pdf.setFontSize(7);
  pdf.setTextColor(160, 160, 160);
  pdf.text("AlumPRO - Sistema de Esquadrias", M, pageH - 7);
  pdf.text(`Pagina 1`, M + CW, pageH - 7, { align: "right" });

  pdf.save(`projeto-vidro-${projeto.titulo.replace(/\s+/g, "-").toLowerCase()}.pdf`);
}
