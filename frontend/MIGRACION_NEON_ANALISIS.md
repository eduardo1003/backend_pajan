# Análisis de Migración: Supabase → Neon (PostgreSQL)

## 📋 Resumen Ejecutivo

Este proyecto actualmente usa **Supabase** como backend completo (base de datos, autenticación y almacenamiento). Para migrar a **Neon** (PostgreSQL directo), necesitaremos reemplazar varios componentes ya que Neon solo proporciona la base de datos PostgreSQL, no autenticación ni almacenamiento.

---

## 🔍 Estado Actual del Proyecto

### Componentes de Supabase en Uso:

1. **Base de Datos PostgreSQL** ✅ (Migrable a Neon)
   - Esquema completo con tablas: `profiles`, `departments`, `incidents`, `categories`, `category_department_mapping`
   - Enums: `user_role`, `incident_status`, `incident_category`
   - Funciones SQL: `get_user_role()`, `is_admin()`, `user_belongs_to_department()`, `handle_new_user()`, `update_updated_at_column()`
   - Triggers: `on_auth_user_created`, triggers de actualización de timestamps
   - Row Level Security (RLS) con políticas complejas

2. **Autenticación** ⚠️ (Necesita reemplazo)
   - `supabase.auth.signUp()`
   - `supabase.auth.signInWithPassword()`
   - `supabase.auth.signOut()`
   - `supabase.auth.onAuthStateChange()`
   - `supabase.auth.getSession()`
   - `supabase.auth.updateUser()`
   - `supabase.auth.admin.createUser()`
   - Referencias a `auth.users` en la base de datos

3. **Almacenamiento de Archivos** ⚠️ (Necesita reemplazo)
   - `supabase.storage.from('incident-photos').upload()`
   - `supabase.storage.from('incident-photos').getPublicUrl()`
   - Bucket: `incident-photos` con políticas RLS

4. **Queries a la Base de Datos** ✅ (Necesita adaptación)
   - `supabase.from('table').select()`
   - `supabase.from('table').insert()`
   - `supabase.from('table').update()`
   - `supabase.from('table').delete()`
   - `supabase.rpc('function_name')`

---

## 🎯 Lo que Necesitamos para la Migración

### 1. **Sistema de Autenticación Alternativo**

**Opciones recomendadas:**

#### Opción A: NextAuth.js / Auth.js (Recomendado)
- ✅ Soporte para múltiples proveedores (email/password, OAuth)
- ✅ Sesiones seguras
- ✅ Integración con PostgreSQL
- ✅ TypeScript support
- 📦 Instalar: `npm install next-auth @auth/prisma-adapter` o similar

#### Opción B: Clerk
- ✅ Muy fácil de implementar
- ✅ UI pre-construida
- ✅ Gestión de usuarios completa
- 💰 Plan gratuito disponible
- 📦 Instalar: `npm install @clerk/clerk-react`

#### Opción C: Auth0
- ✅ Enterprise-grade
- ✅ Muy seguro
- 💰 Plan gratuito limitado
- 📦 Instalar: `npm install @auth0/auth0-react`

#### Opción D: Implementación Custom con JWT
- ⚠️ Más trabajo pero control total
- Necesitarás:
  - Sistema de hash de contraseñas (bcrypt)
  - Generación de tokens JWT
  - Middleware de autenticación
  - Refresh tokens

**Recomendación:** **Clerk** o **NextAuth.js** por facilidad y seguridad.

---

### 2. **Sistema de Almacenamiento de Archivos**

**Opciones recomendadas:**

#### Opción A: Cloudinary (Recomendado)
- ✅ Optimización automática de imágenes
- ✅ CDN incluido
- ✅ Transformaciones on-the-fly
- 💰 Plan gratuito generoso
- 📦 Instalar: `npm install cloudinary`

#### Opción B: AWS S3
- ✅ Muy escalable
- ✅ Confiable
- ⚠️ Configuración más compleja
- 💰 Pay-as-you-go
- 📦 Instalar: `npm install @aws-sdk/client-s3`

#### Opción C: Uploadthing
- ✅ Específico para Next.js/React
- ✅ UI de upload incluida
- 💰 Plan gratuito disponible
- 📦 Instalar: `npm install uploadthing @uploadthing/react`

