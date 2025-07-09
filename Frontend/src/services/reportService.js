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

export const fetchSalesSummary = async () => {
  const res = await api.get('/summarySales', { headers: getAuthHeaders() });
  return res.data;
};

export const fetchInventorySummary = async () => {
  const res = await api.get('/summaryInventory', { headers: getAuthHeaders() });
  return res.data;
};

export const fetchPurchaseSummary = async () => {
  const res = await api.get('/summaryPurchases', { headers: getAuthHeaders() });
  return res.data;
};

export const fetchPaymentSummary = async () => {
  const res = await api.get('/summaryPayments', { headers: getAuthHeaders() });
  return res.data;
};

export const fetchUserActivitySummary = async () => {
  const res = await api.get('/summaryUsers', { headers: getAuthHeaders() });
  return res.data;
};

export const fetchBusinessHealthSummary = async () => {
  const res = await api.get('/summaryBusiness', { headers: getAuthHeaders() });
  return res.data;
};