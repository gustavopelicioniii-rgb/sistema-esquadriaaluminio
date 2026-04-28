import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Wand2, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface SetupTabProps {
  onComplete: (config: Record<string, string>) => void;
  onSwitchToEmpresa: () => void;
}

export function SetupTab({ onComplete, onSwitchToEmpresa }: SetupTabProps) {
  const [setupStep, setSetupStep] = useState(0);
  const [setupData, setSetupData] = useState({
    nomeEmpresa: '',
    cnpj: '',
    telefone: '',
    email: '',
    endereco: '',
    cidade: '',
    estado: '',
    segmento: 'esquadrias_aluminio',
    numFuncionarios: '1-5',
    usaNotaFiscal: false,
    usaWhatsapp: false,
  });
  const [setupLoading, setSetupLoading] = useState(false);

  const handleSetupComplete = async () => {
    setSetupLoading(true);
    const entries: Record<string, string> = {
      nome: setupData.nomeEmpresa,
      cnpj: setupData.cnpj,
      telefone: setupData.telefone,
      email: setupData.email,
      endereco: setupData.endereco,
      cidade: setupData.cidade,
      estado: setupData.estado,
    };
    for (const [chave, valor] of Object.entries(entries)) {
      if (valor) {
        await supabase.from('configuracoes').upsert({ chave, valor }, { onConflict: 'chave' });
      }
    }
    onComplete(entries);
    setSetupLoading(false);
    setSetupStep(4);
    toast.success('Sistema configurado!', {
      description: 'Suas informações foram salvas com sucesso.',
    });
  };

  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-base">Configuração Automática do Sistema</CardTitle>
            <CardDescription>
              Insira as informações da sua empresa e configure o sistema em poucos passos
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-8">
          {['Empresa', 'Detalhes', 'Integrações', 'Confirmar'].map((label, i) => (
            <div key={label} className="flex-1">
              <div
                className={`h-2 rounded-full transition-colors ${i <= setupStep && setupStep < 4 ? 'bg-primary' : i < 4 && setupStep >= 4 ? 'bg-success' : 'bg-muted'}`}
              />
              <span className="text-[10px] text-muted-foreground mt-1 block">{label}</span>
            </div>
          ))}
        </div>

        {setupStep === 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Dados da Empresa</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome da Empresa *</Label>
                <Input
                  value={setupData.nomeEmpresa}
                  onChange={e => setSetupData({ ...setupData, nomeEmpresa: e.target.value })}
                  placeholder="Minha Vidraçaria LTDA"
                />
              </div>
              <div className="space-y-2">
                <Label>CNPJ</Label>
                <Input
                  value={setupData.cnpj}
                  onChange={e => setSetupData({ ...setupData, cnpj: e.target.value })}
                  placeholder="00.000.000/0001-00"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input
                  value={setupData.telefone}
                  onChange={e => setSetupData({ ...setupData, telefone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input
                  value={setupData.email}
                  onChange={e => setSetupData({ ...setupData, email: e.target.value })}
                  placeholder="contato@empresa.com"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setSetupStep(1)} disabled={!setupData.nomeEmpresa}>
                Próximo →
              </Button>
            </div>
          </div>
        )}

        {setupStep === 1 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Detalhes do Negócio</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Endereço</Label>
                <Input
                  value={setupData.endereco}
                  onChange={e => setSetupData({ ...setupData, endereco: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input
                  value={setupData.cidade}
                  onChange={e => setSetupData({ ...setupData, cidade: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Input
                  value={setupData.estado}
                  onChange={e => setSetupData({ ...setupData, estado: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Segmento</Label>
                <Select
                  value={setupData.segmento}
                  onValueChange={v => setSetupData({ ...setupData, segmento: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="esquadrias_aluminio">Esquadrias de Alumínio</SelectItem>
                    <SelectItem value="vidracaria">Vidraçaria</SelectItem>
                    <SelectItem value="serralheria">Serralheria</SelectItem>
                    <SelectItem value="misto">Misto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nº de Funcionários</Label>
                <Select
                  value={setupData.numFuncionarios}
                  onValueChange={v => setSetupData({ ...setupData, numFuncionarios: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">1 a 5</SelectItem>
                    <SelectItem value="6-15">6 a 15</SelectItem>
                    <SelectItem value="16-50">16 a 50</SelectItem>
                    <SelectItem value="50+">Mais de 50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setSetupStep(0)}>
                ← Voltar
              </Button>
              <Button onClick={() => setSetupStep(2)}>Próximo →</Button>
            </div>
          </div>
        )}

        {setupStep === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Integrações</h3>
            <p className="text-sm text-muted-foreground">
              Selecione quais integrações deseja ativar
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <span className="font-medium text-sm">WhatsApp Business</span>
                  <p className="text-xs text-muted-foreground">
                    Envie notificações e lembretes via WhatsApp
                  </p>
                </div>
                <Switch
                  checked={setupData.usaWhatsapp}
                  onCheckedChange={v => setSetupData({ ...setupData, usaWhatsapp: v })}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <span className="font-medium text-sm">Nota Fiscal Eletrônica</span>
                  <p className="text-xs text-muted-foreground">
                    Emita NF-e diretamente pelo sistema
                  </p>
                </div>
                <Switch
                  checked={setupData.usaNotaFiscal}
                  onCheckedChange={v => setSetupData({ ...setupData, usaNotaFiscal: v })}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setSetupStep(1)}>
                ← Voltar
              </Button>
              <Button onClick={() => setSetupStep(3)}>Próximo →</Button>
            </div>
          </div>
        )}

        {setupStep === 3 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Confirmar Configuração</h3>
            <div className="rounded-lg border p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Empresa:</span>
                <span className="font-medium">{setupData.nomeEmpresa}</span>
              </div>
              {setupData.cnpj && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CNPJ:</span>
                  <span>{setupData.cnpj}</span>
                </div>
              )}
              {setupData.email && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">E-mail:</span>
                  <span>{setupData.email}</span>
                </div>
              )}
              {setupData.cidade && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cidade:</span>
                  <span>
                    {setupData.cidade} - {setupData.estado}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">WhatsApp:</span>
                <Badge variant={setupData.usaWhatsapp ? 'default' : 'secondary'}>
                  {setupData.usaWhatsapp ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">NF-e:</span>
                <Badge variant={setupData.usaNotaFiscal ? 'default' : 'secondary'}>
                  {setupData.usaNotaFiscal ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setSetupStep(2)}>
                ← Voltar
              </Button>
              <Button onClick={handleSetupComplete} disabled={setupLoading} className="gap-2">
                {setupLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                Configurar Sistema
              </Button>
            </div>
          </div>
        )}

        {setupStep >= 4 && (
          <div className="text-center py-8 space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-lg font-semibold">Sistema Configurado!</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Suas informações foram salvas. Você pode alterá-las a qualquer momento na aba{' '}
              <strong>Empresa</strong>.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSetupStep(0);
                onSwitchToEmpresa();
              }}
            >
              Ver Configurações
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
