
-- Remove anon policies from agenda
DROP POLICY IF EXISTS "Anon can delete agenda" ON public.agenda;
DROP POLICY IF EXISTS "Anon can insert agenda" ON public.agenda;
DROP POLICY IF EXISTS "Anon can update agenda" ON public.agenda;
DROP POLICY IF EXISTS "Anon users can view agenda" ON public.agenda;

-- Remove anon policies from clientes
DROP POLICY IF EXISTS "Anon can delete clientes" ON public.clientes;
DROP POLICY IF EXISTS "Anon can insert clientes" ON public.clientes;
DROP POLICY IF EXISTS "Anon can update clientes" ON public.clientes;
DROP POLICY IF EXISTS "Anon users can view clientes" ON public.clientes;

-- Remove anon policies from configuracoes
DROP POLICY IF EXISTS "Anon can delete configuracoes" ON public.configuracoes;
DROP POLICY IF EXISTS "Anon can insert configuracoes" ON public.configuracoes;
DROP POLICY IF EXISTS "Anon can update configuracoes" ON public.configuracoes;
DROP POLICY IF EXISTS "Anon users can view configuracoes" ON public.configuracoes;

-- Remove anon policies from estoque
DROP POLICY IF EXISTS "Anon can delete estoque" ON public.estoque;
DROP POLICY IF EXISTS "Anon can insert estoque" ON public.estoque;
DROP POLICY IF EXISTS "Anon can update estoque" ON public.estoque;
DROP POLICY IF EXISTS "Anon users can view estoque" ON public.estoque;

-- Remove anon policies from orcamentos
DROP POLICY IF EXISTS "Anon can delete orcamentos" ON public.orcamentos;
DROP POLICY IF EXISTS "Anon can insert orcamentos" ON public.orcamentos;
DROP POLICY IF EXISTS "Anon can update orcamentos" ON public.orcamentos;
DROP POLICY IF EXISTS "Anon users can view orcamentos" ON public.orcamentos;
