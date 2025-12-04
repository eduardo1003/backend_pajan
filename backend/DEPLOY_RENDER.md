# Guía de Despliegue del Backend en Render

## 📋 Configuración en Render.com

### 1. Crear un Nuevo Servicio Web

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Click en **"+ New"** → **"Web Service"**
3. Conecta tu repositorio de GitHub: `eduardo-daniel/app-pajan`

### 2. Configuración del Servicio

#### Información Básica
- **Name:** `backend-app` o `app-pajan-backend`
- **Region:** Elige la región más cercana (ej: `Oregon (US West)`)
- **Branch:** `main`
- **Root Directory:** `backend` ⚠️ **IMPORTANTE: Debe ser `backend`**

#### Build & Deploy

**Build Command:**
```bash
npm install && npm run build && npx prisma generate
```

**Start Command:**
```bash
npm start
```

#### Environment Variables

Agrega las siguientes variables de entorno en la sección **"Environment"**:

```
DATABASE_URL=postgresql://neondb_owner:npg_l8MrDoUvN2wH@ep-ancient-sun-ah950gup-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=super_secret_jwt_key_min_32_chars_for_production_change_this
JWT_EXPIRES_IN=7d
PORT=10000
```
**Nota:** Render establece automáticamente el puerto, pero puedes dejarlo en 10000 o eliminarlo.
NODE_ENV=production
CORS_ORIGIN=https://app-pajan.vercel.app
```

**⚠️ IMPORTANTE:**
- Cambia `JWT_SECRET` por una clave secreta segura y única
- Ajusta `CORS_ORIGIN` con la URL de tu frontend desplegado

#### Plan

- **Free:** Para desarrollo/pruebas
- **Starter ($7/mes):** Para producción con mejor rendimiento

### 3. Verificar el Despliegue

Una vez desplegado, Render te dará una URL como:
```
https://backend-app-xxxx.onrender.com
```

Verifica que el backend esté funcionando:
```
https://backend-app-xxxx.onrender.com/health
https://backend-app-xxxx.onrender.com/api/test-db
```

## 🔧 Solución de Problemas

### Error: "Unknown command: istall"
- **Causa:** Typo en el comando de build
- **Solución:** Asegúrate de que el Build Command sea exactamente:
  ```bash
  npm install && npm run build && npx prisma generate
  ```

### Error: "Repository not found"
- **Causa:** Repositorio incorrecto configurado
- **Solución:** Verifica que el repositorio sea `eduardo-daniel/app-pajan` y el Root Directory sea `backend`

### Error: "Cannot find module"
- **Causa:** Prisma Client no generado
- **Solución:** Asegúrate de incluir `npx prisma generate` en el Build Command

### Error: "Database connection failed"
- **Causa:** Variable `DATABASE_URL` incorrecta o no configurada
- **Solución:** Verifica que la variable de entorno `DATABASE_URL` esté correctamente configurada

## 📝 Notas Importantes

1. **Root Directory:** Debe ser `backend` porque el código del backend está en una subcarpeta
2. **Build Command:** Siempre incluye `npx prisma generate` para generar el Prisma Client
3. **Start Command:** Usa `npm start` que ejecuta `node dist/index.js`
4. **Variables de Entorno:** Nunca subas el archivo `.env` al repositorio, usa las variables de entorno de Render

## 🔗 URLs de Referencia

- Repositorio Backend: https://github.com/eduardo-daniel/app-pajan
- Documentación Render: https://render.com/docs
- Prisma Deployment: https://www.prisma.io/docs/guides/deployment

