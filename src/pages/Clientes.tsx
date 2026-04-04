import { useState, useEffect, useCallback } from "react";
import { PullToRefresh } from "@/components/PullToRefresh";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Phone, Mail, MapPin, Pencil, Trash2, GripVertical, Loader2, CalendarDays, MessageSquare, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { usePageTitle } from "@/hooks/use-page-title";
import { supabase } from "@/integrations/supabase/client";
import {
  DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors, useDraggable, useDroppable,
  type DragStartEvent, type DragEndEvent,
} from "@dnd-kit/core";
import { useCrmLeads, useUpdateLeadStatus, useUpdateLead, useCreateLead, useDeleteLead, type CrmLead, type CrmLeadStatus } from "@/hooks/use-crm-leads";

// ── Types ──
type Cliente = {
  id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  cidade: string | null;
  orcamentos_count: number;
};

const emptyClientForm = { nome: "", telefone: "", email: "", endereco: "", cidade: "" };

// ── Kanban helpers ──
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
        "flex-1 min-h-[300px] sm:min-h-[400px] rounded-xl border-2 border-dashed p-2 sm:p-3 transition-colors duration-200 flex flex-col gap-2",
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

// ── Main Component ──
const Clientes = () => {
  usePageTitle("Clientes");

  // Client state
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyClientForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Kanban state
  const { data: leads = [], isLoading: leadsLoading } = useCrmLeads();
  const updateStatus = useUpdateLeadStatus();
  const updateLead = useUpdateLead();
  const createLead = useCreateLead();
  const deleteLead = useDeleteLead();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [leadDialogOpen, setLeadDialogOpen] = useState(false);
  const [leadDialogStatus, setLeadDialogStatus] = useState<CrmLeadStatus>("novo");
  const [leadForm, setLeadForm] = useState({ nome: "", valor: 0, telefone: "", email: "", status: "novo" as CrmLeadStatus, observacao: "", follow_up_date: null as string | null });
  const [detailLead, setDetailLead] = useState<CrmLead | null>(null);
  const [editObs, setEditObs] = useState("");
  const [editFollowUp, setEditFollowUp] = useState<Date | undefined>();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  // ── Client logic ──
  const fetchClientes = useCallback(async () => {
    const { data, error } = await supabase.from("clientes").select("*").order("nome");
    if (!error && data) setClientes(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchClientes(); }, []);

  const filtered = clientes.filter((c) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return c.nome.toLowerCase().includes(s) || (c.telefone || "").includes(s) || (c.email || "").toLowerCase().includes(s);
  });

  const openNew = () => { setForm(emptyClientForm); setEditingId(null); setDialogOpen(true); };
  const openEdit = (c: Cliente) => {
    setForm({ nome: c.nome, telefone: c.telefone || "", email: c.email || "", endereco: c.endereco || "", cidade: c.cidade || "" });
    setEditingId(c.id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.nome.trim()) { toast({ title: "Nome obrigatório", variant: "destructive" }); return; }
    if (editingId) {
      const { error } = await supabase.from("clientes").update(form).eq("id", editingId);
      if (error) { toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Cliente atualizado" });
    } else {
      const { error } = await supabase.from("clientes").insert(form);
      if (error) { toast({ title: "Erro ao cadastrar", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Cliente cadastrado" });
    }
    setDialogOpen(false);
    fetchClientes();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("clientes").delete().eq("id", deleteId);
    if (error) { toast({ title: "Erro ao remover", variant: "destructive" }); return; }
    toast({ title: "Cliente removido", variant: "destructive" });
    setDeleteId(null);
    fetchClientes();
  };

  const updateField = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  // ── Kanban logic ──
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
    updateStatus.mutate(
      { id: leadId, status: newStatus },
      { onSuccess: () => sonnerToast.success(`Lead movido para ${columns.find(c => c.id === newStatus)?.title}`) }
    );
  };

  const openCreateLeadDialog = (status: CrmLeadStatus) => {
    setLeadForm({ nome: "", valor: 0, telefone: "", email: "", status, observacao: "", follow_up_date: null });
    setLeadDialogStatus(status);
    setLeadDialogOpen(true);
  };

  const handleCreateLead = () => {
    if (!leadForm.nome.trim()) { sonnerToast.error("Nome é obrigatório"); return; }
    createLead.mutate(leadForm, {
      onSuccess: () => { sonnerToast.success("Lead criado"); setLeadDialogOpen(false); },
    });
  };

  const handleDeleteLead = (id: string) => {
    deleteLead.mutate(id, { onSuccess: () => sonnerToast.success("Lead removido") });
  };

  const openLeadDetail = (lead: CrmLead) => {
    setDetailLead(lead);
    setEditObs(lead.observacao || "");
    setEditFollowUp(lead.follow_up_date ? new Date(lead.follow_up_date) : undefined);
  };

  const saveLeadDetail = () => {
    if (!detailLead) return;
    updateLead.mutate({
      id: detailLead.id,
      observacao: editObs,
      follow_up_date: editFollowUp ? format(editFollowUp, "yyyy-MM-dd") : null,
    }, {
      onSuccess: () => { sonnerToast.success("Lead atualizado"); setDetailLead(null); },
    });
  };

  return (
    <PullToRefresh onRefresh={fetchClientes}>
    <div className="space-y-6">
      <div>
        <h1 className="text-lg sm:text-2xl font-bold tracking-tight">Clientes</h1>
        <p className="text-muted-foreground text-xs sm:text-sm">Gerencie clientes e leads</p>
      </div>

      <Tabs defaultValue="lista">
        <TabsList>
          <TabsTrigger value="lista">Lista</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
        </TabsList>

        {/* ── Tab Lista ── */}
        <TabsContent value="lista" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar cliente..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Button className="gap-2" onClick={openNew}><Plus className="h-4 w-4" /> Novo Cliente</Button>
          </div>

          <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">Telefone</TableHead>
                  <TableHead className="hidden lg:table-cell">E-mail</TableHead>
                  <TableHead className="hidden md:table-cell">Cidade</TableHead>
                  <TableHead>Orçamentos</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Carregando...</TableCell></TableRow>
                ) : filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.nome}</TableCell>
                    <TableCell className="hidden md:table-cell"><div className="flex items-center gap-1.5 text-muted-foreground"><Phone className="h-3 w-3" />{c.telefone}</div></TableCell>
                    <TableCell className="hidden lg:table-cell"><div className="flex items-center gap-1.5 text-muted-foreground"><Mail className="h-3 w-3" />{c.email}</div></TableCell>
                    <TableCell className="hidden md:table-cell"><div className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-3 w-3" />{c.cidade}</div></TableCell>
                    <TableCell className="font-semibold">{c.orcamentos_count}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-0.5">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(c.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && filtered.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Nenhum cliente encontrado.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ── Tab Kanban ── */}
        <TabsContent value="kanban" className="space-y-4">
          <div className="flex justify-end">
            <Button className="gap-2 rounded-lg" onClick={() => openCreateLeadDialog("novo")}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {leadsLoading ? (
            <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-4 -mx-3 px-3 sm:mx-0 sm:px-0">
                {columns.map((col) => {
                  const colLeads = getLeadsByStatus(col.id);
                  return (
                    <div key={col.id} className="flex flex-col min-w-[150px] sm:min-w-[200px] flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", col.badgeBg, col.badgeText)}>
                          {col.title}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">{colLeads.length}</span>
                        <button onClick={() => openCreateLeadDialog(col.id)} className="ml-auto text-muted-foreground hover:text-foreground transition-colors">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <DroppableColumn id={col.id}>
                        <button onClick={() => openCreateLeadDialog(col.id)} className="w-full border-2 border-dashed border-border/50 rounded-lg py-3 text-xs text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors">
                          + Adicionar lead
                        </button>
                        {colLeads.map((lead) => (
                          <DraggableLeadCard key={lead.id} lead={lead} onDelete={handleDeleteLead} onView={openLeadDetail} />
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
          )}
        </TabsContent>
      </Tabs>

      {/* Client Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editingId ? "Editar Cliente" : "Novo Cliente"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Nome *</Label><Input value={form.nome} onChange={(e) => updateField("nome", e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Telefone</Label><Input value={form.telefone} onChange={(e) => updateField("telefone", e.target.value)} /></div>
              <div className="space-y-1.5"><Label>E-mail</Label><Input value={form.email} onChange={(e) => updateField("email", e.target.value)} /></div>
            </div>
            <div className="space-y-1.5"><Label>Endereço</Label><Input value={form.endereco} onChange={(e) => updateField("endereco", e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Cidade</Label><Input value={form.cidade} onChange={(e) => updateField("cidade", e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editingId ? "Salvar" : "Cadastrar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lead Dialog */}
      <Dialog open={leadDialogOpen} onOpenChange={setLeadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Novo Lead</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input placeholder="Nome do lead" value={leadForm.nome} onChange={(e) => setLeadForm({ ...leadForm, nome: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor (R$)</Label>
                <Input type="number" placeholder="0,00" value={leadForm.valor || ""} onChange={(e) => setLeadForm({ ...leadForm, valor: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input placeholder="(00) 00000-0000" value={leadForm.telefone} onChange={(e) => setLeadForm({ ...leadForm, telefone: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input placeholder="email@exemplo.com" value={leadForm.email} onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Observação</Label>
              <Textarea rows={2} value={leadForm.observacao} onChange={(e) => setLeadForm({ ...leadForm, observacao: e.target.value })} placeholder="Anotações sobre o lead..." />
            </div>
            <div className="space-y-2">
              <Label>Data de Follow-up</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-10", !leadForm.follow_up_date && "text-muted-foreground")}>
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {leadForm.follow_up_date ? format(new Date(leadForm.follow_up_date), "dd/MM/yyyy") : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={leadForm.follow_up_date ? new Date(leadForm.follow_up_date) : undefined}
                    onSelect={(d) => setLeadForm({ ...leadForm, follow_up_date: d ? format(d, "yyyy-MM-dd") : null })}
                    locale={ptBR} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLeadDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateLead} disabled={createLead.isPending}>
              {createLead.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar Lead"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lead Detail Dialog */}
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
            <Button onClick={saveLeadDetail} disabled={updateLead.isPending}>
              {updateLead.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Client Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cliente?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Clientes;
