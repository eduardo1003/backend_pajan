import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const apiCategoriasRouter = express.Router();
const pajanPrisma = new PrismaClient();

/**
 * MÓDULO DE GESTIÓN DE CATEGORÍAS CIUDADANAS - GAD PAJÁN
 */

// Recuperar catálogo de categorías vigentes
const obtenerCategoriasActivas = async (peticion: express.Request, respuesta: express.Response) => {
  try {
    const catalogo = await pajanPrisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    respuesta.json(catalogo);
  } catch (excepcion: any) {
    console.error('Error al recuperar categorías:', excepcion);
    respuesta.status(500).json({ error: 'No se pudo cargar el catálogo de categorías' });
  }
};

// Detalle de una categoría específica
const detalleCategoria = async (peticion: express.Request, respuesta: express.Response) => {
  try {
    const { id } = peticion.params;
    const registro = await pajanPrisma.category.findUnique({
      where: { id },
    });

    if (!registro) {
      return respuesta.status(404).json({ error: 'La categoría solicitada no existe' });
    }

    respuesta.json(registro);
  } catch (excepcion: any) {
    console.error('Error en consulta de categoría:', excepcion);
    respuesta.status(500).json({ error: 'Fallo en la comunicación con el repositorio' });
  }
};

// Registro de nueva categoría (Directivo solamente)
const crearNuevaCategoria = async (peticion: express.Request, respuesta: express.Response) => {
  try {
    const { name, description, icon, color } = peticion.body;

    if (!name) {
      return respuesta.status(400).json({ error: 'Se requiere un nombre para la categoría' });
    }

    const nuevaCatego = await pajanPrisma.category.create({
      data: {
        name,
        description,
        icon,
        color,
      },
    });

    respuesta.status(201).json(nuevaCatego);
  } catch (excepcion: any) {
    console.error('Error en creación de categoría:', excepcion);
    respuesta.status(500).json({ error: 'Error al intentar registrar la categoría' });
  }
};

// Edición de parámetros de categoría
const modificarCategoria = async (peticion: express.Request, respuesta: express.Response) => {
  try {
    const { id } = peticion.params;
    const { name, description, icon, color, isActive } = peticion.body;

    const actualizacion = await pajanPrisma.category.update({
      where: { id },
      data: {
        name: name ?? undefined,
        description: description ?? undefined,
        icon: icon ?? undefined,
        color: color ?? undefined,
        isActive: isActive ?? undefined,
      },
    });

    respuesta.json(actualizacion);
  } catch (excepcion: any) {
    console.error('Error al actualizar categoría:', excepcion);
    respuesta.status(500).json({ error: 'No se pudo procesar la modificación' });
  }
};

// Remoción de categoría del sistema
const eliminarCategoriaPermanente = async (peticion: express.Request, respuesta: express.Response) => {
  try {
    const { id } = peticion.params;

    await pajanPrisma.category.delete({
      where: { id },
    });

    respuesta.json({ mensaje: 'Categoría eliminada del registro institucional' });
  } catch (excepcion: any) {
    console.error('Error al eliminar categoría:', excepcion);
    respuesta.status(500).json({ error: 'No se permite la eliminación de esta categoría' });
  }
};

/**
 * DEFINICIÓN DE ENDPOINTS
 */
apiCategoriasRouter.get('/', obtenerCategoriasActivas);
apiCategoriasRouter.get('/:id', detalleCategoria);
apiCategoriasRouter.post('/', authenticateToken, requireRole('admin'), crearNuevaCategoria);
apiCategoriasRouter.put('/:id', authenticateToken, requireRole('admin'), modificarCategoria);
apiCategoriasRouter.delete('/:id', authenticateToken, requireRole('admin'), eliminarCategoriaPermanente);

export default apiCategoriasRouter;

