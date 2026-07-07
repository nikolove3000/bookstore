import axiosClient from './axiosClient';

const authorApi = {
  getAll: () => axiosClient.get('/authors'),
};

export default authorApi;