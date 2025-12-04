# 👥 Usuarios Disponibles en la Base de Datos

## 🔐 Administradores

### 1. Administrador del Sistema
- **Email:** `administrador@gadpajan.gob.ec`
- **Contraseña:** `Admin2024!`
- **Nombre:** Administrador del Sistema
- **Rol:** admin
- **Estado:** Activo ✅

### 2. Administrador Principal
- **Email:** `admin@gadpajan.gob.ec`
- **Contraseña:** `Admin123`
- **Nombre:** Administrador Principal
- **Rol:** admin
- **Estado:** Activo ✅

## 🚀 Cómo Iniciar Sesión

1. Abre la aplicación: http://localhost:8080
2. Click en "Iniciar Sesión"
3. Usa cualquiera de las credenciales de arriba
4. ¡Listo! Tendrás acceso completo como administrador

## 📝 Crear Más Usuarios

### Crear otro Administrador

```powershell
cd server
$env:DATABASE_URL="postgresql://neondb_owner:npg_l8MrDoUvN2wH@ep-ancient-sun-ah950gup-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
npm run create-admin -- <email> <password> "<nombre>"
```

### Crear Usuario con Cualquier Rol

```powershell
cd server
$env:DATABASE_URL="postgresql://neondb_owner:npg_l8MrDoUvN2wH@ep-ancient-sun-ah950gup-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
npm run create-user -- <email> <password> "<nombre>" [role]
```

**Roles disponibles:**
- `citizen` - Ciudadano (por defecto)
- `admin` - Administrador
- `department_head` - Jefe de Departamento
- `department_staff` - Personal de Departamento

### Listar Todos los Usuarios

```powershell
cd server
$env:DATABASE_URL="postgresql://neondb_owner:npg_l8MrDoUvN2wH@ep-ancient-sun-ah950gup-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
npm run list-users
```

## 🔒 Seguridad

⚠️ **IMPORTANTE:** 
- Cambia las contraseñas después del primer inicio de sesión
- Estas son contraseñas temporales para desarrollo
- En producción, usa contraseñas más seguras

## 📊 Ver Usuarios en Prisma Studio

```powershell
cd server
$env:DATABASE_URL="postgresql://neondb_owner:npg_l8MrDoUvN2wH@ep-ancient-sun-ah950gup-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
npm run prisma:studio
```

Esto abrirá una interfaz web en http://localhost:5555 donde puedes ver y editar todos los datos.

