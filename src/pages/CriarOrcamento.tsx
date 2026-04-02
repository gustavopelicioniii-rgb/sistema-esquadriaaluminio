import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/data/mockData";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const tiposProduto = [
  { value: "janela_correr", label: "Janela de Correr", precoM2: 850 },
  { value: "janela_maximar", label: "Janela Maxim-Ar", precoM2: 920 },
  { value: "janela_pivotante", label: "Janela Pivotante", precoM2: 1100 },
  { value: "porta_abrir", label: "Porta de Abrir", precoM2: 950 },
  { value: "porta_correr", label: "Porta de Correr", precoM2: 1050 },
  { value: "fachada_vidro", label: "Fachada em Vidro", precoM2: 1400 },
];

const CriarOrcamento = () => {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState("");
  const [tipo, setTipo] = useState("");
  const [largura, setLargura] = useState(150);
  const [altura, setAltura] = useState(120);
  const [quantidade, setQuantidade] = useState(1);

  const calculo = useMemo(() => {
    const produto = tiposProduto.find((t) => t.value === tipo);
    if (!produto) return null;
    const areaM2 = (largura / 100) * (altura / 100);
    const custoUnitario = areaM2 * produto.precoM2;
    const custoTotal = custoUnitario * quantidade;
    const margem = custoTotal * 0.35;
    const valorFinal = custoTotal + margem;
    return { custoUnitario, custoTotal, margem, valorFinal, areaM2 };
  }, [tipo, largura, altura, quantidade]);

  const handleSalvar = () => {
    toast({ title: "Orçamento criado!", description: `Orçamento para ${cliente} salvo com sucesso.` });
    navigate("/orcamentos");
  };

  // SVG preview scaling
  const maxDim = 220;
  const scale = Math.min(maxDim / largura, maxDim / altura, 1);
  const svgW = largura * scale;
  const svgH = altura * scale;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/orcamentos")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Novo Orçamento</h1>
          <p className="text-muted-foreground text-sm">Preencha os dados do orçamento</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Dados do Produto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Input placeholder="Nome do cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Produto</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger><SelectValue placeholder="Selecione o produto" /></SelectTrigger>
                <SelectContent>
                  {tiposProduto.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Largura (cm)</Label>
                <Input type="number" value={largura} onChange={(e) => setLargura(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Altura (cm)</Label>
                <Input type="number" value={altura} onChange={(e) => setAltura(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Quantidade</Label>
                <Input type="number" value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))} min={1} />
              </div>
            </div>
            <Button onClick={handleSalvar} disabled={!cliente || !tipo} className="w-full mt-2">
              Salvar Orçamento
            </Button>
          </CardContent>
        </Card>

        {/* Preview & Calculation */}
        <div className="space-y-4">
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Visualização 2D</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[260px]">
              <svg width={svgW + 60} height={svgH + 60} viewBox={`0 0 ${svgW + 60} ${svgH + 60}`}>
                <rect x={30} y={15} width={svgW} height={svgH} fill="hsl(217, 91%, 53%, 0.08)" stroke="hsl(217, 91%, 53%)" strokeWidth={2} rx={2} />
                {/* Frame lines */}
                <rect x={34} y={19} width={svgW - 8} height={svgH - 8} fill="none" stroke="hsl(217, 91%, 53%, 0.4)" strokeWidth={1} rx={1} />
                {/* Center divider for windows */}
                {tipo.includes("correr") && (
                  <line x1={30 + svgW / 2} y1={15} x2={30 + svgW / 2} y2={15 + svgH} stroke="hsl(217, 91%, 53%, 0.6)" strokeWidth={1.5} />
                )}
                {/* Dimension labels */}
                <text x={30 + svgW / 2} y={svgH + 40} textAnchor="middle" fontSize={11} fill="hsl(var(--muted-foreground))">
                  {largura} cm
                </text>
                <text x={12} y={15 + svgH / 2} textAnchor="middle" fontSize={11} fill="hsl(var(--muted-foreground))" transform={`rotate(-90, 12, ${15 + svgH / 2})`}>
                  {altura} cm
                </text>
              </svg>
            </CardContent>
          </Card>

          {calculo && (
            <Card className="shadow-sm border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Resultado do Cálculo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Área unitária</span>
                    <span className="font-medium">{calculo.areaM2.toFixed(2)} m²</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Custo estimado</span>
                    <span className="font-medium">{formatCurrency(calculo.custoTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Margem (35%)</span>
                    <span className="font-medium">{formatCurrency(calculo.margem)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold">Valor Final</span>
                    <span className="text-xl font-bold text-primary">{formatCurrency(calculo.valorFinal)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CriarOrcamento;
