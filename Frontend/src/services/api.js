// services/api.js
import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:3000/api', for local development
  baseURL: 'https://file-for-render-1.onrender.com',

});

export default api