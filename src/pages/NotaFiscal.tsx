import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { FileDown, FileText, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { generateNotaFiscalPDF } from '@/utils/notaFiscalPdfGenerator';

export interface NotaFiscalData {
  // Emitente
  emitenteNome: string;
  emitenteEndereco: string;
  emitenteCidade: string;
  emitenteUF: string;
  emitenteCEP: string;
  emitenteCNPJ: string;
  emitenteFone: string;
  emitenteInscEstadual: string;
  // Destinatário
  destNome: string;
  destEndereco: string;
  destCidade: string;
  destUF: string;
  destCEP: string;
  destCNPJ: string;
  destFone: string;
  destInscEstadual: string;
  // Documento
  tipoDocumento: string;
  tipoServico: string;
  modal: string;
  formaPagamento: string;
  modelo: string;
  serie: string;
  numero: string;
  folha: string;
  naturezaPrestacao: string;
  origemCidade: string;
  origemUF: string;
  destinoCidade: string;
  destinoUF: string;
  observacoes: string;
}

const initialData: NotaFiscalData = {
  emitenteNome: '',
  emitenteEndereco: '',
  emitenteCidade: '',
  emitenteUF: 'SP',
  emitenteCEP: '',
  emitenteCNPJ: '',
  emitenteFone: '',
  emitenteInscEstadual: '',
  destNome: '',
  destEndereco: '',
  destCidade: '',
  destUF: 'SP',
  destCEP: '',
  destCNPJ: '',
  destFone: '',
  destInscEstadual: '',
  tipoDocumento: 'CT-e Normal',
  tipoServico: 'Normal',
  modal: 'Rodoviário',
  formaPagamento: 'Pago',
  modelo: '57',
  serie: '0',
  numero: '',
  folha: '1/1',
  naturezaPrestacao: '5357-Transporte Rodoviário de Cargas',
  origemCidade: '',
  origemUF: 'SP',
  destinoCidade: '',
  destinoUF: 'MG',
  observacoes: '',
};

const ufs = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

export default function NotaFiscal() {
  const [data, setData] = useState<NotaFiscalData>(initialData);

  const update = (field: keyof NotaFiscalData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleExportPDF = async () => {
    if (!data.emitenteNome || !data.destNome) {
      toast.error('Preencha ao menos o nome do emitente e destinatário');
      return;
    }
    toast.info('Gerando PDF...');
    await generateNotaFiscalPDF(data);
    toast.success('PDF da Nota Fiscal gerado!');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Nota Fiscal (CT-e)
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Gere documentos fiscais no modelo CT-e
          </p>
        </div>
        <Button onClick={handleExportPDF} className="gap-2 w-full sm:w-auto">
          <FileDown className="h-4 w-4" />
          Gerar PDF
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Emitente */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-primary flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Remetente / Emitente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Nome / Razão Social</Label>
              <Input
                placeholder="Nome da empresa"
                value={data.emitenteNome}
                onChange={e => update('emitenteNome', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Endereço</Label>
              <Input
                placeholder="Rua, nº - Bairro"
                value={data.emitenteEndereco}
                onChange={e => update('emitenteEndereco', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Cidade</Label>
                <Input
                  value={data.emitenteCidade}
                  onChange={e => update('emitenteCidade', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">UF</Label>
                <Select value={data.emitenteUF} onValueChange={v => update('emitenteUF', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ufs.map(u => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">CEP</Label>
                <Input
                  placeholder="00000-000"
                  value={data.emitenteCEP}
                  onChange={e => update('emitenteCEP', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs">CNPJ/CPF</Label>
                <Input
                  value={data.emitenteCNPJ}
                  onChange={e => update('emitenteCNPJ', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Insc. Estadual</Label>
                <Input
                  value={data.emitenteInscEstadual}
                  onChange={e => update('emitenteInscEstadual', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Telefone</Label>
              <Input
                placeholder="(00) 0000-0000"
                value={data.emitenteFone}
                onChange={e => update('emitenteFone', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Destinatário */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-primary flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Destinatário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Nome / Razão Social</Label>
              <Input
                placeholder="Nome da empresa"
                value={data.destNome}
                onChange={e => update('destNome', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Endereço</Label>
              <Input
                placeholder="Rua, nº - Bairro"
                value={data.destEndereco}
                onChange={e => update('destEndereco', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Cidade</Label>
                <Input
                  value={data.destCidade}
                  onChange={e => update('destCidade', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">UF</Label>
                <Select value={data.destUF} onValueChange={v => update('destUF', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ufs.map(u => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">CEP</Label>
                <Input
                  placeholder="00000-000"
                  value={data.destCEP}
                  onChange={e => update('destCEP', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs">CNPJ/CPF</Label>
                <Input value={data.destCNPJ} onChange={e => update('destCNPJ', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Insc. Estadual</Label>
                <Input
                  value={data.destInscEstadual}
                  onChange={e => update('destInscEstadual', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Telefone</Label>
              <Input
                placeholder="(00) 0000-0000"
                value={data.destFone}
                onChange={e => update('destFone', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dados do Documento */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-primary">Dados do Documento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Tipo CT-e</Label>
              <Select value={data.tipoDocumento} onValueChange={v => update('tipoDocumento', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CT-e Normal">CT-e Normal</SelectItem>
                  <SelectItem value="CT-e Complementar">CT-e Complementar</SelectItem>
                  <SelectItem value="CT-e Anulação">CT-e Anulação</SelectItem>
                  <SelectItem value="CT-e Substituto">CT-e Substituto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Tipo Serviço</Label>
              <Select value={data.tipoServico} onValueChange={v => update('tipoServico', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Subcontratação">Subcontratação</SelectItem>
                  <SelectItem value="Redespacho">Redespacho</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Modal</Label>
              <Select value={data.modal} onValueChange={v => update('modal', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rodoviário">Rodoviário</SelectItem>
                  <SelectItem value="Aéreo">Aéreo</SelectItem>
                  <SelectItem value="Aquaviário">Aquaviário</SelectItem>
                  <SelectItem value="Ferroviário">Ferroviário</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Forma Pgto</Label>
              <Select value={data.formaPagamento} onValueChange={v => update('formaPagamento', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pago">Pago</SelectItem>
                  <SelectItem value="A Pagar">A Pagar</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Modelo</Label>
              <Input value={data.modelo} onChange={e => update('modelo', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Série</Label>
              <Input value={data.serie} onChange={e => update('serie', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Número</Label>
              <Input
                placeholder="Nº do CT-e"
                value={data.numero}
                onChange={e => update('numero', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Folha</Label>
              <Input value={data.folha} onChange={e => update('folha', e.target.value)} />
            </div>
          </div>

          <Separator />

          <div className="space-y-1.5">
            <Label className="text-xs">Natureza da Prestação (CFOP)</Label>
            <Input
              value={data.naturezaPrestacao}
              onChange={e => update('naturezaPrestacao', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Origem da Prestação</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs">Cidade</Label>
                  <Input
                    value={data.origemCidade}
                    onChange={e => update('origemCidade', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">UF</Label>
                  <Select value={data.origemUF} onValueChange={v => update('origemUF', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ufs.map(u => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Destino da Prestação</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs">Cidade</Label>
                  <Input
                    value={data.destinoCidade}
                    onChange={e => update('destinoCidade', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">UF</Label>
                  <Select value={data.destinoUF} onValueChange={v => update('destinoUF', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ufs.map(u => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Observações</Label>
            <Input
              placeholder="Informações complementares"
              value={data.observacoes}
              onChange={e => update('observacoes', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
