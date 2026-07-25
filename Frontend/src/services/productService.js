import api from './api';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return {
    Authorization: `Bearer ${token}`,
  };
}

export const addProduct = async (ProductData) => {
  try {
    const response = await api.post('/products', ProductData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Upload failed:', error.response?.data || error);
    const payload = error.response?.data || {};
    throw {
      status: error.response?.status,
      error: payload.error || payload.message || error.message || 'Failed to add product',
      details: payload.details,
    };
  }
};


// Fetch all non-archived products
export const fetchAllProducts = async () => {
  try {
    const response = await api.get('/products', {
      headers: getAuthHeaders(),
    });
    return response.data && response.data.data !== undefined ? response.data.data : response.data;
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