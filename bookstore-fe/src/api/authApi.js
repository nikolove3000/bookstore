import axiosClient from './axiosClient'

const authApi = {
    register: (data) => axiosClient.post('/api/auth/register', data),

    login: (data) => axiosClient.post('/api/auth/login', data),

    logout: () => axiosClient.post('/api/auth/logout'),

    refreshToken: () => axiosClient.post('/api/auth/refresh')

} 

export default authApi