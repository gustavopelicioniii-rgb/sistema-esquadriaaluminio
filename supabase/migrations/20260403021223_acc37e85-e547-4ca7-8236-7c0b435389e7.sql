
-- Tabela de pedidos/ordens de serviço
CREATE TABLE public.pedidos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_num integer NOT NULL,
  cliente text NOT NULL,
  endereco text DEFAULT '',
  telefone text DEFAULT '',
  vendedor text DEFAULT '',
  previsao date,
  valor numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'em_andamento',
  dias_restantes integer DEFAULT 0,
  etapa text DEFAULT '',
  etapa_data text DEFAULT '',
  anotacao text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view pedidos" ON public.pedidos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create pedidos" ON public.pedidos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update pedidos" ON public.pedidos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete pedidos" ON public.pedidos FOR DELETE TO authenticated USING (true);

-- Tabela de pagamentos
CREATE TABLE public.pagamentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id uuid REFERENCES public.pedidos(id) ON DELETE CASCADE NOT NULL,
  valor numeric NOT NULL,
  data date NOT NULL,
  forma text NOT NULL DEFAULT 'pix',
  observacao text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view pagamentos" ON public.pagamentos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create pagamentos" ON public.pagamentos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update pagamentos" ON public.pagamentos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete pagamentos" ON public.pagamentos FOR DELETE TO authenticated USING (true);

-- Tabela de histórico de etapas
CREATE TABLE public.pedido_etapas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id uuid REFERENCES public.pedidos(id) ON DELETE CASCADE NOT NULL,
  etapa text NOT NULL,
  observacao text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pedido_etapas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view pedido_etapas" ON public.pedido_etapas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create pedido_etapas" ON public.pedido_etapas FOR INSERT TO authenticated WITH CHECK (true);

-- Triggers de updated_at
CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON public.pedidos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pagamentos_updated_at BEFORE UPDATE ON public.pagamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
