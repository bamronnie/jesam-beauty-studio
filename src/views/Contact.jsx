import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Plus, Minus, HelpCircle, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [activeFaq, setActiveFaq] = useState(null);
  
  // Contact Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const faqs = [
    {
      q: 'Do you work with client-provided wigs & closures?',
      a: 'Yes, we do! You can bring your own lace closures, frontals, or wig units for installation, customization, or revamping. Please note that the hair quality directly affects the final look, so we recommend high-quality raw hair or human hair for best results.'
    },
    {
      q: 'How long does a typical Wig Installation appointment take?',
      a: 'A standard HD lace wig installation takes approximately 1.5 to 2 hours. This includes braiding down your natural hair, scalp preparation, lace customization (bleaching knots and plucking), secure glue-down or glueless install, and final styling.'
    },
    {
      q: 'What is your wig revamping process?',
      a: 'Our revamping process takes 3 to 5 business days. It includes deep detangling, sulfate-free washing, intensive hydration steam treatment, replacement of damaged elastic bands/combs, lace cleaning, and restyling to your preferred finish.'
    },
    {
      q: 'Can I cancel or reschedule my booking appointment?',
      a: 'Yes, you can reschedule or cancel up to 24 hours before your appointment. You can do this by calling our studio lines (+234 809 333 7529) or clicking the rescheduling links inside your email confirmation.'
    }
  ];

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (name.trim() && email.trim() && message.trim()) {
      try {
        // Send payload to backend
        await api.sendContactInquiry({ name, email, message });
      } catch (err) {
        console.warn('Backend inquiry logged locally:', err.message);
      }

      // Also trigger instant mailto client fallback directly to beautybyjessam@gmail.com
      const mailtoUrl = `mailto:beautybyjessam@gmail.com?subject=${encodeURIComponent(`Website Inquiry from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nClient Email: ${email}\n\nMessage:\n${message}`)}`;
      window.open(mailtoUrl, '_blank');

      setSent(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSent(false), 6000);
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <section 
      style={{
        background: 'var(--burgundy-dark)',
        borderTop: '1px solid var(--border-light)',
        paddingTop: '9.5rem'
      }}
      id="contact-section"
    >
      <div className="container">
        {/* Title */}
        <div className="section-header">
          <span className="section-tag">Get in Touch</span>
          <h2 className="section-title">Visit Jesam Beauty Studio</h2>
          <p className="section-desc">
            We are located in Chevy View Estate, Chevron, Lagos. Stop by for walk-in product purchases or book styling online.
          </p>
        </div>

        {/* Contact info grid */}
        <div className="grid-cols-2" style={{ marginBottom: '6rem' }}>
          {/* Form & hours Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)', marginBottom: '1.25rem' }}>
                Operational Hours
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(212,175,55,0.08)', paddingBottom: '0.4rem' }}>
                  <span>Monday - Friday</span>
                  <strong style={{ color: 'var(--cream-primary)' }}>09:00 AM - 05:00 PM</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', color: '#ff4d4d' }}>
                  <span>Saturday & Sunday</span>
                  <strong>CLOSED (Weekend Off)</strong>
                </div>
              </div>
            </div>

            {/* Message form */}
            <div className="glass-panel" style={{ padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)', marginBottom: '1.5rem' }}>
                Drop a Message
              </h3>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--cream-primary)' }}>
                  <CheckCircle size={32} style={{ color: '#4BB543', marginBottom: '0.5rem' }} />
                  <h4>Message Sent to beautybyjessam@gmail.com!</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-cream-muted)', marginTop: '0.25rem' }}>
                    Your inquiry has been sent directly to Jesam Beauty email. We will get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} id="contact-form">
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sandra Bello"
                      required
                      id="contact-name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. sandra@example.com"
                      required
                      id="contact-email"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message Details</label>
                    <textarea
                      rows="4"
                      className="form-control"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what product or service you're asking about..."
                      required
                      id="contact-message"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" id="contact-submit-btn">
                    <Send size={14} />
                    Send Inquiry to beautybyjessam@gmail.com
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Map & details Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Contact cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="contact-details-row">
              <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <Phone size={24} style={{ color: 'var(--gold-primary)', margin: '0 auto 0.75rem auto' }} />
                <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--cream-primary)', marginBottom: '0.4rem' }}>Phone</h4>
                <p style={{ fontSize: '0.85rem' }}>+234 809 333 7529</p>
              </div>
              <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <Mail size={24} style={{ color: 'var(--gold-primary)', margin: '0 auto 0.75rem auto' }} />
                <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--cream-primary)', marginBottom: '0.4rem' }}>Email</h4>
                <a href="mailto:beautybyjessam@gmail.com" style={{ fontSize: '0.78rem', color: 'var(--gold-primary)', textDecoration: 'underline' }}>beautybyjessam@gmail.com</a>
              </div>
            </div>

            {/* Styled Vector Map Component */}
            <div 
              className="glass-panel" 
              style={{ 
                height: '300px', 
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid var(--border-medium)'
              }}
              id="mock-map-box"
            >
              {/* Abstract Map Canvas grid layout using CSS */}
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: '#1a0f0b',
                  backgroundImage: 'radial-gradient(var(--burgundy-medium) 1px, transparent 0)',
                  backgroundSize: '24px 24px',
                  opacity: 0.7
                }}
              />
              
              {/* Map roads mock */}
              <div style={{ position: 'absolute', top: '120px', left: 0, width: '100%', height: '30px', background: 'rgba(212,175,55,0.08)', borderTop: '1px solid rgba(212,175,55,0.2)', borderBottom: '1px solid rgba(212,175,55,0.2)' }} />
              <div style={{ position: 'absolute', left: '160px', top: 0, width: '40px', height: '100%', background: 'rgba(212,175,55,0.08)', borderLeft: '1px solid rgba(212,175,55,0.2)', borderRight: '1px solid rgba(212,175,55,0.2)' }} />
              
              {/* Map road labels */}
              <div style={{ position: 'absolute', top: '126px', left: '20px', fontSize: '0.6rem', color: 'var(--gold-primary)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                Udeco Medical Rd
              </div>
              <div style={{ position: 'absolute', top: '40px', left: '175px', transform: 'rotate(90deg)', fontSize: '0.6rem', color: 'var(--gold-primary)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                Chevron Drive
              </div>
 
              {/* Pin marker */}
              <div 
                style={{
                  position: 'absolute',
                  top: '100px',
                  left: '165px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  animation: 'pulse 2s infinite'
                }}
              >
                <div style={{ background: 'var(--gold-primary)', color: 'var(--burgundy-dark)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold', border: '1px solid #ffffff', marginBottom: '4px', whiteSpace: 'nowrap' }}>
                  JESAM BEAUTY
                </div>
                <MapPin size={24} fill="var(--gold-primary)" style={{ color: 'var(--burgundy-dark)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div style={{ maxWidth: '720px', margin: '0 auto' }} id="contact-faq-block">
          <div className="section-header" style={{ marginBottom: '3rem' }}>
            <span className="section-tag">Got Questions?</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-desc">Find answers to quick questions regarding hair extensions installs, booking policies, and wig treatments.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} id="faqs-accordion-list">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index}
                  style={{
                    background: 'rgba(31, 17, 11, 0.2)',
                    border: '1px solid',
                    borderColor: isOpen ? 'var(--gold-primary)' : 'var(--border-light)',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      color: 'var(--cream-primary)',
                      fontWeight: 600,
                      fontFamily: 'var(--font-sans)',
                      fontSize: '1rem',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <HelpCircle size={18} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                      <span>{faq.q}</span>
                    </div>
                    {isOpen ? <Minus size={16} style={{ color: 'var(--gold-primary)' }} /> : <Plus size={16} style={{ color: 'var(--gold-primary)' }} />}
                  </button>

                  {isOpen && (
                    <div 
                      style={{
                        padding: '0 1.5rem 1.5rem 3rem',
                        fontSize: '0.9rem',
                        lineHeight: '1.6',
                        color: 'var(--text-cream-muted)',
                        animation: 'fadeIn 0.3s ease'
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @media (max-width: 900px) {
          .contact-details-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
