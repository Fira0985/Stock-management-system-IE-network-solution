
import api from './api';
import axios from 'axios';

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

export const uploadProfileImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);  // Changed to 'image'

    try {
        const response = await axios.post(
          'http://localhost:3000/api/upload-profile',
          formData,
          {
             headers: getAuthHeaders(),
          }
        );

        // const response = await api.post('/upload-profile', formData, {
        //     headers: {
        //         ...getAuthHeaders(),
        //     }
        // });


        return response.data;
    } catch (error) {
        console.error('Upload failed:', error);
        throw error.response?.data || { message: 'Image upload failed' };
    }
};

export const verifyUser = async (data) => {
    return await api.post('/verify-user', data,);
};

export const verifyCode = async (data) => {
    return await api.post('/verify-code', data,);
};

export const changePassword = async (data) => {
    return await api.post('/change-password', data,);
};

export const getImage = async (data) => {
    return await api.post('/getImage', data, {
        headers: getAuthHeaders(),
    });
};




