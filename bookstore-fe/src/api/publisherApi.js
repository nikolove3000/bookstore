import axiosClient from './axiosClient';

const publisherApi = {
  getAll: () => axiosClient.get('/publishers'),
  create: (data) => axiosClient.post('/publishers', data),
};

export default publisherApi;