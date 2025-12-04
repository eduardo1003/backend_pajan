# 🚀 Setup Completo - Aplicación con Neon

## ✅ Estado: TODO CONFIGURADO

La base de datos ya está migrada y lista. Solo necesitas iniciar los servidores.

## 🎯 Inicio Rápido

### Opción 1: Usar los scripts (Recomendado)

**Terminal 1 - Backend:**
```powershell
.\start-backend.ps1
```

**Terminal 2 - Frontend:**
```powershell
.\start-frontend.ps1
```

### Opción 2: Manual

**Terminal 1 - Backend:**
```powershell
cd server
$env:DATABASE_URL="postgresql://neondb_owner:npg_l8MrDoUvN2wH@ep-ancient-sun-ah950gup-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
$env:JWT_SECRET="super_secret_jwt_key_min_32_chars_for_production_change_this"
$env:JWT_EXPIRES_IN="7d"
$env:PORT="3001"
$env:NODE_ENV="development"
$env:CORS_ORIGIN="http://localhost:8080"
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
$env:VITE_API_URL="http://localhost:3001/api"
npm run dev
```

## ✅ Lo que ya está hecho

- ✅ Dependencias del backend instaladas
- ✅ Base de datos Neon configurada y migrada
- ✅ Prisma Client generado
- ✅ Todas las tablas creadas en Neon
- ✅ Scripts de inicio creados

## 🔍 Verificar que funciona

1. Abre http://localhost:8080
2. Deberías ver la aplicación
3. Intenta registrarte
4. Intenta iniciar sesión

## 📝 Notas

- El backend corre en http://localhost:3001
- El frontend corre en http://localhost:8080
- La base de datos está en Neon y ya tiene todas las tablas
- JWT_SECRET está configurado (cámbialo en producción)

## 🐛 Si algo no funciona

1. Verifica que ambos servidores estén corriendo
2. Revisa la consola del navegador
3. Revisa los logs del backend
4. Verifica que las variables de entorno estén configuradas

¡Listo para usar! 🎉

