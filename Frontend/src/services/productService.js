import axios from 'axios';

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
