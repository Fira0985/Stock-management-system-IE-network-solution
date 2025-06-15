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

// Fetch all users
export const fetchUsers = async () => {
    return await api.get('/users', {
        headers: getAuthHeaders(),
    });
};

// Add a new user
export const addUser = async (userData) => {
    return await api.post('/users', userData, {
        headers: getAuthHeaders(),
    });
};

// Edit user (email used to identify; only role and phone can be changed)
export const editUser = async (data) => {
    return await api.put('/editUser', data, {
        headers: getAuthHeaders(),
    });
};

// Delete (soft delete) user
export const deleteUser = async (email, deleted_by_id) => {
    return await api.delete('/deleteUser', {
        headers: getAuthHeaders(),
        data: { email, deleted_by_id },  // Pass data correctly in DELETE request body
    });
};
