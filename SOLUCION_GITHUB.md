# 🔧 Solución: Subir a GitHub

## ⚠️ Problema Actual

Git no puede encontrar el repositorio. Esto puede deberse a:

1. **Autenticación requerida** (más probable para repositorios privados)
2. **Nombre del repositorio diferente**
3. **URL incorrecta**

## ✅ Solución 1: Autenticación Manual

### Paso 1: Generar Token de GitHub

1. Ve a: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. **Note:** `app_pajan_push`
4. **Expiration:** Elige una fecha (o "No expiration")
5. **Select scopes:** Marca **`repo`** (todos los permisos)
6. Click **"Generate token"**
7. **COPIA EL TOKEN** (solo se muestra una vez)

### Paso 2: Configurar Credenciales

Ejecuta estos comandos (reemplaza `TU_TOKEN` con el token que copiaste):

```powershell
# Opción A: Usar token en la URL
git remote set-url origin https://TU_TOKEN@github.com/eduardo1003/app_pajan.git
git push -u origin main
```

O mejor, usa el token cuando Git te lo pida:

```powershell
git push -u origin main
# Usuario: eduardo1003
# Contraseña: [PEGA TU TOKEN AQUÍ]
```

## ✅ Solución 2: Verificar Nombre del Repositorio

Verifica que el nombre del repositorio sea exactamente `app_pajan`:

1. Ve a: https://github.com/eduardo1003?tab=repositories
2. Busca el repositorio
3. Verifica el nombre exacto (puede ser `app-pajan` con guión, o diferente)

Si el nombre es diferente, actualiza el remote:

```powershell
git remote set-url origin https://github.com/eduardo1003/NOMBRE_CORRECTO.git
git push -u origin main
```

## ✅ Solución 3: Usar SSH (Recomendado para el futuro)

Si tienes SSH configurado:

```powershell
git remote set-url origin git@github.com:eduardo1003/app_pajan.git
git push -u origin main
```

## 🔍 Verificar Estado Actual

```powershell
# Ver remote configurado
git remote -v

# Ver commits locales
git log --oneline

# Ver estado
git status
```

## 📝 Comandos Rápidos

```powershell
# Si el repositorio existe y solo necesitas autenticarte:
git push -u origin main

# Si necesitas cambiar la URL:
git remote set-url origin https://github.com/eduardo1003/app_pajan.git

# Si el repositorio tiene un nombre diferente:
# Primero verifica en GitHub, luego:
git remote set-url origin https://github.com/eduardo1003/NOMBRE_REAL.git
```

## 🆘 Si Nada Funciona

1. **Verifica que el repositorio existe:**
   - Abre: https://github.com/eduardo1003/app_pajan
   - Si no existe, créalo primero

2. **Verifica permisos:**
   - Asegúrate de tener acceso de escritura al repositorio

3. **Intenta desde GitHub Desktop o desde la web:**
   - Puedes subir archivos manualmente desde la interfaz web

