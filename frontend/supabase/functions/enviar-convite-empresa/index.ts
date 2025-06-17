
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConviteEmailRequest {
  empresa_id: string;
  nome_empresa: string;
  email: string;
  token: string;
  mensalidade: number;
  percentual: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { empresa_id, nome_empresa, email, token, mensalidade, percentual }: ConviteEmailRequest = await req.json();

    console.log('Iniciando envio de email para:', { nome_empresa, email, token });

    // Criar cliente Supabase para buscar template
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Buscar template de email
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('nome', 'boas_vindas_empresa')
      .eq('ativo', true)
      .single();

    if (templateError || !template) {
      console.error('Erro ao buscar template:', templateError);
      throw new Error('Template de email não encontrado');
    }

    console.log('Template encontrado:', template.nome);

    // Gerar link de cadastro correto
    const frontendUrl = 'https://froze-saa-s-app.vercel.app';
    const link_cadastro = `${frontendUrl}/cadastro-empresa?token=${token}`;
    
    console.log('Link de cadastro gerado:', link_cadastro);

    // Substituir variáveis no template
    let htmlContent = template.template_html
      .replace(/\{\{nome_empresa\}\}/g, nome_empresa)
      .replace(/\{\{link_cadastro\}\}/g, link_cadastro)
      .replace(/\{\{mensalidade\}\}/g, mensalidade.toFixed(2))
      .replace(/\{\{percentual\}\}/g, percentual.toString());

    let textContent = template.template_texto
      .replace(/\{\{nome_empresa\}\}/g, nome_empresa)
      .replace(/\{\{link_cadastro\}\}/g, link_cadastro)
      .replace(/\{\{mensalidade\}\}/g, mensalidade.toFixed(2))
      .replace(/\{\{percentual\}\}/g, percentual.toString());

    console.log('Enviando email via Resend...');

    // Enviar email
    const emailResponse = await resend.emails.send({
      from: "Sua Plataforma <onboarding@resend.dev>",
      to: [email],
      subject: template.assunto,
      html: htmlContent,
      text: textContent,
    });

    console.log("Email enviado com sucesso:", emailResponse);

    // Registrar log do envio
    const { error: logError } = await supabase
      .from('logs_usuarios')
      .insert({
        acao: 'envio_email_convite',
        tabela_afetada: 'convites_cadastro',
        registro_id: empresa_id,
        dados_novos: {
          email_enviado: true,
          email_id: emailResponse.data?.id,
          destinatario: email,
          template_usado: 'boas_vindas_empresa',
          link_gerado: link_cadastro
        }
      });

    if (logError) {
      console.error('Erro ao registrar log:', logError);
    }

    return new Response(JSON.stringify({
      success: true,
      email_id: emailResponse.data?.id,
      message: 'Email enviado com sucesso'
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Erro no envio de email:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        details: error.toString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
