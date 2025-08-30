import axios from "axios";
import {env} from "@/lib/config/env";

export const BASE_URL = env.API_BASE_URL;

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    return config;
});


// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }

);

// Response interceptor for error handling
api.interceptors.request.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            window.location.href = "/auth/login";
        }
        return Promise.reject(error);
    }
);

export default api;