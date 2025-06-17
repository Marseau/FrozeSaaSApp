
import React from 'react';
import { Play, CheckCircle, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      // Se já estiver logado, pode redirecionar para dashboard
      console.log('Usuário já logado, redirecionar para dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
              Venda comida congelada de forma{' '}
              <span className="text-green-600">profissional</span> e{' '}
              <span className="text-orange-500">automatizada</span>
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              Sistema completo com cardápio digital, pedidos online, pagamentos via Pix e Stripe, 
              e logística inteligente de entrega. Tudo que você precisa em uma solução.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleGetStarted}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-base"
              >
                {user ? 'Acessar Dashboard' : 'Começar agora'}
              </Button>
              <Button 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 text-base"
              >
                <Play size={18} className="mr-2" />
                Ver demonstração
              </Button>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-6 shadow-lg border">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-sm font-medium text-gray-900">
                  Sistema profissional de comida congelada e app mobile
                </span>
              </div>
              <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">F</span>
                </div>
                <span className="ml-2 text-sm text-gray-600">Interface do App</span>
              </div>
            </div>
            
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Rocket className="text-white" size={20} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
