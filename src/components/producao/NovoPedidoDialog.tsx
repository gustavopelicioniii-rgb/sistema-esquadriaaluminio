import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Cliente {
  id: string;
  nome: string;
  telefone: string | null;
  endereco: string | null;
}

interface Orcamento {
  id: string;
  numero: string;
  cliente: string;
  valor: number;
  produto: string;
}

interface NovoPedidoDialogProps {
  open: boolean;
  onClose: () => void;
  nextNum: number;
}

export default function NovoPedidoDialog({ open, onClose, nextNum }: NovoPedidoDialogProps) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [clienteId, setClienteId] = useState('');
  const [orcamentoId, setOrcamentoId] = useState('nenhum');
  const [vendedor, setVendedor] = useState('');
  const [valor, setValor] = useState('');
  const [previsao, setPrevisao] = useState('');
  const [anotacao, setAnotacao] = useState('');

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    Promise.all([
      supabase.from('clientes').select('id, nome, telefone, endereco').order('nome'),
      supabase
        .from('orcamentos')
        .select('id, numero, cliente, valor, produto')
        .eq('status', 'aprovado')
        .order('created_at', { ascending: false }),
    ]).then(([cRes, oRes]) => {
      setClientes(cRes.data ?? []);
      setOrcamentos(oRes.data ?? []);
      setLoading(false);
    });
    // reset form
    setClienteId('');
    setOrcamentoId('nenhum');
    setVendedor('');
    setValor('');
    setPrevisao('');
    setAnotacao('');
  }, [open]);

  const selectedCliente = clientes.find(c => c.id === clienteId);

  // When orcamento is selected, auto-fill valor
  useEffect(() => {
    if (orcamentoId && orcamentoId !== 'nenhum') {
      const orc = orcamentos.find(o => o.id === orcamentoId);
      if (orc) {
        setValor(String(orc.valor));
        // Also auto-select the client matching the orcamento
        const matchingCliente = clientes.find(c => c.nome === orc.cliente);
        if (matchingCliente) setClienteId(matchingCliente.id);
      }
    }
  }, [orcamentoId, orcamentos, clientes]);

  const handleSave = async () => {
    if (!clienteId) {
      toast.error('Selecione um cliente');
      return;
    }
    if (!valor || Number(valor) <= 0) {
      toast.error('Informe o valor');
      return;
    }

    setSaving(true);
    const { error } = await supabase.from('pedidos').insert({
      pedido_num: nextNum,
      cliente: selectedCliente?.nome ?? '',
      endereco: selectedCliente?.endereco ?? '',
      telefone: selectedCliente?.telefone ?? '',
      vendedor,
      valor: Number(valor),
      previsao: previsao || null,
      status: 'em_andamento',
      dias_restantes: previsao
        ? Math.ceil((new Date(previsao).getTime() - Date.now()) / 86400000)
        : 30,
      etapa: 'Orçamento',
      anotacao,
    } as any);
    setSaving(false);

    if (error) {
      toast.error('Erro ao criar pedido', { description: error.message });
      return;
    }
    toast.success('Pedido criado', { description: `Pedido #${nextNum} criado com sucesso.` });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo Pedido #{nextNum}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cliente */}
            <div className="space-y-1.5">
              <Label>Cliente *</Label>
              <Select value={clienteId} onValueChange={setClienteId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Orçamento vinculado */}
            <div className="space-y-1.5">
              <Label>Orçamento vinculado</Label>
              <Select value={orcamentoId} onValueChange={setOrcamentoId}>
                <SelectTrigger>
                  <SelectValue placeholder="Nenhum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nenhum">Nenhum</SelectItem>
                  {orcamentos.map(o => (
                    <SelectItem key={o.id} value={o.id}>
                      #{o.numero} — {o.cliente} — R${' '}
                      {o.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Valor */}
              <div className="space-y-1.5">
                <Label>Valor (R$) *</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={valor}
                  onChange={e => setValor(e.target.value)}
                  placeholder="0,00"
                />
              </div>
              {/* Previsão */}
              <div className="space-y-1.5">
                <Label>Previsão de entrega</Label>
                <Input type="date" value={previsao} onChange={e => setPrevisao(e.target.value)} />
              </div>
            </div>

            {/* Vendedor */}
            <div className="space-y-1.5">
              <Label>Vendedor</Label>
              <Input
                value={vendedor}
                onChange={e => setVendedor(e.target.value)}
                placeholder="Nome do vendedor"
              />
            </div>

            {/* Anotação */}
            <div className="space-y-1.5">
              <Label>Observações</Label>
              <Textarea
                value={anotacao}
                onChange={e => setAnotacao(e.target.value)}
                placeholder="Anotações sobre o pedido..."
                rows={2}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving || loading}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Criar Pedido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
