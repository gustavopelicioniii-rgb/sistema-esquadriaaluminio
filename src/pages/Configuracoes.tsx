import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePageTitle } from "@/hooks/use-page-title";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  Save, Settings2, RotateCcw, Building2, Users, UserCog, Key, Wand2,
  Plus, Trash2, Phone, Mail, Edit2, Shield, Plug, Copy, Eye, EyeOff,
  Upload, CheckCircle2, AlertCircle, Loader2, Crown
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Planos from "./Planos";
import { toast } from "sonner";

// ─── Company Config ───
const defaultConfig: Record<string, string> = {
  nome: "AlumPRO Esquadrias",
  cnpj: "12.345.678/0001-90",
  telefone: "(11) 3456-7890",
  email: "contato@alumpro.com",
  margem: "35",
  descontoMax: "15",
  endereco: "",
  cidade: "",
  estado: "",
  logo_url: "",
};

const defaultFolgas = {
  perfil_offset: 0,
  vidro_largura_offset: 0,
  vidro_altura_offset: 0,
};

// ─── Types ───
interface Funcionario {
  id: string;
  nome: string;
  cargo: string;
  telefone: string;
  setor: string;
  ativo: boolean;
}

interface Admin {
  id: string;
  nome: string;
  email: string;
  role: string;
  ativo: boolean;
}

interface ApiConfig {
  id: string;
  nome: string;
  chave: string;
  ativa: boolean;
  descricao: string;
}

// No more mock data — loaded from DB

