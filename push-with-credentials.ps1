# Script para hacer push con credenciales
# NOTA: GitHub ya no acepta contraseñas, necesitas un Personal Access Token

Write-Host "🔐 Configurando credenciales..." -ForegroundColor Cyan

# Configurar usuario
git config --global user.email "leyskereduardo@gmail.com"
git config --global user.name "eduardo1003"

Write-Host ""
Write-Host "⚠️  IMPORTANTE: GitHub ya no acepta contraseñas." -ForegroundColor Yellow
Write-Host "   Necesitas un Personal Access Token." -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 Pasos para generar el token:" -ForegroundColor Cyan
Write-Host "   1. Ve a: https://github.com/settings/tokens" -ForegroundColor White
Write-Host "   2. Click 'Generate new token' → 'Generate new token (classic)'" -ForegroundColor White
Write-Host "   3. Nombre: 'app_pajan_push'" -ForegroundColor White
Write-Host "   4. Expiration: Elige una fecha" -ForegroundColor White
Write-Host "   5. Scopes: Marca 'repo' (todos los permisos)" -ForegroundColor White
Write-Host "   6. Click 'Generate token'" -ForegroundColor White
Write-Host "   7. COPIA EL TOKEN (solo se muestra una vez)" -ForegroundColor White
Write-Host ""
Write-Host "💡 Luego ejecuta:" -ForegroundColor Cyan
Write-Host "   git remote set-url origin https://TU_TOKEN@github.com/eduardo1003/app_pajan.git" -ForegroundColor Green
Write-Host "   git push -u origin main" -ForegroundColor Green
Write-Host ""
Write-Host "O usa el token como contraseña cuando Git te lo pida." -ForegroundColor Yellow

