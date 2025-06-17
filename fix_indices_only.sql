/*
==================================================
CORREÇÃO ESPECÍFICA: ÍNDICES CONCURRENTLY
Aplicar APENAS se você já executou o arquivo de correções anterior
==================================================
*/

/* 
Remover índices que foram criados com CONCURRENTLY (se existirem)
Isso evita erros caso tenham sido criados parcialmente
*/

DROP INDEX IF EXISTS idx_produtos_empresa_ativo_estoque;
DROP INDEX IF EXISTS idx_pedidos_mes_status;
DROP INDEX IF EXISTS idx_fichas_tecnicas_custo;
DROP INDEX IF EXISTS idx_mv_receitas_empresa_mes;

/* 
Recriar os índices SEM CONCURRENTLY
Agora podem ser executados dentro de transação
*/

CREATE INDEX IF NOT EXISTS idx_produtos_empresa_ativo_estoque 
ON produtos(empresa_id, status) 
WHERE status = 'ativo' AND estoque_atual <= estoque_minimo;

CREATE INDEX IF NOT EXISTS idx_pedidos_mes_status 
ON pedidos(empresa_id, DATE_TRUNC('month', criado_em), status) 
WHERE status = 'entregue';

CREATE INDEX IF NOT EXISTS idx_fichas_tecnicas_custo 
ON fichas_tecnicas(produto_id, custo_calculado);

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_receitas_empresa_mes 
ON mv_receitas_mensais(empresa_id, mes_referencia);

/*
==================================================
PRONTO! Problema dos índices CONCURRENTLY resolvido
==================================================
*/ 