import bcrypt from 'bcryptjs';

export const mockProducts = [
  {
    _id: 'jesam-p1',
    id: 'jesam-p1',
    name: '26" Bone Straight HD Lace Wig',
    price: 195000,
    oldPrice: 220000,
    category: 'wigs',
    tag: 'Best Seller',
    img: '/videos/jesam-p1-img1.jpg',
    poster: '/videos/jesam-p1-img1.jpg',
    images: [
      '/videos/jesam-p1-img1.jpg',
      '/videos/jesam-p1-img2.jpg',
      '/videos/jesam-p1-img3.jpg',
      '/videos/jesam-p1-img4.jpg',
      '/videos/jesam-p1-poster.jpg'
    ],
    video: '/videos/jesam-p1.mp4',
    desc: '100% Raw Virgin Human Hair bone straight wig with customized 13x4 HD Swiss Lace. Pre-plucked hairline and pre-bleached knots for an invisible melt.',
    rating: 4.8,
    reviews: 12,
    reviewsList: []
  },
  {
    _id: 'jesam-p2',
    id: 'jesam-p2',
    name: '22" Deep Wave Glueless Wear & Go Wig',
    price: 165000,
    oldPrice: 185000,
    category: 'wigs',
    tag: 'Glueless',
    img: '/videos/jesam-p2-img1.jpg',
    poster: '/videos/jesam-p2-img1.jpg',
    images: [
      '/videos/jesam-p2-img1.jpg',
      '/videos/jesam-p2-img2.jpg',
      '/videos/jesam-p2-img3.jpg',
      '/videos/jesam-p2-img4.jpg',
      '/videos/jesam-p2-poster.jpg'
    ],
    video: '/videos/jesam-p2.mp4',
    desc: 'High density deep wave texture wig with pre-cut HD lace foundation and 3D elastic security strap. Pop it on in seconds with zero glue required.',
    rating: 4.9,
    reviews: 15,
    reviewsList: []
  },
  {
    _id: 'jesam-p3',
    id: 'jesam-p3',
    name: '18" HD Lace Front Curly Bouncy Wig',
    price: 140000,
    oldPrice: 160000,
    category: 'wigs',
    tag: 'New Arrival',
    img: '/videos/jesam-p3-img1.jpg',
    poster: '/videos/jesam-p3-img1.jpg',
    images: [
      '/videos/jesam-p3-img1.jpg',
      '/videos/jesam-p3-img2.jpg',
      '/videos/jesam-p3-img3.jpg',
      '/videos/jesam-p3-img4.jpg',
      '/videos/jesam-p3-poster.jpg'
    ],
    video: '/videos/jesam-p3.mp4',
    desc: 'Pre-plucked HD Swiss Lace front wig in bouncy natural curls. Retains curl pattern effortlessly and melts seamlessly into all skin tones.',
    rating: 5.0,
    reviews: 18,
    reviewsList: []
  },
  {
    _id: 'jesam-p4',
    id: 'jesam-p4',
    name: '24" Honey Blonde Highlighted Bob Wig',
    price: 175000,
    oldPrice: 195000,
    category: 'wigs',
    tag: 'Custom Color',
    img: '/videos/jesam-p4-img1.jpg',
    poster: '/videos/jesam-p4-img1.jpg',
    images: [
      '/videos/jesam-p4-img1.jpg',
      '/videos/jesam-p4-img2.jpg',
      '/videos/jesam-p4-img3.jpg',
      '/videos/jesam-p4-img4.jpg',
      '/videos/jesam-p4-poster.jpg'
    ],
    video: '/videos/jesam-p4.mp4',
    desc: 'Custom honey blonde multi-tonal highlighted wig with dark root depth. Crafted from double-drawn virgin human hair.',
    rating: 4.8,
    reviews: 21,
    reviewsList: []
  },
  {
    _id: 'jesam-p5',
    id: 'jesam-p5',
    name: '14" Sleek Blunt Cut Closure Bob Wig',
    price: 95000,
    oldPrice: 110000,
    category: 'wigs',
    tag: 'Classic Bob',
    img: '/videos/jesam-p5-img1.jpg',
    poster: '/videos/jesam-p5-img1.jpg',
    images: [
      '/videos/jesam-p5-img1.jpg',
      '/videos/jesam-p5-img2.jpg',
      '/videos/jesam-p5-img3.jpg',
      '/videos/jesam-p5-img4.jpg',
      '/videos/jesam-p5-poster.jpg'
    ],
    video: '/videos/jesam-p5.mp4',
    desc: 'Sleek blunt-cut bob wig featuring a 5x5 HD closure. Lightweight, chic, and easy to maintain daily.',
    rating: 4.9,
    reviews: 24,
    reviewsList: []
  },
  {
    _id: 'jesam-p6',
    id: 'jesam-p6',
    name: '28" Super Long Bone Straight Frontal Wig',
    price: 230000,
    oldPrice: 250000,
    category: 'wigs',
    tag: 'Super Glam',
    img: '/videos/jesam-p6-img1.jpg',
    poster: '/videos/jesam-p6-img1.jpg',
    images: [
      '/videos/jesam-p6-img1.jpg',
      '/videos/jesam-p6-img2.jpg',
      '/videos/jesam-p6-img3.jpg',
      '/videos/jesam-p6-img4.jpg',
      '/videos/jesam-p6-poster.jpg'
    ],
    video: '/videos/jesam-p6.mp4',
    desc: 'Ultra-long 28 inch bone straight unit with full 180% density ends. Silky smooth luster that holds heat press beautifully up to 450°F.',
    rating: 5.0,
    reviews: 27,
    reviewsList: []
  },
  {
    _id: 'jesam-p7',
    id: 'jesam-p7',
    name: '20" Kinky Curly HD Glueless Wig',
    price: 155000,
    oldPrice: 170000,
    category: 'wigs',
    tag: 'Natural Look',
    img: '/videos/jesam-p7-img1.jpg',
    poster: '/videos/jesam-p7-img1.jpg',
    images: [
      '/videos/jesam-p7-img1.jpg',
      '/videos/jesam-p7-img2.jpg',
      '/videos/jesam-p7-img3.jpg',
      '/videos/jesam-p7-img4.jpg',
      '/videos/jesam-p7-poster.jpg'
    ],
    video: '/videos/jesam-p7.mp4',
    desc: 'Natural texture kinky curly wig matching afro-textured press out seamlessly. Glueless cap design with adjustable elastic strap.',
    rating: 4.8,
    reviews: 30,
    reviewsList: []
  },
  {
    _id: 'jesam-p8',
    id: 'jesam-p8',
    name: '3 Bundles Raw Virgin Straight Extensions',
    price: 120000,
    oldPrice: 135000,
    category: 'extensions',
    tag: 'Raw Bundles',
    img: '/videos/jesam-p8-img1.jpg',
    poster: '/videos/jesam-p8-img1.jpg',
    images: [
      '/videos/jesam-p8-img1.jpg',
      '/videos/jesam-p8-img2.jpg',
      '/videos/jesam-p8-img3.jpg',
      '/videos/jesam-p8-img4.jpg',
      '/videos/jesam-p8-poster.jpg'
    ],
    video: '/videos/jesam-p8.mp4',
    desc: 'Unprocessed raw human hair bundle deal. Thick double-drawn wefts with natural shine, available for dyeing and bleaching.',
    rating: 4.9,
    reviews: 33,
    reviewsList: []
  },
  {
    _id: 'jesam-p9',
    id: 'jesam-p9',
    name: '3 Bundles Deep Wave Raw Hair Package',
    price: 125000,
    oldPrice: 140000,
    category: 'extensions',
    tag: 'Deep Wave',
    img: '/videos/jesam-p9-img1.jpg',
    poster: '/videos/jesam-p9-img1.jpg',
    images: [
      '/videos/jesam-p9-img1.jpg',
      '/videos/jesam-p9-img2.jpg',
      '/videos/jesam-p9-img3.jpg',
      '/videos/jesam-p9-img4.jpg',
      '/videos/jesam-p9-poster.jpg'
    ],
    video: '/videos/jesam-p9.mp4',
    desc: 'Three bundles of raw human hair extensions in soft deep wave pattern. Full volume from roots to tips.',
    rating: 5.0,
    reviews: 36,
    reviewsList: []
  },
  {
    _id: 'jesam-p10',
    id: 'jesam-p10',
    name: '24" Water Wave HD Lace Frontal Wig',
    price: 180000,
    oldPrice: 200000,
    category: 'wigs',
    tag: 'Vacation Vibe',
    img: '/videos/jesam-p10-img1.jpg',
    poster: '/videos/jesam-p10-img1.jpg',
    images: [
      '/videos/jesam-p10-img1.jpg',
      '/videos/jesam-p10-img2.jpg',
      '/videos/jesam-p10-img3.jpg',
      '/videos/jesam-p10-img4.jpg',
      '/videos/jesam-p10-poster.jpg'
    ],
    video: '/videos/jesam-p10.mp4',
    desc: 'Wavy wet-and-wavy style wig featuring 13x4 HD lace. Hydrate with water and leave-in conditioner for instant curl pop.',
    rating: 4.8,
    reviews: 39,
    reviewsList: []
  },
  {
    _id: 'jesam-p16',
    id: 'jesam-p16',
    name: 'Jesam Hair Silk Serum & Oil (Care)',
    price: 8500,
    oldPrice: 10000,
    category: 'care',
    tag: 'Organic Care',
    img: '/videos/jesam-p16-img1.jpg',
    poster: '/videos/jesam-p16-img1.jpg',
    images: [
      '/videos/jesam-p16-img1.jpg',
      '/videos/jesam-p16-img2.jpg',
      '/videos/jesam-p16-img3.jpg',
      '/videos/jesam-p16-img4.jpg',
      '/videos/jesam-p16-poster.jpg'
    ],
    video: '/videos/jesam-p16.mp4',
    desc: 'Nourishing heat protectant serum formulated with argan & jojoba oil to seal cuticles and protect raw hair bundles.',
    rating: 4.9,
    reviews: 42,
    reviewsList: []
  },
  {
    _id: 'jesam-p17',
    id: 'jesam-p17',
    name: 'Edge Control Wax & Melting Band Set',
    price: 6500,
    oldPrice: 8000,
    category: 'care',
    tag: 'Perfect Lay',
    img: '/videos/jesam-p17-img1.jpg',
    poster: '/videos/jesam-p17-img1.jpg',
    images: [
      '/videos/jesam-p17-img1.jpg',
      '/videos/jesam-p17-img2.jpg',
      '/videos/jesam-p17-img3.jpg',
      '/videos/jesam-p17-img4.jpg',
      '/videos/jesam-p17-poster.jpg'
    ],
    video: '/videos/jesam-p17.mp4',
    desc: 'Extra-hold edge control wax paired with a Jesam Beauty satin lace melting band for seamless baby hair lays.',
    rating: 5.0,
    reviews: 45,
    reviewsList: []
  }
];

export const mockServices = [
  { _id: 'mock-srv1', title: 'HD Lace Wig Installation', desc: 'Flawless glueless or glue-based wig install with customized bleaching, plucking, and styled finish.', duration: '120 mins', price: 25000, category: 'wigs' },
  { _id: 'mock-srv2', title: 'Wig Revamping & Customization', desc: 'De-tangling, deep washing, conditioning treatment, elastic band replacement, and re-styling (curls or bone straight).', duration: '180 mins', price: 15000, category: 'wigs' },
  { _id: 'mock-srv3', title: 'Knotless Goddess Braids', desc: 'Lightweight knotless braids styled with boho curly human hair ends.', duration: '240 mins', price: 35000, category: 'braids' }
];

export const mockBookings = [];
export const mockUsers = [];
