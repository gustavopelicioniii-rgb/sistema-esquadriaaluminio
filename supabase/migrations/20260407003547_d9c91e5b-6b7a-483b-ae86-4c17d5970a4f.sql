
-- Allow users to update their own subscriptions (deactivate)
CREATE POLICY "Users can update own subscription"
  ON public.assinaturas FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to insert their own subscription
CREATE POLICY "Users can create own subscription"
  ON public.assinaturas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
