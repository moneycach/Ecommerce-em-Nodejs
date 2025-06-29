const { resolve } = require('path');
const { existsSync } = require('fs');
const bootstrap = require('./bootstrap');
const stripeApi = require('./api/stripeApi');

// Exportar os componentes de pagamento
exports.components = {
  StripePayment: resolve(__dirname, 'components/checkout/StripePayment.jsx')
};

// Exportar a função de bootstrap para inicialização
exports.bootstrap = bootstrap;

// Exportar as rotas da API
exports.apiRoutes = stripeApi;

// Função para registrar a extensão no EverShop
exports.register = (app) => {
  // Registrar as rotas da API
  app.use(stripeApi);
  
  // Inicializar a extensão
  bootstrap();
  
  // Registrar os componentes React
  const componentOverrideDirectory = resolve(__dirname, 'components');
  if (existsSync(componentOverrideDirectory)) {
    app.useAdminComponents(componentOverrideDirectory);
    app.useFrontComponents(componentOverrideDirectory);
  }
  
  console.log('Stripe Payment: Extensão registrada com sucesso');
};

// Configuração do método de pagamento
exports.paymentMethods = [
  {
    name: 'Stripe',
    code: 'stripe',
    description: 'Pague com segurança usando seu cartão de crédito via Stripe',
    icon: '/assets/stripe-logo.png',
    enabled: true
  }
];