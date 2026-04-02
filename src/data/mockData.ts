// ============ DASHBOARD ============
export const dashboardStats = {
  faturamentoMes: 187500,
  orcamentosAprovados: 34,
  taxaConversao: 68,
  producaoAndamento: 12,
};

export const receitaMensal = [
  { mes: "Jan", valor: 125000 },
  { mes: "Fev", valor: 142000 },
  { mes: "Mar", valor: 138000 },
  { mes: "Abr", valor: 155000 },
  { mes: "Mai", valor: 167000 },
  { mes: "Jun", valor: 187500 },
];

export const statusPedidos = [
  { name: "Aguardando", value: 8, color: "hsl(38, 92%, 50%)" },
  { name: "Em Produção", value: 12, color: "hsl(217, 91%, 53%)" },
  { name: "Finalizado", value: 24, color: "hsl(142, 71%, 45%)" },
  { name: "Instalação", value: 6, color: "hsl(280, 67%, 55%)" },
];

// ============ CRM ============
export interface CrmLead {
  id: string;
  nome: string;
  valor: number;
  telefone: string;
  status: "novo" | "em_orcamento" | "negociacao" | "fechado";
}

export const crmLeads: CrmLead[] = [
  { id: "1", nome: "João Silva", valor: 15000, telefone: "(11) 99999-1234", status: "novo" },
  { id: "2", nome: "Maria Santos", valor: 28000, telefone: "(11) 98888-5678", status: "novo" },
  { id: "3", nome: "Carlos Oliveira", valor: 42000, telefone: "(21) 97777-9012", status: "em_orcamento" },
  { id: "4", nome: "Ana Costa", valor: 18500, telefone: "(31) 96666-3456", status: "em_orcamento" },
  { id: "5", nome: "Pedro Souza", valor: 55000, telefone: "(41) 95555-7890", status: "negociacao" },
  { id: "6", nome: "Luciana Lima", valor: 33000, telefone: "(51) 94444-2345", status: "negociacao" },
  { id: "7", nome: "Roberto Almeida", valor: 67000, telefone: "(61) 93333-6789", status: "fechado" },
  { id: "8", nome: "Fernanda Rocha", valor: 21000, telefone: "(71) 92222-0123", status: "fechado" },
  { id: "9", nome: "Marcos Pereira", valor: 39000, telefone: "(81) 91111-4567", status: "novo" },
  { id: "10", nome: "Beatriz Mendes", valor: 47500, telefone: "(19) 90000-8901", status: "negociacao" },
];

// ============ ORÇAMENTOS ============
export interface Orcamento {
  id: string;
  cliente: string;
  valor: number;
  status: "pendente" | "aprovado" | "recusado" | "em_analise";
  data: string;
  itens: OrcamentoItem[];
}

export interface OrcamentoItem {
  tipo: string;
  largura: number;
  altura: number;
  quantidade: number;
  valorUnitario: number;
}

export const orcamentos: Orcamento[] = [
  {
    id: "ORC-001",
    cliente: "João Silva",
    valor: 15000,
    status: "aprovado",
    data: "2024-03-15",
    itens: [
      { tipo: "Janela de Correr", largura: 150, altura: 120, quantidade: 4, valorUnitario: 2500 },
      { tipo: "Porta de Abrir", largura: 90, altura: 210, quantidade: 2, valorUnitario: 2500 },
    ],
  },
  {
    id: "ORC-002",
    cliente: "Maria Santos",
    valor: 28000,
    status: "pendente",
    data: "2024-03-18",
    itens: [
      { tipo: "Janela Maxim-Ar", largura: 80, altura: 60, quantidade: 6, valorUnitario: 1800 },
      { tipo: "Porta de Correr", largura: 200, altura: 220, quantidade: 2, valorUnitario: 8600 },
    ],
  },
  {
    id: "ORC-003",
    cliente: "Carlos Oliveira",
    valor: 42000,
    status: "em_analise",
    data: "2024-03-20",
    itens: [
      { tipo: "Fachada em Vidro", largura: 600, altura: 300, quantidade: 1, valorUnitario: 42000 },
    ],
  },
  {
    id: "ORC-004",
    cliente: "Ana Costa",
    valor: 18500,
    status: "aprovado",
    data: "2024-03-22",
    itens: [
      { tipo: "Janela de Correr", largura: 200, altura: 150, quantidade: 3, valorUnitario: 3500 },
      { tipo: "Janela Pivotante", largura: 100, altura: 120, quantidade: 2, valorUnitario: 3750 },
    ],
  },
  {
    id: "ORC-005",
    cliente: "Pedro Souza",
    valor: 55000,
    status: "recusado",
    data: "2024-03-25",
    itens: [
      { tipo: "Muro Cortina", largura: 800, altura: 400, quantidade: 1, valorUnitario: 55000 },
    ],
  },
];

