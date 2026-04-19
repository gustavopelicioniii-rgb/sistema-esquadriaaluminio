import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle, XCircle, Clock, FileText, Package, User, Phone, Mail, MapPin, DollarSign, Eye, Download, MessageCircle, Camera, Signature, Check, Truck, Wrench, ClipboardCheck } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { generateProfessionalBudgetPDF } from "@/utils/budgetPdfGenerator";
import { toast } from "sonner";

interface OrcamentoPortal {
  id: string;
  numero: string;
  cliente: string;
  telefone?: string;
  email?: string;
  produto: string;
  valor: number;
  status: string;
  data: string;
  itens: Record<string, any>;
  pedido_id?: string;
}

interface TrackingEvent {
  id: string;
  etapa: string;
  status: string;
  descricao: string;
  created_at: string;
}

interface PedidoEtapa {
  id: string;
  etapa: string;
  observacao: string;
  completed: boolean;
  completed_at?: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pendente: { label: "Pendente", color: "bg-yellow-500", icon: <Clock className="h-4 w-4" /> },
  aprovado: { label: "Aprovado", color: "bg-green-500", icon: <CheckCircle className="h-4 w-4" /> },
  recusado: { label: "Recusado", color: "bg-red-500", icon: <XCircle className="h-4 w-4" /> },
  em_producao: { label: "Em Produção", color: "bg-blue-500", icon: <Wrench className="h-4 w-4" /> },
  concluido: { label: "Concluído", color: "bg-purple-500", icon: <CheckCircle className="h-4 w-4" /> },
  entregue: { label: "Entregue", color: "bg-green-600", icon: <Truck className="h-4 w-4" /> },
};

const etapasPedido = [
  { key: "aprovado", label: "Aprovado", icon: CheckCircle },
  { key: "medicao", label: "Medição", icon: ClipboardCheck },
  { key: "corte", label: "Corte", icon: Wrench },
  { key: "montagem", label: "Montagem", icon: Wrench },
  { key: "instalacao", label: "Instalação", icon: Wrench },
  { key: "entregue", label: "Entregue", icon: Truck },
];

