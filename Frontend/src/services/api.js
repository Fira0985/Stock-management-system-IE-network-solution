// services/api.js
import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:3000/api', for local development
  baseURL: import.meta.env.VITE_API_URL || 'https://stock-management-system-ie-network.onrender.com', // Use env or fallback
});

// Request interceptor: add auth token to minden headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401s by refreshing token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');

        // Call our new refresh endpoint
        const response = await axios.post(
          `${api.defaults.baseURL}/refresh`,
          { refreshToken }
        );

        const { token } = response.data;
        localStorage.setItem('token', token);

        // Update the header and retry
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, something is wrong (code expired, etc) - logout
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; // Force redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;