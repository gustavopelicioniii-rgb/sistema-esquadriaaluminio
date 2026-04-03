import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import { PageLoading } from "@/components/LoadingSpinner";
import { ThemeProvider } from "@/hooks/use-theme";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const CRM = lazy(() => import("./pages/CRM"));
const Clientes = lazy(() => import("./pages/Clientes"));
const Orcamentos = lazy(() => import("./pages/Orcamentos"));
const CriarOrcamento = lazy(() => import("./pages/CriarOrcamento"));
const Producao = lazy(() => import("./pages/Producao"));
const PlanoCorte = lazy(() => import("./pages/PlanoCorte"));
const ProjetoVidro = lazy(() => import("./pages/ProjetoVidro"));
const RelacaoMateriais = lazy(() => import("./pages/RelacaoMateriais"));
const Estoque = lazy(() => import("./pages/Estoque"));
const Financeiro = lazy(() => import("./pages/Financeiro"));
const Agenda = lazy(() => import("./pages/Agenda"));
const Produtos = lazy(() => import("./pages/Produtos"));
const PrecoItens = lazy(() => import("./pages/PrecoItens"));
const Relatorios = lazy(() => import("./pages/Relatorios"));
const Mapa = lazy(() => import("./pages/Mapa"));
const Administradores = lazy(() => import("./pages/Administradores"));
const Funcionarios = lazy(() => import("./pages/Funcionarios"));
const Configuracoes = lazy(() => import("./pages/Configuracoes"));
const CalculoEsquadrias = lazy(() => import("./pages/CalculoEsquadrias"));
const NotaFiscal = lazy(() => import("./pages/NotaFiscal"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Suspense fallback={<PageLoading />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/crm" element={<CRM />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/orcamentos" element={<Orcamentos />} />
                <Route path="/orcamentos/novo" element={<CriarOrcamento />} />
                <Route path="/producao" element={<Producao />} />
                <Route path="/plano-corte" element={<PlanoCorte />} />
                <Route path="/projeto-vidro" element={<ProjetoVidro />} />
                <Route path="/relacao-materiais" element={<RelacaoMateriais />} />
                <Route path="/estoque" element={<Estoque />} />
                <Route path="/financeiro" element={<Financeiro />} />
                <Route path="/agenda" element={<Agenda />} />
                <Route path="/produtos" element={<Produtos />} />
                <Route path="/preco-itens" element={<PrecoItens />} />
                <Route path="/relatorios" element={<Relatorios />} />
                <Route path="/mapa" element={<Mapa />} />
                <Route path="/administradores" element={<Administradores />} />
                <Route path="/funcionarios" element={<Funcionarios />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
                <Route path="/calculo-esquadrias" element={<CalculoEsquadrias />} />
                <Route path="/nota-fiscal" element={<NotaFiscal />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AppLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
