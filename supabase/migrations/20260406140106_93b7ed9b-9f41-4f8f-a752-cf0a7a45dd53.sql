
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
