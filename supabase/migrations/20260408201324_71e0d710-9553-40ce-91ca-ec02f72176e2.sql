
-- ============================================
-- 1. ADD user_id TO SHARED TABLES
-- ============================================

-- clientes
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
-- pedidos
ALTER TABLE public.pedidos ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
-- orcamentos
ALTER TABLE public.orcamentos ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
-- estoque
ALTER TABLE public.estoque ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
-- produtos
ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
-- contas_financeiras
ALTER TABLE public.contas_financeiras ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
-- agenda
ALTER TABLE public.agenda ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
-- funcionarios
ALTER TABLE public.funcionarios ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
-- crm_leads
ALTER TABLE public.crm_leads ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
-- configuracoes
ALTER TABLE public.configuracoes ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
-- administradores
ALTER TABLE public.administradores ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
-- orcamento_historico
ALTER TABLE public.orcamento_historico ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();

-- ============================================
-- 2. ADD FOREIGN KEYS: pedidos & orcamentos → clientes
-- ============================================

ALTER TABLE public.pedidos ADD COLUMN IF NOT EXISTS cliente_id uuid REFERENCES public.clientes(id) ON DELETE SET NULL;
ALTER TABLE public.orcamentos ADD COLUMN IF NOT EXISTS cliente_id uuid REFERENCES public.clientes(id) ON DELETE SET NULL;

-- ============================================
-- 3. DROP OLD PERMISSIVE RLS POLICIES & CREATE NEW ONES
-- ============================================

-- Helper: clientes
DROP POLICY IF EXISTS "Authenticated users can view clientes" ON public.clientes;
DROP POLICY IF EXISTS "Authenticated users can create clientes" ON public.clientes;
DROP POLICY IF EXISTS "Authenticated users can update clientes" ON public.clientes;
DROP POLICY IF EXISTS "Authenticated users can delete clientes" ON public.clientes;

CREATE POLICY "Users can view own clientes" ON public.clientes FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own clientes" ON public.clientes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own clientes" ON public.clientes FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own clientes" ON public.clientes FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- pedidos
DROP POLICY IF EXISTS "Authenticated users can view pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Authenticated users can create pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Authenticated users can update pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Authenticated users can delete pedidos" ON public.pedidos;

CREATE POLICY "Users can view own pedidos" ON public.pedidos FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own pedidos" ON public.pedidos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pedidos" ON public.pedidos FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own pedidos" ON public.pedidos FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- orcamentos
DROP POLICY IF EXISTS "Authenticated users can view orcamentos" ON public.orcamentos;
DROP POLICY IF EXISTS "Authenticated users can create orcamentos" ON public.orcamentos;
DROP POLICY IF EXISTS "Authenticated users can update orcamentos" ON public.orcamentos;
DROP POLICY IF EXISTS "Authenticated users can delete orcamentos" ON public.orcamentos;

CREATE POLICY "Users can view own orcamentos" ON public.orcamentos FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own orcamentos" ON public.orcamentos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orcamentos" ON public.orcamentos FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own orcamentos" ON public.orcamentos FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- estoque
DROP POLICY IF EXISTS "Authenticated users can view estoque" ON public.estoque;
DROP POLICY IF EXISTS "Authenticated users can create estoque" ON public.estoque;
DROP POLICY IF EXISTS "Authenticated users can update estoque" ON public.estoque;
DROP POLICY IF EXISTS "Authenticated users can delete estoque" ON public.estoque;

CREATE POLICY "Users can view own estoque" ON public.estoque FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own estoque" ON public.estoque FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own estoque" ON public.estoque FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own estoque" ON public.estoque FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- produtos
DROP POLICY IF EXISTS "Authenticated users can view produtos" ON public.produtos;
DROP POLICY IF EXISTS "Authenticated users can create produtos" ON public.produtos;
DROP POLICY IF EXISTS "Authenticated users can update produtos" ON public.produtos;
DROP POLICY IF EXISTS "Authenticated users can delete produtos" ON public.produtos;

CREATE POLICY "Users can view own produtos" ON public.produtos FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own produtos" ON public.produtos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own produtos" ON public.produtos FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own produtos" ON public.produtos FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- contas_financeiras
DROP POLICY IF EXISTS "Authenticated users can view contas_financeiras" ON public.contas_financeiras;
DROP POLICY IF EXISTS "Authenticated users can create contas_financeiras" ON public.contas_financeiras;
DROP POLICY IF EXISTS "Authenticated users can update contas_financeiras" ON public.contas_financeiras;
DROP POLICY IF EXISTS "Authenticated users can delete contas_financeiras" ON public.contas_financeiras;

