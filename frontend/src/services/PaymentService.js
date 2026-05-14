import BaseService from './BaseService';

/**
 * PaymentService — handles Midtrans Snap payment token requests.
 */
class PaymentService extends BaseService {
    constructor() {
        super('/payment');
    }

    async getSnapToken(invoiceId) {
        return this.post(`/snap-token/${invoiceId}`);
    }
}

export const paymentService = new PaymentService();
