import axios from 'axios';
import api from './api';
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return {
    Authorization: `Bearer ${token}`
  };
}

export const addProduct = async (ProductData) => {
  try {
    const response = await axios.post(
      'http://localhost:3000/api/products',
      ProductData,

      {
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error.response?.data || { message: 'failed' };
  }
};


// Fetch all non-archived products
export const fetchAllProducts = async () => {
  try {
    const response = await api.get('/products', {
      headers: getAuthHeaders(),
    });
    return response.data; 
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error.response?.data || { message: 'Unable to fetch products' };
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await api.post(
      '/getProductById',
      { id }, // send as body
      { headers: getAuthHeaders() } 
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error.response?.data || { message: 'Unable to fetch product' };
  }
};