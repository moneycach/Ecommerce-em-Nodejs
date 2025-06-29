const { Router } = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { select } = require('@evershop/evershop/src/lib/postgres/query');
const { pool } = require('@evershop/evershop/src/lib/postgres/connection');
const { getCartByUUID } = require('@evershop/evershop/src/modules/checkout/services/cart/getCartByUUID');

const router = Router();

// Endpoint para obter a chave pública do Stripe
router.get('/api/stripe/config', (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  });
});

// Endpoint para criar uma intenção de pagamento
router.post('/api/stripe/create-payment-intent', async (req, res) => {
  try {
    const { cartId } = req.body;
    
    if (!cartId) {
      return res.status(400).json({ error: 'ID do carrinho não fornecido' });
    }

    // Obter os detalhes do carrinho
    const cart = await getCartByUUID(cartId);
    
    if (!cart) {
      return res.status(404).json({ error: 'Carrinho não encontrado' });
    }

    // Calcular o valor total em centavos (Stripe usa a menor unidade monetária)
    const amount = Math.round(cart.grandTotal * 100);
    
    // Criar uma intenção de pagamento no Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'brl', // Altere para a moeda apropriada
      metadata: {
        cartId,
        integration_check: 'accept_a_payment'
      }
    });

    // Retornar o segredo do cliente para o frontend
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Erro ao criar intenção de pagamento:', error);
    res.status(500).json({ error: 'Erro ao criar intenção de pagamento' });
  }
});

// Endpoint para webhook do Stripe (para receber notificações de pagamentos)
router.post('/api/stripe/webhook', async (req, res) => {
  const signature = req.headers['stripe-signature'];
  
  try {
    // Verificar a assinatura do webhook
    const event = stripe.webhooks.constructEvent(
      req.rawBody, // Certifique-se de que o corpo da requisição está disponível como rawBody
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Lidar com diferentes tipos de eventos
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handleSuccessfulPayment(paymentIntent);
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await handleFailedPayment(failedPayment);
        break;
      default:
        console.log(`Evento não tratado: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Erro no webhook do Stripe:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// Função para lidar com pagamentos bem-sucedidos
async function handleSuccessfulPayment(paymentIntent) {
  const { cartId } = paymentIntent.metadata;
  
  if (!cartId) {
    console.error('Metadata do carrinho não encontrada no pagamento');
    return;
  }

  const connection = await pool.connect();
  try {
    // Obter o pedido associado ao carrinho
    const order = await select()
      .from('order')
      .where('cart_id', '=', cartId)
      .load(connection);

    if (!order) {
      console.error(`Pedido não encontrado para o carrinho ${cartId}`);
      return;
    }

    // Atualizar o status do pagamento do pedido
    await connection.query(
      'UPDATE "order" SET payment_status = $1, payment_method = $2, transaction_id = $3 WHERE cart_id = $4',
      ['paid', 'stripe', paymentIntent.id, cartId]
    );

    console.log(`Pagamento confirmado para o pedido ${order.order_number}`);
  } catch (error) {
    console.error('Erro ao processar pagamento bem-sucedido:', error);
  } finally {
    connection.release();
  }
}

// Função para lidar com pagamentos falhos
async function handleFailedPayment(paymentIntent) {
  const { cartId } = paymentIntent.metadata;
  
  if (!cartId) {
    console.error('Metadata do carrinho não encontrada no pagamento');
    return;
  }

  const connection = await pool.connect();
  try {
    // Obter o pedido associado ao carrinho
    const order = await select()
      .from('order')
      .where('cart_id', '=', cartId)
      .load(connection);

    if (!order) {
      console.error(`Pedido não encontrado para o carrinho ${cartId}`);
      return;
    }

    // Atualizar o status do pagamento do pedido
    await connection.query(
      'UPDATE "order" SET payment_status = $1, payment_method = $2, transaction_id = $3 WHERE cart_id = $4',
      ['failed', 'stripe', paymentIntent.id, cartId]
    );

    console.log(`Pagamento falhou para o pedido ${order.order_number}`);
  } catch (error) {
    console.error('Erro ao processar pagamento falho:', error);
  } finally {
    connection.release();
  }
}

module.exports = router;