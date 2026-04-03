export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agenda: {
        Row: {
          created_at: string
          data: string
          hora: string | null
          id: string
          local: string | null
          responsavel: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data: string
          hora?: string | null
          id?: string
          local?: string | null
          responsavel?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: string
          hora?: string | null
          id?: string
          local?: string | null
          responsavel?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          cidade: string | null
          created_at: string
          email: string | null
          endereco: string | null
          id: string
          nome: string
          orcamentos_count: number
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cidade?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome: string
          orcamentos_count?: number
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cidade?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          orcamentos_count?: number
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      configuracoes: {
        Row: {
          chave: string
          created_at: string
          id: string
          updated_at: string
          valor: string
        }
        Insert: {
          chave: string
          created_at?: string
          id?: string
          updated_at?: string
          valor?: string
        }
        Update: {
          chave?: string
          created_at?: string
          id?: string
          updated_at?: string
          valor?: string
        }
        Relationships: []
      }
      contas_financeiras: {
        Row: {
          cliente: string
          created_at: string
          descricao: string
          id: string
          status: string
          tipo: string
          updated_at: string
          valor: number
          vencimento: string
        }
        Insert: {
          cliente: string
          created_at?: string
          descricao?: string
          id?: string
          status?: string
          tipo?: string
          updated_at?: string
          valor?: number
          vencimento?: string
        }
        Update: {
          cliente?: string
          created_at?: string
          descricao?: string
          id?: string
          status?: string
          tipo?: string
          updated_at?: string
          valor?: number
          vencimento?: string
        }
        Relationships: []
      }
      crm_leads: {
        Row: {
          created_at: string
          email: string | null
          follow_up_date: string | null
          id: string
          nome: string
          observacao: string | null
          status: string
          telefone: string | null
          updated_at: string
          valor: number
        }
        Insert: {
          created_at?: string
          email?: string | null
          follow_up_date?: string | null
          id?: string
          nome: string
          observacao?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
          valor?: number
        }
        Update: {
          created_at?: string
          email?: string | null
          follow_up_date?: string | null
          id?: string
          nome?: string
          observacao?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
          valor?: number
        }
        Relationships: []
      }
      estoque: {
        Row: {
          categoria: string
          codigo: string
          created_at: string
          id: string
          minimo: number
          produto: string
          quantidade: number
          unidade: string
          updated_at: string
        }
        Insert: {
          categoria?: string
          codigo: string
          created_at?: string
          id?: string
          minimo?: number
          produto: string
          quantidade?: number
          unidade?: string
          updated_at?: string
        }
        Update: {
          categoria?: string
          codigo?: string
          created_at?: string
          id?: string
          minimo?: number
          produto?: string
          quantidade?: number
          unidade?: string
          updated_at?: string
        }
        Relationships: []
      }
      orcamentos: {
        Row: {
          cliente: string
          created_at: string
          data: string
          id: string
          itens: Json
          numero: string
          produto: string
          status: string
          updated_at: string
          valor: number
        }
        Insert: {
          cliente: string
          created_at?: string
          data?: string
          id?: string
          itens?: Json
          numero: string
          produto: string
          status?: string
          updated_at?: string
          valor?: number
        }
        Update: {
          cliente?: string
          created_at?: string
          data?: string
          id?: string
          itens?: Json
          numero?: string
          produto?: string
          status?: string
          updated_at?: string
          valor?: number
        }
        Relationships: []
      }
      pagamentos: {
        Row: {
          created_at: string
          data: string
          forma: string
          id: string
          observacao: string | null
          pedido_id: string
          updated_at: string
          valor: number
        }
        Insert: {
          created_at?: string
          data: string
          forma?: string
          id?: string
          observacao?: string | null
          pedido_id: string
          updated_at?: string
          valor: number
        }
        Update: {
          created_at?: string
          data?: string
          forma?: string
          id?: string
          observacao?: string | null
          pedido_id?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedido_checklists: {
        Row: {
          anotacao: string | null
          checked: boolean
          created_at: string
          etapa: string
          id: string
          item_key: string
          pedido_id: string
          updated_at: string
        }
        Insert: {
          anotacao?: string | null
          checked?: boolean
          created_at?: string
          etapa: string
          id?: string
          item_key: string
          pedido_id: string
          updated_at?: string
        }
        Update: {
          anotacao?: string | null
          checked?: boolean
          created_at?: string
          etapa?: string
          id?: string
          item_key?: string
          pedido_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pedido_checklists_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedido_etapas: {
        Row: {
          created_at: string
          etapa: string
          id: string
          observacao: string | null
          pedido_id: string
        }
        Insert: {
          created_at?: string
          etapa: string
          id?: string
          observacao?: string | null
          pedido_id: string
        }
        Update: {
          created_at?: string
          etapa?: string
          id?: string
          observacao?: string | null
          pedido_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pedido_etapas_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          anotacao: string | null
          cliente: string
          created_at: string
          dias_restantes: number | null
          endereco: string | null
          etapa: string | null
          etapa_data: string | null
          id: string
          pedido_num: number
          previsao: string | null
          status: string
          telefone: string | null
          updated_at: string
          valor: number
          vendedor: string | null
        }
        Insert: {
          anotacao?: string | null
          cliente: string
          created_at?: string
          dias_restantes?: number | null
          endereco?: string | null
          etapa?: string | null
          etapa_data?: string | null
          id?: string
          pedido_num: number
          previsao?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
          valor?: number
          vendedor?: string | null
        }
        Update: {
          anotacao?: string | null
          cliente?: string
          created_at?: string
          dias_restantes?: number | null
          endereco?: string | null
          etapa?: string | null
          etapa_data?: string | null
          id?: string
          pedido_num?: number
          previsao?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
          valor?: number
          vendedor?: string | null
        }
        Relationships: []
      }
      produtos: {
        Row: {
          ativo: boolean
          categoria: string
          codigo: string
          created_at: string
          id: string
          nome: string
          preco: number
          unidade: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          categoria?: string
          codigo: string
          created_at?: string
          id?: string
          nome: string
          preco?: number
          unidade?: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          categoria?: string
          codigo?: string
          created_at?: string
          id?: string
          nome?: string
          preco?: number
          unidade?: string
          updated_at?: string
        }
        Relationships: []
      }
      projetos_vidro: {
        Row: {
          cor: string
          created_at: string
          espessura: string
          id: string
          preco_m2: number
          tipo: string
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cor?: string
          created_at?: string
          espessura?: string
          id?: string
          preco_m2?: number
          tipo?: string
          titulo: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          cor?: string
          created_at?: string
          espessura?: string
          id?: string
          preco_m2?: number
          tipo?: string
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vidro_itens: {
        Row: {
          altura_mm: number
          created_at: string
          descricao: string
          id: string
          largura_mm: number
          projeto_id: string
          quantidade: number
        }
        Insert: {
          altura_mm?: number
          created_at?: string
          descricao: string
          id?: string
          largura_mm?: number
          projeto_id: string
          quantidade?: number
        }
        Update: {
          altura_mm?: number
          created_at?: string
          descricao?: string
          id?: string
          largura_mm?: number
          projeto_id?: string
          quantidade?: number
        }
        Relationships: [
          {
            foreignKeyName: "vidro_itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos_vidro"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "funcionario"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "funcionario"],
    },
  },
} as const
