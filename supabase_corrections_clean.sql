/*
==================================================
CORRECOES E MELHORIAS PARA O SCHEMA SUPABASE
Baseado na validacao do brainstorm vs schema gerado
==================================================
*/

/*
==================================================
1. CORRECOES CRITICAS (OBRIGATORIAS)
==================================================
*/

/* CORRECAO 1: Criar sequencias para numeracao de pedidos por empresa */
CREATE OR REPLACE FUNCTION criar_sequencia_empresa(empresa_uuid UUID)
RETURNS void AS $$
DECLARE
    seq_name text;
BEGIN
    seq_name := 'seq_pedido_' || replace(empresa_uuid::text, '-', '_');
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_class 
        WHERE relname = seq_name AND relkind = 'S'
    ) THEN
        EXECUTE 'CREATE SEQUENCE ' || seq_name || ' START 1';
    END IF;
END;
$$ LANGUAGE plpgsql;

/* Corrigir funcao de geracao de numero do pedido */
CREATE OR REPLACE FUNCTION gerar_numero_pedido()
RETURNS TRIGGER AS $$
DECLARE
    seq_name text;
    numero_seq integer;
BEGIN
    PERFORM criar_sequencia_empresa(NEW.empresa_id);
    
    seq_name := 'seq_pedido_' || replace(NEW.empresa_id::text, '-', '_');
    
    EXECUTE 'SELECT nextval($1)' INTO numero_seq USING seq_name;
    
    NEW.numero_pedido = 'PED' || TO_CHAR(NEW.criado_em, 'YYYYMMDD') || LPAD(numero_seq::text, 4, '0');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

/* Ativar trigger para geracao automatica de numero do pedido */
CREATE TRIGGER trigger_gerar_numero_pedido
    BEFORE INSERT ON pedidos
    FOR EACH ROW
    EXECUTE FUNCTION gerar_numero_pedido();

/* CORRECAO 2: Melhorar estrutura de tipos de venda */
CREATE TYPE tipo_venda_produto AS ENUM ('unidade', 'peso');

ALTER TABLE produtos 
ADD COLUMN tipo_venda_produto tipo_venda_produto DEFAULT 'unidade',
ADD COLUMN unidade_especifica unidade_medida DEFAULT 'unidade';

UPDATE produtos SET 
    tipo_venda_produto = 'peso',
    unidade_especifica = tipo_venda
WHERE tipo_venda IN ('kg', 'g');

UPDATE produtos SET 
    tipo_venda_produto = 'unidade',
    unidade_especifica = tipo_venda
WHERE tipo_venda NOT IN ('kg', 'g');

/*
==================================================
2. MELHORIAS DE PERFORMANCE
==================================================
*/

/* MELHORIA 1: Campos calculados para custos e margens */
ALTER TABLE produtos 
ADD COLUMN custo_total NUMERIC(10,2) DEFAULT 0,
ADD COLUMN margem_lucro NUMERIC(5,2) DEFAULT 0,
ADD COLUMN margem_valor NUMERIC(10,2) DEFAULT 0;

/* Funcao para recalcular custos do produto */
CREATE OR REPLACE FUNCTION recalcular_custo_produto(produto_uuid UUID)
RETURNS void AS $$
DECLARE
    novo_custo NUMERIC(10,2);
    preco_atual NUMERIC(10,2);
    nova_margem_valor NUMERIC(10,2);
    nova_margem_percentual NUMERIC(5,2);
BEGIN
    SELECT COALESCE(SUM(ft.custo_calculado), 0)
    INTO novo_custo
    FROM fichas_tecnicas ft
    WHERE ft.produto_id = produto_uuid;
    
    SELECT preco_venda INTO preco_atual
    FROM produtos WHERE id = produto_uuid;
    
    nova_margem_valor := preco_atual - novo_custo;
    nova_margem_percentual := CASE 
        WHEN preco_atual > 0 THEN (nova_margem_valor / preco_atual * 100)
        ELSE 0 
    END;
    
    UPDATE produtos SET 
        custo_total = novo_custo,
        margem_valor = nova_margem_valor,
        margem_lucro = nova_margem_percentual
    WHERE id = produto_uuid;
END;
$$ LANGUAGE plpgsql;

/* Trigger para atualizar custos quando ficha tecnica muda */
CREATE OR REPLACE FUNCTION trigger_atualizar_custo_produto()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        PERFORM recalcular_custo_produto(NEW.produto_id);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM recalcular_custo_produto(OLD.produto_id);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_fichas_tecnicas_custo
    AFTER INSERT OR UPDATE OR DELETE ON fichas_tecnicas
    FOR EACH ROW
    EXECUTE FUNCTION trigger_atualizar_custo_produto();

/* MELHORIA 2: Integrar estoque diretamente na tabela produtos */
ALTER TABLE produtos 
ADD COLUMN estoque_atual NUMERIC(10,3) DEFAULT 0,
ADD COLUMN estoque_minimo NUMERIC(10,3) DEFAULT 0,
ADD COLUMN estoque_maximo NUMERIC(10,3),
ADD COLUMN ponto_pedido NUMERIC(10,3),
ADD COLUMN ultimo_movimento TIMESTAMP DEFAULT now();

