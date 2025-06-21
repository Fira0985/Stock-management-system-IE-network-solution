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

export const fetchNonUser = async ( type ) => {
    const response = await api.get('/NonUser', {
        headers: getAuthHeaders(),
    });
    return response.data.filter(non => non.type === type);
};

export const addNonUser = async (data) => {
    const response = await api.post('/NonUser', data, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const editNonUser = async (id, data) => {
    const response = await api.put(`/editNonUser/${id}`, data, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const deleteNonUser = async (id) => {
    const response = await api.delete('/deleteNonUser', {
        headers: getAuthHeaders(),
        data: { id }, // 🟢 id must be inside 'data' for DELETE body
    });
    return response.data;
};
