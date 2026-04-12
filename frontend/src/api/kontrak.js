import API from './axios';

export const buatKontrak = (data) => API.post('/admin/kontrak', data);
export const getAllKontrak = () => API.get('/admin/kontrak');
export const getKontrakByStatus = (status) => API.get(`/admin/kontrak/status/${status}`);
export const getKontrakById = (id) => API.get(`/kontrak/${id}`);
export const getKontrakByClient = (clientId) => API.get(`/client/kontrak/${clientId}`);