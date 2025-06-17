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
      admins_plataforma: {
        Row: {
          ativo: boolean | null
          auth_id: string | null
          criado_em: string | null
          email: string
          id: string
          nome: string
          super_admin: boolean | null
        }
        Insert: {
          ativo?: boolean | null
          auth_id?: string | null
          criado_em?: string | null
          email: string
          id?: string
          nome: string
          super_admin?: boolean | null
        }
        Update: {
          ativo?: boolean | null
          auth_id?: string | null
          criado_em?: string | null
          email?: string
          id?: string
          nome?: string
          super_admin?: boolean | null
        }
        Relationships: []
      }
      assinaturas: {
        Row: {
          criado_em: string | null
          data_fim: string | null
          data_inicio: string
          empresa_id: string | null
          id: string
          metodo_pagamento: Database["public"]["Enums"]["tipo_pagamento"] | null
          plano_id: string | null
          status: Database["public"]["Enums"]["status_assinatura"] | null
        }
        Insert: {
          criado_em?: string | null
          data_fim?: string | null
          data_inicio: string
          empresa_id?: string | null
          id?: string
          metodo_pagamento?:
            | Database["public"]["Enums"]["tipo_pagamento"]
            | null
          plano_id?: string | null
          status?: Database["public"]["Enums"]["status_assinatura"] | null
        }
        Update: {
          criado_em?: string | null
          data_fim?: string | null
          data_inicio?: string
          empresa_id?: string | null
          id?: string
          metodo_pagamento?:
            | Database["public"]["Enums"]["tipo_pagamento"]
            | null
          plano_id?: string | null
          status?: Database["public"]["Enums"]["status_assinatura"] | null
        }
        Relationships: [
          {
            foreignKeyName: "assinaturas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assinaturas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "mv_receitas_mensais"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "assinaturas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "view_receita_mensal_empresa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "assinaturas_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos"
            referencedColumns: ["id"]
          },
        ]
      }
      avaliacoes: {
        Row: {
          cliente_id: string | null
          comentario: string | null
          criado_em: string | null
          id: string
          nota: number
          pedido_id: string | null
          produto_id: string | null
        }
        Insert: {
          cliente_id?: string | null
          comentario?: string | null
          criado_em?: string | null
          id?: string
          nota: number
          pedido_id?: string | null
          produto_id?: string | null
        }
        Update: {
          cliente_id?: string | null
          comentario?: string | null
          criado_em?: string | null
          id?: string
          nota?: number
          pedido_id?: string | null
          produto_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes_finais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "view_margem_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "view_produtos_estoque_baixo"
            referencedColumns: ["id"]
          },
        ]
      }
      calendario_entregas: {
        Row: {
          ativo: boolean | null
          criado_em: string | null
          dia_semana: Database["public"]["Enums"]["dia_semana"]
          empresa_id: string | null
          id: string
          periodo: Database["public"]["Enums"]["periodo_dia"]
        }
        Insert: {
          ativo?: boolean | null
          criado_em?: string | null
          dia_semana: Database["public"]["Enums"]["dia_semana"]
          empresa_id?: string | null
          id?: string
          periodo: Database["public"]["Enums"]["periodo_dia"]
        }
        Update: {
          ativo?: boolean | null
          criado_em?: string | null
          dia_semana?: Database["public"]["Enums"]["dia_semana"]
          empresa_id?: string | null
          id?: string
          periodo?: Database["public"]["Enums"]["periodo_dia"]
        }
        Relationships: [
          {
            foreignKeyName: "calendario_entregas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendario_entregas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "mv_receitas_mensais"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "calendario_entregas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "view_receita_mensal_empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      carrinhos: {
        Row: {
          cliente_id: string | null
          criado_em: string | null
          expirado_em: string | null
          id: string
          sessao_id: string | null
        }
        Insert: {
          cliente_id?: string | null
          criado_em?: string | null
          expirado_em?: string | null
          id?: string
          sessao_id?: string | null
        }
        Update: {
          cliente_id?: string | null
          criado_em?: string | null
          expirado_em?: string | null
          id?: string
          sessao_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carrinhos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes_finais"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias_produtos: {
        Row: {
          ativo: boolean | null
          criado_em: string | null
          descricao: string | null
          empresa_id: string | null
          id: string
          imagem_url: string | null
          nome: string
          ordem: number | null
        }
        Insert: {
          ativo?: boolean | null
          criado_em?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          imagem_url?: string | null
          nome: string
          ordem?: number | null
        }
        Update: {
          ativo?: boolean | null
          criado_em?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          imagem_url?: string | null
          nome?: string
          ordem?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "categorias_produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categorias_produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "mv_receitas_mensais"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "categorias_produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "view_receita_mensal_empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      clientes_finais: {
        Row: {
          ativo: boolean | null
          cep: string | null
          criado_em: string | null
          email: string | null
          empresa_id: string | null
          endereco_entrega: string | null
          id: string
          nome: string
          observacoes: string | null
          telefone: string | null
        }
        Insert: {
          ativo?: boolean | null
          cep?: string | null
          criado_em?: string | null
          email?: string | null
          empresa_id?: string | null
          endereco_entrega?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          telefone?: string | null
        }
        Update: {
          ativo?: boolean | null
          cep?: string | null
          criado_em?: string | null
          email?: string | null
          empresa_id?: string | null
          endereco_entrega?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_finais_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clientes_finais_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "mv_receitas_mensais"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "clientes_finais_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "view_receita_mensal_empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      convites_cadastro: {
        Row: {
          created_at: string | null
          email: string
          empresa_id: string | null
          expires_at: string
          id: string
          status: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          empresa_id?: string | null
          expires_at: string
          id?: string
          status?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          empresa_id?: string | null
          expires_at?: string
          id?: string
          status?: string
          token?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "convites_cadastro_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "convites_cadastro_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "mv_receitas_mensais"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "convites_cadastro_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "view_receita_mensal_empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      cupons: {
        Row: {
          codigo: string
          criado_em: string | null
          id: string
          promocao_id: string | null
          usado_em: string | null
          usado_por: string | null
        }
        Insert: {
          codigo: string
          criado_em?: string | null
          id?: string
          promocao_id?: string | null
          usado_em?: string | null
          usado_por?: string | null
        }
        Update: {
          codigo?: string
          criado_em?: string | null
          id?: string
          promocao_id?: string | null
          usado_em?: string | null
          usado_por?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cupons_promocao_id_fkey"
            columns: ["promocao_id"]
            isOneToOne: false
            referencedRelation: "promocoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cupons_usado_por_fkey"
            columns: ["usado_por"]
            isOneToOne: false
            referencedRelation: "clientes_finais"
            referencedColumns: ["id"]
          },
        ]
      }
      custos_operacionais: {
        Row: {
          criado_em: string | null
          data_referencia: string | null
          descricao: string | null
          empresa_id: string | null
          id: string
          nome: string
          recorrente: boolean | null
          tipo: Database["public"]["Enums"]["tipo_custo"]
          valor: number
        }
        Insert: {
          criado_em?: string | null
          data_referencia?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          nome: string
          recorrente?: boolean | null
          tipo: Database["public"]["Enums"]["tipo_custo"]
          valor: number
        }
        Update: {
          criado_em?: string | null
          data_referencia?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string
          recorrente?: boolean | null
          tipo?: Database["public"]["Enums"]["tipo_custo"]
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "custos_operacionais_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custos_operacionais_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "mv_receitas_mensais"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "custos_operacionais_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "view_receita_mensal_empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      email_templates: {
        Row: {
          assunto: string
          ativo: boolean
          atualizado_em: string
          criado_em: string
          id: string
          nome: string
          template_html: string
          template_texto: string
          variaveis_disponiveis: string[] | null
        }
        Insert: {
          assunto: string
          ativo?: boolean
          atualizado_em?: string
          criado_em?: string
          id?: string
          nome: string
          template_html: string
          template_texto: string
          variaveis_disponiveis?: string[] | null
        }
        Update: {
          assunto?: string
          ativo?: boolean
          atualizado_em?: string
          criado_em?: string
          id?: string
          nome?: string
          template_html?: string
          template_texto?: string
          variaveis_disponiveis?: string[] | null
        }
        Relationships: []
      }
      empresas: {
        Row: {
          ativo: boolean | null
          cep: string | null
          cor_primaria: string | null
          cor_secundaria: string | null
          criado_em: string | null
          descricao: string | null
          email: string
          endereco: string | null
          frase_destaque: string | null
          id: string
          logo_url: string | null
          nome: string
          stripe_account_id: string | null
          telefone: string | null
        }
        Insert: {
          ativo?: boolean | null
          cep?: string | null
          cor_primaria?: string | null
          cor_secundaria?: string | null
          criado_em?: string | null
          descricao?: string | null
          email: string
          endereco?: string | null
          frase_destaque?: string | null
          id?: string
          logo_url?: string | null
          nome: string
          stripe_account_id?: string | null
          telefone?: string | null
        }
        Update: {
          ativo?: boolean | null
          cep?: string | null
          cor_primaria?: string | null
          cor_secundaria?: string | null
          criado_em?: string | null
          descricao?: string | null
          email?: string
          endereco?: string | null
          frase_destaque?: string | null
          id?: string
          logo_url?: string | null
          nome?: string
          stripe_account_id?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      entregas_agendadas: {
        Row: {
          criado_em: string | null
          data_entrega: string
          endereco: string | null
          entregador: string | null
          entregue_em: string | null
          id: string
          observacoes: string | null
          pedido_id: string | null
          periodo: Database["public"]["Enums"]["periodo_dia"] | null
          status: Database["public"]["Enums"]["status_entrega"] | null
        }
        Insert: {
          criado_em?: string | null
          data_entrega: string
          endereco?: string | null
          entregador?: string | null
          entregue_em?: string | null
          id?: string
          observacoes?: string | null
          pedido_id?: string | null
          periodo?: Database["public"]["Enums"]["periodo_dia"] | null
          status?: Database["public"]["Enums"]["status_entrega"] | null
        }
        Update: {
          criado_em?: string | null
          data_entrega?: string
          endereco?: string | null
          entregador?: string | null
          entregue_em?: string | null
          id?: string
          observacoes?: string | null
          pedido_id?: string | null
          periodo?: Database["public"]["Enums"]["periodo_dia"] | null
          status?: Database["public"]["Enums"]["status_entrega"] | null
        }
        Relationships: [
          {
            foreignKeyName: "entregas_agendadas_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      estoques: {
        Row: {
          atualizado_em: string | null
          estoque_maximo: number | null
          estoque_minimo: number | null
          id: string
          ponto_pedido: number | null
          produto_id: string | null
          quantidade_atual: number | null
        }
        Insert: {
          atualizado_em?: string | null
          estoque_maximo?: number | null
          estoque_minimo?: number | null
          id?: string
          ponto_pedido?: number | null
          produto_id?: string | null
          quantidade_atual?: number | null
        }
        Update: {
          atualizado_em?: string | null
          estoque_maximo?: number | null
          estoque_minimo?: number | null
          id?: string
          ponto_pedido?: number | null
          produto_id?: string | null
          quantidade_atual?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "estoques_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoques_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "view_margem_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoques_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "view_produtos_estoque_baixo"
            referencedColumns: ["id"]
          },
        ]
      }
      faturas: {
        Row: {
          aplicou_percentual: boolean | null
          assinatura_id: string | null
          criado_em: string | null
          id: string
          mes_referencia: string
          pago_em: string | null
          receita_empresa: number | null
          status: Database["public"]["Enums"]["status_pagamento"] | null
          valor: number
          vencimento: string | null
        }
        Insert: {
          aplicou_percentual?: boolean | null
          assinatura_id?: string | null
          criado_em?: string | null
          id?: string
          mes_referencia: string
          pago_em?: string | null
          receita_empresa?: number | null
          status?: Database["public"]["Enums"]["status_pagamento"] | null
          valor: number
          vencimento?: string | null
        }
        Update: {
          aplicou_percentual?: boolean | null
          assinatura_id?: string | null
          criado_em?: string | null
          id?: string
          mes_referencia?: string
          pago_em?: string | null
          receita_empresa?: number | null
          status?: Database["public"]["Enums"]["status_pagamento"] | null
          valor?: number
          vencimento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faturas_assinatura_id_fkey"
            columns: ["assinatura_id"]
            isOneToOne: false
            referencedRelation: "assinaturas"
            referencedColumns: ["id"]
          },
        ]
      }
      feriados_empresas: {
        Row: {
          criado_em: string | null
          data: string
          descricao: string | null
          empresa_id: string | null
          id: string
        }
        Insert: {
          criado_em?: string | null
          data: string
          descricao?: string | null
          empresa_id?: string | null
          id?: string
        }
        Update: {
          criado_em?: string | null
          data?: string
          descricao?: string | null
          empresa_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feriados_empresas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feriados_empresas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "mv_receitas_mensais"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "feriados_empresas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "view_receita_mensal_empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      fichas_tecnicas: {
        Row: {
          criado_em: string | null
          custo_calculado: number | null
          id: string
          insumo_id: string | null
          produto_id: string | null
          quantidade: number
        }
        Insert: {
          criado_em?: string | null
          custo_calculado?: number | null
          id?: string
          insumo_id?: string | null
          produto_id?: string | null
          quantidade: number
        }
        Update: {
          criado_em?: string | null
          custo_calculado?: number | null
          id?: string
          insumo_id?: string | null
          produto_id?: string | null
          quantidade?: number
        }
        Relationships: [
          {
            foreignKeyName: "fichas_tecnicas_insumo_id_fkey"
            columns: ["insumo_id"]
            isOneToOne: false
            referencedRelation: "insumos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fichas_tecnicas_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fichas_tecnicas_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "view_margem_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fichas_tecnicas_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "view_produtos_estoque_baixo"
            referencedColumns: ["id"]
          },
        ]
      }
      fornecedores: {
        Row: {
          ativo: boolean | null
          cnpj: string | null
          contato_responsavel: string | null
          criado_em: string | null
          email: string | null
          empresa_id: string | null
          endereco: string | null
          id: string
          nome: string
          telefone: string | null
        }
        Insert: {
          ativo?: boolean | null
          cnpj?: string | null
          contato_responsavel?: string | null
          criado_em?: string | null
          email?: string | null
          empresa_id?: string | null
          endereco?: string | null
          id?: string
          nome: string
          telefone?: string | null
        }
        Update: {
          ativo?: boolean | null
          cnpj?: string | null
          contato_responsavel?: string | null
          criado_em?: string | null
          email?: string | null
          empresa_id?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fornecedores_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fornecedores_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "mv_receitas_mensais"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "fornecedores_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "view_receita_mensal_empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      fretes: {
        Row: {
          calculado_em: string | null
          cep_destino: string
          cep_origem: string
          distancia_km: number | null
          empresa_id: string | null
          id: string
          tempo_estimado: number | null
          valor_base: number | null
          valor_final: number | null
        }
        Insert: {
          calculado_em?: string | null
          cep_destino: string
          cep_origem: string
          distancia_km?: number | null
          empresa_id?: string | null
          id?: string
          tempo_estimado?: number | null
          valor_base?: number | null
          valor_final?: number | null
        }
        Update: {
          calculado_em?: string | null
          cep_destino?: string
          cep_origem?: string
          distancia_km?: number | null
          empresa_id?: string | null
          id?: string
          tempo_estimado?: number | null
          valor_base?: number | null
          valor_final?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fretes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fretes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "mv_receitas_mensais"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "fretes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "view_receita_mensal_empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      insumos: {
        Row: {
          ativo: boolean | null
          criado_em: string | null
          descricao: string | null
          empresa_id: string | null
          estoque_atual: number | null
          estoque_minimo: number | null
          fornecedor_id: string | null
          id: string
          nome: string
          preco_unitario: number
          unidade: Database["public"]["Enums"]["unidade_medida"]
        }
        Insert: {
          ativo?: boolean | null
          criado_em?: string | null
          descricao?: string | null
          empresa_id?: string | null
          estoque_atual?: number | null
          estoque_minimo?: number | null
          fornecedor_id?: string | null
          id?: string
          nome: string
          preco_unitario: number
          unidade: Database["public"]["Enums"]["unidade_medida"]
        }
        Update: {
          ativo?: boolean | null
          criado_em?: string | null
          descricao?: string | null
          empresa_id?: string | null
          estoque_atual?: number | null
          estoque_minimo?: number | null
          fornecedor_id?: string | null
          id?: string
          nome?: string
          preco_unitario?: number
          unidade?: Database["public"]["Enums"]["unidade_medida"]
        }
        Relationships: [
          {
            foreignKeyName: "insumos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insumos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "mv_receitas_mensais"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "insumos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "view_receita_mensal_empresa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "insumos_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_carrinho: {
        Row: {
          carrinho_id: string | null
          criado_em: string | null
          id: string
          preco_unitario: number | null
          produto_id: string | null
          quantidade: number
        }
        Insert: {
          carrinho_id?: string | null
          criado_em?: string | null
          id?: string
          preco_unitario?: number | null
          produto_id?: string | null
          quantidade: number
        }
        Update: {
          carrinho_id?: string | null
          criado_em?: string | null
          id?: string
          preco_unitario?: number | null
          produto_id?: string | null
          quantidade?: number
        }
        Relationships: [
          {
            foreignKeyName: "itens_carrinho_carrinho_id_fkey"
            columns: ["carrinho_id"]
            isOneToOne: false
            referencedRelation: "carrinhos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_carrinho_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_carrinho_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "view_margem_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_carrinho_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "view_produtos_estoque_baixo"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_pedido: {
        Row: {
          criado_em: string | null
          id: string
          pedido_id: string | null
          preco_unitario: number
          produto_id: string | null
          quantidade: number
          subtotal: number
        }
        Insert: {
          criado_em?: string | null
          id?: string
          pedido_id?: string | null
          preco_unitario: number
          produto_id?: string | null
          quantidade: number
          subtotal: number
        }
        Update: {
          criado_em?: string | null
          id?: string
          pedido_id?: string | null
          preco_unitario?: number
          produto_id?: string | null
          quantidade?: number
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "itens_pedido_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_pedido_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_pedido_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "view_margem_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_pedido_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "view_produtos_estoque_baixo"
            referencedColumns: ["id"]
          },
        ]
      }
      logs_usuarios: {
        Row: {
          acao: string
          criado_em: string | null
          dados_anteriores: Json | null
          dados_novos: Json | null
          empresa_id: string | null
          id: string
          ip_origem: unknown | null
          registro_id: string | null
          tabela_afetada: string | null
          user_agent: string | null
          usuario_id: string | null
        }
        Insert: {
          acao: string
          criado_em?: string | null
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          empresa_id?: string | null
          id?: string
          ip_origem?: unknown | null
          registro_id?: string | null
          tabela_afetada?: string | null
          user_agent?: string | null
          usuario_id?: string | null
        }
        Update: {
          acao?: string
          criado_em?: string | null
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          empresa_id?: string | null
          id?: string
          ip_origem?: unknown | null
          registro_id?: string | null
          tabela_afetada?: string | null
          user_agent?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_usuarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "logs_usuarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "mv_receitas_mensais"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "logs_usuarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "view_receita_mensal_empresa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "logs_usuarios_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      movimentacoes_estoque: {
        Row: {
          criado_em: string | null
          id: string
          observacao: string | null
          produto_id: string | null
          quantidade: number
          quantidade_anterior: number | null
          tipo: string
          usuario_id: string | null
        }
        Insert: {
          criado_em?: string | null
          id?: string
          observacao?: string | null
          produto_id?: string | null
          quantidade: number
          quantidade_anterior?: number | null
          tipo: string
          usuario_id?: string | null
        }
        Update: {
          criado_em?: string | null
          id?: string
          observacao?: string | null
          produto_id?: string | null
          quantidade?: number
          quantidade_anterior?: number | null
          tipo?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "movimentacoes_estoque_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimentacoes_estoque_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "view_margem_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimentacoes_estoque_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "view_produtos_estoque_baixo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimentacoes_estoque_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      notificacoes: {
        Row: {
          cliente_id: string | null
          conteudo: string | null
          criado_em: string | null
          empresa_id: string | null
          enviada: boolean | null
          enviado_em: string | null
          id: string
          lida: boolean | null
          status: Database["public"]["Enums"]["status_notificacao"] | null
          tipo: Database["public"]["Enums"]["tipo_notificacao"]
          titulo: string
        }
        Insert: {
          cliente_id?: string | null
          conteudo?: string | null
          criado_em?: string | null
          empresa_id?: string | null
          enviada?: boolean | null
          enviado_em?: string | null
          id?: string
          lida?: boolean | null
          status?: Database["public"]["Enums"]["status_notificacao"] | null
          tipo: Database["public"]["Enums"]["tipo_notificacao"]
          titulo: string
        }
        Update: {
          cliente_id?: string | null
          conteudo?: string | null
          criado_em?: string | null
          empresa_id?: string | null
          enviada?: boolean | null
          enviado_em?: string | null
          id?: string
          lida?: boolean | null
          status?: Database["public"]["Enums"]["status_notificacao"] | null
          tipo?: Database["public"]["Enums"]["tipo_notificacao"]
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificacoes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes_finais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notificacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notificacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "mv_receitas_mensais"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "notificacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "view_receita_mensal_empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      pagamentos: {
        Row: {
          confirmado_em: string | null
          criado_em: string | null
          id: string
          metodo: Database["public"]["Enums"]["tipo_pagamento"]
          pedido_id: string | null
          referencia_externa: string | null
          status: Database["public"]["Enums"]["status_pagamento"] | null
          valor: number
        }
        Insert: {
          confirmado_em?: string | null
          criado_em?: string | null
          id?: string
          metodo: Database["public"]["Enums"]["tipo_pagamento"]
          pedido_id?: string | null
          referencia_externa?: string | null
          status?: Database["public"]["Enums"]["status_pagamento"] | null
          valor: number
        }
        Update: {
          confirmado_em?: string | null
          criado_em?: string | null
          id?: string
          metodo?: Database["public"]["Enums"]["tipo_pagamento"]
          pedido_id?: string | null
          referencia_externa?: string | null
          status?: Database["public"]["Enums"]["status_pagamento"] | null
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
      pedidos: {
        Row: {
          cliente_id: string | null
          criado_em: string | null
          data_entrega_solicitada: string | null
          desconto: number | null
          empresa_id: string | null
          endereco_entrega: string | null
          forma_pagamento: Database["public"]["Enums"]["tipo_pagamento"] | null
          id: string
          numero_pedido: string | null
          observacoes: string | null
          periodo_entrega: Database["public"]["Enums"]["periodo_dia"] | null
          status: Database["public"]["Enums"]["status_pedido"] | null
          valor_frete: number | null
          valor_produtos: number
          valor_total: number
        }
        Insert: {
          cliente_id?: string | null
          criado_em?: string | null
          data_entrega_solicitada?: string | null
          desconto?: number | null
          empresa_id?: string | null
          endereco_entrega?: string | null
          forma_pagamento?: Database["public"]["Enums"]["tipo_pagamento"] | null
          id?: string
          numero_pedido?: string | null
          observacoes?: string | null
          periodo_entrega?: Database["public"]["Enums"]["periodo_dia"] | null
          status?: Database["public"]["Enums"]["status_pedido"] | null
          valor_frete?: number | null
          valor_produtos: number
          valor_total: number
        }
        Update: {
          cliente_id?: string | null
          criado_em?: string | null
          data_entrega_solicitada?: string | null
          desconto?: number | null
          empresa_id?: string | null
          endereco_entrega?: string | null
          forma_pagamento?: Database["public"]["Enums"]["tipo_pagamento"] | null
          id?: string
          numero_pedido?: string | null
          observacoes?: string | null
          periodo_entrega?: Database["public"]["Enums"]["periodo_dia"] | null
          status?: Database["public"]["Enums"]["status_pedido"] | null
          valor_frete?: number | null
          valor_produtos?: number
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes_finais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "mv_receitas_mensais"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "pedidos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "view_receita_mensal_empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      planos: {
        Row: {
          ativo: boolean | null
          criado_em: string | null
          descricao: string | null
          id: string
          limite_receita_mensal: number | null
          max_usuarios: number | null
          mensalidade: number
          nome: Database["public"]["Enums"]["plano_nome"]
          percentual_receita: number | null
          preco_inicial: number
        }
        Insert: {
          ativo?: boolean | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          limite_receita_mensal?: number | null
          max_usuarios?: number | null
          mensalidade: number
          nome: Database["public"]["Enums"]["plano_nome"]
          percentual_receita?: number | null
          preco_inicial: number
        }
        Update: {
          ativo?: boolean | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          limite_receita_mensal?: number | null
          max_usuarios?: number | null
          mensalidade?: number
          nome?: Database["public"]["Enums"]["plano_nome"]
          percentual_receita?: number | null
          preco_inicial?: number
        }
        Relationships: []
      }
      preferencias_clientes: {
        Row: {
          alergias: string | null
          cliente_id: string | null
          criado_em: string | null
          id: string
          observacoes: string | null
          preferencia_entrega:
            | Database["public"]["Enums"]["metodo_entrega"]
            | null
          receber_notificacoes: boolean | null
        }
        Insert: {
          alergias?: string | null
          cliente_id?: string | null
          criado_em?: string | null
          id?: string
          observacoes?: string | null
          preferencia_entrega?:
            | Database["public"]["Enums"]["metodo_entrega"]
            | null
          receber_notificacoes?: boolean | null
        }
        Update: {
          alergias?: string | null
          cliente_id?: string | null
          criado_em?: string | null
          id?: string
          observacoes?: string | null
          preferencia_entrega?:
            | Database["public"]["Enums"]["metodo_entrega"]
            | null
          receber_notificacoes?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "preferencias_clientes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes_finais"
            referencedColumns: ["id"]
          },
        ]
      }
      produto_imagens: {
        Row: {
          criado_em: string | null
          id: string
          is_capa: boolean | null
          ordem: number | null
          produto_id: string | null
          url: string
        }
        Insert: {
          criado_em?: string | null
          id?: string
          is_capa?: boolean | null
          ordem?: number | null
          produto_id?: string | null
          url: string
        }
        Update: {
          criado_em?: string | null
          id?: string
          is_capa?: boolean | null
          ordem?: number | null
          produto_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "produto_imagens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produto_imagens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "view_margem_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produto_imagens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "view_produtos_estoque_baixo"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          categoria_id: string | null
          criado_em: string | null
          custo_total: number | null
          descricao: string | null
          empresa_id: string | null
          estoque_atual: number | null
          estoque_maximo: number | null
          estoque_minimo: number | null
          id: string
          margem_lucro: number | null
          margem_valor: number | null
          nome: string
          peso_medio: number | null
          ponto_pedido: number | null
          preco_venda: number
          status: Database["public"]["Enums"]["status_produto"] | null
          tempo_preparo: number | null
          tipo: Database["public"]["Enums"]["tipo_produto"] | null
          tipo_venda: Database["public"]["Enums"]["unidade_medida"]
          tipo_venda_produto:
            | Database["public"]["Enums"]["tipo_venda_produto"]
            | null
          ultimo_movimento: string | null
          unidade_especifica:
            | Database["public"]["Enums"]["unidade_medida"]
            | null
        }
        Insert: {
          categoria_id?: string | null
          criado_em?: string | null
          custo_total?: number | null
          descricao?: string | null
          empresa_id?: string | null
          estoque_atual?: number | null
          estoque_maximo?: number | null
          estoque_minimo?: number | null
          id?: string
          margem_lucro?: number | null
          margem_valor?: number | null
          nome: string
          peso_medio?: number | null
          ponto_pedido?: number | null
          preco_venda: number
          status?: Database["public"]["Enums"]["status_produto"] | null
          tempo_preparo?: number | null
          tipo?: Database["public"]["Enums"]["tipo_produto"] | null
          tipo_venda: Database["public"]["Enums"]["unidade_medida"]
          tipo_venda_produto?:
            | Database["public"]["Enums"]["tipo_venda_produto"]
            | null
          ultimo_movimento?: string | null
          unidade_especifica?:
            | Database["public"]["Enums"]["unidade_medida"]
            | null
        }
        Update: {
          categoria_id?: string | null
          criado_em?: string | null
          custo_total?: number | null
          descricao?: string | null
          empresa_id?: string | null
          estoque_atual?: number | null
          estoque_maximo?: number | null
          estoque_minimo?: number | null
          id?: string
          margem_lucro?: number | null
          margem_valor?: number | null
          nome?: string
          peso_medio?: number | null
          ponto_pedido?: number | null
          preco_venda?: number
          status?: Database["public"]["Enums"]["status_produto"] | null
          tempo_preparo?: number | null
          tipo?: Database["public"]["Enums"]["tipo_produto"] | null
          tipo_venda?: Database["public"]["Enums"]["unidade_medida"]
          tipo_venda_produto?:
            | Database["public"]["Enums"]["tipo_venda_produto"]
            | null
          ultimo_movimento?: string | null
          unidade_especifica?:
            | Database["public"]["Enums"]["unidade_medida"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "mv_receitas_mensais"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "view_receita_mensal_empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      promocoes: {
        Row: {
          ativo: boolean | null
          criado_em: string | null
          data_fim: string | null
          data_inicio: string | null
          descricao: string | null
          empresa_id: string | null
          id: string
          nome: string
          percentual_desconto: number | null
          quantidade_minima: number | null
          tipo: string
          valor_desconto: number | null
          valor_minimo_pedido: number | null
        }
        Insert: {
          ativo?: boolean | null
          criado_em?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          nome: string
          percentual_desconto?: number | null
          quantidade_minima?: number | null
          tipo: string
          valor_desconto?: number | null
          valor_minimo_pedido?: number | null
        }
        Update: {
          ativo?: boolean | null
          criado_em?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string
          percentual_desconto?: number | null
          quantidade_minima?: number | null
          tipo?: string
          valor_desconto?: number | null
          valor_minimo_pedido?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "promocoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promocoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "mv_receitas_mensais"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "promocoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "view_receita_mensal_empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      usuarios: {
        Row: {
          ativo: boolean | null
          auth_id: string | null
          criado_em: string | null
          email: string
          id: string
          nome: string
          telefone: string | null
        }
        Insert: {
          ativo?: boolean | null
          auth_id?: string | null
          criado_em?: string | null
          email: string
          id?: string
          nome: string
          telefone?: string | null
        }
        Update: {
          ativo?: boolean | null
          auth_id?: string | null
          criado_em?: string | null
          email?: string
          id?: string
          nome?: string
          telefone?: string | null
        }
        Relationships: []
      }
      usuarios_empresas: {
        Row: {
          ativo: boolean | null
          criado_em: string | null
          empresa_id: string | null
          id: string
          perfil: Database["public"]["Enums"]["tipo_usuario"]
          usuario_id: string | null
        }
        Insert: {
          ativo?: boolean | null
          criado_em?: string | null
          empresa_id?: string | null
          id?: string
          perfil: Database["public"]["Enums"]["tipo_usuario"]
          usuario_id?: string | null
        }
        Update: {
          ativo?: boolean | null
          criado_em?: string | null
          empresa_id?: string | null
          id?: string
          perfil?: Database["public"]["Enums"]["tipo_usuario"]
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_empresas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_empresas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "mv_receitas_mensais"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "usuarios_empresas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "view_receita_mensal_empresa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "usuarios_empresas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      mv_receitas_mensais: {
        Row: {
          clientes_unicos: number | null
          empresa_id: string | null
          empresa_nome: string | null
          mes_referencia: string | null
          receita_total: number | null
          ticket_medio: number | null
          total_pedidos: number | null
          ultima_atualizacao: string | null
        }
        Relationships: []
      }
      view_margem_produtos: {
        Row: {
          custo_total: number | null
          id: string | null
          lucro_bruto: number | null
          margem_percentual: number | null
          nome: string | null
          preco_venda: number | null
        }
        Relationships: []
      }
      view_produtos_estoque_baixo: {
        Row: {
          empresa_id: string | null
          estoque_minimo: number | null
          id: string | null
          nome: string | null
          ponto_pedido: number | null
          quantidade_atual: number | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "mv_receitas_mensais"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "view_receita_mensal_empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      view_receita_mensal_empresa: {
        Row: {
          empresa_id: string | null
          empresa_nome: string | null
          mes: string | null
          receita_total: number | null
          total_pedidos: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      criar_sequencia_empresa: {
        Args: { empresa_uuid: string }
        Returns: undefined
      }
      gerar_fatura_mensal: {
        Args: { empresa_uuid: string; mes_ref: string }
        Returns: string
      }
      get_user_type: {
        Args: { user_auth_id: string }
        Returns: string
      }
      is_platform_admin: {
        Args: { user_auth_id: string }
        Returns: boolean
      }
      is_super_admin: {
        Args: { user_auth_id: string }
        Returns: boolean
      }
      movimentar_estoque: {
        Args: {
          produto_uuid: string
          tipo_movimento: string
          quantidade_movimento: number
          observacao_movimento?: string
          usuario_movimento?: string
        }
        Returns: boolean
      }
      recalcular_custo_produto: {
        Args: { produto_uuid: string }
        Returns: undefined
      }
      refresh_receitas_mensais: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      soft_delete_record: {
        Args: { tabela: string; record_id: string }
        Returns: boolean
      }
    }
    Enums: {
      dia_semana:
        | "segunda"
        | "terca"
        | "quarta"
        | "quinta"
        | "sexta"
        | "sabado"
        | "domingo"
      metodo_entrega: "entrega_manha" | "entrega_tarde" | "retirada"
      periodo_dia: "manha" | "tarde"
      plano_nome: "simples" | "pro"
      status_assinatura: "ativa" | "cancelada" | "expirada"
      status_entrega: "agendada" | "em_rota" | "entregue" | "falha"
      status_notificacao: "enviado" | "erro" | "pendente"
      status_pagamento: "pendente" | "pago" | "atrasado" | "falhou"
      status_pedido:
        | "recebido"
        | "em_preparo"
        | "pronto"
        | "em_entrega"
        | "entregue"
        | "cancelado"
      status_produto: "ativo" | "inativo" | "esgotado"
      tipo_custo: "fixo" | "variavel"
      tipo_notificacao: "email" | "push" | "sms" | "whatsapp"
      tipo_pagamento: "pix" | "stripe"
      tipo_produto:
        | "prato_pronto"
        | "proteina"
        | "acompanhamento"
        | "sobremesa"
        | "combo"
      tipo_usuario: "admin" | "encarregado"
      tipo_venda_produto: "unidade" | "peso"
      unidade_medida: "unidade" | "kg" | "g" | "ml" | "l" | "pacote"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      dia_semana: [
        "segunda",
        "terca",
        "quarta",
        "quinta",
        "sexta",
        "sabado",
        "domingo",
      ],
      metodo_entrega: ["entrega_manha", "entrega_tarde", "retirada"],
      periodo_dia: ["manha", "tarde"],
      plano_nome: ["simples", "pro"],
      status_assinatura: ["ativa", "cancelada", "expirada"],
      status_entrega: ["agendada", "em_rota", "entregue", "falha"],
      status_notificacao: ["enviado", "erro", "pendente"],
      status_pagamento: ["pendente", "pago", "atrasado", "falhou"],
      status_pedido: [
        "recebido",
        "em_preparo",
        "pronto",
        "em_entrega",
        "entregue",
        "cancelado",
      ],
      status_produto: ["ativo", "inativo", "esgotado"],
      tipo_custo: ["fixo", "variavel"],
      tipo_notificacao: ["email", "push", "sms", "whatsapp"],
      tipo_pagamento: ["pix", "stripe"],
      tipo_produto: [
        "prato_pronto",
        "proteina",
        "acompanhamento",
        "sobremesa",
        "combo",
      ],
      tipo_usuario: ["admin", "encarregado"],
      tipo_venda_produto: ["unidade", "peso"],
      unidade_medida: ["unidade", "kg", "g", "ml", "l", "pacote"],
    },
  },
} as const
