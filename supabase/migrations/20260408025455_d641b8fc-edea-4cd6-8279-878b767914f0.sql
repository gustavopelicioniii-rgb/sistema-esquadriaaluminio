
CREATE TABLE public.orcamento_historico (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  orcamento_id UUID NOT NULL,
  status_anterior TEXT,
  status_novo TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.orcamento_historico ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth users can view orcamento_historico"
  ON public.orcamento_historico FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Auth users can create orcamento_historico"
  ON public.orcamento_historico FOR INSERT
  TO authenticated WITH CHECK (true);
