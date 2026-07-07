import axiosClient from './axiosClient';

const adminApi = {
  getOrders: (params) => axiosClient.get('/admin/orders', { params }),
  getOrderById: (id) => axiosClient.get(`/admin/orders/${id}`),
  updateStatus: (id, status) => axiosClient.patch(`/admin/orders/${id}/status`, { status }),
};

export default adminApi;