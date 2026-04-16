-- ================================================
-- ALUFLOW - SCHEMA ESSENCIAL
-- Execute TODO este arquivo no Supabase Dashboard
-- ================================================

-- ============================================
-- TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS public.clientes (
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

CREATE TABLE IF NOT EXISTS public.orcamentos (
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

CREATE TABLE IF NOT EXISTS public.estoque (
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

CREATE TABLE IF NOT EXISTS public.agenda (
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

CREATE TABLE IF NOT EXISTS public.configuracoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID DEFAULT auth.uid(),
  chave TEXT NOT NULL UNIQUE,
  valor TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.produtos (
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

CREATE TABLE IF NOT EXISTS public.crm_leads (
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

CREATE TABLE IF NOT EXISTS public.contas_financeiras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID DEFAULT auth.uid(),
  cliente TEXT NOT NULL,
  descricao TEXT NOT NULL DEFAULT '',
  valor NUMERIC NOT NULL DEFAULT 0,
  vencimento DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'pendente',
  tipo TEXT NOT NULL DEFAULT 'receber',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pedidos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID DEFAULT auth.uid(),
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  pedido_num TEXT NOT NULL,
  cliente TEXT NOT NULL,
  endereco TEXT DEFAULT '',
  telefone TEXT DEFAULT '',
  vendedor TEXT DEFAULT '',
  previsao DATE,
  valor NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pendente',
  dias_restantes INTEGER,
  etapa TEXT DEFAULT 'pedido',
  etapa_data TIMESTAMPTZ,
  anotacao TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pagamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID REFERENCES public.pedidos(id) ON DELETE CASCADE,
  valor NUMERIC NOT NULL DEFAULT 0,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  forma TEXT DEFAULT '',
  observacao TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pedido_etapas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID REFERENCES public.pedidos(id) ON DELETE CASCADE,
  etapa TEXT NOT NULL,
  observacao TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pedido_checklists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID REFERENCES public.pedidos(id) ON DELETE CASCADE,
  etapa TEXT NOT NULL,
  item_key TEXT NOT NULL,
  checked BOOLEAN DEFAULT false,
  anotacao TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pedido_checklist_fotos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID REFERENCES public.pedidos(id) ON DELETE CASCADE,
  etapa TEXT NOT NULL,
  item_key TEXT DEFAULT '',
  foto_url TEXT NOT NULL,
  nome_arquivo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.planos_corte (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID DEFAULT auth.uid(),
  typology_id TEXT NOT NULL,
  nome TEXT NOT NULL,
  responsavel TEXT DEFAULT '',
  largura INTEGER NOT NULL DEFAULT 0,
  altura INTEGER NOT NULL DEFAULT 0,
  quantidade INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE TABLE IF NOT EXISTS public.funcionarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID DEFAULT auth.uid(),
  nome TEXT NOT NULL,
  cargo TEXT DEFAULT '',
  telefone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.administradores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID DEFAULT auth.uid(),
  nome TEXT NOT NULL,
  email TEXT DEFAULT '',
  role TEXT DEFAULT '',
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.assinaturas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plano TEXT NOT NULL DEFAULT 'basico',
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notification_reads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID DEFAULT auth.uid(),
  notification_id TEXT NOT NULL,
  read_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orcamento_historico (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID DEFAULT auth.uid(),
  orcamento_id UUID,
  status_anterior TEXT DEFAULT '',
  status_novo TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.projetos_vidro (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID DEFAULT auth.uid(),
  titulo TEXT NOT NULL,
  tipo TEXT DEFAULT '',
  espessura INTEGER DEFAULT 4,
  cor TEXT DEFAULT 'incolor',
  preco_m2 NUMERIC DEFAULT 0,
  area_minima_m2 NUMERIC DEFAULT 0.5,
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vidro_itens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  projeto_id UUID REFERENCES public.projetos_vidro(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  largura_mm INTEGER NOT NULL,
  altura_mm INTEGER NOT NULL,
  quantidade INTEGER NOT NULL DEFAULT 1,
  observacao TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

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
-- RLS POLICIES (simplificado)
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
ALTER TABLE public.pedido_checklist_fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planos_corte ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.administradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assinaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projetos_vidro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vidro_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipologias_customizadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regras_corte_customizadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regras_vidro_customizadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regras_componentes_customizadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_integracoes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STORAGE BUCKETS
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('company-assets', 'company-assets', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('checklist-fotos', 'checklist-fotos', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- FUNCTION for updated_at
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- has_role FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

