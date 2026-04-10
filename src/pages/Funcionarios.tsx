import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Phone, Pencil, Search } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PageLoading } from "@/components/LoadingSpinner";
import { toast } from "sonner";

type Funcionario = {
  id: string;
  nome: string;
  cargo: string;
  telefone: string | null;
  setor: string;
  ativo: boolean;
};

const SETORES = ["Produção", "Instalação", "Comercial", "Administrativo", "Logística"];

const Funcionarios = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Funcionario | null>(null);
  const [form, setForm] = useState({ nome: "", cargo: "", telefone: "", setor: "Produção", ativo: true });

  const { data: funcionarios = [], isLoading } = useQuery({
    queryKey: ["funcionarios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("funcionarios")
        .select("*")
        .order("nome");
      if (error) throw error;
      return data as Funcionario[];
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (f: typeof form & { id?: string }) => {
      if (f.id) {
        const { error } = await supabase.from("funcionarios").update(f).eq("id", f.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("funcionarios").insert(f);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funcionarios"] });
      toast({ title: editing ? "Funcionário atualizado" : "Funcionário adicionado" });
      closeDialog();
    },
    onError: () => toast.error("Erro ao salvar"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("funcionarios").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funcionarios"] });
      toast.error("Funcionário removido");
    },
  });

  const openNew = () => {
    setEditing(null);
    setForm({ nome: "", cargo: "", telefone: "", setor: "Produção", ativo: true });
    setDialogOpen(true);
  };

  const openEdit = (f: Funcionario) => {
    setEditing(f);
    setForm({ nome: f.nome, cargo: f.cargo, telefone: f.telefone ?? "", setor: f.setor, ativo: f.ativo });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
  };

  const handleSubmit = () => {
    if (!form.nome.trim()) return toast.error("Nome é obrigatório");
    upsertMutation.mutate(editing ? { ...form, id: editing.id } : form);
  };

  const filtered = funcionarios.filter(
    (f) =>
      f.nome.toLowerCase().includes(search.toLowerCase()) ||
      f.cargo.toLowerCase().includes(search.toLowerCase()) ||
      f.setor.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <PageLoading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Funcionários</h1>
          <p className="text-muted-foreground text-sm">Gerencie a equipe de trabalho</p>
        </div>
        <Button className="gap-2" onClick={openNew}>
          <Plus className="h-4 w-4" /> Novo Funcionário
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar funcionário..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Setor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Nenhum funcionário encontrado
                </TableCell>
              </TableRow>
            )}
            {filtered.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-medium">{f.nome}</TableCell>
                <TableCell>{f.cargo}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {f.telefone || "—"}
                  </div>
                </TableCell>
                <TableCell><Badge variant="secondary" className="text-xs">{f.setor}</Badge></TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${f.ativo ? "text-success" : "text-muted-foreground"}`}>
                    <span className={`h-2 w-2 rounded-full ${f.ativo ? "bg-success" : "bg-muted-foreground"}`} />
                    {f.ativo ? "Ativo" : "Inativo"}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(f)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteMutation.mutate(f.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Funcionário" : "Novo Funcionário"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Cargo</Label>
              <Input value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Setor</Label>
              <Select value={form.setor} onValueChange={(v) => setForm({ ...form, setor: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SETORES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.ativo} onCheckedChange={(v) => setForm({ ...form, ativo: v })} />
              <Label>Ativo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={upsertMutation.isPending}>
              {upsertMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Funcionarios;
