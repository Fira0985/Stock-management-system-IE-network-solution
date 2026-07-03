// services/authService.js
import api from './api';

export async function loginUser(credentials) {
  try {
    const response = await api.post('/login', credentials);

    const { token, user } = response.data;

    if (token) {
      localStorage.setItem('token', token);
    }

    if (user) {
      localStorage.setItem('username', user.username || user.name);
      localStorage.setItem('role', user.role);
      localStorage.setItem('id', user.id);
      localStorage.setItem('userInfo', JSON.stringify(user));
    }

    return { token, user };
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
}

export async function verifyUser(data) {
  try {
    const response = await api.post('/verify-user', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
}
