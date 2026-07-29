import express from 'express';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { mockBookings, mockUsers } from '../utils/mockDb.js';

const router = express.Router();
const JESAM_EMAIL = process.env.JESAM_CONTACT_EMAIL || 'beautybyjessam@gmail.com';

// GET /api/bookings/reserved?date=YYYY-MM-DD - Get reserved time slots for date
router.get('/reserved', async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(200).json([]);

  try {
    if (!global.isDbConnected) {
      const reservedTimes = mockBookings
        .filter(b => b.date === date && b.status !== 'Cancelled')
        .map(b => b.time);
      return res.status(200).json(reservedTimes);
    }

    const bookings = await Booking.find({ date, status: { $ne: 'Cancelled' } });
    const reservedTimes = bookings.map(b => b.time);
    res.status(200).json(reservedTimes);
  } catch (error) {
    res.status(500).json([]);
  }
});

// Get bookings (Admin gets all, Customer gets only their own)
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (!global.isDbConnected) {
      if (req.user.role === 'admin') {
        return res.status(200).json(mockBookings);
      } else {
        const bookings = mockBookings.filter(b => b.clientEmail.toLowerCase() === req.user.email.toLowerCase());
        return res.status(200).json(bookings);
      }
    }

    if (req.user.role === 'admin') {
      const bookings = await Booking.find().sort({ createdAt: -1 });
      return res.status(200).json(bookings);
    } else {
      const bookings = await Booking.find({ clientEmail: req.user.email }).sort({ createdAt: -1 });
      return res.status(200).json(bookings);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Create booking
router.post('/', async (req, res) => {
  const { clientName, clientPhone, clientEmail, serviceName, stylistName, date, time, price } = req.body;

  if (!clientName || !clientPhone || !clientEmail || !serviceName || !date || !time || !price) {
    return res.status(400).json({ message: 'All booking parameters are required' });
  }

  try {
    const reference = 'BK-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    console.log(`📩 NEW SALON APPOINTMENT BOOKED -> FORWARDING TO JESAM EMAIL (${JESAM_EMAIL}):`);
    console.log(`Ref: ${reference} | Service: ${serviceName} | Date: ${date} | Time: ${time} | Price: ₦${price}`);
    console.log(`Client: ${clientName} (${clientEmail}, ${clientPhone})`);

    if (!global.isDbConnected) {
      const newBooking = {
        _id: 'mock-bk-' + Date.now(),
        reference,
        clientName,
        clientPhone,
        clientEmail: clientEmail.toLowerCase(),
        serviceName,
        stylistName: stylistName || 'Jesam Master Stylist',
        date,
        time,
        price: Number(price),
        status: 'Pending'
      };

      mockBookings.unshift(newBooking);

      // Award mock points if registered user
      const user = mockUsers.find(u => u.email.toLowerCase() === clientEmail.toLowerCase());
      if (user) {
        user.loyaltyPoints = (user.loyaltyPoints || 0) + 50;
      }

      return res.status(201).json(newBooking);
    }
    
    const newBooking = new Booking({
      reference,
      clientName,
      clientPhone,
      clientEmail,
      serviceName,
      stylistName: stylistName || 'Any Expert',
      date,
      time,
      price: Number(price),
      status: 'Pending'
    });

    await newBooking.save();

    // If a registered user is logged in, award 50 loyalty points
    const user = await User.findOne({ email: clientEmail.toLowerCase() });
    if (user) {
      user.loyaltyPoints = (user.loyaltyPoints || 0) + 50;
      await user.save();
    }

    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
});

// Update booking status (Admin only)
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
      const booking = mockBookings.find(b => b.reference === req.params.reference);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      booking.status = status;
      return res.status(200).json(booking);
    }

    const booking = await Booking.findOneAndUpdate(
      { reference: req.params.reference },
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking' });
  }
});

export default router;
