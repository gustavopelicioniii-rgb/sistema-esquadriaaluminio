-- 1. Add explicit INSERT policy on user_roles restricting to admins only
CREATE POLICY "Only admins can insert roles"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. Make checklist-fotos bucket private
UPDATE storage.buckets SET public = false WHERE id = 'checklist-fotos';

-- 3. Make company-assets bucket private
UPDATE storage.buckets SET public = false WHERE id = 'company-assets';

-- 4. Drop the public SELECT policies and replace with owner-scoped ones
DROP POLICY IF EXISTS "Anyone can view checklist fotos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view checklist fotos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view company assets" ON storage.objects;
DROP POLICY IF EXISTS "Public can view company assets" ON storage.objects;

-- Owner-scoped SELECT for checklist-fotos
CREATE POLICY "Owner can view checklist photos"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'checklist-fotos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Owner-scoped SELECT for company-assets
CREATE POLICY "Owner can view company assets"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'company-assets'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );