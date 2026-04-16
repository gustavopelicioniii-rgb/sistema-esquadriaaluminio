-- ================================================
-- ALUFLOW - SCHEMA LIMPO
-- Execute TODO este arquivo no Supabase Dashboard
-- ================================================

-- 1. TABLES (todas as tabelas necessárias)
CREATE TABLE IF NOT EXISTS public.api_integracoes (
CREATE TABLE IF NOT EXISTS public.regras_componentes_customizadas (
CREATE TABLE IF NOT EXISTS public.regras_corte_customizadas (
CREATE TABLE IF NOT EXISTS public.regras_vidro_customizadas (
CREATE TABLE IF NOT EXISTS public.tipologias_customizadas (
CREATE TABLE public.administradores (
CREATE TABLE public.agenda (
CREATE TABLE public.api_integracoes (
CREATE TABLE public.assinaturas (
CREATE TABLE public.clientes (
CREATE TABLE public.configuracoes (
CREATE TABLE public.contas_financeiras (
CREATE TABLE public.crm_leads (
CREATE TABLE public.estoque (
CREATE TABLE public.funcionarios (
CREATE TABLE public.notification_reads (
CREATE TABLE public.orcamento_historico (
CREATE TABLE public.orcamentos (
CREATE TABLE public.pagamentos (
CREATE TABLE public.pedido_checklist_fotos (
CREATE TABLE public.pedido_checklists (
CREATE TABLE public.pedido_custom_etapas (
CREATE TABLE public.pedido_custom_items (
CREATE TABLE public.pedido_etapas (
CREATE TABLE public.pedidos (
CREATE TABLE public.planos_corte (
CREATE TABLE public.produtos (
CREATE TABLE public.projetos_vidro (
CREATE TABLE public.regras_componentes_customizadas (
CREATE TABLE public.regras_corte_customizadas (
CREATE TABLE public.regras_vidro_customizadas (
CREATE TABLE public.tipologias_customizadas (
CREATE TABLE public.user_roles (
CREATE TABLE public.vidro_itens (

-- 2. FUNCTIONS (apenas as essenciais)
CREATE OR REPLACE FUNCTION public.auto_create_plano_corte()
CREATE OR REPLACE FUNCTION public.create_conta_on_pedido()
CREATE OR REPLACE FUNCTION public.handle_new_user()
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
CREATE OR REPLACE FUNCTION public.sync_conta_financeira_status()
CREATE OR REPLACE FUNCTION public.update_updated_at_column()

-- 3. TRIGGERS (apenas uma vez)
CREATE TRIGGER create_conta_on_pedido_trigger
CREATE TRIGGER on_auth_user_created
CREATE TRIGGER on_auth_user_created_subscription
CREATE TRIGGER on_pedido_created
CREATE TRIGGER sync_pagamento_to_financeiro
CREATE TRIGGER trg_auto_plano_corte
CREATE TRIGGER update_administradores_updated_at BEFORE UPDATE ON public.administradores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_agenda_updated_at BEFORE UPDATE ON public.agenda FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_api_integracoes_updated_at
CREATE TRIGGER update_assinaturas_updated_at
CREATE TRIGGER update_assinaturas_updated_at BEFORE UPDATE ON public.assinaturas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON public.clientes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_configuracoes_updated_at BEFORE UPDATE ON public.configuracoes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contas_financeiras_updated_at BEFORE UPDATE ON public.contas_financeiras FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_crm_leads_updated_at BEFORE UPDATE ON public.crm_leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_estoque_updated_at BEFORE UPDATE ON public.estoque FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_funcionarios_updated_at BEFORE UPDATE ON public.funcionarios FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orcamentos_updated_at BEFORE UPDATE ON public.orcamentos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pagamentos_updated_at BEFORE UPDATE ON public.pagamentos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pagamentos_updated_at BEFORE UPDATE ON public.pagamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pedido_checklists_updated_at BEFORE UPDATE ON public.pedido_checklists FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON public.pedidos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON public.pedidos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE ON public.produtos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE ON public.produtos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projetos_vidro_updated_at BEFORE UPDATE ON public.projetos_vidro FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projetos_vidro_updated_at BEFORE UPDATE ON public.projetos_vidro FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tipologias_customizadas_updated_at

-- 4. RLS POLICIES
ALTER TABLE public.administradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_integracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assinaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contas_financeiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orcamento_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orcamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedido_checklist_fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedido_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedido_custom_etapas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedido_custom_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedido_etapas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planos_corte ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projetos_vidro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regras_componentes_customizadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regras_corte_customizadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regras_vidro_customizadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipologias_customizadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vidro_itens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can create administradores" ON public.administradores FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete administradores" ON public.administradores FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage all subscriptions"
CREATE POLICY "Admins can manage roles"
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update administradores" ON public.administradores FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view administradores" ON public.administradores FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view all roles"
CREATE POLICY "Anon can delete agenda" ON public.agenda FOR DELETE TO anon USING (true);
CREATE POLICY "Anon can delete clientes" ON public.clientes FOR DELETE TO anon USING (true);
CREATE POLICY "Anon can delete configuracoes" ON public.configuracoes FOR DELETE TO anon USING (true);
CREATE POLICY "Anon can delete estoque" ON public.estoque FOR DELETE TO anon USING (true);
CREATE POLICY "Anon can delete orcamentos" ON public.orcamentos FOR DELETE TO anon USING (true);
CREATE POLICY "Anon can insert agenda" ON public.agenda FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can insert clientes" ON public.clientes FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can insert configuracoes" ON public.configuracoes FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can insert estoque" ON public.estoque FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can insert orcamentos" ON public.orcamentos FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update agenda" ON public.agenda FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can update clientes" ON public.clientes FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can update configuracoes" ON public.configuracoes FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can update estoque" ON public.estoque FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can update orcamentos" ON public.orcamentos FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon users can view agenda" ON public.agenda FOR SELECT TO anon USING (true);
CREATE POLICY "Anon users can view clientes" ON public.clientes FOR SELECT TO anon USING (true);
CREATE POLICY "Anon users can view configuracoes" ON public.configuracoes FOR SELECT TO anon USING (true);
CREATE POLICY "Anon users can view estoque" ON public.estoque FOR SELECT TO anon USING (true);
CREATE POLICY "Anon users can view orcamentos" ON public.orcamentos FOR SELECT TO anon USING (true);
CREATE POLICY "Anyone can view checklist fotos" ON storage.objects FOR SELECT USING (bucket_id = 'checklist-fotos');
CREATE POLICY "Anyone can view company assets" ON storage.objects FOR SELECT TO public USING (bucket_id = 'company-assets');
CREATE POLICY "Auth users can create administradores" ON public.administradores FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can create funcionarios" ON public.funcionarios FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can create orcamento_historico"
CREATE POLICY "Auth users can create pedido_checklist_fotos" ON public.pedido_checklist_fotos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can create pedido_custom_etapas" ON public.pedido_custom_etapas FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can create pedido_custom_items" ON public.pedido_custom_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can delete administradores" ON public.administradores FOR DELETE TO authenticated USING (true);
CREATE POLICY "Auth users can delete checklist fotos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'checklist-fotos');
CREATE POLICY "Auth users can delete company assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'company-assets');
CREATE POLICY "Auth users can delete funcionarios" ON public.funcionarios FOR DELETE TO authenticated USING (true);
CREATE POLICY "Auth users can delete pedido_checklist_fotos" ON public.pedido_checklist_fotos FOR DELETE TO authenticated USING (true);
CREATE POLICY "Auth users can delete pedido_custom_etapas" ON public.pedido_custom_etapas FOR DELETE TO authenticated USING (true);
CREATE POLICY "Auth users can delete pedido_custom_items" ON public.pedido_custom_items FOR DELETE TO authenticated USING (true);
CREATE POLICY "Auth users can update administradores" ON public.administradores FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth users can update company assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'company-assets');
CREATE POLICY "Auth users can update funcionarios" ON public.funcionarios FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth users can update pedido_custom_etapas" ON public.pedido_custom_etapas FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth users can update pedido_custom_items" ON public.pedido_custom_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth users can upload checklist fotos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'checklist-fotos');
CREATE POLICY "Auth users can upload company assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'company-assets');
CREATE POLICY "Auth users can view administradores" ON public.administradores FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can view funcionarios" ON public.funcionarios FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can view orcamento_historico"
CREATE POLICY "Auth users can view pedido_checklist_fotos" ON public.pedido_checklist_fotos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can view pedido_custom_etapas" ON public.pedido_custom_etapas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can view pedido_custom_items" ON public.pedido_custom_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create agenda" ON public.agenda FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can create clientes" ON public.clientes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can create configuracoes" ON public.configuracoes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can create contas_financeiras" ON public.contas_financeiras FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can create crm_leads" ON public.crm_leads FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can create estoque" ON public.estoque FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can create orcamentos" ON public.orcamentos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can create pagamentos" ON public.pagamentos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can create pedido_checklists" ON public.pedido_checklists FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can create pedido_etapas" ON public.pedido_etapas FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can create pedidos" ON public.pedidos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can create produtos" ON public.produtos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can delete agenda" ON public.agenda FOR DELETE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete clientes" ON public.clientes FOR DELETE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete configuracoes" ON public.configuracoes FOR DELETE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete contas_financeiras" ON public.contas_financeiras FOR DELETE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete crm_leads" ON public.crm_leads FOR DELETE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete estoque" ON public.estoque FOR DELETE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete orcamentos" ON public.orcamentos FOR DELETE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete pagamentos" ON public.pagamentos FOR DELETE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete pedido_checklists" ON public.pedido_checklists FOR DELETE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete pedidos" ON public.pedidos FOR DELETE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete produtos" ON public.produtos FOR DELETE TO authenticated USING (true);
CREATE POLICY "Authenticated users can update agenda" ON public.agenda FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can update clientes" ON public.clientes FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can update configuracoes" ON public.configuracoes FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can update contas_financeiras" ON public.contas_financeiras FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can update crm_leads" ON public.crm_leads FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can update estoque" ON public.estoque FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can update orcamentos" ON public.orcamentos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can update pagamentos" ON public.pagamentos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can update pedido_checklists" ON public.pedido_checklists FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can update pedidos" ON public.pedidos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can update produtos" ON public.produtos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can view agenda" ON public.agenda FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view clientes" ON public.clientes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view configuracoes" ON public.configuracoes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view contas_financeiras" ON public.contas_financeiras FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view crm_leads" ON public.crm_leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view estoque" ON public.estoque FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view orcamentos" ON public.orcamentos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view pagamentos" ON public.pagamentos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view pedido_checklists" ON public.pedido_checklists FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view pedido_etapas" ON public.pedido_etapas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view pedidos" ON public.pedidos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view produtos" ON public.produtos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can insert orcamento_historico"
CREATE POLICY "Only admins can insert roles"
CREATE POLICY "Owner can delete checklist photos"
CREATE POLICY "Owner can delete company assets"
CREATE POLICY "Owner can manage checklist photos" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'checklist-fotos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Owner can manage company assets" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'company-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Owner can update checklist photos"
CREATE POLICY "Owner can update company assets"
CREATE POLICY "Owner can upload checklist photos"
CREATE POLICY "Owner can upload company assets"
CREATE POLICY "Owner can view checklist photos"
CREATE POLICY "Owner can view company assets"
CREATE POLICY "Users can create api_integracoes" ON public.api_integracoes
CREATE POLICY "Users can create custom component rules"
CREATE POLICY "Users can create custom cut rules" ON public.regras_corte_customizadas
CREATE POLICY "Users can create custom glass rules" ON public.regras_vidro_customizadas
CREATE POLICY "Users can create custom typologies" ON public.tipologias_customizadas FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can create own agenda" ON public.agenda FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can create own clientes" ON public.clientes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can create own configuracoes" ON public.configuracoes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can create own contas_financeiras" ON public.contas_financeiras FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can create own crm_leads" ON public.crm_leads FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can create own estoque" ON public.estoque FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can create own funcionarios" ON public.funcionarios FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can create own notification reads"
CREATE POLICY "Users can create own orcamento_historico"
CREATE POLICY "Users can create own orcamento_historico" ON public.orcamento_historico FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can create own orcamentos" ON public.orcamentos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can create own pagamentos" ON public.pagamentos FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pagamentos.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can create own pedido_checklist_fotos" ON public.pedido_checklist_fotos FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_checklist_fotos.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can create own pedido_checklists" ON public.pedido_checklists FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_checklists.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can create own pedido_custom_etapas" ON public.pedido_custom_etapas FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_custom_etapas.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can create own pedido_custom_items" ON public.pedido_custom_items FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.pedido_custom_etapas e JOIN public.pedidos p ON p.id = e.pedido_id WHERE e.id = pedido_custom_items.etapa_id AND (p.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can create own pedido_etapas" ON public.pedido_etapas FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_etapas.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can create own pedidos" ON public.pedidos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can create own produtos" ON public.produtos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can create own projetos_vidro" ON public.projetos_vidro FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can create own subscription"
CREATE POLICY "Users can create own vidro_itens" ON public.vidro_itens FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.projetos_vidro WHERE id = projeto_id AND user_id = auth.uid()));
CREATE POLICY "Users can create planos_corte" ON public.planos_corte FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can create projetos_vidro" ON public.projetos_vidro FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can create vidro_itens" ON public.vidro_itens FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.projetos_vidro WHERE id = projeto_id AND user_id = auth.uid()));
CREATE POLICY "Users can delete api_integracoes" ON public.api_integracoes
CREATE POLICY "Users can delete own agenda" ON public.agenda FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own clientes" ON public.clientes FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own configuracoes" ON public.configuracoes FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own contas_financeiras" ON public.contas_financeiras FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own crm_leads" ON public.crm_leads FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own custom component rules"
CREATE POLICY "Users can delete own custom cut rules" ON public.regras_corte_customizadas
CREATE POLICY "Users can delete own custom glass rules" ON public.regras_vidro_customizadas
CREATE POLICY "Users can delete own custom typologies" ON public.tipologias_customizadas FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own estoque" ON public.estoque FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own funcionarios" ON public.funcionarios FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own notification reads"
CREATE POLICY "Users can delete own orcamentos" ON public.orcamentos FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own pagamentos" ON public.pagamentos FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pagamentos.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can delete own pedido_checklist_fotos" ON public.pedido_checklist_fotos FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_checklist_fotos.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can delete own pedido_checklists" ON public.pedido_checklists FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_checklists.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can delete own pedido_custom_etapas" ON public.pedido_custom_etapas FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_custom_etapas.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can delete own pedido_custom_items" ON public.pedido_custom_items FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedido_custom_etapas e JOIN public.pedidos p ON p.id = e.pedido_id WHERE e.id = pedido_custom_items.etapa_id AND (p.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can delete own pedido_etapas"
CREATE POLICY "Users can delete own pedido_etapas" ON public.pedido_etapas FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_etapas.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can delete own pedidos" ON public.pedidos FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own planos_corte" ON public.planos_corte FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own produtos" ON public.produtos FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own projetos_vidro" ON public.projetos_vidro FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own vidro_itens" ON public.vidro_itens FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.projetos_vidro WHERE id = projeto_id AND user_id = auth.uid()));
CREATE POLICY "Users can manage own subscription" ON public.assinaturas FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update api_integracoes" ON public.api_integracoes
CREATE POLICY "Users can update own agenda" ON public.agenda FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own clientes" ON public.clientes FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own configuracoes" ON public.configuracoes FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own contas_financeiras" ON public.contas_financeiras FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own crm_leads" ON public.crm_leads FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own custom component rules"
CREATE POLICY "Users can update own custom cut rules" ON public.regras_corte_customizadas
CREATE POLICY "Users can update own custom glass rules" ON public.regras_vidro_customizadas
CREATE POLICY "Users can update own custom typologies" ON public.tipologias_customizadas FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own estoque" ON public.estoque FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own funcionarios" ON public.funcionarios FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own orcamentos" ON public.orcamentos FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own pagamentos" ON public.pagamentos FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pagamentos.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can update own pedido_checklists" ON public.pedido_checklists FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_checklists.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can update own pedido_custom_etapas" ON public.pedido_custom_etapas FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_custom_etapas.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can update own pedido_custom_items" ON public.pedido_custom_items FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedido_custom_etapas e JOIN public.pedidos p ON p.id = e.pedido_id WHERE e.id = pedido_custom_items.etapa_id AND (p.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can update own pedido_etapas"
CREATE POLICY "Users can update own pedido_etapas" ON public.pedido_etapas FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_etapas.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can update own pedidos" ON public.pedidos FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own planos_corte" ON public.planos_corte FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own produtos" ON public.produtos FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own projetos_vidro" ON public.projetos_vidro FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscription"
CREATE POLICY "Users can update own vidro_itens" ON public.vidro_itens FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.projetos_vidro WHERE id = projeto_id AND user_id = auth.uid()));
CREATE POLICY "Users can view own agenda" ON public.agenda FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own api_integracoes"
CREATE POLICY "Users can view own api_integracoes" ON public.api_integracoes
CREATE POLICY "Users can view own clientes" ON public.clientes FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own configuracoes" ON public.configuracoes FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own contas_financeiras" ON public.contas_financeiras FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own crm_leads" ON public.crm_leads FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own custom component rules"
CREATE POLICY "Users can view own custom cut rules" ON public.regras_corte_customizadas
CREATE POLICY "Users can view own custom glass rules" ON public.regras_vidro_customizadas
CREATE POLICY "Users can view own custom typologies" ON public.tipologias_customizadas FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own estoque" ON public.estoque FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own funcionarios" ON public.funcionarios FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own notification reads"
CREATE POLICY "Users can view own orcamento_historico" ON public.orcamento_historico FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own orcamentos" ON public.orcamentos FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own pagamentos" ON public.pagamentos FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pagamentos.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can view own pedido_checklist_fotos" ON public.pedido_checklist_fotos FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_checklist_fotos.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can view own pedido_checklists" ON public.pedido_checklists FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_checklists.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can view own pedido_custom_etapas" ON public.pedido_custom_etapas FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_custom_etapas.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can view own pedido_custom_items" ON public.pedido_custom_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.pedido_custom_etapas e JOIN public.pedidos p ON p.id = e.pedido_id WHERE e.id = pedido_custom_items.etapa_id AND (p.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can view own pedido_etapas" ON public.pedido_etapas FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos WHERE pedidos.id = pedido_etapas.pedido_id AND (pedidos.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can view own pedidos" ON public.pedidos FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own planos_corte" ON public.planos_corte FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own produtos" ON public.produtos FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own projetos_vidro" ON public.projetos_vidro FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own subscription"
CREATE POLICY "Users can view own subscription" ON public.assinaturas FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own vidro_itens" ON public.vidro_itens FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.projetos_vidro WHERE id = projeto_id AND user_id = auth.uid()));
CREATE POLICY "Users can view their own roles"
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
