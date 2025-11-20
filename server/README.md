# Backend API - GAD Paján

Backend API para la aplicación de Participación Ciudadana usando Express.js, Prisma y Neon PostgreSQL.

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```bash
cd server
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `server/`:

```env
DATABASE_URL=postgresql://neondb_owner:npg_l8MrDoUvN2wH@ep-ancient-sun-ah950gup-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=tu_secret_super_seguro_minimo_32_caracteres
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:8080
```

### 3. Configurar Prisma

```bash
# Generar cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones (creará las tablas en Neon)
npm run prisma:migrate

# O si prefieres hacer push directo del schema
npm run prisma:push
```

### 4. Iniciar Servidor

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## 📁 Estructura

```
server/
├── src/
│   ├── routes/          # Endpoints de la API
│   │   └── auth.ts      # Autenticación
│   ├── middleware/      # Middleware (auth, validación)
│   ├── services/        # Lógica de negocio
│   ├── utils/           # Utilidades (JWT, etc.)
│   └── index.ts         # Entry point
├── prisma/
│   ├── schema.prisma    # Esquema de Prisma
│   └── migrations/      # Migraciones SQL
└── package.json
```

## 🔑 Endpoints

### Autenticación

- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual (requiere token)

### Health Check

- `GET /health` - Estado del servidor
- `GET /api/test-db` - Probar conexión a base de datos

## 🔐 Autenticación

Los endpoints protegidos requieren un header:

```
Authorization: Bearer <token>
```

El token se obtiene al hacer login o registro.

## 📝 Próximos Pasos

1. ✅ Backend base configurado
2. ✅ Autenticación básica
3. ⏳ Endpoints de incidentes
4. ⏳ Endpoints de perfiles
5. ⏳ Upload de archivos (Cloudinary)
6. ⏳ Endpoints de departamentos

