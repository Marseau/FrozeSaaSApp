
-- Políticas RLS para a tabela assinaturas
CREATE POLICY "Admins plataforma podem gerenciar assinaturas" 
  ON public.assinaturas 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.admins_plataforma 
      WHERE auth_id = auth.uid() AND ativo = true
    )
  );

CREATE POLICY "Usuarios podem visualizar assinatura da sua empresa" 
  ON public.assinaturas 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios u
      JOIN public.usuarios_empresas ue ON u.id = ue.usuario_id
      WHERE u.auth_id = auth.uid() 
        AND ue.empresa_id = assinaturas.empresa_id 
        AND u.ativo = true 
        AND ue.ativo = true
    )
  );

-- Políticas RLS para a tabela faturas
CREATE POLICY "Admins plataforma podem gerenciar faturas" 
  ON public.faturas 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.admins_plataforma 
      WHERE auth_id = auth.uid() AND ativo = true
    )
  );

CREATE POLICY "Usuarios podem visualizar faturas da sua empresa" 
  ON public.faturas 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios u
      JOIN public.usuarios_empresas ue ON u.id = ue.usuario_id
      JOIN public.assinaturas a ON ue.empresa_id = a.empresa_id
      WHERE u.auth_id = auth.uid() 
        AND a.id = faturas.assinatura_id 
        AND u.ativo = true 
        AND ue.ativo = true
    )
  );

-- Políticas RLS para a tabela convites_cadastro
CREATE POLICY "Admins plataforma podem gerenciar convites" 
  ON public.convites_cadastro 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.admins_plataforma 
      WHERE auth_id = auth.uid() AND ativo = true
    )
  );

-- Políticas RLS para a tabela planos (somente leitura para todos autenticados)
CREATE POLICY "Usuarios autenticados podem visualizar planos" 
  ON public.planos 
  FOR SELECT 
  TO authenticated
  USING (ativo = true);

CREATE POLICY "Admins plataforma podem gerenciar planos" 
  ON public.planos 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.admins_plataforma 
      WHERE auth_id = auth.uid() AND ativo = true
    )
  );
