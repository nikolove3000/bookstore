import axiosClient from './axiosClient';

const authorApi = {
  getAll: () => axiosClient.get('/authors'),
  create: (data) => axiosClient.post('/authors', data),
};

export default authorApi;