import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { tiposProduto } from "@/data/orcamento-produtos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Save, Loader2, DollarSign, Percent } from "lucide-react";
import { toast } from "sonner";

interface MarkupConfig {
  id: string;
  product_type: string;
  margem_percent: number;
  custo_base_m2: number;
  obs: string;
}

export default function ConfiguracaoMarkup() {
  const [configs, setConfigs] = useState<MarkupConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<MarkupConfig>>({});

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      const { data, error } = await supabase
        .from("markup_config")
        .select("*")
        .order("product_type");
      
      if (error) throw error;
      setConfigs(data || []);
    } catch (err: any) {
      console.error("Error loading markup configs:", err);
      toast.error("Erro ao carregar configurações");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editData.product_type || !editData.margem_percent) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from("markup_config")
          .update({
            margem_percent: editData.margem_percent,
            custo_base_m2: editData.custo_base_m2,
            obs: editData.obs,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Configuração atualizada!");
      } else {
        const { error } = await supabase
          .from("markup_config")
          .insert([{
            product_type: editData.product_type,
            margem_percent: editData.margem_percent,
            custo_base_m2: editData.custo_base_m2,
            obs: editData.obs,
          }]);

        if (error) throw error;
        toast.success("Configuração criada!");
      }

      setEditingId(null);
      setEditData({});
      loadConfigs();
    } catch (err: any) {
      toast.error("Erro ao salvar:", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    try {
      const { error } = await supabase.from("markup_config").delete().eq("id", id);
      if (error) throw error;
      toast.success("Configuração excluída!");
      loadConfigs();
    } catch (err: any) {
      toast.error("Erro ao excluir:", err.message);
    }
  };

  const startEdit = (config: MarkupConfig) => {
    setEditingId(config.id);
    setEditData({ ...config });
  };

  const startNew = () => {
    setEditingId(null);
    setEditData({});
  };

  const getProdutoLabel = (value: string) => {
    const produto = tiposProduto.find(p => p.value === value);
    return produto ? produto.label : value;
  };

  const calculateSellingPrice = (custo: number, margem: number) => {
    return custo * (1 + margem / 100);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuração de Markup</h1>
          <p className="text-muted-foreground">Configure margem de lucro por tipo de produto</p>
        </div>
        <Button onClick={startNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo
        </Button>
      </div>

      <Tabs defaultValue="lista">
        <TabsList>
          <TabsTrigger value="lista">Lista de Configurações</TabsTrigger>
          <TabsTrigger value="editar"> {editingId ? "Editar" : "Criar Nova"}</TabsTrigger>
        </TabsList>

        <TabsContent value="lista">
          <Card>
            <CardHeader>
              <CardTitle>Margens por Produto</CardTitle>
              <CardDescription>
                Configure o custo base e margem de lucro para cada tipo de esquadria
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : configs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhuma configuração encontrada.</p>
                  <p className="text-sm">Clique em "Novo" para adicionar.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {configs.map((config) => (
                    <div
                      key={config.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{getProdutoLabel(config.product_type)}</p>
                        <div className="flex gap-6 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            Custo: R$ {config.custo_base_m2?.toFixed(2) || "0.00"}/m²
                          </span>
                          <span className="flex items-center gap-1">
                            <Percent className="h-3 w-3" />
                            Margem: {config.margem_percent}%
                          </span>
                          <span className="flex items-center gap-1 text-green-600 font-medium">
                            <DollarSign className="h-3 w-3" />
                            Venda: R$ {calculateSellingPrice(config.custo_base_m2 || 0, config.margem_percent).toFixed(2)}/m²
                          </span>
                        </div>
                        {config.obs && (
                          <p className="text-xs text-muted-foreground mt-1">{config.obs}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => startEdit(config)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(config.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editar">
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Editar Configuração" : "Nova Configuração"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Produto *</Label>
                  <select
                    className="w-full h-10 px-3 border rounded-md bg-background"
                    value={editData.product_type || ""}
                    onChange={(e) => setEditData({ ...editData, product_type: e.target.value })}
                    disabled={!!editingId}
                  >
                    <option value="">Selecione...</option>
                    {tiposProduto.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Custo Base por m² (R$) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Ex: 450.00"
                    value={editData.custo_base_m2 || ""}
                    onChange={(e) => setEditData({ ...editData, custo_base_m2: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Margem de Lucro (%) *</Label>
                  <Input
                    type="number"
                    step="1"
                    min="0"
                    max="500"
                    placeholder="Ex: 100"
                    value={editData.margem_percent || ""}
                    onChange={(e) => setEditData({ ...editData, margem_percent: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Preço de Venda (calculado)</Label>
                  <div className="h-10 px-3 flex items-center border rounded-md bg-muted font-semibold text-green-600">
                    R$ {calculateSellingPrice(editData.custo_base_m2 || 0, editData.margem_percent || 0).toFixed(2)}/m²
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Observações</Label>
                <textarea
                  className="w-full h-20 px-3 py-2 border rounded-md bg-background"
                  placeholder="Observações adicionais..."
                  value={editData.obs || ""}
                  onChange={(e) => setEditData({ ...editData, obs: e.target.value })}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => { setEditingId(null); setEditData({}); }}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
