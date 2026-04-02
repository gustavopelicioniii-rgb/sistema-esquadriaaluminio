import {
  dashboardStats,
  receitaMensal,
  statusPedidos,
  crmLeads,
  orcamentos,
  ordensProducao,
  planosCorte,
  itensEstoque,
  contasFinanceiras,
  type CrmLead,
  type Orcamento,
  type OrdemProducao,
  type PlanoCorte,
  type ItemEstoque,
  type ContaFinanceira,
} from "@/data/mockData";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const api = {
  dashboard: {
    getStats: async () => { await delay(100); return dashboardStats; },
    getReceitaMensal: async () => { await delay(100); return receitaMensal; },
    getStatusPedidos: async () => { await delay(100); return statusPedidos; },
  },
  crm: {
    getLeads: async (): Promise<CrmLead[]> => { await delay(100); return [...crmLeads]; },
    updateLeadStatus: async (id: string, status: CrmLead["status"]) => {
      await delay(100);
      return { success: true };
    },
  },
  orcamentos: {
    getAll: async (): Promise<Orcamento[]> => { await delay(100); return [...orcamentos]; },
    getById: async (id: string): Promise<Orcamento | undefined> => {
      await delay(100);
      return orcamentos.find((o) => o.id === id);
    },
    create: async (data: Partial<Orcamento>): Promise<Orcamento> => {
      await delay(200);
      return { id: `#${Date.now()}`, ...data } as Orcamento;
    },
  },
  producao: {
    getOrdens: async (): Promise<OrdemProducao[]> => { await delay(100); return [...ordensProducao]; },
  },
  planoCorte: {
    getPlanos: async (): Promise<PlanoCorte[]> => { await delay(100); return [...planosCorte]; },
  },
  estoque: {
    getItens: async (): Promise<ItemEstoque[]> => { await delay(100); return [...itensEstoque]; },
  },
  financeiro: {
    getContas: async (): Promise<ContaFinanceira[]> => { await delay(100); return [...contasFinanceiras]; },
  },
};
