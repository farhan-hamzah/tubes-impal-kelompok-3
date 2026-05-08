import BaseService from './BaseService';

class UserService extends BaseService {
    constructor() { super(''); }

    // Admin — client management
    async getAllClients()              { return this.get('/admin/clients'); }
    async getClientById(id)           { return this.get(`/admin/clients/${id}`); }

    // User profile
    async getProfile(userId)          { return this.get(`/user/profile/${userId}`); }
    async updateProfile(userId, data) { return this.put(`/user/update/${userId}`, data); }
    async deleteAccount(userId)       { return this.delete(`/user/delete/${userId}`); }
}

export default new UserService();
