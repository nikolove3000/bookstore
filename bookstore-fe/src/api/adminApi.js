import axiosClient from './axiosClient';

const adminApi = {
  getOrders: (params) => axiosClient.get('/admin/orders', { params }),
  getOrderById: (id) => axiosClient.get(`/admin/orders/${id}`),
  updateStatus: (id, status) => axiosClient.patch(`/admin/orders/${id}/status`, { status }),

  getUsers: (params) => axiosClient.get('/admin/users', { params }),
  updateUserRole: (id, role) => axiosClient.patch(`/admin/users/${id}/role`, { role }),
};

export default adminApi;