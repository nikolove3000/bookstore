import axiosClient from './axiosClient'

const authApi = {
    register: (data) => axiosClient.post('/auth/register', data),

    login: (data) => axiosClient.post('/auth/login', data),

    logout: () => axiosClient.post('/auth/logout'),

    refreshToken: () => axiosClient.post('/auth/refresh')

} 

export default authApi