import React, { useState } from 'react';
import { X, ZoomIn, Layers } from 'lucide-react';

export default function Lookbook() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxImg, setLightboxImg] = useState(null);
  
  // Custom slider handle position (percentage 0-100)
  const [sliderPos, setSliderPos] = useState(50);
  const [isSliding, setIsSliding] = useState(false);

  const galleryItems = [
    { id: 1, title: 'Bone Straight Extension Install', category: 'wigs', img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=600' },
    { id: 2, title: 'Knotless Goddess Braids styling', category: 'braids', img: 'https://images.unsplash.com/photo-1605497746444-ac9dbd39d675?q=80&w=600' },
    { id: 3, title: 'HD Closure Custom Wig Unit', category: 'wigs', img: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=600' },
    { id: 4, title: 'Sleek Ponytail with Leave-out', category: 'weaves', img: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=600' },
    { id: 5, title: 'Silk Press Natural Hair Styling', category: 'natural', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600' },
    { id: 6, title: '6 Feed-In Stitch Cornrows', category: 'braids', img: 'https://images.unsplash.com/photo-1579613832125-5d34a13feb2a?q=80&w=600' }
  ];

  const filters = [
    { id: 'all', label: 'All Looks' },
    { id: 'wigs', label: 'Wigs' },
    { id: 'braids', label: 'Braids' },
    { id: 'weaves', label: 'Weaves' },
    { id: 'natural', label: 'Natural' }
  ];

  const filteredItems = activeFilter === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter);

  // Before & After image sources
  const beforeImage = 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=600'; // dry natural hair
  const afterImage = 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=600'; // sleek bone straight

  const handleSliderMove = (e) => {
    if (!isSliding) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  return (
    <section 
      style={{
        background: 'var(--burgundy-dark)',
        borderTop: '1px solid var(--border-light)'
      }}
      id="lookbook-section"
    >
      <div className="container">
        {/* Title */}
        <div className="section-header">
          <span className="section-tag">Lookbook & Gallery</span>
          <h2 className="section-title">Visual Transformations</h2>
          <p className="section-desc">
            Browse through our portfolio of custom wig designs, custom extensions installs, and signature braids styled by our experts.
          </p>
        </div>

        {/* Interactive Before & After Slider */}
        <div style={{ marginBottom: '6rem' }} id="lookbook-comparison-block">
          <div className="section-header" style={{ marginBottom: '2.5rem' }}>
            <span className="section-tag">Interactive Feature</span>
            <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', color: 'var(--cream-primary)' }}>
              Before & After Magic
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-cream-muted)' }}>
              Slide the center line to inspect the difference of our Silk Press & Wig Revamp services.
            </p>
          </div>

          <div 
            onMouseMove={handleSliderMove}
            onTouchMove={handleSliderMove}
            onMouseDown={() => setIsSliding(true)}
            onTouchStart={() => setIsSliding(true)}
            onMouseUp={() => setIsSliding(false)}
            onTouchEnd={() => setIsSliding(false)}
            onMouseLeave={() => setIsSliding(false)}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '680px',
              height: '420px',
              margin: '0 auto',
              borderRadius: 'var(--border-radius-md)',
              overflow: 'hidden',
              border: '1px solid var(--border-medium)',
              boxShadow: 'var(--shadow-burgundy)',
              cursor: 'ew-resize',
              userSelect: 'none'
            }}
            id="before-after-slider-box"
          >
            {/* After Image (Background) */}
            <img 
              src={afterImage} 
              alt="After Transformation styling" 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'rgba(18,1,4,0.7)', color: 'var(--gold-primary)', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
              AFTER JESAM
            </div>

            {/* Before Image (Clip overlay) */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`
              }}
            >
              <img 
                src={beforeImage} 
                alt="Before treatment styling" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(18,1,4,0.7)', color: 'var(--cream-primary)', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                BEFORE VISIT
              </div>
            </div>

            {/* Handle Line */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${sliderPos}%`,
                width: '2px',
                background: 'var(--gold-primary)',
                boxShadow: '0 0 10px rgba(212,175,55,0.8)',
                zIndex: 10,
                transform: 'translateX(-50%)'
              }}
            >
              {/* Handle Knob */}
              <div 
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'var(--gold-primary)',
                  border: '3px solid var(--burgundy-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                  color: 'var(--burgundy-dark)'
                }}
              >
                <Layers size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div>
          {/* Gallery Filters */}
          <div 
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
              marginBottom: '3rem'
            }}
            id="lookbook-tabs"
          >
            {filters.map((fl) => (
              <button
                key={fl.id}
                onClick={() => setActiveFilter(fl.id)}
                style={{
                  background: activeFilter === fl.id ? 'var(--gold-primary)' : 'rgba(31, 17, 11, 0.4)',
                  border: '1px solid',
                  borderColor: activeFilter === fl.id ? 'var(--gold-primary)' : 'var(--border-light)',
                  color: activeFilter === fl.id ? 'var(--burgundy-dark)' : 'var(--cream-primary)',
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                id={`lookbook-tab-${fl.id}`}
              >
                {fl.label}
              </button>
            ))}
          </div>

          {/* Grid Layout */}
          <div className="grid-cols-3" id="lookbook-gallery-grid">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="glass-card" 
                style={{ padding: '0.75rem', overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => setLightboxImg(item)}
              >
                <div 
                  style={{ 
                    height: '300px', 
                    borderRadius: '6px', 
                    overflow: 'hidden', 
                    position: 'relative',
                    border: '1px solid rgba(212,175,55,0.08)'
                  }}
                  className="lookbook-img-box"
                >
                  <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {/* Zoom overlay on hover styling */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(18, 1, 4, 0.4)',
                      opacity: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'opacity 0.3s ease'
                    }}
                    className="zoom-overlay"
                  >
                    <div style={{ color: 'var(--gold-primary)', background: 'rgba(18,1,4,0.85)', padding: '0.8rem', borderRadius: '50%' }}>
                      <ZoomIn size={20} />
                    </div>
                  </div>
                </div>
                <h4 style={{ fontSize: '1rem', color: 'var(--cream-primary)', marginTop: '1rem', padding: '0 0.5rem 0.5rem 0.5rem' }}>
                  {item.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div className="modal-overlay" style={{ display: 'flex' }} onClick={() => setLightboxImg(null)} id="lookbook-lightbox">
          <div 
            className="modal-content" 
            style={{ 
              maxWidth: '680px', 
              padding: '0.5rem', 
              background: 'transparent',
              border: 'none',
              boxShadow: 'none'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setLightboxImg(null)} style={{ color: '#FFFFFF', right: '-2.5rem', top: '-1.5rem' }}>
              <X size={28} />
            </button>
            <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-medium)' }}>
              <img src={lightboxImg.img} alt={lightboxImg.title} style={{ width: '100%', maxHeight: '580px', objectFit: 'contain', background: '#000000' }} />
            </div>
            <div style={{ color: '#FFFFFF', padding: '1rem', textAlign: 'center', fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }}>
              {lightboxImg.title}
            </div>
          </div>
        </div>
      )}

      {/* Hover Zoom Custom CSS */}
      <style>{`
        .glass-card:hover .zoom-overlay {
          opacity: 1 !important;
        }
        @media (max-width: 900px) {
          #lookbook-gallery-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          #before-after-slider-box {
            height: 300px !important;
          }
        }
      `}</style>
    </section>
  );
}
