$ErrorActionPreference = "Stop"

Set-Location (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location ..

Write-Host "Starting Prelegal..."
docker compose up -d --build
Write-Host "Prelegal is running at http://localhost:8000"
