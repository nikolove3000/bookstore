import axiosClient from './axiosClient';

const reviewApi = {
  checkEligibility: (bookId) => axiosClient.get(`/books/${bookId}/review-eligibility`),
  create: (bookId, rating, comment) => axiosClient.post(`/books/${bookId}/reviews`, { rating, comment }),
  update: (reviewId, rating, comment) => axiosClient.put(`/reviews/${reviewId}`, { rating, comment }),
  remove: (reviewId) => axiosClient.delete(`/reviews/${reviewId}`),
};

export default reviewApi;