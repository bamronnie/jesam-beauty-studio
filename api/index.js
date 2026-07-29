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

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:Bam08089646456.@cluster0.ns3s0ug.mongodb.net/jesam_beauty?retryWrites=true&w=majority';
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'slay_hair_studio_super_secret_jwt_token_key_123!@#';
}

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

let isConnected = false;
async function connectDb() {
  if (isConnected) return;
  try {
    console.log('🔌 Connecting to MongoDB Atlas Cloud Database...');
    await mongoose.connect(MONGODB_URI);
    global.isDbConnected = true;
    isConnected = true;
    console.log('✅ Connected to MongoDB Atlas Cloud Database!');
    await seedDatabase();
    await ensureDefaultAdmin();
  } catch (err) {
    console.error('❌ MongoDB Atlas connection error:', err.message);
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
