import axios from 'axios';
import { getToken } from './tokenManager';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true, 
});

axiosClient.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}   , error => {
    return Promise.reject(error);
});

export default axiosClient;