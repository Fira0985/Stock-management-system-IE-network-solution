// services/api.js
import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:3000/api', for local development
  baseURL: 'https://stock-management-system-ie-network.onrender.com',

});

export default api