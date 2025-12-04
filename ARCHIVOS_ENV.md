# 📝 Archivos .env Necesarios

## 🔍 Ubicación de los Archivos .env

Necesitas crear **2 archivos .env** (están en .gitignore, por eso no los ves):

### 1. `.env` en la raíz del proyecto (Frontend)

**Ubicación:** `D:\leysker\apppp21\.env`

**Contenido (Producción - Render):**
```env
VITE_API_URL=https://app-pajan.onrender.com/api
```

**Para desarrollo local:**
```env
VITE_API_URL=http://localhost:3001/api
```

### 2. `.env` en la carpeta server (Backend)

**Ubicación:** `D:\leysker\apppp21\server\.env`

**Contenido:**
```env
DATABASE_URL=postgresql://neondb_owner:npg_l8MrDoUvN2wH@ep-ancient-sun-ah950gup-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=super_secret_jwt_key_min_32_chars_for_production_change_this
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:8080

# Opcional: Cloudinary para uploads
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

## 🚀 Crear los Archivos

### Opción 1: Manualmente

1. **Frontend .env:**
   - Crea archivo: `D:\leysker\apppp21\.env`
   - Pega el contenido de arriba

2. **Backend .env:**
   - Crea archivo: `D:\leysker\apppp21\server\.env`
   - Pega el contenido de arriba

### Opción 2: Usando PowerShell

```powershell
# Crear .env del frontend
@"
VITE_API_URL=http://localhost:3001/api
"@ | Out-File -FilePath .env -Encoding utf8

# Crear .env del backend
@"
DATABASE_URL=postgresql://neondb_owner:npg_l8MrDoUvN2wH@ep-ancient-sun-ah950gup-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=super_secret_jwt_key_min_32_chars_for_production_change_this
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:8080
"@ | Out-File -FilePath server\.env -Encoding utf8
```

## ⚠️ Importante

- Los archivos `.env` están en `.gitignore` (no se suben a GitHub)
- **NUNCA** subas archivos `.env` al repositorio
- Las credenciales deben mantenerse privadas
- En producción, configura las variables de entorno en la plataforma (Vercel, Railway, etc.)

## 🔍 Verificar que Existen

```powershell
# Verificar frontend
Test-Path .env

# Verificar backend
Test-Path server\.env
```

## 📋 Variables Explicadas

### Frontend (.env en raíz)
- `VITE_API_URL`: URL del backend API

### Backend (server/.env)
- `DATABASE_URL`: Connection string de Neon PostgreSQL
- `JWT_SECRET`: Clave secreta para firmar tokens JWT (cámbiala en producción)
- `JWT_EXPIRES_IN`: Tiempo de expiración de tokens (7d = 7 días)
- `PORT`: Puerto donde corre el backend (3001)
- `NODE_ENV`: Entorno (development/production)
- `CORS_ORIGIN`: URL permitida para CORS (URL del frontend)
- `CLOUDINARY_*`: Opcional, para uploads de imágenes

