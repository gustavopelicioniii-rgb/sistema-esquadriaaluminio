
CREATE OR REPLACE FUNCTION public.create_conta_on_pedido()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.contas_financeiras (cliente, descricao, valor, vencimento, status, tipo)
  VALUES (
    NEW.cliente,
    'Pedido #' || NEW.pedido_num,
    NEW.valor,
    COALESCE(NEW.previsao, CURRENT_DATE + INTERVAL '30 days'),
    'pendente',
    'receber'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_pedido_created
  AFTER INSERT ON public.pedidos
  FOR EACH ROW
  EXECUTE FUNCTION public.create_conta_on_pedido();
