import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Shield } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Admin {
  id: string;
  nome: string;
  email: string;
  role: string;
  ativo: boolean;
}

interface AdminsTabProps {
  admins: Admin[];
  setAdmins: React.Dispatch<React.SetStateAction<Admin[]>>;
}

export function AdminsTab({ admins, setAdmins }: AdminsTabProps) {
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ nome: "", email: "", role: "Admin" });

  const addAdmin = async () => {
    if (!newAdmin.nome || !newAdmin.email) return;
    const { error } = await supabase.from("administradores").insert({
      nome: newAdmin.nome, email: newAdmin.email, role: newAdmin.role,
    });
    if (error) { toast.error("Erro", { description: error.message }); return; }
    const { data } = await supabase.from("administradores").select("*").order("created_at");
    if (data) setAdmins(data as unknown as Admin[]);
    setNewAdmin({ nome: "", email: "", role: "Admin" });
    setShowAddAdmin(false);
    toast.success("Administrador adicionado");

    const { data: syncResult } = await supabase.functions.invoke("sync-admin-role", {
      body: { action: "grant", email: newAdmin.email },
    });
    if (syncResult?.message) {
      toast.success("Permissão", { description: syncResult.message });
    }
  };

  const removeAdmin = async (id: string) => {
    const adminToRemove = admins.find((a) => a.id === id);
    await supabase.from("administradores").delete().eq("id", id);
    setAdmins((prev) => prev.filter((a) => a.id !== id));
    toast.error("Administrador removido");

    if (adminToRemove?.email) {
      await supabase.functions.invoke("sync-admin-role", {
        body: { action: "revoke", email: adminToRemove.email },
      });
    }
  };

  const toggleAdmin = async (id: string) => {
    const a = admins.find((a) => a.id === id);
    if (!a) return;
    await supabase.from("administradores").update({ ativo: !a.ativo }).eq("id", id);
    setAdmins((prev) => prev.map((a) => a.id === id ? { ...a, ativo: !a.ativo } : a));

    if (a.email) {
      await supabase.functions.invoke("sync-admin-role", {
        body: { action: a.ativo ? "revoke" : "grant", email: a.email },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Administradores</h2>
          <p className="text-muted-foreground text-sm">Gerencie os administradores do sistema</p>
        </div>
        <Dialog open={showAddAdmin} onOpenChange={setShowAddAdmin}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Novo Admin</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Adicionar Administrador</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2"><Label>Nome</Label><Input value={newAdmin.nome} onChange={(e) => setNewAdmin({ ...newAdmin, nome: e.target.value })} /></div>
              <div className="space-y-2"><Label>E-mail</Label><Input type="email" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>Função</Label>
                <Select value={newAdmin.role} onValueChange={(v) => setNewAdmin({ ...newAdmin, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter><Button onClick={addAdmin} className="gap-2"><Shield className="h-4 w-4" /> Adicionar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm border-border/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.nome}</TableCell>
                <TableCell className="text-muted-foreground">{a.email}</TableCell>
                <TableCell><Badge variant="secondary" className="text-xs">{a.role}</Badge></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch checked={a.ativo} onCheckedChange={() => toggleAdmin(a.id)} />
                    <span className={`text-xs font-semibold ${a.ativo ? "text-success" : "text-muted-foreground"}`}>{a.ativo ? "Ativo" : "Inativo"}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => removeAdmin(a.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
