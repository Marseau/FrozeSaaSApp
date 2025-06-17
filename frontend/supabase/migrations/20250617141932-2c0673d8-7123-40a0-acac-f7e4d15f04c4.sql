
-- Criar tabela para gerenciar convites de cadastro
CREATE TABLE convites_cadastro (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'usado', 'expirado')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE
);

-- Criar índices para performance
CREATE INDEX idx_convites_token ON convites_cadastro(token);
CREATE INDEX idx_convites_email ON convites_cadastro(email);
CREATE INDEX idx_convites_status ON convites_cadastro(status);
