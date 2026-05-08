import BaseService from './BaseService';

class KontrakService extends BaseService {
    constructor() { super(''); }

    // Client
    async getKontrakByClient(clientId) { return this.get(`/client/kontrak/${clientId}`); }
    async createKontrakClient(data)    { return this.post('/client/kontrak', data); }

    // Admin
    async getAllKontrak()              { return this.get('/admin/kontrak'); }
    async getKontrakByStatus(status)   { return this.get(`/admin/kontrak/status/${status}`); }
    async createKontrakAdmin(data)     { return this.post('/admin/kontrak', data); }
    async getKontrakById(id)           { return this.get(`/kontrak/${id}`); }
}

export default new KontrakService();
