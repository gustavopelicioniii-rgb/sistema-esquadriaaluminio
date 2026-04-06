
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
