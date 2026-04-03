import * as XLSX from "xlsx";

interface ExcelExportOptions {
  title: string;
  headers: string[];
  rows: string[][];
  filename: string;
  summaryCards?: { label: string; value: string }[];
}

export function generateExcel(options: ExcelExportOptions) {
  const { title, headers, rows, filename, summaryCards } = options;

  const wsData: string[][] = [];

  // Title row
  wsData.push([title]);
  wsData.push([`Gerado em: ${new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date())}`]);
  wsData.push([]);

  // Summary
  if (summaryCards?.length) {
    wsData.push(summaryCards.map((c) => c.label));
    wsData.push(summaryCards.map((c) => c.value));
    wsData.push([]);
  }

  // Table
  wsData.push(headers);
  rows.forEach((row) => wsData.push(row));

  // Total
  wsData.push([]);
  wsData.push([`Total: ${rows.length} registros`]);

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Auto column widths
  const colWidths = headers.map((h, i) => {
    const maxLen = Math.max(h.length, ...rows.map((r) => (r[i] || "").length));
    return { wch: Math.min(maxLen + 4, 40) };
  });
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Relatório");
  XLSX.writeFile(wb, filename);
}
