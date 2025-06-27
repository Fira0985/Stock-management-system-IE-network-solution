// services/authService.js
import api from './api';

export async function loginUser(credentials) {
  try {
    const response = await api.post('/login', credentials, {
      withCredentials: true, 
    });

    const { token, user } = response.data;

    if (token) {
      localStorage.setItem('authToken', token);
    }

    // Optionally store the user data if needed later
    if (user) {
      localStorage.setItem('userInfo', JSON.stringify(user)); // Optional
    }

    return { token, user }; // return both token and full user
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
}
