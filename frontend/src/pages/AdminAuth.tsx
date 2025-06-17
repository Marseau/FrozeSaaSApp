
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import AdminLoginForm from '@/components/auth/AdminLoginForm';

const AdminAuth = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Shield className="text-blue-600" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Administração da Plataforma
          </h1>
          <p className="text-gray-600">
            Acesso restrito aos administradores do sistema
          </p>
        </div>

        <AdminLoginForm />

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Painel de controle para gerenciar empresas e assinaturas
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
