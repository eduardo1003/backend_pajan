# 🚀 Desplegar Backend en Railway (Guía Rápida)

## ⚡ Solución al Error "Failed to fetch"

Tu aplicación en Vercel necesita un backend desplegado. Railway es la opción más fácil y gratuita.

## 📋 Pasos para Desplegar

### 1. Crear Cuenta en Railway

1. Ve a: **https://railway.app**
2. Click **"Start a New Project"**
3. Selecciona **"Login with GitHub"**
4. Autoriza Railway

### 2. Crear Nuevo Proyecto

1. Click **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Conecta tu repositorio: `eduardo-daniel/app-pajan`
4. Selecciona el repositorio

### 3. Configurar el Servicio

1. Railway detectará automáticamente que es Node.js
2. **IMPORTANTE:** En "Root Directory", escribe: `server`
3. Click en el servicio creado

### 4. Configurar Variables de Entorno

En la pestaña **"Variables"**, agrega:

```
DATABASE_URL=postgresql://neondb_owner:npg_l8MrDoUvN2wH@ep-ancient-sun-ah950gup-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=super_secret_jwt_key_min_32_chars_for_production_change_this
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://app-pajan.vercel.app
```

### 5. Configurar Build y Start

En **"Settings"** → **"Deploy"**:

- **Build Command:** `npm install && npm run prisma:generate && npm run build`
- **Start Command:** `npm start`

O deja que Railway lo detecte automáticamente.

### 6. Obtener URL del Backend

1. En la pestaña **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. Copia la URL (ej: `https://app-pajan-production.up.railway.app`)

### 7. Configurar Frontend en Vercel

1. Ve a **Vercel** → Tu proyecto → **Settings** → **Environment Variables**
2. Agrega nueva variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://tu-url-railway.app/api` (la URL que copiaste + `/api`)
   - **Environment:** Production, Preview, Development (marca todas)
3. Click **"Save"**
4. Ve a **Deployments** → Click en los 3 puntos → **Redeploy**

## ✅ Verificar que Funciona

1. **Backend:** Abre `https://tu-backend.railway.app/health`
   - Debería responder: `{"status":"ok","message":"API is running"}`

2. **Frontend:** Abre `https://app-pajan.vercel.app`
   - Debería poder iniciar sesión ahora

## 🔧 Troubleshooting

### El backend no inicia
- Verifica que `Root Directory` sea `server`
- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs en Railway

### Error de CORS
- Verifica que `CORS_ORIGIN` en Railway sea `https://app-pajan.vercel.app`
- Debe coincidir exactamente con la URL de Vercel

### Error de base de datos
- Verifica que `DATABASE_URL` esté correcto
- Verifica que Neon permita conexiones desde Railway

## 💰 Costos

Railway tiene un plan gratuito generoso:
- $5 de crédito gratis al mes
- Suficiente para una aplicación pequeña/mediana

## 🎯 Alternativa: Render

Si prefieres Render:

1. Ve a: https://render.com
2. **New** → **Web Service**
3. Conecta tu repo de GitHub
4. Configura:
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npm run prisma:generate && npm run build`
   - **Start Command:** `npm start`
5. Agrega las mismas variables de entorno
6. Obtén la URL y configúrala en Vercel

