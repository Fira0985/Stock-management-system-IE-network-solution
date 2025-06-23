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

export const addCategory = async (ProductData) => {
    return await api.post('/products', ProductData, {
        headers: getAuthHeaders(),
    });
};
