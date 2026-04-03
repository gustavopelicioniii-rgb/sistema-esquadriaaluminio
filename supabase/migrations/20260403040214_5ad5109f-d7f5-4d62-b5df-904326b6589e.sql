
CREATE TABLE public.produtos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text NOT NULL,
  nome text NOT NULL,
  categoria text NOT NULL DEFAULT 'Outros',
  preco numeric NOT NULL DEFAULT 0,
  unidade text NOT NULL DEFAULT 'm²',
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view produtos" ON public.produtos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create produtos" ON public.produtos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update produtos" ON public.produtos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete produtos" ON public.produtos FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE ON public.produtos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO public.produtos (codigo, nome, categoria, preco, unidade, ativo) VALUES
  ('P-001', 'Janela de Correr 2 Folhas', 'Janelas', 850, 'm²', true),
  ('P-002', 'Janela Maxim-Ar', 'Janelas', 920, 'm²', true),
  ('P-003', 'Porta de Correr 3 Folhas', 'Portas', 1050, 'm²', true),
  ('P-004', 'Porta de Abrir', 'Portas', 950, 'm²', true),
  ('P-005', 'Fachada em Vidro', 'Fachadas', 1400, 'm²', true),
  ('P-006', 'Janela Pivotante', 'Janelas', 1100, 'm²', false),
  ('P-007', 'Box de Banheiro', 'Box', 750, 'm²', true),
  ('P-008', 'Guarda-corpo Alumínio', 'Guarda-corpo', 680, 'ml', true);
