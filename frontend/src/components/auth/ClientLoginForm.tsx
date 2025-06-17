
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShoppingCart, LogIn, UserPlus } from 'lucide-react';

const ClientLoginForm = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'register') {
        // Lógica para cadastrar cliente final
        // Por enquanto, apenas simular sucesso
        setSuccess('Cadastro realizado com sucesso! Você pode fazer login agora.');
        setMode('login');
      } else {
        // Lógica para login de cliente final
        // Por enquanto, apenas simular
        console.log('Login do cliente:', formData.email);
      }
    } catch (err) {
      setError('Erro interno. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ShoppingCart className="text-green-600" size={20} />
          <span>{mode === 'login' ? 'Login Cliente' : 'Cadastro Cliente'}</span>
        </CardTitle>
        <CardDescription>
          {mode === 'login' 
            ? 'Entre para fazer seus pedidos' 
            : 'Cadastre-se para começar a pedir'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          {mode === 'register' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço de entrega</Label>
                <Input
                  id="endereco"
                  type="text"
                  value={formData.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                  placeholder="Rua, número, bairro, CEP"
                  required
                />
              </div>
            </>
          )}

          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700" 
            disabled={loading}
          >
            {loading ? (
              mode === 'login' ? 'Entrando...' : 'Cadastrando...'
            ) : (
              <>
                {mode === 'login' ? (
                  <>
                    <LogIn size={16} className="mr-2" />
                    Entrar
                  </>
                ) : (
                  <>
                    <UserPlus size={16} className="mr-2" />
                    Cadastrar
                  </>
                )}
              </>
            )}
          </Button>

          <Button 
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' 
              ? 'Não tem conta? Cadastre-se' 
              : 'Já tem conta? Faça login'
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClientLoginForm;
