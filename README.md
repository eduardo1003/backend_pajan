# GAD Paján - Participación Ciudadana

Plataforma de participación ciudadana para el GAD Municipal de Paján. Una aplicación web responsiva que permite a los ciudadanos reportar incidentes, participar en eventos comunitarios y mantenerse informados sobre las actividades municipales.

## Características

- 📱 **100% Responsivo**: Optimizado para PC, tablet y móvil
- 🔄 **Navegación móvil**: Botón de retroceso funcional en dispositivos móviles
- 📊 **Dashboard interactivo**: Estadísticas y reportes en tiempo real
- 🗺️ **Mapa de incidentes**: Visualización geográfica de reportes
- 👥 **Participación ciudadana**: Eventos y actividades comunitarias
- 🔐 **Sistema de roles**: Ciudadanos, administradores y personal de departamentos
- 📱 **APK Android**: Aplicación nativa para dispositivos móviles

## Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui + Radix UI
- **Backend**: Supabase
- **Móvil**: Capacitor
- **Mapas**: Mapbox GL
- **Estado**: TanStack Query + React Hook Form

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase
```

## Desarrollo

```bash
# Servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

## Generar APK para Android

### Prerequisitos

1. **Android Studio** instalado
2. **Java Development Kit (JDK)** 11 o superior
3. **Android SDK** configurado
4. **Node.js** 18 o superior

### Pasos para generar el APK

1. **Construir la aplicación web**:
   ```bash
   npm run build
   ```

2. **Sincronizar con Capacitor**:
   ```bash
   npm run cap:sync
   ```

3. **Abrir en Android Studio**:
   ```bash
   npm run cap:open
   ```

4. **En Android Studio**:
   - Selecciona "Build" → "Build Bundle(s) / APK(s)" → "Build APK(s)"
   - O para desarrollo: "Run" → "Run 'app'"

### Comandos útiles

```bash
# Construir y sincronizar
npm run cap:build

# Ejecutar en dispositivo Android (desarrollo)
npm run android:dev

# Construir APK de producción
npm run android:build
```

### Configuración del APK

El archivo `capacitor.config.ts` ya está configurado con:
- **App ID**: `com.jipijapa.ciudadactiva`
- **App Name**: `Jipijapa Ciudad Activa`
- **Splash Screen** configurado
- **Status Bar** optimizada
- **Keyboard** responsivo

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes de UI (shadcn/ui)
│   ├── Navbar.tsx      # Barra de navegación
│   └── MobileNavigation.tsx # Navegación móvil
├── hooks/              # Hooks personalizados
│   ├── useAuth.tsx     # Autenticación
│   └── useBackButton.tsx # Navegación móvil
├── pages/              # Páginas de la aplicación
│   ├── Dashboard.tsx   # Panel principal
│   ├── admin/          # Páginas de administración
│   └── department/     # Páginas de departamentos
├── utils/              # Utilidades
│   └── mobileUtils.ts  # Utilidades móviles
└── integrations/       # Integraciones externas
    └── supabase/       # Configuración de Supabase
```

## Responsividad

La aplicación está optimizada para:
- **Móvil**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+

### Breakpoints utilizados:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## Navegación Móvil

- ✅ Botón de retroceso físico funcional
- ✅ Navegación con gestos
- ✅ Menú hamburguesa responsivo
- ✅ Prevención de zoom accidental
- ✅ Viewport optimizado

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
