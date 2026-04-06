import API from './axios';

// FR-07: Lihat katalog
export const getAllPaket = () => API.get('/paket');
export const getPaketById = (paketId) => API.get(`/paket/${paketId}`);

// FR-08: Kelola paket (admin)
export const createPaket = (data) => API.post('/admin/paket', data);
export const updatePaket = (paketId, data) =>
  API.put(`/admin/paket/${paketId}`, data);
export const deletePaket = (paketId) =>
  API.delete(`/admin/paket/${paketId}`);