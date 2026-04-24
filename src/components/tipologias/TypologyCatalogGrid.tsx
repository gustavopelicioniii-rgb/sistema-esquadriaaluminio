import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PhotorealisticPreview from "@/components/frame-preview/PhotorealisticPreview";
import { generateReportPdf } from "@/utils/reportPdfGenerator";
import { FileDown, Eye, Copy } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "janela", label: "Janela" },
  { value: "porta", label: "Porta" },
  { value: "vitro", label: "Vitrô" },
  { value: "veneziana", label: "Veneziana" },
  { value: "maxim_ar", label: "Maxim-Ar" },
  { value: "camarao", label: "Camarão" },
  { value: "pivotante", label: "Pivotante" },
  { value: "basculante", label: "Basculante" },
  { value: "fachada", label: "Fachada" },
];

const SUBCATEGORIES = [
  { value: "correr", label: "Correr" },
  { value: "giro", label: "Giro" },
  { value: "maxim_ar", label: "Maxim-Ar" },
  { value: "camarao", label: "Camarão" },
  { value: "basculante", label: "Basculante" },
  { value: "pivotante", label: "Pivotante" },
  { value: "fixo", label: "Fixo" },
];

interface Typology {
  id: string;
  name: string;
  product_line_id: string;
  category: string;
  subcategory: string | null;
  num_folhas: number;
  has_veneziana: boolean;
  has_bandeira: boolean;
  min_width_mm: number | null;
  max_width_mm: number | null;
  min_height_mm: number | null;
  max_height_mm: number | null;
  imagem_url?: string;
  [key: string]: unknown;
}

interface Props {
  items: Typology[];
  getLineName: (id: string) => string;
  filteredCount: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (p: number) => void;
  onDetail: (t: Typology) => void;
  onClone: (t: Typology) => void;
}

export function TypologyCatalogGrid({
  items, getLineName, filteredCount, totalPages, currentPage, onPageChange, onDetail, onClone,
}: Props) {
  const getCategoryLabel = (cat: string) => CATEGORIES.find(c => c.value === cat)?.label || cat;

  const handleExportPdf = () => {
    const headers = ["Nome", "ID", "Linha", "Categoria", "Subcategoria", "Folhas", "Veneziana", "Bandeira"];
    const colWidths = [42, 30, 28, 22, 22, 14, 16, 16];
    const rows = items.map(t => [
      t.name,
      t.id,
      getLineName(t.product_line_id),
      getCategoryLabel(t.category),
      t.subcategory ? (SUBCATEGORIES.find(s => s.value === t.subcategory)?.label || t.subcategory) : "–",
      String(t.num_folhas),
      t.has_veneziana ? "Sim" : "Não",
      t.has_bandeira ? "Sim" : "Não",
    ]);
    generateReportPdf({
      title: "Catálogo de Tipologias",
      subtitle: `${filteredCount} tipologias filtradas`,
      headers,
      rows,
      columnWidths: colWidths,
      filename: "tipologias-catalogo.pdf",
      summaryCards: [
        { label: "Total", value: String(filteredCount) },
        { label: "Categorias", value: String(new Set(items.map(t => t.category)).size) },
        { label: "Linhas", value: String(new Set(items.map(t => t.product_line_id)).size) },
      ],
    });
    toast.success("PDF gerado", { description: `${filteredCount} tipologias exportadas` });
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground">
          {filteredCount} tipologias — página {currentPage} de {totalPages || 1}
        </p>
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={handleExportPdf}>
          <FileDown className="h-3.5 w-3.5" /> Exportar PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((t) => (
          <Card key={t.id} className="group hover:shadow-md transition-shadow border-border/60 overflow-hidden">
            <div className="bg-muted/30 p-4 flex items-center justify-center aspect-square cursor-pointer"
              onClick={() => onDetail(t)}>
              <PhotorealisticPreview
                imagemUrl={t.imagem_url}
                width_mm={t.max_width_mm || 1200}
                height_mm={t.max_height_mm || 1400}
                category={t.category}
                subcategory={t.subcategory || "correr"}
                num_folhas={t.num_folhas}
                has_veneziana={t.has_veneziana}
                has_bandeira={t.has_bandeira}
                maxWidth={180}
                maxHeight={180}
                showDimensions={false}
              />
            </div>
            <CardContent className="p-2.5 space-y-1.5">
              <p className="text-xs text-primary leading-tight line-clamp-2 font-medium">{t.name}</p>
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wide truncate">{t.id}</p>
              <div className="flex gap-1 pt-0.5">
                <Button variant="ghost" size="sm" className="h-6 text-[10px] px-1.5 flex-1 gap-1" onClick={() => onDetail(t)}>
                  <Eye className="h-3 w-3" /> Detalhes
                </Button>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] px-1.5 flex-1 gap-1" onClick={() => onClone(t)}>
                  <Copy className="h-3 w-3" /> Clonar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6 pb-2">
          <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
            Anterior
          </Button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce<(number | string)[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                typeof p === "string" ? (
                  <span key={`ellipsis-${i}`} className="flex items-center justify-center w-8 h-8 text-xs text-muted-foreground">…</span>
                ) : (
                  <Button key={p} variant={currentPage === p ? "default" : "outline"} size="sm" className="w-8 h-8 p-0 text-xs" onClick={() => onPageChange(p)}>
                    {p}
                  </Button>
                )
              )}
          </div>
          <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
            Próximo
          </Button>
        </div>
      )}
    </div>
  );
}
