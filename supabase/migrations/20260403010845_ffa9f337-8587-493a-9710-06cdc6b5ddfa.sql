CREATE POLICY "Anon users can view clientes" ON public.clientes FOR SELECT TO anon USING (true);
CREATE POLICY "Anon users can view orcamentos" ON public.orcamentos FOR SELECT TO anon USING (true);
CREATE POLICY "Anon users can view estoque" ON public.estoque FOR SELECT TO anon USING (true);
CREATE POLICY "Anon users can view agenda" ON public.agenda FOR SELECT TO anon USING (true);
CREATE POLICY "Anon users can view configuracoes" ON public.configuracoes FOR SELECT TO anon USING (true);

CREATE POLICY "Anon can insert clientes" ON public.clientes FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update clientes" ON public.clientes FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can delete clientes" ON public.clientes FOR DELETE TO anon USING (true);

CREATE POLICY "Anon can insert estoque" ON public.estoque FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update estoque" ON public.estoque FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can delete estoque" ON public.estoque FOR DELETE TO anon USING (true);

CREATE POLICY "Anon can insert agenda" ON public.agenda FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update agenda" ON public.agenda FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can delete agenda" ON public.agenda FOR DELETE TO anon USING (true);

CREATE POLICY "Anon can insert orcamentos" ON public.orcamentos FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update orcamentos" ON public.orcamentos FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can delete orcamentos" ON public.orcamentos FOR DELETE TO anon USING (true);

CREATE POLICY "Anon can insert configuracoes" ON public.configuracoes FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update configuracoes" ON public.configuracoes FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can delete configuracoes" ON public.configuracoes FOR DELETE TO anon USING (true);