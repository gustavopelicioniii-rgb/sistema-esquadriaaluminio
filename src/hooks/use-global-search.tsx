import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SearchResult {
  id: string;
  label: string;
  detail?: string;
  type: 'Cliente' | 'Orçamento' | 'Pedido' | 'Produto' | 'Estoque';
  url: string;
}

export function useGlobalSearch(query: string) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) {
      setResults([]);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);

      const [clientesRes, orcamentosRes, pedidosRes, produtosRes, estoqueRes] = await Promise.all([
        supabase.from('clientes').select('id, nome, telefone').ilike('nome', `%${q}%`).limit(5),
        supabase
          .from('orcamentos')
          .select('id, numero, cliente, valor')
          .or(`numero.ilike.%${q}%,cliente.ilike.%${q}%`)
          .limit(5),
        supabase
          .from('pedidos')
          .select('id, pedido_num, cliente, status')
          .or(`cliente.ilike.%${q}%,pedido_num::text.ilike.%${q}%`)
          .limit(5),
        supabase
          .from('produtos')
          .select('id, nome, codigo, preco')
          .or(`nome.ilike.%${q}%,codigo.ilike.%${q}%`)
          .limit(5),
        supabase
          .from('estoque')
          .select('id, produto, codigo, quantidade')
          .or(`produto.ilike.%${q}%,codigo.ilike.%${q}%`)
          .limit(5),
      ]);

      if (cancelled) return;

      const items: SearchResult[] = [];

      (clientesRes.data ?? []).forEach(c =>
        items.push({
          id: c.id,
          label: c.nome,
          detail: c.telefone || undefined,
          type: 'Cliente',
          url: '/clientes',
        })
      );
      (orcamentosRes.data ?? []).forEach(o =>
        items.push({
          id: o.id,
          label: `#${o.numero} - ${o.cliente}`,
          detail: `R$ ${Number(o.valor).toLocaleString('pt-BR')}`,
          type: 'Orçamento',
          url: '/orcamentos',
        })
      );
      (pedidosRes.data ?? []).forEach(p =>
        items.push({
          id: p.id,
          label: `Pedido #${p.pedido_num} - ${p.cliente}`,
          detail: p.status,
          type: 'Pedido',
          url: '/producao',
        })
      );
      (produtosRes.data ?? []).forEach(p =>
        items.push({
          id: p.id,
          label: `${p.codigo} - ${p.nome}`,
          detail: `R$ ${Number(p.preco).toLocaleString('pt-BR')}`,
          type: 'Produto',
          url: '/produtos',
        })
      );
      (estoqueRes.data ?? []).forEach(e =>
        items.push({
          id: e.id,
          label: `${e.codigo} - ${e.produto}`,
          detail: `${e.quantidade} un.`,
          type: 'Estoque',
          url: '/estoque',
        })
      );

      setResults(items);
      setLoading(false);
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  return { results, loading };
}
