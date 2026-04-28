import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, FileDown, MessageCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { tiposProduto, formasPagamento } from '@/data/orcamento-produtos';
import { getColorById } from '@/components/frame-preview/colors';

const ferragemColors = [
  { id: 'cromado', name: 'Cromado', hex: '#C0C0C0' },
  { id: 'preto', name: 'Preto', hex: '#333333' },
  { id: 'branco', name: 'Branco', hex: '#F0F0F0' },
  { id: 'bronze', name: 'Bronze', hex: '#8B6914' },
];

export interface RevisaoItem {
  id: string;
  tipo: string;
  largura: number;
  altura: number;
  quantidade: number;
  colorId: string;
  ferragemColorId: string;
  vidroTipo: string;
  ambiente: string;
}

interface RevisaoStepProps {
  cliente: string;
  items: RevisaoItem[];
  margemPercent: number;
  acrescimo: number;
  descontoCalc: number;
  formaPagamento: string;
  parcelas: number;
  observacoes: string;
  total: number;
  onEditItens: () => void;
  onPDF: () => void;
  onWhatsApp: () => void;
}

export function RevisaoStep({
  cliente,
  items,
  margemPercent,
  acrescimo,
  descontoCalc,
  formaPagamento,
  parcelas,
  observacoes,
  total,
  onEditItens,
  onPDF,
  onWhatsApp,
}: RevisaoStepProps) {
  return (
    <div className="max-w-2xl mx-auto p-3 space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-bold">Revisão do Orçamento</h2>
        <p className="text-muted-foreground text-xs">Verifique antes de salvar</p>
      </div>

      {/* Cliente card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-medium text-lg">{cliente}</p>
        </CardContent>
      </Card>

      {/* Itens card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Itens ({items.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((item, idx) => {
            const prod = tiposProduto.find(t => t.value === item.tipo);
            return (
              <div
                key={item.id}
                className="flex items-start justify-between py-2 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">{prod?.label || 'Item'}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.largura * 10}×{item.altura * 10}mm • Qtd: {item.quantidade} •{' '}
                    {item.ambiente || 'Sem ambiente'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.vidroTipo} • {getColorById(item.colorId).name} •{' '}
                    {ferragemColors.find(c => c.id === item.ferragemColorId)?.name}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEditItens}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Condições card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Condições</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Margem</span>
            <span>{margemPercent}%</span>
          </div>
          {acrescimo > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Acréscimo</span>
              <span>+ {formatCurrency(acrescimo)}</span>
            </div>
          )}
          {descontoCalc > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Desconto</span>
              <span>- {formatCurrency(descontoCalc)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pagamento</span>
            <span>
              {formasPagamento.find(f => f.value === formaPagamento)?.label} ({parcelas}x)
            </span>
          </div>
          {observacoes && (
            <div className="pt-2 border-t">
              <p className="text-muted-foreground text-xs">Obs:</p>
              <p className="text-sm">{observacoes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Total */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">TOTAL</span>
            <span className="text-2xl font-bold">{formatCurrency(total)}</span>
          </div>
          {parcelas > 1 && (
            <p className="text-sm text-muted-foreground text-right mt-1">
              {parcelas}x de {formatCurrency(total / parcelas)}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={onPDF} disabled={!cliente} className="gap-2">
          <FileDown className="h-4 w-4" /> PDF
        </Button>
        <Button
          onClick={onWhatsApp}
          disabled={!cliente}
          className="gap-2 text-green-600 border-green-600/30 hover:bg-green-600/10"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </Button>
      </div>
    </div>
  );
}
