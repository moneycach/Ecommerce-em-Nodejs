const { resolve } = require('path');
const { existsSync } = require('fs');
const stripe = require('stripe');

module.exports = () => {
  // Verificar se as variáveis de ambiente do Stripe estão definidas
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PUBLISHABLE_KEY) {
    console.warn('Stripe Payment: Chaves de API não configuradas. O método de pagamento Stripe não estará disponível.');
    return;
  }

  // Inicializar o cliente Stripe
  const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);
  
  // Registrar o método de pagamento no EverShop
  const { registerPaymentMethod } = require('@evershop/evershop/src/modules/payment/services/paymentMethodManager');
  
  registerPaymentMethod('stripe', {
    name: 'Stripe',
    code: 'stripe',
    description: 'Pague com segurança usando seu cartão de crédito via Stripe',
    icon: '/assets/stripe-logo.png',
    enabled: true,
    
    // Função para processar o pagamento
    processPayment: async (order, paymentData) => {
      try {
        // Criar uma sessão de pagamento no Stripe
        const session = await stripeClient.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: order.items.map(item => ({
            price_data: {
              currency: 'brl',
              product_data: {
                name: item.product.name,
                images: [item.product.image?.url]
              },
              unit_amount: Math.round(item.finalPrice * 100)
            },
            quantity: item.qty
          })),
          mode: 'payment',
          success_url: `${process.env.APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.APP_URL}/checkout/payment`
        });

        return {
          status: 'pending',
          redirectUrl: session.url,
          transactionId: session.id
        };
      } catch (error) {
        console.error('Erro ao processar pagamento Stripe:', error);
        throw new Error('Não foi possível processar o pagamento. Por favor, tente novamente.');
      }
    },
    
    // Função para verificar o status do pagamento
    validatePayment: async (orderId, paymentData) => {
      try {
        const session = await stripeClient.checkout.sessions.retrieve(paymentData.transactionId);
        
        if (session.payment_status === 'paid') {
          return {
            status: 'paid',
            transactionId: session.id,
            message: 'Pagamento confirmado'
          };
        } else {
          return {
            status: 'pending',
            transactionId: session.id,
            message: 'Aguardando confirmação do pagamento'
          };
        }
      } catch (error) {
        console.error('Erro ao validar pagamento Stripe:', error);
        throw new Error('Não foi possível validar o status do pagamento.');
      }
    }
  });

  // Registrar os componentes React para a interface de usuário
  const componentOverrideDirectory = resolve(__dirname, 'components');
  if (existsSync(componentOverrideDirectory)) {
    const { addComponents } = require('@evershop/evershop/src/lib/components/registry');
    addComponents(componentOverrideDirectory);
  }

  console.log('Stripe Payment: Extensão inicializada com sucesso');
};