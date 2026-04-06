import API from './axios';

// FR-03: Update profil
export const updateProfil = (userId, data) =>
  API.put(`/user/update/${userId}`, data);

// FR-04: Hapus akun
export const deleteAkun = (userId) =>
  API.delete(`/user/delete/${userId}`);

// FR-06: Logout
export const logout = () =>
  API.post('/user/logout');