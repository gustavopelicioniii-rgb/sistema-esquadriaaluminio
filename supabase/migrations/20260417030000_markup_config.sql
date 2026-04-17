-- Markup configuration per product line
CREATE TABLE IF NOT EXISTS markup_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_line_id TEXT,
  product_type TEXT,
  margem_percent DECIMAL(5,2) DEFAULT 100,
  custo_base_m2 DECIMAL(10,2),
  obs TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client portal tokens for tracking
CREATE TABLE IF NOT EXISTS client_portal_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_email TEXT NOT NULL,
  client_phone TEXT,
  token TEXT UNIQUE NOT NULL,
  orcamento_id UUID REFERENCES orcamentos(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stock/Inventory management
CREATE TABLE IF NOT EXISTS estoque_movimentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id TEXT NOT NULL,
  tipo_movimento TEXT NOT NULL CHECK (tipo_movimento IN ('entrada', 'saida', 'ajuste')),
  quantidade DECIMAL(10,3) NOT NULL,
  observacao TEXT,
  pedido_id UUID REFERENCES pedidos(id) ON DELETE SET NULL,
  user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Real-time tracking events
CREATE TABLE IF NOT EXISTS tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  etapa TEXT NOT NULL,
  status TEXT NOT NULL,
  observacao TEXT,
  notify_client BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_client_tokens_token ON client_portal_tokens(token);
CREATE INDEX IF NOT EXISTS idx_client_tokens_email ON client_portal_tokens(client_email);
CREATE INDEX IF NOT EXISTS idx_estoque_movimentos_produto ON estoque_movimentos(produto_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_pedido ON tracking_events(pedido_id);
