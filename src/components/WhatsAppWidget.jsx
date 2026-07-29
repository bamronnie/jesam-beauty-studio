import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '2348093337529'; // Jesam Beauty Studio WhatsApp number

  const quickMessages = [
    { label: '👑 Inquire about a Wig / Bundle', text: 'Hello Jesam Beauty! I would like to inquire about your Raw Human Hair wigs and bundles.' },
    { label: '📅 Book Styling Appointment', text: 'Hello Jesam Beauty! I would like to book a salon appointment for wig installation/styling.' },
    { label: '🚚 Custom Order & Delivery', text: 'Hello Jesam Beauty! I would like to place a custom wig order for delivery.' }
  ];

  const handleOpenWhatsApp = (customText) => {
    const defaultText = customText || 'Hello Jesam Beauty Studio! I am visiting your website and need assistance with hair products & styling services.';
    const encodedText = encodeURIComponent(defaultText);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 999 }} id="whatsapp-widget-container">
      {/* Expanded Luxury Chat Box Card */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '4.5rem',
            right: 0,
            width: '340px',
            background: 'linear-gradient(145deg, var(--burgundy-deep) 0%, var(--burgundy-dark) 100%)',
            border: '1px solid var(--gold-primary)',
            borderRadius: '16px',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
            overflow: 'hidden',
            animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          id="whatsapp-chat-popup"
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              color: '#ffffff',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  color: '#128C7E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
              >
                JB
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>Jesam Beauty Studio</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', opacity: 0.9 }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00ff88', display: 'inline-block' }}></span>
                  <span>Online • Instant Reply</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#ffffff',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Body Content */}
          <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                background: 'rgba(18, 1, 4, 0.6)',
                border: '1px solid var(--border-light)',
                borderRadius: '10px',
                padding: '1rem',
                fontSize: '0.85rem',
                color: 'var(--cream-primary)',
                lineHeight: '1.5'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gold-primary)', fontWeight: 'bold', marginBottom: '0.3rem' }}>
                <Sparkles size={14} />
                <span>Hi Queen! 👋</span>
              </div>
              Welcome to Jesam Beauty Studio! How can we assist your hair & styling needs today? Click any option below to chat directly with our stylists on WhatsApp.
            </div>

            {/* Quick Action Pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {quickMessages.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOpenWhatsApp(item.text)}
                  style={{
                    background: 'rgba(212, 175, 55, 0.08)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--cream-primary)',
                    padding: '0.65rem 0.9rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(37, 211, 102, 0.15)';
                    e.currentTarget.style.borderColor = '#25D366';
                    e.currentTarget.style.color = '#25D366';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(212, 175, 55, 0.08)';
                    e.currentTarget.style.borderColor = 'var(--border-light)';
                    e.currentTarget.style.color = 'var(--cream-primary)';
                  }}
                >
                  <span>{item.label}</span>
                  <Send size={12} />
                </button>
              ))}
            </div>

            {/* Direct Start Chat Button */}
            <button
              onClick={() => handleOpenWhatsApp()}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.35)',
                marginTop: '0.25rem'
              }}
            >
              <MessageCircle size={18} />
              <span>Start Direct WhatsApp Chat</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          color: '#ffffff',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: '50px',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          boxShadow: '0 8px 25px rgba(37, 211, 102, 0.45)',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.04)';
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(37, 211, 102, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.45)';
        }}
        id="whatsapp-trigger-btn"
      >
        {/* Pulse Dot */}
        <span
          style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#00ff88',
            border: '2px solid #ffffff',
            boxShadow: '0 0 8px #00ff88'
          }}
        />

        <MessageCircle size={22} />
        <span style={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.3px' }}>
          {isOpen ? 'Close Chat' : 'Chat on WhatsApp'}
        </span>
      </button>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
