import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProfileCrossSection } from "@/components/orcamento/ProfileCrossSection";
import type { CalculationOutput } from "@/types/calculation";

interface Props {
  result: CalculationOutput;
}

export function GlassComponentsCard({ result }: Props) {
  const glasses = result.glasses;
  const components = result.components;
  const ferragens = components.filter(c => c.component_type === "ferragem" || c.component_type === "acessorio");
  const materiais = components.filter(c => ["vedacao", "fixacao", "acabamento"].includes(c.component_type));

  const iconType = (compType: string) =>
    compType === "vedacao" ? "vedacao" : compType === "fixacao" ? "parafuso" : "arremate";

  if (glasses.length === 0 && components.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Glass Table */}
      {glasses.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-bold">Vidros</p>
            </div>
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
                  {glasses.map(g => (
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
      {components.length > 0 && (
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-sm mb-3">Ferragens</h4>
                <div className="space-y-2">
                  {ferragens.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Nenhuma ferragem</p>
                  ) : (
                    ferragens.map((comp, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-sm">
                        <div className="shrink-0 w-7 h-7 rounded bg-muted/50 flex items-center justify-center text-muted-foreground">
                          <ProfileCrossSection
                            profileType={comp.component_type === "acessorio" ? "acessorio" : "ferragem"}
                            profileCode={comp.component_code || ""}
                            size={22}
                          />
                        </div>
                        <span className="text-muted-foreground flex-1">{comp.component_name}</span>
                        <span className="font-semibold">{comp.quantity} {comp.unit}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-3">Materiais Auxiliares</h4>
                <div className="space-y-2">
                  {materiais.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Nenhum material auxiliar</p>
                  ) : (
                    materiais.map((comp, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-sm">
                        <div className="shrink-0 w-7 h-7 rounded bg-muted/50 flex items-center justify-center text-muted-foreground">
                          <ProfileCrossSection
                            profileType={iconType(comp.component_type)}
                            profileCode={comp.component_code || ""}
                            size={22}
                          />
                        </div>
                        <span className="text-muted-foreground flex-1">{comp.component_name}</span>
                        <span className="font-semibold text-primary">{comp.quantity} {comp.unit}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
