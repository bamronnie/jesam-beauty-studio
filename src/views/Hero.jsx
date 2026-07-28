import React, { useState } from 'react';
import { ShoppingBag, Calendar, Star, Eye, Plus, ArrowRight, Zap, X } from 'lucide-react';

export default function Hero({ setActiveView, addToCart, products = [] }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('specs');
  const [hoveredProductId, setHoveredProductId] = useState(null);

  const categories = [
    { name: "Glueless Wigs", query: "curly", img: "https://images.unsplash.com/photo-1579613832125-5d34a13feb2a?q=80&w=150" },
    { name: "HD Lace Wigs", query: "straight", img: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=150" },
    { name: "Colored Wigs", query: "balayage", img: "https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=150" },
    { name: "Hair Bundles", query: "extensions", img: "https://images.unsplash.com/photo-1605497746444-ac9dbd39d675?q=80&w=150" },
    { name: "Lace Closures", query: "closure", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=150" }
  ];

  const handleCategoryClick = () => {
    setActiveView('shop');
    window.scrollTo(0, 0);
  };

  // Get best seller wig items (filtering products passed from App.jsx)
  const bestSellers = products.filter(p => p.category === 'wigs' || p.category === 'extensions').slice(0, 4);

  return (
    <div style={{ background: 'var(--burgundy-dark)', overflow: 'hidden' }}>
      
      {/* 1. HERO BRAND INTRO SECTION */}
      <section 
        style={{
          minHeight: '75vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '10.5rem',
          paddingBottom: '4rem',
          background: 'radial-gradient(circle at 50% 50%, var(--burgundy-medium) 0%, var(--burgundy-dark) 100%)',
          position: 'relative'
        }}
        id="hero-section"
      >
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          poster="/videos/hero-bg-poster.jpg"
          preload="metadata"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            opacity: 0.45,
            pointerEvents: 'none'
          }}
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Ambient Glow */}
        <div 
          style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(123, 1, 5, 0.04)',
            filter: 'blur(80px)',
            zIndex: 0,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none'
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.75rem', maxWidth: '800px', margin: '0 auto' }} className="animate-slide-up">
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="badge badge-gold" style={{ background: 'rgba(31, 17, 11, 0.05)', color: 'var(--cream-primary)', border: '1px solid rgba(31, 17, 11, 0.25)', padding: '0.35rem 0.9rem', fontWeight: 700, letterSpacing: '1.5px', fontSize: '0.72rem' }}>
                LAGOS WIG STUDIO
              </span>
            </div>

            <h1 
              style={{ 
                fontSize: '4.8rem', 
                lineHeight: '1.15', 
                color: 'var(--cream-primary)',
                fontFamily: 'var(--font-serif)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textShadow: '0 2px 4px rgba(31, 17, 11, 0.06)'
              }}
              id="hero-heading"
            >
              We Don't Just Style Hair, <br />
              We <span className="gold-gradient-text" style={{ textShadow: 'none' }}>Perfect It.</span>
            </h1>

            <p 
              style={{ 
                fontSize: '1.25rem', 
                lineHeight: '1.75', 
                color: 'var(--text-cream-muted)', 
                maxWidth: '620px',
                fontWeight: 400,
                marginTop: '0.5rem'
              }}
            >
              Discover 100% human hair wigs, custom glueless installs, and professional care. Elevate your confidence with Lagos's finest wig craftsmanship.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
              <button 
                onClick={() => { setActiveView('shop'); window.scrollTo(0, 0); }}
                className="btn btn-primary"
                style={{ padding: '0.8rem 2.2rem', fontSize: '0.9rem' }}
                id="hero-shop-btn"
              >
                <ShoppingBag size={16} />
                Shop Custom Wigs
              </button>
              <button 
                onClick={() => { setActiveView('booking'); window.scrollTo(0, 0); }}
                className="btn btn-secondary"
                style={{ padding: '0.8rem 2.2rem', fontSize: '0.9rem' }}
                id="hero-book-btn"
              >
                <Calendar size={16} />
                Book Installation
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 2. UNICE-INSPIRED CATEGORIES CIRCLES */}
      <section style={{ padding: '3.5rem 0', background: 'var(--burgundy-deep)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-around', 
              alignItems: 'center', 
              flexWrap: 'wrap',
              gap: '2rem'
            }}
            id="category-circles-list"
          >
            {categories.map((cat, index) => (
              <div 
                key={index}
                onClick={handleCategoryClick}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '0.8rem',
                  cursor: 'pointer',
                  width: '100px'
                }}
                className="category-circle-item"
              >
                <div 
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid var(--border-light)',
                    transition: 'all 0.3s ease',
                    boxShadow: 'var(--shadow-sm)',
                    background: 'var(--burgundy-dark)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--gold-primary)';
                    e.currentTarget.style.transform = 'scale(1.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-light)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span 
                  style={{ 
                    fontSize: '0.8rem', 
                    fontWeight: 600, 
                    color: 'var(--cream-primary)', 
                    textAlign: 'center',
                    letterSpacing: '0.5px'
                  }}
                >
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TRENDING PROMO BANNERS GRID */}
      <section style={{ padding: '4rem 0', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="grid-cols-2" id="promo-banners-grid">
            
            {/* Banner 1 */}
            <div 
              style={{
                background: 'linear-gradient(rgba(245, 230, 207, 0.9), rgba(245, 230, 207, 0.97)), url("https://images.unsplash.com/photo-1579613832125-5d34a13feb2a?q=80&w=600")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--border-radius-md)',
                padding: '3rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '280px',
                position: 'relative',
                overflow: 'hidden'
              }}
              className="promo-banner-card"
            >
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--gold-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>
                  Glueless Wear & Go
                </span>
                <h3 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', color: 'var(--cream-primary)', marginTop: '0.5rem', marginBottom: '0.8rem' }}>
                  Pre-Cut Lace Wigs
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-cream-muted)', maxWidth: '340px', lineHeight: '1.5' }}>
                  Features pre-plucked, pre-bleached hair grids. Pop it on in 3 seconds, adjust strap, and look flawless. Zero adhesive styling needed.
                </p>
              </div>
              <button 
                onClick={() => { setActiveView('shop'); window.scrollTo(0, 0); }}
                className="btn-text" 
                style={{ alignSelf: 'flex-start', marginTop: '1.5rem', color: 'var(--gold-primary)' }}
              >
                Shop Glueless Units <ArrowRight size={14} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
              </button>
            </div>

            {/* Banner 2 */}
            <div 
              style={{
                background: 'linear-gradient(rgba(245, 230, 207, 0.9), rgba(245, 230, 207, 0.97)), url("https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=600")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--border-radius-md)',
                padding: '3rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '280px',
                position: 'relative',
                overflow: 'hidden'
              }}
              className="promo-banner-card"
            >
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--gold-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>
                  15% OFF VIP Coupon
                </span>
                <h3 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', color: 'var(--cream-primary)', marginTop: '0.5rem', marginBottom: '0.8rem' }}>
                  VIP Club Clearance
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-cream-muted)', maxWidth: '340px', lineHeight: '1.5' }}>
                  Enjoy exclusive discounts on custom wigs. Use code <strong style={{ color: 'var(--gold-primary)' }}>JESAMVIP</strong> at checkout for 15% off orders above ₦100,000.
                </p>
              </div>
              <button 
                onClick={() => { setActiveView('shop'); window.scrollTo(0, 0); }}
                className="btn-text" 
                style={{ alignSelf: 'flex-start', marginTop: '1.5rem', color: 'var(--gold-primary)' }}
              >
                Explore Collection <ArrowRight size={14} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 4. BEST SELLERS PRODUCT GRID */}
      <section style={{ padding: '5rem 0', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Hot Products</span>
            <h2 className="section-title">Shop Our Best Sellers</h2>
            <p className="section-desc">100% unprocessed virgin human hair wigs trusted by thousands of styling queens in Nigeria.</p>
          </div>

          <div className="grid-cols-4" id="home-best-sellers">
            {bestSellers.map((prod) => (
              <div 
                key={prod._id || prod.id} 
                className="glass-card" 
                style={{ 
                  padding: '1rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
                onMouseEnter={() => setHoveredProductId(prod._id || prod.id)}
                onMouseLeave={() => setHoveredProductId(null)}
              >
                {/* Image */}
                <div 
                  style={{ 
                    height: '200px', 
                    borderRadius: '6px', 
                    overflow: 'hidden', 
                    position: 'relative',
                    border: '1px solid rgba(212, 175, 55, 0.08)',
                    background: 'var(--burgundy-dark)',
                    marginBottom: '1rem'
                  }}
                >
                  {hoveredProductId === (prod._id || prod.id) ? (
                    <video
                      src={prod.video || '/8431525-uhd_4096_2160_25fps.mp4'}
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <img src={prod.img} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                  
                  {prod.tag && (
                    <span 
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        left: '0.5rem',
                        background: 'var(--gold-primary)',
                        color: 'var(--burgundy-dark)',
                        fontSize: '0.6rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '2px'
                      }}
                    >
                      {prod.tag}
                    </span>
                  )}

                  <button
                    onClick={() => setSelectedProduct(prod)}
                    style={{
                      position: 'absolute',
                      right: '0.5rem',
                      bottom: '0.5rem',
                      background: 'rgba(18,1,4,0.85)',
                      border: '1px solid var(--border-light)',
                      color: 'var(--gold-primary)',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Quick View"
                  >
                    <Eye size={14} />
                  </button>
                </div>

                {/* Info */}
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--cream-primary)', marginBottom: '0.4rem', minHeight: '38px', lineHeight: '1.3' }}>
                    {prod.name}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', color: 'var(--gold-primary)' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} fill={i < Math.floor(prod.rating) ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-cream-muted)' }}>({prod.reviews})</span>
                  </div>
                </div>

                {/* Footer Add */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(212,175,55,0.08)' }}>
                  <div>
                    <span style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--cream-primary)' }}>
                      ₦{prod.price.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => addToCart(prod)}
                    className="btn btn-primary"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem', borderRadius: '4px' }}
                  >
                    <Plus size={12} style={{ marginRight: '2px' }} /> Add
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <button 
              onClick={() => { setActiveView('shop'); window.scrollTo(0, 0); }}
              className="btn btn-primary"
              style={{ width: '220px' }}
            >
              Shop All Wigs <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Product Details Zoom Modal */}
      {selectedProduct && (
        <div className="modal-overlay" style={{ display: 'flex' }} id="home-product-zoom-modal">
          <div className="modal-content" style={{ maxWidth: '720px', padding: '2rem' }}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)}>
              <X size={20} />
            </button>
            <div className="grid-cols-2" style={{ gap: '2rem' }} id="home-product-zoom-grid">
              <div style={{ height: '360px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-medium)' }}>
                <img 
                  src={selectedProduct.img} 
                  alt={selectedProduct.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>{selectedProduct.category}</span>
                  <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', color: 'var(--cream-primary)', marginBottom: '0.5rem' }}>
                    {selectedProduct.name}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', color: 'var(--gold-primary)' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < Math.floor(selectedProduct.rating) ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-cream-muted)' }}>{selectedProduct.rating} / 5.0 ({selectedProduct.reviews} verified reviews)</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '1rem', color: 'var(--text-cream-muted)' }}>
                    {selectedProduct.desc}
                  </p>

                  {/* UNice-inspired Tabbed Accordion Details */}
                  <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', marginBottom: '1rem' }} id="home-modal-detail-tabs">
                    {['specs', 'shipping', 'care'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveDetailTab(tab)}
                        style={{
                          background: 'none',
                          border: 'none',
                          borderBottom: activeDetailTab === tab ? '2px solid var(--gold-primary)' : '2px solid transparent',
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: activeDetailTab === tab ? 'var(--gold-primary)' : 'var(--text-cream-muted)',
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                          transition: 'all 0.2s',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {tab === 'specs' ? 'Specs' : tab === 'shipping' ? 'Shipping' : 'Care Guide'}
                      </button>
                    ))}
                  </div>

                  <div style={{ minHeight: '115px', fontSize: '0.78rem', lineHeight: '1.4', color: 'var(--text-cream-muted)', marginBottom: '1rem', overflowY: 'auto' }} id="home-modal-detail-tab-content">
                    {activeDetailTab === 'specs' && (
                      <ul style={{ paddingLeft: '1.1rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <li><strong>Hair Quality:</strong> 10A Grade 100% Remy Human Hair.</li>
                        <li><strong>Texture & Finish:</strong> Double-drawn ends for natural high-density volume.</li>
                        <li><strong>Lace Foundation:</strong> Ultra-fine Swiss HD lace with pre-plucked baby hairs.</li>
                        <li><strong>Cap Adjustment:</strong> Secure adjustable elastic strap with 3 non-slip styling combs.</li>
                      </ul>
                    )}
                    {activeDetailTab === 'shipping' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <p>🚚 <strong>Standard Delivery:</strong> Free next-day courier within Lagos.</p>
                        <p>✈️ <strong>Nationwide (Nigeria):</strong> 2-4 business days via DHL Express.</p>
                        <p>📦 <strong>Dispatch timeline:</strong> Shipped within 24 hours of confirmation.</p>
                      </div>
                    )}
                    {activeDetailTab === 'care' && (
                      <ul style={{ paddingLeft: '1.1rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <li>Shampoo gently in lukewarm water using sulfate-free conditioner.</li>
                        <li>Apply a drop of Jesam Silk Serum regularly for locking texture shine.</li>
                        <li>Always use a heat-protectant barrier when styling above 350°F.</li>
                        <li>Cover or store in a satin bonnet to prevent sleep tangles.</li>
                      </ul>
                    )}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--gold-primary)' }}>
                      ₦{selectedProduct.price.toLocaleString()}
                    </span>
                    {selectedProduct.oldPrice > 0 && (
                      <span style={{ fontSize: '1.1rem', color: '#888888', textDecoration: 'line-through' }}>
                        ₦{selectedProduct.oldPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      onClick={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                    >
                      <ShoppingBag size={18} />
                      Add to Cart Drawer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styled Responsive Overlay Rules */}
      <style>{`
        @media (max-width: 900px) {
          #hero-heading {
            font-size: 2.8rem !important;
          }
          #promo-banners-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          #home-best-sellers {
            grid-template-columns: 1fr 1fr !important;
            gap: 1rem !important;
          }
          .trust-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2.5rem !important;
          }
        }
        @media (max-width: 500px) {
          #home-best-sellers {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          .trust-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>

    </div>
  );
}
