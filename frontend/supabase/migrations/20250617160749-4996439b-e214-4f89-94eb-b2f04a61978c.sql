
-- Criar políticas RLS para a tabela empresas

-- Política para admins da plataforma poderem fazer SELECT
CREATE POLICY "Admins plataforma podem visualizar empresas" 
  ON public.empresas 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.admins_plataforma 
      WHERE auth_id = auth.uid() AND ativo = true
    )
  );

-- Política para admins da plataforma poderem fazer INSERT
CREATE POLICY "Admins plataforma podem inserir empresas" 
  ON public.empresas 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins_plataforma 
      WHERE auth_id = auth.uid() AND ativo = true
    )
  );

-- Política para admins da plataforma poderem fazer UPDATE
CREATE POLICY "Admins plataforma podem atualizar empresas" 
  ON public.empresas 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.admins_plataforma 
      WHERE auth_id = auth.uid() AND ativo = true
    )
  );

-- Política para admins da plataforma poderem fazer DELETE
CREATE POLICY "Admins plataforma podem deletar empresas" 
  ON public.empresas 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.admins_plataforma 
      WHERE auth_id = auth.uid() AND ativo = true
    )
  );

-- Política para usuários de empresa poderem visualizar apenas sua própria empresa
CREATE POLICY "Usuarios podem visualizar sua empresa" 
  ON public.empresas 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios u
      JOIN public.usuarios_empresas ue ON u.id = ue.usuario_id
      WHERE u.auth_id = auth.uid() 
        AND ue.empresa_id = empresas.id 
        AND u.ativo = true 
        AND ue.ativo = true
    )
  );
