import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get admin statistics
router.get('/admin', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const [
      totalUsers,
      totalDepartments,
      totalIncidents,
      incidentsByStatus,
      incidentsByCategory,
    ] = await Promise.all([
      prisma.profile.count(),
      prisma.department.count({ where: { isActive: true } }),
      prisma.incident.count(),
      prisma.incident.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.incident.groupBy({
        by: ['category'],
        _count: true,
      }),
    ]);

    const stats = {
      totalUsers,
      totalDepartments,
      totalIncidents,
      incidentsByStatus: incidentsByStatus.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {} as Record<string, number>),
      incidentsByCategory: incidentsByCategory.reduce((acc, item) => {
        acc[item.category] = item._count;
        return acc;
      }, {} as Record<string, number>),
    };

    res.json(stats);
  } catch (error: any) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ error: error.message || 'Failed to get statistics' });
  }
});

// Get user statistics
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const user = req.user!;

    const profile = await prisma.profile.findUnique({
      where: { userId: user.userId },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    let where: any = {};

    if (profile.role === 'citizen') {
      where.citizenId = profile.id;
    } else if (profile.role === 'department_head' || profile.role === 'department_staff') {
      where.assignedDepartmentId = profile.departmentId;
    }

    const [
      totalIncidents,
      incidentsByStatus,
    ] = await Promise.all([
      prisma.incident.count({ where }),
      prisma.incident.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
    ]);

    const stats = {
      totalIncidents,
      incidentsByStatus: incidentsByStatus.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {} as Record<string, number>),
    };

    res.json(stats);
  } catch (error: any) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: error.message || 'Failed to get statistics' });
  }
});

export default router;