export default function PortalCliente() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasDraw, setHasDraw] = useState(false);

  const [token, setToken] = useState(searchParams.get("token") || "");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [orcamentos, setOrcamentos] = useState<OrcamentoPortal[]>([]);
  const [selectedOrcamento, setSelectedOrcamento] = useState<OrcamentoPortal | null>(null);
  const [empresaData, setEmpresaData] = useState<Record<string, string>>({});
  const [pedidoEtapas, setPedidoEtapas] = useState<PedidoEtapa[]>([]);
  const [signatureModal, setSignatureModal] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [aprovacaoObs, setAprovacaoObs] = useState("");

  useEffect(() => {
    loadEmpresaConfig();
  }, []);

  useEffect(() => {
    if (token) {
      searchOrcamentos();
    }
  }, [token]);

  useEffect(() => {
    if (selectedOrcamento?.pedido_id) {
      loadPedidoEtapas(selectedOrcamento.pedido_id);
    }
  }, [selectedOrcamento]);

  const loadEmpresaConfig = async () => {
    const { data } = await supabase.from("configuracoes").select("chave, valor");
    if (data) {
      const map: Record<string, string> = {};
      data.forEach((r) => { map[r.chave] = r.valor; });
      setEmpresaData(map);
    }
  };

  const loadPedidoEtapas = async (pedidoId: string) => {
    try {
      const { data } = await supabase
        .from("pedido_etapas")
        .select("*")
        .eq("pedido_id", pedidoId)
        .order("created_at", { ascending: true });

      if (data) {
        setPedidoEtapas(data.map((e) => ({
          ...e,
          completed: e.observacao && e.observacao.includes("[OK]"),
        })));
      }
    } catch (err) {
      console.error("Erro ao carregar etapas:", err);
    }
  };

  const searchOrcamentos = async () => {
    if (!email && !token) return;
    setLoading(true);

    try {
      let query = supabase.from("orcamentos").select("*").order("data", { ascending: false });

      if (token) {
        const { data: tokenData } = await supabase
          .from("client_portal_tokens")
          .select("orcamento_id, client_email")
          .eq("token", token)
          .single();

        if (tokenData) {
          query = query.eq("id", tokenData.orcamento_id);
        }
      } else {
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
      toast.success("Orçamento recusado.");
      searchOrcamentos();
    } catch (err: any) {
      toast.error("Erro ao recusar:", err.message);
    }
  };

  const handleAssinar = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDraw(false);
    setSignatureData("");
  };

  const handleSaveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDraw) return;

    const dataUrl = canvas.toDataURL("image/png");
    setSignatureData(dataUrl);
    setSignatureModal(false);
    toast.success("Assinatura salva!");

    // Save signature
    if (selectedOrcamento) {
      supabase
        .from("orcamentos")
        .update({ 
          status: "aprovado",
          assinatura: dataUrl,
          observacao: aprovacaoObs,
        })
        .eq("id", selectedOrcamento.id)
        .then(({ error }) => {
          if (error) {
            toast.error("Erro ao salvar assinatura");
          } else {
            toast.success("Proposta aprovada com sucesso!");
            searchOrcamentos();
          }
        });
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

  const handleWhatsApp = (orcamento: OrcamentoPortal) => {
    const telefone = orcamento.telefone || empresaData.telefone || "";
    const cleanPhone = telefone.replace(/\D/g, "");
    const msg = encodeURIComponent(
      `Olá! Estou acessando o portal do cliente sobre o Orçamento #${orcamento.numero}.`
    );
    window.open(`https://wa.me/55${cleanPhone}?text=${msg}`, "_blank");
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateStr));
  };

  // Drawing logic for signature
  const startDraw = (e: React.TouchEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.moveTo(x, y);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
  };

  const draw = (e: React.TouchEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDraw) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => {
    setHasDraw(true);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-10 w-10 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Portal do Cliente</CardTitle>
            <CardDescription className="text-base">
              Acompanhe seus orçamentos e pedidos em tempo real
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">E-mail ou Nome</Label>
              <Input
                type="text"
                placeholder="Digite seu e-mail ou nome..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
            </div>
            <Button
              className="w-full h-12 text-base font-medium gap-2"
              onClick={searchOrcamentos}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Eye className="h-5 w-5" />
                  Acessar Meus Orçamentos
                </>
              )}
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center pt-2">
              <Phone className="h-4 w-4" />
              <span>Contato: {empresaData.telefone || "(00) 0000-0000"}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{empresaData.nome || "AluFlow"}</h1>
            <p className="text-sm opacity-90">Portal do Cliente</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.open(`https://wa.me/55${(empresaData.telefone || "").replace(/\D/g, "")}`, "_blank")}
              className="gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-primary-foreground hover:bg-primary-foreground/20">
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 max-w-4xl">
        {!selectedOrcamento ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-1">Meus Orçamentos</h2>
              <p className="text-muted-foreground">Acompanhe o status dos seus pedidos</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : orcamentos.length === 0 ? (
              <Card className="shadow-md">
                <CardContent className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium mb-2">Nenhum orçamento encontrado</p>
                  <p className="text-muted-foreground text-sm">Entre em contato conosco para mais informações</p>
                  <Button
                    variant="outline"
                    className="mt-4 gap-2"
                    onClick={() => window.open(`https://wa.me/55${(empresaData.telefone || "").replace(/\D/g, "")}`, "_blank")}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Fale Conosco
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {orcamentos.map((orc) => {
                  const status = statusConfig[orc.status] || statusConfig.pendente;
                  return (
                    <Card key={orc.id} className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all" onClick={() => setSelectedOrcamento(orc)}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">#{orc.numero}</CardTitle>
                              <p className="text-sm text-muted-foreground">{formatDate(orc.data)}</p>
                            </div>
                          </div>
                          <Badge className={`${status.color} text-white border-0 px-3 py-1 text-sm`}>
                            {status.icon}
                            <span className="ml-1">{status.label}</span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-end">
                          <div className="flex-1">
                            <p className="font-semibold text-lg">{orc.produto}</p>
                            <p className="text-sm text-muted-foreground">{orc.cliente}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">{formatCurrency(orc.valor)}</p>
                            <p className="text-xs text-muted-foreground">Clique para detalhes</p>
                          </div>
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
            <Button
              variant="outline"
              onClick={() => {
                setSelectedOrcamento(null);
                setPedidoEtapas([]);
              }}
              className="gap-2"
            >
              ← Voltar
            </Button>

            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">#{selectedOrcamento.numero}</CardTitle>
                    <CardDescription>Emitido em {formatDate(selectedOrcamento.data)}</CardDescription>
                  </div>
                  <Badge className={`${statusConfig[selectedOrcamento.status]?.color} text-white border-0 text-lg px-4 py-2`}>
                    {statusConfig[selectedOrcamento.status]?.icon}
                    <span className="ml-2">{statusConfig[selectedOrcamento.status]?.label}</span>
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Cliente</p>
                      <p className="font-medium">{selectedOrcamento.cliente}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Package className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Produto</p>
                      <p className="font-medium">{selectedOrcamento.produto}</p>
                    </div>
                  </div>
                </div>

                {/* Tracking Timeline */}
                {pedidoEtapas.length > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-xl p-4">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <ClipboardCheck className="h-5 w-5 text-green-600" />
                      Acompanhamento do Pedido
                    </h3>
                    <div className="flex items-center justify-between">
                      {etapasPedido.map((etapa, i) => {
                        const etapaData = pedidoEtapas.find(e => e.etapa === etapa.key);
                        const isCompleted = !!etapaData?.completed;
                        const isCurrent = i === pedidoEtapas.length || (etapaData && !isCompleted);

                        return (
                          <div key={etapa.key} className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isCompleted ? "bg-green-500 text-white" :
                              isCurrent ? "bg-blue-500 text-white animate-pulse" :
                              "bg-gray-200 text-gray-400"
                            }`}>
                              <etapa.icon className="h-5 w-5" />
                            </div>
                            <p className="text-xs mt-1 font-medium text-center">{etapa.label}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Items */}
                <div>
                  <h3 className="font-semibold mb-3">Detalhes do Orçamento</h3>
                  <div className="border rounded-xl overflow-hidden">
                    {selectedOrcamento.itens?.items ? (
                      selectedOrcamento.itens.items.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between p-4 border-b last:border-0 bg-muted/30">
                          <div>
                            <p className="font-medium">{tiposProduto.find(t => t.value === item.tipo)?.label || item.tipo}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantidade}x — {item.largura_cm} x {item.altura_cm} cm
                            </p>
                          </div>
                          <p className="font-semibold text-primary">{formatCurrency(item.subtotal || item.custo)}</p>
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-between p-4 bg-muted/30">
                        <div>
                          <p className="font-medium">{selectedOrcamento.produto}</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedOrcamento.itens?.quantidade || 1}x
                          </p>
                        </div>
                        <p className="font-semibold text-primary">{formatCurrency(selectedOrcamento.valor)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Total */}
                <div className="bg-primary/5 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Valor Total:</span>
                    <span className="text-3xl font-bold text-primary">
                      {formatCurrency(selectedOrcamento.valor)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {selectedOrcamento.status === "pendente" && !signatureData && (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Observações (opcional)"
                      value={aprovacaoObs}
                      onChange={(e) => setAprovacaoObs(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <div className="flex gap-3">
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
                        onClick={() => setSignatureModal(true)}
                      >
                        <Signature className="h-5 w-5" />
                        Assinar e Aprovar
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1 gap-2"
                        onClick={() => handleRecusar(selectedOrcamento)}
                      >
                        <XCircle className="h-5 w-5" />
                        Recusar
                      </Button>
                    </div>
                  </div>
                )}

                {signatureData && (
                  <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold text-green-800 dark:text-green-300">
                      Proposta Aprovada!
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Aguarde nosso contato para dar continuidade
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-2">
                  <Button variant="outline" className="gap-2" onClick={() => handleGerarPDF(selectedOrcamento)}>
                    <Download className="h-5 w-5" />
                    Baixar PDF do Orçamento
                  </Button>
                  <Button variant="outline" className="gap-2 bg-green-50 hover:bg-green-100 border-green-200" onClick={() => handleWhatsApp(selectedOrcamento)}>
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    Falar no WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Signature Modal */}
      {signatureModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Signature className="h-6 w-6 text-primary" />
                Assinatura Digital
              </CardTitle>
              <CardDescription>
                Assine abaixo para aprovar o orçamento #{selectedOrcamento?.numero}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl overflow-hidden bg-white">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={200}
                  className="w-full touch-none cursor-crosshair"
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                  onTouchStart={startDraw}
                  onTouchMove={draw}
                  onTouchEnd={endDraw}
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Desenhe sua assinatura acima
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-2" onClick={handleAssinar}>
                  <Camera className="h-4 w-4" />
                  Limpar
                </Button>
                <Button className="flex-1 gap-2" onClick={handleSaveSignature} disabled={!hasDraw}>
                  <Check className="h-4 w-4" />
                  Salvar Assinatura
                </Button>
              </div>
              <Button variant="ghost" className="w-full" onClick={() => setSignatureModal(false)}>
                Cancelar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
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
