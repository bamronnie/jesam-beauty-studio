import express from 'express';
import Service from '../models/Service.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { mockServices } from '../utils/mockDb.js';

const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    if (!global.isDbConnected) {
      return res.status(200).json(mockServices);
    }
    const services = await Service.find().sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services' });
  }
});

// Add new service (Admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const { title, desc, duration, price, category } = req.body;

  if (!title || !price || !category) {
    return res.status(400).json({ message: 'Title, price, and category are required' });
  }

  try {
    if (!global.isDbConnected) {
      const newService = {
        _id: 'mock-srv-' + Date.now(),
        title,
        desc: desc || 'Custom hair service.',
        duration: duration || '120 mins',
        price: Number(price),
        category
      };
      mockServices.unshift(newService);
      return res.status(201).json(newService);
    }

    const newService = new Service({
      title,
      desc: desc || 'Custom styling service.',
      duration: duration || '120 mins',
      price: Number(price),
      category
    });

    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ message: 'Error creating service' });
  }
});

// Delete service (Admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    if (!global.isDbConnected) {
      const index = mockServices.findIndex(s => s._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ message: 'Service not found' });
      }
      mockServices.splice(index, 1);
      return res.status(200).json({ message: 'Service deleted successfully', id: req.params.id });
    }

    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json({ message: 'Service deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service' });
  }
});

export default router;
