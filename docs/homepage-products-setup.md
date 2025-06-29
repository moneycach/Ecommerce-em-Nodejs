# Configuração da Página Principal e Produtos

Este guia fornece instruções para configurar a página principal da loja e adicionar os primeiros produtos no EverShop.

## Pré-requisitos

- EverShop instalado e funcionando
- Acesso ao painel administrativo

## Passo 1: Acessar o Painel Administrativo

1. Acesse o painel administrativo em `http://seu-dominio.com/admin` ou `http://localhost:3000/admin` para desenvolvimento local
2. Faça login com as credenciais de administrador
   - Email padrão: `admin@example.com`
   - Senha padrão: `123456`

## Passo 2: Configurar Categorias de Produtos

1. No painel administrativo, vá para "Catalog" > "Categories"
2. Clique em "New Category"
3. Preencha os campos:
   - **Name**: Nome da categoria (ex: "Eletrônicos")
   - **Description**: Descrição da categoria
   - **Status**: Enabled
   - **Include in menu**: Yes
   - **Meta title**: Título para SEO
   - **Meta description**: Descrição para SEO
   - **Meta keywords**: Palavras-chave para SEO
4. Clique em "Save" para criar a categoria
5. Repita o processo para criar outras categorias conforme necessário

## Passo 3: Configurar Atributos de Produtos

1. No painel administrativo, vá para "Catalog" > "Attributes"
2. Clique em "New Attribute"
3. Preencha os campos:
   - **Attribute Code**: Código único para o atributo (ex: "color")
   - **Attribute Name**: Nome do atributo (ex: "Cor")
   - **Type**: Tipo do atributo (ex: "Select")
   - **Is Required**: Se o atributo é obrigatório
   - **Display on frontend**: Se o atributo deve ser exibido na loja
4. Se o tipo for "Select", adicione as opções do atributo
5. Clique em "Save" para criar o atributo
6. Repita o processo para criar outros atributos conforme necessário

## Passo 4: Adicionar Produtos

1. No painel administrativo, vá para "Catalog" > "Products"
2. Clique em "New Product"
3. Preencha os campos na aba "General":
   - **Name**: Nome do produto
   - **SKU**: Código único do produto
   - **Price**: Preço do produto
   - **Status**: Enabled
   - **Weight**: Peso do produto
   - **Short Description**: Descrição curta do produto
   - **Description**: Descrição completa do produto
   - **Meta title**: Título para SEO
   - **Meta description**: Descrição para SEO
   - **Meta keywords**: Palavras-chave para SEO
4. Na aba "Inventory":
   - **Manage Stock**: Yes
   - **Stock Quantity**: Quantidade em estoque
   - **Allow Backorder**: Permitir pedidos quando não houver estoque
5. Na aba "Images":
   - Clique em "Browse" para fazer upload de imagens do produto
   - Arraste as imagens para definir a ordem
   - Defina uma imagem como principal
6. Na aba "Attributes":
   - Preencha os valores para os atributos configurados
7. Na aba "Related Products":
   - Adicione produtos relacionados, se houver
8. Na aba "Categories":
   - Selecione as categorias às quais o produto pertence
9. Clique em "Save" para criar o produto
10. Repita o processo para adicionar outros produtos

## Passo 5: Configurar a Página Principal

### Configurar o Slider da Página Principal

1. No painel administrativo, vá para "CMS" > "Widgets"
2. Clique em "New Widget"
3. Selecione o tipo "Slider"
4. Preencha os campos:
   - **Name**: Nome do slider (ex: "Banner Principal")
   - **Status**: Enabled
   - **Position**: header.content
   - **Sort Order**: 1
5. Adicione slides:
   - **Title**: Título do slide
   - **Description**: Descrição do slide
   - **Image**: Faça upload da imagem do slide
   - **Button Text**: Texto do botão (ex: "Comprar Agora")
   - **Button Link**: Link do botão (ex: "/category/eletronicos")
6. Clique em "Save" para criar o slider

### Adicionar Seção de Produtos em Destaque

1. No painel administrativo, vá para "CMS" > "Widgets"
2. Clique em "New Widget"
3. Selecione o tipo "Featured Products"
4. Preencha os campos:
   - **Name**: Nome da seção (ex: "Produtos em Destaque")
   - **Status**: Enabled
   - **Position**: content.top
   - **Sort Order**: 1
   - **Title**: Título da seção
   - **Number of Products**: Número de produtos a serem exibidos
   - **Products**: Selecione os produtos a serem exibidos
5. Clique em "Save" para criar a seção

### Adicionar Banners Promocionais

