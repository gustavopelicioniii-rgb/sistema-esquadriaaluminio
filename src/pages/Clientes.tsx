import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Phone, Mail, MapPin, Pencil, Trash2, GripVertical, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { usePageTitle } from "@/hooks/use-page-title";
import { supabase } from "@/integrations/supabase/client";
import {
  DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors, useDraggable, useDroppable,
  type DragStartEvent, type DragEndEvent,
} from "@dnd-kit/core";
import { useCrmLeads, useUpdateLeadStatus, useCreateLead, useDeleteLead, type CrmLead, type CrmLeadStatus } from "@/hooks/use-crm-leads";

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

function LeadCard({ lead, onDelete }: { lead: CrmLead; onDelete: (id: string) => void }) {
  return (
    <Card className="cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow border-border/50">
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{lead.nome}</p>
            <p className="text-base font-bold text-primary mt-0.5">{formatCurrency(lead.valor)}</p>
            <div className="flex items-center justify-between mt-1.5">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Phone className="h-3 w-3" />
                <span className="text-xs">{lead.telefone}</span>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(lead.id); }}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DraggableLeadCard({ lead, onDelete }: { lead: CrmLead; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: lead.id });
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

const emptyLeadForm = { nome: "", valor: 0, telefone: "", email: "", status: "novo" as CrmLeadStatus, observacao: "" };

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
  const createLead = useCreateLead();
  const deleteLead = useDeleteLead();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [leadDialogOpen, setLeadDialogOpen] = useState(false);
  const [leadForm, setLeadForm] = useState(emptyLeadForm);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  // ── Client logic ──
  const fetchClientes = async () => {
    const { data, error } = await supabase.from("clientes").select("*").order("nome");
    if (!error && data) setClientes(data);
    setLoading(false);
  };

  useState(() => { fetchClientes(); });

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

  const handleCreateLead = () => {
    if (!leadForm.nome.trim()) { sonnerToast.error("Nome é obrigatório"); return; }
    createLead.mutate(leadForm, {
      onSuccess: () => { sonnerToast.success("Lead criado"); setLeadDialogOpen(false); setLeadForm(emptyLeadForm); },
    });
  };

  const handleDeleteLead = (id: string) => {
    deleteLead.mutate(id, { onSuccess: () => sonnerToast.success("Lead removido") });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
        <p className="text-muted-foreground text-sm">Gerencie clientes e leads</p>
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
            <Button className="gap-2" onClick={() => setLeadDialogOpen(true)}>
              <Plus className="h-4 w-4" /> Novo Lead
            </Button>
          </div>

          {leadsLoading ? (
            <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
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
                          <div key={lead.id}><DraggableLeadCard lead={lead} onDelete={handleDeleteLead} /></div>
                        ))}
                        {colLeads.length === 0 && <p className="text-xs text-muted-foreground text-center py-8">Arraste leads aqui</p>}
                      </DroppableColumn>
                    </div>
                  );
                })}
              </div>
              <DragOverlay>
                {activeLead ? <div className="opacity-90 rotate-2 scale-105"><LeadCard lead={activeLead} onDelete={() => {}} /></div> : null}
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
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Nome *</Label><Input value={leadForm.nome} onChange={(e) => setLeadForm({ ...leadForm, nome: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Valor</Label><Input type="number" value={leadForm.valor || ""} onChange={(e) => setLeadForm({ ...leadForm, valor: Number(e.target.value) })} /></div>
              <div className="space-y-1.5"><Label>Telefone</Label><Input value={leadForm.telefone} onChange={(e) => setLeadForm({ ...leadForm, telefone: e.target.value })} /></div>
            </div>
            <div className="space-y-1.5"><Label>Email</Label><Input value={leadForm.email} onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLeadDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateLead} disabled={createLead.isPending}>
              {createLead.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar Lead"}
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
