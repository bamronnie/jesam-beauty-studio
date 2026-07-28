import React, { useState, useEffect } from 'react';
import { Calendar, ShoppingBag, Plus, Sparkles, Check, X, RefreshCw, Layers, Upload, AlertTriangle, FileText, CheckSquare, Trash2, Search, List, Grid, TrendingUp, Users, Shield, Award } from 'lucide-react';
import api from '../services/api';

export default function AdminDashboard({ 
  bookings, 
  setBookings, 
  orders, 
  setOrders, 
  products, 
  setProducts, 
  services, 
  setServices,
  showNotification
}) {
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, bookings, orders, products, services, users
  
  // Bookings filter & view states
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingFilter, setBookingFilter] = useState('All'); // All, Pending, Confirmed, Cancelled
  const [bookingViewMode, setBookingViewMode] = useState('list'); // list, calendar
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);

  // User management states
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All'); // All, admin, customer

  // Load users list dynamically
  useEffect(() => {
    if (activeTab === 'users') {
      const fetchUsers = async () => {
        try {
          const list = await api.getUsers();
          setUsers(list);
        } catch (err) {
          showNotification('Error loading users: ' + err.message, 'error');
        }
      };
      fetchUsers();
    }
  }, [activeTab]);

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const updated = await api.updateUserRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? updated : u));
      showNotification(`User role successfully updated to ${newRole}.`, 'success');
    } catch (err) {
      showNotification('Error updating role: ' + err.message, 'error');
    }
  };

  const handleUpdateUserPoints = async (userId, newPoints) => {
    const pts = Number(newPoints);
    if (isNaN(pts) || pts < 0) {
      showNotification('Please enter a valid points amount.', 'error');
      return;
    }
    try {
      const updated = await api.updateUserPoints(userId, pts);
      setUsers(users.map(u => u.id === userId ? updated : u));
      showNotification(`VIP Loyalty points adjusted to ${pts} points.`, 'success');
    } catch (err) {
      showNotification('Error adjusting points: ' + err.message, 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user profile? This action cannot be undone.')) {
      return;
    }
    try {
      await api.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      showNotification('User profile successfully deleted.', 'success');
    } catch (err) {
      showNotification('Error deleting user: ' + err.message, 'error');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const searchLower = bookingSearch.toLowerCase();
    const matchesSearch = 
      (b.clientName || '').toLowerCase().includes(searchLower) || 
      (b.reference || '').toLowerCase().includes(searchLower) ||
      (b.serviceName || '').toLowerCase().includes(searchLower) ||
      (b.stylistName || '').toLowerCase().includes(searchLower);
    const matchesStatus = bookingFilter === 'All' ? true : b.status === bookingFilter;
    return matchesSearch && matchesStatus;
  });

  const getCalendarDays = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    return [
      ...Array(firstDayIndex).fill(null),
      ...Array.from({ length: totalDays }, (_, i) => i + 1)
    ];
  };

  const todayStr = () => {
    const today = new Date();
    return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  };

  const monthName = () => {
    return new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
  };
  
  // Product Creation Fields
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('wigs');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdTag, setNewProdTag] = useState('');
  const [newProdImg, setNewProdImg] = useState('');
  const [newProdImages, setNewProdImages] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [newProdVideo, setNewProdVideo] = useState('');

  // Bulk CSV Import States
  const [productEntryMode, setProductEntryMode] = useState('single'); // 'single' or 'bulk'
  const [csvInput, setCsvInput] = useState('name,price,oldPrice,category,tag,img,desc\n"24\\" HD Closure Custom Wig",195000,220000,"wigs","Hot Deal","https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=500","Customized wig unit"\n"Styling Mousse",9500,12000,"care","Jesam Essential","https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=500","Firm hold moisturizing mousse"');
  const [dragActive, setDragActive] = useState(false);
  const [importStatus, setImportStatus] = useState(null); // { success: true/false, message: '', created: 0, updated: 0, skipped: 0, errors: [] }
  const [isImporting, setIsImporting] = useState(false);

  const exportToCSV = (data, filename, headers, mapper) => {
    if (!data || data.length === 0) {
      showNotification('No data available to export.', 'warning');
      return;
    }
    const csvRows = [];
    csvRows.push(headers.join(','));
    data.forEach(item => {
      const values = mapper(item).map(val => {
        const strVal = String(val === null || val === undefined ? '' : val);
        if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n')) {
          return `"${strVal.replace(/"/g, '""')}"`;
        }
        return strVal;
      });
      csvRows.push(values.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification(`CSV exported successfully: ${filename}`, 'success');
  };

  const getParsedCsvRows = () => {
    if (!csvInput.trim()) return [];
    const lines = csvInput.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) return [];

    const parseLine = (line) => {
      const result = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const headers = parseLine(lines[0]).map(h => h.toLowerCase().trim());
    const nameIdx = headers.indexOf('name');
    const priceIdx = headers.indexOf('price');
    const oldPriceIdx = headers.indexOf('oldprice');
    const categoryIdx = headers.indexOf('category');
    const tagIdx = headers.indexOf('tag');
    const imgIdx = headers.indexOf('img');
    const imagesIdx = headers.indexOf('images');
    const videoIdx = headers.indexOf('video');
    const descIdx = headers.indexOf('desc');

    if (nameIdx === -1 || priceIdx === -1 || categoryIdx === -1 || imgIdx === -1) {
      return [{ isErrorHeader: true, message: 'CSV Header must include at least: name, price, category, img' }];
    }

    const rows = [];
    const validCategories = ['wigs', 'extensions', 'care', 'tools'];

    for (let i = 1; i < lines.length; i++) {
      const cols = parseLine(lines[i]);
      if (cols.length === 0 || (cols.length === 1 && !cols[0])) continue;

      const name = cols[nameIdx] || '';
      const priceVal = cols[priceIdx] || '';
      const categoryVal = cols[categoryIdx] || '';
      const imgVal = cols[imgIdx] || '';
      const oldPriceVal = oldPriceIdx !== -1 ? (cols[oldPriceIdx] || '') : '';
      const tagVal = tagIdx !== -1 ? (cols[tagIdx] || '') : '';
      const imagesVal = imagesIdx !== -1 ? (cols[imagesIdx] || '') : '';
      const videoVal = videoIdx !== -1 ? (cols[videoIdx] || '') : '';
      const descVal = descIdx !== -1 ? (cols[descIdx] || '') : '';

      const errors = [];
      if (!name) errors.push('Name is required');
      if (!priceVal) errors.push('Price is required');
      else if (isNaN(Number(priceVal)) || Number(priceVal) < 0) errors.push('Price must be a positive number');
      
      if (!categoryVal) errors.push('Category is required');
      else if (!validCategories.includes(categoryVal.toLowerCase())) errors.push(`Category must be wigs, extensions, care, or tools`);

      if (!imgVal) errors.push('Image URL is required');

      rows.push({
        rowNum: i + 1,
        name,
        price: priceVal,
        oldPrice: oldPriceVal,
        category: categoryVal,
        tag: tagVal,
        img: imgVal,
        images: imagesVal,
        video: videoVal,
        desc: descVal,
        isValid: errors.length === 0,
        errorMessage: errors.join(', ')
      });
    }

    return rows;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleCsvFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleCsvFile(e.target.files[0]);
    }
  };

  const handleCsvFile = (file) => {
    if (!file.name.endsWith('.csv')) {
      showNotification('Please upload a valid CSV file.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      setCsvInput(evt.target.result);
      setImportStatus(null);
    };
    reader.readAsText(file);
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!csvInput.trim()) return;

    setIsImporting(true);
    setImportStatus(null);

    try {
      const result = await api.importProducts(csvInput);
      setImportStatus({
        success: true,
        message: result.message || 'Import completed successfully.',
        created: result.created,
        updated: result.updated,
        skipped: result.skipped,
        errors: result.errors || []
      });
      // Fetch latest products list
      const latestProducts = await api.getProducts();
      setProducts(latestProducts);
    } catch (err) {
      setImportStatus({
        success: false,
        message: err.message || 'Error occurred during CSV import.'
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Service Creation Fields
  const [newSrvTitle, setNewSrvTitle] = useState('');
  const [newSrvPrice, setNewSrvPrice] = useState('');
  const [newSrvCategory, setNewSrvCategory] = useState('wigs');
  const [newSrvDesc, setNewSrvDesc] = useState('');
  const [newSrvDuration, setNewSrvDuration] = useState('120 mins');

  // Booking status changers
  const updateBookingStatus = async (ref, status) => {
    try {
      const updated = await api.updateBookingStatus(ref, status);
      setBookings(bookings.map(b => b.reference === ref ? updated : b));
      showNotification(`Booking ${ref} status updated to ${status}.`, 'success');
    } catch (err) {
      showNotification('Error updating booking status: ' + err.message, 'error');
    }
  };

  // Order status changers
  const updateOrderStatus = async (ref, status) => {
    try {
      const updated = await api.updateOrderStatus(ref, status);
      setOrders(orders.map(o => o.reference === ref ? updated : o));
      showNotification(`Order ${ref} fulfillment status updated to ${status}.`, 'success');
    } catch (err) {
      showNotification('Error updating order status: ' + err.message, 'error');
    }
  };

  // Product Addition handler
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) return;

    try {
      const coverUrl = newProdImg.trim() || 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=500';
      const imagesArray = [coverUrl];

      // Add uploaded Base64 files from device (skip if identical to coverUrl)
      uploadedImages.forEach((imgBase64) => {
        if (imgBase64 && imgBase64 !== coverUrl) {
          imagesArray.push(imgBase64);
        }
      });

      // Add external comma-separated web links (skip if duplicate)
      if (newProdImages.trim()) {
        newProdImages.split(',').forEach(url => {
          const trimmed = url.trim();
          if (trimmed && !imagesArray.includes(trimmed)) {
            imagesArray.push(trimmed);
          }
        });
      }

      const productPayload = {
        name: newProdName,
        price: Number(newProdPrice),
        oldPrice: 0,
        category: newProdCategory,
        tag: newProdTag || null,
        img: coverUrl,
        images: imagesArray,
        video: newProdVideo.trim() || '/8431525-uhd_4096_2160_25fps.mp4',
        desc: newProdDesc || 'Product designed by Jesam Beauty.'
      };
      
      const newProduct = await api.addProduct(productPayload);
      setProducts([newProduct, ...products]);
      
      showNotification('Product added successfully to catalog!', 'success');
      setNewProdName('');
      setNewProdPrice('');
      setNewProdDesc('');
      setNewProdTag('');
      setNewProdImg('');
      setNewProdImages('');
      setUploadedImages([]);
      setNewProdVideo('');
    } catch (err) {
      showNotification('Error adding product: ' + err.message, 'error');
    }
  };

  // Service Addition handler
  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newSrvTitle.trim() || !newSrvPrice) return;

    try {
      const servicePayload = {
        title: newSrvTitle,
        desc: newSrvDesc || 'Custom hair service.',
        duration: newSrvDuration,
        price: Number(newSrvPrice),
        category: newSrvCategory
      };
      
      const newService = await api.addService(servicePayload);
      setServices([newService, ...services]);
      
      showNotification('Service styling option added successfully!', 'success');
      setNewSrvTitle('');
      setNewSrvPrice('');
      setNewSrvDesc('');
      setNewSrvDuration('120 mins');
    } catch (err) {
      showNotification('Error adding service styling: ' + err.message, 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteProduct(id);
      setProducts(products.filter(p => (p._id || p.id) !== id));
      showNotification('Product removed from catalog.', 'success');
    } catch (err) {
      showNotification('Error deleting product: ' + err.message, 'error');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this styling option?')) return;
    try {
      await api.deleteService(id);
      setServices(services.filter(s => (s._id || s.id) !== id));
      showNotification('Stylist service styling option removed.', 'success');
    } catch (err) {
      showNotification('Error deleting service: ' + err.message, 'error');
    }
  };

  return (
    <section 
      style={{
        background: 'var(--burgundy-dark)',
        borderTop: '1px solid var(--border-light)',
        minHeight: '100vh',
        paddingTop: '9.5rem'
      }}
      id="admin-dashboard-section"
    >
      <div className="container">
        {/* Title Details */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}
          className="admin-header-row"
        >
          <div>
            <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>Staff Access Portal</span>
            <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', color: 'var(--cream-primary)' }}>
              Jesam Beauty Management
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-cream-muted)' }}>
              View booked schedules, manage e-commerce orders, and adjust salon catalog settings.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div 
          style={{ 
            display: 'flex', 
            borderBottom: '1px solid var(--border-light)', 
            marginBottom: '2.5rem',
            overflowX: 'auto',
            gap: '1rem'
          }}
          id="admin-tabs"
        >
          {[
            { id: 'analytics', label: 'Analytics Hub', icon: <TrendingUp size={16} /> },
            { id: 'bookings', label: `Appointments (${bookings.length})`, icon: <Calendar size={16} /> },
            { id: 'orders', label: `Shop Orders (${orders.length})`, icon: <ShoppingBag size={16} /> },
            { id: 'products', label: 'Manage Products', icon: <Layers size={16} /> },
            { id: 'services', label: 'Manage Services', icon: <Sparkles size={16} /> },
            { id: 'users', label: `Manage Users`, icon: <Users size={16} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '3px solid var(--gold-primary)' : '3px solid transparent',
                color: activeTab === tab.id ? 'var(--gold-primary)' : 'var(--text-cream-muted)',
                padding: '1rem 0.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
              id={`admin-tab-btn-${tab.id}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 0: Analytics Hub */}
        {activeTab === 'analytics' && (() => {
          const totalOrderRevenue = orders.reduce((sum, o) => sum + (o.total || o.totalAmount || 0), 0);
          const totalBookingRevenue = bookings
            .filter(b => b.status === 'Confirmed')
            .reduce((sum, b) => {
              const pr = b.price || 20000;
              return sum + pr;
            }, 0);
          const totalRevenue = totalOrderRevenue + totalBookingRevenue;

          const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
          const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
          const cancelledBookings = bookings.filter(b => b.status === 'Cancelled').length;

          const avgOrderValue = orders.length > 0 ? Math.round(totalOrderRevenue / orders.length) : 0;

          // Compute top services
          const serviceCounts = {};
          bookings.forEach(b => {
            const name = b.serviceTitle || b.service || 'Standard Install';
            serviceCounts[name] = (serviceCounts[name] || 0) + 1;
          });
          const topServices = Object.entries(serviceCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 4);

          // Compute top products
          const productCounts = {};
          orders.forEach(o => {
            if (Array.isArray(o.items)) {
              o.items.forEach(item => {
                const name = item.name || 'Hair Care Bundle';
                productCounts[name] = (productCounts[name] || 0) + (item.quantity || 1);
              });
            }
          });
          const topProducts = Object.entries(productCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 4);

          return (
            <div className="animate-fade-in" id="admin-tab-analytics" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '2.5rem' }}>
              {/* Stat Cards Grid */}
              <div className="grid-cols-4" style={{ gap: '1.5rem' }} className="admin-srv-row">
                {/* Card 1: Total Revenue */}
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--gold-primary)' }}>
                  <div style={{ background: 'rgba(197, 168, 128, 0.1)', padding: '0.75rem', borderRadius: '8px', color: 'var(--gold-primary)' }}>
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-cream-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Revenue</span>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--cream-primary)', margin: '0.2rem 0' }}>
                      ₦{totalRevenue.toLocaleString()}
                    </h3>
                    <p style={{ fontSize: '0.7rem', color: '#4BB543', margin: 0, display: 'flex', gap: '0.25rem' }}>
                      <span>📈</span> Active business billing
                    </p>
                  </div>
                </div>

                {/* Card 2: Bookings */}
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #ef4444' }}>
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px', color: '#ef4444' }}>
                    <Calendar size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-cream-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Hairstyling Bookings</span>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--cream-primary)', margin: '0.2rem 0' }}>
                      {bookings.length} Total
                    </h3>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-cream-muted)', margin: 0 }}>
                      <strong style={{ color: '#4BB543' }}>{confirmedBookings}</strong> confirmed • <strong style={{ color: '#ffb300' }}>{pendingBookings}</strong> pending
                    </p>
                  </div>
                </div>

                {/* Card 3: Store Orders */}
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #ff007f' }}>
                  <div style={{ background: 'rgba(255, 0, 127, 0.1)', padding: '0.75rem', borderRadius: '8px', color: '#ff007f' }}>
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-cream-muted)', textTransform: 'uppercase', fontWeight: 600 }}>E-Commerce Orders</span>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--cream-primary)', margin: '0.2rem 0' }}>
                      {orders.length} Sales
                    </h3>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-cream-muted)', margin: 0 }}>
                      Avg. basket size: <strong style={{ color: 'var(--gold-primary)' }}>₦{avgOrderValue.toLocaleString()}</strong>
                    </p>
                  </div>
                </div>

                {/* Card 4: VIP Customer Base */}
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #00c3ff' }}>
                  <div style={{ background: 'rgba(0, 195, 255, 0.1)', padding: '0.75rem', borderRadius: '8px', color: '#00c3ff' }}>
                    <Users size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-cream-muted)', textTransform: 'uppercase', fontWeight: 600 }}>VIP Client Base</span>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--cream-primary)', margin: '0.2rem 0' }}>
                      {users.length > 0 ? users.length : 3} Members
                    </h3>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-cream-muted)', margin: 0 }}>
                      Active customer profiles
                    </p>
                  </div>
                </div>
              </div>

              {/* Graphical Charts Section */}
              <div className="grid-cols-2" style={{ gap: '1.5rem' }} className="admin-srv-row">
                {/* Left Graph: Styling Services Popularity */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)', color: 'var(--gold-primary)', marginBottom: '1.25rem' }}>
                    Top Styling Services Demand
                  </h4>
                  {topServices.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-cream-muted)', fontStyle: 'italic', margin: 0 }}>No booking logs recorded.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {topServices.map((item, idx) => {
                        const totalCount = bookings.length || 1;
                        const percent = Math.round((item.count / totalCount) * 100);
                        return (
                          <div key={idx}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--cream-primary)', marginBottom: '0.35rem' }}>
                              <span style={{ fontWeight: 500 }}>{item.name}</span>
                              <span style={{ color: 'var(--gold-primary)', fontWeight: 'bold' }}>{item.count} appointments ({percent}%)</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                              <div style={{ width: `${percent}%`, height: '100%', background: 'linear-gradient(90deg, var(--gold-primary) 0%, var(--cream-primary) 100%)', borderRadius: '4px' }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right Graph: Top Products Sales */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)', color: 'var(--gold-primary)', marginBottom: '1.25rem' }}>
                    Top Selling Products
                  </h4>
                  {topProducts.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-cream-muted)', fontStyle: 'italic', margin: 0 }}>No item purchase logs recorded.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {topProducts.map((item, idx) => {
                        const maxCount = Math.max(...topProducts.map(p => p.count)) || 1;
                        const percent = Math.round((item.count / maxCount) * 100);
                        return (
                          <div key={idx}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--cream-primary)', marginBottom: '0.35rem' }}>
                              <span style={{ fontWeight: 500 }}>{item.name}</span>
                              <span style={{ color: '#ff007f', fontWeight: 'bold' }}>{item.count} units sold</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                              <div style={{ width: `${percent}%`, height: '100%', background: 'linear-gradient(90deg, #ff007f 0%, #ff66b2 100%)', borderRadius: '4px' }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* TAB 1: Bookings Management */}
        {activeTab === 'bookings' && (
          <div className="admin-table-container animate-fade-in" id="admin-tab-bookings">
            {/* Header Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', borderBottom: '1px solid var(--border-light)', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--cream-primary)', fontFamily: 'var(--font-serif)', margin: 0 }}>Booked Appointments</h3>
              
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Search field */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(18, 1, 4, 0.4)', padding: '0.45rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-light)', minWidth: '220px' }}>
                  <Search size={15} style={{ color: 'var(--text-cream-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search client, service, ref..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    style={{ background: 'none', border: 'none', color: '#fff', outline: 'none', fontSize: '0.8rem', width: '100%' }}
                  />
                  {bookingSearch && (
                    <button onClick={() => setBookingSearch('')} style={{ background: 'none', border: 'none', color: 'var(--text-cream-muted)', cursor: 'pointer', padding: 0 }}>
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Status filters */}
                <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(18, 1, 4, 0.3)', padding: '0.25rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                  {['All', 'Pending', 'Confirmed', 'Cancelled'].map(st => (
                    <button
                      key={st}
                      onClick={() => setBookingFilter(st)}
                      style={{
                        background: bookingFilter === st ? 'var(--gold-primary)' : 'none',
                        border: 'none',
                        color: bookingFilter === st ? '#120104' : 'var(--text-cream-muted)',
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* View Mode Toggle */}
                <div style={{ display: 'flex', border: '1px solid var(--border-light)', borderRadius: '6px', overflow: 'hidden', background: 'rgba(18, 1, 4, 0.3)' }}>
                  <button
                    onClick={() => setBookingViewMode('list')}
                    style={{
                      background: bookingViewMode === 'list' ? 'var(--gold-primary)' : 'none',
                      border: 'none',
                      color: bookingViewMode === 'list' ? '#120104' : 'var(--text-cream-muted)',
                      padding: '0.45rem 0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                    title="List View"
                  >
                    <List size={14} />
                  </button>
                  <button
                    onClick={() => setBookingViewMode('calendar')}
                    style={{
                      background: bookingViewMode === 'calendar' ? 'var(--gold-primary)' : 'none',
                      border: 'none',
                      color: bookingViewMode === 'calendar' ? '#120104' : 'var(--text-cream-muted)',
                      padding: '0.45rem 0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                    title="Calendar View"
                  >
                    <Grid size={14} />
                  </button>
                </div>

                {/* Export button */}
                <button 
                  onClick={() => exportToCSV(
                    filteredBookings, 
                    `bookings_${Date.now()}.csv`,
                    ['Reference', 'Client Name', 'Client Phone', 'Client Email', 'Service Name', 'Stylist Name', 'Date', 'Time', 'Price', 'Status'],
                    b => [b.reference, b.clientName, b.clientPhone, b.clientEmail, b.serviceName, b.stylistName, b.date, b.time, b.price, b.status]
                  )}
                  className="btn btn-secondary"
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', height: '34px' }}
                >
                  <FileText size={13} />
                  Export
                </button>
              </div>
            </div>

            {/* List View Mode */}
            {bookingViewMode === 'list' && (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Stylist</th>
                    <th>Date & Time</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-cream-muted)' }}>
                        No booked appointments match your search/filter.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.reference}>
                        <td style={{ fontWeight: 600, color: 'var(--gold-primary)' }}>{b.reference}</td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{b.clientName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-cream-muted)' }}>{b.clientPhone}</div>
                        </td>
                        <td>{b.serviceName}</td>
                        <td>{b.stylistName}</td>
                        <td>{b.date} at {b.time}</td>
                        <td style={{ fontWeight: 600 }}>₦{b.price.toLocaleString()}</td>
                        <td>
                          <span 
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 'bold',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '4px',
                              background: b.status === 'Confirmed' ? 'rgba(75, 181, 67, 0.15)' : b.status === 'Cancelled' ? 'rgba(255, 77, 77, 0.15)' : 'rgba(255, 165, 0, 0.15)',
                              color: b.status === 'Confirmed' ? '#4BB543' : b.status === 'Cancelled' ? '#ff4d4d' : '#ffa500'
                            }}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            {b.status !== 'Confirmed' && (
                              <button
                                onClick={() => updateBookingStatus(b.reference, 'Confirmed')}
                                style={{ background: '#4BB543', border: 'none', color: '#fff', padding: '0.3rem', borderRadius: '4px', cursor: 'pointer', display: 'flex' }}
                                title="Confirm"
                              >
                                <Check size={14} />
                              </button>
                            )}
                            {b.status !== 'Cancelled' && (
                              <button
                                onClick={() => updateBookingStatus(b.reference, 'Cancelled')}
                                style={{ background: '#ff4d4d', border: 'none', color: '#fff', padding: '0.3rem', borderRadius: '4px', cursor: 'pointer', display: 'flex' }}
                                title="Cancel"
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* Calendar Month Grid View Mode */}
            {bookingViewMode === 'calendar' && (
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.2rem', color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)', margin: 0 }}>
                    {monthName()}
                  </h4>
                </div>
                
                {/* Calendar Grid Header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center', fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--gold-primary)', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d}>{d}</div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
                  {getCalendarDays().map((day, idx) => {
                    if (day === null) {
                      return <div key={`empty-${idx}`} style={{ minHeight: '80px', background: 'rgba(255, 255, 255, 0.01)', borderRadius: '4px' }} />;
                    }

                    const today = new Date();
                    const dateStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                    const isToday = dateStr === todayStr();
                    
                    // Filtered calendar day items
                    const dayBookings = filteredBookings.filter(b => b.date === dateStr);
                    const pendingCount = dayBookings.filter(b => b.status === 'Pending').length;
                    const confirmedCount = dayBookings.filter(b => b.status === 'Confirmed').length;

                    return (
                      <div 
                        key={`day-${day}`}
                        onClick={() => {
                          if (dayBookings.length > 0) {
                            setSelectedCalendarDate(dateStr);
                          } else {
                            showNotification(`No filtered appointments scheduled for ${dateStr}.`, 'info');
                          }
                        }}
                        style={{
                          minHeight: '85px',
                          background: isToday ? 'rgba(212, 175, 55, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                          border: isToday ? '1px solid var(--gold-primary)' : '1px solid rgba(212, 175, 55, 0.05)',
                          borderRadius: '6px',
                          padding: '0.5rem',
                          cursor: dayBookings.length > 0 ? 'pointer' : 'default',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s',
                          boxSizing: 'border-box'
                        }}
                        onMouseEnter={(e) => {
                          if (dayBookings.length > 0) {
                            e.currentTarget.style.background = 'rgba(212, 175, 55, 0.08)';
                            e.currentTarget.style.borderColor = 'var(--gold-primary)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = isToday ? 'rgba(212, 175, 55, 0.12)' : 'rgba(255, 255, 255, 0.03)';
                          e.currentTarget.style.borderColor = isToday ? 'var(--gold-primary)' : 'rgba(212, 175, 55, 0.05)';
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ 
                            fontWeight: isToday ? 'bold' : 500, 
                            color: isToday ? 'var(--gold-primary)' : 'var(--cream-primary)',
                            fontSize: '0.9rem'
                          }}>
                            {day}
                          </span>
                          {isToday && (
                            <span style={{ fontSize: '0.65rem', color: 'var(--gold-primary)', background: 'rgba(212,175,55,0.2)', padding: '1px 4px', borderRadius: '3px', fontWeight: 600 }}>TODAY</span>
                          )}
                        </div>

                        {dayBookings.length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.4rem' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--cream-primary)', background: 'rgba(255, 255, 255, 0.08)', padding: '2px 4px', borderRadius: '3px', textAlign: 'center', fontWeight: 600 }}>
                              {dayBookings.length} Booked
                            </div>
                            <div style={{ display: 'flex', gap: '0.2rem', justifyContent: 'center' }}>
                              {pendingCount > 0 && (
                                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffa500' }} title={`${pendingCount} Pending`} />
                              )}
                              {confirmedCount > 0 && (
                                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4BB543' }} title={`${confirmedCount} Confirmed`} />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selected Date Popup Drawer overlay */}
            {selectedCalendarDate && (() => {
              const dayBookings = filteredBookings.filter(b => b.date === selectedCalendarDate);
              return (
                <div 
                  className="modal-overlay" 
                  style={{ display: 'flex', zIndex: 1100 }}
                  onClick={() => setSelectedCalendarDate(null)}
                >
                  <div 
                    className="modal-content" 
                    style={{ maxWidth: '750px', background: 'var(--burgundy-deep)', border: '1px solid var(--border-medium)', padding: '2rem' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button 
                      className="modal-close" 
                      onClick={() => setSelectedCalendarDate(null)}
                      style={{ color: 'var(--text-cream-muted)' }}
                    >
                      <X size={20} />
                    </button>

                    <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.4rem', color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)', margin: 0 }}>
                        Appointments for {selectedCalendarDate}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-cream-muted)', margin: '0.25rem 0 0 0' }}>
                        Manage schedules and confirm client visits.
                      </p>
                    </div>

                    <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
                      {dayBookings.map((b) => (
                        <div 
                          key={b.reference}
                          style={{
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid var(--border-light)',
                            borderRadius: '8px',
                            padding: '1.25rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '1rem'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                              <span style={{ fontWeight: 'bold', color: 'var(--gold-primary)', fontSize: '0.9rem' }}>{b.reference}</span>
                              <span 
                                style={{
                                  fontSize: '0.65rem',
                                  fontWeight: 'bold',
                                  padding: '0.15rem 0.4rem',
                                  borderRadius: '3px',
                                  background: b.status === 'Confirmed' ? 'rgba(75, 181, 67, 0.15)' : b.status === 'Cancelled' ? 'rgba(255, 77, 77, 0.15)' : 'rgba(255, 165, 0, 0.15)',
                                  color: b.status === 'Confirmed' ? '#4BB543' : b.status === 'Cancelled' ? '#ff4d4d' : '#ffa500'
                                }}
                              >
                                {b.status}
                              </span>
                            </div>
                            <div style={{ fontWeight: 600, color: 'var(--cream-primary)', fontSize: '0.95rem' }}>{b.clientName}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-cream-muted)', marginTop: '0.1rem' }}>
                              📞 {b.clientPhone} | ✉️ {b.clientEmail}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--cream-primary)', marginTop: '0.4rem', fontWeight: 500 }}>
                              {b.serviceName} with <strong style={{ color: 'var(--gold-primary)' }}>{b.stylistName}</strong> at {b.time}
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                            <div style={{ fontWeight: 'bold', color: 'var(--gold-primary)', fontSize: '1.1rem' }}>₦{b.price.toLocaleString()}</div>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              {b.status !== 'Confirmed' && (
                                <button
                                  onClick={() => updateBookingStatus(b.reference, 'Confirmed')}
                                  style={{ background: '#4BB543', border: 'none', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                  title="Confirm Appointment"
                                >
                                  <Check size={14} /> Confirm
                                </button>
                              )}
                              {b.status !== 'Cancelled' && (
                                <button
                                  onClick={() => updateBookingStatus(b.reference, 'Cancelled')}
                                  style={{ background: '#ff4d4d', border: 'none', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                  title="Cancel Appointment"
                                >
                                  <X size={14} /> Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 2: Orders Management */}
        {activeTab === 'orders' && (
          <div className="admin-table-container animate-fade-in" id="admin-tab-orders">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', borderBottom: '1px solid var(--border-light)', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--cream-primary)', fontFamily: 'var(--font-serif)', margin: 0 }}>Sales Orders Ledger</h3>
              <button 
                onClick={() => exportToCSV(
                  orders, 
                  `orders_${Date.now()}.csv`,
                  ['Reference', 'Client Name', 'Email', 'Items Summary', 'Total Amount', 'VIP Points', 'Date', 'Status'],
                  o => [
                    o.reference, 
                    o.clientName, 
                    o.clientEmail, 
                    (o.items || []).map(i => `${i.name} (x${i.quantity})`).join('; '), 
                    o.totalAmount, 
                    o.pointsEarned || 0, 
                    o.date, 
                    o.status
                  ]
                )}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}
              >
                <FileText size={13} />
                Export Ledger (CSV)
              </button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Client</th>
                  <th>Items Purchased</th>
                  <th>Total Amount</th>
                  <th>Payment</th>
                  <th>Fulfillment</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-cream-muted)' }}>
                      No product sales orders recorded.
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.reference}>
                      <td style={{ fontWeight: 600, color: 'var(--gold-primary)' }}>{o.reference}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{o.clientName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-cream-muted)' }}>{o.clientEmail}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>
                          {o.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>₦{o.total.toLocaleString()}</td>
                      <td>
                        <span style={{ fontSize: '0.75rem', color: '#4BB543', fontWeight: 'bold' }}>PAID ({o.method})</span>
                      </td>
                      <td>
                        <span 
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            background: o.status === 'Delivered' ? 'rgba(75, 181, 67, 0.15)' : o.status === 'Shipped' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 165, 0, 0.15)',
                            color: o.status === 'Delivered' ? '#4BB543' : o.status === 'Shipped' ? 'var(--gold-primary)' : '#ffa500'
                          }}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td>{o.date}</td>
                      <td>
                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.reference, e.target.value)}
                          style={{
                            background: 'rgba(18,1,4,0.8)',
                            color: 'var(--cream-primary)',
                            border: '1px solid var(--border-light)',
                            padding: '0.25rem',
                            fontSize: '0.75rem',
                            outline: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: Products Catalog Modification */}
        {activeTab === 'products' && (
          <div className="grid-cols-2 animate-fade-in" style={{ alignItems: 'start' }} id="admin-tab-products">
            {/* Left: Product Addition / CSV Import Form */}
            <div className="glass-panel" style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => { setProductEntryMode('single'); setImportStatus(null); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: productEntryMode === 'single' ? 'var(--gold-primary)' : 'var(--text-cream-muted)',
                      fontWeight: 600,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      position: 'relative',
                      paddingBottom: '0.5rem'
                    }}
                  >
                    Single Entry
                    {productEntryMode === 'single' && (
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'var(--gold-primary)' }} />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setProductEntryMode('bulk'); setImportStatus(null); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: productEntryMode === 'bulk' ? 'var(--gold-primary)' : 'var(--text-cream-muted)',
                      fontWeight: 600,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      position: 'relative',
                      paddingBottom: '0.5rem'
                    }}
                  >
                    CSV Bulk Import
                    {productEntryMode === 'bulk' && (
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'var(--gold-primary)' }} />
                    )}
                  </button>
                </div>
                <button 
                  onClick={() => exportToCSV(
                    products, 
                    `catalog_products_${Date.now()}.csv`,
                    ['name', 'price', 'oldPrice', 'category', 'tag', 'img', 'images', 'desc'],
                    p => [p.name, p.price, p.oldPrice || 0, p.category, p.tag || '', p.img, p.images && p.images.length > 0 ? p.images.join(';') : p.img, p.desc]
                  )}
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}
                >
                  <FileText size={13} />
                  Export Inventory (CSV)
                </button>
              </div>

              {productEntryMode === 'single' ? (
                <>
                  <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--cream-primary)', marginBottom: '1.25rem' }}>
                    Add New Product
                  </h3>
                  <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label">Product Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 20 inch Kinky Curly Wig"
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid-cols-2" style={{ gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Price (₦ NGN)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="e.g. 150000"
                          value={newProdPrice}
                          onChange={(e) => setNewProdPrice(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Category</label>
                        <select
                          className="form-control"
                          value={newProdCategory}
                          onChange={(e) => setNewProdCategory(e.target.value)}
                        >
                          <option value="wigs">Custom Wigs</option>
                          <option value="extensions">Wefts & Bundles</option>
                          <option value="care">Hair Care</option>
                          <option value="tools">Styling Tools</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Promo Tag (Optional)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Sale, Hot, Best Seller"
                        value={newProdTag}
                        onChange={(e) => setNewProdTag(e.target.value)}
                      />
                    </div>
                    {/* Device image upload component */}
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                      <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--cream-primary)' }}>Product Images</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: 500 }}>
                          {uploadedImages.length > 0 ? `${uploadedImages.length} images uploaded` : 'No images selected'}
                        </span>
                      </label>
                      
                      <input
                        type="file"
                        accept="image/*"
                        multiple={true}
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          if (files.length === 0) return;
                          
                          let loadedCount = 0;
                          const loadedUrls = [];
                          
                          files.forEach((file) => {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              loadedUrls.push(evt.target.result);
                              loadedCount++;
                              
                              if (loadedCount === files.length) {
                                setUploadedImages((prev) => [...prev, ...loadedUrls]);
                                if (!newProdImg) {
                                  setNewProdImg(loadedUrls[0]);
                                }
                              }
                            };
                            reader.readAsDataURL(file);
                          });
                        }}
                        style={{ display: 'none' }}
                        id="single-prod-img-file"
                      />

                      {uploadedImages.length === 0 ? (
                        /* Empty Upload Dotted Card */
                        <div 
                          onClick={() => document.getElementById('single-prod-img-file').click()}
                          style={{
                            border: '1.5px dashed var(--gold-primary)',
                            borderRadius: '8px',
                            padding: '2.5rem 1.5rem',
                            textAlign: 'center',
                            background: 'rgba(197, 168, 128, 0.03)',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(197, 168, 128, 0.08)';
                            e.currentTarget.style.borderColor = '#ff40cc';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(197, 168, 128, 0.03)';
                            e.currentTarget.style.borderColor = 'var(--gold-primary)';
                          }}
                        >
                          <Upload size={32} style={{ color: 'var(--gold-primary)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <span style={{ color: 'var(--cream-primary)', fontSize: '0.9rem', fontWeight: 600 }}>
                              Upload product images from device
                            </span>
                            <span style={{ color: 'var(--text-cream-muted)', fontSize: '0.75rem' }}>
                              Supports JPG, PNG, WEBP. Drag multiple images or click to browse.
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* Populated Previews Grid */
                        <div style={{
                          background: 'rgba(18, 1, 4, 0.25)',
                          border: '1px solid var(--border-light)',
                          borderRadius: '8px',
                          padding: '1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1rem'
                        }}>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                            gap: '0.85rem'
                          }}>
                            {uploadedImages.map((base64, index) => {
                              const isCover = newProdImg === base64;
                              return (
                                <div
                                  key={index}
                                  style={{
                                    position: 'relative',
                                    aspectRatio: '1',
                                    borderRadius: '6px',
                                    overflow: 'hidden',
                                    border: isCover ? '2.5px solid #ff40cc' : '1.5px solid var(--border-light)',
                                    boxShadow: isCover ? '0 0 12px rgba(255, 64, 204, 0.45)' : '0 2px 4px rgba(0,0,0,0.2)',
                                    cursor: 'pointer',
                                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                                  }}
                                  onClick={() => setNewProdImg(base64)}
                                  onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                                  onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                                  title={isCover ? "Cover Image" : "Click to set as Cover"}
                                >
                                  <img src={base64} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                  
                                  {isCover && (
                                    <span style={{
                                      position: 'absolute',
                                      bottom: 0,
                                      left: 0,
                                      right: 0,
                                      background: '#ff40cc',
                                      color: '#fff',
                                      fontSize: '0.55rem',
                                      fontWeight: 800,
                                      letterSpacing: '0.05em',
                                      textAlign: 'center',
                                      padding: '2px 0',
                                      zIndex: 2
                                    }}>
                                      COVER
                                    </span>
                                  )}

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const filtered = uploadedImages.filter((_, idx) => idx !== index);
                                      setUploadedImages(filtered);
                                      if (isCover) {
                                        setNewProdImg(filtered.length > 0 ? filtered[0] : '');
                                      }
                                    }}
                                    style={{
                                      position: 'absolute',
                                      top: '3px',
                                      right: '3px',
                                      background: 'rgba(18, 1, 4, 0.85)',
                                      border: 'none',
                                      color: '#ffffff',
                                      borderRadius: '50%',
                                      width: '18px',
                                      height: '18px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer',
                                      padding: 0,
                                      zIndex: 2,
                                      transition: 'all 0.15s ease'
                                    }}
                                    onMouseOver={(e) => { e.currentTarget.style.background = '#ff0055'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(18, 1, 4, 0.85)'; }}
                                  >
                                    <X size={10} />
                                  </button>
                                </div>
                              );
                            })}
                            
                            {/* Dotted Plus Card to Add More */}
                            <div
                              onClick={() => document.getElementById('single-prod-img-file').click()}
                              style={{
                                aspectRatio: '1',
                                borderRadius: '6px',
                                border: '1.5px dashed var(--gold-primary)',
                                background: 'rgba(197, 168, 128, 0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.25rem',
                                cursor: 'pointer',
                                transition: 'all 0.25s ease'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(197, 168, 128, 0.15)';
                                e.currentTarget.style.transform = 'scale(1.05)';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = 'rgba(197, 168, 128, 0.05)';
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                              title="Add More Images"
                            >
                              <Plus size={20} style={{ color: 'var(--gold-primary)' }} />
                              <span style={{ fontSize: '0.65rem', color: 'var(--text-cream-muted)', fontWeight: 600 }}>
                                Add More
                              </span>
                            </div>
                          </div>
                          
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-cream-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span>💡</span>
                            <span>Click any thumbnail image to set it as the primary <strong>Cover Image</strong> (hot pink border).</span>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Product Video & Web links row */}
                    <div className="grid-cols-2 admin-media-row" style={{ gap: '1.25rem', marginBottom: '1.25rem' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>Product Video (Optional)</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-cream-muted)' }}>
                            {newProdVideo ? (newProdVideo.startsWith('data:') ? 'Local File Loaded' : 'URL Entered') : 'Empty'}
                          </span>
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                if (file.size > 12 * 1024 * 1024) {
                                  showNotification('Warning: Large video file size might impact local network performance.', 'warning');
                                }
                                const reader = new FileReader();
                                reader.onload = (evt) => {
                                  setNewProdVideo(evt.target.result);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            style={{ display: 'none' }}
                            id="single-prod-video-file"
                          />
                          <button
                            type="button"
                            onClick={() => document.getElementById('single-prod-video-file').click()}
                            style={{
                              background: 'rgba(212, 175, 55, 0.1)',
                              border: '1px dashed var(--gold-primary)',
                              color: 'var(--gold-primary)',
                              padding: '0.5rem 0.75rem',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <Upload size={13} />
                            Upload Video
                          </button>
                          <input
                            type="text"
                            className="form-control"
                            style={{ flex: 1 }}
                            placeholder="Or paste URL..."
                            value={newProdVideo.startsWith('data:') ? '' : newProdVideo}
                            onChange={(e) => setNewProdVideo(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Additional Web Image URLs (Optional, comma-separated)</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. https://url1.com/img.jpg, https://url2.com/img.jpg"
                          value={newProdImages}
                          onChange={(e) => setNewProdImages(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea
                        rows="3"
                        className="form-control"
                        placeholder="Provide details on hair material, density, origins..."
                        value={newProdDesc}
                        onChange={(e) => setNewProdDesc(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      <Plus size={16} />
                      Add to Catalog
                    </button>
                  </form>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--cream-primary)', marginBottom: '0.25rem' }}>
                    CSV Product Importer
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-cream-muted)', marginBottom: '0.5rem' }}>
                    Upload a file or paste comma-separated values to bulk create/update products. Re-uploading existing names updates price/details.
                  </p>

                  {/* Drag and Drop Zone */}
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    style={{
                      border: dragActive ? '2px dashed var(--gold-primary)' : '1px dashed var(--border-light)',
                      borderRadius: '8px',
                      padding: '1.5rem',
                      textAlign: 'center',
                      background: dragActive ? 'rgba(212, 175, 55, 0.05)' : 'rgba(18, 1, 4, 0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      position: 'relative'
                    }}
                  >
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer'
                      }}
                    />
                    <Upload size={28} style={{ color: 'var(--gold-primary)', marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '0.85rem', color: 'var(--cream-primary)', fontWeight: 500 }}>
                      Drag and drop your CSV file here, or <span style={{ color: 'var(--gold-primary)', textDecoration: 'underline' }}>browse</span>
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-cream-muted)', marginTop: '0.2rem' }}>
                      Supports standard .csv format files
                    </p>
                  </div>

                  <form onSubmit={handleImportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <label className="form-label" style={{ marginBottom: 0 }}>CSV Editor (Raw Content)</label>
                        <button
                          type="button"
                          onClick={() => {
                            setCsvInput('name,price,oldPrice,category,tag,img,desc,images,video\n"24\\" HD Closure Custom Wig",195000,220000,"wigs","Hot Deal","https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=500","Customized wig unit","https://images.unsplash.com/photo-1562322140-8baeececf3df;https://images.unsplash.com/photo-1579613832125-5d34a13feb2a","/8431525-uhd_4096_2160_25fps.mp4"\n"Styling Mousse",9500,12000,"care","Jesam Essential","https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=500","Firm hold moisturizing mousse","https://images.unsplash.com/photo-1620331311520-246422fd82f9","/8431525-uhd_4096_2160_25fps.mp4"');
                            setImportStatus(null);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--gold-primary)',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          Reset Template
                        </button>
                      </div>
                      <textarea
                        rows="5"
                        className="form-control"
                        style={{ fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: '1.4' }}
                        placeholder="name,price,oldPrice,category,tag,img,desc,images,video"
                        value={csvInput}
                        onChange={(e) => { setCsvInput(e.target.value); setImportStatus(null); }}
                        required
                      />
                    </div>

                    {/* LIVE PREVIEW TABLE */}
                    {(() => {
                      const rows = getParsedCsvRows();
                      if (rows.length === 0) return null;
                      if (rows[0] && rows[0].isErrorHeader) {
                        return (
                          <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255, 77, 77, 0.15)', border: '1px solid rgba(255, 77, 77, 0.3)', padding: '0.75rem', borderRadius: '6px', color: '#ff4d4d', fontSize: '0.8rem', alignItems: 'center' }}>
                            <AlertTriangle size={16} />
                            <span>{rows[0].message}</span>
                          </div>
                        );
                      }

                      const validRows = rows.filter(r => r.isValid);
                      const invalidRows = rows.filter(r => !r.isValid);

                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.25rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.725rem' }}>
                            <span style={{
                              background: 'rgba(255,255,255,0.06)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              color: 'var(--cream-primary)',
                              padding: '0.25rem 0.6rem',
                              borderRadius: '4px',
                              fontWeight: 500
                            }}>
                              Total Rows: <strong style={{ color: 'var(--gold-primary)' }}>{rows.length}</strong>
                            </span>
                            {validRows.length > 0 && (
                              <span style={{
                                background: 'rgba(75, 181, 67, 0.08)',
                                border: '1px solid rgba(75, 181, 67, 0.2)',
                                color: '#4BB543',
                                padding: '0.25rem 0.6rem',
                                borderRadius: '4px',
                                fontWeight: 500
                              }}>
                                Valid Rows: <strong>{validRows.length}</strong>
                              </span>
                            )}
                            {invalidRows.length > 0 && (
                              <span style={{
                                background: 'rgba(255, 77, 77, 0.08)',
                                border: '1px solid rgba(255, 77, 77, 0.2)',
                                color: '#ff4d4d',
                                padding: '0.25rem 0.6rem',
                                borderRadius: '4px',
                                fontWeight: 500
                              }}>
                                Invalid Rows: <strong>{invalidRows.length}</strong>
                              </span>
                            )}
                          </div>

                          {/* Scrollable grid preview */}
                          <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border-light)', borderRadius: '6px', background: 'rgba(18, 1, 4, 0.3)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left', fontFamily: 'var(--font-sans)' }}>
                              <thead style={{ background: 'rgba(25, 3, 7, 0.95)', position: 'sticky', top: 0, zIndex: 1, borderBottom: '1px solid var(--border-light)' }}>
                                <tr>
                                  <th style={{ padding: '0.65rem 0.9rem', color: 'var(--gold-primary)', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Row</th>
                                  <th style={{ padding: '0.65rem 0.9rem', color: 'var(--gold-primary)', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
                                  <th style={{ padding: '0.65rem 0.9rem', color: 'var(--gold-primary)', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price</th>
                                  <th style={{ padding: '0.65rem 0.9rem', color: 'var(--gold-primary)', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
                                  <th style={{ padding: '0.65rem 0.9rem', color: 'var(--gold-primary)', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {rows.map((row, idx) => (
                                  <tr
                                    key={idx}
                                    style={{
                                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                      background: row.isValid ? 'none' : 'rgba(255, 77, 77, 0.03)',
                                      transition: 'background 0.2s'
                                    }}
                                  >
                                    <td style={{ padding: '0.65rem 0.9rem', color: 'var(--text-cream-muted)' }}>{row.rowNum}</td>
                                    <td style={{ padding: '0.65rem 0.9rem', fontWeight: 500, color: 'var(--cream-primary)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      {row.name || <em style={{ color: '#ff4d4d', opacity: 0.8 }}>[Empty]</em>}
                                    </td>
                                    <td style={{ padding: '0.65rem 0.9rem', color: 'var(--cream-primary)' }}>₦{Number(row.price || 0).toLocaleString()}</td>
                                    <td style={{ padding: '0.65rem 0.9rem', color: 'var(--cream-primary)', textTransform: 'capitalize' }}>{row.category}</td>
                                    <td style={{ padding: '0.65rem 0.9rem' }}>
                                      {row.isValid ? (
                                        <span style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '0.25rem',
                                          background: 'rgba(75, 181, 67, 0.12)',
                                          color: '#4BB543',
                                          padding: '0.15rem 0.45rem',
                                          borderRadius: '4px',
                                          fontWeight: 600,
                                          fontSize: '0.675rem'
                                        }}>
                                          <Check size={10} />
                                          Ready
                                        </span>
                                      ) : (
                                        <span style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          background: 'rgba(255, 77, 77, 0.12)',
                                          color: '#ff4d4d',
                                          padding: '0.15rem 0.45rem',
                                          borderRadius: '4px',
                                          fontWeight: 500,
                                          fontSize: '0.675rem',
                                          lineHeight: '1.2'
                                        }}>
                                          {row.errorMessage}
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })()}

                    {/* IMPORT RESULT STATUS ALERTS */}
                    {importStatus && (
                      <div
                        style={{
                          background: importStatus.success ? 'rgba(75, 181, 67, 0.15)' : 'rgba(255, 77, 77, 0.15)',
                          border: importStatus.success ? '1px solid rgba(75, 181, 67, 0.3)' : '1px solid rgba(255, 77, 77, 0.3)',
                          padding: '1rem',
                          borderRadius: '8px',
                          color: importStatus.success ? '#4BB543' : '#ff4d4d',
                          fontSize: '0.85rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                          {importStatus.success ? <Check size={18} /> : <AlertTriangle size={18} />}
                          <span>{importStatus.message}</span>
                        </div>
                        {importStatus.success && (
                          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--cream-primary)' }}>
                            <span>Created: <strong>{importStatus.created}</strong></span>
                            <span>Updated: <strong>{importStatus.updated}</strong></span>
                            <span>Skipped: <strong>{importStatus.skipped}</strong></span>
                          </div>
                        )}
                        {importStatus.errors && importStatus.errors.length > 0 && (
                          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', maxHeight: '100px', overflowY: 'auto' }}>
                            <div style={{ fontWeight: 600, marginBottom: '0.15rem' }}>Errors list:</div>
                            {importStatus.errors.map((err, idx) => (
                              <div key={idx} style={{ color: 'rgba(255, 77, 77, 0.9)' }}>
                                Row {err.row}: {err.message}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isImporting || (getParsedCsvRows()[0] && getParsedCsvRows()[0].isErrorHeader)}
                      style={{
                        opacity: (isImporting || (getParsedCsvRows()[0] && getParsedCsvRows()[0].isErrorHeader)) ? 0.6 : 1,
                        cursor: (isImporting || (getParsedCsvRows()[0] && getParsedCsvRows()[0].isErrorHeader)) ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isImporting ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          <span>Importing Products...</span>
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          <span>Submit Bulk Import</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Right: Active Products Overview */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)', marginBottom: '1.25rem' }}>
                Active Catalog ({products.length} items)
              </h3>
              <div 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1rem', 
                  maxHeight: '480px', 
                  overflowY: 'auto',
                  paddingRight: '0.5rem' 
                }}
              >
                {products.map(prod => (
                  <div 
                    key={prod._id || prod.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(18,1,4,0.4)',
                      padding: '1rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <div>
                      <h4 style={{ color: 'var(--cream-primary)', fontSize: '0.95rem', fontWeight: 600 }}>{prod.name}</h4>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-cream-muted)', marginTop: '0.2rem' }}>
                        <span>Category: <strong>{prod.category}</strong></span>
                        <span>Price: <strong style={{ color: 'var(--gold-primary)' }}>₦{prod.price.toLocaleString()}</strong></span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDeleteProduct(prod._id || prod.id)}
                      style={{
                        background: 'rgba(220, 38, 38, 0.1)',
                        border: '1px solid rgba(220, 38, 38, 0.25)',
                        color: '#ef4444',
                        padding: '0.45rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      title="Delete Product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Services Modification */}
        {activeTab === 'services' && (
          <div className="grid-cols-2 animate-fade-in" style={{ alignItems: 'start' }} id="admin-tab-services">
            {/* Left: Service Addition Form */}
            <div className="glass-panel" style={{ padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: 'var(--cream-primary)', marginBottom: '1.5rem' }}>
                Add New Styling Service
              </h3>
              <form onSubmit={handleAddService} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Service Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Lace Frontal Revamp & Style"
                    value={newSrvTitle}
                    onChange={(e) => setNewSrvTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="grid-cols-3" style={{ gap: '1rem' }} className="admin-srv-row">
                  <div className="form-group" style={{ gridColumn: 'span 1' }}>
                    <label className="form-label">Price (₦)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="e.g. 20000"
                      value={newSrvPrice}
                      onChange={(e) => setNewSrvPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 1' }}>
                    <label className="form-label">Duration</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 90 mins"
                      value={newSrvDuration}
                      onChange={(e) => setNewSrvDuration(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 1' }}>
                    <label className="form-label">Category</label>
                    <select
                      className="form-control"
                      value={newSrvCategory}
                      onChange={(e) => setNewSrvCategory(e.target.value)}
                    >
                      <option value="wigs">Wigs & Revamp</option>
                      <option value="braids">Braids & Cornrows</option>
                      <option value="extensions">Extensions</option>
                      <option value="natural">Natural Hair</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Provide details on styling duration, styling product types..."
                    value={newSrvDesc}
                    onChange={(e) => setNewSrvDesc(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  <Plus size={16} />
                  Add Styling Option
                </button>
              </form>
            </div>

            {/* Right: Active Services Overview */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)', margin: 0 }}>
                  Active Menu ({services.length} items)
                </h3>
                <button 
                  onClick={() => exportToCSV(
                    services, 
                    `catalog_services_${Date.now()}.csv`,
                    ['title', 'price', 'category', 'duration', 'description'],
                    s => [s.title, s.price, s.category, s.duration, s.desc || s.description || '']
                  )}
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', height: 'fit-content' }}
                >
                  <FileText size={12} />
                  Export CSV
                </button>
              </div>
              <div 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1rem', 
                  maxHeight: '480px', 
                  overflowY: 'auto',
                  paddingRight: '0.5rem' 
                }}
              >
                {services.map(srv => (
                  <div 
                    key={srv._id || srv.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(18,1,4,0.4)',
                      padding: '1rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <div>
                      <h4 style={{ color: 'var(--cream-primary)', fontSize: '0.95rem', fontWeight: 600 }}>{srv.title}</h4>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-cream-muted)', marginTop: '0.2rem' }}>
                        <span>Category: <strong>{srv.category}</strong></span>
                        <span>Duration: <strong>{srv.duration}</strong></span>
                        <span>Price: <strong style={{ color: 'var(--gold-primary)' }}>₦{srv.price.toLocaleString()}</strong></span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDeleteService(srv._id || srv.id)}
                      style={{
                        background: 'rgba(220, 38, 38, 0.1)',
                        border: '1px solid rgba(220, 38, 38, 0.25)',
                        color: '#ef4444',
                        padding: '0.45rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      title="Delete Service"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: User Profiles Management */}
        {activeTab === 'users' && (() => {
          const filteredUsers = users.filter(u => {
            const searchLower = userSearch.toLowerCase();
            const matchesSearch = 
              u.name.toLowerCase().includes(searchLower) ||
              u.email.toLowerCase().includes(searchLower) ||
              (u.phone && u.phone.toLowerCase().includes(searchLower));

            const matchesRole = 
              userRoleFilter === 'All' ||
              (userRoleFilter === 'Admin' && u.role === 'admin') ||
              (userRoleFilter === 'Customer' && u.role === 'customer');

            return matchesSearch && matchesRole;
          });

          return (
            <div className="admin-table-container animate-fade-in" id="admin-tab-users" style={{ marginBottom: '2.5rem' }}>
              {/* Header Toolbar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', borderBottom: '1px solid var(--border-light)', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--cream-primary)', fontFamily: 'var(--font-serif)', margin: 0 }}>Registered VIP Members</h3>
                
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {/* Search field */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(18, 1, 4, 0.4)', padding: '0.45rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-light)', minWidth: '220px' }}>
                    <Search size={15} style={{ color: 'var(--text-cream-muted)' }} />
                    <input
                      type="text"
                      placeholder="Search member name, email..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      style={{ background: 'none', border: 'none', color: '#fff', outline: 'none', fontSize: '0.8rem', width: '100%' }}
                    />
                    {userSearch && (
                      <button onClick={() => setUserSearch('')} style={{ background: 'none', border: 'none', color: 'var(--text-cream-muted)', cursor: 'pointer', padding: 0 }}>
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Role filter dropdown */}
                  <select
                    className="form-control"
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    style={{ padding: '0.45rem 1rem', width: 'auto', background: 'rgba(18, 1, 4, 0.4)', border: '1px solid var(--border-light)', color: 'var(--cream-primary)', borderRadius: '6px', fontSize: '0.8rem' }}
                  >
                    <option value="All">All Roles</option>
                    <option value="Customer">Customers</option>
                    <option value="Admin">Administrators</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead style={{ background: 'rgba(25, 3, 7, 0.95)', borderBottom: '1px solid var(--border-light)' }}>
                    <tr>
                      <th style={{ padding: '1rem', color: 'var(--gold-primary)', fontWeight: 600 }}>Client Name</th>
                      <th style={{ padding: '1rem', color: 'var(--gold-primary)', fontWeight: 600 }}>Email & Contact</th>
                      <th style={{ padding: '1rem', color: 'var(--gold-primary)', fontWeight: 600 }}>VIP Loyalty Points</th>
                      <th style={{ padding: '1rem', color: 'var(--gold-primary)', fontWeight: 600 }}>Access Level</th>
                      <th style={{ padding: '1rem', color: 'var(--gold-primary)', fontWeight: 600, textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-cream-muted)', fontStyle: 'italic' }}>
                          No registered user profiles found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        return (
                          <tr key={u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s' }}>
                            <td style={{ padding: '1rem', color: 'var(--cream-primary)', fontWeight: 500 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ background: 'var(--gold-primary)', color: '#000', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                  {u.name.substring(0, 1).toUpperCase()}
                                </div>
                                <span>{u.name}</span>
                              </div>
                            </td>
                            <td style={{ padding: '1rem', color: 'var(--text-cream-muted)' }}>
                              <div>{u.email}</div>
                              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{u.phone || 'No phone registered'}</div>
                            </td>
                            <td style={{ padding: '1rem', color: 'var(--cream-primary)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Award size={14} style={{ color: 'var(--gold-primary)' }} />
                                <span style={{ fontWeight: 'bold' }}>{u.loyaltyPoints || 0} pts</span>
                                <input
                                  type="number"
                                  placeholder="New"
                                  defaultValue={u.loyaltyPoints || 0}
                                  onBlur={(e) => {
                                    const val = Number(e.target.value);
                                    if (val !== u.loyaltyPoints) {
                                      handleUpdateUserPoints(u.id, val);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      const val = Number(e.target.value);
                                      handleUpdateUserPoints(u.id, val);
                                      e.target.blur();
                                    }
                                  }}
                                  style={{
                                    width: '60px',
                                    padding: '0.2rem 0.4rem',
                                    fontSize: '0.75rem',
                                    borderRadius: '4px',
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid var(--border-light)',
                                    color: '#fff',
                                    outline: 'none',
                                    marginLeft: '0.5rem'
                                  }}
                                  title="Change points and press Enter or click away to save"
                                />
                              </div>
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {u.role === 'admin' ? (
                                  <Shield size={13} style={{ color: 'var(--gold-primary)' }} />
                                ) : (
                                  <Users size={13} style={{ color: 'var(--text-cream-muted)' }} />
                                )}
                                <select
                                  value={u.role}
                                  onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                                  style={{
                                    background: 'rgba(18, 1, 4, 0.6)',
                                    border: '1px solid var(--border-light)',
                                    color: u.role === 'admin' ? 'var(--gold-primary)' : 'var(--cream-primary)',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    outline: 'none',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <option value="customer" style={{ background: '#120104', color: '#fff' }}>Customer</option>
                                  <option value="admin" style={{ background: '#120104', color: 'var(--gold-primary)' }}>Admin</option>
                                </select>
                              </div>
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#ef4444',
                                  cursor: 'pointer',
                                  padding: '0.25rem',
                                  transition: 'color 0.2s'
                                }}
                                title="Delete User Profile"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-srv-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
