-- ================================================
-- ALUFLOW - ESQUADRIAS DE ALUMÍNIO
-- SCHEMA COMPLETO - EXECUTE TODO ESTE ARQUIVO
-- ================================================
-- Execute no Supabase Dashboard > SQL Editor
-- =============================================


-- ================================================
-- 001_initial_schema.sql
-- ================================================
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
  EXECUTE FUNCTION public.handle_new_user_subscription();

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

-- ================================================
-- 20260403010743_0c035c83-8076-4212-a4e0-0e2a33fab62f.sql
-- ================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  endereco TEXT DEFAULT '',
  cidade TEXT DEFAULT '',
  orcamentos_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view clientes" ON public.clientes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create clientes" ON public.clientes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update clientes" ON public.clientes FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete clientes" ON public.clientes FOR DELETE TO authenticated USING (true);
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON public.clientes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.orcamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero TEXT NOT NULL,
  cliente TEXT NOT NULL,
  produto TEXT NOT NULL,
  valor NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente','aprovado','recusado')),
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  itens JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orcamentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view orcamentos" ON public.orcamentos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create orcamentos" ON public.orcamentos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update orcamentos" ON public.orcamentos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete orcamentos" ON public.orcamentos FOR DELETE TO authenticated USING (true);
CREATE TRIGGER update_orcamentos_updated_at BEFORE UPDATE ON public.orcamentos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.estoque (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  produto TEXT NOT NULL,
  quantidade INTEGER NOT NULL DEFAULT 0,
  unidade TEXT NOT NULL DEFAULT 'pçs',
  minimo INTEGER NOT NULL DEFAULT 0,
  categoria TEXT NOT NULL DEFAULT 'Outros',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.estoque ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view estoque" ON public.estoque FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create estoque" ON public.estoque FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update estoque" ON public.estoque FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete estoque" ON public.estoque FOR DELETE TO authenticated USING (true);
CREATE TRIGGER update_estoque_updated_at BEFORE UPDATE ON public.estoque FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.agenda (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  data DATE NOT NULL,
  hora TEXT DEFAULT '',
  local TEXT DEFAULT '',
  responsavel TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.agenda ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view agenda" ON public.agenda FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create agenda" ON public.agenda FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update agenda" ON public.agenda FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete agenda" ON public.agenda FOR DELETE TO authenticated USING (true);
CREATE TRIGGER update_agenda_updated_at BEFORE UPDATE ON public.agenda FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.configuracoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chave TEXT NOT NULL UNIQUE,
  valor TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view configuracoes" ON public.configuracoes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create configuracoes" ON public.configuracoes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update configuracoes" ON public.configuracoes FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete configuracoes" ON public.configuracoes FOR DELETE TO authenticated USING (true);
CREATE TRIGGER update_configuracoes_updated_at BEFORE UPDATE ON public.configuracoes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
-- ================================================
-- 20260403010845_ffa9f337-8587-493a-9710-06cdc6b5ddfa.sql
-- ================================================
CREATE POLICY "Anon users can view clientes" ON public.clientes FOR SELECT TO anon USING (true);
CREATE POLICY "Anon users can view orcamentos" ON public.orcamentos FOR SELECT TO anon USING (true);
CREATE POLICY "Anon users can view estoque" ON public.estoque FOR SELECT TO anon USING (true);
CREATE POLICY "Anon users can view agenda" ON public.agenda FOR SELECT TO anon USING (true);
CREATE POLICY "Anon users can view configuracoes" ON public.configuracoes FOR SELECT TO anon USING (true);

CREATE POLICY "Anon can insert clientes" ON public.clientes FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update clientes" ON public.clientes FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can delete clientes" ON public.clientes FOR DELETE TO anon USING (true);

CREATE POLICY "Anon can insert estoque" ON public.estoque FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update estoque" ON public.estoque FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can delete estoque" ON public.estoque FOR DELETE TO anon USING (true);

CREATE POLICY "Anon can insert agenda" ON public.agenda FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update agenda" ON public.agenda FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can delete agenda" ON public.agenda FOR DELETE TO anon USING (true);

CREATE POLICY "Anon can insert orcamentos" ON public.orcamentos FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update orcamentos" ON public.orcamentos FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can delete orcamentos" ON public.orcamentos FOR DELETE TO anon USING (true);

CREATE POLICY "Anon can insert configuracoes" ON public.configuracoes FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update configuracoes" ON public.configuracoes FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can delete configuracoes" ON public.configuracoes FOR DELETE TO anon USING (true);
-- ================================================
-- 20260403011129_e0d51faa-cd97-4268-b80b-7518a0fa9bc3.sql
-- ================================================
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'funcionario');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles without RLS recursion
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

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

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
-- ================================================
-- 20260403013152_62cb8cd6-89f7-473b-baf8-46fa53de676c.sql
-- ================================================

-- Remove anon policies from agenda
DROP POLICY IF EXISTS "Anon can delete agenda" ON public.agenda;
DROP POLICY IF EXISTS "Anon can insert agenda" ON public.agenda;
DROP POLICY IF EXISTS "Anon can update agenda" ON public.agenda;
DROP POLICY IF EXISTS "Anon users can view agenda" ON public.agenda;

-- Remove anon policies from clientes
DROP POLICY IF EXISTS "Anon can delete clientes" ON public.clientes;
DROP POLICY IF EXISTS "Anon can insert clientes" ON public.clientes;
DROP POLICY IF EXISTS "Anon can update clientes" ON public.clientes;
DROP POLICY IF EXISTS "Anon users can view clientes" ON public.clientes;

-- Remove anon policies from configuracoes
DROP POLICY IF EXISTS "Anon can delete configuracoes" ON public.configuracoes;
DROP POLICY IF EXISTS "Anon can insert configuracoes" ON public.configuracoes;
DROP POLICY IF EXISTS "Anon can update configuracoes" ON public.configuracoes;
DROP POLICY IF EXISTS "Anon users can view configuracoes" ON public.configuracoes;

-- Remove anon policies from estoque
DROP POLICY IF EXISTS "Anon can delete estoque" ON public.estoque;
DROP POLICY IF EXISTS "Anon can insert estoque" ON public.estoque;
DROP POLICY IF EXISTS "Anon can update estoque" ON public.estoque;
DROP POLICY IF EXISTS "Anon users can view estoque" ON public.estoque;

-- Remove anon policies from orcamentos
DROP POLICY IF EXISTS "Anon can delete orcamentos" ON public.orcamentos;
DROP POLICY IF EXISTS "Anon can insert orcamentos" ON public.orcamentos;
DROP POLICY IF EXISTS "Anon can update orcamentos" ON public.orcamentos;
DROP POLICY IF EXISTS "Anon users can view orcamentos" ON public.orcamentos;

-- ================================================
-- 20260403021223_acc37e85-e547-4ca7-8236-7c0b435389e7.sql
-- ================================================

-- Tabela de pedidos/ordens de serviço
CREATE TABLE public.pedidos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_num integer NOT NULL,
  cliente text NOT NULL,
  endereco text DEFAULT '',
  telefone text DEFAULT '',
  vendedor text DEFAULT '',
  previsao date,
  valor numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'em_andamento',
  dias_restantes integer DEFAULT 0,
  etapa text DEFAULT '',
  etapa_data text DEFAULT '',
  anotacao text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view pedidos" ON public.pedidos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create pedidos" ON public.pedidos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update pedidos" ON public.pedidos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete pedidos" ON public.pedidos FOR DELETE TO authenticated USING (true);

-- Tabela de pagamentos
CREATE TABLE public.pagamentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id uuid REFERENCES public.pedidos(id) ON DELETE CASCADE NOT NULL,
  valor numeric NOT NULL,
  data date NOT NULL,
  forma text NOT NULL DEFAULT 'pix',
  observacao text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view pagamentos" ON public.pagamentos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create pagamentos" ON public.pagamentos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update pagamentos" ON public.pagamentos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete pagamentos" ON public.pagamentos FOR DELETE TO authenticated USING (true);

-- Tabela de histórico de etapas
CREATE TABLE public.pedido_etapas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id uuid REFERENCES public.pedidos(id) ON DELETE CASCADE NOT NULL,
  etapa text NOT NULL,
  observacao text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pedido_etapas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view pedido_etapas" ON public.pedido_etapas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create pedido_etapas" ON public.pedido_etapas FOR INSERT TO authenticated WITH CHECK (true);

-- Triggers de updated_at
CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON public.pedidos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pagamentos_updated_at BEFORE UPDATE ON public.pagamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 20260403031639_6cc21114-9b3f-419f-a883-bc4a6b7dc8f9.sql
-- ================================================

-- Table for glass projects
CREATE TABLE public.projetos_vidro (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  titulo TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'Comum',
  espessura TEXT NOT NULL DEFAULT '6mm',
  cor TEXT NOT NULL DEFAULT 'Incolor',
  preco_m2 NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for glass items within a project
CREATE TABLE public.vidro_itens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  projeto_id UUID REFERENCES public.projetos_vidro(id) ON DELETE CASCADE NOT NULL,
  descricao TEXT NOT NULL,
  largura_mm INTEGER NOT NULL DEFAULT 1000,
  altura_mm INTEGER NOT NULL DEFAULT 1000,
  quantidade INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projetos_vidro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vidro_itens ENABLE ROW LEVEL SECURITY;

-- RLS for projetos_vidro: authenticated users can manage their own projects
CREATE POLICY "Users can view own projetos_vidro" ON public.projetos_vidro FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create projetos_vidro" ON public.projetos_vidro FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projetos_vidro" ON public.projetos_vidro FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own projetos_vidro" ON public.projetos_vidro FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS for vidro_itens: access through parent project ownership
CREATE POLICY "Users can view own vidro_itens" ON public.vidro_itens FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.projetos_vidro WHERE id = projeto_id AND user_id = auth.uid()));
CREATE POLICY "Users can create vidro_itens" ON public.vidro_itens FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.projetos_vidro WHERE id = projeto_id AND user_id = auth.uid()));
CREATE POLICY "Users can update own vidro_itens" ON public.vidro_itens FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.projetos_vidro WHERE id = projeto_id AND user_id = auth.uid()));
CREATE POLICY "Users can delete own vidro_itens" ON public.vidro_itens FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.projetos_vidro WHERE id = projeto_id AND user_id = auth.uid()));

