
-- 1. Remover as políticas RLS problemáticas existentes da tabela admins_plataforma
DROP POLICY IF EXISTS "Super admins can view all admin data" ON public.admins_plataforma;
DROP POLICY IF EXISTS "Super admins can manage admin data" ON public.admins_plataforma;
DROP POLICY IF EXISTS "Admins can view their own data" ON public.admins_plataforma;

-- 2. Criar função SECURITY DEFINER para verificar se usuário é admin da plataforma
CREATE OR REPLACE FUNCTION public.is_platform_admin(user_auth_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins_plataforma
    WHERE auth_id = user_auth_id
      AND ativo = true
  );
$$;

-- 3. Criar função SECURITY DEFINER para verificar se usuário é super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_auth_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins_plataforma
    WHERE auth_id = user_auth_id
      AND ativo = true
      AND super_admin = true
  );
$$;

-- 4. Recriar políticas RLS para admins_plataforma usando as funções seguras
CREATE POLICY "Platform admins can view admin data"
  ON public.admins_plataforma
  FOR SELECT
  USING (public.is_platform_admin(auth.uid()));

CREATE POLICY "Super admins can manage admin data"
  ON public.admins_plataforma
  FOR ALL
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Users can insert themselves as admin"
  ON public.admins_plataforma
  FOR INSERT
  WITH CHECK (auth_id = auth.uid());

-- 5. Atualizar política da tabela empresas para usar a função segura
DROP POLICY IF EXISTS "Platform admins can view all companies" ON public.empresas;
DROP POLICY IF EXISTS "Platform admins can manage companies" ON public.empresas;

CREATE POLICY "Platform admins can view all companies"
  ON public.empresas
  FOR SELECT
  USING (public.is_platform_admin(auth.uid()));

CREATE POLICY "Platform admins can manage companies"
  ON public.empresas
  FOR ALL
  USING (public.is_platform_admin(auth.uid()));
