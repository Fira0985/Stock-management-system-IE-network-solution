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
        return response.data;
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
        return response.data;
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
        return response.data;
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
        return response.data;
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
        return response.data;
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
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch recent activity' };
    }
};
