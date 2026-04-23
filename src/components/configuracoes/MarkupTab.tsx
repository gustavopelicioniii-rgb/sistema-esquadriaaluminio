import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Save, DollarSign, Percent, Check } from "lucide-react";
import { toast } from "sonner";

interface MarkupConfig {
  id: string;
  product_type: string;
  margem_percent: number;
  custo_base_m2: number;
  obs: string;
}

interface MarkupTabProps {
  onSaveComplete?: () => void;
}

const tiposProduto = [
  { value: "janela", label: "Janela" },
  { value: "porta", label: "Porta" },
  { value: "basculante", label: "Bascuante" },
  { value: "corredica", label: "Corredia" },
  { value: "pivotante", label: "Pivotante" },
  { value: "max-ar", label: "Max Ar" },
  { value: "franch", label: "Franch" },
  { value: "plan", label: "Plan" },
];

export function MarkupTab({ onSaveComplete }: MarkupTabProps) {
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
      onSaveComplete?.();
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

  if (loading) {
    return <div className="p-6 text-muted-foreground">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Configuração de Markup</h2>
          <p className="text-muted-foreground text-sm">
            Configure margem de lucro por tipo de produto
          </p>
        </div>
        <Button onClick={startNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Margens por Produto
          </CardTitle>
          <CardDescription>
            Configure o custo base e margem de lucro para cada tipo de esquadria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">Produto</th>
                  <th className="text-right py-3 px-2 font-medium">Custo Base (m²)</th>
                  <th className="text-right py-3 px-2 font-medium">Margem %</th>
                  <th className="text-right py-3 px-2 font-medium">Preço Venda</th>
                  <th className="text-left py-3 px-2 font-medium">Observação</th>
                  <th className="text-center py-3 px-2 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {configs.map((config) => (
                  <tr key={config.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-2">
                      <Badge variant="outline" className="font-medium">
                        {getProdutoLabel(config.product_type)}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-right font-mono">
                      {config.custo_base_m2 ? `R$ ${config.custo_base_m2.toFixed(2)}` : "—"}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Badge variant={config.margem_percent > 30 ? "default" : "secondary"}>
                        {config.margem_percent}%
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-right font-mono font-semibold text-primary">
                      {config.custo_base_m2 
                        ? `R$ ${calculateSellingPrice(config.custo_base_m2, config.margem_percent).toFixed(2)}`
                        : "—"}
                    </td>
                    <td className="py-3 px-2 text-muted-foreground text-xs">
                      {config.obs || "—"}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex justify-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => startEdit(config)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(config.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {configs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      Nenhuma configuração de markup. Clique em "Novo" para adicionar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      {(editingId !== null || Object.keys(editData).length > 0) && (
        <Card className="border-primary/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {editingId ? "Editar Configuração" : "Nova Configuração"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Produto *</Label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={editData.product_type || ""}
                  onChange={(e) => setEditData((prev) => ({ ...prev, product_type: e.target.value }))}
                  disabled={!!editingId}
                >
                  <option value="">Selecione...</option>
                  {tiposProduto.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Custo Base (R$/m²)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={editData.custo_base_m2 || ""}
                  onChange={(e) => setEditData((prev) => ({ ...prev, custo_base_m2: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Margem de Lucro (%) *</Label>
                <Input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  placeholder="35"
                  value={editData.margem_percent || ""}
                  onChange={(e) => setEditData((prev) => ({ ...prev, margem_percent: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Observação</Label>
              <Input
                placeholder="Observação opcional"
                value={editData.obs || ""}
                onChange={(e) => setEditData((prev) => ({ ...prev, obs: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? (
                  <span>Salvando...</span>
                ) : (
                  <><Save className="h-4 w-4" /> Salvar</>
                )}
              </Button>
              <Button variant="outline" onClick={() => { setEditingId(null); setEditData({}); }} className="gap-2">
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
