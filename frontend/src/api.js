import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Expense APIs
export const expenseAPI = {
  create: (data) => api.post('/expense/create', data),
  getMy: () => api.get('/expense/my'),
  getPending: () => api.get('/expense/pending'),
  getAll: () => api.get('/expense/all'),
  getById: (id) => api.get(`/expense/${id}`),
  approve: (id, comment) => api.put(`/expense/${id}/approve`, { comment }),
  reject: (id, comment) => api.put(`/expense/${id}/reject`, { comment }),
  simulateOCR: () => api.post('/expense/ocr'),
  convertCurrency: (amount, fromCurrency, toCurrency) => 
    api.post('/expense/convert', { amount, fromCurrency, toCurrency }),
  getStats: () => api.get('/expense/stats/summary'),
};

// User APIs
export const userAPI = {
  getAll: () => api.get('/user/all'),
  getEmployees: () => api.get('/user/employees'),
  getManagers: () => api.get('/user/managers'),
  create: (data) => api.post('/user/create', data),
  update: (id, data) => api.put(`/user/${id}`, data),
  delete: (id) => api.delete(`/user/${id}`),
  getById: (id) => api.get(`/user/${id}`),
};

// Rules APIs
export const rulesAPI = {
  get: () => api.get('/rules'),
  update: (data) => api.put('/rules', data),
  addApprover: (data) => api.post('/rules/approver', data),
  removeApprover: (userId) => api.delete(`/rules/approver/${userId}`),
};

export default api;
