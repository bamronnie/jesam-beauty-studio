import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { mockUsers } from '../utils/mockDb.js';

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!global.isDbConnected) {
      const user = mockUsers.find(u => u._id === decoded.id);
      if (!user) {
        return res.status(404).json({ message: 'User session not found' });
      }
      req.user = user;
      return next();
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User session not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired session token' });
  }
}

export function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Administrative access required' });
  }
}
