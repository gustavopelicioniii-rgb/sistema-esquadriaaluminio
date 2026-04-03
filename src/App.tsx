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
import { ProtectedRoute } from "@/components/ProtectedRoute";

const Login = lazy(() => import("./pages/Login"));
const Cadastro = lazy(() => import("./pages/Cadastro"));
const EsqueciSenha = lazy(() => import("./pages/EsqueciSenha"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

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
const ImportarCSV = lazy(() => import("./pages/ImportarCSV"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const P = ({ children }: { children: React.ReactNode }) => <ProtectedRoute>{children}</ProtectedRoute>;
const Admin = ({ children }: { children: React.ReactNode }) => <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>;

const App = () => (
  <ThemeProvider>
    <AuthProvider>
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

                {/* Protected routes */}
                <Route element={<P><AppLayout><Suspense fallback={<PageLoading />}><Dashboard /></Suspense></AppLayout></P>} path="/" />
                <Route path="/crm" element={<P><AppLayout><Suspense fallback={<PageLoading />}><CRM /></Suspense></AppLayout></P>} />
                <Route path="/clientes" element={<P><AppLayout><Suspense fallback={<PageLoading />}><Clientes /></Suspense></AppLayout></P>} />
                <Route path="/orcamentos" element={<P><AppLayout><Suspense fallback={<PageLoading />}><Orcamentos /></Suspense></AppLayout></P>} />
                <Route path="/orcamentos/novo" element={<P><AppLayout><Suspense fallback={<PageLoading />}><CriarOrcamento /></Suspense></AppLayout></P>} />
                <Route path="/producao" element={<P><AppLayout><Suspense fallback={<PageLoading />}><Producao /></Suspense></AppLayout></P>} />
                <Route path="/plano-corte" element={<P><AppLayout><Suspense fallback={<PageLoading />}><PlanoCorte /></Suspense></AppLayout></P>} />
                <Route path="/projeto-vidro" element={<P><AppLayout><Suspense fallback={<PageLoading />}><ProjetoVidro /></Suspense></AppLayout></P>} />
                <Route path="/relacao-materiais" element={<P><AppLayout><Suspense fallback={<PageLoading />}><RelacaoMateriais /></Suspense></AppLayout></P>} />
                <Route path="/estoque" element={<P><AppLayout><Suspense fallback={<PageLoading />}><Estoque /></Suspense></AppLayout></P>} />
                <Route path="/financeiro" element={<P><AppLayout><Suspense fallback={<PageLoading />}><Financeiro /></Suspense></AppLayout></P>} />
                <Route path="/agenda" element={<P><AppLayout><Suspense fallback={<PageLoading />}><Agenda /></Suspense></AppLayout></P>} />
                <Route path="/produtos" element={<P><AppLayout><Suspense fallback={<PageLoading />}><Produtos /></Suspense></AppLayout></P>} />
                <Route path="/preco-itens" element={<P><AppLayout><Suspense fallback={<PageLoading />}><PrecoItens /></Suspense></AppLayout></P>} />
                <Route path="/relatorios" element={<P><AppLayout><Suspense fallback={<PageLoading />}><Relatorios /></Suspense></AppLayout></P>} />
                <Route path="/mapa" element={<P><AppLayout><Suspense fallback={<PageLoading />}><Mapa /></Suspense></AppLayout></P>} />
                <Route path="/nota-fiscal" element={<P><AppLayout><Suspense fallback={<PageLoading />}><NotaFiscal /></Suspense></AppLayout></P>} />
                <Route path="/calculo-esquadrias" element={<P><AppLayout><Suspense fallback={<PageLoading />}><CalculoEsquadrias /></Suspense></AppLayout></P>} />
                <Route path="/importar-csv" element={<P><AppLayout><Suspense fallback={<PageLoading />}><ImportarCSV /></Suspense></AppLayout></P>} />
                
                {/* Admin only */}
                <Route path="/administradores" element={<Admin><AppLayout><Suspense fallback={<PageLoading />}><Administradores /></Suspense></AppLayout></Admin>} />
                <Route path="/funcionarios" element={<Admin><AppLayout><Suspense fallback={<PageLoading />}><Funcionarios /></Suspense></AppLayout></Admin>} />
                <Route path="/configuracoes" element={<Admin><AppLayout><Suspense fallback={<PageLoading />}><Configuracoes /></Suspense></AppLayout></Admin>} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
