import { useState, useMemo } from "react";
import { Calculator, Ruler, Weight, Grid3X3, Package, Layers, FileDown, RotateCcw, Eye } from "lucide-react";
import { FramePreview, ColorSelector } from "@/components/frame-preview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { calculateTypology } from "@/lib/calculation-engine";
import { generateCutListPDF } from "@/utils/cutListPdfGenerator";
import { optimizeBars } from "@/lib/bar-optimizer";
import {
  typologies,
  productLines,
  manufacturers,
  getCutRulesForTypology,
  getGlassRulesForTypology,
  getComponentsForTypology,
  getTypologyById,
} from "@/data/catalog";
import type { CalculationOutput, CutPiece, OptimizationResult } from "@/types/calculation";

export default function CalculoEsquadrias() {
  const [selectedLine, setSelectedLine] = useState("line-suprema");
  const [selectedTypology, setSelectedTypology] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [result, setResult] = useState<CalculationOutput | null>(null);
  const [barResults, setBarResults] = useState<OptimizationResult[]>([]);
  const [selectedColor, setSelectedColor] = useState("natural");

  const filteredTypologies = useMemo(
    () => typologies.filter(t => t.product_line_id === selectedLine && t.active),
    [selectedLine]
  );

  const handleCalculate = () => {
    if (!selectedTypology || !width || !height) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const W = parseFloat(width);
    const H = parseFloat(height);
    const qty = parseInt(quantity) || 1;

    if (W <= 0 || H <= 0) {
      toast.error("As dimensões devem ser maiores que zero");
      return;
    }

    const typology = getTypologyById(selectedTypology);
    if (!typology) {
      toast.error("Tipologia não encontrada");
      return;
    }

    const cutRules = getCutRulesForTypology(selectedTypology);
    const glassRules = getGlassRulesForTypology(selectedTypology);
    const components = getComponentsForTypology(selectedTypology);

    try {
      const output = calculateTypology(
        { typology_id: selectedTypology, width_mm: W, height_mm: H, quantity: qty },
        cutRules,
        glassRules,
        components,
        typology.name,
        typology.num_folhas
      );
      setResult(output);

      // Otimizar barras
      const piecesByProfile = new Map<string, CutPiece[]>();
      for (const cut of output.cuts) {
        for (let i = 0; i < cut.quantity; i++) {
          const key = cut.profile_code;
          if (!piecesByProfile.has(key)) piecesByProfile.set(key, []);
          piecesByProfile.get(key)!.push({
            id: `${cut.cut_rule_id}-${i}`,
            length_mm: cut.cut_length_mm,
            label: `${cut.piece_name} (${cut.cut_length_mm}mm)`,
            profile_code: cut.profile_code,
          });
        }
      }

      const optimizations: OptimizationResult[] = [];
      for (const [, pieces] of piecesByProfile) {
        if (pieces.length > 0) {
          optimizations.push(optimizeBars(pieces));
        }
      }
      setBarResults(optimizations);

      toast.success("Cálculo realizado com sucesso!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      toast.error(message);
    }
  };

  const handleReset = () => {
    setResult(null);
    setBarResults([]);
    setWidth("");
    setHeight("");
    setQuantity("1");
    setSelectedTypology("");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
            <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Cálculo de Esquadrias
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Motor de cálculo de cortes, vidros e componentes
          </p>
        </div>
        {result && (
          <Button variant="outline" onClick={handleReset} className="gap-2 w-full sm:w-auto">
            <RotateCcw className="h-4 w-4" />
            Novo Cálculo
          </Button>
        )}
      </div>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Ruler className="h-4 w-4 text-primary" />
            Dados do Vão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label>Fabricante</Label>
              <Select
                value={productLines.find(l => l.id === selectedLine)?.manufacturer_id ?? ""}
                onValueChange={(mfgId) => {
                  const firstLine = productLines.find(l => l.manufacturer_id === mfgId);
                  if (firstLine) { setSelectedLine(firstLine.id); setSelectedTypology(""); setResult(null); }
                }}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {manufacturers.map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Linha</Label>
              <Select value={selectedLine} onValueChange={(v) => { setSelectedLine(v); setSelectedTypology(""); setResult(null); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {productLines
                    .filter(l => l.manufacturer_id === (productLines.find(pl => pl.id === selectedLine)?.manufacturer_id))
                    .map(l => (
                      <SelectItem key={l.id} value={l.id}>{l.name} ({l.bitola_mm}mm)</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipologia</Label>
              <Select value={selectedTypology} onValueChange={setSelectedTypology}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {filteredTypologies.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Largura (mm)</Label>
              <Input type="number" placeholder="Ex: 1200" value={width} onChange={e => setWidth(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Altura (mm)</Label>
              <Input type="number" placeholder="Ex: 1200" value={height} onChange={e => setHeight(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Quantidade</Label>
              <div className="flex gap-2">
                <Input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-20" />
                <Button onClick={handleCalculate} className="flex-1 gap-2">
                  <Calculator className="h-4 w-4" />
                  <span className="hidden sm:inline">Calcular</span>
                  <span className="sm:hidden">Calc</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview + Color Selector */}
      {selectedTypology && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              Pré-visualização
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-6">
              <div id="frame-preview-for-pdf">
              <FramePreview
                width_mm={parseFloat(width) || 1200}
                height_mm={parseFloat(height) || 1200}
                category={filteredTypologies.find(t => t.id === selectedTypology)?.category ?? "janela"}
                subcategory={filteredTypologies.find(t => t.id === selectedTypology)?.subcategory ?? "correr"}
                num_folhas={filteredTypologies.find(t => t.id === selectedTypology)?.num_folhas ?? 2}
                has_veneziana={filteredTypologies.find(t => t.id === selectedTypology)?.has_veneziana}
                has_bandeira={filteredTypologies.find(t => t.id === selectedTypology)?.has_bandeira}
                notes={filteredTypologies.find(t => t.id === selectedTypology)?.notes}
                colorId={selectedColor}
                maxWidth={280}
                maxHeight={220}
              />
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Cor do Alumínio</Label>
                  <ColorSelector selectedColorId={selectedColor} onColorChange={setSelectedColor} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {filteredTypologies.find(t => t.id === selectedTypology)?.name}
                  {width && height ? ` — ${width} × ${height} mm` : ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <Layers className="h-3.5 w-3.5" />
                  Peças de Alumínio
                </div>
                <div className="text-lg sm:text-2xl font-bold text-foreground">
                  {result.cuts.reduce((s, c) => s + c.quantity, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <Weight className="h-3.5 w-3.5" />
                  Peso Total Alumínio
                </div>
                <div className="text-lg sm:text-2xl font-bold text-foreground">
                  {result.total_aluminum_weight_kg.toFixed(2)} kg
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <Grid3X3 className="h-3.5 w-3.5" />
                  Área de Vidro
                </div>
                <div className="text-lg sm:text-2xl font-bold text-foreground">
                  {result.total_glass_area_m2.toFixed(4)} m²
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <Package className="h-3.5 w-3.5" />
                  Barras Necessárias
                </div>
                <div className="text-lg sm:text-2xl font-bold text-foreground">
                  {result.profiles_summary.reduce((s, p) => s + p.total_bars_needed, 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs with detailed results */}
          <Card>
            <Tabs defaultValue="cuts">
              <CardHeader className="pb-0 px-3 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <CardTitle className="text-sm sm:text-base">
                    {result.typology_name} — {result.input.width_mm} × {result.input.height_mm} mm
                  </CardTitle>
                  <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto" onClick={async () => {
                    toast.info("Gerando PDF...");
                    await generateCutListPDF(result, barResults, "frame-preview-for-pdf");
                    toast.success("PDF exportado com sucesso!");
                  }}>
                    <FileDown className="h-4 w-4" />
                    Exportar
                  </Button>
                </div>
                <div className="mt-3 overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
                  <TabsList className="w-max sm:w-auto">
                    <TabsTrigger value="cuts" className="text-xs sm:text-sm">Corte</TabsTrigger>
                    <TabsTrigger value="glass" className="text-xs sm:text-sm">Vidros</TabsTrigger>
                    <TabsTrigger value="components" className="text-xs sm:text-sm">Comp.</TabsTrigger>
                    <TabsTrigger value="bars" className="text-xs sm:text-sm">Barras</TabsTrigger>
                    <TabsTrigger value="summary" className="text-xs sm:text-sm">Resumo</TabsTrigger>
                  </TabsList>
                </div>
              </CardHeader>

              {/* CUTS TAB */}
              <TabsContent value="cuts">
                <CardContent className="px-3 sm:px-6">
                  <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-8">#</TableHead>
                        <TableHead>Peça</TableHead>
                        <TableHead>Perfil</TableHead>
                        <TableHead className="text-right">Medida (mm)</TableHead>
                        <TableHead className="text-center">Ângulo</TableHead>
                        <TableHead className="text-center">Qtd</TableHead>
                        <TableHead className="text-right">Peso (kg)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.cuts.map((cut, i) => (
                        <TableRow key={cut.cut_rule_id}>
                          <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                          <TableCell className="font-medium">{cut.piece_name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono text-xs">{cut.profile_code}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold text-primary">
                            {cut.cut_length_mm}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={cut.cut_angle_left === 45 ? "default" : "secondary"} className="text-xs">
                              {cut.cut_angle_left}°/{cut.cut_angle_right}°
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center font-medium">{cut.quantity}</TableCell>
                          <TableCell className="text-right text-muted-foreground">{cut.weight_kg.toFixed(3)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </div>
                </CardContent>
              </TabsContent>

              {/* GLASS TAB */}
              <TabsContent value="glass">
                <CardContent className="px-3 sm:px-6">
                  <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vidro</TableHead>
                        <TableHead className="text-right">Largura</TableHead>
                        <TableHead className="text-right">Altura</TableHead>
                        <TableHead className="text-center">Qtd</TableHead>
                        <TableHead className="text-right">Área (m²)</TableHead>
                        <TableHead>Tipo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.glasses.map((glass) => (
                        <TableRow key={glass.glass_rule_id}>
                          <TableCell className="font-medium">{glass.glass_name}</TableCell>
                          <TableCell className="text-right font-mono">{glass.width_mm}</TableCell>
                          <TableCell className="text-right font-mono">{glass.height_mm}</TableCell>
                          <TableCell className="text-center">{glass.quantity}</TableCell>
                          <TableCell className="text-right font-mono text-primary font-semibold">
                            {glass.area_m2.toFixed(4)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs capitalize">
                              {getGlassRulesForTypology(selectedTypology).find(r => r.id === glass.glass_rule_id)?.glass_type ?? "—"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </div>
                </CardContent>
              </TabsContent>

              {/* COMPONENTS TAB */}
              <TabsContent value="components">
                <CardContent>
                  {result.components.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-8">Nenhum componente cadastrado para esta tipologia.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Componente</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead className="text-center">Qtd</TableHead>
                          <TableHead>Unidade</TableHead>
                          <TableHead className="text-right">Comprimento Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.components.map((comp, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{comp.component_name}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs capitalize">{comp.component_type}</Badge>
                            </TableCell>
                            <TableCell className="text-center font-medium">{comp.quantity}</TableCell>
                            <TableCell className="text-muted-foreground">{comp.unit}</TableCell>
                            <TableCell className="text-right font-mono">
                              {comp.total_length_mm ? `${comp.total_length_mm} mm` : "—"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </TabsContent>

              {/* BARS TAB */}
              <TabsContent value="bars">
                <CardContent className="space-y-6">
                  {barResults.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-8">Sem dados de barras.</p>
                  ) : (
                    barResults.map((opt) => (
                      <div key={opt.profile_code} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm flex items-center gap-2">
                            <Badge variant="outline" className="font-mono">{opt.profile_code}</Badge>
                            {opt.total_bars} barra(s) de {opt.bar_length_mm}mm
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            Aproveitamento: <span className="font-semibold text-primary">{opt.overall_utilization_percent}%</span>
                          </span>
                        </div>
                        <div className="space-y-2">
                          {opt.bars.map((bar) => (
                            <div key={bar.bar_number} className="space-y-1">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>Barra {bar.bar_number}</span>
                                <span>•</span>
                                <span>Sobra: {bar.waste_mm}mm ({(100 - bar.utilization_percent).toFixed(1)}%)</span>
                              </div>
                              <div className="flex h-8 rounded-md overflow-hidden border border-border bg-muted/30">
                                {bar.pieces.map((piece, pi) => {
                                  const widthPercent = (piece.length_mm / opt.bar_length_mm) * 100;
                                  const colors = [
                                    "bg-primary/80", "bg-primary/60", "bg-primary/40",
                                    "bg-blue-500/70", "bg-blue-400/60", "bg-indigo-500/60",
                                  ];
                                  return (
                                    <div
                                      key={pi}
                                      className={`${colors[pi % colors.length]} flex items-center justify-center text-[10px] font-medium text-primary-foreground border-r border-background/50 truncate px-1`}
                                      style={{ width: `${widthPercent}%` }}
                                      title={piece.label}
                                    >
                                      {piece.length_mm}
                                    </div>
                                  );
                                })}
                                {bar.waste_mm > 0 && (
                                  <div
                                    className="bg-destructive/20 flex items-center justify-center text-[10px] text-destructive font-medium"
                                    style={{ width: `${(bar.waste_mm / opt.bar_length_mm) * 100}%` }}
                                  >
                                    {bar.waste_mm}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <Separator />
                      </div>
                    ))
                  )}
                </CardContent>
              </TabsContent>

              {/* SUMMARY TAB */}
              <TabsContent value="summary">
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Perfil</TableHead>
                        <TableHead className="text-right">Comp. Total (mm)</TableHead>
                        <TableHead className="text-center">Barras</TableHead>
                        <TableHead className="text-right">Peso/m (kg)</TableHead>
                        <TableHead className="text-right">Peso Total (kg)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.profiles_summary.map((p) => (
                        <TableRow key={p.profile_code}>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">{p.profile_code}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono">{p.total_length_mm}</TableCell>
                          <TableCell className="text-center font-semibold">{p.total_bars_needed}</TableCell>
                          <TableCell className="text-right text-muted-foreground">{p.weight_per_meter.toFixed(3)}</TableCell>
                          <TableCell className="text-right font-mono font-semibold text-primary">{p.total_weight_kg.toFixed(3)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold border-t-2">
                        <TableCell colSpan={2}>TOTAL</TableCell>
                        <TableCell className="text-center">
                          {result.profiles_summary.reduce((s, p) => s + p.total_bars_needed, 0)}
                        </TableCell>
                        <TableCell />
                        <TableCell className="text-right text-primary">
                          {result.total_aluminum_weight_kg.toFixed(3)} kg
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </>
      )}
    </div>
  );
}
