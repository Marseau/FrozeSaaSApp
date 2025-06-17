import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase - FrozenSaaSApp
const supabaseUrl = 'https://kuaxylxgyjygfmixkmhg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1YXh5bHhneWp5Z2ZtaXhrbWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMTE2NjgsImV4cCI6MjA2NTY4NzY2OH0.0gZh2Pz2kA-BUV2eD_TrYESp2wbYu0Eo0NfaCz4I6Ck'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Tipos para o banco de dados
export type Database = {
  public: {
    Tables: {
      empresas: {
        Row: {
          id: string
          nome: string
          email: string
          telefone: string | null
          endereco: string | null
          logo_url: string | null
          cor_primaria: string | null
          cor_secundaria: string | null
          plano_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          email: string
          telefone?: string | null
          endereco?: string | null
          logo_url?: string | null
          cor_primaria?: string | null
          cor_secundaria?: string | null
          plano_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          email?: string
          telefone?: string | null
          endereco?: string | null
          logo_url?: string | null
          cor_primaria?: string | null
          cor_secundaria?: string | null
          plano_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      produtos: {
        Row: {
          id: string
          empresa_id: string
          nome: string
          descricao: string | null
          preco: number
          categoria_id: string | null
          tipo_produto: 'unidade' | 'peso'
          unidade_medida: string | null
          estoque_minimo: number | null
          estoque_maximo: number | null
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          empresa_id: string
          nome: string
          descricao?: string | null
          preco: number
          categoria_id?: string | null
          tipo_produto?: 'unidade' | 'peso'
          unidade_medida?: string | null
          estoque_minimo?: number | null
          estoque_maximo?: number | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          empresa_id?: string
          nome?: string
          descricao?: string | null
          preco?: number
          categoria_id?: string | null
          tipo_produto?: 'unidade' | 'peso'
          unidade_medida?: string | null
          estoque_minimo?: number | null
          estoque_maximo?: number | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      pedidos: {
        Row: {
          id: string
          empresa_id: string
          cliente_final_id: string
          numero_pedido: string
          status: 'pendente' | 'confirmado' | 'preparando' | 'pronto' | 'em_entrega' | 'entregue' | 'cancelado'
          subtotal: number
          taxa_entrega: number
          desconto: number
          total: number
          observacoes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          empresa_id: string
          cliente_final_id: string
          numero_pedido: string
          status?: 'pendente' | 'confirmado' | 'preparando' | 'pronto' | 'em_entrega' | 'entregue' | 'cancelado'
          subtotal: number
          taxa_entrega?: number
          desconto?: number
          total: number
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          empresa_id?: string
          cliente_final_id?: string
          numero_pedido?: string
          status?: 'pendente' | 'confirmado' | 'preparando' | 'pronto' | 'em_entrega' | 'entregue' | 'cancelado'
          subtotal?: number
          taxa_entrega?: number
          desconto?: number
          total?: number
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 