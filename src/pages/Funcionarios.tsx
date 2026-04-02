import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Phone } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const funcionarios = [
  { id: "1", nome: "Marcos Pereira", cargo: "Montador", telefone: "(11) 91111-4567", setor: "Produção", ativo: true },
  { id: "2", nome: "José Almeida", cargo: "Cortador", telefone: "(11) 92222-3456", setor: "Produção", ativo: true },
  { id: "3", nome: "Rafael Costa", cargo: "Instalador", telefone: "(11) 93333-2345", setor: "Instalação", ativo: true },
  { id: "4", nome: "Fernando Lima", cargo: "Vendedor", telefone: "(11) 94444-1234", setor: "Comercial", ativo: true },
  { id: "5", nome: "Lucas Rocha", cargo: "Auxiliar", telefone: "(11) 95555-0123", setor: "Produção", ativo: false },
];

const Funcionarios = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Funcionários</h1>
          <p className="text-muted-foreground text-sm">Gerencie a equipe de trabalho</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Novo Funcionário
        </Button>
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
            {funcionarios.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-medium">{f.nome}</TableCell>
                <TableCell>{f.cargo}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {f.telefone}
                  </div>
                </TableCell>
                <TableCell><Badge variant="secondary" className="text-xs">{f.setor}</Badge></TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${f.ativo ? "text-success" : "text-muted-foreground"}`}>
                    <span className={`h-2 w-2 rounded-full ${f.ativo ? "bg-success" : "bg-muted-foreground"}`} />
                    {f.ativo ? "Ativo" : "Inativo"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => toast({ title: "Funcionário removido", variant: "destructive" })}>
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

export default Funcionarios;