-- Updated_at trigger
CREATE TRIGGER update_projetos_vidro_updated_at BEFORE UPDATE ON public.projetos_vidro FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 20260403040214_5ad5109f-d7f5-4d62-b5df-904326b6589e.sql
-- ================================================

CREATE TABLE public.produtos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text NOT NULL,
  nome text NOT NULL,
  categoria text NOT NULL DEFAULT 'Outros',
  preco numeric NOT NULL DEFAULT 0,
  unidade text NOT NULL DEFAULT 'm²',
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view produtos" ON public.produtos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create produtos" ON public.produtos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update produtos" ON public.produtos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete produtos" ON public.produtos FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE ON public.produtos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO public.produtos (codigo, nome, categoria, preco, unidade, ativo) VALUES
  ('P-001', 'Janela de Correr 2 Folhas', 'Janelas', 850, 'm²', true),
  ('P-002', 'Janela Maxim-Ar', 'Janelas', 920, 'm²', true),
  ('P-003', 'Porta de Correr 3 Folhas', 'Portas', 1050, 'm²', true),
  ('P-004', 'Porta de Abrir', 'Portas', 950, 'm²', true),
  ('P-005', 'Fachada em Vidro', 'Fachadas', 1400, 'm²', true),
  ('P-006', 'Janela Pivotante', 'Janelas', 1100, 'm²', false),
  ('P-007', 'Box de Banheiro', 'Box', 750, 'm²', true),
  ('P-008', 'Guarda-corpo Alumínio', 'Guarda-corpo', 680, 'ml', true);

-- ================================================
-- 20260403045843_047628ac-9905-40da-83ea-e178bdc13764.sql
-- ================================================

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

-- ================================================
-- 20260403060853_97f5f38a-7547-437d-bfe6-8a7f616593b1.sql
-- ================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.estoque;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contas_financeiras;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pedidos;
-- ================================================
-- 20260403061620_bce7442c-7942-4ea0-b468-f2ed9b4eb5bb.sql
-- ================================================
ALTER TABLE public.crm_leads ADD COLUMN IF NOT EXISTS follow_up_date date;
-- ================================================
-- 20260403155030_c22aae35-8c9b-4ca1-89db-0fbf873852c7.sql
-- ================================================

CREATE TABLE public.pedido_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id uuid NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  etapa text NOT NULL,
  item_key text NOT NULL,
  checked boolean NOT NULL DEFAULT false,
  anotacao text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(pedido_id, etapa, item_key)
);

