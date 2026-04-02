import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Phone, Mail, MapPin, Eye, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  orcamentos: number;
}

const clientesMock: Cliente[] = [
  { id: "1", nome: "Igor Soares de Souza", telefone: "(11) 9602-2000", email: "igor@email.com", endereco: "Rua Teste, 1234", cidade: "Caieiras, SP", orcamentos: 5 },
  { id: "2", nome: "Maria Santos", telefone: "(11) 98888-5678", email: "maria@email.com", endereco: "Av. Brasil, 567", cidade: "São Paulo, SP", orcamentos: 3 },
  { id: "3", nome: "Carlos Oliveira", telefone: "(21) 97777-9012", email: "carlos@email.com", endereco: "Rua das Flores, 89", cidade: "Rio de Janeiro, RJ", orcamentos: 2 },
  { id: "4", nome: "Ana Costa", telefone: "(31) 96666-3456", email: "ana@email.com", endereco: "Rua Minas, 321", cidade: "Belo Horizonte, MG", orcamentos: 7 },
  { id: "5", nome: "Pedro Souza", telefone: "(41) 95555-7890", email: "pedro@email.com", endereco: "Rua Paraná, 456", cidade: "Curitiba, PR", orcamentos: 1 },
  { id: "6", nome: "Empresa Modelo Ltda", telefone: "(11) 97473-9209", email: "contato@modelo.com", endereco: "R. Arica Mirim, 12", cidade: "São Paulo, SP", orcamentos: 4 },
];

const Clientes = () => {
  const [search, setSearch] = useState("");

  const filtered = clientesMock.filter((c) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return c.nome.toLowerCase().includes(s) || c.telefone.includes(s) || c.email.toLowerCase().includes(s);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground text-sm">Gerencie sua base de clientes</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar cliente..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>Orçamentos</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.nome}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {c.telefone}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {c.email}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {c.cidade}
                  </div>
                </TableCell>
                <TableCell className="font-semibold">{c.orcamentos}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-0.5">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({ title: "Visualizar cliente", description: c.nome })}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => toast({ title: "Cliente removido", variant: "destructive" })}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Clientes;
