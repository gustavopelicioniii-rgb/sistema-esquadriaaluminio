import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Funcionario {
  id: string;
  nome: string;
  cargo: string;
  telefone: string;
  setor: string;
  ativo: boolean;
}

interface EquipeTabProps {
  funcionarios: Funcionario[];
  setFuncionarios: React.Dispatch<React.SetStateAction<Funcionario[]>>;
}

export function EquipeTab({ funcionarios, setFuncionarios }: EquipeTabProps) {
  const [showAddFunc, setShowAddFunc] = useState(false);
  const [newFunc, setNewFunc] = useState({ nome: '', cargo: '', telefone: '', setor: 'Produção' });

  const addFuncionario = async () => {
    if (!newFunc.nome) return;
    const { error } = await supabase.from('funcionarios').insert({
      nome: newFunc.nome,
      cargo: newFunc.cargo,
      telefone: newFunc.telefone,
      setor: newFunc.setor,
    });
    if (error) {
      toast.error('Erro', { description: error.message });
      return;
    }
    const { data } = await supabase.from('funcionarios').select('*').order('created_at');
    if (data) setFuncionarios(data as unknown as Funcionario[]);
    setNewFunc({ nome: '', cargo: '', telefone: '', setor: 'Produção' });
    setShowAddFunc(false);
    toast.success('Funcionário adicionado');
  };

  const removeFuncionario = async (id: string) => {
    await supabase.from('funcionarios').delete().eq('id', id);
    setFuncionarios(prev => prev.filter(f => f.id !== id));
    toast.error('Funcionário removido');
  };

  const toggleFuncionario = async (id: string) => {
    const f = funcionarios.find(f => f.id === id);
    if (!f) return;
    await supabase.from('funcionarios').update({ ativo: !f.ativo }).eq('id', id);
    setFuncionarios(prev => prev.map(f => (f.id === id ? { ...f, ativo: !f.ativo } : f)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Equipe</h2>
          <p className="text-muted-foreground text-sm">Gerencie seus funcionários</p>
        </div>
        <Dialog open={showAddFunc} onOpenChange={setShowAddFunc}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Novo Funcionário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Funcionário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  value={newFunc.nome}
                  onChange={e => setNewFunc({ ...newFunc, nome: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cargo</Label>
                  <Input
                    value={newFunc.cargo}
                    onChange={e => setNewFunc({ ...newFunc, cargo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    value={newFunc.telefone}
                    onChange={e => setNewFunc({ ...newFunc, telefone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Setor</Label>
                <Select
                  value={newFunc.setor}
                  onValueChange={v => setNewFunc({ ...newFunc, setor: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Produção">Produção</SelectItem>
                    <SelectItem value="Instalação">Instalação</SelectItem>
                    <SelectItem value="Comercial">Comercial</SelectItem>
                    <SelectItem value="Administrativo">Administrativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addFuncionario} className="gap-2">
                <Plus className="h-4 w-4" /> Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm border-border/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead className="hidden sm:table-cell">Telefone</TableHead>
              <TableHead>Setor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {funcionarios.map(f => (
              <TableRow key={f.id}>
                <TableCell className="font-medium">{f.nome}</TableCell>
                <TableCell>{f.cargo}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {f.telefone}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {f.setor}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch checked={f.ativo} onCheckedChange={() => toggleFuncionario(f.id)} />
                    <span
                      className={`text-xs font-semibold ${f.ativo ? 'text-success' : 'text-muted-foreground'}`}
                    >
                      {f.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => removeFuncionario(f.id)}
                  >
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
