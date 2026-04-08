
-- 1. Remove overly broad storage policies on checklist-fotos
DROP POLICY IF EXISTS "Auth users can upload checklist fotos" ON storage.objects;
DROP POLICY IF EXISTS "Auth users can delete checklist fotos" ON storage.objects;

-- 2. Remove overly broad storage policies on company-assets
DROP POLICY IF EXISTS "Auth users can upload company assets" ON storage.objects;
DROP POLICY IF EXISTS "Auth users can update company assets" ON storage.objects;
DROP POLICY IF EXISTS "Auth users can delete company assets" ON storage.objects;

-- Add owner-scoped UPDATE for company-assets
CREATE POLICY "Owner can update company assets"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'company-assets'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Add owner-scoped UPDATE for checklist-fotos
CREATE POLICY "Owner can update checklist photos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'checklist-fotos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 3. Fix assinaturas UPDATE to prevent self-upgrade
DROP POLICY IF EXISTS "Users can update own subscription" ON public.assinaturas;
CREATE POLICY "Users can update own subscription"
  ON public.assinaturas FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND plano = 'basico'::plan_tier);

-- 4. Fix orcamento_historico INSERT to verify orcamento ownership
DROP POLICY IF EXISTS "Users can create own orcamento_historico" ON public.orcamento_historico;
CREATE POLICY "Users can create own orcamento_historico"
  ON public.orcamento_historico FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM orcamentos
      WHERE orcamentos.id = orcamento_historico.orcamento_id
        AND (orcamentos.user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
    )
  );
