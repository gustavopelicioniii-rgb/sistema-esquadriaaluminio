import { useState, useMemo } from "react";
import DOMPurify from "dompurify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Download, FileImage, FileText, ZoomIn, ZoomOut, RotateCw, 
  Printer, PenTool, Ruler, Scale, Package
} from "lucide-react";
import { 
  generateDrawingPDFData, 
  downloadDrawingSVG, 
  type DrawingData,
  type DrawingPiece 
} from "@/utils/drawings/fabricationDrawings";
import type { CalculationOutput } from "@/types/calculation";
import { toast } from "sonner";

interface FabricationDrawingsPanelProps {
  calculation: CalculationOutput | null;
  clientName?: string;
  projectName?: string;
  onClose?: () => void;
}

export function FabricationDrawingsPanel({ 
  calculation, 
  clientName, 
  projectName,
  onClose 
}: FabricationDrawingsPanelProps) {
  const [activeTab, setActiveTab] = useState("vista");
  const [selectedPiece, setSelectedPiece] = useState<DrawingPiece | null>(null);
  const [svgContent, setSvgContent] = useState<string>("");

  const drawingData = useMemo<DrawingData | null>(() => {
    if (!calculation) return null;
    return generateDrawingPDFData(calculation, { clientName, projectName });
  }, [calculation, clientName, projectName]);

  // Generate SVG when data changes
  useMemo(() => {
    if (drawingData) {
      import("@/utils/drawings/fabricationDrawings").then(({ exportDrawingAsSVG }) => {
        setSvgContent(exportDrawingAsSVG(drawingData, {
          title: drawingData.typologyName,
          projectName,
          clientName,
          showGrid: true,
        }));
      });
    }
  }, [drawingData, projectName, clientName]);

  const handleDownloadSVG = () => {
    if (!drawingData) return;
    try {
      downloadDrawingSVG(drawingData, {
        title: drawingData.typologyName,
        projectName,
        clientName,
        showGrid: true,
      });
      toast.success("SVG baixado com sucesso!");
    } catch {
      toast.error("Erro ao baixar SVG");
    }
  };

  const handlePrint = () => {
    if (!svgContent) return;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Desenho de Fabricação</title></head>
          <body style="margin:0;display:flex;justify-content:center;">${svgContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (!calculation || !drawingData) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center text-muted-foreground">
          Selecione um plano de corte para gerar os desenhos
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Desenhos de Fabricação</h2>
          <p className="text-sm text-muted-foreground">
            {drawingData.typologyName} - {drawingData.width}x{drawingData.height}mm
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handlePrint} className="gap-1">
            <Printer className="h-4 w-4" /> Imprimir
          </Button>
          <Button size="sm" variant="outline" onClick={handleDownloadSVG} className="gap-1">
            <Download className="h-4 w-4" /> SVG
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3 flex items-center gap-2">
            <Ruler className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Dimensões</p>
              <p className="font-semibold text-sm">{drawingData.width} x {drawingData.height}mm</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex items-center gap-2">
            <Package className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-xs text-muted-foreground">Peças</p>
              <p className="font-semibold text-sm">{drawingData.pieces.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex items-center gap-2">
            <Scale className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-xs text-muted-foreground">Peso</p>
              <p className="font-semibold text-sm">{drawingData.totalWeight.toFixed(2)} kg</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex items-center gap-2">
            <PenTool className="h-4 w-4 text-purple-600" />
            <div>
              <p className="text-xs text-muted-foreground">Folhas</p>
              <p className="font-semibold text-sm">{drawingData.numFolhas}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="vista" className="gap-1">
            <FileImage className="h-4 w-4" /> Vista Frontal
          </TabsTrigger>
          <TabsTrigger value="pecas" className="gap-1">
            <Package className="h-4 w-4" /> Peças ({drawingData.pieces.length})
          </TabsTrigger>
          <TabsTrigger value="lista" className="gap-1">
            <FileText className="h-4 w-4" /> Lista Técnica
          </TabsTrigger>
        </TabsList>

        {/* Front View Tab */}
        <TabsContent value="vista" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-center bg-gray-50 rounded-lg p-4 overflow-auto">
                {svgContent && (
                  <div 
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(svgContent) }} 
                    className="max-w-full"
                    style={{ maxHeight: "500px" }}
                  />
                )}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Vista frontal em escala 1:1 - Para impressão em A4 ou A3
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pieces Tab */}
        <TabsContent value="pecas" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {drawingData.pieces.map((piece, index) => (
                  <Card 
                    key={`${piece.code}-${index}`}
                    className={`cursor-pointer hover:ring-2 hover:ring-primary transition-all ${
                      selectedPiece?.code === piece.code ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedPiece(piece)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm truncate">{piece.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{piece.code}</p>
                        </div>
                        <Badge variant="secondary">x{piece.quantity}</Badge>
                      </div>
                      <div className="mt-2 space-y-1">
                        <p className="text-xs">
                          <span className="text-muted-foreground">Medida:</span>{" "}
                          <span className="font-semibold">{piece.length}mm</span>
                        </p>
                        <p className="text-xs">
                          <span className="text-muted-foreground">Perfil:</span>{" "}
                          <span className="text-xs">{piece.profile}</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Selected piece detail */}
              {selectedPiece && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Detalhe: {selectedPiece.name}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Código</p>
                      <p className="font-mono font-semibold">{selectedPiece.code}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Comprimento</p>
                      <p className="font-semibold">{selectedPiece.length}mm</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Quantidade</p>
                      <p className="font-semibold">{selectedPiece.quantity}x</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Perfil</p>
                      <p className="font-semibold">{selectedPiece.profile}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technical List Tab */}
        <TabsContent value="lista" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Código</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-center">Qtd</TableHead>
                    <TableHead className="text-right">Comprimento</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead className="text-right">Corte</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drawingData.pieces.map((piece, index) => (
                    <TableRow key={`${piece.code}-${index}`}>
                      <TableCell className="font-mono text-xs">{piece.code}</TableCell>
                      <TableCell className="font-medium text-sm">{piece.name}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{piece.quantity}x</Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{piece.length}mm</TableCell>
                      <TableCell className="text-xs">{piece.profile}</TableCell>
                      <TableCell className="text-right">
                        {piece.cuts.map((c, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {c.angle}°
                          </Badge>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Summary */}
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-muted-foreground">Total de peças:</span>{" "}
                  <span className="font-semibold">
                    {drawingData.pieces.reduce((sum, p) => sum + p.quantity, 0)}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Peso total estimado:</span>{" "}
                  <span className="font-semibold">{drawingData.totalWeight.toFixed(2)} kg</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