CREATE POLICY "Users can view own contas_financeiras" ON public.contas_financeiras FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own contas_financeiras" ON public.contas_financeiras FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own contas_financeiras" ON public.contas_financeiras FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own contas_financeiras" ON public.contas_financeiras FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- agenda
DROP POLICY IF EXISTS "Authenticated users can view agenda" ON public.agenda;
DROP POLICY IF EXISTS "Authenticated users can create agenda" ON public.agenda;
DROP POLICY IF EXISTS "Authenticated users can update agenda" ON public.agenda;
DROP POLICY IF EXISTS "Authenticated users can delete agenda" ON public.agenda;

CREATE POLICY "Users can view own agenda" ON public.agenda FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own agenda" ON public.agenda FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own agenda" ON public.agenda FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own agenda" ON public.agenda FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- funcionarios
DROP POLICY IF EXISTS "Auth users can view funcionarios" ON public.funcionarios;
DROP POLICY IF EXISTS "Auth users can create funcionarios" ON public.funcionarios;
DROP POLICY IF EXISTS "Auth users can update funcionarios" ON public.funcionarios;
DROP POLICY IF EXISTS "Auth users can delete funcionarios" ON public.funcionarios;

CREATE POLICY "Users can view own funcionarios" ON public.funcionarios FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own funcionarios" ON public.funcionarios FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own funcionarios" ON public.funcionarios FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own funcionarios" ON public.funcionarios FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- crm_leads
DROP POLICY IF EXISTS "Authenticated users can view crm_leads" ON public.crm_leads;
DROP POLICY IF EXISTS "Authenticated users can create crm_leads" ON public.crm_leads;
DROP POLICY IF EXISTS "Authenticated users can update crm_leads" ON public.crm_leads;
DROP POLICY IF EXISTS "Authenticated users can delete crm_leads" ON public.crm_leads;

CREATE POLICY "Users can view own crm_leads" ON public.crm_leads FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own crm_leads" ON public.crm_leads FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own crm_leads" ON public.crm_leads FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own crm_leads" ON public.crm_leads FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- configuracoes
DROP POLICY IF EXISTS "Authenticated users can view configuracoes" ON public.configuracoes;
DROP POLICY IF EXISTS "Authenticated users can create configuracoes" ON public.configuracoes;
DROP POLICY IF EXISTS "Authenticated users can update configuracoes" ON public.configuracoes;
DROP POLICY IF EXISTS "Authenticated users can delete configuracoes" ON public.configuracoes;

CREATE POLICY "Users can view own configuracoes" ON public.configuracoes FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own configuracoes" ON public.configuracoes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own configuracoes" ON public.configuracoes FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own configuracoes" ON public.configuracoes FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- administradores
DROP POLICY IF EXISTS "Auth users can view administradores" ON public.administradores;
DROP POLICY IF EXISTS "Auth users can create administradores" ON public.administradores;
DROP POLICY IF EXISTS "Auth users can update administradores" ON public.administradores;
DROP POLICY IF EXISTS "Auth users can delete administradores" ON public.administradores;

CREATE POLICY "Admins can view administradores" ON public.administradores FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can create administradores" ON public.administradores FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update administradores" ON public.administradores FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete administradores" ON public.administradores FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- orcamento_historico
DROP POLICY IF EXISTS "Auth users can view orcamento_historico" ON public.orcamento_historico;
DROP POLICY IF EXISTS "Auth users can create orcamento_historico" ON public.orcamento_historico;

CREATE POLICY "Users can view own orcamento_historico" ON public.orcamento_historico FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own orcamento_historico" ON public.orcamento_historico FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- pagamentos: scope via pedido ownership
DROP POLICY IF EXISTS "Authenticated users can view pagamentos" ON public.pagamentos;
DROP POLICY IF EXISTS "Authenticated users can create pagamentos" ON public.pagamentos;
DROP POLICY IF EXISTS "Authenticated users can update pagamentos" ON public.pagamentos;
DROP POLICY IF EXISTS "Authenticated users can delete pagamentos" ON public.pagamentos;

CREATE POLICY "Users can view own pagamentos" ON public.pagamentos FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pagamentos.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can create own pagamentos" ON public.pagamentos FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pagamentos.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can update own pagamentos" ON public.pagamentos FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pagamentos.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can delete own pagamentos" ON public.pagamentos FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pagamentos.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

-- pedido_checklists: scope via pedido
DROP POLICY IF EXISTS "Authenticated users can view pedido_checklists" ON public.pedido_checklists;
DROP POLICY IF EXISTS "Authenticated users can create pedido_checklists" ON public.pedido_checklists;
DROP POLICY IF EXISTS "Authenticated users can update pedido_checklists" ON public.pedido_checklists;
DROP POLICY IF EXISTS "Authenticated users can delete pedido_checklists" ON public.pedido_checklists;

