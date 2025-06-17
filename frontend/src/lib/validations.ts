
import { z } from 'zod';

export const empresaValidationSchema = z.object({
  nome: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo'),
  email: z.string()
    .email('Email inválido'),
  telefone: z.string()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Formato de telefone inválido'),
  cep: z.string()
    .regex(/^\d{5}-\d{3}$/, 'CEP deve estar no formato 00000-000'),
  logradouro: z.string()
    .min(5, 'Logradouro deve ter pelo menos 5 caracteres'),
  numero: z.string()
    .min(1, 'Número é obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string()
    .min(2, 'Bairro deve ter pelo menos 2 caracteres'),
  cidade: z.string()
    .min(2, 'Cidade deve ter pelo menos 2 caracteres'),
  estado: z.string()
    .length(2, 'Estado deve ter 2 caracteres'),
  plano_id: z.string()
    .min(1, 'Selecione um plano'),
  valor_pago: z.string()
    .min(1, 'Valor pago é obrigatório'),
  data_pagamento: z.date(),
  forma_pagamento: z.enum(['pix', 'cartao_credito', 'cartao_debito', 'transferencia', 'boleto']),
  periodo_meses: z.enum(['1', '3', '6', '12'])
});
