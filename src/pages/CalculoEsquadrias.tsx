import { useState, useMemo } from 'react';
import { Calculator, Ruler, Eye, RotateCcw, ChevronDown, Check } from 'lucide-react';
import { PdfPreviewDialog } from '@/components/PdfPreviewDialog';
import PhotorealisticPreview from '@/components/frame-preview/PhotorealisticPreview';
import SafeRender from '@/components/SafeRender';
import ProfileCrossSectionPanel from '@/components/frame-preview/ProfileCrossSectionPanel';
import { getColorById } from '@/components/frame-preview/colors';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { calculateTypology } from '@/lib/calculation-engine';
import { generateCutListPDF } from '@/utils/cutListPdfGenerator';
import { generatePadroesCortesPDF } from '@/utils/padroesCortePdfGenerator';
import { generateImpressaoObraPDF } from '@/utils/impressaoObraPdfGenerator';
import { optimizeBars } from '@/lib/bar-optimizer';
import { getEffectiveCutRules } from '@/hooks/use-custom-cut-rules';
import { getEffectiveGlassRules } from '@/hooks/use-custom-glass-rules';
import { getEffectiveComponents } from '@/hooks/use-custom-component-rules';
import { productLines, manufacturers } from '@/data/catalog';
import { useAllTypologies, type ExtendedTypology } from '@/hooks/use-all-typologies';
import type { CalculationOutput, CutPiece, OptimizationResult } from '@/types/calculation';
import {
  SummaryCards,
  CutsTable,
  GlassTable,
  ComponentsTable,
  BarsVisualization,
  SummaryTable,
} from '@/components/calculo';

