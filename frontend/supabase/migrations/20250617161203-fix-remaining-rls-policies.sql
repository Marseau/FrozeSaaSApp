
-- Atualizar políticas RLS para usar as novas funções seguras

-- Políticas para a tabela empresas (já atualizadas na migração anterior, mas garantindo consistência)
DROP POLICY IF EXISTS "Admins plataforma podem visualizar empresas" ON public.empresas;
DROP POLICY IF EXISTS "Admins plataforma podem inserir empresas" ON public.empresas;
DROP POLICY IF EXISTS "Admins plataforma podem atualizar empresas" ON public.empresas;
DROP POLICY IF EXISTS "Admins plataforma podem deletar empresas" ON public.empresas;

-- Recriar políticas da tabela empresas com nomes consistentes
CREATE POLICY "Platform admins can view companies"
  ON public.empresas
  FOR SELECT
  USING (public.is_platform_admin(auth.uid()));

CREATE POLICY "Platform admins can insert companies"
  ON public.empresas
  FOR INSERT
  WITH CHECK (public.is_platform_admin(auth.uid()));

CREATE POLICY "Platform admins can update companies"
  ON public.empresas
  FOR UPDATE
  USING (public.is_platform_admin(auth.uid()));

CREATE POLICY "Platform admins can delete companies"
  ON public.empresas
  FOR DELETE
  USING (public.is_platform_admin(auth.uid()));

-- Atualizar políticas para assinaturas
DROP POLICY IF EXISTS "Admins plataforma podem gerenciar assinaturas" ON public.assinaturas;

CREATE POLICY "Platform admins can manage subscriptions"
  ON public.assinaturas
  FOR ALL
  USING (public.is_platform_admin(auth.uid()));

-- Atualizar políticas para faturas
DROP POLICY IF EXISTS "Admins plataforma podem gerenciar faturas" ON public.faturas;

CREATE POLICY "Platform admins can manage invoices"
  ON public.faturas
  FOR ALL
  USING (public.is_platform_admin(auth.uid()));

-- Atualizar políticas para convites_cadastro
DROP POLICY IF EXISTS "Admins plataforma podem gerenciar convites" ON public.convites_cadastro;

CREATE POLICY "Platform admins can manage invites"
  ON public.convites_cadastro
  FOR ALL
  USING (public.is_platform_admin(auth.uid()));

-- Atualizar políticas para planos
DROP POLICY IF EXISTS "Admins plataforma podem gerenciar planos" ON public.planos;

CREATE POLICY "Platform admins can manage plans"
  ON public.planos
  FOR ALL
  USING (public.is_platform_admin(auth.uid()));
