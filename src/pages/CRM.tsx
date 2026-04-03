import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Phone, GripVertical, Plus, Trash2, Loader2, CalendarDays, MessageSquare, Eye } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors, useDraggable,
  type DragStartEvent, type DragEndEvent,
} from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import {
  useCrmLeads, useUpdateLeadStatus, useUpdateLead, useCreateLead, useDeleteLead,
  type CrmLead, type CrmLeadStatus,
} from "@/hooks/use-crm-leads";

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
    <div ref={setNodeRef} className={`space-y-2 min-h-[200px] rounded-lg p-2 transition-colors duration-200 ${isOver ? "bg-primary/10 ring-2 ring-primary/30" : "bg-muted/30"}`}>
      {children}
    </div>
  );
}

function LeadCard({ lead, onDelete, onView }: { lead: CrmLead; onDelete: (id: string) => void; onView: (lead: CrmLead) => void }) {
  const hasFollowUp = lead.follow_up_date;
  const isOverdue = hasFollowUp && new Date(lead.follow_up_date!) < new Date(new Date().toDateString());

  return (
    <Card className="cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow border-border/50">
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{lead.nome}</p>
            <p className="text-base font-bold text-primary mt-0.5">{formatCurrency(lead.valor)}</p>
            {lead.observacao && (
              <p className="text-xs text-muted-foreground mt-1 truncate flex items-center gap-1">
                <MessageSquare className="h-3 w-3 shrink-0" /> {lead.observacao}
              </p>
            )}
            {hasFollowUp && (
              <p className={cn("text-xs mt-1 flex items-center gap-1", isOverdue ? "text-destructive font-medium" : "text-muted-foreground")}>
                <CalendarDays className="h-3 w-3 shrink-0" />
                {format(new Date(lead.follow_up_date!), "dd/MM/yyyy")}
                {isOverdue && " (atrasado)"}
              </p>
            )}
            <div className="flex items-center justify-between mt-1.5">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Phone className="h-3 w-3" />
                <span className="text-xs">{lead.telefone}</span>
              </div>
              <div className="flex gap-0.5">
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary"
                  onClick={(e) => { e.stopPropagation(); onView(lead); }}>
                  <Eye className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={(e) => { e.stopPropagation(); onDelete(lead.id); }}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const emptyForm = { nome: "", valor: 0, telefone: "", email: "", status: "novo" as CrmLeadStatus, observacao: "", follow_up_date: null as string | null };

const CRM = () => {
  const { data: leads = [], isLoading } = useCrmLeads();
  const updateStatus = useUpdateLeadStatus();
  const updateLead = useUpdateLead();
  const createLead = useCreateLead();
  const deleteLead = useDeleteLead();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailLead, setDetailLead] = useState<CrmLead | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editObs, setEditObs] = useState("");
  const [editFollowUp, setEditFollowUp] = useState<Date | undefined>();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const getLeadsByStatus = (status: CrmLeadStatus) => leads.filter((l) => l.status === status);
  const activeLead = activeId ? leads.find((l) => l.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const leadId = active.id as string;
    const newStatus = over.id as CrmLeadStatus;
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.status === newStatus) return;
    updateStatus.mutate({ id: leadId, status: newStatus }, {
      onSuccess: () => toast.success(`Lead movido para ${columns.find(c => c.id === newStatus)?.title}`),
    });
  };

  const handleCreate = () => {
    if (!form.nome.trim()) { toast.error("Nome é obrigatório"); return; }
    createLead.mutate(form, {
      onSuccess: () => { toast.success("Lead criado"); setDialogOpen(false); setForm(emptyForm); },
    });
  };

  const handleDelete = (id: string) => {
    deleteLead.mutate(id, { onSuccess: () => toast.success("Lead removido") });
  };

  const openDetail = (lead: CrmLead) => {
    setDetailLead(lead);
    setEditObs(lead.observacao || "");
    setEditFollowUp(lead.follow_up_date ? new Date(lead.follow_up_date) : undefined);
  };

  const saveDetail = () => {
    if (!detailLead) return;
    updateLead.mutate({
      id: detailLead.id,
      observacao: editObs,
      follow_up_date: editFollowUp ? format(editFollowUp, "yyyy-MM-dd") : null,
    }, {
      onSuccess: () => { toast.success("Lead atualizado"); setDetailLead(null); },
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
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

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 overflow-x-auto">
          {columns.map((col) => {
            const colLeads = getLeadsByStatus(col.id);
            const total = colLeads.reduce((s, l) => s + l.valor, 0);
            return (
              <div key={col.id} className="flex flex-col min-w-[250px]">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
                  <h3 className="text-sm font-semibold">{col.title}</h3>
                  <span className="ml-auto text-xs text-muted-foreground">{colLeads.length} · {formatCurrency(total)}</span>
                </div>
                <DroppableColumn id={col.id}>
                  {colLeads.map((lead) => (
                    <div key={lead.id}><DraggableLeadCard lead={lead} onDelete={handleDelete} onView={openDetail} /></div>
                  ))}
                  {colLeads.length === 0 && <p className="text-xs text-muted-foreground text-center py-8">Arraste leads aqui</p>}
                </DroppableColumn>
              </div>
            );
          })}
        </div>
        <DragOverlay>
          {activeLead ? <div className="opacity-90 rotate-2 scale-105"><LeadCard lead={activeLead} onDelete={() => {}} onView={() => {}} /></div> : null}
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
            <div className="space-y-1.5"><Label>Observação</Label><Textarea rows={2} value={form.observacao} onChange={(e) => setForm({ ...form, observacao: e.target.value })} placeholder="Anotações sobre o lead..." /></div>
            <div className="space-y-1.5">
              <Label>Data de Follow-up</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !form.follow_up_date && "text-muted-foreground")}>
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {form.follow_up_date ? format(new Date(form.follow_up_date), "dd/MM/yyyy") : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={form.follow_up_date ? new Date(form.follow_up_date) : undefined}
                    onSelect={(d) => setForm({ ...form, follow_up_date: d ? format(d, "yyyy-MM-dd") : null })}
                    locale={ptBR} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={createLead.isPending}>
              {createLead.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar Lead"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail / Edit Dialog */}
      <Dialog open={!!detailLead} onOpenChange={(open) => { if (!open) setDetailLead(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{detailLead?.nome}</DialogTitle></DialogHeader>
          {detailLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Valor:</span> <span className="font-semibold">{formatCurrency(detailLead.valor)}</span></div>
                <div><span className="text-muted-foreground">Telefone:</span> <span>{detailLead.telefone || "—"}</span></div>
                <div><span className="text-muted-foreground">Email:</span> <span>{detailLead.email || "—"}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <span className="font-medium">{columns.find(c => c.id === detailLead.status)?.title}</span></div>
              </div>
              <div className="space-y-1.5">
                <Label>Observação</Label>
                <Textarea rows={3} value={editObs} onChange={(e) => setEditObs(e.target.value)} placeholder="Anotações, detalhes do contato..." />
              </div>
              <div className="space-y-1.5">
                <Label>Data de Follow-up</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !editFollowUp && "text-muted-foreground")}>
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {editFollowUp ? format(editFollowUp, "dd/MM/yyyy") : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={editFollowUp} onSelect={setEditFollowUp} locale={ptBR} className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
                {editFollowUp && (
                  <Button variant="ghost" size="sm" className="text-xs" onClick={() => setEditFollowUp(undefined)}>Limpar data</Button>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailLead(null)}>Cancelar</Button>
            <Button onClick={saveDetail} disabled={updateLead.isPending}>
              {updateLead.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function DraggableLeadCard({ lead, onDelete, onView }: { lead: CrmLead; onDelete: (id: string) => void; onView: (lead: CrmLead) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: lead.id });
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.3 : 1,
    transition: isDragging ? "none" : "transform 200ms ease",
  };
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <LeadCard lead={lead} onDelete={onDelete} onView={onView} />
    </div>
  );
}

export default CRM;
