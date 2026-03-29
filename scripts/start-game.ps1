param(
  [switch]$NoBrowser,
  [int]$Port = 3000
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$healthUrl = "http://localhost:$Port/api/health"
$gameUrl = "http://localhost:$Port"

function Test-GameHealth {
  param([string]$Url)

  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec 2
    return $response.StatusCode -ge 200 -and $response.StatusCode -lt 400
  } catch {
    return $false
  }
}

Set-Location $repoRoot

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  throw "npm was not found in PATH. Install Node.js before starting Codex Pixel Lab."
}

if (-not (Test-Path (Join-Path $repoRoot 'node_modules'))) {
  Write-Host 'Installing dependencies...' -ForegroundColor Yellow
  npm install
}

if (Test-GameHealth -Url $healthUrl) {
  Write-Host "Codex Pixel Lab is already running at $gameUrl" -ForegroundColor Green
  if (-not $NoBrowser) {
    Start-Process $gameUrl | Out-Null
  }
  exit 0
}

Write-Host "Starting Codex Pixel Lab on $gameUrl ..." -ForegroundColor Cyan

$serverCommand = "Set-Location '$repoRoot'; npm run dev"
Start-Process `
  -FilePath 'powershell.exe' `
  -WorkingDirectory $repoRoot `
  -ArgumentList @(
    '-NoExit',
    '-ExecutionPolicy', 'Bypass',
    '-Command', $serverCommand
  ) | Out-Null

$maxAttempts = 40
for ($attempt = 1; $attempt -le $maxAttempts; $attempt += 1) {
  Start-Sleep -Milliseconds 750
  if (Test-GameHealth -Url $healthUrl) {
    Write-Host "Codex Pixel Lab is live at $gameUrl" -ForegroundColor Green
    if (-not $NoBrowser) {
      Start-Process $gameUrl | Out-Null
    }
    exit 0
  }
}

Write-Warning "Server window was started, but the healthcheck did not answer in time. Check the opened PowerShell window for errors."
if (-not $NoBrowser) {
  Start-Process $gameUrl | Out-Null
}
