import { useState, useMemo, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Plus, Search, Save, Settings2, ChevronDown, FileDown, Copy, Trash2, Boxes, Scissors, Weight, BarChart3, Eye } from "lucide-react";
import { PdfPreviewDialog } from "@/components/PdfPreviewDialog";
import { toast } from "sonner";
import { FramePreview } from "@/components/frame-preview";
import { supabase } from "@/integrations/supabase/client";
import { useAllTypologies, type ExtendedTypology } from "@/hooks/use-all-typologies";
import { calculateTypology } from "@/lib/calculation-engine";
import { getCutRulesForTypology, getGlassRulesForTypology, getComponentsForTypology } from "@/data/catalog";
import type { CalculationOutput, CutPiece, OptimizationResult } from "@/types/calculation";
import { optimizeBars } from "@/lib/bar-optimizer";
import { generateCutListPDF } from "@/utils/cutListPdfGenerator";
import { generatePadroesCortesPDF } from "@/utils/padroesCortePdfGenerator";
import { BarVisualization } from "@/components/plano-corte/BarVisualization";
import { usePlanosCorte, type PlanoCorte as PlanoCorteType } from "@/hooks/use-planos-corte";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ProfileCrossSection } from "@/components/orcamento/ProfileCrossSection";

// ============ SUMMARY CARDS ============
function SummaryCards({ result, barResults }: { result: CalculationOutput; barResults: OptimizationResult[] }) {
  const totalPieces = result.cuts.reduce((s, c) => s + c.quantity, 0);
  const totalBars = barResults.reduce((s, o) => s + o.total_bars, 0);
  const totalWaste = barResults.reduce((s, o) => s + o.total_waste_mm, 0);
  const totalBarLength = barResults.reduce((s, o) => s + o.total_bars * o.bar_length_mm, 0);
  const wastePct = totalBarLength > 0 ? ((totalWaste / totalBarLength) * 100).toFixed(1) : "0";

  const cards = [
    { icon: Scissors, label: "Total Peças", value: String(totalPieces), color: "text-blue-600" },
    { icon: Boxes, label: "Barras", value: String(totalBars), color: "text-indigo-600" },
    { icon: BarChart3, label: "Desperdício", value: `${wastePct}%`, color: "text-amber-600" },
    { icon: Weight, label: "Peso Total", value: `${result.total_aluminum_weight_kg.toFixed(2)} kg`, color: "text-emerald-600" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map((c) => (
        <Card key={c.label}>
          <CardContent className="p-3 flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-muted/50 ${c.color}`}>
              <c.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{c.label}</p>
              <p className="text-lg font-bold leading-tight">{c.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ============ DETAIL VIEW ============
function PlanoDetalhe({ plano, onBack, onUpdate, allTypologies }: { plano: PlanoCorteType; onBack: () => void; onUpdate: (id: string, u: Partial<PlanoCorteType>) => Promise<boolean>; allTypologies: ExtendedTypology[] }) {
  const [largura, setLargura] = useState(plano.largura);
  const [altura, setAltura] = useState(plano.altura);
  const [quantidade, setQuantidade] = useState(plano.quantidade);
  const [folgasOpen, setFolgasOpen] = useState(false);
  const typ = allTypologies.find(t => t.id === plano.typology_id) as ExtendedTypology | undefined;
  const baseId = typ?._baseTypologyId;

  const originalCutRules = useMemo(() => getCutRulesForTypology(plano.typology_id, baseId), [plano.typology_id, baseId]);
  const originalGlassRules = useMemo(() => getGlassRulesForTypology(plano.typology_id, baseId), [plano.typology_id, baseId]);

  const defaultCutFolgas = useMemo(() => {
    const map: Record<string, number> = {};
    originalCutRules.forEach(r => { map[r.id] = r.constant_mm; });
    return map;
  }, [originalCutRules]);

  const defaultGlassFolgas = useMemo(() => {
    const map: Record<string, { w: number; h: number }> = {};
    originalGlassRules.forEach(r => { map[r.id] = { w: r.width_constant_mm, h: r.height_constant_mm }; });
    return map;
  }, [originalGlassRules]);

  const [cutFolgas, setCutFolgas] = useState<Record<string, number>>(defaultCutFolgas);
  const [glassFolgas, setGlassFolgas] = useState<Record<string, { w: number; h: number }>>(defaultGlassFolgas);
  const [folgasSaving, setFolgasSaving] = useState(false);
  const [folgasSource, setFolgasSource] = useState<"catalogo" | "global" | "personalizada">("catalogo");
  const [pdfPreview, setPdfPreview] = useState<{ open: boolean; title: string; blobUrl: string | null; filename: string; loading: boolean }>({
    open: false, title: "", blobUrl: null, filename: "", loading: false,
  });

  const folgasKey = `folgas_${plano.typology_id}`;
  useEffect(() => {
    const loadFolgas = async () => {
      const { data: perTyp } = await supabase.from("configuracoes").select("valor").eq("chave", folgasKey).maybeSingle();
      if (perTyp?.valor) {
        try {
          const saved = JSON.parse(perTyp.valor);
          if (saved.cut) setCutFolgas(prev => ({ ...prev, ...saved.cut }));
          if (saved.glass) setGlassFolgas(prev => ({ ...prev, ...saved.glass }));
          setFolgasSource("personalizada");
          return;
        } catch { /* ignore */ }
      }
      const { data: globalData } = await supabase.from("configuracoes").select("valor").eq("chave", "folgas_global").maybeSingle();
      if (globalData?.valor) {
        try {
          const global = JSON.parse(globalData.valor);
          const pOffset = global.perfil_offset ?? 0;
          const vwOffset = global.vidro_largura_offset ?? 0;
          const vhOffset = global.vidro_altura_offset ?? 0;
          if (pOffset !== 0) {
            setCutFolgas(() => {
              const map: Record<string, number> = {};
              originalCutRules.forEach(r => { map[r.id] = r.constant_mm + pOffset; });
              return map;
            });
          }
          if (vwOffset !== 0 || vhOffset !== 0) {
            setGlassFolgas(() => {
              const map: Record<string, { w: number; h: number }> = {};
              originalGlassRules.forEach(r => { map[r.id] = { w: r.width_constant_mm + vwOffset, h: r.height_constant_mm + vhOffset }; });
              return map;
            });
          }
          if (pOffset !== 0 || vwOffset !== 0 || vhOffset !== 0) setFolgasSource("global");
        } catch { /* ignore */ }
      }
    };
    loadFolgas();
  }, [folgasKey, originalCutRules, originalGlassRules]);

  const saveFolgas = useCallback(async () => {
    setFolgasSaving(true);
    const payload = JSON.stringify({ cut: cutFolgas, glass: glassFolgas });
    const { data: existing } = await supabase.from("configuracoes").select("id").eq("chave", folgasKey).maybeSingle();
    if (existing) {
      await supabase.from("configuracoes").update({ valor: payload }).eq("chave", folgasKey);
    } else {
      await supabase.from("configuracoes").insert({ chave: folgasKey, valor: payload });
    }
    setFolgasSource("personalizada");
    setFolgasSaving(false);
    toast.success("Folgas salvas com sucesso!");
  }, [cutFolgas, glassFolgas, folgasKey]);

  const updateCutFolga = useCallback((id: string, value: number) => {
    setCutFolgas(prev => ({ ...prev, [id]: value }));
  }, []);

  const updateGlassFolga = useCallback((id: string, field: 'w' | 'h', value: number) => {
    setGlassFolgas(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }, []);

  const resetFolgas = useCallback(() => {
    setCutFolgas(defaultCutFolgas);
    setGlassFolgas(defaultGlassFolgas);
  }, [defaultCutFolgas, defaultGlassFolgas]);

  const result: CalculationOutput | null = useMemo(() => {
    if (!typ) return null;
    try {
      const adjustedCutRules = originalCutRules.map(r => ({ ...r, constant_mm: cutFolgas[r.id] ?? r.constant_mm }));
      const adjustedGlassRules = originalGlassRules.map(r => ({
        ...r,
        width_constant_mm: glassFolgas[r.id]?.w ?? r.width_constant_mm,
        height_constant_mm: glassFolgas[r.id]?.h ?? r.height_constant_mm,
      }));
      const components = getComponentsForTypology(plano.typology_id, baseId);
      return calculateTypology(
        { typology_id: plano.typology_id, width_mm: largura, height_mm: altura, quantity: quantidade },
        adjustedCutRules, adjustedGlassRules, components, typ.name, typ.num_folhas
      );
    } catch { return null; }
  }, [plano.typology_id, largura, altura, quantidade, typ, cutFolgas, glassFolgas, originalCutRules, originalGlassRules]);

  const barResults: OptimizationResult[] = useMemo(() => {
    if (!result) return [];
    try {
      const byProfile = new Map<string, CutPiece[]>();
      result.cuts.forEach((cut) => {
        const pieces = byProfile.get(cut.profile_code) || [];
        for (let q = 0; q < cut.quantity; q++) {
          pieces.push({ id: `${cut.cut_rule_id}-${q}`, length_mm: cut.cut_length_mm, label: cut.piece_name, profile_code: cut.profile_code });
        }
        byProfile.set(cut.profile_code, pieces);
      });
      const results: OptimizationResult[] = [];
      byProfile.forEach((pieces) => { try { results.push(optimizeBars(pieces)); } catch { /* skip */ } });
      return results;
    } catch { return []; }
  }, [result]);

  const handleExportPDF = useCallback(async () => {
    if (!result) return;
    setPdfPreview({ open: true, title: "Relação de Barras", blobUrl: null, filename: "", loading: true });
    try {
      const res = await generateCutListPDF(result, barResults, "frame-preview-svg", undefined, { preview: true });
      if (res) {
        const url = URL.createObjectURL(res.blob);
        setPdfPreview(p => ({ ...p, blobUrl: url, filename: res.filename, loading: false }));
      }
    } catch {
      setPdfPreview(p => ({ ...p, loading: false }));
      toast.error("Erro ao gerar PDF");
    }
  }, [result, barResults]);

  const handleExportPadroes = useCallback(async () => {
    if (!result) return;
    setPdfPreview({ open: true, title: "Padrões de Cortes", blobUrl: null, filename: "", loading: true });
    try {
      const res = await generatePadroesCortesPDF(result, barResults, undefined, { preview: true });
      if (res) {
        const url = URL.createObjectURL(res.blob);
        setPdfPreview(p => ({ ...p, blobUrl: url, filename: res.filename, loading: false }));
      }
    } catch {
      setPdfPreview(p => ({ ...p, loading: false }));
      toast.error("Erro ao gerar PDF");
    }
  }, [result, barResults]);

  const handleSave = useCallback(async () => {
    await onUpdate(plano.id, { largura, altura, quantidade });
    toast.success("Plano salvo!");
  }, [plano.id, largura, altura, quantidade, onUpdate]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        <div className="flex gap-2">
          {result && (
            <>
               <Button size="sm" variant="outline" className="gap-1.5" onClick={handleExportPDF}>
                 <Eye className="h-4 w-4" /> Rel. Barras
               </Button>
               <Button size="sm" variant="outline" className="gap-1.5" onClick={handleExportPadroes}>
                 <Eye className="h-4 w-4" /> Padrões Corte
               </Button>
            </>
          )}
          <Button size="sm" className="gap-2" onClick={handleSave}>
            <Save className="h-4 w-4" /> Salvar
          </Button>
        </div>
      </div>

      {/* Header with preview */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div id="frame-preview-svg" className="bg-muted/30 rounded-xl p-3 flex items-center justify-center">
              {typ && (
                <FramePreview width_mm={largura} height_mm={altura} category={typ.category} subcategory={typ.subcategory}
                  num_folhas={typ.num_folhas} has_veneziana={typ.has_veneziana} has_bandeira={typ.has_bandeira}
                  notes={typ.notes} maxWidth={120} maxHeight={100} showDimensions={false} />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold">{plano.nome}</h2>
              <p className="text-xs text-muted-foreground mb-3">{plano.responsavel}</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Largura (mm)</Label>
                  <Input type="number" value={largura} onChange={e => setLargura(Number(e.target.value))} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Altura (mm)</Label>
                  <Input type="number" value={altura} onChange={e => setAltura(Number(e.target.value))} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Quantidade</Label>
                  <Input type="number" min={1} value={quantidade} onChange={e => setQuantidade(Math.max(1, Number(e.target.value)))} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {result && <SummaryCards result={result} barResults={barResults} />}

      {/* Folgas */}
      <Card>
        <Collapsible open={folgasOpen} onOpenChange={setFolgasOpen}>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold">Ajustar Folgas</span>
                <Badge variant={folgasSource === "personalizada" ? "default" : "secondary"}
                  className={`text-[10px] ${folgasSource === "global" ? "bg-amber-500/15 text-amber-700 border-amber-300" : ""}`}>
                  {folgasSource === "personalizada" ? "✓ Personalizada" : folgasSource === "global" ? "⚙ Global" : "Catálogo"}
                </Badge>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${folgasOpen ? "rotate-180" : ""}`} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 pb-4 px-4 sm:px-6 space-y-4">
              <p className="text-xs text-muted-foreground">Ajuste as folgas de cada perfil e vidro. Valores em mm.</p>
              {originalCutRules.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Perfis (Folga em mm)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {originalCutRules.map(rule => (
                      <div key={rule.id} className="flex items-center gap-2 rounded-md border px-3 py-2">
                        <div className="shrink-0 w-7 h-7 rounded bg-muted/50 flex items-center justify-center text-primary">
                          <ProfileCrossSection profileType={rule.piece_function || rule.piece_name} profileCode={rule.profile_code ?? ''} size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate">{rule.profile_code}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{rule.piece_name}</p>
                        </div>
                        <Input type="number" className="w-20 h-8 text-xs text-center"
                          value={cutFolgas[rule.id] ?? 0} onChange={e => updateCutFolga(rule.id, Number(e.target.value))} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {originalGlassRules.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Vidros (Folga em mm)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {originalGlassRules.map(rule => (
                      <div key={rule.id} className="flex items-center gap-2 rounded-md border px-3 py-2">
                        <div className="shrink-0 w-7 h-7 rounded bg-muted/50 flex items-center justify-center text-primary">
                          <ProfileCrossSection profileType="vidro" profileCode="" size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate">{rule.glass_name}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="text-center">
                            <p className="text-[9px] text-muted-foreground">Larg.</p>
                            <Input type="number" className="w-16 h-8 text-xs text-center"
                              value={glassFolgas[rule.id]?.w ?? 0} onChange={e => updateGlassFolga(rule.id, 'w', Number(e.target.value))} />
                          </div>
                          <div className="text-center">
                            <p className="text-[9px] text-muted-foreground">Alt.</p>
                            <Input type="number" className="w-16 h-8 text-xs text-center"
                              value={glassFolgas[rule.id]?.h ?? 0} onChange={e => updateGlassFolga(rule.id, 'h', Number(e.target.value))} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" className="text-xs" onClick={resetFolgas}>Restaurar Padrão</Button>
                <Button size="sm" className="text-xs gap-1.5" onClick={saveFolgas} disabled={folgasSaving}>
                  <Save className="h-3 w-3" />{folgasSaving ? "Salvando..." : "Salvar Folgas"}
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {result && (
        <>
          {/* Cuts Table - responsive */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold">Lista de Corte</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Perfil</TableHead>
                      <TableHead className="text-center">Medida (mm)</TableHead>
                      <TableHead className="text-center hidden sm:table-cell">Qtd</TableHead>
                      <TableHead className="text-center hidden md:table-cell">Ângulo</TableHead>
                      <TableHead className="text-right hidden sm:table-cell">Peso (kg)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.cuts.map((cut) => (
                      <TableRow key={cut.cut_rule_id}>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="shrink-0 w-9 h-9 rounded-md bg-muted/50 flex items-center justify-center text-primary">
                              <ProfileCrossSection profileType={cut.piece_function || cut.piece_name} profileCode={cut.profile_code} size={32} />
                            </div>
                            <div>
                              <span className="font-bold text-xs">{cut.profile_code}</span>
                              <p className="text-[10px] text-muted-foreground">{cut.piece_name}</p>
                              <div className="flex gap-2 sm:hidden text-[10px] text-muted-foreground mt-0.5">
                                <span>×{cut.quantity}</span>
                                <span>{cut.weight_kg.toFixed(2)}kg</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-semibold font-mono">{cut.cut_length_mm}</TableCell>
                        <TableCell className="text-center font-semibold hidden sm:table-cell">{cut.quantity}</TableCell>
                        <TableCell className="text-center hidden md:table-cell">
                          <div className="flex justify-center gap-1">
                            <Badge variant={cut.cut_angle_left === 45 ? "default" : "secondary"} className="text-[10px] px-2">{cut.cut_angle_left}°</Badge>
                            <Badge variant={cut.cut_angle_right === 45 ? "default" : "secondary"} className="text-[10px] px-2">{cut.cut_angle_right}°</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono hidden sm:table-cell">{cut.weight_kg.toFixed(3)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="px-4 py-2.5 bg-muted/30 border-t text-xs text-muted-foreground flex justify-between">
                <span>{result.profiles_summary.length} perfis • {result.cuts.reduce((s, c) => s + c.quantity, 0)} peças</span>
                <span>Peso: {result.total_aluminum_weight_kg.toFixed(2)} kg</span>
              </div>
            </CardContent>
          </Card>

          {/* Bar Visualization */}
          {barResults.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">Plano de Barras</CardTitle>
              </CardHeader>
              <CardContent>
                <BarVisualization results={barResults} />
              </CardContent>
            </Card>
          )}

          {/* Glass Table */}
          {result.glasses.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">Vidros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-center">Largura</TableHead>
                        <TableHead className="text-center">Altura</TableHead>
                        <TableHead className="text-center">Qtd</TableHead>
                        <TableHead className="text-right">Área (m²)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.glasses.map(g => (
                        <TableRow key={g.glass_rule_id}>
                          <TableCell>
                            <div className="flex items-center gap-2.5">
                              <div className="shrink-0 w-9 h-9 rounded-md bg-muted/50 flex items-center justify-center text-primary">
                                <ProfileCrossSection profileType="vidro" profileCode="" size={32} />
                              </div>
                              <span className="font-medium">{g.glass_name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-mono">{g.width_mm}</TableCell>
                          <TableCell className="text-center font-mono">{g.height_mm}</TableCell>
                          <TableCell className="text-center font-semibold">{g.quantity}</TableCell>
                          <TableCell className="text-right font-mono font-semibold text-primary">{g.area_m2.toFixed(2)} m²</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Components */}
          {result.components.length > 0 && (
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-sm mb-3">Ferragens</h4>
                    <div className="space-y-2">
                      {result.components.filter(c => c.component_type === "ferragem" || c.component_type === "acessorio").map((comp, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-sm">
                          <div className="shrink-0 w-7 h-7 rounded bg-muted/50 flex items-center justify-center text-muted-foreground">
                            <ProfileCrossSection profileType={comp.component_type === "acessorio" ? "acessorio" : "ferragem"} profileCode={comp.component_code || ''} size={22} />
                          </div>
                          <span className="text-muted-foreground flex-1">{comp.component_name}</span>
                          <span className="font-semibold">{comp.quantity} {comp.unit}</span>
                        </div>
                      ))}
                      {result.components.filter(c => c.component_type === "ferragem" || c.component_type === "acessorio").length === 0 && (
                        <p className="text-xs text-muted-foreground">Nenhuma ferragem</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-3">Materiais Auxiliares</h4>
                    <div className="space-y-2">
                      {result.components.filter(c => ["vedacao", "fixacao", "acabamento"].includes(c.component_type)).map((comp, i) => {
                        const iconType = comp.component_type === "vedacao" ? "vedacao" : comp.component_type === "fixacao" ? "parafuso" : "arremate";
                        return (
                          <div key={i} className="flex items-center gap-2.5 text-sm">
                            <div className="shrink-0 w-7 h-7 rounded bg-muted/50 flex items-center justify-center text-muted-foreground">
                              <ProfileCrossSection profileType={iconType} profileCode={comp.component_code || ''} size={22} />
                            </div>
                            <span className="text-muted-foreground flex-1">{comp.component_name}</span>
                            <span className="font-semibold text-primary">{comp.quantity} {comp.unit}</span>
                          </div>
                        );
                      })}
                      {result.components.filter(c => ["vedacao", "fixacao", "acabamento"].includes(c.component_type)).length === 0 && (
                        <p className="text-xs text-muted-foreground">Nenhum material auxiliar</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

// ============ GRID VIEW (main) ============
const PlanoCorte = () => {
  const { planos, loading, addPlano, deletePlano, duplicatePlano, updatePlano, syncWithTypologies } = usePlanosCorte();
  const { allTypologies, loading: typLoading } = useAllTypologies();
  const [search, setSearch] = useState("");
  const [selectedPlano, setSelectedPlano] = useState<PlanoCorteType | null>(null);
  const [synced, setSynced] = useState(false);

  // Auto-sync: create planos for all typologies that don't have one yet
  useEffect(() => {
    if (!loading && !typLoading && allTypologies.length > 0 && !synced) {
      setSynced(true);
      syncWithTypologies(allTypologies);
    }
  }, [loading, typLoading, allTypologies, synced, syncWithTypologies]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novoResponsavel, setNovoResponsavel] = useState("");
  const [novoLargura, setNovoLargura] = useState(1000);
  const [novoAltura, setNovoAltura] = useState(1000);
  const [novoQuantidade, setNovoQuantidade] = useState(1);
  const [novoTypologyId, setNovoTypologyId] = useState("");

  const filtered = planos.filter(p =>
    !search || p.nome.toLowerCase().includes(search.toLowerCase()) || p.responsavel.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddPlano = async () => {
    if (!novoNome || !novoResponsavel || !novoTypologyId) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    await addPlano({
      typology_id: novoTypologyId,
      nome: novoNome,
      responsavel: novoResponsavel,
      largura: novoLargura,
      altura: novoAltura,
      quantidade: novoQuantidade,
    });
    setDialogOpen(false);
    setNovoNome("");
    setNovoResponsavel("");
    setNovoLargura(1000);
    setNovoAltura(1000);
    setNovoQuantidade(1);
    setNovoTypologyId("");
  };

  if (selectedPlano) {
    return <PlanoDetalhe plano={selectedPlano} onBack={() => setSelectedPlano(null)} onUpdate={updatePlano} allTypologies={allTypologies} />;
  }

  if (loading || typLoading) {
    return <div className="flex items-center justify-center py-20"><LoadingSpinner /></div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Plano de Corte</h1>
          <p className="text-muted-foreground text-sm">Gerencie os planos de corte dos produtos</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Adicionar
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar por produto ou responsável..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(plano => {
          const typ = allTypologies.find(t => t.id === plano.typology_id);
          return (
            <Card key={plano.id} className="group cursor-pointer hover:shadow-lg hover:border-primary/40 transition-all relative overflow-hidden"
              onClick={() => setSelectedPlano(plano)}>
              {/* Large Preview Area */}
              <div className="bg-muted/20 border-b flex items-center justify-center p-4 min-h-[140px]">
                {typ ? (
                  <FramePreview width_mm={plano.largura} height_mm={plano.altura} category={typ.category}
                    subcategory={typ.subcategory} num_folhas={typ.num_folhas} has_veneziana={typ.has_veneziana}
                    has_bandeira={typ.has_bandeira} notes={typ.notes} maxWidth={140} maxHeight={110} showDimensions={false} />
                ) : (
                  <div className="text-muted-foreground text-xs">Sem preview</div>
                )}
              </div>
              {/* Info Below */}
              <CardContent className="p-3 space-y-1">
                <h3 className="font-bold text-sm truncate">{plano.nome}</h3>
                <p className="text-xs text-primary font-medium">{plano.responsavel} <span className="text-muted-foreground font-normal">{new Date(plano.created_at).toLocaleDateString("pt-BR")}</span></p>
                <p className="text-xs text-muted-foreground font-mono">L: {plano.largura} × A: {plano.altura} &bull; Qtd: {plano.quantidade}</p>
              </CardContent>
              {/* Quick actions overlay */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                <Button variant="secondary" size="icon" className="h-7 w-7 shadow-sm" onClick={() => duplicatePlano(plano)} title="Duplicar">
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="secondary" size="icon" className="h-7 w-7 shadow-sm text-destructive hover:text-destructive" title="Excluir">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir plano?</AlertDialogTitle>
                      <AlertDialogDescription>Esta ação não pode ser desfeita. O plano "{plano.nome}" será excluído permanentemente.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deletePlano(plano.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          {planos.length === 0 ? "Nenhum plano de corte criado. Clique em Adicionar para começar." : "Nenhum plano encontrado."}
        </div>
      )}

      {/* Dialog Adicionar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Plano de Corte</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Tipologia</Label>
              <Select value={novoTypologyId} onValueChange={setNovoTypologyId}>
                <SelectTrigger><SelectValue placeholder="Selecione a tipologia..." /></SelectTrigger>
                <SelectContent>
                  {allTypologies.filter(t => t.active).map(t => (<SelectItem key={t.id} value={t.id}>{t.name}{(t as ExtendedTypology)._isCustom ? " ★" : ""}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nome do produto</Label>
              <Input value={novoNome} onChange={e => setNovoNome(e.target.value)} placeholder="Ex: Janela 2 Folhas Sala" />
            </div>
            <div className="space-y-2">
              <Label>Responsável</Label>
              <Input value={novoResponsavel} onChange={e => setNovoResponsavel(e.target.value)} placeholder="Nome do responsável" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Largura (mm)</Label>
                <Input type="number" value={novoLargura} onChange={e => setNovoLargura(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Altura (mm)</Label>
                <Input type="number" value={novoAltura} onChange={e => setNovoAltura(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Quantidade</Label>
                <Input type="number" min={1} value={novoQuantidade} onChange={e => setNovoQuantidade(Math.max(1, Number(e.target.value)))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddPlano}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanoCorte;
