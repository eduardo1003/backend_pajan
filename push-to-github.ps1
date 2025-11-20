# Script para subir a GitHub
# Este script intentará hacer push y te pedirá autenticación si es necesario

Write-Host "🚀 Intentando subir código a GitHub..." -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: No se encontró el repositorio Git" -ForegroundColor Red
    exit 1
}

# Verificar remote
Write-Host "📡 Verificando remote..." -ForegroundColor Yellow
git remote -v

Write-Host ""
Write-Host "📤 Intentando hacer push..." -ForegroundColor Yellow
Write-Host ""

# Intentar push
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ ¡Código subido exitosamente!" -ForegroundColor Green
    Write-Host "🌐 Repositorio: https://github.com/eduardo1003/app_pajan" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Error al subir. Posibles causas:" -ForegroundColor Red
    Write-Host "   1. El repositorio no existe o el nombre es incorrecto" -ForegroundColor Yellow
    Write-Host "   2. Necesitas autenticarte (usuario y token de GitHub)" -ForegroundColor Yellow
    Write-Host "   3. No tienes permisos para escribir en el repositorio" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 Soluciones:" -ForegroundColor Cyan
    Write-Host "   - Verifica que el repositorio existe: https://github.com/eduardo1003/app_pajan" -ForegroundColor White
    Write-Host "   - Genera un token: https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "   - Usa el token como contraseña cuando Git te lo pida" -ForegroundColor White
}

