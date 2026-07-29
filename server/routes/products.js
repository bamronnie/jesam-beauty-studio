import express from 'express';
import Product from '../models/Product.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { mockProducts } from '../utils/mockDb.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    if (!global.isDbConnected) {
      return res.status(200).json(mockProducts);
    }
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Add new product (Admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const { name, price, oldPrice, category, tag, img, images, video, poster, desc } = req.body;
  
  if (!name || !price || !category || !img) {
    return res.status(400).json({ message: 'Name, price, category, and image URL are required' });
  }

  // Parse images parameter: support arrays, strings, or fall back to [img]
  const imagesArray = Array.isArray(images) 
    ? images 
    : (typeof images === 'string' ? images.split(',').map(u => u.trim()).filter(Boolean) : [img]);

  try {
    if (!global.isDbConnected) {
      const newProduct = {
        _id: 'mock-p-' + Date.now(),
        name,
        price: Number(price),
        oldPrice: Number(oldPrice) || 0,
        category,
        tag: tag || null,
        img,
        images: imagesArray,
        video: video || '/videos/p1.mp4',
        poster: poster || '/videos/p1-poster.jpg',
        desc: desc || 'Hair product by Jesam Beauty.',
        rating: 5.0,
        reviews: 1
      };
      mockProducts.unshift(newProduct);
      return res.status(201).json(newProduct);
    }

    const newProduct = new Product({
      name,
      price: Number(price),
      oldPrice: Number(oldPrice) || 0,
      category,
      tag: tag || null,
      img,
      images: imagesArray,
      video: video || '/videos/p1.mp4',
      poster: poster || '/videos/p1-poster.jpg',
      desc: desc || 'Hair product by Jesam Beauty.'
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product' });
  }
});

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Bulk Import Products (Admin only)
router.post('/import', authenticateToken, isAdmin, async (req, res) => {
  const { csvData } = req.body;

  if (!csvData || typeof csvData !== 'string' || !csvData.trim()) {
    return res.status(400).json({ message: 'CSV data is required' });
  }

  const lines = csvData.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) {
    return res.status(400).json({ message: 'CSV must contain a header row and at least one data row' });
  }

  // Parse header row
  const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase());
  const nameIdx = headers.indexOf('name');
  const priceIdx = headers.indexOf('price');
  const oldPriceIdx = headers.indexOf('oldprice');
  const categoryIdx = headers.indexOf('category');
  const tagIdx = headers.indexOf('tag');
  const imgIdx = headers.indexOf('img');
  const imagesIdx = headers.indexOf('images');
  const videoIdx = headers.indexOf('video');
  const posterIdx = headers.indexOf('poster');
  const descIdx = headers.indexOf('desc');

  if (nameIdx === -1 || priceIdx === -1 || categoryIdx === -1 || imgIdx === -1) {
    return res.status(400).json({ 
      message: 'CSV header must include at least: name, price, category, img' 
    });
  }

  let createdCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;
  const errors = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    if (row.length === 0 || (row.length === 1 && !row[0])) {
      skippedCount++;
      continue;
    }

    const name = row[nameIdx];
    const priceRaw = row[priceIdx];
    const categoryRaw = row[categoryIdx];
    const img = row[imgIdx];
    const oldPriceRaw = oldPriceIdx !== -1 ? row[oldPriceIdx] : '0';
    const tag = tagIdx !== -1 ? row[tagIdx] : null;
    const imagesRaw = imagesIdx !== -1 ? row[imagesIdx] : '';
    const video = videoIdx !== -1 ? row[videoIdx] : '/videos/p1.mp4';
    const poster = posterIdx !== -1 ? row[posterIdx] : '/videos/p1-poster.jpg';
    const desc = descIdx !== -1 ? row[descIdx] : 'Hair product by Jesam Beauty.';

    if (!name || !priceRaw || !categoryRaw || !img) {
      skippedCount++;
      errors.push({ row: i + 1, message: 'Missing required field (name, price, category, or img)' });
      continue;
    }

    const price = Number(priceRaw);
    const oldPrice = Number(oldPriceRaw) || 0;
    const category = categoryRaw.toLowerCase();
    
    // Parse semicolon list, fallback to comma list, or cover image
    const imagesArray = imagesRaw
      ? (imagesRaw.includes(';') ? imagesRaw.split(';').map(u => u.trim()).filter(Boolean) : imagesRaw.split(',').map(u => u.trim()).filter(Boolean))
      : [img];

    if (isNaN(price) || price < 0) {
      skippedCount++;
      errors.push({ row: i + 1, message: `Invalid price: ${priceRaw}` });
      continue;
    }

    const validCategories = ['wigs', 'extensions', 'care', 'tools'];
    if (!validCategories.includes(category)) {
      skippedCount++;
      errors.push({ row: i + 1, message: `Invalid category: ${categoryRaw}. Must be wigs, extensions, care, or tools.` });
      continue;
    }

    try {
      if (!global.isDbConnected) {
        // Mock DB operation
        const existingIndex = mockProducts.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
        if (existingIndex !== -1) {
          // Update
          mockProducts[existingIndex] = {
            ...mockProducts[existingIndex],
            price,
            oldPrice,
            category,
            tag: tag || null,
            img,
            images: imagesArray,
            video: video || '/videos/p1.mp4',
            poster: poster || '/videos/p1-poster.jpg',
            desc
          };
          updatedCount++;
        } else {
          // Create
          const newProduct = {
            _id: 'mock-p-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
            name,
            price,
            oldPrice,
            category,
            tag: tag || null,
            img,
            images: imagesArray,
            video: video || '/videos/p1.mp4',
            poster: poster || '/videos/p1-poster.jpg',
            desc,
            rating: 5.0,
            reviews: 1
          };
          mockProducts.unshift(newProduct);
          createdCount++;
        }
      } else {
        // Database operation
        const existingProduct = await Product.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
        if (existingProduct) {
          // Update
          existingProduct.price = price;
          existingProduct.oldPrice = oldPrice;
          existingProduct.category = category;
          existingProduct.tag = tag || null;
          existingProduct.img = img;
          existingProduct.images = imagesArray;
          existingProduct.video = video || '/videos/p1.mp4';
          existingProduct.poster = poster || '/videos/p1-poster.jpg';
          existingProduct.desc = desc;
          await existingProduct.save();
          updatedCount++;
        } else {
          // Create
          const newProduct = new Product({
            name,
            price,
            oldPrice,
            category,
            tag: tag || null,
            img,
            images: imagesArray,
            video: video || '/videos/p1.mp4',
            poster: poster || '/videos/p1-poster.jpg',
            desc
          });
          await newProduct.save();
          createdCount++;
        }
      }
    } catch (err) {
      skippedCount++;
      errors.push({ row: i + 1, message: `DB Error: ${err.message}` });
    }
  }

  res.status(200).json({
    message: 'CSV Product Import completed',
    created: createdCount,
    updated: updatedCount,
    skipped: skippedCount,
    errors
  });
});

