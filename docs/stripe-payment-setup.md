# Configuração do Pagamento com Stripe

Este guia fornece instruções para configurar o processamento de pagamentos usando Stripe no EverShop.

## Pré-requisitos

- Conta no [Stripe](https://stripe.com/)
- Projeto EverShop configurado e funcionando

## Passo 1: Criar uma Conta no Stripe

1. Acesse o [site do Stripe](https://stripe.com/) e crie uma conta
2. Complete o processo de verificação da conta

## Passo 2: Obter as Chaves de API do Stripe

1. No dashboard do Stripe, vá para "Developers" > "API keys"
2. Copie a "Publishable key" e a "Secret key"
3. Para ambiente de desenvolvimento, use as chaves de teste (que começam com `pk_test_` e `sk_test_`)

## Passo 3: Configurar as Variáveis de Ambiente

Edite o arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:

```
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

Substitua `pk_test_your_publishable_key`, `sk_test_your_secret_key` e `whsec_your_webhook_secret` pelas chaves obtidas no passo anterior.

## Passo 4: Configurar o Webhook do Stripe

1. No dashboard do Stripe, vá para "Developers" > "Webhooks"
2. Clique em "Add endpoint"
3. Adicione a URL do seu webhook: `https://seu-dominio.com/api/stripe/webhook`
4. Selecione os eventos a serem enviados:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
5. Clique em "Add endpoint"
6. Copie o "Signing secret" e adicione-o à variável `STRIPE_WEBHOOK_SECRET` no arquivo `.env`

## Passo 5: Instalar as Dependências do Stripe

Acesse o diretório da extensão Stripe Payment e instale as dependências:

```bash
cd extensions/stripe-payment
npm install
```

## Passo 6: Configurar o Processador de Pagamento Stripe

Verifique se o arquivo `bootstrap.js` na pasta `extensions/stripe-payment` está configurado corretamente:

```javascript
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
```

## Passo 7: Configurar o Componente de Pagamento Stripe

Verifique se o componente `StripePayment.jsx` na pasta `extensions/stripe-payment/components/checkout` está configurado corretamente.

## Passo 8: Adicionar o Logo do Stripe

1. Baixe o logo do Stripe do [site oficial](https://stripe.com/about/resources)
2. Crie uma pasta `public/assets` na raiz do projeto
3. Adicione o logo do Stripe nessa pasta com o nome `stripe-logo.png`

## Passo 9: Configurar o Stripe para Moeda Brasileira (BRL)

Se você estiver operando no Brasil, certifique-se de configurar o Stripe para usar a moeda brasileira (BRL):

1. No dashboard do Stripe, vá para "Settings" > "Account settings" > "Business settings" > "Business details"
2. Defina o país como "Brazil"
3. Defina a moeda padrão como "Brazilian Real (BRL)"

## Passo 10: Testar o Pagamento

1. Reinicie o servidor EverShop
2. Adicione um produto ao carrinho
3. Prossiga para o checkout
4. Selecione o método de pagamento Stripe
5. Complete o pagamento usando os cartões de teste do Stripe:
   - Número do cartão: `4242 4242 4242 4242`
   - Data de validade: Qualquer data futura
   - CVC: Qualquer 3 dígitos
   - CEP: Qualquer 5 dígitos

## Passo 11: Verificar o Pagamento no Dashboard do Stripe

1. Acesse o dashboard do Stripe
2. Vá para "Payments" para ver o pagamento de teste
3. Verifique se o status do pagamento está como "Succeeded"

## Configurações Avançadas

### Configurar Pagamentos Parcelados

Para configurar pagamentos parcelados no Brasil, você precisa modificar o código para usar o Stripe Elements com a opção de parcelamento:

```javascript
// No componente StripePayment.jsx
const paymentOptions = {
  payment_method_types: ['card'],
  payment_method_options: {
    card: {
      installments: {
        enabled: true
      }
    }
  }
};
```

### Configurar Boleto Bancário

Para aceitar pagamentos via boleto bancário, você precisa adicionar o método de pagamento "boleto" ao Stripe:

```javascript
// No arquivo bootstrap.js
const paymentMethodTypes = ['card', 'boleto'];

// Configuração específica para boleto
const paymentMethodOptions = {
  boleto: {
    expires_after_days: 3
  }
};
```

### Configurar PIX

Para aceitar pagamentos via PIX, você precisa adicionar o método de pagamento "pix" ao Stripe:

```javascript
// No arquivo bootstrap.js
const paymentMethodTypes = ['card', 'pix'];

// Configuração específica para PIX
const paymentMethodOptions = {
  pix: {
    expires_after_seconds: 86400 // 24 horas
  }
};
```

## Solução de Problemas

### Erro de Chave Inválida

Se você receber um erro de chave inválida, verifique se as chaves de API do Stripe estão configuradas corretamente no arquivo `.env`.

### Erro de Webhook

Se os webhooks não estiverem funcionando, verifique:

1. Se a URL do webhook está correta
2. Se o segredo do webhook está configurado corretamente
3. Se o servidor está acessível publicamente (use ngrok para testes locais)

### Logs do Stripe

Para depurar problemas com o Stripe, você pode ativar os logs detalhados:

```javascript
// No arquivo bootstrap.js
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
  telemetry: true,
  maxNetworkRetries: 3
});

// Adicionar log para requisições
stripeClient.on('request', (request) => {
  console.log('Stripe Request:', request);
});
```

## Recursos Adicionais

- [Documentação do Stripe](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Elements](https://stripe.com/docs/stripe-js)