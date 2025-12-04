# 📤 Instrucciones para Subir a GitHub

## ⚠️ El repositorio no existe aún

Necesitas crear el repositorio en GitHub primero.

## 🚀 Pasos para Subir el Código

### Paso 1: Crear el Repositorio en GitHub

1. Ve a: https://github.com/new
2. **Repository name:** `app_pajan`
3. **Description:** (opcional) "Aplicación de Participación Ciudadana - GAD Paján"
4. **Visibility:** Pública o Privada (tu elección)
5. **NO marques:**
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
6. Click **"Create repository"**

### Paso 2: Subir el Código

Una vez creado el repositorio, ejecuta:

```powershell
git push -u origin main
```

Si te pide autenticación, usa un **Personal Access Token** de GitHub.

## 🔑 Si Necesitas Autenticación

Si GitHub te pide usuario y contraseña:

1. Ve a: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Dale un nombre (ej: "app_pajan")
4. Selecciona el scope: **`repo`** (todos los permisos de repositorio)
5. Click **"Generate token"**
6. **Copia el token** (solo se muestra una vez)
7. Cuando git te pida contraseña, usa el **token** en lugar de tu contraseña

## ✅ Verificar que Funcionó

Después del push, deberías ver:
```
Enumerating objects: ...
Counting objects: ...
Writing objects: ...
To https://github.com/eduardo1003/app_pajan.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

## 📝 Estado Actual

- ✅ Repositorio Git inicializado
- ✅ Todos los archivos agregados
- ✅ Commit inicial creado
- ✅ Remote configurado
- ⏳ Esperando que crees el repositorio en GitHub

## 🔒 Archivos Protegidos

El `.gitignore` está configurado para **NO subir**:
- Archivos `.env` (variables de entorno)
- `node_modules/`
- `dist/`
- Archivos de build

**IMPORTANTE:** Las credenciales de la base de datos NO están en el repositorio.

