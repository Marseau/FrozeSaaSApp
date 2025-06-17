-- =================================================================
-- SISTEMA MULTIEMPRESA PARA VENDA DE COMIDA CONGELADA
-- Backend completo para Supabase/PostgreSQL
-- =================================================================

-- =================================================================
-- ENUMS (Tipos enumerados)
-- =================================================================

-- Tipos de usuários
CREATE TYPE tipo_usuario AS ENUM ('admin', 'encarregado');

-- Status dos pedidos
CREATE TYPE status_pedido AS ENUM ('recebido', 'em_preparo', 'pronto', 'em_entrega', 'entregue', 'cancelado');

-- Tipo de produto
CREATE TYPE tipo_produto AS ENUM ('prato_pronto', 'proteina', 'acompanhamento', 'sobremesa', 'combo');

-- Unidade de medida
CREATE TYPE unidade_medida AS ENUM ('unidade', 'kg', 'g', 'ml', 'l', 'pacote');

-- Tipo de pagamento
CREATE TYPE tipo_pagamento AS ENUM ('pix', 'stripe');

-- Status do pagamento
CREATE TYPE status_pagamento AS ENUM ('pendente', 'pago', 'atrasado', 'falhou');

-- Tipo de notificação
CREATE TYPE tipo_notificacao AS ENUM ('email', 'push', 'sms', 'whatsapp');

-- Status da notificação
CREATE TYPE status_notificacao AS ENUM ('enviado', 'erro', 'pendente');

-- Método de entrega
CREATE TYPE metodo_entrega AS ENUM ('entrega_manha', 'entrega_tarde', 'retirada');

-- Status da assinatura
CREATE TYPE status_assinatura AS ENUM ('ativa', 'cancelada', 'expirada');

-- Nome do plano
CREATE TYPE plano_nome AS ENUM ('simples', 'pro');

-- Dia da semana
CREATE TYPE dia_semana AS ENUM ('segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo');

-- Tipo de custo
CREATE TYPE tipo_custo AS ENUM ('fixo', 'variavel');

-- Status do produto
CREATE TYPE status_produto AS ENUM ('ativo', 'inativo', 'esgotado');

-- Status da entrega
CREATE TYPE status_entrega AS ENUM ('agendada', 'em_rota', 'entregue', 'falha');

-- Período do dia
CREATE TYPE periodo_dia AS ENUM ('manha', 'tarde');

-- =================================================================
-- TABELAS PRINCIPAIS
-- =================================================================

-- Tabela de planos (limitado e ilimitado)
CREATE TABLE planos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome plano_nome UNIQUE NOT NULL,
    preco_inicial NUMERIC(10,2) NOT NULL,
    mensalidade NUMERIC(10,2) NOT NULL,
    percentual_receita NUMERIC(5,2), -- para plano pro se ultrapassar limite
    limite_receita_mensal NUMERIC(10,2), -- R$ 5000 para aplicar 5%
    max_usuarios INTEGER, -- 1 para simples, 3 para pro
    descricao TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT now()
);

-- Tabela de empresas (multitenancy)
CREATE TABLE empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefone TEXT,
    endereco TEXT,
    cep TEXT,
    logo_url TEXT,
    cor_primaria TEXT DEFAULT '#FF7F00',
    cor_secundaria TEXT,
    descricao TEXT,
    frase_destaque TEXT,
    stripe_account_id TEXT UNIQUE, -- para receber pagamentos
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT now()
);

-- Assinaturas das empresas
CREATE TABLE assinaturas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    plano_id UUID REFERENCES planos(id),
    data_inicio DATE NOT NULL,
    data_fim DATE,
    status status_assinatura DEFAULT 'ativa',
    metodo_pagamento tipo_pagamento,
    criado_em TIMESTAMP DEFAULT now()
);

