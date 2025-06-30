import api from './api'; // axios instance with baseURL

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Authentication token not found');
    }
    return {
        Authorization: `Bearer ${token}`
    };
}

// Fetch all sales (POST request with auth header)
export const fetchAllSales = async ({ startDate, endDate, page = 1, pageSize = 10 } = {}) => {
    try {
        // Build query parameters string
        const params = new URLSearchParams();

        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        params.append('page', page);
        params.append('pageSize', pageSize);

        // Make GET request with query params
        const response = await api.get(`/getAllSales?${params.toString()}`, {
            headers: getAuthHeaders(),
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch sales:', error);
        throw error;
    }
};

// Add a new sale
export const addSale = async (data) => {
    try {
        const response = await api.post('/sale', data, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Failed to add sale:', error);
        throw error;
    }
};
