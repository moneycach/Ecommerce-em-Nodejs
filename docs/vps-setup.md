# Configuração do VPS para EverShop

Este guia fornece instruções para configurar um servidor VPS para hospedar a loja virtual EverShop.

## Requisitos do Servidor

- Ubuntu 20.04 LTS ou superior
- Mínimo 2GB de RAM
- 2 vCPUs ou mais
- 20GB de espaço em disco

## Passo 1: Atualizar o Sistema

```bash
sudo apt update
sudo apt upgrade -y
```

## Passo 2: Instalar o Docker e Docker Compose

### Instalar o Docker

```bash
# Instalar pacotes necessários
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Adicionar a chave GPG oficial do Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Adicionar o repositório do Docker
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# Atualizar o índice de pacotes
sudo apt update

# Instalar o Docker
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Adicionar seu usuário ao grupo docker
sudo usermod -aG docker $USER

# Aplicar as alterações de grupo
newgrp docker
```

### Instalar o Docker Compose

```bash
# Baixar o Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.15.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Tornar o binário executável
sudo chmod +x /usr/local/bin/docker-compose

# Verificar a instalação
docker-compose --version
```

## Passo 3: Configurar o Firewall

```bash
# Instalar o UFW se ainda não estiver instalado
sudo apt install -y ufw

# Permitir SSH
sudo ufw allow ssh

# Permitir HTTP e HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Habilitar o firewall
sudo ufw enable
```

## Passo 4: Instalar o Nginx como Proxy Reverso

```bash
# Instalar o Nginx
sudo apt install -y nginx

# Iniciar o Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Passo 5: Configurar o Nginx como Proxy Reverso

Crie um arquivo de configuração para o seu site:

```bash
sudo nano /etc/nginx/sites-available/evershop
```

Adicione a seguinte configuração:

```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ative a configuração e reinicie o Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/evershop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Passo 6: Configurar SSL com Certbot

```bash
# Instalar o Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obter certificado SSL
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# Verificar a renovação automática
sudo certbot renew --dry-run
```

## Passo 7: Clonar o Repositório e Configurar o Projeto

```bash
# Criar diretório para o projeto
mkdir -p /var/www/evershop
cd /var/www/evershop

# Clonar o repositório
git clone https://github.com/seu-usuario/seu-repositorio.git .

# Copiar o arquivo .env.example para .env
cp .env.example .env

# Editar o arquivo .env com as configurações corretas
nano .env
```

## Passo 8: Iniciar os Containers Docker

```bash
# Iniciar os containers em modo detached
docker-compose up -d
```

## Passo 9: Configurar Backup Automático

Crie um script de backup:

```bash
sudo nano /usr/local/bin/backup-evershop.sh
```

Adicione o seguinte conteúdo:

```bash
#!/bin/bash

# Definir variáveis
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=/var/backups/evershop
PROJECT_DIR=/var/www/evershop

# Criar diretório de backup se não existir
mkdir -p $BACKUP_DIR

# Backup do banco de dados
docker exec evershop-mysql mysqldump -u root -pevershop evershop > $BACKUP_DIR/evershop_db_$TIMESTAMP.sql

# Backup dos arquivos do projeto
tar -czf $BACKUP_DIR/evershop_files_$TIMESTAMP.tar.gz -C $PROJECT_DIR .

# Manter apenas os últimos 7 backups
find $BACKUP_DIR -name "evershop_db_*.sql" -type f -mtime +7 -delete
find $BACKUP_DIR -name "evershop_files_*.tar.gz" -type f -mtime +7 -delete

echo "Backup concluído em: $(date)"
```

Torne o script executável e configure um cron job:

```bash
sudo chmod +x /usr/local/bin/backup-evershop.sh
sudo crontab -e
```

Adicione a seguinte linha para executar o backup diariamente às 2h da manhã:

```
0 2 * * * /usr/local/bin/backup-evershop.sh >> /var/log/evershop-backup.log 2>&1
```

## Passo 10: Monitoramento

Instale o Netdata para monitoramento em tempo real:

```bash
bash <(curl -Ss https://my-netdata.io/kickstart.sh)
```

Acesse o painel de monitoramento em `http://seu-ip:19999`

## Solução de Problemas

### Verificar logs do Docker

```bash
docker-compose logs -f
```

### Reiniciar os containers

```bash
docker-compose restart
```

### Verificar status dos containers

```bash
docker-compose ps
```

### Verificar logs do Nginx

```bash
sudo tail -f /var/log/nginx/error.log
```