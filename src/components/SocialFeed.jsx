import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, ShoppingBag, Volume2, VolumeX, Play, Pause, X, Star, Music, Sparkles } from 'lucide-react';

export default function SocialFeed({ addToCart, products = [] }) {
  const [activeReel, setActiveReel] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [commentInput, setCommentInput] = useState('');
  const [customerNameInput, setCustomerNameInput] = useState('');
  
  // Real Likes state per reel
  const [reelLikes, setReelLikes] = useState({ r1: 142, r2: 98, r3: 65, r4: 110 });
  const [userLikedMap, setUserLikedMap] = useState({});

  // Real Customer Comments store per reel (No fake comments)
  const [reelCommentsMap, setReelCommentsMap] = useState({
    r1: [],
    r2: [],
    r3: [],
    r4: []
  });

  const modalVideoRef = useRef(null);

  // Reels data set to @jesambeauty with no descriptions
  const socialReels = [
    {
      id: 'r1',
      handle: '@jesambeauty',
      videoUrl: '/videos/jesam-p1.mp4',
      poster: '/videos/jesam-p1-img1.jpg',
      productId: 'jesam-p1',
      productName: '26" Bone Straight Wig',
      price: 195000,
      rating: 4.9,
      music: 'Original Audio - Jesam Beauty Studio'
    },
    {
      id: 'r2',
      handle: '@jesambeauty',
      videoUrl: '/videos/jesam-p2.mp4',
      poster: '/videos/jesam-p2-img1.jpg',
      productId: 'jesam-p2',
      productName: '22" Deep Wave Glueless Wig',
      price: 165000,
      rating: 4.8,
      music: 'Original Audio - Jesam Beauty Studio'
    },
    {
      id: 'r3',
      handle: '@jesambeauty',
      videoUrl: '/videos/jesam-p3.mp4',
      poster: '/videos/jesam-p3-img1.jpg',
      productId: 'jesam-p3',
      productName: '18" HD Lace Front Curly Wig',
      price: 140000,
      rating: 5.0,
      music: 'Original Audio - Jesam Beauty Studio'
    },
    {
      id: 'r4',
      handle: '@jesambeauty',
      videoUrl: '/videos/jesam-p4.mp4',
      poster: '/videos/jesam-p4-img1.jpg',
      productId: 'jesam-p4',
      productName: '24" Honey Blonde Highlighted Wig',
      price: 175000,
      rating: 4.7,
      music: 'Original Audio - Jesam Beauty Studio'
    }
  ];

  // Open modal player
  const handleOpenReel = (reel) => {
    setActiveReel(reel);
    setIsPlaying(true);
    setIsMuted(true);
  };

  // Toggle Like for a reel
  const handleToggleLike = (e, reelId) => {
    if (e) e.stopPropagation();
    const isLiked = userLikedMap[reelId];
    setUserLikedMap(prev => ({ ...prev, [reelId]: !isLiked }));
    setReelLikes(prev => ({
      ...prev,
      [reelId]: isLiked ? (prev[reelId] || 1) - 1 : (prev[reelId] || 0) + 1
    }));
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

  // Add a real customer comment
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim() || !activeReel) return;
    const author = customerNameInput.trim() ? `@${customerNameInput.trim().replace(/\s+/g, '_').toLowerCase()}` : '@customer';
    const newComment = {
      user: author,
      text: commentInput.trim(),
      time: 'Just now'
    };
    
    setReelCommentsMap(prev => ({
      ...prev,
      [activeReel.id]: [...(prev[activeReel.id] || []), newComment]
    }));
    
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
                  gap: '0.4rem',
                  zIndex: 2,
                  pointerEvents: 'none'
                }}
              >
                {/* Handle and verified tag - JUST @jesambeauty */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--gold-primary)' }}>
                    @jesambeauty
                  </span>
                  <span style={{ fontSize: '0.6rem', background: 'var(--gold-primary)', color: 'var(--burgundy-dark)', padding: '0.1rem 0.4rem', borderRadius: '10px', fontWeight: 'bold' }}>
                    Verified
                  </span>
                </div>

                {/* Shop look tag identifier */}
                <div 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.4rem', 
                    background: 'rgba(212, 175, 55, 0.2)', 
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    color: 'var(--gold-primary)',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '50px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    marginTop: '0.2rem',
                    width: 'fit-content'
                  }}
                >
                  <ShoppingBag size={12} />
                  <span>Shop Look</span>
                </div>
              </div>

              {/* Side Reels Interactive Likes & Comments Overlay */}
              <div
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  bottom: '4.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  zIndex: 3,
                  alignItems: 'center',
                  pointerEvents: 'auto'
                }}
              >
                {/* Interactive Heart Like Button */}
                <button
                  type="button"
                  onClick={(e) => handleToggleLike(e, reel.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    color: '#FAF6F0',
                    cursor: 'pointer'
                  }}
                  title="Like Reel"
                >
                  <Heart 
                    size={22} 
                    fill={userLikedMap[reel.id] ? '#ff4d6d' : 'rgba(0,0,0,0.5)'} 
                    stroke={userLikedMap[reel.id] ? '#ff4d6d' : '#ffffff'} 
                  />
                  <span style={{ fontSize: '0.7rem', marginTop: '0.2rem', fontWeight: 'bold' }}>
                    {reelLikes[reel.id] || 0}
                  </span>
                </button>

                {/* Real Comments Counter */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#FAF6F0' }}>
                  <MessageCircle size={20} fill="rgba(0,0,0,0.4)" stroke="#ffffff" />
                  <span style={{ fontSize: '0.7rem', marginTop: '0.2rem', fontWeight: 'bold' }}>
                    {(reelCommentsMap[reel.id] || []).length}
                  </span>
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
              {/* Profile Header panel - JUST @jesambeauty */}
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gold-primary)', color: 'var(--burgundy-dark)', display: 'flex', alignItems: 'center', justify: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    JB
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <h3 style={{ fontSize: '1rem', color: 'var(--cream-primary)', margin: 0, fontWeight: 700 }}>@jesambeauty</h3>
                      <span style={{ fontSize: '0.55rem', background: 'var(--gold-primary)', color: 'var(--burgundy-dark)', padding: '0.1rem 0.3rem', borderRadius: '8px', fontWeight: 'bold' }}>
                        Verified
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: 'var(--gold-primary)', marginTop: '0.1rem' }}>
                      <Music size={10} />
                      <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activeReel.music}</span>
                    </div>
                  </div>
                </div>

                {/* Modal Heart Button */}
                <button
                  type="button"
                  onClick={(e) => handleToggleLike(e, activeReel.id)}
                  style={{
                    background: 'rgba(212, 175, 55, 0.1)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '20px',
                    padding: '0.35rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: 'var(--cream-primary)',
                    cursor: 'pointer'
                  }}
                >
                  <Heart 
                    size={16} 
                    fill={userLikedMap[activeReel.id] ? '#ff4d6d' : 'none'} 
                    stroke={userLikedMap[activeReel.id] ? '#ff4d6d' : 'var(--gold-primary)'} 
                  />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{reelLikes[activeReel.id] || 0}</span>
                </button>
              </div>

              {/* Feed Real Customer Comments display area */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }} id="reel-comments-list">
                <div style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  💬 Real Customer Reviews & Comments ({(reelCommentsMap[activeReel.id] || []).length})
                </div>

                {(reelCommentsMap[activeReel.id] || []).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-cream-muted)', fontSize: '0.82rem' }}>
                    <MessageCircle size={28} style={{ color: 'var(--gold-primary)', opacity: 0.5, marginBottom: '0.5rem' }} />
                    <p style={{ margin: 0 }}>No comments yet.</p>
                    <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Be the first customer to drop a comment below!</span>
                  </div>
                ) : (
                  (reelCommentsMap[activeReel.id] || []).map((cmt, idx) => (
                    <div key={idx} style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', background: 'rgba(18,1,4,0.3)', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--gold-primary)' }}>{cmt.user}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-cream-muted)' }}>{cmt.time}</span>
                      </div>
                      <span style={{ color: 'var(--cream-primary)', lineHeight: '1.4' }}>{cmt.text}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Real Customer Comments submission form */}
              <form onSubmit={handleAddComment} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.85rem 1.5rem', borderTop: '1px solid var(--border-light)', background: 'rgba(18,1,4,0.4)' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={customerNameInput}
                    onChange={(e) => setCustomerNameInput(e.target.value)}
                    className="form-control"
                    style={{ flex: 0.8, padding: '0.35rem 0.65rem', fontSize: '0.75rem', height: '32px', background: 'var(--bg-form-input)' }}
                  />
                  <input
                    type="text"
                    placeholder="Type your comment..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="form-control"
                    style={{ flex: 1.2, padding: '0.35rem 0.65rem', fontSize: '0.75rem', height: '32px', background: 'var(--bg-form-input)' }}
                    id="reel-comment-input"
                    required
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0 0.85rem', fontSize: '0.75rem', height: '32px' }}>
                    Post
                  </button>
                </div>
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
