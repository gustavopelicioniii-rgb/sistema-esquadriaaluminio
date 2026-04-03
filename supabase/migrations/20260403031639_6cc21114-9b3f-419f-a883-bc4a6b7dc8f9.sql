
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
