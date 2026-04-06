
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
