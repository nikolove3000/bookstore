import axiosClient from './axiosClient';

export const wishlistApi = {
  getAll: (params) => axiosClient.get('/wishlist', { params }),
  add: (bookId) => axiosClient.post(`/wishlist/${bookId}`),
  remove: (bookId) => axiosClient.delete(`/wishlist/${bookId}`),
  check: (bookId) => axiosClient.get(`/wishlist/${bookId}/check`),
};

export const profileApi = {
  getMe: () => axiosClient.get('/users/me'),
  updateMe: (data) => axiosClient.put('/users/me', data),
  changePassword: (data) => axiosClient.put('/users/me/password', data),
};