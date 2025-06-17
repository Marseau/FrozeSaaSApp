
import React from 'react';
import { Smartphone, CreditCard, Package, ClipboardList, TrendingUp, Truck } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Smartphone,
      title: 'App Personalizado',
      description: 'Seu próprio aplicativo com sua marca, logo e cores. Disponível para Android, iOS e web.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: CreditCard,
      title: 'Pagamentos Instantâneos',
      description: 'Receba por Pix instantaneamente ou cartão de crédito via Stripe. Sem complicações.',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: Package,
      title: 'Controle de Estoque',
      description: 'Acompanhe lotes, validades e receba alertas automáticos quando o estoque estiver baixo.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: ClipboardList,
      title: 'Ficha Técnica de Pratos',
      description: 'Cadastre ingredientes, fornecedores e calcule automaticamente o custo de cada prato.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: TrendingUp,
      title: 'Dashboard de Resultados',
      description: 'Acompanhe vendas, clientes, produtos mais vendidos e muito mais em tempo real.',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: Truck,
      title: 'Logística Integrada',
      description: 'Sistema de entrega com cálculo automático de frete e agendamento inteligente.',
      color: 'bg-blue-100 text-blue-600'
    }
  ];

  return (
    <section className="py-16 bg-white" id="funcionalidades">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            Tudo que você precisa para vender comida congelada
          </h2>
          <p className="text-lg text-gray-600">
            Uma plataforma completa que automatiza todo o processo, desde o pedido até a entrega
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
