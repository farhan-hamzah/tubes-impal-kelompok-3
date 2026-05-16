import BaseService from './BaseService';

/**
 * PaymentService — handles Midtrans Snap payment token requests.
 * Digunakan di RiwayatTransaksi.jsx untuk jalur pembayaran otomatis.
 */
class PaymentService extends BaseService {
    constructor() {
        super('/payment');
    }

    // Request Snap token dari backend, lalu popup Midtrans dibuka di frontend
    async getSnapToken(invoiceId) {
        return this.post(`/snap-token/${invoiceId}`);
    }
}

// Named export agar konsisten dengan import: { paymentService }
export const paymentService = new PaymentService();