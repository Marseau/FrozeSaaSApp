
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChefHat, LogIn, Shield, ShoppingCart, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, userType, signOut } = useAuth();

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      // Se não estiver logado, mostrar opções
      navigate('/auth');
    }
  };

  const getGreeting = () => {
    if (!user) return null;
    
    switch (userType) {
      case 'admin_plataforma':
        return 'Admin da Plataforma';
      case 'empresa':
        return 'Empresa';
      case 'cliente_final':
        return 'Cliente';
      default:
        return 'Usuário';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <ChefHat className="text-green-600" size={32} />
            <span className="text-xl font-bold text-gray-900">FrozenSaaS</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900">Recursos</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">Preços</a>
            <a href="#contact" className="text-gray-600 hover:text-gray-900">Contato</a>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Olá, {getGreeting()}
                </span>
                <Button 
                  onClick={handleAuthAction}
                  variant="outline"
                >
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={() => navigate('/admin')}
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Shield size={16} className="mr-1" />
                  Admin
                </Button>
                <Button 
                  onClick={() => navigate('/auth')}
                  variant="ghost"
                  size="sm"
                  className="text-orange-600 hover:text-orange-700"
                >
                  <Building2 size={16} className="mr-1" />
                  Empresa
                </Button>
                <Button 
                  onClick={() => navigate('/cliente')}
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <ShoppingCart size={16} className="mr-1" />
                  Cliente
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
