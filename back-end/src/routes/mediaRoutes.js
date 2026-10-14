import express from 'express';
import mongoose from 'mongoose';
import Media from '../models/Media.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

const isDatabaseConnected = () => mongoose.connection.readyState === 1;

let fallbackMedia = [];

router.get('/', async (_req, res) => {
  if (!isDatabaseConnected()) {
    return res.json(fallbackMedia);
  }

  try {
    const mediaItems = await Media.find().sort({ createdAt: -1 });
    return res.json(mediaItems);
  } catch (error) {
    console.error('Error fetching media gallery:', error.message);
    return res.status(500).json({ message: 'Failed to fetch media gallery', error: error.message });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const mediaData = req.body || {};
    const newId = mediaData.id || `media-${Date.now()}`;

    const mediaToCreate = {
      ...mediaData,
      id: newId
    };

    if (!isDatabaseConnected()) {
      fallbackMedia.unshift(mediaToCreate);
      return res.status(201).json(mediaToCreate);
    }

    const createdMedia = await Media.create(mediaToCreate);
    return res.status(201).json(createdMedia);
  } catch (error) {
    console.error('Error creating media item:', error.message);
    return res.status(500).json({ message: 'Failed to create media item', error: error.message });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body || {};

    if (!isDatabaseConnected()) {
      const idx = fallbackMedia.findIndex((m) => m.id === id);
      if (idx !== -1) {
        fallbackMedia[idx] = { ...fallbackMedia[idx], ...updatedFields };
        return res.json(fallbackMedia[idx]);
      }
      return res.status(404).json({ message: 'Media item not found' });
    }

    const updated = await Media.findOneAndUpdate(
      { id },
      { $set: updatedFields },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Media item not found' });
    }

    return res.json(updated);
  } catch (error) {
    console.error('Error updating media item:', error.message);
    return res.status(500).json({ message: 'Failed to update media item', error: error.message });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!isDatabaseConnected()) {
      fallbackMedia = fallbackMedia.filter((m) => m.id !== id);
      return res.json({ message: 'Media item deleted successfully' });
    }

    const deleted = await Media.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ message: 'Media item not found' });
    }

    return res.json({ message: 'Media item deleted successfully' });
  } catch (error) {
    console.error('Error deleting media item:', error.message);
    return res.status(500).json({ message: 'Failed to delete media item', error: error.message });
  }
});

export default router;
