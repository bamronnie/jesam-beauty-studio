import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, ChevronRight, ChevronLeft, CalendarDays, ShoppingBag } from 'lucide-react';
import api from '../services/api';

export default function Booking({ 
  preSelectedService, 
  clearPreSelectedService, 
  onBookingComplete,
  initialServices = [],
  currentUser,
  showNotification
}) {
  const [step, setStep] = useState(1); // 1: Service, 2: Date, 3: Time, 4: Details, 5: Success Receipt
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  
  // Reserved times fetched from backend/db for selected date
  const [reservedTimes, setReservedTimes] = useState([]);
  const [isLoadingReserved, setIsLoadingReserved] = useState(false);

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

  // Operating Hours: Monday to Friday 9:00 AM to 5:00 PM
  const allTimeSlots = [
    '09:00 AM',
    '10:30 AM',
    '12:00 PM',
    '01:30 PM',
    '03:00 PM',
    '04:30 PM'
  ];

  // Fetch already booked time slots whenever selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      setIsLoadingReserved(true);
      api.getReservedTimeSlots(selectedDate)
        .then(booked => {
          setReservedTimes(Array.isArray(booked) ? booked : []);
        })
        .catch(err => {
          console.warn('Failed to fetch reserved times:', err);
          setReservedTimes([]);
        })
        .finally(() => {
          setIsLoadingReserved(false);
        });
    }
  }, [selectedDate]);

  // Pre-fill service hook
  useEffect(() => {
    if (preSelectedService) {
      const matched = services.find(s => s.id === preSelectedService.id || s.title === preSelectedService.title);
      if (matched) {
        setSelectedService(matched);
      } else {
        setSelectedService(preSelectedService);
      }
      setStep(2); // Jump direct to Date step
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
    // Monday to Friday ONLY (0 = Sun, 6 = Sat closed)
    const isClosed = dayOfWeek === 0 || dayOfWeek === 6;
    daysArray.push({
      day: d,
      dateString: dateStr,
      isClosed,
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
      stylistName: 'Jesam Master Stylist',
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

      // Trigger mailto email dispatch to beautybyjessam@gmail.com
      const mailtoUrl = `mailto:beautybyjessam@gmail.com?subject=${encodeURIComponent(`New Salon Appointment: ${selectedService.title} - ${selectedDate} ${selectedTimeSlot}`)}&body=${encodeURIComponent(`NEW APPOINTMENT BOOKING DETAILS:\n\nReference ID: ${saved?.reference || 'N/A'}\nService: ${selectedService.title}\nDate: ${selectedDate}\nTime Slot: ${selectedTimeSlot}\nPrice: ₦${Number(selectedService.price).toLocaleString()}\n\nClient Name: ${userName}\nClient Email: ${userEmail}\nClient Phone: ${userPhone}\nNotes: ${notes || 'None'}`)}`;
      window.open(mailtoUrl, '_blank');

      setStep(5); // Go to success receipt card
    } catch (err) {
      // handled in parent
    }
  };

  const resetWizard = () => {
    setSelectedService(null);
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
        paddingTop: '9.5rem',
        paddingBottom: '5rem'
      }}
      id="booking-section"
    >
      <div className="container">
        {/* Title details */}
        {step < 5 && (
          <div className="section-header">
            <span className="section-tag">Book Salon Visit</span>
            <h2 className="section-title">Schedule An Appointment</h2>
            <p className="section-desc">
              Select your styling service, pick an available Monday–Friday time slot, and confirm your visit.
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
          {/* Progress Indicators (4 Steps) */}
          {step < 5 && (
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
                { number: 2, label: 'Date' },
                { number: 3, label: 'Time' },
                { number: 4, label: 'Details' }
              ].map((s) => (
                <div 
                  key={s.number} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.4rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: step === s.number ? 'var(--gold-primary)' : step > s.number ? 'var(--cream-primary)' : 'var(--text-cream-muted)'
                  }}
                >
                  <span 
                    style={{
                      width: '26px',
                      height: '26px',
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
                    key={srv.id || srv._id}
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
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-cream-muted)', marginTop: '0.2rem' }}>{srv.desc || srv.description || 'Signature Jesam Beauty service.'}</p>
                    </div>
                    <div style={{ fontWeight: 'bold', color: 'var(--gold-primary)', fontSize: '1.1rem' }}>
                      ₦{Number(srv.price || 0).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Select Date (Mon - Fri Only) */}
          {step === 2 && (
            <div id="booking-step-2">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--cream-primary)' }}>
                Select Styling Date
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-cream-muted)', marginBottom: '1.5rem' }}>
                Currently booking for <strong>{monthName} {year}</strong>. Operating Hours: <strong>Monday – Friday (09:00 AM – 05:00 PM)</strong>. Closed on Weekends.
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
                        setStep(3);
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
                <button onClick={() => setStep(1)} className="btn btn-secondary">Back</button>
              </div>
            </div>
          )}

          {/* STEP 3: Select Time Slot (9 AM - 5 PM Window) */}
          {step === 3 && (
            <div id="booking-step-3">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--cream-primary)' }}>
                Select Appointment Time Slot
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-cream-muted)', marginBottom: '1.5rem' }}>
                Available slots for <strong>{selectedDate}</strong> (09:00 AM – 05:00 PM). Booked times are locked automatically.
              </p>

              {isLoadingReserved ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gold-primary)' }}>
                  Loading available time slots...
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }} id="booking-time-slots">
                  {allTimeSlots.map((timeString, index) => {
                    const isBooked = reservedTimes.includes(timeString);
                    const isSelected = selectedTimeSlot === timeString;

                    return (
                      <button
                        key={index}
                        disabled={isBooked}
                        onClick={() => {
                          setSelectedTimeSlot(timeString);
                          setStep(4);
                        }}
                        style={{
                          width: '100%',
                          background: isSelected ? 'var(--gold-primary)' : isBooked ? 'rgba(255, 77, 77, 0.05)' : 'rgba(18, 1, 4, 0.4)',
                          border: '1px solid',
                          borderColor: isSelected ? 'var(--gold-primary)' : isBooked ? 'rgba(255, 77, 77, 0.2)' : 'var(--border-light)',
                          color: isSelected ? 'var(--burgundy-dark)' : isBooked ? '#ff4d4d' : 'var(--cream-primary)',
                          padding: '1rem',
                          fontSize: '1rem',
                          fontWeight: 600,
                          borderRadius: '6px',
                          cursor: isBooked ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'all 0.2s',
                          opacity: isBooked ? 0.6 : 1
                        }}
                        id={`time-slot-${index}`}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Clock size={16} />
                          <span>{timeString}</span>
                        </div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 'bold' }}>
                          {isBooked ? '❌ BOOKED & RESERVED' : '✓ AVAILABLE'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button onClick={() => setStep(2)} className="btn btn-secondary">Back</button>
              </div>
            </div>
          )}

          {/* STEP 4: Confirm Details */}
          {step === 4 && (
            <div id="booking-step-4">
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
                    <label className="form-label">Special Notes / Styling Requests</label>
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
                    <button type="button" onClick={() => setStep(3)} className="btn btn-secondary">Back</button>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }} id="booking-submit-final-btn">
                      Confirm & Send Booking
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
                      <span style={{ color: 'var(--text-cream-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Date & Time</span>
                      <div style={{ fontWeight: 600, color: 'var(--cream-primary)' }}>{selectedDate} at {selectedTimeSlot}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-cream-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Recipient Email</span>
                      <div style={{ fontWeight: 600, color: 'var(--gold-primary)', fontSize: '0.8rem' }}>beautybyjessam@gmail.com</div>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(212, 175, 55, 0.1)', paddingTop: '0.8rem' }}>
                      <span style={{ color: 'var(--text-cream-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Service Price</span>
                      <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--gold-primary)', marginTop: '0.1rem' }}>
                        ₦{Number(selectedService?.price || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Success Confirmation */}
          {step === 5 && (
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
                Booking Confirmed & Sent!
              </h3>
              <p style={{ fontSize: '1rem', color: 'var(--text-cream-muted)', maxWidth: '520px', lineHeight: '1.7' }}>
                Your appointment time slot has been locked. A notification has been sent directly to <strong>beautybyjessam@gmail.com</strong> and logged in the Admin Dashboard.
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
                <div><span style={{ color: 'var(--gold-primary)' }}>Date & Time Slot:</span> {selectedDate} at {selectedTimeSlot}</div>
                <div><span style={{ color: 'var(--gold-primary)' }}>Client Contact:</span> {userName} ({userPhone})</div>
                <div><span style={{ color: 'var(--gold-primary)' }}>Client Email:</span> {userEmail}</div>
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
