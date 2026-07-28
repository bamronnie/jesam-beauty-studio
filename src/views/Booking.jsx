import React, { useState, useEffect } from 'react';
import { Calendar, User, Clock, CheckCircle2, ChevronRight, ChevronLeft, CalendarDays } from 'lucide-react';

export default function Booking({ 
  preSelectedService, 
  clearPreSelectedService, 
  onBookingComplete,
  initialServices = [],
  currentUser,
  showNotification
}) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  
  // User info state
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Prefill contact info if user is logged in
  useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.name || '');
      setUserEmail(currentUser.email || '');
      setUserPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  // Default services list (backup)
  const defaultServices = [
    { id: 'srv1', title: 'HD Lace Wig Installation', price: 25000, category: 'wigs' },
    { id: 'srv2', title: 'Wig Revamping & Customization', price: 15000, category: 'wigs' },
    { id: 'srv3', title: 'Knotless Goddess Braids (Medium)', price: 35000, category: 'braids' },
    { id: 'srv4', title: 'Stitch Braids (6-8 Feed-in)', price: 18000, category: 'braids' },
    { id: 'srv5', title: 'Traditional Sew-In Weave', price: 20000, category: 'extensions' },
    { id: 'srv6', title: 'Ponytail Styling (Sleek High)', price: 12000, category: 'extensions' },
    { id: 'srv7', title: 'Silk Press & Treatment', price: 15000, category: 'natural' },
    { id: 'srv8', title: 'Natural Twists / Loc Maintenance', price: 18000, category: 'natural' }
  ];

  const services = initialServices.length > 0 ? initialServices : defaultServices;

  const stylists = [
    { id: 'st1', name: 'Amara Nwachukwu', role: 'Master Stylist', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200' },
    { id: 'st2', name: 'Bisi Adebayo', role: 'Braider', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200' },
    { id: 'st3', name: 'Chidi Okafor', role: 'Revamping Tech', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200' }
  ];

  const timeSlots = [
    { time: '09:00 AM', available: true },
    { time: '11:00 AM', available: true },
    { time: '01:00 PM', available: false },
    { time: '03:00 PM', available: true },
    { time: '05:00 PM', available: true }
  ];

  // Pre-fill service hook
  useEffect(() => {
    if (preSelectedService) {
      // Find full service details or matching name
      const matched = services.find(s => s.id === preSelectedService.id || s.title === preSelectedService.title);
      if (matched) {
        setSelectedService(matched);
      } else {
        setSelectedService(preSelectedService);
      }
      setStep(2); // Jump direct to select stylist
      clearPreSelectedService(); // Consume it
    }
  }, [preSelectedService, services, clearPreSelectedService]);

  // Calendar dates setup (Generating current month days)
  const [currentDateObj] = useState(new Date());
  const year = currentDateObj.getFullYear();
  const month = currentDateObj.getMonth();
  const monthName = currentDateObj.toLocaleString('en-NG', { month: 'long' });
  const totalDays = new Date(year, month + 1, 0).getDate();

  const daysArray = [];
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayOfWeek = new Date(year, month, d).getDay();
    // Exclude Sundays (salon closed)
    daysArray.push({
      day: d,
      dateString: dateStr,
      isClosed: dayOfWeek === 0,
      weekdayLabel: new Date(year, month, d).toLocaleString('en-NG', { weekday: 'short' })
    });
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim() || !userPhone.trim()) {
      showNotification('Please fill out all contact info.', 'error');
      return;
    }

    const bookingPayload = {
      serviceName: selectedService.title,
      price: selectedService.price,
      stylistName: selectedStylist.name,
      date: selectedDate,
      time: selectedTimeSlot,
      clientName: userName,
      clientEmail: userEmail,
      clientPhone: userPhone,
      notes
    };

    try {
      const saved = await onBookingComplete(bookingPayload);
      setConfirmedBooking(saved);
      setStep(6); // Go to success receipt card
    } catch (err) {
      // handled in parent
    }
  };

  const resetWizard = () => {
    setSelectedService(null);
    setSelectedStylist(null);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setUserName('');
    setUserEmail('');
    setUserPhone('');
    setNotes('');
    setConfirmedBooking(null);
    setStep(1);
  };

  return (
    <section 
      style={{
        background: 'var(--burgundy-dark)',
        borderTop: '1px solid var(--border-light)',
        paddingTop: '9.5rem'
      }}
      id="booking-section"
    >
      <div className="container">
        {/* Title details */}
        {step < 6 && (
          <div className="section-header">
            <span className="section-tag">Book Salon Visit</span>
            <h2 className="section-title">Schedule An Appointment</h2>
            <p className="section-desc">
              Experience signature salon services in 5 easy steps. Secure your styling date in real time.
            </p>
          </div>
        )}

        {/* Wizard Card Body */}
        <div 
          className="glass-panel"
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-lg)'
          }}
          id="booking-wizard-card"
        >
          {/* Progress Indicators */}
          {step < 6 && (
            <div 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '2.5rem',
                borderBottom: '1px solid var(--border-light)',
                paddingBottom: '1rem',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}
              id="booking-steps-nav"
            >
              {[
                { number: 1, label: 'Service' },
                { number: 2, label: 'Stylist' },
                { number: 3, label: 'Date' },
                { number: 4, label: 'Time' },
                { number: 5, label: 'Details' }
              ].map((s) => (
                <div 
                  key={s.number} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.4rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: step === s.number ? 'var(--gold-primary)' : step > s.number ? 'var(--cream-primary)' : 'var(--text-cream-muted)'
                  }}
                >
                  <span 
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: step === s.number ? 'var(--gold-primary)' : step > s.number ? 'var(--burgundy-primary)' : 'transparent',
                      border: '1px solid',
                      borderColor: step === s.number ? 'var(--gold-primary)' : 'var(--border-light)',
                      color: step === s.number ? 'var(--burgundy-dark)' : 'var(--cream-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem'
                    }}
                  >
                    {s.number}
                  </span>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* STEP 1: Select Service */}
          {step === 1 && (
            <div id="booking-step-1">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--cream-primary)' }}>
                Select a Hair Service
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }} id="booking-service-list">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    onClick={() => {
                      setSelectedService(srv);
                      setStep(2);
                    }}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1.25rem',
                      background: selectedService?.id === srv.id ? 'rgba(212, 175, 55, 0.08)' : 'rgba(18, 1, 4, 0.4)',
                      border: '1px solid',
                      borderColor: selectedService?.id === srv.id ? 'var(--gold-primary)' : 'var(--border-light)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedService?.id !== srv.id) e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      if (selectedService?.id !== srv.id) e.currentTarget.style.borderColor = 'var(--border-light)';
                    }}
                  >
                    <div>
                      <h4 style={{ color: 'var(--cream-primary)', fontWeight: 600 }}>{srv.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-cream-muted)', marginTop: '0.2rem' }}>{srv.desc}</p>
                    </div>
                    <div style={{ fontWeight: 'bold', color: 'var(--gold-primary)', fontSize: '1.1rem' }}>
                      ₦{srv.price.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Select Stylist */}
          {step === 2 && (
            <div id="booking-step-2">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--cream-primary)' }}>
                Choose Your Preferred Stylist
              </h3>
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '1.5rem' 
                }}
                id="booking-stylist-grid"
              >
                {stylists.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => {
                      setSelectedStylist(st);
                      setStep(3);
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '1.5rem',
                      background: selectedStylist?.id === st.id ? 'rgba(212, 175, 55, 0.08)' : 'rgba(18, 1, 4, 0.4)',
                      border: '1px solid',
                      borderColor: selectedStylist?.id === st.id ? 'var(--gold-primary)' : 'var(--border-light)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border-light)', marginBottom: '1rem' }}>
                      <img src={st.img} alt={st.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <h4 style={{ color: 'var(--cream-primary)', fontSize: '1.1rem', fontWeight: 600 }}>{st.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', marginTop: '0.2rem' }}>{st.role}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="btn btn-secondary" style={{ marginTop: '2rem' }}>Back</button>
            </div>
          )}

          {/* STEP 3: Select Date */}
          {step === 3 && (
            <div id="booking-step-3">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--cream-primary)' }}>
                Select Styling Date
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-cream-muted)', marginBottom: '1.5rem' }}>
                Currently booking for <strong>{monthName} {year}</strong>. Jesam Beauty is closed on Sundays.
              </p>
              
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(7, 1fr)', 
                  gap: '0.5rem',
                  background: 'rgba(18, 1, 4, 0.4)',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)'
                }}
                id="booking-calendar-grid"
              >
                {/* Weekday headers */}
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(w => (
                  <div key={w} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gold-primary)', padding: '0.5rem 0' }}>
                    {w}
                  </div>
                ))}

                {/* Calendar Days */}
                {daysArray.map((dayObj) => {
                  const isSelected = selectedDate === dayObj.dateString;
                  const isPast = dayObj.day < currentDateObj.getDate();
                  const isDisabled = dayObj.isClosed || isPast;

                  return (
                    <button
                      key={dayObj.day}
                      disabled={isDisabled}
                      onClick={() => {
                        setSelectedDate(dayObj.dateString);
                        setStep(4);
                      }}
                      style={{
                        background: isSelected ? 'var(--gold-primary)' : 'rgba(18, 1, 4, 0.5)',
                        border: '1px solid',
                        borderColor: isSelected ? 'var(--gold-primary)' : 'rgba(212, 175, 55, 0.08)',
                        color: isSelected ? 'var(--burgundy-dark)' : isDisabled ? '#443336' : 'var(--cream-primary)',
                        padding: '0.8rem 0',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        borderRadius: '4px',
                        cursor: isDisabled ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}
                      id={`cal-day-${dayObj.day}`}
                    >
                      <span>{dayObj.day}</span>
                      {dayObj.isClosed && <span style={{ fontSize: '0.55rem', color: '#ff4d4d' }}>Closed</span>}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button onClick={() => setStep(2)} className="btn btn-secondary">Back</button>
              </div>
            </div>
          )}

          {/* STEP 4: Select Time Slot */}
          {step === 4 && (
            <div id="booking-step-4">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--cream-primary)' }}>
                Select Appointment Time Slot
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }} id="booking-time-slots">
                {timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    disabled={!slot.available}
                    onClick={() => {
                      setSelectedTimeSlot(slot.time);
                      setStep(5);
                    }}
                    style={{
                      width: '100%',
                      background: selectedTimeSlot === slot.time ? 'var(--gold-primary)' : 'rgba(18, 1, 4, 0.4)',
                      border: '1px solid',
                      borderColor: selectedTimeSlot === slot.time ? 'var(--gold-primary)' : 'var(--border-light)',
                      color: selectedTimeSlot === slot.time ? 'var(--burgundy-dark)' : !slot.available ? '#443336' : 'var(--cream-primary)',
                      padding: '1rem',
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                      cursor: slot.available ? 'pointer' : 'default',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s'
                    }}
                    id={`time-slot-${index}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={16} />
                      <span>{slot.time}</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {slot.available ? 'AVAILABLE' : 'BOOKED'}
                    </span>
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button onClick={() => setStep(3)} className="btn btn-secondary">Back</button>
              </div>
            </div>
          )}

          {/* STEP 5: Add Billing details */}
          {step === 5 && (
            <div id="booking-step-5">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--cream-primary)' }}>
                Confirm Booking Details
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }} id="booking-final-grid">
                {/* Form fields */}
                <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} id="booking-client-info-form">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g. Sandra Bello"
                      required
                      id="booking-name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="e.g. sandra@example.com"
                      required
                      id="booking-email"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="e.g. 0809 333 7529"
                      required
                      id="booking-phone"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Special Notes / Requests</label>
                    <textarea
                      rows="3"
                      className="form-control"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. I am bringing my own front closure, styling should be bone straight..."
                      id="booking-notes"
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" onClick={() => setStep(4)} className="btn btn-secondary">Back</button>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }} id="booking-submit-final-btn">
                      Confirm Appointment
                    </button>
                  </div>
                </form>

                {/* Selection recap card */}
                <div 
                  style={{
                    background: 'rgba(18, 1, 4, 0.6)',
                    border: '1px solid var(--border-light)',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                    alignSelf: 'start'
                  }}
                  id="booking-summary-card"
                >
                  <h4 style={{ color: 'var(--gold-primary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                    Appointment Summary
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-cream-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Service</span>
                      <div style={{ fontWeight: 600, color: 'var(--cream-primary)' }}>{selectedService?.title}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-cream-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Stylist</span>
                      <div style={{ fontWeight: 600, color: 'var(--cream-primary)' }}>{selectedStylist?.name}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-cream-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Date & Time</span>
                      <div style={{ fontWeight: 600, color: 'var(--cream-primary)' }}>{selectedDate} at {selectedTimeSlot}</div>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(212, 175, 55, 0.1)', paddingTop: '0.8rem' }}>
                      <span style={{ color: 'var(--text-cream-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Service Price</span>
                      <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--gold-primary)', marginTop: '0.1rem' }}>
                        ₦{selectedService?.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Success Confirmation */}
          {step === 6 && (
            <div 
              style={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.25rem',
                padding: '1.5rem 0'
              }}
              id="booking-success-message"
            >
              <CheckCircle2 size={60} style={{ color: '#4BB543' }} />
              <h3 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', color: 'var(--cream-primary)' }}>
                Booking Confirmed!
              </h3>
              <p style={{ fontSize: '1rem', color: 'var(--text-cream-muted)', maxWidth: '500px', lineHeight: '1.7' }}>
                We've locked in your appointment. A confirmation email with preparation details has been sent to <strong>{userEmail}</strong>.
              </p>

              <div 
                style={{ 
                  background: 'rgba(18,1,4,0.7)', 
                  border: '1px solid var(--border-medium)', 
                  padding: '1.5rem 2rem', 
                  borderRadius: '8px', 
                  width: '100%', 
                  maxWidth: '500px',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  fontSize: '0.9rem'
                }}
              >
                <div><span style={{ color: 'var(--gold-primary)' }}>Reference ID:</span> <strong>{confirmedBooking?.reference || 'N/A'}</strong></div>
                <div><span style={{ color: 'var(--gold-primary)' }}>Service styling:</span> {selectedService?.title}</div>
                <div><span style={{ color: 'var(--gold-primary)' }}>Stylist expert:</span> {selectedStylist?.name}</div>
                <div><span style={{ color: 'var(--gold-primary)' }}>Date & Time:</span> {selectedDate} at {selectedTimeSlot}</div>
                <div><span style={{ color: 'var(--gold-primary)' }}>Client contact:</span> {userName} ({userPhone})</div>
              </div>

              <button onClick={resetWizard} className="btn btn-primary" style={{ marginTop: '1.5rem', width: '200px' }} id="booking-success-finish-btn">
                Book Another Visit
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #booking-wizard-card {
            padding: 1.5rem !important;
          }
          #booking-stylist-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          #booking-calendar-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          #booking-final-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