ALTER TABLE public.pedido_checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view pedido_checklists" ON public.pedido_checklists FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create pedido_checklists" ON public.pedido_checklists FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update pedido_checklists" ON public.pedido_checklists FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete pedido_checklists" ON public.pedido_checklists FOR DELETE TO authenticated USING (true);

-- ================================================
-- 20260403161107_d4910e09-4d34-4f59-8274-96faab27514d.sql
-- ================================================

-- Custom etapas per pedido
CREATE TABLE public.pedido_custom_etapas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id uuid NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  etapa_key text NOT NULL,
  label text NOT NULL,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Custom items per custom etapa
CREATE TABLE public.pedido_custom_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  etapa_id uuid NOT NULL REFERENCES public.pedido_custom_etapas(id) ON DELETE CASCADE,
  item_key text NOT NULL,
  label text NOT NULL,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Photos for checklist
CREATE TABLE public.pedido_checklist_fotos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id uuid NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  etapa text NOT NULL,
  item_key text,
  foto_url text NOT NULL,
  nome_arquivo text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS on pedido_custom_etapas
ALTER TABLE public.pedido_custom_etapas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view pedido_custom_etapas" ON public.pedido_custom_etapas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can create pedido_custom_etapas" ON public.pedido_custom_etapas FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update pedido_custom_etapas" ON public.pedido_custom_etapas FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth users can delete pedido_custom_etapas" ON public.pedido_custom_etapas FOR DELETE TO authenticated USING (true);

-- RLS on pedido_custom_items
ALTER TABLE public.pedido_custom_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view pedido_custom_items" ON public.pedido_custom_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can create pedido_custom_items" ON public.pedido_custom_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update pedido_custom_items" ON public.pedido_custom_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth users can delete pedido_custom_items" ON public.pedido_custom_items FOR DELETE TO authenticated USING (true);

-- RLS on pedido_checklist_fotos
ALTER TABLE public.pedido_checklist_fotos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view pedido_checklist_fotos" ON public.pedido_checklist_fotos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can create pedido_checklist_fotos" ON public.pedido_checklist_fotos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can delete pedido_checklist_fotos" ON public.pedido_checklist_fotos FOR DELETE TO authenticated USING (true);

-- Storage bucket for checklist photos
INSERT INTO storage.buckets (id, name, public) VALUES ('checklist-fotos', 'checklist-fotos', true);

-- Storage RLS
CREATE POLICY "Auth users can upload checklist fotos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'checklist-fotos');
CREATE POLICY "Anyone can view checklist fotos" ON storage.objects FOR SELECT USING (bucket_id = 'checklist-fotos');
CREATE POLICY "Auth users can delete checklist fotos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'checklist-fotos');

-- ================================================
-- 20260404141008_79e6f787-aa4d-4af6-a36e-26306227388e.sql
-- ================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.crm_leads;
-- ================================================
-- 20260404155956_2bd29048-1fa0-493a-a4c7-1c2fa69bacd6.sql
-- ================================================

CREATE TABLE public.notification_reads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, notification_key)
);

ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notification reads"
  ON public.notification_reads FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own notification reads"
  ON public.notification_reads FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notification reads"
  ON public.notification_reads FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- ================================================
-- 20260405224648_b9bbf7a3-c75c-4177-97be-6090752b5d47.sql
-- ================================================

