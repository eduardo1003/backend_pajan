import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all incidents (with filters based on role)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = req.user!;
    const { status, category, limit, offset } = req.query;

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: user.userId },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    let where: any = {};

    // Filter by role
    if (profile.role === 'citizen') {
      where.citizenId = profile.id;
    } else if (profile.role === 'department_head' || profile.role === 'department_staff') {
      where.assignedDepartmentId = profile.departmentId;
    }
    // Admin can see all

    if (status) {
      where.status = status;
    }

    if (category) {
      where.category = category;
    }

    const incidents = await prisma.incident.findMany({
      where,
      include: {
        citizen: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        },
        assignedDepartment: {
          select: {
            id: true,
            name: true,
          },
        },
        assignedStaff: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit as string) : undefined,
      skip: offset ? parseInt(offset as string) : undefined,
    });

    res.json(incidents);
  } catch (error: any) {
    console.error('Get incidents error:', error);
    res.status(500).json({ error: error.message || 'Failed to get incidents' });
  }
});

// Get public incidents (no auth required)
router.get('/public', async (req, res) => {
  try {
    const { status, category, limit } = req.query;

    let where: any = {};

    if (status) {
      where.status = status;
    }

    if (category) {
      where.category = category;
    }

    const incidents = await prisma.incident.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        status: true,
        latitude: true,
        longitude: true,
        address: true,
        createdAt: true,
        resolvedAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit as string) : 100,
    });

    res.json(incidents);
  } catch (error: any) {
    console.error('Get public incidents error:', error);
    res.status(500).json({ error: error.message || 'Failed to get incidents' });
  }
});

// Get single incident
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const profile = await prisma.profile.findUnique({
      where: { userId: user.userId },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const incident = await prisma.incident.findUnique({
      where: { id },
      include: {
        citizen: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        },
        assignedDepartment: {
          select: {
            id: true,
            name: true,
          },
        },
        assignedStaff: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    // Check permissions
    if (profile.role === 'citizen' && incident.citizenId !== profile.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if ((profile.role === 'department_head' || profile.role === 'department_staff') 
        && incident.assignedDepartmentId !== profile.departmentId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(incident);
  } catch (error: any) {
    console.error('Get incident error:', error);
    res.status(500).json({ error: error.message || 'Failed to get incident' });
  }
});

// Create incident
router.post('/', authenticateToken, async (req, res) => {
  try {
    const user = req.user!;
    const {
      title,
      description,
      category,
      latitude,
      longitude,
      address,
      evidenceUrls,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Title, description, and category are required' });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.userId },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const incident = await prisma.incident.create({
      data: {
        title,
        description,
        category,
        citizenId: profile.id,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        address,
        evidenceUrls: evidenceUrls || [],
      },
      include: {
        citizen: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    res.status(201).json(incident);
  } catch (error: any) {
    console.error('Create incident error:', error);
    res.status(500).json({ error: error.message || 'Failed to create incident' });
  }
});

// Update incident
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user!;
    const {
      status,
      assignedDepartmentId,
      assignedStaffId,
      resolutionDescription,
      resolutionEvidenceUrls,
    } = req.body;

    const profile = await prisma.profile.findUnique({
      where: { userId: user.userId },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const existingIncident = await prisma.incident.findUnique({
      where: { id },
    });

    if (!existingIncident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    // Check permissions
    if (profile.role === 'citizen' && existingIncident.citizenId !== profile.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if ((profile.role === 'department_head' || profile.role === 'department_staff') 
        && existingIncident.assignedDepartmentId !== profile.departmentId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updateData: any = {};

    if (status) {
      updateData.status = status;
      if (status === 'resolved') {
        updateData.resolvedAt = new Date();
      }
    }

    if (assignedDepartmentId) {
      updateData.assignedDepartmentId = assignedDepartmentId;
    }

    if (assignedStaffId) {
      updateData.assignedStaffId = assignedStaffId;
    }

    if (resolutionDescription) {
      updateData.resolutionDescription = resolutionDescription;
    }

    if (resolutionEvidenceUrls) {
      updateData.resolutionEvidenceUrls = resolutionEvidenceUrls;
    }

    const incident = await prisma.incident.update({
      where: { id },
      data: updateData,
      include: {
        citizen: {
          select: {
            id: true,
            fullName: true,
          },
        },
        assignedDepartment: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(incident);
  } catch (error: any) {
    console.error('Update incident error:', error);
    res.status(500).json({ error: error.message || 'Failed to update incident' });
  }
});

// Delete incident (admin only)
router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.incident.delete({
      where: { id },
    });

    res.json({ message: 'Incident deleted successfully' });
  } catch (error: any) {
    console.error('Delete incident error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete incident' });
  }
});

export default router;

