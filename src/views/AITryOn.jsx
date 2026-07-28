import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Upload, ShoppingBag, RefreshCw, Plus, Minus, Move, Check, HelpCircle } from 'lucide-react';

export default function AITryOn({ addToCart, products = [] }) {
  // Preset models
  const modelPresets = [
    {
      id: 'm1',
      name: 'Amara (Oval Face)',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500'
    },
    {
      id: 'm2',
      name: 'Nneka (Round Face)',
      img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=500'
    },
    {
      id: 'm3',
      name: 'Zainab (Heart Face)',
      img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=500'
    }
  ];

  // Overlay wig assets - transparent illustrations or styled cutouts
  const wigOverlays = {
    p1: {
      name: '24" Bone Straight Double Drawn',
      // Transparent styled sleek hair layout
      hairStyleUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=500', 
      overlayColor: 'rgba(0,0,0,0.85)',
      // We will render a beautifully stylized absolute wig card or canvas overlay
      top: '12%',
      left: '18%',
      width: '64%',
      height: '80%',
      borderRadius: '50px 50px 0 0',
      boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
      opacity: 0.95
    },
    p2: {
      name: '18" HD Lace Front Curly',
      hairStyleUrl: 'https://images.unsplash.com/photo-1579613832125-5d34a13feb2a?q=80&w=500',
      overlayColor: 'rgba(50,20,10,0.9)',
      top: '15%',
      left: '12%',
      width: '76%',
      height: '75%',
      borderRadius: '60px 60px 40px 40px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
      opacity: 0.95
    },
    p3: {
      name: '3 Bundles Raw Virgin (Body Wave)',
      hairStyleUrl: 'https://images.unsplash.com/photo-1605497746444-ac9dbd39d675?q=80&w=500',
      overlayColor: 'rgba(25,15,5,0.92)',
      top: '14%',
      left: '15%',
      width: '70%',
      height: '78%',
      borderRadius: '55px 55px 20px 20px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.55)',
      opacity: 0.95
    }
  };

  const defaultWigs = [
    { id: 'p1', name: '24" Bone Straight Wig', price: 185000, category: 'wigs', img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=500' },
    { id: 'p2', name: '18" HD Lace Front Curly Wig', price: 140000, category: 'wigs', img: 'https://images.unsplash.com/photo-1579613832125-5d34a13feb2a?q=80&w=500' },
    { id: 'p3', name: '3 Bundles Raw Virgin Extensions', price: 120000, category: 'extensions', img: 'https://images.unsplash.com/photo-1605497746444-ac9dbd39d675?q=80&w=500' }
  ];

  const actualWigs = products.filter(p => p.category === 'wigs' || p.category === 'extensions').slice(0, 4);
  const wigOptions = actualWigs.length > 0 ? actualWigs : defaultWigs;

  // Simulator states
  const [selectedModel, setSelectedModel] = useState(modelPresets[0]);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [selectedWig, setSelectedWig] = useState(wigOptions[0]);
  
  // Scanning state
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('');
  const [simulationDone, setSimulationDone] = useState(false);

  // Manual positioning adjustments
  const [scale, setScale] = useState(1);
  const [translateY, setTranslateY] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  const fileInputRef = useRef(null);

  // Trigger local file upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedPhoto(url);
      setSelectedModel(null);
      setSimulationDone(false);
    }
  };

  const handlePresetSelect = (model) => {
    setSelectedModel(model);
    setUploadedPhoto(null);
    setSimulationDone(false);
  };

  // Run AI simulation simulation
  const startSimulation = () => {
    setIsScanning(true);
    setScanProgress(0);
    setSimulationDone(false);
  };

  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      setScanProgress(prev => {
        const next = prev + 5;
        
        // Progress labels
        if (next < 25) {
          setScanStatus('Analyzing facial structure and hairline limits...');
        } else if (next < 55) {
          setScanStatus('Matching skin tone and calibrating HD lace blend...');
        } else if (next < 85) {
          setScanStatus('Aligning parting depth and hairline density shadow...');
        } else {
          setScanStatus('Compiling high-resolution hair textures...');
        }

        if (next >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setSimulationDone(true);
          return 100;
        }
        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isScanning]);

  const activeImageSrc = uploadedPhoto || selectedModel?.img;

  const handleAddToCart = () => {
    if (selectedWig) {
      addToCart(selectedWig);
    }
  };

  // Reset offset values
  const resetWigOffsets = () => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
  };

  useEffect(() => {
    resetWigOffsets();
  }, [selectedWig]);

  return (
    <section 
      style={{
        background: 'var(--burgundy-dark)',
        borderTop: '1px solid var(--border-light)',
        paddingTop: '8rem'
      }}
      id="ai-tryon-section"
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">AI Wig Try-On</span>
          <h2 className="section-title">Virtual Hair Studio</h2>
          <p className="section-desc">
            Upload your selfie or choose a face shape, choose any wig, and instantly visualize how it fits your features.
          </p>
        </div>

        <div className="grid-cols-2" style={{ gap: '3rem', alignItems: 'stretch' }} id="tryon-view-grid">
          {/* LEFT: Simulation Display Panel */}
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center'
            }}
            id="tryon-display-card"
          >
            {/* Interactive Image Frame */}
            <div 
              style={{
                width: '100%',
                maxWidth: '440px',
                height: '460px',
                position: 'relative',
                borderRadius: 'var(--border-radius-md)',
                border: '1px solid var(--border-medium)',
                overflow: 'hidden',
                background: 'var(--burgundy-deep)',
                boxShadow: 'var(--shadow-lg)'
              }}
              id="tryon-canvas-container"
            >
              {/* Target Face Image */}
              {activeImageSrc && (
                <img 
                  src={activeImageSrc} 
                  alt="AI Try-on face model"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 1
                  }}
                  id="tryon-face-image"
                />
              )}

              {/* Grid outline if no face selected */}
              {!activeImageSrc && (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justify: 'center', color: 'var(--text-cream-muted)', padding: '2rem', textAlign: 'center' }}>
                  <Upload size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                  <span>Please choose a face model below or upload a custom photo to begin.</span>
                </div>
              )}

              {/* Scanning scan line overlay */}
              {isScanning && (
                <>
                  {/* Laser bar */}
                  <div 
                    style={{
                      position: 'absolute',
                      left: 0,
                      width: '100%',
                      height: '4px',
                      background: 'linear-gradient(90deg, transparent, var(--gold-light), transparent)',
                      boxShadow: '0 0 15px var(--gold-light), 0 0 5px var(--gold-primary)',
                      zIndex: 10,
                      top: `${scanProgress}%`,
                      transition: 'top 0.1s linear'
                    }} 
                  />
                  {/* Frosted scanning indicator overlay */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(123, 1, 5, 0.15)',
                      backdropFilter: 'blur(2px)',
                      zIndex: 5,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff'
                    }}
                  >
                    <RefreshCw className="animate-spin" size={32} style={{ color: 'var(--gold-primary)', marginBottom: '1rem' }} />
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                      Fitting Wig... {scanProgress}%
                    </span>
                    <p style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.5rem', textAlign: 'center', padding: '0 1.5rem', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                      {scanStatus}
                    </p>
                  </div>
                </>
              )}

              {/* Simulated wig rendering overlay */}
              {simulationDone && activeImageSrc && (
                <div 
                  style={{
                    position: 'absolute',
                    top: `calc(${wigOverlays[selectedWig.id]?.top || '15%'} + ${translateY}px)`,
                    left: `calc(${wigOverlays[selectedWig.id]?.left || '15%'} + ${translateX}px)`,
                    width: wigOverlays[selectedWig.id]?.width || '70%',
                    height: wigOverlays[selectedWig.id]?.height || '75%',
                    zIndex: 8,
                    transform: `scale(${scale})`,
                    transition: 'transform 0.1s ease, top 0.1s ease, left 0.1s ease',
                    pointerEvents: 'none',
                    overflow: 'hidden',
                    borderRadius: wigOverlays[selectedWig.id]?.borderRadius || '40px 40px 0 0',
                    boxShadow: wigOverlays[selectedWig.id]?.boxShadow || 'none'
                  }}
                  id="tryon-wig-overlay"
                >
                  <img 
                    src={selectedWig.img} 
                    alt="Simulated wig overlay" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      filter: 'contrast(1.05) brightness(0.95)'
                    }} 
                  />
                </div>
              )}
            </div>

            {/* Position Adjustment Widget Panel (Only show when simulator is computed) */}
            {simulationDone && activeImageSrc && (
              <div 
                style={{ 
                  marginTop: '1.5rem', 
                  background: 'var(--burgundy-medium)', 
                  border: '1px solid var(--border-light)', 
                  borderRadius: 'var(--border-radius-md)', 
                  padding: '1rem',
                  width: '100%',
                  maxWidth: '440px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
                id="wig-tweak-panel"
              >
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--gold-primary)', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Move size={12} /> Adjust Hair Fitting
                </span>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  {/* Scale adjustment controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-cream-muted)' }}>Scale:</span>
                    <button 
                      onClick={() => setScale(prev => Math.max(0.7, prev - 0.05))}
                      style={{ background: 'var(--bg-form-input)', border: '1px solid var(--border-light)', color: 'var(--cream-primary)', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ fontSize: '0.8rem', minWidth: '32px', textAlign: 'center' }}>{Math.round(scale * 100)}%</span>
                    <button 
                      onClick={() => setScale(prev => Math.min(1.4, prev + 0.05))}
                      style={{ background: 'var(--bg-form-input)', border: '1px solid var(--border-light)', color: 'var(--cream-primary)', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Positioning Y offset controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-cream-muted)' }}>Height:</span>
                    <button 
                      onClick={() => setTranslateY(prev => prev - 5)}
                      style={{ background: 'var(--bg-form-input)', border: '1px solid var(--border-light)', color: 'var(--cream-primary)', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Move Wig Up"
                    >
                      Up
                    </button>
                    <button 
                      onClick={() => setTranslateY(prev => prev + 5)}
                      style={{ background: 'var(--bg-form-input)', border: '1px solid var(--border-light)', color: 'var(--cream-primary)', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Move Wig Down"
                    >
                      Down
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {/* Position X offset controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-cream-muted)' }}>Offset X:</span>
                    <button 
                      onClick={() => setTranslateX(prev => prev - 5)}
                      style={{ background: 'var(--bg-form-input)', border: '1px solid var(--border-light)', color: 'var(--cream-primary)', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      Left
                    </button>
                    <button 
                      onClick={() => setTranslateX(prev => prev + 5)}
                      style={{ background: 'var(--bg-form-input)', border: '1px solid var(--border-light)', color: 'var(--cream-primary)', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      Right
                    </button>
                  </div>

                  <button 
                    onClick={resetWigOffsets}
                    style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Reset Fit
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Wig Selectors & Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} id="tryon-controls-panel">
            {/* Step 1: Select Face Model */}
            <div style={{ background: 'var(--burgundy-medium)', border: '1px solid var(--border-light)', borderRadius: 'var(--border-radius-md)', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--cream-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '20px', height: '20px', background: 'var(--gold-primary)', color: 'var(--burgundy-dark)', borderRadius: '50%', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</span>
                Choose Face Shape
              </h3>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                {modelPresets.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handlePresetSelect(model)}
                    style={{
                      background: selectedModel?.id === model.id ? 'var(--gold-primary)' : 'var(--bg-form-input)',
                      border: '1px solid var(--border-light)',
                      color: selectedModel?.id === model.id ? 'var(--burgundy-dark)' : 'var(--cream-primary)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                  >
                    {model.name}
                  </button>
                ))}
              </div>

              {/* Upload Selfie input */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '1px dashed var(--gold-primary)',
                  background: uploadedPhoto ? 'rgba(170,124,17,0.04)' : 'rgba(255,255,255,0.4)',
                  padding: '1rem',
                  borderRadius: '6px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  color: 'var(--text-cream-muted)',
                  transition: 'background 0.2s'
                }}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoUpload} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
                <Upload size={18} style={{ color: 'var(--gold-primary)', marginBottom: '0.25rem' }} />
                <p style={{ fontWeight: 600, color: 'var(--cream-primary)' }}>
                  {uploadedPhoto ? 'Selfie Uploaded! Click to change' : 'Or Upload Custom Selfie'}
                </p>
                <p style={{ fontSize: '0.7rem', opacity: 0.7 }}>Accepts JPG, PNG. Image remains private on your browser.</p>
              </div>
            </div>

            {/* Step 2: Choose Wig Option */}
            <div style={{ background: 'var(--burgundy-medium)', border: '1px solid var(--border-light)', borderRadius: 'var(--border-radius-md)', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--cream-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '20px', height: '20px', background: 'var(--gold-primary)', color: 'var(--burgundy-dark)', borderRadius: '50%', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</span>
                Select Wig to Try
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }} id="tryon-wig-options">
                {wigOptions.map((wig) => {
                  const hasOverlay = wigOverlays[wig.id] !== undefined;
                  return (
                    <div 
                      key={wig.id}
                      onClick={() => {
                        if (hasOverlay) {
                          setSelectedWig(wig);
                          setSimulationDone(false);
                        } else {
                          alert(`Fitting details for "${wig.name}" are simulated. Select Bone Straight, Curly, or Raw Virgin for full interactive overlay.`);
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        background: selectedWig?.id === wig.id ? 'rgba(170,124,17,0.1)' : 'var(--bg-form-input)',
                        border: '1px solid',
                        borderColor: selectedWig?.id === wig.id ? 'var(--gold-primary)' : 'var(--border-light)',
                        cursor: 'pointer',
                        opacity: hasOverlay ? 1 : 0.65,
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ width: '50px', height: '50px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                        <img src={wig.img} alt={wig.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.85rem', color: 'var(--cream-primary)', fontWeight: 600 }}>{wig.name}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: 600 }}>
                          ₦{wig.price.toLocaleString()}
                        </span>
                      </div>
                      {!hasOverlay && (
                        <span style={{ fontSize: '0.65rem', background: '#ccc', color: '#333', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>
                          Preview only
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Run button & Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button 
                onClick={startSimulation}
                disabled={!activeImageSrc || isScanning}
                className="btn btn-primary"
                style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
                id="run-tryon-btn"
              >
                <Sparkles size={18} />
                {simulationDone ? 'Run AI Simulation Again' : 'Synthesize AI Wig Fit'}
              </button>

              {simulationDone && (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={handleAddToCart}
                    className="btn btn-burgundy animate-fade-in"
                    style={{ flex: 1, padding: '0.9rem' }}
                    id="tryon-add-to-cart-btn"
                  >
                    <ShoppingBag size={16} />
                    Add Wig to Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
