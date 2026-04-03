import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Phone, GripVertical, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useCrmLeads, useUpdateLeadStatus, useCreateLead, useDeleteLead, type CrmLead, type CrmLeadStatus } from "@/hooks/use-crm-leads";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const columns: { id: CrmLeadStatus; title: string; color: string }[] = [
  { id: "novo", title: "Novo", color: "bg-primary" },
  { id: "em_orcamento", title: "Em Orçamento", color: "bg-warning" },
  { id: "negociacao", title: "Negociação", color: "bg-[hsl(280,67%,55%)]" },
  { id: "fechado", title: "Fechado", color: "bg-success" },
];

function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`space-y-2 min-h-[200px] rounded-lg p-2 transition-colors duration-200 ${
        isOver ? "bg-primary/10 ring-2 ring-primary/30" : "bg-muted/30"
      }`}
    >
      {children}
    </div>
  );
}

function LeadCard({ lead, onDelete }: { lead: CrmLead; onDelete: (id: string) => void }) {
  return (
    <Card className="cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow border-border/50">
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{lead.nome}</p>
            <p className="text-base font-bold text-primary mt-0.5">
              {formatCurrency(lead.valor)}
            </p>
            <div className="flex items-center justify-between mt-1.5">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Phone className="h-3 w-3" />
                <span className="text-xs">{lead.telefone}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={(e) => { e.stopPropagation(); onDelete(lead.id); }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const emptyForm = { nome: "", valor: 0, telefone: "", email: "", status: "novo" as CrmLeadStatus, observacao: "" };

const CRM = () => {
  const { data: leads = [], isLoading } = useCrmLeads();
  const updateStatus = useUpdateLeadStatus();
  const createLead = useCreateLead();
  const deleteLead = useDeleteLead();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const getLeadsByStatus = (status: CrmLeadStatus) =>
    leads.filter((l) => l.status === status);

  const activeLead = activeId ? leads.find((l) => l.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const leadId = active.id as string;
    const newStatus = over.id as CrmLeadStatus;
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.status === newStatus) return;

    updateStatus.mutate(
      { id: leadId, status: newStatus },
      { onSuccess: () => toast.success(`Lead movido para ${columns.find(c => c.id === newStatus)?.title}`) }
    );
  };

  const handleCreate = () => {
    if (!form.nome.trim()) { toast.error("Nome é obrigatório"); return; }
    createLead.mutate(form, {
      onSuccess: () => {
        toast.success("Lead criado com sucesso");
        setDialogOpen(false);
        setForm(emptyForm);
      },
    });
  };

  const handleDelete = (id: string) => {
    deleteLead.mutate(id, {
      onSuccess: () => toast.success("Lead removido"),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CRM</h1>
          <p className="text-muted-foreground text-sm">Gerencie seus leads e oportunidades</p>
        </div>
        <Button className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Novo Lead
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 overflow-x-auto">
          {columns.map((col) => {
            const colLeads = getLeadsByStatus(col.id);
            const total = colLeads.reduce((s, l) => s + l.valor, 0);
            return (
              <div key={col.id} className="flex flex-col min-w-[250px]">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
                  <h3 className="text-sm font-semibold">{col.title}</h3>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {colLeads.length} · {formatCurrency(total)}
                  </span>
                </div>
                <DroppableColumn id={col.id}>
                  {colLeads.map((lead) => (
                    <div key={lead.id} id={lead.id} data-id={lead.id}>
                      <DraggableLeadCard lead={lead} onDelete={handleDelete} />
                    </div>
                  ))}
                  {colLeads.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-8">
                      Arraste leads aqui
                    </p>
                  )}
                </DroppableColumn>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeLead ? (
            <div className="opacity-90 rotate-2 scale-105">
              <LeadCard lead={activeLead} onDelete={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* New Lead Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Novo Lead</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Nome *</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Valor</Label><Input type="number" value={form.valor || ""} onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })} /></div>
              <div className="space-y-1.5"><Label>Telefone</Label><Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} /></div>
            </div>
            <div className="space-y-1.5"><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={createLead.isPending}>
              {createLead.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar Lead"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function DraggableLeadCard({ lead, onDelete }: { lead: CrmLead; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.3 : 1,
    transition: isDragging ? "none" : "transform 200ms ease",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <LeadCard lead={lead} onDelete={onDelete} />
    </div>
  );
}

export default CRM;
