import React, { useState, useEffect } from 'react';
import { X, CreditCard, Landmark, PhoneCall, ShieldAlert, Loader2, CheckCircle2, Copy, Check } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, totalAmount, onPaymentSuccess, billingDetails }) {
  const [paymentMethod, setPaymentMethod] = useState('card'); // card, bank, ussd
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('input'); // input, otp, processing, success
  
  // Form fields
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [ussdBank, setUssdBank] = useState('');

  // Paystack realism fields
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(600); // 10 minutes (600s)
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedUssd, setCopiedUssd] = useState(false);
  const [generatedRef, setGeneratedRef] = useState('');

  // Countdown timer for bank transfer
  useEffect(() => {
    let timer;
    if (paymentMethod === 'bank' && step === 'input' && isOpen) {
      timer = setInterval(() => {
        setCountdown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      setCountdown(600);
    }
    return () => clearInterval(timer);
  }, [paymentMethod, step, isOpen]);

  // Generate reference once successful
  useEffect(() => {
    if (step === 'success' && !generatedRef) {
      setGeneratedRef('PAY-' + Math.floor(100000000 + Math.random() * 900000000));
    } else if (step === 'input') {
      setGeneratedRef('');
    }
  }, [step]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const copyToClipboard = (text, type) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === 'bank') {
        setCopiedAccount(true);
        setTimeout(() => setCopiedAccount(false), 2000);
      } else {
        setCopiedUssd(true);
        setTimeout(() => setCopiedUssd(false), 2000);
      }
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    if (cardNumber.length < 15 || expiry.length < 5 || cvv.length < 3) {
      alert('Please fill valid card information details.');
      return;
    }
    // Redirect to OTP authorization step for Paystack realism
    setStep('otp');
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otpCode === '1234') {
      processPayment();
    } else {
      alert('Invalid OTP. Please enter 1234 to proceed with the mockup payment.');
    }
  };

  const processPayment = () => {
    setStep('processing');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 3000);
  };

  const handleFinish = () => {
    onPaymentSuccess({
      paymentMethod,
      reference: generatedRef || 'PAY-' + Math.floor(100000000 + Math.random() * 900000000),
      date: new Date().toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    });
    setStep('input');
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setOtpCode('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" id="checkout-modal-overlay">
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '480px', 
          background: '#FFFFFF', 
          color: '#333333',
          fontFamily: 'var(--font-sans)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
        id="paystack-checkout-box"
      >
        {/* Header styling representing Paystack */}
        <div 
          style={{ 
            background: '#F6F9FA', 
            padding: '1.5rem', 
            borderBottom: '1px solid #E1E8ED',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1rem', color: '#09A5DB' }}>paystack</span>
              <span style={{ fontSize: '0.8rem', color: '#777777' }}>secured checkout</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#555555', marginTop: '0.2rem' }}>
              Paying to <strong style={{ color: 'var(--burgundy-primary)' }}>Jesam Beauty</strong>
            </p>
          </div>
          {step !== 'processing' && (
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#777777', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          )}
        </div>

        {/* Amount bar */}
        <div 
          style={{ 
            background: 'var(--burgundy-primary)', 
            color: '#FFFFFF', 
            padding: '1rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>{billingDetails.email || 'guest@example.com'}</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>₦{totalAmount.toLocaleString()}</span>
        </div>

        {step === 'input' && (
          <div style={{ display: 'flex', minHeight: '300px' }}>
            {/* Sidebar navigation */}
            <div 
              style={{ 
                width: '130px', 
                background: '#F8FAF5', 
                borderRight: '1px solid #E1E8ED',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {[
                { id: 'card', label: 'Card', icon: <CreditCard size={16} /> },
                { id: 'bank', label: 'Bank Transfer', icon: <Landmark size={16} /> },
                { id: 'ussd', label: 'USSD Code', icon: <PhoneCall size={16} /> }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setPaymentMethod(item.id)}
                  style={{
                    background: paymentMethod === item.id ? '#FFFFFF' : 'none',
                    border: 'none',
                    borderLeft: paymentMethod === item.id ? '4px solid #3bb75e' : '4px solid transparent',
                    padding: '1.2rem 0.8rem',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: paymentMethod === item.id ? '#333333' : '#777777',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Core Form Contents */}
            <div style={{ flex: 1, padding: '1.5rem', background: '#FFFFFF' }}>
              {paymentMethod === 'card' && (
                <form onSubmit={handleCardSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} id="paystack-card-form">
                  <h4 style={{ fontSize: '0.9rem', color: '#444444', fontWeight: 600 }}>Enter Card Details</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.7rem', color: '#777777', textTransform: 'uppercase', fontWeight: 600 }}>Card Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength="19"
                      required
                      style={{ color: '#333333', background: '#FAFAFA', borderColor: '#D9D9D9', padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}
                      id="checkout-card-number"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.7rem', color: '#777777', textTransform: 'uppercase', fontWeight: 600 }}>Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        maxLength="5"
                        required
                        style={{ color: '#333333', background: '#FAFAFA', borderColor: '#D9D9D9', padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}
                        id="checkout-card-expiry"
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.7rem', color: '#777777', textTransform: 'uppercase', fontWeight: 600 }}>CVV</label>
                      <input
                        type="password"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                        maxLength="3"
                        required
                        style={{ color: '#333333', background: '#FAFAFA', borderColor: '#D9D9D9', padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}
                        id="checkout-card-cvv"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{
                      background: '#3bb75e',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '0.8rem',
                      borderRadius: '4px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      marginTop: '1rem',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2f9c4d'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3bb75e'}
                    id="checkout-pay-btn"
                  >
                    Pay ₦{totalAmount.toLocaleString()}
                  </button>
                </form>
              )}

              {paymentMethod === 'bank' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} id="paystack-bank-form">
                  <h4 style={{ fontSize: '0.9rem', color: '#444444', fontWeight: 600 }}>Transfer to Account</h4>
                  
                  {/* Countdown Timer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', background: '#FFFDF5', padding: '0.6rem 0.85rem', borderRadius: '4px', border: '1px solid #FFEAA5' }}>
                    <span style={{ color: '#8B6E00', fontWeight: 600 }}>Account expires in:</span>
                    <span style={{ color: '#D00000', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '0.9rem' }}>{formatTime(countdown)}</span>
                  </div>

                  <p style={{ fontSize: '0.75rem', color: '#666666', lineHeight: '1.4' }}>
                    Transfer the exact amount to the temporary bank account below.
                  </p>
                  
                  <div 
                    style={{ 
                      background: '#F5F8FA', 
                      border: '1px dashed #B8C2CC', 
                      padding: '1rem', 
                      borderRadius: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#777777', textTransform: 'uppercase' }}>Bank Name</span>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#333333' }}>Wema Bank (Paystack Account)</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#777777', textTransform: 'uppercase' }}>Account Number</span>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.1rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '1.25rem', letterSpacing: '1px', color: 'var(--burgundy-primary)' }}>9902883719</div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('9902883719', 'bank')}
                          style={{ background: 'none', border: 'none', color: '#09A5DB', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.4rem' }}
                        >
                          {copiedAccount ? <Check size={14} style={{ color: '#3bb75e' }} /> : <Copy size={14} />}
                          <span>{copiedAccount ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#777777', textTransform: 'uppercase' }}>Beneficiary</span>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#333333' }}>Jesam Beauty / Paystack Checkout</div>
                    </div>
                  </div>

                  <button
                    onClick={processPayment}
                    style={{
                      background: '#3bb75e',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '0.8rem',
                      borderRadius: '4px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      marginTop: '0.5rem'
                    }}
                    id="checkout-bank-confirm-btn"
                  >
                    I've Sent the Money
                  </button>
                </div>
              )}

              {paymentMethod === 'ussd' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} id="paystack-ussd-form">
                  <h4 style={{ fontSize: '0.9rem', color: '#444444', fontWeight: 600 }}>Dial USSD Code</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.7rem', color: '#777777', textTransform: 'uppercase', fontWeight: 600 }}>Choose Your Bank</label>
                    <select
                      className="form-control"
                      value={ussdBank}
                      onChange={(e) => setUssdBank(e.target.value)}
                      style={{ color: '#333333', background: '#FAFAFA', borderColor: '#D9D9D9', padding: '0.6rem 0.8rem' }}
                      id="checkout-ussd-bank"
                    >
                      <option value="">-- Select Bank --</option>
                      <option value="gtb">GTBank (*737#)</option>
                      <option value="access">Access Bank (*901#)</option>
                      <option value="zenith">Zenith Bank (*966#)</option>
                      <option value="uba">UBA (*919#)</option>
                      <option value="kuda">Kuda Bank (*894#)</option>
                    </select>
                  </div>

                  {ussdBank && (
                    <div 
                      style={{ 
                        background: '#FFFEEB', 
                        border: '1px solid #FFEBAA', 
                        padding: '1rem', 
                        borderRadius: '4px',
                        textAlign: 'center'
                      }}
                    >
                      <p style={{ fontSize: '0.8rem', color: '#77620E' }}>Dial this code on your registered phone number:</p>
                      <div 
                        style={{ 
                          fontSize: '1.25rem', 
                          fontWeight: 'bold', 
                          color: '#333333', 
                          margin: '0.5rem 0',
                          letterSpacing: '1px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <span>
                          {ussdBank === 'gtb' && '*737*1*2*9902883719#'}
                          {ussdBank === 'access' && '*901*3*9902883719#'}
                          {ussdBank === 'zenith' && '*966*3*9902883719#'}
                          {ussdBank === 'uba' && '*919*3*9902883719#'}
                          {ussdBank === 'kuda' && '*894*3*9902883719#'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const code = ussdBank === 'gtb' ? '*737*1*2*9902883719#' :
                                         ussdBank === 'access' ? '*901*3*9902883719#' :
                                         ussdBank === 'zenith' ? '*966*3*9902883719#' :
                                         ussdBank === 'uba' ? '*919*3*9902883719#' :
                                         ussdBank === 'kuda' ? '*894*3*9902883719#' : '';
                            copyToClipboard(code, 'ussd');
                          }}
                          style={{ background: 'none', border: 'none', color: '#09A5DB', cursor: 'pointer', display: 'flex', padding: '0.2rem' }}
                        >
                          {copiedUssd ? <Check size={14} style={{ color: '#3bb75e' }} /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={processPayment}
                    disabled={!ussdBank}
                    style={{
                      background: ussdBank ? '#3bb75e' : '#CCCCCC',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '0.8rem',
                      borderRadius: '4px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      cursor: ussdBank ? 'pointer' : 'default',
                      marginTop: '0.5rem'
                    }}
                    id="checkout-ussd-confirm-btn"
                  >
                    I've Dialed the Code
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* OTP Verification Page */}
        {step === 'otp' && (
          <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', minHeight: '300px', background: '#FFFFFF' }} id="paystack-otp-screen">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ffb000', background: 'rgba(255, 176, 0, 0.05)', padding: '0.85rem', borderRadius: '4px', border: '1px solid rgba(255, 176, 0, 0.15)' }}>
              <ShieldAlert size={20} style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                A One-Time Password (OTP) has been sent to your registered phone number.
              </div>
            </div>
            
            <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#777777', textTransform: 'uppercase', fontWeight: 600 }}>Enter 4-Digit OTP</label>
                <input
                  type="text"
                  placeholder="e.g. 1234"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  maxLength="4"
                  required
                  style={{ color: '#333333', background: '#FAFAFA', borderColor: '#D9D9D9', padding: '0.75rem', fontSize: '1.1rem', letterSpacing: '8px', textAlign: 'center', fontWeight: 'bold' }}
                  id="checkout-otp-input"
                />
                <span style={{ fontSize: '0.7rem', color: '#888888', marginTop: '0.2rem' }}>
                  Mock Code: Use <strong style={{ color: '#3bb75e' }}>1234</strong> to approve successfully.
                </span>
              </div>
              
              <button
                type="submit"
                style={{
                  background: '#3bb75e',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.8rem',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginTop: '0.5rem'
                }}
                id="checkout-otp-submit-btn"
              >
                Authorize Payment
              </button>
            </form>
            <button
              onClick={() => setStep('input')}
              style={{ background: 'none', border: 'none', color: '#777777', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline', marginTop: '0.5rem', alignSelf: 'center' }}
            >
              Cancel & Go Back
            </button>
          </div>
        )}

        {step === 'processing' && (
          <div 
            style={{ 
              minHeight: '300px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '2rem',
              gap: '1rem'
            }}
            id="checkout-loading-screen"
          >
            <Loader2 size={40} className="animate-spin" style={{ color: '#3bb75e' }} />
            <div style={{ fontWeight: 600, fontSize: '1rem', color: '#333333' }}>Authorizing payment...</div>
            <p style={{ fontSize: '0.8rem', color: '#777777', textAlign: 'center' }}>
              Please do not refresh this page or click back. We are verifying the transaction with your financial institution.
            </p>
          </div>
        )}

        {step === 'success' && (
          <div 
            style={{ 
              minHeight: '300px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '2rem',
              gap: '1rem',
              textAlign: 'center'
            }}
            id="checkout-success-screen"
          >
            <CheckCircle2 size={54} style={{ color: '#3bb75e' }} />
            <div style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#333333' }}>Payment Successful</div>
            <p style={{ fontSize: '0.85rem', color: '#555555' }}>
              Your order has been confirmed! An email receipt has been sent to {billingDetails.email}.
            </p>
            <div 
              style={{ 
                background: '#FAFAFA', 
                border: '1px solid #E1E8ED', 
                borderRadius: '4px', 
                padding: '0.8rem 1.25rem',
                width: '100%',
                fontSize: '0.8rem',
                color: '#555555',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.3rem',
                textAlign: 'left'
              }}
            >
              <div><strong>Recipient:</strong> {billingDetails.name}</div>
              <div><strong>Method:</strong> {paymentMethod.toUpperCase()}</div>
              <div><strong>Reference:</strong> {generatedRef}</div>
              <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
            </div>
            <button
              onClick={handleFinish}
              style={{
                background: 'var(--burgundy-primary)',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.8rem 2rem',
                borderRadius: '4px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '1rem',
                width: '100%'
              }}
              id="checkout-success-close-btn"
            >
              Continue to Jesam Beauty
            </button>
          </div>
        )}

        {/* Footer footer secure lock */}
        <div 
          style={{ 
            background: '#F6F9FA', 
            padding: '0.8rem', 
            borderTop: '1px solid #E1E8ED',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            color: '#777777'
          }}
        >
          <ShieldAlert size={14} style={{ color: '#3bb75e' }} />
          <span>This transaction is encrypted and secured by Paystack</span>
        </div>
      </div>
      
      {/* Small spin keyframe rule */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
