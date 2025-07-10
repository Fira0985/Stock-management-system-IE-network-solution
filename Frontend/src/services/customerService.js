export const exportCustomers = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/export/customers', {
        headers: { Authorization: `Bearer ${token}` }
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
