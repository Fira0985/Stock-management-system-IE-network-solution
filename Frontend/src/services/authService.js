// services/authService.js
import api from './api';

export async function loginUser(credentials) {
  try {
    const response = await api.post('/login', credentials, {
      withCredentials: true, // This is usually for cookies, but your token is in response body
    });

    // Extract token from response
    const { token } = response.data;

    if (token) {
      // Store token in localStorage (or sessionStorage if preferred)
      localStorage.setItem('authToken', token);
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
}
