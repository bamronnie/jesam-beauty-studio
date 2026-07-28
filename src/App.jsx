import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CheckoutModal from './components/CheckoutModal';
import CartDrawer from './components/CartDrawer';
import api from './services/api';
import { Check, X, Sparkles } from 'lucide-react';

// Views
import Hero from './views/Hero';
import Services from './views/Services';
import Shop from './views/Shop';

const defaultProducts = [
  {
    id: 'p1',
    name: '24" Bone Straight Double Drawn Wig',
    price: 185000,
    oldPrice: 210000,
    category: 'wigs',
    tag: 'Best Seller',
    img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=500',
    video: '/videos/p1.mp4',
    poster: '/videos/p1-poster.jpg',
    desc: '100% Vietnamese Remy Human Hair. Super sleek, double-drawn for full density ends. Can be ironed, dyed, and washed. Average wig cap with adjustable bands.',
    rating: 4.9,
    reviews: 43
  },
  {
    id: 'p2',
    name: '18" HD Lace Front Curly Wig',
    price: 140000,
    oldPrice: 155000,
    category: 'wigs',
    tag: 'New Drop',
    img: 'https://images.unsplash.com/photo-1579613832125-5d34a13feb2a?q=80&w=500',
    video: '/videos/p2.mp4',
    poster: '/videos/p2-poster.jpg',
    desc: 'High-density curly lace front wig. Pre-plucked HD Swiss Lace for an invisible hairline finish. Bounces beautifully and retains curls effortlessly.',
    rating: 4.8,
    reviews: 29
  },
  {
    id: 'p3',
    name: '3 Bundles Raw Virgin Hair Extensions',
    price: 120000,
    oldPrice: 0,
    category: 'extensions',
    tag: 'Raw Bundles',
    img: 'https://images.unsplash.com/photo-1605497746444-ac9dbd39d675?q=80&w=500',
    video: '/videos/p3.mp4',
    poster: '/videos/p3-poster.jpg',
    desc: 'High quality bundles of unprocessed virgin hair. Thick wefts, natural luster, available in straight, body wave, and deep wave packages.',
    rating: 5.0,
    reviews: 18
  },
  {
    id: 'p4',
    name: 'Jesam Hair Silk Serum & Oil',
    price: 8500,
    oldPrice: 10000,
    category: 'care',
    tag: 'Organic Care',
    img: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=500',
    video: '/videos/p4.mp4',
    poster: '/videos/p4-poster.jpg',
    desc: 'Protects extensions and wigs from heat styling. Locks in moisture, prevents flyaways, and keeps hair smooth and shiny without weighing it down.',
    rating: 4.7,
    reviews: 52
  },
  {
    id: 'p5',
    name: 'Professional Tourmaline Flat Iron',
    price: 45000,
    oldPrice: 50000,
    category: 'tools',
    tag: 'Hot Item',
    img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=500',
    video: '/videos/p5.mp4',
    poster: '/videos/p5-poster.jpg',
    desc: 'Floating tourmaline plates optimized for styling straight bundles and sealing cuticle fibers. Temperature locks up to 450°F.',
    rating: 4.8,
    reviews: 15
  },
  {
    id: 'p6',
    name: '14" Honey Blonde Highlighted Bob Wig',
    price: 95000,
    oldPrice: 110000,
    category: 'wigs',
    tag: 'Chic Style',
    img: 'https://images.unsplash.com/photo-1605497746444-ac9dbd39d675?q=80&w=500',
    video: '/videos/p6.mp4',
    poster: '/videos/p6-poster.jpg',
    desc: 'Chic blunt cut bob wig with custom honey blonde highlights and dark roots. 100% human hair closure unit.',
    rating: 4.9,
    reviews: 21
  },
  {
    id: 'p7',
    name: '22" Deep Wave Glueless Wear & Go Wig',
    price: 165000,
    oldPrice: 180000,
    category: 'wigs',
    tag: 'Beginner Friendly',
    img: 'https://images.unsplash.com/photo-1579613832125-5d34a13feb2a?q=80&w=500',
    video: '/videos/p7.mp4',
    poster: '/videos/p7-poster.jpg',
    desc: 'High density glueless wig featuring deep wave texture. Zero glue needed, pre-cut lace with adjustable elastic 3D strap.',
    rating: 4.8,
    reviews: 35
  },
  {
    id: 'p8',
    name: '26" HD Lace Frontal Body Wave Wig',
    price: 195000,
    oldPrice: 220000,
    category: 'wigs',
    tag: 'Luxury HD',
    img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=500',
    video: '/videos/p8.mp4',
    poster: '/videos/p8-poster.jpg',
    desc: 'Pre-plucked HD Swiss Lace frontal wig with elegant body wave flows. Melts seamlessly into all skin tones.',
    rating: 5.0,
    reviews: 14
  },
  {
    id: 'p9',
    name: '12" Sleek Blunt Cut Closure Bob Wig',
    price: 85000,
    oldPrice: 95000,
    category: 'wigs',
    tag: 'Classic Bob',
    img: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=500',
    video: '/videos/p9.mp4',
    poster: '/videos/p9-poster.jpg',
    desc: 'Classic, sleek blunt cut closure bob wig. Easy styling, lightweight, and perfect for hot weather.',
    rating: 4.7,
    reviews: 19
  },
  {
    id: 'p10',
    name: '3 Bundles Curly Wave Extensions',
    price: 110000,
    oldPrice: 0,
    category: 'extensions',
    tag: 'Soft Waves',
    img: 'https://images.unsplash.com/photo-1605497746444-ac9dbd39d675?q=80&w=500',
    video: '/videos/p10.mp4',
    poster: '/videos/p10-poster.jpg',
    desc: 'Three bundles of raw human hair extensions in soft curly wave texture. Can be dyed, bleached, and styled.',
    rating: 4.9,
    reviews: 8
  },
  {
    id: 'p11',
    name: 'Organic Wig Washing & Conditioner Kit',
    price: 15000,
    oldPrice: 18000,
    category: 'care',
    tag: 'Essentials',
    img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=500',
    video: '/videos/p11.mp4',
    poster: '/videos/p11-poster.jpg',
    desc: 'Sulfate-free hydrating shampoo and conditioner set formulated specifically to wash and nourish human hair wigs.',
    rating: 4.8,
    reviews: 40
  },
  {
    id: 'p12',
    name: 'Edge Control Wax & Melting Band Set',
    price: 6500,
    oldPrice: 8000,
    category: 'care',
    tag: 'Perfect Lay',
    img: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=500',
    video: '/videos/p12.mp4',
    poster: '/videos/p12-poster.jpg',
    desc: 'Extra-hold edge wax paired with a Jesam Beauty satin lace melting band to lay your baby hairs and secure your wig install.',
    rating: 4.9,
    reviews: 67
  }
];
import Booking from './views/Booking';
import Contact from './views/Contact';
import AdminDashboard from './views/AdminDashboard';
import AuthModal from './components/AuthModal';
import SocialFeed from './components/SocialFeed';

