
import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, UserPlus } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdminPermissionCheck = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading } = useAdminAuth();
  const { user } = useAuth();
  const [addingAdmin, setAddingAdmin] = useState(false);

  const handleAddAsAdmin = async () => {
    if (!user) return;
    
    setAddingAdmin(true);
    
    try {
      const { error } = await supabase
        .from('admins_plataforma')
        .insert({
          auth_id: user.id,
          nome: user.email || 'Admin',
          email: user.email || '',
          super_admin: true,
          ativo: true
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('Você já está cadastrado como admin.');
        } else {
          console.error('Erro ao adicionar admin:', error);
          toast.error('Erro ao adicionar como admin. Tente novamente.');
        }
      } else {
        toast.success('Você foi adicionado como admin da plataforma!');
        // Recarregar a página para atualizar as permissões
        window.location.reload();
      }
    } catch (error) {
      console.error('Erro ao adicionar admin:', error);
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setAddingAdmin(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Verificando permissões...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <Alert className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Você precisa estar logado para acessar esta área.
        </AlertDescription>
      </Alert>
    );
  }

  if (!isAdmin) {
    return (
      <Alert className="m-4">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-4">
            <div>
              <p className="font-medium">Você não tem permissões de administrador da plataforma.</p>
              <p className="text-sm text-gray-600 mt-1">
                ID do usuário: {user.id}
              </p>
              <p className="text-sm text-gray-600">
                Email: {user.email}
              </p>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm font-medium text-blue-800 mb-2">
                Solução rápida:
              </p>
              <p className="text-sm text-blue-700 mb-3">
                Se você é o primeiro usuário do sistema, pode se adicionar como administrador clicando no botão abaixo.
              </p>
              <Button
                onClick={handleAddAsAdmin}
                disabled={addingAdmin}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {addingAdmin ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adicionando...
                  </>
                ) : (
                  <>
                    <UserPlus size={16} className="mr-2" />
                    Me adicionar como Admin
                  </>
                )}
              </Button>
            </div>

            <div className="text-xs text-gray-500 border-t pt-3">
              <p className="font-medium">Informações técnicas:</p>
              <ol className="list-decimal list-inside mt-1 space-y-1">
                <li>Certifique-se de estar cadastrado na tabela admins_plataforma</li>
                <li>Verifique se o campo 'ativo' está como true</li>
                <li>Confirme que o auth_id corresponde ao seu ID de usuário</li>
              </ol>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};

export default AdminPermissionCheck;
