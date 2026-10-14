import express from 'express';
import mongoose from 'mongoose';
import Company from '../models/Company.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

const isDatabaseConnected = () => mongoose.connection.readyState === 1;

let fallbackCompany = null;

router.get('/', async (_req, res) => {
  if (!isDatabaseConnected()) {
    return res.json(fallbackCompany || {});
  }

  try {
    let company = await Company.findOne({ key: 'main_company_info' });
    if (!company) {
      company = {};
    }
    return res.json(company);
  } catch (error) {
    console.error('Error fetching company info:', error.message);
    return res.status(500).json({ message: 'Failed to fetch company info', error: error.message });
  }
});

router.put('/', requireAdmin, async (req, res) => {
  try {
    const updatedFields = req.body || {};

    if (!isDatabaseConnected()) {
      fallbackCompany = { ...(fallbackCompany || {}), ...updatedFields };
      return res.json(fallbackCompany);
    }

    const updated = await Company.findOneAndUpdate(
      { key: 'main_company_info' },
      { $set: updatedFields },
      { new: true, upsert: true }
    );

    return res.json(updated);
  } catch (error) {
    console.error('Error updating company info:', error.message);
    return res.status(500).json({ message: 'Failed to update company info', error: error.message });
  }
});

export default router;
