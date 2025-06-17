
-- Criar tabela para administradores da plataforma
CREATE TABLE public.admins_plataforma (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  super_admin BOOLEAN DEFAULT false,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.admins_plataforma ENABLE ROW LEVEL SECURITY;

-- Política para admins verem apenas seus próprios dados
CREATE POLICY "Admins can view their own data" 
  ON public.admins_plataforma 
  FOR SELECT 
  USING (auth.uid() = auth_id);

-- Política para super admins verem todos os dados
CREATE POLICY "Super admins can view all admin data" 
  ON public.admins_plataforma 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.admins_plataforma 
      WHERE auth_id = auth.uid() AND super_admin = true
    )
  );

-- Adicionar coluna para identificar o tipo de auth na tabela usuarios se necessário
-- (Opcional - podemos identificar pelo contexto das tabelas relacionadas)

-- Criar função para identificar tipo de usuário
CREATE OR REPLACE FUNCTION public.get_user_type(user_auth_id UUID)
RETURNS TEXT AS $$
BEGIN
  -- Verificar se é admin da plataforma
  IF EXISTS (SELECT 1 FROM public.admins_plataforma WHERE auth_id = user_auth_id AND ativo = true) THEN
    RETURN 'admin_plataforma';
  END IF;
  
  -- Verificar se é usuário de empresa
  IF EXISTS (SELECT 1 FROM public.usuarios WHERE auth_id = user_auth_id AND ativo = true) THEN
    RETURN 'empresa';
  END IF;
  
  -- Se não for nenhum dos acima, assumir que é cliente final
  -- (clientes_finais não têm auth_id, são identificados por sessão/email)
  RETURN 'cliente_final';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
