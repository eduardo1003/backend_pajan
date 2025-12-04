# ⚡ Solución Rápida: Error "Failed to fetch"

## 🎯 El Problema

Tu aplicación en Vercel (`app-pajan.vercel.app`) está intentando conectarse a `http://localhost:3001/api`, pero ese servidor no existe en producción.

## ✅ Solución Inmediata: Probar Localmente

### 1. Inicia el Backend

Abre una terminal PowerShell:

```powershell
.\start-backend.ps1
```

Deberías ver:
```
🚀 Server running on http://localhost:3001
```

### 2. Inicia el Frontend

Abre otra terminal PowerShell:

```powershell
.\start-frontend.ps1
```

### 3. Abre en el Navegador

Ve a: **http://localhost:8080**

Ahora debería funcionar porque ambos servidores están corriendo localmente.

## 🚀 Solución para Producción: Desplegar Backend

Para que funcione en Vercel, necesitas desplegar el backend. La opción más fácil es **Railway**:

### Pasos Rápidos:

1. **Ve a:** https://railway.app
2. **Sign up** con GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Selecciona tu repo** y la carpeta `server`
5. **Agrega variables de entorno:**
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_l8MrDoUvN2wH@ep-ancient-sun-ah950gup-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   JWT_SECRET=super_secret_jwt_key_min_32_chars_for_production_change_this
   JWT_EXPIRES_IN=7d
   PORT=3001
   NODE_ENV=production
   CORS_ORIGIN=https://app-pajan.vercel.app
   ```
6. **Copia la URL** que Railway te da (ej: `https://app-pajan-production.up.railway.app`)
7. **En Vercel:**
   - Settings → Environment Variables
   - Agrega: `VITE_API_URL` = `https://tu-url-railway.app/api`
   - Redespliega

## 🔍 Verificar

- Backend: `https://tu-backend.railway.app/health` debe responder OK
- Frontend: Debe poder conectarse al backend

## 💡 Alternativa Rápida: Usar Vercel Serverless

También puedes convertir el backend en funciones serverless de Vercel, pero Railway es más fácil para empezar.

