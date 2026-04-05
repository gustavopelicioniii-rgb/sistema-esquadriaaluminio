
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
