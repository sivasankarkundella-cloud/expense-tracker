import axios from 'axios';

// In production, fallback automatically to the deployed Render backend if no custom VITE_API_URL is provided
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://expense-tracker-izat.onrender.com/api';
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor for consistent error extraction
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong with the network request.';
    return Promise.reject(new Error(message));
  }
);

// Expense API Services
export const expenseApi = {
  getAll: (params = {}) => api.get('/expenses', { params }),
  getById: (id) => api.get(`/expenses/${id}`),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
};

// Income API Services
export const incomeApi = {
  getAll: (params = {}) => api.get('/income', { params }),
  getById: (id) => api.get(`/income/${id}`),
  create: (data) => api.post('/income', data),
  update: (id, data) => api.put(`/income/${id}`, data),
  delete: (id) => api.delete(`/income/${id}`),
};

// Dashboard API Services
export const dashboardApi = {
  getSummary: () => api.get('/dashboard/summary'),
};

// Seed / Demo Data API Services
export const seedApi = {
  seed: () => api.post('/seed'),
};

// Lab & Syllabus Demonstration APIs (Topics 4.a-4.e & 5.a-5.c)
export const labApi = {
  getHelloWorld: () => api.get('/lab/hello-world'),
  getHelloWorldHtmlUrl: () => `${API_BASE_URL}/lab/hello-world-browser`,
  getRoutesCatalog: () => api.get('/lab/routes-catalog'),
  getWebsiteRoute: (route) => api.get(`/lab/website/${route}`),
  getBrowserConsoleUrl: () => `${API_BASE_URL}/lab/browser-console`,
  getCrudItems: () => api.get('/lab/crud/items'),
  createCrudItem: (data) => api.post('/lab/crud/items', data),
  updateCrudItem: (id, data) => api.put(`/lab/crud/items/${id}`, data),
  deleteCrudItem: (id) => api.delete(`/lab/crud/items/${id}`),
  testMySQL: () => api.get('/lab/mysql/connection-test'),
  getMySQLSubqueries: () => api.get('/lab/mysql/subqueries-demo'),
};

// Real-World SQL Query Engine & MySQL Schema Sync API
export const sqlApi = {
  getSubqueries: () => api.get('/sql/subqueries'),
  executeQuery: (query) => api.post('/sql/execute', { query }),
  getStats: () => api.get('/sql/stats'),
  getExportDumpUrl: () => `${API_BASE_URL}/sql/export-dump`,
};

// Real-World Multi-Route Website & Developer Audit Logger API
export const websiteApi = {
  getAbout: () => api.get('/website/about'),
  getServices: () => api.get('/website/services'),
  getContact: () => api.get('/website/contact'),
  submitContact: (data) => api.post('/website/contact', data),
  getAuditLogs: () => api.get('/website/logs'),
  clearAuditLogs: () => api.delete('/website/logs'),
};

export default api;