-- Faturas mensais
CREATE TABLE faturas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assinatura_id UUID REFERENCES assinaturas(id) ON DELETE CASCADE,
    mes_referencia DATE NOT NULL,
    valor NUMERIC(10,2) NOT NULL,
    receita_empresa NUMERIC(10,2), -- receita da empresa no mês
    aplicou_percentual BOOLEAN DEFAULT FALSE,
    status status_pagamento DEFAULT 'pendente',
    vencimento DATE,
    pago_em TIMESTAMP,
    criado_em TIMESTAMP DEFAULT now()
);

-- Usuários do sistema (admins e encarregados)
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE, -- vinculo com Supabase Auth
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefone TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT now()
);

-- Relacionamento usuários-empresas com perfis
CREATE TABLE usuarios_empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    perfil tipo_usuario NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT now(),
    UNIQUE(usuario_id, empresa_id)
);

-- Clientes finais (consumidores)
CREATE TABLE clientes_finais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    endereco_entrega TEXT,
    cep TEXT,
    observacoes TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT now()
);

-- Preferências dos clientes
CREATE TABLE preferencias_clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES clientes_finais(id) ON DELETE CASCADE,
    receber_notificacoes BOOLEAN DEFAULT TRUE,
    preferencia_entrega metodo_entrega,
    alergias TEXT,
    observacoes TEXT,
    criado_em TIMESTAMP DEFAULT now()
);

-- Fornecedores
CREATE TABLE fornecedores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    cnpj TEXT,
    email TEXT,
    telefone TEXT,
    endereco TEXT,
    contato_responsavel TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT now()
);

-- Insumos (matérias-primas)
CREATE TABLE insumos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    descricao TEXT,
    unidade unidade_medida NOT NULL,
    preco_unitario NUMERIC(10,4) NOT NULL,
    fornecedor_id UUID REFERENCES fornecedores(id) ON DELETE SET NULL,
    estoque_atual NUMERIC(10,3) DEFAULT 0,
    estoque_minimo NUMERIC(10,3),
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT now()
);

-- Categorias de produtos
CREATE TABLE categorias_produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    descricao TEXT,
    imagem_url TEXT,
    ordem INTEGER DEFAULT 1,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT now()
);

-- Produtos
CREATE TABLE produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    categoria_id UUID REFERENCES categorias_produtos(id) ON DELETE SET NULL,
    nome TEXT NOT NULL,
    descricao TEXT,
    tipo tipo_produto,
    preco_venda NUMERIC(10,2) NOT NULL,
    tipo_venda unidade_medida NOT NULL, -- kg ou unidade
    peso_medio NUMERIC(10,3), -- para produtos vendidos por unidade
    tempo_preparo INTEGER, -- em minutos
    status status_produto DEFAULT 'ativo',
    criado_em TIMESTAMP DEFAULT now()
);

-- Imagens dos produtos
CREATE TABLE produto_imagens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    is_capa BOOLEAN DEFAULT FALSE,
    ordem INTEGER DEFAULT 1,
    criado_em TIMESTAMP DEFAULT now()
);

-- Ficha técnica (produtos x insumos)
CREATE TABLE fichas_tecnicas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE,
    insumo_id UUID REFERENCES insumos(id) ON DELETE CASCADE,
    quantidade NUMERIC(10,4) NOT NULL,
    custo_calculado NUMERIC(10,4), -- quantidade * preco_unitario do insumo
    criado_em TIMESTAMP DEFAULT now(),
    UNIQUE(produto_id, insumo_id)
);

-- Estoque de produtos prontos
CREATE TABLE estoques (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE,
    quantidade_atual NUMERIC(10,3) DEFAULT 0,
    estoque_minimo NUMERIC(10,3) DEFAULT 0,
    estoque_maximo NUMERIC(10,3),
    ponto_pedido NUMERIC(10,3),
    atualizado_em TIMESTAMP DEFAULT now()
);

-- Movimentações de estoque
CREATE TABLE movimentacoes_estoque (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE,
    tipo TEXT CHECK (tipo IN ('entrada', 'saida', 'ajuste')) NOT NULL,
    quantidade NUMERIC(10,3) NOT NULL,
    quantidade_anterior NUMERIC(10,3),
    observacao TEXT,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    criado_em TIMESTAMP DEFAULT now()
);

