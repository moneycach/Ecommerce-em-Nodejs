# Configuração da Autenticação com Clerk

Este guia fornece instruções para configurar a autenticação usando Clerk no EverShop.

## Pré-requisitos

- Conta no [Clerk](https://clerk.dev/)
- Projeto EverShop configurado e funcionando

## Passo 1: Criar uma Aplicação no Clerk

1. Acesse o [Dashboard do Clerk](https://dashboard.clerk.dev/)
2. Clique em "Add Application"
3. Escolha um nome para sua aplicação (ex: "Minha Loja EverShop")
4. Selecione o tipo de aplicação como "Web Application"
5. Configure as URLs da sua aplicação:
   - **Home URL**: `https://seu-dominio.com` (ou `http://localhost:3000` para desenvolvimento)
   - **Sign-in URL**: `https://seu-dominio.com/login` (ou `http://localhost:3000/login` para desenvolvimento)
   - **Sign-up URL**: `https://seu-dominio.com/register` (ou `http://localhost:3000/register` para desenvolvimento)
   - **After sign-in URL**: `https://seu-dominio.com/account` (ou `http://localhost:3000/account` para desenvolvimento)
   - **After sign-up URL**: `https://seu-dominio.com/account` (ou `http://localhost:3000/account` para desenvolvimento)

## Passo 2: Configurar Provedores de Autenticação

1. No dashboard do Clerk, vá para "Authentication" > "Social Connections"
2. Ative os provedores desejados (Google, Facebook, etc.)
3. Configure cada provedor seguindo as instruções específicas:

### Google

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá para "APIs & Services" > "Credentials"
4. Clique em "Create Credentials" > "OAuth client ID"
5. Configure o consentimento OAuth (OAuth consent screen)
6. Crie um ID de cliente OAuth com o tipo "Web application"
7. Adicione as URLs de redirecionamento fornecidas pelo Clerk
8. Copie o Client ID e Client Secret para o Clerk

### Facebook

1. Acesse o [Facebook Developers](https://developers.facebook.com/)
2. Crie um novo aplicativo ou selecione um existente
3. Vá para "Settings" > "Basic"
4. Adicione as URLs de redirecionamento fornecidas pelo Clerk
5. Copie o App ID e App Secret para o Clerk

## Passo 3: Obter as Chaves de API do Clerk

1. No dashboard do Clerk, vá para "API Keys"
2. Copie a "Publishable Key" e a "Secret Key"

## Passo 4: Configurar as Variáveis de Ambiente

Edite o arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:

```
CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
```

Substitua `pk_test_your_publishable_key` e `sk_test_your_secret_key` pelas chaves obtidas no passo anterior.

## Passo 5: Instalar as Dependências do Clerk

Acesse o diretório da extensão Clerk Auth e instale as dependências:

```bash
cd extensions/clerk-auth
npm install
```

## Passo 6: Configurar o Componente ClerkProvider

Crie um arquivo `ClerkProvider.jsx` na pasta `extensions/clerk-auth/components/common`:

```jsx
import React from 'react';
import { ClerkProvider as BaseClerkProvider } from '@clerk/clerk-react';

export default function ClerkProvider({ children }) {
  // Obter a chave publicável do Clerk das variáveis de ambiente
  const publishableKey = process.env.CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    console.error('Clerk: Chave publicável não encontrada');
    return children;
  }

  return (
    <BaseClerkProvider publishableKey={publishableKey}>
      {children}
    </BaseClerkProvider>
  );
}
```

## Passo 7: Integrar o ClerkProvider na Aplicação

Modifique o arquivo `bootstrap.js` da extensão para integrar o ClerkProvider na aplicação EverShop:

```javascript
const { resolve } = require('path');
const { existsSync } = require('fs');
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

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

  // Registrar o ClerkProvider como componente de nível superior
  const { addComponents } = require('@evershop/evershop/src/lib/components/registry');
  addComponents('App', resolve(__dirname, 'components/common/ClerkProvider.jsx'));

  console.log('Clerk Auth: Extensão inicializada com sucesso');
};
```

## Passo 8: Personalizar a Aparência do Clerk

Você pode personalizar a aparência dos formulários de login e registro do Clerk para corresponder ao estilo da sua loja. Crie um arquivo CSS na pasta `extensions/clerk-auth/components/customer/clerk-styles.css`:

```css
/* Estilos para os componentes do Clerk */
.clerk-card {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
  max-width: 400px;
  margin: 0 auto;
}

.clerk-header-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.clerk-header-subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
}

.clerk-social-button {
  border-radius: 4px;
  height: 40px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}

.primary-button {
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.primary-button:hover {
  background-color: #3a80d2;
}
```

## Passo 9: Testar a Autenticação

1. Reinicie o servidor EverShop
2. Acesse a página de login (`/login`)
3. Verifique se o formulário de login do Clerk é exibido
4. Teste o login com email e senha
5. Teste o login com provedores sociais (Google, Facebook)

## Solução de Problemas

### Erro de CORS

Se você encontrar erros de CORS, verifique se as URLs configuradas no Clerk estão corretas e correspondem às URLs da sua aplicação.

### Erro de Redirecionamento

Se o redirecionamento após o login não funcionar, verifique se as URLs de redirecionamento estão configuradas corretamente no Clerk e na sua aplicação.

### Logs do Clerk

Para depurar problemas com o Clerk, você pode ativar os logs detalhados adicionando a seguinte variável de ambiente:

```
CLERK_DEBUG=true
```

## Recursos Adicionais

- [Documentação do Clerk](https://clerk.dev/docs)
- [Exemplos de Integração do Clerk](https://github.com/clerkinc/clerk-examples)
- [Documentação do EverShop sobre Extensões](https://docs.evershop.io/development/extensions)