const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');
const { resolve } = require('path');
const { existsSync } = require('fs');

module.exports = () => {
  // Verificar se as variáveis de ambiente do Clerk estão definidas
  if (!process.env.CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
    console.warn('Clerk Auth: Chaves de API não configuradas. A autenticação Clerk não estará disponível.');
    return;
  }

  // Registrar os middlewares do Clerk
  const app = require('@evershop/evershop/src/app/app');
  
  // Middleware para autenticação Clerk
  app.use(ClerkExpressWithAuth({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY
  }));

  // Registrar os componentes React para a interface de usuário
  const componentOverrideDirectory = resolve(__dirname, 'components');
  if (existsSync(componentOverrideDirectory)) {
    app.useAdminComponents(componentOverrideDirectory);
    app.useFrontComponents(componentOverrideDirectory);
  }

  console.log('Clerk Auth: Extensão inicializada com sucesso');
};