import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import { PageLoading } from "@/components/LoadingSpinner";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/hooks/use-auth";
import { NotificationsProvider } from "@/hooks/use-notifications";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const Login = lazy(() => import("./pages/Login"));
const Cadastro = lazy(() => import("./pages/Cadastro"));
const EsqueciSenha = lazy(() => import("./pages/EsqueciSenha"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
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

const Relatorios = lazy(() => import("./pages/Relatorios"));
const Mapa = lazy(() => import("./pages/Mapa"));
const Configuracoes = lazy(() => import("./pages/Configuracoes"));
const Tipologias = lazy(() => import("./pages/Tipologias"));
const CalculoEsquadrias = lazy(() => import("./pages/CalculoEsquadrias"));
const NotaFiscal = lazy(() => import("./pages/NotaFiscal"));
const ImportarCSV = lazy(() => import("./pages/ImportarCSV"));
const Notificacoes = lazy(() => import("./pages/Notificacoes"));
const Planos = lazy(() => import("./pages/Planos"));
const CatalogoVidros = lazy(() => import("./pages/CatalogoVidros"));
const Funcionarios = lazy(() => import("./pages/Funcionarios"));
const Administradores = lazy(() => import("./pages/Administradores"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const P = ({ children }: { children: React.ReactNode }) => <ProtectedRoute>{children}</ProtectedRoute>;

function ProtectedLayout() {
  return (
    <P>
      <AppLayout />
    </P>
  );
}

const S = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoading />}>{children}</Suspense>
);

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <NotificationsProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoading />}>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/esqueci-senha" element={<EsqueciSenha />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Protected routes - shared layout */}
                <Route element={<ProtectedLayout />}>
                  <Route index element={<S><Dashboard /></S>} />
                  <Route path="/crm" element={<S><CRM /></S>} />
                  <Route path="/clientes" element={<S><Clientes /></S>} />
                  <Route path="/orcamentos" element={<S><Orcamentos /></S>} />
                  <Route path="/orcamentos/novo" element={<S><CriarOrcamento /></S>} />
                  <Route path="/orcamentos/editar/:id" element={<S><CriarOrcamento /></S>} />
                  <Route path="/producao" element={<S><Producao /></S>} />
                  <Route path="/plano-corte" element={<S><PlanoCorte /></S>} />
                  <Route path="/projeto-vidro" element={<S><ProjetoVidro /></S>} />
                  <Route path="/relacao-materiais" element={<S><RelacaoMateriais /></S>} />
                  <Route path="/estoque" element={<S><Estoque /></S>} />
                  <Route path="/financeiro" element={<S><Financeiro /></S>} />
                  <Route path="/agenda" element={<S><Agenda /></S>} />
                  <Route path="/produtos" element={<S><Produtos /></S>} />
                  
                  <Route path="/relatorios" element={<S><Relatorios /></S>} />
                  <Route path="/mapa" element={<S><Mapa /></S>} />
                  <Route path="/nota-fiscal" element={<S><NotaFiscal /></S>} />
                  <Route path="/calculo-esquadrias" element={<S><CalculoEsquadrias /></S>} />
                  <Route path="/configuracao-marca" element={<S><ConfiguracaoMarca /></S>} />
                  <Route path="/catalogo-mof" element={<S><CatalogoMOF /></S>} />
                  <Route path="/importar-csv" element={<S><ImportarCSV /></S>} />
                  <Route path="/notificacoes" element={<S><Notificacoes /></S>} />
                  <Route path="/tipologias" element={<S><Tipologias /></S>} />
                  <Route path="/configuracoes" element={<S><Configuracoes /></S>} />
                  <Route path="/catalogo-vidros" element={<S><CatalogoVidros /></S>} />
                  <Route path="/funcionarios" element={<S><Funcionarios /></S>} />
                  <Route path="/administradores" element={<S><Administradores /></S>} />
                  <Route path="/planos" element={<S><Planos /></S>} />
                </Route>

                <Route path="/proposta/:token" element={<S><PropostaOnline /></S>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </NotificationsProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
