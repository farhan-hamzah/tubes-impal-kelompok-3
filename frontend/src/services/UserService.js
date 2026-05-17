import BaseService from './BaseService';

class UserService extends BaseService {
    constructor() { super(''); }

    // Admin — client management
    async getAllClients()              { return this.get('/admin/clients'); }
<<<<<<< HEAD
    async getClientById(id)           { return this.get(`/admin/clients/${id}`); }

    // User profile
    async getProfile(userId)          { return this.get(`/user/profile/${userId}`); }
    async updateProfile(userId, data) { return this.put(`/user/update/${userId}`, data); }
    async deleteAccount(userId)       { return this.delete(`/user/delete/${userId}`); }
}

export default new UserService();
=======

    // User profile (FR-03)
    async getProfile(userId)          { return this.get(`/user/profile/${userId}`); }
    async updateProfile(userId, data) { return this.put(`/user/update/${userId}`, data); }

    // FR-04: Hapus akun
    async deleteAccount(userId)       { return this.delete(`/user/delete/${userId}`); }

    // FR-06: Logout — invalidate token di server
    async logout(token)               {
        return this.post('/user/logout', {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
}

export default new UserService();
>>>>>>> farhan
