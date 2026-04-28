import API from './axios';

export const getSnapToken = (invoiceId) =>
  API.post('/payment/snap-token', { invoiceId });