
CREATE OR REPLACE FUNCTION public.sync_conta_financeira_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_pedido_num integer;
  v_pedido_valor numeric;
  v_total_pago numeric;
  v_pedido_id uuid;
BEGIN
  -- Get the pedido_id depending on operation
  IF TG_OP = 'DELETE' THEN
    v_pedido_id := OLD.pedido_id;
  ELSE
    v_pedido_id := NEW.pedido_id;
  END IF;

  -- Get pedido info
  SELECT pedido_num, valor INTO v_pedido_num, v_pedido_valor
  FROM public.pedidos WHERE id = v_pedido_id;

  -- Sum all payments for this pedido
  SELECT COALESCE(SUM(valor), 0) INTO v_total_pago
  FROM public.pagamentos WHERE pedido_id = v_pedido_id;

  -- Update the corresponding conta_financeira
  IF v_total_pago >= v_pedido_valor THEN
    UPDATE public.contas_financeiras
    SET status = 'pago'
    WHERE descricao = 'Pedido #' || v_pedido_num AND tipo = 'receber';
  ELSE
    UPDATE public.contas_financeiras
    SET status = 'pendente'
    WHERE descricao = 'Pedido #' || v_pedido_num AND tipo = 'receber';
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER sync_pagamento_to_financeiro
  AFTER INSERT OR UPDATE OR DELETE ON public.pagamentos
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_conta_financeira_status();
