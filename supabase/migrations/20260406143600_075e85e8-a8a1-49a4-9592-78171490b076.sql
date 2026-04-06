
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
