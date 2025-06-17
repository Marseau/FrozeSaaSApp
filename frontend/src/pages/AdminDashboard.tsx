
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, DollarSign, Users, TrendingUp } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminMetrics from '@/components/admin/AdminMetrics';
import AdminEmpresasList from '@/components/admin/AdminEmpresasList';
import AdminFaturamento from '@/components/admin/AdminFaturamento';
import AdminRelatorios from '@/components/admin/AdminRelatorios';
import AdminPermissionCheck from '@/components/admin/AdminPermissionCheck';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <AdminPermissionCheck>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Painel Administrativo
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie empresas, assinaturas e monitore o desempenho da plataforma
            </p>
          </div>

          <AdminMetrics />

          <div className="mt-8">
            <Tabs defaultValue="empresas" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="empresas" className="flex items-center space-x-2">
                  <Building2 size={16} />
                  <span>Empresas</span>
                </TabsTrigger>
                <TabsTrigger value="faturamento" className="flex items-center space-x-2">
                  <DollarSign size={16} />
                  <span>Faturamento</span>
                </TabsTrigger>
                <TabsTrigger value="relatorios" className="flex items-center space-x-2">
                  <TrendingUp size={16} />
                  <span>Relatórios</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="empresas">
                <AdminEmpresasList />
              </TabsContent>

              <TabsContent value="faturamento">
                <AdminFaturamento />
              </TabsContent>

              <TabsContent value="relatorios">
                <AdminRelatorios />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </AdminPermissionCheck>
    </div>
  );
};

export default AdminDashboard;
