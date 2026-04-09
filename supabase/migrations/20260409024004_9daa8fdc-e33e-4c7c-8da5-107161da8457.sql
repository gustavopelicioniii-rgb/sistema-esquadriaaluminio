
-- 1. Fix assinaturas: remove user self-update, only admins can manage subscriptions
DROP POLICY IF EXISTS "Users can update own subscription" ON public.assinaturas;

-- 2. Fix orcamento_historico: remove direct user INSERT, history should be managed server-side
-- For now, restrict INSERT so only admins can insert (or use triggers in future)
DROP POLICY IF EXISTS "Users can create own orcamento_historico" ON public.orcamento_historico;

CREATE POLICY "Only admins can insert orcamento_historico"
ON public.orcamento_historico
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
