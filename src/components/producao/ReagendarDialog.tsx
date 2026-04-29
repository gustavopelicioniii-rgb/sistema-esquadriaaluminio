import { useState } from 'react';
import { ResponsiveDialog, ResponsiveDialogHeader, ResponsiveDialogTitle, ResponsiveDialogDescription, ResponsiveDialogFooter } from '@/components/ui/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Pedido } from '@/pages/Producao';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pedido: Pedido;
}

export default function ReagendarDialog({ open, onOpenChange, pedido }: Props) {
  const [novaData, setNovaData] = useState('');
  const [motivo, setMotivo] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSalvar = async () => {
    if (!novaData) {
      toast.error('Erro', { description: 'Informe a nova data.' });
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from('pedidos')
      .update({
        previsao: novaData,
        anotacao: motivo ? `Reagendado: ${motivo}` : pedido.anotacao,
      } as any)
      .eq('id', pedido.id);
    setSaving(false);

    if (error) {
      toast.error('Erro', { description: error.message });
      return;
    }
    toast.success('Reagendado', {
      description: `Pedido ${pedido.pedido_num} reagendado para ${novaData}.`,
    });
    setNovaData('');
    setMotivo('');
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange} size="sm">
      <ResponsiveDialogHeader>
        <ResponsiveDialogTitle>Reagendar Pedido {pedido.pedido_num}</ResponsiveDialogTitle>
        <ResponsiveDialogDescription>
          Defina uma nova data de previsão para o pedido.
        </ResponsiveDialogDescription>
      </ResponsiveDialogHeader>
      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <Label>Previsão atual</Label>
          <Input value={pedido.previsao || 'Não definida'} disabled />
        </div>
        <div className="space-y-2">
          <Label>Nova data de previsão</Label>
          <Input type="date" value={novaData} onChange={e => setNovaData(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Motivo do reagendamento</Label>
          <Textarea
            placeholder="Ex: Material atrasado pelo fornecedor..."
            value={motivo}
            onChange={e => setMotivo(e.target.value)}
          />
        </div>
      </div>
      <ResponsiveDialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button onClick={handleSalvar} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {saving ? 'Salvando...' : 'Reagendar'}
        </Button>
      </ResponsiveDialogFooter>
    </ResponsiveDialog>
  );
}