/* Migrar dados da tabela estoques para produtos */
UPDATE produtos p SET 
    estoque_atual = COALESCE(e.quantidade_atual, 0),
    estoque_minimo = COALESCE(e.estoque_minimo, 0),
    estoque_maximo = e.estoque_maximo,
    ponto_pedido = e.ponto_pedido,
    ultimo_movimento = COALESCE(e.atualizado_em, now())
FROM estoques e 
WHERE p.id = e.produto_id;

/* Funcao melhorada para movimentacao de estoque */
CREATE OR REPLACE FUNCTION movimentar_estoque(
    produto_uuid UUID,
    tipo_movimento TEXT,
    quantidade_movimento NUMERIC(10,3),
    observacao_movimento TEXT DEFAULT NULL,
    usuario_movimento UUID DEFAULT NULL
)
RETURNS boolean AS $$
DECLARE
    estoque_anterior NUMERIC(10,3);
    estoque_novo NUMERIC(10,3);
BEGIN
    IF tipo_movimento NOT IN ('entrada', 'saida', 'ajuste') THEN
        RAISE EXCEPTION 'Tipo de movimento invalido: %', tipo_movimento;
    END IF;
    
    SELECT estoque_atual INTO estoque_anterior
    FROM produtos WHERE id = produto_uuid;
    
    CASE tipo_movimento
        WHEN 'entrada' THEN
            estoque_novo := estoque_anterior + quantidade_movimento;
        WHEN 'saida' THEN
            estoque_novo := estoque_anterior - quantidade_movimento;
        WHEN 'ajuste' THEN
            estoque_novo := quantidade_movimento;
    END CASE;
    
    IF estoque_novo < 0 THEN
        RAISE EXCEPTION 'Estoque nao pode ficar negativo. Atual: %, Movimento: %', 
            estoque_anterior, quantidade_movimento;
    END IF;
    
    UPDATE produtos SET 
        estoque_atual = estoque_novo,
        ultimo_movimento = now()
    WHERE id = produto_uuid;
    
    INSERT INTO movimentacoes_estoque (
        produto_id, tipo, quantidade, quantidade_anterior, 
        observacao, usuario_id
    ) VALUES (
        produto_uuid, tipo_movimento, quantidade_movimento, 
        estoque_anterior, observacao_movimento, usuario_movimento
    );
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;

/*
==================================================
3. VALIDACOES DE REGRAS DE NEGOCIO
==================================================
*/

/* VALIDACAO 1: Controle de planos e usuarios */
CREATE OR REPLACE FUNCTION validar_limite_usuarios()
RETURNS TRIGGER AS $$
DECLARE
    total_usuarios INTEGER;
    limite_plano INTEGER;
    plano_empresa plano_nome;
BEGIN
    SELECT p.nome, p.max_usuarios
    INTO plano_empresa, limite_plano
    FROM empresas e
    JOIN assinaturas a ON e.id = a.empresa_id AND a.status = 'ativa'
    JOIN planos p ON a.plano_id = p.id
    WHERE e.id = NEW.empresa_id;
    
    SELECT COUNT(*)
    INTO total_usuarios
    FROM usuarios_empresas
    WHERE empresa_id = NEW.empresa_id AND ativo = true;
    
    IF TG_OP = 'INSERT' THEN
        total_usuarios := total_usuarios + 1;
    END IF;
    
    IF total_usuarios > limite_plano THEN
        RAISE EXCEPTION 'Plano % permite maximo % usuarios. Atual: %', 
            plano_empresa, limite_plano, total_usuarios;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validar_limite_usuarios
    BEFORE INSERT OR UPDATE ON usuarios_empresas
    FOR EACH ROW
    EXECUTE FUNCTION validar_limite_usuarios();

/* VALIDACAO 2: Cobranca automatica de 5% sobre receita */
ALTER TABLE faturas ADD CONSTRAINT check_percentual_receita 
CHECK (
    (aplicou_percentual = FALSE) OR 
    (aplicou_percentual = TRUE AND receita_empresa >= 5000)
);

/* Funcao para calcular fatura mensal automatica */
CREATE OR REPLACE FUNCTION gerar_fatura_mensal(
    empresa_uuid UUID, 
    mes_ref DATE
)
RETURNS UUID AS $$
DECLARE
    receita_mensal NUMERIC(10,2);
    valor_mensalidade NUMERIC(10,2);
    valor_percentual NUMERIC(10,2) := 0;
    valor_total NUMERIC(10,2);
    limite_receita NUMERIC(10,2);
    percentual_plano NUMERIC(5,2);
    aplicar_percentual BOOLEAN := false;
    nova_fatura_id UUID;
    assinatura_ativa UUID;