// Update product (Admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  const { name, price, oldPrice, category, tag, img, images, video, poster, desc } = req.body;
  
  try {
    if (!global.isDbConnected) {
      const product = mockProducts.find(p => p._id === req.params.id || p.id === req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      if (name !== undefined) product.name = name;
      if (price !== undefined) product.price = Number(price);
      if (oldPrice !== undefined) product.oldPrice = Number(oldPrice);
      if (category !== undefined) product.category = category;
      if (tag !== undefined) product.tag = tag;
      if (img !== undefined) product.img = img;
      if (images !== undefined) product.images = images;
      if (video !== undefined) product.video = video;
      if (poster !== undefined) product.poster = poster;
      if (desc !== undefined) product.desc = desc;
      return res.status(200).json(product);
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (price !== undefined) updateFields.price = Number(price);
    if (oldPrice !== undefined) updateFields.oldPrice = Number(oldPrice);
    if (category !== undefined) updateFields.category = category;
    if (tag !== undefined) updateFields.tag = tag;
    if (img !== undefined) updateFields.img = img;
    if (images !== undefined) updateFields.images = images;
    if (video !== undefined) updateFields.video = video;
    if (poster !== undefined) updateFields.poster = poster;
    if (desc !== undefined) updateFields.desc = desc;

    const product = await Product.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product: ' + error.message });
  }
});

// Delete product (Admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    if (!global.isDbConnected) {
      const index = mockProducts.findIndex(p => p._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ message: 'Product not found' });
      }
      mockProducts.splice(index, 1);
      return res.status(200).json({ message: 'Product deleted successfully', id: req.params.id });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

// Add product review
router.post('/:id/reviews', async (req, res) => {
  const { username, rating, comment } = req.body;
  const ratingNum = Number(rating);
  
  if (!username || !ratingNum || !comment) {
    return res.status(400).json({ message: 'Username, rating, and comment are required' });
  }

  try {
    if (!global.isDbConnected) {
      const product = mockProducts.find(p => p._id === req.params.id || p.id === req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      
      if (!product.reviewsList) product.reviewsList = [];
      product.reviewsList.unshift({
        username,
        rating: ratingNum,
        comment,
        date: new Date()
      });
      
      product.reviews = product.reviewsList.length;
      const sum = product.reviewsList.reduce((acc, r) => acc + r.rating, 0);
      product.rating = Number((sum / product.reviews).toFixed(1));
      
      return res.status(200).json(product);
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.reviewsList.unshift({
      username,
      rating: ratingNum,
      comment
    });

    product.reviews = product.reviewsList.length;
    const sum = product.reviewsList.reduce((acc, r) => acc + r.rating, 0);
    product.rating = Number((sum / product.reviews).toFixed(1));

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error adding review: ' + error.message });
  }
});

export default router;