export default function CalculoEsquadrias() {
  const { allTypologies } = useAllTypologies();
  const [selectedLine, setSelectedLine] = useState('line-suprema');
  const [selectedTypology, setSelectedTypology] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [fabricanteOpen, setFabricanteOpen] = useState(false);
  const [quantity, setQuantity] = useState('1');
  const [result, setResult] = useState<CalculationOutput | null>(null);
  const [barResults, setBarResults] = useState<OptimizationResult[]>([]);
  const [selectedColor, setSelectedColor] = useState('natural');
  const [calculating, setCalculating] = useState(false);
  const [pdfPreview, setPdfPreview] = useState({
    open: false,
    title: '',
    blobUrl: null as string | null,
    filename: '',
    loading: false,
  });

  const filteredTypologies = useMemo(
    () => allTypologies.filter(t => t.product_line_id === selectedLine && t.active),
    [selectedLine, allTypologies]
  );

  const selectedTyp = useMemo(
    () => filteredTypologies.find(t => t.id === selectedTypology),
    [filteredTypologies, selectedTypology]
  );

  const widthLimits = useMemo(() => {
    if (!selectedTyp) return { min: 400, max: 6000 };
    return { min: selectedTyp.min_width_mm ?? 400, max: selectedTyp.max_width_mm ?? 6000 };
  }, [selectedTyp]);

  const heightLimits = useMemo(() => {
    if (!selectedTyp) return { min: 300, max: 3500 };
    return { min: selectedTyp.min_height_mm ?? 300, max: selectedTyp.max_height_mm ?? 3500 };
  }, [selectedTyp]);

  const typology = useMemo(
    () => allTypologies.find(t => t.id === selectedTypology) as ExtendedTypology | undefined,
    [allTypologies, selectedTypology]
  );

  const handleCalculate = async () => {
    if (!selectedTypology || !width || !height) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    const W = parseFloat(width);
    const H = parseFloat(height);
    if (W <= 0 || H <= 0) {
      toast.error('As dimensões devem ser maiores que zero');
      return;
    }
    if (!typology) {
      toast.error('Tipologia não encontrada');
      return;
    }

    setCalculating(true);
    try {
      const [cutRules, glassRules, components] = await Promise.all([
        getEffectiveCutRules(
          selectedTypology,
          typology._isCustom ?? false,
          typology._baseTypologyId
        ),
        getEffectiveGlassRules(
          selectedTypology,
          typology._isCustom ?? false,
          typology._baseTypologyId
        ),
        getEffectiveComponents(
          selectedTypology,
          typology._isCustom ?? false,
          typology._baseTypologyId
        ),
      ]);
      const output = calculateTypology(
        {
          typology_id: selectedTypology,
          width_mm: W,
          height_mm: H,
          quantity: parseInt(quantity) || 1,
        },
        cutRules,
        glassRules,
        components,
        typology.name,
        typology.num_folhas,
        typology
      );
      setResult(output);

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
        if (pieces.length > 0) optimizations.push(optimizeBars(pieces));
      }
      setBarResults(optimizations);
      toast.success('Cálculo realizado com sucesso!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setCalculating(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setBarResults([]);
    setWidth('');
    setHeight('');
    setQuantity('1');
    setSelectedTypology('');
  };

  const handlePdf = async (type: 'barras' | 'padroes' | 'impressao') => {
    if (!result) return;
    const generators = {
      barras: generateCutListPDF,
      padroes: generatePadroesCortesPDF,
      impressao: generateImpressaoObraPDF,
    };
    const titles = {
      barras: 'Relação de Barras',
      padroes: 'Padrões de Cortes',
      impressao: 'Impressão da Obra',
    };
    setPdfPreview({ open: true, title: titles[type], blobUrl: null, filename: '', loading: true });
    try {
      const gen = generators[type] as any;
      const res = await gen(result, barResults, undefined, { preview: true });
      if (res) {
        const url = URL.createObjectURL(res.blob);
        setPdfPreview(p => ({ ...p, blobUrl: url, filename: res.filename, loading: false }));
      }
    } catch {
      setPdfPreview(p => ({ ...p, loading: false }));
    }
  };

  return (
    <>
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
              <RotateCcw className="h-4 w-4" /> Novo Cálculo
            </Button>
          )}
        </div>

        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Ruler className="h-4 w-4 text-primary" /> Dados do Vão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Manufacturer */}
              <div className="space-y-2">
                <Label>Fabricante</Label>
                <Popover open={fabricanteOpen} onOpenChange={setFabricanteOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={fabricanteOpen}
                      className="w-full justify-between font-normal"
                    >
                      {manufacturers.find(
                        m => m.id === productLines.find(l => l.id === selectedLine)?.manufacturer_id
                      )?.name ?? 'Selecione...'}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[240px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar fabricante..." />
                      <CommandList>
                        <CommandEmpty>Nenhum fabricante encontrado.</CommandEmpty>
                        <CommandGroup>
                          {manufacturers
                            .filter(m => m.active)
                            .map(m => {
                              const isSelected =
                                m.id ===
                                productLines.find(l => l.id === selectedLine)?.manufacturer_id;
                              return (
                                <CommandItem
                                  key={m.id}
                                  value={m.name}
                                  onSelect={() => {
                                    const firstLine = productLines.find(
                                      l => l.manufacturer_id === m.id
                                    );
                                    if (firstLine) {
                                      setSelectedLine(firstLine.id);
                                      setSelectedTypology('');
                                      setResult(null);
                                      setSelectedColor('natural');
                                    }
                                    setFabricanteOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      isSelected ? 'opacity-100' : 'opacity-0'
                                    )}
                                  />
                                  {m.name}
                                </CommandItem>
                              );
                            })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Line */}
              <div className="space-y-2">
                <Label>Linha</Label>
                <Select
                  value={selectedLine}
                  onValueChange={v => {
                    setSelectedLine(v);
                    setSelectedTypology('');
                    setResult(null);
                    setSelectedColor('natural');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {productLines
                      .filter(
                        l =>
                          l.manufacturer_id ===
                          productLines.find(pl => pl.id === selectedLine)?.manufacturer_id
                      )
                      .map(l => (
                        <SelectItem key={l.id} value={l.id}>
                          {l.name} ({l.bitola_mm}mm)
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Typology */}
              <div className="space-y-2">
                <Label>Tipologia</Label>
                <Select value={selectedTypology} onValueChange={setSelectedTypology}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredTypologies.map(t => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Width */}
              <div className="space-y-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label className="cursor-help">Largura (mm) ⓘ</Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Mín: {widthLimits.min}mm — Máx: {widthLimits.max}mm
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Input
                  type="number"
                  placeholder={`${widthLimits.min} – ${widthLimits.max}`}
                  min={widthLimits.min}
                  max={widthLimits.max}
                  value={width}
                  onChange={e => setWidth(e.target.value)}
                />
                {selectedTyp && (
                  <p className="text-[10px] text-muted-foreground">
                    {widthLimits.min} – {widthLimits.max} mm
                  </p>
                )}
              </div>

              {/* Height */}
              <div className="space-y-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label className="cursor-help">Altura (mm) ⓘ</Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Mín: {heightLimits.min}mm — Máx: {heightLimits.max}mm
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Input
                  type="number"
                  placeholder={`${heightLimits.min} – ${heightLimits.max}`}
                  min={heightLimits.min}
                  max={heightLimits.max}
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                />
                {selectedTyp && (
                  <p className="text-[10px] text-muted-foreground">
                    {heightLimits.min} – {heightLimits.max} mm
                  </p>
                )}
              </div>

              {/* Quantity + Calculate */}
              <div className="space-y-2">
                <Label>Quantidade</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    className="w-20"
                  />
                  <Button onClick={handleCalculate} className="flex-1 gap-2" disabled={calculating}>
                    <Calculator className="h-4 w-4" />
                    <span className="hidden sm:inline">Calcular</span>
                    <span className="sm:hidden">Calc</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        {selectedTypology && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" /> Pré-visualização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-6">
                <div id="frame-preview-for-pdf">
                  <SafeRender
                    fallback={
                      <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                        Prévia não disponível
                      </div>
                    }
                  >
                    <PhotorealisticPreview
                      imagemUrl={selectedTyp?.imagem_url}
                      width_mm={parseFloat(width) || 1200}
                      height_mm={parseFloat(height) || 1200}
                      category={selectedTyp?.category ?? 'janela'}
                      subcategory={selectedTyp?.subcategory ?? 'correr'}
                      num_folhas={selectedTyp?.num_folhas ?? 2}
                      has_veneziana={selectedTyp?.has_veneziana}
                      has_bandeira={selectedTyp?.has_bandeira}
                      colorId={selectedColor}
                      maxWidth={280}
                      maxHeight={220}
                    />
                  </SafeRender>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">
                      Cor do Alumínio
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {['natural', 'branco', 'preto', 'bronze', 'prateado'].map(colorId => (
                        <button
                          key={colorId}
                          onClick={() => setSelectedColor(colorId)}
                          className={cn(
                            'w-8 h-8 rounded-full border-2 transition-all',
                            selectedColor === colorId
                              ? 'border-primary scale-110'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          )}
                          style={{ backgroundColor: getColorById(colorId).hex }}
                          title={getColorById(colorId).name}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedTyp?.name}
                    {width && height ? ` — ${width} × ${height} mm` : ''}
                  </p>
                </div>
                {result && result.cuts.length > 0 && <Separator />}
                {result && result.cuts.length > 0 && (
                  <SafeRender fallback={null}>
                    <ProfileCrossSectionPanel
                      profiles={(() => {
                        const seen = new Set<string>();
                        return result.cuts
                          .filter(c => {
                            if (seen.has(c.profile_code)) return false;
                            seen.add(c.profile_code);
                            return true;
                          })
                          .map(c => ({
                            code: c.profile_code,
                            name: c.piece_name,
                            type: c.piece_function,
                            weight_per_meter:
                              c.weight_kg > 0 && c.cut_length_mm > 0
                                ? c.weight_kg / c.quantity / (c.cut_length_mm / 1000)
                                : undefined,
                          }));
                      })()}
                      color={getColorById(selectedColor)}
                    />
                  </SafeRender>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result && (
          <>
            <SummaryCards result={result} />

            <Card>
              <Tabs defaultValue="cuts">
                <CardHeader className="pb-0 px-3 sm:px-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <CardTitle className="text-sm sm:text-base">
                      {result.typology_name} — {result.input.width_mm} × {result.input.height_mm} mm
                    </CardTitle>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 flex-1 sm:flex-none"
                        onClick={() => handlePdf('barras')}
                      >
                        <Eye className="h-4 w-4" /> Rel. Barras
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 flex-1 sm:flex-none"
                        onClick={() => handlePdf('padroes')}
                      >
                        <Eye className="h-4 w-4" /> Padrões Corte
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 flex-1 sm:flex-none"
                        onClick={() => handlePdf('impressao')}
                      >
                        <Eye className="h-4 w-4" /> Impressão
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
                    <TabsList className="w-max sm:w-auto">
                      <TabsTrigger value="cuts" className="text-xs sm:text-sm">
                        Corte
                      </TabsTrigger>
                      <TabsTrigger value="glass" className="text-xs sm:text-sm">
                        Vidros
                      </TabsTrigger>
                      <TabsTrigger value="components" className="text-xs sm:text-sm">
                        Comp.
                      </TabsTrigger>
                      <TabsTrigger value="bars" className="text-xs sm:text-sm">
                        Barras
                      </TabsTrigger>
                      <TabsTrigger value="summary" className="text-xs sm:text-sm">
                        Resumo
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </CardHeader>

                <TabsContent value="cuts">
                  <CardContent className="px-3 sm:px-6">
                    <CutsTable cuts={result.cuts} />
                  </CardContent>
                </TabsContent>
                <TabsContent value="glass">
                  <CardContent className="px-3 sm:px-6">
                    <GlassTable glasses={result.glasses} />
                  </CardContent>
                </TabsContent>
                <TabsContent value="components">
                  <CardContent className="px-3 sm:px-6">
                    <ComponentsTable components={result.components} />
                  </CardContent>
                </TabsContent>
                <TabsContent value="bars">
                  <CardContent className="px-3 sm:px-6">
                    <BarsVisualization barResults={barResults} />
                  </CardContent>
                </TabsContent>
                <TabsContent value="summary">
                  <CardContent className="px-3 sm:px-6">
                    <SummaryTable
                      profilesSummary={result.profiles_summary}
                      totalAluminumWeight={result.total_aluminum_weight_kg}
                    />
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>
          </>
        )}
      </div>

      <PdfPreviewDialog
        open={pdfPreview.open}
        onOpenChange={open => {
          if (!open && pdfPreview.blobUrl) URL.revokeObjectURL(pdfPreview.blobUrl);
          setPdfPreview(p => ({ ...p, open, ...(open ? {} : { blobUrl: null }) }));
        }}
        title={pdfPreview.title}
        pdfBlobUrl={pdfPreview.blobUrl}
        loading={pdfPreview.loading}
        onDownload={() => {
          if (pdfPreview.blobUrl) {
            const a = document.createElement('a');
            a.href = pdfPreview.blobUrl;
            a.download = pdfPreview.filename;
            a.click();
          }
        }}
      />
    </>
  );
}
