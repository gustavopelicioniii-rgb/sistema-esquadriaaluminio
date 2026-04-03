
-- Custom etapas per pedido
CREATE TABLE public.pedido_custom_etapas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id uuid NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  etapa_key text NOT NULL,
  label text NOT NULL,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Custom items per custom etapa
CREATE TABLE public.pedido_custom_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  etapa_id uuid NOT NULL REFERENCES public.pedido_custom_etapas(id) ON DELETE CASCADE,
  item_key text NOT NULL,
  label text NOT NULL,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Photos for checklist
CREATE TABLE public.pedido_checklist_fotos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id uuid NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  etapa text NOT NULL,
  item_key text,
  foto_url text NOT NULL,
  nome_arquivo text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS on pedido_custom_etapas
ALTER TABLE public.pedido_custom_etapas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view pedido_custom_etapas" ON public.pedido_custom_etapas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can create pedido_custom_etapas" ON public.pedido_custom_etapas FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update pedido_custom_etapas" ON public.pedido_custom_etapas FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth users can delete pedido_custom_etapas" ON public.pedido_custom_etapas FOR DELETE TO authenticated USING (true);

-- RLS on pedido_custom_items
ALTER TABLE public.pedido_custom_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view pedido_custom_items" ON public.pedido_custom_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can create pedido_custom_items" ON public.pedido_custom_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update pedido_custom_items" ON public.pedido_custom_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth users can delete pedido_custom_items" ON public.pedido_custom_items FOR DELETE TO authenticated USING (true);

-- RLS on pedido_checklist_fotos
ALTER TABLE public.pedido_checklist_fotos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view pedido_checklist_fotos" ON public.pedido_checklist_fotos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can create pedido_checklist_fotos" ON public.pedido_checklist_fotos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can delete pedido_checklist_fotos" ON public.pedido_checklist_fotos FOR DELETE TO authenticated USING (true);

-- Storage bucket for checklist photos
INSERT INTO storage.buckets (id, name, public) VALUES ('checklist-fotos', 'checklist-fotos', true);

-- Storage RLS
CREATE POLICY "Auth users can upload checklist fotos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'checklist-fotos');
CREATE POLICY "Anyone can view checklist fotos" ON storage.objects FOR SELECT USING (bucket_id = 'checklist-fotos');
CREATE POLICY "Auth users can delete checklist fotos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'checklist-fotos');
