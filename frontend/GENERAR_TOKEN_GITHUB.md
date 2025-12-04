# 🔑 Generar Token de GitHub para Push

## ⚠️ Importante

GitHub **ya no acepta contraseñas** para autenticación HTTPS desde agosto de 2021. Necesitas un **Personal Access Token**.

## 📝 Pasos para Generar el Token

### 1. Ir a la Configuración de Tokens

Abre en tu navegador:
**https://github.com/settings/tokens**

### 2. Generar Nuevo Token

1. Click en **"Generate new token"**
2. Selecciona **"Generate new token (classic)"**

### 3. Configurar el Token

- **Note:** `app_pajan_push` (o cualquier nombre descriptivo)
- **Expiration:** 
  - Elige una fecha (ej: 90 días)
  - O "No expiration" si prefieres
- **Select scopes:** 
  - ✅ Marca **`repo`** (esto incluye todos los permisos de repositorio)
  - Esto te permitirá leer y escribir en repositorios privados

### 4. Generar y Copiar

1. Click en **"Generate token"** (abajo)
2. **⚠️ COPIA EL TOKEN INMEDIATAMENTE**
   - Se muestra solo una vez
   - Si lo pierdes, tendrás que generar uno nuevo

## 🚀 Usar el Token

### Opción 1: En la URL (Más Fácil)

```powershell
# Reemplaza TU_TOKEN con el token que copiaste
git remote set-url origin https://TU_TOKEN@github.com/eduardo1003/app_pajan.git
git push -u origin main
```

### Opción 2: Cuando Git Pida Credenciales

```powershell
git push -u origin main
```

Cuando te pida:
- **Username:** `eduardo1003`
- **Password:** [PEGA TU TOKEN AQUÍ] (no tu contraseña de GitHub)

## 🔒 Seguridad

- ✅ El token es como una contraseña - no lo compartas
- ✅ Puedes revocarlo en cualquier momento desde GitHub
- ✅ Úsalo solo para este proyecto
- ✅ No lo subas al repositorio (está en .gitignore)

## 📋 Ejemplo Completo

```powershell
# 1. Configurar usuario (ya hecho)
git config --global user.email "leyskereduardo@gmail.com"
git config --global user.name "eduardo1003"

# 2. Configurar remote con token
git remote set-url origin https://ghp_xxxxxxxxxxxx@github.com/eduardo1003/app_pajan.git

# 3. Hacer push
git push -u origin main
```

## ✅ Verificar que Funcionó

Después del push deberías ver:
```
Enumerating objects: 205, done.
Counting objects: 100% (205/205), done.
Writing objects: 100% (205/205), done.
To https://github.com/eduardo1003/app_pajan.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

## 🆘 Si Tienes Problemas

1. **Verifica que el repositorio existe:**
   - Abre: https://github.com/eduardo1003/app_pajan
   - Si no existe, créalo primero

2. **Verifica el nombre del repositorio:**
   - Puede ser `app-pajan` (con guión) en lugar de `app_pajan` (con guión bajo)

3. **Verifica permisos:**
   - Asegúrate de tener acceso de escritura al repositorio

