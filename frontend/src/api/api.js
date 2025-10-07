// frontend/src/api/api.js
import axios from 'axios';

// Use the VITE_API_URL defined in .env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Crucial for sending/receiving HTTP-only cookies (Refresh Token)
});

// Request interceptor to attach Access Token to all protected requests
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;