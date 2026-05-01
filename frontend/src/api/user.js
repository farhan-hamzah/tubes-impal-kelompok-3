import API from './axios';

export const getProfil = (id) => API.get(`/user/profile/${id}`);
export const updateProfil = (userId, data) => API.put(`/user/update/${userId}`, data);
export const deleteAkun = (userId) => API.delete(`/user/delete/${userId}`);
export const logout = () => API.post('/user/logout');