CREATE TABLE public.planos_corte (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT auth.uid(),
  typology_id TEXT NOT NULL,
  nome TEXT NOT NULL,
  responsavel TEXT NOT NULL DEFAULT '',
  largura INTEGER NOT NULL DEFAULT 1000,
  altura INTEGER NOT NULL DEFAULT 1000,
  quantidade INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.planos_corte ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own planos_corte" ON public.planos_corte FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create planos_corte" ON public.planos_corte FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own planos_corte" ON public.planos_corte FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own planos_corte" ON public.planos_corte FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ================================================
-- 20260406031131_74315eb5-ff3f-4f17-9c23-98a1f3128231.sql
-- ================================================

CREATE TABLE public.tipologias_customizadas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT auth.uid(),
  product_line_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'janela',
  subcategory TEXT DEFAULT 'correr',
  num_folhas INTEGER NOT NULL DEFAULT 2,
  has_veneziana BOOLEAN NOT NULL DEFAULT false,
  has_bandeira BOOLEAN NOT NULL DEFAULT false,
  notes TEXT DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT true,
  min_width_mm INTEGER DEFAULT 600,
  max_width_mm INTEGER DEFAULT 4000,
  min_height_mm INTEGER DEFAULT 400,
  max_height_mm INTEGER DEFAULT 2500,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tipologias_customizadas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own custom typologies" ON public.tipologias_customizadas FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create custom typologies" ON public.tipologias_customizadas FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own custom typologies" ON public.tipologias_customizadas FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own custom typologies" ON public.tipologias_customizadas FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ================================================
-- 20260406031409_0375ce1e-83d4-43b4-9fe6-28dab0f2d947.sql
-- ================================================

CREATE TABLE public.funcionarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL DEFAULT '',
  telefone TEXT DEFAULT '',
  setor TEXT NOT NULL DEFAULT 'Produção',
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth users can view funcionarios" ON public.funcionarios FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can create funcionarios" ON public.funcionarios FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update funcionarios" ON public.funcionarios FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth users can delete funcionarios" ON public.funcionarios FOR DELETE TO authenticated USING (true);

CREATE TABLE public.administradores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'Admin',
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.administradores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth users can view administradores" ON public.administradores FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can create administradores" ON public.administradores FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update administradores" ON public.administradores FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth users can delete administradores" ON public.administradores FOR DELETE TO authenticated USING (true);

-- ================================================
-- 20260406034758_78a264d5-0969-48f4-b749-9fb2abf6e098.sql
-- ================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('company-assets', 'company-assets', true);

CREATE POLICY "Auth users can upload company assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'company-assets');
CREATE POLICY "Auth users can update company assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'company-assets');
CREATE POLICY "Auth users can delete company assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'company-assets');
CREATE POLICY "Anyone can view company assets" ON storage.objects FOR SELECT TO public USING (bucket_id = 'company-assets');

-- ================================================
-- 20260406140106_93b7ed9b-9f41-4f8f-a752-cf0a7a45dd53.sql
-- ================================================

CREATE TABLE public.regras_corte_customizadas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  typology_id uuid NOT NULL REFERENCES public.tipologias_customizadas(id) ON DELETE CASCADE,
  profile_code text NOT NULL,
  piece_name text NOT NULL,
  piece_function text NOT NULL DEFAULT '',
  reference_dimension text NOT NULL DEFAULT 'L',
  coefficient numeric NOT NULL DEFAULT 1,
  constant_mm numeric NOT NULL DEFAULT 0,
  fixed_value_mm numeric,
  cut_angle_left numeric NOT NULL DEFAULT 90,
  cut_angle_right numeric NOT NULL DEFAULT 90,
  quantity_formula text NOT NULL DEFAULT '1',
  sort_order integer NOT NULL DEFAULT 0,
  weight_per_meter numeric NOT NULL DEFAULT 0,
  notes text,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.regras_corte_customizadas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own custom cut rules" ON public.regras_corte_customizadas
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create custom cut rules" ON public.regras_corte_customizadas
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own custom cut rules" ON public.regras_corte_customizadas
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own custom cut rules" ON public.regras_corte_customizadas
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ================================================
-- 20260406140727_4cdd811d-f432-47fe-94d9-69d013c4e8fd.sql
-- ================================================

CREATE TABLE public.api_integracoes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  chave text NOT NULL DEFAULT '',
  descricao text NOT NULL DEFAULT '',
  ativa boolean NOT NULL DEFAULT true,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.api_integracoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own api_integracoes" ON public.api_integracoes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create api_integracoes" ON public.api_integracoes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update api_integracoes" ON public.api_integracoes
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete api_integracoes" ON public.api_integracoes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ================================================
-- 20260406140901_b9a29f30-7351-46a3-950e-b6d2fd8ebb04.sql
-- ================================================

CREATE TABLE public.regras_vidro_customizadas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  typology_id uuid NOT NULL REFERENCES public.tipologias_customizadas(id) ON DELETE CASCADE,
  glass_name text NOT NULL,
  width_reference text NOT NULL DEFAULT 'L',
  width_constant_mm numeric NOT NULL DEFAULT 0,
  height_reference text NOT NULL DEFAULT 'H',
  height_constant_mm numeric NOT NULL DEFAULT 0,
  quantity integer NOT NULL DEFAULT 1,
  glass_type text,
  min_thickness_mm numeric,
  max_thickness_mm numeric,
  notes text,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.regras_vidro_customizadas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own custom glass rules" ON public.regras_vidro_customizadas
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create custom glass rules" ON public.regras_vidro_customizadas
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own custom glass rules" ON public.regras_vidro_customizadas
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own custom glass rules" ON public.regras_vidro_customizadas
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ================================================
-- 20260406143600_075e85e8-a8a1-49a4-9592-78171490b076.sql
-- ================================================

CREATE TABLE public.regras_componentes_customizadas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  typology_id UUID NOT NULL REFERENCES public.tipologias_customizadas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL DEFAULT auth.uid(),
  component_name TEXT NOT NULL,
  component_code TEXT DEFAULT '',
  component_type TEXT NOT NULL DEFAULT 'ferragem',
  quantity_formula TEXT NOT NULL DEFAULT '1',
  unit TEXT NOT NULL DEFAULT 'un',
  length_reference TEXT DEFAULT NULL,
  length_constant_mm NUMERIC DEFAULT 0,
  notes TEXT DEFAULT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.regras_componentes_customizadas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own custom component rules"
  ON public.regras_componentes_customizadas FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create custom component rules"
  ON public.regras_componentes_customizadas FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own custom component rules"
  ON public.regras_componentes_customizadas FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own custom component rules"
  ON public.regras_componentes_customizadas FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ================================================
-- 20260406153415_aab9dbd7-a38d-489b-9e44-1d538e4999a1.sql
-- ================================================

CREATE OR REPLACE FUNCTION public.auto_create_plano_corte()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.planos_corte (typology_id, nome, responsavel, largura, altura, quantidade, user_id)
  VALUES (NEW.id, NEW.name, '', 1000, 1000, 1, NEW.user_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_auto_plano_corte
AFTER INSERT ON public.tipologias_customizadas
FOR EACH ROW
EXECUTE FUNCTION public.auto_create_plano_corte();

-- ================================================
-- 20260406183615_16c3b871-3f8e-474f-9517-fdac077fa628.sql
-- ================================================

CREATE OR REPLACE FUNCTION public.create_conta_on_pedido()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.contas_financeiras (cliente, descricao, valor, vencimento, status, tipo)
  VALUES (
    NEW.cliente,
    'Pedido #' || NEW.pedido_num,
    NEW.valor,
    COALESCE(NEW.previsao, CURRENT_DATE + INTERVAL '30 days'),
    'pendente',
    'receber'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_pedido_created
  AFTER INSERT ON public.pedidos
  FOR EACH ROW
  EXECUTE FUNCTION public.create_conta_on_pedido();

-- ================================================
-- 20260406184015_998e0654-dbe7-4334-bf61-8f53851e82bb.sql
-- ================================================

CREATE OR REPLACE FUNCTION public.sync_conta_financeira_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_pedido_num integer;
  v_pedido_valor numeric;
  v_total_pago numeric;
  v_pedido_id uuid;
BEGIN
  -- Get the pedido_id depending on operation
  IF TG_OP = 'DELETE' THEN
    v_pedido_id := OLD.pedido_id;
  ELSE
    v_pedido_id := NEW.pedido_id;
  END IF;

  -- Get pedido info
  SELECT pedido_num, valor INTO v_pedido_num, v_pedido_valor
  FROM public.pedidos WHERE id = v_pedido_id;

  -- Sum all payments for this pedido
  SELECT COALESCE(SUM(valor), 0) INTO v_total_pago
  FROM public.pagamentos WHERE pedido_id = v_pedido_id;

  -- Update the corresponding conta_financeira
  IF v_total_pago >= v_pedido_valor THEN
    UPDATE public.contas_financeiras
    SET status = 'pago'
    WHERE descricao = 'Pedido #' || v_pedido_num AND tipo = 'receber';
  ELSE
    UPDATE public.contas_financeiras
    SET status = 'pendente'
    WHERE descricao = 'Pedido #' || v_pedido_num AND tipo = 'receber';
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER sync_pagamento_to_financeiro
  AFTER INSERT OR UPDATE OR DELETE ON public.pagamentos
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_conta_financeira_status();

-- ================================================
-- 20260406190436_0db2e548-a99a-4e9e-870a-ea8ef9743dee.sql
-- ================================================
ALTER TABLE public.contas_financeiras ADD COLUMN categoria text NOT NULL DEFAULT 'outros';
-- ================================================
-- 20260407002947_4de1ef2a-a955-4ea4-a2ee-3f0a83d117f1.sql
-- ================================================

-- Plan tiers enum
CREATE TYPE public.plan_tier AS ENUM ('basico', 'profissional', 'premium');

-- Subscriptions table
CREATE TABLE public.assinaturas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plano plan_tier NOT NULL DEFAULT 'basico',
  ativo BOOLEAN NOT NULL DEFAULT true,
  data_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  data_fim DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Unique constraint: one active subscription per user
CREATE UNIQUE INDEX idx_assinaturas_user_active ON public.assinaturas (user_id) WHERE ativo = true;

-- RLS
ALTER TABLE public.assinaturas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON public.assinaturas FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions"
  ON public.assinaturas FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Auto-create basic plan for new users
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
  EXECUTE FUNCTION public.handle_new_user_subscription();

-- Updated_at trigger
CREATE TRIGGER update_assinaturas_updated_at
  BEFORE UPDATE ON public.assinaturas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ================================================
-- 20260407003547_d9c91e5b-6b7a-483b-ae86-4c17d5970a4f.sql
-- ================================================

-- Allow users to update their own subscriptions (deactivate)
CREATE POLICY "Users can update own subscription"
  ON public.assinaturas FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to insert their own subscription
CREATE POLICY "Users can create own subscription"
  ON public.assinaturas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ================================================
-- 20260408025455_d641b8fc-edea-4cd6-8279-878b767914f0.sql
-- ================================================

CREATE TABLE public.orcamento_historico (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  orcamento_id UUID NOT NULL,
  status_anterior TEXT,
  status_novo TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.orcamento_historico ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth users can view orcamento_historico"
  ON public.orcamento_historico FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Auth users can create orcamento_historico"
  ON public.orcamento_historico FOR INSERT
  TO authenticated WITH CHECK (true);

-- ================================================
-- 20260408041358_285c7f9a-bded-47b9-b7c7-ae1bc2420ce2.sql
-- ================================================

ALTER TABLE public.vidro_itens ADD COLUMN observacao text DEFAULT '';
ALTER TABLE public.projetos_vidro ADD COLUMN area_minima_m2 numeric NOT NULL DEFAULT 0;

-- ================================================
-- 20260408201324_71e0d710-9553-40ce-91ca-ec02f72176e2.sql
-- ================================================

-- ============================================
-- 1. ADD user_id TO SHARED TABLES
-- ============================================

-- clientes
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
-- pedidos
ALTER TABLE public.pedidos ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
-- orcamentos
ALTER TABLE public.orcamentos ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
-- estoque
ALTER TABLE public.estoque ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
-- produtos
ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
-- contas_financeiras
ALTER TABLE public.contas_financeiras ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
-- agenda
ALTER TABLE public.agenda ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
-- funcionarios
ALTER TABLE public.funcionarios ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
-- crm_leads
ALTER TABLE public.crm_leads ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
-- configuracoes
ALTER TABLE public.configuracoes ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
-- administradores
ALTER TABLE public.administradores ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
-- orcamento_historico
ALTER TABLE public.orcamento_historico ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();

-- ============================================
-- 2. ADD FOREIGN KEYS: pedidos & orcamentos → clientes
-- ============================================

ALTER TABLE public.pedidos ADD COLUMN IF NOT EXISTS cliente_id uuid REFERENCES public.clientes(id) ON DELETE SET NULL;
ALTER TABLE public.orcamentos ADD COLUMN IF NOT EXISTS cliente_id uuid REFERENCES public.clientes(id) ON DELETE SET NULL;

-- ============================================
-- 3. DROP OLD PERMISSIVE RLS POLICIES & CREATE NEW ONES
-- ============================================

-- Helper: clientes
DROP POLICY IF EXISTS "Authenticated users can view clientes" ON public.clientes;
DROP POLICY IF EXISTS "Authenticated users can create clientes" ON public.clientes;
DROP POLICY IF EXISTS "Authenticated users can update clientes" ON public.clientes;
DROP POLICY IF EXISTS "Authenticated users can delete clientes" ON public.clientes;

CREATE POLICY "Users can view own clientes" ON public.clientes FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own clientes" ON public.clientes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own clientes" ON public.clientes FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own clientes" ON public.clientes FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- pedidos
DROP POLICY IF EXISTS "Authenticated users can view pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Authenticated users can create pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Authenticated users can update pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Authenticated users can delete pedidos" ON public.pedidos;

CREATE POLICY "Users can view own pedidos" ON public.pedidos FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own pedidos" ON public.pedidos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pedidos" ON public.pedidos FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own pedidos" ON public.pedidos FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- orcamentos
DROP POLICY IF EXISTS "Authenticated users can view orcamentos" ON public.orcamentos;
DROP POLICY IF EXISTS "Authenticated users can create orcamentos" ON public.orcamentos;
DROP POLICY IF EXISTS "Authenticated users can update orcamentos" ON public.orcamentos;
DROP POLICY IF EXISTS "Authenticated users can delete orcamentos" ON public.orcamentos;

CREATE POLICY "Users can view own orcamentos" ON public.orcamentos FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own orcamentos" ON public.orcamentos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orcamentos" ON public.orcamentos FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own orcamentos" ON public.orcamentos FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- estoque
DROP POLICY IF EXISTS "Authenticated users can view estoque" ON public.estoque;
DROP POLICY IF EXISTS "Authenticated users can create estoque" ON public.estoque;
DROP POLICY IF EXISTS "Authenticated users can update estoque" ON public.estoque;
DROP POLICY IF EXISTS "Authenticated users can delete estoque" ON public.estoque;

CREATE POLICY "Users can view own estoque" ON public.estoque FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own estoque" ON public.estoque FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own estoque" ON public.estoque FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own estoque" ON public.estoque FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- produtos
DROP POLICY IF EXISTS "Authenticated users can view produtos" ON public.produtos;
DROP POLICY IF EXISTS "Authenticated users can create produtos" ON public.produtos;
DROP POLICY IF EXISTS "Authenticated users can update produtos" ON public.produtos;
DROP POLICY IF EXISTS "Authenticated users can delete produtos" ON public.produtos;

CREATE POLICY "Users can view own produtos" ON public.produtos FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own produtos" ON public.produtos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own produtos" ON public.produtos FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own produtos" ON public.produtos FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- contas_financeiras
DROP POLICY IF EXISTS "Authenticated users can view contas_financeiras" ON public.contas_financeiras;
DROP POLICY IF EXISTS "Authenticated users can create contas_financeiras" ON public.contas_financeiras;
DROP POLICY IF EXISTS "Authenticated users can update contas_financeiras" ON public.contas_financeiras;
DROP POLICY IF EXISTS "Authenticated users can delete contas_financeiras" ON public.contas_financeiras;

CREATE POLICY "Users can view own contas_financeiras" ON public.contas_financeiras FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own contas_financeiras" ON public.contas_financeiras FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own contas_financeiras" ON public.contas_financeiras FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own contas_financeiras" ON public.contas_financeiras FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- agenda
DROP POLICY IF EXISTS "Authenticated users can view agenda" ON public.agenda;
DROP POLICY IF EXISTS "Authenticated users can create agenda" ON public.agenda;
DROP POLICY IF EXISTS "Authenticated users can update agenda" ON public.agenda;
DROP POLICY IF EXISTS "Authenticated users can delete agenda" ON public.agenda;

CREATE POLICY "Users can view own agenda" ON public.agenda FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own agenda" ON public.agenda FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own agenda" ON public.agenda FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own agenda" ON public.agenda FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- funcionarios
DROP POLICY IF EXISTS "Auth users can view funcionarios" ON public.funcionarios;
DROP POLICY IF EXISTS "Auth users can create funcionarios" ON public.funcionarios;
DROP POLICY IF EXISTS "Auth users can update funcionarios" ON public.funcionarios;
DROP POLICY IF EXISTS "Auth users can delete funcionarios" ON public.funcionarios;

CREATE POLICY "Users can view own funcionarios" ON public.funcionarios FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own funcionarios" ON public.funcionarios FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own funcionarios" ON public.funcionarios FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own funcionarios" ON public.funcionarios FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- crm_leads
DROP POLICY IF EXISTS "Authenticated users can view crm_leads" ON public.crm_leads;
DROP POLICY IF EXISTS "Authenticated users can create crm_leads" ON public.crm_leads;
DROP POLICY IF EXISTS "Authenticated users can update crm_leads" ON public.crm_leads;
DROP POLICY IF EXISTS "Authenticated users can delete crm_leads" ON public.crm_leads;

CREATE POLICY "Users can view own crm_leads" ON public.crm_leads FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own crm_leads" ON public.crm_leads FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own crm_leads" ON public.crm_leads FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own crm_leads" ON public.crm_leads FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- configuracoes
DROP POLICY IF EXISTS "Authenticated users can view configuracoes" ON public.configuracoes;
DROP POLICY IF EXISTS "Authenticated users can create configuracoes" ON public.configuracoes;
DROP POLICY IF EXISTS "Authenticated users can update configuracoes" ON public.configuracoes;
DROP POLICY IF EXISTS "Authenticated users can delete configuracoes" ON public.configuracoes;

CREATE POLICY "Users can view own configuracoes" ON public.configuracoes FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own configuracoes" ON public.configuracoes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own configuracoes" ON public.configuracoes FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own configuracoes" ON public.configuracoes FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- administradores
DROP POLICY IF EXISTS "Auth users can view administradores" ON public.administradores;
DROP POLICY IF EXISTS "Auth users can create administradores" ON public.administradores;
DROP POLICY IF EXISTS "Auth users can update administradores" ON public.administradores;
DROP POLICY IF EXISTS "Auth users can delete administradores" ON public.administradores;

CREATE POLICY "Admins can view administradores" ON public.administradores FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can create administradores" ON public.administradores FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update administradores" ON public.administradores FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete administradores" ON public.administradores FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- orcamento_historico
DROP POLICY IF EXISTS "Auth users can view orcamento_historico" ON public.orcamento_historico;
DROP POLICY IF EXISTS "Auth users can create orcamento_historico" ON public.orcamento_historico;

CREATE POLICY "Users can view own orcamento_historico" ON public.orcamento_historico FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own orcamento_historico" ON public.orcamento_historico FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- pagamentos: scope via pedido ownership
DROP POLICY IF EXISTS "Authenticated users can view pagamentos" ON public.pagamentos;
DROP POLICY IF EXISTS "Authenticated users can create pagamentos" ON public.pagamentos;
DROP POLICY IF EXISTS "Authenticated users can update pagamentos" ON public.pagamentos;
DROP POLICY IF EXISTS "Authenticated users can delete pagamentos" ON public.pagamentos;

CREATE POLICY "Users can view own pagamentos" ON public.pagamentos FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pagamentos.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can create own pagamentos" ON public.pagamentos FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pagamentos.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can update own pagamentos" ON public.pagamentos FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pagamentos.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can delete own pagamentos" ON public.pagamentos FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pagamentos.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

-- pedido_checklists: scope via pedido
DROP POLICY IF EXISTS "Authenticated users can view pedido_checklists" ON public.pedido_checklists;
DROP POLICY IF EXISTS "Authenticated users can create pedido_checklists" ON public.pedido_checklists;
DROP POLICY IF EXISTS "Authenticated users can update pedido_checklists" ON public.pedido_checklists;
DROP POLICY IF EXISTS "Authenticated users can delete pedido_checklists" ON public.pedido_checklists;

CREATE POLICY "Users can view own pedido_checklists" ON public.pedido_checklists FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_checklists.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can create own pedido_checklists" ON public.pedido_checklists FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_checklists.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can update own pedido_checklists" ON public.pedido_checklists FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_checklists.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can delete own pedido_checklists" ON public.pedido_checklists FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_checklists.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

-- pedido_checklist_fotos: scope via pedido
DROP POLICY IF EXISTS "Auth users can view pedido_checklist_fotos" ON public.pedido_checklist_fotos;
DROP POLICY IF EXISTS "Auth users can create pedido_checklist_fotos" ON public.pedido_checklist_fotos;
DROP POLICY IF EXISTS "Auth users can delete pedido_checklist_fotos" ON public.pedido_checklist_fotos;

CREATE POLICY "Users can view own pedido_checklist_fotos" ON public.pedido_checklist_fotos FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_checklist_fotos.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can create own pedido_checklist_fotos" ON public.pedido_checklist_fotos FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_checklist_fotos.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can delete own pedido_checklist_fotos" ON public.pedido_checklist_fotos FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_checklist_fotos.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

-- pedido_custom_etapas: scope via pedido
DROP POLICY IF EXISTS "Auth users can view pedido_custom_etapas" ON public.pedido_custom_etapas;
DROP POLICY IF EXISTS "Auth users can create pedido_custom_etapas" ON public.pedido_custom_etapas;
DROP POLICY IF EXISTS "Auth users can update pedido_custom_etapas" ON public.pedido_custom_etapas;
DROP POLICY IF EXISTS "Auth users can delete pedido_custom_etapas" ON public.pedido_custom_etapas;

CREATE POLICY "Users can view own pedido_custom_etapas" ON public.pedido_custom_etapas FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_custom_etapas.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can create own pedido_custom_etapas" ON public.pedido_custom_etapas FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_custom_etapas.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can update own pedido_custom_etapas" ON public.pedido_custom_etapas FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_custom_etapas.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can delete own pedido_custom_etapas" ON public.pedido_custom_etapas FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_custom_etapas.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

-- pedido_custom_items: scope via etapa → pedido
DROP POLICY IF EXISTS "Auth users can view pedido_custom_items" ON public.pedido_custom_items;
DROP POLICY IF EXISTS "Auth users can create pedido_custom_items" ON public.pedido_custom_items;
DROP POLICY IF EXISTS "Auth users can update pedido_custom_items" ON public.pedido_custom_items;
DROP POLICY IF EXISTS "Auth users can delete pedido_custom_items" ON public.pedido_custom_items;

CREATE POLICY "Users can view own pedido_custom_items" ON public.pedido_custom_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.pedido_custom_etapas e JOIN public.pedidos p ON p.id = e.pedido_id WHERE e.id = pedido_custom_items.etapa_id AND (p.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can create own pedido_custom_items" ON public.pedido_custom_items FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.pedido_custom_etapas e JOIN public.pedidos p ON p.id = e.pedido_id WHERE e.id = pedido_custom_items.etapa_id AND (p.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can update own pedido_custom_items" ON public.pedido_custom_items FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedido_custom_etapas e JOIN public.pedidos p ON p.id = e.pedido_id WHERE e.id = pedido_custom_items.etapa_id AND (p.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can delete own pedido_custom_items" ON public.pedido_custom_items FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedido_custom_etapas e JOIN public.pedidos p ON p.id = e.pedido_id WHERE e.id = pedido_custom_items.etapa_id AND (p.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

-- pedido_etapas: scope via pedido
DROP POLICY IF EXISTS "Authenticated users can view pedido_etapas" ON public.pedido_etapas;
DROP POLICY IF EXISTS "Authenticated users can create pedido_etapas" ON public.pedido_etapas;

CREATE POLICY "Users can view own pedido_etapas" ON public.pedido_etapas FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_etapas.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can create own pedido_etapas" ON public.pedido_etapas FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_etapas.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

-- Update create_conta_on_pedido trigger to propagate user_id
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

-- ================================================
-- 20260408223228_b3e9974a-4e5f-4fd9-86f5-058eaaf66bef.sql
-- ================================================

-- 1. FIX: api_integracoes SELECT policy open to all (CRITICAL)
DROP POLICY IF EXISTS "Users can view own api_integracoes" ON public.api_integracoes;
CREATE POLICY "Users can view own api_integracoes"
  ON public.api_integracoes FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 2. FIX: pedido_etapas missing UPDATE and DELETE policies (WARNING)
CREATE POLICY "Users can update own pedido_etapas"
  ON public.pedido_etapas FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM pedidos
    WHERE pedidos.id = pedido_etapas.pedido_id
      AND (pedidos.user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  ));

CREATE POLICY "Users can delete own pedido_etapas"
  ON public.pedido_etapas FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM pedidos
    WHERE pedidos.id = pedido_etapas.pedido_id
      AND (pedidos.user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  ));

-- 3. FIX: assinaturas INSERT - restrict to basico only (WARNING)
DROP POLICY IF EXISTS "Users can create own subscription" ON public.assinaturas;
CREATE POLICY "Users can create own subscription"
  ON public.assinaturas FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND plano = 'basico'::plan_tier);

-- 4. FIX: Storage checklist-fotos - add owner-scoped INSERT/DELETE policies
CREATE POLICY "Owner can upload checklist photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'checklist-fotos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Owner can delete checklist photos"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'checklist-fotos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 5. FIX: Storage company-assets - add owner-scoped policies
CREATE POLICY "Owner can upload company assets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'company-assets'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Owner can delete company assets"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'company-assets'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ================================================
-- 20260408223507_ff6173db-eb11-4244-852e-df8739e500e0.sql
-- ================================================

-- 1. Remove overly broad storage policies on checklist-fotos
DROP POLICY IF EXISTS "Auth users can upload checklist fotos" ON storage.objects;
DROP POLICY IF EXISTS "Auth users can delete checklist fotos" ON storage.objects;

-- 2. Remove overly broad storage policies on company-assets
DROP POLICY IF EXISTS "Auth users can upload company assets" ON storage.objects;
DROP POLICY IF EXISTS "Auth users can update company assets" ON storage.objects;
DROP POLICY IF EXISTS "Auth users can delete company assets" ON storage.objects;

-- Add owner-scoped UPDATE for company-assets
CREATE POLICY "Owner can update company assets"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'company-assets'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Add owner-scoped UPDATE for checklist-fotos
CREATE POLICY "Owner can update checklist photos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'checklist-fotos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 3. Fix assinaturas UPDATE to prevent self-upgrade
DROP POLICY IF EXISTS "Users can update own subscription" ON public.assinaturas;
CREATE POLICY "Users can update own subscription"
  ON public.assinaturas FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND plano = 'basico'::plan_tier);

-- 4. Fix orcamento_historico INSERT to verify orcamento ownership
DROP POLICY IF EXISTS "Users can create own orcamento_historico" ON public.orcamento_historico;
CREATE POLICY "Users can create own orcamento_historico"
  ON public.orcamento_historico FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM orcamentos
      WHERE orcamentos.id = orcamento_historico.orcamento_id
        AND (orcamentos.user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
    )
  );

-- ================================================
-- 20260408223552_ba0e3ba2-62d7-4cfb-b715-e2073182bb39.sql
-- ================================================

ALTER PUBLICATION supabase_realtime DROP TABLE public.estoque;
ALTER PUBLICATION supabase_realtime DROP TABLE public.pedidos;
ALTER PUBLICATION supabase_realtime DROP TABLE public.crm_leads;
ALTER PUBLICATION supabase_realtime DROP TABLE public.contas_financeiras;

-- ================================================
-- 20260408234224_926c4db7-802c-46bc-a47b-fb15f4c99743.sql
-- ================================================
-- 1. Add explicit INSERT policy on user_roles restricting to admins only
CREATE POLICY "Only admins can insert roles"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. Make checklist-fotos bucket private
UPDATE storage.buckets SET public = false WHERE id = 'checklist-fotos';

-- 3. Make company-assets bucket private
UPDATE storage.buckets SET public = false WHERE id = 'company-assets';

-- 4. Drop the public SELECT policies and replace with owner-scoped ones
DROP POLICY IF EXISTS "Anyone can view checklist fotos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view checklist fotos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view company assets" ON storage.objects;
DROP POLICY IF EXISTS "Public can view company assets" ON storage.objects;

-- Owner-scoped SELECT for checklist-fotos
CREATE POLICY "Owner can view checklist photos"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'checklist-fotos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Owner-scoped SELECT for company-assets
CREATE POLICY "Owner can view company assets"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'company-assets'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
-- ================================================
-- 20260409024004_9daa8fdc-e33e-4c7c-8da5-107161da8457.sql
-- ================================================

-- 1. Fix assinaturas: remove user self-update, only admins can manage subscriptions
DROP POLICY IF EXISTS "Users can update own subscription" ON public.assinaturas;

-- 2. Fix orcamento_historico: remove direct user INSERT, history should be managed server-side
-- For now, restrict INSERT so only admins can insert (or use triggers in future)
DROP POLICY IF EXISTS "Users can create own orcamento_historico" ON public.orcamento_historico;

CREATE POLICY "Only admins can insert orcamento_historico"
ON public.orcamento_historico
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ================================================
-- 20260409024041_051d1af3-c5c8-43c0-bb89-f3320eed3f64.sql
-- ================================================

-- 1. Fix orcamento_historico: allow users to insert history for their own orcamentos
DROP POLICY IF EXISTS "Only admins can insert orcamento_historico" ON public.orcamento_historico;

CREATE POLICY "Users can create own orcamento_historico"
ON public.orcamento_historico
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM orcamentos
    WHERE orcamentos.id = orcamento_historico.orcamento_id
    AND orcamentos.user_id = auth.uid()
  )
);

