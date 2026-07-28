import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  oldPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['wigs', 'extensions', 'care', 'tools']
  },
  tag: {
    type: String,
    default: null
  },
  img: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  video: {
    type: String,
    default: '/8431525-uhd_4096_2160_25fps.mp4'
  },
  poster: {
    type: String,
    default: '/videos/placeholder-poster.jpg'
  },
  desc: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 1.0,
    max: 5.0
  },
  reviews: {
    type: Number,
    default: 1
  },
  reviewsList: {
    type: [{
      username: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, required: true },
      date: { type: Date, default: Date.now }
    }],
    default: []
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;
