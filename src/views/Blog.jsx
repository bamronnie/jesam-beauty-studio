import React, { useState } from 'react';
import { Calendar, User, Clock, ArrowLeft, ArrowRight } from 'lucide-react';

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState(null);

  const posts = [
    {
      id: 1,
      title: '5 Ways to Maintain Your Bone Straight Wig Like a Pro',
      summary: 'Keep your bone straight hair extension sleek, smooth, and tangle-free with these essential maintenance tips from Abuja master stylists.',
      content: `
        <p>Bone straight hair is one of the most sought-after hair extensions in Nigeria. Whether it is Vietnamese or Cambodian Remy hair, maintaining the glossy luster requires a careful routine. Here are 5 tips to keep your bone straight wigs looking freshly styled:</p>
        
        <h3>1. Limit Heat Application</h3>
        <p>While bone straight hair can handle high heat, flat ironing it daily will eventually dry out the cuticles, leading to split ends. Always apply a quality silicon-based heat protection serum before styling. Limit flat ironing to once or twice a week.</p>
        
        <h3>2. Use the Right Washing Products</h3>
        <p>When washing your extensions, avoid heavy shampoos containing sulfates. Sulfates strip the hair of its artificial moisture. Instead, opt for mild, hydrating organic shampoos and follow up with a rich conditioner. Leave the conditioner on for 15-20 minutes before rinsing with cold water.</p>
        
        <h3>3. Air Dry Instead of Blow Drying</h3>
        <p>Heat from blow dryers can introduce frizz. After washing, gently squeeze out excess water with a microfiber towel and lay the wig flat on a drying stand in a well-ventilated room. Allow it to air dry completely before combing.</p>
        
        <h3>4. Wrap Your Hair at Night</h3>
        <p>If you wear your wig sewn-in or sleep with it on, secure it with a silk or satin bonnet. Standard cotton pillowcases absorb moisture and generate friction, which causes tangles and frizz. Wrapping it keeps the straightness locked in.</p>
        
        <h3>5. Brush with a Wide-Tooth Comb</h3>
        <p>Always comb or brush your straight hair starting from the tips and working your way up to the roots. Use a paddle brush or a wide-tooth comb to avoid pulling hair strands out of the weft bundle.</p>
      `,
      date: 'June 18, 2026',
      author: 'Amara Nwachukwu',
      readTime: '4 mins read',
      img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=500'
    },
    {
      id: 2,
      title: 'The Ultimate Guide to Knotless Braids Scalp Care',
      summary: 'Protect your edges and relieve scalp tension with this complete hydration guide for goddess and traditional knotless braids.',
      content: `
        <p>Knotless braids are highly popular because they place less tension on the hair root compared to traditional box braids. However, your scalp is still exposed, and neglecting it can lead to dandruff, itching, and hair breakage. Here is how to keep your scalp healthy while wearing braids:</p>
        
        <h3>1. Keep Your Scalp Hydrated</h3>
        <p>Your scalp needs moisture just like your skin. Use a light, water-based leave-in conditioner spray or a mix of water and essential oils (like tea tree or peppermint) to spray your scalp every other day. Avoid heavy pomades that clog pores.</p>
        
        <h3>2. Wash Your Braids Gently</h3>
        <p>Yes, you can wash your braids! If you plan to keep them in for more than 4 weeks, wash them in the third week. Mix sulfate-free shampoo with water in a spray bottle, spray directly onto your parting lines, gently massage, and rinse thoroughly. Dry completely to avoid damp odors.</p>
        
        <h3>3. Oil Your Scalp to Seal Moisture</h3>
        <p>After spraying water-based hydraters, seal it in with a light oil like jojoba, almond, or argan oil. Apply it directly along your parts. Tea tree oil is excellent if you suffer from dry scalp or itching.</p>
        
        <h3>4. Wear a Satin Scarf at Night</h3>
        <p>Friction from cotton bedding ruins the neatness of your braids and dries your scalp. Tie down your edges with a satin or silk scarf and gather the length of your braids in a satin bonnet.</p>
      `,
      date: 'June 12, 2026',
      author: 'Bisi Adebayo',
      readTime: '5 mins read',
      img: 'https://images.unsplash.com/photo-1605497746444-ac9dbd39d675?q=80&w=500'
    },
    {
      id: 3,
      title: 'Why HD Lace Closures Are Worth the Investment',
      summary: 'Understand the difference between Swiss lace, transparent lace, and HD lace to choose the best hairline for your next wig unit install.',
      content: `
        <p>Choosing the right lace closure is critical to how natural your wig installation looks. Many clients are confused by the pricing difference between Transparent lace and HD lace. Here is why HD (High Definition) lace is worth the extra investment:</p>
        
        <h3>1. Unmatched Hairline Blending</h3>
        <p>HD lace is the thinnest, softest, and most delicate lace material available. When placed against the scalp, it melts completely, becoming virtually invisible. It mimics a natural hairline without needing heavy layers of concealer or makeup.</p>
        
        <h3>2. Suitable for All Skin Tones</h3>
        <p>Transparent lace often requires tinting sprays or powders to match deeper African skin tones. HD lace is so thin and transparent that it adapts naturally to any skin tone, from very light to rich dark complexions, without tinting.</p>
        
        <h3>3. Flawless Photographic Finish</h3>
        <p>Under professional lighting or outdoor sunlight, transparent lace can sometimes produce a white cast or reflection. HD lace absorbs light naturally, guaranteeing a seamless look in photos and videos, which is why it is preferred for weddings and special events.</p>
      `,
      date: 'May 28, 2026',
      author: 'Chidi Okafor',
      readTime: '3 mins read',
      img: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=500'
    }
  ];

  return (
    <section 
      style={{
        background: 'var(--burgundy-dark)',
        borderTop: '1px solid var(--border-light)'
      }}
      id="blog-section"
    >
      <div className="container">
        {!selectedPost ? (
          /* List Mode */
          <div>
            {/* Title */}
            <div className="section-header">
              <span className="section-tag">Blog & Tips</span>
              <h2 className="section-title">Jesam Hair Care Guides</h2>
              <p className="section-desc">
                Expert advice, tips, and tutorials on maintaining extensions, caring for wigs, and keeping your scalp healthy.
              </p>
            </div>

            {/* Grid list of posts */}
            <div className="grid-cols-3" id="blog-posts-grid">
              {posts.map((post) => (
                <div 
                  key={post.id} 
                  className="glass-card"
                  style={{ 
                    padding: '0', 
                    overflow: 'hidden', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between' 
                  }}
                >
                  <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
                    <img src={post.img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  
                  <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--gold-primary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={12} />
                        {post.date}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 
                      style={{ 
                        fontSize: '1.25rem', 
                        fontFamily: 'var(--font-serif)', 
                        color: 'var(--cream-primary)',
                        lineHeight: '1.4',
                        cursor: 'pointer' 
                      }}
                      onClick={() => setSelectedPost(post)}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold-primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--cream-primary)'}
                    >
                      {post.title}
                    </h3>
                    
                    <p style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'var(--text-cream-muted)' }}>
                      {post.summary}
                    </p>

                    <button
                      onClick={() => setSelectedPost(post)}
                      className="btn-text"
                      style={{ alignSelf: 'flex-start', marginTop: 'auto' }}
                      id={`read-article-btn-${post.id}`}
                    >
                      Read Article
                      <ArrowRight size={14} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Read Mode */
          <div 
            style={{ 
              maxWidth: '800px', 
              margin: '0 auto', 
              animation: 'slideUp 0.4s ease forwards' 
            }}
            id="blog-post-detail"
          >
            {/* Back Button */}
            <button
              onClick={() => setSelectedPost(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gold-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: '2.5rem'
              }}
              id="blog-back-btn"
            >
              <ArrowLeft size={16} />
              Back to Articles
            </button>

            {/* Post Header */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div 
                style={{ 
                  display: 'flex', 
                  gap: '1.5rem', 
                  fontSize: '0.8rem', 
                  color: 'var(--gold-primary)', 
                  marginBottom: '1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                <span>By {selectedPost.author}</span>
                <span>•</span>
                <span>{selectedPost.date}</span>
                <span>•</span>
                <span>{selectedPost.readTime}</span>
              </div>
              <h1 
                style={{ 
                  fontSize: '2.8rem', 
                  fontFamily: 'var(--font-serif)', 
                  color: 'var(--cream-primary)',
                  lineHeight: '1.2',
                  marginBottom: '1.5rem'
                }}
              >
                {selectedPost.title}
              </h1>
            </div>

            {/* Main Featured Image */}
            <div 
              style={{ 
                height: '420px', 
                borderRadius: 'var(--border-radius-md)', 
                overflow: 'hidden', 
                border: '1px solid var(--border-medium)',
                marginBottom: '3rem'
              }}
            >
              <img src={selectedPost.img} alt={selectedPost.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* Post Content Body */}
            <div 
              className="blog-content-body"
              dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              style={{
                fontSize: '1.1rem',
                lineHeight: '1.8',
                color: 'var(--text-cream-muted)',
                fontWeight: 300
              }}
            />
            
            {/* Inject CSS to style inner HTML elements elegantly */}
            <style>{`
              .blog-content-body p {
                margin-bottom: 1.5rem;
                color: var(--text-cream-muted);
              }
              .blog-content-body h3 {
                color: var(--gold-primary);
                font-size: 1.5rem;
                font-family: var(--font-serif);
                margin: 2rem 0 1rem 0;
                font-weight: 500;
              }
              @media (max-width: 900px) {
                #blog-posts-grid {
                  grid-template-columns: 1fr !important;
                  gap: 1.5rem !important;
                }
              }
            `}</style>
          </div>
        )}
      </div>
    </section>
  );
}
