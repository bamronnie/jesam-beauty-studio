import React from 'react';
import { Award, Heart, Shield, Star } from 'lucide-react';

export default function About() {
  const team = [
    {
      name: 'Amara Nwachukwu',
      role: 'Master Stylist & Founder',
      specialty: 'Wig Installs & Color Customization',
      rating: 4.9,
      reviews: 142,
      img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400'
    },
    {
      name: 'Bisi Adebayo',
      role: 'Senior Braiding Artist',
      specialty: 'Knotless & Goddess Braids',
      rating: 4.8,
      reviews: 98,
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400'
    },
    {
      name: 'Chidi Okafor',
      role: 'Revamping & Treatment Expert',
      specialty: 'Hair Revamping & Scalp Care',
      rating: 4.9,
      reviews: 76,
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400'
    }
  ];

  return (
    <section 
      style={{
        background: 'var(--burgundy-dark)',
        borderTop: '1px solid var(--border-light)'
      }}
      id="about-section"
    >
      <div className="container">
        {/* Brand Story block */}
        <div className="grid-cols-2" style={{ alignItems: 'center', marginBottom: '6rem' }}>
          <div>
            <span className="section-tag">Our Legacy</span>
            <h2 className="section-title" style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>
              Redefining Hair Services in Lagos
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
              <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--text-cream-muted)' }}>
                Founded in 2024 in Lagos, Jesam Beauty emerged from a simple vision: to create a sanctuary where beauty meets craftsmanship. We believe your hair is your crown, and styling is an art form.
              </p>
              <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--text-cream-muted)' }}>
                We source only the finest 100% authentic Remy human hair wigs and extensions. Our salon is built on the values of absolute client comfort, uncompromising quality, and the mastery of modern hair trends. From bone straight installations to intricate custom braiding, our mission is to ensure every client leaves feeling crowned, confident, and beautiful.
              </p>
            </div>
          </div>

          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div 
              style={{
                width: '100%',
                maxWidth: '440px',
                height: '400px',
                borderRadius: 'var(--border-radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--border-medium)',
                boxShadow: 'var(--shadow-burgundy)'
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600" 
                alt="Jesam Beauty Studio Inside View" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* Brand Values cards */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '2rem',
            marginBottom: '6rem'
          }}
          className="values-grid"
        >
          {[
            { 
              icon: <Award size={28} />, 
              title: 'High-Quality Materials Only', 
              desc: 'We strictly source 100% Remy human hair. Our wigs and extensions undergo rigid quality tests to guarantee natural bounce, minimal shedding, and longevity.' 
            },
            { 
              icon: <Heart size={28} />, 
              title: 'Client-Centric Care', 
              desc: 'From a warm beverage menu to relaxing wash sections, every moment of your Jesam Beauty experience is curated to feel relaxed, welcoming, and personalized.' 
            },
            { 
              icon: <Shield size={28} />, 
              title: 'Guaranteed Craftsmanship', 
              desc: 'We back our installs and revamps with a styling guarantee. If you require any touchups, our specialists are committed to making it right.' 
            }
          ].map((val, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ color: 'var(--gold-primary)', marginBottom: '1.25rem' }}>{val.icon}</div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--cream-primary)', marginBottom: '0.75rem' }}>{val.title}</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>{val.desc}</p>
            </div>
          ))}
        </div>

        {/* Stylists Show section */}
        <div>
          <div className="section-header">
            <span className="section-tag">The Dream Team</span>
            <h2 className="section-title">Meet Our Master Stylists</h2>
            <p className="section-desc">Highly trained professionals dedicated to executing your vision with technical excellence.</p>
          </div>

          <div className="grid-cols-3" id="team-grid">
            {team.map((member, idx) => (
              <div 
                key={idx} 
                className="glass-card"
                style={{ 
                  padding: '1.5rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  textAlign: 'center' 
                }}
              >
                <div 
                  style={{
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid var(--border-medium)',
                    marginBottom: '1.5rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <img 
                    src={member.img} 
                    alt={member.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h4 style={{ fontSize: '1.25rem', color: 'var(--cream-primary)', marginBottom: '0.25rem' }}>{member.name}</h4>
                <div style={{ color: 'var(--gold-primary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05rem', marginBottom: '0.75rem' }}>
                  {member.role}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-cream-muted)', marginBottom: '1rem', minHeight: '40px' }}>
                  Specializes in: <strong>{member.specialty}</strong>
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--gold-primary)', fontSize: '0.85rem' }}>
                  <Star size={14} fill="currentColor" />
                  <span style={{ fontWeight: 'bold' }}>{member.rating}</span>
                  <span style={{ color: 'var(--text-cream-muted)' }}>({member.reviews} reviews)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .values-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          #team-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </section>
  );
}
