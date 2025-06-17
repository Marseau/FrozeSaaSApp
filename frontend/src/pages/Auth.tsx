
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

const Auth = () => {
  const [mode, setMode] = useState<'choice' | 'login' | 'signup'>('choice');

  if (mode === 'login') {
    return <LoginForm onBack={() => setMode('choice')} />;
  }

  if (mode === 'signup') {
    return <SignupForm onBack={() => setMode('choice')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Comida Congelada
          </h1>
          <p className="text-gray-600">
            Escolha como deseja acessar a plataforma
          </p>
        </div>

        <div className="space-y-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setMode('login')}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Users className="text-green-600" size={24} />
                <span>Fazer Login</span>
              </CardTitle>
              <CardDescription>
                Já possui uma conta? Acesse sua empresa aqui
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setMode('signup')}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Building2 className="text-orange-500" size={24} />
                <span>Cadastrar Empresa</span>
              </CardTitle>
              <CardDescription>
                Nova empresa? Cadastre-se e comece a vender
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Sistema completo para venda de comida congelada
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
