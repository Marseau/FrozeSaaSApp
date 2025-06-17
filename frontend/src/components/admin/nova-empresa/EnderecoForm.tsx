
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { NovaEmpresaForm } from './types';
import { formatCep } from '@/lib/formatters';
import { buscarCep } from '@/lib/cep-api';
import { toast } from 'sonner';
import { Search } from 'lucide-react';

interface EnderecoFormProps {
  form: UseFormReturn<NovaEmpresaForm>;
}

const EnderecoForm = ({ form }: EnderecoFormProps) => {
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [cepPreenchido, setCepPreenchido] = useState(false);

  const handleCepChange = (value: string, onChange: (value: string) => void) => {
    const formatted = formatCep(value);
    onChange(formatted);
    setCepPreenchido(false);
  };

  const buscarEnderecoPorCep = async () => {
    const cep = form.getValues('cep');
    if (!cep || cep.length < 9) {
      toast.error('Digite um CEP válido');
      return;
    }

    setBuscandoCep(true);
    try {
      const dadosCep = await buscarCep(cep);
      if (dadosCep) {
        form.setValue('logradouro', dadosCep.logradouro);
        form.setValue('bairro', dadosCep.bairro);
        form.setValue('cidade', dadosCep.localidade);
        form.setValue('estado', dadosCep.uf);
        setCepPreenchido(true);
        toast.success('Endereço preenchido automaticamente');
        
        // Focar no campo número
        setTimeout(() => {
          document.getElementById('numero')?.focus();
        }, 100);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao buscar CEP');
    } finally {
      setBuscandoCep(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Endereço</h3>
      
      <div className="flex gap-2">
        <FormField
          control={form.control}
          name="cep"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>CEP *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="00000-000" 
                  value={field.value || ''}
                  onChange={(e) => handleCepChange(e.target.value, field.onChange)}
                  maxLength={9}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex items-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={buscarEnderecoPorCep}
            disabled={buscandoCep || !form.getValues('cep')}
            className="h-10"
          >
            <Search className="h-4 w-4" />
            {buscandoCep ? 'Buscando...' : 'Buscar'}
          </Button>
        </div>
      </div>

      <FormField
        control={form.control}
        name="logradouro"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Logradouro *</FormLabel>
            <FormControl>
              <Input 
                placeholder="Rua, Avenida, etc." 
                {...field} 
                disabled={cepPreenchido}
                className={cepPreenchido ? 'bg-gray-100' : ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="numero"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número *</FormLabel>
              <FormControl>
                <Input 
                  id="numero"
                  placeholder="123" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="complemento"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Complemento</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Apto, Sala, etc. (opcional)" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="bairro"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Bairro" 
                  {...field} 
                  disabled={cepPreenchido}
                  className={cepPreenchido ? 'bg-gray-100' : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Cidade" 
                  {...field} 
                  disabled={cepPreenchido}
                  className={cepPreenchido ? 'bg-gray-100' : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="SP" 
                  {...field} 
                  disabled={cepPreenchido}
                  className={cepPreenchido ? 'bg-gray-100' : ''}
                  maxLength={2}
                  style={{ textTransform: 'uppercase' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default EnderecoForm;
