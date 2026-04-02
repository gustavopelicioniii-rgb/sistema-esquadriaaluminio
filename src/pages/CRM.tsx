import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { crmLeads, formatCurrency, type CrmLead } from "@/data/mockData";
import { Phone, GripVertical } from "lucide-react";

const columns = [
  { id: "novo" as const, title: "Novo", color: "bg-primary" },
  { id: "em_orcamento" as const, title: "Em Orçamento", color: "bg-warning" },
  { id: "negociacao" as const, title: "Negociação", color: "bg-[hsl(280,67%,55%)]" },
  { id: "fechado" as const, title: "Fechado", color: "bg-success" },
];

const CRM = () => {
  const [leads, setLeads] = useState<CrmLead[]>(crmLeads);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const getLeadsByStatus = (status: CrmLead["status"]) =>
    leads.filter((l) => l.status === status);

  const handleDragStart = (id: string) => setDraggedId(id);

  const handleDrop = (status: CrmLead["status"]) => {
    if (!draggedId) return;
    setLeads((prev) =>
      prev.map((l) => (l.id === draggedId ? { ...l, status } : l))
    );
    setDraggedId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">CRM</h1>
        <p className="text-muted-foreground text-sm">Gerencie seus leads e oportunidades</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colLeads = getLeadsByStatus(col.id);
          const total = colLeads.reduce((s, l) => s + l.valor, 0);
          return (
            <div
              key={col.id}
              className="flex flex-col"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(col.id)}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
                <h3 className="text-sm font-semibold">{col.title}</h3>
                <span className="ml-auto text-xs text-muted-foreground">
                  {colLeads.length} · {formatCurrency(total)}
                </span>
              </div>
              <div className="space-y-2 min-h-[200px] rounded-lg bg-muted/30 p-2">
                {colLeads.map((lead) => (
                  <Card
                    key={lead.id}
                    draggable
                    onDragStart={() => handleDragStart(lead.id)}
                    className="cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow border-border/50"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{lead.nome}</p>
                          <p className="text-base font-bold text-primary mt-0.5">
                            {formatCurrency(lead.valor)}
                          </p>
                          <div className="flex items-center gap-1 mt-1.5 text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span className="text-xs">{lead.telefone}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CRM;