// ============ PRODUÇÃO ============
export type StatusProducao = "aguardando" | "corte" | "montagem" | "instalacao" | "finalizado";

export interface OrdemProducao {
  id: string;
  cliente: string;
  produto: string;
  status: StatusProducao;
  prazo: string;
}

export const ordensProducao: OrdemProducao[] = [
  { id: "OP-001", cliente: "João Silva", produto: "Janela de Correr 150x120", status: "montagem", prazo: "2024-04-05" },
  { id: "OP-002", cliente: "João Silva", produto: "Porta de Abrir 90x210", status: "corte", prazo: "2024-04-08" },
  { id: "OP-003", cliente: "Ana Costa", produto: "Janela de Correr 200x150", status: "aguardando", prazo: "2024-04-12" },
  { id: "OP-004", cliente: "Ana Costa", produto: "Janela Pivotante 100x120", status: "aguardando", prazo: "2024-04-15" },
  { id: "OP-005", cliente: "Roberto Almeida", produto: "Fachada Pele de Vidro", status: "instalacao", prazo: "2024-04-02" },
  { id: "OP-006", cliente: "Fernanda Rocha", produto: "Porta de Correr 200x220", status: "finalizado", prazo: "2024-03-28" },
  { id: "OP-007", cliente: "Carlos Oliveira", produto: "Fachada em Vidro 600x300", status: "corte", prazo: "2024-04-20" },
];

// ============ PLANO DE CORTE ============
export interface PlanoCorte {
  id: string;
  perfil: string;
  comprimentoBarra: number;
  cortes: { comprimento: number; quantidade: number }[];
  aproveitamento: number;
}

export const planosCorte: PlanoCorte[] = [
  {
    id: "PC-001",
    perfil: "Montante 40x25",
    comprimentoBarra: 6000,
    cortes: [
      { comprimento: 1200, quantidade: 4 },
      { comprimento: 600, quantidade: 2 },
    ],
    aproveitamento: 93,
  },
  {
    id: "PC-002",
    perfil: "Trilho Superior 50x30",
    comprimentoBarra: 6000,
    cortes: [
      { comprimento: 1500, quantidade: 2 },
      { comprimento: 2000, quantidade: 1 },
    ],
    aproveitamento: 83,
  },
  {
    id: "PC-003",
    perfil: "Contramarco 75x35",
    comprimentoBarra: 6000,
    cortes: [
      { comprimento: 2100, quantidade: 2 },
      { comprimento: 900, quantidade: 2 },
    ],
    aproveitamento: 100,
  },
  {
    id: "PC-004",
    perfil: "Folha de Porta 60x28",
    comprimentoBarra: 6000,
    cortes: [
      { comprimento: 2100, quantidade: 2 },
      { comprimento: 800, quantidade: 1 },
    ],
    aproveitamento: 83,
  },
];

// ============ ESTOQUE ============
export interface ItemEstoque {
  id: string;
  produto: string;
  quantidade: number;
  unidade: string;
  minimo: number;
  categoria: string;
}

