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
    id: 'jesam-p1',
    name: '26" Bone Straight HD Lace Wig',
    price: 195000,
    oldPrice: 220000,
    category: 'wigs',
    tag: 'Best Seller',
    img: '/videos/jesam-p1-poster.jpg',
    poster: '/videos/jesam-p1-poster.jpg',
    video: '/videos/jesam-p1.mp4',
    desc: '100% Raw Virgin Human Hair bone straight wig with customized 13x4 HD Swiss Lace. Pre-plucked hairline and pre-bleached knots for an invisible melt.',
    rating: 4.8,
    reviews: 12
  },
  {
    id: 'jesam-p2',
    name: '22" Deep Wave Glueless Wear & Go Wig',
    price: 165000,
    oldPrice: 185000,
    category: 'wigs',
    tag: 'Glueless',
    img: '/videos/jesam-p2-poster.jpg',
    poster: '/videos/jesam-p2-poster.jpg',
    video: '/videos/jesam-p2.mp4',
    desc: 'High density deep wave texture wig with pre-cut HD lace foundation and 3D elastic security strap. Pop it on in seconds with zero glue required.',
    rating: 4.9,
    reviews: 15
  },
  {
    id: 'jesam-p3',
    name: '18" HD Lace Front Curly Bouncy Wig',
    price: 140000,
    oldPrice: 160000,
    category: 'wigs',
    tag: 'New Arrival',
    img: '/videos/jesam-p3-poster.jpg',
    poster: '/videos/jesam-p3-poster.jpg',
    video: '/videos/jesam-p3.mp4',
    desc: 'Pre-plucked HD Swiss Lace front wig in bouncy natural curls. Retains curl pattern effortlessly and melts seamlessly into all skin tones.',
    rating: 5.0,
    reviews: 18
  },
  {
    id: 'jesam-p4',
    name: '24" Honey Blonde Highlighted Bob Wig',
    price: 175000,
    oldPrice: 195000,
    category: 'wigs',
    tag: 'Custom Color',
    img: '/videos/jesam-p4-poster.jpg',
    poster: '/videos/jesam-p4-poster.jpg',
    video: '/videos/jesam-p4.mp4',
    desc: 'Custom honey blonde multi-tonal highlighted wig with dark root depth. Crafted from double-drawn virgin human hair.',
    rating: 4.8,
    reviews: 21
  },
  {
    id: 'jesam-p5',
    name: '14" Sleek Blunt Cut Closure Bob Wig',
    price: 95000,
    oldPrice: 110000,
    category: 'wigs',
    tag: 'Classic Bob',
    img: '/videos/jesam-p5-poster.jpg',
    poster: '/videos/jesam-p5-poster.jpg',
    video: '/videos/jesam-p5.mp4',
    desc: 'Sleek blunt-cut bob wig featuring a 5x5 HD closure. Lightweight, chic, and easy to maintain daily.',
    rating: 4.9,
    reviews: 24
  },
  {
    id: 'jesam-p6',
    name: '28" Super Long Bone Straight Frontal Wig',
    price: 230000,
    oldPrice: 250000,
    category: 'wigs',
    tag: 'Super Glam',
    img: '/videos/jesam-p6-poster.jpg',
    poster: '/videos/jesam-p6-poster.jpg',
    video: '/videos/jesam-p6.mp4',
    desc: 'Ultra-long 28 inch bone straight unit with full 180% density ends. Silky smooth luster that holds heat press beautifully up to 450°F.',
    rating: 5.0,
    reviews: 27
  },
  {
    id: 'jesam-p7',
    name: '20" Kinky Curly HD Glueless Wig',
    price: 155000,
    oldPrice: 170000,
    category: 'wigs',
    tag: 'Natural Look',
    img: '/videos/jesam-p7-poster.jpg',
    poster: '/videos/jesam-p7-poster.jpg',
    video: '/videos/jesam-p7.mp4',
    desc: 'Natural texture kinky curly wig matching afro-textured press out seamlessly. Glueless cap design with adjustable elastic strap.',
    rating: 4.8,
    reviews: 30
  },
  {
    id: 'jesam-p8',
    name: '3 Bundles Raw Virgin Straight Extensions',
    price: 120000,
    oldPrice: 135000,
    category: 'extensions',
    tag: 'Raw Bundles',
    img: '/videos/jesam-p8-poster.jpg',
    poster: '/videos/jesam-p8-poster.jpg',
    video: '/videos/jesam-p8.mp4',
    desc: 'Unprocessed raw human hair bundle deal. Thick double-drawn wefts with natural shine, available for dyeing and bleaching.',
    rating: 4.9,
    reviews: 33
  },
  {
    id: 'jesam-p9',
    name: '3 Bundles Deep Wave Raw Hair Package',
    price: 125000,
    oldPrice: 140000,
    category: 'extensions',
    tag: 'Deep Wave',
    img: '/videos/jesam-p9-poster.jpg',
    poster: '/videos/jesam-p9-poster.jpg',
    video: '/videos/jesam-p9.mp4',
    desc: 'Three bundles of raw human hair extensions in soft deep wave pattern. Full volume from roots to tips.',
    rating: 5.0,
    reviews: 36
  },
  {
    id: 'jesam-p10',
    name: '24" Water Wave HD Lace Frontal Wig',
    price: 180000,
    oldPrice: 200000,
    category: 'wigs',
    tag: 'Vacation Vibe',
    img: '/videos/jesam-p10-poster.jpg',
    poster: '/videos/jesam-p10-poster.jpg',
    video: '/videos/jesam-p10.mp4',
    desc: 'Wavy wet-and-wavy style wig featuring 13x4 HD lace. Hydrate with water and leave-in conditioner for instant curl pop.',
    rating: 4.8,
    reviews: 39
  },
  {
    id: 'jesam-p16',
    name: 'Jesam Hair Silk Serum & Oil (Care)',
    price: 8500,
    oldPrice: 10000,
    category: 'care',
    tag: 'Organic Care',
    img: '/videos/jesam-p16-poster.jpg',
    poster: '/videos/jesam-p16-poster.jpg',
    video: '/videos/jesam-p16.mp4',
    desc: 'Nourishing heat protectant serum formulated with argan & jojoba oil to seal cuticles and protect raw hair bundles.',
    rating: 4.9,
    reviews: 42
  },
  {
    id: 'jesam-p17',
    name: 'Edge Control Wax & Melting Band Set',
    price: 6500,
    oldPrice: 8000,
    category: 'care',
    tag: 'Perfect Lay',
    img: '/videos/jesam-p17-poster.jpg',
    poster: '/videos/jesam-p17-poster.jpg',
    video: '/videos/jesam-p17.mp4',
    desc: 'Extra-hold edge control wax paired with a Jesam Beauty satin lace melting band for seamless baby hair lays.',
    rating: 5.0,
    reviews: 45
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
