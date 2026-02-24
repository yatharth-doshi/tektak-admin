import axios from 'axios';

// Create axios instance for authenticated requests
const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACK_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for unauthenticated requests (like login)
const unauthenticatedApi = axios.create({
  baseURL: `${process.env.REACT_APP_BACK_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Debug: Log that token is being sent
      console.log('🔐 Sending Bearer token for:', config.method?.toUpperCase(), config.url);
    } else {
      // Debug: Log that no token is available
      console.warn('⚠️ No auth token available for:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to get auth token
const getAuthToken = () => {
  const cookies = document.cookie.split('; ');
  const tokenCookie = cookies.find(row => row.startsWith('teqtak-admin-token='));
  return tokenCookie ? tokenCookie.split('=')[1] : null;
};

// Helper function to clear auth token
const clearAuthToken = () => {
  document.cookie = 'teqtak-admin-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

// Helper function to set auth token
export const setAuthToken = (token) => {
  document.cookie = `teqtak-admin-token=${token}; path=/; max-age=86400`; // 24 hours
};

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      clearAuthToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  // Admin/Sub-admin login (uses unauthenticated API)
  login: async (credentials) => {
    const response = await unauthenticatedApi.post('/users/login', credentials);
    return response.data;
  },

  // Get admin profile (uses authenticated API)
  getProfile: async () => {
    const response = await api.get('/admin/profile');
    return response.data;
  },

  // Update admin profile (uses authenticated API)
  updateProfile: async (profileData) => {
    const response = await api.post('/admin/profile/update', profileData);
    return response.data;
  },
};

export default api;
