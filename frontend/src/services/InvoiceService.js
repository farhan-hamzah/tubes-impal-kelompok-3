import BaseService from './BaseService';

class InvoiceService extends BaseService {
    constructor() { super(''); }

    // Admin
    async getAllInvoice()                          { return this.get('/admin/invoice'); }
    async getInvoiceByStatus(status)               { return this.get(`/admin/invoice/status/${status}`); }
    async createInvoice(data)                      { return this.post('/admin/invoice', data); }
    async validasiPembayaran(adminId, data)        { return this.post(`/admin/invoice/validasi/${adminId}`, data); }

    // Client
    async getInvoiceByClient(clientId)             { return this.get(`/client/invoice/${clientId}`); }
    async uploadBukti(invoiceId, buktiBase64)       {
        return this.post(`/client/invoice/upload-bukti/${invoiceId}`, { buktiPembayaran: buktiBase64 });
    }
}

class PaymentService extends BaseService {
    constructor() { super('/payment'); }
    async getSnapToken(invoiceId)   { return this.post(`/snap-token/${invoiceId}`); }
}

export const invoiceService = new InvoiceService();
export const paymentService = new PaymentService();
