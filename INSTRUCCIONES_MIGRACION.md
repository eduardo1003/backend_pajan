# 📋 Instrucciones de Migración a Neon

## ✅ Lo que ya está hecho

1. ✅ Estructura del backend API creada (`server/`)
2. ✅ Prisma configurado con schema adaptado
3. ✅ Autenticación básica implementada (JWT)
4. ✅ Cliente API para frontend creado
5. ✅ Migración SQL adaptada para Neon

## 🚀 Pasos para Completar la Migración

### Paso 1: Configurar el Backend

```bash
# 1. Ir a la carpeta del servidor
cd server

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env con tu connection string de Neon
# Copia el contenido de .env.example y actualiza DATABASE_URL
```

**Archivo `.env` en `server/`:**
```env
DATABASE_URL=postgresql://neondb_owner:npg_l8MrDoUvN2wH@ep-ancient-sun-ah950gup-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=tu_secret_super_seguro_minimo_32_caracteres_aqui
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:8080
```

### Paso 2: Configurar Prisma y Base de Datos

```bash
cd server

# Generar cliente de Prisma
npm run prisma:generate

# Ejecutar migración SQL directamente en Neon
# Opción A: Usar Prisma Migrate
npm run prisma:migrate

# Opción B: Ejecutar SQL manualmente en Neon
# Copia el contenido de server/prisma/migrations/001_initial_schema.sql
# y ejecútalo en el SQL Editor de Neon
```

### Paso 3: Probar el Backend

```bash
cd server

# Iniciar servidor de desarrollo
npm run dev
```

Deberías ver:
```
🚀 Server running on http://localhost:3001
📊 Health check: http://localhost:3001/health
🔌 Database test: http://localhost:3001/api/test-db
```

Prueba en el navegador:
- http://localhost:3001/health
- http://localhost:3001/api/test-db

### Paso 4: Configurar Frontend

1. **Crear archivo `.env` en la raíz del proyecto:**
```env
VITE_API_URL=http://localhost:3001/api
```

2. **Instalar dependencias si falta algo:**
```bash
npm install
```

### Paso 5: Actualizar el Hook de Autenticación

El archivo `src/hooks/useAuth.tsx` necesita ser actualizado para usar el nuevo cliente API en lugar de Supabase.

**Cambios necesarios:**
- Reemplazar `supabase.auth.*` por `apiClient.*`
- Actualizar el manejo de sesiones
- Adaptar el contexto de autenticación

### Paso 6: Probar Autenticación

```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
npm run dev
```

Prueba:
1. Ir a http://localhost:8080
2. Intentar registrarse
3. Intentar iniciar sesión

## 📝 Próximos Pasos (Pendientes)

### 1. Completar Endpoints del Backend

Necesitas crear endpoints para:
- ✅ Autenticación (ya hecho)
- ⏳ Incidentes (CRUD)
- ⏳ Perfiles (CRUD)
- ⏳ Departamentos (CRUD)
- ⏳ Categorías (CRUD)
- ⏳ Upload de archivos (Cloudinary)

### 2. Actualizar Frontend

Archivos que necesitan cambios:
- `src/hooks/useAuth.tsx` - Usar nuevo API
- `src/pages/NewReport.tsx` - Usar nuevo API
- `src/pages/admin/IncidentManagement.tsx` - Usar nuevo API
- `src/components/AdminStatistics.tsx` - Usar nuevo API
- Todos los componentes que usan `supabase.from()`

### 3. Configurar Almacenamiento

Para reemplazar Supabase Storage:
1. Crear cuenta en Cloudinary (gratis)
2. Agregar variables de entorno en `server/.env`
3. Crear endpoint de upload en el backend
4. Actualizar componentes que suben archivos

### 4. Configurar para Producción

- Variables de entorno de producción
- URL del API para móvil (no localhost)
- HTTPS necesario
- CORS configurado correctamente

## 🔧 Comandos Útiles

```bash
# Backend
cd server
npm run dev              # Desarrollo
npm run build           # Build
npm run prisma:studio   # Ver datos en Prisma Studio

# Frontend
npm run dev             # Desarrollo
npm run build           # Build para producción
npm run cap:sync        # Sincronizar con Capacitor
```

## ⚠️ Notas Importantes

1. **No expongas el JWT_SECRET** - Debe ser un string largo y aleatorio
2. **CORS** - Asegúrate de configurar CORS_ORIGIN correctamente
3. **HTTPS en producción** - Necesario para la app móvil
4. **Variables de entorno** - Nunca commitees archivos `.env`

## 🆘 Troubleshooting

### Error de conexión a la base de datos
- Verifica que el `DATABASE_URL` esté correcto
- Asegúrate de que Neon permita conexiones desde tu IP
- Verifica que el SSL esté habilitado (`sslmode=require`)

### Error de CORS
- Verifica que `CORS_ORIGIN` en el backend coincida con la URL del frontend
- En desarrollo: `http://localhost:8080`
- En producción: tu dominio real

### Error de autenticación
- Verifica que el token se esté guardando correctamente
- Revisa que el header `Authorization` se esté enviando

## 📚 Recursos

- [Prisma Docs](https://www.prisma.io/docs)
- [Express.js Docs](https://expressjs.com/)
- [Neon Docs](https://neon.tech/docs)
- [JWT](https://jwt.io/)

