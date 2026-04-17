import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, Clock, FileText, Package, User, Phone, Mail, MapPin, DollarSign, Eye, Download } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { generateProfessionalBudgetPDF } from "@/utils/budgetPdfGenerator";
import { toast } from "sonner";

interface OrcamentoPortal {
  id: string;
  numero: string;
  cliente: string;
  produto: string;
  valor: number;
  status: string;
  data: string;
  itens: Record<string, any>;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pendente: { label: "Pendente", color: "bg-yellow-500", icon: <Clock className="h-4 w-4" /> },
  aprovado: { label: "Aprovado", color: "bg-green-500", icon: <CheckCircle className="h-4 w-4" /> },
  recusado: { label: "Recusado", color: "bg-red-500", icon: <XCircle className="h-4 w-4" /> },
};

export default function PortalCliente() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [orcamentos, setOrcamentos] = useState<OrcamentoPortal[]>([]);
  const [selectedOrcamento, setSelectedOrcamento] = useState<OrcamentoPortal | null>(null);
  const [empresaData, setEmpresaData] = useState<Record<string, string>>({});

  useEffect(() => {
    loadEmpresaConfig();
  }, []);

  useEffect(() => {
    if (token) {
      searchOrcamentos();
    }
  }, [token]);

  const loadEmpresaConfig = async () => {
    const { data } = await supabase.from("configuracoes").select("chave, valor");
    if (data) {
      const map: Record<string, string> = {};
      data.forEach((r) => { map[r.chave] = r.valor; });
      setEmpresaData(map);
    }
  };

  const searchOrcamentos = async () => {
    if (!email && !token) return;
    setLoading(true);

    try {
      let query = supabase.from("orcamentos").select("*").order("data", { ascending: false });

      if (token) {
        // Search by token
        const { data: tokenData } = await supabase
          .from("client_portal_tokens")
          .select("orcamento_id, client_email")
          .eq("token", token)
          .single();

        if (tokenData) {
          query = query.eq("id", tokenData.orcamento_id);
        }
      } else {
        // Search by email
        query = query.ilike("cliente", `%${email}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setOrcamentos(data || []);
    } catch (err: any) {
      toast.error("Erro ao buscar orçamentos:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAprovar = async (orcamento: OrcamentoPortal) => {
    try {
      const { error } = await supabase
        .from("orcamentos")
        .update({ status: "aprovado" })
        .eq("id", orcamento.id);

      if (error) throw error;

      // Add history entry
      await supabase.from("orcamento_historico").insert({
        orcamento_id: orcamento.id,
        status_anterior: orcamento.status,
        status_novo: "aprovado",
      });

      toast.success("Orçamento aprovado!");
      searchOrcamentos();
    } catch (err: any) {
      toast.error("Erro ao aprovar:", err.message);
    }
  };

  const handleRecusar = async (orcamento: OrcamentoPortal) => {
    try {
      const { error } = await supabase
        .from("orcamentos")
        .update({ status: "recusado" })
        .eq("id", orcamento.id);

      if (error) throw error;

      await supabase.from("orcamento_historico").insert({
        orcamento_id: orcamento.id,
        status_anterior: orcamento.status,
        status_novo: "recusado",
      });

      toast.success("Orçamento recusado.");
      searchOrcamentos();
    } catch (err: any) {
      toast.error("Erro ao recusar:", err.message);
    }
  };

  const handleGerarPDF = async (orcamento: OrcamentoPortal) => {
    try {
      const pdfBytes = await generateProfessionalBudgetPDF({
        orcamento,
        empresa: empresaData,
        itens: orcamento.itens,
      });

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Orcamento_${orcamento.numero}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      toast.error("Erro ao gerar PDF:", err.message);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateStr));
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Portal do Cliente</CardTitle>
            <CardDescription>
              Acesse seus orçamentos de forma segura
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Seu E-mail ou Nome</Label>
              <Input
                type="text"
                placeholder="Digite seu e-mail ou nome..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={searchOrcamentos} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Buscar Meus Orçamentos
                </>
              )}
            </Button>
            {empresaData.telefone && (
              <p className="text-center text-sm text-muted-foreground">
                Ou ligue para: {empresaData.telefone}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{empresaData.nome || "AluFlow"}</h1>
            <p className="text-sm opacity-80">Portal do Cliente</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate("/")}>
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        {!selectedOrcamento ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Meus Orçamentos</h2>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : orcamentos.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">Nenhum orçamento encontrado</p>
                  <p className="text-muted-foreground">Verifique seu e-mail ou entre em contato</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {orcamentos.map((orc) => {
                  const status = statusConfig[orc.status] || statusConfig.pendente;
                  return (
                    <Card key={orc.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedOrcamento(orc)}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">Orçamento #{orc.numero}</CardTitle>
                          </div>
                          <Badge variant="outline" className={`${status.color} text-white border-0`}>
                            {status.icon}
                            <span className="ml-1">{status.label}</span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-sm text-muted-foreground">{formatDate(orc.data)}</p>
                            <p className="font-medium">{orc.produto}</p>
                          </div>
                          <p className="text-2xl font-bold text-primary">
                            {formatCurrency(orc.valor)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <Button variant="outline" onClick={() => setSelectedOrcamento(null)} className="gap-2">
              ← Voltar para lista
            </Button>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Orçamento #{selectedOrcamento.numero}</CardTitle>
                    <CardDescription>Data: {formatDate(selectedOrcamento.data)}</CardDescription>
                  </div>
                  <Badge variant="outline" className={`${statusConfig[selectedOrcamento.status]?.color} text-white border-0 text-lg px-3 py-1`}>
                    {statusConfig[selectedOrcamento.status]?.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedOrcamento.cliente}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedOrcamento.produto}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Detalhes do Orçamento</h3>
                  <div className="border rounded-lg p-4">
                    {selectedOrcamento.itens?.items ? (
                      selectedOrcamento.itens.items.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between py-2 border-b last:border-0">
                          <div>
                            <p className="font-medium">{tiposProduto.find(t => t.value === item.tipo)?.label || item.tipo}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantidade}x — {item.largura_cm} x {item.altura_cm} cm
                            </p>
                          </div>
                          <p className="font-semibold">{formatCurrency(item.subtotal || item.custo)}</p>
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-between py-2">
                        <div>
                          <p className="font-medium">{selectedOrcamento.produto}</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedOrcamento.itens?.quantidade || 1}x — {" "}
                            {selectedOrcamento.itens?.largura_cm || 0} x {selectedOrcamento.itens?.altura_cm || 0} cm
                          </p>
                        </div>
                        <p className="font-semibold">{formatCurrency(selectedOrcamento.itens?.custo || selectedOrcamento.valor)}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold">Valor Total:</span>
                    <span className="font-bold text-2xl text-primary">
                      {formatCurrency(selectedOrcamento.valor)}
                    </span>
                  </div>
                  {selectedOrcamento.itens?.margem_percent && (
                    <p className="text-sm text-muted-foreground text-right mt-1">
                      (Margem: {selectedOrcamento.itens.margem_percent}%)
                    </p>
                  )}
                </div>

                {selectedOrcamento.status === "pendente" && (
                  <div className="flex gap-4">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
                      onClick={() => handleAprovar(selectedOrcamento)}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Aprovar
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 gap-2"
                      onClick={() => handleRecusar(selectedOrcamento)}
                    >
                      <XCircle className="h-4 w-4" />
                      Recusar
                    </Button>
                  </div>
                )}

                <Button variant="outline" className="w-full gap-2" onClick={() => handleGerarPDF(selectedOrcamento)}>
                  <Download className="h-4 w-4" />
                  Baixar PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

const tiposProduto = [
  { value: "janela_correr_2f", label: "Janela de Correr 2F" },
  { value: "janela_correr_4f", label: "Janela de Correr 4F" },
  { value: "janela_maximar_1f", label: "Janela Maxim-Ar 1F" },
  { value: "janela_maximar_2f", label: "Janela Maxim-Ar 2F" },
  { value: "porta_giro_1f", label: "Porta de Giro 1F" },
  { value: "porta_giro_2f", label: "Porta de Giro 2F" },
  { value: "porta_correr_2f", label: "Porta de Correr 2F" },
  { value: "porta_correr_4f", label: "Porta de Correr 4F" },
  { value: "janela_veneziana", label: "Janela c/ Veneziana 2F" },
  { value: "janela_camarao", label: "Janela Camarão" },
];
