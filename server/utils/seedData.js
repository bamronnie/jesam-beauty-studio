import Product from '../models/Product.js';
import Service from '../models/Service.js';

const defaultProducts = [
  {
    name: '24" Bone Straight Double Drawn Wig',
    price: 185000,
    oldPrice: 210000,
    category: 'wigs',
    tag: 'Best Seller',
    img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=500',
    video: '/videos/p1.mp4',
    poster: '/videos/p1-poster.jpg',
    desc: '100% Vietnamese Remy Human Hair. Super sleek, double-drawn for full density ends. Can be ironed, dyed, and washed. Average wig cap with adjustable bands.',
    rating: 4.9,
    reviews: 43
  },
  {
    name: '18" HD Lace Front Curly Wig',
    price: 140000,
    oldPrice: 155000,
    category: 'wigs',
    tag: 'New Drop',
    img: 'https://images.unsplash.com/photo-1579613832125-5d34a13feb2a?q=80&w=500',
    video: '/videos/p2.mp4',
    poster: '/videos/p2-poster.jpg',
    desc: 'High-density curly lace front wig. Pre-plucked HD Swiss Lace for an invisible hairline finish. Bounces beautifully and retains curls effortlessly.',
    rating: 4.8,
    reviews: 29
  },
  {
    name: '3 Bundles Raw Virgin Hair Extensions',
    price: 120000,
    oldPrice: 0,
    category: 'extensions',
    tag: 'Raw Bundles',
    img: 'https://images.unsplash.com/photo-1605497746444-ac9dbd39d675?q=80&w=500',
    video: '/videos/p3.mp4',
    poster: '/videos/p3-poster.jpg',
    desc: 'High quality bundles of unprocessed virgin hair. Thick wefts, natural luster, available in straight, body wave, and deep wave packages.',
    rating: 5.0,
    reviews: 18
  },
  {
    name: 'Jesam Hair Silk Serum & Oil',
    price: 8500,
    oldPrice: 10000,
    category: 'care',
    tag: 'Organic Care',
    img: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=500',
    video: '/videos/p4.mp4',
    poster: '/videos/p4-poster.jpg',
    desc: 'Protects extensions and wigs from heat styling. Locks in moisture, prevents flyaways, and keeps hair smooth and shiny without weighing it down.',
    rating: 4.7,
    reviews: 52
  },
  {
    name: 'Professional Tourmaline Flat Iron',
    price: 45000,
    oldPrice: 50000,
    category: 'tools',
    tag: 'Hot Item',
    img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=500',
    video: '/videos/p5.mp4',
    poster: '/videos/p5-poster.jpg',
    desc: 'Floating tourmaline plates optimized for styling straight bundles and sealing cuticle fibers. Temperature locks up to 450°F.',
    rating: 4.8,
    reviews: 15
  },
  {
    name: '14" Honey Blonde Highlighted Bob Wig',
    price: 95000,
    oldPrice: 110000,
    category: 'wigs',
    tag: 'Chic Style',
    img: 'https://images.unsplash.com/photo-1605497746444-ac9dbd39d675?q=80&w=500',
    video: '/videos/p6.mp4',
    poster: '/videos/p6-poster.jpg',
    desc: 'Chic blunt cut bob wig with custom honey blonde highlights and dark roots. 100% human hair closure unit.',
    rating: 4.9,
    reviews: 21
  },
  {
    name: '22" Deep Wave Glueless Wear & Go Wig',
    price: 165000,
    oldPrice: 180000,
    category: 'wigs',
    tag: 'Beginner Friendly',
    img: 'https://images.unsplash.com/photo-1579613832125-5d34a13feb2a?q=80&w=500',
    video: '/videos/p7.mp4',
    poster: '/videos/p7-poster.jpg',
    desc: 'High density glueless wig featuring deep wave texture. Zero glue needed, pre-cut lace with adjustable elastic 3D strap.',
    rating: 4.8,
    reviews: 35
  },
  {
    name: '26" HD Lace Frontal Body Wave Wig',
    price: 195000,
    oldPrice: 220000,
    category: 'wigs',
    tag: 'Luxury HD',
    img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=500',
    video: '/videos/p8.mp4',
    poster: '/videos/p8-poster.jpg',
    desc: 'Pre-plucked HD Swiss Lace frontal wig with elegant body wave flows. Melts seamlessly into all skin tones.',
    rating: 5.0,
    reviews: 14
  },
  {
    name: '12" Sleek Blunt Cut Closure Bob Wig',
    price: 85000,
    oldPrice: 95000,
    category: 'wigs',
    tag: 'Classic Bob',
    img: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=500',
    video: '/videos/p9.mp4',
    poster: '/videos/p9-poster.jpg',
    desc: 'Classic, sleek blunt cut closure bob wig. Easy styling, lightweight, and perfect for hot weather.',
    rating: 4.7,
    reviews: 19
  },
  {
    name: '3 Bundles Curly Wave Extensions',
    price: 110000,
    oldPrice: 0,
    category: 'extensions',
    tag: 'Soft Waves',
    img: 'https://images.unsplash.com/photo-1605497746444-ac9dbd39d675?q=80&w=500',
    video: '/videos/p10.mp4',
    poster: '/videos/p10-poster.jpg',
    desc: 'Three bundles of raw human hair extensions in soft curly wave texture. Can be dyed, bleached, and styled.',
    rating: 4.9,
    reviews: 8
  },
  {
    name: 'Organic Wig Washing & Conditioner Kit',
    price: 15000,
    oldPrice: 18000,
    category: 'care',
    tag: 'Essentials',
    img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=500',
    video: '/videos/p11.mp4',
    poster: '/videos/p11-poster.jpg',
    desc: 'Sulfate-free hydrating shampoo and conditioner set formulated specifically to wash and nourish human hair wigs.',
    rating: 4.8,
    reviews: 40
  },
  {
    name: 'Edge Control Wax & Melting Band Set',
    price: 6500,
    oldPrice: 8000,
    category: 'care',
    tag: 'Perfect Lay',
    img: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=500',
    video: '/videos/p12.mp4',
    poster: '/videos/p12-poster.jpg',
    desc: 'Extra-hold edge wax paired with a Jesam Beauty satin lace melting band to lay your baby hairs and secure your wig install.',
    rating: 4.9,
    reviews: 67
  }
];

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

export async function seedDatabase() {
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
}
