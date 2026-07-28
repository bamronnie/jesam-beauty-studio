import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { mockUsers } from '../utils/mockDb.js';

const router = express.Router();

// Google Auth (Register or Login)
router.post('/google', async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: 'Google ID token is required' });
  }

  try {
    let email, name;

    // Check if it is a mock token (Demo mode)
    if (token.startsWith('mock_google_token_')) {
      const parts = token.replace('mock_google_token_', '').split('_');
      name = decodeURIComponent(parts[0] || 'Google Tester');
      email = decodeURIComponent(parts[1] || 'google.tester@gmail.com').toLowerCase();
    } else {
      // Real Mode verification using Google tokeninfo API endpoint
      const googleResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
      if (!googleResponse.ok) {
        return res.status(400).json({ message: 'Invalid Google authentication token' });
      }
      const payload = await googleResponse.json();
      email = payload.email.toLowerCase();
      name = payload.name;

      // Verify audience match if Client ID is configured
      const clientId = process.env.GOOGLE_CLIENT_ID;
      if (clientId && payload.aud !== clientId) {
        return res.status(400).json({ message: 'Google Token audience mismatch' });
      }
    }

    // Now handle User sign-in/registration in DB (or mock DB if DB is offline)
    if (!global.isDbConnected) {
      let user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        // Register new mock user
        user = {
          _id: 'mock-usr-' + Date.now(),
          name,
          email,
          phone: '',
          loyaltyPoints: 100, // Welcome points
          coupons: ['WELCOME10', 'JESAMVIP', 'FREECARE'],
          role: 'customer'
        };
        mockUsers.push(user);
      }

      const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.status(200).json({
        token: jwtToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          loyaltyPoints: user.loyaltyPoints,
          coupons: user.coupons,
          role: user.role
        }
      });
    }

    // Real DB operation
    let user = await User.findOne({ email });
    if (!user) {
      // Register new user
      const dummyPassword = Math.random().toString(36).substring(2) + Date.now().toString(36);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(dummyPassword, salt);

      user = new User({
        name,
        email,
        password: hashedPassword,
        phone: '',
        loyaltyPoints: 100
      });
      await user.save();
    }

    // Create JWT token for our system session
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        loyaltyPoints: user.loyaltyPoints,
        coupons: user.coupons,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Google Auth backend error:', error);
    res.status(500).json({ message: 'Authentication failed: ' + error.message });
  }
});

// User Registration
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  try {
    if (!global.isDbConnected) {
      const userExists = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: 'mock-usr-' + Date.now(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone,
        loyaltyPoints: 100,
        coupons: ['WELCOME10', 'JESAMVIP', 'FREECARE'],
        role: 'customer'
      };

      mockUsers.push(newUser);
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          loyaltyPoints: newUser.loyaltyPoints,
          coupons: newUser.coupons,
          role: newUser.role
        }
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      loyaltyPoints: 100 // 100 welcome points!
    });

    await newUser.save();
    
    // Create token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Format output
    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      loyaltyPoints: newUser.loyaltyPoints,
      coupons: newUser.coupons,
      role: newUser.role
    };

    res.status(201).json({ token, user: userResponse });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server registration error' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    if (!global.isDbConnected) {
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(400).json({ message: 'Incorrect email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect email or password' });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.status(200).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          loyaltyPoints: user.loyaltyPoints,
          coupons: user.coupons,
          role: user.role
        }
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Incorrect email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect email or password' });
    }

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      loyaltyPoints: user.loyaltyPoints,
      coupons: user.coupons,
      role: user.role
    };

    res.status(200).json({ token, user: userResponse });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server login error' });
  }
});

// Get Profile Details
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      loyaltyPoints: user.loyaltyPoints,
      coupons: user.coupons,
      role: user.role
    };
    res.status(200).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Server profile error' });
  }
});

// Get all users (Admin only)
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    if (!global.isDbConnected) {
      const users = mockUsers.map(u => ({
        id: u._id || u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        loyaltyPoints: u.loyaltyPoints,
        coupons: u.coupons,
        role: u.role
      }));
      return res.status(200).json(users);
    }

    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    const formatted = users.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      loyaltyPoints: u.loyaltyPoints,
      coupons: u.coupons,
      role: u.role
    }));
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users: ' + error.message });
  }
});

// Update user role (Admin only)
router.patch('/users/:id/role', authenticateToken, isAdmin, async (req, res) => {
  const { role } = req.body;
  if (!role || !['admin', 'customer'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified' });
  }

  try {
    if (!global.isDbConnected) {
      const user = mockUsers.find(u => u._id === req.params.id || u.id === req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      user.role = role;
      return res.status(200).json({
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        loyaltyPoints: user.loyaltyPoints,
        coupons: user.coupons,
        role: user.role
      });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      loyaltyPoints: user.loyaltyPoints,
      coupons: user.coupons,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role: ' + error.message });
  }
});

// Update user loyalty points (Admin only)
router.patch('/users/:id/points', authenticateToken, isAdmin, async (req, res) => {
  const points = Number(req.body.loyaltyPoints);
  if (isNaN(points) || points < 0) {
    return res.status(400).json({ message: 'Invalid loyalty points specified' });
  }

  try {
    if (!global.isDbConnected) {
      const user = mockUsers.find(u => u._id === req.params.id || u.id === req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      user.loyaltyPoints = points;
      return res.status(200).json({
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        loyaltyPoints: user.loyaltyPoints,
        coupons: user.coupons,
        role: user.role
      });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { loyaltyPoints: points }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      loyaltyPoints: user.loyaltyPoints,
      coupons: user.coupons,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user points: ' + error.message });
  }
});

// Delete user profile (Admin only)
router.delete('/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    if (!global.isDbConnected) {
      const index = mockUsers.findIndex(u => u._id === req.params.id || u.id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'User not found' });
      mockUsers.splice(index, 1);
      return res.status(200).json({ message: 'User deleted successfully', id: req.params.id });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user: ' + error.message });
  }
});

export default router; // Trigger nodemon restart for loaded env variables
