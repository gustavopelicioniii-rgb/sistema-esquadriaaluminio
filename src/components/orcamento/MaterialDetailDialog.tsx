import { useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { calculateTypology } from "@/lib/calculation-engine";
import { getCutRulesForTypology, getGlassRulesForTypology, getComponentsForTypology, getTypologyById, profiles } from "@/data/catalog";
import { cn } from "@/lib/utils";
import { ProfileCrossSection } from "./ProfileCrossSection";
import type { CalculationOutput } from "@/types/calculation";

interface MaterialDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  typologyId: string;
  larguraCm: number;
  alturaCm: number;
  quantidade: number;
  colorName: string;
  colorHex: string;
  /** Price per kg for aluminum profiles */
  precoPerfilKg?: number;
  /** Price per m² for glass */
  precoVidroM2?: number;
}

export default function MaterialDetailDialog({
  open,
  onOpenChange,
  typologyId,
  larguraCm,
  alturaCm,
  quantidade,
  colorName,
  colorHex,
  precoPerfilKg = 100,
  precoVidroM2 = 106,
}: MaterialDetailDialogProps) {
  const calcResult = useMemo<CalculationOutput | null>(() => {
    if (!typologyId) return null;
    const typology = getTypologyById(typologyId);
    if (!typology) return null;

    const cutRules = getCutRulesForTypology(typologyId);
    const glassRules = getGlassRulesForTypology(typologyId);
    const components = getComponentsForTypology(typologyId);

    if (cutRules.length === 0) return null;

    try {
      return calculateTypology(
        {
          typology_id: typologyId,
          width_mm: larguraCm * 10,
          height_mm: alturaCm * 10,
          quantity: quantidade,
        },
        cutRules,
        glassRules,
        components,
        typology.name,
        typology.num_folhas,
        typology
      );
    } catch {
      return null;
    }
  }, [typologyId, larguraCm, alturaCm, quantidade]);

  if (!calcResult) return null;

  const totalGlassPrice = calcResult.total_glass_area_m2 * precoVidroM2;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Detalhes do Material</DialogTitle>
        </DialogHeader>

        {/* Metros Quadrados */}
        {calcResult.glasses.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-primary font-bold text-base">Metros Quadrados</h3>
            {calcResult.glasses.map((g, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium uppercase text-xs tracking-wide">
                    {g.glass_name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="w-3 h-3 rounded-full border border-border/50 inline-block"
                      style={{ backgroundColor: colorHex }}
                    />
                    <span className="text-muted-foreground text-xs">{colorName}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">{g.area_m2.toFixed(2)} M²</p>
                </div>
              </div>
            ))}
            <div className="flex justify-between font-bold text-sm border-t pt-2">
              <span>TOTAL</span>
              <span>{formatCurrency(totalGlassPrice)}</span>
            </div>
          </section>
        )}

        {/* Perfis */}
        {calcResult.cuts.length > 0 && (
          <section className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-primary font-bold text-base">Perfis</h3>
            </div>
            <div className="space-y-4">
              {calcResult.cuts.map((cut, i) => {
                const pricePerCut = (cut.weight_kg / cut.quantity) * precoPerfilKg;
                const totalPrice = cut.weight_kg * precoPerfilKg;
                return (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b border-border/30 last:border-0">
                    {/* Profile cross-section illustration */}
                    <div className="w-10 h-10 rounded-md bg-muted/40 flex items-center justify-center shrink-0 mt-0.5">
                      <ProfileCrossSection
                        profileType={(() => {
                          const profile = profiles.find(p => p.code === cut.profile_code);
                          return profile?.profile_type || "marco";
                        })()}
                        profileCode={cut.profile_code}
                        size={32}
                        color="hsl(var(--foreground))"
                      />
                    </div>
                    {/* Profile info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{cut.profile_code}</span>
                        <span className="text-muted-foreground text-xs">×{cut.quantity}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="w-3 h-3 rounded-full border border-border/50 inline-block shrink-0"
                          style={{ backgroundColor: colorHex }}
                        />
                        <span className="text-xs text-muted-foreground">{colorName}</span>
                        <span className="text-xs text-muted-foreground">
                          {cut.piece_name}
                        </span>
                      </div>
                    </div>
                    {/* Right side metrics */}
                    <div className="text-right shrink-0 space-y-0.5">
                      <p className="text-xs text-muted-foreground">
                        {(cut.weight_kg).toFixed(1)} Kg
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {cut.cut_length_mm.toFixed(1)} mm
                      </p>
                      <p className="font-semibold text-sm">
                        {formatCurrency(totalPrice)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Voltar
          </Button>
          <Button className="bg-primary">
            Alterar valores
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
