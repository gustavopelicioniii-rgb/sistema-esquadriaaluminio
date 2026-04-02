import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Monitor } from "lucide-react";

const ProjetoVidro = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projeto Vidro</h1>
          <p className="text-muted-foreground text-sm">Visualize e configure projetos de vidro</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Novo Projeto
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { titulo: "Vidro 6mm Comum - Incolor", area: "3.25 M²", total: "R$ 345,32" },
          { titulo: "Vidro 8mm Temperado - Fumê", area: "4.80 M²", total: "R$ 892,00" },
          { titulo: "Vidro Laminado 10mm", area: "6.20 M²", total: "R$ 1.240,00" },
        ].map((projeto, i) => (
          <Card key={i} className="shadow-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Monitor className="h-4 w-4 text-primary" />
                {projeto.titulo}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Área</span>
                  <span className="font-semibold">{projeto.area}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">TOTAL</span>
                  <span className="font-bold text-primary">{projeto.total}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                Ver detalhes
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjetoVidro;
