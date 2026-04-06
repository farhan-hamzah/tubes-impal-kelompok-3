import API from './axios';

// FR-05: Lihat daftar client
export const getAllClients = () => API.get('/admin/clients');
export const getClientDetail = (clientId) =>
  API.get(`/admin/clients/${clientId}`);