@echo off
echo Iniciando a Loja Virtual EverShop...

REM Verificar se o Docker está instalado
docker --version > nul 2>&1
if %errorlevel% neq 0 (
    echo Erro: Docker não está instalado ou não está no PATH.
    echo Por favor, instale o Docker Desktop para Windows e tente novamente.
    echo Visite https://www.docker.com/products/docker-desktop/ para baixar o Docker Desktop.
    pause
    exit /b 1
)

REM Verificar se o Docker está em execução
docker info > nul 2>&1
if %errorlevel% neq 0 (
    echo Erro: O Docker não está em execução.
    echo Tentando iniciar o Docker Desktop automaticamente...
    
    REM Verificar se o Docker Desktop está instalado no local padrão
    if exist "C:\Program Files\Docker\Docker\Docker Desktop.exe" (
        echo Iniciando Docker Desktop...
        start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
        
        echo Aguardando o Docker iniciar (isso pode levar alguns minutos)...
        timeout /t 60 /nobreak
        
        REM Verificar novamente se o Docker está em execução
        docker info > nul 2>&1
        if %errorlevel% neq 0 (
            echo Erro: Não foi possível iniciar o Docker automaticamente.
            echo Por favor, inicie o Docker Desktop manualmente e execute este script novamente.
            pause
            exit /b 1
        ) else (
            echo Docker iniciado com sucesso!
        )
    ) else (
        echo Erro: Docker Desktop não encontrado no local padrão.
        echo Por favor, inicie o Docker Desktop manualmente e execute este script novamente.
        pause
        exit /b 1
    )
)

REM Verificar se o arquivo .env existe, caso contrário, criar a partir do .env.example
if not exist .env (
    if exist .env.example (
        echo Criando arquivo .env a partir do .env.example...
        copy .env.example .env
        echo Arquivo .env criado com sucesso.
        echo IMPORTANTE: Edite o arquivo .env com suas configurações!
    ) else (
        echo Erro: Arquivo .env.example não encontrado.
        pause
        exit /b 1
    )
)

REM Iniciar os containers Docker
echo Iniciando os containers Docker...
docker-compose up -d

if %errorlevel% neq 0 (
    echo Erro ao iniciar os containers Docker.
    pause
    exit /b 1
)

echo.
echo Loja Virtual EverShop iniciada com sucesso!
echo.
echo Acesse a loja em: http://localhost:3000
echo Acesse o painel administrativo em: http://localhost:3000/admin
echo.
echo Pressione qualquer tecla para abrir a loja no navegador...
pause > nul

start http://localhost:3000