const { resolve } = require('path');
const { existsSync } = require('fs');
const { ClerkProvider } = require('@clerk/clerk-react');
const bootstrap = require('./bootstrap');
const clerkAuthApi = require('./api/clerkAuth');

// Exportar o componente ClerkProvider para envolver a aplicação
exports.ClerkProvider = ClerkProvider;

// Exportar os componentes de autenticação
exports.components = {
  Login: resolve(__dirname, 'components/customer/Login.jsx'),
  Register: resolve(__dirname, 'components/customer/Register.jsx')
};

// Exportar a função de bootstrap para inicialização
exports.bootstrap = bootstrap;

// Exportar as rotas da API
exports.apiRoutes = clerkAuthApi;

// Função para registrar a extensão no EverShop
exports.register = (app) => {
  // Registrar as rotas da API
  app.use(clerkAuthApi);
  
  // Inicializar a extensão
  bootstrap();
  
  // Registrar os componentes React
  const componentOverrideDirectory = resolve(__dirname, 'components');
  if (existsSync(componentOverrideDirectory)) {
    app.useAdminComponents(componentOverrideDirectory);
    app.useFrontComponents(componentOverrideDirectory);
  }
  
  console.log('Clerk Auth: Extensão registrada com sucesso');
};