import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all barrio presidents
router.get('/', async (req, res) => {
    try {
        const presidents = await prisma.barrioPresident.findMany({
            orderBy: { barrio: 'asc' },
        });

        res.json(presidents);
    } catch (error: any) {
        console.error('Get barrio presidents error:', error);
        res.status(500).json({ error: error.message || 'Failed to get barrio presidents' });
    }
});

// Get single barrio president
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const president = await prisma.barrioPresident.findUnique({
            where: { id },
        });

        if (!president) {
            return res.status(404).json({ error: 'Barrio president not found' });
        }

        res.json(president);
    } catch (error: any) {
        console.error('Get barrio president error:', error);
        res.status(500).json({ error: error.message || 'Failed to get barrio president' });
    }
});

// Create barrio president (admin only)
router.post('/', authenticateToken, requireRole('admin'), async (req, res) => {
    try {
        const { name, barrio, phone } = req.body;

        if (!name || !barrio) {
            return res.status(400).json({ error: 'Name and barrio are required' });
        }

        const president = await prisma.barrioPresident.create({
            data: {
                name,
                barrio,
                phone: phone || '',
            },
        });

        res.status(201).json(president);
    } catch (error: any) {
        console.error('Create barrio president error:', error);
        res.status(500).json({ error: error.message || 'Failed to create barrio president' });
    }
});

// Update barrio president (admin only)
router.put('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, barrio, phone } = req.body;

        const president = await prisma.barrioPresident.update({
            where: { id },
            data: {
                name: name !== undefined ? name : undefined,
                barrio: barrio !== undefined ? barrio : undefined,
                phone: phone !== undefined ? phone : undefined,
            },
        });

        res.json(president);
    } catch (error: any) {
        console.error('Update barrio president error:', error);
        res.status(500).json({ error: error.message || 'Failed to update barrio president' });
    }
});

// Delete barrio president (admin only)
router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.barrioPresident.delete({
            where: { id },
        });

        res.json({ message: 'Barrio president deleted successfully' });
    } catch (error: any) {
        console.error('Delete barrio president error:', error);
        res.status(500).json({ error: error.message || 'Failed to delete barrio president' });
    }
});

export default router;
