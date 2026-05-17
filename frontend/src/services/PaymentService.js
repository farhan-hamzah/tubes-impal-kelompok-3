import BaseService from './BaseService';

/**
 * PaymentService — handles Midtrans Snap payment token requests.
<<<<<<< HEAD
=======
 * Digunakan di RiwayatTransaksi.jsx untuk jalur pembayaran otomatis.
>>>>>>> farhan
 */
class PaymentService extends BaseService {
    constructor() {
        super('/payment');
    }

<<<<<<< HEAD
=======
    // Request Snap token dari backend, lalu popup Midtrans dibuka di frontend
>>>>>>> farhan
    async getSnapToken(invoiceId) {
        return this.post(`/snap-token/${invoiceId}`);
    }
}

<<<<<<< HEAD
export const paymentService = new PaymentService();
=======
// Named export agar konsisten dengan import: { paymentService }
export const paymentService = new PaymentService();
>>>>>>> farhan
