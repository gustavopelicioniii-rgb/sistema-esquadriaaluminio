
-- 1. FIX: api_integracoes SELECT policy open to all (CRITICAL)
DROP POLICY IF EXISTS "Users can view own api_integracoes" ON public.api_integracoes;
CREATE POLICY "Users can view own api_integracoes"
  ON public.api_integracoes FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 2. FIX: pedido_etapas missing UPDATE and DELETE policies (WARNING)
CREATE POLICY "Users can update own pedido_etapas"
  ON public.pedido_etapas FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM pedidos
    WHERE pedidos.id = pedido_etapas.pedido_id
      AND (pedidos.user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  ));

CREATE POLICY "Users can delete own pedido_etapas"
  ON public.pedido_etapas FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM pedidos
    WHERE pedidos.id = pedido_etapas.pedido_id
      AND (pedidos.user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  ));

-- 3. FIX: assinaturas INSERT - restrict to basico only (WARNING)
DROP POLICY IF EXISTS "Users can create own subscription" ON public.assinaturas;
CREATE POLICY "Users can create own subscription"
  ON public.assinaturas FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND plano = 'basico'::plan_tier);

-- 4. FIX: Storage checklist-fotos - add owner-scoped INSERT/DELETE policies
CREATE POLICY "Owner can upload checklist photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'checklist-fotos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Owner can delete checklist photos"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'checklist-fotos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 5. FIX: Storage company-assets - add owner-scoped policies
CREATE POLICY "Owner can upload company assets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'company-assets'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Owner can delete company assets"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'company-assets'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
