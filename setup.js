const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

// Função para criar diretórios se não existirem
function createDirectoryIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Diretório criado: ${dirPath}`);
  }
}

// Função para copiar arquivo .env.example para .env se não existir
function setupEnvFile() {
  const envExamplePath = path.join(__dirname, '.env.example');
  const envPath = path.join(__dirname, '.env');
  
  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('Arquivo .env criado a partir do .env.example');
    console.log('IMPORTANTE: Edite o arquivo .env com suas configurações!');
  }
}

// Função para verificar se o Docker está instalado
function checkDocker() {
  try {
    execSync('docker --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Função para verificar se o Docker Compose está instalado
function checkDockerCompose() {
  try {
    execSync('docker-compose --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Função principal
async function setup() {
  console.log('Iniciando configuração do projeto EverShop...');
  
  // Verificar requisitos
  const dockerInstalled = checkDocker();
  const dockerComposeInstalled = checkDockerCompose();
  
  if (!dockerInstalled) {
    console.error('Docker não está instalado. Por favor, instale o Docker antes de continuar.');
    process.exit(1);
  }
  
  if (!dockerComposeInstalled) {
    console.error('Docker Compose não está instalado. Por favor, instale o Docker Compose antes de continuar.');
    process.exit(1);
  }
  
  // Criar diretórios necessários
  createDirectoryIfNotExists(path.join(__dirname, 'evershop-data'));
  createDirectoryIfNotExists(path.join(__dirname, 'mysql-data'));
  createDirectoryIfNotExists(path.join(__dirname, 'config'));
  createDirectoryIfNotExists(path.join(__dirname, 'extensions'));
  createDirectoryIfNotExists(path.join(__dirname, 'extensions/clerk-auth'));
  createDirectoryIfNotExists(path.join(__dirname, 'extensions/stripe-payment'));
  
  // Configurar arquivo .env
  setupEnvFile();
  
  console.log('\nConfiguração concluída com sucesso!');
  console.log('\nPróximos passos:');
  console.log('1. Edite o arquivo .env com suas configurações');
  console.log('2. Execute "npm run start" para iniciar os containers Docker');
  console.log('3. Acesse a loja em http://localhost:3000');
  console.log('4. Acesse o painel administrativo em http://localhost:3000/admin');
}

// Executar a função principal
setup().catch(error => {
  console.error('Erro durante a configuração:', error);
  process.exit(1);
});