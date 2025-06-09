// services/authService.js
import api from './api';

export async function loginUser(credentials) {
  try {
    const response = await api.post('/login', credentials, {
        withCredentials: true, 
    }); 
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
}