BEGIN
    SELECT a.id, p.mensalidade, p.limite_receita_mensal, p.percentual_receita
    INTO assinatura_ativa, valor_mensalidade, limite_receita, percentual_plano
    FROM assinaturas a
    JOIN planos p ON a.plano_id = p.id
    WHERE a.empresa_id = empresa_uuid AND a.status = 'ativa'
    LIMIT 1;
    
    SELECT COALESCE(SUM(valor_total), 0)
    INTO receita_mensal
    FROM pedidos
    WHERE empresa_id = empresa_uuid 
      AND status = 'entregue'
      AND DATE_TRUNC('month', criado_em) = DATE_TRUNC('month', mes_ref);
    
    IF receita_mensal > limite_receita AND limite_receita IS NOT NULL THEN
        aplicar_percentual := true;
        valor_percentual := receita_mensal * (percentual_plano / 100);
    END IF;
    
    valor_total := valor_mensalidade + valor_percentual;
    
    INSERT INTO faturas (
        assinatura_id, mes_referencia, valor, receita_empresa,
        aplicou_percentual, vencimento
    ) VALUES (
        assinatura_ativa, mes_ref, valor_total, receita_mensal,
        aplicar_percentual, mes_ref + INTERVAL '1 month'
    ) RETURNING id INTO nova_fatura_id;
    
    RETURN nova_fatura_id;
END;
$$ LANGUAGE plpgsql;

/*
==================================================
4. OTIMIZACOES ESTRUTURAIS
==================================================
*/

/* Indices adicionais para performance */
CREATE INDEX IF NOT EXISTS idx_produtos_empresa_ativo_estoque 
ON produtos(empresa_id, status) 
WHERE status = 'ativo' AND estoque_atual <= estoque_minimo;

CREATE INDEX IF NOT EXISTS idx_pedidos_mes_status 
ON pedidos(empresa_id, DATE_TRUNC('month', criado_em), status) 
WHERE status = 'entregue';

CREATE INDEX IF NOT EXISTS idx_fichas_tecnicas_custo 
ON fichas_tecnicas(produto_id, custo_calculado);

/* View materializada para receitas mensais */
CREATE MATERIALIZED VIEW mv_receitas_mensais AS
SELECT 
    e.id as empresa_id,
    e.nome as empresa_nome,
    DATE_TRUNC('month', p.criado_em) as mes_referencia,
    COUNT(p.id) as total_pedidos,
    SUM(p.valor_total) as receita_total,
    AVG(p.valor_total) as ticket_medio,
    COUNT(DISTINCT p.cliente_id) as clientes_unicos,
    MAX(p.criado_em) as ultima_atualizacao
FROM empresas e
LEFT JOIN pedidos p ON e.id = p.empresa_id AND p.status = 'entregue'
WHERE p.criado_em >= CURRENT_DATE - INTERVAL '24 months'
GROUP BY e.id, e.nome, DATE_TRUNC('month', p.criado_em);

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_receitas_empresa_mes 
ON mv_receitas_mensais(empresa_id, mes_referencia);

/* Funcao para atualizar view materializada */
CREATE OR REPLACE FUNCTION refresh_receitas_mensais()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_receitas_mensais;
END;
$$ LANGUAGE plpgsql;

/* Funcao para soft delete universal */
CREATE OR REPLACE FUNCTION soft_delete_record(
    tabela TEXT,
    record_id UUID
)
RETURNS boolean AS $$
BEGIN
    EXECUTE format('UPDATE %I SET ativo = false WHERE id = $1', tabela) 
    USING record_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

/*
==================================================
5. DADOS INICIAIS CORRIGIDOS
==================================================
*/

/* Atualizar dados dos planos com valores corretos */
UPDATE planos SET 
    preco_inicial = 0.00,
    mensalidade = 250.00,
    limite_receita_mensal = NULL,
    percentual_receita = NULL
WHERE nome = 'simples';

UPDATE planos SET 
    preco_inicial = 0.00,
    mensalidade = 500.00,
    limite_receita_mensal = 5000.00,
    percentual_receita = 5.00
WHERE nome = 'pro';

/*
==================================================
6. CONFIGURACOES DE SEGURANCA (RLS)
==================================================
*/

/* Habilitar RLS nas tabelas principais */
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes_finais ENABLE ROW LEVEL SECURITY;

/* Politica para empresas */
CREATE POLICY empresa_access_policy ON empresas
    FOR ALL USING (
        id IN (
            SELECT ue.empresa_id 
            FROM usuarios_empresas ue 
            JOIN usuarios u ON ue.usuario_id = u.id 
            WHERE u.auth_id = auth.uid() AND ue.ativo = true
        )
    );

/* Politica para produtos */
CREATE POLICY produto_empresa_policy ON produtos
    FOR ALL USING (
        empresa_id IN (
            SELECT ue.empresa_id 
            FROM usuarios_empresas ue 
            JOIN usuarios u ON ue.usuario_id = u.id 
            WHERE u.auth_id = auth.uid() AND ue.ativo = true
        )
    );

/*
==================================================
FIM DAS CORRECOES
==================================================
*/ 