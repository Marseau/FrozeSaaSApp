
import React from 'react';
import { Shield, RefreshCw, Clock } from 'lucide-react';

const GuaranteesSection = () => {
  const guarantees = [
    {
      icon: Shield,
      title: 'Garantia de 30 dias',
      description: 'Se não estiver satisfeito, devolvemos 100% do seu investimento.',
      color: 'text-green-600'
    },
    {
      icon: RefreshCw,
      title: 'Suporte vitalício',
      description: 'Atualizações gratuitas e suporte técnico enquanto for nosso cliente.',
      color: 'text-green-600'
    },
    {
      icon: Clock,
      title: 'Entrega em 15 dias',
      description: 'Seu app estará funcionando em até 15 dias úteis após aprovação do design.',
      color: 'text-green-600'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            Nossa garantia para você
          </h2>
          <p className="text-lg text-gray-600">
            Investimento sem risco com garantias que protegem seu negócio
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {guarantees.map((guarantee, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <guarantee.icon size={28} className={guarantee.color} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {guarantee.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {guarantee.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GuaranteesSection;
