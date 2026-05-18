import BaseService from './BaseService';

class PaketService extends BaseService {
    constructor() { super(''); }

    // Public / Client
    async getAllPaket()          { return this.get('/paket'); }

    // Admin only
    async createPaket(data)      { return this.post('/admin/paket', data); }
    async updatePaket(id, data)  { return this.put(`/admin/paket/${id}`, data); }
    async deletePaket(id)        { return this.delete(`/admin/paket/${id}`); }
}

export default new PaketService();
