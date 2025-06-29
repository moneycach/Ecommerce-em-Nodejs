# Loja Virtual com EverShop

Este projeto implementa uma loja virtual usando EverShop, uma plataforma de e-commerce baseada em NodeJS, GraphQL e React.

## Fases do Projeto

### Fase 1: Setup do VPS e Instalação da plataforma e-commerce
- Configuração do ambiente Docker
- Instalação do EverShop
- Configuração inicial da loja

### Fase 2: Sistema de Autenticação
- Implementação de login com Clerk ou Passport
- Autenticação via Email, Google e Facebook

### Fase 3: Página Principal e Produtos
- Desenvolvimento da página principal
- Configuração dos primeiros produtos
- Personalização do tema

### Fase 4: Sistema de Pagamento
- Integração com Stripe para processamento de pagamentos
- Alternativa: integração com MercadoPago

## Como Iniciar

### Pré-requisitos
- Docker e Docker Compose instalados
- Node.js (recomendado para desenvolvimento local)

### Iniciar o Ambiente

```bash
# Iniciar os containers Docker
docker-compose up -d
```

A loja estará disponível em: http://localhost:3000

O painel administrativo estará em: http://localhost:3000/admin

### Credenciais Padrão do Admin
- Email: admin@example.com
- Senha: 123456

## Desenvolvimento

Para desenvolvimento local sem Docker, siga as instruções de instalação na [documentação oficial do EverShop](https://github.com/evershopcommerce/evershop).

## Referências
- [Repositório EverShop](https://github.com/evershopcommerce/evershop)
- [Tutorial de Instalação](https://www.youtube.com/watch?v=-KBh_Lw8AC0)
- [Tutorial de Desenvolvimento de Extensões](https://www.youtube.com/watch?v=760LriNpjtY)