CREATE POLICY "Users can view own pedido_checklists" ON public.pedido_checklists FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_checklists.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can create own pedido_checklists" ON public.pedido_checklists FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_checklists.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can update own pedido_checklists" ON public.pedido_checklists FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_checklists.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can delete own pedido_checklists" ON public.pedido_checklists FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_checklists.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

-- pedido_checklist_fotos: scope via pedido
DROP POLICY IF EXISTS "Auth users can view pedido_checklist_fotos" ON public.pedido_checklist_fotos;
DROP POLICY IF EXISTS "Auth users can create pedido_checklist_fotos" ON public.pedido_checklist_fotos;
DROP POLICY IF EXISTS "Auth users can delete pedido_checklist_fotos" ON public.pedido_checklist_fotos;

CREATE POLICY "Users can view own pedido_checklist_fotos" ON public.pedido_checklist_fotos FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_checklist_fotos.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can create own pedido_checklist_fotos" ON public.pedido_checklist_fotos FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_checklist_fotos.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can delete own pedido_checklist_fotos" ON public.pedido_checklist_fotos FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_checklist_fotos.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

-- pedido_custom_etapas: scope via pedido
DROP POLICY IF EXISTS "Auth users can view pedido_custom_etapas" ON public.pedido_custom_etapas;
DROP POLICY IF EXISTS "Auth users can create pedido_custom_etapas" ON public.pedido_custom_etapas;
DROP POLICY IF EXISTS "Auth users can update pedido_custom_etapas" ON public.pedido_custom_etapas;
DROP POLICY IF EXISTS "Auth users can delete pedido_custom_etapas" ON public.pedido_custom_etapas;

CREATE POLICY "Users can view own pedido_custom_etapas" ON public.pedido_custom_etapas FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_custom_etapas.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can create own pedido_custom_etapas" ON public.pedido_custom_etapas FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_custom_etapas.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can update own pedido_custom_etapas" ON public.pedido_custom_etapas FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_custom_etapas.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can delete own pedido_custom_etapas" ON public.pedido_custom_etapas FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_custom_etapas.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

-- pedido_custom_items: scope via etapa → pedido
DROP POLICY IF EXISTS "Auth users can view pedido_custom_items" ON public.pedido_custom_items;
DROP POLICY IF EXISTS "Auth users can create pedido_custom_items" ON public.pedido_custom_items;
DROP POLICY IF EXISTS "Auth users can update pedido_custom_items" ON public.pedido_custom_items;
DROP POLICY IF EXISTS "Auth users can delete pedido_custom_items" ON public.pedido_custom_items;

CREATE POLICY "Users can view own pedido_custom_items" ON public.pedido_custom_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.pedido_custom_etapas e JOIN public.pedidos p ON p.id = e.pedido_id WHERE e.id = pedido_custom_items.etapa_id AND (p.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can create own pedido_custom_items" ON public.pedido_custom_items FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.pedido_custom_etapas e JOIN public.pedidos p ON p.id = e.pedido_id WHERE e.id = pedido_custom_items.etapa_id AND (p.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can update own pedido_custom_items" ON public.pedido_custom_items FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedido_custom_etapas e JOIN public.pedidos p ON p.id = e.pedido_id WHERE e.id = pedido_custom_items.etapa_id AND (p.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can delete own pedido_custom_items" ON public.pedido_custom_items FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedido_custom_etapas e JOIN public.pedidos p ON p.id = e.pedido_id WHERE e.id = pedido_custom_items.etapa_id AND (p.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

-- pedido_etapas: scope via pedido
DROP POLICY IF EXISTS "Authenticated users can view pedido_etapas" ON public.pedido_etapas;
DROP POLICY IF EXISTS "Authenticated users can create pedido_etapas" ON public.pedido_etapas;

CREATE POLICY "Users can view own pedido_etapas" ON public.pedido_etapas FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_etapas.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can create own pedido_etapas" ON public.pedido_etapas FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_etapas.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

-- Update create_conta_on_pedido trigger to propagate user_id
CREATE OR REPLACE FUNCTION public.create_conta_on_pedido()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.contas_financeiras (cliente, descricao, valor, vencimento, status, tipo, user_id)
  VALUES (
    NEW.cliente,
    'Pedido #' || NEW.pedido_num,
    NEW.valor,
    COALESCE(NEW.previsao, CURRENT_DATE + INTERVAL '30 days'),
    'pendente',
    'receber',
    NEW.user_id
  );
  RETURN NEW;
END;
$$;
