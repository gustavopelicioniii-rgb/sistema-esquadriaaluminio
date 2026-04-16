-- ============================================
-- ALUFLOW - SISTEMA DE GESTÃO DE ESQUADRIAS
-- Initial Schema Migration
-- ============================================

-- Helper function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============================================
-- TABLES
-- ============================================

-- Clientes
CREATE TABLE public.clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID DEFAULT auth.uid(),
  nome TEXT NOT NULL,
  telefone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  endereco TEXT DEFAULT '',
  cidade TEXT DEFAULT '',
  orcamentos_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orçamentos
CREATE TABLE public.orcamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID DEFAULT auth.uid(),
  numero TEXT NOT NULL,
  cliente TEXT NOT NULL,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  produto TEXT NOT NULL,
  valor NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pendente',
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  itens JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Estoque
CREATE TABLE public.estoque (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID DEFAULT auth.uid(),
  codigo TEXT NOT NULL UNIQUE,
  produto TEXT NOT NULL,
  quantidade INTEGER NOT NULL DEFAULT 0,
  unidade TEXT NOT NULL DEFAULT 'pçs',
  minimo INTEGER NOT NULL DEFAULT 0,
  categoria TEXT NOT NULL DEFAULT 'Outros',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Agenda
CREATE TABLE public.agenda (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID DEFAULT auth.uid(),
  titulo TEXT NOT NULL,
  data DATE NOT NULL,
  hora TEXT DEFAULT '',
  local TEXT DEFAULT '',
  responsavel TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Configurações
CREATE TABLE public.configuracoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID DEFAULT auth.uid(),
  chave TEXT NOT NULL UNIQUE,
  valor TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Produtos
CREATE TABLE public.produtos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID DEFAULT auth.uid(),
  codigo TEXT NOT NULL,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL DEFAULT 'Outros',
  preco NUMERIC NOT NULL DEFAULT 0,
  unidade TEXT NOT NULL DEFAULT 'm²',
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- CRM Leads
CREATE TABLE public.crm_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID DEFAULT auth.uid(),
  nome TEXT NOT NULL,
  valor NUMERIC NOT NULL DEFAULT 0,
  telefone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'novo',
  observacao TEXT DEFAULT '',
  follow_up_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Contas Financeiras
CREATE TABLE public.contas_financeiras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID DEFAULT auth.uid(),
  cliente TEXT NOT NULL,
  descricao TEXT NOT NULL DEFAULT '',
  valor NUMERIC NOT NULL DEFAULT 0,
  vencimento DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'pendente',
  tipo TEXT NOT NULL DEFAULT 'receber',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Pedidos/Ordens de Serviço
CREATE TABLE public.pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID DEFAULT auth.uid(),
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  pedido_num INTEGER NOT NULL,
  cliente TEXT NOT NULL,
  endereco TEXT DEFAULT '',
  telefone TEXT DEFAULT '',
  vendedor TEXT DEFAULT '',
  previsao DATE,
  valor NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'em_andamento',
  dias_restantes INTEGER DEFAULT 0,
  etapa TEXT DEFAULT '',
  etapa_data TEXT DEFAULT '',
  anotacao TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pagamentos
CREATE TABLE public.pagamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID REFERENCES public.pedidos(id) ON DELETE CASCADE NOT NULL,
  valor NUMERIC NOT NULL,
  data DATE NOT NULL,
  forma TEXT NOT NULL DEFAULT 'pix',
  observacao TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Etapas de Pedido
CREATE TABLE public.pedido_etapas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID REFERENCES public.pedidos(id) ON DELETE CASCADE NOT NULL,
  etapa TEXT NOT NULL,
  observacao TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Checklists de Pedido
CREATE TABLE public.pedido_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  etapa TEXT NOT NULL,
  item_key TEXT NOT NULL,
  checked BOOLEAN NOT NULL DEFAULT false,
  anotacao TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(pedido_id, etapa, item_key)
);

-- Custom Etapas de Pedido
CREATE TABLE public.pedido_custom_etapas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  etapa_key TEXT NOT NULL,
  label TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Custom Items de Etapa
CREATE TABLE public.pedido_custom_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  etapa_id UUID NOT NULL REFERENCES public.pedido_custom_etapas(id) ON DELETE CASCADE,
  item_key TEXT NOT NULL,
  label TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fotos de Checklist
CREATE TABLE public.pedido_checklist_fotos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  etapa TEXT NOT NULL,
  item_key TEXT,
  foto_url TEXT NOT NULL,
  nome_arquivo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Projetos de Vidro
CREATE TABLE public.projetos_vidro (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  titulo TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'Comum',
  espessura TEXT NOT NULL DEFAULT '6mm',
  cor TEXT NOT NULL DEFAULT 'Incolor',
  preco_m2 NUMERIC NOT NULL DEFAULT 0,
  area_minima_m2 NUMERIC NOT NULL DEFAULT 0,
  archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Vidro Itens
CREATE TABLE public.vidro_itens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  projeto_id UUID REFERENCES public.projetos_vidro(id) ON DELETE CASCADE NOT NULL,
  descricao TEXT NOT NULL,
  largura_mm INTEGER NOT NULL DEFAULT 1000,
  altura_mm INTEGER NOT NULL DEFAULT 1000,
  quantidade INTEGER NOT NULL DEFAULT 1,
  observacao TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'funcionario');
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Funcionários
CREATE TABLE public.funcionarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID DEFAULT auth.uid(),
  nome TEXT NOT NULL,
  cargo TEXT DEFAULT '',
  telefone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Administradores
CREATE TABLE public.administradores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID DEFAULT auth.uid(),
  nome TEXT NOT NULL,
  email TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Notificações
CREATE TABLE public.notification_reads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_id TEXT NOT NULL,
  read_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Histórico de Orçamentos
CREATE TABLE public.orcamento_historico (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID DEFAULT auth.uid(),
  orcamento_id UUID NOT NULL,
  status_anterior TEXT,
  status_novo TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Assinaturas
CREATE TYPE public.plan_tier AS ENUM ('basico', 'profissional', 'premium');
CREATE TABLE public.assinaturas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plano plan_tier NOT NULL DEFAULT 'basico',
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Auto-assign role on signup: first user = admin, others = funcionario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count INTEGER;
  assigned_role app_role;
BEGIN
  SELECT COUNT(*) INTO user_count FROM auth.users;
  IF user_count <= 1 THEN
    assigned_role := 'admin';
  ELSE
    assigned_role := 'funcionario';
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, assigned_role);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-create basic subscription for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.assinaturas (user_id, plano) VALUES (NEW.id, 'basico');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW
  FUNCTION public.handle_new_user_subscription();

-- Create conta when pedido is created
CREATE OR REPLACE FUNCTION public.create_conta_on_pedido()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.contas_financeiras (cliente, descricao, valor, vencimento, status, tipo, user_id)
  VALUES (
    NEW.cliente,
    'Pedido #' || NEW.pedido_num,
    NEW.valor,
    COALESCE(NEW.previsao, CURRENT_DATE + INTERVAL '30 days'),
    'pendente',
    'receber',
    NEW.user_id
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER create_conta_on_pedido_trigger
  AFTER INSERT ON public.pedidos
  FOR EACH ROW EXECUTE FUNCTION public.create_conta_on_pedido();

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON public.clientes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orcamentos_updated_at BEFORE UPDATE ON public.orcamentos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_estoque_updated_at BEFORE UPDATE ON public.estoque FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_agenda_updated_at BEFORE UPDATE ON public.agenda FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_configuracoes_updated_at BEFORE UPDATE ON public.configuracoes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE ON public.produtos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_crm_leads_updated_at BEFORE UPDATE ON public.crm_leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contas_financeiras_updated_at BEFORE UPDATE ON public.contas_financeiras FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON public.pedidos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pagamentos_updated_at BEFORE UPDATE ON public.pagamentos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pedido_checklists_updated_at BEFORE UPDATE ON public.pedido_checklists FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_funcionarios_updated_at BEFORE UPDATE ON public.funcionarios FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_administradores_updated_at BEFORE UPDATE ON public.administradores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_assinaturas_updated_at BEFORE UPDATE ON public.assinaturas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projetos_vidro_updated_at BEFORE UPDATE ON public.projetos_vidro FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orcamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contas_financeiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedido_etapas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedido_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedido_custom_etapas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedido_custom_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedido_checklist_fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projetos_vidro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vidro_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.administradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orcamento_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assinaturas ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES (simplified - all authenticated users can access)
-- ============================================

-- Clientes
CREATE POLICY "Users can view own clientes" ON public.clientes FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own clientes" ON public.clientes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own clientes" ON public.clientes FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own clientes" ON public.clientes FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Orcamentos
CREATE POLICY "Users can view own orcamentos" ON public.orcamentos FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own orcamentos" ON public.orcamentos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orcamentos" ON public.orcamentos FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own orcamentos" ON public.orcamentos FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Estoque
CREATE POLICY "Users can view own estoque" ON public.estoque FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own estoque" ON public.estoque FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own estoque" ON public.estoque FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own estoque" ON public.estoque FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Agenda
CREATE POLICY "Users can view own agenda" ON public.agenda FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own agenda" ON public.agenda FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own agenda" ON public.agenda FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own agenda" ON public.agenda FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Configuracoes
CREATE POLICY "Users can view own configuracoes" ON public.configuracoes FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own configuracoes" ON public.configuracoes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own configuracoes" ON public.configuracoes FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own configuracoes" ON public.configuracoes FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Produtos
CREATE POLICY "Users can view own produtos" ON public.produtos FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own produtos" ON public.produtos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own produtos" ON public.produtos FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own produtos" ON public.produtos FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- CRM Leads
CREATE POLICY "Users can view own crm_leads" ON public.crm_leads FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own crm_leads" ON public.crm_leads FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own crm_leads" ON public.crm_leads FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own crm_leads" ON public.crm_leads FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Contas Financeiras
CREATE POLICY "Users can view own contas_financeiras" ON public.contas_financeiras FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own contas_financeiras" ON public.contas_financeiras FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own contas_financeiras" ON public.contas_financeiras FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own contas_financeiras" ON public.contas_financeiras FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Pedidos
CREATE POLICY "Users can view own pedidos" ON public.pedidos FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own pedidos" ON public.pedidos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pedidos" ON public.pedidos FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own pedidos" ON public.pedidos FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Pagamentos
CREATE POLICY "Users can view own pagamentos" ON public.pagamentos FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pagamentos.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can create own pagamentos" ON public.pagamentos FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pagamentos.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can update own pagamentos" ON public.pagamentos FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pagamentos.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can delete own pagamentos" ON public.pagamentos FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pagamentos.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

-- Pedido Etapas
CREATE POLICY "Users can view own pedido_etapas" ON public.pedido_etapas FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_etapas.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can create own pedido_etapas" ON public.pedido_etapas FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_etapas.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can update own pedido_etapas" ON public.pedido_etapas FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_etapas.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can delete own pedido_etapas" ON public.pedido_etapas FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_etapas.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

-- Pedido Checklists
CREATE POLICY "Users can view own pedido_checklists" ON public.pedido_checklists FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_checklists.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can create own pedido_checklists" ON public.pedido_checklists FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_checklists.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can update own pedido_checklists" ON public.pedido_checklists FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_checklists.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can delete own pedido_checklists" ON public.pedido_checklists FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_checklists.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

-- Projetos Vidro
CREATE POLICY "Users can view own projetos_vidro" ON public.projetos_vidro FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own projetos_vidro" ON public.projetos_vidro FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projetos_vidro" ON public.projetos_vidro FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own projetos_vidro" ON public.projetos_vidro FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Vidro Itens
CREATE POLICY "Users can view own vidro_itens" ON public.vidro_itens FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.projetos_vidro WHERE id = projeto_id AND user_id = auth.uid()));
CREATE POLICY "Users can create own vidro_itens" ON public.vidro_itens FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.projetos_vidro WHERE id = projeto_id AND user_id = auth.uid()));
CREATE POLICY "Users can update own vidro_itens" ON public.vidro_itens FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.projetos_vidro WHERE id = projeto_id AND user_id = auth.uid()));
CREATE POLICY "Users can delete own vidro_itens" ON public.vidro_itens FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.projetos_vidro WHERE id = projeto_id AND user_id = auth.uid()));