#### Opción D: Vercel Blob Storage
- ✅ Integración perfecta si usas Vercel
- ✅ Simple de usar
- 💰 Plan gratuito disponible
- 📦 Instalar: `npm install @vercel/blob`

**Recomendación:** **Cloudinary** por facilidad y características.

---

### 3. **Cliente de PostgreSQL**

**Opciones recomendadas:**

#### Opción A: Prisma (Recomendado)
- ✅ Type-safe queries
- ✅ Migraciones automáticas
- ✅ Excelente DX
- ✅ Genera tipos TypeScript automáticamente
- 📦 Instalar: `npm install prisma @prisma/client`
- 📦 Instalar driver: `npm install pg`

#### Opción B: Drizzle ORM
- ✅ Type-safe
- ✅ Ligero y rápido
- ✅ SQL-like syntax
- 📦 Instalar: `npm install drizzle-orm drizzle-kit pg`

#### Opción C: Postgres.js / node-postgres
- ✅ Directo y simple
- ⚠️ Sin type-safety automático
- 📦 Instalar: `npm install postgres` o `npm install pg`

**Recomendación:** **Prisma** por type-safety y migraciones.

---

### 4. **Backend API**

**Necesitarás crear un backend porque:**

- Neon es solo PostgreSQL (no tiene API REST como Supabase)
- Necesitas un servidor para:
  - Autenticación
  - Queries a la base de datos
  - Upload de archivos
  - Lógica de negocio

**Opciones:**

#### Opción A: Next.js API Routes (Si usas Next.js)
- ✅ Mismo proyecto
- ✅ Fácil de implementar

#### Opción B: Express.js / Fastify
- ✅ Framework Node.js tradicional
- ✅ Flexible y potente
- 📦 Instalar: `npm install express` o `npm install fastify`

#### Opción C: tRPC
- ✅ Type-safe end-to-end
- ✅ Excelente con TypeScript
- 📦 Instalar: `npm install @trpc/server @trpc/client`

**Recomendación:** Si el proyecto puede usar Next.js, **Next.js API Routes**. Si no, **Express.js**.

---

### 5. **Variables de Entorno Necesarias**

