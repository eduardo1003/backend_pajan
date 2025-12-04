# 🔧 Solución: Error "Failed to fetch"

## 🔍 Problema

El error "Failed to fetch" ocurre porque:

1. **La aplicación está en Vercel** (`app-pajan.vercel.app`)
2. **El frontend intenta conectarse a** `http://localhost:3001/api`
3. **El backend no está desplegado** o no está accesible desde Vercel

## ✅ Soluciones

### Opción 1: Desplegar el Backend (Recomendado para Producción)

Necesitas desplegar el backend en un servicio como:
- **Railway** (fácil y gratis)
- **Render** (fácil y gratis)
- **Fly.io** (gratis)
- **Heroku** (de pago)
- **Vercel Serverless Functions** (si usas Vercel)

### Opción 2: Usar Backend Local (Solo para Desarrollo)

Si estás probando localmente:

1. **Inicia el backend:**
```powershell
.\start-backend.ps1
```

2. **Inicia el frontend localmente:**
```powershell
.\start-frontend.ps1
```

3. **Abre:** http://localhost:8080

### Opción 3: Configurar Variable de Entorno en Vercel

Si ya tienes el backend desplegado:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://tu-backend-url.com/api`
4. Redespliega la aplicación

## 🚀 Desplegar Backend en Railway (Recomendado)

### Paso 1: Crear Cuenta en Railway

1. Ve a: https://railway.app
2. Sign up con GitHub
3. Click "New Project"

### Paso 2: Conectar Repositorio

1. Selecciona "Deploy from GitHub repo"
2. Conecta tu repositorio `app-pajan`
3. Selecciona la carpeta `server`

### Paso 3: Configurar Variables de Entorno

En Railway, agrega estas variables:

```
DATABASE_URL=postgresql://neondb_owner:npg_l8MrDoUvN2wH@ep-ancient-sun-ah950gup-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=super_secret_jwt_key_min_32_chars_for_production_change_this
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://app-pajan.vercel.app
```

### Paso 4: Obtener URL del Backend

Railway te dará una URL como: `https://tu-app.railway.app`

### Paso 5: Configurar Frontend en Vercel

1. Ve a Vercel → Tu proyecto → Settings → Environment Variables
2. Agrega:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://tu-app.railway.app/api`
3. Redespliega

## 🔍 Verificar que Funciona

1. El backend debe estar accesible en: `https://tu-backend.railway.app/health`
2. El frontend debe usar esa URL para las llamadas API

## ⚠️ Nota Importante

- **En desarrollo local:** Usa `http://localhost:3001/api`
- **En producción (Vercel):** Usa la URL de tu backend desplegado

