import axiosClient from './axiosClient';

const cartApi = {
  getCart: () => axiosClient.get('/cart'),
  addItem: (bookId, quantity = 1) => axiosClient.post('/cart/items', { bookId, quantity }),
  updateQuantity: (itemId, quantity) => axiosClient.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => axiosClient.delete(`/cart/items/${itemId}`),
  clear: () => axiosClient.delete('/cart'),
};

export default cartApi;