import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Menu, X, Settings, Search, User } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Navbar({ 
  activeView, 
  setActiveView, 
  cartCount, 
  toggleCart, 
  adminMode, 
  setAdminMode, 
  searchTerm, 
  setSearchTerm,
  currentUser,
  setCurrentUser,
  openAuthModal
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'shop', label: 'Shop' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (viewId) => {
    setActiveView(viewId);
    setAdminMode(false);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {/* UNice-Inspired Top Promo Ticker Banner */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '36px',
          background: 'var(--cream-primary)',
          color: 'var(--burgundy-dark)',
          zIndex: 910,
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
        id="top-promo-banner"
      >
        <div 
          className="marquee-content" 
          style={{ 
            display: 'flex', 
            whiteSpace: 'nowrap',
            animation: 'marquee 25s linear infinite',
            width: 'max-content'
          }}
        >
          <span style={{ paddingRight: '4rem' }}>⚡ FLASH SALE: USE CODE <strong style={{ color: 'var(--gold-light)' }}>JESAMVIP</strong> FOR 15% OFF ORDERS OVER ₦100k! ⚡</span>
          <span style={{ paddingRight: '4rem' }}>💝 JOIN THE VIP CLUB FOR 100 BONUS LOYALTY POINTS INSTANTLY! 💝</span>
          <span style={{ paddingRight: '4rem' }}>🚚 FREE SHIPPING IN LAGOS ON ALL WIG ORDERS ABOVE ₦150k! 🚚</span>
          <span style={{ paddingRight: '4rem' }}>✨ VISIT OUR AI WIG TRY-ON TO VIRTUALLY STYLE YOUR HAIR RIGHT NOW! ✨</span>
          
          {/* Duplicate contents for seamless looping */}
          <span style={{ paddingRight: '4rem' }}>⚡ FLASH SALE: USE CODE <strong style={{ color: 'var(--gold-light)' }}>JESAMVIP</strong> FOR 15% OFF ORDERS OVER ₦100k! ⚡</span>
          <span style={{ paddingRight: '4rem' }}>💝 JOIN THE VIP CLUB FOR 100 BONUS LOYALTY POINTS INSTANTLY! 💝</span>
          <span style={{ paddingRight: '4rem' }}>🚚 FREE SHIPPING IN LAGOS ON ALL WIG ORDERS ABOVE ₦150k! 🚚</span>
          <span style={{ paddingRight: '4rem' }}>✨ VISIT OUR AI WIG TRY-ON TO VIRTUALLY STYLE YOUR HAIR RIGHT NOW! ✨</span>
        </div>
      </div>

      <nav 
        style={{
          position: 'fixed',
          top: '36px',
          left: 0,
          width: '100%',
          zIndex: 900,
          padding: isScrolled ? '1rem 2rem' : '1.5rem 2rem',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          background: isScrolled ? 'var(--bg-navbar)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(12px)' : 'none',
          borderBottom: isScrolled ? 'var(--border-navbar)' : '1px solid transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
        id="app-navbar"
      >
        {/* Brand Logo - Using transparent PNG logo */}
        <div 
          onClick={() => handleNavClick('home')}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
            padding: '2px 0'
          }}
          id="nav-logo"
        >
          <img 
            src={logoImg} 
            alt="Jesam Beauty Emblem" 
            style={{ 
              height: '52px', 
              width: 'auto',
              display: 'block',
              filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.12))',
              marginBottom: '2px'
            }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px' }}>
            <span style={{
              fontFamily: "var(--font-serif)",
              fontSize: '1.05rem',
              fontWeight: '700',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--cream-primary)',
              lineHeight: 1
            }}>
              Jesam
            </span>
            <span style={{
              fontFamily: "var(--font-sans)",
              fontSize: '0.55rem',
              fontWeight: '600',
              letterSpacing: '0.38em',
              textTransform: 'uppercase',
              color: 'var(--gold-primary)',
              lineHeight: 1,
              paddingLeft: '0.38em',
              marginTop: '1px'
            }}>
              Beauty
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: activeView === link.id && !adminMode ? 'var(--gold-primary)' : 'var(--cream-primary)',
                cursor: 'pointer',
                transition: 'color var(--transition-fast)',
                position: 'relative',
                padding: '0.5rem 0'
              }}
              id={`nav-link-${link.id}`}
            >
              {link.label}
              {activeView === link.id && !adminMode && (
                <div 
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'var(--gold-primary)',
                    borderRadius: '2px'
                  }} 
                />
              )}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
          {/* E-commerce Search Trigger */}
          <button
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              setIsMobileMenuOpen(false);
              setTimeout(() => {
                if (searchInputRef.current) {
                  searchInputRef.current.focus();
                }
              }, 100);
            }}
            style={{
              background: isSearchOpen ? 'var(--gold-primary)' : 'none',
              border: 'none',
              color: isSearchOpen ? 'var(--burgundy-dark)' : 'var(--cream-primary)',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            title="Search Hair Collection"
            id="nav-search-toggle-btn"
          >
            {isSearchOpen ? <X size={18} /> : <Search size={20} />}
          </button>

          {/* Admin Dashboard Entry */}
          {currentUser && currentUser.role === 'admin' && (
            <button
              onClick={() => {
                setAdminMode(!adminMode);
                setIsMobileMenuOpen(false);
                window.scrollTo(0, 0);
              }}
              style={{
                background: adminMode ? 'var(--gold-primary)' : 'rgba(212, 175, 55, 0.1)',
                border: '1px solid var(--gold-primary)',
                color: adminMode ? 'var(--burgundy-dark)' : 'var(--gold-primary)',
                padding: '0.5rem',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
              title="Admin Dashboard"
              id="admin-toggle-btn"
            >
              <Settings size={18} />
            </button>
          )}

          {/* Cart Trigger */}
          <button
            onClick={toggleCart}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--cream-primary)',
              cursor: 'pointer',
              position: 'relative',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            id="cart-toggle-btn"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span 
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  background: 'var(--gold-primary)',
                  color: 'var(--burgundy-dark)',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile / Authentication Button */}
          {currentUser ? (
            <button
              onClick={openAuthModal}
              style={{
                background: 'rgba(170, 124, 17, 0.1)',
                border: '1px solid var(--gold-primary)',
                color: 'var(--gold-primary)',
                padding: '0.4rem 0.8rem',
                borderRadius: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                transition: 'all 0.3s ease'
              }}
              title="My Account Profile"
              id="nav-profile-btn"
            >
              <User size={14} />
              <span style={{ display: 'inline-block', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={openAuthModal}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--cream-primary)',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              title="Client Login / Register"
              id="nav-login-btn"
            >
              <User size={22} />
            </button>
          )}

          {/* Book Appointment CTA */}
          <button
            onClick={() => handleNavClick('booking')}
            className="btn btn-primary btn-book-nav"
            style={{
              padding: '0.6rem 1.25rem',
              fontSize: '0.75rem',
              borderRadius: '4px'
            }}
            id="nav-book-btn"
          >
            Book Now
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-menu-toggle"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--cream-primary)',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'none'
            }}
            id="mobile-menu-toggle-btn"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Frosted glass header dropdown search bar */}
      {isSearchOpen && (
        <div 
          style={{
            position: 'fixed',
            top: isScrolled ? '96px' : '124px',
            left: 0,
            width: '100%',
            background: 'var(--bg-navbar)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--border-navbar)',
            padding: '1.25rem 2rem',
            zIndex: 880,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
            animation: 'fadeIn var(--transition-fast) forwards'
          }}
          id="nav-search-bar-overlay"
        >
          <div style={{ position: 'relative', width: '100%', maxWidth: '680px' }}>
            <Search 
              size={20} 
              style={{ 
                position: 'absolute', 
                left: '1.25rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'var(--gold-primary)' 
              }} 
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search our hair collection (e.g. Bone Straight, Curly Frontal)..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (activeView !== 'shop') {
                  setActiveView('shop');
                }
              }}
              style={{
                width: '100%',
                background: 'var(--bg-form-input)',
                border: '1px solid var(--border-navbar)',
                color: 'var(--text-color-input)',
                padding: '0.9rem 1.5rem 0.9rem 3.5rem',
                fontSize: '1rem',
                borderRadius: '50px',
                outline: 'none',
                boxShadow: 'var(--shadow-sm)'
              }}
              id="navbar-search-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '1.25rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-cream-muted)',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* CSS Injection for Navigation responsiveness & Marquee looping */}
      <style>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @media (max-width: 1024px) {
          .desktop-nav, .btn-book-nav {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: flex !important;
          }
        }
      `}</style>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'var(--burgundy-dark)',
            zIndex: 850,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.5rem',
            padding: '2rem',
            animation: 'fadeIn var(--transition-fast) forwards'
          }}
          id="mobile-menu-drawer"
        >
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ position: 'absolute', top: '5rem', right: '2.5rem', background: 'none', border: 'none', color: 'var(--cream-primary)', cursor: 'pointer' }}
          >
            <X size={28} />
          </button>
          
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'var(--font-serif)',
                fontSize: '1.6rem',
                color: activeView === link.id && !adminMode ? 'var(--gold-primary)' : 'var(--cream-primary)',
                cursor: 'pointer',
                transition: 'color var(--transition-fast)'
              }}
              id={`mobile-nav-link-${link.id}`}
            >
              {link.label}
            </button>
          ))}

          {currentUser ? (
            <button
              onClick={() => { setIsMobileMenuOpen(false); openAuthModal(); }}
              className="btn btn-secondary"
              style={{ width: '200px', marginTop: '1rem' }}
            >
              VIP: {currentUser.name.split(' ')[0]}
            </button>
          ) : (
            <button
              onClick={() => { setIsMobileMenuOpen(false); openAuthModal(); }}
              className="btn btn-secondary"
              style={{ width: '200px', marginTop: '1rem' }}
            >
              Log In / Register
            </button>
          )}
          
          <button
            onClick={() => handleNavClick('booking')}
            className="btn btn-primary"
            style={{ width: '200px' }}
            id="mobile-nav-book-btn"
          >
            Book Appointment
          </button>
        </div>
      )}
    </>
  );
}
