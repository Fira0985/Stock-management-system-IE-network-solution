// services/uploadService.js
import api from './api';

export const uploadExcelFile = async (file) => {
  const formData = new FormData();
  formData.append('excelFile', file); 

  return await api.post('/upload-excel', formData);
};
