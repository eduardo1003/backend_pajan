import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all departments
router.get('/', async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
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

    res.json(departments);
  } catch (error: any) {
    console.error('Get departments error:', error);
    res.status(500).json({ error: error.message || 'Failed to get departments' });
  }
});

// Get single department
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
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

    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json(department);
  } catch (error: any) {
    console.error('Get department error:', error);
    res.status(500).json({ error: error.message || 'Failed to get department' });
  }
});

// Create department (admin only)
router.post('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { name, description, headId } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const department = await prisma.department.create({
      data: {
        name,
        description,
        headId,
      },
    });

    res.status(201).json(department);
  } catch (error: any) {
    console.error('Create department error:', error);
    res.status(500).json({ error: error.message || 'Failed to create department' });
  }
});

// Update department (admin only)
router.put('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, headId, isActive } = req.body;

    const department = await prisma.department.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description || undefined,
        headId: headId || undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    });

    res.json(department);
  } catch (error: any) {
    console.error('Update department error:', error);
    res.status(500).json({ error: error.message || 'Failed to update department' });
  }
});

// Delete department (admin only)
router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.department.delete({
      where: { id },
    });

    res.json({ message: 'Department deleted successfully' });
  } catch (error: any) {
    console.error('Delete department error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete department' });
  }
});

export default router;

