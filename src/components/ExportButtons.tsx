import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, FileSpreadsheet, Loader2 } from "lucide-react";
import { generateReportPdf } from "@/utils/reportPdfGenerator";
import { generateExcel } from "@/utils/excelGenerator";
import { formatCurrency } from "@/lib/formatters";
import { toast } from "sonner";

interface ExportConfig {
  title: string;
  headers: string[];
  columnWidths: number[];
  rows: string[][];
  summaryCards?: { label: string; value: string }[];
  filename: string;
}

interface ExportButtonsProps {
  getConfig: () => ExportConfig;
}

export function ExportButtons({ getConfig }: ExportButtonsProps) {
  const [generating, setGenerating] = useState<"pdf" | "excel" | null>(null);

  const handleExport = async (format: "pdf" | "excel") => {
    setGenerating(format);
    try {
      const config = getConfig();
      if (format === "pdf") {
        generateReportPdf({ ...config, subtitle: config.title });
      } else {
        generateExcel(config);
      }
      toast({ title: `${format === "pdf" ? "PDF" : "Excel"} gerado`, description: `${config.rows.length} registros exportados` });
    } catch (e: any) {
      toast.error("Erro", { description: e.message });
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleExport("pdf")} disabled={!!generating}>
        {generating === "pdf" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
        PDF
      </Button>
      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleExport("excel")} disabled={!!generating}>
        {generating === "excel" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
        Excel
      </Button>
    </div>
  );
}
