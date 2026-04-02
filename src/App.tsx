import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import CRM from "./pages/CRM";
import Clientes from "./pages/Clientes";
import Orcamentos from "./pages/Orcamentos";
import CriarOrcamento from "./pages/CriarOrcamento";
import Producao from "./pages/Producao";
import PlanoCorte from "./pages/PlanoCorte";
import ProjetoVidro from "./pages/ProjetoVidro";
import RelacaoMateriais from "./pages/RelacaoMateriais";
import Estoque from "./pages/Estoque";
import Financeiro from "./pages/Financeiro";
import Agenda from "./pages/Agenda";
import Produtos from "./pages/Produtos";
import PrecoItens from "./pages/PrecoItens";
import Relatorios from "./pages/Relatorios";
import Mapa from "./pages/Mapa";
import Administradores from "./pages/Administradores";
import Funcionarios from "./pages/Funcionarios";
import Configuracoes from "./pages/Configuracoes";
import CalculoEsquadrias from "./pages/CalculoEsquadrias";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
