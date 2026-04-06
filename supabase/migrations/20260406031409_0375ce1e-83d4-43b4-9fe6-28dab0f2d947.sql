
CREATE TABLE public.funcionarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL DEFAULT '',
  telefone TEXT DEFAULT '',
  setor TEXT NOT NULL DEFAULT 'Produção',
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth users can view funcionarios" ON public.funcionarios FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can create funcionarios" ON public.funcionarios FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update funcionarios" ON public.funcionarios FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth users can delete funcionarios" ON public.funcionarios FOR DELETE TO authenticated USING (true);

CREATE TABLE public.administradores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'Admin',
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.administradores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth users can view administradores" ON public.administradores FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can create administradores" ON public.administradores FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update administradores" ON public.administradores FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth users can delete administradores" ON public.administradores FOR DELETE TO authenticated USING (true);
