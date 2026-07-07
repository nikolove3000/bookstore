import axiosClient from './axiosClient';

const publisherApi = {
  getAll: () => axiosClient.get('/publishers'),
};

export default publisherApi;