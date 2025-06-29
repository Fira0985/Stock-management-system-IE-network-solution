import api from './api';

// Utility: Get Authorization Header
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return {
    Authorization: `Bearer ${token}`
  };
}

// Fetch all purchases
export const fetchAllPurchases = async () => {
  try {
    const response = await api.post('/getAllPurchase', {}, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch purchases:', error);
    throw error;
  }
};

// Add a new purchase
export const createPurchase = async (purchaseData) => {
  try {
    const response = await api.post('/purchase', purchaseData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create purchase:', error);
    throw error;
  }
};
