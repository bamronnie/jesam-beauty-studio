import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, ShoppingBag, Volume2, VolumeX, Play, Pause, X, Star, Music, Sparkles } from 'lucide-react';

export default function SocialFeed({ addToCart, products = [] }) {
  const [activeReel, setActiveReel] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  
  const modalVideoRef = useRef(null);

  // Seeded reels data linked to products in Shop
  const socialReels = [
    {
      id: 'r1',
      handle: '@chioma_jesam',
      likes: '4.8k',
      commentsCount: 230,
      caption: 'Obsessed with my new 26" Bone Straight Wig! Check the shine and quality double-drawn ends! ✨ #wiginstall #jesambeauty',
      videoUrl: '/videos/jesam-p1.mp4',
      poster: '/videos/jesam-p1-img1.jpg',
      productId: 'jesam-p1',
      productName: '26" Bone Straight Wig',
      price: 195000,
      rating: 4.9,
      music: 'Original Audio - chioma_jesam',
      comments: [
        { user: '@precious_x', text: 'Hair is looking like liquid gold! Omg.' },
        { user: '@fatima_abuja', text: 'Did you install it yourself? Flawless lace!' },
        { user: '@becky.wigs', text: 'Jesam Beauty double drawn ends are the absolute best!' }
      ]
    },
    {
      id: 'r2',
      handle: '@amara_nwa',
      likes: '3.2k',
      commentsCount: 145,
      caption: 'Unboxing my 22" Deep Wave Glueless Wig! The curl pattern is so juicy, pre-plucked hairline is flawless! 💖 #curls #wigunboxing',
      videoUrl: '/videos/jesam-p2.mp4',
      poster: '/videos/jesam-p2-img1.jpg',
      productId: 'jesam-p2',
      productName: '22" Deep Wave Glueless Wig',
      price: 165000,
      rating: 4.8,
      music: 'Lo-Fi Chill Beats - amara_nwa',
      comments: [
        { user: '@gift_okafor', text: 'Just bought this wig last week. It has zero tangles!' },
        { user: '@hair_police', text: 'Is that real HD Swiss lace? Invisible!' },
        { user: '@sophia_b', text: 'Perfect curls for summer.' }
      ]
    },
    {
      id: 'r3',
      handle: '@chidi_looks',
      likes: '1.9k',
      commentsCount: 89,
      caption: '18" HD Lace Front Curly Bouncy Wig in action! Soft, full, and no shedding. Jesam Beauty never fails! 👑 #hairvendor #humanhair',
      videoUrl: '/videos/jesam-p3.mp4',
      poster: '/videos/jesam-p3-img1.jpg',
      productId: 'jesam-p3',
      productName: '18" HD Lace Front Curly Wig',
      price: 140000,
      rating: 5.0,
      music: 'Aesthetics - chidi_looks',
      comments: [
        { user: '@mary_j', text: 'Can this hair be bleached to blonde?' },
        { user: '@chidi_looks', text: 'Yes, bleaches beautifully to 613!' },
        { user: '@didi_hair', text: 'Thick wefts, very high-quality!' }
      ]
    },
    {
      id: 'r4',
      handle: '@linda_styles',
      likes: '2.5k',
      commentsCount: 112,
      caption: 'Loving this 24" Honey Blonde Highlighted Bob Wig! Keeps my look chic and stylish all day long. A must-buy! 🛍️ #haircare #wigtips',
      videoUrl: '/videos/jesam-p4.mp4',
      poster: '/videos/jesam-p4-img1.jpg',
      productId: 'jesam-p4',
      productName: '24" Honey Blonde Highlighted Wig',
      price: 175000,
      rating: 4.7,
      music: 'Summer Vibes - linda_styles',
      comments: [
        { user: '@stella_d', text: 'This wig color is literally magic.' },
        { user: '@chi_chi', text: 'Does it come pre-customized?' },
        { user: '@linda_styles', text: 'Yes! Ready to wear right out of the box.' }
      ]
    }
  ];

  // Open modal player
  const handleOpenReel = (reel) => {
    setActiveReel(reel);
    setComments(reel.comments);
    setIsPlaying(true);
    setIsMuted(true);
  };

  // Toggle play/pause inside modal
  const togglePlay = () => {
    if (modalVideoRef.current) {
      if (isPlaying) {
        modalVideoRef.current.pause();
      } else {
        modalVideoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Toggle mute inside modal
  const toggleMute = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Add a comment to the feed
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const newComment = {
      user: '@you',
      text: commentInput.trim()
    };
    setComments([...comments, newComment]);
    setCommentInput('');
  };

  // Trigger adding items from "Shop the Look" card
  const handleShopLook = (productId) => {
    const matchedProduct = products.find(p => p.id === productId);
    const fallbackProducts = [
      { id: 'p1', name: '24" Bone Straight Double Drawn Wig', price: 185000, img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=500' },
      { id: 'p2', name: '18" HD Lace Front Curly Wig', price: 140000, img: 'https://images.unsplash.com/photo-1579613832125-5d34a13feb2a?q=80&w=500' },
      { id: 'p3', name: '3 Bundles Raw Virgin Hair Extensions', price: 120000, img: 'https://images.unsplash.com/photo-1605497746444-ac9dbd39d675?q=80&w=500' },
      { id: 'p4', name: 'Jesam Hair Silk Serum & Oil', price: 8500, img: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=500' }
    ];
    
    const prodToBuy = matchedProduct || fallbackProducts.find(p => p.id === productId);
    if (prodToBuy) {
      addToCart(prodToBuy);
      setActiveReel(null);
    }
  };

  // Play/pause videos on hover in the main grid
  const handleMouseEnterVideo = (e) => {
    const video = e.currentTarget.querySelector('video');
    if (video) {
      video.play().catch(() => {});
    }
  };

  const handleMouseLeaveVideo = (e) => {
    const video = e.currentTarget.querySelector('video');
    if (video) {
      video.pause();
    }
  };

  // Keep video playing state synced with ref
  useEffect(() => {
    if (activeReel && modalVideoRef.current) {
      modalVideoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [activeReel]);

  return (
    <section 
      style={{
        background: 'var(--burgundy-dark)',
        borderTop: '1px solid var(--border-light)',
        paddingBottom: '6rem'
      }}
      id="social-hub-section"
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">#JesamBeauty Hub</span>
          <h2 className="section-title">Shop The Look</h2>
          <p className="section-desc">
            See our hair collection in motion. Hover to play reviews and click to purchase the exact style instantly.
          </p>
        </div>

        {/* Video Reels Grid */}
        <div className="grid-cols-4" id="social-reels-grid" style={{ gap: '1.5rem' }}>
          {socialReels.map((reel) => (
            <div
              key={reel.id}
              onMouseEnter={handleMouseEnterVideo}
              onMouseLeave={handleMouseLeaveVideo}
              onClick={() => handleOpenReel(reel)}
              style={{
                position: 'relative',
                aspectRatio: '9/16',
                borderRadius: 'var(--border-radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--border-medium)',
                background: '#120104',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-md)',
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className="social-reel-card"
            >
              {/* Vertical Video Element */}
              <video
                src={reel.videoUrl}
                poster={reel.poster}
                preload="none"
                muted
                loop
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  opacity: 0.8
                }}
              />

              {/* Glass overlay details */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  background: 'linear-gradient(to top, rgba(18,1,4,0.95) 0%, rgba(18,1,4,0.4) 60%, transparent 100%)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  zIndex: 2,
                  pointerEvents: 'none'
                }}
              >
                {/* Handle and verified tag */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gold-primary)' }}>
                    {reel.handle}
                  </span>
                  <span style={{ fontSize: '0.6rem', background: 'var(--gold-primary)', color: 'var(--burgundy-dark)', padding: '0.1rem 0.3rem', borderRadius: '10px', fontWeight: 'bold' }}>
                    Verified
                  </span>
                </div>

                {/* Caption clip */}
                <p 
                  style={{ 
                    fontSize: '0.75rem', 
                    color: '#FAF6F0', 
                    margin: 0, 
                    lineHeight: '1.3',
                    display: '-webkit-box',
                    WebkitLineClamp: '2',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {reel.caption}
                </p>

                {/* Shop look tag identifier */}
                <div 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.4rem', 
                    background: 'rgba(212, 175, 55, 0.15)', 
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    color: 'var(--gold-primary)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '50px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    marginTop: '0.25rem',
                    width: 'fit-content'
                  }}
                >
                  <ShoppingBag size={12} />
                  <span>Shop Look</span>
                </div>
              </div>

              {/* Side Reels Stats Overlay */}
              <div
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  bottom: '7.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  zIndex: 2,
                  alignItems: 'center',
                  pointerEvents: 'none'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#FAF6F0' }}>
                  <Heart size={20} fill="#ff4d6d" stroke="#ff4d6d" />
                  <span style={{ fontSize: '0.65rem', marginTop: '0.2rem', fontWeight: 'bold' }}>{reel.likes}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#FAF6F0' }}>
                  <MessageCircle size={20} fill="rgba(255,255,255,0.2)" />
                  <span style={{ fontSize: '0.65rem', marginTop: '0.2rem', fontWeight: 'bold' }}>{reel.commentsCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SHOP THE LOOK MODAL PLAYER */}
      {activeReel && (
        <div className="modal-overlay" style={{ display: 'flex', zIndex: 1000 }} id="social-reel-modal">
          <div 
            className="modal-content" 
            style={{ 
              maxWidth: '850px', 
              width: '95%',
              padding: 0,
              display: 'grid',
              gridTemplateColumns: '1fr 1.1fr',
              overflow: 'hidden',
              height: '80vh',
              maxHeight: '680px'
            }}
          >
            {/* Close Modal button */}
            <button 
              className="modal-close" 
              onClick={() => {
                if (modalVideoRef.current) modalVideoRef.current.pause();
                setActiveReel(null);
              }}
              style={{
                zIndex: 1010,
                color: '#ffffff',
                background: 'rgba(0,0,0,0.5)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                top: '1rem',
                left: '1rem',
                right: 'auto'
              }}
            >
              <X size={18} />
            </button>

            {/* LEFT: Video Player viewport */}
            <div style={{ position: 'relative', background: '#000', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <video
                ref={modalVideoRef}
                src={activeReel.videoUrl}
                poster={activeReel.poster}
                preload="metadata"
                loop
                playsInline
                autoPlay
                muted={isMuted}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />

              {/* Player UI Controls overlay */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '1rem',
                  right: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  zIndex: 10,
                  gap: '1rem'
                }}
              >
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  style={{
                    background: 'rgba(0,0,0,0.6)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>

                {/* Mute/Unmute toggle */}
                <button
                  onClick={toggleMute}
                  style={{
                    background: 'rgba(0,0,0,0.6)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>
            </div>

            {/* RIGHT: Comments & "Shop the Look" Purchase Drawer */}
            <div 
              style={{ 
                background: 'linear-gradient(145deg, var(--burgundy-deep) 0%, var(--burgundy-dark) 100%)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: '1px solid var(--border-medium)'
              }}
            >
              {/* Customer Handle / Description panel */}
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gold-primary)', color: 'var(--burgundy-dark)', display: 'flex', alignItems: 'center', justify: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    {activeReel.handle.substring(1, 3).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', color: 'var(--cream-primary)', margin: 0 }}>{activeReel.handle}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: 'var(--gold-primary)' }}>
                      <Music size={10} />
                      <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activeReel.music}</span>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-cream-muted)', lineHeight: '1.4', margin: 0 }}>
                  {activeReel.caption}
                </p>
              </div>

              {/* Feed Live Comments display area */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} id="reel-comments-list">
                {comments.map((cmt, idx) => (
                  <div key={idx} style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--cream-primary)' }}>{cmt.user}</span>
                    <span style={{ color: 'var(--text-cream-muted)' }}>{cmt.text}</span>
                  </div>
                ))}
              </div>

              {/* Quick comments submission form */}
              <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem 1.5rem', borderTop: '1px solid rgba(31,17,11,0.06)' }}>
                <input
                  type="text"
                  placeholder="Post a comment..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="form-control"
                  style={{ flex: 1, padding: '0.4rem 0.75rem', fontSize: '0.8rem', height: '34px', background: 'var(--bg-form-input)' }}
                  id="reel-comment-input"
                />
                <button type="submit" className="btn btn-secondary" style={{ padding: '0 1rem', fontSize: '0.75rem', height: '34px' }}>
                  Post
                </button>
              </form>

              {/* BOTTOM CARD: "Shop the Look" dynamic widget */}
              <div 
                style={{ 
                  padding: '1.5rem', 
                  background: 'rgba(18, 1, 4, 0.4)', 
                  borderTop: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  {/* Miniature product image */}
                  <div style={{ width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-light)', background: 'var(--burgundy-dark)', flexShrink: 0 }}>
                    <img src={activeReel.poster} alt={activeReel.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.82rem', color: '#FAF6F0', fontWeight: 600, margin: 0, display: '-webkit-box', WebkitLineClamp: '1', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {activeReel.productName}
                    </h4>
                    
                    {/* Star Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
                      <div style={{ display: 'flex', color: 'var(--gold-primary)' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} fill={i < Math.floor(activeReel.rating) ? 'currentColor' : 'none'} />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.65rem', color: '#FAF6F0', opacity: 0.7 }}>({activeReel.rating})</span>
                    </div>

                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--gold-primary)', marginTop: '0.2rem' }}>
                      ₦{activeReel.price.toLocaleString()}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleShopLook(activeReel.productId)}
                  className="btn btn-primary"
                  style={{
                    padding: '0.6rem 1rem',
                    fontSize: '0.75rem',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                  id="shop-look-add-to-cart-btn"
                >
                  <ShoppingBag size={12} />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styled Responsive Overlay Rules */}
      <style>{`
        .social-reel-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 15px 35px rgba(31, 17, 11, 0.15);
        }
        @media (max-width: 900px) {
          #social-reels-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1rem !important;
          }
          #social-reel-modal .modal-content {
            grid-template-columns: 1fr !important;
            height: 90vh !important;
            max-height: none !important;
          }
          #reel-comments-list {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
