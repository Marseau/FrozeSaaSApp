
-- Criar função para automaticamente criar admin da plataforma quando um usuário se cadastra
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Inserir o novo usuário como admin da plataforma
  INSERT INTO public.admins_plataforma (auth_id, nome, email, super_admin, ativo)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome_responsavel', NEW.email),
    NEW.email,
    true, -- Por padrão, fazer super_admin
    true
  );
  RETURN NEW;
END;
$$;

-- Criar trigger para executar a função quando um usuário é criado
CREATE OR REPLACE TRIGGER on_auth_user_created_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_admin_user();
