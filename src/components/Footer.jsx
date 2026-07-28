import React, { useState } from 'react';
import { Mail, Phone, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Footer({ setActiveView, setAdminMode }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const navigateTo = (viewId) => {
    setAdminMode(false);
    setActiveView(viewId);
    window.scrollTo(0, 0);
  };

  return (
    <footer 
      style={{
        background: 'var(--bg-footer)',
        borderTop: '1px solid var(--border-light)',
        padding: '5rem 0 2rem 0',
        color: 'var(--cream-primary)'
      }}
      id="app-footer"
    >
      <div className="container">
        {/* Footer Top Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr 1fr 1.2fr',
            gap: '3rem',
            marginBottom: '4rem'
          }}
          className="footer-grid"
        >
          {/* Column 1: Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-start',
                cursor: 'pointer',
                gap: '4px'
              }}
              onClick={() => navigateTo('home')}
            >
              <img 
                src={logoImg} 
                alt="Jesam Beauty Emblem" 
                style={{ 
                  height: '75px', 
                  width: 'auto',
                  display: 'block'
                }} 
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0px' }}>
                <span style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--cream-primary)',
                  lineHeight: 1.1
                }}>
                  Jesam
                </span>
                <span style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: '0.72rem',
                  fontWeight: '600',
                  letterSpacing: '0.38em',
                  textTransform: 'uppercase',
                  color: 'var(--gold-primary)',
                  lineHeight: 1,
                  paddingLeft: '0.38em',
                  marginTop: '2px'
                }}>
                  Beauty
                </span>
              </div>
            </div>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-cream-muted)' }}>
              Jesam Beauty is a premier luxury salon offering curated extensions, custom wigs, revamping, and expert hair care styling in Chevy View Estate, Chevron, Lagos.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }} id="social-icons">
              {[
                { 
                  icon: (
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  ), 
                  href: 'https://instagram.com/jesambeauty' 
                },
                { 
                  icon: (
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  ), 
                  href: 'https://facebook.com/jesambeauty' 
                },
                { 
                  icon: (
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  ), 
                  href: 'https://twitter.com/jesambeauty' 
                }
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-cream-muted)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--gold-primary)';
                    e.currentTarget.style.color = 'var(--gold-primary)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-light)';
                    e.currentTarget.style.color = 'var(--text-cream-muted)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h4 style={{ color: 'var(--gold-primary)', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Explore
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem' }}>
              {[
                { id: 'home', label: 'Home' },
                { id: 'services', label: 'Services' },
                { id: 'shop', label: 'Shop Hair' },
                { id: 'contact', label: 'Contact' }
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => navigateTo(link.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-cream-muted)',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      padding: 0
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-cream-muted)'}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Location */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h4 style={{ color: 'var(--gold-primary)', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Salon Info
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-cream-muted)' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <MapPin size={18} style={{ color: 'var(--gold-primary)', flexShrink: 0, marginTop: '2px' }} />
                <span>11 Udeco medical road, Chevy View Estate, Chevron, Lagos, Nigeria</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Phone size={16} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                <span>+234 809 333 7529</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Mail size={16} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                <span>hello@jesambeauty.com</span>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h4 style={{ color: 'var(--gold-primary)', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Jesam Newsletter
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-cream-muted)', lineHeight: '1.5' }}>
              Subscribe to receive updates on new wig drops, hair care tips, and exclusive studio discounts.
            </p>
            {subscribed ? (
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  color: '#4BB543', 
                  fontSize: '0.9rem',
                  padding: '0.5rem 0'
                }}
              >
                <CheckCircle2 size={18} />
                <span>Thank you! Check your inbox soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', position: 'relative' }} id="newsletter-form">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(18, 1, 4, 0.6)',
                    border: '1px solid var(--border-light)',
                    padding: '0.8rem 3rem 0.8rem 1rem',
                    color: 'var(--cream-primary)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.85rem',
                    borderRadius: '4px',
                    outline: 'none'
                  }}
                  id="newsletter-email"
                />
                <button
                  type="submit"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    height: '100%',
                    background: 'var(--gold-primary)',
                    border: 'none',
                    borderRadius: '0 4px 4px 0',
                    color: 'var(--burgundy-dark)',
                    width: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  id="newsletter-submit-btn"
                >
                  <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Bottom Row */}
        <div 
          style={{
            borderTop: '1px solid rgba(212, 175, 55, 0.1)',
            paddingTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8rem',
            color: 'var(--text-cream-muted)'
          }}
          className="footer-bottom"
        >
          <span>&copy; {new Date().getFullYear()} Jesam Beauty. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('contact')}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('contact')}>Terms & Conditions</span>
            <span 
              style={{ cursor: 'pointer', color: 'var(--gold-primary)' }} 
              onClick={() => { setAdminMode(true); window.scrollTo(0, 0); }}
            >
              Staff Portal
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2.5rem !important;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
