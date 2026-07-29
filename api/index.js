import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Utilities & Seeding
import { seedDatabase } from '../server/utils/seedData.js';
import { ensureDefaultAdmin } from '../server/utils/ensureDefaultAdmin.js';

// Routes
import authRoutes from '../server/routes/auth.js';
import productRoutes from '../server/routes/products.js';
import serviceRoutes from '../server/routes/services.js';
import bookingRoutes from '../server/routes/bookings.js';
import orderRoutes from '../server/routes/orders.js';
import contactRoutes from '../server/routes/contact.js';

dotenv.config();

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

let isConnected = false;
async function connectDb() {
  if (isConnected) return;
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      global.isDbConnected = true;
      isConnected = true;
      await seedDatabase();
      await ensureDefaultAdmin();
    } else {
      global.isDbConnected = false;
    }
  } catch (err) {
    console.warn('MongoDB connection warning:', err.message);
    global.isDbConnected = false;
  }
}

app.use(async (req, res, next) => {
  await connectDb();
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);

app.get('/api', (req, res) => {
  res.json({ status: 'online', message: 'Jesam Beauty Express API is running on Vercel.' });
});

export default app;
