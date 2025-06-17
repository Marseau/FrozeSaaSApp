
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Calendar, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Fatura {
  id: string;
  mes_referencia: string;
  valor: number;
  status: string;
  vencimento: string;
  criado_em: string;
  assinatura: {
    empresa: {
      nome: string;
    };
  };
}

const AdminFaturamento = () => {
  const [faturas, setFaturas] = useState<Fatura[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaturas();
  }, []);

  const fetchFaturas = async () => {
    try {
      const { data, error } = await supabase
        .from('faturas')
        .select(`
          *,
          assinatura:assinaturas(
            empresa:empresas(nome)
          )
        `)
        .order('criado_em', { ascending: false })
        .limit(20);

      if (error) throw error;
      setFaturas(data || []);
    } catch (error) {
      console.error('Erro ao buscar faturas:', error);
      toast.error('Erro ao carregar faturas');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago':
        return 'default';
      case 'pendente':
        return 'secondary';
      case 'vencido':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Carregando faturas...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Carregando resumo...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const resumoFaturamento = {
    totalPendente: faturas
      .filter(f => f.status === 'pendente')
      .reduce((sum, f) => sum + Number(f.valor), 0),
    totalPago: faturas
      .filter(f => f.status === 'pago')
      .reduce((sum, f) => sum + Number(f.valor), 0),
    faturasPendentes: faturas.filter(f => f.status === 'pendente').length
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Faturas Recentes</CardTitle>
          <CardDescription>
            Últimas 20 faturas geradas na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faturas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhuma fatura encontrada
              </div>
            ) : (
              faturas.map((fatura) => (
                <div
                  key={fatura.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900">
                        {fatura.assinatura?.empresa?.nome || 'Empresa não encontrada'}
                      </h3>
                      <Badge variant={getStatusColor(fatura.status)}>
                        {fatura.status === 'pago' ? 'Pago' : 
                         fatura.status === 'pendente' ? 'Pendente' : 'Vencido'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Referência: {new Date(fatura.mes_referencia).toLocaleDateString('pt-BR', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                    <p className="text-sm text-gray-500">
                      Vencimento: {new Date(fatura.vencimento).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(Number(fatura.valor))}
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      <FileText size={16} className="mr-1" />
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign size={20} />
              <span>Resumo Financeiro</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Total Pendente</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(resumoFaturamento.totalPendente)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Recebido</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(resumoFaturamento.totalPago)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Faturas Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">
                {resumoFaturamento.faturasPendentes}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar size={20} />
              <span>Ações Rápidas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="outline">
              Gerar Faturas do Mês
            </Button>
            <Button className="w-full" variant="outline">
              Exportar Relatório
            </Button>
            <Button className="w-full" variant="outline">
              Configurar Cobrança
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminFaturamento;
