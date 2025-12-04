# GAD Paján - Participación Ciudadana

Plataforma de participación ciudadana para el GAD Municipal de Paján. Una aplicación web responsiva que permite a los ciudadanos reportar incidentes, participar en eventos comunitarios y mantenerse informados sobre las actividades municipales.

## 📁 Estructura del Proyecto

```
apppp21/
├── frontend/          # Aplicación React + Vite
├── backend/           # API Express.js + Prisma
├── android/           # Aplicación Android (Capacitor)
└── README.md
```

## 🚀 Inicio Rápido

### Backend

```bash
cd backend
npm install
# Crear .env con DATABASE_URL de Neon
npm run dev
```

### Frontend

```bash
cd frontend
npm install
# Crear .env con VITE_API_URL
npm run dev
```

## 📋 Características

- 📱 **100% Responsivo**: Optimizado para PC, tablet y móvil
- 🔄 **Navegación móvil**: Botón de retroceso funcional en dispositivos móviles
- 📊 **Dashboard interactivo**: Estadísticas y reportes en tiempo real
- 🗺️ **Mapa de incidentes**: Visualización geográfica de reportes
- 👥 **Participación ciudadana**: Eventos y actividades comunitarias
- 🔐 **Sistema de roles**: Ciudadanos, administradores y personal de departamentos
- 📱 **APK Android**: Aplicación nativa para dispositivos móviles

## 🛠️ Tecnologías

### Frontend
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui + Radix UI
- TanStack Query + React Hook Form
- Mapbox GL

### Backend
- Express.js + TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- JWT Authentication

### Móvil
- Capacitor

## 📚 Documentación

- `frontend/ARCHIVOS_ENV.md` - Configuración de variables de entorno
- `frontend/CONFIGURACION_PRODUCCION.md` - Configuración para producción
- `backend/README.md` - Documentación del backend
- `CREDENCIALES_ADMIN.md` - Credenciales de administrador

## 🔑 Credenciales de Administrador

Ver `CREDENCIALES_ADMIN.md` para las credenciales de acceso.

## 🚀 Despliegue

- **Frontend:** Vercel (https://app-pajan.vercel.app)
- **Backend:** Render (https://app-pajan.onrender.com)
- **Base de Datos:** Neon PostgreSQL

## 📝 Licencia

Este proyecto es propiedad del GAD Municipal de Paján.

