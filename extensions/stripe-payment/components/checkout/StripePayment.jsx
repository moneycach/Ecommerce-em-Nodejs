import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCheckout } from '@evershop/evershop/src/modules/checkout/pages/frontStore/checkout/components/checkoutProvider';
import { useAppState } from '@evershop/evershop/src/components/common/context/app';

// Componente de formulário de pagamento Stripe
function StripePaymentForm({ orderPlaced, orderId, checkoutSuccessUrl }) {
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const stripe = useStripe();
  const elements = useElements();
  const { cartId } = useAppState();

  useEffect(() => {
    // Criar uma intent de pagamento quando o componente for montado
    if (cartId && !orderPlaced) {
      fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cartId })
      })
        .then(response => response.json())
        .then(data => {
          setClientSecret(data.clientSecret);
        })
        .catch(err => {
          setError('Não foi possível inicializar o pagamento. Por favor, tente novamente.');
          console.error(err);
        });
    }
  }, [cartId, orderPlaced]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    // Confirmar o pagamento com o Stripe
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          // Você pode adicionar detalhes de cobrança aqui se necessário
        }
      }
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      // Pagamento bem-sucedido, redirecionar para a página de sucesso
      window.location.href = `${checkoutSuccessUrl}?order_id=${orderId}&payment_intent=${paymentIntent.id}`;
    } else {
      setError('Pagamento não concluído. Por favor, tente novamente.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-payment-form">
      <div className="form-title">
        <h3>Pagamento com Cartão de Crédito</h3>
      </div>
      
      <div className="card-element-container">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || processing}
        className="stripe-payment-button"
      >
        {processing ? 'Processando...' : 'Pagar Agora'}
      </button>
    </form>
  );
}

// Componente principal que carrega o Stripe
export default function StripePayment({ orderPlaced, orderId, checkoutSuccessUrl }) {
  const [stripePromise, setStripePromise] = useState(null);
  
  useEffect(() => {
    // Carregar o Stripe com a chave pública
    const loadStripeInstance = async () => {
      const response = await fetch('/api/stripe/config');
      const { publishableKey } = await response.json();
      setStripePromise(loadStripe(publishableKey));
    };
    
    loadStripeInstance();
  }, []);

  return (
    <div className="stripe-payment-container">
      {stripePromise && (
        <Elements stripe={stripePromise}>
          <StripePaymentForm 
            orderPlaced={orderPlaced} 
            orderId={orderId} 
            checkoutSuccessUrl={checkoutSuccessUrl} 
          />
        </Elements>
      )}
    </div>
  );
}