1. No painel administrativo, vá para "CMS" > "Widgets"
2. Clique em "New Widget"
3. Selecione o tipo "Banner"
4. Preencha os campos:
   - **Name**: Nome do banner (ex: "Promoção Especial")
   - **Status**: Enabled
   - **Position**: content.middle
   - **Sort Order**: 1
   - **Title**: Título do banner
   - **Image**: Faça upload da imagem do banner
   - **Link**: Link do banner
5. Clique em "Save" para criar o banner

### Adicionar Seção de Categorias em Destaque

1. No painel administrativo, vá para "CMS" > "Widgets"
2. Clique em "New Widget"
3. Selecione o tipo "Category Grid"
4. Preencha os campos:
   - **Name**: Nome da seção (ex: "Categorias Populares")
   - **Status**: Enabled
   - **Position**: content.bottom
   - **Sort Order**: 1
   - **Title**: Título da seção
   - **Categories**: Selecione as categorias a serem exibidas
5. Clique em "Save" para criar a seção

## Passo 6: Personalizar o Tema

### Configurar as Cores da Loja

1. No painel administrativo, vá para "Settings" > "Store Settings"
2. Na aba "General":
   - **Store Name**: Nome da loja
   - **Store Email**: Email da loja
   - **Store Phone**: Telefone da loja
   - **Store Address**: Endereço da loja
3. Na aba "Theme":
   - **Logo**: Faça upload do logo da loja
   - **Favicon**: Faça upload do favicon da loja
   - **Primary Color**: Cor primária da loja
   - **Secondary Color**: Cor secundária da loja
   - **Accent Color**: Cor de destaque da loja
   - **Text Color**: Cor do texto
   - **Link Color**: Cor dos links
   - **Button Color**: Cor dos botões
4. Clique em "Save" para aplicar as configurações

### Personalizar o Rodapé

1. No painel administrativo, vá para "CMS" > "Widgets"
2. Clique em "New Widget"
3. Selecione o tipo "Text"
4. Preencha os campos:
   - **Name**: Nome do widget (ex: "Informações do Rodapé")
   - **Status**: Enabled
   - **Position**: footer.top
   - **Sort Order**: 1
   - **Content**: Conteúdo HTML do rodapé
5. Clique em "Save" para criar o widget

## Passo 7: Configurar SEO

1. No painel administrativo, vá para "Settings" > "Store Settings"
2. Na aba "SEO":
   - **Meta Title**: Título padrão para SEO
   - **Meta Description**: Descrição padrão para SEO
   - **Meta Keywords**: Palavras-chave padrão para SEO
   - **Robots**: Configurações para robots.txt
3. Clique em "Save" para aplicar as configurações

## Passo 8: Testar a Loja

1. Acesse a página principal da loja
2. Verifique se todos os elementos estão sendo exibidos corretamente
3. Teste a navegação entre categorias
4. Teste a visualização de produtos
5. Teste a adição de produtos ao carrinho
6. Teste o processo de checkout

## Personalização Avançada

Para personalização avançada do tema, você precisará modificar os arquivos de tema do EverShop. Os arquivos de tema estão localizados no diretório `themes` do EverShop.

### Estrutura de Diretórios do Tema

```
themes/
  └── [theme_name]/
      ├── pages/
      │   ├── frontStore/
      │   │   ├── homepage/
      │   │   │   └── HomePage.jsx
      │   │   ├── catalog/
      │   │   │   ├── categoryView/
      │   │   │   │   └── CategoryView.jsx
      │   │   │   └── productView/
      │   │   │       └── ProductView.jsx
      │   │   └── checkout/
      │   │       └── CheckoutPage.jsx
      │   └── admin/
      │       └── ...
      ├── components/
      │   ├── common/
      │   │   ├── Header.jsx
      │   │   └── Footer.jsx
      │   └── ...
      └── assets/
          ├── css/
          │   └── style.css
          └── images/
              └── ...
```

### Personalizar a Página Principal

Para personalizar a página principal, você pode modificar o arquivo `themes/[theme_name]/pages/frontStore/homepage/HomePage.jsx`.

### Personalizar a Visualização de Produtos

Para personalizar a página de visualização de produtos, você pode modificar o arquivo `themes/[theme_name]/pages/frontStore/catalog/productView/ProductView.jsx`.

### Personalizar o Cabeçalho e Rodapé

Para personalizar o cabeçalho e o rodapé, você pode modificar os arquivos `themes/[theme_name]/components/common/Header.jsx` e `themes/[theme_name]/components/common/Footer.jsx`.

## Recursos Adicionais

- [Documentação do EverShop](https://docs.evershop.io/)
- [Guia de Desenvolvimento de Temas](https://docs.evershop.io/development/themes)
- [Guia de Desenvolvimento de Widgets](https://docs.evershop.io/development/widgets)
- [Guia de Desenvolvimento de Extensões](https://docs.evershop.io/development/extensions)