
CREATE TABLE public.pedido_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id uuid NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  etapa text NOT NULL,
  item_key text NOT NULL,
  checked boolean NOT NULL DEFAULT false,
  anotacao text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(pedido_id, etapa, item_key)
);

ALTER TABLE public.pedido_checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view pedido_checklists" ON public.pedido_checklists FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create pedido_checklists" ON public.pedido_checklists FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update pedido_checklists" ON public.pedido_checklists FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete pedido_checklists" ON public.pedido_checklists FOR DELETE TO authenticated USING (true);
