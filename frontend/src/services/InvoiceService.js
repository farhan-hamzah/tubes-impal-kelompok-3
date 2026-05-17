import BaseService from './BaseService';

class InvoiceService extends BaseService {
    constructor() { super(''); }

    // Admin
<<<<<<< HEAD
    async getAllInvoice()                          { return this.get('/admin/invoice'); }
    async getInvoiceByStatus(status)               { return this.get(`/admin/invoice/status/${status}`); }
    async createInvoice(data)                      { return this.post('/admin/invoice', data); }
    async validasiPembayaran(adminId, data)        { return this.post(`/admin/invoice/validasi/${adminId}`, data); }

    // Client
    async getInvoiceByClient(clientId)             { return this.get(`/client/invoice/${clientId}`); }
    async uploadBukti(invoiceId, buktiBase64)       {
=======
    async getAllInvoice()                           { return this.get('/admin/invoice'); }
    async getInvoiceByStatus(status)                { return this.get(`/admin/invoice/status/${status}`); }
    async createInvoice(data)                       { return this.post('/admin/invoice', data); }
    async validasiPembayaran(adminId, data)         { return this.post(`/admin/invoice/validasi/${adminId}`, data); }

    // Client
    async getInvoiceByClient(clientId)              { return this.get(`/client/invoice/${clientId}`); }

    // FIX: nama method disesuaikan dengan pemanggilan di RiwayatTransaksi.jsx
    async uploadBuktiPembayaran(invoiceId, buktiBase64) {
>>>>>>> farhan
        return this.post(`/client/invoice/upload-bukti/${invoiceId}`, { buktiPembayaran: buktiBase64 });
    }
}

<<<<<<< HEAD
export const invoiceService = new InvoiceService();
=======
export const invoiceService = new InvoiceService();
>>>>>>> farhan
