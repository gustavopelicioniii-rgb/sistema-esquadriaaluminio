// ============ DASHBOARD ============
export const dashboardStats = {
  vendas: 84250.21,
  obrasEntregues: 47,
  orcamentosRealizados: 5987.21,
  producaoAndamento: 8,
  ticketMedio: 3663.04,
  vendasCount: 23,
  orcamentosCount: 142,
  markupAtual: 2.29231,
  despFixas: 3988,
  despVariaveis: 3988,
  fatMedio: 3988,
  notasFiscais: 3098.21,
  nfProdutos: 33,
  nfServicos: 33,
  nfTotal: 66,
  estoqueTotal: 847,
};

export const producaoDetalhe = {
  corte: 3,
  montagem: 2,
  instalacao: 3,
};

export const receitaMensal = [
  { mes: "Jan", valor: 65000 },
  { mes: "Fev", valor: 72000 },
  { mes: "Mar", valor: 58000 },
  { mes: "Abr", valor: 85000 },
  { mes: "Mai", valor: 92000 },
  { mes: "Jun", valor: 84250 },
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
  produto: string;
  valor: number;
  status: "pendente" | "aprovado" | "recusado";
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
    id: "#1042",
    cliente: "Vidraçaria Norte SP",
    produto: "Janela Maxim-Ar 2F",
    valor: 2450,
    status: "aprovado",
    data: "2023-06-12",
    itens: [
      { tipo: "Janela Maxim-Ar 2F", largura: 150, altura: 120, quantidade: 2, valorUnitario: 1225 },
    ],
  },
  {
    id: "#1043",
    cliente: "Construtora Silva Ltda",
    produto: "Fachada Estrutural",
    valor: 45000,
    status: "pendente",
    data: "2023-06-14",
    itens: [
      { tipo: "Fachada Estrutural", largura: 600, altura: 300, quantidade: 1, valorUnitario: 45000 },
    ],
  },
  {
    id: "#1044",
    cliente: "Arquitetura Moderna",
    produto: "Porta de Correr 3F",
    valor: 8300,
    status: "recusado",
    data: "2023-06-15",
    itens: [
      { tipo: "Porta de Correr 3F", largura: 300, altura: 220, quantidade: 1, valorUnitario: 8300 },
    ],
  },
  {
    id: "#1045",
    cliente: "Obras & Cia",
    produto: "Janela de Correr",
    valor: 1200,
    status: "pendente",
    data: "2023-06-18",
    itens: [
      { tipo: "Janela de Correr", largura: 150, altura: 120, quantidade: 1, valorUnitario: 1200 },
    ],
  },
  {
    id: "#1046",
    cliente: "Residência Costa",
    produto: "Porta de Abrir",
    valor: 950,
    status: "aprovado",
    data: "2023-06-20",
    itens: [
      { tipo: "Porta de Abrir", largura: 90, altura: 210, quantidade: 1, valorUnitario: 950 },
    ],
  },
];

// ============ PRODUÇÃO / SERVIÇOS ============
export type StatusProducao = "aguardando" | "corte" | "montagem" | "instalacao" | "finalizado";

export interface OrdemProducao {
  id: string;
  pedidoNum: number;
  cliente: string;
  endereco: string;
  telefone: string;
  vendedor: string;
  previsao: string;
  valor: number;
  status: "atrasado" | "em_andamento" | "concluido";
  diasRestantes: number;
  etapa: string;
  etapaData?: string;
  anotacao?: string;
}

export const ordensProducao: OrdemProducao[] = [
  {
    id: "OP-001",
    pedidoNum: 3,
    cliente: "Igor Soares de Souza",
    endereco: "Rua Teste, 1234, Caieiras, Serpa, 07716-053",
    telefone: "(11) 9602-2000",
    vendedor: "Igor Soares de Souza",
    previsao: "2022-06-06",
    valor: 2440.94,
    status: "em_andamento",
    diasRestantes: -62,
    etapa: "Conferência",
    etapaData: "07/08/2022 15:12",
    anotacao: "teste",
  },
  {
    id: "OP-002",
    pedidoNum: 4,
    cliente: "Igor Soares de Souza",
    endereco: "Rua Teste, 1234, Caieiras, Serpa, 07716-053",
    telefone: "(11) 9602-2000",
    vendedor: "Igor Soares de Souza",
    previsao: "2022-06-06",
    valor: 1232.50,
    status: "atrasado",
    diasRestantes: -62,
    etapa: "Fechado",
  },
  {
    id: "OP-003",
    pedidoNum: 1,
    cliente: "Empresa Modelo Ltda",
    endereco: "Rua Teste, 1234, Caieiras, Serpa, 07716-053",
    telefone: "(11) 97473-9209",
    vendedor: "Igor Soares de Souza",
    previsao: "2022-08-12",
    valor: 14089.00,
    status: "em_andamento",
    diasRestantes: 5,
    etapa: "Fechado",
  },
  {
    id: "OP-004",
    pedidoNum: 8,
    cliente: "Igor Soares de Souza",
    endereco: "Rua Teste, 1234, Caieiras, Serpa, 07716-053",
    telefone: "(11) 9602-2000",
    vendedor: "Igor Soares de Souza",
    previsao: "2022-08-13",
    valor: 3087.31,
    status: "em_andamento",
    diasRestantes: 6,
  },
  {
    id: "OP-005",
    pedidoNum: 2,
    cliente: "Igor Soares de Souza",
    endereco: "Rua Teste, 1234, Caieiras, Serpa, 07716-053",
    telefone: "(11) 9602-2000",
    vendedor: "Igor Soares de Souza",
    previsao: "2022-08-15",
    valor: 17495.60,
    status: "em_andamento",
    diasRestantes: 8,
  },
  {
    id: "OP-006",
    pedidoNum: 6,
    cliente: "Empresa Modelo Ltda",
    endereco: "Rua Teste, 1234, Caieiras, Serpa, 07716-053",
    telefone: "(11) 9602-2000",
    vendedor: "Empresa Modelo",
    previsao: "2022-08-19",
    valor: 274.70,
    status: "concluido",
    diasRestantes: 12,
  },
];

