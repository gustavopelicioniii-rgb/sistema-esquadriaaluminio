
CREATE OR REPLACE FUNCTION public.auto_create_plano_corte()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.planos_corte (typology_id, nome, responsavel, largura, altura, quantidade, user_id)
  VALUES (NEW.id, NEW.name, '', 1000, 1000, 1, NEW.user_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_auto_plano_corte
AFTER INSERT ON public.tipologias_customizadas
FOR EACH ROW
EXECUTE FUNCTION public.auto_create_plano_corte();
