
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { NovaEmpresaForm } from './types';
import { formatPhone } from '@/lib/formatters';

interface DadosEmpresaFormProps {
  form: UseFormReturn<NovaEmpresaForm>;
}

const DadosEmpresaForm = ({ form }: DadosEmpresaFormProps) => {
  const handlePhoneChange = (value: string, onChange: (value: string) => void) => {
    const formatted = formatPhone(value);
    onChange(formatted);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Dados da Empresa</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Empresa *</FormLabel>
              <FormControl>
                <Input placeholder="Nome da empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email de Contato *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@empresa.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="telefone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone/Celular</FormLabel>
            <FormControl>
              <Input 
                placeholder="(11) 99999-9999" 
                value={field.value || ''}
                onChange={(e) => handlePhoneChange(e.target.value, field.onChange)}
                maxLength={15}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DadosEmpresaForm;
