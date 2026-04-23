-- ================================================
-- TABELAS FALTANTES - AluFlow
-- Execute este arquivo SEPARADAMENTE
-- ================================================

-- 1. Planos de Corte
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

-- 2. Tipologias Customizadas
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

-- 3. Regras de Corte Customizadas
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

-- 4. Regras de Vidro Customizadas
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

-- 5. Regras de Componentes Customizadas
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

-- 6. API Integrações
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

-- ================================================
-- RLS para estas tabelas
-- ================================================
ALTER TABLE public.planos_corte ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipologias_customizadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regras_corte_customizadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regras_vidro_customizadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regras_componentes_customizadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_integracoes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users manage own planos_corte" ON public.planos_corte FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users manage own tipologias_customizadas" ON public.tipologias_customizadas FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users manage own regras_corte_customizadas" ON public.regras_corte_customizadas FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users manage own regras_vidro_customizadas" ON public.regras_vidro_customizadas FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users manage own regras_componentes_customizadas" ON public.regras_componentes_customizadas FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users manage own api_integracoes" ON public.api_integracoes FOR ALL TO authenticated USING (auth.uid() = user_id);
