
import { z } from 'zod';
import { empresaValidationSchema } from '@/lib/validations';

export type NovaEmpresaForm = z.infer<typeof empresaValidationSchema>;

export interface CepData {
  cep: string;
  logradouro: string;
  complemento?: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export interface Plano {
  id: string;
  nome: string;
  mensalidade: number;
  cobranca_variavel?: boolean;
  percentual_receita?: number;
  ativo: boolean;
}

export interface NovaEmpresaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}
