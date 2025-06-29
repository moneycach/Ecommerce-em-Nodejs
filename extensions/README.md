# Extensões Personalizadas para EverShop

Este diretório contém as extensões personalizadas desenvolvidas para a loja virtual EverShop.

## Estrutura de Diretórios

- `clerk-auth/`: Extensão para autenticação usando Clerk
- `stripe-payment/`: Extensão para processamento de pagamentos via Stripe
- `mercadopago-payment/`: Extensão alternativa para processamento de pagamentos via MercadoPago

## Como Desenvolver uma Extensão

Para desenvolver uma extensão para o EverShop, siga estas etapas:

1. Crie um diretório para sua extensão dentro deste diretório `extensions/`
2. Crie um arquivo `package.json` na raiz da sua extensão
3. Implemente os módulos necessários seguindo a estrutura do EverShop
4. Registre sua extensão no arquivo de configuração principal

Para mais detalhes, consulte o [tutorial de desenvolvimento de extensões](https://www.youtube.com/watch?v=760LriNpjtY).

## Instalação de Extensões

Para instalar uma extensão:

1. Copie o diretório da extensão para o diretório `extensions/` do EverShop
2. Reinicie o servidor EverShop

```bash
npm run restart
```