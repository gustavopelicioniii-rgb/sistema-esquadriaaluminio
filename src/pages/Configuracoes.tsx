import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePageTitle } from "@/hooks/use-page-title";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Building2, Users, UserCog, Key, Wand2, Crown, Palette, DollarSign } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Planos from "./Planos";
import { toast } from "sonner";
import { EmpresaTab } from "@/components/configuracoes/EmpresaTab";
import { EquipeTab } from "@/components/configuracoes/EquipeTab";
import { AdminsTab } from "@/components/configuracoes/AdminsTab";
import { ApisTab } from "@/components/configuracoes/ApisTab";
import { SetupTab } from "@/components/configuracoes/SetupTab";
import { MarcaTab } from "@/components/configuracoes/MarcaTab";
import { MarkupTab } from "@/components/configuracoes/MarkupTab";

const defaultConfig: Record<string, string> = {
  nome: "AlumPRO Esquadrias", cnpj: "12.345.678/0001-90", telefone: "(11) 3456-7890",
  email: "contato@alumpro.com", margem: "35", descontoMax: "15",
  endereco: "", cidade: "", estado: "", logo_url: "",
};

const defaultFolgas = { perfil_offset: 0, vidro_largura_offset: 0, vidro_altura_offset: 0 };

interface Funcionario { id: string; nome: string; cargo: string; telefone: string; setor: string; ativo: boolean; }
interface Admin { id: string; nome: string; email: string; role: string; ativo: boolean; }
interface ApiConfig { id: string; nome: string; chave: string; ativa: boolean; descricao: string; }

const Configuracoes = () => {
  usePageTitle("Configurações");
  const { role } = useAuth();
  const isAdmin = role === "admin";
  const [config, setConfig] = useState<Record<string, string>>(defaultConfig);
  const [folgas, setFolgas] = useState(defaultFolgas);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "empresa");

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [apis, setApis] = useState<ApiConfig[]>([]);

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

  const updateConfig = (key: string, value: string) => setConfig((prev) => ({ ...prev, [key]: value }));
  const updateFolga = (key: keyof typeof defaultFolgas, value: number) => setFolgas((prev) => ({ ...prev, [key]: value }));

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

  if (loading) return <div className="p-6 text-muted-foreground">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground text-sm">Central de gerenciamento do sistema</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full h-auto ${isAdmin ? 'grid-cols-8' : 'grid-cols-6'}`}>
          <TabsTrigger value="empresa" className="gap-1.5 text-xs sm:text-sm py-2">
            <Building2 className="h-4 w-4 hidden sm:block" /> Empresa
          </TabsTrigger>
          <TabsTrigger value="marca" className="gap-1.5 text-xs sm:text-sm py-2">
            <Palette className="h-4 w-4 hidden sm:block" /> Marca
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="markup" className="gap-1.5 text-xs sm:text-sm py-2">
              <DollarSign className="h-4 w-4 hidden sm:block" /> Markup
            </TabsTrigger>
          )}
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

        <TabsContent value="empresa" className="mt-6">
          <EmpresaTab
            config={config}
            folgas={folgas}
            onConfigChange={updateConfig}
            onFolgaChange={updateFolga}
            onResetFolgas={() => setFolgas(defaultFolgas)}
            onSave={handleSave}
          />
        </TabsContent>

        <TabsContent value="marca" className="mt-6">
          <MarcaTab
            config={config}
            onConfigChange={updateConfig}
            onSave={handleSave}
          />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="markup" className="mt-6">
            <MarkupTab />
          </TabsContent>
        )}

        <TabsContent value="funcionarios" className="mt-6">
          <EquipeTab funcionarios={funcionarios} setFuncionarios={setFuncionarios} />
        </TabsContent>

        <TabsContent value="admins" className="mt-6">
          <AdminsTab admins={admins} setAdmins={setAdmins} />
        </TabsContent>

        <TabsContent value="apis" className="mt-6">
          <ApisTab apis={apis} setApis={setApis} />
        </TabsContent>

        <TabsContent value="planos" className="mt-6">
          <Planos />
        </TabsContent>

        <TabsContent value="setup" className="mt-6">
          <SetupTab
            onComplete={(entries) => setConfig((prev) => ({ ...prev, ...entries }))}
            onSwitchToEmpresa={() => setActiveTab("empresa")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;
