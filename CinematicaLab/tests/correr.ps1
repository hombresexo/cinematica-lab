# Ejecuta una página de pruebas en Chrome headless (modo clásico) y guarda el DOM resultante.
param(
  [string]$Pagina = "tests.html",
  [string]$Salida = "salida.html",
  [int]$Segundos = 60
)
$ErrorActionPreference = "Continue"
$raiz = Split-Path -Parent $PSScriptRoot
$url = "file:///" + ($raiz -replace '\\', '/') + "/tests/" + $Pagina
$tmp = Join-Path $env:TEMP ("cinematica_lab_" + [guid]::NewGuid().ToString("N").Substring(0, 8))
$out = Join-Path $raiz ("tests\" + $Salida)
$args = @(
  "--headless=old", "--disable-gpu", "--no-sandbox", "--no-first-run",
  "--disable-extensions", "--user-data-dir=$tmp",
  "--allow-file-access-from-files", "--dump-dom", $url
)
$p = Start-Process -FilePath "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  -ArgumentList $args -RedirectStandardOutput $out -NoNewWindow -PassThru
$fin = (Get-Date).AddSeconds($Segundos)
while (-not $p.HasExited -and (Get-Date) -lt $fin) { Start-Sleep -Milliseconds 300 }
if (-not $p.HasExited) { Stop-Process -Id $p.Id -Force; Write-Output "AVISO: Chrome no finalizó, se detuvo por tiempo." }
Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue
Write-Output ("Salida: " + $out + " (" + (Get-Item $out).Length + " bytes)")