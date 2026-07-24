import api from './api';

export const exportCustomers = async () => {
    const response = await api.get('/export/customers', {
        responseType: 'blob',
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
};
