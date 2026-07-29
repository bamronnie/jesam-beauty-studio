import Product from '../models/Product.js';
import Service from '../models/Service.js';
import fs from 'fs';
import path from 'path';

let defaultProducts = [];
try {
  const jsonPath = path.join(process.cwd(), '..', 'scripts', 'jesam_products.json');
  if (fs.existsSync(jsonPath)) {
    const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    defaultProducts = raw.map(({ _id, ...rest }) => rest);
  }
} catch (e) {
  console.warn('Could not load jesam_products.json in seedData:', e.message);
}

if (defaultProducts.length === 0) {
  defaultProducts = [
    {
      name: '26" Bone Straight HD Lace Wig',
      price: 195000,
      oldPrice: 220000,
      category: 'wigs',
      tag: 'Best Seller',
      img: '/videos/jesam-p1-poster.jpg',
      poster: '/videos/jesam-p1-poster.jpg',
      video: '/videos/jesam-p1.mp4',
      desc: '100% Raw Virgin Human Hair bone straight wig with customized 13x4 HD Swiss Lace. Pre-plucked hairline and pre-bleached knots for an invisible melt.',
      rating: 4.8,
      reviews: 12
    }
  ];
}

const defaultServices = [
  { title: 'HD Lace Wig Installation', desc: 'Flawless glueless or glue-based wig install with customized bleaching, plucking, and styled finish.', duration: '120 mins', price: 25000, category: 'wigs' },
  { title: 'Wig Revamping & Customization', desc: 'De-tangling, deep washing, conditioning treatment, elastic band replacement, and re-styling (curls or bone straight).', duration: '180 mins', price: 15000, category: 'wigs' },
  { title: 'Knotless Goddess Braids (Medium)', desc: 'Beautiful, light-weight knotless braids finished with high-quality curly curls for a goddess finish.', duration: '240 mins', price: 35000, category: 'braids' },
  { title: 'Stitch Braids (6-8 Feed-in)', desc: 'Clean, precise stitch braiding lines using high-quality hair wax and sleek hair extensions.', duration: '90 mins', price: 18000, category: 'braids' },
  { title: 'Traditional Sew-In Weave', desc: 'Full hair braiding foundation, net application, weft sew-in, and professional leave-out blending/cutting.', duration: '150 mins', price: 20000, category: 'extensions' },
  { title: 'Ponytail Styling (Sleek High)', desc: 'Sleek gel-up ponytail styled to perfection, utilizing hair wefts or extensions for length.', duration: '60 mins', price: 12000, category: 'extensions' },
  { title: 'Silk Press & Treatment', desc: 'Deep hydration steam therapy, blow dry, and precision ceramic silk press finish for natural hair.', duration: '90 mins', price: 15000, category: 'natural' },
  { title: 'Natural Twists / Loc Maintenance', desc: 'Professional double-strand finger twists or starter loc retwists using organic locking gels.', duration: '120 mins', price: 18000, category: 'natural' }
];

export const seedDatabase = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(defaultProducts);
      console.log('🌱 Successfully seeded default products catalog.');
    }

    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      await Service.insertMany(defaultServices);
      console.log('🌱 Successfully seeded default styling services menu.');
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};
