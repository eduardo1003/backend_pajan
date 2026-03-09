import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

/**
 * Configuración inicial del servidor para el GAD Municipal de Paján.
 * Cargamos las variables de entorno para asegurar la conectividad y seguridad.
 */
dotenv.config();

const pajanApi = express();
const pajanDb = new PrismaClient();
const PUERTO_SERVICIO = process.env.PORT || 3001;
const ORIGEN_PERMITIDO = process.env.CORS_ORIGIN || 'http://localhost:8080';

// Configuración de Middlewares de Seguridad y Comunicación
pajanApi.use(cors({
  origin: ORIGEN_PERMITIDO,
  credentials: true,
}));
pajanApi.use(express.json());
pajanApi.use(express.urlencoded({ extended: true }));

/**
 * Punto de enlace para verificar la disponibilidad del sistema.
 */
pajanApi.get('/health', (peticion, respuesta) => {
  respuesta.json({
    estado: 'operativo',
    mensaje: 'Servidor del GAD Paján está en línea'
  });
});

/**
 * Validación técnica de la conexión con la base de datos institucional.
 */
pajanApi.get('/api/test-db', async (peticion, respuesta) => {
  try {
    await pajanDb.$connect();
    const totalUsuarios = await pajanDb.user.count();
    respuesta.json({
      estado: 'exitoso',
      mensaje: 'Conexión con la base de datos establecida correctamente',
      conteoUsuarios: totalUsuarios
    });
  } catch (errorTecnico: any) {
    respuesta.status(500).json({
      estado: 'error',
      mensaje: 'Fallo en la comunicación con la base de datos',
      detalle: errorTecnico.message
    });
  }
});

// Enrutamiento de Módulos del Sistema
import authRoutes from './routes/auth.js';
import incidentRoutes from './routes/incidents.js';
import profileRoutes from './routes/profiles.js';
import departmentRoutes from './routes/departments.js';
import categoryRoutes from './routes/categories.js';
import uploadRoutes from './routes/upload.js';
import statsRoutes from './routes/stats.js';
import barrioPresidentRoutes from './routes/barrioPresidents.js';

pajanApi.use('/api/auth', authRoutes);
pajanApi.use('/api/incidents', incidentRoutes);
pajanApi.use('/api/profiles', profileRoutes);
pajanApi.use('/api/departments', departmentRoutes);
pajanApi.use('/api/categories', categoryRoutes);
pajanApi.use('/api/upload', uploadRoutes);
pajanApi.use('/api/stats', statsRoutes);
pajanApi.use('/api/barrio-presidents', barrioPresidentRoutes);

/**
 * Manejador centralizado de excepciones y errores operativos.
 */
pajanApi.use((error: any, peticion: express.Request, respuesta: express.Response, siguiente: express.NextFunction) => {
  console.error('Excepción detectada:', error);
  respuesta.status(error.status || 500).json({
    error: error.message || 'Error interno en el servidor del GAD',
  });
});

// Activación del Servicio
pajanApi.listen(PUERTO_SERVICIO, () => {
  console.log(`🚀 Sistema operativo en: http://localhost:${PUERTO_SERVICIO}`);
  console.log(`📊 Monitoreo: http://localhost:${PUERTO_SERVICIO}/health`);
  console.log(`🔌 Prueba DB: http://localhost:${PUERTO_SERVICIO}/api/test-db`);
});

/**
 * Cierre controlado de conexiones al finalizar el proceso.
 */
process.on('SIGTERM', async () => {
  await pajanDb.$disconnect();
  process.exit(0);
});


