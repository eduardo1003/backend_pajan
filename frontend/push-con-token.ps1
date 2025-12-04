# Script para hacer push con token
# Necesitas generar un token primero en: https://github.com/settings/tokens

Write-Host "🔐 Para hacer push necesitas un Personal Access Token" -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 Pasos:" -ForegroundColor Cyan
Write-Host "   1. Ve a: https://github.com/settings/tokens" -ForegroundColor White
Write-Host "   2. Generate new token (classic)" -ForegroundColor White
Write-Host "   3. Scope: repo" -ForegroundColor White
Write-Host "   4. Copia el token" -ForegroundColor White
Write-Host ""
Write-Host "💡 Luego ejecuta:" -ForegroundColor Cyan
Write-Host "   git remote set-url origin https://TU_TOKEN@github.com/eduardo-daniel/app-pajan.git" -ForegroundColor Green
Write-Host "   git push -u origin main" -ForegroundColor Green
Write-Host ""
Write-Host "O si prefieres, cuando Git te pida credenciales:" -ForegroundColor Yellow
Write-Host "   Username: eduardo-daniel" -ForegroundColor White
Write-Host "   Password: [PEGA TU TOKEN]" -ForegroundColor White

