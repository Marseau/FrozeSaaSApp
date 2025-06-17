-- =================================================================
-- ÍNDICES OTIMIZADOS COM CONCURRENTLY 
-- Aplicar INDIVIDUALMENTE após o schema principal estar funcionando
-- =================================================================

-- IMPORTANTE: Execute cada comando SEPARADAMENTE, um por vez
-- Não execute este arquivo todo de uma vez!

-- Índice para produtos com estoque baixo
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_produtos_empresa_ativo_estoque_concurrent
ON produtos(empresa_id, status) 
WHERE status = 'ativo' AND estoque_atual <= estoque_minimo;

-- Índice para receitas mensais (relatórios)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pedidos_mes_status_concurrent
ON pedidos(empresa_id, DATE_TRUNC('month', criado_em), status) 
WHERE status = 'entregue';

-- Índice para custos de fichas técnicas
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_fichas_tecnicas_custo_concurrent
ON fichas_tecnicas(produto_id, custo_calculado);

-- Índice para movimentações de estoque por data
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_movimentacoes_data_concurrent
ON movimentacoes_estoque(produto_id, criado_em DESC);

-- Índice para pedidos por cliente e data
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pedidos_cliente_data_concurrent
ON pedidos(cliente_id, criado_em DESC);

-- =================================================================
-- INSTRUÇÕES DE USO:
-- =================================================================

/*
COMO USAR ESTE ARQUIVO:

1. AGUARDE o schema principal estar 100% funcionando

2. EXECUTE UM COMANDO POR VEZ no psql ou Supabase Studio:
   - Copie uma linha CREATE INDEX CONCURRENTLY
   - Execute
   - Aguarde finalizar
   - Copie a próxima linha
   - Repita

3. BENEFÍCIOS:
   - CONCURRENTLY não bloqueia a tabela durante criação
   - Ideal para tabelas que já têm dados
   - Performance melhor para consultas específicas

4. NÃO É OBRIGATÓRIO:
   - O sistema funciona sem esses índices
   - São apenas otimizações de performance
   - Use só se notar lentidão em consultas específicas

EXEMPLO DE EXECUÇÃO:
-- Execute apenas uma linha por vez:
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_produtos_empresa_ativo_estoque_concurrent
ON produtos(empresa_id, status) 
WHERE status = 'ativo' AND estoque_atual <= estoque_minimo;

-- Aguarde terminar, depois execute a próxima...
*/ 