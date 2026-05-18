import BaseService from './BaseService';

class InvoiceService extends BaseService {
    constructor() { super(''); }

    // Admin
    async getAllInvoice()                           { return this.get('/admin/invoice'); }
    async getInvoiceByStatus(status)                { return this.get(`/admin/invoice/status/${status}`); }
    async createInvoice(data)                       { return this.post('/admin/invoice', data); }
    async validasiPembayaran(adminId, data)         { return this.post(`/admin/invoice/validasi/${adminId}`, data); }

    // Client
    async getInvoiceByClient(clientId)              { return this.get(`/client/invoice/${clientId}`); }

    // FIX: nama method disesuaikan dengan pemanggilan di RiwayatTransaksi.jsx
    async uploadBuktiPembayaran(invoiceId, buktiBase64) {
        return this.post(`/client/invoice/upload-bukti/${invoiceId}`, { buktiPembayaran: buktiBase64 });
    }
}

export const invoiceService = new InvoiceService();
