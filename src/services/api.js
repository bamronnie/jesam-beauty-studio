const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = {
  // Helper to fetch options with authorization token
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

  // Base request handler
  async request(endpoint, method = 'GET', body = null) {
    const url = `${BASE_URL}${endpoint}`;
    const options = this.getOptions(method, body);

    try {
      const response = await fetch(url, options);
      
      // Handle token expiration/unauthorized
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('jesam_token');
        localStorage.removeItem('jesam_current_user');
        // Optional HMR-friendly alert if not login endpoint
        if (!endpoint.includes('/login') && !endpoint.includes('/register')) {
          console.warn('Authentication token expired or missing. Please log in.');
        }
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      return data;
    } catch (error) {
      console.error(`API Error on ${method} ${endpoint}:`, error);
      throw error;
    }
  },

  // Authentication
  async login(email, password) {
    const data = await this.request('/auth/login', 'POST', { email, password });
    localStorage.setItem('jesam_token', data.token);
    localStorage.setItem('jesam_current_user', JSON.stringify(data.user));
    return data;
  },

  async register(name, email, password, phone) {
    const data = await this.request('/auth/register', 'POST', { name, email, password, phone });
    localStorage.setItem('jesam_token', data.token);
    localStorage.setItem('jesam_current_user', JSON.stringify(data.user));
    return data;
  },
  
  async googleLogin(googleToken) {
    const data = await this.request('/auth/google', 'POST', { token: googleToken });
    localStorage.setItem('jesam_token', data.token);
    localStorage.setItem('jesam_current_user', JSON.stringify(data.user));
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
