import API from './axios';

export const buatInvoice = (data) => API.post('/admin/invoice', data);
export const getAllInvoice = () => API.get('/admin/invoice');
export const getInvoiceByStatus = (status) => API.get(`/admin/invoice/status/${status}`);
export const getInvoiceByClient = (clientId) => API.get(`/client/invoice/${clientId}`);
export const validasiPembayaran = (adminId, data) => API.post(`/admin/invoice/validasi/${adminId}`, data);