# Script para iniciar o Docker Desktop

Write-Host "Verificando se o Docker Desktop está instalado..."

$dockerDesktopPath = "C:\Program Files\Docker\Docker\Docker Desktop.exe"

if (Test-Path $dockerDesktopPath) {
    Write-Host "Docker Desktop encontrado. Tentando iniciar..."
    
    # Verificar se o Docker já está em execução
    try {
        $dockerInfo = docker info 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Docker já está em execução!"
        } else {
            throw "Docker não está em execução"
        }
    } catch {
        Write-Host "Iniciando Docker Desktop..."
        Start-Process -FilePath $dockerDesktopPath
        
        Write-Host "Aguardando o Docker iniciar (isso pode levar alguns minutos)..."
        
        # Aguardar até 2 minutos para o Docker iniciar
        $timeout = New-TimeSpan -Minutes 2
        $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
        $dockerStarted = $false
        
        while ($stopwatch.Elapsed -lt $timeout) {
            try {
                $dockerInfo = docker info 2>&1
                if ($LASTEXITCODE -eq 0) {
                    $dockerStarted = $true
                    break
                }
            } catch {}
            
            Write-Host "." -NoNewline
            Start-Sleep -Seconds 5
        }
        
        if ($dockerStarted) {
            Write-Host "\nDocker iniciado com sucesso!"
        } else {
            Write-Host "\nTempo esgotado. Não foi possível iniciar o Docker automaticamente."
            Write-Host "Por favor, inicie o Docker Desktop manualmente e tente novamente."
            exit 1
        }
    }
} else {
    Write-Host "Erro: Docker Desktop não encontrado no local padrão ($dockerDesktopPath)."
    Write-Host "Por favor, instale o Docker Desktop e tente novamente."
    Write-Host "Visite https://www.docker.com/products/docker-desktop/ para baixar o Docker Desktop."
    exit 1
}

Write-Host "Docker está pronto para uso!"