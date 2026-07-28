import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Minus, Plus, Trash2 } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  updateCartQuantity,
  removeFromCart,
  onCheckout,
  currentUser,
  showNotification
}) {
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [checkoutStep, setCheckoutStep] = useState(false);
  
  // Prefill billing if user is logged in
  const [billingName, setBillingName] = useState('');
  const [billingEmail, setBillingEmail] = useState('');

  useEffect(() => {
    if (currentUser) {
      setBillingName(currentUser.name || '');
      setBillingEmail(currentUser.email || '');
    } else {
      setBillingName('');
      setBillingEmail('');
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Simple demo coupon checker
  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'WELCOME10') {
      const discount = Math.round(cartSubtotal * 0.1);
      setDiscountAmount(discount);
      setAppliedCoupon('WELCOME10');
      showNotification('10% Welcome discount applied!', 'success');
    } else if (code === 'JESAMVIP') {
      if (cartSubtotal < 100000) {
        showNotification('This coupon requires a minimum purchase of ₦100,000.', 'error');
        return;
      }
      const discount = Math.round(cartSubtotal * 0.15);
      setDiscountAmount(discount);
      setAppliedCoupon('JESAMVIP');
      showNotification('15% VIP discount applied!', 'success');
    } else if (code === 'FREECARE') {
      const discount = 8500; // Free Care Serum value
      setDiscountAmount(discount);
      setAppliedCoupon('FREECARE');
      showNotification('Free Care Serum discount applied (₦8,500 value)!', 'success');
    } else {
      showNotification('Invalid or expired coupon code.', 'error');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon('');
    setDiscountAmount(0);
    setCouponInput('');
    showNotification('Coupon code removed.', 'info');
  };

  const triggerCheckout = (e) => {
    e.preventDefault();
    if (!billingName.trim() || !billingEmail.trim()) {
      showNotification('Please fill out billing name and email.', 'error');
      return;
    }
    const finalTotal = Math.max(0, cartSubtotal - discountAmount);
    // pass billing details to parent checkout handler
    onCheckout({ name: billingName, email: billingEmail }, finalTotal);
    setCheckoutStep(false);
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(18, 1, 4, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 900,
          animation: 'fadeIn 0.3s ease forwards'
        }}
        onClick={onClose}
      />
      
      <div 
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          maxWidth: '440px',
          height: '100vh',
          background: 'linear-gradient(135deg, var(--burgundy-deep) 0%, var(--burgundy-dark) 100%)',
          borderLeft: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 950,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
        id="cart-drawer-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div 
          style={{ 
            padding: '1.5rem', 
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} style={{ color: 'var(--gold-primary)' }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--cream-primary)' }}>Your Cart ({cart.length})</h3>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', color: 'var(--text-cream-muted)', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }} id="cart-items-container">
          {cart.length === 0 ? (
            <div 
              style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '1rem',
                color: 'var(--text-cream-muted)'
              }}
            >
              <ShoppingBag size={48} style={{ opacity: 0.3 }} />
              <span>Your cart is empty</span>
              <button onClick={onClose} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.6rem 1.25rem' }}>
                Start Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {cart.map((item) => (
                <div 
                  key={item.cartItemId || item.id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    paddingBottom: '1.25rem',
                    borderBottom: '1px solid rgba(212, 175, 55, 0.08)'
                  }}
                >
                  <div style={{ width: '70px', height: '70px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', color: 'var(--cream-primary)', fontWeight: 500, lineHeight: '1.4' }}>{item.name}</h4>
                      
                      {/* Render selected options */}
                      {(item.selectedSize || item.selectedColor || item.selectedLength) && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', marginTop: '0.2rem', fontSize: '0.75rem', color: 'var(--text-cream-muted)' }}>
                          {item.selectedSize && (
                            <div>
                              <span style={{ fontWeight: 600 }}>Size:</span> {item.selectedSize.includes('-') ? item.selectedSize.split('-')[0] : item.selectedSize}
                            </div>
                          )}
                          {item.selectedColor && (
                            <div>
                              <span style={{ fontWeight: 600 }}>Color:</span> {item.selectedColor.includes('-') ? item.selectedColor.split('-')[1] : item.selectedColor}
                            </div>
                          )}
                          {item.selectedLength && (
                            <div>
                              <span style={{ fontWeight: 600 }}>Length:</span> {item.selectedLength}"
                            </div>
                          )}
                        </div>
                      )}

                      <div style={{ color: 'var(--gold-primary)', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.2rem' }}>
                        ₦{item.price.toLocaleString()}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: '4px' }}>
                        <button 
                          onClick={() => updateCartQuantity(item.cartItemId || item.id, item.quantity - 1)}
                          style={{ background: 'none', border: 'none', color: 'var(--cream-primary)', padding: '0.25rem 0.5rem', cursor: 'pointer' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: '0.85rem', padding: '0 0.5rem' }}>{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.cartItemId || item.id, item.quantity + 1)}
                          style={{ background: 'none', border: 'none', color: 'var(--cream-primary)', padding: '0.25rem 0.5rem', cursor: 'pointer' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.cartItemId || item.id)}
                        style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '0.25rem' }}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer / Checkout action */}
        {cart.length > 0 && (
          <div 
            style={{ 
              padding: '1.25rem 1.5rem', 
              borderTop: '1px solid var(--border-light)',
              background: 'rgba(18, 1, 4, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            {/* Promo Coupon Code */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderBottom: '1px solid rgba(123, 1, 5, 0.1)', paddingBottom: '1rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Promo Coupon Code
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="e.g. WELCOME10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="form-control"
                  style={{ flex: 1, padding: '0.4rem 0.75rem', fontSize: '0.8rem', background: 'var(--bg-form-input)', height: '34px' }}
                  id="cart-coupon-input"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="btn btn-secondary"
                  style={{ padding: '0 1rem', fontSize: '0.7rem', height: '34px' }}
                  id="cart-coupon-apply-btn"
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <div 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    fontSize: '0.75rem', 
                    color: '#4ab97a', 
                    background: 'rgba(74, 185, 122, 0.05)', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px',
                    border: '1px solid rgba(74, 185, 122, 0.2)',
                    marginTop: '0.25rem'
                  }}
                >
                  <span>Coupon <strong>{appliedCoupon}</strong> active (-₦{discountAmount.toLocaleString()})</span>
                  <button 
                    type="button" 
                    onClick={handleRemoveCoupon} 
                    style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '0.7rem' }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Pricing breakdown summary */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-cream-muted)', marginBottom: '0.4rem' }}>
                <span>Subtotal</span>
                <span>₦{cartSubtotal.toLocaleString()}</span>
              </div>
              {appliedCoupon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#4ab97a', marginBottom: '0.4rem' }}>
                  <span>Discount ({appliedCoupon})</span>
                  <span>-₦{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', color: 'var(--cream-primary)', borderTop: '1px dashed var(--border-light)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                <span>Total Payable</span>
                <strong style={{ color: 'var(--gold-primary)' }}>₦{Math.max(0, cartSubtotal - discountAmount).toLocaleString()}</strong>
              </div>
            </div>

            {!checkoutStep ? (
              <button 
                onClick={() => setCheckoutStep(true)}
                className="btn btn-primary" 
                style={{ width: '100%' }}
                id="cart-checkout-proceed-btn"
              >
                Proceed to Checkout
              </button>
            ) : (
              <form onSubmit={triggerCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }} id="cart-billing-fields">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--gold-primary)' }}>Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={billingName}
                    onChange={(e) => setBillingName(e.target.value)}
                    placeholder="e.g. Chioma Johnson"
                    required
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    id="billing-name"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--gold-primary)' }}>Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    placeholder="e.g. chioma@example.com"
                    required
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    id="billing-email"
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button 
                    type="button" 
                    onClick={() => setCheckoutStep(false)}
                    className="btn btn-secondary" 
                    style={{ flex: 1, padding: '0.5rem' }}
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ flex: 1, padding: '0.5rem' }}
                    id="billing-submit-btn"
                  >
                    Open Paystack
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </>
  );
}
