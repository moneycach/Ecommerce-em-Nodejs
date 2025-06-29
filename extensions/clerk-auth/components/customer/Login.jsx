import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { useAppState } from '@evershop/evershop/src/components/common/context/app';

export default function ClerkLogin() {
  const { setAppState } = useAppState();

  // Função para lidar com o sucesso do login
  const handleSignInComplete = async (user) => {
    // Obter o token de autenticação do Clerk
    const token = await user.getToken();
    
    // Enviar o token para o backend do EverShop para autenticação
    const response = await fetch('/api/clerk/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });

    if (response.ok) {
      const data = await response.json();
      
      // Atualizar o estado da aplicação com os dados do usuário
      setAppState({
        customer: {
          isLoggedIn: true,
          ...data.customer
        }
      });

      // Redirecionar para a página da conta
      window.location.href = '/account';
    } else {
      console.error('Erro ao autenticar com o EverShop');
    }
  };

  return (
    <div className="login-form">
      <h1 className="login-form-title">Entrar na sua conta</h1>
      <SignIn
        path="/login"
        routing="path"
        signUpUrl="/register"
        redirectUrl="/account"
        appearance={{
          elements: {
            formButtonPrimary: 'primary-button',
            card: 'clerk-card',
            headerTitle: 'clerk-header-title',
            headerSubtitle: 'clerk-header-subtitle',
            socialButtonsBlockButton: 'clerk-social-button'
          }
        }}
        onSignInComplete={handleSignInComplete}
      />
    </div>
  );
}