export const itensEstoque: ItemEstoque[] = [
  { id: "EST-001", produto: "Perfil Montante 40x25", quantidade: 120, unidade: "barras", minimo: 50, categoria: "Perfis" },
  { id: "EST-002", produto: "Perfil Trilho 50x30", quantidade: 85, unidade: "barras", minimo: 40, categoria: "Perfis" },
  { id: "EST-003", produto: "Vidro Temperado 8mm", quantidade: 45, unidade: "chapas", minimo: 20, categoria: "Vidros" },
  { id: "EST-004", produto: "Vidro Laminado 10mm", quantidade: 12, unidade: "chapas", minimo: 15, categoria: "Vidros" },
  { id: "EST-005", produto: "Roldana Dupla 30mm", quantidade: 200, unidade: "pçs", minimo: 100, categoria: "Acessórios" },
  { id: "EST-006", produto: "Fechadura Multiponto", quantidade: 8, unidade: "pçs", minimo: 20, categoria: "Acessórios" },
  { id: "EST-007", produto: "Silicone Estrutural", quantidade: 35, unidade: "tubos", minimo: 30, categoria: "Insumos" },
  { id: "EST-008", produto: "Borracha EPDM", quantidade: 500, unidade: "metros", minimo: 200, categoria: "Insumos" },
  { id: "EST-009", produto: "Parafuso Autoatarraxante", quantidade: 3000, unidade: "pçs", minimo: 1000, categoria: "Fixação" },
  { id: "EST-010", produto: "Perfil Contramarco 75x35", quantidade: 18, unidade: "barras", minimo: 25, categoria: "Perfis" },
];

// ============ FINANCEIRO ============
export interface ContaFinanceira {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  status: "pago" | "pendente" | "atrasado";
  tipo: "receber" | "pagar";
}

export const contasFinanceiras: ContaFinanceira[] = [
  { id: "FIN-001", descricao: "João Silva - ORC-001", valor: 15000, data: "2024-04-05", status: "pago", tipo: "receber" },
  { id: "FIN-002", descricao: "Ana Costa - ORC-004", valor: 18500, data: "2024-04-10", status: "pendente", tipo: "receber" },
  { id: "FIN-003", descricao: "Roberto Almeida - ORC-007", valor: 67000, data: "2024-03-28", status: "pago", tipo: "receber" },
  { id: "FIN-004", descricao: "Fernanda Rocha - ORC-008", valor: 21000, data: "2024-04-15", status: "pendente", tipo: "receber" },
  { id: "FIN-005", descricao: "Carlos Oliveira - ORC-003", valor: 42000, data: "2024-03-20", status: "atrasado", tipo: "receber" },
  { id: "FIN-006", descricao: "Fornecedor Alumínio SA", valor: 28000, data: "2024-04-01", status: "pago", tipo: "pagar" },
  { id: "FIN-007", descricao: "Vidraçaria Premium", valor: 15500, data: "2024-04-08", status: "pendente", tipo: "pagar" },
  { id: "FIN-008", descricao: "Aluguel Galpão", valor: 8500, data: "2024-04-05", status: "pago", tipo: "pagar" },
  { id: "FIN-009", descricao: "Folha de Pagamento", valor: 45000, data: "2024-04-05", status: "pago", tipo: "pagar" },
  { id: "FIN-010", descricao: "Energia Elétrica", valor: 3200, data: "2024-04-12", status: "pendente", tipo: "pagar" },
];

// ============ HELPERS ============
export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat("pt-BR").format(new Date(dateStr));

export const statusColors: Record<string, string> = {
  aprovado: "bg-success text-success-foreground",
  pendente: "bg-warning text-warning-foreground",
  recusado: "bg-destructive text-destructive-foreground",
  em_analise: "bg-primary text-primary-foreground",
  pago: "bg-success text-success-foreground",
  atrasado: "bg-destructive text-destructive-foreground",
};

export const statusLabels: Record<string, string> = {
  aprovado: "Aprovado",
  pendente: "Pendente",
  recusado: "Recusado",
  em_analise: "Em Análise",
  pago: "Pago",
  atrasado: "Atrasado",
  aguardando: "Aguardando",
  corte: "Corte",
  montagem: "Montagem",
  instalacao: "Instalação",
  finalizado: "Finalizado",
  novo: "Novo",
  em_orcamento: "Em Orçamento",
  negociacao: "Negociação",
  fechado: "Fechado",
};
