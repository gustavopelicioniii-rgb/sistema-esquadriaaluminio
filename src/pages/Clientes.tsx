import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Search, Phone, Mail, MapPin, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/use-page-title";
import { supabase } from "@/integrations/supabase/client";

type Cliente = {
  id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  cidade: string | null;
  orcamentos_count: number;
};

const emptyForm = { nome: "", telefone: "", email: "", endereco: "", cidade: "" };

const Clientes = () => {
  usePageTitle("Clientes");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchClientes = async () => {
    const { data, error } = await supabase.from("clientes").select("*").order("nome");
    if (!error && data) setClientes(data);
    setLoading(false);
  };

  useEffect(() => { fetchClientes(); }, []);

  const filtered = clientes.filter((c) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return c.nome.toLowerCase().includes(s) || (c.telefone || "").includes(s) || (c.email || "").toLowerCase().includes(s);
  });

  const openNew = () => { setForm(emptyForm); setEditingId(null); setDialogOpen(true); };
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

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("clientes").delete().eq("id", id);
    if (error) { toast({ title: "Erro ao remover", variant: "destructive" }); return; }
    toast({ title: "Cliente removido", variant: "destructive" });
    fetchClientes();
  };

  const updateField = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground text-sm">Gerencie sua base de clientes</p>
        </div>
        <Button className="gap-2" onClick={openNew}><Plus className="h-4 w-4" /> Novo Cliente</Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar cliente..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
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
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4" /></Button>
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
    </div>
  );
};

export default Clientes;
