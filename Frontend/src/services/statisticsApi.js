// src/api/statisticsApi.js
import api from './api';

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Authentication token not found');
    }
    return { Authorization: `Bearer ${token}` };
}

/**
 * Fetch sales overview:
 * GET /sales/overview
 */
export const fetchSalesOverview = async () => {
    try {
        const response = await api.get('/sales/overview', {
            headers: getAuthHeaders()
        });
        // Support APIs that return either raw object or { success: true, data: ... }
        return response.data && response.data.data !== undefined ? response.data.data : response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch sales overview' };
    }
};

/**
 * Fetch purchase overview:
 * GET /purchase/overview
 */
export const fetchPurchaseOverview = async () => {
    try {
        const response = await api.get('/purchase/overview', {
            headers: getAuthHeaders()
        });
        return response.data && response.data.data !== undefined ? response.data.data : response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch purchase overview' };
    }
};

/**
 * Fetch weekly sales data:
 * GET /sales/chart/weekly
 */
export const fetchWeeklySalesChart = async () => {
    try {
        const response = await api.get('/sales/chart/weekly', {
            headers: getAuthHeaders()
        });
        return response.data && response.data.data !== undefined ? response.data.data : response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch weekly sales chart' };
    }
};

/**
 * Fetch sales by category for pie chart:
 * GET /sales/chart/by-category
 */
export const fetchMonthlyCategoryChart = async () => {
    try {
        const response = await api.get('/sales/chart/by-category', {
            headers: getAuthHeaders()
        });
        return response.data && response.data.data !== undefined ? response.data.data : response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch category sales chart' };
    }
};

/**
 * Fetch annual sales for line chart:
 * GET /sales/chart/annual
 */
export const fetchAnnualSalesChart = async () => {
    try {
        const response = await api.get('/sales/chart/annual', {
            headers: getAuthHeaders()
        });
        return response.data && response.data.data !== undefined ? response.data.data : response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch annual sales chart' };
    }
};

/**
 * Fetch recent activity:
 * GET /recent-activity
 */
export const fetchRecentActivity = async () => {
    try {
        const response = await api.get('/recent-activity', {
            headers: getAuthHeaders()
        });
        return response.data && response.data.data !== undefined ? response.data.data : response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch recent activity' };
    }
};

/**
 * Fetch unpaid credits total value:
 * GET /unpaid
 */
export const fetchUnpaidCreditValue = async () => {
    try {
        const response = await api.get('/unpaid', {
            headers: getAuthHeaders()
        });
        const data = response.data && response.data.data !== undefined ? response.data.data : response.data;
        const array = Array.isArray(data) ? data : [];
        const totalValue = array.reduce((sum, credit) => sum + (Number(credit.total) || 0), 0);
        return { totalValue, count: array.length };
    } catch (error) {
        console.error('fetchUnpaidCreditValue error:', error);
        return { totalValue: 0, count: 0 };
    }
};

/**
 * Fetch supplier count:
 * GET /NonUser (filters by type='SUPPLIER')
 */
export const fetchSupplierCount = async () => {
    try {
        const response = await api.get('/NonUser', {
            headers: getAuthHeaders()
        });
        const data = response.data && response.data.data !== undefined ? response.data.data : response.data;
        const array = Array.isArray(data) ? data : [];
        const supplierCount = array.filter(user => user.type === 'SUPPLIER' || user.type === 'supplier').length;
        return { count: supplierCount };
    } catch (error) {
        console.error('fetchSupplierCount error:', error);
        return { count: 0 };
    }
};

/**
 * Fetch customer count:
 * GET /NonUser (filters by type='CUSTOMER')
 */
export const fetchCustomerCount = async () => {
    try {
        const response = await api.get('/NonUser', {
            headers: getAuthHeaders()
        });
        const data = response.data && response.data.data !== undefined ? response.data.data : response.data;
        const array = Array.isArray(data) ? data : [];
        const customerCount = array.filter(user => user.type === 'CUSTOMER' || user.type === 'customer').length;
        return { count: customerCount };
    } catch (error) {
        console.error('fetchCustomerCount error:', error);
        return { count: 0 };
    }
};