// ─── Component ───
const Configuracoes = () => {
  usePageTitle("Configurações");
  const { user, role } = useAuth();
  const isAdmin = role === "admin";
  const [config, setConfig] = useState<Record<string, string>>(defaultConfig);
  const [folgas, setFolgas] = useState(defaultFolgas);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "empresa");

  // Funcionarios state
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [showAddFunc, setShowAddFunc] = useState(false);
  const [newFunc, setNewFunc] = useState({ nome: "", cargo: "", telefone: "", setor: "Produção" });

  // Admins state
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ nome: "", email: "", role: "Admin" });

  // APIs state
  const [apis, setApis] = useState<ApiConfig[]>([]);
  const [showAddApi, setShowAddApi] = useState(false);
  const [newApi, setNewApi] = useState({ nome: "", chave: "", descricao: "" });
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [editingApi, setEditingApi] = useState<ApiConfig | null>(null);
  const [showEditApi, setShowEditApi] = useState(false);
  const [testingKey, setTestingKey] = useState(false);
  const [keyTestResult, setKeyTestResult] = useState<"success" | "error" | null>(null);

  // Setup wizard state
  const [setupStep, setSetupStep] = useState(0);
  const [setupData, setSetupData] = useState({
    nomeEmpresa: "",
    cnpj: "",
    telefone: "",
    email: "",
    endereco: "",
    cidade: "",
    estado: "",
    segmento: "esquadrias_aluminio",
    numFuncionarios: "1-5",
    usaNotaFiscal: false,
    usaWhatsapp: false,
  });
  const [setupLoading, setSetupLoading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      const [configRes, funcRes, adminRes, apisRes] = await Promise.all([
        supabase.from("configuracoes").select("chave, valor"),
        supabase.from("funcionarios").select("*").order("created_at"),
        supabase.from("administradores").select("*").order("created_at"),
        supabase.from("api_integracoes").select("*").order("created_at"),
      ]);
      if (configRes.data && configRes.data.length > 0) {
        const map: Record<string, string> = {};
        configRes.data.forEach((r) => { map[r.chave] = r.valor; });
        setConfig((prev) => ({ ...prev, ...map }));
        if (map.folgas_global) {
          try {
            const parsed = JSON.parse(map.folgas_global);
            setFolgas((prev) => ({ ...prev, ...parsed }));
          } catch { /* ignore */ }
        }
      }
      if (funcRes.data) setFuncionarios(funcRes.data as unknown as Funcionario[]);
      if (adminRes.data) setAdmins(adminRes.data as unknown as Admin[]);
      if (apisRes.data) setApis(apisRes.data as unknown as ApiConfig[]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const update = (key: string, value: string) => setConfig((prev) => ({ ...prev, [key]: value }));
  const updateFolga = (key: keyof typeof defaultFolgas, value: number) => setFolgas((prev) => ({ ...prev, [key]: value }));
  const resetFolgas = () => setFolgas(defaultFolgas);

  const handleSave = async () => {
    for (const [chave, valor] of Object.entries(config)) {
      if (chave === "folgas_global") continue;
      await supabase.from("configuracoes").upsert({ chave, valor }, { onConflict: "chave" });
    }
    const folgasPayload = JSON.stringify(folgas);
    const { data: existing } = await supabase.from("configuracoes").select("id").eq("chave", "folgas_global").maybeSingle();
    if (existing) {
      await supabase.from("configuracoes").update({ valor: folgasPayload }).eq("chave", "folgas_global");
    } else {
      await supabase.from("configuracoes").insert({ chave: "folgas_global", valor: folgasPayload });
    }
    toast.success("Configurações salvas", { description: "Suas alterações foram salvas." });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Arquivo inválido", { description: "Selecione uma imagem." });
      return;
    }
    setLogoUploading(true);
    const ext = file.name.split(".").pop();
    const folder = user.id;
    const path = `${folder}/logo.${ext}`;
    // Remove old logo files
    const { data: existingFiles } = await supabase.storage.from("company-assets").list(folder, { search: "logo" });
    if (existingFiles && existingFiles.length > 0) {
      await supabase.storage.from("company-assets").remove(existingFiles.map((f) => `${folder}/${f.name}`));
    }
    const { error: uploadErr } = await supabase.storage.from("company-assets").upload(path, file, { upsert: true });
    if (uploadErr) {
      toast.error("Erro no upload", { description: uploadErr.message });
      setLogoUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("company-assets").getPublicUrl(path);
    const logoUrl = urlData.publicUrl + "?t=" + Date.now();
    update("logo_url", logoUrl);
    await supabase.from("configuracoes").upsert({ chave: "logo_url", valor: logoUrl }, { onConflict: "chave" });
    setLogoUploading(false);
    toast.success("Logo atualizado!");
  };

  const handleRemoveLogo = async () => {
    if (!user) return;
    const folder = user.id;
    const { data: existingFiles } = await supabase.storage.from("company-assets").list(folder, { search: "logo" });
    if (existingFiles && existingFiles.length > 0) {
      await supabase.storage.from("company-assets").remove(existingFiles.map((f) => `${folder}/${f.name}`));
    }
    update("logo_url", "");
    await supabase.from("configuracoes").upsert({ chave: "logo_url", valor: "" }, { onConflict: "chave" });
    toast.success("Logo removido");
  };

  // ─── Funcionarios handlers ───
  const addFuncionario = async () => {
    if (!newFunc.nome) return;
    const { error } = await supabase.from("funcionarios").insert({
      nome: newFunc.nome,
      cargo: newFunc.cargo,
      telefone: newFunc.telefone,
      setor: newFunc.setor,
    });
    if (error) { toast.error("Erro", { description: error.message }); return; }
    const { data } = await supabase.from("funcionarios").select("*").order("created_at");
    if (data) setFuncionarios(data as unknown as Funcionario[]);
    setNewFunc({ nome: "", cargo: "", telefone: "", setor: "Produção" });
    setShowAddFunc(false);
    toast.success("Funcionário adicionado");
  };

  const removeFuncionario = async (id: string) => {
    await supabase.from("funcionarios").delete().eq("id", id);
    setFuncionarios((prev) => prev.filter((f) => f.id !== id));
    toast.error("Funcionário removido");
  };

  const toggleFuncionario = async (id: string) => {
    const f = funcionarios.find((f) => f.id === id);
    if (!f) return;
    await supabase.from("funcionarios").update({ ativo: !f.ativo }).eq("id", id);
    setFuncionarios((prev) => prev.map((f) => f.id === id ? { ...f, ativo: !f.ativo } : f));
  };

  // ─── Admin handlers ───
  const addAdmin = async () => {
    if (!newAdmin.nome || !newAdmin.email) return;
    const { error } = await supabase.from("administradores").insert({
      nome: newAdmin.nome,
      email: newAdmin.email,
      role: newAdmin.role,
    });
    if (error) { toast.error("Erro", { description: error.message }); return; }
    const { data } = await supabase.from("administradores").select("*").order("created_at");
    if (data) setAdmins(data as unknown as Admin[]);
    setNewAdmin({ nome: "", email: "", role: "Admin" });
    setShowAddAdmin(false);
    toast.success("Administrador adicionado");

    // Sync: grant admin role in user_roles
    const { data: syncResult } = await supabase.functions.invoke("sync-admin-role", {
      body: { action: "grant", email: newAdmin.email },
    });
    if (syncResult?.message) {
      toast.success("Permissão", { description: syncResult.message });
    }
  };

  const removeAdmin = async (id: string) => {
    const adminToRemove = admins.find((a) => a.id === id);
    await supabase.from("administradores").delete().eq("id", id);
    setAdmins((prev) => prev.filter((a) => a.id !== id));
    toast.error("Administrador removido");

    // Sync: revoke admin role in user_roles
    if (adminToRemove?.email) {
      await supabase.functions.invoke("sync-admin-role", {
        body: { action: "revoke", email: adminToRemove.email },
      });
    }
  };

  const toggleAdmin = async (id: string) => {
    const a = admins.find((a) => a.id === id);
    if (!a) return;
    await supabase.from("administradores").update({ ativo: !a.ativo }).eq("id", id);
    setAdmins((prev) => prev.map((a) => a.id === id ? { ...a, ativo: !a.ativo } : a));

    // Sync: grant or revoke based on new ativo state
    if (a.email) {
      await supabase.functions.invoke("sync-admin-role", {
        body: { action: a.ativo ? "revoke" : "grant", email: a.email },
      });
    }
  };

  // ─── API handlers ───
  const addApi = async () => {
    if (!newApi.nome) return;
    if (newApi.chave) {
      const valid = await testApiKey(newApi.chave);
      if (!valid) return;
    }
    const { data, error } = await supabase.from("api_integracoes").insert({
      nome: newApi.nome,
      chave: newApi.chave,
      descricao: newApi.descricao,
    }).select().single();
    if (error) { toast.error("Erro ao adicionar API", { description: error.message }); return; }
    setApis((prev) => [...prev, data as unknown as ApiConfig]);
    setNewApi({ nome: "", chave: "", descricao: "" });
    setShowAddApi(false);
    setKeyTestResult(null);
    toast.success("API adicionada");
  };

  const updateApi = async () => {
    if (!editingApi) return;
    if (editingApi.chave) {
      const valid = await testApiKey(editingApi.chave);
      if (!valid) return;
    }
    const { error } = await supabase.from("api_integracoes").update({
      nome: editingApi.nome,
      chave: editingApi.chave,
      descricao: editingApi.descricao,
    }).eq("id", editingApi.id);
    if (error) { toast.error("Erro ao atualizar", { description: error.message }); return; }
    setApis((prev) => prev.map((a) => a.id === editingApi.id ? { ...a, ...editingApi } : a));
    setShowEditApi(false);
    setEditingApi(null);
    setKeyTestResult(null);
    toast.success("API atualizada");
  };

  const testApiKey = async (key: string): Promise<boolean> => {
    if (!key || key.trim().length < 8) {
      setKeyTestResult("error");
      toast.error("Chave inválida", { description: "A chave deve ter pelo menos 8 caracteres." });
      return false;
    }
    setTestingKey(true);
    setKeyTestResult(null);
    // Simulate connection test (format validation)
    await new Promise((r) => setTimeout(r, 1000));
    const validPrefixes = ["sk_", "pk_", "key_", "api_", "bearer_", "token_", "ghp_", "xoxb-", "AIza"];
    const looksValid = validPrefixes.some((p) => key.toLowerCase().startsWith(p.toLowerCase())) || key.length >= 16;
    setTestingKey(false);
    if (looksValid) {
      setKeyTestResult("success");
      toast.success("Chave válida", { description: "O formato da chave parece correto." });
      return true;
    } else {
      setKeyTestResult("error");
      toast.error("Chave suspeita", { description: "O formato da chave não corresponde aos padrões conhecidos. Verifique e tente novamente." });
      return false;
    }
  };

  const toggleApi = async (id: string) => {
    const api = apis.find(a => a.id === id);
    if (!api) return;
    const newStatus = !api.ativa;
    await supabase.from("api_integracoes").update({ ativa: newStatus }).eq("id", id);
    setApis((prev) => prev.map((a) => a.id === id ? { ...a, ativa: newStatus } : a));
  };

  const removeApi = async (id: string) => {
    await supabase.from("api_integracoes").delete().eq("id", id);
    setApis((prev) => prev.filter((a) => a.id !== id));
    toast.error("API removida");
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // ─── Setup wizard ───
  const handleSetupComplete = async () => {
    setSetupLoading(true);
    // Save company info to configuracoes
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
        await supabase.from("configuracoes").upsert({ chave, valor }, { onConflict: "chave" });
      }
    }
    setConfig((prev) => ({ ...prev, ...entries }));
    setSetupLoading(false);
    setSetupStep(4); // complete
    toast.success("Sistema configurado!", { description: "Suas informações foram salvas com sucesso." });
  };

  if (loading) return <div className="p-6 text-muted-foreground">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground text-sm">Central de gerenciamento do sistema</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full h-auto ${isAdmin ? 'grid-cols-6' : 'grid-cols-4'}`}>
          <TabsTrigger value="empresa" className="gap-1.5 text-xs sm:text-sm py-2">
            <Building2 className="h-4 w-4 hidden sm:block" /> Empresa
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="funcionarios" className="gap-1.5 text-xs sm:text-sm py-2">
              <Users className="h-4 w-4 hidden sm:block" /> Equipe
            </TabsTrigger>
          )}
          {isAdmin && (
            <TabsTrigger value="admins" className="gap-1.5 text-xs sm:text-sm py-2">
              <UserCog className="h-4 w-4 hidden sm:block" /> Admins
            </TabsTrigger>
          )}
          <TabsTrigger value="apis" className="gap-1.5 text-xs sm:text-sm py-2">
            <Key className="h-4 w-4 hidden sm:block" /> APIs
          </TabsTrigger>
          <TabsTrigger value="planos" className="gap-1.5 text-xs sm:text-sm py-2">
            <Crown className="h-4 w-4 hidden sm:block" /> Planos
          </TabsTrigger>
          <TabsTrigger value="setup" className="gap-1.5 text-xs sm:text-sm py-2">
            <Wand2 className="h-4 w-4 hidden sm:block" /> Setup
          </TabsTrigger>
        </TabsList>

        {/* ═══════════ TAB: EMPRESA ═══════════ */}
        <TabsContent value="empresa" className="space-y-6 mt-6">
          <Card className="shadow-sm border-border/50">
            <CardHeader><CardTitle className="text-base">Dados da Empresa</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Nome da Empresa</Label><Input value={config.nome} onChange={(e) => update("nome", e.target.value)} /></div>
                <div className="space-y-2"><Label>CNPJ</Label><Input value={config.cnpj} onChange={(e) => update("cnpj", e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Telefone</Label><Input value={config.telefone} onChange={(e) => update("telefone", e.target.value)} /></div>
                <div className="space-y-2"><Label>E-mail</Label><Input value={config.email} onChange={(e) => update("email", e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Endereço</Label><Input value={config.endereco || ""} onChange={(e) => update("endereco", e.target.value)} /></div>
                <div className="space-y-2"><Label>Cidade</Label><Input value={config.cidade || ""} onChange={(e) => update("cidade", e.target.value)} /></div>
                <div className="space-y-2"><Label>Estado</Label><Input value={config.estado || ""} onChange={(e) => update("estado", e.target.value)} /></div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50">
            <CardHeader><CardTitle className="text-base">Logo da Empresa</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                {config.logo_url ? (
                  <div className="relative group">
                    <img
                      src={config.logo_url}
                      alt="Logo da empresa"
                      className="h-24 w-24 object-contain rounded-lg border bg-muted p-2"
                    />
                    <button
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="h-24 w-24 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/50">
                    <Building2 className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                )}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Imagem usada em orçamentos, notas fiscais e relatórios.</p>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="logo-upload"
                      onChange={handleLogoUpload}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      disabled={logoUploading}
                      onClick={() => document.getElementById("logo-upload")?.click()}
                    >
                      {logoUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                      {logoUploading ? "Enviando..." : "Enviar logo"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50">
            <CardHeader><CardTitle className="text-base">Margem Padrão</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Margem de Lucro (%)</Label><Input type="number" value={config.margem} onChange={(e) => update("margem", e.target.value)} /></div>
                <div className="space-y-2"><Label>Desconto Máximo (%)</Label><Input type="number" value={config.descontoMax} onChange={(e) => update("descontoMax", e.target.value)} /></div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">Folgas Padrão (Global)</CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="text-xs gap-1.5" onClick={resetFolgas}>
                  <RotateCcw className="h-3 w-3" /> Zerar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Ajustes globais de folga em milímetros somados às folgas do catálogo.
              </p>
              <Separator />
              <div>
                <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3">Perfis</h4>
                <div className="space-y-2">
                  <Label className="text-sm">Ajuste de folga nos perfis (mm)</Label>
                  <Input type="number" className="max-w-[200px]" value={folgas.perfil_offset} onChange={(e) => updateFolga("perfil_offset", Number(e.target.value))} />
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3">Vidros</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label className="text-sm">Ajuste largura (mm)</Label><Input type="number" value={folgas.vidro_largura_offset} onChange={(e) => updateFolga("vidro_largura_offset", Number(e.target.value))} /></div>
                  <div className="space-y-2"><Label className="text-sm">Ajuste altura (mm)</Label><Input type="number" value={folgas.vidro_altura_offset} onChange={(e) => updateFolga("vidro_altura_offset", Number(e.target.value))} /></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" /> Salvar Configurações
          </Button>
        </TabsContent>

        {/* ═══════════ TAB: FUNCIONÁRIOS ═══════════ */}
        <TabsContent value="funcionarios" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Equipe</h2>
              <p className="text-muted-foreground text-sm">Gerencie seus funcionários</p>
            </div>
            <Dialog open={showAddFunc} onOpenChange={setShowAddFunc}>
              <DialogTrigger asChild>
                <Button className="gap-2"><Plus className="h-4 w-4" /> Novo Funcionário</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Adicionar Funcionário</DialogTitle></DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2"><Label>Nome</Label><Input value={newFunc.nome} onChange={(e) => setNewFunc({ ...newFunc, nome: e.target.value })} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Cargo</Label><Input value={newFunc.cargo} onChange={(e) => setNewFunc({ ...newFunc, cargo: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Telefone</Label><Input value={newFunc.telefone} onChange={(e) => setNewFunc({ ...newFunc, telefone: e.target.value })} /></div>
                  </div>
                  <div className="space-y-2">
                    <Label>Setor</Label>
                    <Select value={newFunc.setor} onValueChange={(v) => setNewFunc({ ...newFunc, setor: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Produção">Produção</SelectItem>
                        <SelectItem value="Instalação">Instalação</SelectItem>
                        <SelectItem value="Comercial">Comercial</SelectItem>
                        <SelectItem value="Administrativo">Administrativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter><Button onClick={addFuncionario} className="gap-2"><Plus className="h-4 w-4" /> Adicionar</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="shadow-sm border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead className="hidden sm:table-cell">Telefone</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {funcionarios.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium">{f.nome}</TableCell>
                    <TableCell>{f.cargo}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-1.5 text-muted-foreground"><Phone className="h-3 w-3" />{f.telefone}</div>
                    </TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{f.setor}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={f.ativo} onCheckedChange={() => toggleFuncionario(f.id)} />
                        <span className={`text-xs font-semibold ${f.ativo ? "text-success" : "text-muted-foreground"}`}>{f.ativo ? "Ativo" : "Inativo"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => removeFuncionario(f.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* ═══════════ TAB: ADMINS ═══════════ */}
        <TabsContent value="admins" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Administradores</h2>
              <p className="text-muted-foreground text-sm">Gerencie os administradores do sistema</p>
            </div>
            <Dialog open={showAddAdmin} onOpenChange={setShowAddAdmin}>
              <DialogTrigger asChild>
                <Button className="gap-2"><Plus className="h-4 w-4" /> Novo Admin</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Adicionar Administrador</DialogTitle></DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2"><Label>Nome</Label><Input value={newAdmin.nome} onChange={(e) => setNewAdmin({ ...newAdmin, nome: e.target.value })} /></div>
                  <div className="space-y-2"><Label>E-mail</Label><Input type="email" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} /></div>
                  <div className="space-y-2">
                    <Label>Função</Label>
                    <Select value={newAdmin.role} onValueChange={(v) => setNewAdmin({ ...newAdmin, role: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Super Admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter><Button onClick={addAdmin} className="gap-2"><Shield className="h-4 w-4" /> Adicionar</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="shadow-sm border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.nome}</TableCell>
                    <TableCell className="text-muted-foreground">{a.email}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{a.role}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={a.ativo} onCheckedChange={() => toggleAdmin(a.id)} />
                        <span className={`text-xs font-semibold ${a.ativo ? "text-success" : "text-muted-foreground"}`}>{a.ativo ? "Ativo" : "Inativo"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => removeAdmin(a.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* ═══════════ TAB: APIS ═══════════ */}
        <TabsContent value="apis" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Integrações & APIs</h2>
              <p className="text-muted-foreground text-sm">Gerencie chaves de API e integrações externas</p>
            </div>
            <Dialog open={showAddApi} onOpenChange={setShowAddApi}>
              <DialogTrigger asChild>
                <Button className="gap-2"><Plus className="h-4 w-4" /> Nova API</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Adicionar Integração</DialogTitle></DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2"><Label>Nome da API</Label><Input placeholder="Ex: WhatsApp, Google Maps..." value={newApi.nome} onChange={(e) => setNewApi({ ...newApi, nome: e.target.value })} /></div>
                  <div className="space-y-2">
                    <Label>Chave da API</Label>
                    <Input placeholder="sk_live_..." value={newApi.chave} onChange={(e) => { setNewApi({ ...newApi, chave: e.target.value }); setKeyTestResult(null); }} />
                    {keyTestResult === "success" && <p className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Formato válido</p>}
                    {keyTestResult === "error" && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Formato inválido</p>}
                  </div>
                  <div className="space-y-2"><Label>Descrição</Label><Textarea placeholder="Para que serve esta integração?" value={newApi.descricao} onChange={(e) => setNewApi({ ...newApi, descricao: e.target.value })} /></div>
                </div>
                <DialogFooter className="gap-2">
                  <Button variant="outline" disabled={testingKey || !newApi.chave} onClick={() => testApiKey(newApi.chave)} className="gap-2">
                    {testingKey ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />} Testar Chave
                  </Button>
                  <Button onClick={addApi} className="gap-2"><Plug className="h-4 w-4" /> Adicionar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Edit API Dialog */}
          <Dialog open={showEditApi} onOpenChange={(open) => { setShowEditApi(open); if (!open) { setEditingApi(null); setKeyTestResult(null); } }}>
            <DialogContent>
              <DialogHeader><DialogTitle>Editar Integração</DialogTitle></DialogHeader>
              {editingApi && (
                <div className="space-y-4 py-2">
                  <div className="space-y-2"><Label>Nome da API</Label><Input value={editingApi.nome} onChange={(e) => setEditingApi({ ...editingApi, nome: e.target.value })} /></div>
                  <div className="space-y-2">
                    <Label>Chave da API</Label>
                    <Input value={editingApi.chave} onChange={(e) => { setEditingApi({ ...editingApi, chave: e.target.value }); setKeyTestResult(null); }} />
                    {keyTestResult === "success" && <p className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Formato válido</p>}
                    {keyTestResult === "error" && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Formato inválido</p>}
                  </div>
                  <div className="space-y-2"><Label>Descrição</Label><Textarea value={editingApi.descricao} onChange={(e) => setEditingApi({ ...editingApi, descricao: e.target.value })} /></div>
                </div>
              )}
              <DialogFooter className="gap-2">
                <Button variant="outline" disabled={testingKey || !editingApi?.chave} onClick={() => editingApi && testApiKey(editingApi.chave)} className="gap-2">
                  {testingKey ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />} Testar Chave
                </Button>
                <Button onClick={updateApi} className="gap-2"><Save className="h-4 w-4" /> Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="grid gap-4">
            {apis.map((api) => (
              <Card key={api.id} className={`shadow-sm border-border/50 transition-opacity ${!api.ativa ? "opacity-60" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Plug className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-sm">{api.nome}</span>
                        <Badge variant={api.ativa ? "default" : "secondary"} className="text-[10px]">
                          {api.ativa ? "Ativa" : "Inativa"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{api.descricao}</p>
                      {api.chave && (
                        <div className="flex items-center gap-2 mt-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                            {visibleKeys.has(api.id) ? api.chave : "••••••••••••••••"}
                          </code>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleKeyVisibility(api.id)}>
                            {visibleKeys.has(api.id) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                            navigator.clipboard.writeText(api.chave);
                            toast.success("Chave copiada");
                          }}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingApi(api); setShowEditApi(true); }}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Switch checked={api.ativa} onCheckedChange={() => toggleApi(api.id)} />
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => removeApi(api.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ═══════════ TAB: SETUP AUTOMÁTICO ═══════════ */}
        <TabsContent value="setup" className="space-y-6 mt-6">
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-base">Configuração Automática do Sistema</CardTitle>
                  <CardDescription>Insira as informações da sua empresa e configure o sistema em poucos passos</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Progress indicators */}
              <div className="flex items-center gap-2 mb-8">
                {["Empresa", "Detalhes", "Integrações", "Confirmar"].map((label, i) => (
                  <div key={label} className="flex-1">
                    <div className={`h-2 rounded-full transition-colors ${i <= setupStep && setupStep < 4 ? "bg-primary" : i < 4 && setupStep >= 4 ? "bg-success" : "bg-muted"}`} />
                    <span className="text-[10px] text-muted-foreground mt-1 block">{label}</span>
                  </div>
                ))}
              </div>

              {setupStep === 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Dados da Empresa</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Nome da Empresa *</Label><Input value={setupData.nomeEmpresa} onChange={(e) => setSetupData({ ...setupData, nomeEmpresa: e.target.value })} placeholder="Minha Vidraçaria LTDA" /></div>
                    <div className="space-y-2"><Label>CNPJ</Label><Input value={setupData.cnpj} onChange={(e) => setSetupData({ ...setupData, cnpj: e.target.value })} placeholder="00.000.000/0001-00" /></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Telefone</Label><Input value={setupData.telefone} onChange={(e) => setSetupData({ ...setupData, telefone: e.target.value })} placeholder="(11) 99999-9999" /></div>
                    <div className="space-y-2"><Label>E-mail</Label><Input value={setupData.email} onChange={(e) => setSetupData({ ...setupData, email: e.target.value })} placeholder="contato@empresa.com" /></div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => setSetupStep(1)} disabled={!setupData.nomeEmpresa}>Próximo →</Button>
                  </div>
                </div>
              )}

              {setupStep === 1 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Detalhes do Negócio</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2"><Label>Endereço</Label><Input value={setupData.endereco} onChange={(e) => setSetupData({ ...setupData, endereco: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Cidade</Label><Input value={setupData.cidade} onChange={(e) => setSetupData({ ...setupData, cidade: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Estado</Label><Input value={setupData.estado} onChange={(e) => setSetupData({ ...setupData, estado: e.target.value })} /></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Segmento</Label>
                      <Select value={setupData.segmento} onValueChange={(v) => setSetupData({ ...setupData, segmento: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
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
                      <Select value={setupData.numFuncionarios} onValueChange={(v) => setSetupData({ ...setupData, numFuncionarios: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
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
                    <Button variant="outline" onClick={() => setSetupStep(0)}>← Voltar</Button>
                    <Button onClick={() => setSetupStep(2)}>Próximo →</Button>
                  </div>
                </div>
              )}

              {setupStep === 2 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Integrações</h3>
                  <p className="text-sm text-muted-foreground">Selecione quais integrações deseja ativar</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <span className="font-medium text-sm">WhatsApp Business</span>
                        <p className="text-xs text-muted-foreground">Envie notificações e lembretes via WhatsApp</p>
                      </div>
                      <Switch checked={setupData.usaWhatsapp} onCheckedChange={(v) => setSetupData({ ...setupData, usaWhatsapp: v })} />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <span className="font-medium text-sm">Nota Fiscal Eletrônica</span>
                        <p className="text-xs text-muted-foreground">Emita NF-e diretamente pelo sistema</p>
                      </div>
                      <Switch checked={setupData.usaNotaFiscal} onCheckedChange={(v) => setSetupData({ ...setupData, usaNotaFiscal: v })} />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setSetupStep(1)}>← Voltar</Button>
                    <Button onClick={() => setSetupStep(3)}>Próximo →</Button>
                  </div>
                </div>
              )}

              {setupStep === 3 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Confirmar Configuração</h3>
                  <div className="rounded-lg border p-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Empresa:</span><span className="font-medium">{setupData.nomeEmpresa}</span></div>
                    {setupData.cnpj && <div className="flex justify-between"><span className="text-muted-foreground">CNPJ:</span><span>{setupData.cnpj}</span></div>}
                    {setupData.email && <div className="flex justify-between"><span className="text-muted-foreground">E-mail:</span><span>{setupData.email}</span></div>}
                    {setupData.cidade && <div className="flex justify-between"><span className="text-muted-foreground">Cidade:</span><span>{setupData.cidade} - {setupData.estado}</span></div>}
                    <Separator />
                    <div className="flex justify-between"><span className="text-muted-foreground">WhatsApp:</span><Badge variant={setupData.usaWhatsapp ? "default" : "secondary"}>{setupData.usaWhatsapp ? "Ativo" : "Inativo"}</Badge></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">NF-e:</span><Badge variant={setupData.usaNotaFiscal ? "default" : "secondary"}>{setupData.usaNotaFiscal ? "Ativo" : "Inativo"}</Badge></div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setSetupStep(2)}>← Voltar</Button>
                    <Button onClick={handleSetupComplete} disabled={setupLoading} className="gap-2">
                      {setupLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
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
                    Suas informações foram salvas. Você pode alterá-las a qualquer momento na aba <strong>Empresa</strong>.
                  </p>
                  <Button variant="outline" onClick={() => { setSetupStep(0); setActiveTab("empresa"); }}>
                    Ver Configurações
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════ TAB: PLANOS ═══════════ */}
        <TabsContent value="planos" className="mt-6">
          <Planos />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;
