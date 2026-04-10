$ErrorActionPreference = 'Stop'

$targetDir = "d:\Agent\extension"

$ideDirs = @(".vscode", ".antigravity", ".cursor", ".windsurf")

foreach ($ide in $ideDirs) {
    $extDir = Join-Path $env:USERPROFILE "$ide\extensions"
    $linkPath = Join-Path $extDir "pixel-lab"

    if (-not (Test-Path $extDir)) {
        continue
    }

    if (Test-Path $linkPath) {
        if ((Get-Item $linkPath).Attributes -match "ReparsePoint") {
            Remove-Item $linkPath
        }
        else {
            Remove-Item $linkPath -Recurse -Force
        }
    }

    Write-Host "Criando Junção de Diretório para $($ide): $linkPath -> $targetDir"
    cmd /c mklink /J "$linkPath" "$targetDir"
}

Write-Host "SUCESSO: Extensão vinculada com sucesso em todas as IDEs compatíveis encontradas!"
Write-Host "POR FAVOR: Reinicie a sua janela para carregar o comando 'Pixel Lab'."
