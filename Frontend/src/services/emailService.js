// axios instance already configured with baseURL
import api from './api';

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication token not found');
    return { Authorization: `Bearer ${token}` };
}

/**
 * Send a message “to myself”.
 * @param {{ name: string, message: string }} payload
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const sendSelfMessage = async (payload) => {
    try {
        const res = await api.post('/message', payload, {
            headers: getAuthHeaders(),
        });
        return res.data;
    } catch (err) {
        console.error('Failed to send message:', err);
        throw err;
    }
};
