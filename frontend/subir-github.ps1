# Script para subir a GitHub
# Repositorio: https://github.com/eduardo-daniel/app-pajan.git

Write-Host "🚀 Subiendo código a GitHub..." -ForegroundColor Cyan
Write-Host "📦 Repositorio: https://github.com/eduardo-daniel/app-pajan.git" -ForegroundColor Yellow
Write-Host ""

# Verificar estado
Write-Host "📊 Estado del repositorio:" -ForegroundColor Cyan
git status --short

Write-Host ""
Write-Host "📡 Remote configurado:" -ForegroundColor Cyan
git remote -v

Write-Host ""
Write-Host "📤 Intentando hacer push..." -ForegroundColor Yellow
Write-Host ""

# Intentar push
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ ¡Código subido exitosamente!" -ForegroundColor Green
    Write-Host "🌐 Ver en: https://github.com/eduardo-daniel/app-pajan" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Error al subir. Posibles causas:" -ForegroundColor Red
    Write-Host ""
    Write-Host "1️⃣  El repositorio no existe aún" -ForegroundColor Yellow
    Write-Host "   → Ve a: https://github.com/new" -ForegroundColor White
    Write-Host "   → Nombre: app-pajan" -ForegroundColor White
    Write-Host "   → Crea el repositorio (puede tener README)" -ForegroundColor White
    Write-Host ""
    Write-Host "2️⃣  Necesitas autenticarte" -ForegroundColor Yellow
    Write-Host "   → GitHub requiere un Personal Access Token" -ForegroundColor White
    Write-Host "   → Genera uno en: https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "   → Scope: 'repo'" -ForegroundColor White
    Write-Host ""
    Write-Host "3️⃣  El repositorio tiene contenido" -ForegroundColor Yellow
    Write-Host "   → Si tiene README, necesitas hacer pull primero:" -ForegroundColor White
    Write-Host "   → git pull origin main --allow-unrelated-histories" -ForegroundColor Green
    Write-Host "   → Luego: git push -u origin main" -ForegroundColor Green
    Write-Host ""
    Write-Host "💡 Si necesitas usar token:" -ForegroundColor Cyan
    Write-Host "   git remote set-url origin https://TU_TOKEN@github.com/eduardo-daniel/app-pajan.git" -ForegroundColor Green
    Write-Host "   git push -u origin main" -ForegroundColor Green
}

