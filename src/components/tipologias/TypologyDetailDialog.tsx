import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FramePreview } from "@/components/frame-preview";
import { getCutRulesForTypology, getGlassRulesForTypology, getComponentsForTypology } from "@/data/catalog";
import { productLines } from "@/data/catalog/manufacturers";
import { Scissors, GlassWater, Package, Ruler } from "lucide-react";
import type { Typology } from "@/types/calculation";

interface Props {
  typology: Typology | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORIES: Record<string, string> = {
  janela: "Janela", porta: "Porta", vitro: "Vitrô", veneziana: "Veneziana",
  maxim_ar: "Maxim-Ar", camarao: "Camarão", pivotante: "Pivotante",
  basculante: "Basculante", fachada: "Fachada",
};

const SUBCATEGORIES: Record<string, string> = {
  correr: "Correr", giro: "Giro", maxim_ar: "Maxim-Ar", camarao: "Camarão",
  basculante: "Basculante", pivotante: "Pivotante", fixo: "Fixo",
  curtain_wall: "Curtain Wall", muro_cortina: "Muro Cortina",
};

export function TypologyDetailDialog({ typology, open, onOpenChange }: Props) {
  if (!typology) return null;

  const cutRules = getCutRulesForTypology(typology.id);
  const glassRules = getGlassRulesForTypology(typology.id);
  const components = getComponentsForTypology(typology.id);
  const line = productLines.find(l => l.id === typology.product_line_id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-lg">{typology.name}</DialogTitle>
          <p className="text-xs text-muted-foreground font-mono uppercase">{typology.id}</p>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-100px)]">
          <div className="px-6 pb-6 space-y-5">
            {/* Header: Preview + Info */}
            <div className="flex gap-5 pt-2">
              <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center shrink-0">
                <FramePreview
                  width_mm={typology.max_width_mm || 1200}
                  height_mm={typology.max_height_mm || 1400}
                  category={typology.category}
                  subcategory={typology.subcategory || "correr"}
                  num_folhas={typology.num_folhas}
                  has_veneziana={typology.has_veneziana}
                  has_bandeira={typology.has_bandeira}
                  notes={typology.notes || undefined}
                  maxWidth={160}
                  maxHeight={160}
                  showDimensions={false}
                />
              </div>
              <div className="flex-1 space-y-3 min-w-0">
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary">{CATEGORIES[typology.category] || typology.category}</Badge>
                  {typology.subcategory && <Badge variant="outline">{SUBCATEGORIES[typology.subcategory] || typology.subcategory}</Badge>}
                  <Badge variant="outline">{typology.num_folhas} Folha{typology.num_folhas !== 1 ? "s" : ""}</Badge>
                  {typology.has_veneziana && <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">Veneziana</Badge>}
                  {typology.has_bandeira && <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300">Bandeira</Badge>}
                </div>
                {line && <p className="text-sm text-muted-foreground">Linha: <span className="text-foreground font-medium">{line.name}</span></p>}
                {(typology.min_width_mm || typology.max_width_mm || typology.min_height_mm || typology.max_height_mm) && (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Ruler className="h-3 w-3" />
                      Largura: <span className="text-foreground">{typology.min_width_mm ?? "–"} – {typology.max_width_mm ?? "–"} mm</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Ruler className="h-3 w-3" />
                      Altura: <span className="text-foreground">{typology.min_height_mm ?? "–"} – {typology.max_height_mm ?? "–"} mm</span>
                    </div>
                  </div>
                )}
                {typology.notes && <p className="text-xs text-muted-foreground italic">{typology.notes}</p>}
              </div>
            </div>

            <Separator />

            {/* Rules Tabs */}
            <Tabs defaultValue="corte">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="corte" className="gap-1.5 text-xs">
                  <Scissors className="h-3.5 w-3.5" /> Corte ({cutRules.length})
                </TabsTrigger>
                <TabsTrigger value="vidro" className="gap-1.5 text-xs">
                  <GlassWater className="h-3.5 w-3.5" /> Vidros ({glassRules.length})
                </TabsTrigger>
                <TabsTrigger value="componentes" className="gap-1.5 text-xs">
                  <Package className="h-3.5 w-3.5" /> Componentes ({components.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="corte" className="mt-3">
                {cutRules.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">Nenhuma regra de corte cadastrada.</p>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Peça</TableHead>
                          <TableHead className="text-xs">Perfil</TableHead>
                          <TableHead className="text-xs">Ref.</TableHead>
                          <TableHead className="text-xs text-right">Constante</TableHead>
                          <TableHead className="text-xs text-center">Ângulos</TableHead>
                          <TableHead className="text-xs text-center">Qtd</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cutRules.map(r => (
                          <TableRow key={r.id}>
                            <TableCell className="text-xs font-medium">{r.piece_name}</TableCell>
                            <TableCell className="text-xs font-mono">{r.profile_code}</TableCell>
                            <TableCell className="text-xs">{r.reference_dimension}{r.coefficient !== 1 ? ` ×${r.coefficient}` : ""}</TableCell>
                            <TableCell className="text-xs text-right">{r.constant_mm > 0 ? "+" : ""}{r.constant_mm} mm</TableCell>
                            <TableCell className="text-xs text-center">{r.cut_angle_left}° / {r.cut_angle_right}°</TableCell>
                            <TableCell className="text-xs text-center">{r.quantity_formula}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="vidro" className="mt-3">
                {glassRules.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">Nenhuma regra de vidro cadastrada.</p>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Nome</TableHead>
                          <TableHead className="text-xs">Largura</TableHead>
                          <TableHead className="text-xs">Altura</TableHead>
                          <TableHead className="text-xs text-center">Qtd</TableHead>
                          <TableHead className="text-xs">Tipo</TableHead>
                          <TableHead className="text-xs">Espessura</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {glassRules.map(r => (
                          <TableRow key={r.id}>
                            <TableCell className="text-xs font-medium">{r.glass_name}</TableCell>
                            <TableCell className="text-xs">{r.width_reference} {r.width_constant_mm > 0 ? "+" : ""}{r.width_constant_mm}mm</TableCell>
                            <TableCell className="text-xs">{r.height_reference} {r.height_constant_mm > 0 ? "+" : ""}{r.height_constant_mm}mm</TableCell>
                            <TableCell className="text-xs text-center">{r.quantity}</TableCell>
                            <TableCell className="text-xs">{r.glass_type || "–"}</TableCell>
                            <TableCell className="text-xs">
                              {r.min_thickness_mm || r.max_thickness_mm
                                ? `${r.min_thickness_mm ?? "–"}–${r.max_thickness_mm ?? "–"}mm`
                                : "–"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="componentes" className="mt-3">
                {components.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">Nenhum componente cadastrado.</p>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Componente</TableHead>
                          <TableHead className="text-xs">Código</TableHead>
                          <TableHead className="text-xs">Tipo</TableHead>
                          <TableHead className="text-xs text-center">Qtd</TableHead>
                          <TableHead className="text-xs">Unidade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {components.map(c => (
                          <TableRow key={c.id}>
                            <TableCell className="text-xs font-medium">{c.component_name}</TableCell>
                            <TableCell className="text-xs font-mono">{c.component_code || "–"}</TableCell>
                            <TableCell className="text-xs">{c.component_type}</TableCell>
                            <TableCell className="text-xs text-center">{c.quantity_formula}</TableCell>
                            <TableCell className="text-xs">{c.unit}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
