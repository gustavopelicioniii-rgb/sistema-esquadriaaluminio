
-- CRM Leads table
CREATE TABLE public.crm_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  valor NUMERIC NOT NULL DEFAULT 0,
  telefone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'novo',
  observacao TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view crm_leads" ON public.crm_leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create crm_leads" ON public.crm_leads FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update crm_leads" ON public.crm_leads FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete crm_leads" ON public.crm_leads FOR DELETE TO authenticated USING (true);

-- Financeiro table
CREATE TABLE public.contas_financeiras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente TEXT NOT NULL,
  descricao TEXT NOT NULL DEFAULT '',
  valor NUMERIC NOT NULL DEFAULT 0,
  vencimento DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'pendente',
  tipo TEXT NOT NULL DEFAULT 'receber',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contas_financeiras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view contas_financeiras" ON public.contas_financeiras FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create contas_financeiras" ON public.contas_financeiras FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update contas_financeiras" ON public.contas_financeiras FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete contas_financeiras" ON public.contas_financeiras FOR DELETE TO authenticated USING (true);
