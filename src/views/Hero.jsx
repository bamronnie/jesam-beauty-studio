import React, { useState } from 'react';
import { ShoppingBag, Calendar, Star, Eye, Plus, ArrowRight, Zap, X, Play } from 'lucide-react';

export default function Hero({ setActiveView, addToCart, products = [] }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('specs');
  const [hoveredProductId, setHoveredProductId] = useState(null);

  const categories = [
    { name: "Glueless Wigs", tag: "HOT", img: "/videos/jesam-p2-img1.jpg" },
    { name: "HD Lace Wigs", tag: "BEST SELLER", img: "/videos/jesam-p1-img1.jpg" },
    { name: "Colored Wigs", tag: "CUSTOM", img: "/videos/jesam-p4-img1.jpg" },
    { name: "Hair Bundles", tag: "RAW HAIR", img: "/videos/jesam-p6-img1.jpg" },
    { name: "Lace Closures", tag: "HD LACE", img: "/videos/jesam-p10-img1.jpg" }
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

      {/* 2. LUXURY CATEGORY QUICK CIRCLES BAR */}
      <section style={{ padding: '3.5rem 0', background: 'var(--burgundy-deep)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              flexWrap: 'wrap',
              gap: '2.5rem'
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
                  gap: '0.85rem',
                  cursor: 'pointer',
                  width: '110px',
                  position: 'relative'
                }}
                className="category-circle-item"
              >
                {/* Floating Gold Tag Badge */}
                {cat.tag && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      zIndex: 3,
                      background: 'linear-gradient(135deg, var(--gold-primary) 0%, var(--gold-dark) 100%)',
                      color: 'var(--burgundy-dark)',
                      fontSize: '0.58rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '20px',
                      letterSpacing: '0.5px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                      textTransform: 'uppercase'
                    }}
                  >
                    {cat.tag}
                  </span>
                )}

                {/* Circle Container with Gold Ring */}
                <div 
                  style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid var(--gold-primary)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.25)',
                    background: 'var(--burgundy-dark)',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#ffffff';
                    e.currentTarget.style.transform = 'translateY(-5px) scale(1.06)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.45)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--gold-primary)';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.25)';
                  }}
                >
                  <img 
                    src={cat.img} 
                    alt={cat.name} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      display: 'block'
                    }} 
                  />
                </div>
                
                <span 
                  style={{ 
                    fontSize: '0.85rem', 
                    fontWeight: 700, 
                    color: 'var(--cream-primary)', 
                    textAlign: 'center',
                    letterSpacing: '0.3px',
                    lineHeight: '1.2'
                  }}
                >
                  {cat.name}
                </span>
              </div>
            ))}
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
                {/* PIP Image & Video Box */}
                <div 
                  className="pip-card-image-container" 
                  onClick={() => setSelectedProduct(prod)}
                  style={{ height: '240px', cursor: 'pointer' }}
                  title="Click to view product details"
                >
                  <img 
                    src={prod.img} 
                    alt={prod.name} 
                    className="pip-main-img"
                  />

                  {/* Picture-in-Picture Video Preview Box */}
                  {prod.video && (
                    <div className="pip-video-badge" style={{ width: '80px', height: '95px' }}>
                      {hoveredProductId === (prod._id || prod.id) ? (
                        <>
                          <div className="pip-play-tag" style={{ fontSize: '0.5rem', padding: '0.1rem 0.3rem' }}>
                            <span className="pip-play-icon-pulse"></span> PLAY
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
                          <div className="pip-play-tag" style={{ fontSize: '0.5rem', padding: '0.1rem 0.3rem' }}>
                            <Play size={8} style={{ fill: 'currentColor' }} /> VIDEO
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
                  <h4 
                    onClick={() => setSelectedProduct(prod)}
                    style={{ fontSize: '0.95rem', color: 'var(--cream-primary)', marginBottom: '0.4rem', minHeight: '38px', lineHeight: '1.3', cursor: 'pointer' }}
                    title="Click to view details"
                  >
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
