import { useState, useMemo, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowLeft, Plus, Search, Save, Settings2, ChevronDown, FileDown } from "lucide-react";
import { toast } from "sonner";
import { FramePreview } from "@/components/frame-preview";
import { supabase } from "@/integrations/supabase/client";
import { typologies } from "@/data/catalog";
import { calculateTypology } from "@/lib/calculation-engine";
import { getCutRulesForTypology, getGlassRulesForTypology, getComponentsForTypology } from "@/data/catalog";
import type { CalculationOutput, CutPiece, OptimizationResult } from "@/types/calculation";
import { optimizeBars } from "@/lib/bar-optimizer";
import { generateCutListPDF } from "@/utils/cutListPdfGenerator";

// Mock saved plans
interface PlanoSalvo {
  id: string;
  typologyId: string;
  nome: string;
  responsavel: string;
  data: string;
  largura: number;
  altura: number;
}

const mockPlanos: PlanoSalvo[] = [
  { id: "p1", typologyId: "typ-su-jc2f", nome: "JANELA 2 FOLHAS DE VIDRO", responsavel: "Fabio", data: "11/01/2022", largura: 2000, altura: 1000 },
  { id: "p2", typologyId: "typ-su-jc4f", nome: "JANELA 4 FOLHAS DE VIDRO", responsavel: "Odair Araújo", data: "21/02/2022", largura: 2400, altura: 1200 },
  { id: "p3", typologyId: "typ-su-jma1", nome: "JANELA MAXIM-AR", responsavel: "Fabio", data: "11/01/2022", largura: 610, altura: 560 },
  { id: "p4", typologyId: "typ-su-jma2", nome: "JANELA MAXIM-AR", responsavel: "Fabio", data: "11/01/2022", largura: 575, altura: 585 },
  { id: "p5", typologyId: "typ-su-pg1f", nome: "PORTA PIVOTANTE", responsavel: "Fabio", data: "11/01/2022", largura: 1200, altura: 2200 },
  { id: "p6", typologyId: "typ-su-jma1", nome: "JANELA MAXIM-AR", responsavel: "Fabio", data: "11/01/2022", largura: 590, altura: 1810 },
  { id: "p7", typologyId: "typ-su-pc2f", nome: "PORTA DE CORRER 2 FOLHAS", responsavel: "Fabio", data: "11/01/2022", largura: 2115, altura: 1945 },
  { id: "p8", typologyId: "typ-su-jc2fv", nome: "VENEZIANA DE CORRER 4 FOLHAS", responsavel: "Odair Araújo", data: "21/02/2022", largura: 1160, altura: 793 },
  { id: "p9", typologyId: "typ-su-jcam", nome: "BOX BANHEIRO 2 FOLHAS", responsavel: "Norma G Silva", data: "11/01/2022", largura: 278, altura: 785 },
  { id: "p10", typologyId: "typ-su-pc4f", nome: "PORTA DE CORRER 4 FOLHAS", responsavel: "Fabio", data: "11/01/2022", largura: 3000, altura: 2100 },
];

function getTypologyInfo(typologyId: string) {
  return typologies.find(t => t.id === typologyId);
}

