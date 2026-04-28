import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ClienteStepProps {
  cliente: string;
  onClienteChange: (value: string) => void;
}

export function ClienteStep({ cliente, onClienteChange }: ClienteStepProps) {
  return (
    <div className="max-w-md mx-auto p-3">
      <div className="space-y-1">
        <h2 className="text-lg font-bold">Dados do Cliente</h2>
        <p className="text-muted-foreground text-xs">Informe o nome do cliente</p>
      </div>
      <div className="space-y-1.5 mt-3">
        <Label>Cliente *</Label>
        <Input
          placeholder="Nome completo ou empresa"
          value={cliente}
          onChange={e => onClienteChange(e.target.value)}
          autoFocus
        />
      </div>
    </div>
  );
}