// ============ PLANO DE CORTE ============
export interface PlanoCorte {
  id: string;
  perfil: string;
  comprimento: string;
  qtdBarras: number;
  eficiencia: number;
  categoria: "perfis" | "vidros" | "ferragens";
  cortes: { comprimento: number; cor: string }[];
  comprimentoBarra: number;
}

export const planosCorte: PlanoCorte[] = [
  {
    id: "PC-001",
    perfil: "Perfil U 45mm",
    comprimento: "3.60m",
    qtdBarras: 12,
    eficiencia: 92,
    categoria: "perfis",
    comprimentoBarra: 6000,
    cortes: [
      { comprimento: 1800, cor: "hsl(142, 71%, 45%)" },
      { comprimento: 1800, cor: "hsl(142, 71%, 45%)" },
      { comprimento: 1500, cor: "hsl(280, 67%, 55%)" },
    ],
  },
  {
    id: "PC-002",
    perfil: "Marco Reto 35mm",
    comprimento: "6.00m",
    qtdBarras: 8,
    eficiencia: 88,
    categoria: "perfis",
    comprimentoBarra: 6000,
    cortes: [
      { comprimento: 2700, cor: "hsl(217, 91%, 53%)" },
      { comprimento: 2580, cor: "hsl(38, 92%, 50%)" },
    ],
  },
  {
    id: "PC-003",
    perfil: "Contramarco 20mm",
    comprimento: "4.50m",
    qtdBarras: 15,
    eficiencia: 95,
    categoria: "perfis",
    comprimentoBarra: 6000,
    cortes: [
      { comprimento: 2250, cor: "hsl(217, 91%, 53%)" },
      { comprimento: 2250, cor: "hsl(217, 91%, 53%)" },
      { comprimento: 1200, cor: "hsl(142, 71%, 45%)" },
    ],
  },
  {
    id: "PC-004",
    perfil: "Folha Móvel 60mm",
    comprimento: "2.80m",
    qtdBarras: 6,
    eficiencia: 85,
    categoria: "perfis",
    comprimentoBarra: 6000,
    cortes: [
      { comprimento: 2800, cor: "hsl(38, 92%, 50%)" },
      { comprimento: 2300, cor: "hsl(38, 92%, 50%)" },
    ],
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
  cliente: string;
  descricao: string;
  valor: number;
  vencimento: string;
  status: "pago" | "pendente" | "vencido";
  tipo: "receber" | "pagar";
}

export const contasFinanceiras: ContaFinanceira[] = [
  { id: "REC-101", cliente: "Construtora Silva Ltda", descricao: "Sinal Fachada", valor: 15000, vencimento: "2023-06-25", status: "pendente", tipo: "receber" },
  { id: "REC-102", cliente: "Vidraçaria Norte SP", descricao: "Parcela 2/3 Janelas", valor: 1225, vencimento: "2023-06-20", status: "pago", tipo: "receber" },
  { id: "REC-103", cliente: "Arquitetura Moderna", descricao: "Saldo Final", valor: 3200, vencimento: "2023-06-15", status: "vencido", tipo: "receber" },
  { id: "REC-104", cliente: "Obras & Cia", descricao: "Entrada Janelas", valor: 600, vencimento: "2023-07-01", status: "pendente", tipo: "receber" },
  { id: "REC-105", cliente: "Residência Costa", descricao: "Pagamento Integral", valor: 950, vencimento: "2023-06-22", status: "pago", tipo: "receber" },
  { id: "PAG-201", cliente: "Fornecedor Alumínio SA", descricao: "Perfis Alumínio", valor: 8500, vencimento: "2023-06-28", status: "pendente", tipo: "pagar" },
  { id: "PAG-202", cliente: "Vidros Premium", descricao: "Vidros Temperados", valor: 4200, vencimento: "2023-06-18", status: "pago", tipo: "pagar" },
  { id: "PAG-203", cliente: "Ferragens Import", descricao: "Fechaduras e Roldanas", valor: 2800, vencimento: "2023-06-30", status: "pendente", tipo: "pagar" },
  { id: "PAG-204", cliente: "Aluguel Galpão", descricao: "Aluguel Mensal", valor: 3250, vencimento: "2023-06-05", status: "pago", tipo: "pagar" },
];

export const financeiroResumo = {
  aReceber: 45300,
  aPagar: 18750,
  saldoProjetado: 26550,
  inadimplencia: 3200,
};

// ============ HELPERS ============
export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat("pt-BR").format(new Date(dateStr));