// ============ DETAIL VIEW ============
function PlanoDetalhe({ plano, onBack }: { plano: PlanoSalvo; onBack: () => void }) {
  const [largura, setLargura] = useState(plano.largura);
  const [altura, setAltura] = useState(plano.altura);
  const [folgasOpen, setFolgasOpen] = useState(false);
  const typ = getTypologyInfo(plano.typologyId);

  // Load original rules to allow folga overrides
  const originalCutRules = useMemo(() => getCutRulesForTypology(plano.typologyId), [plano.typologyId]);
  const originalGlassRules = useMemo(() => getGlassRulesForTypology(plano.typologyId), [plano.typologyId]);

  // Folga overrides: keyed by rule id
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
  const [folgasLoaded, setFolgasLoaded] = useState(false);
  const [folgasSource, setFolgasSource] = useState<"catalogo" | "global" | "personalizada">("catalogo");

  // Load saved folgas: first try per-typology, then apply global offsets as fallback
  const folgasKey = `folgas_${plano.typologyId}`;
  useEffect(() => {
    const loadFolgas = async () => {
      // Load per-typology override
      const { data: perTyp } = await supabase.from("configuracoes").select("valor").eq("chave", folgasKey).maybeSingle();
      if (perTyp?.valor) {
        try {
          const saved = JSON.parse(perTyp.valor);
          if (saved.cut) setCutFolgas(prev => ({ ...prev, ...saved.cut }));
          if (saved.glass) setGlassFolgas(prev => ({ ...prev, ...saved.glass }));
          setFolgasSource("personalizada");
          setFolgasLoaded(true);
          return;
        } catch { /* ignore */ }
      }

      // No per-typology override → apply global offsets
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
              originalGlassRules.forEach(r => {
                map[r.id] = { w: r.width_constant_mm + vwOffset, h: r.height_constant_mm + vhOffset };
              });
              return map;
            });
          }
          if (pOffset !== 0 || vwOffset !== 0 || vhOffset !== 0) {
            setFolgasSource("global");
          }
        } catch { /* ignore */ }
      }
      setFolgasLoaded(true);
    };
    loadFolgas();
  }, [folgasKey, originalCutRules, originalGlassRules]);

  const saveFolgas = useCallback(async () => {
    setFolgasSaving(true);
    const payload = JSON.stringify({ cut: cutFolgas, glass: glassFolgas });
    // Upsert: try update first, then insert
    const { data: existing } = await supabase.from("configuracoes").select("id").eq("chave", folgasKey).maybeSingle();
    if (existing) {
      await supabase.from("configuracoes").update({ valor: payload }).eq("chave", folgasKey);
    } else {
      await supabase.from("configuracoes").insert({ chave: folgasKey, valor: payload });
    }
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
      // Apply folga overrides to rules
      const adjustedCutRules = originalCutRules.map(r => ({
        ...r,
        constant_mm: cutFolgas[r.id] ?? r.constant_mm,
      }));
      const adjustedGlassRules = originalGlassRules.map(r => ({
        ...r,
        width_constant_mm: glassFolgas[r.id]?.w ?? r.width_constant_mm,
        height_constant_mm: glassFolgas[r.id]?.h ?? r.height_constant_mm,
      }));
      const components = getComponentsForTypology(plano.typologyId);
      return calculateTypology(
        { typology_id: plano.typologyId, width_mm: largura, height_mm: altura, quantity: 1 },
        adjustedCutRules, adjustedGlassRules, components, typ.name, typ.num_folhas
      );
    } catch { return null; }
  }, [plano.typologyId, largura, altura, typ, cutFolgas, glassFolgas, originalCutRules, originalGlassRules]);
  // Bar optimization for PDF
  const barResults: OptimizationResult[] = useMemo(() => {
    if (!result) return [];
    try {
      // Group cuts by profile_code
      const byProfile = new Map<string, CutPiece[]>();
      result.cuts.forEach((cut, i) => {
        const pieces = byProfile.get(cut.profile_code) || [];
        for (let q = 0; q < cut.quantity; q++) {
          pieces.push({
            id: `${cut.cut_rule_id}-${q}`,
            length_mm: cut.cut_length_mm,
            label: cut.piece_name,
            profile_code: cut.profile_code,
          });
        }
        byProfile.set(cut.profile_code, pieces);
      });
      const results: OptimizationResult[] = [];
      byProfile.forEach((pieces, code) => {
        try {
          results.push(optimizeBars(pieces));
        } catch { /* skip invalid */ }
      });
      return results;
    } catch { return []; }
  }, [result]);

  const handleExportPDF = useCallback(async () => {
    if (!result) return;
    toast.loading("Gerando PDF...");
    try {
      await generateCutListPDF(result, barResults, "frame-preview-svg");
      toast.dismiss();
      toast.success("PDF exportado com sucesso!");
    } catch {
      toast.dismiss();
      toast.error("Erro ao gerar PDF");
    }
  }, [result, barResults]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        {result && (
          <Button size="sm" className="gap-2" onClick={handleExportPDF}>
            <FileDown className="h-4 w-4" /> Exportar PDF
          </Button>
        )}
      </div>

      {/* Header with preview */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div id="frame-preview-svg" className="bg-muted/30 rounded-xl p-3 flex items-center justify-center">
              {typ && (
                <FramePreview
                  width_mm={largura}
                  height_mm={altura}
                  category={typ.category}
                  subcategory={typ.subcategory}
                  num_folhas={typ.num_folhas}
                  has_veneziana={typ.has_veneziana}
                  has_bandeira={typ.has_bandeira}
                  notes={typ.notes}
                  maxWidth={120}
                  maxHeight={100}
                  showDimensions={false}
                />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold">{plano.nome}</h2>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Largura</Label>
                  <Input type="number" value={largura} onChange={e => setLargura(Number(e.target.value))} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Altura</Label>
                  <Input type="number" value={altura} onChange={e => setAltura(Number(e.target.value))} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Folgas Adjustment Panel */}
      <Card>
        <Collapsible open={folgasOpen} onOpenChange={setFolgasOpen}>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold">Ajustar Folgas</span>
                <Badge
                  variant={folgasSource === "personalizada" ? "default" : "secondary"}
                  className={`text-[10px] ${folgasSource === "global" ? "bg-amber-500/15 text-amber-700 border-amber-300" : ""}`}
                >
                  {folgasSource === "personalizada" ? "✓ Personalizada" : folgasSource === "global" ? "⚙ Global" : "Catálogo"}
                </Badge>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${folgasOpen ? "rotate-180" : ""}`} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 pb-4 px-4 sm:px-6 space-y-4">
              <p className="text-xs text-muted-foreground">
                Ajuste as folgas (descontos) de cada perfil e vidro. Valores em milímetros. Valores negativos = desconto, positivos = acréscimo.
              </p>

              {/* Cut rules folgas */}
              {originalCutRules.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Perfis (Folga em mm)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {originalCutRules.map(rule => (
                      <div key={rule.id} className="flex items-center gap-2 rounded-md border px-3 py-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate">{rule.profile_code}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{rule.piece_name}</p>
                        </div>
                        <Input
                          type="number"
                          className="w-20 h-8 text-xs text-center"
                          value={cutFolgas[rule.id] ?? 0}
                          onChange={e => updateCutFolga(rule.id, Number(e.target.value))}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Glass rules folgas */}
              {originalGlassRules.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Vidros (Folga em mm)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {originalGlassRules.map(rule => (
                      <div key={rule.id} className="flex items-center gap-2 rounded-md border px-3 py-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate">{rule.glass_name}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="text-center">
                            <p className="text-[9px] text-muted-foreground">Larg.</p>
                            <Input
                              type="number"
                              className="w-16 h-8 text-xs text-center"
                              value={glassFolgas[rule.id]?.w ?? 0}
                              onChange={e => updateGlassFolga(rule.id, 'w', Number(e.target.value))}
                            />
                          </div>
                          <div className="text-center">
                            <p className="text-[9px] text-muted-foreground">Alt.</p>
                            <Input
                              type="number"
                              className="w-16 h-8 text-xs text-center"
                              value={glassFolgas[rule.id]?.h ?? 0}
                              onChange={e => updateGlassFolga(rule.id, 'h', Number(e.target.value))}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" className="text-xs" onClick={resetFolgas}>
                  Restaurar Padrão
                </Button>
                <Button size="sm" className="text-xs gap-1.5" onClick={saveFolgas} disabled={folgasSaving}>
                  <Save className="h-3 w-3" />
                  {folgasSaving ? "Salvando..." : "Salvar Folgas"}
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {result && (
        <>
          {/* Cuts Table */}
          <Card>
            <div className="bg-primary text-primary-foreground rounded-t-lg px-4 py-2.5 grid grid-cols-5 text-xs font-bold">
              <span>PERFIL</span>
              <span className="text-center">MEDIDA (MM)</span>
              <span className="text-center">QUANTIDADE</span>
              <span className="text-center">ÂNGULO DE CORTE</span>
              <span className="text-right">POSIÇÃO</span>
            </div>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {result.cuts.map((cut, i) => (
                  <div key={cut.cut_rule_id} className="grid grid-cols-5 items-center px-4 py-3 text-sm hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-muted/50 flex items-center justify-center">
                        <div className={`w-1 ${cut.piece_name.toLowerCase().includes("mont") || cut.piece_name.toLowerCase().includes("altura") ? "h-5" : "h-1 w-5"} bg-foreground/40 rounded-full`} />
                      </div>
                      <div>
                        <span className="font-bold text-xs">{cut.profile_code}</span>
                        <p className="text-[10px] text-muted-foreground leading-tight">{cut.piece_name}</p>
                      </div>
                    </div>
                    <span className="text-center font-semibold">{cut.cut_length_mm}</span>
                    <span className="text-center font-semibold">{cut.quantity}</span>
                    <div className="flex justify-center gap-1">
                      <Badge variant={cut.cut_angle_left === 45 ? "default" : "secondary"} className="text-[10px] px-2">
                        {cut.cut_angle_left}°
                      </Badge>
                      <Badge variant={cut.cut_angle_right === 45 ? "default" : "secondary"} className="text-[10px] px-2">
                        {cut.cut_angle_right}°
                      </Badge>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-[10px] gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                        {cut.piece_name.toLowerCase().includes("mont") || cut.piece_name.toLowerCase().includes("lateral") ? "Altura" : "Largura"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 bg-muted/30 border-t text-xs text-muted-foreground flex justify-between">
                <span>{result.profiles_summary.length} perfis • {result.cuts.reduce((s, c) => s + c.quantity, 0)} peças totais</span>
                <span>Peso estimado: {result.total_aluminum_weight_kg.toFixed(2)} kg</span>
              </div>
            </CardContent>
          </Card>

          {/* Glass Table */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold">Cálculo de Vidros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="text-center">Largura (mm)</TableHead>
                      <TableHead className="text-center">Altura (mm)</TableHead>
                      <TableHead className="text-center">Qtd</TableHead>
                      <TableHead className="text-right">Área (m²)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.glasses.map(g => (
                      <TableRow key={g.glass_rule_id}>
                        <TableCell className="font-medium">{g.glass_name}</TableCell>
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

          {/* Components: Ferragens + Materiais Auxiliares */}
          {result.components.length > 0 && (
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-sm mb-3">Lista de Ferragens</h4>
                    <div className="space-y-2">
                      {result.components
                        .filter(c => c.component_type === "ferragem" || c.component_type === "acessorio")
                        .map((comp, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {comp.component_name}
                              {comp.unit !== "un" && <span className="text-[10px] ml-1">({comp.unit})</span>}
                            </span>
                            <span className="font-semibold">{comp.quantity} {comp.unit}</span>
                          </div>
                        ))}
                      {result.components.filter(c => c.component_type === "ferragem" || c.component_type === "acessorio").length === 0 && (
                        <p className="text-xs text-muted-foreground">Nenhuma ferragem cadastrada</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-3">Materiais Auxiliares</h4>
                    <div className="space-y-2">
                      {result.components
                        .filter(c => c.component_type === "vedacao" || c.component_type === "fixacao" || c.component_type === "acabamento")
                        .map((comp, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{comp.component_name}</span>
                            <span className="font-semibold text-primary">{comp.quantity} {comp.unit}</span>
                          </div>
                        ))}
                      {result.components.filter(c => ["vedacao", "fixacao", "acabamento"].includes(c.component_type)).length === 0 && (
                        <p className="text-xs text-muted-foreground">Nenhum material auxiliar cadastrado</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Save button */}
          <div className="flex justify-end">
            <Button className="gap-2" onClick={() => toast.success("Plano de corte salvo!")}>
              <Save className="h-4 w-4" />
              Salvar
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

// ============ GRID VIEW (main) ============
const PlanoCorte = () => {
  const [search, setSearch] = useState("");
  const [selectedPlano, setSelectedPlano] = useState<PlanoSalvo | null>(null);
  const [planos, setPlanos] = useState<PlanoSalvo[]>(mockPlanos);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novoResponsavel, setNovoResponsavel] = useState("");
  const [novoLargura, setNovoLargura] = useState(1000);
  const [novoAltura, setNovoAltura] = useState(1000);
  const [novoTypologyId, setNovoTypologyId] = useState("");

  const filtered = planos.filter(p =>
    !search || p.nome.toLowerCase().includes(search.toLowerCase()) || p.responsavel.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddPlano = () => {
    if (!novoNome || !novoResponsavel || !novoTypologyId) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    const novo: PlanoSalvo = {
      id: `p${Date.now()}`,
      typologyId: novoTypologyId,
      nome: novoNome,
      responsavel: novoResponsavel,
      data: new Date().toLocaleDateString("pt-BR"),
      largura: novoLargura,
      altura: novoAltura,
    };
    setPlanos(prev => [novo, ...prev]);
    setDialogOpen(false);
    setNovoNome("");
    setNovoResponsavel("");
    setNovoLargura(1000);
    setNovoAltura(1000);
    setNovoTypologyId("");
    toast.success("Plano de corte adicionado!");
  };

  if (selectedPlano) {
    return <PlanoDetalhe plano={selectedPlano} onBack={() => setSelectedPlano(null)} />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Plano de Corte</h1>
          <p className="text-muted-foreground text-sm">Gerencie os planos de corte dos produtos</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por produto ou responsável..."
          className="pl-9"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(plano => {
          const typ = getTypologyInfo(plano.typologyId);
          return (
            <Card
              key={plano.id}
              className="cursor-pointer hover:shadow-md hover:border-primary/30 transition-all"
              onClick={() => setSelectedPlano(plano)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-20 h-16 bg-muted/30 rounded-lg flex items-center justify-center shrink-0">
                  {typ && (
                    <FramePreview
                      width_mm={plano.largura}
                      height_mm={plano.altura}
                      category={typ.category}
                      subcategory={typ.subcategory}
                      num_folhas={typ.num_folhas}
                      has_veneziana={typ.has_veneziana}
                      has_bandeira={typ.has_bandeira}
                      notes={typ.notes}
                      maxWidth={60}
                      maxHeight={50}
                      showDimensions={false}
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm truncate">{plano.nome}</h3>
                  <p className="text-xs text-primary">{plano.responsavel} {plano.data}</p>
                  <p className="text-xs text-muted-foreground">L: {plano.largura} X A: {plano.altura}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          Nenhum plano de corte encontrado.
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
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a tipologia..." />
                </SelectTrigger>
                <SelectContent>
                  {typologies.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
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
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Largura (mm)</Label>
                <Input type="number" value={novoLargura} onChange={e => setNovoLargura(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Altura (mm)</Label>
                <Input type="number" value={novoAltura} onChange={e => setNovoAltura(Number(e.target.value))} />
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
