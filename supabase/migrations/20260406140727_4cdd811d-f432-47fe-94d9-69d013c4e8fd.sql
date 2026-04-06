
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
