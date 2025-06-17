
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ConviteData {
  id: string;
  empresa_id: string;
  email: string;
  status: string;
  expires_at: string;
  empresas?: {
    nome: string;
    email: string;
  };
}

const CadastroEmpresa = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [conviteData, setConviteData] = useState<ConviteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    responsavel_nome: '',
    responsavel_email: '',
    senha: '',
    confirmar_senha: '',
    descricao: '',
    cor_primaria: '#FF7F00',
    cor_secundaria: '#333333',
    logo_url: ''
  });

  useEffect(() => {
    if (token) {
      validateToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const validateToken = async () => {
    try {
      // Buscar convite com dados da empresa
      const { data, error } = await supabase
        .from('convites_cadastro')
        .select(`
          *,
          empresas!inner(nome, email)
        `)
        .eq('token', token)
        .single();

      if (error || !data) {
        toast.error('Convite inválido ou expirado');
        navigate('/');
        return;
      }

      // Verificar se não expirou
      if (new Date(data.expires_at) < new Date()) {
        toast.error('Este convite expirou');
        navigate('/');
        return;
      }

      setConviteData(data);
      setFormData(prev => ({
        ...prev,
        responsavel_email: data.email
      }));
    } catch (error) {
      console.error('Erro ao validar token:', error);
      toast.error('Erro ao validar convite');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.senha !== formData.confirmar_senha) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (formData.senha.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.responsavel_email,
        password: formData.senha,
        options: {
          data: {
            nome: formData.responsavel_nome,
            empresa_id: conviteData?.empresa_id
          }
        }
      });

      if (authError) throw authError;

      // 2. Atualizar dados da empresa
      const { error: empresaError } = await supabase
        .from('empresas')
        .update({
          descricao: formData.descricao,
          cor_primaria: formData.cor_primaria,
          cor_secundaria: formData.cor_secundaria,
          logo_url: formData.logo_url || null
        })
        .eq('id', conviteData?.empresa_id);

      if (empresaError) throw empresaError;

      // 3. Criar usuário na tabela usuarios
      if (authData.user) {
        const { error: usuarioError } = await supabase
          .from('usuarios')
          .insert({
            auth_id: authData.user.id,
            nome: formData.responsavel_nome,
            email: formData.responsavel_email
          });

        if (usuarioError) console.log('Erro ao criar usuário:', usuarioError);

        // 4. Criar vínculo usuário-empresa
        const { error: vinculoError } = await supabase
          .from('usuarios_empresas')
          .insert({
            usuario_id: authData.user.id,
            empresa_id: conviteData?.empresa_id,
            perfil: 'admin'
          });

        if (vinculoError) console.log('Erro ao criar vínculo:', vinculoError);
      }

      // 5. Marcar convite como usado
      const { error: conviteError } = await supabase
        .from('convites_cadastro')
        .update({
          status: 'usado',
          used_at: new Date().toISOString()
        })
        .eq('id', conviteData?.id);

      if (conviteError) console.log('Erro ao atualizar convite:', conviteError);

      toast.success('Cadastro realizado com sucesso! Você pode fazer login agora.');
      navigate('/auth');

    } catch (error: any) {
      console.error('Erro ao finalizar cadastro:', error);
      toast.error(error.message || 'Erro ao finalizar cadastro');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Validando convite...</p>
        </div>
      </div>
    );
  }

  if (!token || !conviteData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Convite Inválido</CardTitle>
            <CardDescription>
              Este link de convite é inválido ou expirou.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Finalizar Cadastro da Empresa</CardTitle>
            <CardDescription>
              Complete o cadastro da empresa <strong>{conviteData.empresas?.nome || 'Nova Empresa'}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Alert>
                <AlertDescription>
                  Você está finalizando o cadastro para a empresa usando o email <strong>{conviteData.email}</strong>
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Dados do Responsável</h3>
                
                <div>
                  <Label htmlFor="responsavel_nome">Nome do Responsável *</Label>
                  <Input
                    id="responsavel_nome"
                    value={formData.responsavel_nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, responsavel_nome: e.target.value }))}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="responsavel_email">Email do Responsável *</Label>
                  <Input
                    id="responsavel_email"
                    type="email"
                    value={formData.responsavel_email}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="senha">Senha *</Label>
                    <Input
                      id="senha"
                      type="password"
                      value={formData.senha}
                      onChange={(e) => setFormData(prev => ({ ...prev, senha: e.target.value }))}
                      placeholder="Mínimo 6 caracteres"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmar_senha">Confirmar Senha *</Label>
                    <Input
                      id="confirmar_senha"
                      type="password"
                      value={formData.confirmar_senha}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmar_senha: e.target.value }))}
                      placeholder="Confirme sua senha"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Personalização da Empresa</h3>
                
                <div>
                  <Label htmlFor="descricao">Descrição da Empresa</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Descreva sua empresa, produtos ou serviços..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cor_primaria">Cor Primária</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="cor_primaria"
                        type="color"
                        value={formData.cor_primaria}
                        onChange={(e) => setFormData(prev => ({ ...prev, cor_primaria: e.target.value }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={formData.cor_primaria}
                        onChange={(e) => setFormData(prev => ({ ...prev, cor_primaria: e.target.value }))}
                        placeholder="#FF7F00"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cor_secundaria">Cor Secundária</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="cor_secundaria"
                        type="color"
                        value={formData.cor_secundaria}
                        onChange={(e) => setFormData(prev => ({ ...prev, cor_secundaria: e.target.value }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={formData.cor_secundaria}
                        onChange={(e) => setFormData(prev => ({ ...prev, cor_secundaria: e.target.value }))}
                        placeholder="#333333"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="logo_url">URL do Logo (opcional)</Label>
                  <Input
                    id="logo_url"
                    value={formData.logo_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                    placeholder="https://exemplo.com/logo.png"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? 'Finalizando Cadastro...' : 'Finalizar Cadastro'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CadastroEmpresa;
