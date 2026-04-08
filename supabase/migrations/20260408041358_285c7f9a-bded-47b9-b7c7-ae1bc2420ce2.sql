
ALTER TABLE public.vidro_itens ADD COLUMN observacao text DEFAULT '';
ALTER TABLE public.projetos_vidro ADD COLUMN area_minima_m2 numeric NOT NULL DEFAULT 0;
