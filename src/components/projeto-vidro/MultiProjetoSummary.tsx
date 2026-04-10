import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { ProjetoVidro, calcAreaEfetiva } from "./types";

interface MultiProjetoSummaryProps {
  projetos: ProjetoVidro[];
  onClose: () => void;
}

export function MultiProjetoSummary({ projetos, onClose }: MultiProjetoSummaryProps) {
  const totalArea = projetos.reduce((sum, p) => {
    return sum + p.itens.reduce((s, it) => s + calcAreaEfetiva(it.larguraMm, it.alturaMm, p.areaMinimaM2) * it.quantidade, 0);
  }, 0);
  const totalValor = projetos.reduce((sum, p) => {
    const area = p.itens.reduce((s, it) => s + calcAreaEfetiva(it.larguraMm, it.alturaMm, p.areaMinimaM2) * it.quantidade, 0);
    return sum + area * p.precoM2;
  }, 0);
  const totalItens = projetos.reduce((s, p) => s + p.itens.length, 0);

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> Resumo Multi-Projeto</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Projetos</p>
              <p className="text-xl font-bold">{projetos.length}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Área Total</p>
              <p className="text-xl font-bold">{totalArea.toFixed(2)} m²</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Valor Total</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(totalValor)}</p>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Projeto</TableHead>
                <TableHead className="text-center">Itens</TableHead>
                <TableHead className="text-right">Área (m²)</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projetos.map((p) => {
                const area = p.itens.reduce((s, it) => s + calcAreaEfetiva(it.larguraMm, it.alturaMm, p.areaMinimaM2) * it.quantidade, 0);
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.titulo}</TableCell>
                    <TableCell className="text-center">{p.itens.length}</TableCell>
                    <TableCell className="text-right font-mono">{area.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">{formatCurrency(area * p.precoM2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center border-t pt-3 font-bold text-sm">
            <span>{totalItens} vidro(s) em {projetos.length} projeto(s)</span>
            <span className="text-primary">{formatCurrency(totalValor)}</span>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
