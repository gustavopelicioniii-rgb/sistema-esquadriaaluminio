import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

interface PdfPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  pdfBlobUrl: string | null;
  onDownload: () => void;
  loading?: boolean;
}

export function PdfPreviewDialog({
  open,
  onOpenChange,
  title,
  pdfBlobUrl,
  onDownload,
  loading,
}: PdfPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 py-3 border-b flex-row items-center justify-between space-y-0">
          <div>
            <DialogTitle className="text-sm font-semibold">{title}</DialogTitle>
            <DialogDescription className="text-xs">Prévia do documento PDF gerado</DialogDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="gap-1.5" onClick={onDownload} disabled={!pdfBlobUrl}>
              <Download className="h-4 w-4" />
              Baixar PDF
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 min-h-0">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : pdfBlobUrl ? (
            <iframe src={pdfBlobUrl} className="w-full h-full border-0" title={title} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Erro ao gerar pré-visualização
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