-- 2. Clean up redundant user_roles INSERT policy (the ALL policy already covers it)
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;

-- ================================================
-- 20260409024352_022699d4-495e-41e9-8b44-68e34dfac205.sql
-- ================================================

CREATE UNIQUE INDEX IF NOT EXISTS administradores_email_unique ON public.administradores (email);

-- ================================================
-- 20260413005302_2bb4a6ac-e170-4871-a1fa-dc4cb5168baa.sql
-- ================================================
ALTER TABLE public.projetos_vidro ADD COLUMN archived boolean NOT NULL DEFAULT false;
-- ================================================
-- 999_missing_tables.sql
-- ================================================
-- ============================================
-- TABELAS FALTANTES - AluFlow
-- Execute este SQL no Supabase Dashboard
-- ============================================

-- 1. Tipologias Customizadas
CREATE TABLE IF NOT EXISTS public.tipologias_customizadas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID DEFAULT auth.uid(),
  product_line_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'janela',
  subcategory TEXT DEFAULT 'correr',
  num_folhas INTEGER NOT NULL DEFAULT 2,
  has_veneziana BOOLEAN DEFAULT false,
  has_bandeira BOOLEAN DEFAULT false,
  notes TEXT,
  active BOOLEAN DEFAULT true,
  min_width_mm INTEGER DEFAULT 400,
  max_width_mm INTEGER DEFAULT 6000,
  min_height_mm INTEGER DEFAULT 300,
  max_height_mm INTEGER DEFAULT 3000,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Regras de Corte Customizadas
