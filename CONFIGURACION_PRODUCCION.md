# 🚀 Configuración para Producción

## ✅ Backend Desplegado

Tu backend está desplegado en: **https://app-pajan.onrender.com**

## 📝 Archivo .env del Frontend

**Ubicación:** `.env` en la raíz del proyecto

**Contenido:**
```env
VITE_API_URL=https://app-pajan.onrender.com/api
```

## 🔧 Configurar en Vercel

Para que funcione en Vercel, necesitas agregar la variable de entorno:

1. Ve a tu proyecto en Vercel
2. **Settings** → **Environment Variables**
3. Agrega:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://app-pajan.onrender.com/api`
   - **Environment:** Marca todas (Production, Preview, Development)
4. Click **"Save"**
5. Ve a **Deployments** → Click en los 3 puntos del último deployment → **Redeploy**

## ✅ Verificar que Funciona

1. **Backend:** https://app-pajan.onrender.com/health
   - Debería responder: `{"status":"ok","message":"API is running"}`

2. **Frontend:** Después de redesplegar en Vercel
   - Debería poder conectarse al backend
   - El login debería funcionar

## 🔍 Si Aún No Funciona

### Verificar CORS en el Backend

Asegúrate de que en Render, la variable de entorno `CORS_ORIGIN` sea:
```
CORS_ORIGIN=https://app-pajan.vercel.app
```

O si quieres permitir múltiples orígenes:
```
CORS_ORIGIN=https://app-pajan.vercel.app,https://app-pajan.onrender.com
```

### Verificar Variables de Entorno en Render

En tu proyecto de Render, verifica que tengas:

```
DATABASE_URL=postgresql://neondb_owner:npg_l8MrDoUvN2wH@ep-ancient-sun-ah950gup-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=super_secret_jwt_key_min_32_chars_for_production_change_this
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://app-pajan.vercel.app
```

## 📋 Resumen

- ✅ Backend: https://app-pajan.onrender.com
- ✅ Frontend: https://app-pajan.vercel.app (después de configurar VITE_API_URL)
- ✅ Base de datos: Neon PostgreSQL (ya configurada)

