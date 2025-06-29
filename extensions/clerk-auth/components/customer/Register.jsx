import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { useAppState } from '@evershop/evershop/src/components/common/context/app';

export default function ClerkRegister() {
  const { setAppState } = useAppState();

  // Função para lidar com o sucesso do registro
  const handleSignUpComplete = async (user) => {
    // Obter o token de autenticação do Clerk
    const token = await user.getToken();
    
    // Enviar o token para o backend do EverShop para criar o usuário
    const response = await fetch('/api/clerk/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        token,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.primaryEmailAddress.emailAddress
      })
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
      console.error('Erro ao registrar com o EverShop');
    }
  };

  return (
    <div className="register-form">
      <h1 className="register-form-title">Criar uma nova conta</h1>
      <SignUp
        path="/register"
        routing="path"
        signInUrl="/login"
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
        onSignUpComplete={handleSignUpComplete}
      />
    </div>
  );
}