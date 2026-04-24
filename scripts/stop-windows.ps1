$ErrorActionPreference = "Stop"

Set-Location (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location ..

Write-Host "Stopping Prelegal..."
docker compose down
Write-Host "Prelegal stopped."
