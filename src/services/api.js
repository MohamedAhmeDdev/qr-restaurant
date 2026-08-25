import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor: Attach current token and active workspace slug
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

  if (!('X-Restaurant-Slug' in config.headers)) {
      const activeSlug = localStorage.getItem('active_restaurant_slug');
      if (activeSlug) {
        config.headers['X-Restaurant-Slug'] = activeSlug;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Global 401 handler — auto-clear invalid sessions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('active_restaurant_slug'); // Clear workspace on logout
      delete api.defaults.headers.common['Authorization'];
    }
    return Promise.reject(error);
  }
);

export default api;