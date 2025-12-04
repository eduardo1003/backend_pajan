# 🎯 Guía Final - Completar Migración a Neon

## ✅ Lo que ya está hecho

1. ✅ **Backend API completo** con todos los endpoints
2. ✅ **Autenticación JWT** implementada
3. ✅ **Cliente API** para frontend
4. ✅ **useAuth.tsx** actualizado
5. ✅ **Componentes principales** actualizados:
   - Dashboard.tsx
   - NewReport.tsx
   - Reports.tsx
   - PublicIncidents.tsx
   - AllReports.tsx
   - AdminStatistics.tsx

## ⚠️ Archivos que aún necesitan actualización

### 1. `src/pages/admin/IncidentManagement.tsx`
- Reemplazar `supabase.storage` por `apiClient.uploadFile()`
- Reemplazar `supabase.from('incidents')` por `incidentsApi`
- Actualizar `loadData()` para usar el nuevo API

### 2. `src/pages/department/DepartmentDashboard.tsx`
- Reemplazar queries de Supabase por `incidentsApi`
- Actualizar para usar el nuevo API

### 3. `src/pages/Settings.tsx`
- Si usa `supabase.auth.updateUser()`, actualizar para usar el nuevo API

### 4. `src/pages/admin/AdminDashboard.tsx`
- Reemplazar `supabase.auth.signUp()` si existe

### 5. `src/pages/TestUsers.tsx`
- Actualizar si usa `supabase.rpc()`

## 🚀 Pasos para Completar

### Paso 1: Configurar Backend

```bash
cd server
npm install

# Crear .env
cp .env.example .env
# Editar .env con tu DATABASE_URL de Neon y JWT_SECRET
```

**Variables necesarias en `server/.env`:**
```env
DATABASE_URL=postgresql://neondb_owner:npg_l8MrDoUvN2wH@ep-ancient-sun-ah950gup-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=tu_secret_super_seguro_minimo_32_caracteres
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:8080

# Opcional: Cloudinary (para uploads)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### Paso 2: Configurar Base de Datos

```bash
cd server
npm run prisma:generate
```

Luego ejecuta el SQL en Neon:
- Ve a tu dashboard de Neon
- Abre SQL Editor
- Copia y pega el contenido de `server/prisma/migrations/001_initial_schema.sql`
- Ejecuta

### Paso 3: Configurar Frontend

Crea `.env` en la raíz del proyecto:
```env
VITE_API_URL=http://localhost:3001/api
```

### Paso 4: Iniciar Servidores

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Paso 5: Probar

1. Abre http://localhost:8080
2. Intenta registrarte
3. Intenta iniciar sesión
4. Crea un nuevo reporte
5. Verifica que todo funcione

## 🔧 Patrones de Migración

### Reemplazar Supabase Auth:
```typescript
// Antes
await supabase.auth.signUp({ email, password })
await supabase.auth.signInWithPassword({ email, password })

// Después
await apiClient.register(email, password, fullName)
await apiClient.login(email, password)
```

### Reemplazar Supabase Queries:
```typescript
// Antes
const { data } = await supabase
  .from('incidents')
  .select('*')
  .eq('status', 'pending')

// Después
const data = await incidentsApi.getAll({ status: 'pending' })
```

### Reemplazar Supabase Storage:
```typescript
// Antes
await supabase.storage
  .from('incident-photos')
  .upload(filePath, file)

// Después
const { url } = await apiClient.uploadFile(file)
```

## 📝 Notas Importantes

1. **Cloudinary es opcional** - Si no lo configuras, los uploads fallarán pero el resto funcionará
2. **JWT_SECRET** - Debe ser un string largo y aleatorio (mínimo 32 caracteres)
3. **CORS** - Asegúrate de que `CORS_ORIGIN` coincida con la URL del frontend
4. **Base de datos** - La migración SQL crea todas las tablas necesarias

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
- Verifica que `DATABASE_URL` esté correcto
- Asegúrate de que Neon permita conexiones desde tu IP
- Verifica que el SSL esté habilitado

### Error: "CORS policy"
- Verifica que `CORS_ORIGIN` en el backend coincida con la URL del frontend
- En desarrollo: `http://localhost:8080`

### Error: "Invalid token"
- Verifica que `JWT_SECRET` esté configurado
- Limpia el localStorage y vuelve a iniciar sesión

### Error: "Upload failed"
- Verifica que Cloudinary esté configurado (opcional)
- O comenta temporalmente el código de upload

## ✅ Checklist Final

- [ ] Backend configurado y funcionando
- [ ] Base de datos migrada
- [ ] Frontend configurado con VITE_API_URL
- [ ] Autenticación funcionando
- [ ] Crear reportes funcionando
- [ ] Ver reportes funcionando
- [ ] Admin dashboard funcionando (si aplica)
- [ ] Uploads funcionando (si Cloudinary configurado)

## 🎉 ¡Listo!

Una vez completados estos pasos, tu aplicación debería estar funcionando completamente con Neon PostgreSQL.

