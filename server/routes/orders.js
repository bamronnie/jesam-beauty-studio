import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { mockOrders, mockUsers } from '../utils/mockDb.js';

const router = express.Router();

// Get orders (Admin gets all, Customer gets only their own)
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (!global.isDbConnected) {
      if (req.user.role === 'admin') {
        return res.status(200).json(mockOrders);
      } else {
        const orders = mockOrders.filter(o => o.clientEmail.toLowerCase() === req.user.email.toLowerCase());
        return res.status(200).json(orders);
      }
    }

    if (req.user.role === 'admin') {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.status(200).json(orders);
    } else {
      const orders = await Order.find({ clientEmail: req.user.email }).sort({ createdAt: -1 });
      return res.status(200).json(orders);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Create Order (simulation matching frontend billing detail triggers)
router.post('/', async (req, res) => {
  const { reference, clientName, clientEmail, items, total, method, date } = req.body;

  if (!reference || !clientName || !clientEmail || !items || !total || !date) {
    return res.status(400).json({ message: 'All order parameters are required' });
  }

  try {
    const pointsEarned = Math.floor(Number(total) / 1000);

    if (!global.isDbConnected) {
      const newOrder = {
        _id: 'mock-ord-' + Date.now(),
        reference,
        clientName,
        clientEmail: clientEmail.toLowerCase(),
        items,
        total: Number(total),
        method: method || 'Paystack',
        status: 'Pending',
        date
      };

      mockOrders.unshift(newOrder);

      // Award mock points if registered user
      const user = mockUsers.find(u => u.email.toLowerCase() === clientEmail.toLowerCase());
      if (user && pointsEarned > 0) {
        user.loyaltyPoints = (user.loyaltyPoints || 0) + pointsEarned;
      }

      return res.status(201).json({ order: newOrder, pointsEarned });
    }

    const newOrder = new Order({
      reference,
      clientName,
      clientEmail,
      items,
      total: Number(total),
      method: method || 'Paystack',
      status: 'Pending',
      date
    });

    await newOrder.save();

    // Award loyalty points: 1 point per ₦1000 spent
    const user = await User.findOne({ email: clientEmail.toLowerCase() });
    if (user && pointsEarned > 0) {
      user.loyaltyPoints = (user.loyaltyPoints || 0) + pointsEarned;
      await user.save();
    }

    res.status(201).json({ order: newOrder, pointsEarned });
  } catch (error) {
    console.error('Order Error:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Update order status (Admin only)
router.patch('/:reference', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Administrative access required' });
  }

  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  try {
    if (!global.isDbConnected) {
      const order = mockOrders.find(o => o.reference === req.params.reference);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      order.status = status;
      return res.status(200).json(order);
    }

    const order = await Order.findOneAndUpdate(
      { reference: req.params.reference },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order' });
  }
});

export default router;
