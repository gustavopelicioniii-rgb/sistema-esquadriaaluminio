import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Plus,
  Trash2,
  Plug,
  Copy,
  Eye,
  EyeOff,
  Edit2,
  Save,
  Shield,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ApiConfig {
  id: string;
  nome: string;
  chave: string;
  ativa: boolean;
  descricao: string;
}

interface ApisTabProps {
  apis: ApiConfig[];
  setApis: React.Dispatch<React.SetStateAction<ApiConfig[]>>;
}

export function ApisTab({ apis, setApis }: ApisTabProps) {
  const [showAddApi, setShowAddApi] = useState(false);
  const [newApi, setNewApi] = useState({ nome: '', chave: '', descricao: '' });
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [editingApi, setEditingApi] = useState<ApiConfig | null>(null);
  const [showEditApi, setShowEditApi] = useState(false);
  const [testingKey, setTestingKey] = useState(false);
  const [keyTestResult, setKeyTestResult] = useState<'success' | 'error' | null>(null);

  const testApiKey = async (key: string): Promise<boolean> => {
    if (!key || key.trim().length < 8) {
      setKeyTestResult('error');
      toast.error('Chave inválida', { description: 'A chave deve ter pelo menos 8 caracteres.' });
      return false;
    }
    setTestingKey(true);
    setKeyTestResult(null);
    await new Promise(r => setTimeout(r, 1000));
    const validPrefixes = [
      'sk_',
      'pk_',
      'key_',
      'api_',
      'bearer_',
      'token_',
      'ghp_',
      'xoxb-',
      'AIza',
    ];
    const looksValid =
      validPrefixes.some(p => key.toLowerCase().startsWith(p.toLowerCase())) || key.length >= 16;
    setTestingKey(false);
    if (looksValid) {
      setKeyTestResult('success');
      toast.success('Chave válida', { description: 'O formato da chave parece correto.' });
      return true;
    } else {
      setKeyTestResult('error');
      toast.error('Chave suspeita', {
        description: 'O formato da chave não corresponde aos padrões conhecidos.',
      });
      return false;
    }
  };

  const addApi = async () => {
    if (!newApi.nome) return;
    if (newApi.chave) {
      const valid = await testApiKey(newApi.chave);
      if (!valid) return;
    }
    const { data, error } = await supabase
      .from('api_integracoes')
      .insert({
        nome: newApi.nome,
        chave: newApi.chave,
        descricao: newApi.descricao,
      })
      .select()
      .single();
    if (error) {
      toast.error('Erro ao adicionar API', { description: error.message });
      return;
    }
    setApis(prev => [...prev, data as unknown as ApiConfig]);
    setNewApi({ nome: '', chave: '', descricao: '' });
    setShowAddApi(false);
    setKeyTestResult(null);
    toast.success('API adicionada');
  };

  const updateApi = async () => {
    if (!editingApi) return;
    if (editingApi.chave) {
      const valid = await testApiKey(editingApi.chave);
      if (!valid) return;
    }
    const { error } = await supabase
      .from('api_integracoes')
      .update({
        nome: editingApi.nome,
        chave: editingApi.chave,
        descricao: editingApi.descricao,
      })
      .eq('id', editingApi.id);
    if (error) {
      toast.error('Erro ao atualizar', { description: error.message });
      return;
    }
    setApis(prev => prev.map(a => (a.id === editingApi.id ? { ...a, ...editingApi } : a)));
    setShowEditApi(false);
    setEditingApi(null);
    setKeyTestResult(null);
    toast.success('API atualizada');
  };

  const toggleApi = async (id: string) => {
    const api = apis.find(a => a.id === id);
    if (!api) return;
    await supabase.from('api_integracoes').update({ ativa: !api.ativa }).eq('id', id);
    setApis(prev => prev.map(a => (a.id === id ? { ...a, ativa: !a.ativa } : a)));
  };

  const removeApi = async (id: string) => {
    await supabase.from('api_integracoes').delete().eq('id', id);
    setApis(prev => prev.filter(a => a.id !== id));
    toast.error('API removida');
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Integrações & APIs</h2>
          <p className="text-muted-foreground text-sm">
            Gerencie chaves de API e integrações externas
          </p>
        </div>
        <Dialog open={showAddApi} onOpenChange={setShowAddApi}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Nova API
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Integração</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Nome da API</Label>
                <Input
                  placeholder="Ex: WhatsApp, Google Maps..."
                  value={newApi.nome}
                  onChange={e => setNewApi({ ...newApi, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Chave da API</Label>
                <Input
                  placeholder="sk_live_..."
                  value={newApi.chave}
                  onChange={e => {
                    setNewApi({ ...newApi, chave: e.target.value });
                    setKeyTestResult(null);
                  }}
                />
                {keyTestResult === 'success' && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Formato válido
                  </p>
                )}
                {keyTestResult === 'error' && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Formato inválido
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  placeholder="Para que serve esta integração?"
                  value={newApi.descricao}
                  onChange={e => setNewApi({ ...newApi, descricao: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                disabled={testingKey || !newApi.chave}
                onClick={() => testApiKey(newApi.chave)}
                className="gap-2"
              >
                {testingKey ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Shield className="h-4 w-4" />
                )}{' '}
                Testar Chave
              </Button>
              <Button onClick={addApi} className="gap-2">
                <Plug className="h-4 w-4" /> Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog
        open={showEditApi}
        onOpenChange={open => {
          setShowEditApi(open);
          if (!open) {
            setEditingApi(null);
            setKeyTestResult(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Integração</DialogTitle>
          </DialogHeader>
          {editingApi && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Nome da API</Label>
                <Input
                  value={editingApi.nome}
                  onChange={e => setEditingApi({ ...editingApi, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Chave da API</Label>
                <Input
                  value={editingApi.chave}
                  onChange={e => {
                    setEditingApi({ ...editingApi, chave: e.target.value });
                    setKeyTestResult(null);
                  }}
                />
                {keyTestResult === 'success' && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Formato válido
                  </p>
                )}
                {keyTestResult === 'error' && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Formato inválido
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={editingApi.descricao}
                  onChange={e => setEditingApi({ ...editingApi, descricao: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              disabled={testingKey || !editingApi?.chave}
              onClick={() => editingApi && testApiKey(editingApi.chave)}
              className="gap-2"
            >
              {testingKey ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Shield className="h-4 w-4" />
              )}{' '}
              Testar Chave
            </Button>
            <Button onClick={updateApi} className="gap-2">
              <Save className="h-4 w-4" /> Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {apis.map(api => (
          <Card
            key={api.id}
            className={`shadow-sm border-border/50 transition-opacity ${!api.ativa ? 'opacity-60' : ''}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Plug className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">{api.nome}</span>
                    <Badge variant={api.ativa ? 'default' : 'secondary'} className="text-[10px]">
                      {api.ativa ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{api.descricao}</p>
                  {api.chave && (
                    <div className="flex items-center gap-2 mt-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                        {visibleKeys.has(api.id) ? api.chave : '••••••••••••••••'}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => toggleKeyVisibility(api.id)}
                      >
                        {visibleKeys.has(api.id) ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          navigator.clipboard.writeText(api.chave);
                          toast.success('Chave copiada');
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setEditingApi(api);
                      setShowEditApi(true);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Switch checked={api.ativa} onCheckedChange={() => toggleApi(api.id)} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => removeApi(api.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
