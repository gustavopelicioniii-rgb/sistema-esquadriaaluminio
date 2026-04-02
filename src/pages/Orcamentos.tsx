import { useState } from "react";
import { orcamentos, formatCurrency, formatDate, type Orcamento } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Eye, Copy, Send, Trash2, Search, FileDown, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { generatePdfFromElement } from "@/utils/pdfGenerator";

type FilterStatus = "todos" | "pendente" | "aprovado" | "recusado";

const filterItems: { key: FilterStatus; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "pendente", label: "Pendente" },
  { key: "aprovado", label: "Aprovado" },
  { key: "recusado", label: "Recusado" },
];

const Orcamentos = () => {
  const [selectedOrcamento, setSelectedOrcamento] = useState<Orcamento | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("todos");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = orcamentos.filter((orc) => {
    if (filter !== "todos" && orc.status !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return orc.cliente.toLowerCase().includes(s) || orc.produto.toLowerCase().includes(s) || orc.id.toLowerCase().includes(s);
    }
    return true;
  });

  const getCounts = (status: FilterStatus) =>
    status === "todos" ? orcamentos.length : orcamentos.filter((o) => o.status === status).length;

  const handleDuplicate = (orc: Orcamento) => {
    toast({ title: "Orçamento duplicado", description: `${orc.id} foi duplicado com sucesso.` });
  };

  const handleSend = (orc: Orcamento) => {
    toast({ title: "Orçamento enviado", description: `${orc.id} foi enviado para ${orc.cliente}.` });
  };

  const handleDelete = (orc: Orcamento) => {
    toast({ title: "Orçamento excluído", description: `${orc.id} foi removido.`, variant: "destructive" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orçamentos</h1>
          <p className="text-muted-foreground text-sm">Gerencie os orçamentos emitidos para seus clientes.</p>
        </div>
        <Button onClick={() => navigate("/orcamentos/novo")} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Orçamento
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <div className="w-48 shrink-0 space-y-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">FILTRAR POR STATUS</p>
            <div className="space-y-0.5">
              {filterItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setFilter(item.key)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    filter === item.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {item.label}
                  <span className={cn(
                    "flex h-5 min-w-5 items-center justify-center rounded-full text-[10px] font-bold",
                    filter === item.key ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {getCounts(item.key)}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">AÇÕES</p>
            <button onClick={() => navigate("/orcamentos/novo")} className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
              <Plus className="h-3.5 w-3.5" /> Novo orçamento
            </button>
            <button className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline mt-1">
              <FileDown className="h-3.5 w-3.5" /> Exportar PDF
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente, produto ou ID..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="rounded-lg border bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((orc) => (
                  <TableRow key={orc.id}>
                    <TableCell className="font-semibold text-primary">{orc.id}</TableCell>
                    <TableCell className="font-medium">{orc.cliente}</TableCell>
                    <TableCell className="text-muted-foreground">{orc.produto}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(orc.data)}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(orc.valor)}</TableCell>
                    <TableCell><StatusBadge status={orc.status} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-0.5">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedOrcamento(orc)} title="Visualizar">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDuplicate(orc)} title="Duplicar">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleSend(orc)} title="Enviar">
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(orc)} title="Excluir">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      Nenhum orçamento encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Detail modal */}
      <Dialog open={!!selectedOrcamento} onOpenChange={() => setSelectedOrcamento(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Orçamento {selectedOrcamento?.id}</DialogTitle>
            <DialogDescription>Detalhes do orçamento para {selectedOrcamento?.cliente}</DialogDescription>
          </DialogHeader>
          {selectedOrcamento && (
            <div id="orcamento-pdf-content" className="space-y-4">
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
                  <p className="text-muted-foreground">Produto</p>
                  <p className="font-medium">{selectedOrcamento.produto}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <StatusBadge status={selectedOrcamento.status} />
                </div>
              </div>
              <div className="border-t pt-4">
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
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-semibold">Valor Total</span>
                <span className="text-xl font-bold text-primary">{formatCurrency(selectedOrcamento.valor)}</span>
              </div>
              <Button
                className="w-full gap-2 mt-2"
                onClick={async () => {
                  toast({ title: "Gerando PDF...", description: "Aguarde um momento." });
                  await generatePdfFromElement(
                    `orcamento-pdf-content`,
                    `orcamento-${selectedOrcamento.id}.pdf`
                  );
                  toast({ title: "PDF gerado!", description: `Orçamento ${selectedOrcamento.id} exportado.` });
                }}
              >
                <FileDown className="h-4 w-4" /> Exportar PDF
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orcamentos;
