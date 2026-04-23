import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ClienteStepProps {
  cliente: string;
  onClienteChange: (value: string) => void;
}

export function ClienteStep({ cliente, onClienteChange }: ClienteStepProps) {
  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Dados do Cliente</h2>
        <p className="text-muted-foreground text-sm">Informe o nome do cliente para este orçamento</p>
      </div>
      <div className="space-y-2">
        <Label>Cliente *</Label>
        <Input
          placeholder="Nome completo ou empresa"
          value={cliente}
          onChange={(e) => onClienteChange(e.target.value)}
          autoFocus
        />
      </div>
    </div>
  );
}
