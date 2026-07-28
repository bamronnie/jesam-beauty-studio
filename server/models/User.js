import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  loyaltyPoints: {
    type: Number,
    default: 100 // 100 welcome loyalty points!
  },
  coupons: {
    type: [String],
    default: ['WELCOME10', 'JESAMVIP', 'FREECARE']
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