export default function App() {
  const [activeView, setActiveView] = useState('home');
  const [adminMode, setAdminMode] = useState(false);
  
  // Shopping Cart state
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('jesam_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // E-commerce search term state (shared between Navbar and Shop catalog)
  const [shopSearchTerm, setShopSearchTerm] = useState('');

  // E-commerce items & Service list (Persisted database state)
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);

  // Client reviews state
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('jesam_reviews');
    return saved ? JSON.parse(saved) : [];
  });

  // Booked appointments state
  const [bookings, setBookings] = useState([]);

  // Completed shop orders state
  const [orders, setOrders] = useState([]);

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('jesam_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Paystack checkout modal trigger states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [billingDetails, setBillingDetails] = useState({ name: '', email: '' });
  
  // Service clicked from Services panel to prefill scheduler wizard
  const [preSelectedService, setPreSelectedService] = useState(null);

  // Toast notification state
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4500);
  };

  // Save cart state locally
  useEffect(() => {
    localStorage.setItem('jesam_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('jesam_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Load public products and services from database on mount
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const prodData = await api.getProducts();
        setProducts(prodData);
      } catch (err) {
        console.error('Error fetching products from server:', err);
      }

      try {
        const srvData = await api.getServices();
        setServices(srvData);
      } catch (err) {
        console.error('Error fetching services from server:', err);
      }
    };
    fetchCatalog();
  }, []);

  // Load bookings and orders if a user is authenticated
  useEffect(() => {
    if (currentUser) {
      const fetchUserData = async () => {
        try {
          const bookingData = await api.getBookings();
          setBookings(bookingData);
        } catch (err) {
          console.error('Error fetching bookings from server:', err);
        }

        try {
          const orderData = await api.getOrders();
          setOrders(orderData);
        } catch (err) {
          console.error('Error fetching orders from server:', err);
        }
      };
      fetchUserData();
    } else {
      setBookings([]);
      setOrders([]);
    }
  }, [currentUser]);

  // Safety check: force turn off admin mode if current user is not an admin
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      setAdminMode(false);
    }
  }, [currentUser]);

  // Cart operations
  const addToCart = (product, selectedOptions = {}) => {
    setCart((prevCart) => {
      const productId = product._id || product.id;
      const sizeStr = selectedOptions.size || '';
      const colorStr = selectedOptions.color || '';
      const lengthStr = selectedOptions.length || '';
      const cartItemId = `${productId}_${sizeStr}_${colorStr}_${lengthStr}`;
      
      const exists = prevCart.find((item) => item.cartItemId === cartItemId);
      if (exists) {
        return prevCart.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prevCart,
        {
          ...product,
          id: productId,
          cartItemId,
          selectedSize: sizeStr,
          selectedColor: colorStr,
          selectedLength: lengthStr,
          quantity: 1
        }
      ];
    });
    // Auto-reveal cart drawer action
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => prevCart.filter((item) => (item.cartItemId || item._id || item.id) !== cartItemId));
  };

  const updateCartQuantity = (cartItemId, q) => {
    if (q < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) => ((item.cartItemId || item._id || item.id) === cartItemId ? { ...item, quantity: q } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Flow handlers
  const [checkoutTotalOverride, setCheckoutTotalOverride] = useState(null);

  const handleCheckoutOpen = (billing, finalPayable) => {
    setBillingDetails(billing);
    if (finalPayable !== undefined && finalPayable !== null) {
      setCheckoutTotalOverride(finalPayable);
    } else {
      setCheckoutTotalOverride(null);
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = async (paymentMeta) => {
    const totalAmount = checkoutTotalOverride !== null ? checkoutTotalOverride : cart.reduce((tot, it) => tot + (it.price * it.quantity), 0);
    const newOrder = {
      reference: paymentMeta.reference,
      clientName: billingDetails.name,
      clientEmail: billingDetails.email,
      items: cart.map(it => ({ id: it._id || it.id, name: it.name, price: it.price, quantity: it.quantity })),
      total: totalAmount,
      method: paymentMeta.paymentMethod,
      date: paymentMeta.date
    };

    try {
      const response = await api.createOrder(newOrder);
      const pointsEarned = response.pointsEarned;
      
      setOrders((prev) => [response.order, ...prev]);

      if (currentUser && pointsEarned > 0) {
        // Sync current user profiles points
        const updatedUser = {
          ...currentUser,
          loyaltyPoints: (currentUser.loyaltyPoints || 0) + pointsEarned
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('jesam_current_user', JSON.stringify(updatedUser));
        showNotification(`Thank you! Order successfully placed. You earned ${pointsEarned} Jesam VIP points!`, 'success');
      } else {
        showNotification('Thank you! Order successfully placed and saved to Jesam Beauty orders ledger.', 'success');
      }
    } catch (err) {
      console.error('Failed to create order on server:', err);
      showNotification('Order paid successfully via Paystack simulation, but failed to log to server. Please contact support.', 'error');
    }
    
    setCheckoutTotalOverride(null);
    clearCart();
  };

  const handleBookingComplete = async (newBooking) => {
    try {
      const response = await api.createBooking({
        clientName: newBooking.clientName,
        clientPhone: newBooking.clientPhone,
        clientEmail: newBooking.clientEmail,
        serviceName: newBooking.serviceName,
        stylistName: newBooking.stylistName,
        date: newBooking.date,
        time: newBooking.time,
        price: newBooking.price,
        notes: newBooking.notes
      });

      setBookings((prev) => [response, ...prev]);

      // Refresh user VIP loyalty points
      if (currentUser) {
        try {
          const profile = await api.getProfile();
          setCurrentUser(profile);
          localStorage.setItem('jesam_current_user', JSON.stringify(profile));
        } catch (e) {
          console.warn('Failed to refresh loyalty points:', e);
        }
        showNotification('Appointment confirmed! 50 VIP Loyalty Points have been added to your profile.', 'success');
      } else {
        showNotification('Appointment confirmed!', 'success');
      }
      return response;
    } catch (err) {
      console.error('Failed to save booking to server:', err);
      showNotification('Failed to save booking to database. Please call us to confirm.', 'error');
      throw err;
    }
  };

  const handleAddReview = (newReview) => {
    setReviews([newReview, ...reviews]);
  };

  const handleSelectServiceFromMenu = (srv) => {
    setPreSelectedService(srv);
    setActiveView('booking');
    window.scrollTo(0, 0);
  };

  const totalCartCount = cart.reduce((tot, item) => tot + item.quantity, 0);
  const checkoutTotal = cart.reduce((tot, item) => tot + (item.price * item.quantity), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Sticky frosted Navbar with Scrolling Marquee promo */}
      <Navbar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        cartCount={totalCartCount}
        toggleCart={toggleCart}
        adminMode={adminMode}
        setAdminMode={setAdminMode}
        searchTerm={shopSearchTerm}
        setSearchTerm={setShopSearchTerm}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        openAuthModal={() => setIsAuthOpen(true)}
        showNotification={showNotification}
      />

      {/* Main content body switch */}
      <main style={{ flex: 1 }}>
        {adminMode ? (
          <AdminDashboard 
            bookings={bookings}
            setBookings={setBookings}
            orders={orders}
            setOrders={setOrders}
            products={products}
            setProducts={setProducts}
            services={services}
            setServices={setServices}
            showNotification={showNotification}
          />
        ) : (
          <>
            {activeView === 'home' && (
              <>
                <Hero 
                  setActiveView={setActiveView} 
                  addToCart={addToCart} 
                  products={products}
                />
                <SocialFeed addToCart={addToCart} products={products} />
              </>
            )}
            {activeView === 'services' && (
              <Services onSelectService={handleSelectServiceFromMenu} initialServices={services} />
            )}
             {activeView === 'shop' && (
              <Shop 
                cart={cart}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                updateCartQuantity={updateCartQuantity}
                isCartOpen={isCartOpen}
                toggleCart={toggleCart}
                onCheckout={handleCheckoutOpen}
                initialProducts={products}
                searchTerm={shopSearchTerm}
                setSearchTerm={setShopSearchTerm}
                currentUser={currentUser}
                showNotification={showNotification}
              />
            )}
            {activeView === 'booking' && (
              <Booking 
                preSelectedService={preSelectedService}
                clearPreSelectedService={() => setPreSelectedService(null)}
                onBookingComplete={handleBookingComplete}
                initialServices={services}
                currentUser={currentUser}
                showNotification={showNotification}
              />
            )}
            {activeView === 'contact' && <Contact />}
          </>
        )}
      </main>

      {/* Full website footer */}
      <Footer setActiveView={setActiveView} setAdminMode={setAdminMode} />

      {/* Paystack simulation modal */}
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        totalAmount={checkoutTotalOverride !== null ? checkoutTotalOverride : checkoutTotal}
        onPaymentSuccess={handlePaymentSuccess}
        billingDetails={billingDetails}
      />

      {/* User Login/Dashboard portal popup */}
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        bookings={bookings}
        orders={orders}
      />
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateCartQuantity={updateCartQuantity}
        removeFromCart={removeFromCart}
        onCheckout={handleCheckoutOpen}
        currentUser={currentUser}
        showNotification={showNotification}
      />
      {/* Toast Notifications Container */}
      <div className="toast-container">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`animate-slide-in toast-item toast-${n.type}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {n.type === 'error' ? (
                <X size={15} style={{ color: '#ef4444' }} />
              ) : n.type === 'success' ? (
                <Check size={15} style={{ color: 'var(--gold-primary)' }} />
              ) : (
                <Sparkles size={15} style={{ color: 'var(--gold-primary)' }} />
              )}
              <span>{n.message}</span>
            </div>
            <button
              onClick={() => setNotifications((prev) => prev.filter((item) => item.id !== n.id))}
              style={{ background: 'none', border: 'none', color: '#fff', opacity: 0.6, cursor: 'pointer', display: 'flex', padding: 0 }}
            >
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
