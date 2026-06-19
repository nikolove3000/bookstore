import axiosClient from './axiosClient';

const categoryApi = {
  getAll: () => axiosClient.get('/categories'),
  getById: (id) => axiosClient.get(`/categories/${id}`),
};

export default categoryApi;