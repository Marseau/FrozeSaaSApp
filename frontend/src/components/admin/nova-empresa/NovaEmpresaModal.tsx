
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { NovaEmpresaForm, NovaEmpresaModalProps, Plano } from './types';
import { empresaValidationSchema } from '@/lib/validations';
import DadosEmpresaForm from './DadosEmpresaForm';
import EnderecoForm from './EnderecoForm';
import PlanosPagamentoForm from './PlanosPagamentoForm';

const NovaEmpresaModal = ({ open, onOpenChange, onSuccess }: NovaEmpresaModalProps) => {
  const [loading, setLoading] = useState(false);
  const [planos, setPlanos] = useState<Plano[]>([]);

  const form = useForm<NovaEmpresaForm>({
    resolver: zodResolver(empresaValidationSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      plano_id: '',
      valor_pago: '',
      data_pagamento: new Date(),
      forma_pagamento: 'pix',
      periodo_meses: '12'
    }
  });

  React.useEffect(() => {
    if (open) {
      fetchPlanos();
    }
  }, [open]);

  const fetchPlanos = async () => {
    try {
      const { data, error } = await supabase
        .from('planos')
        .select('*')
        .eq('ativo', true)
        .order('mensalidade', { ascending: true });

      if (error) throw error;
      setPlanos(data || []);
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
      toast.error('Erro ao carregar planos');
    }
  };

  const enviarEmailBoasVindas = async (empresa: any, token: string, plano: any) => {
    try {
      const { error } = await supabase.functions.invoke('enviar-convite-empresa', {
        body: {
          empresa_id: empresa.id,
          nome_empresa: empresa.nome,
          email: empresa.email,
          token: token,
          mensalidade: plano.mensalidade,
          percentual: plano.percentual_receita || 0
        }
      });

      if (error) {
        console.error('Erro ao enviar email:', error);
        toast.error('Empresa criada, mas erro ao enviar email de boas-vindas');
      } else {
        toast.success('Empresa criada e email de boas-vindas enviado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      toast.error('Empresa criada, mas erro ao enviar email de boas-vindas');
    }
  };

  // Map form payment methods to database payment methods
  const mapPaymentMethod = (formMethod: string): 'pix' | 'stripe' => {
    switch (formMethod) {
      case 'pix':
        return 'pix';
      case 'cartao_credito':
      case 'cartao_debito':
      case 'transferencia':
      case 'boleto':
        return 'stripe';
      default:
        return 'pix';
    }
  };

  const onSubmit = async (data: NovaEmpresaForm) => {
    setLoading(true);
    try {
      // 1. Buscar dados do plano selecionado
      const planoSelecionado = planos.find(p => p.id === data.plano_id);
      if (!planoSelecionado) {
        throw new Error('Plano não encontrado');
      }

      // 2. Construir endereço completo
      const enderecoCompleto = `${data.logradouro}, ${data.numero}${data.complemento ? `, ${data.complemento}` : ''}, ${data.bairro}, ${data.cidade} - ${data.estado}, CEP: ${data.cep}`;

      // 3. Criar empresa
      const { data: empresa, error: empresaError } = await supabase
        .from('empresas')
        .insert({
          nome: data.nome,
          email: data.email,
          telefone: data.telefone,
          endereco: enderecoCompleto,
          cep: data.cep.replace(/\D/g, ''),
          ativo: true
        })
        .select()
        .single();

      if (empresaError) throw empresaError;

      // 4. Criar assinatura
      const dataInicio = new Date();
      const dataFim = new Date();
      dataFim.setMonth(dataFim.getMonth() + parseInt(data.periodo_meses));

      const { data: assinatura, error: assinaturaError } = await supabase
        .from('assinaturas')
        .insert({
          empresa_id: empresa.id,
          plano_id: data.plano_id,
          data_inicio: dataInicio.toISOString().split('T')[0],
          data_fim: dataFim.toISOString().split('T')[0],
          status: 'ativa',
          metodo_pagamento: mapPaymentMethod(data.forma_pagamento)
        })
        .select()
        .single();

      if (assinaturaError) throw assinaturaError;

      // 5. Criar fatura paga
      const valorNumerico = parseFloat(data.valor_pago.replace(/[^\d,]/g, '').replace(',', '.'));
      
      const { error: faturaError } = await supabase
        .from('faturas')
        .insert({
          assinatura_id: assinatura.id,
          mes_referencia: dataInicio.toISOString().split('T')[0],
          valor: valorNumerico,
          status: 'pago',
          pago_em: data.data_pagamento.toISOString(),
          vencimento: dataInicio.toISOString().split('T')[0]
        });

      if (faturaError) throw faturaError;

      // 6. Criar convite de cadastro
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { error: conviteError } = await supabase
        .from('convites_cadastro')
        .insert({
          empresa_id: empresa.id,
          email: data.email,
          token: token,
          expires_at: expiresAt.toISOString()
        });

      if (conviteError) throw conviteError;

      // 7. Enviar email de boas-vindas
      await enviarEmailBoasVindas(empresa, token, planoSelecionado);

      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      toast.error('Erro ao criar empresa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Empresa</DialogTitle>
          <DialogDescription>
            Cadastre uma nova empresa com plano e pagamento confirmado. Um email especial de boas-vindas será enviado automaticamente.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DadosEmpresaForm form={form} />
            
            <div className="border-t pt-4">
              <EnderecoForm form={form} />
            </div>
            
            <div className="border-t pt-4">
              <PlanosPagamentoForm form={form} planos={planos} />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Criando e Enviando Email de Boas-Vindas...' : 'Criar Empresa e Enviar Boas-Vindas'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NovaEmpresaModal;
