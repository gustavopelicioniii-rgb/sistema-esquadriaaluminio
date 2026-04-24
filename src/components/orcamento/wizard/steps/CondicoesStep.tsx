import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";
import { formasPagamento } from "@/data/orcamento-produtos";
import { CreditCard, Percent } from "lucide-react";

interface CondicoesStepProps {
  margemPercent: number;
  onMargemChange: (value: number) => void;
  temAcrescimo: boolean;
  onTemAcrescimoChange: (value: boolean) => void;
  acrescimo: number;
  onAcrescimoChange: (value: number) => void;
  descontoTipo: "percent" | "valor";
  onDescontoTipoChange: (value: "percent" | "valor") => void;
  descontoValor: number;
  onDescontoValorChange: (value: number) => void;
  formaPagamento: string;
  onFormaPagamentoChange: (value: string) => void;
  parcelas: number;
  onParcelasChange: (value: number) => void;
  observacoes: string;
  onObservacoesChange: (value: string) => void;
  totalCusto: number;
  lucro: number;
  subtotal: number;
  descontoCalc: number;
  total: number;
}

export function CondicoesStep({
  margemPercent,
  onMargemChange,
  temAcrescimo,
  onTemAcrescimoChange,
  acrescimo,
  onAcrescimoChange,
  descontoTipo,
  onDescontoTipoChange,
  descontoValor,
  onDescontoValorChange,
  formaPagamento,
  onFormaPagamentoChange,
  parcelas,
  onParcelasChange,
  observacoes,
  onObservacoesChange,
  totalCusto,
  lucro,
  subtotal,
  descontoCalc,
  total,
}: CondicoesStepProps) {
  return (
    <div className="max-w-xl mx-auto p-3 space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-bold">Condições Comerciais</h2>
        <p className="text-muted-foreground text-xs">Margem, desconto e pagamento</p>
      </div>

      {/* Margem */}
      <div className="space-y-2">
        <Label>Margem de lucro (%)</Label>
        <div className="flex items-center gap-0">
          <span className="flex items-center justify-center h-10 w-10 bg-primary text-primary-foreground rounded-l-md text-sm font-bold">%</span>
          <Input type="number" value={margemPercent} onChange={(e) => onMargemChange(Number(e.target.value))}
            className="rounded-l-none" min={0} />
        </div>
      </div>

      {/* Acréscimo */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-0">
          <button onClick={() => onTemAcrescimoChange(false)}
            className={cn("py-2.5 text-sm font-medium rounded-l-lg border transition-colors",
              !temAcrescimo ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 border-border")}>
            Sem acréscimo
          </button>
          <button onClick={() => onTemAcrescimoChange(true)}
            className={cn("py-2.5 text-sm font-medium rounded-r-lg border border-l-0 transition-colors",
              temAcrescimo ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 border-border")}>
            Com acréscimo
          </button>
        </div>
        {temAcrescimo && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">R$</span>
            <Input type="number" value={acrescimo} onChange={(e) => onAcrescimoChange(Number(e.target.value))} placeholder="0,00" min={0} />
          </div>
        )}
      </div>

      {/* Desconto */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5"><Percent className="h-3.5 w-3.5" /> Desconto</Label>
        <div className="flex gap-2">
          <div className="grid grid-cols-2 gap-0 flex-1">
            <button onClick={() => onDescontoTipoChange("percent")}
              className={cn("py-2 text-sm font-medium rounded-l-lg border transition-colors",
                descontoTipo === "percent" ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 border-border")}>
              %
            </button>
            <button onClick={() => onDescontoTipoChange("valor")}
              className={cn("py-2 text-sm font-medium rounded-r-lg border border-l-0 transition-colors",
                descontoTipo === "valor" ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 border-border")}>
              R$
            </button>
          </div>
          <Input type="number" value={descontoValor} onChange={(e) => onDescontoValorChange(Number(e.target.value))}
            placeholder="0" min={0} className="w-32" />
        </div>
      </div>

      {/* Forma pagamento */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5" /> Forma de pagamento</Label>
        <Select value={formaPagamento} onValueChange={onFormaPagamentoChange}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {formasPagamento.map((f) => (
              <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Parcelas */}
      <div className="space-y-2">
        <Label>Parcelas</Label>
        <div className="flex items-center gap-0">
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-r-none"
            onClick={() => onParcelasChange(Math.max(1, parcelas - 1))}>
            <Minus className="h-4 w-4" />
          </Button>
          <Input type="number" value={parcelas} onChange={(e) => onParcelasChange(Math.max(1, Number(e.target.value)))}
            className="rounded-none text-center border-x-0" min={1} />
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-l-none"
            onClick={() => onParcelasChange(parcelas + 1)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {parcelas > 1 && (
          <p className="text-xs text-muted-foreground">{parcelas}x de {formatCurrency(total / parcelas)}</p>
        )}
      </div>

      {/* Observações */}
      <div className="space-y-2">
        <Label>Observações (opcional)</Label>
        <Textarea placeholder="Observações adicionais..." value={observacoes}
          onChange={(e) => onObservacoesChange(e.target.value)} rows={3} />
      </div>

      {/* Resumo parcial */}
      <Card className="bg-muted/30">
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Custo total</span>
            <span className="font-medium">{formatCurrency(totalCusto)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Lucro ({margemPercent}%)</span>
            <span className="font-medium text-green-600">{formatCurrency(lucro)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          {descontoCalc > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Desconto</span>
              <span>- {formatCurrency(descontoCalc)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t font-bold">
            <span>TOTAL</span>
            <span className="text-lg">{formatCurrency(total)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
