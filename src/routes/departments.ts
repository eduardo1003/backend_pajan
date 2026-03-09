import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const dptosPajanRouter = express.Router();
const pajanPrismaInstancia = new PrismaClient();

/**
 * GESTIÓN DE UNIDADES DEPARTAMENTALES DEL GAD MUNICIPAL DE PAJÁN
 */

// Listar todas las áreas municipales operativas
const listarUnidadesMunicipales = async (solicitud: express.Request, respuesta: express.Response) => {
  try {
    const listado = await pajanPrismaInstancia.department.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            profiles: true,
            incidents: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    respuesta.json(listado);
  } catch (fallo: any) {
    console.error('Error al listar departamentos:', fallo);
    respuesta.status(500).json({ error: 'Error al recuperar la estructura departamental' });
  }
};

// Ver composición de una unidad específica
const verComposicionUnidad = async (solicitud: express.Request, respuesta: express.Response) => {
  try {
    const { id } = solicitud.params;

    const areaEncontrada = await pajanPrismaInstancia.department.findUnique({
      where: { id },
      include: {
        profiles: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
      },
    });

    if (!areaEncontrada) {
      return respuesta.status(404).json({ error: 'La unidad departamental no existe' });
    }

    respuesta.json(areaEncontrada);
  } catch (fallo: any) {
    console.error('Error de consulta dpto:', fallo);
    respuesta.status(500).json({ error: 'Fallo en la comunicación con el servidor' });
  }
};

// Crear nueva unidad administrativa (Solo Administración Central)
const crearUnidadAdministrativa = async (solicitud: express.Request, respuesta: express.Response) => {
  try {
    const { name, description, headId } = solicitud.body;

    if (!name) {
      return respuesta.status(400).json({ error: 'Debe asignar un nombre al departamento' });
    }

    const nuevaUnidad = await pajanPrismaInstancia.department.create({
      data: {
        name,
        description,
        headId,
      },
    });

    respuesta.status(201).json(nuevaUnidad);
  } catch (fallo: any) {
    console.error('Error en alta de dpto:', fallo);
    respuesta.status(500).json({ error: 'No se pudo formalizar el registro de la unidad' });
  }
};

// Actualizar parámetros de una unidad
const actualizarUnidadPajan = async (solicitud: express.Request, respuesta: express.Response) => {
  try {
    const { id } = solicitud.params;
    const { name, description, headId, isActive } = solicitud.body;

    const unidadActualizada = await pajanPrismaInstancia.department.update({
      where: { id },
      data: {
        name: name ?? undefined,
        description: description ?? undefined,
        headId: headId ?? undefined,
        isActive: isActive ?? undefined,
      },
    });

    respuesta.json(unidadActualizada);
  } catch (fallo: any) {
    console.error('Error en actualización dpto:', fallo);
    respuesta.status(500).json({ error: 'Hubo un error al guardar los cambios' });
  }
};

// Baja de unidad del sistema
const removerUnidadMunicipal = async (solicitud: express.Request, respuesta: express.Response) => {
  try {
    const { id } = solicitud.params;

    await pajanPrismaInstancia.department.delete({
      where: { id },
    });

    respuesta.json({ mensaje: 'Unidad departamental removida satisfactoriamente' });
  } catch (fallo: any) {
    console.error('Error al remover dpto:', fallo);
    respuesta.status(500).json({ error: 'La eliminación fue denegada por integridad de datos' });
  }
};

/**
 * RUTAS DE ACCESO AL MÓDULO
 */
dptosPajanRouter.get('/', listarUnidadesMunicipales);
dptosPajanRouter.get('/:id', verComposicionUnidad);
dptosPajanRouter.post('/', authenticateToken, requireRole('admin'), crearUnidadAdministrativa);
dptosPajanRouter.put('/:id', authenticateToken, requireRole('admin'), actualizarUnidadPajan);
dptosPajanRouter.delete('/:id', authenticateToken, requireRole('admin'), removerUnidadMunicipal);

export default dptosPajanRouter;

