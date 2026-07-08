import axiosClient from './axiosClient'

const uploadApi = {
    uploadCover: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return axiosClient.post('/admin/upload/cover', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
}

export default uploadApi