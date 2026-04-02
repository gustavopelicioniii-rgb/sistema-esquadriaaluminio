import { useState } from "react";
import { orcamentos, formatCurrency, formatDate, type Orcamento } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Eye, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Orcamentos = () => {
  const [selectedOrcamento, setSelectedOrcamento] = useState<Orcamento | null>(null);
  const navigate = useNavigate();

  const handleDuplicate = (orc: Orcamento) => {
    toast({
      title: "Orçamento duplicado",
      description: `${orc.id} foi duplicado com sucesso.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orçamentos</h1>
          <p className="text-muted-foreground text-sm">Gerencie seus orçamentos e propostas</p>
        </div>
        <Button onClick={() => navigate("/orcamentos/novo")} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Orçamento
        </Button>
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orcamentos.map((orc) => (
              <TableRow key={orc.id}>
                <TableCell className="font-medium">{orc.id}</TableCell>
                <TableCell>{orc.cliente}</TableCell>
                <TableCell className="font-semibold">{formatCurrency(orc.valor)}</TableCell>
                <TableCell><StatusBadge status={orc.status} /></TableCell>
                <TableCell>{formatDate(orc.data)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedOrcamento(orc)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDuplicate(orc)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedOrcamento} onOpenChange={() => setSelectedOrcamento(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Orçamento {selectedOrcamento?.id}</DialogTitle>
            <DialogDescription>Detalhes do orçamento para {selectedOrcamento?.cliente}</DialogDescription>
          </DialogHeader>
          {selectedOrcamento && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Cliente</p>
                  <p className="font-medium">{selectedOrcamento.cliente}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Data</p>
                  <p className="font-medium">{formatDate(selectedOrcamento.data)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <StatusBadge status={selectedOrcamento.status} />
                </div>
                <div>
                  <p className="text-muted-foreground">Valor Total</p>
                  <p className="font-bold text-primary">{formatCurrency(selectedOrcamento.valor)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2">Itens</p>
                <div className="space-y-2">
                  {selectedOrcamento.itens.map((item, i) => (
                    <div key={i} className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm">
                      <div>
                        <span className="font-medium">{item.tipo}</span>
                        <span className="text-muted-foreground ml-2">
                          {item.largura}x{item.altura}cm · Qtd: {item.quantidade}
                        </span>
                      </div>
                      <span className="font-semibold">{formatCurrency(item.valorUnitario * item.quantidade)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orcamentos;
