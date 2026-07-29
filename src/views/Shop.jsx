import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, SlidersHorizontal, Plus, Minus, Trash2, Eye, X, Star, ChevronLeft, ChevronRight, Heart, Share2, Play } from 'lucide-react';
import LengthGuideModal from '../components/LengthGuideModal';
import api from '../services/api';

export default function Shop({ 
  cart, 
  addToCart, 
  removeFromCart, 
  updateCartQuantity, 
  isCartOpen, 
  toggleCart, 
  onCheckout, 
  initialProducts = [],
  searchTerm,
  setSearchTerm,
  currentUser,
  showNotification
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(250000);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Review form states
  const [formRating, setFormRating] = useState(5);
  const [formUsername, setFormUsername] = useState('');
  const [formComment, setFormComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Quick View State
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedLength, setSelectedLength] = useState('');
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [isLengthGuideOpen, setIsLengthGuideOpen] = useState(false);
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('jesam_wishlist') || '[]');
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('jesam_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Gallery enrichment helper
  const getProductGallery = (product) => {
    if (!product) return [];
    const gallery = [];
    if (product.video) {
      gallery.push({ type: 'video', url: product.video });
    }
    
    // Prioritize the actual product.images list if it exists and is populated
    if (Array.isArray(product.images) && product.images.length > 0) {
      product.images.forEach(imgUrl => {
        if (imgUrl) {
          gallery.push({ type: 'image', url: imgUrl });
        }
      });
    } else {
      // Fallback to primary cover image and category mocks
      if (product.img) {
        gallery.push({ type: 'image', url: product.img });
      }
      if (product.category === 'wigs') {
        gallery.push({ type: 'image', url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=500' });
        gallery.push({ type: 'image', url: 'https://images.unsplash.com/photo-1579613832125-5d34a13feb2a?q=80&w=500' });
        gallery.push({ type: 'image', url: 'https://images.unsplash.com/photo-1605497746444-ac9dbd39d675?q=80&w=500' });
      } else if (product.category === 'extensions') {
        gallery.push({ type: 'image', url: 'https://images.unsplash.com/photo-1605497746444-ac9dbd39d675?q=80&w=500' });
        gallery.push({ type: 'image', url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=500' });
      } else if (product.category === 'care') {
        gallery.push({ type: 'image', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=500' });
        gallery.push({ type: 'image', url: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=500' });
      } else {
        gallery.push({ type: 'image', url: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=500' });
        gallery.push({ type: 'image', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=500' });
      }
    }
    return gallery;
  };

  // Options provider helper
  const getProductOptions = (product) => {
    if (!product) return { sizes: [], colors: [], lengths: [] };
    if (product.category === 'wigs') {
      return {
        sizes: [
          { label: 'Fit All Head Sizes', value: '7x5-100% Human Hair-With Invisible Drawstring' },
          { label: 'Seamless Melt', value: '13x4 HD Frontal Wig - Hand-Tied Swiss Lace' },
          { label: 'Beginner Friendly', value: '5x5 HD Glueless Closure Wig' }
        ],
        colors: [
          { label: 'Vacation Glow', value: '150%-Black to Chestnut Brown' },
          { label: 'Classic Sleek', value: '180%-Natural Black #1B' },
          { label: 'Chic Highlights', value: '150%-Honey Blonde Highlight' }
        ],
        lengths: ['16', '18', '20']
      };
    } else if (product.category === 'extensions') {
      return {
        sizes: [
          { label: 'Full Density Bundle', value: 'Single Weft Bundle (100g)' },
          { label: 'Standard Package', value: '3 Bundles Deal' },
          { label: 'Ultimate Volume Package', value: '4 Bundles Deal' }
        ],
        colors: [
          { label: 'Natural Shine', value: 'Natural Black #1B' },
          { label: 'Deep Gloss', value: 'Jet Black #1' },
          { label: 'Warm Tone', value: 'Chocolate Brown #4' }
        ],
        lengths: ['16', '18', '20', '22', '24']
      };
    } else if (product.category === 'care') {
      return {
        sizes: [
          { label: 'Travel Size', value: '100ml / 3.4 oz' },
          { label: 'Standard Size', value: '250ml / 8.5 oz' },
          { label: 'Salon Size', value: '500ml / 16.9 oz' }
        ],
        colors: [],
        lengths: []
      };
    } else {
      return {
        sizes: [
          { label: 'Slim Plate', value: '1-inch Tourmaline Plates' },
          { label: 'Wide Plate', value: '1.5-inch Tourmaline Plates' }
        ],
        colors: [
          { label: 'Signature Finish', value: 'Matte Charcoal & Gold' },
          { label: 'Vibrant Finish', value: 'Metallic Hot Pink' }
        ],
        lengths: []
      };
    }
  };

  useEffect(() => {
    if (selectedProduct) {
      const gallery = getProductGallery(selectedProduct);
      // Try to focus image first if available, otherwise 0
      const imgIdx = gallery.findIndex(g => g.type === 'image');
      setActiveGalleryIdx(imgIdx >= 0 ? imgIdx : 0);
      
      const opts = getProductOptions(selectedProduct);
      setSelectedSize(opts.sizes[0]?.value || '');
      setSelectedColor(opts.colors[0]?.value || '');
      setSelectedLength(opts.lengths[0] || '');
    }
  }, [selectedProduct]);

  // Tabbed detail state inside the quick zoom modal
  const [activeDetailTab, setActiveDetailTab] = useState('specs');
  const [hoveredProductId, setHoveredProductId] = useState(null);

  const defaultProducts = [
    {
      id: 'p1',
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
      id: 'p2',
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
      id: 'p3',
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
      id: 'p4',
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
      id: 'p5',
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
      id: 'p6',
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
      id: 'p7',
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
      id: 'p8',
      name: '26" HD Lace Frontal Body Wave Wig',
      price: 195000,
      oldPrice: 220000,
      category: 'wigs',
      tag: 'HD Swiss',
      img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=500',
      video: '/videos/p8.mp4',
      poster: '/videos/p8-poster.jpg',
      desc: 'Pre-plucked HD Swiss Lace frontal wig with elegant body wave flows. Melts seamlessly into all skin tones.',
      rating: 5.0,
      reviews: 14
    },
    {
      id: 'p9',
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
      id: 'p10',
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
      id: 'p11',
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
      id: 'p12',
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

  // Merge default products with admin dashboard additions
  const products = initialProducts.length > 0 ? initialProducts : defaultProducts;

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'wigs', label: 'Custom Wigs' },
    { id: 'extensions', label: 'Wefts & Bundles' },
    { id: 'care', label: 'Hair Care' },
    { id: 'tools', label: 'Styling Tools' }
  ];

  // Filters logic
  const filteredProducts = products.filter(prod => {
    const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prod.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' ? true : prod.category === activeCategory;
    const matchesPrice = prod.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  });



  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!formComment.trim()) return;
    
    const reviewerName = currentUser ? currentUser.name : formUsername.trim();
    if (!reviewerName) {
      showNotification('Please provide a name.', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      const updatedProduct = await api.addProductReview(selectedProduct._id || selectedProduct.id, {
        username: reviewerName,
        rating: formRating,
        comment: formComment.trim()
      });

      // Update local quickview product state
      setSelectedProduct(updatedProduct);
      
      // Update this product inside products list to keep Shop view metrics synced
      const idx = initialProducts.findIndex(p => (p._id || p.id) === (selectedProduct._id || selectedProduct.id));
      if (idx !== -1) {
        initialProducts[idx] = updatedProduct;
      }
      
      // Reset form fields
      setFormComment('');
      setFormRating(5);
      if (!currentUser) setFormUsername('');
      showNotification('Thank you! Review submitted successfully.', 'success');
    } catch (err) {
      showNotification('Error adding review: ' + err.message, 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <section 
      style={{
        background: 'var(--burgundy-dark)',
        borderTop: '1px solid var(--border-light)',
        paddingTop: '9.5rem'
      }}
      id="shop-section"
    >
      <div className="container">
        {/* Section Title */}
        <div className="section-header">
          <span className="section-tag">Jesam Collection</span>
          <h2 className="section-title">Shop Hair & Products</h2>
          <p className="section-desc">
            Explore our curated collections of Remy wigs, raw bundles, and essential care products.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
            marginBottom: '3rem',
            padding: '1.25rem',
            background: 'var(--burgundy-deep)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--border-radius-md)'
          }}
          id="shop-filters-bar"
        >
          {/* Search bar */}
          <div style={{ position: 'relative', minWidth: '240px', flex: 1 }}>
            <Search 
              size={18} 
              style={{ 
                position: 'absolute', 
                left: '1rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'var(--gold-primary)' 
              }} 
            />
            <input
              type="text"
              placeholder="Search product catalog..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{
                width: '100%',
                paddingLeft: '2.8rem',
                paddingTop: '0.6rem',
                paddingBottom: '0.6rem',
                fontSize: '0.85rem'
              }}
              id="shop-search"
            />
          </div>

          {/* Categories select tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} id="shop-category-tabs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  background: activeCategory === cat.id ? 'var(--gold-primary)' : 'rgba(18, 1, 4, 0.6)',
                  border: '1px solid',
                  borderColor: activeCategory === cat.id ? 'var(--gold-primary)' : 'var(--border-light)',
                  color: activeCategory === cat.id ? 'var(--burgundy-dark)' : 'var(--cream-primary)',
                  padding: '0.5rem 1rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
                id={`shop-tab-${cat.id}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Price slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem' }} id="shop-price-slider">
            <SlidersHorizontal size={14} style={{ color: 'var(--gold-primary)' }} />
            <span>Max: <strong>₦{maxPrice.toLocaleString()}</strong></span>
            <input
              type="range"
              min="5000"
              max="250000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ accentColor: 'var(--gold-primary)', width: '100px', cursor: 'pointer' }}
              id="shop-price-range"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid-cols-3" id="shop-products-grid">
          {filteredProducts.map((prod) => (
            <div 
              key={prod._id || prod.id} 
              className="glass-card" 
              style={{ 
                padding: '1.25rem', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                position: 'relative'
              }}
              onMouseEnter={() => setHoveredProductId(prod._id || prod.id)}
              onMouseLeave={() => setHoveredProductId(null)}
            >
              {/* PIP Image & Video Box */}
              <div 
                className="pip-card-image-container" 
                onClick={() => setSelectedProduct(prod)} 
                style={{ cursor: 'pointer' }}
                title="Click to view product details"
              >
                <img 
                  src={prod.img} 
                  alt={prod.name} 
                  className="pip-main-img"
                />

                {/* Picture-in-Picture Video Preview Box */}
                {prod.video && (
                  <div className="pip-video-badge">
                    {hoveredProductId === (prod._id || prod.id) ? (
                      <>
                        <div className="pip-play-tag">
                          <span className="pip-play-icon-pulse"></span> PLAYING
                        </div>
                        <video
                          src={prod.video}
                          poster={prod.poster || prod.img}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="pip-video-player"
                        />
                      </>
                    ) : (
                      <>
                        <div className="pip-play-tag">
                          <Play size={10} style={{ fill: 'currentColor' }} /> VIDEO
                        </div>
                        <img
                          src={prod.poster || prod.img}
                          alt="Video Preview"
                          className="pip-video-player"
                        />
                      </>
                    )}
                  </div>
                )}
                
                {/* Floating badge */}
                {prod.tag && (
                  <span 
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      left: '0.75rem',
                      background: 'var(--gold-primary)',
                      color: 'var(--burgundy-dark)',
                      fontSize: '0.65rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '2px',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {prod.tag}
                  </span>
                )}

                {/* Quick preview overlay */}
                <button
                  onClick={() => setSelectedProduct(prod)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    bottom: '0.75rem',
                    background: 'rgba(18,1,4,0.85)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--gold-primary)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  title="Quick View"
                >
                  <Eye size={16} />
                </button>
              </div>

              {/* Title & Info */}
              <div>
                <h3 
                  onClick={() => setSelectedProduct(prod)}
                  style={{ fontSize: '1.1rem', color: 'var(--cream-primary)', marginBottom: '0.5rem', minHeight: '44px', cursor: 'pointer' }}
                  title="Click to view details"
                >
                  {prod.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', color: 'var(--gold-primary)' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill={i < Math.floor(prod.rating) ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-cream-muted)' }}>({prod.reviews})</span>
                </div>
              </div>

              {/* Pricing & Add to Cart button */}
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(212, 175, 55, 0.08)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--cream-primary)' }}>
                      ₦{prod.price.toLocaleString()}
                    </span>
                    {prod.oldPrice > 0 && (
                      <span style={{ fontSize: '0.85rem', color: '#888888', textDecoration: 'line-through' }}>
                        ₦{prod.oldPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => addToCart(prod)}
                  className="btn btn-primary"
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.75rem',
                    borderRadius: '4px'
                  }}
                  id={`add-to-cart-${prod._id || prod.id}`}
                >
                  <ShoppingBag size={14} />
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Details Zoom Modal */}
      {selectedProduct && (() => {
        const gallery = getProductGallery(selectedProduct);
        const options = getProductOptions(selectedProduct);
        const activeMedia = gallery[activeGalleryIdx] || { type: 'image', url: selectedProduct.img };
        const discountPercent = selectedProduct.oldPrice > selectedProduct.price 
          ? Math.round(((selectedProduct.oldPrice - selectedProduct.price) / selectedProduct.oldPrice) * 100) 
          : 20;

        const handlePrevGallery = () => {
          setActiveGalleryIdx((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
        };

        const handleNextGallery = () => {
          setActiveGalleryIdx((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
        };

        const handleToggleWishlist = () => {
          const productId = selectedProduct._id || selectedProduct.id;
          if (wishlist.includes(productId)) {
            setWishlist(wishlist.filter(id => id !== productId));
            showNotification('Removed from wishlist', 'info');
          } else {
            setWishlist([...wishlist, productId]);
            showNotification('Added to wishlist!', 'success');
          }
        };

        const handleShareProduct = () => {
          const shareText = `Check out ${selectedProduct.name} at Jesam Beauty Studio!`;
          const shareUrl = window.location.href;
          if (navigator.clipboard) {
            navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
              .then(() => showNotification('Link copied to clipboard!', 'success'))
              .catch(() => showNotification('Failed to copy link', 'error'));
          } else {
            showNotification(`${shareText} ${shareUrl}`, 'info');
          }
        };

        const handleAddVariantToCart = () => {
          addToCart(selectedProduct, {
            size: selectedSize,
            color: selectedColor,
            length: selectedLength
          });
          setSelectedProduct(null);
        };

        const isFavorited = wishlist.includes(selectedProduct._id || selectedProduct.id);

        return (
          <div 
            className="modal-overlay" 
            style={{ display: 'flex' }} 
            id="product-detail-modal"
            onClick={() => setSelectedProduct(null)}
          >
            <div className="modal-content quickview-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedProduct(null)} style={{ color: '#1a0f0b' }}>
                <X size={22} />
              </button>
              
              <div className="quickview-grid" id="product-detail-grid">
                {/* Left Column: Gallery */}
                <div className="quickview-gallery">
                  {/* Vertical Thumbnails */}
                  <div className="quickview-thumbnails">
                    {gallery.map((media, idx) => (
                      <div
                        key={idx}
                        className={`quickview-thumbnail-item ${idx === activeGalleryIdx ? 'active' : ''}`}
                        onClick={() => setActiveGalleryIdx(idx)}
                      >
                        {media.type === 'video' ? (
                          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
                            <video src={media.url} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} muted playsInline />
                            <Play size={16} style={{ position: 'absolute', color: '#fff', zIndex: 2 }} />
                          </div>
                        ) : (
                          <img src={media.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Main Viewport */}
                  <div className="quickview-viewport">
                    {/* Discount Badge */}
                    <span className="quickview-badge-discount">-{discountPercent}%</span>

                    {/* Page Index Badge */}
                    <span className="quickview-badge-index">{activeGalleryIdx + 1} / {gallery.length}</span>

                    {/* Gallery Navigation Arrows */}
                    {gallery.length > 1 && (
                      <>
                        <button className="quickview-arrow prev" onClick={handlePrevGallery}>
                          <ChevronLeft size={18} />
                        </button>
                        <button className="quickview-arrow next" onClick={handleNextGallery}>
                          <ChevronRight size={18} />
                        </button>
                      </>
                    )}

                    {/* Wishlist & Share action overlay on main image */}
                    <div className="quickview-action-container">
                      <button 
                        className={`quickview-action-btn ${isFavorited ? 'active' : ''}`}
                        onClick={handleToggleWishlist}
                        title="Add to Wishlist"
                      >
                        <Heart size={18} fill={isFavorited ? '#ff40cc' : 'none'} style={{ color: isFavorited ? '#ff40cc' : 'currentColor' }} />
                      </button>
                      <button 
                        className="quickview-action-btn"
                        onClick={handleShareProduct}
                        title="Share Product"
                      >
                        <Share2 size={18} />
                      </button>
                    </div>

                    {/* Active Media Renders */}
                    {activeMedia.type === 'video' ? (
                      <video
                        src={activeMedia.url}
                        poster={selectedProduct.poster || selectedProduct.img}
                        preload="metadata"
                        autoPlay
                        loop
                        muted
                        playsInline
                        controls
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <img
                        src={activeMedia.url}
                        alt={selectedProduct.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                  </div>
                </div>

                {/* Right Column: Details & Selectors */}
                <div className="quickview-details">
                  <div>
                    {/* Category tag */}
                    <span className="badge badge-gold" style={{ marginBottom: '0.5rem', background: '#fff9e6', border: '1px solid #ffd880', color: '#b38600' }}>
                      {selectedProduct.category}
                    </span>

                    {/* Product Name */}
                    <h2 style={{ fontSize: '1.35rem', color: '#1a0f0b', fontWeight: 'bold', marginBottom: '0.75rem', lineHeight: '1.3', fontFamily: 'var(--font-sans)' }}>
                      {selectedProduct.name}
                    </h2>

                    {/* Stars & Reviews summary count */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', color: '#ffb300', gap: '2px' }}>
                        {Array.from({ length: 5 }).map((_, i) => {
                          const fill = i < Math.round(selectedProduct.rating || 5);
                          return (
                            <span key={i} style={{ fontSize: '1rem', color: fill ? '#ffb300' : '#d1d1d1', lineHeight: 1 }}>★</span>
                          );
                        })}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#666666', fontWeight: 500 }}>
                        {selectedProduct.rating || '5.0'} ({selectedProduct.reviews || 0} customer reviews)
                      </span>
                    </div>

                    {/* Pricing */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1a0f0b' }}>
                        ₦{selectedProduct.price.toLocaleString()}
                      </span>
                      {selectedProduct.oldPrice > 0 ? (
                        <span style={{ fontSize: '1.1rem', color: '#888888', textDecoration: 'line-through' }}>
                          ₦{selectedProduct.oldPrice.toLocaleString()}
                        </span>
                      ) : (
                        <span style={{ fontSize: '1.1rem', color: '#888888', textDecoration: 'line-through' }}>
                          ₦{(selectedProduct.price * 1.25).toLocaleString()}
                        </span>
                      )}
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid #eae0d3', marginBottom: '1.25rem' }} />

                    {/* Option Selectors */}
                    <div className="option-select-container">
                      {/* Lace Size Option */}
                      {options.sizes.length > 0 && (
                        <div className="option-group">
                          <label className="option-group-label">
                            {selectedProduct.category === 'wigs' ? 'Lace Size *' : selectedProduct.category === 'extensions' ? 'Package *' : selectedProduct.category === 'care' ? 'Bottle Size *' : 'Plate Size *'}
                          </label>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {options.sizes.map((sz, idx) => (
                              <div
                                key={idx}
                                className={`option-select-box ${selectedSize === sz.value ? 'selected' : ''}`}
                                onClick={() => setSelectedSize(sz.value)}
                              >
                                {selectedSize === sz.value && sz.label && (
                                  <span className="box-badge">{sz.label}</span>
                                )}
                                {sz.value}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Color Option */}
                      {options.colors.length > 0 && (
                        <div className="option-group">
                          <label className="option-group-label">Color *</label>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {options.colors.map((cl, idx) => (
                              <div
                                key={idx}
                                className={`option-select-box ${selectedColor === cl.value ? 'selected' : ''}`}
                                onClick={() => setSelectedColor(cl.value)}
                              >
                                {selectedColor === cl.value && cl.label && (
                                  <span className="box-badge">{cl.label}</span>
                                )}
                                {cl.value}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Hair Length Option */}
                      {options.lengths.length > 0 && (
                        <div className="option-group">
                          <div className="option-group-header">
                            <label className="option-group-label">Hair Length/inch *</label>
                            <span className="option-guide-link" onClick={() => setIsLengthGuideOpen(true)}>Guide</span>
                          </div>
                          <div className="length-options-grid">
                            {options.lengths.map((lg) => (
                              <button
                                key={lg}
                                className={`length-btn ${selectedLength === lg ? 'selected' : ''}`}
                                onClick={() => setSelectedLength(lg)}
                              >
                                {lg}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add to Bag and payments buttons */}
                  <div style={{ marginTop: '1.5rem' }}>
                    <button
                      onClick={handleAddVariantToCart}
                      className="btn btn-hotpink"
                      id="modal-add-to-cart"
                      style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <ShoppingBag size={18} />
                      Add to bag
                    </button>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button className="btn-afterpay" onClick={handleAddVariantToCart}>
                        <span style={{ color: '#00ebe0', marginRight: '0.25rem' }}>⚡</span> Afterpay
                      </button>
                      <button className="btn-paypal" onClick={handleAddVariantToCart}>
                        <span style={{ fontWeight: 'bold', fontStyle: 'italic' }}>PayPal</span>
                      </button>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid #eae0d3', margin: '2rem 0 1.5rem 0' }} />

                  {/* Reviews Section */}
                  <div id="product-reviews-section">
                    <h3 style={{ fontSize: '1.1rem', color: '#1a0f0b', fontFamily: 'var(--font-serif)', marginBottom: '1rem', fontWeight: 600 }}>
                      Customer Feedback
                    </h3>

                    {/* Review Form */}
                    <div style={{ background: '#FAF6EE', border: '1px solid #EAE0D3', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '0.85rem', color: '#1a0f0b', fontWeight: 'bold', margin: '0 0 0.75rem 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Write a Review
                      </h4>
                      <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', color: '#555555', fontWeight: 500 }}>Your Rating:</span>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            {[1, 2, 3, 4, 5].map((num) => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => setFormRating(num)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontSize: '1.2rem',
                                  color: num <= formRating ? '#ffb300' : '#d1d1d1',
                                  padding: 0,
                                  lineHeight: 1
                                }}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Name input (only show if guest) */}
                        {!currentUser && (
                          <input
                            type="text"
                            placeholder="Your Name (e.g. Chioma)"
                            value={formUsername}
                            onChange={(e) => setFormUsername(e.target.value)}
                            required
                            style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #D9D9D9', background: '#fff', color: '#333' }}
                          />
                        )}

                        <textarea
                          placeholder="What did you think of this hair? Share your experience..."
                          value={formComment}
                          onChange={(e) => setFormComment(e.target.value)}
                          required
                          rows="3"
                          style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #D9D9D9', background: '#fff', color: '#333', resize: 'vertical' }}
                        />

                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="btn btn-secondary"
                          style={{
                            padding: '0.5rem',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            background: 'var(--burgundy-primary)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: submittingReview ? 'default' : 'pointer'
                          }}
                        >
                          {submittingReview ? 'Submitting...' : 'Submit Review'}
                        </button>
                      </form>
                    </div>

                    {/* Review List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {(!selectedProduct.reviewsList || selectedProduct.reviewsList.length === 0) ? (
                        <p style={{ fontSize: '0.8rem', color: '#888888', fontStyle: 'italic', margin: '0' }}>
                          No customer reviews yet. Be the first to share your thoughts!
                        </p>
                      ) : (
                        selectedProduct.reviewsList.map((r, idx) => (
                          <div 
                            key={idx}
                            style={{
                              paddingBottom: '1rem',
                              borderBottom: idx === selectedProduct.reviewsList.length - 1 ? 'none' : '1px solid rgba(26, 15, 11, 0.05)'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                              <strong style={{ fontSize: '0.85rem', color: '#1a0f0b' }}>{r.username}</strong>
                              <span style={{ fontSize: '0.75rem', color: '#888888' }}>
                                {new Date(r.date).toLocaleDateString()}
                              </span>
                            </div>
                            
                            <div style={{ display: 'flex', color: '#ffb300', gap: '2px', marginBottom: '0.4rem' }}>
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} style={{ fontSize: '0.8rem', color: i < r.rating ? '#ffb300' : '#d1d1d1' }}>★</span>
                              ))}
                            </div>

                            <p style={{ fontSize: '0.8rem', color: '#555555', margin: 0, lineHeight: '1.4' }}>
                              {r.comment}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <LengthGuideModal 
        isOpen={isLengthGuideOpen} 
        onClose={() => setIsLengthGuideOpen(false)} 
      />

      {/* Styled Responsive Overlay Rules */}
      <style>{`
        @media (max-width: 900px) {
          #shop-filters-bar {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          #shop-products-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          #product-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          #product-detail-modal .modal-content {
            padding: 1.25rem !important;
          }
        }
      `}</style>
    </section>
  );
}
