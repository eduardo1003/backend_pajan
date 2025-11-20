import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = req.user!;

    const profile = await prisma.profile.findUnique({
      where: { userId: user.userId },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profile);
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: error.message || 'Failed to get profile' });
  }
});

// Update current user profile
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const user = req.user!;
    const { fullName, phone } = req.body;

    const profile = await prisma.profile.update({
      where: { userId: user.userId },
      data: {
        fullName: fullName || undefined,
        phone: phone || undefined,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(profile);
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: error.message || 'Failed to update profile' });
  }
});

// Get all profiles (admin only)
router.get('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany({
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(profiles);
  } catch (error: any) {
    console.error('Get profiles error:', error);
    res.status(500).json({ error: error.message || 'Failed to get profiles' });
  }
});

// Update profile (admin only)
router.put('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, role, departmentId, isActive } = req.body;

    const profile = await prisma.profile.update({
      where: { id },
      data: {
        fullName: fullName || undefined,
        phone: phone || undefined,
        role: role || undefined,
        departmentId: departmentId || undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(profile);
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: error.message || 'Failed to update profile' });
  }
});

export default router;

