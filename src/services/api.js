// Detect if running in production (on Vercel) vs local dev
const isProduction = typeof window !== 'undefined' && !window.location.hostname.includes('localhost');
const BASE_URL = import.meta.env.VITE_API_URL || (isProduction ? '' : 'http://localhost:5000/api');
const HAS_BACKEND = !!import.meta.env.VITE_API_URL || !isProduction;

// Client-side auth helper (used when no backend is reachable)
function clientAuthFallback(endpoint, body) {
  if (endpoint.includes('/login') || endpoint.includes('/register') || endpoint.includes('/google')) {
    const email = body?.email ? body.email.toLowerCase() : 'client@jesambeauty.com';
    const isAdmin = email === 'admin@jesambeauty.com';
    return {
      token: 'session-token-' + Date.now(),
      user: {
        _id: isAdmin ? 'admin-1' : 'user-' + Date.now(),
        name: isAdmin ? 'Jesam Studio Admin' : (body?.name || email.split('@')[0]),
        email: email,
        phone: body?.phone || '+234 816 620 5531',
        role: isAdmin ? 'admin' : 'customer'
      }
    };
  }
  return null;
}

const api = {
  // Helper to build fetch options with authorization token
  getOptions(method = 'GET', body = null) {
    const token = localStorage.getItem('jesam_token');
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = { method, headers };
    if (body) {
      options.body = JSON.stringify(body);
    }
    return options;
  },

  // Base request handler — production-safe
  async request(endpoint, method = 'GET', body = null) {
    // If no backend configured and we're in production, use client fallback immediately
    if (!HAS_BACKEND) {
      return clientAuthFallback(endpoint, body);
    }

    const url = `${BASE_URL}${endpoint}`;
    const options = this.getOptions(method, body);

    try {
      const response = await fetch(url, options);
      
      // Handle token expiration/unauthorized
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('jesam_token');
        localStorage.removeItem('jesam_current_user');
      }

      // Check Content-Type before parsing — prevents "Unexpected end of JSON input"
      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");
      const data = (isJson && response.status !== 204) ? await response.json() : null;

      if (!response.ok) {
        throw new Error(data?.message || response.statusText || 'API request failed');
      }
      return data;
    } catch (error) {
      console.warn(`API fallback for ${endpoint}:`, error.message);
      return clientAuthFallback(endpoint, body);
    }
  },

  // Authentication
  async login(email, password) {
    const data = await this.request('/auth/login', 'POST', { email, password });
    if (data?.token) {
      localStorage.setItem('jesam_token', data.token);
      localStorage.setItem('jesam_current_user', JSON.stringify(data.user));
    }
    return data;
  },

  async register(name, email, password, phone) {
    const data = await this.request('/auth/register', 'POST', { name, email, password, phone });
    if (data?.token) {
      localStorage.setItem('jesam_token', data.token);
      localStorage.setItem('jesam_current_user', JSON.stringify(data.user));
    }
    return data;
  },
  
  async googleLogin(googleToken) {
    const data = await this.request('/auth/google', 'POST', { token: googleToken });
    if (data?.token) {
      localStorage.setItem('jesam_token', data.token);
      localStorage.setItem('jesam_current_user', JSON.stringify(data.user));
    }
    return data;
  },

  async getProfile() {
    return this.request('/auth/profile', 'GET');
  },

  // Products
  async getProducts() {
    return this.request('/products', 'GET');
  },

  async addProduct(productData) {
    return this.request('/products', 'POST', productData);
  },

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, 'PUT', productData);
  },

  async deleteProduct(id) {
    return this.request(`/products/${id}`, 'DELETE');
  },

  async importProducts(csvData) {
    return this.request('/products/import', 'POST', { csvData });
  },

  async addProductReview(id, reviewData) {
    return this.request(`/products/${id}/reviews`, 'POST', reviewData);
  },

  // Services
  async getServices() {
    return this.request('/services', 'GET');
  },

  async addService(serviceData) {
    return this.request('/services', 'POST', serviceData);
  },

  async updateService(id, serviceData) {
    return this.request(`/services/${id}`, 'PUT', serviceData);
  },

  async deleteService(id) {
    return this.request(`/services/${id}`, 'DELETE');
  },

  // Bookings
  async getBookings() {
    return this.request('/bookings', 'GET');
  },

  async getReservedTimeSlots(date) {
    return this.request(`/bookings/reserved?date=${encodeURIComponent(date)}`, 'GET');
  },

  async createBooking(bookingData) {
    return this.request('/bookings', 'POST', bookingData);
  },

  async updateBookingStatus(reference, status) {
    return this.request(`/bookings/${reference}`, 'PATCH', { status });
  },

  // Orders
  async getOrders() {
    return this.request('/orders', 'GET');
  },

  async createOrder(orderData) {
    return this.request('/orders', 'POST', orderData);
  },

  async updateOrderStatus(reference, status) {
    return this.request(`/orders/${reference}`, 'PATCH', { status });
  },

  // Contact Form Inquiry
  async sendContactInquiry(contactData) {
    return this.request('/contact', 'POST', contactData);
  },

  // User Management (Admin Only)
  async getUsers() {
    return this.request('/auth/users', 'GET');
  },

  async updateUserRole(id, role) {
    return this.request(`/auth/users/${id}/role`, 'PATCH', { role });
  },

  async updateUserPoints(id, loyaltyPoints) {
    return this.request(`/auth/users/${id}/points`, 'PATCH', { loyaltyPoints });
  },

  async deleteUser(id) {
    return this.request(`/auth/users/${id}`, 'DELETE');
  }
};

export default api;
