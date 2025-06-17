
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Mail, Users, Calendar, Eye, Edit } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { toast } from 'sonner';
import { NovaEmpresaModal } from './nova-empresa';
import ConvitesModal from './ConvitesModal';

const AdminEmpresasList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNovaEmpresaModal, setShowNovaEmpresaModal] = useState(false);
  const [showConvitesModal, setShowConvitesModal] = useState(false);

  const { data: empresas, refetch, isLoading } = useQuery({
    queryKey: ['empresas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const toggleEmpresaStatus = async (id: string, ativo: boolean) => {
    try {
      const { error } = await supabase
        .from('empresas')
        .update({ ativo: !ativo })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`Empresa ${!ativo ? 'ativada' : 'desativada'} com sucesso`);
      refetch();
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      toast.error('Erro ao atualizar status da empresa');
    }
  };

  const filteredEmpresas = empresas?.filter(empresa =>
    empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando empresas...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Users size={20} />
              <span>Empresas Cadastradas</span>
            </CardTitle>
            <CardDescription>
              Gerencie todas as empresas da plataforma
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={() => setShowConvitesModal(true)}
              variant="outline"
              size="sm"
            >
              <Mail className="h-4 w-4 mr-2" />
              Convites
            </Button>
            <Button 
              onClick={() => setShowNovaEmpresaModal(true)}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Empresa
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Buscar empresas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmpresas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Nenhuma empresa encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmpresas.map((empresa) => (
                  <TableRow key={empresa.id}>
                    <TableCell>{empresa.nome}</TableCell>
                    <TableCell>{empresa.email}</TableCell>
                    <TableCell>{empresa.telefone}</TableCell>
                    <TableCell>{empresa.endereco}</TableCell>
                    <TableCell>
                      <Badge variant={empresa.ativo ? "default" : "secondary"}>
                        {empresa.ativo ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(empresa.criado_em), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye size={16} className="mr-1" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit size={16} className="mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant={empresa.ativo ? "destructive" : "default"}
                        size="sm"
                        onClick={() => toggleEmpresaStatus(empresa.id, empresa.ativo)}
                      >
                        {empresa.ativo ? 'Desativar' : 'Ativar'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <NovaEmpresaModal
        open={showNovaEmpresaModal}
        onOpenChange={setShowNovaEmpresaModal}
        onSuccess={() => {
          refetch();
          setShowNovaEmpresaModal(false);
        }}
      />

      <ConvitesModal
        open={showConvitesModal}
        onOpenChange={setShowConvitesModal}
      />
    </Card>
  );
};

export default AdminEmpresasList;
