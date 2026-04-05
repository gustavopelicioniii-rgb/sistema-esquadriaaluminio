import { jsPDF } from "jspdf";
import { formatCurrency } from "@/lib/formatters";

interface ItemPreco {
  codigo: string;
  descricao: string;
  categoria: string;
  preco: number;
  unidade: string;
  cor: string;
}

export function exportPrecoItensPdf(items: ItemPreco[]) {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageW = 210;
  const marginX = 14;
  const contentW = pageW - marginX * 2;
  let y = 20;

  // Title
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("Tabela de Preços", marginX, y);
  y += 7;
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    `Gerado em ${new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date())}  •  ${items.length} itens`,
    marginX,
    y
  );
  y += 10;

  // Table header
  const cols = [
    { label: "Código", w: 22 },
    { label: "Descrição", w: 62 },
    { label: "Categoria", w: 24 },
    { label: "Cor", w: 22 },
    { label: "Preço", w: 28 },
    { label: "Un.", w: 14 },
  ];

  const rowH = 7;

  const drawHeader = () => {
    pdf.setFillColor(59, 130, 246);
    pdf.rect(marginX, y, contentW, rowH, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    let x = marginX + 2;
    cols.forEach((c) => {
      pdf.text(c.label, x, y + 5);
      x += c.w;
    });
    pdf.setTextColor(0, 0, 0);
    y += rowH;
  };

  drawHeader();

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);

  items.forEach((item, idx) => {
    if (y + rowH > 280) {
      pdf.addPage();
      y = 15;
      drawHeader();
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
    }

    if (idx % 2 === 0) {
      pdf.setFillColor(245, 247, 250);
      pdf.rect(marginX, y, contentW, rowH, "F");
    }

    let x = marginX + 2;
    const values = [
      item.codigo,
      item.descricao.length > 35 ? item.descricao.substring(0, 35) + "…" : item.descricao,
      item.categoria,
      item.cor,
      formatCurrency(item.preco),
      item.unidade,
    ];

    values.forEach((v, i) => {
      pdf.text(v, x, y + 5);
      x += cols[i].w;
    });

    y += rowH;
  });

  pdf.save("tabela-precos.pdf");
}
