import React from 'react';
import { X, Ruler, HelpCircle } from 'lucide-react';

export default function LengthGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const guides = [
    { length: '12"', straight: 'Chin Level', wavy: 'Above Shoulder', curly: 'Ear/Jaw Line', look: 'Classic Bob' },
    { length: '14"', straight: 'Collarbone', wavy: 'Shoulder Level', curly: 'Chin Level', look: 'Lobed Bob' },
    { length: '16"', straight: 'Upper Chest', wavy: 'Collarbone', curly: 'Shoulder Level', look: 'Medium Chic' },
    { length: '18"', straight: 'Mid Chest', wavy: 'Upper Chest', curly: 'Collarbone', look: 'Standard Glam' },
    { length: '20"', straight: 'Lower Chest', wavy: 'Mid Chest', curly: 'Upper Chest', look: 'Elegant Back' },
    { length: '22"', straight: 'Waist Level', wavy: 'Lower Chest', curly: 'Mid Chest', look: 'Sleek Flow' },
    { length: '24"', straight: 'Mid Waist', wavy: 'Waist Level', curly: 'Lower Chest', look: 'Goddess Drop' },
    { length: '26"', straight: 'Hip Level', wavy: 'Mid Waist', curly: 'Waist Level', look: 'Super Drama' }
  ];

  return (
    <div className="modal-overlay" style={{ display: 'flex', zIndex: 1100 }} onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '640px', padding: '2.5rem', background: '#FFFFFF', color: '#1A0F0B' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="modal-close" 
          onClick={onClose} 
          style={{ color: '#1A0F0B' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
          <Ruler size={24} style={{ color: '#ff40cc' }} />
          <h2 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', color: '#1A0F0B' }}>
            Hair Length Guide
          </h2>
        </div>

        <p style={{ fontSize: '0.875rem', color: '#5E4E4A', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          Depending on the texture (Straight, Wavy, Curly), the same hair length might look different. 
          Use this chart as a standard representation of where each length will fall.
        </p>

        {/* Visual guide diagram or table */}
        <div style={{ overflowX: 'auto', border: '1px solid #EAE0D3', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#FAF6EE', borderBottom: '1px solid #EAE0D3' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#3E2723' }}>Length</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#3E2723' }}>Straight</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#3E2723' }}>Wavy</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#3E2723' }}>Curly</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#3E2723' }}>Style Look</th>
              </tr>
            </thead>
            <tbody>
              {guides.map((g, idx) => (
                <tr 
                  key={g.length} 
                  style={{ 
                    borderBottom: idx === guides.length - 1 ? 'none' : '1px solid #FAF6EE',
                    background: idx % 2 === 0 ? '#FFFFFF' : '#FCFAF6'
                  }}
                >
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold', color: '#ff40cc' }}>{g.length}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#1A0F0B' }}>{g.straight}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#1A0F0B' }}>{g.wavy}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#1A0F0B' }}>{g.curly}</td>
                  <td style={{ padding: '0.75rem 1rem', fontStyle: 'italic', color: '#5E4E4A' }}>{g.look}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', background: '#FFF0FA', border: '1px solid #FFD0F0', padding: '1rem', borderRadius: '6px', fontSize: '0.8rem', color: '#9E0A78' }}>
          <HelpCircle size={16} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
          <div>
            <strong>Expert Tip:</strong> Curly and wavy hair shrinks up slightly. We recommend choosing 2 inches longer than straight hair to achieve the same visual look!
          </div>
        </div>
      </div>
    </div>
  );
}
