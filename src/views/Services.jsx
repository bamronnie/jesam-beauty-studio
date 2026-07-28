import React, { useState } from 'react';
import { Clock, Tag, ChevronRight, HelpCircle } from 'lucide-react';

export default function Services({ onSelectService, initialServices = [] }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const defaultServices = [
    // Wigs
    { id: 'srv1', title: 'HD Lace Wig Installation', desc: 'Flawless glueless or glue-based wig install with customized bleaching, plucking, and styled finish.', duration: '120 mins', price: 25000, category: 'wigs' },
    { id: 'srv2', title: 'Wig Revamping & Customization', desc: 'De-tangling, deep washing, conditioning treatment, elastic band replacement, and re-styling (curls or bone straight).', duration: '180 mins', price: 15000, category: 'wigs' },
    // Braids
    { id: 'srv3', title: 'Knotless Goddess Braids (Medium)', desc: 'Beautiful, light-weight knotless braids finished with high-quality curly curls for a goddess finish.', duration: '240 mins', price: 35000, category: 'braids' },
    { id: 'srv4', title: 'Stitch Braids (6-8 Feed-in)', desc: 'Clean, precise stitch braiding lines using high-quality hair wax and sleek hair extensions.', duration: '90 mins', price: 18000, category: 'braids' },
    // Extensions & Weaves
    { id: 'srv5', title: 'Traditional Sew-In Weave', desc: 'Full hair braiding foundation, net application, weft sew-in, and professional leave-out blending/cutting.', duration: '150 mins', price: 20000, category: 'extensions' },
    { id: 'srv6', title: 'Ponytail Styling (Sleek High)', desc: 'Sleek gel-up ponytail styled to perfection, utilizing hair wefts or extensions for length.', duration: '60 mins', price: 12000, category: 'extensions' },
    // Natural Hair
    { id: 'srv7', title: 'Silk Press & Treatment', desc: 'Deep hydration steam therapy, blow dry, and precision ceramic silk press finish for natural hair.', duration: '90 mins', price: 15000, category: 'natural' },
    { id: 'srv8', title: 'Natural Twists / Loc Maintenance', desc: 'Professional double-strand finger twists or starter loc retwists using organic locking gels.', duration: '120 mins', price: 18000, category: 'natural' }
  ];

  // Merge default services with any state updates from admin dashboard
  const services = initialServices.length > 0 ? initialServices : defaultServices;

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'wigs', label: 'Wigs & Revamping' },
    { id: 'braids', label: 'Braids & Cornrows' },
    { id: 'extensions', label: 'Extensions & Weaves' },
    { id: 'natural', label: 'Natural Styling' }
  ];

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(srv => srv.category === activeCategory);

  return (
    <section 
      style={{
        background: 'var(--burgundy-dark)',
        borderTop: '1px solid var(--border-light)',
        paddingTop: '9.5rem'
      }}
      id="services-section"
    >
      <div className="container">
        {/* Title */}
        <div className="section-header">
          <span className="section-tag">Our Menu</span>
          <h2 className="section-title">Professional Styling Services</h2>
          <p className="section-desc">
            Explore our curated menu of hair styling and treatment services. Prices vary by length and thickness.
          </p>
        </div>

        {/* Categories Tab Bar */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
            marginBottom: '3rem'
          }}
          id="services-tabs"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                background: activeCategory === cat.id ? 'var(--gold-primary)' : 'rgba(74, 8, 19, 0.4)',
                border: '1px solid',
                borderColor: activeCategory === cat.id ? 'var(--gold-primary)' : 'var(--border-light)',
                color: activeCategory === cat.id ? 'var(--burgundy-dark)' : 'var(--cream-primary)',
                padding: '0.6rem 1.25rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              id={`service-tab-${cat.id}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services List Grid */}
        <div className="grid-cols-2" id="services-grid">
          {filteredServices.map((srv) => (
            <div 
              key={srv.id} 
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '2rem',
                gap: '1.5rem',
                position: 'relative'
              }}
            >
              {/* Category indicator label */}
              <span 
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  fontSize: '0.65rem',
                  color: 'var(--gold-primary)',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  background: 'rgba(212, 175, 55, 0.1)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '2px'
                }}
              >
                {srv.category}
              </span>

              <div>
                <h3 
                  style={{ 
                    fontSize: '1.4rem', 
                    color: 'var(--cream-primary)', 
                    fontFamily: 'var(--font-serif)',
                    marginBottom: '0.5rem',
                    paddingRight: '4rem'
                  }}
                >
                  {srv.title}
                </h3>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-cream-muted)' }}>
                  {srv.desc}
                </p>
              </div>

              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid rgba(212, 175, 55, 0.08)'
                }}
              >
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-cream-muted)', fontSize: '0.85rem' }}>
                    <Clock size={16} style={{ color: 'var(--gold-primary)' }} />
                    <span>{srv.duration}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--cream-primary)', fontSize: '1.15rem', fontWeight: 'bold' }}>
                    <span style={{ color: 'var(--gold-primary)' }}>₦</span>
                    <span>{srv.price.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectService(srv)}
                  className="btn btn-primary"
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.75rem',
                    borderRadius: '4px'
                  }}
                  id={`service-book-btn-${srv.id}`}
                >
                  Book Now
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Extra info disclaimer card */}
        <div 
          style={{ 
            marginTop: '4rem', 
            background: 'linear-gradient(90deg, rgba(74, 8, 19, 0.4) 0%, rgba(18, 1, 4, 0.6) 100%)', 
            border: '1px solid var(--border-light)', 
            padding: '1.5rem 2rem', 
            borderRadius: 'var(--border-radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
          className="services-info"
        >
          <HelpCircle size={24} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
          <p style={{ fontSize: '0.85rem', color: 'var(--text-cream-muted)', lineHeight: '1.5' }}>
            <strong>Note:</strong> Listed prices are baselines. Hair thickness, extra-long extension extensions, and special coloring custom work might incur additional fees. Please discuss details with your stylist during your styling session.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #services-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .services-info {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
}
