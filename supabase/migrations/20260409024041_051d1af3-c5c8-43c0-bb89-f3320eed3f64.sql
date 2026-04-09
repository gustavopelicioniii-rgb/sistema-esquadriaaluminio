
-- 1. Fix orcamento_historico: allow users to insert history for their own orcamentos
DROP POLICY IF EXISTS "Only admins can insert orcamento_historico" ON public.orcamento_historico;

CREATE POLICY "Users can create own orcamento_historico"
ON public.orcamento_historico
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM orcamentos
    WHERE orcamentos.id = orcamento_historico.orcamento_id
    AND orcamentos.user_id = auth.uid()
  )
);

-- 2. Clean up redundant user_roles INSERT policy (the ALL policy already covers it)
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;
