
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: 'Como funciona a entrega?',
      answer: 'Oferecemos sistema integrado de logística com cálculo automático de frete e agendamento inteligente. Você pode integrar com transportadoras ou gerenciar entregas próprias.'
    },
    {
      question: 'Posso cadastrar meus próprios produtos?',
      answer: 'Sim! Você tem total controle sobre seu cardápio. Pode cadastrar produtos, categorias, preços, ingredientes e até mesmo fichas técnicas completas.'
    },
    {
      question: 'O que está incluso no plano?',
      answer: 'Cada plano inclui app personalizado, sistema de pagamentos, dashboard, suporte técnico e hospedagem. Os recursos específicos variam conforme o plano escolhido.'
    },
    {
      question: 'Posso vender pelo WhatsApp junto?',
      answer: 'Sim! Nosso sistema se integra perfeitamente com WhatsApp, permitindo que você mantenha esse canal de vendas enquanto profissionaliza com o app.'
    },
    {
      question: 'Quanto tempo leva para ficar pronto?',
      answer: 'Após aprovação do design e fornecimento de todas as informações, seu app fica pronto em até 15 dias úteis para começar a vender.'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-gray-600">
            Tudo que você precisa saber sobre nossa solução
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-white border border-gray-200 rounded-lg px-6 data-[state=open]:shadow-sm"
            >
              <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-sm leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
