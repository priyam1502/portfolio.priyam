import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Show error toast for 4xx and 5xx errors
    if (error.response?.status >= 400) {
      const message = error.response.data?.message || 'An error occurred';
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// API service methods
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const produceAPI = {
  getAll: (params) => api.get('/produce', { params }),
  getById: (id) => api.get(`/produce/${id}`),
  create: (data) => api.post('/produce', data),
  update: (id, data) => api.put(`/produce/${id}`, data),
  delete: (id) => api.delete(`/produce/${id}`),
  getMyListings: (params) => api.get('/produce/farmer/my-listings', { params }),
};

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getBuyerOrders: (params) => api.get('/orders/buyer/my-orders', { params }),
  getFarmerOrders: (params) => api.get('/orders/farmer/my-orders', { params }),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  getById: (id) => api.get(`/orders/${id}`),
  getFarmerStats: () => api.get('/orders/farmer/stats'),
};

export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

export const demoAPI = {
  createDemoData: () => api.get('/demo-data'),
  healthCheck: () => api.get('/health'),
};

export default api;