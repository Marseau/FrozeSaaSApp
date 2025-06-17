
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PricingSection = () => {
  const plans = [
    {
      name: 'Plano Starter',
      subtitle: 'Ideal para quem está começando',
      price: '2.500',
      monthly: '197',
      features: [
        'App personalizado (Android, iOS, Web)',
        'Até 50 produtos',
        'Pagamentos Pix e Cartão',
        'Dashboard básico',
        'Suporte por WhatsApp',
        'Hospedagem incluída'
      ],
      buttonText: 'Começar agora',
      buttonVariant: 'outline' as const,
      popular: false
    },
    {
      name: 'Plano Profissional',
      subtitle: 'Para negócios em crescimento',
      price: '4.500',
      monthly: '397',
      features: [
        'Tudo do plano Starter +',
        'Produtos ilimitados',
        'Dashboard avançado com relatórios',
        'Controle completo de estoque',
        'Integração com delivery (iFood, Uber)',
        'Suporte prioritário',
        'Backup automático'
      ],
      buttonText: 'Começar agora',
      buttonVariant: 'default' as const,
      popular: true
    }
  ];

  return (
    <section className="py-16 bg-white" id="planos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            Planos transparentes para seu negócio
          </h2>
          <p className="text-lg text-gray-600">
            Sem taxas por transação. Sem surpresas. Só resultados.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative rounded-2xl p-8 border-2 ${
                plan.popular 
                  ? 'border-green-600 bg-green-600 text-white' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-medium">
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.popular ? 'text-green-100' : 'text-gray-600'}`}>
                  {plan.subtitle}
                </p>
                
                <div className="mb-2">
                  <span className={`text-sm ${plan.popular ? 'text-green-100' : 'text-gray-600'}`}>R$</span>
                  <span className={`text-3xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ml-1 ${plan.popular ? 'text-green-100' : 'text-gray-600'}`}>
                    implantação
                  </span>
                </div>
                <p className={`text-sm ${plan.popular ? 'text-green-100' : 'text-gray-600'}`}>
                  + R$ {plan.monthly}/mês
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check 
                      size={16} 
                      className={`mr-3 flex-shrink-0 ${
                        plan.popular ? 'text-green-200' : 'text-green-600'
                      }`} 
                    />
                    <span className={`text-sm ${plan.popular ? 'text-white' : 'text-gray-700'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full py-3 ${
                  plan.popular 
                    ? 'bg-white text-green-600 hover:bg-gray-50' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
                variant={plan.buttonVariant}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Precisa de algo personalizado? Fale conosco!</p>
          <button className="text-green-600 hover:text-green-700 font-medium text-sm underline">
            Solicitar orçamento customizado
          </button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