```env
# Neon Database
DATABASE_URL=postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require

# Autenticación (ejemplo con Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Almacenamiento (ejemplo con Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 📝 Plan de Migración Paso a Paso

### Fase 1: Preparación
1. ✅ Crear cuenta en Neon y base de datos
2. ✅ Elegir sistema de autenticación
3. ✅ Elegir sistema de almacenamiento
4. ✅ Configurar variables de entorno

### Fase 2: Migración de Base de Datos
1. ✅ Exportar esquema actual de Supabase
2. ✅ Adaptar migraciones para Neon (eliminar referencias a `auth.users`)
3. ✅ Ejecutar migraciones en Neon
4. ✅ Verificar integridad de datos

### Fase 3: Backend API
1. ✅ Crear estructura de API
2. ✅ Implementar endpoints de autenticación
3. ✅ Implementar endpoints de base de datos
4. ✅ Implementar endpoints de upload

### Fase 4: Frontend
1. ✅ Reemplazar cliente de Supabase
2. ✅ Integrar nuevo sistema de autenticación
3. ✅ Actualizar hooks (`useAuth`, etc.)
4. ✅ Actualizar componentes que usan Supabase
5. ✅ Actualizar sistema de upload de archivos

### Fase 5: Testing y Ajustes
1. ✅ Probar autenticación
2. ✅ Probar CRUD operations
3. ✅ Probar upload de archivos
4. ✅ Ajustar RLS/permisos si es necesario

---

## 🔄 Cambios Específicos en el Código

### Archivos que Necesitan Cambios:

1. **`src/integrations/supabase/client.ts`**
   - ❌ Eliminar o reemplazar completamente
   - ✅ Crear nuevo cliente de base de datos (Prisma/Drizzle)

2. **`src/hooks/useAuth.tsx`**
   - ❌ Eliminar referencias a `supabase.auth`
   - ✅ Usar nuevo sistema de autenticación

3. **`src/pages/NewReport.tsx`**
   - ❌ Reemplazar `supabase.storage` por nuevo sistema
   - ❌ Reemplazar `supabase.from('incidents')` por API calls

4. **`src/pages/admin/IncidentManagement.tsx`**
   - ❌ Reemplazar `supabase.storage` y queries

5. **`src/components/AdminStatistics.tsx`**
   - ❌ Reemplazar queries de Supabase por API calls

6. **`api/create-user.ts`**
   - ❌ Reemplazar completamente
   - ✅ Crear nuevo endpoint en backend

7. **`supabase/migrations/*.sql`**
   - ⚠️ Adaptar para eliminar referencias a `auth.users`
   - ⚠️ Adaptar triggers que dependen de Supabase Auth

---

## ⚠️ Consideraciones Importantes

### 1. **Row Level Security (RLS)**
- Supabase RLS usa `auth.uid()` que no existirá en Neon
- Necesitarás implementar permisos en tu backend API
- O usar PostgreSQL RLS con funciones custom que obtengan el usuario de JWT

### 2. **Triggers de Autenticación**
- El trigger `on_auth_user_created` necesita adaptarse
- Deberás crear el perfil manualmente cuando se registre un usuario

### 3. **Referencias a `auth.users`**
- La tabla `profiles` tiene `user_id UUID REFERENCES auth.users(id)`
- Necesitarás crear tu propia tabla de usuarios o adaptar el esquema

### 4. **Storage Policies**
- Las políticas de Supabase Storage no aplican
- Necesitarás implementar permisos en tu sistema de almacenamiento

### 5. **Real-time (si lo usas)**
- Supabase tiene real-time subscriptions
- Neon no tiene esto nativamente
- Necesitarías implementar WebSockets o usar un servicio como Pusher/Ably

---

## 📦 Dependencias a Instalar

```json
{
  "dependencies": {
    // Base de datos
    "@prisma/client": "^5.0.0",
    "prisma": "^5.0.0",
    "pg": "^8.11.0",
    
    // Autenticación (ejemplo con Clerk)
    "@clerk/clerk-react": "^4.0.0",
    
    // Almacenamiento (ejemplo con Cloudinary)
    "cloudinary": "^1.40.0",
    
    // Backend (si usas Express)
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.0"
  }
}
```

---

## 💰 Costos Estimados

### Supabase (Actual)
- Plan gratuito: $0/mes (con límites)
- Plan Pro: ~$25/mes

### Neon
- Plan gratuito: $0/mes (512 MB storage)
- Plan Launch: ~$19/mes (10 GB storage)

### Servicios Adicionales Necesarios
- **Autenticación:**
  - Clerk: Gratis hasta 10,000 MAU
  - NextAuth.js: Gratis (self-hosted)
  - Auth0: Gratis hasta 7,000 MAU
  
- **Almacenamiento:**
  - Cloudinary: Gratis hasta 25 GB storage
  - AWS S3: ~$0.023/GB/mes
  - Uploadthing: Gratis hasta 2 GB

**Total estimado:** Similar o ligeramente más caro que Supabase, pero con más control.

---

## ✅ Ventajas de Migrar a Neon

1. ✅ **Más control** sobre la base de datos
2. ✅ **Sin vendor lock-in** de Supabase
3. ✅ **PostgreSQL puro** sin abstracciones
4. ✅ **Mejor para aplicaciones complejas**
5. ✅ **Branching de base de datos** (feature único de Neon)

## ⚠️ Desventajas

1. ⚠️ **Más trabajo inicial** (configurar auth, storage, backend)
2. ⚠️ **Más servicios que gestionar**
3. ⚠️ **Sin real-time nativo** (si lo necesitas)
4. ⚠️ **Más código que mantener**

---

## 🚀 Siguiente Paso Recomendado

1. **Decidir stack tecnológico:**
   - Autenticación: ¿Clerk, NextAuth.js, o custom?
   - Almacenamiento: ¿Cloudinary, S3, o otro?
   - ORM: ¿Prisma, Drizzle, o directo?

2. **Crear plan de migración detallado** con tareas específicas

3. **Crear branch de desarrollo** para la migración

4. **Empezar con la migración de base de datos** (lo más simple)

¿Quieres que empecemos con algún paso específico?

