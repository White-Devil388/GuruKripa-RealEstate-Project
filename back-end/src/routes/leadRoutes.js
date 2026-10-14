import express from 'express';
import mongoose from 'mongoose';
import Lead from '../models/Lead.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

const defaultLeads = [
  {
    id: 'GA-LEAD-1001',
    name: 'Vikramaditya Roy',
    phone: '+91 98765 43210',
    email: 'vikram.roy@example.com',
    type: 'Site Visit',
    projectName: 'Gurukripa Grand Residences',
    dateSubmitted: '2026-08-30 14:20',
    preferredDate: '2026-09-05',
    preferredTime: '11:00 AM',
    status: 'Site Visit Scheduled',
    notes: 'Requested pickup from Golf Course Extension Rd.'
  },
  {
    id: 'GA-LEAD-1002',
    name: 'Ananya Sharma',
    phone: '+91 98112 99887',
    email: 'ananya.s@example.com',
    type: 'Brochure Request',
    projectName: 'Gurukripa Eco Enclave',
    dateSubmitted: '2026-08-31 09:45',
    preferredDate: 'N/A',
    preferredTime: 'N/A',
    status: 'Qualified',
    notes: 'Interested in 3BHK Penthouse pricing details.'
  }
];

const fallbackLeads = [...defaultLeads];
const isDatabaseConnected = () => mongoose.connection.readyState === 1;

router.get('/', requireAdmin, async (_req, res) => {
  if (!isDatabaseConnected()) {
    return res.json(fallbackLeads);
  }

  try {
    const leads = await Lead.find().sort({ createdAt: -1 });

    if (leads.length > 0) {
      return res.json(leads.map((lead) => ({
        ...lead.toObject(),
        dateSubmitted: lead.dateSubmitted ? new Date(lead.dateSubmitted).toISOString().slice(0, 16).replace('T', ' ') : 'N/A'
      })));
    }

    return res.json(defaultLeads);
  } catch (error) {
    console.error('Error fetching leads:', error.message);
    return res.status(500).json({ message: 'Failed to fetch leads', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const leadData = req.body || {};

    const newLead = {
      id: leadData.id || `GA-LEAD-${Math.floor(1000 + Math.random() * 9000)}`,
      name: leadData.name || 'Anonymous Visitor',
      phone: leadData.phone || 'Not Provided',
      email: leadData.email || 'Not Provided',
      type: leadData.type || 'General Enquiry',
      projectName: leadData.projectName || 'General / Unspecified',
      preferredDate: leadData.preferredDate || 'N/A',
      preferredTime: leadData.preferredTime || 'N/A',
      status: leadData.status || 'New',
      notes: leadData.notes || leadData.message || 'Submitted via website form',
      message: leadData.message || '',
      dateSubmitted: new Date()
    };

    if (!isDatabaseConnected()) {
      fallbackLeads.unshift(newLead);
      return res.status(201).json(newLead);
    }

    const createdLead = await Lead.create(newLead);

    return res.status(201).json({
      ...createdLead.toObject(),
      dateSubmitted: new Date(createdLead.dateSubmitted).toISOString().slice(0, 16).replace('T', ' ')
    });
  } catch (error) {
    console.error('Error creating lead:', error.message);
    return res.status(500).json({ message: 'Failed to create lead', error: error.message });
  }
});

router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    if (!isDatabaseConnected()) {
      const lead = fallbackLeads.find((item) => item.id === req.params.id);

      if (!lead) {
        return res.status(404).json({ message: 'Lead not found' });
      }

      lead.status = status;
      return res.json(lead);
    }

    const updatedLead = await Lead.findOneAndUpdate(
      { id: req.params.id },
      { status },
      { new: true }
    );

    if (!updatedLead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    return res.json({
      ...updatedLead.toObject(),
      dateSubmitted: new Date(updatedLead.dateSubmitted).toISOString().slice(0, 16).replace('T', ' ')
    });
  } catch (error) {
    console.error('Error updating lead:', error.message);
    return res.status(500).json({ message: 'Failed to update lead', error: error.message });
  }
});

export default router;