CREATE TABLE IF NOT EXISTS public.regras_corte_customizadas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID DEFAULT auth.uid(),
  typology_id TEXT NOT NULL,
  profile_code TEXT NOT NULL,
  piece_name TEXT NOT NULL,
  piece_function TEXT DEFAULT '',
  reference_dimension TEXT DEFAULT 'L',
  coefficient NUMERIC DEFAULT 1,
  constant_mm INTEGER DEFAULT 0,
  fixed_value_mm INTEGER,
  cut_angle_left INTEGER DEFAULT 90,
  cut_angle_right INTEGER DEFAULT 90,
  quantity_formula TEXT DEFAULT '1',
  sort_order INTEGER DEFAULT 0,
  weight_per_meter NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Regras de Vidro Customizadas
CREATE TABLE IF NOT EXISTS public.regras_vidro_customizadas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID DEFAULT auth.uid(),
  typology_id TEXT NOT NULL,
  glass_name TEXT NOT NULL,
  width_reference TEXT DEFAULT 'L',
  width_constant_mm INTEGER DEFAULT 0,
  height_reference TEXT DEFAULT 'H',
  height_constant_mm INTEGER DEFAULT 0,
  quantity INTEGER DEFAULT 1,
  glass_type TEXT,
  min_thickness_mm INTEGER,
  max_thickness_mm INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Regras de Componentes Customizadas
