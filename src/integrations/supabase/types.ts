// Simplified types - using string instead of enum references
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      administradores: {
        Row: { id: string; user_id: string | null; nome: string; email: string | null; role: string; ativo: boolean; created_at: string; updated_at: string }
        Insert: { id?: string; user_id?: string | null; nome: string; email?: string | null; role?: string; ativo?: boolean; created_at?: string; updated_at?: string }
        Update: { id?: string; user_id?: string | null; nome?: string; email?: string | null; role?: string; ativo?: boolean; created_at?: string; updated_at?: string }
        Relationships: []
      }
      agenda: {
        Row: { id: string; user_id: string | null; titulo: string; data: string; hora: string | null; local: string | null; responsavel: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; user_id?: string | null; titulo: string; data: string; hora?: string | null; local?: string | null; responsavel?: string | null; created_at?: string; updated_at?: string }
        Update: { id?: string; user_id?: string | null; titulo?: string; data?: string; hora?: string | null; local?: string | null; responsavel?: string | null; created_at?: string; updated_at?: string }
        Relationships: []
      }
      api_integracoes: {
        Row: { id: string; user_id: string; nome: string; descricao: string; chave: string; ativa: boolean; created_at: string; updated_at: string }
        Insert: { id?: string; user_id?: string; nome: string; descricao?: string; chave?: string; ativa?: boolean; created_at?: string; updated_at?: string }
        Update: { id?: string; user_id?: string; nome?: string; descricao?: string; chave?: string; ativa?: boolean; created_at?: string; updated_at?: string }
        Relationships: []
      }
      assinaturas: {
        Row: { id: string; user_id: string; plano: string; ativo: boolean; created_at: string; updated_at: string }
        Insert: { id?: string; user_id?: string; plano?: string; ativo?: boolean; created_at?: string; updated_at?: string }
        Update: { id?: string; user_id?: string; plano?: string; ativo?: boolean; created_at?: string; updated_at?: string }
        Relationships: []
      }
      clientes: {
        Row: { id: string; user_id: string | null; nome: string; telefone: string; email: string; endereco: string; cidade: string; orcamentos_count: number; created_at: string; updated_at: string }
        Insert: { id?: string; user_id?: string | null; nome: string; telefone?: string; email?: string; endereco?: string; cidade?: string; orcamentos_count?: number; created_at?: string; updated_at?: string }
        Update: { id?: string; user_id?: string | null; nome?: string; telefone?: string; email?: string; endereco?: string; cidade?: string; orcamentos_count?: number; created_at?: string; updated_at?: string }
        Relationships: []
      }
      configuracoes: {
        Row: { id: string; user_id: string | null; chave: string; valor: string; created_at: string; updated_at: string }
        Insert: { id?: string; user_id?: string | null; chave: string; valor?: string; created_at?: string; updated_at?: string }
        Update: { id?: string; user_id?: string | null; chave?: string; valor?: string; created_at?: string; updated_at?: string }
        Relationships: []
      }
      contas_financeiras: {
        Row: { id: string; user_id: string | null; cliente: string; descricao: string; valor: number; vencimento: string; status: string; tipo: string; created_at: string; updated_at: string }
        Insert: { id?: string; user_id?: string | null; cliente: string; descricao?: string; valor?: number; vencimento?: string; status?: string; tipo?: string; created_at?: string; updated_at?: string }
        Update: { id?: string; user_id?: string | null; cliente?: string; descricao?: string; valor?: number; vencimento?: string; status?: string; tipo?: string; created_at?: string; updated_at?: string }
        Relationships: []
      }
      crm_leads: {
        Row: { id: string; user_id: string | null; nome: string; valor: number; telefone: string; email: string; status: string; observacao: string; follow_up_date: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; user_id?: string | null; nome: string; valor?: number; telefone?: string; email?: string; status?: string; observacao?: string; follow_up_date?: string | null; created_at?: string; updated_at?: string }
        Update: { id?: string; user_id?: string | null; nome?: string; valor?: number; telefone?: string; email?: string; status?: string; observacao?: string; follow_up_date?: string | null; created_at?: string; updated_at?: string }
        Relationships: []
      }
      estoque: {
        Row: { id: string; user_id: string | null; codigo: string; produto: string; quantidade: number; unidade: string; minimo: number; categoria: string; created_at: string; updated_at: string }
        Insert: { id?: string; user_id?: string | null; codigo: string; produto: string; quantidade?: number; unidade?: string; minimo?: number; categoria?: string; created_at?: string; updated_at?: string }
        Update: { id?: string; user_id?: string | null; codigo?: string; produto?: string; quantidade?: number; unidade?: string; minimo?: number; categoria?: string; created_at?: string; updated_at?: string }
        Relationships: []
      }
      funcionarios: {
        Row: { id: string; user_id: string | null; nome: string; cargo: string; telefone: string; email: string; created_at: string; updated_at: string }
        Insert: { id?: string; user_id?: string | null; nome: string; cargo?: string; telefone?: string; email?: string; created_at?: string; updated_at?: string }
        Update: { id?: string; user_id?: string | null; nome?: string; cargo?: string; telefone?: string; email?: string; created_at?: string; updated_at?: string }
        Relationships: []
      }
      notification_reads: {
        Row: { id: string; user_id: string; notification_id: string; read_at: string }
        Insert: { id?: string; user_id?: string; notification_id: string; read_at?: string }
        Update: { id?: string; user_id?: string; notification_id?: string; read_at?: string }
        Relationships: []
      }
      orcamento_historico: {
        Row: { id: string; user_id: string | null; orcamento_id: string; status_anterior: string | null; status_novo: string; created_at: string }
        Insert: { id?: string; user_id?: string | null; orcamento_id: string; status_anterior?: string | null; status_novo: string; created_at?: string }
        Update: { id?: string; user_id?: string | null; orcamento_id?: string; status_anterior?: string | null; status_novo?: string; created_at?: string }
        Relationships: []
      }
      orcamentos: {
        Row: { id: string; user_id: string | null; numero: string; cliente: string; cliente_id: string | null; produto: string; valor: number; status: string; data: string; itens: Json; created_at: string; updated_at: string }
        Insert: { id?: string; user_id?: string | null; numero: string; cliente: string; cliente_id?: string | null; produto: string; valor?: number; status?: string; data?: string; itens?: Json; created_at?: string; updated_at?: string }
        Update: { id?: string; user_id?: string | null; numero?: string; cliente?: string; cliente_id?: string | null; produto?: string; valor?: number; status?: string; data?: string; itens?: Json; created_at?: string; updated_at?: string }
        Relationships: []
      }
      pagamento_status: {
        Row: { id: string; nome: string; cor: string;created_at: string }
        Insert: { id?: string; nome: string; cor?: string; created_at?: string }
        Update: { id?: string; nome?: string; cor?: string; created_at?: string }
        Relationships: []
      }
      pagamentos: {
        Row: { id: string; pedido_id: string; valor: number; data: string; forma: string; observacao: string; created_at: string; updated_at: string }
        Insert: { id?: string; pedido_id: string; valor: number; data: string; forma?: string; observacao?: string; created_at?: string; updated_at?: string }
        Update: { id?: string; pedido_id?: string; valor?: number; data?: string; forma?: string; observacao?: string; created_at?: string; updated_at?: string }
        Relationships: []
      }
      pedido_checklist_fotos: {
        Row: { id: string; pedido_id: string; etapa: string; item_key: string | null; foto_url: string; nome_arquivo: string | null; created_at: string }
        Insert: { id?: string; pedido_id: string; etapa: string; item_key?: string | null; foto_url: string; nome_arquivo?: string | null; created_at?: string }
        Update: { id?: string; pedido_id?: string; etapa?: string; item_key?: string | null; foto_url?: string; nome_arquivo?: string | null; created_at?: string }
        Relationships: []
      }
      pedido_checklists: {
        Row: { id: string; pedido_id: string; etapa: string; item_key: string; checked: boolean; anotacao: string; created_at: string; updated_at: string }
        Insert: { id?: string; pedido_id: string; etapa: string; item_key: string; checked?: boolean; anotacao?: string; created_at?: string; updated_at?: string }
        Update: { id?: string; pedido_id?: string; etapa?: string; item_key?: string; checked?: boolean; anotacao?: string; created_at?: string; updated_at?: string }
        Relationships: []
      }
      pedido_custom_items: {
        Row: { id: string; etapa_id: string; item_key: string; label: string; ordem: number; created_at: string }
        Insert: { id?: string; etapa_id: string; item_key: string; label: string; ordem?: number; created_at?: string }
        Update: { id?: string; etapa_id?: string; item_key?: string; label?: string; ordem?: number; created_at?: string }
        Relationships: []
      }
      pedido_custom_etapas: {
        Row: { id: string; pedido_id: string; etapa_key: string; label: string; ordem: number; created_at: string }
        Insert: { id?: string; pedido_id: string; etapa_key: string; label: string; ordem?: number; created_at?: string }
        Update: { id?: string; pedido_id?: string; etapa_key?: string; label?: string; ordem?: number; created_at?: string }
        Relationships: []
      }
      pedido_etapas: {
        Row: { id: string; pedido_id: string; etapa: string; observacao: string; created_at: string }
        Insert: { id?: string; pedido_id: string; etapa: string; observacao?: string; created_at?: string }
        Update: { id?: string; pedido_id?: string; etapa?: string; observacao?: string; created_at?: string }
        Relationships: []
      }
      pedidos: {
        Row: { id: string; user_id: string | null; cliente_id: string | null; pedido_num: number; cliente: string; endereco: string; telefone: string; vendedor: string; previsao: string | null; valor: number; status: string; dias_restantes: number; etapa: string; etapa_data: string; anotacao: string; created_at: string; updated_at: string }
        Insert: { id?: string; user_id?: string | null; cliente_id?: string | null; pedido_num: number; cliente: string; endereco?: string; telefone?: string; vendedor?: string; previsao?: string | null; valor?: number; status?: string; dias_restantes?: number; etapa?: string; etapa_data?: string; anotacao?: string; created_at?: string; updated_at?: string }
        Update: { id?: string; user_id?: string | null; cliente_id?: string | null; pedido_num?: number; cliente?: string; endereco?: string; telefone?: string; vendedor?: string; previsao?: string | null; valor?: number; status?: string; dias_restantes?: number; etapa?: string; etapa_data?: string; anotacao?: string; created_at?: string; updated_at?: string }
        Relationships: []
      }
      produtos: {
        Row: { id: string; user_id: string | null; codigo: string; nome: string; categoria: string; preco: number; unidade: string; ativo: boolean; created_at: string; updated_at: string }
        Insert: { id?: string; user_id?: string | null; codigo: string; nome: string; categoria?: string; preco?: number; unidade?: string; ativo?: boolean; created_at?: string; updated_at?: string }
        Update: { id?: string; user_id?: string | null; codigo?: string; nome?: string; categoria?: string; preco?: number; unidade?: string; ativo?: boolean; created_at?: string; updated_at?: string }
        Relationships: []
      }
      projetos_vidro: {
        Row: { id: string; user_id: string | null; titulo: string; tipo: string; espessura: string; cor: string; preco_m2: number; area_minima_m2: number; archived: boolean; created_at: string; updated_at: string }
        Insert: { id?: string; user_id?: string | null; titulo: string; tipo?: string; espessura?: string; cor?: string; preco_m2?: number; area_minima_m2?: number; archived?: boolean; created_at?: string; updated_at?: string }
        Update: { id?: string; user_id?: string | null; titulo?: string; tipo?: string; espessura?: string; cor?: string; preco_m2?: number; area_minima_m2?: number; archived?: boolean; created_at?: string; updated_at?: string }
        Relationships: []
      }
      user_roles: {
        Row: { id: string; user_id: string; role: string; created_at: string }
        Insert: { id?: string; user_id: string; role: string; created_at?: string }
        Update: { id?: string; user_id?: string; role?: string; created_at?: string }
        Relationships: []
      }
      vidro_itens: {
        Row: { id: string; projeto_id: string; descricao: string; largura_mm: number; altura_mm: number; quantidade: number; observacao: string; created_at: string }
        Insert: { id?: string; projeto_id: string; descricao: string; largura_mm?: number; altura_mm?: number; quantidade?: number; observacao?: string; created_at?: string }
        Update: { id?: string; projeto_id?: string; descricao?: string; largura_mm?: number; altura_mm?: number; quantidade?: number; observacao?: string; created_at?: string }
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}

      // Custom tables for features
      tipologias_customizadas: {
        Row: { id: string; product_line_id: string; name: string; category: string; subcategory: string | null; num_folhas: number; has_veneziana: boolean; has_bandeira: boolean; notes: string | null; active: boolean; min_width_mm: number | null; max_width_mm: number | null; min_height_mm: number | null; max_height_mm: number | null; created_at: string; updated_at: string }
        Insert: { id?: string; product_line_id: string; name: string; category: string; subcategory?: string | null; num_folhas?: number; has_veneziana?: boolean; has_bandeira?: boolean; notes?: string | null; active?: boolean; min_width_mm?: number | null; max_width_mm?: number | null; min_height_mm?: number | null; max_height_mm?: number | null; created_at?: string; updated_at?: string }
        Update: { id?: string; product_line_id?: string; name?: string; category?: string; subcategory?: string | null; num_folhas?: number; has_veneziana?: boolean; has_bandeira?: boolean; notes?: string | null; active?: boolean; min_width_mm?: number | null; max_width_mm?: number | null; min_height_mm?: number | null; max_height_mm?: number | null; created_at?: string; updated_at?: string }
        Relationships: []
      }
      regras_corte_customizadas: {
        Row: { id: string; typology_id: string; profile_id: string; piece_name: string; piece_function: string; reference_dimension: string; coefficient: number; constant_mm: number; fixed_value_mm: number | null; cut_angle_left: number; cut_angle_right: number; quantity_formula: string; sort_order: number; notes: string | null; created_at: string }
        Insert: { id?: string; typology_id: string; profile_id: string; piece_name: string; piece_function?: string; reference_dimension?: string; coefficient?: number; constant_mm?: number; fixed_value_mm?: number | null; cut_angle_left?: number; cut_angle_right?: number; quantity_formula?: string; sort_order?: number; notes?: string | null; created_at?: string }
        Update: { id?: string; typology_id?: string; profile_id?: string; piece_name?: string; piece_function?: string; reference_dimension?: string; coefficient?: number; constant_mm?: number; fixed_value_mm?: number | null; cut_angle_left?: number; cut_angle_right?: number; quantity_formula?: string; sort_order?: number; notes?: string | null; created_at?: string }
        Relationships: []
      }
      regras_vidro_customizadas: {
        Row: { id: string; typology_id: string; glass_name: string; width_reference: string; width_constant_mm: number; height_reference: string; height_constant_mm: number; quantity: number; glass_type: string | null; min_thickness_mm: number | null; max_thickness_mm: number | null; created_at: string }
        Insert: { id?: string; typology_id: string; glass_name: string; width_reference?: string; width_constant_mm?: number; height_reference?: string; height_constant_mm?: number; quantity?: number; glass_type?: string | null; min_thickness_mm?: number | null; max_thickness_mm?: number | null; created_at?: string }
        Update: { id?: string; typology_id?: string; glass_name?: string; width_reference?: string; width_constant_mm?: number; height_reference?: string; height_constant_mm?: number; quantity?: number; glass_type?: string | null; min_thickness_mm?: number | null; max_thickness_mm?: number | null; created_at?: string }
        Relationships: []
      }
      componentes_customizados: {
        Row: { id: string; typology_id: string; component_name: string; component_code: string | null; component_type: string; quantity_formula: string; unit: string; length_reference: string | null; length_constant_mm: number | null; created_at: string }
        Insert: { id?: string; typology_id: string; component_name: string; component_code?: string | null; component_type?: string; quantity_formula?: string; unit?: string; length_reference?: string | null; length_constant_mm?: number | null; created_at?: string }
        Update: { id?: string; typology_id?: string; component_name?: string; component_code?: string | null; component_type?: string; quantity_formula?: string; unit?: string; length_reference?: string | null; length_constant_mm?: number | null; created_at?: string }
        Relationships: []
      }
      markup_config: {
        Row: { id: string; product_line_id: string | null; product_type: string | null; margem_percent: number; custo_base_m2: number | null; obs: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; product_line_id?: string | null; product_type?: string | null; margem_percent?: number; custo_base_m2?: number | null; obs?: string | null; created_at?: string; updated_at?: string }
        Update: { id?: string; product_line_id?: string | null; product_type?: string | null; margem_percent?: number; custo_base_m2?: number | null; obs?: string | null; created_at?: string; updated_at?: string }
        Relationships: []
      }
      client_portal_tokens: {
        Row: { id: string; client_email: string; client_phone: string | null; token: string; orcamento_id: string | null; expires_at: string | null; created_at: string }
        Insert: { id?: string; client_email: string; client_phone?: string | null; token: string; orcamento_id?: string | null; expires_at?: string | null; created_at?: string }
        Update: { id?: string; client_email?: string; client_phone?: string | null; token?: string; orcamento_id?: string | null; expires_at?: string | null; created_at?: string }
        Relationships: []
      }
      estoque_movimentos: {
        Row: { id: string; produto_id: string; tipo_movimento: string; quantidade: number; observacao: string | null; pedido_id: string | null; user_id: string | null; created_at: string }
        Insert: { id?: string; produto_id: string; tipo_movimento: string; quantidade: number; observacao?: string | null; pedido_id?: string | null; user_id?: string | null; created_at?: string }
        Update: { id?: string; produto_id?: string; tipo_movimento?: string; quantidade?: number; observacao?: string | null; pedido_id?: string | null; user_id?: string | null; created_at?: string }
        Relationships: []
      }
      tracking_events: {
        Row: { id: string; pedido_id: string | null; etapa: string; status: string; observacao: string | null; notify_client: boolean; created_at: string }
        Insert: { id?: string; pedido_id?: string | null; etapa: string; status: string; observacao?: string | null; notify_client?: boolean; created_at?: string }
        Update: { id?: string; pedido_id?: string | null; etapa?: string; status?: string; observacao?: string | null; notify_client?: boolean; created_at?: string }
        Relationships: []
      }
