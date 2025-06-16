import api from './api';

function getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('Authentication token not found');
    }
    return {
        Authorization: `Bearer ${token}`
    };
}

export const fetchCustomers = async () => {
    const response = await api.get('/NonUser', {
        headers: getAuthHeaders(),
    });
    return response.data.filter(non => non.type === "CUSTOMER");
};

export const addCustomer = async (data) => {
    const response = await api.post('/NonUser', data, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const editCustomer = async (id, data) => {
    const response = await api.put(`/editNonUser/${id}`, data, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const deleteCustomer = async (id) => {
    const response = await api.delete('/deleteNonUser', {
        headers: getAuthHeaders(),
        data: { id }, // 🟢 id must be inside 'data' for DELETE body
    });
    return response.data;
};
