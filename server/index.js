import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Utilities & Seeding
import { seedDatabase } from './utils/seedData.js';
import { ensureDefaultAdmin } from './utils/ensureDefaultAdmin.js';

// Routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import serviceRoutes from './routes/services.js';
import bookingRoutes from './routes/bookings.js';
import orderRoutes from './routes/orders.js';
import contactRoutes from './routes/contact.js';

// Load config
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database connection
global.isDbConnected = false;

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('🔌 Connected to MongoDB successfully.');
    global.isDbConnected = true;
    
    // Seed default data & verify admin user
    await seedDatabase();
    await ensureDefaultAdmin();
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    console.warn('⚠️ Server running in local in-memory fallback DEMO mode.');
    global.isDbConnected = false;
  });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Jesam Beauty API Server is active.');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running in development mode on port ${PORT}`);
});
