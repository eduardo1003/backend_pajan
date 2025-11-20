# Plan de Migración a Neon - App Móvil + Web

## 🎯 Arquitectura Propuesta

```
┌─────────────────┐         ┌──────────────┐         ┌──────────┐
│  Frontend React │  HTTP   │  Backend API │  SQL    │   Neon   │
│  (Móvil + Web)  │ ──────> │  (Express.js)│ ──────> │ PostgreSQL│
└─────────────────┘         └──────────────┘         └──────────┘
                                      │
                                      │ Upload
                                      ▼
                              ┌──────────────┐
                              │  Cloudinary  │
                              │  (Storage)   │
                              └──────────────┘
```

## 📋 Stack Tecnológico Elegido

### Backend API
- **Express.js** - Framework Node.js
- **Prisma** - ORM type-safe para PostgreSQL
- **JWT** - Autenticación con tokens
- **bcrypt** - Hash de contraseñas
- **Cloudinary** - Almacenamiento de archivos

### Frontend (sin cambios)
- **React + Vite** - Ya lo tienes
- **TanStack Query** - Ya lo tienes (perfecto para API calls)
- **Axios** o **fetch** - Para llamadas HTTP al backend

## 🔧 Estructura de Carpetas

```
apppp21/
├── server/                 # Nuevo backend API
│   ├── src/
│   │   ├── routes/        # Endpoints de la API
│   │   ├── middleware/    # Auth, validación, etc.
│   │   ├── services/      # Lógica de negocio
│   │   ├── utils/         # Utilidades
│   │   └── index.ts       # Entry point
│   ├── prisma/
│   │   ├── schema.prisma  # Esquema de Prisma
│   │   └── migrations/    # Migraciones adaptadas
│   ├── .env               # Variables de entorno del backend
│   └── package.json
├── src/                   # Frontend (sin cambios grandes)
│   └── integrations/
│       └── api/           # Cliente API (reemplaza supabase)
└── package.json           # Root (puede tener scripts para ambos)
```

## 🔑 Variables de Entorno

### Backend (.env en server/)
```env
# Neon Database
DATABASE_URL=postgresql://neondb_owner:npg_l8MrDoUvN2wH@ep-ancient-sun-ah950gup-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# JWT
JWT_SECRET=tu_secret_super_seguro_aqui
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:8080
```

### Frontend (.env en root/)
```env
VITE_API_URL=http://localhost:3001/api
```

## 📝 Pasos de Implementación

### Fase 1: Backend Base ✅
1. Crear estructura de carpetas `server/`
2. Instalar dependencias (Express, Prisma, etc.)
3. Configurar Prisma con Neon
4. Crear servidor Express básico

### Fase 2: Base de Datos
1. Adaptar migraciones SQL para Neon
2. Crear schema.prisma
3. Ejecutar migraciones en Neon
4. Verificar conexión

### Fase 3: Autenticación
1. Implementar registro/login
2. Middleware de autenticación JWT
3. Endpoints de auth

### Fase 4: API Endpoints
1. CRUD de incidentes
2. CRUD de perfiles
3. CRUD de departamentos
4. Upload de archivos

### Fase 5: Frontend
1. Crear cliente API
2. Actualizar useAuth hook
3. Actualizar componentes
4. Probar en móvil y web

## 🚀 Comandos Útiles

```bash
# Backend
cd server
npm run dev          # Desarrollo
npm run build        # Build
npm run start        # Producción

# Prisma
npx prisma migrate dev    # Crear migración
npx prisma generate      # Generar cliente
npx prisma studio        # Ver datos

# Frontend (sin cambios)
npm run dev
npm run build
```

## ⚠️ Consideraciones Móvil

1. **URL del API**: En producción, usar URL absoluta (no localhost)
2. **CORS**: Configurar para permitir requests desde la app móvil
3. **HTTPS**: Necesario en producción para la app móvil
4. **Almacenamiento de tokens**: Usar SecureStorage de Capacitor en móvil

