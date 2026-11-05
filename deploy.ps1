# Vercel Deployment Script (PowerShell)
param (
    [switch]$Preview = $false
)

$ErrorActionPreference = "Stop"

Write-Host "Checking Vercel CLI..." -ForegroundColor Cyan

# Check if vercel command is installed, otherwise fallback to npx vercel
if (-not (Get-Command "vercel" -ErrorAction SilentlyContinue)) {
    Write-Host "Vercel CLI not found globally. Using npx vercel..." -ForegroundColor Yellow
    $vercelCmd = "npx --yes vercel"
} else {
    $vercelCmd = "vercel"
}

if ($Preview) {
    Write-Host "Deploying preview build to Vercel..." -ForegroundColor Cyan
    Invoke-Expression "$vercelCmd"
} else {
    Write-Host "Deploying production build to Vercel (--prod)..." -ForegroundColor Green
    Invoke-Expression "$vercelCmd --prod"
}

