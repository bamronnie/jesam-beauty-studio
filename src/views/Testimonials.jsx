import React, { useState } from 'react';
import { Star, MessageSquare, Check, User } from 'lucide-react';

export default function Testimonials({ initialReviews = [], onAddReview }) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [service, setService] = useState('HD Wig Install');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const defaultReviews = [
    {
      id: 1,
      name: 'Halima Ibrahim',
      rating: 5,
      service: 'HD Wig Install',
      comment: 'Amara is absolute magic! The lace melt is so flawless. People literally think this is my real scalp. Worth every single Naira!',
      date: 'June 18, 2026'
    },
    {
      id: 2,
      name: 'Chioma Onyeka',
      rating: 5,
      service: 'Knotless Braids',
      comment: 'Bisi is super fast and neat. Usually my scalp hurts after braids, but her knotless goddess braids are so light and comfortable. Highly recommend!',
      date: 'June 10, 2026'
    },
    {
      id: 3,
      name: 'Funmi Alao',
      rating: 4,
      service: 'Wig Revamping',
      comment: 'Sent my 2-year old wig for revamping and it came back looking brand new and smelling amazing. Styling curls were perfect.',
      date: 'May 24, 2026'
    }
  ];

  const reviews = initialReviews.length > 0 ? initialReviews : defaultReviews;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      alert('Please fill out name and comment.');
      return;
    }

    const newReview = {
      id: Date.now(),
      name,
      rating,
      service,
      comment,
      date: new Date().toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    };

    onAddReview(newReview);
    setSubmitted(true);
    setName('');
    setComment('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section 
      style={{
        background: 'var(--burgundy-dark)',
        borderTop: '1px solid var(--border-light)'
      }}
      id="testimonials-section"
    >
      <div className="container">
        {/* Title */}
        <div className="section-header">
          <span className="section-tag">Client Reviews</span>
          <h2 className="section-title">What Our Queens Say</h2>
          <p className="section-desc">
            We are committed to providing quality hair care. Here are genuine reviews from our loyal Jesam Beauty clientele in Lagos.
          </p>
        </div>

        {/* Layout: Left Column = Reviews List, Right Column = Write Review */}
        <div className="grid-cols-2" style={{ alignItems: 'start' }} id="testimonials-grid">
          {/* Reviews list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} id="testimonials-list">
            {reviews.map((rev) => (
              <div key={rev.id} className="glass-card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div 
                      style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        background: 'rgba(212, 175, 55, 0.1)', 
                        border: '1px solid var(--border-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--gold-primary)'
                      }}
                    >
                      <User size={18} />
                    </div>
                    <div>
                      <h4 style={{ color: 'var(--cream-primary)', fontWeight: 600 }}>{rev.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', background: 'rgba(212, 175, 55, 0.1)', padding: '0.1rem 0.5rem', borderRadius: '2px' }}>
                        Verified client
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-cream-muted)' }}>{rev.date}</span>
                </div>

                {/* Rating Stars */}
                <div style={{ display: 'flex', color: 'var(--gold-primary)', gap: '0.15rem', marginBottom: '0.75rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < rev.rating ? 'currentColor' : 'none'} />
                  ))}
                </div>

                <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-cream-muted)', marginBottom: '0.5rem' }}>
                  "{rev.comment}"
                </p>
                <div style={{ fontSize: '0.8rem', color: 'var(--gold-primary)' }}>
                  Service styled: <strong>{rev.service}</strong>
                </div>
              </div>
            ))}
          </div>

          {/* Add Review card */}
          <div 
            className="glass-panel" 
            style={{ 
              padding: '2.5rem', 
              position: 'sticky', 
              top: '100px',
              border: '1px solid var(--border-medium)'
            }}
            id="testimonial-submit-panel"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <MessageSquare size={20} style={{ color: 'var(--gold-primary)' }} />
              <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: 'var(--cream-primary)' }}>
                Share Your Experience
              </h3>
            </div>

            {submitted ? (
              <div 
                style={{ 
                  background: 'rgba(75, 181, 67, 0.15)', 
                  border: '1px solid #4BB543', 
                  borderRadius: '6px', 
                  padding: '1.5rem', 
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: 'var(--cream-primary)'
                }}
              >
                <Check size={32} style={{ color: '#4BB543' }} />
                <h4 style={{ fontWeight: 600 }}>Review Submitted!</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-cream-muted)' }}>
                  Thank you for sharing your feedback with the Jesam Beauty community. Your review helps us maintain our high quality standards.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} id="review-submission-form">
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Sandra Bello"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    id="review-name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Service Received</label>
                  <select
                    className="form-control"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    id="review-service"
                  >
                    <option value="HD Wig Install">HD Lace Wig Install</option>
                    <option value="Knotless Braids">Knotless Goddess Braids</option>
                    <option value="Wig Revamping">Wig Revamping & Cust</option>
                    <option value="Silk Press">Silk Press Treatment</option>
                    <option value="Weave Sew-in">Traditional Sew-In Weave</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Star Rating</label>
                  <div style={{ display: 'flex', gap: '0.4rem' }} id="review-star-rating-buttons">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: star <= rating ? 'var(--gold-primary)' : 'var(--border-medium)',
                          cursor: 'pointer',
                          padding: '0.2rem'
                        }}
                      >
                        <Star size={24} fill={star <= rating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Review Comment</label>
                  <textarea
                    rows="4"
                    className="form-control"
                    placeholder="Tell us about the hair quality, service style, atmosphere..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    id="review-comment"
                  />
                </div>

                <button type="submit" className="btn btn-primary" id="review-submit-btn">
                  Publish Review
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #testimonials-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          #testimonial-submit-panel {
            position: relative !important;
            top: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
