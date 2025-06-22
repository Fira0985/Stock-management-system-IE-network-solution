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

export const fetchCategory = async () =>{
    return await api.get('/categories', {
        headers: getAuthHeaders(),
    });
}

export const fetchCategoryById = async (id) => {
  try {
    const response = await api.post('/getCategoryById', { id }, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user' };
  }
};

export const addCategory = async (CategoryData) => {
    return await api.post('/categories', CategoryData, {
        headers: getAuthHeaders(),
    });
};

export const editCategory = async ( data) => {
    return await api.post('/editCategories', data, {
        headers: getAuthHeaders(),
    });
};

export const deleteCategory = async (id, deleted_by_id) => {
    return await api.delete('/deleteCategory', {
        headers: getAuthHeaders(),
        data: { id, deleted_by_id },  
    });
};