-- Configuração de entregas por empresa
CREATE TABLE calendario_entregas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    dia_semana dia_semana NOT NULL,
    periodo periodo_dia NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT now(),
    UNIQUE(empresa_id, dia_semana, periodo)
);

-- Feriados e bloqueios de entrega
CREATE TABLE feriados_empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    data DATE NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMP DEFAULT now()
);

-- Carrinho temporário
CREATE TABLE carrinhos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES clientes_finais(id) ON DELETE CASCADE,
    sessao_id TEXT, -- para clientes não logados
    expirado_em TIMESTAMP,
    criado_em TIMESTAMP DEFAULT now()
);

-- Itens do carrinho
CREATE TABLE itens_carrinho (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    carrinho_id UUID REFERENCES carrinhos(id) ON DELETE CASCADE,
    produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE,
    quantidade NUMERIC(10,3) NOT NULL,
    preco_unitario NUMERIC(10,2), -- preço no momento da adição
    criado_em TIMESTAMP DEFAULT now()
);

-- Pedidos
CREATE TABLE pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    cliente_id UUID REFERENCES clientes_finais(id) ON DELETE SET NULL,
    numero_pedido TEXT UNIQUE, -- gerado automaticamente
    status status_pedido DEFAULT 'recebido',
    valor_produtos NUMERIC(10,2) NOT NULL,
    valor_frete NUMERIC(10,2) DEFAULT 0,
    valor_total NUMERIC(10,2) NOT NULL,
    desconto NUMERIC(10,2) DEFAULT 0,
    forma_pagamento tipo_pagamento,
    endereco_entrega TEXT,
    observacoes TEXT,
    data_entrega_solicitada DATE,
    periodo_entrega periodo_dia,
    criado_em TIMESTAMP DEFAULT now()
);

-- Itens do pedido
CREATE TABLE itens_pedido (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE,
    quantidade NUMERIC(10,3) NOT NULL,
    preco_unitario NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    criado_em TIMESTAMP DEFAULT now()
);

-- Entregas agendadas
CREATE TABLE entregas_agendadas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
    data_entrega DATE NOT NULL,
    periodo periodo_dia,
    endereco TEXT,
    status status_entrega DEFAULT 'agendada',
    entregador TEXT,
    observacoes TEXT,
    entregue_em TIMESTAMP,
    criado_em TIMESTAMP DEFAULT now()
);

-- Pagamentos
CREATE TABLE pagamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
    valor NUMERIC(10,2) NOT NULL,
    metodo tipo_pagamento NOT NULL,
    status status_pagamento DEFAULT 'pendente',
    referencia_externa TEXT, -- ID do Stripe, código Pix, etc
    confirmado_em TIMESTAMP,
    criado_em TIMESTAMP DEFAULT now()
);

-- Promoções
CREATE TABLE promocoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    descricao TEXT,
    tipo TEXT CHECK (tipo IN ('percentual', 'valor_fixo', 'frete_gratis')) NOT NULL,
    valor_desconto NUMERIC(10,2),
    percentual_desconto NUMERIC(5,2),
    valor_minimo_pedido NUMERIC(10,2),
    quantidade_minima INTEGER,
    data_inicio DATE,
    data_fim DATE,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT now()
);

-- Cupons de desconto
CREATE TABLE cupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promocao_id UUID REFERENCES promocoes(id) ON DELETE CASCADE,
    codigo TEXT UNIQUE NOT NULL,
    usado_por UUID REFERENCES clientes_finais(id) ON DELETE SET NULL,
    usado_em TIMESTAMP,
    criado_em TIMESTAMP DEFAULT now()
);

-- Custos operacionais
CREATE TABLE custos_operacionais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    descricao TEXT,
    valor NUMERIC(10,2) NOT NULL,
    tipo tipo_custo NOT NULL,
    data_referencia DATE,
    recorrente BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT now()
);

