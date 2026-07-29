import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jesam-beauty';

async function applyJesamCatalog() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    // 1. Delete ALL old products
    console.log('🗑️ Deleting all old sample products from database...');
    const deleteResult = await Product.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} old products.`);

    // 2. Read new products JSON
    const jsonPath = path.join(process.cwd(), '..', 'scripts', 'jesam_products.json');
    if (!fs.existsSync(jsonPath)) {
      console.error('❌ jesam_products.json file not found at:', jsonPath);
      process.exit(1);
    }

    const rawProducts = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    // Strip manual _id so Mongoose auto-generates valid ObjectIds
    const newProducts = rawProducts.map(({ _id, ...rest }) => rest);

    console.log(`🌱 Inserting ${newProducts.length} real Jesam client products...`);

    const inserted = await Product.insertMany(newProducts);
    console.log(`✅ Successfully seeded ${inserted.length} new Jesam video products into database!`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  } catch (err) {
    console.error('❌ Error applying Jesam catalog:', err);
    process.exit(1);
  }
}

applyJesamCatalog();
