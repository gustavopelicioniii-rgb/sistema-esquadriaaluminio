
INSERT INTO storage.buckets (id, name, public) VALUES ('company-assets', 'company-assets', true);

CREATE POLICY "Auth users can upload company assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'company-assets');
CREATE POLICY "Auth users can update company assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'company-assets');
CREATE POLICY "Auth users can delete company assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'company-assets');
CREATE POLICY "Anyone can view company assets" ON storage.objects FOR SELECT TO public USING (bucket_id = 'company-assets');
