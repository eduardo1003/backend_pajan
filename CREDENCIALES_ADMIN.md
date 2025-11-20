# 🔐 Credenciales de Administrador

## ✅ Usuario Administrador Creado

Se ha creado un usuario administrador en la base de datos Neon.

### 🔑 Credenciales de Acceso

```
Email: admin@gadpajan.gob.ec
Contraseña: Admin123
Nombre: Administrador Principal
Rol: admin
```

## 🚨 IMPORTANTE - Seguridad

⚠️ **CAMBIA LA CONTRASEÑA después del primer inicio de sesión por seguridad.**

Esta es una contraseña temporal. Usa una contraseña fuerte en producción.

## 📝 Cómo Crear Más Usuarios

### Crear otro Administrador

```powershell
cd server
$env:DATABASE_URL="postgresql://neondb_owner:npg_l8MrDoUvN2wH@ep-ancient-sun-ah950gup-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
npm run create-admin -- <email> <password> "<nombre completo>"
```

**Ejemplo:**
```powershell
npm run create-admin -- otroadmin@gadpajan.gob.ec MiPassword123 "Otro Administrador"
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

**Ejemplos:**
```powershell
# Crear ciudadano
npm run create-user -- ciudadano@example.com password123 "Juan Ciudadano"

# Crear jefe de departamento
npm run create-user -- jefe@example.com password123 "María Jefe" department_head

# Crear personal de departamento
npm run create-user -- personal@example.com password123 "Pedro Personal" department_staff
```

## 🔍 Verificar Usuarios en la Base de Datos

Puedes usar Prisma Studio para ver y gestionar usuarios:

```powershell
cd server
$env:DATABASE_URL="postgresql://neondb_owner:npg_l8MrDoUvN2wH@ep-ancient-sun-ah950gup-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
npm run prisma:studio
```

Esto abrirá una interfaz web en http://localhost:5555 donde puedes ver todas las tablas y datos.

## 📋 Notas Importantes

- ✅ El email debe ser único
- ✅ La contraseña debe tener al menos 6 caracteres (recomendado: 8+ con mayúsculas, minúsculas y números)
- ✅ El usuario se crea con `emailVerified: true` para que pueda iniciar sesión inmediatamente
- ✅ Todos los usuarios creados con estos scripts tienen el email verificado automáticamente

## 🎯 Próximos Pasos

1. Inicia sesión con las credenciales de admin
2. Cambia la contraseña desde el panel de configuración
3. Crea más usuarios según necesites
4. Gestiona departamentos y asignaciones
