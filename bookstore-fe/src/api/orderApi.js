import axiosClient from './axiosClient';

const orderApi = {
  checkout: (shippingAddress) => axiosClient.post('/orders/checkout', { shippingAddress }),
  cancel: (orderId) => axiosClient.post(`/orders/${orderId}/cancel`),
  getHistory: (params) => axiosClient.get('/orders', { params }),
  getById: (orderId) => axiosClient.get(`/orders/${orderId}`),
};

export default orderApi;