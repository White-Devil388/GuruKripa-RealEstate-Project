import express from 'express';
import mongoose from 'mongoose';
import Project from '../models/Project.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

const isDatabaseConnected = () => mongoose.connection.readyState === 1;

let fallbackProjects = [];

router.get('/', async (_req, res) => {
  if (!isDatabaseConnected()) {
    return res.json(fallbackProjects);
  }

  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error.message);
    return res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const projData = req.body || {};
    const newId = projData.id || `proj-${Date.now()}`;
    const slug = projData.slug || projData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `proj-${Date.now()}`;

    const projectToCreate = {
      ...projData,
      id: newId,
      slug
    };

    if (!isDatabaseConnected()) {
      fallbackProjects.unshift(projectToCreate);
      return res.status(201).json(projectToCreate);
    }

    const createdProject = await Project.create(projectToCreate);
    return res.status(201).json(createdProject);
  } catch (error) {
    console.error('Error creating project:', error.message);
    return res.status(500).json({ message: 'Failed to create project', error: error.message });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body || {};

    if (!isDatabaseConnected()) {
      const idx = fallbackProjects.findIndex((p) => p.id === id);
      if (idx !== -1) {
        fallbackProjects[idx] = { ...fallbackProjects[idx], ...updatedFields };
        return res.json(fallbackProjects[idx]);
      }
      return res.status(404).json({ message: 'Project not found' });
    }

    const updated = await Project.findOneAndUpdate(
      { id },
      { $set: updatedFields },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.json(updated);
  } catch (error) {
    console.error('Error updating project:', error.message);
    return res.status(500).json({ message: 'Failed to update project', error: error.message });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!isDatabaseConnected()) {
      fallbackProjects = fallbackProjects.filter((p) => p.id !== id);
      return res.json({ message: 'Project deleted successfully' });
    }

    const deleted = await Project.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error.message);
    return res.status(500).json({ message: 'Failed to delete project', error: error.message });
  }
});

export default router;
