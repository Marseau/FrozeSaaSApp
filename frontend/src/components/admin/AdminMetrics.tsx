
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, DollarSign, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MetricsData {
  totalEmpresas: number;
  empresasAtivas: number;
  receitaMensal: number;
  totalUsuarios: number;
}

const AdminMetrics = () => {
  const [metrics, setMetrics] = useState<MetricsData>({
    totalEmpresas: 0,
    empresasAtivas: 0,
    receitaMensal: 0,
    totalUsuarios: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      // Buscar total de empresas
      const { count: totalEmpresas } = await supabase
        .from('empresas')
        .select('*', { count: 'exact', head: true });

      // Buscar empresas ativas
      const { count: empresasAtivas } = await supabase
        .from('empresas')
        .select('*', { count: 'exact', head: true })
        .eq('ativo', true);

      // Buscar receita do mês atual
      const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const { data: receitaData } = await supabase
        .from('pedidos')
        .select('valor_total')
        .eq('status', 'entregue')
        .gte('criado_em', inicioMes.toISOString());

      const receitaMensal = receitaData?.reduce((sum, pedido) => sum + Number(pedido.valor_total), 0) || 0;

      // Buscar total de usuários
      const { count: totalUsuarios } = await supabase
        .from('usuarios')
        .select('*', { count: 'exact', head: true })
        .eq('ativo', true);

      setMetrics({
        totalEmpresas: totalEmpresas || 0,
        empresasAtivas: empresasAtivas || 0,
        receitaMensal,
        totalUsuarios: totalUsuarios || 0
      });
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carregando...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Empresas</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalEmpresas}</div>
          <p className="text-xs text-muted-foreground">
            {metrics.empresasAtivas} ativas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(metrics.receitaMensal)}</div>
          <p className="text-xs text-muted-foreground">
            Mês atual
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalUsuarios}</div>
          <p className="text-xs text-muted-foreground">
            Total na plataforma
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Ativação</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.totalEmpresas > 0 
              ? Math.round((metrics.empresasAtivas / metrics.totalEmpresas) * 100) 
              : 0}%
          </div>
          <p className="text-xs text-muted-foreground">
            Empresas ativas vs total
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMetrics;
