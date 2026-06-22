import axiosClient from './axiosClient';

const bookApi = {
  getAll: (params) => axiosClient.get('/books', { params }),
  getById: (id) => axiosClient.get(`/books/${id}`),
  getRelated: (id, limit = 4) => axiosClient.get(`/books/${id}/related`, { params: { limit } }),
  getReviews: (id, params) => axiosClient.get(`/books/${id}/reviews`, { params }),
  search: (q, params) => axiosClient.get('/books/search', { params: { q, ...params } }),
  getByCategory: (categoryId, params) => axiosClient.get(`/books/category/${categoryId}`, { params }),
  getByAuthor: (authorId, params) => axiosClient.get(`/books/author/${authorId}`, { params }),
  getNewArrivals: (limit = 6) => axiosClient.get('/books/new-arrivals', { params: { limit } }),
  getFeatured: (limit = 3) => axiosClient.get('/books/featured', { params: { limit } }),
};

export default bookApi;