-- Fretes calculados (cache para Google Maps)
CREATE TABLE fretes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    cep_origem TEXT NOT NULL,
    cep_destino TEXT NOT NULL,
    distancia_km NUMERIC(10,2),
    tempo_estimado INTEGER, -- em minutos
    valor_base NUMERIC(10,2),
    valor_final NUMERIC(10,2), -- base + 20%
    calculado_em TIMESTAMP DEFAULT now()
);

-- Avaliações de produtos/pedidos
CREATE TABLE avaliacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES clientes_finais(id) ON DELETE CASCADE,
    produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE,
    pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
    nota INTEGER CHECK (nota >= 1 AND nota <= 5) NOT NULL,
    comentario TEXT,
    criado_em TIMESTAMP DEFAULT now()
);

-- Notificações
CREATE TABLE notificacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    cliente_id UUID REFERENCES clientes_finais(id) ON DELETE CASCADE,
    tipo tipo_notificacao NOT NULL,
    titulo TEXT NOT NULL,
    conteudo TEXT,
    lida BOOLEAN DEFAULT FALSE,
    enviada BOOLEAN DEFAULT FALSE,
    status status_notificacao DEFAULT 'pendente',
    enviado_em TIMESTAMP,
    criado_em TIMESTAMP DEFAULT now()
);

-- Logs de auditoria
CREATE TABLE logs_usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    acao TEXT NOT NULL,
    tabela_afetada TEXT,
    registro_id UUID,
    dados_anteriores JSONB,
    dados_novos JSONB,
    ip_origem INET,
    user_agent TEXT,
    criado_em TIMESTAMP DEFAULT now()
);

-- =================================================================
-- VIEWS PARA RELATÓRIOS E DASHBOARDS
-- =================================================================

-- View para margem de lucro por produto
CREATE VIEW view_margem_produtos AS
SELECT 
    p.id,
    p.nome,
    p.preco_venda,
    COALESCE(SUM(ft.custo_calculado), 0) as custo_total,
    p.preco_venda - COALESCE(SUM(ft.custo_calculado), 0) as lucro_bruto,
    CASE 
        WHEN p.preco_venda > 0 THEN 
            ((p.preco_venda - COALESCE(SUM(ft.custo_calculado), 0)) / p.preco_venda * 100)
        ELSE 0 
    END as margem_percentual
FROM produtos p
LEFT JOIN fichas_tecnicas ft ON p.id = ft.produto_id
WHERE p.status = 'ativo'
GROUP BY p.id, p.nome, p.preco_venda;

-- View para receita mensal por empresa
CREATE VIEW view_receita_mensal_empresa AS
SELECT 
    e.id as empresa_id,
    e.nome as empresa_nome,
    DATE_TRUNC('month', p.criado_em) as mes,
    SUM(p.valor_total) as receita_total,
    COUNT(p.id) as total_pedidos
FROM empresas e
LEFT JOIN pedidos p ON e.id = p.empresa_id AND p.status = 'entregue'
GROUP BY e.id, e.nome, DATE_TRUNC('month', p.criado_em);

-- View para produtos com estoque baixo
CREATE VIEW view_produtos_estoque_baixo AS
SELECT 
    p.id,
    p.nome,
    p.empresa_id,
    e.quantidade_atual,
    e.estoque_minimo,
    e.ponto_pedido
FROM produtos p
JOIN estoques e ON p.id = e.produto_id
WHERE e.quantidade_atual <= e.estoque_minimo 
   OR e.quantidade_atual <= e.ponto_pedido;

-- =================================================================
-- ÍNDICES PARA PERFORMANCE
-- =================================================================

