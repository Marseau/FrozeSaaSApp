
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import ClientLoginForm from '@/components/auth/ClientLoginForm';

const ClientAuth = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <ShoppingCart className="text-green-600" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Área do Cliente
          </h1>
          <p className="text-gray-600">
            Faça seus pedidos de comida congelada
          </p>
        </div>

        <ClientLoginForm />

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Acesse para fazer pedidos e acompanhar entregas
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientAuth;
