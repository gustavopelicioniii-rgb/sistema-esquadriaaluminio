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
