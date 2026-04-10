import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
interface AdminRecord {
  id: string;
  nome: string;
  email: string;
  role: string;
  ativo: boolean;
}

const Administradores = () => {
  const { user, role } = useAuth();
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("administradores")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("Erro ao carregar administradores", { description: error.message });
    } else {
      setAdmins((data as AdminRecord[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleGrant = async () => {
    if (!email.trim()) return;
    setActionLoading("grant");
    try {
      const { data, error } = await supabase.functions.invoke("sync-admin-role", {
        body: { action: "grant", email: email.trim() },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.success) {
        toast({ title: data.message || "Admin concedido com sucesso" });
        // Also add to administradores display table
        await supabase.from("administradores").upsert(
          { email: email.trim().toLowerCase(), nome: email.trim().split("@")[0], role: "Admin", ativo: true },
          { onConflict: "email" }
        );
        setEmail("");
        setDialogOpen(false);
        fetchAdmins();
      } else {
        toast({ title: data?.message || "Operação falhou", variant: "destructive" });
      }
    } catch (err: any) {
      toast.error("Erro", { description: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevoke = async (admin: AdminRecord) => {
    setActionLoading(admin.id);
    try {
      const { data, error } = await supabase.functions.invoke("sync-admin-role", {
        body: { action: "revoke", email: admin.email },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.success) {
        toast({ title: data.message || "Admin removido" });
        await supabase.from("administradores").delete().eq("id", admin.id);
        fetchAdmins();
      } else {
        toast({ title: data?.message || "Operação falhou", variant: "destructive" });
      }
    } catch (err: any) {
      toast.error("Erro", { description: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  if (role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <ShieldCheck className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold text-destructive mb-2">Acesso Negado</h2>
        <p className="text-muted-foreground">Somente administradores podem acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Administradores</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie os administradores do sistema via permissões de acesso
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Novo Administrador
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Conceder Acesso Admin</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="admin-email">E-mail do usuário</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="usuario@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  O usuário precisa ter uma conta criada no sistema antes de receber a permissão.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleGrant}
                disabled={!email.trim() || actionLoading === "grant"}
                className="gap-2"
              >
                {actionLoading === "grant" && <Loader2 className="h-4 w-4 animate-spin" />}
                Conceder Admin
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : admins.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum administrador cadastrado.
          </div>
        ) : (
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
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.nome}</TableCell>
                  <TableCell className="text-muted-foreground">{admin.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{admin.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${admin.ativo ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                      <span className={`h-2 w-2 rounded-full ${admin.ativo ? "bg-green-500" : "bg-muted-foreground"}`} />
                      {admin.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      disabled={actionLoading === admin.id || admin.email === user?.email}
                      onClick={() => handleRevoke(admin)}
                    >
                      {actionLoading === admin.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Administradores;