-- Índices para consultas frequentes
CREATE INDEX idx_empresas_ativo ON empresas(ativo);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_auth_id ON usuarios(auth_id);
CREATE INDEX idx_produtos_empresa_status ON produtos(empresa_id, status);
CREATE INDEX idx_pedidos_empresa_status ON pedidos(empresa_id, status);
CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_data ON pedidos(criado_em);
CREATE INDEX idx_itens_pedido_produto ON itens_pedido(produto_id);
CREATE INDEX idx_estoque_produto ON estoques(produto_id);
CREATE INDEX idx_fichas_tecnicas_produto ON fichas_tecnicas(produto_id);
CREATE INDEX idx_movimentacoes_produto_data ON movimentacoes_estoque(produto_id, criado_em);
CREATE INDEX idx_entregas_data ON entregas_agendadas(data_entrega);
CREATE INDEX idx_pagamentos_pedido ON pagamentos(pedido_id);
CREATE INDEX idx_avaliacoes_produto ON avaliacoes(produto_id);
CREATE INDEX idx_notificacoes_cliente ON notificacoes(cliente_id, lida);
CREATE INDEX idx_logs_usuario_data ON logs_usuarios(usuario_id, criado_em);

-- =================================================================
-- DADOS INICIAIS
-- =================================================================

-- Inserir planos padrão
INSERT INTO planos (nome, preco_inicial, mensalidade, limite_receita_mensal, percentual_receita, max_usuarios, descricao) VALUES
('simples', 2500.00, 250.00, NULL, NULL, 1, 'Plano básico para pequenos empreendedores'),
('pro', 4500.00, 500.00, 5000.00, 5.00, 3, 'Plano avançado com recursos completos e cobrança de 5% sobre receita acima de R$ 5.000');

-- =================================================================
-- TRIGGERS E FUNÇÕES (OPCIONAL)
-- =================================================================

-- Função para gerar número do pedido
CREATE OR REPLACE FUNCTION gerar_numero_pedido()
RETURNS TRIGGER AS $$
BEGIN
    NEW.numero_pedido = 'PED' || TO_CHAR(NEW.criado_em, 'YYYYMMDD') || LPAD(NEXTVAL('seq_pedido_' || NEW.empresa_id::text), 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar estoque após pedido
CREATE OR REPLACE FUNCTION atualizar_estoque_pedido()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE estoques 
        SET quantidade_atual = quantidade_atual - NEW.quantidade,
            atualizado_em = NOW()
        WHERE produto_id = NEW.produto_id;
        
        INSERT INTO movimentacoes_estoque (produto_id, tipo, quantidade, observacao)
        VALUES (NEW.produto_id, 'saida', NEW.quantidade, 'Saída por pedido #' || (SELECT numero_pedido FROM pedidos WHERE id = NEW.pedido_id));
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar número do pedido
-- CREATE TRIGGER trigger_gerar_numero_pedido
--     BEFORE INSERT ON pedidos
--     FOR EACH ROW
--     EXECUTE FUNCTION gerar_numero_pedido();

-- Trigger para atualizar estoque
CREATE TRIGGER trigger_atualizar_estoque
    AFTER INSERT ON itens_pedido
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_estoque_pedido();

-- =================================================================
-- COMENTÁRIOS NAS TABELAS
-- =================================================================

COMMENT ON TABLE empresas IS 'Empresas cadastradas no sistema multiempresa';
COMMENT ON TABLE usuarios IS 'Usuários do sistema (admins e encarregados)';
COMMENT ON TABLE clientes_finais IS 'Clientes finais que fazem pedidos';
COMMENT ON TABLE produtos IS 'Produtos vendidos pelas empresas';
COMMENT ON TABLE pedidos IS 'Pedidos realizados pelos clientes';
COMMENT ON TABLE fichas_tecnicas IS 'Composição de produtos com insumos e custos';
COMMENT ON TABLE estoques IS 'Controle de estoque dos produtos';
COMMENT ON TABLE calendario_entregas IS 'Configuração de dias e horários de entrega por empresa';
COMMENT ON TABLE assinaturas IS 'Controle de planos e pagamentos das empresas';

-- =================================================================
-- FIM DO SCRIPT
-- =================================================================