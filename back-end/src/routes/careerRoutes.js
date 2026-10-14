import express from 'express';
import mongoose from 'mongoose';
import Career from '../models/Career.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

const isDatabaseConnected = () => mongoose.connection.readyState === 1;

let fallbackCareers = [];

router.get('/', async (_req, res) => {
  if (!isDatabaseConnected()) {
    return res.json(fallbackCareers);
  }

  try {
    const careers = await Career.find().sort({ createdAt: -1 });
    return res.json(careers);
  } catch (error) {
    console.error('Error fetching careers:', error.message);
    return res.status(500).json({ message: 'Failed to fetch careers', error: error.message });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const careerData = req.body || {};
    const newId = careerData.id || `job-${Date.now()}`;

    const careerToCreate = {
      ...careerData,
      id: newId
    };

    if (!isDatabaseConnected()) {
      fallbackCareers.unshift(careerToCreate);
      return res.status(201).json(careerToCreate);
    }

    const createdCareer = await Career.create(careerToCreate);
    return res.status(201).json(createdCareer);
  } catch (error) {
    console.error('Error creating career position:', error.message);
    return res.status(500).json({ message: 'Failed to create position', error: error.message });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body || {};

    if (!isDatabaseConnected()) {
      const idx = fallbackCareers.findIndex((c) => c.id === id);
      if (idx !== -1) {
        fallbackCareers[idx] = { ...fallbackCareers[idx], ...updatedFields };
        return res.json(fallbackCareers[idx]);
      }
      return res.status(404).json({ message: 'Position not found' });
    }

    const updated = await Career.findOneAndUpdate(
      { id },
      { $set: updatedFields },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Position not found' });
    }

    return res.json(updated);
  } catch (error) {
    console.error('Error updating career position:', error.message);
    return res.status(500).json({ message: 'Failed to update position', error: error.message });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!isDatabaseConnected()) {
      fallbackCareers = fallbackCareers.filter((c) => c.id !== id);
      return res.json({ message: 'Position deleted successfully' });
    }

    const deleted = await Career.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ message: 'Position not found' });
    }

    return res.json({ message: 'Position deleted successfully' });
  } catch (error) {
    console.error('Error deleting position:', error.message);
    return res.status(500).json({ message: 'Failed to delete position', error: error.message });
  }
});

export default router;
