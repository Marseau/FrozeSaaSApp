
-- Criar tabela para templates de email
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  assunto TEXT NOT NULL,
  template_html TEXT NOT NULL,
  template_texto TEXT NOT NULL,
  variaveis_disponiveis TEXT[] DEFAULT ARRAY[]::TEXT[],
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Criar política para admins da plataforma lerem templates
CREATE POLICY "Admins podem visualizar templates de email" 
  ON public.email_templates 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.admins_plataforma 
      WHERE auth_id = auth.uid() AND ativo = true
    )
  );

-- Criar política para admins da plataforma gerenciarem templates
CREATE POLICY "Admins podem gerenciar templates de email" 
  ON public.email_templates 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.admins_plataforma 
      WHERE auth_id = auth.uid() AND ativo = true
    )
  );

-- Inserir template padrão para boas-vindas de empresas
INSERT INTO public.email_templates (
  nome,
  assunto,
  template_html,
  template_texto,
  variaveis_disponiveis
) VALUES (
  'boas_vindas_empresa',
  'Bem-vindo à nossa plataforma! Complete seu cadastro',
  '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo!</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }
        .content { padding: 20px 0; }
        .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        .footer { font-size: 12px; color: #666; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Bem-vindo à nossa plataforma!</h1>
        </div>
        
        <div class="content">
            <h2>Olá, {{nome_empresa}}!</h2>
            
            <p>Estamos muito felizes em tê-los conosco! Seu plano foi ativado com sucesso e agora você pode aproveitar todos os recursos da nossa plataforma.</p>
            
            <h3>📋 Detalhes da sua assinatura:</h3>
            <ul>
                <li><strong>Mensalidade:</strong> R$ {{mensalidade}}</li>
                <li><strong>Percentual sobre receita:</strong> {{percentual}}%</li>
            </ul>
            
            <p>Para começar a usar a plataforma, complete seu cadastro clicando no botão abaixo:</p>
            
            <div style="text-align: center;">
                <a href="{{link_cadastro}}" class="button">Completar Cadastro</a>
            </div>
            
            <p><strong>⚠️ Importante:</strong> Este link é válido por 24 horas. Caso expire, entre em contato conosco para gerar um novo link.</p>
            
            <h3>🚀 Próximos passos:</h3>
            <ol>
                <li>Complete seu cadastro usando o link acima</li>
                <li>Configure sua empresa na plataforma</li>
                <li>Comece a gerenciar seus produtos e pedidos</li>
            </ol>
            
            <p>Se tiver alguma dúvida, nossa equipe de suporte está sempre disponível para ajudar!</p>
            
            <p>Bem-vindos a bordo! 🎉</p>
        </div>
        
        <div class="footer">
            <p>Este email foi enviado automaticamente. Se você não esperava receber este email, pode ignorá-lo com segurança.</p>
            <p>© 2024 Nossa Plataforma. Todos os direitos reservados.</p>
        </div>
    </div>
</body>
</html>',
  'Olá {{nome_empresa}}!

Bem-vindos à nossa plataforma! 🎉

Seu plano foi ativado com sucesso:
- Mensalidade: R$ {{mensalidade}}
- Percentual sobre receita: {{percentual}}%

Para completar seu cadastro, acesse: {{link_cadastro}}

⚠️ Este link é válido por 24 horas.

Próximos passos:
1. Complete seu cadastro
2. Configure sua empresa
3. Comece a usar a plataforma

Qualquer dúvida, estamos aqui para ajudar!

Bem-vindos a bordo!

---
© 2024 Nossa Plataforma',
  ARRAY['nome_empresa', 'link_cadastro', 'mensalidade', 'percentual']
) ON CONFLICT (nome) DO UPDATE SET
  assunto = EXCLUDED.assunto,
  template_html = EXCLUDED.template_html,
  template_texto = EXCLUDED.template_texto,
  variaveis_disponiveis = EXCLUDED.variaveis_disponiveis,
  atualizado_em = now();