CREATE TABLE IF NOT EXISTS public.regras_componentes_customizadas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID DEFAULT auth.uid(),
  typology_id TEXT NOT NULL,
  component_name TEXT NOT NULL,
  component_code TEXT,
  component_type TEXT DEFAULT '',
  quantity_formula TEXT DEFAULT '1',
  unit TEXT DEFAULT 'un',
  length_reference TEXT,
  length_constant_mm INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. API Integrações
CREATE TABLE IF NOT EXISTS public.api_integracoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID DEFAULT auth.uid(),
  nome TEXT NOT NULL,
  descricao TEXT DEFAULT '',
  chave TEXT NOT NULL,
  ativa BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- RLS POLICIES (Row Level Security)
-- ============================================

-- Disable RLS for simplicity (enable in production with proper policies)
ALTER TABLE public.tipologias_customizadas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.regras_corte_customizadas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.regras_vidro_customizadas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.regras_componentes_customizadas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_integracoes DISABLE ROW LEVEL SECURITY;

-- ============================================
-- TRIGGER for updated_at
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tipologias_customizadas_updated_at
  BEFORE UPDATE ON public.tipologias_customizadas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_api_integracoes_updated_at
  BEFORE UPDATE ON public.api_integracoes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- STORAGE BUCKET for company assets
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('company-assets', 'company-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket for production checklist photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('checklist-fotos', 'checklist-fotos', false)
ON CONFLICT (id) DO NOTHING;

-- Enable public access to company-assets
UPDATE storage.buckets SET public = true WHERE id = 'company-assets';
