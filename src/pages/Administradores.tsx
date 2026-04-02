import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const admins = [
  { id: "1", nome: "Igor Soares de Souza", email: "igor@alumpro.com", role: "Super Admin", ativo: true },
  { id: "2", nome: "Gabriel Martins", email: "gabriel@alumpro.com", role: "Admin", ativo: true },
  { id: "3", nome: "Carlos Silva", email: "carlos@alumpro.com", role: "Admin", ativo: false },
];

const Administradores = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Administradores</h1>
          <p className="text-muted-foreground text-sm">Gerencie os administradores do sistema</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Novo Administrador
        </Button>
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
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
                <TableCell><Badge variant="secondary" className="text-xs">{admin.role}</Badge></TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${admin.ativo ? "text-success" : "text-muted-foreground"}`}>
                    <span className={`h-2 w-2 rounded-full ${admin.ativo ? "bg-success" : "bg-muted-foreground"}`} />
                    {admin.ativo ? "Ativo" : "Inativo"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => toast({ title: "Administrador removido", variant: "destructive" })}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Administradores;