-- User Roles
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Funcionarios
CREATE POLICY "Users can view own funcionarios" ON public.funcionarios FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own funcionarios" ON public.funcionarios FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own funcionarios" ON public.funcionarios FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own funcionarios" ON public.funcionarios FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Administradores
CREATE POLICY "Admins can view administradores" ON public.administradores FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can create administradores" ON public.administradores FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update administradores" ON public.administradores FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete administradores" ON public.administradores FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Assinaturas
CREATE POLICY "Users can view own subscription" ON public.assinaturas FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own subscription" ON public.assinaturas FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Orcamento Historico
CREATE POLICY "Users can view own orcamento_historico" ON public.orcamento_historico FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own orcamento_historico" ON public.orcamento_historico FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============================================
-- STORAGE BUCKETS
-- ============================================

INSERT INTO storage.buckets (id, name, public) VALUES ('checklist-fotos', 'checklist-fotos', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('company-assets', 'company-assets', false);

CREATE POLICY "Owner can manage checklist photos" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'checklist-fotos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Owner can manage company assets" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'company-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- SEED DATA - Sample Products
-- ============================================

INSERT INTO public.produtos (codigo, nome, categoria, preco, unidade, ativo) VALUES
  ('P-001', 'Janela de Correr 2 Folhas', 'Janelas', 850, 'm²', true),
  ('P-002', 'Janela Maxim-Ar', 'Janelas', 920, 'm²', true),
  ('P-003', 'Porta de Correr 3 Folhas', 'Portas', 1050, 'm²', true),
  ('P-004', 'Porta de Abrir', 'Portas', 950, 'm²', true),
  ('P-005', 'Fachada em Vidro', 'Fachadas', 1400, 'm²', true),
  ('P-006', 'Janela Pivotante', 'Janelas', 1100, 'm²', false),
  ('P-007', 'Box de Banheiro', 'Box', 750, 'm²', true),
  ('P-008', 'Guarda-corpo Alumínio', 'Guarda-corpo', 680, 'ml', true);
