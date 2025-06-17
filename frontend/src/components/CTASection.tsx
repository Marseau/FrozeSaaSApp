
import React from 'react';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <section className="py-16 bg-green-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
          Pronto para transformar seu negócio?
        </h2>
        <p className="text-lg text-green-100 mb-8">
          Junte-se aos empreendedores que já estão vendendo mais com nosso sistema completo
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-white text-green-600 hover:bg-gray-50 px-8 py-3 text-base font-medium">
            Começar agora
          </Button>
          <Button 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 text-base font-medium"
          >
            Falar com especialista
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
