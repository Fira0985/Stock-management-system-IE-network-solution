import api from './api';

export const addProduct = async (ProductData) => {
  try {
    const response = await api.post('/products', ProductData);
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