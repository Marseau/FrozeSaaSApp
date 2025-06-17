
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, FileText, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminRelatorios = () => {
  const [receitaData, setReceitaData] = useState([]);
  const [empresasData, setEmpresasData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelatoriosData();
  }, []);

  const fetchRelatoriosData = async () => {
    try {
      // Dados de receita mensal dos últimos 6 meses
      const { data: receitaData } = await supabase
        .from('view_receita_mensal_empresa')
        .select('*')
        .order('mes', { ascending: true })
        .limit(6);

      // Processar dados para o gráfico
      const processedReceita = receitaData?.reduce((acc: any[], item: any) => {
        const mesAno = new Date(item.mes).toLocaleDateString('pt-BR', { 
          month: 'short', 
          year: 'numeric' 
        });
        
        const existing = acc.find(d => d.mes === mesAno);
        if (existing) {
          existing.receita += Number(item.receita_total);
        } else {
          acc.push({
            mes: mesAno,
            receita: Number(item.receita_total)
          });
        }
        return acc;
      }, []) || [];

      setReceitaData(processedReceita);

      // Dados de empresas por status
      const { data: empresasAtivas } = await supabase
        .from('empresas')
        .select('ativo')
        .eq('ativo', true);

      const { data: empresasInativas } = await supabase
        .from('empresas')
        .select('ativo')
        .eq('ativo', false);

      setEmpresasData([
        { name: 'Ativas', value: empresasAtivas?.length || 0, color: '#10b981' },
        { name: 'Inativas', value: empresasInativas?.length || 0, color: '#f59e0b' }
      ]);

    } catch (error) {
      console.error('Erro ao buscar dados dos relatórios:', error);
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
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Carregando...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Relatórios e Análises</h2>
          <p className="text-gray-600">Insights sobre o desempenho da plataforma</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Exportar PDF
          </Button>
          <Button variant="outline">
            <FileText size={16} className="mr-2" />
            Exportar Excel
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp size={20} />
            <span>Receita Mensal</span>
          </CardTitle>
          <CardDescription>
            Evolução da receita total da plataforma nos últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={receitaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Receita']} />
                <Line 
                  type="monotone" 
                  dataKey="receita" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status das Empresas</CardTitle>
            <CardDescription>
              Distribuição de empresas ativas vs inativas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={empresasData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {empresasData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métricas Rápidas</CardTitle>
            <CardDescription>
              Indicadores importantes da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Taxa de Conversão</span>
              <span className="font-semibold">73%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Ticket Médio</span>
              <span className="font-semibold">R$ 89,50</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Pedidos/Mês</span>
              <span className="font-semibold">1.247</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Churn Rate</span>
              <span className="font-semibold text-red-600">5.2%</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">LTV Médio</span>
              <span className="font-semibold">R$ 2.340</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminRelatorios;
