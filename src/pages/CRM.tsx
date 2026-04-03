import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Phone, Plus, Trash2, Loader2, CalendarDays, MessageSquare, Eye, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors, useDraggable,
  useDroppable,
  type DragStartEvent, type DragEndEvent,
} from "@dnd-kit/core";
import {
  useCrmLeads, useUpdateLeadStatus, useUpdateLead, useCreateLead, useDeleteLead,
  type CrmLead, type CrmLeadStatus,
} from "@/hooks/use-crm-leads";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const columns: { id: CrmLeadStatus; title: string; badgeBg: string; badgeText: string }[] = [
  { id: "novo", title: "Novo", badgeBg: "bg-blue-100", badgeText: "text-blue-700" },
  { id: "qualificado", title: "Qualificado", badgeBg: "bg-indigo-100", badgeText: "text-indigo-700" },
  { id: "em_orcamento", title: "Proposta", badgeBg: "bg-orange-100", badgeText: "text-orange-700" },
  { id: "negociacao", title: "Negociação", badgeBg: "bg-red-100", badgeText: "text-red-600" },
  { id: "fechado", title: "Ganho", badgeBg: "bg-green-100", badgeText: "text-green-700" },
  { id: "perdido", title: "Perdido", badgeBg: "bg-red-50", badgeText: "text-red-500" },
];

function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-1 min-h-[400px] rounded-xl border-2 border-dashed p-3 transition-colors duration-200 flex flex-col gap-2",
        isOver ? "border-primary/40 bg-primary/5" : "border-border/40 bg-muted/20"
      )}
    >
      {children}
    </div>
  );
}

function LeadCard({ lead, onDelete, onView }: { lead: CrmLead; onDelete: (id: string) => void; onView: (lead: CrmLead) => void }) {
  const hasFollowUp = lead.follow_up_date;
  const isOverdue = hasFollowUp && new Date(lead.follow_up_date!) < new Date(new Date().toDateString());

  return (
    <div className="bg-card rounded-lg border border-border/60 shadow-sm hover:shadow-md transition-shadow p-3 cursor-grab active:cursor-grabbing">
      <div className="flex items-start gap-2">
        <GripVertical className="h-4 w-4 text-muted-foreground/40 mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate">{lead.nome}</p>
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
          <div className="flex items-center justify-between mt-2">
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
    </div>
  );
}

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

const emptyForm = { nome: "", valor: 0, telefone: "", email: "", status: "novo" as CrmLeadStatus, observacao: "", follow_up_date: null as string | null };

const CRM = () => {
  const { data: leads = [], isLoading } = useCrmLeads();
  const updateStatus = useUpdateLeadStatus();
  const updateLead = useUpdateLead();
  const createLead = useCreateLead();
  const deleteLead = useDeleteLead();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState<CrmLeadStatus>("novo");
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

  const openCreateDialog = (status: CrmLeadStatus) => {
    setForm({ ...emptyForm, status });
    setDialogStatus(status);
    setDialogOpen(true);
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CRM</h1>
          <p className="text-muted-foreground text-sm">Pipeline de vendas e gestão de leads</p>
        </div>
        <Button className="gap-2 rounded-lg" onClick={() => openCreateDialog("novo")}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Pipeline Board */}
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-4">
          {columns.map((col) => {
            const colLeads = getLeadsByStatus(col.id);
            return (
              <div key={col.id} className="flex flex-col min-w-[200px] flex-1">
                {/* Column Header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", col.badgeBg, col.badgeText)}>
                    {col.title}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">{colLeads.length}</span>
                  <button
                    onClick={() => openCreateDialog(col.id)}
                    className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Droppable Area */}
                <DroppableColumn id={col.id}>
                  {/* Add lead button at top */}
                  <button
                    onClick={() => openCreateDialog(col.id)}
                    className="w-full border-2 border-dashed border-border/50 rounded-lg py-3 text-xs text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
                  >
                    + Adicionar lead
                  </button>

                  {colLeads.map((lead) => (
                    <DraggableLeadCard key={lead.id} lead={lead} onDelete={handleDelete} onView={openDetail} />
                  ))}
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

export default CRM;
