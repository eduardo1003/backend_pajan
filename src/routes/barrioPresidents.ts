import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const directivaBarriosRouter = express.Router();
const dbConexion = new PrismaClient();

/**
 * CONTROLADORES DE GESTIÓN PARA PRESIDENTES DE BARRIO
 */

// Obtener listado completo de presidentes
const listarPresidentesBarrio = async (peticion: express.Request, respuesta: express.Response) => {
    try {
        const listado = await dbConexion.barrioPresident.findMany({
            orderBy: { barrio: 'asc' },
        });
        respuesta.json(listado);
    } catch (errorOperativo: any) {
        console.error('Error al listar presidentes:', errorOperativo);
        respuesta.status(500).json({ error: 'No se pudo recuperar la lista de presidentes' });
    }
};

// Obtener detalles de un presidente específico por su ID
const obtenerDetallePresidente = async (peticion: express.Request, respuesta: express.Response) => {
    try {
        const { id } = peticion.params;
        const registro = await dbConexion.barrioPresident.findUnique({
            where: { id },
        });

        if (!registro) {
            return respuesta.status(404).json({ error: 'Presidente de barrio no localizado' });
        }

        respuesta.json(registro);
    } catch (errorOperativo: any) {
        console.error('Error al obtener presidente:', errorOperativo);
        respuesta.status(500).json({ error: 'Error en la consulta del registro' });
    }
};

// Registrar un nuevo presidente de barrio (Acceso Restringido: Administrador)
const registrarPresidenteBarrio = async (peticion: express.Request, respuesta: express.Response) => {
    try {
        const { name, barrio, phone } = peticion.body;

        if (!name || !barrio) {
            return respuesta.status(400).json({ error: 'El nombre y el barrio son campos obligatorios' });
        }

        const nuevoRegistro = await dbConexion.barrioPresident.create({
            data: {
                name,
                barrio,
                phone: phone || '',
            },
        });

        respuesta.status(201).json(nuevoRegistro);
    } catch (errorOperativo: any) {
        console.error('Error en creación de presidente:', errorOperativo);
        respuesta.status(500).json({ error: 'Fallo al intentar registrar el nuevo presidente' });
    }
};

// Actualizar información de un presidente existente
const actualizarPresidenteBarrio = async (peticion: express.Request, respuesta: express.Response) => {
    try {
        const { id } = peticion.params;
        const { name, barrio, phone } = peticion.body;

        const actualizacion = await dbConexion.barrioPresident.update({
            where: { id },
            data: {
                name: name ?? undefined,
                barrio: barrio ?? undefined,
                phone: phone ?? undefined,
            },
        });

        respuesta.json(actualizacion);
    } catch (errorOperativo: any) {
        console.error('Error en actualización de presidente:', errorOperativo);
        respuesta.status(500).json({ error: 'No se pudo procesar la actualización del registro' });
    }
};

// Eliminar un registro de presidente de barrio
const eliminarPresidenteBarrio = async (peticion: express.Request, respuesta: express.Response) => {
    try {
        const { id } = peticion.params;

        await dbConexion.barrioPresident.delete({
            where: { id },
        });

        respuesta.json({ mensaje: 'Presidente de barrio removido exitosamente del sistema' });
    } catch (errorOperativo: any) {
        console.error('Error al eliminar presidente:', errorOperativo);
        respuesta.status(500).json({ error: 'Fallo en la eliminación del registro solicitado' });
    }
};

/**
 * MAPEADO DE RUTAS HACIA CONTROLADORES
 */
directivaBarriosRouter.get('/', listarPresidentesBarrio);
directivaBarriosRouter.get('/:id', obtenerDetallePresidente);
directivaBarriosRouter.post('/', authenticateToken, requireRole('admin'), registrarPresidenteBarrio);
directivaBarriosRouter.put('/:id', authenticateToken, requireRole('admin'), actualizarPresidenteBarrio);
directivaBarriosRouter.delete('/:id', authenticateToken, requireRole('admin'), eliminarPresidenteBarrio);

export default directivaBarriosRouter;

